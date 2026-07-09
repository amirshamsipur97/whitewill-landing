import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-scrubbing video hero (v4 — GSAP ScrollTrigger).
 *
 * Why GSAP: scroll-driven video + text fades is famously fiddly with raw CSS
 * transitions and rAF loops. GSAP's ScrollTrigger gives us:
 *   - `scrub: 1` — every property animates in lock-step with scroll with a
 *     1-second smoothing tail. Reverses for free when you scroll up.
 *   - timeline labels — text-overlay fades are declared once, GSAP handles
 *     interpolation, no opacity-jump artifacts.
 *   - `gsap.ticker` shares one rAF across the whole site (no leak).
 *
 * Cross-browser notes:
 *   - video must be muted + playsInline for iOS Safari to allow seeking.
 *   - we never .play() the video — purely seek-driven. Most reliable approach.
 *   - we pin the video full-screen and let scroll drive the timeline.
 */

const SCROLL_HEIGHT_VH = 500       // total scroll travel through the hero
const SCRUB_LAG = 1.0              // seconds of smoothing on scroll (0 = instant)

// The hero is a 10-second LOOPING drone video (5 s Mutrah clip 1 + 5 s clip 2),
// re-encoded to the same 3:4 portrait format the old hero used. It autoplays
// muted (no scroll-scrub) while GSAP drives the text stages from scroll.
// Sizes are tiny (desktop 1.5 MB / mobile 0.7 MB) and each has a first-frame
// poster so LCP is still an instant image paint.
function pickImageMode() {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
}

const HERO_LOOP = {
  desktop: { src: '/video/hero-loop.mp4', poster: '/images/hero-poster.jpg' },
  mobile: { src: '/video/hero-loop-mobile.mp4', poster: '/images/hero-poster-mobile.jpg' },
}

