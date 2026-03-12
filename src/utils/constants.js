export const STORAGE_KEYS = {
  DAILY: 'healthtracker_daily',
  SETTINGS: 'healthtracker_settings',
}

export const DEFAULT_WATER_TARGET = 10
export const CONSTIPATION_WATER_TARGET = 12
export const CONSTIPATION_WARNING_DAYS = 3
export const DANGER_DAYS = 5

export const BRISTOL_SCALE = [
  { id: 'hard', label: 'Qattiq', emoji: '🟤', status: 'muammo' },
  { id: 'normal', label: 'Normal', emoji: '🟢', status: 'yaxshi' },
  { id: 'soft', label: 'Yumshoq', emoji: '🟡', status: 'yaxshi' },
  { id: 'liquid', label: 'Suyuq', emoji: '🔴', status: 'ehtiyot' },
]

export const MOOD_OPTIONS = [
  { id: 'good', emoji: '😊', label: 'Yaxshi' },
  { id: 'okay', emoji: '😐', label: "O'rtacha" },
  { id: 'bad', emoji: '😞', label: 'Yomon' },
]

export const COLORS = {
  green: { primary: '#4CAF50', light: '#E8F5E9', dark: '#388E3C' },
  blue: { primary: '#2196F3', light: '#E3F2FD' },
  yellow: { primary: '#FF9800', light: '#FFF3E0' },
  pink: { primary: '#E91E63', light: '#FCE4EC' },
  red: { primary: '#F44336', light: '#FFEBEE' },
}

export const TASK_GROUPS = {
  morning: { id: 'morning', label: 'Ertalab', icon: '🌅', time: '06:00-09:00' },
  day: { id: 'day', label: 'Kun davomida', icon: '☀️', time: '09:00-18:00' },
  evening: { id: 'evening', label: 'Kechqurun', icon: '🌙', time: '18:00-22:00' },
  extra: { id: 'extra', label: 'Qo\'shimcha', icon: '⭐', time: 'Ixtiyoriy' },
}
