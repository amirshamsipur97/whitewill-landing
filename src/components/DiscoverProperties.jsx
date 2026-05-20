import { useEffect, useMemo, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Discover Exceptional Properties" — image expand-to-fullscreen + char reveal.
 *
 * Layout (matches the Figma reference, NOT overlay on the image):
 *
 *   ┌────────────────────────────────────────────────────────┐
 *   │  [LogosMarquee section above]                          │
 *   ├────────────────────────────────────────────────────────┤  ←┐
 *   │                                                        │   │
 *   │            DISCOVER EXCEPTIONAL PROPERTIES             │   │
 *   │            Explore premium residences, ...             │   │ section
 *   │                                                        │   │ 100vh
 *   │     ┌──────────────────────────────────────────┐       │   │
 *   │     │                                          │       │   │
 *   │     │             [Peninsula image]            │       │   │
 *   │     │                                          │       │   │
 *   │     └──────────────────────────────────────────┘       │   │
 *   │                                                        │  ←┘
 *   └────────────────────────────────────────────────────────┘
 *
 * Two ScrollTriggers stacked:
 *
 *   1. **Char-color reveal** (`start: 'top 80%'` → `top 25%`, scrub)
 *      The title's characters transition one-by-one from #333030 → #FFF
 *      as the section enters the viewport. Reverse when scrolling back up.
 *
 *   2. **Pin + image expand** (`start: 'top top'` → `+=250%`, pin, scrub)
 *      Once the section is at the top, it pins. The image card scales from
 *      its inline size → cover-viewport → holds → shrinks back. Border-
 *      radius tweens 16→0→16, title + subtitle fade out and back in.
 *
 * Lenis (configured globally in main.jsx) drives ScrollTrigger sub-frame
 * accurately → both triggers feel buttery instead of jittery.
 */
export default function DiscoverProperties() {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar'

  // Refs
  const sectionRef = useRef(null)
  const titleBlockRef = useRef(null)  // whole title+sub block (used for scale math)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const greaterRef = useRef(null)      // wrapper for Greater Muscat logo+text
  const cardRef = useRef(null)
  // Cursor-tracked card refs (added later — see CursorCard below)
  const cursorWrapRef = useRef(null)        // takes the mouse-follow translate
  const cursorCardRef = useRef(null)        // takes the GSAP fade/scale
  const cursorProgressRef = useRef(null)    // animated progress fill
  const cardState1Ref = useRef(null)        // "Muscat Greater" text
  const cardState2Ref = useRef(null)        // "Downtown Khuwair" text
  const cardState3Ref = useRef(null)        // "Downtown Khuwair" (continuation)
  const cardState4Ref = useRef(null)        // "A landmark transformation…"
  const cardNumber1Ref = useRef(null)       // "1 / 4"
  const cardNumber2Ref = useRef(null)       // "2 / 4"
  const cardNumber3Ref = useRef(null)       // "3 / 4"
  const cardNumber4Ref = useRef(null)       // "4 / 4"
  // Index-based ref collection — fixed slots so React re-renders never
  // wipe the array. The previous `charsRef.current = []` in render body
  // was getting cleared on every render and (in StrictMode) the late
  // chars (the "PROPERTIES" segment) sometimes never got re-pushed in
  // time, which is why they stayed dim while earlier chars animated.
  const charsRef = useRef([])
  const setCharRef = (i) => (el) => {
    if (el) charsRef.current[i] = el
  }

  // Pre-compute the FULL flat list of characters once. Each entry has
  // its segment + char-in-segment index for stable React keys, and a
  // global index so GSAP staggers across the whole title.
  const allChars = useMemo(() => {
    const out = []
    const segments = [
      t.discoverProperties.titleFirst,
      t.discoverProperties.titleSecond,
    ]
    segments.forEach((text, sIdx) => {
      text.split('').forEach((char, cIdx) => {
        out.push({ char, sIdx, cIdx })
      })
    })
    return out
  }, [t.discoverProperties.titleFirst, t.discoverProperties.titleSecond])

  // ── Cursor tracking for the floating card ────────────────────────────
  // Lerp the card position toward the mouse via GSAP's ticker so the motion
  // is glass-smooth and never falls behind a fast scroll. The card is a
  // separate "wrapper" element so GSAP can also tween its opacity/scale
  // without colliding with the JS-set transform we apply each frame.
  useEffect(() => {
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const card = { x: mouse.x, y: mouse.y }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const tick = () => {
      card.x += (mouse.x - card.x) * 0.14
      card.y += (mouse.y - card.y) * 0.14
      const el = cursorWrapRef.current
      if (el) {
        el.style.transform =
          `translate3d(${card.x}px, ${card.y}px, 0) translate3d(-50%, -50%, 0)`
      }
    }

    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tick)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── 1. CHARACTER COLOR REVEAL (pre-pin) ────────────────────────────
      // Initial colour set on the inline style as a Tailwind-friendly hex.
      // GSAP tweens the `color` property — works because all spans are
      // direct DOM nodes with their own color rule.
      gsap.set(charsRef.current, { color: '#333030' })

      gsap.to(charsRef.current, {
        color: '#FFFFFF',
        // Explicit per-tween duration so total timeline length is
        // deterministic: (n-1) × 0.035 + 0.25 ≈ 1.3s for 30 chars.
        duration: 0.25,
        stagger: { each: 0.035, from: 'start' },
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          // End at 'top 50%' (was 25%). Pin starts at 'top top', so by
          // ending at 50% we guarantee EVERY char (including the last
          // ones in "PROPERTIES") has completed its color tween well
          // before the section pins.
          end: 'top 50%',
          scrub: 0.5,
        },
      })

      // ─── 2. PIN + IMAGE EXPAND ─────────────────────────────────────────
      // Compute the scale needed to make the card COVER the IMAGE AREA
      // (everything BELOW the title), not the entire viewport. The title
      // sits in its own flex row above the image area → scaling here can
      // never reach up into the title because Math.max is bounded by
      // (viewportH − titleBottom).
      //
      // Math.max → cover semantics: whichever axis fills the area first
      // sets the scale, the other axis overflows the area and gets
      // clipped by `overflow: hidden` on the image-area wrapper.
      const getCoverScale = () => {
        const card = cardRef.current
        const titleBlock = titleBlockRef.current
        if (!card || !titleBlock) return 1
        const cardR = card.getBoundingClientRect()
        const titleR = titleBlock.getBoundingClientRect()
        const imageAreaH = window.innerHeight - titleR.bottom
        return Math.max(
          window.innerWidth / cardR.width,
          imageAreaH / cardR.height,
        )
      }

      // Greater Muscat overlay starts hidden + slightly down.
      gsap.set(greaterRef.current, { opacity: 0, y: 24 })

      // Cursor card initial state: hidden + slightly small.
      gsap.set(cursorCardRef.current, { opacity: 0, scale: 0.92 })
      gsap.set(cursorProgressRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(cardState1Ref.current, { opacity: 1, filter: 'blur(0px)' })
      gsap.set([cardState2Ref.current, cardState3Ref.current, cardState4Ref.current], {
        opacity: 0,
        filter: 'blur(4px)',
      })
      gsap.set(cardNumber1Ref.current, { opacity: 1 })
      gsap.set(
        [cardNumber2Ref.current, cardNumber3Ref.current, cardNumber4Ref.current],
        { opacity: 0 },
      )

      // Timeline length extended to '+=620%' so the cursor-card moment
      // (four states + three blur transitions) has comfortable scroll room.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=620%',
          pin: true,
          scrub: 1.0,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      })

      // ─── PHASE 1 (0 → 0.22): Expand card to cover image area ───────
      // Title + subtitle fade out together; image grows to fullscreen.
      tl.to(
        cardRef.current,
        {
          scale: getCoverScale,
          borderRadius: 0,
          duration: 0.22,
          ease: 'power2.inOut',
        },
        0,
      )
      tl.to(
        [titleRef.current, subRef.current],
        { opacity: 0, y: -20, duration: 0.16 },
        0.03,
      )

      // ─── PHASE 2a (0.24 → 0.32): "Greater Muscat" logo fades in ─────
      tl.to(
        greaterRef.current,
        { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        0.24,
      )
      // Hold briefly, then fade out before the cursor card takes over.
      tl.to(
        greaterRef.current,
        { opacity: 0, y: -24, duration: 0.06, ease: 'power2.in' },
        0.38,
      )

      // ─── PHASE 2b (0.40 → 0.86): Cursor card with FOUR states ───────
      // Layout of the cursor-card timeline:
      //   0.40 → 0.46  fade in
      //   0.40 → 0.86  progress fill grows 0 → 100%
      //   0.52 → 0.56  state 1 → 2 (blur + swap + number flip)
      //   0.63 → 0.67  state 2 → 3
      //   0.74 → 0.78  state 3 → 4
      //   0.80 → 0.86  fade out
      tl.to(
        cursorCardRef.current,
        { opacity: 1, scale: 1, duration: 0.06, ease: 'power2.out' },
        0.40,
      )
      tl.to(
        cursorProgressRef.current,
        { scaleX: 1, duration: 0.46, ease: 'none' },
        0.40,
      )

      // 1 → 2
      tl.to(cardState1Ref.current, { opacity: 0, filter: 'blur(4px)', duration: 0.04 }, 0.52)
      tl.to(cardState2Ref.current, { opacity: 1, filter: 'blur(0px)', duration: 0.04 }, 0.54)
      tl.to(cardNumber1Ref.current, { opacity: 0, duration: 0.03 }, 0.525)
      tl.to(cardNumber2Ref.current, { opacity: 1, duration: 0.03 }, 0.535)

      // 2 → 3
      tl.to(cardState2Ref.current, { opacity: 0, filter: 'blur(4px)', duration: 0.04 }, 0.63)
      tl.to(cardState3Ref.current, { opacity: 1, filter: 'blur(0px)', duration: 0.04 }, 0.65)
      tl.to(cardNumber2Ref.current, { opacity: 0, duration: 0.03 }, 0.635)
      tl.to(cardNumber3Ref.current, { opacity: 1, duration: 0.03 }, 0.645)

      // 3 → 4
      tl.to(cardState3Ref.current, { opacity: 0, filter: 'blur(4px)', duration: 0.04 }, 0.74)
      tl.to(cardState4Ref.current, { opacity: 1, filter: 'blur(0px)', duration: 0.04 }, 0.76)
      tl.to(cardNumber3Ref.current, { opacity: 0, duration: 0.03 }, 0.745)
      tl.to(cardNumber4Ref.current, { opacity: 1, duration: 0.03 }, 0.755)

      // Fade out before image shrink.
      tl.to(
        cursorCardRef.current,
        { opacity: 0, scale: 0.92, duration: 0.06, ease: 'power2.in' },
        0.82,
      )

      // ─── PHASE 3 (0.86 → 1.00): Shrink + restore originals ──────────
      tl.to(
        cardRef.current,
        {
          scale: 1,
          borderRadius: 16,
          duration: 0.14,
          ease: 'power2.inOut',
        },
        0.86,
      )
      tl.to(
        [titleRef.current, subRef.current],
        { opacity: 1, y: 0, duration: 0.10 },
        0.90,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        position: 'relative',
        bgcolor: '#000',
        // Exactly one viewport — pin will hold this for the duration.
        height: '100vh',
        // Flex column: title row at the top, image-area row fills the rest.
        // The image area has its OWN overflow:hidden so the cover scale
        // can spill horizontally without bleeding into the title row.
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* ─── Title + subtitle stack — solid black row at the TOP ──────
         flex: 0 0 auto → row takes its natural height; the image area
         underneath takes everything else. zIndex keeps it above any
         visual overflow from the expanding image. */}
      <Box
        ref={titleBlockRef}
        sx={{
          flex: '0 0 auto',
          width: '100%',
          textAlign: 'center',
          bgcolor: '#000',
          position: 'relative',
          zIndex: 4,
          pt: { xs: 7, md: 10 },
          // Larger bottom padding → pushes the image area further down →
          // more breathing room between the Greater Muscat tagline (and
          // the original subtitle) and the image card below it.
          pb: { xs: 7, md: 10 },
          px: { xs: 3, md: 6 },
        }}
      >
        {/*
          Greater Muscat overlay — sits absolutely in the same vertical
          band as the original title, hidden until phase 2 of the timeline.
          Identical motion vocabulary (opacity + y) so the swap feels like
          a continuation of the same "moving unit", not a different
          animation language.
        */}
        <Box
          ref={greaterRef}
          aria-hidden
          sx={{
            position: 'absolute',
            // Match the title-block padding so the overlay starts BELOW
            // the sticky navbar — same vertical band as the original
            // title, never tucked under the header.
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pt: { xs: 7, md: 10 },
            pb: { xs: 7, md: 10 },
            px: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // flex-start → align with the original title's y, not centered
            // vertically (which used to pull the logo halfway under nav).
            justifyContent: 'flex-start',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            zIndex: 5,
          }}
        >
          <Box
            component="img"
            src="/greater-muscat.png"
            alt="Greater Muscat"
            sx={{
              // 10% smaller than before across every breakpoint.
              height: { xs: 63, sm: 79, md: 99, lg: 117 },
              width: 'auto',
              display: 'block',
              maxWidth: '90%',
              objectFit: 'contain',
            }}
          />
          <Typography
            component="span"
            sx={{
              display: 'inline-block',
              // Very tight to the logo — almost touching.
              mt: { xs: 0.25, md: 0.5 },
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 400,
              // Larger than before BUT still safe to keep one line on
              // typical desktops (~1024px+). At max 18px with 80 chars
              // and 0.05em tracking, text width ≈ 936px → fits the
              // overlay's available width even after horizontal padding.
              fontSize: 'clamp(12px, 1.55vw, 18px)',
              lineHeight: 1.4,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#e64e41',
              whiteSpace: { xs: 'normal', md: 'nowrap' },
              maxWidth: { xs: 720, md: 'none' },
              textAlign: 'center',
              // px removed — overlay wrapper already provides side padding
              // and text is centered, so extra px just steals room.
            }}
          >
            {t.discoverProperties.greaterMuscatSubtitle}
          </Typography>
        </Box>
      <Box
        ref={titleRef}
        sx={{
          width: '100%',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 400,
            // clamp scales smoothly: small on mobile, big on desktop,
            // never breaks past 52px. With `nowrap` the whole heading
            // stays on a single line at every breakpoint.
            fontSize: 'clamp(20px, 3.8vw, 50px)',
            lineHeight: 1.1,
            letterSpacing: '0.015em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            m: 0,
            mx: 'auto',
          }}
        >
          {allChars.map((c, i) => (
            <Box
              key={`${c.sIdx}-${c.cIdx}`}
              component="span"
              ref={setCharRef(i)}
              sx={{
                display: 'inline-block',
                whiteSpace: 'pre',
                // Initial colour set inline so the very first paint shows
                // the right state — GSAP's `set` runs after mount.
                color: '#333030',
                // Sub-character spans need will-change to avoid repainting
                // the entire title every frame.
                willChange: 'color',
              }}
            >
              {c.char}
            </Box>
          ))}
        </Typography>
        <Box
          ref={subRef}
          sx={{
            mt: { xs: 2.5, md: 3.5 },
            width: '100%',
            textAlign: 'center',
            willChange: 'transform, opacity',
          }}
        >
          <Typography
            component="span"
            sx={{
              display: 'inline-block',
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 400,
              fontSize: { xs: 11.5, md: 14 },
              lineHeight: 1.65,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.78)',
              maxWidth: 660,
            }}
          >
            {t.discoverProperties.subtitle}
          </Typography>
        </Box>
      </Box>
      </Box>

      {/* ─── Image area: fills the rest of the viewport vertically. ───
         flex: 1 → grabs everything below the title block.
         overflow: hidden → clips horizontal/vertical card overflow during
         the cover-scale tween so the title bar above stays intact. */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          px: { xs: 3, md: 6 },
          pb: { xs: 4, md: 6 },
          minHeight: 0,
        }}
      >
        <Box
          ref={cardRef}
          sx={{
            // Card centered inside the image area at rest. The cover-scale
            // tween scales it to fill the image-area edges → it never
            // crosses into the title row above.
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
            component="img"
            src="/peninsula.jpg"
            alt="Premium Oman coastline development"
            loading="lazy"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>
      </Box>

      {/*
        ─── Cursor card (Muscat Greater / Downtown Khuwair) ────────────
        Two nested wrappers:
          1. cursorWrapRef → gets the mouse-follow translate (JS, every
             rAF tick). position: fixed so it tracks the viewport.
          2. cursorCardRef → gets the GSAP opacity/scale animation. Setting
             both transforms on the same node would collide.
        Both halves use backdrop-filter blur to read as glass against the
        peninsula image behind them.
      */}
      <Box
        ref={cursorWrapRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'min(700px, 92vw)',
          pointerEvents: 'none',
          zIndex: 20,
          willChange: 'transform',
        }}
      >
        <Box
          ref={cursorCardRef}
          sx={{
            display: 'flex',
            gap: { xs: 0.75, md: 1 },
            height: { xs: 120, md: 150 },
            opacity: 0,
            willChange: 'opacity, transform',
            transformOrigin: 'center center',
          }}
        >
          {/* Left badge — progress bar + number */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: 110, md: 150 },
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '9px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              bgcolor: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Progress track (dim full-width) */}
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                left: 15,
                top: 16,
                width: { xs: 80, md: 120 },
                height: 2,
                bgcolor: 'rgba(255, 255, 255, 0.20)',
              }}
            />
            {/* Progress fill (animated 0 → 100% across both states) */}
            <Box
              ref={cursorProgressRef}
              aria-hidden
              sx={{
                position: 'absolute',
                left: 15,
                top: 16,
                width: { xs: 80, md: 120 },
                height: 2,
                bgcolor: '#fff',
              }}
            />
            {/* Numbers — only one visible at a time, GSAP swaps opacity */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                textAlign: 'center',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: { xs: 16, md: 18 },
                letterSpacing: '0.04em',
              }}
            >
              {[
                { ref: cardNumber1Ref, active: 1 },
                { ref: cardNumber2Ref, active: 2 },
                { ref: cardNumber3Ref, active: 3 },
                { ref: cardNumber4Ref, active: 4 },
              ].map(({ ref, active }) => (
                <Box
                  key={active}
                  ref={ref}
                  component="span"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    willChange: 'opacity',
                  }}
                >
                  <Box component="span" sx={{ color: 'rgba(255,255,255,0.95)' }}>{active}</Box>
                  <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)', mx: 0.5 }}>/</Box>
                  <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)' }}>4</Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right text card — 4 states stacked, GSAP cross-fades */}
          <Box
            sx={{
              flex: 1,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '9px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              bgcolor: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Box
              ref={cardState1Ref}
              sx={{
                position: 'absolute',
                inset: 0,
                p: { xs: 1.5, md: 2.5 },
                color: '#fff',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: { xs: 12, md: 15.5 },
                lineHeight: 1.5,
                willChange: 'opacity, filter',
              }}
            >
              <Box component="span" sx={{ fontWeight: 700 }}>
                {t.discoverProperties.cardOneName}
              </Box>
              {t.discoverProperties.cardOneBody}
            </Box>
            <Box
              ref={cardState2Ref}
              sx={{
                position: 'absolute',
                inset: 0,
                p: { xs: 1.5, md: 2.5 },
                color: '#fff',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: { xs: 12, md: 15.5 },
                lineHeight: 1.5,
                willChange: 'opacity, filter',
              }}
            >
              <Box component="span" sx={{ fontWeight: 700 }}>
                {t.discoverProperties.cardTwoName}
              </Box>
              {t.discoverProperties.cardTwoBody}
            </Box>
            <Box
              ref={cardState3Ref}
              sx={{
                position: 'absolute',
                inset: 0,
                p: { xs: 1.5, md: 2.5 },
                color: '#fff',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: { xs: 12, md: 15.5 },
                lineHeight: 1.5,
                willChange: 'opacity, filter',
              }}
            >
              <Box component="span" sx={{ fontWeight: 700 }}>
                {t.discoverProperties.cardThreeName}
              </Box>
              {t.discoverProperties.cardThreeBody}
            </Box>
            <Box
              ref={cardState4Ref}
              sx={{
                position: 'absolute',
                inset: 0,
                p: { xs: 1.5, md: 2.5 },
                color: '#fff',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: { xs: 12, md: 15.5 },
                lineHeight: 1.5,
                willChange: 'opacity, filter',
              }}
            >
              {t.discoverProperties.cardFourPrefix}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {t.discoverProperties.cardFourName}
              </Box>
              {t.discoverProperties.cardFourBody}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
