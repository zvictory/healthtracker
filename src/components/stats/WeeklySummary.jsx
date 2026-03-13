import { Droplets, Activity, Timer, UtensilsCrossed, BarChart3, ListChecks } from 'lucide-react'

export default function WeeklySummary({ summary, profile }) {
  const modules = profile?.activeModules || []

  const stats = [
    {
      icon: BarChart3,
      value: `${summary.avgScore}%`,
      label: "O'rtacha ball",
      colorClass: 'bg-success-light text-success',
    },
    {
      icon: Droplets,
      value: summary.totalWater,
      label: 'Jami suv (stakan)',
      colorClass: 'bg-water-light text-water',
    },
  ]

  if (modules.includes('bowel')) {
    stats.push({
      icon: Activity,
      value: `${summary.bowelDays}/7`,
      label: 'Ich kelish kunlari',
      colorClass: 'bg-warning-light text-warning',
    })
  }

  if (modules.includes('exercise')) {
    stats.push({
      icon: Timer,
      value: `${summary.exerciseMinutes || 0}`,
      label: 'Mashq (daqiqa)',
      colorClass: 'bg-primary-light text-primary',
    })
  }

  if (modules.includes('meals')) {
    stats.push({
      icon: UtensilsCrossed,
      value: summary.totalMeals || 0,
      label: 'Ovqat yozuvlari',
      colorClass: 'bg-accent-light text-accent',
    })
  }

  // Always show completed tasks
  stats.push({
    icon: ListChecks,
    value: summary.completedTasks,
    label: 'Bajarilgan vazifalar',
    colorClass: 'bg-primary-light text-primary',
  })

  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-3">Haftalik xulosa</h3>
      <div className={`grid gap-3 ${stats.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {stats.map(({ icon: Icon, value, label, colorClass }) => (
          <div key={label} className={`rounded-xl p-3 text-center ${colorClass.split(' ')[0]}`}>
            <div className="flex justify-center mb-1.5">
              <Icon size={16} className={colorClass.split(' ')[1]} />
            </div>
            <p className={`text-xl font-extrabold ${colorClass.split(' ')[1]}`}>{value}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
