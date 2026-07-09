import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlobalPresencePanel from './GlobalPresencePanel'
import { useI18n } from '../i18n.jsx'

gsap.registerPlugin(ScrollTrigger)

// 4 countries shown in this section — order matches the panel timeline
// (01 Oman → 02 Iran → 03 China → 04 Russia). Each shows a
// "Connect to X office" CTA centered on the right of the panel while
// that country's card is the active one. Maps were intentionally
// removed per user request — the CTA stands on its own over the video.
const COUNTRIES = ['muscat', 'tehran', 'hongKong', 'moscow']
const CONNECT_KEY = {
  muscat:   'connectMuscat',
  tehran:   'connectTehran',
  hongKong: 'connectHongKong',
  moscow:   'connectMoscow',
}

/**
 * AKDT / DMP Animation — scroll-scrubbing video presentation.
 *
 * Mirrors the AthurayaCity "card expands to fullscreen" choreography
 * but instead of sliding still images, the card holds a muted H.264
 * video whose `currentTime` is tweened from 0 → duration in lock-step
 * with scroll. Reverses naturally on scroll-up.
 *
 *   Phase 1 (0 → 0.10): card expands from inline → fullscreen
 *   Phase 2 (0.12 → 0.88): video scrubs through its 21.6s timeline
 *   Phase 3 (0.88 → 1.00): card shrinks back, section releases
 *
 * No cursor card / CTA — intentionally clean. The navbar hide-on-pin
 * pattern still fires so it stays out across all three project pins.
 */
const VIDEO_DURATION = 21.05  // seconds — confirmed from ffprobe

