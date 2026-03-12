import { useState, useCallback, useEffect, useRef } from 'react'

const DEFAULT_REMINDERS = [
  { id: 'morning_water', time: '06:30', message: 'Ertalab iliq suv iching! ☀️', enabled: true },
  { id: 'breakfast', time: '09:00', message: "Nonushta qildingizmi? Suli bo'tqa + meva 🥣", enabled: true },
  { id: 'lunch', time: '12:00', message: 'Suv ichdingizmi? Tushlikda sabzavot yeng 🥗', enabled: true },
  { id: 'walking', time: '15:00', message: "Piyoda yurishni unutmang — 20 daqiqa 🚶‍♀️", enabled: true },
  { id: 'massage', time: '18:00', message: 'Qorin massaji qiling — 5 daqiqa 💆', enabled: true },
  { id: 'evening', time: '21:00', message: "Kefir + zig'ir urug'i vaqti! 🥛", enabled: true },
]

export function useNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )
  const [reminders, setReminders] = useState(() => {
    try {
      const stored = localStorage.getItem('healthtracker_reminders')
      return stored ? JSON.parse(stored) : DEFAULT_REMINDERS
    } catch {
      return DEFAULT_REMINDERS
    }
  })
  const [toast, setToast] = useState(null)
  const timersRef = useRef([])

  const isSupported = typeof Notification !== 'undefined'

  const requestPermission = useCallback(async () => {
    if (!isSupported) return 'denied'
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [isSupported])

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 5000)
  }, [])

  const scheduleReminders = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    const now = new Date()
    reminders.filter(r => r.enabled).forEach(reminder => {
      const [h, m] = reminder.time.split(':').map(Number)
      const target = new Date()
      target.setHours(h, m, 0, 0)

      if (target > now) {
        const delay = target - now
        const timer = setTimeout(() => {
          if (permission === 'granted') {
            new Notification("Sog'liq Kuzatuvchi", { body: reminder.message })
          } else {
            showToast(reminder.message)
          }
        }, delay)
        timersRef.current.push(timer)
      }
    })
  }, [reminders, permission, showToast])

  useEffect(() => {
    scheduleReminders()
    return () => timersRef.current.forEach(clearTimeout)
  }, [scheduleReminders])

  const updateReminder = useCallback((id, updates) => {
    setReminders(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...updates } : r)
      localStorage.setItem('healthtracker_reminders', JSON.stringify(next))
      return next
    })
  }, [])

  return {
    permission,
    isSupported,
    reminders,
    toast,
    requestPermission,
    updateReminder,
    showToast,
    dismissToast: () => setToast(null),
  }
}
