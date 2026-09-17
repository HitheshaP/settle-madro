import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import InstallPrompt from './components/ui/InstallPrompt'
import { useAppStore } from './lib/store'

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

  return (
    <>
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
      <InstallPrompt />
    </>
  )
}
