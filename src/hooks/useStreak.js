import { useMemo } from 'react'
import { useDaily } from './useDaily'
import { useProfile } from './useProfile'
import { getAchievements } from '../data/achievements'

export function useStreak() {
  const { getHistoricalData } = useDaily()
  const { profile } = useProfile()

  const historicalData = useMemo(() => getHistoricalData(30), [getHistoricalData])

  // Streak with shield: allows 1 miss per 7-day window
  const { currentStreak, shieldUsed, shieldAvailable } = useMemo(() => {
    let streak = 0
    let shieldUsedInWindow = false
    let missesInWindow = 0

    for (const day of historicalData) {
      if (day.score >= 70) {
        streak++
      } else if (!shieldUsedInWindow) {
        // Use shield — streak survives this miss
        shieldUsedInWindow = true
        missesInWindow++
        streak++
      } else {
        break
      }
      // Reset shield every 7 days
      if (streak % 7 === 0) {
        shieldUsedInWindow = false
        missesInWindow = 0
      }
    }

    return {
      currentStreak: streak,
      shieldUsed: shieldUsedInWindow,
      shieldAvailable: !shieldUsedInWindow,
    }
  }, [historicalData])

  const earnedAchievements = useMemo(() => {
    const profileAchievements = getAchievements(profile.taskSet)
    return profileAchievements.map(a => ({
      ...a,
      ...a.check(historicalData),
    }))
  }, [historicalData, profile.taskSet])

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

  return { currentStreak, shieldUsed, shieldAvailable, earnedAchievements, weeklySummary, historicalData }
}
