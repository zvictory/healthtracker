import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import LoadingSpinner from '../shared/LoadingSpinner'
import Toast from '../shared/Toast'
import { useNotifications } from '../../hooks/useNotifications'
import { useDarkMode } from '../../hooks/useDarkMode'

export default function Layout() {
  const { toast, dismissToast } = useNotifications()
  useDarkMode()

  return (
    <div className="relative min-h-screen text-[var(--color-text)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-warning/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-water/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <div className="mx-auto max-w-[1440px]">
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </div>
          {toast && <Toast message={toast} onDismiss={dismissToast} />}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
