import { useState } from 'react'
import { Plus, Minus, AlertTriangle, Baby, Droplets } from 'lucide-react'
import { useWater } from '../hooks/useWater'
import GlassAnimation from '../components/water/GlassAnimation'
import ProgressRing from '../components/shared/ProgressRing'
import PageHeader from '../components/shared/PageHeader'
import ConfettiEffect from '../components/shared/ConfettiEffect'

export default function WaterTracker() {
  const { consumed, target, log, progress, isConstipationMode, addGlass, removeGlass } = useWater()
  const [confettiTrigger, setConfettiTrigger] = useState(0)

  const handleAdd = () => {
    addGlass()
    if (consumed + 1 >= target) {
      setConfettiTrigger(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <ConfettiEffect trigger={confettiTrigger} />

      <PageHeader title="Suv Tracker" subtitle="Kunlik suv ichish kuzatuvi" />

      {isConstipationMode && (
        <div className="mx-4 lg:mx-6 mb-4 p-3 bg-[var(--color-warning-light)] rounded-xl border border-[var(--color-warning)]/30">
          <p className="text-sm text-[var(--color-warning)] font-medium flex items-center gap-2">
            <AlertTriangle size={16} className="flex-shrink-0" />
            Ich qotganligi sababli maqsad 12 stakanga oshirildi
          </p>
        </div>
      )}

      <div className="flex flex-col items-center px-4 lg:px-6 pt-4">
        <ProgressRing
          progress={progress}
          size={200}
          strokeWidth={12}
          color="var(--color-water)"
          bgColor="var(--color-water-light)"
        >
          <div className="flex flex-col items-center">
            <GlassAnimation progress={progress} />
            <div className="text-2xl font-extrabold text-[var(--color-water)] mt-1">
              {consumed}/{target}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">stakan</div>
          </div>
        </ProgressRing>

        <div className="flex items-center gap-6 mt-8">
          <button
            onClick={removeGlass}
            disabled={consumed <= 0}
            className="w-12 h-12 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform cursor-pointer"
          >
            <Minus size={20} />
          </button>

          <button
            onClick={handleAdd}
            className="w-16 h-16 rounded-2xl bg-[var(--color-water)] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
          >
            <Plus size={28} />
          </button>

          <div className="w-12" />
        </div>

        <div className="mt-4 card p-3 text-center">
          <p className="text-sm text-[var(--color-water)] font-medium flex items-center justify-center gap-2">
            <Baby size={16} className="flex-shrink-0" />
            Sut berdingizmi? Suv iching!
          </p>
        </div>
      </div>

      {log.length > 0 && (
        <div className="px-4 lg:px-6 mt-6 pb-6">
          <h3 className="text-sm font-semibold mb-2">Bugungi log</h3>
          <div className="card p-3">
            <div className="flex flex-wrap gap-2">
              {log.map((time, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[var(--color-water-light)] rounded-lg text-xs text-[var(--color-water)] font-medium flex items-center gap-1"
                >
                  <Droplets size={10} />
                  {time}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
