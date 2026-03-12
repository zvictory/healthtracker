export function calculateScore(dailyData) {
  if (!dailyData) return 0

  const tasks = dailyData.tasks || {}
  const taskIds = Object.keys(tasks)
  const completedTasks = taskIds.filter(id => tasks[id]?.done).length
  const totalTasks = taskIds.length || 1

  const taskScore = (completedTasks / totalTasks) * 70

  const water = dailyData.water || {}
  const waterTarget = water.target || 10
  const waterConsumed = water.consumed || 0
  const waterScore = Math.min(waterConsumed / waterTarget, 1) * 20

  const bowelScore = dailyData.bowel?.happened ? 10 : 0

  return Math.round(taskScore + waterScore + bowelScore)
}
