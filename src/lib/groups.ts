import {
  addDoc,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  type DocumentData,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { localBackend } from './localBackend'
import { findDuplicateNames } from './users'
import { FANTASTIC6_IDS, FANTASTIC6_KIND } from './fantastic6'

export interface Group {
  id: string
  name: string
  inviteCode: string
  /** Signed-in accounts with access to the group */
  memberIds: string[]
  kind?: typeof FANTASTIC6_KIND
  /** Fantastic 6 only: which crew character each member account picked */
  crew?: Record<string, string>
  createdAt: number
}

export function isFantastic6Group(group: Pick<Group, 'kind'> | null | undefined) {
  return group?.kind === FANTASTIC6_KIND
}

/**
 * Who expenses can be paid by / split between. In Fantastic 6 that's the crew characters of the
 * people who created or joined the group (3 friends = a group of 3); otherwise the members.
 */
export function groupParticipants(group: Group) {
  if (!isFantastic6Group(group)) return group.memberIds
  const picked = new Set(Object.values(group.crew ?? {}))
  return FANTASTIC6_IDS.filter((id) => picked.has(id))
}

/** Every id a profile may be needed for — in Fantastic 6, old expenses can mention crew who've since left. */
export function groupProfileIds(group: Group | null) {
  if (!group) return []
  return isFantastic6Group(group) ? FANTASTIC6_IDS : group.memberIds
}

function toGroup(id: string, data: DocumentData): Group {
  return {
    id,
    name: data.name,
    inviteCode: data.inviteCode,
    memberIds: data.memberIds ?? [],
    ...(data.kind === FANTASTIC6_KIND ? { kind: FANTASTIC6_KIND, crew: data.crew ?? {} } : {}),
    createdAt: data.createdAt?.toMillis?.() ?? 0,
  }
}

export interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  splitBetween: string[]
  splitType: 'equal' | 'custom'
  customSplits?: Record<string, number>
  emoji?: string
  createdAt: number
}

export interface Settlement {
  id: string
  from: string
  to: string
  amount: number
  settledAt: number
}

function randomInviteCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Creates a group. Passing `crewCharacter` makes it a Fantastic 6 group, with the creator
 * playing that crew character.
 */
export async function createGroup(name: string, ownerUid: string, crewCharacter?: string): Promise<string> {
  const fantastic6: Pick<Group, 'kind' | 'crew'> = crewCharacter
    ? { kind: FANTASTIC6_KIND, crew: { [ownerUid]: crewCharacter } }
    : {}

  if (!isFirebaseConfigured) {
    return localBackend.createGroup(name, ownerUid, fantastic6)
  }

  // Invite codes live in their own `inviteCodes/{code}` docs so a code can be checked and
  // resolved with a single-document get. Querying `groups` by inviteCode is rejected by the
  // security rules, since a user may only read groups they already belong to.
  let code = randomInviteCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await withTimeout(getDoc(doc(db, 'inviteCodes', code)))
    if (!existing.exists()) break
    code = randomInviteCode()
  }

  const groupRef = doc(collection(db, 'groups'))
  const batch = writeBatch(db)
  batch.set(groupRef, {
    name,
    inviteCode: code,
    memberIds: [ownerUid],
    ...fantastic6,
    createdAt: serverTimestamp(),
  })
  // The kind is kept on the code too, so a join can be checked before actually joining.
  batch.set(doc(db, 'inviteCodes', code), { groupId: groupRef.id, ...(crewCharacter ? { kind: FANTASTIC6_KIND } : {}) })
  await withTimeout(batch.commit())

  return groupRef.id
}

const REQUEST_TIMEOUT_MS = 15000

/** Firestore writes wait indefinitely for the server when offline; surface that as an error instead. */
function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Connection timed out. Check your internet connection and retry.')),
      REQUEST_TIMEOUT_MS,
    )
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      },
    )
  })
}

export interface JoinGroupResult {
  groupId: string
  /** Display names of other members that share this joiner's name (case/whitespace-insensitive) */
  duplicateNames: string[]
}

function checkCodeKind(kind: unknown, crewCharacter?: string) {
  if (crewCharacter && kind !== FANTASTIC6_KIND) {
    throw new Error("That code isn't for a Fantastic 6 group.")
  }
  if (!crewCharacter && kind === FANTASTIC6_KIND) {
    throw new Error("That's a Fantastic 6 group — join it from Fantastic 6 in the menu.")
  }
}

/**
 * Joins a group by invite code. Passing `crewCharacter` joins a Fantastic 6 group as that
 * crew character (and only accepts Fantastic 6 codes).
 */
