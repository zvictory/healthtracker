import { getTaskSet } from './taskSets'

// Tier thresholds: bronze → silver → gold
const TIERS = { bronze: 0, silver: 1, gold: 2 }
const TIER_LABELS = ['Bronza', 'Kumush', 'Oltin']
const TIER_COLORS = ['#CD7F32', '#C0C0C0', '#FFD700']

function checkConsecutiveDays(history, predicate, thresholds = [3, 7, 14]) {
  let count = 0
  for (const day of history) {
    if (predicate(day)) count++
    else break
  }
  const tier = count >= thresholds[2] ? 2 : count >= thresholds[1] ? 1 : count >= thresholds[0] ? 0 : -1
  const nextThreshold = tier < 2 ? thresholds[tier + 1] : thresholds[2]
  return {
    earned: tier >= 0,
    tier,
    progress: Math.min(count / nextThreshold, 1),
    current: count,
    target: nextThreshold,
  }
}

function checkTotalInWindow(history, countFn, window, thresholds) {
  const slice = history.slice(0, window)
  const count = slice.reduce((sum, day) => sum + countFn(day), 0)
  const tier = count >= thresholds[2] ? 2 : count >= thresholds[1] ? 1 : count >= thresholds[0] ? 0 : -1
  const nextThreshold = tier < 2 ? thresholds[tier + 1] : thresholds[2]
  return {
    earned: tier >= 0,
    tier,
    progress: Math.min(count / nextThreshold, 1),
    current: count,
    target: nextThreshold,
  }
}

function getGroupTasks(taskSetId, group) {
  const tasks = getTaskSet(taskSetId)
  return tasks.filter(t => t.group === group).map(t => t.id)
}

// Universal achievements (all profiles)
const universalAchievements = [
  {
    id: 'streak',
    name: 'Ketma-ketlik',
    description: 'Ketma-ket 70%+ ball',
    icon: 'Flame',
    color: '#EF4444',
    check: (history) => checkConsecutiveDays(history, d => d.score >= 70, [3, 7, 14]),
  },
  {
    id: 'water_master',
    name: 'Suv ustasi',
    description: 'Ketma-ket maqsadga yetish',
    icon: 'Droplets',
    color: '#3B82F6',
    check: (history) => checkConsecutiveDays(history, d => {
      const w = d.water || {}
      return (w.consumed || 0) >= (w.target || 8)
    }, [3, 7, 14]),
  },
  {
    id: 'perfect_day',
    name: 'Mukammal kun',
    description: '100% ball olish',
    icon: 'Star',
    color: '#FFD700',
    check: (history) => {
      const count = history.filter(d => d.score >= 100).length
      const tier = count >= 7 ? 2 : count >= 3 ? 1 : count >= 1 ? 0 : -1
      const nextTarget = tier < 2 ? [1, 3, 7][tier + 1] : 7
      return { earned: tier >= 0, tier, progress: Math.min(count / nextTarget, 1), current: count, target: nextTarget }
    },
  },
  {
    id: 'hydration_hero',
    name: 'Suv qahramoni',
    description: 'Jami stakan suv ichish',
    icon: 'GlassWater',
    color: '#06B6D4',
    check: (history) => {
      const total = history.reduce((sum, d) => sum + (d.water?.consumed || 0), 0)
      const tier = total >= 300 ? 2 : total >= 150 ? 1 : total >= 50 ? 0 : -1
      const nextTarget = tier < 2 ? [50, 150, 300][tier + 1] : 300
      return { earned: tier >= 0, tier, progress: Math.min(total / nextTarget, 1), current: total, target: nextTarget }
    },
  },
]

// Dynamic achievements that adapt to the user's task set
function getDynamicAchievements(taskSetId) {
  const morningTasks = getGroupTasks(taskSetId, 'morning')
  const eveningTasks = getGroupTasks(taskSetId, 'evening')
  const dayTasks = getGroupTasks(taskSetId, 'day')

  const dynamic = [
    {
      id: 'morning_champ',
      name: 'Ertalab chempioni',
      description: 'Barcha ertalab vazifalari',
      icon: 'Sunrise',
      color: '#F59E0B',
      check: (history) => checkConsecutiveDays(history, d => {
        if (!d.tasks || morningTasks.length === 0) return false
        return morningTasks.every(id => d.tasks[id]?.done)
      }, [3, 7, 14]),
    },
    {
      id: 'evening_routine',
      name: 'Kechki odat',
      description: 'Barcha kechki vazifalar',
      icon: 'Moon',
      color: '#6366F1',
      check: (history) => checkConsecutiveDays(history, d => {
        if (!d.tasks || eveningTasks.length === 0) return false
        return eveningTasks.every(id => d.tasks[id]?.done)
      }, [3, 7, 14]),
    },
  ]

  // Walking achievement — only if walking task exists
  const hasWalking = dayTasks.includes('walking') || dayTasks.includes('post_meal_walk') || dayTasks.includes('morning_walk')
  if (hasWalking) {
    const walkTaskId = dayTasks.find(id => id.includes('walk'))
    dynamic.push({
      id: 'active_walker',
      name: 'Faol yuruvchi',
      description: 'Ketma-ket piyoda yurish',
      icon: 'Footprints',
      color: '#10B981',
      check: (history) => checkConsecutiveDays(history, d => d.tasks?.[walkTaskId]?.done, [3, 7, 14]),
    })
  }

  // Bowel achievement — only for profiles with bowel tracking
  const hasBowel = taskSetId === 'breastfeeding_constipation' || taskSetId === 'general_wellness'
  if (hasBowel) {
    dynamic.push({
      id: 'healthy_gut',
      name: "Sog'lom oshqozon",
      description: '14 kunda ich kelishi',
      icon: 'HeartPulse',
      color: '#8B5CF6',
      check: (history) => checkTotalInWindow(history, d => d.bowel?.happened ? 1 : 0, 14, [3, 7, 10]),
    })
  }

  return dynamic
}

export function getAchievements(taskSetId = 'general_wellness') {
  return [...universalAchievements, ...getDynamicAchievements(taskSetId)]
}

// Legacy export for backward compat
export const achievements = getAchievements('breastfeeding_constipation')

export { TIERS, TIER_LABELS, TIER_COLORS }
