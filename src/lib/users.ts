import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { localBackend } from './localBackend'

export interface UserRecord {
  uid: string
  name: string
  characterId: string
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
