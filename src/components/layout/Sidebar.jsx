import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Heart, Home, ListChecks, Droplets, BookOpen, BarChart3, Apple, Settings, Info, UtensilsCrossed, Dumbbell, Scale } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useTranslation } from '../../hooks/useTranslation'

function getMainNav(activeModules, t) {
  const m = activeModules || []
  return [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/tasks', icon: ListChecks, label: t('nav.tasks') },
    { path: '/water', icon: Droplets, label: t('nav.water') },
    ...(m.includes('bowel') ? [{ path: '/bowel', icon: BookOpen, label: t('nav.journal') }] : []),
    ...(m.includes('meals') ? [{ path: '/meals', icon: UtensilsCrossed, label: t('nav.meals_full') }] : []),
    ...(m.includes('exercise') ? [{ path: '/exercise', icon: Dumbbell, label: t('nav.exercise_full') }] : []),
    ...(m.includes('body') ? [{ path: '/body', icon: Scale, label: t('nav.body') }] : []),
    { path: '/stats', icon: BarChart3, label: t('nav.stats') },
  ]
}

function getSecondaryNav(activeModules, t) {
  const m = activeModules || []
  return [
    ...(m.includes('food_guide') ? [{ path: '/food-guide', icon: Apple, label: t('nav.products') }] : []),
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ]
}

function SidebarLink({ path, icon: Icon, label }) {
  return (
    <NavLink to={path} end={path === '/'} className="block" aria-label={label}>
      {({ isActive }) => (
        <div className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
          isActive
            ? 'bg-primary text-white shadow-sm'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-divider)] hover:text-[var(--color-text)]'
        }`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            isActive ? 'bg-white/16 text-white' : 'bg-[var(--color-divider)]'
          }`}>
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
          </div>
          <span>{label}</span>
        </div>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { profile } = useProfile()
  const { t } = useTranslation()
  const mainNav = useMemo(() => getMainNav(profile.activeModules, t), [profile.activeModules, t])
  const secondaryNav = useMemo(() => getSecondaryNav(profile.activeModules, t), [profile.activeModules, t])

  return (
    <aside className="hidden lg:block w-[308px] shrink-0 p-4">
      <div className="glass-nav sticky top-4 flex h-[calc(100vh-2rem)] flex-col rounded-[32px] px-4 py-4">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(20,125,115,0.94),rgba(47,158,98,0.9))] px-5 py-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 backdrop-blur-sm">
              <Heart size={20} className="text-white" fill="white" />
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-tight">{t('sidebar.app_name')}</p>
              <p className="text-[11px] text-white/72 mt-0.5 font-medium">{t('sidebar.app_tagline')}</p>
            </div>
          </div>
          {profile.name && (
            <div className="mt-4 inline-flex rounded-full bg-white/16 px-3 py-1.5 text-xs font-semibold text-white/88">
              {t('sidebar.customized_for', { name: profile.name })}
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto pt-5" aria-label={t('nav.main_nav')}>
          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">{t('nav.main')}</p>
          <div className="space-y-1.5">
            {mainNav.map(item => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </div>

          <div className="h-px bg-[var(--color-divider)] my-5 mx-2" />

          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">{t('nav.extra')}</p>
          <div className="space-y-1.5">
            {secondaryNav.map(item => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </div>
        </nav>

        <div className="rounded-[24px] bg-[var(--color-divider)] px-4 py-4 flex items-start gap-3 mt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--color-card)]">
            <Info size={14} className="text-[var(--color-text-tertiary)] flex-shrink-0" />
          </div>
          <p className="text-[11px] leading-relaxed text-[var(--color-text-tertiary)]">
            {t('settings.disclaimer_short')}
          </p>
        </div>
      </div>
    </aside>
  )
}
