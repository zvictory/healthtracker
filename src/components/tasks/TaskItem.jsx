import { useState } from 'react'
import { Check } from 'lucide-react'
import { motivationalMessages } from '../../data/tips'

export default function TaskItem({ task, done, time, onToggle }) {
  const [showMotivation, setShowMotivation] = useState(false)

  const handleToggle = () => {
    if (!done) {
      setShowMotivation(true)
      setTimeout(() => setShowMotivation(false), 2000)
    }
    onToggle()
  }

  const randomMotivation = motivationalMessages.task_complete[
    Math.floor(Math.random() * motivationalMessages.task_complete.length)
  ]

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-5 py-3.5 min-h-[52px] text-left hover:bg-[var(--color-divider)] transition-colors duration-150 cursor-pointer"
      >
        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          done ? 'bg-[var(--color-success)] border-[var(--color-success)] shadow-sm' : 'border-[var(--color-border)]'
        }`}>
          {done && <Check size={13} className="text-white" strokeWidth={3} />}
        </div>
        <span className={`text-[13px] flex-1 transition-colors duration-200 leading-snug ${done ? 'line-through text-[var(--color-text-tertiary)]' : ''}`}>
          {task.text}
        </span>
        {time && (
          <span className="text-[10px] text-[var(--color-text-tertiary)] tabular-nums bg-[var(--color-divider)] px-2 py-0.5 rounded-full">{time}</span>
        )}
      </button>
      {showMotivation && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-[var(--color-success)] text-white text-xs px-3.5 py-2 rounded-xl animate-fade-in z-10 whitespace-nowrap shadow-md">
          {randomMotivation}
        </div>
      )}
    </div>
  )
}
