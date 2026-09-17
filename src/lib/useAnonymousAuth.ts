import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase'

interface AuthUser {
  uid: string
}

const LOCAL_UID_KEY = 'settle-madro-local-uid'

function getOrCreateLocalUid() {
  const existing = localStorage.getItem(LOCAL_UID_KEY)
  if (existing) return existing
  const uid = crypto.randomUUID()
  localStorage.setItem(LOCAL_UID_KEY, uid)
  return uid
}

export function useAnonymousAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUser({ uid: getOrCreateLocalUid() })
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid })
        setLoading(false)
        return
      }
      signInAnonymously(auth).catch((err) => {
        setError(err instanceof Error ? err.message : 'Could not sign in')
        setLoading(false)
      })
    })

    return unsubscribe
  }, [])

  return { user, loading, error }
}
