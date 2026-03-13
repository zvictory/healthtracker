import { motion } from 'motion/react'
import { Smile, Meh, Frown } from 'lucide-react'
import { MOOD_OPTIONS } from '../../utils/constants'

const MOOD_ICONS = { good: Smile, okay: Meh, bad: Frown }
const MOOD_STYLES = {
  good: { active: 'bg-success-light ring-2 ring-success', icon: 'bg-success', text: 'text-success' },
  okay: { active: 'bg-warning-light ring-2 ring-warning', icon: 'bg-warning', text: 'text-warning' },
  bad: { active: 'bg-danger-light ring-2 ring-danger', icon: 'bg-danger', text: 'text-danger' },
}

export default function MoodSelector({ mood, onSelect }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-bold mb-4">Bugungi kayfiyat</p>
      <div className="grid grid-cols-3 gap-3">
        {MOOD_OPTIONS.map(option => {
          const Icon = MOOD_ICONS[option.id]
          const styles = MOOD_STYLES[option.id]
          const isSelected = mood === option.id
          return (
            <motion.button
              key={option.id}
              onClick={() => onSelect(option.id)}
              whileTap={{ scale: 0.93 }}
              animate={isSelected ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 0.25 }}
              className={`flex flex-col items-center gap-2.5 py-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                isSelected ? `${styles.active} shadow-sm` : 'bg-[var(--color-divider)] hover:bg-[var(--color-card-hover)]'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                isSelected ? `${styles.icon} text-white` : ''
              }`}>
                <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} className={!isSelected ? styles.text : ''} />
              </div>
              <span className={`text-xs font-semibold ${isSelected ? styles.text : 'text-[var(--color-text-secondary)]'}`}>
                {option.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
