import { useState } from 'react'
import { beneficialFoods, harmfulFoods } from '../data/foodGuide'
import PageHeader from '../components/shared/PageHeader'

export default function FoodGuide() {
  const [tab, setTab] = useState('good')

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PageHeader title="Mahsulotlar" subtitle="Ich kelishi uchun foydali va zararli" />

      <div className="px-4">
        <div className="card flex p-1 mb-4">
          <button
            onClick={() => setTab('good')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'good' ? 'bg-primary text-white' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            Foydali
          </button>
          <button
            onClick={() => setTab('bad')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'bad' ? 'bg-[var(--color-danger)] text-white' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            Zararli
          </button>
        </div>

        {tab === 'good' ? (
          <div className="space-y-3 pb-6 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {beneficialFoods.map(food => (
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
            {harmfulFoods.map(food => (
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
