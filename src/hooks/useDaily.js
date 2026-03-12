import { useState, useCallback, useMemo } from 'react'
import { useStorage } from './useStorage'
import { STORAGE_KEYS, DEFAULT_WATER_TARGET } from '../utils/constants'
import { getTodayKey } from '../utils/dateUtils'
import { defaultTasks } from '../data/defaultTasks'

function createEmptyDay(date) {
  const tasks = {}
  defaultTasks.forEach(t => {
    tasks[t.id] = { done: false, time: null }
  })

  return {
    date,
    tasks,
    water: { target: DEFAULT_WATER_TARGET, consumed: 0, log: [] },
    bowel: { happened: false, time: null, consistency: null, notes: '' },
    mood: null,
    score: 0,
    custom_tasks: [],
  }
}

export function useDaily() {
  const [allData, setAllData] = useStorage(STORAGE_KEYS.DAILY, {})
  const todayKey = getTodayKey()

  const todayData = useMemo(() => {
    return allData[todayKey] || createEmptyDay(todayKey)
  }, [allData, todayKey])

  const updateTodayData = useCallback((partial) => {
    setAllData(prev => {
      const current = prev[todayKey] || createEmptyDay(todayKey)
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
  }, [setAllData, todayKey])

  const getHistoricalData = useCallback((days = 14) => {
    const result = []
    const today = new Date()
    for (let i = 0; i < days; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      result.push(allData[key] || createEmptyDay(key))
    }
    return result
  }, [allData])

  const getDayData = useCallback((dateKey) => {
    return allData[dateKey] || null
  }, [allData])

  return { todayData, updateTodayData, getHistoricalData, getDayData, allData }
}
