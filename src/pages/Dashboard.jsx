import { Link } from 'react-router-dom'
import { Settings, ArrowRight, UtensilsCrossed, Dumbbell, Scale } from 'lucide-react'
import { motion } from 'motion/react'
import { useDaily } from '../hooks/useDaily'
import { useScore } from '../hooks/useScore'
import { useStreak } from '../hooks/useStreak'
import { useBowel } from '../hooks/useBowel'
import { useOnboarding } from '../hooks/useOnboarding'
import { useXP } from '../hooks/useXP'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useTranslation } from '../hooks/useTranslation'
import HealthScoreCard from '../components/dashboard/HealthScoreCard'
import QuickStats from '../components/dashboard/QuickStats'
import MoodSelector from '../components/dashboard/MoodSelector'
import SmartTips from '../components/dashboard/SmartTips'
import StreakCounter from '../components/dashboard/StreakCounter'
import ChallengeCard from '../components/dashboard/ChallengeCard'
import StatPills from '../components/dashboard/StatPills'
import LevelProgress from '../components/shared/LevelProgress'
import BowelAlert from '../components/bowel/BowelAlert'
import { useChallenges } from '../hooks/useChallenges'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0 }),
}

function QuickAction({ to, icon: Icon, label, color }) {
  return (
    <Link to={to} className="card card-hover flex items-center gap-3 p-4 cursor-pointer group">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}14` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <span className="text-sm font-semibold flex-1">{label}</span>
      <ArrowRight size={14} className="text-[var(--color-text-tertiary)] transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

function getGreeting(t) {
  const hour = new Date().getHours()
  if (hour < 12) return t('dashboard.greeting_morning')
  if (hour < 18) return t('dashboard.greeting_day')
  return t('dashboard.greeting_evening')
}

export default function Dashboard() {
  const { todayData, updateTodayData } = useDaily()
  const score = useScore()
  const { currentStreak, shieldAvailable, historicalData } = useStreak()
  const { daysSinceLast, alertLevel } = useBowel()
  const { profile } = useOnboarding()
  const xp = useXP()
  const challenge = useChallenges()
  const reduced = useReducedMotion()
  const { t } = useTranslation()
  const modules = profile.activeModules || []
  const hasBowelModule = modules.includes('bowel')
  const foodGuideLabel = hasBowelModule ? t('dashboard.useful_products') : t('dashboard.food_recommendations')
  const variants = reduced ? noMotion : fadeUp

  return (
    <motion.div
      className="min-h-screen"
      initial={reduced ? false : 'hidden'}
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={variants} custom={0} className="px-4 lg:px-6 pt-6 lg:pt-8 pb-2 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-tertiary)] font-medium">{getGreeting(t)}</p>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight mt-0.5">
            {profile.name ? t('dashboard.track_today_named', { name: profile.name }) : t('dashboard.track_today')}
          </h1>
        </div>
        <Link
          to="/settings"
          className="p-2.5 rounded-xl hover:bg-[var(--color-divider)] transition-colors cursor-pointer lg:hidden"
        >
          <Settings size={20} className="text-[var(--color-text-secondary)]" />
        </Link>
      </motion.div>

      <div className="px-4 lg:px-6 pb-8">
        {/* Stat pills — quick glance row */}
        <motion.div variants={variants} custom={1} className="mb-4">
          <StatPills todayData={todayData} profile={profile} />
        </motion.div>

        {/* Alert */}
        {hasBowelModule && alertLevel !== 'normal' && (
          <motion.div variants={variants} custom={1} className="mb-4">
            <BowelAlert daysSinceLast={daysSinceLast} alertLevel={alertLevel} />
          </motion.div>
        )}

        {/* Desktop: 2fr/1fr grid. Mobile: single stack */}
        <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-5 space-y-4 lg:space-y-0">
          {/* Left column — Score + Quick Stats */}
          <div className="space-y-4">
            <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
              <motion.div variants={variants} custom={1}>
                <HealthScoreCard score={score} historicalData={historicalData} />
              </motion.div>
              <div className="space-y-4">
                <motion.div variants={variants} custom={2}>
                  <QuickStats
                    todayData={todayData}
                    daysSinceLast={daysSinceLast}
                    hasBowelModule={hasBowelModule}
                    profile={profile}
                    historicalData={historicalData}
                  />
                </motion.div>
                {currentStreak > 0 && (
                  <motion.div variants={variants} custom={3}>
                    <StreakCounter streak={currentStreak} shieldAvailable={shieldAvailable} />
                  </motion.div>
                )}
                {challenge.activeChallenge && (
                  <motion.div variants={variants} custom={4}>
                    <ChallengeCard {...challenge} onClaim={challenge.claimReward} compact />
                  </motion.div>
                )}
                <motion.div variants={variants} custom={5}>
                  <LevelProgress {...xp} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right column — Mood + Tips + Link */}
          <div className="space-y-4">
            <motion.div variants={variants} custom={3}>
              <MoodSelector
                mood={todayData.mood}
                onSelect={(mood) => updateTodayData({ mood })}
              />
            </motion.div>
            <motion.div variants={variants} custom={4}>
              <SmartTips />
            </motion.div>
            {/* Module-specific quick actions */}
            <motion.div variants={variants} custom={5} className="space-y-2">
              {modules.includes('meals') && (
                <QuickAction to="/meals" icon={UtensilsCrossed} label={t('dashboard.log_meal')} color="var(--color-accent)" />
              )}
              {modules.includes('exercise') && (
                <QuickAction to="/exercise" icon={Dumbbell} label={t('dashboard.log_exercise')} color="var(--color-primary)" />
              )}
              {modules.includes('body') && (
                <QuickAction to="/body" icon={Scale} label={t('dashboard.body_measurements')} color="#6366F1" />
              )}
              <Link
                to="/food-guide"
                className="card card-hover block p-4 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{foodGuideLabel}</span>
                  <ArrowRight size={16} className="text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
