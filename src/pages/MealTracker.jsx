import { useState } from 'react'
import { Plus, X, Cookie, Flame } from 'lucide-react'
import { useMeals } from '../hooks/useMeals'
import { useProfile } from '../hooks/useProfile'
import PageHeader from '../components/shared/PageHeader'
import BottomSheet from '../components/shared/BottomSheet'
import EmptyState from '../components/shared/EmptyState'

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Nonushta', emoji: '🌅' },
  { id: 'lunch', label: 'Tushlik', emoji: '☀️' },
  { id: 'dinner', label: 'Kechki ovqat', emoji: '🌙' },
  { id: 'snack', label: 'Snack', emoji: '🍎' },
]

export default function MealTracker() {
  const { meals, addMeal, removeMeal, mealCount } = useMeals()
  const { profile } = useProfile()
  const isSugarFree = profile.taskSet === 'sugar_free'
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'lunch', description: '', calories: '', hasSugar: false })

  const handleSave = () => {
    if (!form.description.trim()) return
    addMeal({
      type: form.type,
      description: form.description.trim(),
      calories: parseInt(form.calories) || 0,
      hasSugar: form.hasSugar,
    })
    setForm({ type: 'lunch', description: '', calories: '', hasSugar: false })
    setShowForm(false)
  }

  return (
    <div>
      <PageHeader
        title="Ovqatlanish"
        subtitle={`Bugun ${mealCount} ta ovqat qayd qilindi`}
        eyebrow="Kunlik kuzatuv"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="px-4 space-y-3 pb-8">
        {/* Sugar-free badge */}
        {isSugarFree && meals.sugarFreeStreak && mealCount > 0 && (
          <div className="card p-4 bg-[var(--color-success-light)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-success)]/16 flex items-center justify-center">
              <Cookie size={18} className="text-[var(--color-success)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-success)]">Shakarsiz kun!</p>
              <p className="text-[11px] text-[var(--color-text-secondary)]">Bugungi ovqatlaringiz shakarsiz. Davom eting!</p>
            </div>
          </div>
        )}

        {/* Calorie summary */}
        {mealCount > 0 && (
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-warning-light)] flex items-center justify-center">
                  <Flame size={18} className="text-[var(--color-warning)]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Jami kaloriya</p>
                  <p className="text-lg font-bold mt-0.5">{meals.totalCalories} <span className="text-sm font-normal text-[var(--color-text-tertiary)]">kkal</span></p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">{mealCount} ovqat</span>
            </div>
          </div>
        )}

        {/* Meal list */}
        {mealCount === 0 ? (
          <EmptyState
            icon={Cookie}
            title="Ovqat qayd qilinmagan"
            description="Birinchi ovqatni qayd qilish uchun + tugmasini bosing"
          />
        ) : (
          <div className="space-y-2">
            {meals.entries.map(entry => {
              const mealType = MEAL_TYPES.find(m => m.id === entry.type)
              return (
                <div key={entry.id} className="card p-4 flex items-center gap-3">
                  <span className="text-xl">{mealType?.emoji || '🍽️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{entry.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-[var(--color-text-tertiary)]">{mealType?.label}</span>
                      <span className="text-[11px] text-[var(--color-text-tertiary)]">•</span>
                      <span className="text-[11px] text-[var(--color-text-tertiary)]">{entry.time}</span>
                      {entry.calories > 0 && (
                        <>
                          <span className="text-[11px] text-[var(--color-text-tertiary)]">•</span>
                          <span className="text-[11px] font-medium text-[var(--color-warning)]">{entry.calories} kkal</span>
                        </>
                      )}
                      {isSugarFree && entry.hasSugar && (
                        <span className="text-[10px] font-semibold text-[var(--color-danger)] bg-[var(--color-danger-light)] px-1.5 py-0.5 rounded-full">Shakarli</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => removeMeal(entry.id)} className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <BottomSheet title="Ovqat qayd qilish" onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            {/* Meal type */}
            <div className="grid grid-cols-4 gap-2">
              {MEAL_TYPES.map(type => (
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

            {/* Description */}
            <input
              type="text"
              placeholder="Nima yedingiz?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--color-divider)] text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />

            {/* Calories */}
            <input
              type="number"
              placeholder="Kaloriya (ixtiyoriy)"
              value={form.calories}
              onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--color-divider)] text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />

            {/* Sugar toggle */}
            {isSugarFree && (
              <button
                onClick={() => setForm(f => ({ ...f, hasSugar: !f.hasSugar }))}
                className={`w-full py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  form.hasSugar
                    ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)] ring-2 ring-[var(--color-danger)]/30'
                    : 'bg-[var(--color-divider)] text-[var(--color-text-secondary)]'
                }`}
              >
                {form.hasSugar ? 'Shakar bor' : 'Shakarsiz'}
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={!form.description.trim()}
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
