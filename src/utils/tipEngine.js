import { getTipSet } from '../data/tipSets'
import { motivationalMessages } from '../data/tips.js'
import { CONSTIPATION_WARNING_DAYS, DANGER_DAYS } from './constants.js'

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getDaysSinceLastBowel(historicalData) {
  for (let i = 0; i < historicalData.length; i++) {
    if (historicalData[i]?.bowel?.happened) return i
  }
  return historicalData.length
}

export function getSmartTips(dailyData, historicalData, profileType) {
  const tips = []
  const tipSet = getTipSet(profileType)

  // Water check — universal across profiles
  const water = dailyData?.water || {}
  if ((water.consumed || 0) < (water.target || 8) * 0.5) {
    if (tipSet.low_water) tips.push(pick(tipSet.low_water))
  }

  // Bowel check — only for profiles that track it
  if (tipSet.bowel_warning || tipSet.bowel_danger) {
    const daysSinceBowel = getDaysSinceLastBowel(historicalData)
    if (daysSinceBowel >= DANGER_DAYS && tipSet.bowel_danger) {
      tips.push(...tipSet.bowel_danger)
    } else if (daysSinceBowel >= CONSTIPATION_WARNING_DAYS && tipSet.bowel_warning) {
      tips.push(pick(tipSet.bowel_warning))
    }
  }

  // Task-specific checks
  const tasks = dailyData?.tasks || {}
  const last3 = historicalData.slice(0, 3)

  if (!tasks.walking?.done && tipSet.skipped_walking) {
    const skipped = last3.filter(d => !d.tasks?.walking?.done).length
    if (skipped >= 2) tips.push(pick(tipSet.skipped_walking))
  }

  if (!tasks.belly_massage?.done && tipSet.skipped_massage) {
    const skipped = last3.filter(d => !d.tasks?.belly_massage?.done).length
    if (skipped >= 2) tips.push(pick(tipSet.skipped_massage))
  }

  // Profile-specific: exercise skipping (fat_burning)
  if (tipSet.skipped_exercise) {
    const exerciseTasks = ['hiit_workout', 'strength_training', 'cardio']
    const anyExerciseDone = exerciseTasks.some(t => tasks[t]?.done)
    if (!anyExerciseDone) {
      const skippedDays = last3.filter(d => {
        return !exerciseTasks.some(t => d.tasks?.[t]?.done)
      }).length
      if (skippedDays >= 2) tips.push(pick(tipSet.skipped_exercise))
    }
  }

  // Profile-specific: sugar craving tips (sugar_free)
  if (tipSet.sugar_craving) {
    const sugarTasks = ['avoid_sugar_triggers', 'read_labels']
    const skippedSugar = last3.filter(d => {
      return !sugarTasks.some(t => d.tasks?.[t]?.done)
    }).length
    if (skippedSugar >= 2) tips.push(pick(tipSet.sugar_craving))
  }

  // Profile-specific: high sugar risk (insulin_resistance)
  if (tipSet.high_sugar_risk) {
    const mealTasks = ['sugar_free_meal', 'balanced_lunch']
    const skipped = last3.filter(d => {
      return !mealTasks.some(t => d.tasks?.[t]?.done)
    }).length
    if (skipped >= 2) tips.push(pick(tipSet.high_sugar_risk))
  }

  // Fill with general tips if nothing triggered
  if (tips.length === 0 && tipSet.general) {
    tips.push(pick(tipSet.general))
  }

  // Fallback motivational message
  if (tips.length === 0) {
    const msgs = dailyData?.score >= 70 ? motivationalMessages.good_score : motivationalMessages.low_score
    tips.push(pick(msgs))
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
  if (historicalData.length < 14) return null

  const thisWeek = historicalData.slice(0, 7).filter(d => d.bowel?.happened).length
  const lastWeek = historicalData.slice(7, 14).filter(d => d.bowel?.happened).length

  if (thisWeek > lastWeek) return { trend: 'improving', message: "Bu hafta ich kelishi yaxshilanyapti!" }
  if (thisWeek < lastWeek) return { trend: 'worsening', message: "Bu hafta ich kelishi kamaydi. Sabzavot va suv miqdorini oshiring." }
  return { trend: 'stable', message: "Ich kelishi barqaror. Davom eting!" }
}
