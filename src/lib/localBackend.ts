// Local-storage-backed stand-in for Firestore, used automatically when Firebase
// isn't configured yet (see isFirebaseConfigured in firebase.ts). Mirrors the
// shape of groups.ts / users.ts so pages don't need to know which is active.

export interface LocalUser {
  name: string
  characterId: string
}

export interface LocalGroup {
  name: string
  inviteCode: string
  memberIds: string[]
  kind?: 'fantastic6'
  createdAt: number
}

export interface LocalExpense {
  description: string
  amount: number
  paidBy: string
  splitBetween: string[]
  splitType: 'equal' | 'custom'
  customSplits?: Record<string, number>
  emoji?: string
  createdAt: number
}

export interface LocalSettlement {
  from: string
  to: string
  amount: number
  settledAt: number
}

interface LocalDB {
  users: Record<string, LocalUser>
  groups: Record<string, LocalGroup>
  expenses: Record<string, Record<string, LocalExpense>>
  settlements: Record<string, Record<string, LocalSettlement>>
}

const STORAGE_KEY = 'settle-madro-local-db'
const bus = new EventTarget()

function emptyDb(): LocalDB {
  return { users: {}, groups: {}, expenses: {}, settlements: {} }
}

function load(): LocalDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...emptyDb(), ...JSON.parse(raw) } : emptyDb()
  } catch {
    return emptyDb()
  }
}

function save(db: LocalDB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  bus.dispatchEvent(new Event('change'))
}

function onChange(callback: () => void) {
  bus.addEventListener('change', callback)
  return () => bus.removeEventListener('change', callback)
}

function randomInviteCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function randomId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export const localBackend = {
  saveUser(uid: string, name: string, characterId: string) {
    const db = load()
    db.users[uid] = { name, characterId }
    save(db)
  },

  subscribeUser(uid: string, callback: (user: (LocalUser & { uid: string }) | null) => void) {
    const emit = () => {
      const db = load()
      const user = db.users[uid]
      callback(user ? { uid, ...user } : null)
    }
    emit()
    return onChange(emit)
  },

  createGroup(name: string, ownerUid: string) {
    const db = load()
    const id = randomId('group')
    db.groups[id] = { name, inviteCode: randomInviteCode(), memberIds: [ownerUid], createdAt: Date.now() }
    save(db)
    return id
  },

  joinGroup(code: string, uid: string) {
    const db = load()
    const entry = Object.entries(db.groups).find(([, g]) => g.inviteCode === code)
    if (!entry) throw new Error('No group found with that code')
    const [id, group] = entry
    const existingMemberIds = [...group.memberIds]
    if (!group.memberIds.includes(uid)) group.memberIds.push(uid)
    save(db)
    return { groupId: id, existingMemberIds }
  },

  joinOrCreateGroup(code: string, uid: string, init: { name: string; kind?: LocalGroup['kind'] }) {
    const db = load()
    const entry = Object.entries(db.groups).find(([, g]) => g.inviteCode === code)
    if (entry) {
      const [id, group] = entry
      if (!group.memberIds.includes(uid)) group.memberIds.push(uid)
      save(db)
      return id
    }
    const id = randomId('group')
    db.groups[id] = { ...init, inviteCode: code, memberIds: [uid], createdAt: Date.now() }
    save(db)
    return id
  },

  getUsersOnce(uids: string[]) {
    const db = load()
    return uids
      .map((uid) => (db.users[uid] ? { uid, ...db.users[uid] } : null))
      .filter((u): u is LocalUser & { uid: string } => u !== null)
  },

  subscribeUserGroups(uid: string, callback: (groups: ({ id: string } & LocalGroup)[]) => void) {
    const emit = () => {
      const db = load()
      callback(
        Object.entries(db.groups)
          .filter(([, g]) => g.memberIds.includes(uid))
          .map(([id, g]) => ({ id, ...g })),
      )
    }
    emit()
    return onChange(emit)
  },

  subscribeGroup(groupId: string, callback: (group: ({ id: string } & LocalGroup) | null) => void) {
    const emit = () => {
      const db = load()
      const group = db.groups[groupId]
      callback(group ? { id: groupId, ...group } : null)
    }
    emit()
    return onChange(emit)
  },

  addExpense(groupId: string, expense: Omit<LocalExpense, 'createdAt'>) {
    const db = load()
    if (!db.expenses[groupId]) db.expenses[groupId] = {}
    db.expenses[groupId][randomId('expense')] = { ...expense, createdAt: Date.now() }
    save(db)
  },

  updateExpense(groupId: string, expenseId: string, expense: Omit<LocalExpense, 'createdAt'>) {
    const db = load()
    const existing = db.expenses[groupId]?.[expenseId]
    if (!existing) throw new Error('Expense not found')
    db.expenses[groupId][expenseId] = { ...expense, createdAt: existing.createdAt }
    save(db)
  },

  subscribeExpenses(groupId: string, callback: (expenses: ({ id: string } & LocalExpense)[]) => void) {
    const emit = () => {
      const db = load()
      const expenses = db.expenses[groupId] ?? {}
      callback(
        Object.entries(expenses)
          .map(([id, e]) => ({ id, ...e }))
          .sort((a, b) => b.createdAt - a.createdAt),
      )
    }
    emit()
    return onChange(emit)
  },

  recordSettlement(groupId: string, settlement: Omit<LocalSettlement, 'settledAt'>) {
    const db = load()
    if (!db.settlements[groupId]) db.settlements[groupId] = {}
    db.settlements[groupId][randomId('settlement')] = { ...settlement, settledAt: Date.now() }
    save(db)
  },

  subscribeSettlements(groupId: string, callback: (settlements: ({ id: string } & LocalSettlement)[]) => void) {
    const emit = () => {
      const db = load()
      const settlements = db.settlements[groupId] ?? {}
      callback(
        Object.entries(settlements)
          .map(([id, s]) => ({ id, ...s }))
          .sort((a, b) => b.settledAt - a.settledAt),
      )
    }
    emit()
    return onChange(emit)
  },
}
