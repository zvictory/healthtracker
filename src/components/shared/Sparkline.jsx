import { useMemo } from 'react'

export default function Sparkline({ data = [], color = 'var(--color-primary)', height = 32, width = 80 }) {
  const points = useMemo(() => {
    if (data.length < 2) return ''
    const max = Math.max(...data, 1)
    const min = Math.min(...data, 0)
    const range = max - min || 1
    const stepX = width / (data.length - 1)
    const padding = 2

    return data.map((v, i) => {
      const x = i * stepX
      const y = padding + (height - padding * 2) * (1 - (v - min) / range)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
  }, [data, height, width])

  const areaPath = useMemo(() => {
    if (!points) return ''
    const stepX = width / (data.length - 1)
    return `${points} L${((data.length - 1) * stepX).toFixed(1)},${height} L0,${height} Z`
  }, [points, data.length, height, width])

  if (data.length < 2) return null

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${color.replace(/[^a-z0-9]/gi, '')})`} />
      <path d={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
