import { useEffect } from 'react'
import { motion } from 'motion/react'
import { X, Info, Undo2 } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function Toast({ message, onDismiss, action, actionLabel = 'Bekor qilish', duration = 5000 }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  return (
    <motion.div
      className="fixed top-4 left-4 right-4 max-w-md mx-auto z-[90]"
      initial={reduced ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card overflow-hidden shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
            <Info size={16} className="text-primary" />
          </div>
          <span className="text-sm flex-1">{message}</span>
          {action && (
            <button
              onClick={() => { action(); onDismiss() }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
            >
              <Undo2 size={12} />
              {actionLabel}
            </button>
          )}
          <button onClick={onDismiss} aria-label="Yopish" className="p-1.5 rounded-lg hover:bg-[var(--color-divider)] transition-colors cursor-pointer">
            <X size={14} className="text-[var(--color-text-tertiary)]" aria-hidden="true" />
          </button>
        </div>
        {/* Countdown bar */}
        <motion.div
          className="h-0.5 bg-primary origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}
