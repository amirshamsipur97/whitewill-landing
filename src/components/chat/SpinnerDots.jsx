/**
 * 10 small dots arranged in a circle, rotating 360° every 12s.
 * Pure CSS rotation (defined as `.spin-slow` in src/index.css).
 * Reused by CtaPill, ChatInput, and anywhere a brand "loading" mark is needed.
 */
export default function SpinnerDots({ size = 18 }) {
  const dots = Array.from({ length: 10 })
  const radius = size / 2 - 2
  // `inline-block` baselines next to text → ring sits ~2px higher than the
  // text's optical center. Using `block` + `vertical-align: middle` and a
  // tiny flex-shrink:0 keeps the ring sized to the box and perfectly
  // centered with the adjacent label.
  return (
    <div
      className="relative spin-slow"
      style={{
        width: size,
        height: size,
        display: 'block',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      aria-hidden
    >
      {dots.map((_, i) => {
        const angle = (i / dots.length) * Math.PI * 2
        const x = size / 2 + Math.cos(angle) * radius - 1
        const y = size / 2 + Math.sin(angle) * radius - 1
        return (
          <span
            key={i}
            className="absolute rounded-full bg-current"
            style={{ left: x, top: y, width: 2, height: 2 }}
          />
        )
      })}
    </div>
  )
}
