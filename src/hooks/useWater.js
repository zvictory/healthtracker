import { useCallback, useMemo } from 'react'
import { useDaily } from './useDaily'
import { CONSTIPATION_WATER_TARGET, DEFAULT_WATER_TARGET, CONSTIPATION_WARNING_DAYS } from '../utils/constants'
import { formatTime } from '../utils/dateUtils'
import { getDaysSinceLastBowel } from '../utils/tipEngine'

export function useWater() {
  const { todayData, updateTodayData, getHistoricalData } = useDaily()
  const water = todayData.water || { target: DEFAULT_WATER_TARGET, consumed: 0, log: [] }

  const historicalData = getHistoricalData(7)
  const daysSinceBowel = getDaysSinceLastBowel(historicalData)
  const effectiveTarget = daysSinceBowel >= CONSTIPATION_WARNING_DAYS ? CONSTIPATION_WATER_TARGET : water.target

  const addGlass = useCallback(() => {
    const log = [...(water.log || []), formatTime()]
    updateTodayData({
      water: { consumed: water.consumed + 1, log, target: effectiveTarget },
    })
  }, [water, updateTodayData, effectiveTarget])

  const removeGlass = useCallback(() => {
    if (water.consumed <= 0) return
    const log = [...(water.log || [])]
    log.pop()
    updateTodayData({
      water: { consumed: water.consumed - 1, log, target: effectiveTarget },
    })
  }, [water, updateTodayData, effectiveTarget])

  const progress = useMemo(() => {
    return Math.min((water.consumed / effectiveTarget) * 100, 100)
  }, [water.consumed, effectiveTarget])

  return {
    consumed: water.consumed,
    target: effectiveTarget,
    log: water.log || [],
    progress,
    isConstipationMode: daysSinceBowel >= CONSTIPATION_WARNING_DAYS,
    addGlass,
    removeGlass,
  }
}
