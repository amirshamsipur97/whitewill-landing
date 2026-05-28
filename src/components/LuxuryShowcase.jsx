/**
 * LuxuryShowcase — mirror of WaterfrontResidences, placed directly
 * after it. Card lives on the RIGHT, the background is a 4-image
 * carousel that slides left-to-right with each text change.
 *
 * Mirrors the previous section's:
 *   • Drawer entrance (negative margin-top + rounded top corners).
 *   • Scroll-driven exit (shrink scale + radius growth).
 *   • 5-second progress bar + click-to-skip nav arrows.
 *
 * Adds:
 *   • A 4-layer image deck with GSAP-driven horizontal slide.
 *     `power3.inOut` gives the requested slow-fast-slow easing:
 *     gentle on entry, peak velocity at the midpoint, gentle settle.
 *
 * Figma:
 *   • Section frame   — 315:17102
 *   • Image variants  — 321:17329 / 321:17383 / 321:17356 / 315:17102
 *
 * Assets:
 *   • /images/luxury-1.jpg — Hero Shot Night 4
 *   • /images/luxury-2.jpg — AIDA Suite Exterior
 *   • /images/luxury-3.jpg — AIDA Trump International Golf Club
 *   • /images/luxury-4.jpg — Marriott EXT
 */
import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Slide deck (4 images × 4 texts) ────────────────────────────────
// Texts mirror the first 4 of WaterfrontResidences per user request.
const SLIDES = [
  {
    eyebrow: 'Timeless',
    title:   'Luxury Residences',
    body:    'Experience elegant apartments and private villas in Muscat, crafted with refined interiors, premium finishes, and exceptional waterfront living.',
    image:   '/images/luxury-1.jpg',
  },
  {
    eyebrow: 'Signature',
    title:   'Coastal Living',
    body:    'Discover sophisticated homes designed to combine modern architecture, panoramic sea views, and elevated lifestyle experiences.',
    image:   '/images/luxury-2.jpg',
  },
  {
    eyebrow: 'Exclusive',
    title:   'Investment Opportunities',
    body:    'Own premium real estate in one of Muscat’s most desirable destinations with long-term value and prestige.',
    image:   '/images/luxury-3.jpg',
  },
  {
    eyebrow: 'Refined',
    title:   'Modern Villas',
    body:    'Contemporary residences designed with spacious layouts, elegant details, and seamless indoor-outdoor living.',
    image:   '/images/luxury-4.jpg',
  },
]

// Auto-advance duration per slide (seconds) — matches WaterfrontResidences.
const SLIDE_DURATION = 5

// Image slide duration. Long enough to read as a smooth pan, short
// enough that the carousel doesn't drag.
const TRANSITION_DURATION = 1.0

// Eased timing curve for the image slide — slow → peak → slow.
const TRANSITION_EASE = 'power3.inOut'

// How long the heading text takes to fade IN at the start of a slide
// (right after setActive flips the React state).
const CONTENT_FADE_IN_DURATION = 0.35

// How long the heading text takes to fade OUT, anchored to the END of
// the image transition. The text stays fully visible across the first
// ~70 % of the slide swap and only crossfades during the last quarter
// — that's what makes the change feel like one continuous gesture
// instead of "card empties → image moves → new card fills".
const CONTENT_FADE_OUT_DURATION = 0.3

// ── Icons (matched to the sibling section) ───────────────────────────
function PlusCrossIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
      <path d="M8 0V4C8 6.4 9.76 8 12 8H16M0 8H6M8 16V10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function ArrowLeftIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <path d="M20 12H4M4 12L11 5M4 12L11 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ArrowRightIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <path d="M4 12H20M20 12L13 5M20 12L13 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const pad2 = (n) => String(n).padStart(2, '0')

