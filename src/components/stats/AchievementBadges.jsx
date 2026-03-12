import { useState } from 'react'
import ConfettiEffect from '../shared/ConfettiEffect'

export default function AchievementBadges({ achievements }) {
  const [confettiTrigger] = useState(() => {
    return achievements.some(a => a.earned) ? 1 : 0
  })

  return (
    <div>
      <ConfettiEffect trigger={confettiTrigger} />

      <div className="grid grid-cols-2 gap-3">
        {achievements.map(badge => (
          <div
            key={badge.id}
            className={`card p-4 text-center transition-all ${
              badge.earned ? 'ring-2 ring-primary' : 'opacity-60'
            }`}
          >
            <div className={`text-4xl mb-2 ${badge.earned ? 'animate-scale-in' : 'grayscale'}`}>
              {badge.emoji}
            </div>
            <h4 className="text-sm font-bold mb-1">{badge.name}</h4>
            <p className="text-[10px] text-[var(--color-text-secondary)] mb-2">{badge.description}</p>

            {!badge.earned && (
              <div className="mt-2">
                <div className="h-1.5 bg-[var(--color-divider)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.round(badge.progress * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">
                  {Math.round(badge.progress * 100)}%
                </p>
              </div>
            )}

            {badge.earned && (
              <span className="inline-block px-2 py-0.5 bg-[var(--color-success-light)] text-[var(--color-success)] text-[10px] font-bold rounded-full">
                Olingan
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
