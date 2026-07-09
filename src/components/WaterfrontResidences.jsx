/**
 * WaterfrontResidences — sits directly after the PropertyMap section.
 *
 * Design:
 *   • Full-width section with an aerial photo of Muscat's coastline.
 *   • Dark card (582×759 in the source) overlaid on the left half — a
 *     6-slide carousel with auto-advance and a 5-second progress bar at
 *     the bottom of the card. Prev/next arrows reset the timer.
 *   • The whole section has rounded TOP corners and a small negative
 *     margin-top so it visually "rises" up over the section above —
 *     the drawer / card-stack reveal the user asked for.
 *
 * Figma slides (all in file 6miTfu9ktj3SlAFCmSSER8):
 *   1) card 4 — 317-17130  Timeless · Luxury Residences
 *   2) card 5 — 317-17155  Signature · Coastal Living
 *   3) card 6 — 317-17180  Exclusive · Investment Opportunities
 *   4) card 7 — 317-17192  Refined · Modern Villas
 *   5) card 8 — 317-17230  Prestige · Waterfront Homes
 *   6) card 9 — 317-17242  Elevated · Urban Lifestyle
 *
 * Animation model (GSAP):
 *   • One timeline per slide, rebuilt whenever `active` changes.
 *     – t=0   : fade content + counter in from y:14 over 0.45s
 *     – t=0   : scaleX progress bar 0 → 1 over 2.0s
 *     – onComplete: advance to (active + 1) % total
 *   • Cleanup kills the timeline; manual clicks change `active` which
 *     re-runs the effect — the bar resets and a fresh tween starts so
 *     there are no double-fires or stuck states.
 */
import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'

// ── Slide deck (per Figma 317-17130 → 317-17242) ─────────────────────
const SLIDES = [
  {
    eyebrow: 'Timeless',
    title:   'Luxury Residences',
    body:    'Experience elegant apartments and private villas in Muscat, crafted with refined interiors, premium finishes, and exceptional waterfront living.',
  },
  {
    eyebrow: 'Signature',
    title:   'Coastal Living',
    body:    'Discover sophisticated homes designed to combine modern architecture, panoramic sea views, and elevated lifestyle experiences.',
  },
  {
    eyebrow: 'Exclusive',
    title:   'Investment Opportunities',
    body:    'Own premium real estate in one of Muscat’s most desirable destinations with long-term value and prestige.',
  },
  {
    eyebrow: 'Refined',
    title:   'Modern Villas',
    body:    'Contemporary residences designed with spacious layouts, elegant details, and seamless indoor-outdoor living.',
  },
  {
    eyebrow: 'Prestige',
    title:   'Waterfront Homes',
    body:    'Wake up to luxury coastal living with private amenities, world-class services, and breathtaking surroundings.',
  },
  {
    eyebrow: 'Elevated',
    title:   'Urban Lifestyle',
    body:    'A curated collection of premium residences where comfort, sophistication, and strategic location come together.',
  },
]

// Auto-advance duration per slide (seconds).
const SLIDE_DURATION = 5

// ── Icons ──────────────────────────────────────────────────────────────
// "+" cross icon (shared Figma node 309:16784, same artwork as
// /icons/plus-cross.svg). Inlined so stroke can use currentColor.
function PlusCrossIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
      <path d="M8 0V4C8 6.4 9.76 8 12 8H16M0 8H6M8 16V10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

// Clean horizontal arrow icons. Per Figma the source asset is a
// "down arrow" rotated ±90°; the visual result is a left-/right-arrow,
// so we draw it natively in the correct orientation for cleaner glyphs.
function ArrowLeftIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <path
        d="M20 12H4M4 12L11 5M4 12L11 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function ArrowRightIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <path
        d="M4 12H20M20 12L13 5M20 12L13 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Pad a slide index to "01" / "06" style.
const pad2 = (n) => String(n).padStart(2, '0')

