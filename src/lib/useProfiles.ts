import { useEffect, useMemo, useState } from 'react'
import { subscribeToUserProfile, type UserRecord } from './users'
import { fantastic6Profile, isFantastic6Id } from './fantastic6'

export function useProfiles(uids: string[]) {
  const [profiles, setProfiles] = useState<Record<string, UserRecord>>({})
  const key = uids.join(',')

  useEffect(() => {
    // Fantastic 6 crew ids aren't accounts — their profiles are fixed (see below).
    const accountUids = uids.filter((uid) => !isFantastic6Id(uid))
    if (accountUids.length === 0) return

    const unsubscribes = accountUids.map((uid) =>
      subscribeToUserProfile(uid, (user) => {
        if (!user) return
        setProfiles((prev) => ({ ...prev, [uid]: user }))
      }),
    )

    return () => unsubscribes.forEach((unsub) => unsub())
  }, [key])

  return useMemo(() => {
    const crew = uids.filter(isFantastic6Id)
    if (crew.length === 0) return profiles
    return { ...profiles, ...Object.fromEntries(crew.map((id) => [id, fantastic6Profile(id)])) }
  }, [profiles, key])
}
