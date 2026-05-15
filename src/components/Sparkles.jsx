const STARS = [
  { left: '8%', top: '20%', size: 14, opacity: 0.7 },
  { left: '15%', top: '55%', size: 8, opacity: 0.4 },
  { left: '22%', top: '35%', size: 10, opacity: 0.5 },
  { left: '30%', top: '70%', size: 6, opacity: 0.35 },
  { left: '45%', top: '12%', size: 12, opacity: 0.6 },
  { left: '60%', top: '80%', size: 8, opacity: 0.45 },
  { left: '72%', top: '25%', size: 14, opacity: 0.65 },
  { left: '82%', top: '60%', size: 10, opacity: 0.5 },
  { left: '90%', top: '40%', size: 8, opacity: 0.4 },
  { left: '50%', top: '50%', size: 6, opacity: 0.3 },
  { left: '38%', top: '85%', size: 7, opacity: 0.35 },
  { left: '88%', top: '15%', size: 6, opacity: 0.3 },
]

function StarIcon({ size = 12, opacity = 0.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path
        d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
        fill="white"
      />
    </svg>
  )
}

export default function Sparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute"
          style={{ left: s.left, top: s.top }}
        >
          <StarIcon size={s.size} opacity={s.opacity} />
        </span>
      ))}
    </div>
  )
}
