import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../hooks/useOnboarding'
import WelcomeStep from '../components/onboarding/WelcomeStep'
import BabyInfoStep from '../components/onboarding/BabyInfoStep'
import GoalsStep from '../components/onboarding/GoalsStep'
import RemindersStep from '../components/onboarding/RemindersStep'

const TOTAL_STEPS = 4

export default function Onboarding() {
  const { profile, updateProfile, completeOnboarding } = useOnboarding()
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const handleWelcome = (name) => {
    updateProfile({ name })
    setStep(2)
  }

  const handleBabyInfo = (babyAgeGroup, isBreastfeeding) => {
    updateProfile({ babyAgeGroup, isBreastfeeding })
    setStep(3)
  }

  const handleGoals = (goals) => {
    updateProfile({ goals })
    setStep(4)
  }

  const handleFinish = (remindersEnabled) => {
    updateProfile({ remindersEnabled })
    completeOnboarding()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-8 pb-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i + 1 === step
                ? 'w-8 bg-primary'
                : i + 1 < step
                  ? 'w-4 bg-primary/40'
                  : 'w-4 bg-[var(--color-border)]'
            }`}
          />
        ))}
      </div>

      {/* Skip button */}
      {step < TOTAL_STEPS && (
        <div className="flex justify-end px-6 pt-2">
          <button
            onClick={() => {
              completeOnboarding()
              navigate('/', { replace: true })
            }}
            className="text-xs text-[var(--color-text-tertiary)] font-medium cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors"
          >
            O'tkazib yuborish
          </button>
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-8 pb-12">
        <div className="w-full max-w-sm" key={step}>
          {step === 1 && (
            <WelcomeStep name={profile.name} onNext={handleWelcome} />
          )}
          {step === 2 && (
            <BabyInfoStep
              babyAgeGroup={profile.babyAgeGroup}
              isBreastfeeding={profile.isBreastfeeding}
              onNext={handleBabyInfo}
            />
          )}
          {step === 3 && (
            <GoalsStep goals={profile.goals} onNext={handleGoals} />
          )}
          {step === 4 && (
            <RemindersStep onFinish={handleFinish} />
          )}
        </div>
      </div>
    </div>
  )
}
