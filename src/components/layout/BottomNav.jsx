import { NavLink } from 'react-router-dom'
import { Home, ListChecks, Droplets, BookOpen, BarChart3, Apple } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'

function getTabs(activeModules) {
  const hasBowelModule = activeModules?.includes('bowel')

  return [
    { path: '/', icon: Home, label: 'Bosh sahifa' },
    { path: '/tasks', icon: ListChecks, label: 'Vazifalar' },
    { path: '/water', icon: Droplets, label: 'Suv' },
    hasBowelModule
      ? { path: '/bowel', icon: BookOpen, label: 'Jurnal' }
      : { path: '/stats', icon: BarChart3, label: 'Statistika' },
    hasBowelModule
      ? { path: '/stats', icon: BarChart3, label: 'Statistika' }
      : { path: '/food-guide', icon: Apple, label: 'Mahsulotlar' },
  ]
}

export default function BottomNav() {
  const { profile } = useProfile()
  const tabs = getTabs(profile.activeModules)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] lg:hidden" aria-label="Asosiy navigatsiya">
      <div className="glass-nav mx-auto max-w-[720px] rounded-[28px] px-2 py-2">
        <div className="flex items-center justify-around gap-1">
          {tabs.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className="block"
              aria-label={label}
            >
              {({ isActive }) => (
                <div className={`relative flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2.5 text-[10px] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive ? 'bg-primary text-white shadow-sm' : 'text-[var(--color-text-tertiary)]'
                }`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
