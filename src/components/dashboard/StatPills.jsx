import { Link } from 'react-router-dom'
import { Droplets, ListChecks, Flame, Activity, UtensilsCrossed, Dumbbell, Scale } from 'lucide-react'

export default function StatPills({ todayData, profile }) {
  const modules = profile?.activeModules || []
  const water = todayData.water || { consumed: 0, target: 8 }
  const tasks = todayData.tasks || {}
  const allTasks = Object.values(tasks)
  const completedTasks = allTasks.filter(t => t.done).length

  const pills = [
    {
      icon: Droplets,
      value: `${water.consumed}/${water.target}`,
      label: 'Suv',
      color: 'var(--color-water)',
      bg: 'bg-water-light',
      to: '/water',
    },
    {
      icon: ListChecks,
      value: `${completedTasks}/${allTasks.length}`,
      label: 'Vazifa',
      color: 'var(--color-primary)',
      bg: 'bg-primary-light',
      to: '/tasks',
    },
  ]

  if (modules.includes('bowel')) {
    pills.push({
      icon: Activity,
      value: todayData.bowel?.happened ? 'Ha' : '—',
      label: 'Ichak',
      color: 'var(--color-success)',
      bg: 'bg-success-light',
      to: '/bowel',
    })
  }

  if (modules.includes('exercise')) {
    pills.push({
      icon: Dumbbell,
      value: `${todayData.exercise?.totalMinutes || 0}′`,
      label: 'Mashq',
      color: 'var(--color-primary)',
      bg: 'bg-primary-light',
      to: '/exercise',
    })
  }

  if (modules.includes('meals')) {
    pills.push({
      icon: UtensilsCrossed,
      value: `${todayData.meals?.entries?.length || 0}`,
      label: 'Ovqat',
      color: 'var(--color-accent)',
      bg: 'bg-accent-light',
      to: '/meals',
    })
  }

  if (modules.includes('body')) {
    pills.push({
      icon: Scale,
      value: todayData.body?.weight ? `${todayData.body.weight}` : '—',
      label: 'kg',
      color: '#6366F1',
      bg: 'bg-[#6366F1]/10',
      to: '/body',
    })
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:flex-wrap">
      {pills.map(({ icon: Icon, value, label, color, bg, to }) => (
        <Link
          key={label}
          to={to}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl ${bg} shrink-0 cursor-pointer hover:opacity-80 transition-opacity`}
        >
          <Icon size={14} style={{ color }} />
          <span className="text-xs font-bold tabular-nums" style={{ color }}>{value}</span>
          <span className="text-[10px] text-[var(--color-text-tertiary)]">{label}</span>
        </Link>
      ))}
    </div>
  )
}
