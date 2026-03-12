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
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="max-w-[640px] lg:max-w-6xl mx-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </div>
        {toast && <Toast message={toast} onDismiss={dismissToast} />}
      </main>
      <BottomNav />
    </div>
  )
}
