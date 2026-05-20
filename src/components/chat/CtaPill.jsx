import SpinnerDots from './SpinnerDots'

/**
 * Black pill-shaped CTA fixed at bottom-left with a rotating dotted-circle
 * icon. Clicking it opens the ChatPanel (handled by parent ChatWidget).
 */
export default function CtaPill({ onClick, label = "Let's work together" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-10 right-10 z-40 group flex items-center gap-3 rounded-full bg-[#797A51] text-white py-3 pl-3 pr-5 text-sm font-medium shadow-lg hover:bg-[#5d5e3e] transition-colors"
      style={{
        // Soft outer glow + subtle border so it pops against any background.
        boxShadow: '0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset',
      }}
    >
      <span className="text-white">
        <SpinnerDots size={20} />
      </span>
      <span>{label}</span>
    </button>
  )
}
