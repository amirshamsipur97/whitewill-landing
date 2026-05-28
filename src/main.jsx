import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './index.css'
import App from './App.jsx'
import theme from './theme.js'
import { I18nProvider } from './i18n.jsx'

// ── Defensive DOM patches ─────────────────────────────────────────────────
// GSAP ScrollTrigger wraps pinned elements in a generated "pin spacer" div.
// When React Router unmounts a page that contains pinned sections (e.g.
// landing → /about), React walks the fiber tree and calls removeChild /
// insertBefore on the saved parent references — but GSAP has already
// moved the wrapped node into the spacer, so React's expected parent no
// longer contains the child. The native DOM throws `NotFoundError`,
// React's commit phase aborts mid-flight, and the entire #root ends up
// empty.
//
// Smart fix: when React asks us to remove a child that no longer lives
// directly inside `this`, walk UP from the child to find whichever
// ancestor IS our direct child (typically the GSAP pin-spacer wrapper)
// and remove THAT instead. This removes the wrapper *and* the originally
// targeted element in one go — no orphan DOM left behind.
if (typeof window !== 'undefined' && !window.__domSafetyPatched) {
  const origRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function safeRemoveChild(child) {
    if (child && child.parentNode !== this) {
      // GSAP (or another lib) re-parented this node. Find the wrapper
      // that's a direct child of `this` and remove that one — taking
      // the originally requested child with it.
      let walker = child.parentNode
      while (walker && walker !== document.body && walker !== document.documentElement) {
        if (walker.parentNode === this) {
          return origRemoveChild.call(this, walker)
        }
        walker = walker.parentNode
      }
      return child
    }
    return origRemoveChild.call(this, child)
  }

  const origInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function safeInsertBefore(newNode, refNode) {
    if (refNode && refNode.parentNode !== this) {
      return origInsertBefore.call(this, newNode, null)
    }
    return origInsertBefore.call(this, newNode, refNode)
  }

  window.__domSafetyPatched = true
}

// ── Hard reset on every client-side navigation ────────────────────────────
// We patch history.pushState / replaceState to fire a global event BEFORE
// React Router sees the URL change. ScrollManager listens for this event
// and runs `ScrollTrigger.killAll()` plus a pin-spacer purge, which
// guarantees the next page mounts onto a clean DOM regardless of what the
// previous page was doing.
if (typeof window !== 'undefined' && !window.__navPatched) {
  const fire = () => {
    try {
      window.dispatchEvent(new CustomEvent('app:beforenav'))
    } catch {}
  }
  const origPush = history.pushState.bind(history)
  const origReplace = history.replaceState.bind(history)
  history.pushState = function patchedPushState(...args) {
    fire()
    return origPush(...args)
  }
  history.replaceState = function patchedReplaceState(...args) {
    fire()
    return origReplace(...args)
  }
  window.addEventListener('popstate', fire)
  window.__navPatched = true
}

// ── Lenis smooth scroll, globally ─────────────────────────────────────────
// Lenis intercepts the native wheel/touch and lerps scrollTop. The result is
// a buttery-smooth scroll feel and — critically — GSAP ScrollTrigger gets
// driven by the same RAF tick, so scrub animations interpolate at sub-frame
// precision instead of jittering with the native scroll deltas.
gsap.registerPlugin(ScrollTrigger)

// Promote every tweened transform to its own GPU layer. The default is
// `auto` which leaves it up to GSAP's heuristics — for a page with this
// many concurrent scroll-driven animations, forcing it removes a class of
// repaint stutter when sections enter the viewport.
gsap.defaults({ force3D: true })

const lenis = new Lenis({
  // Snappier feel than the previous 1.15 + expo-out combo, which felt
  // sticky at the start of every wheel tick. easeOutCubic responds
  // immediately and decays evenly across the lerp window.
  duration: 1.0,
  easing: (t) => 1 - Math.pow(1 - t, 3),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
})

// Tell ScrollTrigger to refresh on every Lenis scroll tick.
lenis.on('scroll', ScrollTrigger.update)

// Drive Lenis off GSAP's ticker (sub-millisecond accurate).
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// Expose for debugging / scrollTo from buttons
if (typeof window !== 'undefined') window.__lenis = lenis

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>,
)
