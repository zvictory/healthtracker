import { motion } from 'motion/react'
import { Trophy, Droplets, Sunrise, Moon, Star, Smile, Dumbbell, Flame, Scale, ListChecks, HeartPulse, UtensilsCrossed, GlassWater, CandyOff } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const ICON_MAP = {
  Droplets, Sunrise, Moon, Star, Smile, Dumbbell, Flame, Scale,
  ListChecks, HeartPulse, UtensilsCrossed, GlassWater, CandyOff, Trophy,
}

export default function ChallengeCard({
  challenge,
  daysCompleted,
  targetDays,
  isCompleted,
  alreadyClaimed,
  daysRemaining,
  xpReward,
  progress,
  onClaim,
  compact = false,
}) {
  const reduced = useReducedMotion()

  if (!challenge) return null

  const Icon = ICON_MAP[challenge.icon] || Star
  const progressPercent = Math.round(progress * 100)

  if (compact) {
    return (
      <div className="card p-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${challenge.color}18` }}
        >
          <Icon size={18} style={{ color: challenge.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{challenge.name}</p>
          <div className="mt-1.5 h-1.5 bg-[var(--color-divider)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: challenge.color }}
            />
          </div>
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color: challenge.color }}>
          {daysCompleted}/{targetDays}
        </span>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${challenge.color}, ${challenge.color}88)` }} />

      <div className="p-5">
        <div className="flex items-start gap-3">
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${challenge.color}18` }}
            animate={isCompleted && !reduced ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {isCompleted
              ? <Trophy size={22} style={{ color: challenge.color }} />
              : <Icon size={22} style={{ color: challenge.color }} />
            }
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold">{challenge.name}</p>
              {isCompleted && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: challenge.color }}>
                  Bajarildi!
                </span>
              )}
            </div>
            <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
              {daysCompleted}/{targetDays} kun
            </span>
            <span className="text-[11px] font-semibold" style={{ color: challenge.color }}>
              {progressPercent}%
            </span>
          </div>
          <div className="h-2.5 bg-[var(--color-divider)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: challenge.color }}
              initial={reduced ? { width: `${progressPercent}%` } : { width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </div>

        {/* Footer: countdown or claim */}
        <div className="mt-3 flex items-center justify-between">
          {isCompleted && !alreadyClaimed ? (
            <motion.button
              onClick={onClaim}
              whileTap={reduced ? {} : { scale: 0.95 }}
              className="w-full py-2.5 rounded-xl text-white text-sm font-bold cursor-pointer"
              style={{ backgroundColor: challenge.color }}
            >
              Mukofotni olish (+{xpReward} XP)
            </motion.button>
          ) : alreadyClaimed ? (
            <p className="text-[11px] text-[var(--color-text-tertiary)] font-medium">
              +{xpReward} XP olindi
            </p>
          ) : (
            <p className="text-[11px] text-[var(--color-text-tertiary)]">
              {daysRemaining > 0 ? `${daysRemaining} kun qoldi` : "Vaqt tugadi"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
