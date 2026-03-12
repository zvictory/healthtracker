import { Zap } from 'lucide-react'

export default function LevelProgress({ level, levelName, xpInLevel, xpToNext, progress, totalXP }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-bold">
              Daraja {level}
              <span className="text-[var(--color-text-tertiary)] font-medium ml-1.5 text-xs">
                {levelName}
              </span>
            </p>
            <span className="text-[10px] text-[var(--color-text-tertiary)]">{totalXP} XP</span>
          </div>
          <div className="mt-1.5 h-2 bg-[var(--color-divider)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
              }}
            />
          </div>
          <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
            {xpInLevel}/{xpToNext} XP keyingi darajagacha
          </p>
        </div>
      </div>
    </div>
  )
}
