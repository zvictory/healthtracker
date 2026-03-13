import { Scale, Ruler, Droplets } from 'lucide-react'
import { useBody } from '../hooks/useBody'
import { useProfile } from '../hooks/useProfile'
import PageHeader from '../components/shared/PageHeader'

export default function BodyMetrics() {
  const { body, updateBody, updateGlucose } = useBody()
  const { profile } = useProfile()
  const showGlucose = profile.taskSet === 'insulin_resistance' || profile.conditions?.includes('diabetes')

  return (
    <div>
      <PageHeader
        title="Tana ko'rsatkichlari"
        subtitle="Kunlik o'lchovlar"
        eyebrow="Monitoring"
      />

      <div className="px-4 space-y-4 pb-8">
        {/* Weight */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-primary-light flex items-center justify-center">
              <Scale size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Vazn</p>
              <p className="text-[11px] text-[var(--color-text-tertiary)]">Ertalab ochqoringa o'lchang</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.1"
              placeholder="kg"
              value={body.weight || ''}
              onChange={e => updateBody({ weight: parseFloat(e.target.value) || null })}
              className="flex-1 px-4 py-3 rounded-2xl bg-[var(--color-divider)] text-sm outline-none focus:ring-2 focus:ring-primary/30 text-center text-lg font-bold"
            />
            <span className="text-sm text-[var(--color-text-tertiary)] font-medium">kg</span>
          </div>
        </div>

        {/* Waist */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-warning-light)] flex items-center justify-center">
              <Ruler size={18} className="text-[var(--color-warning)]" />
            </div>
            <div>
              <p className="text-sm font-bold">Bel aylanasi</p>
              <p className="text-[11px] text-[var(--color-text-tertiary)]">Kindik atrofidan o'lchang</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.5"
              placeholder="sm"
              value={body.waist || ''}
              onChange={e => updateBody({ waist: parseFloat(e.target.value) || null })}
              className="flex-1 px-4 py-3 rounded-2xl bg-[var(--color-divider)] text-sm outline-none focus:ring-2 focus:ring-primary/30 text-center text-lg font-bold"
            />
            <span className="text-sm text-[var(--color-text-tertiary)] font-medium">sm</span>
          </div>
        </div>

        {/* Glucose — only for insulin resistance / diabetes */}
        {showGlucose && (
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-danger-light)] flex items-center justify-center">
                <Droplets size={18} className="text-[var(--color-danger)]" />
              </div>
              <div>
                <p className="text-sm font-bold">Qon shakari</p>
                <p className="text-[11px] text-[var(--color-text-tertiary)]">mmol/L (glyukometr bilan)</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 block">Ochqoringa (nahor)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="—"
                    value={body.glucose?.fasting || ''}
                    onChange={e => updateGlucose({ fasting: parseFloat(e.target.value) || null })}
                    className="flex-1 px-4 py-3 rounded-2xl bg-[var(--color-divider)] text-sm outline-none focus:ring-2 focus:ring-primary/30 text-center font-bold"
                  />
                  <span className="text-xs text-[var(--color-text-tertiary)]">mmol/L</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 block">Ovqatdan 2 soat keyin</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="—"
                    value={body.glucose?.postMeal || ''}
                    onChange={e => updateGlucose({ postMeal: parseFloat(e.target.value) || null })}
                    className="flex-1 px-4 py-3 rounded-2xl bg-[var(--color-divider)] text-sm outline-none focus:ring-2 focus:ring-primary/30 text-center font-bold"
                  />
                  <span className="text-xs text-[var(--color-text-tertiary)]">mmol/L</span>
                </div>
              </div>
              {body.glucose?.fasting && (
                <div className={`p-3 rounded-xl text-xs font-medium ${
                  body.glucose.fasting <= 5.5
                    ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                    : body.glucose.fasting <= 7.0
                      ? 'bg-[var(--color-warning-light)] text-[var(--color-warning)]'
                      : 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
                }`}>
                  {body.glucose.fasting <= 5.5
                    ? 'Normal doirada (3.9–5.5 mmol/L)'
                    : body.glucose.fasting <= 7.0
                      ? 'Biroz yuqori — ehtiyot bo\'ling'
                      : 'Yuqori — shifokorga murojaat qiling'
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
