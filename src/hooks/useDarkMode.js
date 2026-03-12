import { useState, useEffect, useCallback } from 'react'
import { isEvening } from '../utils/dateUtils'

export function useDarkMode() {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('healthtracker_darkmode') || 'auto'
    } catch {
      return 'auto'
    }
  })

  const isDark = mode === 'on' || (mode === 'auto' && isEvening())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('healthtracker_darkmode', mode)
  }, [isDark, mode])

  const setDarkMode = useCallback((newMode) => {
    setMode(newMode)
  }, [])

  return { mode, isDark, setDarkMode }
}
