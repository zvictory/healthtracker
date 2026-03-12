export default function GlassAnimation({ progress }) {
  const waterHeight = Math.min(progress, 100)
  const color = progress >= 100 ? '#2196F3' : progress >= 50 ? '#64B5F6' : '#BBDEFB'

  return (
    <svg width="48" height="56" viewBox="0 0 48 56">
      <defs>
        <clipPath id="glass-clip">
          <path d="M8 4 L12 52 L36 52 L40 4 Z" />
        </clipPath>
      </defs>

      {/* Glass outline */}
      <path
        d="M8 4 L12 52 L36 52 L40 4 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />

      {/* Water fill */}
      <g clipPath="url(#glass-clip)">
        <rect
          x="0"
          y={56 - (waterHeight * 48) / 100}
          width="48"
          height={(waterHeight * 48) / 100}
          fill={color}
          style={{ transition: 'all 0.5s ease-in-out' }}
        />
        {/* Wave effect */}
        {waterHeight > 0 && waterHeight < 100 && (
          <path
            d={`M0 ${56 - (waterHeight * 48) / 100} Q12 ${56 - (waterHeight * 48) / 100 - 3} 24 ${56 - (waterHeight * 48) / 100} Q36 ${56 - (waterHeight * 48) / 100 + 3} 48 ${56 - (waterHeight * 48) / 100}`}
            fill={color}
            style={{ transition: 'all 0.5s ease-in-out' }}
          />
        )}
      </g>
    </svg>
  )
}
