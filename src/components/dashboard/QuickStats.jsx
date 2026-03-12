import { Droplets, Activity, Smile, Meh, Frown } from 'lucide-react'
import { MOOD_OPTIONS } from '../../utils/constants'

const MOOD_ICONS = { good: Smile, okay: Meh, bad: Frown }

export default function QuickStats({ todayData, daysSinceLast }) {
  const water = todayData.water || { consumed: 0, target: 10 }
  const bowelHappened = todayData.bowel?.happened
  const mood = todayData.mood
  const moodOption = MOOD_OPTIONS.find(m => m.id === mood)
  const MoodIcon = mood ? MOOD_ICONS[mood] : Smile

  return (
    <div className="space-y-3">
      {/* Water */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-water-light flex items-center justify-center flex-shrink-0">
            <Droplets size={18} className="text-water" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold">{water.consumed}<span className="text-[var(--color-text-tertiary)] font-normal">/{water.target}</span></span>
              <span className="text-[11px] text-[var(--color-text-tertiary)]">stakan</span>
            </div>
            <div className="mt-1.5 h-2 bg-[var(--color-divider)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((water.consumed / water.target) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #3B82F6, #60A5FA)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bowel + Mood row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              bowelHappened ? 'bg-success-light' : daysSinceLast >= 3 ? 'bg-danger-light' : 'bg-[var(--color-divider)]'
            }`}>
              <Activity size={18} className={bowelHappened ? 'text-success' : daysSinceLast >= 3 ? 'text-danger' : 'text-[var(--color-text-tertiary)]'} />
            </div>
            <div>
              <p className="text-sm font-bold">{bowelHappened ? 'Keldi' : `${daysSinceLast} kun`}</p>
              <p className="text-[11px] text-[var(--color-text-tertiary)]">Ich kelishi</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
              <MoodIcon size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold">{moodOption ? moodOption.label : '—'}</p>
              <p className="text-[11px] text-[var(--color-text-tertiary)]">Kayfiyat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
