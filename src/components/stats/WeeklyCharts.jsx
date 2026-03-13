import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Cell, Area, AreaChart } from 'recharts'
import { formatDateShort } from '../../utils/dateUtils'

export default function WeeklyCharts({ historicalData, profile }) {
  const last7 = [...historicalData.slice(0, 7)].reverse()
  const modules = profile?.activeModules || []

  const scoreData = last7.map(d => ({
    date: formatDateShort(d.date),
    score: d.score || 0,
  }))

  const waterData = last7.map(d => ({
    date: formatDateShort(d.date),
    water: d.water?.consumed || 0,
  }))

  const getBarColor = (score) => {
    if (score >= 70) return 'var(--color-success)'
    if (score >= 40) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  const chartCard = (title, children) => (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div style={{ height: 180 }}>
        {children}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {chartCard('Sog\'liq balli (7 kun)',
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {scoreData.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartCard('Suv ichish dinamikasi',
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={waterData}>
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-water)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-water)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Area type="monotone" dataKey="water" stroke="var(--color-water)" strokeWidth={2.5} fill="url(#waterGradient)" dot={{ r: 3, fill: 'var(--color-water)' }} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {modules.includes('exercise') && (() => {
        const exerciseData = last7.map(d => ({
          date: formatDateShort(d.date),
          minutes: d.exercise?.totalMinutes || 0,
          calories: d.exercise?.totalCalories || 0,
        }))
        return chartCard('Mashq faoliyati',
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exerciseData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Bar dataKey="minutes" name="Daqiqa" radius={[6, 6, 0, 0]} fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        )
      })()}

      {modules.includes('meals') && (() => {
        const mealData = last7.map(d => ({
          date: formatDateShort(d.date),
          totalCalories: d.meals?.totalCalories || 0,
        }))
        return chartCard('Kaloriya dinamikasi',
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mealData}>
              <defs>
                <linearGradient id="mealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="totalCalories" stroke="var(--color-warning)" strokeWidth={2.5} fill="url(#mealGradient)" dot={{ r: 3, fill: 'var(--color-warning)' }} />
            </AreaChart>
          </ResponsiveContainer>
        )
      })()}
    </div>
  )
}
