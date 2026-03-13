import { useState, useMemo } from 'react'
import { useProfile } from '../hooks/useProfile'
import { getFoodGuide } from '../data/foodGuides'
import PageHeader from '../components/shared/PageHeader'

const SUBTITLES = {
  breastfeeding_constipation: 'Ich kelishi uchun foydali va zararli',
  insulin_resistance: 'Insulin boshqaruvi uchun tavsiyalar',
  fat_burning: "Yog' yoqish uchun to'g'ri ovqatlanish",
  sugar_free: 'Shakarsiz hayot uchun mahsulotlar',
  general_wellness: "Sog'liq uchun foydali va zararli",
}

export default function FoodGuide() {
  const [tab, setTab] = useState('good')
  const { profile } = useProfile()

  const { beneficial, harmful } = useMemo(
    () => getFoodGuide(profile.taskSet),
    [profile.taskSet]
  )

  const subtitle = SUBTITLES[profile.taskSet] || SUBTITLES.general_wellness

  return (
    <div>
      <PageHeader title="Mahsulotlar" subtitle={subtitle} />

      <div className="px-4">
        <div className="card flex p-1.5 mb-4">
          <button
            onClick={() => setTab('good')}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              tab === 'good' ? 'bg-primary text-white shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            Foydali
          </button>
          <button
            onClick={() => setTab('bad')}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              tab === 'bad' ? 'bg-[var(--color-danger)] text-white shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            Zararli
          </button>
        </div>

        {tab === 'good' ? (
          <div className="space-y-3 pb-6 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {beneficial.map(food => (
              <div key={food.name} className="card p-4 border-l-4 border-l-[var(--color-success)]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{food.emoji}</span>
                  <div>
                    <h3 className="text-sm font-bold">{food.name}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{food.benefit}</p>
                    <p className="text-xs text-primary mt-1.5 font-medium">{food.howToUse}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 pb-6 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {harmful.map(food => (
              <div key={food.name} className="card p-4 border-l-4 border-l-[var(--color-danger)]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{food.emoji}</span>
                  <div>
                    <h3 className="text-sm font-bold">{food.name}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{food.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
