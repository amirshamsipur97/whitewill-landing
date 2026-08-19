/**
 * ChunkErrorBoundary — recovers from stale lazy chunks after a deploy.
 *
 * THE FAILURE IT FIXES, seen in production 2026-08-18: a visitor had a tab
 * open from an earlier build. Every page route in this app is `lazy()`, and
 * the deploy replaced `assets/SearchPage-<hash>.js` with a new hash. Their
 * click on the landing CTA fired a dynamic import for a file that no longer
 * exists, the import rejected, and because the app had NO error boundary the
 * whole React tree unmounted. The URL was right, the page was solid black, and
 * nothing in the console said why. Any visitor whose tab outlives a deploy hits
 * this, on any route, which makes it a permanent hazard on a site that deploys
 * several times a day.
 *
 * Suspense alone cannot help here: it handles the PENDING promise, not a
 * rejected one. Only an error boundary catches this.
 *
 * RECOVERY: for a chunk-load failure the fresh HTML already points at the new
 * hashes, so one reload fixes it and the visitor lands where they were going.
 * That reload is fired ONCE, guarded by a sessionStorage flag, because a
 * genuinely missing asset would otherwise loop the browser forever.
 *
 * Anything else renders a small visible message instead of a black void. A
 * blank page teaches a visitor the site is broken; a sentence and a button
 * does not.
 */
import { Component } from 'react'

const RELOAD_FLAG = 'irfan_chunk_reload'

// Vite, webpack and the browsers all word this differently, so match broadly.
const isChunkError = (err) => {
  const s = `${err?.name || ''} ${err?.message || ''}`.toLowerCase()
  return (
    s.includes('dynamically imported module') ||
    s.includes('failed to fetch dynamically') ||
    s.includes('loading chunk') ||
    s.includes('loading css chunk') ||
    s.includes('importing a module script failed') ||
    s.includes('unexpected token') && s.includes('<') // an HTML 404 body parsed as JS
  )
}

export default class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (!isChunkError(error)) return
    let alreadyTried = true
    try {
      alreadyTried = sessionStorage.getItem(RELOAD_FLAG) === '1'
      if (!alreadyTried) sessionStorage.setItem(RELOAD_FLAG, '1')
    } catch { /* private mode: fall through to the message */ }
    if (!alreadyTried) window.location.reload()
  }

  componentDidMount() {
    // A clean mount means the reload worked (or was never needed), so let the
    // next stale-chunk event have its own single retry.
    try { sessionStorage.removeItem(RELOAD_FLAG) } catch { /* ignore */ }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', background: '#000', color: '#fff', padding: 24, textAlign: 'center' }}>
        <div>
          <p style={{ fontSize: 17, marginBottom: 18, opacity: 0.85 }}>
            This page did not load correctly. Refreshing usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ background: '#8c8d25', color: '#000', border: 0, borderRadius: 999, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}
