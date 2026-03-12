const modes = [
  { id: 'auto', label: 'Auto (20:00 dan keyin)' },
  { id: 'on', label: 'Yoqish' },
  { id: 'off', label: "O'chirish" },
]

export default function DarkModeToggle({ mode, onChange }) {
  return (
    <div className="flex gap-2 mt-3">
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            mode === m.id
              ? 'bg-primary text-white'
              : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-divider)]'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
