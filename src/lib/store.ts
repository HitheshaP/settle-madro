import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  uid: string
  name: string
  characterId: string
}

export type ThemeMode = 'dark' | 'light'

interface AppState {
  user: UserProfile | null
  onboarded: boolean
  theme: ThemeMode
  completeOnboarding: (user: UserProfile) => void
  reset: () => void
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      onboarded: false,
      theme: 'dark',
      completeOnboarding: (user) => set({ user, onboarded: true }),
      reset: () => set({ user: null, onboarded: false }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'settle-madro-user' },
  ),
)
