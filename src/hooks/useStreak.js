import { useMemo } from 'react'
import { useDaily } from './useDaily'
import { achievements } from '../data/achievements'

export function useStreak() {
  const { getHistoricalData } = useDaily()

  const historicalData = getHistoricalData(30)

  const currentStreak = useMemo(() => {
    let streak = 0
    for (const day of historicalData) {
      if (day.score >= 70) streak++
      else break
    }
    return streak
  }, [historicalData])

  const earnedAchievements = useMemo(() => {
    return achievements.map(a => ({
      ...a,
      ...a.check(historicalData),
    }))
  }, [historicalData])

  const weeklySummary = useMemo(() => {
    const week = historicalData.slice(0, 7)
    const avgScore = Math.round(week.reduce((sum, d) => sum + (d.score || 0), 0) / 7)
    const totalWater = week.reduce((sum, d) => sum + (d.water?.consumed || 0), 0)
    const bowelDays = week.filter(d => d.bowel?.happened).length
    const completedTasks = week.reduce((sum, d) => {
      const tasks = d.tasks || {}
      return sum + Object.values(tasks).filter(t => t.done).length
    }, 0)

    return { avgScore, totalWater, bowelDays, completedTasks }
  }, [historicalData])

  return { currentStreak, earnedAchievements, weeklySummary, historicalData }
}
