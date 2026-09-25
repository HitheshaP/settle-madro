import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  uid: string
  name: string
  characterId: string
}

export type ThemeMode = 'dark' | 'light'

export interface Fantastic6State {
  groupId: string
  /** Which crew character this device's user is (e.g. 'f6-ajji') */
  me: string
}

interface AppState {
  user: UserProfile | null
  onboarded: boolean
  theme: ThemeMode
  fantastic6: Fantastic6State | null
  colorful: boolean
  completeOnboarding: (user: UserProfile) => void
  reset: () => void
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
  unlockFantastic6: (state: Fantastic6State) => void
  setColorful: (colorful: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      onboarded: false,
      theme: 'dark',
      fantastic6: null,
      colorful: false,
      completeOnboarding: (user) => set({ user, onboarded: true }),
      reset: () => set({ user: null, onboarded: false, fantastic6: null, colorful: false }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      unlockFantastic6: (fantastic6) => set({ fantastic6, colorful: true }),
      setColorful: (colorful) => set({ colorful }),
    }),
    { name: 'settle-madro-user' },
  ),
)
