import { BRISTOL_SCALE } from '../../utils/constants'
import { formatDateShort } from '../../utils/dateUtils'

const BRISTOL_COLORS = {
  hard: '#92400E',
  normal: '#10B981',
  soft: '#F59E0B',
  liquid: '#EF4444',
}

export default function BowelHistory({ history }) {
  const bowelDays = history.filter(d => d.bowel?.happened)

  if (bowelDays.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-text-secondary)] text-sm">
        Hozircha qaydlar yo'q
      </div>
    )
  }

  const getBorderColor = (consistency) => {
    switch (consistency) {
      case 'hard': return 'border-l-[var(--color-warning)]'
      case 'normal': return 'border-l-[var(--color-success)]'
      case 'soft': return 'border-l-[var(--color-water)]'
      case 'liquid': return 'border-l-[var(--color-danger)]'
      default: return 'border-l-[var(--color-border)]'
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Oxirgi qaydlar</h3>
      <div className="space-y-2">
        {bowelDays.slice(0, 14).map(day => {
          const bristol = BRISTOL_SCALE.find(b => b.id === day.bowel.consistency)
          return (
            <div
              key={day.date}
              className={`card p-3 border-l-4 ${getBorderColor(day.bowel.consistency)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: BRISTOL_COLORS[day.bowel.consistency] || '#9CA3AF' }} />
                  <div>
                    <p className="text-sm font-medium">{bristol?.label || 'Nomalum'}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      {formatDateShort(day.date)} — {day.bowel.time}
                    </p>
                  </div>
                </div>
              </div>
              {day.bowel.notes && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 ml-8">{day.bowel.notes}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
