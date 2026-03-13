import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react'
import { Check, Undo2 } from 'lucide-react'
import { motivationalMessages } from '../../data/tips'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const SWIPE_THRESHOLD = 80

function AnimatedCheck({ done }) {
  const reduced = useReducedMotion()

  return (
    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
      done ? 'bg-[var(--color-success)] border-[var(--color-success)] shadow-sm' : 'border-[var(--color-border)]'
    }`}>
      {done && (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <motion.path
            d="M2.5 6.5L5.5 9.5L10.5 3.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </svg>
      )}
    </div>
  )
}

export default function TaskItem({ task, done, time, onToggle, onUndo }) {
  const [showMotivation, setShowMotivation] = useState(false)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const hasSwiped = useRef(false)

  // Swipe reveal backgrounds
  const rightBg = useTransform(x, [0, SWIPE_THRESHOLD], ['rgba(47,158,98,0)', 'rgba(47,158,98,0.12)'])
  const leftBg = useTransform(x, [-SWIPE_THRESHOLD, 0], ['rgba(136,149,143,0.12)', 'rgba(136,149,143,0)'])
  const rightIconOpacity = useTransform(x, [0, SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD], [0, 0.3, 1])
  const leftIconOpacity = useTransform(x, [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5, 0], [1, 0.3, 0])

  const handleToggle = () => {
    if (!done) {
      setShowMotivation(true)
      navigator.vibrate?.(10)
      setTimeout(() => setShowMotivation(false), 2000)
    }
    onToggle()
  }

  const handleDragEnd = (_, info) => {
    if (hasSwiped.current) return
    if (info.offset.x > SWIPE_THRESHOLD && !done) {
      hasSwiped.current = true
      navigator.vibrate?.(10)
      setShowMotivation(true)
      setTimeout(() => setShowMotivation(false), 2000)
      onToggle()
      setTimeout(() => { hasSwiped.current = false }, 300)
    } else if (info.offset.x < -SWIPE_THRESHOLD && done && onUndo) {
      hasSwiped.current = true
      onUndo()
      setTimeout(() => { hasSwiped.current = false }, 300)
    }
  }

  const randomMotivation = motivationalMessages.task_complete[
    Math.floor(Math.random() * motivationalMessages.task_complete.length)
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Swipe backgrounds */}
      {!reduced && (
        <>
          <motion.div
            className="absolute inset-y-0 left-0 w-full flex items-center pl-5"
            style={{ background: rightBg }}
          >
            <motion.div style={{ opacity: rightIconOpacity }}>
              <Check size={18} className="text-[var(--color-success)]" />
            </motion.div>
          </motion.div>
          <motion.div
            className="absolute inset-y-0 right-0 w-full flex items-center justify-end pr-5"
            style={{ background: leftBg }}
          >
            <motion.div style={{ opacity: leftIconOpacity }}>
              <Undo2 size={18} className="text-[var(--color-text-tertiary)]" />
            </motion.div>
          </motion.div>
        </>
      )}

      <motion.div
        style={{ x }}
        drag={reduced ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        whileTap={reduced ? {} : { scale: 0.985 }}
        animate={done && !reduced ? { scale: [1, 1.015, 1] } : {}}
        transition={{ duration: 0.2 }}
        className="relative bg-[var(--color-card)]"
      >
        <button
          onClick={handleToggle}
          className="w-full flex items-center gap-3 px-5 py-3.5 min-h-[52px] text-left hover:bg-[var(--color-divider)] transition-colors duration-150 cursor-pointer"
        >
          <AnimatedCheck done={done} />
          <span className={`text-[13px] flex-1 transition-colors duration-200 leading-snug ${done ? 'line-through text-[var(--color-text-tertiary)]' : ''}`}>
            {task.text}
          </span>
          {time && (
            <span className="text-[10px] text-[var(--color-text-tertiary)] tabular-nums bg-[var(--color-divider)] px-2 py-0.5 rounded-full">{time}</span>
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-[var(--color-success)] text-white text-xs px-3.5 py-2 rounded-xl z-10 whitespace-nowrap shadow-md"
          >
            {randomMotivation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
