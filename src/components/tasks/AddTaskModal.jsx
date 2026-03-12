import { useState } from 'react'
import { X } from 'lucide-react'
import { TASK_GROUPS } from '../../utils/constants'

export default function AddTaskModal({ onAdd, onClose }) {
  const [text, setText] = useState('')
  const [group, setGroup] = useState('extra')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim(), group)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center" onClick={onClose}>
      <div
        className="bg-[var(--color-bg-elevated)] rounded-t-2xl lg:rounded-2xl w-full max-w-lg p-6 shadow-lg"
        style={{ animation: 'slideUp 0.25s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Vazifa qo'shish</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-divider)] transition-colors cursor-pointer">
            <X size={18} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Vazifa matni..."
            className="w-full px-4 py-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            autoFocus
          />
          <div className="flex gap-2 flex-wrap">
            {Object.entries(TASK_GROUPS).map(([key, g]) => (
              <button
                key={key}
                type="button"
                onClick={() => setGroup(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  group === key
                    ? 'bg-primary text-white'
                    : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-divider)]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-40 hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
          >
            Qo'shish
          </button>
        </form>
      </div>
    </div>
  )
}
