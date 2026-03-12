import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useBowel } from '../hooks/useBowel'
import BowelLogForm from '../components/bowel/BowelLogForm'
import BowelHistory from '../components/bowel/BowelHistory'
import BowelAlert from '../components/bowel/BowelAlert'
import PageHeader from '../components/shared/PageHeader'

export default function BowelJournal() {
  const { bowel, daysSinceLast, alertLevel, logBowelMovement, history } = useBowel()
  const [showForm, setShowForm] = useState(false)

  const getCounterColor = () => {
    if (daysSinceLast <= 2) return 'text-[var(--color-success)]'
    if (daysSinceLast <= 4) return 'text-[var(--color-warning)]'
    return 'text-[var(--color-danger)]'
  }

  const getCounterBg = () => {
    if (daysSinceLast <= 2) return 'bg-[var(--color-success-light)]'
    if (daysSinceLast <= 4) return 'bg-[var(--color-warning-light)]'
    return 'bg-[var(--color-danger-light)]'
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PageHeader title="Ich Kelish Jurnali" subtitle="Kundalik qaydlar" />

      <div className="px-4 space-y-4 pb-6">
        {/* Big counter */}
        <div className={`${getCounterBg()} card p-6 text-center`}>
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
            {bowel.happened ? 'Bugun ich keldi' : 'Oxirgi ich kelishdan beri'}
          </p>
          <p className={`text-5xl font-extrabold ${getCounterColor()}`}>
            {bowel.happened ? '0' : daysSinceLast}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">kun</p>
        </div>

        {alertLevel !== 'normal' && (
          <BowelAlert daysSinceLast={daysSinceLast} alertLevel={alertLevel} />
        )}

        {/* Log button */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <Plus size={20} />
            Qayd qilish
          </button>
        ) : (
          <BowelLogForm
            onSave={(consistency, notes) => {
              logBowelMovement(consistency, notes)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <BowelHistory history={history} />
      </div>
    </div>
  )
}
