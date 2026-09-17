import { useEffect, useState } from 'react'
import { subscribeToUserProfile, type UserRecord } from './users'

export function useProfiles(uids: string[]) {
  const [profiles, setProfiles] = useState<Record<string, UserRecord>>({})

  useEffect(() => {
    if (uids.length === 0) return

    const unsubscribes = uids.map((uid) =>
      subscribeToUserProfile(uid, (user) => {
        if (!user) return
        setProfiles((prev) => ({ ...prev, [uid]: user }))
      }),
    )

    return () => unsubscribes.forEach((unsub) => unsub())
  }, [uids.join(',')])

  return profiles
}
