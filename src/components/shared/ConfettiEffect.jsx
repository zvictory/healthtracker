import { useEffect, useState } from 'react'

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#FF5722']

export default function ConfettiEffect({ trigger }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!trigger) return
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1.5,
      size: 4 + Math.random() * 6,
    }))
    setParticles(newParticles)
    const timer = setTimeout(() => setParticles([]), 3000)
    return () => clearTimeout(timer)
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute top-0 rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
