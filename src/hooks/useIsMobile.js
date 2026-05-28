import { useEffect, useState } from 'react'

/**
 * useIsMobile — true when the viewport is below the given breakpoint
 * (default 900px, matching MUI's `md`).
 *
 * SSR-safe: defaults to `false` on first paint so the desktop layout
 * renders during hydration. After mount we read window.matchMedia and
 * update; React re-renders with the correct value within a single tick.
 *
 * We subscribe to matchMedia change events so a desktop user who shrinks
 * their window or rotates a tablet gets the alternate layout without a
 * reload.
 */
export function useIsMobile(maxWidthPx = 899) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`)
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    // `addEventListener('change', ...)` is the modern API; older Safari
    // still requires `addListener`. Cover both.
    if (mq.addEventListener) mq.addEventListener('change', handler)
    else mq.addListener(handler)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler)
      else mq.removeListener(handler)
    }
  }, [maxWidthPx])

  return isMobile
}
