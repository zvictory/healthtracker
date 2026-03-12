import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { formatDateShort } from '../../utils/dateUtils'

export default function WeeklyCharts({ historicalData }) {
  const last7 = [...historicalData.slice(0, 7)].reverse()

  const scoreData = last7.map(d => ({
    date: formatDateShort(d.date),
    score: d.score || 0,
  }))

  const waterData = last7.map(d => ({
    date: formatDateShort(d.date),
    water: d.water?.consumed || 0,
  }))

  const getBarColor = (score) => {
    if (score >= 70) return '#4CAF50'
    if (score >= 40) return '#FF9800'
    return '#F44336'
  }

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)]">
        <h3 className="text-sm font-semibold mb-3">Sog'liq balli (7 kun)</h3>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {scoreData.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)]">
        <h3 className="text-sm font-semibold mb-3">Suv ichish dinamikasi</h3>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waterData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="water" stroke="#2196F3" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
