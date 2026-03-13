import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, ListChecks, Droplets, BookOpen, BarChart3, UtensilsCrossed, Dumbbell, Scale } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useTranslation } from '../../hooks/useTranslation'

function getTabs(activeModules, t) {
  const tabs = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/tasks', icon: ListChecks, label: t('nav.tasks') },
    { path: '/water', icon: Droplets, label: t('nav.water') },
  ]

  // 4th tab — profile-specific module
  if (activeModules?.includes('bowel')) {
    tabs.push({ path: '/bowel', icon: BookOpen, label: t('nav.journal') })
  } else if (activeModules?.includes('meals')) {
    tabs.push({ path: '/meals', icon: UtensilsCrossed, label: t('nav.meals') })
  } else if (activeModules?.includes('exercise')) {
    tabs.push({ path: '/exercise', icon: Dumbbell, label: t('nav.exercise') })
  }

  // 5th tab — stats always
  tabs.push({ path: '/stats', icon: BarChart3, label: t('nav.stats') })

  return tabs
}

export default function BottomNav() {
  const { profile } = useProfile()
  const { t } = useTranslation()
  const tabs = useMemo(() => getTabs(profile.activeModules, t), [profile.activeModules, t])

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] lg:hidden" aria-label={t('nav.main_nav')}>
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
