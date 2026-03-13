import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function BottomSheet({ title, onClose, children }) {
  const reduced = useReducedMotion()
  const sheetRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key handler
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Focus trap
  const handleTab = useCallback((e) => {
    if (e.key !== 'Tab' || !sheetRef.current) return
    const focusable = sheetRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [handleTab])

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        ref={sheetRef}
        className="bg-[var(--color-bg-elevated)] rounded-t-2xl lg:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-lg"
        initial={reduced ? false : { y: '100%' }}
        animate={{ y: 0 }}
        exit={reduced ? undefined : { y: '100%' }}
        transition={reduced ? { duration: 0 } : { type: 'spring', damping: 28, stiffness: 340 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 lg:hidden">
          <div className="w-10 h-1 rounded-full bg-[var(--color-border)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-2 pb-3">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-1.5 rounded-lg hover:bg-[var(--color-divider)] transition-colors cursor-pointer"
          >
            <X size={18} className="text-[var(--color-text-tertiary)]" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
