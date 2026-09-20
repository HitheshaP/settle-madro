import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import WelcomeSplash from './components/splash/WelcomeSplash'
import { useAppStore } from './lib/store'

const SPLASH_SESSION_KEY = 'settle-madro-splash-shown'

const Groups = lazy(() => import('./pages/Groups'))
const Group = lazy(() => import('./pages/Group'))
const AddExpense = lazy(() => import('./pages/AddExpense'))
const SettleUp = lazy(() => import('./pages/SettleUp'))

function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <span className="text-3xl">🪙</span>
    </div>
  )
}

function RequireOnboarding({ children }: { children: ReactNode }) {
  const onboarded = useAppStore((state) => state.onboarded)
  if (!onboarded) return <Navigate to="/" replace />
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export default function App() {
  const onboarded = useAppStore((state) => state.onboarded)
  const theme = useAppStore((state) => state.theme)
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem(SPLASH_SESSION_KEY)
    } catch {
      return true
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (showSplash) {
    return (
      <WelcomeSplash
        onFinish={() => {
          try {
            sessionStorage.setItem(SPLASH_SESSION_KEY, '1')
          } catch {
            // Private browsing / storage disabled — splash will just replay next open
          }
          setShowSplash(false)
        }}
      />
    )
  }

  return (
    <Routes>
      <Route path="/" element={onboarded ? <Navigate to="/groups" replace /> : <Onboarding />} />
      <Route
        path="/groups"
        element={
          <RequireOnboarding>
            <Groups />
          </RequireOnboarding>
        }
      />
      <Route
        path="/groups/:groupId"
        element={
          <RequireOnboarding>
            <Group />
          </RequireOnboarding>
        }
      />
      <Route
        path="/groups/:groupId/add-expense"
        element={
          <RequireOnboarding>
            <AddExpense />
          </RequireOnboarding>
        }
      />
      <Route
        path="/groups/:groupId/settle-up"
        element={
          <RequireOnboarding>
            <SettleUp />
          </RequireOnboarding>
        }
      />
    </Routes>
  )
}
