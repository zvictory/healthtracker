import { useCallback, useMemo } from 'react'
import { useDaily } from './useDaily'
import { formatTime } from '../utils/dateUtils'
import { CONSTIPATION_WARNING_DAYS, DANGER_DAYS } from '../utils/constants'
import { getDaysSinceLastBowel } from '../utils/tipEngine'

export function useBowel() {
  const { todayData, updateTodayData, getHistoricalData } = useDaily()
  const bowel = todayData.bowel || { happened: false, time: null, consistency: null, notes: '' }

  const historicalData = getHistoricalData(14)
  const daysSinceLast = getDaysSinceLastBowel(historicalData)

  const logBowelMovement = useCallback((consistency, notes = '') => {
    updateTodayData({
      bowel: { happened: true, time: formatTime(), consistency, notes },
    })
  }, [updateTodayData])

  const alertLevel = useMemo(() => {
    if (daysSinceLast >= DANGER_DAYS) return 'danger'
    if (daysSinceLast >= CONSTIPATION_WARNING_DAYS) return 'warning'
    return 'normal'
  }, [daysSinceLast])

  return {
    bowel,
    daysSinceLast,
    alertLevel,
    logBowelMovement,
    history: historicalData,
  }
}
