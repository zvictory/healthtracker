import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, X, Timer, Flame, Dumbbell } from 'lucide-react'
import { useExercise } from '../hooks/useExercise'
import PageHeader from '../components/shared/PageHeader'
import BottomSheet from '../components/shared/BottomSheet'
import EmptyState from '../components/shared/EmptyState'

const EXERCISE_TYPES = [
  { id: 'walking', label: 'Yurish', emoji: '🚶', calPerMin: 4 },
  { id: 'running', label: 'Yugurish', emoji: '🏃', calPerMin: 10 },
  { id: 'hiit', label: 'HIIT', emoji: '💥', calPerMin: 12 },
  { id: 'strength', label: 'Kuch mashqi', emoji: '🏋️', calPerMin: 7 },
  { id: 'yoga', label: 'Yoga', emoji: '🧘', calPerMin: 3 },
  { id: 'stretching', label: "Cho'zilish", emoji: '🤸', calPerMin: 2 },
  { id: 'cycling', label: 'Velosiped', emoji: '🚴', calPerMin: 8 },
  { id: 'other', label: 'Boshqa', emoji: '⚡', calPerMin: 5 },
]

export default function ExerciseTracker() {
  const { exercise, addExercise, removeExercise } = useExercise()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'walking', minutes: '30' })

  const handleSave = () => {
    const type = EXERCISE_TYPES.find(t => t.id === form.type) || EXERCISE_TYPES[0]
    const minutes = parseInt(form.minutes) || 0
    if (minutes <= 0) return
    addExercise({
      type: form.type,
      label: type.label,
      minutes,
      caloriesBurned: Math.round(minutes * type.calPerMin),
    })
    setForm({ type: 'walking', minutes: '30' })
    setShowForm(false)
  }

  const entryCount = exercise.entries.length

  return (
    <div>
      <PageHeader
        title="Mashqlar"
        subtitle={`Bugun ${exercise.totalMinutes} daqiqa faollik`}
        eyebrow="Jismoniy faollik"
        action={
          <button
            onClick={() => setShowForm(true)}
            aria-label="Mashq qo'shish"
            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer"
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        }
      />

      <div className="px-4 space-y-3 pb-8">
        {/* Summary cards */}
        {entryCount > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary-light flex items-center justify-center">
                  <Timer size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Vaqt</p>
                  <p className="text-lg font-bold mt-0.5">{exercise.totalMinutes} <span className="text-xs font-normal text-[var(--color-text-tertiary)]">daq</span></p>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-danger-light)] flex items-center justify-center">
                  <Flame size={18} className="text-[var(--color-danger)]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Yoqilgan</p>
                  <p className="text-lg font-bold mt-0.5">{exercise.totalCalories} <span className="text-xs font-normal text-[var(--color-text-tertiary)]">kkal</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise list */}
        {entryCount === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="Mashq qayd qilinmagan"
            description="Bugungi mashqni qayd qilish uchun + tugmasini bosing"
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
            {exercise.entries.map(entry => {
              const type = EXERCISE_TYPES.find(t => t.id === entry.type)
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                  className="card p-4 flex items-center gap-3"
                >
                  <span className="text-xl">{type?.emoji || '⚡'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{entry.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-[var(--color-text-tertiary)]">{entry.time}</span>
                      <span className="text-[11px] text-[var(--color-text-tertiary)]">•</span>
                      <span className="text-[11px] font-medium text-primary">{entry.minutes} daq</span>
                      <span className="text-[11px] text-[var(--color-text-tertiary)]">•</span>
                      <span className="text-[11px] font-medium text-[var(--color-danger)]">{entry.caloriesBurned} kkal</span>
                    </div>
                  </div>
                  <button onClick={() => removeExercise(entry.id)} aria-label="O'chirish" className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] cursor-pointer">
                    <X size={14} aria-hidden="true" />
                  </button>
                </motion.div>
              )
            })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showForm && (
        <BottomSheet title="Mashq qayd qilish" onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {EXERCISE_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setForm(f => ({ ...f, type: type.id }))}
                  className={`py-3 rounded-2xl text-center text-xs font-semibold transition-all cursor-pointer ${
                    form.type === type.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-[var(--color-divider)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className="block text-lg mb-1">{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="exercise-duration" className="text-sm font-semibold mb-2 block">Davomiyligi (daqiqa)</label>
              <input
                id="exercise-duration"
                type="number"
                value={form.minutes}
                onChange={e => setForm(f => ({ ...f, minutes: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--color-divider)] text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!form.minutes || parseInt(form.minutes) <= 0}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-transform cursor-pointer"
            >
              Saqlash
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}
