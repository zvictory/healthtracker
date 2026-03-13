import { useMemo } from 'react'
import { useDaily } from './useDaily'
import { useProfile } from './useProfile'
import { getSmartTips, getAdaptiveAdvice, getBowelTrendMessage } from '../utils/tipEngine'

export function useSmartTips() {
  const { todayData, getHistoricalData } = useDaily()
  const { profile } = useProfile()
  const historicalData = getHistoricalData(14)

  const tips = useMemo(
    () => getSmartTips(todayData, historicalData, profile.taskSet),
    [todayData, historicalData, profile.taskSet]
  )
  const adaptiveAdvice = useMemo(() => getAdaptiveAdvice(historicalData), [historicalData])
  const bowelTrend = useMemo(() => getBowelTrendMessage(historicalData), [historicalData])

  return { tips, adaptiveAdvice, bowelTrend }
}
