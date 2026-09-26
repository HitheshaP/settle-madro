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
  /**
   * The crew character picked when entering Fantastic 6 (after the secret code). Only lives for
   * the current visit — never persisted — so every visit starts with all six characters free.
   */
  fantastic6Me: string | null
  completeOnboarding: (user: UserProfile) => void
  reset: () => void
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
  enterFantastic6: (characterId: string) => void
  leaveFantastic6: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      onboarded: false,
      theme: 'dark',
      fantastic6Me: null,
      completeOnboarding: (user) => set({ user, onboarded: true }),
      reset: () => set({ user: null, onboarded: false, fantastic6Me: null }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      enterFantastic6: (fantastic6Me) => set({ fantastic6Me }),
      leaveFantastic6: () => set({ fantastic6Me: null }),
    }),
    {
      name: 'settle-madro-user',
      partialize: ({ user, onboarded, theme }) => ({ user, onboarded, theme }),
    },
  ),
)
