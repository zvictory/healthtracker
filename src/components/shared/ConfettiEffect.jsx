import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#FF5722']

export default function ConfettiEffect({ trigger }) {
  const [particles, setParticles] = useState([])
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!trigger || reduced) return
    const newParticles = Array.from({ length: 24 }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40, // % from left
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
      duration: 1.2 + Math.random() * 1,
      size: 4 + Math.random() * 5,
      rotation: Math.random() * 720,
      xDrift: -30 + Math.random() * 60,
    }))
    setParticles(newParticles)
    const timer = setTimeout(() => setParticles([]), 3000)
    return () => clearTimeout(timer)
  }, [trigger, reduced])

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: -8,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
              }}
              initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
              animate={{
                y: window.innerHeight + 20,
                x: p.xDrift,
                rotate: p.rotation,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
