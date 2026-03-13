import { useState, lazy, Suspense } from 'react'
import { useStreak } from '../hooks/useStreak'
import PageHeader from '../components/shared/PageHeader'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const WeeklyCharts = lazy(() => import('../components/stats/WeeklyCharts'))
const MonthlyHeatmap = lazy(() => import('../components/stats/MonthlyHeatmap'))
const TrendAnalysis = lazy(() => import('../components/stats/TrendAnalysis'))
const AchievementBadges = lazy(() => import('../components/stats/AchievementBadges'))
const WeeklySummary = lazy(() => import('../components/stats/WeeklySummary'))

const tabs = [
  { id: 'weekly', label: 'Haftalik' },
  { id: 'monthly', label: 'Oylik' },
  { id: 'achievements', label: 'Yutuqlar' },
]

export default function Statistics() {
  const [activeTab, setActiveTab] = useState('weekly')
  const { earnedAchievements, weeklySummary, historicalData } = useStreak()

  return (
    <div>
      <PageHeader title="Statistika" subtitle="Natijalaringizni kuzating" />

      <div className="px-4">
        <div className="card flex p-1.5 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <div className="space-y-4 pb-6">
            {activeTab === 'weekly' && (
              <>
                <WeeklySummary summary={weeklySummary} />
                <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                  <WeeklyCharts historicalData={historicalData} />
                  <TrendAnalysis historicalData={historicalData} />
                </div>
              </>
            )}
            {activeTab === 'monthly' && (
              <MonthlyHeatmap historicalData={historicalData} />
            )}
            {activeTab === 'achievements' && (
              <AchievementBadges achievements={earnedAchievements} />
            )}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
