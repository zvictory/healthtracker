import { SCORING_PROFILES } from '../data/scoringProfiles'

export function calculateScore(dailyData, profileType) {
  if (!dailyData) return 0

  const weights = SCORING_PROFILES[profileType] || SCORING_PROFILES.general_wellness
  let score = 0

  // Tasks component
  if (weights.tasks) {
    const tasks = dailyData.tasks || {}
    const taskIds = Object.keys(tasks)
    const completed = taskIds.filter(id => tasks[id]?.done).length
    const total = taskIds.length || 1
    score += (completed / total) * weights.tasks
  }

  // Water component
  if (weights.water) {
    const water = dailyData.water || {}
    const target = water.target || 8
    const consumed = water.consumed || 0
    score += Math.min(consumed / target, 1) * weights.water
  }

  // Bowel component
  if (weights.bowel) {
    score += dailyData.bowel?.happened ? weights.bowel : 0
  }

  // Meals component (sugar-free compliance, calorie target, etc.)
  if (weights.meals) {
    const meals = dailyData.meals || {}
    const entries = meals.entries || []
    if (entries.length > 0) {
      const sugarFreeRatio = entries.filter(m => !m.sugar).length / entries.length
      score += sugarFreeRatio * weights.meals
    }
  }

  // Exercise component
  if (weights.exercise) {
    const exercise = dailyData.exercise || {}
    const minutes = exercise.totalMinutes || 0
    const target = 30 // 30 min daily target
    score += Math.min(minutes / target, 1) * weights.exercise
  }

  // Body component (logged today = points)
  if (weights.body) {
    const body = dailyData.body || {}
    const hasEntry = body.weight || body.glucose?.fasting
    score += hasEntry ? weights.body : 0
  }

  return Math.round(score)
}
