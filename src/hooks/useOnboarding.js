import { useStorage } from './useStorage'

const STORAGE_KEY = 'healthtracker_onboarding'

const DEFAULT_PROFILE = {
  completed: false,
  name: '',
  babyAgeGroup: null,
  isBreastfeeding: null,
  goals: [],
  remindersEnabled: true,
}

export function useOnboarding() {
  const [profile, setProfile] = useStorage(STORAGE_KEY, DEFAULT_PROFILE)

  const updateProfile = (partial) => {
    setProfile(prev => ({ ...prev, ...partial }))
  }

  const completeOnboarding = () => {
    setProfile(prev => ({ ...prev, completed: true }))
  }

  const resetOnboarding = () => {
    setProfile(DEFAULT_PROFILE)
  }

  return {
    profile,
    isCompleted: profile.completed,
    updateProfile,
    completeOnboarding,
    resetOnboarding,
  }
}
