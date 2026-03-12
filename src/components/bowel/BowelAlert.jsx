import { AlertTriangle } from 'lucide-react'

export default function BowelAlert({ daysSinceLast, alertLevel }) {
  if (alertLevel === 'normal') return null
  const isWarning = alertLevel === 'warning'

  return (
    <div className={`rounded-2xl p-4 flex items-start gap-3 ${
      isWarning ? 'bg-warning-light' : 'bg-danger-light'
    }`}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: isWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}
      >
        <AlertTriangle size={16} className={isWarning ? 'text-warning' : 'text-danger'} />
      </div>
      <div>
        <p className={`text-sm font-bold ${isWarning ? 'text-warning' : 'text-danger'}`}>
          {daysSinceLast} kun ich kelmagan
        </p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
          {isWarning
            ? 'Tabiiy usullarni kuchaytiring: lavlagi, zaytun moyi, qorin massaji'
            : "Shifokorga murojaat qilishni o'ylab ko'ring"
          }
        </p>
      </div>
    </div>
  )
}
