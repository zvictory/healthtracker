import { useState, useCallback, useEffect } from 'react'

export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = useCallback((newValue) => {
    setValue(prev => {
      const val = typeof newValue === 'function' ? newValue(prev) : newValue
      try {
        localStorage.setItem(key, JSON.stringify(val))
      } catch (e) {
        console.error('localStorage write error:', e)
      }
      return val
    })
  }, [key])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : defaultValue)
        } catch {
          setValue(defaultValue)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, defaultValue])

  return [value, setStoredValue]
}