export async function joinGroupByCode(code: string, uid: string, crewCharacter?: string): Promise<JoinGroupResult> {
  let groupId: string
  let existingMemberIds: string[]

  if (!isFirebaseConfigured) {
    const result = localBackend.joinGroup(code, uid, (kind) => checkCodeKind(kind, crewCharacter))
    groupId = result.groupId
    existingMemberIds = result.existingMemberIds
  } else {
    const codeSnap = await withTimeout(getDoc(doc(db, 'inviteCodes', code)))
    if (!codeSnap.exists()) {
      throw new Error('No group found with that code')
    }
    checkCodeKind(codeSnap.data().kind, crewCharacter)

    groupId = codeSnap.data().groupId as string
    const groupRef = doc(db, 'groups', groupId)
    // Join first: the group is only readable once we're in memberIds.
    await withTimeout(updateDoc(groupRef, { memberIds: arrayUnion(uid) }))
    const groupSnap = await withTimeout(getDoc(groupRef))
    existingMemberIds = groupSnap.data()?.memberIds ?? []
  }

  if (crewCharacter) {
    await claimFantastic6Character(groupId, uid, crewCharacter)
    // Crew are identified by character, not name, so name clashes don't matter here.
    return { groupId, duplicateNames: [] }
  }

  const duplicateNames = await findDuplicateNames(
    existingMemberIds.filter((memberId) => memberId !== uid),
    uid,
  )
  return { groupId, duplicateNames }
}

/** Records which crew character this account is playing in a Fantastic 6 group (replacing any earlier pick). */
export async function claimFantastic6Character(groupId: string, uid: string, characterId: string) {
  if (!isFirebaseConfigured) {
    localBackend.setCrew(groupId, uid, characterId)
    return
  }
  await withTimeout(updateDoc(doc(db, 'groups', groupId), { [`crew.${uid}`]: characterId }))
}

export function subscribeToUserGroups(uid: string, callback: (groups: Group[]) => void) {
  if (!isFirebaseConfigured) {
    return localBackend.subscribeUserGroups(uid, callback)
  }

  const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', uid))
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => toGroup(d.id, d.data())),
    )
  })
}

export function subscribeToGroup(groupId: string, callback: (group: Group | null) => void) {
  if (!isFirebaseConfigured) {
    return localBackend.subscribeGroup(groupId, callback)
  }

  return onSnapshot(doc(db, 'groups', groupId), (snap) => {
    if (!snap.exists()) {
      callback(null)
      return
    }
    callback(toGroup(snap.id, snap.data()))
  })
}

export function subscribeToExpenses(groupId: string, callback: (expenses: Expense[]) => void) {
  if (!isFirebaseConfigured) {
    return localBackend.subscribeExpenses(groupId, callback)
  }

  const q = query(collection(db, 'groups', groupId, 'expenses'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          description: data.description,
          amount: data.amount,
          paidBy: data.paidBy,
          splitBetween: data.splitBetween ?? [],
          splitType: data.splitType,
          customSplits: data.customSplits,
          emoji: data.emoji,
          createdAt: data.createdAt?.toMillis?.() ?? 0,
        }
      }),
    )
  })
}

export function subscribeToSettlements(groupId: string, callback: (settlements: Settlement[]) => void) {
  if (!isFirebaseConfigured) {
    return localBackend.subscribeSettlements(groupId, callback)
  }

  const q = query(collection(db, 'groups', groupId, 'settlements'), orderBy('settledAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          from: data.from,
          to: data.to,
          amount: data.amount,
          settledAt: data.settledAt?.toMillis?.() ?? 0,
        }
      }),
    )
  })
}

export async function addExpense(groupId: string, expense: Omit<Expense, 'id' | 'createdAt'>) {
  if (!isFirebaseConfigured) {
    localBackend.addExpense(groupId, expense)
    return
  }

  await addDoc(collection(db, 'groups', groupId, 'expenses'), {
    ...expense,
    createdAt: serverTimestamp(),
  })
}

export async function updateExpense(
  groupId: string,
  expenseId: string,
  expense: Omit<Expense, 'id' | 'createdAt'>,
) {
  if (!isFirebaseConfigured) {
    localBackend.updateExpense(groupId, expenseId, expense)
    return
  }

  await withTimeout(
    updateDoc(doc(db, 'groups', groupId, 'expenses', expenseId), {
      ...expense,
      // Switching a custom split back to equal must drop the old per-person amounts.
      customSplits: expense.customSplits ?? deleteField(),
      updatedAt: serverTimestamp(),
    }),
  )
}

export async function recordSettlement(groupId: string, settlement: Omit<Settlement, 'id' | 'settledAt'>) {
  if (!isFirebaseConfigured) {
    localBackend.recordSettlement(groupId, settlement)
    return
  }

  await addDoc(collection(db, 'groups', groupId, 'settlements'), {
    ...settlement,
    settledAt: serverTimestamp(),
  })
}
