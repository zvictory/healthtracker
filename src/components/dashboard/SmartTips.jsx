import { useState, useEffect } from 'react'
import { Lightbulb } from 'lucide-react'
import { useSmartTips } from '../../hooks/useSmartTips'

export default function SmartTips() {
  const { tips } = useSmartTips()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (tips.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % tips.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [tips.length])

  if (!tips.length) return null

  return (
    <div className="card p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-warning rounded-r-full" />
      <div className="flex items-start gap-3 pl-2">
        <div className="w-9 h-9 rounded-xl bg-warning-light flex items-center justify-center flex-shrink-0">
          <Lightbulb size={16} className="text-warning" />
        </div>
        <div className="flex-1 min-h-[44px]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-warning mb-1">Maslahat</p>
          <p key={currentIndex} className="text-sm leading-relaxed animate-fade-in">
            {tips[currentIndex]}
          </p>
        </div>
      </div>
      {tips.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3 pl-2">
          {tips.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-warning w-4' : 'bg-[var(--color-border)] w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
