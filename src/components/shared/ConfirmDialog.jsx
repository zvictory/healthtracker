import { useEffect, useRef, useCallback } from 'react'

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  const dialogRef = useRef(null)

  // Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancel])

  // Focus trap
  const handleTab = useCallback((e) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll('button')
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

  // Auto-focus first button
  useEffect(() => {
    const first = dialogRef.current?.querySelector('button')
    first?.focus()
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div ref={dialogRef} className="card p-6 max-w-sm w-full animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-divider)] transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-[var(--color-danger-dark)] transition-colors cursor-pointer"
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  )
}
