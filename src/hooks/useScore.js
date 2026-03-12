import { useEffect } from 'react'
import { useDaily } from './useDaily'
import { useProfile } from './useProfile'
import { calculateScore } from '../utils/scoreCalculator'

export function useScore() {
  const { todayData, updateTodayData } = useDaily()
  const { profile } = useProfile()
  const score = calculateScore(todayData, profile.taskSet)

  useEffect(() => {
    if (todayData.score !== score) {
      updateTodayData({ score })
    }
  }, [score, todayData.score, updateTodayData])

  return score
}
