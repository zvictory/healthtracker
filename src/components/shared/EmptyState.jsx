import { ClipboardList } from 'lucide-react'

export default function EmptyState({ icon: Icon = ClipboardList, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: 'var(--color-primary-50)' }}
      >
        <Icon size={28} className="text-primary" />
      </div>
      <h3 className="text-sm font-bold mb-1">{title}</h3>
      <p className="text-xs text-[var(--color-text-secondary)] max-w-[240px] leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold active:scale-[0.98] transition-transform cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
