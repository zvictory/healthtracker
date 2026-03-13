import { useState } from 'react'
import { Heart } from 'lucide-react'

export default function WelcomeStep({ name, onNext }) {
  const [value, setValue] = useState(name || '')

  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)' }}
      >
        <Heart size={36} className="text-white" />
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight">
        Xush kelibsiz!
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-[280px] leading-relaxed">
        Sog'liq Kuzatuvchi — kundalik odatlaringizni kuzatib, sog'lig'ingizni yaxshilashga yordam beradi.
      </p>

      <div className="w-full mt-8">
        <label htmlFor="user-name" className="block text-left text-sm font-semibold mb-2">
          Ismingiz
        </label>
        <input
          id="user-name"
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Masalan: Nodira"
          autoFocus
          className="w-full px-4 py-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      <button
        onClick={() => onNext(value.trim())}
        disabled={!value.trim()}
        className="w-full mt-6 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-transform cursor-pointer"
      >
        Davom etish
      </button>
    </div>
  )
}
