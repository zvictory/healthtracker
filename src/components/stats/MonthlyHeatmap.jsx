import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths } from 'date-fns'
import { useDaily } from '../../hooks/useDaily'

const WEEKDAYS = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']

export default function MonthlyHeatmap() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { getDayData } = useDaily()
  const [selectedDay, setSelectedDay] = useState(null)

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })
    const startDayOfWeek = (getDay(start) + 6) % 7
    return Array(startDayOfWeek).fill(null).concat(days)
  }, [currentMonth])

  const getCellColor = (date) => {
    if (!date) return ''
    const key = format(date, 'yyyy-MM-dd')
    const data = getDayData(key)
    if (!data) return 'bg-[var(--color-divider)]'

    const score = data.score || 0
    const bowel = data.bowel?.happened

    if (bowel && score >= 70) return 'bg-[var(--color-success)] text-white'
    if (score >= 40) return 'bg-[var(--color-warning)] text-white'
    if (score > 0) return 'bg-[var(--color-danger)] text-white'
    return 'bg-[var(--color-divider)]'
  }

  const selectedDayData = useMemo(() => {
    if (!selectedDay) return null
    return getDayData(format(selectedDay, 'yyyy-MM-dd'))
  }, [selectedDay, getDayData])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-[var(--color-divider)] transition-colors cursor-pointer">
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-sm font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-[var(--color-divider)] transition-colors cursor-pointer">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-[var(--color-text-tertiary)]">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => (
            <button
              key={i}
              disabled={!day}
              onClick={() => day && setSelectedDay(day)}
              className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                day ? getCellColor(day) + ' hover:ring-2 hover:ring-primary' : ''
              } ${selectedDay && day && format(day, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd') ? 'ring-2 ring-primary-dark' : ''}`}
            >
              {day ? format(day, 'd') : ''}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-[var(--color-text-tertiary)]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-success)' }} /> 70%+
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-warning)' }} /> 40-69%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-danger)' }} /> &lt;40%
          </span>
        </div>
      </div>

      {selectedDayData && (
        <div className="card p-4 animate-fade-in">
          <h4 className="text-sm font-semibold mb-2">
            {format(selectedDay, 'dd.MM.yyyy')} — ma'lumotlar
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-[var(--color-success)]">{selectedDayData.score || 0}%</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Ball</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--color-water)]">{selectedDayData.water?.consumed || 0}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Suv</p>
            </div>
            <div>
              <p className="text-lg font-bold">{selectedDayData.bowel?.happened ? 'Ha' : "Yo'q"}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Ich kelishi</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
