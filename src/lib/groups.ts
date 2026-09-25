import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
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

export interface Group {
  id: string
  name: string
  inviteCode: string
  memberIds: string[]
  createdAt: number
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

export async function createGroup(name: string, ownerUid: string): Promise<string> {
  if (!isFirebaseConfigured) {
    return localBackend.createGroup(name, ownerUid)
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
    createdAt: serverTimestamp(),
  })
  batch.set(doc(db, 'inviteCodes', code), { groupId: groupRef.id })
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

export async function joinGroupByCode(code: string, uid: string): Promise<JoinGroupResult> {
  let groupId: string
  let existingMemberIds: string[]

  if (!isFirebaseConfigured) {
    const result = localBackend.joinGroup(code, uid)
    groupId = result.groupId
    existingMemberIds = result.existingMemberIds
  } else {
    const codeSnap = await withTimeout(getDoc(doc(db, 'inviteCodes', code)))
    if (!codeSnap.exists()) {
      throw new Error('No group found with that code')
    }

    groupId = codeSnap.data().groupId as string
    const groupRef = doc(db, 'groups', groupId)
    // Join first: the group is only readable once we're in memberIds.
    await withTimeout(updateDoc(groupRef, { memberIds: arrayUnion(uid) }))
    const groupSnap = await withTimeout(getDoc(groupRef))
    existingMemberIds = groupSnap.data()?.memberIds ?? []
  }

  const duplicateNames = await findDuplicateNames(
    existingMemberIds.filter((memberId) => memberId !== uid),
    uid,
  )
  return { groupId, duplicateNames }
}

export function subscribeToUserGroups(uid: string, callback: (groups: Group[]) => void) {
  if (!isFirebaseConfigured) {
    return localBackend.subscribeUserGroups(uid, callback)
  }

  const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', uid))
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          name: data.name,
          inviteCode: data.inviteCode,
          memberIds: data.memberIds ?? [],
          createdAt: data.createdAt?.toMillis?.() ?? 0,
        }
      }),
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
    const data = snap.data()
    callback({
      id: snap.id,
      name: data.name,
      inviteCode: data.inviteCode,
      memberIds: data.memberIds ?? [],
      createdAt: data.createdAt?.toMillis?.() ?? 0,
    })
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
