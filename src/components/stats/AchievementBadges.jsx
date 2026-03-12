import { Flame, Droplets, Footprints, HeartPulse, Sunrise, Star, Moon, GlassWater } from 'lucide-react'
import { TIER_LABELS, TIER_COLORS } from '../../data/achievements'

const ICON_MAP = { Flame, Droplets, Footprints, HeartPulse, Sunrise, Star, Moon, GlassWater }

export default function AchievementBadges({ achievements }) {
  const earned = achievements.filter(a => a.earned).length
  const total = achievements.length

  return (
    <div>
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Yutuqlar</h3>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {earned}/{total} olingan
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map(badge => {
          const Icon = ICON_MAP[badge.icon] || Star
          const tierColor = badge.earned ? TIER_COLORS[badge.tier] : null

          return (
            <div
              key={badge.id}
              className={`card p-4 text-center transition-all ${
                badge.earned ? '' : 'opacity-50'
              }`}
              style={badge.earned ? { boxShadow: `0 0 0 2px ${tierColor}20, var(--shadow-card)` } : undefined}
            >
              {/* Icon */}
              <div className="flex justify-center mb-2">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: badge.earned ? `${badge.color}18` : 'var(--color-divider)',
                  }}
                >
                  <Icon
                    size={24}
                    style={{ color: badge.earned ? badge.color : 'var(--color-text-tertiary)' }}
                  />
                </div>
              </div>

              {/* Name + tier */}
              <h4 className="text-sm font-bold mb-0.5">{badge.name}</h4>
              {badge.earned && (
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-1"
                  style={{ backgroundColor: tierColor }}
                >
                  {TIER_LABELS[badge.tier]}
                </span>
              )}
              <p className="text-[10px] text-[var(--color-text-secondary)] mb-2">{badge.description}</p>

              {/* Progress bar */}
              <div className="h-1.5 bg-[var(--color-divider)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(badge.progress * 100)}%`,
                    backgroundColor: badge.earned ? tierColor : 'var(--color-primary)',
                  }}
                />
              </div>
              <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">
                {badge.current}/{badge.target}
                {badge.earned && badge.tier < 2 && (
                  <span className="text-[var(--color-text-secondary)]">
                    {' '}— keyingi: {TIER_LABELS[badge.tier + 1]}
                  </span>
                )}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
