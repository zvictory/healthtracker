import { useState, useEffect, useRef } from 'react'
import { motion, useSpring } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function SplashParticles({ trigger }) {
  const reduced = useReducedMotion()
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!trigger || reduced) return
    const p = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      x: 18 + Math.random() * 12,
      angle: -30 + Math.random() * 60,
    }))
    setParticles(p)
    const t = setTimeout(() => setParticles([]), 600)
    return () => clearTimeout(t)
  }, [trigger, reduced])

  if (!particles.length) return null

  return (
    <>
      {particles.map(p => (
        <motion.circle
          key={p.id}
          cx={p.x}
          cy={20}
          r={2}
          fill="#64B5F6"
          initial={{ cy: 20, opacity: 1 }}
          animate={{
            cy: 20 - 12 - Math.random() * 8,
            cx: p.x + Math.sin(p.angle * Math.PI / 180) * 10,
            opacity: 0,
            r: 1,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

export default function GlassAnimation({ progress }) {
  const reduced = useReducedMotion()
  const prevProgress = useRef(progress)
  const [splashTrigger, setSplashTrigger] = useState(0)

  const waterHeight = Math.min(progress, 100)
  const fillY = 56 - (waterHeight * 48) / 100
  const springY = useSpring(fillY, { stiffness: 80, damping: 14 })
  const color = progress >= 100 ? '#2196F3' : progress >= 50 ? '#64B5F6' : '#BBDEFB'

  useEffect(() => {
    springY.set(fillY)
  }, [fillY, springY])

  // Trigger splash on increase
  useEffect(() => {
    if (progress > prevProgress.current) {
      setSplashTrigger(t => t + 1)
    }
    prevProgress.current = progress
  }, [progress])

  if (reduced) {
    return (
      <svg width="48" height="56" viewBox="0 0 48 56">
        <defs>
          <clipPath id="glass-clip">
            <path d="M8 4 L12 52 L36 52 L40 4 Z" />
          </clipPath>
        </defs>
        <path d="M8 4 L12 52 L36 52 L40 4 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
        <g clipPath="url(#glass-clip)">
          <rect x="0" y={fillY} width="48" height={56 - fillY} fill={color} />
        </g>
      </svg>
    )
  }

  return (
    <svg width="48" height="56" viewBox="0 0 48 56">
      <defs>
        <clipPath id="glass-clip-anim">
          <path d="M8 4 L12 52 L36 52 L40 4 Z" />
        </clipPath>
      </defs>

      {/* Glass outline */}
      <path d="M8 4 L12 52 L36 52 L40 4 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />

      {/* Water fill with spring */}
      <g clipPath="url(#glass-clip-anim)">
        <motion.rect
          x="0"
          width="48"
          height={56}
          fill={color}
          style={{ y: springY }}
        />
        {/* Wave */}
        {waterHeight > 0 && waterHeight < 100 && (
          <motion.ellipse
            cx={24}
            rx={22}
            ry={3}
            fill={color}
            style={{ cy: springY }}
            animate={{ rx: [20, 22, 20] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </g>

      {/* Splash particles */}
      <SplashParticles trigger={splashTrigger} />
    </svg>
  )
}
