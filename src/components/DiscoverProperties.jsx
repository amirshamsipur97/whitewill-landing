import { useEffect, useMemo, useRef, useState } from 'react'
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
  const isRTL = lang === 'ar' || lang === 'fa'

  // Hide the cursor-tracked card while the chat AI panel is open so the
  // floating card doesn't draw the user's eye away from their conversation.
  const [chatOpen, setChatOpen] = useState(false)
  useEffect(() => {
    const onOpen = () => setChatOpen(true)
    const onClose = () => setChatOpen(false)
    window.addEventListener('chat:open', onOpen)
    window.addEventListener('chat:close', onClose)
    return () => {
      window.removeEventListener('chat:open', onOpen)
      window.removeEventListener('chat:close', onClose)
    }
  }, [])

  // Refs
  const sectionRef = useRef(null)
  const titleBlockRef = useRef(null)  // whole title+sub block (used for scale math)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const greaterRef = useRef(null)      // wrapper for Greater Muscat logo+text
  const cardRef = useRef(null)
  const videoRef = useRef(null)        // muscat-greater.mp4 — scroll-scrubbed
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
  // Arabic + many other RTL/connected scripts rely on the OpenType
  // shaping engine seeing adjacent letters in the SAME text run. If
  // we wrap each char in its own `<span style="display:inline-block">`,
  // initial/medial/final glyph substitution falls back to the isolated
  // form and English words inside an RTL paragraph get reordered by
  // the bidi algorithm (e.g. IRFAN INVESTMENT → TNEMTSEVNI NAFRI).
  //
  // For Arabic we therefore render the title as ONE text run and skip
  // the per-char stagger entirely — GSAP still animates the whole
  // title's colour, just as a single tween instead of 14 staggered
  // tweens. (`isRTL` is already declared above; reused here.)

  // Index-based ref collection — fixed slots so React re-renders never
  // wipe the array. The previous `charsRef.current = []` in render body
  // was getting cleared on every render and (in StrictMode) the late
  // chars (the "PROPERTIES" segment) sometimes never got re-pushed in
  // time, which is why they stayed dim while earlier chars animated.
  const charsRef = useRef([])
  const setCharRef = (i) => (el) => {
    if (el) charsRef.current[i] = el
  }

  // Pre-compute the flat list of reveal "units". Each unit gets a
  // ref + a stagger slot in the GSAP color tween:
  //   • EN / RU: one unit per character (per-letter wave).
  //   • AR: one unit per WORD (whitespace kept as separate units)
  //     so OpenType Arabic shaping keeps initial/medial/final glyph
  //     joins and the bidi algorithm can resolve embedded Latin
  //     correctly. Char-level wrapping breaks both.
  const allChars = useMemo(() => {
    const out = []
    const segments = [
      t.discoverProperties.titleFirst,
      t.discoverProperties.titleSecond,
    ]
    segments.forEach((text, sIdx) => {
      // RTL: split Arabic-script segments by word (preserves shaping/bidi),
      // but keep a purely-Latin segment as one unit so the RTL layout can't
      // reverse its words.
      const parts = isRTL
        ? (/[؀-ۿ]/.test(text)
            ? text.split(/(\s+)/).filter((p) => p.length > 0)
            : [text])
        : text.split('')
      parts.forEach((char, cIdx) => {
        out.push({ char, sIdx, cIdx })
      })
    })
    return out
  }, [isRTL, t.discoverProperties.titleFirst, t.discoverProperties.titleSecond])

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
      // ─── 1. CHARACTER COLOR REVEAL (pre-pin) ────────────────────────────
      // Initial colour set on the inline style as a Tailwind-friendly hex.
      // GSAP tweens the `color` property — works because all spans are
      // direct DOM nodes with their own color rule.
      gsap.set(charsRef.current, { color: '#333030' })

      gsap.to(charsRef.current, {
        color: '#FFFFFF',
        duration: 0.2,
        // ~5 words on AR vs ~31 chars on EN — bigger stagger step
        // keeps the visual rhythm equivalent.
        stagger: { each: isRTL ? 0.1 : 0.022, from: 'start' },
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          // Wider scroll range than before (90% → 25% = 65% of viewport,
          // was 35%). With more pixels per char, even fast scrolling
          // can't outrun the stagger.
          start: 'top 90%',
          end: 'top 25%',
          // Lower scrub lag so the trailing chars catch up faster when
          // the user stops scrolling. Was 0.5 — visibly lagged on
          // "PROPERTIES" tail.
          scrub: 0.25,
          // Safety net: when the user scrolls fully past the trigger
          // end, force every char to white in case scrub-lag left any
          // mid-tween. Without this the tail of the title can appear
          // permanently dim if the user scrolls quickly.
          onLeave: () => gsap.set(charsRef.current, { color: '#FFFFFF' }),
          // Mirror safety when scrolling back UP past the start —
          // reset all chars to the initial dark color so the next
          // forward scroll re-animates cleanly.
          onLeaveBack: () => gsap.set(charsRef.current, { color: '#333030' }),
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
        // Width-only fit. Cover (Math.max with height) was over-zooming
        // peninsula.jpg on viewports where the image area is "taller"
        // than 16:9 — the image grew to ~1.7-1.8× and showed only a
        // tiny pixelated crop of the city. Scaling to viewport WIDTH
        // means the image always fills the screen edge-to-edge, never
        // upscales past its natural width, and matches AthurayaCity.
        const widthScale = window.innerWidth / cardR.width
        // Defensive cap so absurd viewports (mobile vertical etc.) can't
        // push scale past a sane upper bound.
        return Math.min(widthScale, 1.6)
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
          // Hide the global navbar while this presentation is on-screen,
          // restore it on the way out. The Header listens for these on
          // window (decoupled — no shared selectors).
          onEnter: () => window.dispatchEvent(new CustomEvent('navbar:hide')),
          onLeave: () => window.dispatchEvent(new CustomEvent('navbar:show')),
          onEnterBack: () => window.dispatchEvent(new CustomEvent('navbar:hide')),
          onLeaveBack: () => window.dispatchEvent(new CustomEvent('navbar:show')),
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

      // ─── PHASE 1b (0.22 → 0.86): Scroll-scrubbed video playback ────
      // muscat-greater.mp4 is 12.04s. We tween currentTime across the
      // PHASE 2 window (the whole cursor-card stretch) so the video
      // plays forward as the user scrolls down, and reverses cleanly on
      // scroll-up — same pattern as AkdtScrollVideo.
      const MUSCAT_VIDEO_DURATION = 12.04
      if (videoRef.current) {
        tl.fromTo(
          videoRef.current,
          { currentTime: 0 },
          { currentTime: MUSCAT_VIDEO_DURATION - 0.05, duration: 0.64 },
          0.22,
        )
      }

      // ─── PHASE 2a (0.24 → end): "Greater Muscat" logo + tagline
      // Fade in here and KEEP VISIBLE through the rest of the cursor-card
      // + image-shrink phase. Mirrors AthurayaCity's second overlay
      // behavior — the brand identity stays present for the whole
      // presentation, only fading out just before the image shrinks.
      tl.to(
        greaterRef.current,
        { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        0.24,
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
      // Greater Muscat overlay fades out just before shrink — stays
      // visible from 0.24 all the way until 0.85 so it remains present
      // during every cursor-card state, just like AthurayaCity's
      // secondOverlay.
      tl.to(
        greaterRef.current,
        { opacity: 0, y: -24, duration: 0.05, ease: 'power2.in' },
        0.85,
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
              fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
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
            fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(22px, 4vw, 56px)',
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
                // RTL units are whole words → must stay `inline` so the
                // text engine keeps adjacent letters in the same run
                // and OpenType joining works. LTR units are single
                // chars → `inline-block` is fine and slightly faster
                // to paint per-frame.
                display: isRTL ? 'inline' : 'inline-block',
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
              fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontWeight: 400,
              // AR runs slightly larger — Peyda has a smaller x-height
              // than Arsenal SC at the same point size, so the EN value
              // looks tiny in Arabic.
              fontSize: isRTL ? { xs: 15, md: 19 } : { xs: 11.5, md: 14 },
              lineHeight: 1.65,
              // Letter-spacing is already overridden to 0 globally on
              // AR via index.css, but we drop it from the sx too so
              // the cascade is explicit.
              letterSpacing: isRTL ? 0 : '0.05em',
              textTransform: isRTL ? 'none' : 'uppercase',
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
            ref={videoRef}
            component="video"
            src="/video/muscat-greater.mp4"
            muted
            playsInline
            preload="none"
            // Poster falls back to the old still while the video buffers
            // so there's no black frame on first paint.
            poster="/peninsula.jpg"
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
          // Soft-hide while the AI chat is open (kept as a CSS opacity so
          // it doesn't fight GSAP's tweens on the inner cursorCardRef).
          opacity: chatOpen ? 0 : 1,
          transition: 'opacity 220ms ease',
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
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
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
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
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
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
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
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                fontSize: { xs: 12, md: 15.5 },
                lineHeight: 1.5,
                willChange: 'opacity, filter',
              }}
            >
              {t.discoverProperties.cardThreePrefix}
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
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
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
