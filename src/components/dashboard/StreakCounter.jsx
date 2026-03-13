import { motion } from 'motion/react'
import { Flame, Shield } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function StreakCounter({ streak, shieldAvailable }) {
  const reduced = useReducedMotion()

  return (
    <div className="card p-4 flex items-center gap-3 bg-warning-light">
      <motion.div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
        animate={streak > 0 && !reduced ? {
          scale: [1, 1.1, 1, 1.05, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Flame size={20} className="text-warning" />
      </motion.div>
      <div className="flex-1">
        <p className="text-sm font-bold">{streak} kun ketma-ket</p>
        <p className="text-[11px] text-[var(--color-text-tertiary)]">70%+ ball seriyasi</p>
      </div>
      {shieldAvailable && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--color-card)]" title="Qalqon mavjud — 1 kun o'tkazib yuborishingiz mumkin">
          <Shield size={14} className="text-primary" />
          <span className="text-[10px] font-semibold text-primary">1</span>
        </div>
      )}
    </div>
  )
}
