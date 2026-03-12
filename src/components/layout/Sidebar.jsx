import { NavLink } from 'react-router-dom'
import { Heart, Home, ListChecks, Droplets, BookOpen, BarChart3, Apple, Settings, Info } from 'lucide-react'

const mainNav = [
  { path: '/', icon: Home, label: 'Bosh sahifa' },
  { path: '/tasks', icon: ListChecks, label: 'Vazifalar' },
  { path: '/water', icon: Droplets, label: 'Suv' },
  { path: '/bowel', icon: BookOpen, label: 'Jurnal' },
  { path: '/stats', icon: BarChart3, label: 'Statistika' },
]

const secondaryNav = [
  { path: '/food-guide', icon: Apple, label: 'Mahsulotlar' },
  { path: '/settings', icon: Settings, label: 'Sozlamalar' },
]

function SidebarLink({ path, icon: Icon, label }) {
  return (
    <NavLink to={path} end={path === '/'} className="block">
      {({ isActive }) => (
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
          isActive
            ? 'bg-primary-50 text-primary-dark font-semibold'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-divider)] hover:text-[var(--color-text)]'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            isActive ? 'bg-primary text-white shadow-sm' : ''
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
  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 bg-[var(--color-bg-elevated)] border-r border-[var(--color-divider)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px]">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)' }}>
          <Heart size={18} className="text-white" fill="white" />
        </div>
        <div>
          <p className="text-[15px] font-bold tracking-tight">Sog'liq</p>
          <p className="text-[11px] text-[var(--color-text-tertiary)] -mt-0.5 font-medium">Kuzatuvchi</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-tertiary)]">Asosiy</p>
        {mainNav.map(item => (
          <SidebarLink key={item.path} {...item} />
        ))}

        <div className="h-px bg-[var(--color-divider)] my-4 mx-2" />

        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-tertiary)]">Qo'shimcha</p>
        {secondaryNav.map(item => (
          <SidebarLink key={item.path} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4">
        <div className="rounded-2xl bg-[var(--color-divider)] px-4 py-3 flex items-start gap-2.5">
          <Info size={14} className="text-[var(--color-text-tertiary)] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-[var(--color-text-tertiary)]">
            Bu tibbiy maslahat emas. Muammo davom etsa, shifokorga murojaat qiling.
          </p>
        </div>
      </div>
    </aside>
  )
}