export default function ScrollVideoHero() {
  const { t, lang } = useI18n()
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const step1Ref = useRef(null)
  const step2Ref = useRef(null)
  const step3Ref = useRef(null)
  const step4Ref = useRef(null)
  const hintRef = useRef(null)
  const ctaRef = useRef(null)
  const logoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const [imageMode] = useState(pickImageMode)
  const isRTL = lang === 'ar' || lang === 'fa'

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap) return

    let tl
    let metadataReady = false

    // ── Autoplay kick + iOS safety net ───────────────────────────────
    // The loop video autoplays muted. iOS Low-Power Mode (and some Android
    // data savers) reject autoplay until a real user gesture, so the first
    // touch/scroll retries play(). Until then the first-frame poster shows,
    // which is visually identical to a paused frame 0.
    const tryPlay = () => {
      if (!video) return
      video.muted = true
      video.playsInline = true
      const p = video.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
    const gestureUnlock = () => { tryPlay() }
    const gestureOpts = { once: true, passive: true }
    tryPlay()
    window.addEventListener('touchstart', gestureUnlock, gestureOpts)
    window.addEventListener('pointerdown', gestureUnlock, gestureOpts)
    window.addEventListener('scroll', gestureUnlock, gestureOpts)

    const buildTimeline = () => {
      if (tl) tl.kill()
      const steps = [step1Ref.current, step2Ref.current, step3Ref.current, step4Ref.current]

      // Set initial visual state. All text steps start hidden except #1.
      gsap.set(steps[0], { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' })
      gsap.set([steps[1], steps[2], steps[3]], { opacity: 0, y: 30, scale: 0.96, filter: 'blur(6px)' })
      gsap.set(ctaRef.current, { opacity: 0, scale: 0.9, pointerEvents: 'none' })
      gsap.set(hintRef.current, { opacity: 1 })
      // Logo starts hidden + slightly small + soft-blurred.
      gsap.set(logoRef.current, { opacity: 0, scale: 0.82, filter: 'blur(8px)' })

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: SCRUB_LAG,          // smooth scroll-link with 1s lag
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power2.inOut' },
      })

      // No video scrub anymore: the loop video plays by itself. Scroll only
      // drives the text/logo stages below.

      // Scroll hint fades out in the first 8% of scroll
      tl.to(hintRef.current, { opacity: 0, duration: 0.08 }, 0)

      // 5-stage timeline: 4 text steps + 1 logo reveal at the end.
      // Each stage overlaps its neighbour for a long smooth crossfade.
      const segments = [
        { start: 0.00, peak: 0.08, fadeOut: 0.22 },   // step 1
        { start: 0.16, peak: 0.30, fadeOut: 0.44 },   // step 2
        { start: 0.38, peak: 0.52, fadeOut: 0.64 },   // step 3
        { start: 0.58, peak: 0.72, fadeOut: 0.82 },   // step 4 + CTA
      ]
      const logoSegment = { start: 0.78, peak: 0.92 } // logo holds till 1.0

      steps.forEach((el, i) => {
        const s = segments[i]
        if (i > 0) {
          // Fade in
          tl.to(el, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: s.peak - s.start,
          }, s.start)
        }
        // Every step now fades out — including the last one — to make room
        // for the logo reveal.
        tl.to(el, {
          opacity: 0,
          y: -28,
          scale: 1.04,
          filter: 'blur(6px)',
          duration: s.fadeOut - s.peak,
        }, s.peak)
      })

      // CTA reveals with step 4, then fades with it.
      tl.to(ctaRef.current, {
        opacity: 1,
        scale: 1,
        pointerEvents: 'auto',
        duration: segments[3].peak - segments[3].start,
      }, segments[3].start)
      tl.to(ctaRef.current, {
        opacity: 0,
        scale: 0.92,
        pointerEvents: 'none',
        duration: segments[3].fadeOut - segments[3].peak,
      }, segments[3].peak)

      // Logo reveal — slow scale-up + blur-fade, lands as the final brand moment.
      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: logoSegment.peak - logoSegment.start,
        ease: 'power3.out',
      }, logoSegment.start)
      // Hold the logo to the end with a barely-noticeable scale "breath" so
      // it doesn't feel frozen — keeps the final frame alive.
      tl.to(logoRef.current, {
        scale: 1.06,
        duration: 1 - logoSegment.peak,
        ease: 'sine.inOut',
      }, logoSegment.peak)

      ScrollTrigger.refresh()
    }

    // The timeline no longer depends on video metadata — build immediately.
    metadataReady = true
    setVideoReady(true)
    buildTimeline()

    // Rebuild timeline on resize (handles orientation changes)
    const onResize = () => {
      if (metadataReady) buildTimeline()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('touchstart', gestureUnlock)
      window.removeEventListener('pointerdown', gestureUnlock)
      window.removeEventListener('scroll', gestureUnlock)
      if (tl) tl.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === wrap) st.kill()
      })
    }
  }, [])

  const steps = [
    { eyebrow: t.videoHero.step1Eyebrow, title: t.videoHero.step1Title, sub: t.videoHero.step1Sub, ref: step1Ref },
    { eyebrow: t.videoHero.step2Eyebrow, title: t.videoHero.step2Title, sub: t.videoHero.step2Sub, ref: step2Ref },
    { eyebrow: t.videoHero.step3Eyebrow, title: t.videoHero.step3Title, sub: t.videoHero.step3Sub, ref: step3Ref },
    { eyebrow: t.videoHero.step4Eyebrow, title: t.videoHero.step4Title, sub: t.videoHero.step4Sub, ref: step4Ref },
  ]

  const scrollToFirstSection = () => {
    const target = document.getElementById('after-video-hero')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      ref={wrapRef}
      sx={{
        position: 'relative',
        height: `${SCROLL_HEIGHT_VH}vh`,
        background: '#000',
        direction: isRTL ? 'rtl' : 'ltr',
        // Side and bottom padding on the wrap → the sticky inner inherits
        // the breathing room without needing margins (which can break sticky).
        px: { xs: 0, md: 2 },
        pb: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          // Sit *below* the sticky navbar instead of behind it.
          top: { xs: '64px', md: '80px' },
          // Height = viewport − navbar − bottom gap.
          height: {
            xs: 'calc(100vh - 64px - 16px)',
            md: 'calc(100vh - 80px - 24px)',
          },
          width: '100%',
          overflow: 'hidden',
          // No rounded corners — flush edges per request.
          borderRadius: 0,
        }}
      >
        {/* Static first-frame layer UNDER the video. Safari's backdrop-filter
            (the lead popup's blurred overlay) cannot sample video frames and
            renders the hero pitch black behind the popup; with this image
            beneath, the blur falls back to the same frame instead. It also
            doubles as an instant paint before the video buffers. */}
        <Box
          component="img"
          src={imageMode ? HERO_LOOP.mobile.poster : HERO_LOOP.desktop.poster}
          alt=""
          aria-hidden
          decoding="async"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.78) contrast(1.05)',
          }}
        />

        {/* 10-second Mutrah drone LOOP (5 s + 5 s). Autoplays muted + loops;
            the first-frame poster paints instantly so LCP never waits on
            video bytes. Mobile gets the smaller 720p encode (~2 MB). */}
        <Box
          component="video"
          ref={videoRef}
          src={imageMode ? HERO_LOOP.mobile.src : HERO_LOOP.desktop.src}
          poster={imageMode ? HERO_LOOP.mobile.poster : HERO_LOOP.desktop.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.78) contrast(1.05)',
          }}
        />

        {/* Readability gradient */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/*
          Stage layer — each text step and the logo each get their own
          inset:0 flex-center wrapper. This way every element is perfectly
          centered regardless of how many siblings exist; Stack/img inside
          is what GSAP animates (opacity/transform/filter).

          Initial opacity is set in CSS so the first paint never shows all
          slides stacked on top of each other (FOUC).
        */}

        {steps.map((s, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 3, md: 8 },
              color: '#fff',
              pointerEvents: 'none',
            }}
          >
            {/*
              Bulletproof centering: Stack is full-width up to 920px,
              centered by `mx: auto`. Each Typography gets `width: 100%`
              + `textAlign: center` so the text content always centers
              within the full width — regardless of line count or wrap.
            */}
            {/*
              Each Typography sits inside its own full-width Box with
              `textAlign: center`. That makes centering a pure block-layout
              concern — no flex margin-auto tricks, no align-items quirks.
              Inline-block on the sub Typography lets it shrink-wrap to its
              content (up to maxWidth 680) while staying horizontally centered.
            */}
            <Stack
              ref={s.ref}
              spacing={{ xs: 1.5, md: 2 }}
              sx={{
                width: '100%',
                maxWidth: 920,
                mx: 'auto',
                willChange: 'opacity, transform, filter',
                // CSS initial state — matches GSAP `gsap.set` to kill FOUC.
                opacity: i === 0 ? 1 : 0,
                transform:
                  i === 0
                    ? 'translateY(0) scale(1)'
                    : 'translateY(30px) scale(0.96)',
                filter: i === 0 ? 'blur(0px)' : 'blur(6px)',
              }}
            >
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Typography
                  variant="overline"
                  sx={{
                    display: 'inline-block',
                    letterSpacing: { xs: '0.18em', md: '0.3em' },
                    fontWeight: 700,
                    fontSize: { xs: 15, md: 20 },
                    lineHeight: 1.2,
                    color: 'rgba(255,255,255,0.88)',
                  }}
                >
                  {s.eyebrow}
                </Typography>
              </Box>

              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Typography
                  component={i === 0 ? 'h1' : 'h2'}
                  sx={{
                    display: 'block',
                    m: 0,
                    fontFamily: '"Arsenal SC", "Manrope", "Inter", system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem', lg: '5.5rem' },
                    lineHeight: 1.04,
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 30px rgba(0,0,0,0.5)',
                  }}
                >
                  {s.title}
                </Typography>
              </Box>

              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Typography
                  component="span"
                  sx={{
                    display: 'inline-block',
                    maxWidth: 680,
                    m: 0,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    color: 'rgba(255,255,255,0.88)',
                    textShadow: '0 1px 14px rgba(0,0,0,0.45)',
                  }}
                >
                  {s.sub}
                </Typography>
              </Box>

              {i === steps.length - 1 && (
                <Box sx={{ width: '100%', textAlign: 'center', pt: 1 }}>
                  <Box
                    ref={ctaRef}
                    sx={{
                      display: 'inline-block',
                      willChange: 'opacity, transform',
                      opacity: 0,
                      transform: 'scale(0.9)',
                      pointerEvents: 'none',
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={scrollToFirstSection}
                      sx={{
                        borderRadius: 999,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        bgcolor: '#fff',
                        color: '#000',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.88)' },
                      }}
                    >
                      {t.videoHero.cta}
                    </Button>
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>
        ))}

        {/* Logo — final brand moment, also perfectly centered + initially hidden */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            // drop-shadow lives on the parent so GSAP is free to tween the
            // child's filter (blur) without overwriting the shadow.
            filter: 'drop-shadow(0 8px 40px rgba(0,0,0,0.6))',
          }}
        >
          <Box
            ref={logoRef}
            sx={{
              willChange: 'opacity, transform, filter',
              // CSS initial — matches the GSAP `gsap.set` below.
              opacity: 0,
              transform: 'scale(0.82)',
              filter: 'blur(8px)',
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="Irfan Investment"
              sx={{
                width: { xs: 240, sm: 320, md: 420, lg: 520 },
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        </Box>

        {/* Scroll hint */}
        <Box
          ref={hintRef}
          sx={{
            position: 'absolute',
            bottom: 28,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            willChange: 'opacity',
          }}
        >
          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 12,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              {t.videoHero.scrollHint}
            </Typography>
            <Box
              sx={{
                width: 1,
                height: 36,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0))',
                animation: 'wwScrollPulse 1.8s ease-in-out infinite',
                '@keyframes wwScrollPulse': {
                  '0%, 100%': { transform: 'scaleY(0.5)', transformOrigin: 'top' },
                  '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
                },
              }}
            />
          </Stack>
        </Box>

      </Box>
    </Box>
  )
}
