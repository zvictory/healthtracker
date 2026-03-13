// Weekly challenge pool — filtered by profile modules at selection time
// Each challenge has a `condition(dayData)` that returns true if the day counts

export const challengePool = [
  // ── Universal (all profiles) ──
  {
    id: 'water_storm',
    name: "Suv bo'roni",
    description: '7 kun ketma-ket suv maqsadiga yeting',
    duration: 7,
    type: 'water',
    requiredModules: [],
    condition: (d) => (d.water?.consumed || 0) >= (d.water?.target || 8),
    targetDays: 7,
    xpReward: 200,
    icon: 'Droplets',
    color: '#2c7fb8',
  },
  {
    id: 'morning_champion',
    name: 'Ertalab chempioni',
    description: '5 kun barcha ertalab vazifalarini bajaring',
    duration: 7,
    type: 'tasks',
    requiredModules: [],
    condition: (d) => {
      const tasks = d.tasks || {}
      const morning = Object.entries(tasks).filter(([id]) =>
        id.startsWith('morning') || id.startsWith('breakfast') || id.startsWith('olive') || id.startsWith('dried')
      )
      return morning.length > 0 && morning.every(([, t]) => t.done)
    },
    targetDays: 5,
    xpReward: 150,
    icon: 'Sunrise',
    color: '#F59E0B',
  },
  {
    id: 'evening_ritual',
    name: 'Kechqurun marosimi',
    description: '5 kun kechki barcha vazifalarni bajaring',
    duration: 7,
    type: 'tasks',
    requiredModules: [],
    condition: (d) => {
      const tasks = d.tasks || {}
      const evening = Object.entries(tasks).filter(([id]) =>
        id.startsWith('evening') || id.startsWith('flax') || id.startsWith('stretch')
      )
      return evening.length > 0 && evening.every(([, t]) => t.done)
    },
    targetDays: 5,
    xpReward: 150,
    icon: 'Moon',
    color: '#8B5CF6',
  },
  {
    id: 'perfect_week',
    name: 'Mukammal hafta',
    description: '5 kun 80%+ ball oling',
    duration: 7,
    type: 'score',
    requiredModules: [],
    condition: (d) => (d.score || 0) >= 80,
    targetDays: 5,
    xpReward: 250,
    icon: 'Star',
    color: '#10B981',
  },
  {
    id: 'mood_tracker',
    name: 'Kayfiyat kuzatuvchisi',
    description: '7 kun ketma-ket kayfiyatni belgilang',
    duration: 7,
    type: 'mood',
    requiredModules: [],
    condition: (d) => !!d.mood,
    targetDays: 7,
    xpReward: 120,
    icon: 'Smile',
    color: '#b85c38',
  },
  {
    id: 'hydration_hero',
    name: 'Suv qahramoni',
    description: '5 kun maqsaddan 2+ stakan ko`p iching',
    duration: 7,
    type: 'water',
    requiredModules: [],
    condition: (d) => (d.water?.consumed || 0) >= (d.water?.target || 8) + 2,
    targetDays: 5,
    xpReward: 180,
    icon: 'GlassWater',
    color: '#0D9488',
  },
  {
    id: 'all_tasks_master',
    name: 'Barcha vazifalar ustasi',
    description: '3 kun 100% vazifalarni bajaring',
    duration: 7,
    type: 'tasks',
    requiredModules: [],
    condition: (d) => {
      const tasks = d.tasks || {}
      const all = Object.values(tasks)
      return all.length > 0 && all.every(t => t.done)
    },
    targetDays: 3,
    xpReward: 300,
    icon: 'ListChecks',
    color: '#059669',
  },

  // ── Bowel module ──
  {
    id: 'bowel_regularity',
    name: 'Muntazam ichak',
    description: '5 kun ich kelishini qayd qiling',
    duration: 7,
    type: 'bowel',
    requiredModules: ['bowel'],
    condition: (d) => !!d.bowel?.happened,
    targetDays: 5,
    xpReward: 200,
    icon: 'HeartPulse',
    color: '#10B981',
  },

  // ── Exercise module ──
  {
    id: 'active_week',
    name: 'Faol hafta',
    description: '5 kun kamida 20 daqiqa mashq qiling',
    duration: 7,
    type: 'exercise',
    requiredModules: ['exercise'],
    condition: (d) => (d.exercise?.totalMinutes || 0) >= 20,
    targetDays: 5,
    xpReward: 200,
    icon: 'Dumbbell',
    color: '#EF4444',
  },
  {
    id: 'calorie_burner',
    name: 'Kaloriya yoquvchi',
    description: '4 kun 200+ kkal yoqing',
    duration: 7,
    type: 'exercise',
    requiredModules: ['exercise'],
    condition: (d) => (d.exercise?.totalCalories || 0) >= 200,
    targetDays: 4,
    xpReward: 220,
    icon: 'Flame',
    color: '#DC2626',
  },

  // ── Meals module ──
  {
    id: 'sugar_free_week',
    name: 'Shakarsiz hafta',
    description: "7 kun shakar iste'mol qilmang",
    duration: 7,
    type: 'meals',
    requiredModules: ['meals'],
    condition: (d) => {
      const entries = d.meals?.entries || []
      return entries.length > 0 && entries.every(m => !m.hasSugar)
    },
    targetDays: 7,
    xpReward: 250,
    icon: 'CandyOff',
    color: '#F59E0B',
  },
  {
    id: 'meal_logger',
    name: 'Ovqat yozuvchisi',
    description: '6 kun kamida 3 ta ovqat qayd qiling',
    duration: 7,
    type: 'meals',
    requiredModules: ['meals'],
    condition: (d) => (d.meals?.entries?.length || 0) >= 3,
    targetDays: 6,
    xpReward: 160,
    icon: 'UtensilsCrossed',
    color: '#b85c38',
  },

  // ── Body module ──
  {
    id: 'body_tracker',
    name: "Tana kuzatuvchisi",
    description: "5 kun vaznni o'lchang",
    duration: 7,
    type: 'body',
    requiredModules: ['body'],
    condition: (d) => !!d.body?.weight,
    targetDays: 5,
    xpReward: 140,
    icon: 'Scale',
    color: '#6366F1',
  },

  // ── Combo (universal, hard) ──
  {
    id: 'triple_threat',
    name: 'Uch baravar',
    description: '3 kun: suv 100% + vazifalar 80%+ + kayfiyat',
    duration: 7,
    type: 'combo',
    requiredModules: [],
    condition: (d) => {
      const waterOk = (d.water?.consumed || 0) >= (d.water?.target || 8)
      const tasks = d.tasks || {}
      const all = Object.values(tasks)
      const taskRate = all.length > 0 ? all.filter(t => t.done).length / all.length : 0
      return waterOk && taskRate >= 0.8 && !!d.mood
    },
    targetDays: 3,
    xpReward: 350,
    icon: 'Star',
    color: '#D97706',
  },
]
