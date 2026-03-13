import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Dumbbell, UtensilsCrossed } from 'lucide-react'
import { getTaskSet } from '../../data/taskSets'

export default function TrendAnalysis({ historicalData, profile }) {
  const analysis = useMemo(() => {
    if (historicalData.length < 7) return null

    const thisWeek = historicalData.slice(0, 7)
    const lastWeek = historicalData.slice(7, 14)
    const hasLastWeek = lastWeek.length === 7

    const thisAvg = Math.round(thisWeek.reduce((s, d) => s + (d.score || 0), 0) / 7)
    const lastAvg = hasLastWeek
      ? Math.round(lastWeek.reduce((s, d) => s + (d.score || 0), 0) / 7)
      : null

    const thisWater = Math.round(thisWeek.reduce((s, d) => s + (d.water?.consumed || 0), 0) / 7 * 10) / 10
    const lastWater = hasLastWeek
      ? Math.round(lastWeek.reduce((s, d) => s + (d.water?.consumed || 0), 0) / 7 * 10) / 10
      : null

    // Bowel — only for bowel profiles
    const hasBowel = profile?.activeModules?.includes('bowel')
    const thisBowel = hasBowel ? thisWeek.filter(d => d.bowel?.happened).length : null
    const lastBowel = hasBowel && hasLastWeek ? lastWeek.filter(d => d.bowel?.happened).length : null

    // Exercise — only for exercise profiles
    const hasExercise = profile?.activeModules?.includes('exercise')
    const thisExercise = hasExercise
      ? Math.round(thisWeek.reduce((s, d) => s + (d.exercise?.totalMinutes || 0), 0) / 7)
      : null
    const lastExercise = hasExercise && hasLastWeek
      ? Math.round(lastWeek.reduce((s, d) => s + (d.exercise?.totalMinutes || 0), 0) / 7)
      : null

    // Meals — only for meals profiles
    const hasMeals = profile?.activeModules?.includes('meals')
    const thisMeals = hasMeals
      ? Math.round(thisWeek.reduce((s, d) => s + (d.meals?.entries?.length || 0), 0) / 7 * 10) / 10
      : null
    const lastMeals = hasMeals && hasLastWeek
      ? Math.round(lastWeek.reduce((s, d) => s + (d.meals?.entries?.length || 0), 0) / 7 * 10) / 10
      : null

    // Task analysis with profile-aware task names
    const tasks = getTaskSet(profile?.taskSet || 'general_wellness')
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
    const getTaskName = (id) => {
      const task = tasks.find(t => t.id === id)
      return task ? task.text.replace(/^.\s*/, '') : id
    }
    const mostCompleted = sorted.slice(0, 3).map(([id, c]) => ({
      id,
      name: getTaskName(id),
      rate: Math.round((c.done / c.total) * 100),
    }))
    const mostSkipped = [...sorted].reverse().slice(0, 3).map(([id, c]) => ({
      id,
      name: getTaskName(id),
      rate: Math.round(((c.total - c.done) / c.total) * 100),
    }))

    return {
      thisAvg, lastAvg, thisWater, lastWater,
      thisBowel, lastBowel, hasBowel,
      thisExercise, lastExercise, hasExercise,
      thisMeals, lastMeals, hasMeals,
      mostCompleted, mostSkipped,
    }
  }, [historicalData, profile])

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
          {analysis.hasBowel && (
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
          )}
          {analysis.hasExercise && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Mashq (o'rt. daq/kun)</span>
              <div className="flex items-center gap-2">
                <TrendIcon current={analysis.thisExercise} previous={analysis.lastExercise} />
                <span className="text-sm font-bold">{analysis.thisExercise} daq</span>
                {analysis.lastExercise !== null && (
                  <span className="text-xs text-[var(--color-text-tertiary)]">({analysis.lastExercise})</span>
                )}
              </div>
            </div>
          )}
          {analysis.hasMeals && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Ovqat (o'rt. yozuv/kun)</span>
              <div className="flex items-center gap-2">
                <TrendIcon current={analysis.thisMeals} previous={analysis.lastMeals} />
                <span className="text-sm font-bold">{analysis.thisMeals}</span>
                {analysis.lastMeals !== null && (
                  <span className="text-xs text-[var(--color-text-tertiary)]">({analysis.lastMeals})</span>
                )}
              </div>
            </div>
          )}
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