export default function LuxuryShowcase() {
  const sectionRef  = useRef(null)
  const innerRef    = useRef(null)
  const contentRef  = useRef(null)
  const counterRef  = useRef(null)
  const progressRef = useRef(null)

  // One ref per image layer — collected by index from the .map() below.
  const imageRefs = useRef([])
  const setImageRef = (i) => (el) => { imageRefs.current[i] = el }

  // Track previous slide so we can pick the correct slide direction.
  const prevActiveRef = useRef(null)

  const [active, setActive] = useState(0)
  const total = SLIDES.length
  const slide = SLIDES[active]

  const goPrev = () => setActive((i) => (i - 1 + total) % total)
  const goNext = () => setActive((i) => (i + 1) % total)

  // ── Eager-preload + pre-decode every slide image on mount ────────
  // Browsers defer fetching hidden <img> layers, and even after fetch
  // they hold off on the DECODE step until paint, which used to leave
  // the off-screen layer briefly black the first time it slid in.
  // `new Image()` triggers the fetch and `img.decode()` walks it all
  // the way through to a paintable bitmap in the cache — by the time
  // a layer's xPercent reaches 0 the pixels are ready, no flash.
  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image()
      img.src = s.image
      // decode() is optional (older browsers won't have it). The
      // catch swallows AbortError / "src not set" rejections that
      // happen if the user navigates away before decode finishes.
      img.decode?.().catch(() => {})
    })
  }, [])

  // ── Scroll-driven rise (entrance) + shrink/round (exit) ──────────
  useEffect(() => {
    if (!sectionRef.current || !innerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { y: 60 },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        },
      )
      gsap.to(innerRef.current, {
        scale: 0.72,
        borderRadius: '135px',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ── Per-slide cycle (one GSAP timeline drives the whole sequence)
  // The previous implementation ran the image swap AT THE START of every
  // slide, which ate the first ~1.2 s of display time and left the
  // panel looking black/mid-flight when the progress bar started filling.
  // Per the user's feedback the image must stay locked in place for the
  // entire progress fill, and only swap once the bar reaches 100 %. So
  // we lay out one timeline:
  //
  //   ┌─────────── display (5 s) ───────────┐ ┌── transition (1.2 s) ──┐
  //   │ content fades in   (0 → 0.45 s)     │ │ content fades out      │
  //   │ progress bar fills (0 → 5 s)        │ │ image[active] → right  │
  //   │ image[active] stays at xPercent: 0  │ │ image[next]  ← left    │
  //   └─────────────────────────────────────┘ └────────────────────────┘
  //                                          onComplete → setActive(next)
  //
  // power3.inOut gives the slow→peak→slow image-slide easing the user
  // asked for. Manual prev/next clicks call setActive directly, which
  // rebuilds the timeline with the new index — the deck snaps to the
  // new slide's starting state, then the same display→transition cycle
  // plays out.
  useEffect(() => {
    const layers = imageRefs.current
    const contentEls = [contentRef.current, counterRef.current].filter(Boolean)
    const bar = progressRef.current
    if (!bar || contentEls.length === 0 || layers.length !== total) return

    const next = (active + 1) % total

    // Reset the deck to "active slide showing, everyone else hidden".
    // This covers both the first mount and manual clicks that interrupt
    // a previous cycle mid-flight.
    layers.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { xPercent: i === active ? 0 : 100 })
    })
    // Reset progress + content so fromTo's "from" doesn't fight last
    // cycle's leftover inline styles.
    gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' })
    gsap.set(contentEls, { opacity: 0, y: 14 })

    // Track this slide's prev/next on the ref so a future architecture
    // (direction-aware manual clicks) can use it without rewiring deps.
    prevActiveRef.current = active

    const tl = gsap.timeline({
      onComplete: () => setActive((i) => (i + 1) % total),
    })

    // ── Display phase (0 → SLIDE_DURATION) ─────────────────────────
    // Content fades in fast; image stays parked at xPercent: 0; the
    // progress bar paces the full 5 s.
    tl.to(
      contentEls,
      { opacity: 1, y: 0, duration: CONTENT_FADE_IN_DURATION, ease: 'power2.out', stagger: 0.04 },
      0,
    )
    tl.to(
      bar,
      { scaleX: 1, duration: SLIDE_DURATION, ease: 'none' },
      0,
    )

    // ── Transition phase (t = SLIDE_DURATION → +TRANSITION_DURATION)
    // Image slides for the FULL 1 s with no gap — old layer at 0 → 100
    // is back-to-back against new layer at -100 → 0, so the carousel
    // looks like a single continuous conveyor moving rightward.
    tl.to(
      layers[active],
      {
        xPercent: 100,
        duration: TRANSITION_DURATION,
        ease: TRANSITION_EASE,
      },
      SLIDE_DURATION,
    )
    tl.fromTo(
      layers[next],
      { xPercent: -100 },
      {
        xPercent: 0,
        duration: TRANSITION_DURATION,
        ease: TRANSITION_EASE,
      },
      SLIDE_DURATION,
    )

    // Heading text rides the IMAGE — stays visible while the new image
    // is sliding into view, only crossfades during the last 0.3 s so
    // the swap reads as a single gesture (instead of "card goes blank
    // → image moves → new card fills the blank"). The next cycle's
    // fade-in at t=0 picks up where this leaves off, with no gap.
    tl.to(
      contentEls,
      {
        opacity: 0,
        y: -10,
        duration: CONTENT_FADE_OUT_DURATION,
        ease: 'power2.in',
      },
      SLIDE_DURATION + TRANSITION_DURATION - CONTENT_FADE_OUT_DURATION,
    )

    return () => { tl.kill() }
  }, [active, total])

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-label="Luxury Showcase"
      sx={{
        position: 'relative',
        // Overlap the WaterfrontResidences section above so the rounded
        // top edge reads as a drawer rising.
        mt: { xs: '-28px', md: '-40px' },
        borderTopLeftRadius: { xs: 28, md: 40 },
        borderTopRightRadius: { xs: 28, md: 40 },
        overflow: 'hidden',
        background: '#000000',
        zIndex: 3,
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
      }}
    >
      {/* Photo + card stage. */}
      <Box
        ref={innerRef}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: { xs: '4 / 5', md: '1520 / 946' },
          maxHeight: { md: '92vh' },
          borderRadius: { xs: '18px', md: '25px' },
          overflow: 'hidden',
          backgroundColor: '#000',
          transformOrigin: '50% 50%',
          willChange: 'transform, border-radius',
        }}
      >
        {/* ── Image deck — 4 layers stacked, GSAP slides horizontally.
             Real <img> elements (not background-image) so the browser
             commits to fetching + decoding them eagerly; combined with
             the preload effect above this keeps the panel from going
             black while a hidden layer is still mid-download. */}
        {SLIDES.map((s, i) => (
          <Box
            key={i}
            ref={setImageRef(i)}
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              // First layer starts visible; the rest get pushed off-screen
              // by the first useEffect pass before paint. Setting an SSR
              // default here avoids a flash of "all four images stacked".
              transform: i === 0 ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)',
              willChange: 'transform',
              // Sits on top of the inner container's black bg; this is
              // what shows through if the <img> itself fails to load.
              backgroundColor: '#000',
            }}
          >
            <Box
              component="img"
              src={s.image}
              alt=""
              aria-hidden
              loading="eager"
              decoding="async"
              draggable={false}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </Box>
        ))}

        {/* ─────── Black card (RIGHT side) ─────────────────────── */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 16, sm: 32, md: '5.8%' },
            top: { xs: 24, sm: 48, md: '13.2%' },
            width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)', md: '38.3%' },
            height: { md: '80.2%' },
            maxWidth: 582,
            background: '#000000',
            borderRadius: '25px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: { xs: 3.5, sm: 5, md: '71px' },
            pt: { xs: 5.5, sm: 7, md: '105px' },
            pb: { xs: 4, sm: 5, md: 6 },
          }}
        >
          {/* Swirl decoration — same SVG as the sibling section. */}
          <Box
            component="img"
            src="/images/waterfront-swirl.svg"
            alt=""
            aria-hidden
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '140%',
              maxWidth: 'none',
              opacity: 0.55,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />

          {/* "+" icon (top-left of card). */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 18, md: 30 },
              left: { xs: 22, md: 30 },
              color: '#ffffff',
              zIndex: 1,
            }}
          >
            <PlusCrossIcon size={16} />
          </Box>

          {/* Slide counter (top-right). */}
          <Box
            ref={counterRef}
            sx={{
              position: 'absolute',
              top: { xs: 18, md: 30 },
              right: { xs: 22, md: 30 },
              color: 'rgba(255,255,255,0.7)',
              fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontSize: { xs: 12, md: 13 },
              fontWeight: 400,
              letterSpacing: '0.18em',
              zIndex: 1,
              willChange: 'opacity, transform',
            }}
          >
            <Box component="span" sx={{ color: '#ffffff' }}>{pad2(active + 1)}</Box>
            <Box component="span" sx={{ mx: 0.5, opacity: 0.5 }}>/</Box>
            <Box component="span">{pad2(total)}</Box>
          </Box>

          {/* Heading + body (animated on slide change). */}
          <Box
            ref={contentRef}
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 3, sm: 4, md: '40px' },
              color: '#ffffff',
              minHeight: { md: 360 },
              willChange: 'opacity, transform',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: '10px' } }}>
              <Box
                component="p"
                sx={{
                  m: 0,
                  fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: { xs: 30, sm: 36, md: 48 },
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                {slide.eyebrow}
              </Box>
              <Box
                component="h2"
                sx={{
                  m: 0,
                  fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: { xs: 30, sm: 42, md: 52 },
                  lineHeight: 1.05,
                  letterSpacing: '-0.015em',
                  wordBreak: 'break-word',
                }}
              >
                {slide.title}
              </Box>
            </Box>

            <Box
              component="p"
              sx={{
                m: 0,
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                fontWeight: 300,
                fontSize: { xs: 15, sm: 17, md: 20 },
                lineHeight: 1.35,
                maxWidth: { md: 360 },
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              {slide.body}
            </Box>
          </Box>

          {/* Arrows + progress bar (bottom group). */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '22px', md: '32px' },
              mt: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '14px', md: '18px' } }}>
              {[
                { dir: 'left',  label: 'Previous slide', onClick: goPrev, Icon: ArrowLeftIcon  },
                { dir: 'right', label: 'Next slide',     onClick: goNext, Icon: ArrowRightIcon },
              ].map(({ dir, label, onClick, Icon }) => (
                <Box
                  key={dir}
                  component="button"
                  type="button"
                  aria-label={label}
                  onClick={onClick}
                  sx={{
                    width: 36,
                    height: 36,
                    p: 0,
                    border: '1px solid rgba(255,255,255,0.18)',
                    cursor: 'pointer',
                    background: 'rgba(171, 163, 163, 0.13)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition:
                      'background 200ms ease, transform 200ms ease, border-color 200ms ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.12)',
                      borderColor: 'rgba(255,255,255,0.32)',
                      transform: 'scale(1.06)',
                    },
                    '&:active': { transform: 'scale(0.96)' },
                    '&:focus-visible': {
                      outline: '2px solid rgba(255,255,255,0.6)',
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Icon size={18} />
                </Box>
              ))}
            </Box>

            {/* 5-second progress bar */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.5)',
                overflow: 'hidden',
              }}
            >
              <Box
                ref={progressRef}
                sx={{
                  width: '100%',
                  height: '100%',
                  background: '#ffffff',
                  transformOrigin: '0% 50%',
                  transform: 'scaleX(0)',
                  willChange: 'transform',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
