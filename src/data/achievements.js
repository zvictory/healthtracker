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

export const achievements = [
  {
    id: 'streak',
    name: 'Ketma-ketlik',
    description: 'Ketma-ket 70%+ ball',
    icon: 'Flame',
    color: '#EF4444',
    thresholds: [3, 7, 14],
    check: (history) => checkConsecutiveDays(history, d => d.score >= 70, [3, 7, 14]),
  },
  {
    id: 'water_master',
    name: 'Suv ustasi',
    description: 'Ketma-ket 10+ stakan',
    icon: 'Droplets',
    color: '#3B82F6',
    thresholds: [3, 7, 14],
    check: (history) => checkConsecutiveDays(history, d => (d.water?.consumed || 0) >= 10, [3, 7, 14]),
  },
  {
    id: 'active_mom',
    name: 'Harakatli ona',
    description: 'Ketma-ket piyoda yurish',
    icon: 'Footprints',
    color: '#10B981',
    thresholds: [3, 7, 14],
    check: (history) => checkConsecutiveDays(history, d => d.tasks?.walking?.done, [3, 7, 14]),
  },
  {
    id: 'healthy_gut',
    name: "Sog'lom oshqozon",
    description: '14 kunda ich kelishi',
    icon: 'HeartPulse',
    color: '#8B5CF6',
    thresholds: [3, 7, 10],
    check: (history) => checkTotalInWindow(history, d => d.bowel?.happened ? 1 : 0, 14, [3, 7, 10]),
  },
  {
    id: 'morning_champ',
    name: 'Ertalab chempioni',
    description: 'Barcha ertalab vazifalari',
    icon: 'Sunrise',
    color: '#F59E0B',
    thresholds: [3, 7, 14],
    check: (history) => {
      const morningTasks = ['morning_water', 'olive_oil', 'dried_apricot_water', 'breakfast_oats']
      return checkConsecutiveDays(history, d => {
        if (!d.tasks) return false
        return morningTasks.every(id => d.tasks[id]?.done)
      }, [3, 7, 14])
    },
  },
  {
    id: 'perfect_day',
    name: 'Mukammal kun',
    description: '100% ball olish',
    icon: 'Star',
    color: '#FFD700',
    thresholds: [1, 3, 7],
    check: (history) => {
      const count = history.filter(d => d.score >= 100).length
      const tier = count >= 7 ? 2 : count >= 3 ? 1 : count >= 1 ? 0 : -1
      const nextTarget = tier < 2 ? [1, 3, 7][tier + 1] : 7
      return {
        earned: tier >= 0,
        tier,
        progress: Math.min(count / nextTarget, 1),
        current: count,
        target: nextTarget,
      }
    },
  },
  {
    id: 'evening_routine',
    name: 'Kechki odat',
    description: 'Barcha kechki vazifalar',
    icon: 'Moon',
    color: '#6366F1',
    thresholds: [3, 7, 14],
    check: (history) => {
      const eveningTasks = ['evening_kefir', 'evening_meal', 'flaxseed', 'stretching']
      return checkConsecutiveDays(history, d => {
        if (!d.tasks) return false
        return eveningTasks.every(id => d.tasks[id]?.done)
      }, [3, 7, 14])
    },
  },
  {
    id: 'hydration_hero',
    name: 'Suv qahramoni',
    description: 'Jami stakan suv ichish',
    icon: 'GlassWater',
    color: '#06B6D4',
    thresholds: [50, 150, 300],
    check: (history) => {
      const total = history.reduce((sum, d) => sum + (d.water?.consumed || 0), 0)
      const tier = total >= 300 ? 2 : total >= 150 ? 1 : total >= 50 ? 0 : -1
      const nextTarget = tier < 2 ? [50, 150, 300][tier + 1] : 300
      return {
        earned: tier >= 0,
        tier,
        progress: Math.min(total / nextTarget, 1),
        current: total,
        target: nextTarget,
      }
    },
  },
]

export { TIERS, TIER_LABELS, TIER_COLORS }
