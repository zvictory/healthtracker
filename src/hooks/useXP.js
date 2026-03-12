import { useMemo } from 'react'
import { useDaily } from './useDaily'

// Level N requires 25 * N * (N + 1) cumulative XP
// Level 1: 50, Level 5: 750, Level 10: 2750, Level 20: 10500
function getLevel(totalXP) {
  // Solve: 25 * n * (n+1) <= totalXP → n ≈ sqrt(totalXP/25)
  let level = 0
  while (25 * (level + 1) * (level + 2) <= totalXP) {
    level++
  }
  return level
}

function xpForLevel(n) {
  return 25 * n * (n + 1)
}

const LEVEL_NAMES = [
  'Yangi boshlovchi',    // 0
  'Birinchi qadam',      // 1
  'Izlanuvchi',          // 2
  'Harakat qiluvchi',    // 3
  'Odatchi',             // 4
  'Intizomli',           // 5
  'Barqaror',            // 6
  'Tajribali',           // 7
  'Ustoz',               // 8
  'Yulduz',              // 9
  'Chempion',            // 10+
]

export function useXP() {
  const { allData } = useDaily()

  const { totalXP, level, levelName, xpInLevel, xpToNext, progress } = useMemo(() => {
    const total = Object.values(allData).reduce((sum, day) => sum + (day.score || 0), 0)
    const lvl = getLevel(total)
    const currentLevelXP = xpForLevel(lvl)
    const nextLevelXP = xpForLevel(lvl + 1)
    const inLevel = total - currentLevelXP
    const needed = nextLevelXP - currentLevelXP

    return {
      totalXP: total,
      level: lvl,
      levelName: LEVEL_NAMES[Math.min(lvl, LEVEL_NAMES.length - 1)],
      xpInLevel: inLevel,
      xpToNext: needed,
      progress: needed > 0 ? inLevel / needed : 1,
    }
  }, [allData])

  return { totalXP, level, levelName, xpInLevel, xpToNext, progress }
}
