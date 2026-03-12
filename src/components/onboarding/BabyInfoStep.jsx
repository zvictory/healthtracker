import { useState } from 'react'
import { Baby } from 'lucide-react'

const AGE_OPTIONS = [
  { id: '0-3', label: '0–3 oy' },
  { id: '3-6', label: '3–6 oy' },
  { id: '6-12', label: '6–12 oy' },
  { id: '12+', label: '12+ oy' },
]

export default function BabyInfoStep({ babyAgeGroup, isBreastfeeding, onNext }) {
  const [age, setAge] = useState(babyAgeGroup)
  const [feeding, setFeeding] = useState(isBreastfeeding)

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
          <Baby size={20} className="text-[var(--color-accent)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Chaqaloq haqida</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">Maslahatlarni moslash uchun</p>
        </div>
      </div>

      {/* Baby age */}
      <p className="text-sm font-semibold mb-2">Chaqaloq yoshi</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {AGE_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setAge(opt.id)}
            className={`py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
              age === opt.id
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Breastfeeding */}
      <p className="text-sm font-semibold mb-2">Hozir emizayapsizmi?</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[true, false].map(val => (
          <button
            key={String(val)}
            onClick={() => setFeeding(val)}
            className={`py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
              feeding === val
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
            }`}
          >
            {val ? 'Ha' : "Yo'q"}
          </button>
        ))}
      </div>

      <button
        onClick={() => onNext(age, feeding)}
        disabled={!age || feeding === null}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-transform cursor-pointer"
      >
        Davom etish
      </button>
    </div>
  )
}
