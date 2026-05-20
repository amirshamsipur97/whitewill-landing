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

// ── Lenis smooth scroll, globally ─────────────────────────────────────────
// Lenis intercepts the native wheel/touch and lerps scrollTop. The result is
// a buttery-smooth scroll feel and — critically — GSAP ScrollTrigger gets
// driven by the same RAF tick, so scrub animations interpolate at sub-frame
// precision instead of jittering with the native scroll deltas.
gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  duration: 1.15,
  // Custom expo-out easing — fast initial response, gentle settle.
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
