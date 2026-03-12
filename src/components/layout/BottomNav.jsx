import { NavLink } from 'react-router-dom'
import { Home, ListChecks, Droplets, BookOpen, BarChart3 } from 'lucide-react'

const tabs = [
  { path: '/', icon: Home, label: 'Bosh sahifa' },
  { path: '/tasks', icon: ListChecks, label: 'Vazifalar' },
  { path: '/water', icon: Droplets, label: 'Suv' },
  { path: '/bowel', icon: BookOpen, label: 'Jurnal' },
  { path: '/stats', icon: BarChart3, label: 'Statistika' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-[var(--color-bg-elevated)] border-t border-[var(--color-divider)]">
        <div className="max-w-[640px] mx-auto flex justify-around items-center h-16 px-2">
          {tabs.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className="block"
            >
              {({ isActive }) => (
                <div className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl text-[10px] font-medium transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-primary' : 'text-[var(--color-text-tertiary)]'
                }`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className={isActive ? 'font-semibold' : ''}>{label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-5 h-[3px] rounded-full bg-primary" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="bg-[var(--color-bg-elevated)] h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
