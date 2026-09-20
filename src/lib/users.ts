import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { localBackend } from './localBackend'

export interface UserRecord {
  uid: string
  name: string
  characterId: string
}

export async function getUserProfilesOnce(uids: string[]): Promise<UserRecord[]> {
  if (uids.length === 0) return []

  if (!isFirebaseConfigured) {
    return localBackend.getUsersOnce(uids)
  }

  const snaps = await Promise.all(uids.map((uid) => getDoc(doc(db, 'users', uid))))
  return snaps
    .filter((snap) => snap.exists())
    .map((snap) => {
      const data = snap.data()
      return { uid: snap.id, name: data.name, characterId: data.characterId }
    })
}

/** Returns the display names of other group members that collide (case/whitespace-insensitive) with `uid`'s own name. */
export async function findDuplicateNames(otherUids: string[], uid: string): Promise<string[]> {
  const profiles = await getUserProfilesOnce([...otherUids, uid])
  const target = profiles.find((p) => p.uid === uid)
  if (!target) return []

  const targetName = target.name.trim().toLowerCase()
  if (!targetName) return []

  return profiles
    .filter((p) => p.uid !== uid && p.name.trim().toLowerCase() === targetName)
    .map((p) => p.name)
}

export async function saveUserProfile(uid: string, name: string, characterId: string) {
  if (!isFirebaseConfigured) {
    localBackend.saveUser(uid, name, characterId)
    return
  }

  await setDoc(doc(db, 'users', uid), { name, characterId, createdAt: serverTimestamp() })
}

export function subscribeToUserProfile(uid: string, callback: (user: UserRecord | null) => void) {
  if (!isFirebaseConfigured) {
    return localBackend.subscribeUser(uid, callback)
  }

  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (!snap.exists()) {
      callback(null)
      return
    }
    const data = snap.data()
    callback({ uid, name: data.name, characterId: data.characterId })
  })
}
