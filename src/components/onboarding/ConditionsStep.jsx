import { useState } from 'react'
import { Baby, Heart, Activity, Check } from 'lucide-react'
import { CONDITION_OPTIONS } from '../../data/scoringProfiles'

const ICON_MAP = { Baby, Heart, Activity, Check }

export default function ConditionsStep({ onNext }) {
  const [selected, setSelected] = useState([])

  const toggle = (id) => {
    if (id === 'none') {
      setSelected(['none'])
      return
    }
    setSelected(prev => {
      const without = prev.filter(c => c !== 'none')
      return without.includes(id)
        ? without.filter(c => c !== id)
        : [...without, id]
    })
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-lg font-bold mb-1">Sog'liq holatingiz</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Agar tegishli bo'lsa tanlang (ixtiyoriy)
      </p>

      <div className="space-y-2.5 mb-6">
        {CONDITION_OPTIONS.map(cond => {
          const Icon = ICON_MAP[cond.icon] || Check
          const active = selected.includes(cond.id)
          return (
            <button
              key={cond.id}
              onClick={() => toggle(cond.id)}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                active
                  ? 'border-primary bg-primary-50'
                  : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: active ? 'var(--color-primary-50)' : 'var(--color-divider)' }}
              >
                <Icon size={20} className={active ? 'text-primary' : 'text-[var(--color-text-tertiary)]'} />
              </div>
              <span className={`text-sm font-medium ${active ? 'text-primary' : ''}`}>
                {cond.label}
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onNext(selected.filter(c => c !== 'none'))}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm active:scale-[0.98] transition-transform cursor-pointer"
      >
        Davom etish
      </button>
    </div>
  )
}
