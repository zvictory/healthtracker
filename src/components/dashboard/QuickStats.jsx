import { Droplets, Activity, Smile, Meh, Frown, Dumbbell, UtensilsCrossed } from 'lucide-react'
import { MOOD_OPTIONS } from '../../utils/constants'
import Sparkline from '../shared/Sparkline'

const MOOD_ICONS = { good: Smile, okay: Meh, bad: Frown }

export default function QuickStats({ todayData, daysSinceLast, hasBowelModule = false, profile, historicalData = [] }) {
  const water = todayData.water || { consumed: 0, target: 10 }
  const bowelHappened = todayData.bowel?.happened
  const mood = todayData.mood
  const moodOption = MOOD_OPTIONS.find(m => m.id === mood)
  const MoodIcon = mood ? MOOD_ICONS[mood] : Smile
  const waterProgress = Math.min((water.consumed / water.target) * 100, 100)

  const modules = profile?.activeModules || []

  // Sparkline data — last 7 days of water
  const waterHistory = [...historicalData.slice(0, 7)].reverse().map(d => d.water?.consumed || 0)

  const stats = [
    ...(hasBowelModule ? [{
      key: 'bowel',
      icon: Activity,
      iconClassName: bowelHappened ? 'text-success' : daysSinceLast >= 3 ? 'text-danger' : 'text-[var(--color-text-tertiary)]',
      iconWrapperClassName: bowelHappened ? 'bg-success-light' : daysSinceLast >= 3 ? 'bg-danger-light' : 'bg-[var(--color-divider)]',
      value: bowelHappened ? 'Keldi' : `${daysSinceLast} kun`,
      label: 'Ich kelishi',
    }] : []),
    ...(modules.includes('exercise') ? [{
      key: 'exercise',
      icon: Dumbbell,
      iconClassName: 'text-primary',
      iconWrapperClassName: 'bg-primary-light',
      value: `${todayData.exercise?.totalMinutes || 0} daq`,
      label: 'Mashq',
    }] : []),
    ...(modules.includes('meals') ? [{
      key: 'meals',
      icon: UtensilsCrossed,
      iconClassName: 'text-accent',
      iconWrapperClassName: 'bg-accent-light',
      value: `${todayData.meals?.entries?.length || 0} ta`,
      label: 'Ovqat',
    }] : []),
    {
      key: 'mood',
      icon: MoodIcon,
      iconClassName: 'text-accent',
      iconWrapperClassName: 'bg-accent-light',
      value: moodOption ? moodOption.label : '—',
      label: 'Kayfiyat',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="card overflow-hidden p-4 lg:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-water-light flex items-center justify-center flex-shrink-0">
              <Droplets size={18} className="text-water" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Suv balansi</p>
              <p className="text-lg font-bold mt-1">{water.consumed}<span className="text-[var(--color-text-tertiary)] font-medium">/{water.target}</span></p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-water-light px-3 py-1 text-[11px] font-semibold text-water">{Math.round(waterProgress)}%</span>
            {waterHistory.length >= 2 && (
              <Sparkline data={waterHistory} color="var(--color-water)" height={24} width={64} />
            )}
          </div>
        </div>

        <div className="mt-4 h-2.5 bg-[var(--color-divider)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${waterProgress}%`,
              background: 'linear-gradient(90deg, #2c7fb8, #6fb7df)'
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
          <span>Kun davomida muntazam iching</span>
          <span>stakan</span>
        </div>
      </div>

      <div className={`grid gap-3 ${stats.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
        {stats.map(({ key, icon: Icon, iconClassName, iconWrapperClassName, value, label }) => (
          <div key={key} className="card p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconWrapperClassName}`}>
                <Icon size={18} className={iconClassName} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">{label}</p>
                <p className="mt-1 text-sm font-bold text-[var(--color-text)]">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
