// Scoring weights per profile type — must sum to 100
export const SCORING_PROFILES = {
  breastfeeding_constipation: { tasks: 70, water: 20, bowel: 10 },
  insulin_resistance:         { tasks: 25, water: 15, meals: 30, exercise: 20, body: 10 },
  fat_burning:                { tasks: 20, water: 15, meals: 25, exercise: 30, body: 10 },
  sugar_free:                 { tasks: 30, water: 15, meals: 35, exercise: 10, body: 10 },
  general_wellness:           { tasks: 35, water: 20, bowel: 5, meals: 15, exercise: 20, body: 5 },
}

// Which modules each goal/condition activates (beyond the defaults: tasks, water, mood, food_guide)
export const MODULE_MAP = {
  constipation:         ['bowel'],
  gut_health:           ['bowel'],
  postpartum:           ['bowel'],
  breastfeeding:        ['bowel'],
  insulin_resistance:   ['meals', 'body'],
  sugar_free:           ['meals', 'body'],
  fat_burning:          ['meals', 'exercise', 'body'],
  general_wellness:     ['exercise'],
  hydration:            [],
}

// Goal definitions for onboarding
export const GOAL_OPTIONS = [
  { id: 'constipation',        label: 'Ich qotishining oldini olish',    icon: 'ShieldCheck',  color: '#10B981' },
  { id: 'insulin_resistance',  label: 'Insulin qarshilik boshqaruvi',    icon: 'Activity',     color: '#8B5CF6' },
  { id: 'sugar_free',          label: 'Shakarsiz hayot',                 icon: 'CandyOff',     color: '#F59E0B' },
  { id: 'fat_burning',         label: "Yog' yoqish",                     icon: 'Flame',        color: '#EF4444' },
  { id: 'general_wellness',    label: 'Umumiy salomatlik',               icon: 'Heart',        color: '#0D9488' },
  { id: 'hydration',           label: 'Suv ichish odati',                icon: 'Droplets',     color: '#3B82F6' },
  { id: 'gut_health',          label: 'Ichak salomatligi',               icon: 'HeartPulse',   color: '#06B6D4' },
  { id: 'postpartum',          label: "Tug'ruqdan keyingi tiklanish",    icon: 'Baby',         color: '#EC4899' },
]

// Condition options for onboarding
export const CONDITION_OPTIONS = [
  { id: 'breastfeeding', label: 'Hozir emizayapman', icon: 'Baby' },
  { id: 'pregnant',      label: 'Homilador',         icon: 'Heart' },
  { id: 'diabetes',      label: 'Qandli diabet',     icon: 'Activity' },
  { id: 'none',          label: "Hech qaysi",        icon: 'Check' },
]
