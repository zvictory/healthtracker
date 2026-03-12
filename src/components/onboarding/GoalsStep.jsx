import { useState } from 'react'
import { ShieldCheck, Droplets, Salad, Footprints } from 'lucide-react'

const GOALS = [
  { id: 'constipation', icon: ShieldCheck, label: 'Ich qotishini oldini olish', color: 'var(--color-success)' },
  { id: 'water', icon: Droplets, label: 'Suv ichish odatini shakllantirish', color: 'var(--color-water)' },
  { id: 'nutrition', icon: Salad, label: "Sog'lom ovqatlanish", color: 'var(--color-warning)' },
  { id: 'activity', icon: Footprints, label: 'Harakatli bo\'lish', color: 'var(--color-accent)' },
]

export default function GoalsStep({ goals: initialGoals, onNext }) {
  const [selected, setSelected] = useState(initialGoals?.length ? initialGoals : ['constipation'])

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(g => g !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-lg font-bold mb-1">Maqsadlaringiz</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Bir yoki bir nechtasini tanlang
      </p>

      <div className="space-y-2.5 mb-6">
        {GOALS.map(goal => {
          const Icon = goal.icon
          const active = selected.includes(goal.id)
          return (
            <button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                active
                  ? 'border-primary bg-primary-50'
                  : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: active ? goal.color : 'var(--color-divider)', opacity: active ? 0.15 : 1 }}
              >
                <Icon size={20} style={{ color: active ? goal.color : 'var(--color-text-tertiary)' }} />
              </div>
              <span className={`text-sm font-medium ${active ? 'text-primary' : ''}`}>
                {goal.label}
              </span>
              {active && (
                <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onNext(selected)}
        disabled={selected.length === 0}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-transform cursor-pointer"
      >
        Davom etish
      </button>
    </div>
  )
}
