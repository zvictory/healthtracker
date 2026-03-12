import { useState } from 'react'
import { Bell, Sparkles } from 'lucide-react'

const REMINDER_TIMES = [
  { time: '06:30', label: 'Ertalab iliq suv' },
  { time: '09:00', label: 'Nonushta eslatmasi' },
  { time: '12:00', label: 'Tushlik + suv' },
  { time: '15:00', label: 'Piyoda yurish' },
  { time: '18:00', label: 'Qorin massaji' },
  { time: '21:00', label: 'Kefir + zig\'ir' },
]

export default function RemindersStep({ onFinish }) {
  const [enabled, setEnabled] = useState(true)

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center">
          <Bell size={20} className="text-[var(--color-warning)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Eslatmalar</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">Sozlamalardan o'zgartirish mumkin</p>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setEnabled(!enabled)}
        className="w-full card p-4 flex items-center justify-between mb-4 cursor-pointer"
      >
        <span className="text-sm font-semibold">Eslatmalarni yoqish</span>
        <div className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-[var(--color-border)]'}`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
        </div>
      </button>

      {/* Schedule preview */}
      {enabled && (
        <div className="card p-4 space-y-3 mb-6 animate-fade-in">
          {REMINDER_TIMES.map(r => (
            <div key={r.time} className="flex items-center gap-3">
              <span className="text-xs font-bold text-primary w-11 flex-shrink-0">{r.time}</span>
              <span className="text-sm text-[var(--color-text-secondary)]">{r.label}</span>
            </div>
          ))}
        </div>
      )}

      {!enabled && (
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
          Eslatmalar o'chirilgan. Sozlamalardan istalgan vaqtda yoqishingiz mumkin.
        </p>
      )}

      <button
        onClick={() => onFinish(enabled)}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-sm active:scale-[0.98] transition-transform cursor-pointer flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)' }}
      >
        <Sparkles size={18} />
        Boshlash!
      </button>
    </div>
  )
}
