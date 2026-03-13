import { useCallback } from 'react'
import { useDaily } from './useDaily'

export function useBody() {
  const { todayData, updateTodayData, getHistoricalData } = useDaily()

  const body = todayData.body || { weight: null, waist: null, glucose: { fasting: null, postMeal: null } }

  const updateBody = useCallback((partial) => {
    updateTodayData({ body: { ...body, ...partial } })
  }, [body, updateTodayData])

  const updateGlucose = useCallback((partial) => {
    updateTodayData({
      body: { ...body, glucose: { ...body.glucose, ...partial } }
    })
  }, [body, updateTodayData])

  // Get weight trend from historical data
  const getWeightTrend = useCallback((days = 14) => {
    const history = getHistoricalData(days)
    return history
      .filter(d => d.body?.weight)
      .map(d => ({ date: d.date, weight: d.body.weight }))
      .reverse()
  }, [getHistoricalData])

  const getGlucoseTrend = useCallback((days = 14) => {
    const history = getHistoricalData(days)
    return history
      .filter(d => d.body?.glucose?.fasting || d.body?.glucose?.postMeal)
      .map(d => ({ date: d.date, ...d.body.glucose }))
      .reverse()
  }, [getHistoricalData])

  return { body, updateBody, updateGlucose, getWeightTrend, getGlucoseTrend }
}