export default function AkdtScrollVideo() {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar' || lang === 'fa'
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const videoRef = useRef(null)
  const panelRef = useRef(null)
  const timelineProgressRef = useRef(null)
  // Per-country map+CTA overlay refs (one ref per country, addressed by id).
  const overlayRefs = useRef({})
  const setOverlayRef = (id) => (el) => { if (el) overlayRefs.current[id] = el }

  // Active country during the panel-visible phase. Driven by scroll
  // progress — the panel's card with this id auto-expands, and the
  // corresponding map + CTA fades in on the right of the section.
  // We mirror state in a ref so the scroll-driven update can skip
  // setState when the value hasn't actually changed (cheap re-render).
  const [activeCountry, setActiveCountry] = useState('muscat')
  const activeCountryRef = useRef('muscat')
  const updateActiveCountry = (next) => {
    if (activeCountryRef.current === next) return
    activeCountryRef.current = next
    setActiveCountry(next)
  }

  useEffect(() => {
    // The scrub video is huge; preload="none" keeps it out of the initial
    // page load entirely. Start fetching two viewports before the section
    // arrives so the scrub is buffered by the time the user reaches it.
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        try { v.load() } catch {}
        io.disconnect()
      }
    }, { rootMargin: '200% 0px' })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const video = videoRef.current
      if (!video) return

      // Baseline panel state — off-screen left (or right on RTL) and
      // invisible. Set explicitly so GSAP fully owns the transform and
      // there's no double-translate from a stale inline transform.
      gsap.set(panelRef.current, {
        xPercent: isRTL ? 120 : -120,
        opacity: 0,
      })
      // Timeline progress line starts collapsed at the top — GSAP scrubs
      // scaleY 0 → 1 across the panel-visible window so it fills smoothly
      // from "01" down to "04" as the user scrolls through the video.
      gsap.set(timelineProgressRef.current, { scaleY: 0 })

      // Width-only cover fit, capped at 1.6× — matches AthurayaCity so
      // the card lands at the same fullscreen size and never over-zooms
      // on tall viewports.
      const getCoverScale = () => {
        const card = cardRef.current
        if (!card) return 1
        const cardR = card.getBoundingClientRect()
        const widthScale = window.innerWidth / cardR.width
        return Math.min(widthScale, 1.6)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1100%',  // extra scroll room so the panel stays on-screen long enough to interact with
          pin: true,
          scrub: 1.0,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // Hide the global navbar across this section too — feels
          // consistent with the two project pins above.
          onEnter: () => window.dispatchEvent(new CustomEvent('navbar:hide')),
          onLeave: () => window.dispatchEvent(new CustomEvent('navbar:show')),
          onEnterBack: () => window.dispatchEvent(new CustomEvent('navbar:hide')),
          onLeaveBack: () => window.dispatchEvent(new CustomEvent('navbar:show')),
          // Compute active country from scroll progress so the panel's
          // card auto-expand is driven directly from scroll position
          // (works cleanly in both directions, no onStart/onReverse
          // mismatch risk).
          onUpdate: (self) => {
            const p = self.progress
            let next = 'moscow'
            if (p < 0.30) next = 'muscat'
            else if (p < 0.48) next = 'tehran'
            else if (p < 0.66) next = 'hongKong'
            updateActiveCountry(next)
          },
        },
        defaults: { ease: 'none' },
      })

      // ─── PHASE 1 (0 → 0.06): Card expands to fullscreen ─────────
      tl.to(
        cardRef.current,
        { scale: getCoverScale, borderRadius: 0, duration: 0.06, ease: 'power2.inOut' },
        0,
      )

      // ─── PHASE 2 (0.06 → 0.14): Panel slides in from LEFT ────────
      // Lives at the START of the video now (per user request). Stays
      // on-screen for the entire video scrub.
      tl.fromTo(
        panelRef.current,
        { xPercent: isRTL ? 120 : -120, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.08, ease: 'power2.out' },
        0.06,
      )

      // ─── PHASE 3 (0.14 → 0.85): Video scrub + timeline fill ──────
      // Run in PARALLEL: video.currentTime ticks through its duration
      // while the panel's timeline indicator fills from 01 → 04. Same
      // start + duration so they progress in lock-step.
      tl.fromTo(
        video,
        { currentTime: 0 },
        { currentTime: VIDEO_DURATION - 0.05, duration: 0.71 },
        0.14,
      )
      tl.to(
        timelineProgressRef.current,
        { scaleY: 1, duration: 0.71, ease: 'none' },
        0.14,
      )

      // ─── PHASE 4 (0.85 → 0.92): Panel slides back out ────────────
      tl.to(
        panelRef.current,
        { xPercent: isRTL ? 120 : -120, opacity: 0, duration: 0.07, ease: 'power2.in' },
        0.85,
      )

      // ─── PHASE 5 (0.92 → 1.00): Card shrinks back ────────────────
      tl.to(
        cardRef.current,
        { scale: 1, borderRadius: 16, duration: 0.08, ease: 'power2.inOut' },
        0.92,
      )

      // ─── Per-country overlay (map + CTA) — SMOOTH CROSSFADES ────
      // Each country is fully visible during its window. At a window
      // boundary we run an outgoing fade-out and incoming fade-in IN
      // PARALLEL with `ease: 'none'`, centered on the boundary — that's
      // a real crossfade, no flash, no overlap pile-up like the prior
      // bug where fades collided mid-air.
      //
      //   muscat:   0.14 → 0.30
      //   tehran:   0.30 → 0.48
      //   hongKong: 0.48 → 0.66
      //   moscow:   0.66 → 0.85
      const WINDOWS = [
        { id: 'muscat',   start: 0.14, end: 0.30 },
        { id: 'tehran',   start: 0.30, end: 0.48 },
        { id: 'hongKong', start: 0.48, end: 0.66 },
        { id: 'moscow',   start: 0.66, end: 0.85 },
      ]
      const FADE = 0.05               // crossfade timeline length
      const HALF = FADE / 2

      // All overlays start hidden — no y offset (kept opacity-only so
      // there's no vertical jitter while crossfading).
      gsap.set(Object.values(overlayRefs.current), { opacity: 0 })

      WINDOWS.forEach((w, i) => {
        const el = overlayRefs.current[w.id]
        if (!el) return
        const next = WINDOWS[i + 1]
        const prev = WINDOWS[i - 1]

        // Fade IN: centered on this window's start (so half is before, half after).
        // First country has no previous, so its fade-in begins at panel-visible start.
        const inAt = i === 0 ? w.start : w.start - HALF
        tl.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: FADE, ease: 'none' },
          inAt,
        )

        // Fade OUT: centered on next window's start, or sit until panel
        // exit for the last one.
        const outAt = next ? next.start - HALF : 0.84
        tl.to(el, { opacity: 0, duration: FADE, ease: 'none' }, outAt)
      })
    }, sectionRef)

    return () => ctx.revert()
    // Rebuild the timeline when text direction resolves/changes. The saved
    // language is restored from localStorage AFTER first paint, so on mount
    // isRTL is still false; without this dep the panel keeps the LTR slide-in
    // direction even on the Arabic/Persian site. ctx.revert() cleans up the
    // previous build before the RTL one is created.
  }, [isRTL])

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        position: 'relative',
        bgcolor: '#000',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
          minHeight: 0,
        }}
      >
        <Box
          ref={cardRef}
          sx={{
            width: 'min(76vw, 1080px)',
            maxHeight: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
            willChange: 'transform, border-radius',
            transformOrigin: 'center center',
          }}
        >
          <Box
            ref={videoRef}
            component="video"
            src="/video/akdt-dmp.mp4"
            muted
            playsInline
            preload="none"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              backgroundColor: '#000',
            }}
          />
        </Box>
      </Box>

      {/*
        Global Presence panel — sibling of the image area (NOT child of
        the scaling card) so it stays at its natural size when the card
        zooms to fullscreen. Slides in from the left after the video
        finishes scrubbing. Section's `overflow: hidden` clips the panel
        while it's still off-screen at xPercent: -120.
      */}
      <GlobalPresencePanel
        ref={panelRef}
        progressRef={timelineProgressRef}
        expandedId={activeCountry}
      />

      {/*
        Country overlay (map outline + Connect CTA) — sits centered in
        the right half of the section, on top of the video. One overlay
        per country, stacked; GSAP crossfades them as scroll moves
        through each country window (see WINDOWS array in the effect).

        Position: shifted toward the RIGHT of the panel (which occupies
        ~30vw on desktop). Centered vertically.
      */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          // Account for the panel on the left (or right in RTL)
          ...(isRTL
            ? { left: 0, right: 'min(520px, 30vw)' }
            : { left: 'min(520px, 30vw)', right: 0 }
          ),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 7,
          px: 4,
        }}
      >
        {COUNTRIES.map((id) => (
          <Box
            key={id}
            ref={setOverlayRef(id)}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // Align to the BOTTOM so the button sits on the same
              // horizontal line as the global chat pill ("Let's work
              // together") — both 40px above the viewport bottom.
              justifyContent: 'flex-end',
              pb: '40px',
              opacity: 0,         // GSAP controls
              willChange: 'opacity, transform',
              px: 4,
            }}
          >
            {/* Connect CTA — pill-shaped to match the chat-widget CTA;
                same vertical line + same fully-rounded shape per user
                request («بوردر ردیوس ان را مانند lets work together کن»). */}
            <Box
              component="button"
              type="button"
              sx={{
                pointerEvents: 'auto',
                px: { xs: 3, md: 4 },
                py: 1.5,
                bgcolor: '#7C7856',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',   // fully pill, matches CtaPill
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                fontWeight: 500,
                fontSize: { xs: 12, md: 14 },
                lineHeight: 1.4,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
                transition: 'background-color 200ms ease, transform 200ms ease',
                '&:hover': { bgcolor: '#928d68', transform: 'translateY(-1px)' },
                '&:focus-visible': {
                  outline: '2px solid rgba(255,255,255,0.65)',
                  outlineOffset: 2,
                },
              }}
            >
              {t.globalPresencePanel[CONNECT_KEY[id]]}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
