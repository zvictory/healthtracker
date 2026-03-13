import { useState } from 'react'
import { BRISTOL_SCALE } from '../../utils/constants'

const BRISTOL_COLORS = {
  hard: '#92400E',
  normal: '#10B981',
  soft: '#F59E0B',
  liquid: '#EF4444',
}

export default function BowelLogForm({ onSave, onCancel }) {
  const [consistency, setConsistency] = useState(null)
  const [notes, setNotes] = useState('')

  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-semibold mb-3">Konsistensiya tanlang</h3>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {BRISTOL_SCALE.map(item => (
          <button
            key={item.id}
            onClick={() => setConsistency(item.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
              consistency === item.id
                ? 'border-primary bg-primary-50'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
            }`}
          >
            <div className="w-7 h-7 rounded-full" style={{ backgroundColor: BRISTOL_COLORS[item.id] }} />
            <p className="text-sm font-medium mt-2">{item.label}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">{item.status}</p>
          </button>
        ))}
      </div>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Izoh (ixtiyoriy)..."
        aria-label="Izoh"
        className="w-full px-3 py-2 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium cursor-pointer"
        >
          Bekor
        </button>
        <button
          onClick={() => consistency && onSave(consistency, notes)}
          disabled={!consistency}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40 cursor-pointer"
        >
          Saqlash
        </button>
      </div>
    </div>
  )
}
