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

function pickVideoSrc() {
  if (typeof window === 'undefined') return '/video/hero.mp4'
  return window.innerWidth <= 768 ? '/video/hero-mobile.mp4' : '/video/hero.mp4'
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
  const [videoSrc] = useState(pickVideoSrc)
  const isRTL = lang === 'ar'

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    let tl
    let metadataReady = false

    // ── iOS Safari unlock ────────────────────────────────────────────
    // On iOS Safari a <video> that has never been played stays on its
    // poster (or a black frame). Setting `currentTime` to drive scrub
    // animation BEFORE the element has been activated by `.play()` may
    // be silently ignored — the user sees a black hero forever.
    //
    // Fix: kick off `.play()` once muted/playsInline are confirmed, then
    // immediately pause. The video is now "primed": seeking via
    // currentTime renders frames normally, and there's no audible /
    // visible playback to interfere with the scroll-scrub story.
    //
    // We do this once, when metadata has loaded enough that play() is
    // valid (readyState >= 2 = HAVE_CURRENT_DATA).
    const primeForScrub = async () => {
      try {
        video.muted = true
        video.playsInline = true
        const p = video.play()
        if (p && typeof p.then === 'function') await p
        video.pause()
        if (video.currentTime !== 0) video.currentTime = 0
      } catch {
        // Some browsers reject. The scroll timeline will still attempt
        // to seek and most browsers will recover; iOS is the only one
        // that strictly requires the prime, and it permits muted+inline
        // play in our context.
      }
    }
    if (video.readyState >= 2) primeForScrub()
    else video.addEventListener('canplay', primeForScrub, { once: true })

    const buildTimeline = () => {
      if (tl) tl.kill()
      const duration = video.duration || 12

      // Wrap proxy: GSAP animates this object's `time` from 0..duration
      // and we mirror it onto video.currentTime each tick.
      const proxy = { time: 0 }
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

      // Video scrub — proxy.time goes from 0 → duration over the whole scroll
      tl.to(proxy, {
        time: duration - 0.05,
        ease: 'none',
        onUpdate: () => {
          // Only seek when buffered & diff is meaningful → no decoder thrash.
          const t = proxy.time
          const sr = video.seekable
          for (let i = 0; i < sr.length; i++) {
            if (t >= sr.start(i) && t <= sr.end(i)) {
              if (Math.abs(t - video.currentTime) > 0.04) {
                try { video.currentTime = t } catch {}
              }
              return
            }
          }
        },
      }, 0)

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

    const onMetadata = () => {
      if (metadataReady) return
      metadataReady = true
      setVideoReady(true)
      buildTimeline()
    }

    video.addEventListener('loadedmetadata', onMetadata)
    video.addEventListener('loadeddata', onMetadata)
    if (video.readyState >= 1) onMetadata()

    // Rebuild timeline on resize (handles orientation changes)
    const onResize = () => {
      if (metadataReady) buildTimeline()
    }
    window.addEventListener('resize', onResize)

    return () => {
      video.removeEventListener('loadedmetadata', onMetadata)
      video.removeEventListener('loadeddata', onMetadata)
      window.removeEventListener('resize', onResize)
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
        {/* Video — mobile uses the lighter hero-mobile.mp4; desktop
            uses hero.mp4 (see pickVideoSrc).

            CRITICAL: this is a SEEK-DRIVEN scrub video, NOT a playback
            video. It must NOT carry `autoPlay`. With autoplay on
            Safari the element plays forward on its own (the scrub
            `onUpdate` only seeks when the user scrolls), runs ~1s past
            the intro, and lands on a dark transition frame — the hero
            "goes black after a second". The established unlock is
            `primeForScrub` (play→pause→currentTime=0 on canplay),
            which renders frame 0 and leaves the element seekable.

            `poster` is the safety net: the browser paints it until a
            real frame is decoded, and keeps it if decoding ever fails
            (older Safari / Low-Power Mode). So the hero can never fall
            back to pure black. */}
        <Box
          component="video"
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          poster="/peninsula.jpg"
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
