import { useMemo } from 'react'
import { useDaily } from './useDaily'
import { getSmartTips, getAdaptiveAdvice, getBowelTrendMessage } from '../utils/tipEngine'

export function useSmartTips() {
  const { todayData, getHistoricalData } = useDaily()
  const historicalData = getHistoricalData(14)

  const tips = useMemo(() => getSmartTips(todayData, historicalData), [todayData, historicalData])
  const adaptiveAdvice = useMemo(() => getAdaptiveAdvice(historicalData), [historicalData])
  const bowelTrend = useMemo(() => getBowelTrendMessage(historicalData), [historicalData])

  return { tips, adaptiveAdvice, bowelTrend }
}
