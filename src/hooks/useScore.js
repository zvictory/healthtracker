import { useEffect } from 'react'
import { useDaily } from './useDaily'
import { calculateScore } from '../utils/scoreCalculator'

export function useScore() {
  const { todayData, updateTodayData } = useDaily()
  const score = calculateScore(todayData)

  useEffect(() => {
    if (todayData.score !== score) {
      updateTodayData({ score })
    }
  }, [score, todayData.score, updateTodayData])

  return score
}
