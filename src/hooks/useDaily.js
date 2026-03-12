import { useState, useCallback, useMemo } from 'react'
import { useStorage } from './useStorage'
import { STORAGE_KEYS } from '../utils/constants'
import { getTodayKey } from '../utils/dateUtils'
import { getTaskSet } from '../data/taskSets'

function createEmptyDay(date, taskSetId) {
  const taskList = getTaskSet(taskSetId)
  const tasks = {}
  taskList.forEach(t => {
    tasks[t.id] = { done: false, time: null }
  })

  return {
    date,
    tasks,
    water: { target: 10, consumed: 0, log: [] },
    bowel: { happened: false, time: null, consistency: null, notes: '' },
    meals: { entries: [], totalCalories: 0, sugarFreeStreak: true },
    exercise: { entries: [], totalMinutes: 0, totalCalories: 0 },
    body: { weight: null, waist: null, glucose: { fasting: null, postMeal: null } },
    mood: null,
    score: 0,
    custom_tasks: [],
  }
}

// Read taskSet from localStorage profile (avoid circular hook dependency)
function getTaskSetId() {
  try {
    const stored = localStorage.getItem('healthtracker_profile')
    if (stored) {
      const profile = JSON.parse(stored)
      return profile.taskSet || 'general_wellness'
    }
  } catch { /* ignore */ }
  return 'general_wellness'
}

export function useDaily() {
  const [allData, setAllData] = useStorage(STORAGE_KEYS.DAILY, {})
  const todayKey = getTodayKey()
  const [taskSetId] = useState(getTaskSetId)

  const todayData = useMemo(() => {
    return allData[todayKey] || createEmptyDay(todayKey, taskSetId)
  }, [allData, todayKey, taskSetId])

  const updateTodayData = useCallback((partial) => {
    setAllData(prev => {
      const current = prev[todayKey] || createEmptyDay(todayKey, taskSetId)
      const updated = { ...current }

      Object.keys(partial).forEach(key => {
        if (typeof partial[key] === 'object' && !Array.isArray(partial[key]) && partial[key] !== null) {
          updated[key] = { ...current[key], ...partial[key] }
        } else {
          updated[key] = partial[key]
        }
      })

      return { ...prev, [todayKey]: updated }
    })
  }, [setAllData, todayKey, taskSetId])

  const getHistoricalData = useCallback((days = 14) => {
    const result = []
    const today = new Date()
    for (let i = 0; i < days; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      result.push(allData[key] || createEmptyDay(key, taskSetId))
    }
    return result
  }, [allData, taskSetId])

  const getDayData = useCallback((dateKey) => {
    return allData[dateKey] || null
  }, [allData])

  return { todayData, updateTodayData, getHistoricalData, getDayData, allData }
}
