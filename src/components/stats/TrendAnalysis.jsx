import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { defaultTasks } from '../../data/defaultTasks'

export default function TrendAnalysis({ historicalData }) {
  const analysis = useMemo(() => {
    if (historicalData.length < 7) return null

    const thisWeek = historicalData.slice(0, 7)
    const lastWeek = historicalData.slice(7, 14)

    const thisAvg = Math.round(thisWeek.reduce((s, d) => s + (d.score || 0), 0) / 7)
    const lastAvg = lastWeek.length === 7
      ? Math.round(lastWeek.reduce((s, d) => s + (d.score || 0), 0) / 7)
      : null

    const thisWater = Math.round(thisWeek.reduce((s, d) => s + (d.water?.consumed || 0), 0) / 7 * 10) / 10
    const lastWater = lastWeek.length === 7
      ? Math.round(lastWeek.reduce((s, d) => s + (d.water?.consumed || 0), 0) / 7 * 10) / 10
      : null

    const thisBowel = thisWeek.filter(d => d.bowel?.happened).length
    const lastBowel = lastWeek.length === 7 ? lastWeek.filter(d => d.bowel?.happened).length : null

    const taskCounts = {}
    thisWeek.forEach(day => {
      if (!day.tasks) return
      Object.entries(day.tasks).forEach(([id, t]) => {
        if (!taskCounts[id]) taskCounts[id] = { done: 0, total: 0 }
        taskCounts[id].total++
        if (t.done) taskCounts[id].done++
      })
    })

    const sorted = Object.entries(taskCounts).sort(([, a], [, b]) => (b.done / b.total) - (a.done / a.total))
    const mostCompleted = sorted.slice(0, 3).map(([id, c]) => ({
      id,
      name: defaultTasks.find(t => t.id === id)?.text?.slice(2) || id,
      rate: Math.round((c.done / c.total) * 100),
    }))
    const mostSkipped = [...sorted].reverse().slice(0, 3).map(([id, c]) => ({
      id,
      name: defaultTasks.find(t => t.id === id)?.text?.slice(2) || id,
      rate: Math.round(((c.total - c.done) / c.total) * 100),
    }))

    return { thisAvg, lastAvg, thisWater, lastWater, thisBowel, lastBowel, mostCompleted, mostSkipped }
  }, [historicalData])

  if (!analysis) return null

  const TrendIcon = ({ current, previous }) => {
    if (previous === null) return <Minus size={14} className="text-[var(--color-text-tertiary)]" />
    if (current > previous) return <TrendingUp size={14} className="text-[var(--color-success)]" />
    if (current < previous) return <TrendingDown size={14} className="text-[var(--color-danger)]" />
    return <Minus size={14} className="text-[var(--color-text-tertiary)]" />
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3">Haftalik taqqoslash</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">O'rtacha ball</span>
            <div className="flex items-center gap-2">
              <TrendIcon current={analysis.thisAvg} previous={analysis.lastAvg} />
              <span className="text-sm font-bold">{analysis.thisAvg}%</span>
              {analysis.lastAvg !== null && (
                <span className="text-xs text-[var(--color-text-tertiary)]">({analysis.lastAvg}%)</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">O'rtacha suv</span>
            <div className="flex items-center gap-2">
              <TrendIcon current={analysis.thisWater} previous={analysis.lastWater} />
              <span className="text-sm font-bold">{analysis.thisWater}</span>
              {analysis.lastWater !== null && (
                <span className="text-xs text-[var(--color-text-tertiary)]">({analysis.lastWater})</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Ich kelishi</span>
            <div className="flex items-center gap-2">
              <TrendIcon current={analysis.thisBowel} previous={analysis.lastBowel} />
              <span className="text-sm font-bold">{analysis.thisBowel}/7 kun</span>
              {analysis.lastBowel !== null && (
                <span className="text-xs text-[var(--color-text-tertiary)]">({analysis.lastBowel}/7)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <h4 className="text-xs font-semibold text-[var(--color-success)] mb-2">Eng ko'p bajarilgan</h4>
          {analysis.mostCompleted.map(t => (
            <div key={t.id} className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] truncate flex-1 mr-1">{t.name}</span>
              <span className="text-[11px] font-bold text-[var(--color-success)]">{t.rate}%</span>
            </div>
          ))}
        </div>
        <div className="card p-4">
          <h4 className="text-xs font-semibold text-[var(--color-danger)] mb-2">Eng ko'p o'tkazilgan</h4>
          {analysis.mostSkipped.map(t => (
            <div key={t.id} className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] truncate flex-1 mr-1">{t.name}</span>
              <span className="text-[11px] font-bold text-[var(--color-danger)]">{t.rate}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
