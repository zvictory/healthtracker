import { dynamicTips, motivationalMessages } from '../data/tips.js'
import { CONSTIPATION_WARNING_DAYS, DANGER_DAYS } from './constants.js'

export function getDaysSinceLastBowel(historicalData) {
  for (let i = 0; i < historicalData.length; i++) {
    if (historicalData[i]?.bowel?.happened) return i
  }
  return historicalData.length
}

export function getSmartTips(dailyData, historicalData) {
  const tips = []
  const daysSinceBowel = getDaysSinceLastBowel(historicalData)

  if (daysSinceBowel >= DANGER_DAYS) {
    tips.push(...dynamicTips.no_bowel_5days)
  } else if (daysSinceBowel >= CONSTIPATION_WARNING_DAYS) {
    tips.push(...dynamicTips.no_bowel_3days)
  }

  const water = dailyData?.water || {}
  if ((water.consumed || 0) < (water.target || 10) * 0.5) {
    tips.push(dynamicTips.low_water[Math.floor(Math.random() * dynamicTips.low_water.length)])
  }

  const tasks = dailyData?.tasks || {}
  if (!tasks.walking?.done) {
    const skippedWalking = historicalData.slice(0, 3).filter(d => !d.tasks?.walking?.done).length
    if (skippedWalking >= 2) {
      tips.push(dynamicTips.skipped_walking[0])
    }
  }

  if (!tasks.belly_massage?.done) {
    const skippedMassage = historicalData.slice(0, 3).filter(d => !d.tasks?.belly_massage?.done).length
    if (skippedMassage >= 2) {
      tips.push(dynamicTips.skipped_massage[0])
    }
  }

  if (tips.length === 0) {
    const msgs = dailyData?.score >= 70 ? motivationalMessages.good_score : motivationalMessages.low_score
    tips.push(msgs[Math.floor(Math.random() * msgs.length)])
  }

  return tips
}

export function getAdaptiveAdvice(historicalData) {
  if (historicalData.length < 3) return null

  const last7 = historicalData.slice(0, 7)
  const taskSkipCounts = {}

  last7.forEach(day => {
    if (!day.tasks) return
    Object.entries(day.tasks).forEach(([id, task]) => {
      if (!task.done) {
        taskSkipCounts[id] = (taskSkipCounts[id] || 0) + 1
      }
    })
  })

  const mostSkipped = Object.entries(taskSkipCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, count]) => ({ id, count }))

  return { mostSkipped }
}

export function getBowelTrendMessage(historicalData) {
  if (historicalData.length < 7) return null

  const thisWeek = historicalData.slice(0, 7).filter(d => d.bowel?.happened).length
  const lastWeek = historicalData.slice(7, 14).filter(d => d.bowel?.happened).length

  if (historicalData.length < 14) return null

  if (thisWeek > lastWeek) return { trend: 'improving', message: "📈 Bu hafta ich kelishi yaxshilanyapti!" }
  if (thisWeek < lastWeek) return { trend: 'worsening', message: "📉 Bu hafta ich kelishi kamaydi. Sabzavot va suv miqdorini oshiring." }
  return { trend: 'stable', message: "➡️ Ich kelishi barqaror. Davom eting!" }
}
