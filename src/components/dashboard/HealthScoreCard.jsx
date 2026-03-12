import { useState, useEffect } from 'react'
import ProgressRing from '../shared/ProgressRing'

export default function HealthScoreCard({ score }) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let current = 0
    const step = Math.max(score / 30, 1)
    const timer = setInterval(() => {
      current += step
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.round(current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [score])

  const getGradient = () => {
    if (score >= 70) return ['#059669', '#10B981']
    if (score >= 40) return ['#D97706', '#F59E0B']
    return ['#DC2626', '#EF4444']
  }

  const getColor = () => {
    if (score >= 70) return '#10B981'
    if (score >= 40) return '#F59E0B'
    return '#EF4444'
  }

  const getBgColor = () => {
    if (score >= 70) return 'var(--color-success-light)'
    if (score >= 40) return 'var(--color-warning-light)'
    return 'var(--color-danger-light)'
  }

  const getLabel = () => {
    if (score >= 70) return "Zo'r natija!"
    if (score >= 40) return "Davom eting"
    return 'Boshlaymiz!'
  }

  return (
    <div className="card p-6 flex flex-col items-center justify-center">
      <ProgressRing
        progress={score}
        size={180}
        strokeWidth={12}
        color={getColor()}
        bgColor={getBgColor()}
        gradientColors={getGradient()}
      >
        <div className="text-center">
          <div className="text-5xl font-extrabold tracking-tight" style={{ color: getColor(), animation: 'count-up 0.5s ease-out' }}>
            {displayScore}
          </div>
          <div className="text-xs font-medium text-[var(--color-text-tertiary)] mt-1">{getLabel()}</div>
        </div>
      </ProgressRing>
      <p className="text-xs text-[var(--color-text-tertiary)] mt-5 font-medium">Bugungi sog'liq balli</p>
    </div>
  )
}
