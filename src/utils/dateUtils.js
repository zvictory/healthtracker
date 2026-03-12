import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'

export function getTodayKey() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getDaysSince(dateStr) {
  if (!dateStr) return Infinity
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return Math.floor((today - date) / (1000 * 60 * 60 * 24))
}

export function getWeekDates() {
  const now = new Date()
  const start = startOfWeek(now, { weekStartsOn: 1 })
  const end = endOfWeek(now, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'))
}

export function getMonthDates(date = new Date()) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'))
}

export function formatTime(date = new Date()) {
  return format(date, 'HH:mm')
}

export function isEvening() {
  return new Date().getHours() >= 20
}

export function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 9) return 'morning'
  if (hour >= 9 && hour < 18) return 'day'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

export function formatDateShort(dateStr) {
  return format(new Date(dateStr), 'dd.MM')
}

export function formatDateFull(dateStr) {
  return format(new Date(dateStr), 'dd.MM.yyyy')
}

export function getLastNDays(n) {
  return Array.from({ length: n }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'))
}
