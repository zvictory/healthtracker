import { useCallback } from 'react'
import { useStorage } from './useStorage'
import { SCORING_PROFILES, MODULE_MAP } from '../data/scoringProfiles'

const STORAGE_KEY = 'healthtracker_profile'

const DEFAULT_PROFILE = {
  name: '',
  gender: null,
  age: null,
  goals: [],
  conditions: [],
  activeModules: ['tasks', 'water', 'mood', 'food_guide'],
  taskSet: 'general_wellness',
  scoringWeights: SCORING_PROFILES.general_wellness,
  waterTarget: 8,
  createdAt: null,
}

// Derive profile config from selected goals and conditions
function deriveProfile(goals, conditions) {
  // Primary profile is determined by the first goal
  const primary = goals[0] || 'general_wellness'

  // Determine task set
  let taskSet = 'general_wellness'
  if (conditions.includes('breastfeeding') || goals.includes('constipation')) {
    taskSet = 'breastfeeding_constipation'
  } else if (goals.includes('insulin_resistance')) {
    taskSet = 'insulin_resistance'
  } else if (goals.includes('fat_burning')) {
    taskSet = 'fat_burning'
  } else if (goals.includes('sugar_free')) {
    taskSet = 'sugar_free'
  }

  // Determine active modules based on goals
  const modules = new Set(['tasks', 'water', 'mood', 'food_guide'])
  goals.forEach(goal => {
    const extra = MODULE_MAP[goal]
    if (extra) extra.forEach(m => modules.add(m))
  })
  conditions.forEach(cond => {
    const extra = MODULE_MAP[cond]
    if (extra) extra.forEach(m => modules.add(m))
  })

  // Scoring weights
  const weights = SCORING_PROFILES[taskSet] || SCORING_PROFILES.general_wellness

  // Water target
  let waterTarget = 8
  if (taskSet === 'breastfeeding_constipation') waterTarget = 10
  if (goals.includes('hydration')) waterTarget = Math.max(waterTarget, 10)

  return { taskSet, activeModules: [...modules], scoringWeights: weights, waterTarget }
}

export function useProfile() {
  const [profile, setProfile] = useStorage(STORAGE_KEY, DEFAULT_PROFILE)

  const updateProfile = useCallback((partial) => {
    setProfile(prev => {
      const updated = { ...prev, ...partial }

      // Re-derive config if goals or conditions changed
      if (partial.goals || partial.conditions) {
        const derived = deriveProfile(
          partial.goals || prev.goals,
          partial.conditions || prev.conditions
        )
        return { ...updated, ...derived }
      }

      return updated
    })
  }, [setProfile])

  const initProfile = useCallback((data) => {
    const derived = deriveProfile(data.goals || [], data.conditions || [])
    setProfile({
      ...DEFAULT_PROFILE,
      ...data,
      ...derived,
      createdAt: new Date().toISOString().split('T')[0],
    })
  }, [setProfile])

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE)
  }, [setProfile])

  return {
    profile,
    updateProfile,
    initProfile,
    resetProfile,
    hasProfile: !!profile.createdAt,
  }
}
