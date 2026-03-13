import { useCallback } from 'react'
import { useDaily } from './useDaily'

export function useExercise() {
  const { todayData, updateTodayData } = useDaily()

  const exercise = todayData.exercise || { entries: [], totalMinutes: 0, totalCalories: 0 }

  const addExercise = useCallback((entry) => {
    const newEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
      ...entry,
    }
    const entries = [...exercise.entries, newEntry]
    const totalMinutes = entries.reduce((sum, e) => sum + (e.minutes || 0), 0)
    const totalCalories = entries.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0)
    updateTodayData({ exercise: { entries, totalMinutes, totalCalories } })
  }, [exercise, updateTodayData])

  const removeExercise = useCallback((id) => {
    const entries = exercise.entries.filter(e => e.id !== id)
    const totalMinutes = entries.reduce((sum, e) => sum + (e.minutes || 0), 0)
    const totalCalories = entries.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0)
    updateTodayData({ exercise: { entries, totalMinutes, totalCalories } })
  }, [exercise, updateTodayData])

  return { exercise, addExercise, removeExercise }
}
