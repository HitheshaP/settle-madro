import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  uid: string
  name: string
  characterId: string
}

interface AppState {
  user: UserProfile | null
  onboarded: boolean
  completeOnboarding: (user: UserProfile) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      onboarded: false,
      completeOnboarding: (user) => set({ user, onboarded: true }),
      reset: () => set({ user: null, onboarded: false }),
    }),
    { name: 'settle-madro-user' },
  ),
)
