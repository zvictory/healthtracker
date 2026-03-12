import { useState } from 'react'
import { User } from 'lucide-react'

const AGE_OPTIONS = [
  { id: '18-25', label: '18–25' },
  { id: '26-35', label: '26–35' },
  { id: '36-45', label: '36–45' },
  { id: '46+', label: '46+' },
]

export default function ProfileStep({ onNext }) {
  const [gender, setGender] = useState(null)
  const [age, setAge] = useState(null)

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
          <User size={20} className="text-[var(--color-accent)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Sizning profilingiz</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">Maslahatlarni moslash uchun</p>
        </div>
      </div>

      {/* Gender */}
      <p className="text-sm font-semibold mb-2">Jins</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[{ id: 'female', label: 'Ayol' }, { id: 'male', label: 'Erkak' }].map(opt => (
          <button
            key={opt.id}
            onClick={() => setGender(opt.id)}
            className={`py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
              gender === opt.id
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Age */}
      <p className="text-sm font-semibold mb-2">Yosh</p>
      <div className="grid grid-cols-4 gap-2 mb-6">
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

      <button
        onClick={() => onNext(gender, age)}
        disabled={!gender || !age}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-transform cursor-pointer"
      >
        Davom etish
      </button>
    </div>
  )
}
