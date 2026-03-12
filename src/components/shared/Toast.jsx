import { useEffect } from 'react'
import { X, Info, Undo2 } from 'lucide-react'

export default function Toast({ message, onDismiss, action, actionLabel = 'Qaytarish', duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  return (
    <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-[90] animate-fade-in">
      <div className="card flex items-center gap-3 px-4 py-3 shadow-lg">
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
        <button onClick={onDismiss} className="p-1.5 rounded-lg hover:bg-[var(--color-divider)] transition-colors cursor-pointer">
          <X size={14} className="text-[var(--color-text-tertiary)]" />
        </button>
      </div>
    </div>
  )
}
