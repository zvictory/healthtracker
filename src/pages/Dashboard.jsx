import { Link } from 'react-router-dom'
import { Settings, ArrowRight } from 'lucide-react'
import { useDaily } from '../hooks/useDaily'
import { useScore } from '../hooks/useScore'
import { useStreak } from '../hooks/useStreak'
import { useBowel } from '../hooks/useBowel'
import { useOnboarding } from '../hooks/useOnboarding'
import HealthScoreCard from '../components/dashboard/HealthScoreCard'
import QuickStats from '../components/dashboard/QuickStats'
import MoodSelector from '../components/dashboard/MoodSelector'
import SmartTips from '../components/dashboard/SmartTips'
import StreakCounter from '../components/dashboard/StreakCounter'
import BowelAlert from '../components/bowel/BowelAlert'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Xayrli tong!'
  if (hour < 18) return 'Xayrli kun!'
  return 'Xayrli kech!'
}

export default function Dashboard() {
  const { todayData, updateTodayData } = useDaily()
  const score = useScore()
  const { currentStreak } = useStreak()
  const { daysSinceLast, alertLevel } = useBowel()
  const { profile } = useOnboarding()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 lg:px-6 pt-6 lg:pt-8 pb-2 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-tertiary)] font-medium">{getGreeting()}</p>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight mt-0.5">
            {profile.name ? `${profile.name}, bugungi holatni kuzating` : 'Bugungi holatni kuzating'}
          </h1>
        </div>
        <Link
          to="/settings"
          className="p-2.5 rounded-xl hover:bg-[var(--color-divider)] transition-colors cursor-pointer lg:hidden"
        >
          <Settings size={20} className="text-[var(--color-text-secondary)]" />
        </Link>
      </div>

      <div className="px-4 lg:px-6 pb-8">
        {/* Alert */}
        {alertLevel !== 'normal' && (
          <div className="mb-4">
            <BowelAlert daysSinceLast={daysSinceLast} alertLevel={alertLevel} />
          </div>
        )}

        {/* Desktop: 2fr/1fr grid. Mobile: single stack */}
        <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-5 space-y-4 lg:space-y-0">
          {/* Left column — Score + Quick Stats */}
          <div className="space-y-4">
            <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
              <HealthScoreCard score={score} />
              <div className="space-y-4">
                <QuickStats todayData={todayData} daysSinceLast={daysSinceLast} />
                {currentStreak > 0 && <StreakCounter streak={currentStreak} />}
              </div>
            </div>
          </div>

          {/* Right column — Mood + Tips + Link */}
          <div className="space-y-4">
            <MoodSelector
              mood={todayData.mood}
              onSelect={(mood) => updateTodayData({ mood })}
            />
            <SmartTips />
            <Link
              to="/food-guide"
              className="card card-hover block p-5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">Foydali mahsulotlar</span>
                <ArrowRight size={16} className="text-primary transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
