import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

  let code = randomInviteCode()
  const groupsRef = collection(db, 'groups')

  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await getDocs(query(groupsRef, where('inviteCode', '==', code)))
    if (existing.empty) break
    code = randomInviteCode()
  }

  const docRef = await addDoc(groupsRef, {
    name,
    inviteCode: code,
    memberIds: [ownerUid],
    createdAt: serverTimestamp(),
  })

  return docRef.id
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
    const groupsRef = collection(db, 'groups')
    const matches = await getDocs(query(groupsRef, where('inviteCode', '==', code)))

    if (matches.empty) {
      throw new Error('No group found with that code')
    }

    const groupDoc = matches.docs[0]
    existingMemberIds = groupDoc.data().memberIds ?? []
    await updateDoc(groupDoc.ref, { memberIds: arrayUnion(uid) })
    groupId = groupDoc.id
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
