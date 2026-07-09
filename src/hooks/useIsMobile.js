import { useEffect, useState } from 'react'

/**
 * useIsMobile — true when the viewport is below the given breakpoint
 * (default 900px, matching MUI's `md`).
 *
 * Initialized synchronously from matchMedia — this app is pure CSR (no
 * hydration), so the very first render must already know the real viewport.
 * The old `useState(false)` default made phones mount every desktop-only
 * landing section for one tick, kicking off ~40 MB of video downloads
 * before the unmount.
 *
 * We subscribe to matchMedia change events so a desktop user who shrinks
 * their window or rotates a tablet gets the alternate layout without a
 * reload.
 */
export function useIsMobile(maxWidthPx = 899) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(`(max-width: ${maxWidthPx}px)`).matches
      : false,
  )

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
