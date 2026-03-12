import { Flame } from 'lucide-react'

export default function StreakCounter({ streak }) {
  return (
    <div className="card p-4 flex items-center gap-3 bg-warning-light">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
      >
        <Flame
          size={20}
          className="text-warning"
          style={{ animation: streak > 0 ? 'flame 1s ease-in-out infinite' : 'none' }}
        />
      </div>
      <div>
        <p className="text-sm font-bold">{streak} kun ketma-ket</p>
        <p className="text-[11px] text-[var(--color-text-tertiary)]">70%+ ball seriyasi</p>
      </div>
    </div>
  )
}
