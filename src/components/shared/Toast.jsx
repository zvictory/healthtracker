import { X, Info } from 'lucide-react'

export default function Toast({ message, onDismiss }) {
  return (
    <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-[90] animate-fade-in">
      <div className="card flex items-center gap-3 px-4 py-3 shadow-lg">
        <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
          <Info size={16} className="text-primary" />
        </div>
        <span className="text-sm flex-1">{message}</span>
        <button onClick={onDismiss} className="p-1.5 rounded-lg hover:bg-[var(--color-divider)] transition-colors cursor-pointer">
          <X size={14} className="text-[var(--color-text-tertiary)]" />
        </button>
      </div>
    </div>
  )
}
