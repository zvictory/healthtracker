import { useProfile } from './useProfile'

export function useOnboarding() {
  const { profile, hasProfile, initProfile, updateProfile, resetProfile } = useProfile()

  const completeOnboarding = (data) => {
    initProfile(data)
  }

  const resetOnboarding = () => {
    resetProfile()
  }

  return {
    profile,
    isCompleted: hasProfile,
    updateProfile,
    completeOnboarding,
    resetOnboarding,
  }
}
