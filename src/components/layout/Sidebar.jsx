import { NavLink } from 'react-router-dom'
import { Heart, Home, ListChecks, Droplets, BookOpen, BarChart3, Apple, Settings, Info } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'

function getMainNav(activeModules) {
  const hasBowelModule = activeModules?.includes('bowel')

  return [
    { path: '/', icon: Home, label: 'Bosh sahifa' },
    { path: '/tasks', icon: ListChecks, label: 'Vazifalar' },
    { path: '/water', icon: Droplets, label: 'Suv' },
    ...(hasBowelModule ? [{ path: '/bowel', icon: BookOpen, label: 'Jurnal' }] : []),
    { path: '/stats', icon: BarChart3, label: 'Statistika' },
  ]
}

function getSecondaryNav(activeModules) {
  const hasFoodGuideModule = activeModules?.includes('food_guide')

  return [
    ...(hasFoodGuideModule ? [{ path: '/food-guide', icon: Apple, label: 'Mahsulotlar' }] : []),
    { path: '/settings', icon: Settings, label: 'Sozlamalar' },
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
  const mainNav = getMainNav(profile.activeModules)
  const secondaryNav = getSecondaryNav(profile.activeModules)

  return (
    <aside className="hidden lg:block w-[308px] shrink-0 p-4">
      <div className="glass-nav sticky top-4 flex h-[calc(100vh-2rem)] flex-col rounded-[32px] px-4 py-4">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(20,125,115,0.94),rgba(47,158,98,0.9))] px-5 py-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 backdrop-blur-sm">
              <Heart size={20} className="text-white" fill="white" />
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-tight">Sog'liq Kuzatuvchi</p>
              <p className="text-[11px] text-white/72 mt-0.5 font-medium">Kunlik ritm va sog'liq nazorati</p>
            </div>
          </div>
          {profile.name && (
            <div className="mt-4 inline-flex rounded-full bg-white/16 px-3 py-1.5 text-xs font-semibold text-white/88">
              {profile.name} uchun moslashtirilgan
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto pt-5" aria-label="Asosiy navigatsiya">
          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">Asosiy</p>
          <div className="space-y-1.5">
            {mainNav.map(item => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </div>

          <div className="h-px bg-[var(--color-divider)] my-5 mx-2" />

          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">Qo'shimcha</p>
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
            Bu tibbiy maslahat emas. Belgilar kuchaysa yoki davom etsa, shifokorga murojaat qiling.
          </p>
        </div>
      </div>
    </aside>
  )
}
