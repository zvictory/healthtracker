import { useEffect } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'motion/react'
import ProgressRing from '../shared/ProgressRing'
import Sparkline from '../shared/Sparkline'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function AnimatedNumber({ value, color }) {
  const reduced = useReducedMotion()
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 18 })
  const display = useTransform(spring, (v) => Math.round(v))

  useEffect(() => {
    mv.set(reduced ? value : 0)
    if (!reduced) {
      // Small delay so the spring starts after mount
      const t = setTimeout(() => mv.set(value), 50)
      return () => clearTimeout(t)
    }
  }, [value, mv, reduced])

  if (reduced) {
    return <span style={{ color }}>{value}</span>
  }

  return <motion.span style={{ color }}>{display}</motion.span>
}

export default function HealthScoreCard({ score, historicalData = [] }) {
  const reduced = useReducedMotion()

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

  const getSummary = () => {
    if (score >= 70) return 'Bugungi ritmingiz yaxshi. Shu tempni ushlab turing.'
    if (score >= 40) return 'Kun yaxshi ketmoqda. Bir nechta odat bilan ball tez ko`tariladi.'
    return 'Eng oson qadamdan boshlang: suv, vazifa yoki kayfiyatni belgilang.'
  }

  return (
    <div className="card relative overflow-hidden p-6 lg:p-7">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <motion.div
        className="absolute -right-10 top-0 h-36 w-36 rounded-full blur-3xl"
        style={{ background: `${getColor()}22` }}
        animate={reduced ? {} : { scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">Bugungi ball</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[var(--color-text)]">{getLabel()}</h2>
        </div>
        <div className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ color: getColor(), background: getBgColor() }}>
          {score}/100
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
        <ProgressRing
          progress={score}
          size={190}
          strokeWidth={14}
          color={getColor()}
          bgColor={getBgColor()}
          gradientColors={getGradient()}
        >
          <div className="text-center">
            <div className="text-5xl font-extrabold tracking-tight">
              <AnimatedNumber value={score} color={getColor()} />
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)] mt-1">Sog'liq indeksi</div>
            {historicalData.length >= 2 && (
              <div className="mt-2 flex justify-center">
                <Sparkline
                  data={[...historicalData.slice(0, 7)].reverse().map(d => d.score || 0)}
                  color={getColor()}
                  height={20}
                  width={72}
                />
              </div>
            )}
          </div>
        </ProgressRing>

        <div className="w-full max-w-[260px] space-y-4 lg:pr-2">
          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{getSummary()}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[var(--color-divider)] p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Holat</p>
              <p className="mt-1 text-sm font-bold text-[var(--color-text)]">{score >= 70 ? 'Barqaror' : score >= 40 ? 'Yo`lda' : 'Start'}</p>
            </div>
            <div className="rounded-2xl bg-[var(--color-divider)] p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Diqqat</p>
              <p className="mt-1 text-sm font-bold text-[var(--color-text)]">{score >= 70 ? 'Balans' : score >= 40 ? 'Davom' : 'Faollik'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
