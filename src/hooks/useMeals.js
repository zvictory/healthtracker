import { useCallback, useMemo } from 'react'
import { useDaily } from './useDaily'

export function useMeals() {
  const { todayData, updateTodayData } = useDaily()

  const meals = todayData.meals || { entries: [], totalCalories: 0, sugarFreeStreak: true }

  const addMeal = useCallback((entry) => {
    const newEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
      ...entry,
    }
    const entries = [...meals.entries, newEntry]
    const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0)
    const sugarFreeStreak = entries.every(e => !e.hasSugar)
    updateTodayData({ meals: { entries, totalCalories, sugarFreeStreak } })
  }, [meals, updateTodayData])

  const removeMeal = useCallback((id) => {
    const entries = meals.entries.filter(e => e.id !== id)
    const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0)
    const sugarFreeStreak = entries.every(e => !e.hasSugar)
    updateTodayData({ meals: { entries, totalCalories, sugarFreeStreak } })
  }, [meals, updateTodayData])

  const mealCount = meals.entries.length
  const hasMeals = mealCount > 0

  return { meals, addMeal, removeMeal, mealCount, hasMeals }
}