export default function WaterfrontResidences() {
  const { lang } = useI18n()
  const isRTL = lang === 'ar' || lang === 'fa'
  const sectionRef  = useRef(null)
  const innerRef    = useRef(null)
  const contentRef  = useRef(null)   // text block — animated on slide change
  const counterRef  = useRef(null)   // counter — animated on slide change
  const progressRef = useRef(null)   // 2-second auto-advance bar

  const [active, setActive] = useState(0)
  const total = SLIDES.length
  const slide = SLIDES[active]

  // Functional updates avoid stale closures in the onComplete callback.
  const goPrev = () => setActive((i) => (i - 1 + total) % total)
  const goNext = () => setActive((i) => (i + 1) % total)
  const goTo   = (i) => setActive(((i % total) + total) % total)

  // Warm the section photo without competing with the critical first paint:
  // a LOW-priority preload issued once the browser goes idle. The old
  // fetchPriority=high preload made this ~200 KB image race the hero/LCP.
  useEffect(() => {
    let link
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200))
    const handle = idle(() => {
      link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = '/images/waterfront-bg-v2.jpg'
      link.fetchPriority = 'low'
      document.head.appendChild(link)
    })
    return () => {
      if (window.cancelIdleCallback && typeof handle === 'number') window.cancelIdleCallback(handle)
      if (link) link.remove()
    }
  }, [])

  // Scroll-driven shrink/round as the section exits the viewport.
  // No entrance translateY — the drawer rise-up is already provided by the
  // section's negative margin-top; layering a 60px parallax on top of Lenis
  // smooth scroll created a perceptible "jump" feel.
  useEffect(() => {
    if (!sectionRef.current || !innerRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(innerRef.current, {
        scale: 0.72,
        borderRadius: '135px',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ── Per-slide timeline (content fade + progress bar + auto-advance)
  // One GSAP timeline owns BOTH the entrance animation and the 2s
  // progress fill, so they're guaranteed to be in sync. The cleanup
  // kills the timeline; clicks reset `active` which restarts everything
  // from t=0 — no jumps, no double-fires.
  useEffect(() => {
    const contentEls = [contentRef.current, counterRef.current].filter(Boolean)
    const bar = progressRef.current
    if (!bar || contentEls.length === 0) return

    // Hard-reset the bar before the new tween — guarantees a clean 0
    // even if the previous tween was killed mid-flight.
    gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' })

    const tl = gsap.timeline({
      onComplete: () => {
        // Functional update → always advances from the latest index,
        // never a stale closure value.
        setActive((i) => (i + 1) % total)
      },
    })

    // Content + counter slide-fade IN. We only animate in; the previous
    // DOM has already been replaced by React's re-render so there's no
    // OUT phase needed.
    tl.fromTo(
      contentEls,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.04,
      },
      0,
    )

    // 2-second progress bar fill — runs in parallel with the content
    // fade. ease: 'none' so it's a strictly linear visual clock.
    tl.to(
      bar,
      {
        scaleX: 1,
        duration: SLIDE_DURATION,
        ease: 'none',
      },
      0,
    )

    return () => {
      tl.kill()
    }
  }, [active, total])

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-label="Waterfront Residences"
      sx={{
        position: 'relative',
        mt: { xs: '-28px', md: '-40px' },
        borderTopLeftRadius: { xs: 28, md: 40 },
        borderTopRightRadius: { xs: 28, md: 40 },
        overflow: 'hidden',
        background: '#000000',
        zIndex: 2,
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
          backgroundImage: 'url(/images/waterfront-bg-v2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Lifted to its own GPU layer so the scroll-scrubbed scale +
          // border-radius tween stays smooth on lower-end machines.
          transformOrigin: '50% 50%',
          willChange: 'transform, border-radius',
        }}
      >
        {/* ─────── Black card ─────────────────────────────────────── */}
        {/* RTL: mirror to the right side of the section so it reads
            "first" in Arabic scan order. We only flip the horizontal
            anchor (left ⇄ right) — the inner text alignment stays
            controlled by the section's `direction: rtl` and the
            global font/letter-spacing overrides. */}
        <Box
          sx={{
            position: 'absolute',
            ...(isRTL
              ? { right: { xs: 16, sm: 32, md: '5.8%' } }
              : { left: { xs: 16, sm: 32, md: '5.8%' } }),
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
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {/* Swirl decoration — sits behind the text. */}
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

          {/* "+" plus-cross icon in the top-left corner. */}
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

          {/* Slide counter at top-right (01 / 06). */}
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

          {/* ─────── Heading + body (animated on slide change) ─── */}
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
                fontWeight: 400,
                fontSize: { xs: 17, sm: 19, md: 23 },
                lineHeight: 1.4,
                maxWidth: { md: 380 },
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              {slide.body}
            </Box>
          </Box>

          {/* ─────── Bottom group: arrows + progress bar ──────
              Both pieces share a single flow column so they hug the
              bottom of the card together. The card's flex
              `justify-content: space-between` keeps the heading at
              the top and this group at the bottom. */}
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
            {/* Prev / Next arrows */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: '14px', md: '18px' },
              }}
            >
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

            {/* ─────── 5-second progress bar ───────────────────
                Sits in flow under the arrows so it naturally inherits
                the card's bottom padding (≈ 48 px on md) — matches the
                gap shown in the Figma source. The track is a 50%-white
                hairline; the fill is a 100%-white line that scales
                from 0 → 1 over SLIDE_DURATION, then triggers
                advance via the timeline's onComplete. */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                // Hairline thickness — Figma uses a 1 px stroke.
                height: '1px',
                // Track: 50% white, exactly per spec.
                background: 'rgba(255, 255, 255, 0.5)',
                overflow: 'hidden',
              }}
            >
              <Box
                ref={progressRef}
                sx={{
                  width: '100%',
                  height: '100%',
                  // Fill: 100% white sitting on top of the 50% track.
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
