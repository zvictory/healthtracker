import { progressMessages } from '../../data/tips'

export default function TaskMotivation({ progress }) {
  const getMessage = () => {
    if (progress >= 100) return progressMessages[100]
    if (progress >= 75) return progressMessages[75]
    if (progress >= 50) return progressMessages[50]
    if (progress >= 25) return progressMessages[25]
    return progressMessages[0]
  }

  return (
    <div className="px-4 lg:px-6 pb-3">
      <div className="card p-5">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2.5 bg-[var(--color-divider)] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-bold text-primary tabular-nums rounded-full bg-primary-50 px-3 py-1">{progress}%</span>
        </div>
        <p className="text-[13px] mt-3 text-center text-[var(--color-text-secondary)]">{getMessage()}</p>
      </div>
    </div>
  )
}
