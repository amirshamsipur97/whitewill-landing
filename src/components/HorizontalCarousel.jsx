/**
 * HorizontalCarousel — scroll-pinned horizontal carousel.
 *
 * Per the latest user pass:
 *   1) ONE fixed info card sits at the bottom of the frame. As the
 *      strip translates and a new image comes into view, the card's
 *      content (eyebrow / title / body) crossfades to the active slide.
 *   2) Progress bar removed.
 *   3) Scroll length doubled — was (N − 1) * 100 + 50 % ≈ 3.5 viewports,
 *      now (N − 1) * 200 + 50 % ≈ 6.5 viewports — so the strip eases
 *      from card 1 to card 4 over a much longer scroll window.
 *   4) Navbar hides on enter / shows on leave (same `navbar:hide` /
 *      `navbar:show` events as DiscoverProperties + AthurayaCity etc.).
 *
 * Implementation notes:
 *   • The strip cells now hold ONLY the background image. The
 *     per-card info card is gone; one fixed overlay does the work.
 *   • The fixed overlay renders all 4 content blocks stacked at the
 *     same absolute position. Each block has its opacity tweened to
 *     0 or 1 whenever `activeIdx` changes → clean crossfade with no
 *     React unmount/remount thrash.
 *   • `activeIdx` is derived from the eased scroll progress so the
 *     content swap is locked to the strip's *visual* position, not
 *     the raw scroll position (the strip uses `power3.inOut`, so raw
 *     progress 0.5 maps to the visual midpoint regardless).
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Slide deck (per Figma 324-17701..747) ────────────────────────────
const SLIDES = [
  {
    eyebrow: 'Elevated',
    title:   'Cliffside Living',
    body:    'Discover iconic residences at AIDA in Muscat, where dramatic ocean views, world-class golf experiences, and refined architecture create a new standard of luxury living.',
    image:   '/images/carosel-1.jpg',
  },
  {
    eyebrow: 'Signature',
    title:   'Coastal Escapes',
    body:    'Experience sophisticated beachfront villas and contemporary residences at YITI, designed to blend natural beauty, privacy, and modern resort-style living.',
    image:   '/images/carosel-2.jpg',
  },
  {
    eyebrow: 'Future-Ready',
    title:   'Smart Communities',
    body:    'Explore an innovative lifestyle destination focused on sustainability, wellness, renewable energy, and environmentally conscious urban living in the heart of Oman.',
    image:   '/images/carosel-3.jpg',
  },
  {
    eyebrow: 'Timeless',
    title:   'Luxury Interiors',
    body:    'Step into elegant living spaces crafted with panoramic sea views, contemporary interiors, premium finishes, and seamless indoor-outdoor experiences.',
    image:   '/images/carosel-4.jpg',
  },
]

const CARD_GAP_PX = 50

// power3.inOut as a pure function — matches the easing applied to the
// strip translation so we can compute the active index from raw scroll
// progress without reading the DOM.
const easeP3InOut = (p) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2

export default function HorizontalCarousel() {
  const sectionRef = useRef(null)
  const stageRef   = useRef(null)
  const frameRef   = useRef(null)
  const stripRef   = useRef(null)

  // One ref per overlay block in the fixed info card.
  const overlayRefs = useRef([])
  const setOverlayRef = (i) => (el) => { overlayRefs.current[i] = el }

  // Active slide derived from scroll. The ref shadows the state so
  // the scroll callback can compare without going through React.
  const activeIdxRef = useRef(0)
  const [activeIdx, setActiveIdx] = useState(0)

  // Measured frame width drives each cell's explicit pixel width.
  const [cardWidth, setCardWidth] = useState(0)

  // Frame width measurement (ResizeObserver) — fixes the cell-collapse
  // bug from the earlier `100cqw` attempt.
  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const measure = () => {
      const w = frame.offsetWidth
      if (w > 0) {
        setCardWidth(w)
        ScrollTrigger.refresh()
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(frame)
    return () => ro.disconnect()
  }, [])

  // Eager-preload + decode every background photo.
  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image()
      img.src = s.image
      img.decode?.().catch(() => {})
    })
  }, [])

  // ── Scroll-driven carousel ────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current || !stripRef.current || !stageRef.current) return
    const total = SLIDES.length

    const ctx = gsap.context(() => {
      // Entrance scrub — mirrors WaterfrontResidences.
      if (frameRef.current) {
        gsap.fromTo(
          frameRef.current,
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

        // EXIT shrink + round — same drawer-out behaviour as
        // WaterfrontResidences. Fires only AFTER the pin releases:
        // the section is 750 vh tall (100 vh stage + 650 vh pin
        // spacer), so `bottom bottom` lines up exactly with the
        // moment the pin lets go. From there to `bottom top`
        // (section fully scrolled past) the frame shrinks to 0.72
        // and its corners round to 135 px — matching the values
        // and feel of the section above.
        gsap.to(frameRef.current, {
          scale: 0.72,
          borderRadius: '135px',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        })
      }

      // Main pinned timeline. Scroll length doubled per user request.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          // 200 % per slide step (was 100 %) → carousel feels ~2× slower.
          end: () => `+=${(total - 1) * 200 + 50}%`,
          pin: stageRef.current,
          pinType: 'transform',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Navbar hide/show — same `navbar:hide` / `navbar:show`
          // pattern Header.jsx listens for.
          onEnter:     () => window.dispatchEvent(new CustomEvent('navbar:hide')),
          onLeave:     () => window.dispatchEvent(new CustomEvent('navbar:show')),
          onEnterBack: () => window.dispatchEvent(new CustomEvent('navbar:hide')),
          onLeaveBack: () => window.dispatchEvent(new CustomEvent('navbar:show')),
          // Derive the active slide from the eased scroll progress so
          // the info-card swap is locked to the strip's visual position.
          onUpdate: (self) => {
            const eased = easeP3InOut(self.progress)
            const idx = Math.round(eased * (total - 1))
            const clamped = Math.max(0, Math.min(total - 1, idx))
            if (clamped !== activeIdxRef.current) {
              activeIdxRef.current = clamped
              setActiveIdx(clamped)
            }
          },
        },
        defaults: { ease: 'none' },
      })

      // Strip translation — pixel-accurate, function-valued so resize
      // stays correct.
      tl.to(
        stripRef.current,
        {
          x: () => {
            const cells = stripRef.current?.children
            if (!cells || cells.length === 0) return 0
            const w = cells[0].offsetWidth
            return -(w + CARD_GAP_PX) * (total - 1)
          },
          ease: 'power3.inOut',
          duration: 1,
        },
        0,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ── Info-card content crossfade ──────────────────────────────────
  // Runs every time `activeIdx` changes. Animates every overlay to
  // its target opacity (1 for active, 0 for others). `overwrite: auto`
  // lets a quick scroll interrupt the previous tween cleanly.
  useLayoutEffect(() => {
    overlayRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        opacity: i === activeIdx ? 1 : 0,
        y:       i === activeIdx ? 0 : (i < activeIdx ? -6 : 6),
        duration: 0.45,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    })
  }, [activeIdx])

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-label="Featured destinations carousel"
      sx={{
        position: 'relative',
        mt: { xs: '-28px', md: '-40px' },
        borderTopLeftRadius: { xs: 28, md: 40 },
        borderTopRightRadius: { xs: 28, md: 40 },
        overflow: 'hidden',
        background: '#000000',
        zIndex: 3,
      }}
    >
      <Box
        ref={stageRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Box
          ref={frameRef}
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: { xs: '4 / 5', md: '1520 / 946' },
            maxHeight: { md: '92vh' },
            overflow: 'hidden',
            // Both transform AND border-radius animate during the exit
            // shrink — promoting them to their own layer keeps the
            // repaints off the main thread.
            transformOrigin: '50% 50%',
            willChange: 'transform, border-radius',
          }}
        >
          {/* Strip — flex row of image-only cards. */}
          <Box
            ref={stripRef}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'flex',
              gap: `${CARD_GAP_PX}px`,
              height: '100%',
              willChange: 'transform',
            }}
          >
            {SLIDES.map((slide, i) => (
              <Box
                key={i}
                style={{
                  width: cardWidth ? `${cardWidth}px` : '100%',
                  height: '100%',
                  flexShrink: 0,
                }}
                sx={{
                  position: 'relative',
                  borderRadius: { xs: '24px', md: '50px' },
                  overflow: 'hidden',
                  background: '#000',
                }}
              >
                <Box
                  component="img"
                  src={slide.image}
                  alt=""
                  aria-hidden
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* ── Fixed info card ─────────────────────────────────────
              Sits inside the frame, near the bottom (matching Figma's
              ~62 % from top). All 4 content variants are rendered
              stacked at the same position; only the active one is
              opacity 1. Doesn't translate with the strip — content
              just swaps as the strip scrolls past each image. */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: { xs: '6%', md: '10.7%' },
              transform: 'translateX(-50%)',
              width: { xs: 'calc(100% - 32px)', md: '78%' },
              maxWidth: 1184,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: { xs: '18px', md: '25px' },
              overflow: 'hidden',
              color: '#ffffff',
              // The internal padding stays put while overlays change.
              px: { xs: 3, sm: 4, md: '49px' },
              py: { xs: 3, sm: 4, md: '38px' },
              // Min-height keeps the box rock-solid as content lengths
              // differ between slides (otherwise it visibly resizes).
              minHeight: { xs: 'auto', md: 180 },
              zIndex: 3,
            }}
          >
            {SLIDES.map((slide, i) => (
              <Box
                key={i}
                ref={setOverlayRef(i)}
                aria-hidden={i !== activeIdx}
                style={{
                  // Initial state — only the first overlay is visible.
                  // The crossfade effect takes over from here on.
                  opacity: i === 0 ? 1 : 0,
                }}
                sx={{
                  // Stack every overlay at the same position. Each
                  // overlay fills the info card's padding box.
                  position: i === 0 ? 'relative' : 'absolute',
                  inset:    i === 0 ? 'auto' : 0,
                  px: i === 0 ? 0 : { xs: 3, sm: 4, md: '49px' },
                  py: i === 0 ? 0 : { xs: 3, sm: 4, md: '38px' },
                  willChange: 'opacity, transform',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: { xs: 2.5, md: '40px' },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: { md: 450 },
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                        fontStyle: 'italic',
                        fontWeight: 600,
                        fontSize: { xs: 28, sm: 36, md: 48 },
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
                        mt: { xs: 0.5, md: '6px' },
                        fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                        fontWeight: 300,
                        fontSize: { xs: 24, sm: 32, md: 42 },
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
                      fontSize: { xs: 14, sm: 16, md: 20 },
                      lineHeight: 1.4,
                      maxWidth: { md: 606 },
                      color: 'rgba(255,255,255,0.92)',
                    }}
                  >
                    {slide.body}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
