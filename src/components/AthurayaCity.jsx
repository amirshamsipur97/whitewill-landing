import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Athuraya City" — mirrors DiscoverProperties' animation vocabulary
 * but adds a 4-image VERTICAL SLIDE (curtain) sequence with cursor-card
 * states perfectly synced to each slide:
 *
 *   image 1 → SLIDE 1→2 (state 1→2) → SLIDE 2→3 (state 2→3) → SLIDE 3→4 (state 3→4)
 *
 * Each new image starts at yPercent: 100 (just below the card frame) and
 * tweens to yPercent: 0 to fully cover the previous one. The image slide
 * and the cursor-card blur/number swap share the SAME start time and
 * duration so they read as a single coordinated transition.
 *
 * Overlays:
 *   • Green tagline only ("A new chapter for urban Oman", #3F6A4C) on image 1
 *   • Athuraya logo PNG + green tagline (#3F6A4C) on image 2
 *     (logo & color sourced from Figma node 253-14085)
 */
export default function AthurayaCity() {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar' || lang === 'fa'

  // Soft-hide the cursor card when either the AI chat panel is open OR
  // the user is hovering the "More information" CTA — both situations
  // where the floating card would compete for attention.
  const [chatOpen, setChatOpen] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
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
  const cursorHidden = chatOpen || btnHover

  // Refs
  const sectionRef = useRef(null)
  const titleBlockRef = useRef(null)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const overlayRef = useRef(null)             // green tagline only (image 1)
  const secondOverlayRef = useRef(null)       // Athuraya logo + green tagline (image 2)
  const cardRef = useRef(null)
  // 4 sliding images
  const image1Ref = useRef(null)
  const image2Ref = useRef(null)
  const image3Ref = useRef(null)
  const image4Ref = useRef(null)
  const moreInfoBtnRef = useRef(null)         // CTA on the final slide
  // Cursor-tracked card refs
  const cursorWrapRef = useRef(null)
  const cursorCardRef = useRef(null)
  const cursorProgressRef = useRef(null)
  const cardState1Ref = useRef(null)
  const cardState2Ref = useRef(null)
  const cardState3Ref = useRef(null)
  const cardState4Ref = useRef(null)
  const cardNumber1Ref = useRef(null)
  const cardNumber2Ref = useRef(null)
  const cardNumber3Ref = useRef(null)
  const cardNumber4Ref = useRef(null)

  // Arabic locales render the title as one text run instead of one
  // span per char — see the long-form comment in DiscoverProperties.
  // OpenType shaping needs adjacent letters in the same run to pick
  // the correct initial/medial/final glyph forms.
  // (`isRTL` is already declared above; reused here.)

  // Index-based ref slots for title chars (re-render-safe)
  const charsRef = useRef([])
  const setCharRef = (i) => (el) => {
    if (el) charsRef.current[i] = el
  }

  // EN / RU: per-char split. AR: per-word split — Arabic shaping
  // breaks when each letter is wrapped in its own inline-block, so
  // we keep words as single text runs. See DiscoverProperties for
  // the full explanation.
  const allChars = useMemo(() => {
    const out = []
    const segments = [
      t.athurayaCity.titleFirst,
      t.athurayaCity.titleSecond,
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
  }, [isRTL, t.athurayaCity.titleFirst, t.athurayaCity.titleSecond])

  // ── Cursor tracking for the floating card ─────────────────────────
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
      // ─── 1. CHARACTER COLOR REVEAL ───────────────────────────────
      gsap.set(charsRef.current, { color: '#333030' })

      gsap.to(charsRef.current, {
        color: '#FFFFFF',
        duration: 0.2,
        // Word-level units on AR → bigger stagger step.
        stagger: { each: isRTL ? 0.1 : 0.022, from: 'start' },
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          end: 'top 25%',
          scrub: 0.25,
          onLeave: () => gsap.set(charsRef.current, { color: '#FFFFFF' }),
          onLeaveBack: () => gsap.set(charsRef.current, { color: '#333030' }),
        },
      })

      // ─── 2. PIN + IMAGE SLIDE + OVERLAYS + CURSOR CARD ───────────
      const getCoverScale = () => {
        const card = cardRef.current
        if (!card) return 1
        const cardR = card.getBoundingClientRect()
        // Width-only fit (matches DiscoverProperties). Math.max with
        // height was over-zooming images on taller viewports — capping
        // to width-fit keeps the slides crisp and full-screen without
        // upscaling past natural dimensions.
        const widthScale = window.innerWidth / cardR.width
        return Math.min(widthScale, 1.6)
      }

      // Initial states
      gsap.set(overlayRef.current, { opacity: 0, y: 24 })
      gsap.set(secondOverlayRef.current, { opacity: 0, y: 24 })
      gsap.set(
        [image2Ref.current, image3Ref.current, image4Ref.current],
        { yPercent: 100 },
      )
      gsap.set(moreInfoBtnRef.current, { opacity: 0, y: 24 })
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=900%',  // extra scroll room so the 3 image slides feel slow + smooth
          pin: true,
          scrub: 1.0,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // Hide the global navbar while this presentation is on-screen,
          // restore it on the way out (matches DiscoverProperties behavior).
          onEnter: () => window.dispatchEvent(new CustomEvent('navbar:hide')),
          onLeave: () => window.dispatchEvent(new CustomEvent('navbar:show')),
          onEnterBack: () => window.dispatchEvent(new CustomEvent('navbar:hide')),
          onLeaveBack: () => window.dispatchEvent(new CustomEvent('navbar:show')),
        },
        defaults: { ease: 'none' },
      })

      // ─── PHASE 1 (0 → 0.14): Card expand to fullscreen ────────────
      tl.to(
        cardRef.current,
        { scale: getCoverScale, borderRadius: 0, duration: 0.14, ease: 'power2.inOut' },
        0,
      )
      tl.to(
        [titleRef.current, subRef.current],
        { opacity: 0, y: -20, duration: 0.10 },
        0.02,
      )

      // ─── PHASE 2a (0.16 → 0.24): Green tagline overlay (image 1) ──
      tl.to(overlayRef.current, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.16)
      tl.to(overlayRef.current, { opacity: 0, y: -24, duration: 0.04, ease: 'power2.in' }, 0.22)

      // ─── PHASE 2b (0.26): Second overlay (Athuraya logo + green text)
      // Appears RIGHT AFTER overlay 1 fades out and STAYS VISIBLE through
      // the rest of the cursor-card + image-slide phase. Fades out at the
      // very end (during shrink) so it doesn't ride the shrinking image.
      tl.to(secondOverlayRef.current, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.26)

      // ─── PHASE 2c (0.28): Cursor card fades in ────────────────────
      tl.to(cursorCardRef.current, { opacity: 1, scale: 1, duration: 0.05, ease: 'power2.out' }, 0.28)
      tl.to(cursorProgressRef.current, { scaleX: 1, duration: 0.58, ease: 'none' }, 0.28)

      // ─── PHASE 2c: Synced transitions (image slide + state swap) ──
      // Slide durations bumped (0.07 → 0.13) and easing softened
      // (power2.inOut → power1.inOut) so the image curtain feels slow
      // and gentle instead of snapping past. Combined with the +=900%
      // pin extension above, each slide now covers ~1170px of scroll
      // (was ~530px) — roughly 2.2× slower.
      const slideDur = 0.13
      const blurDur  = 0.08   // matched bump so blur stays in sync with slide

      // ── Transition 1 → 2 at 0.36
      tl.to(image2Ref.current, { yPercent: 0, duration: slideDur, ease: 'power1.inOut' }, 0.36)
      tl.to(cardState1Ref.current, { opacity: 0, filter: 'blur(4px)', duration: blurDur }, 0.36)
      tl.to(cardState2Ref.current, { opacity: 1, filter: 'blur(0px)', duration: blurDur }, 0.40)
      tl.to(cardNumber1Ref.current, { opacity: 0, duration: 0.04 }, 0.38)
      tl.to(cardNumber2Ref.current, { opacity: 1, duration: 0.04 }, 0.42)

      // ── Transition 2 → 3 at 0.55
      tl.to(image3Ref.current, { yPercent: 0, duration: slideDur, ease: 'power1.inOut' }, 0.55)
      tl.to(cardState2Ref.current, { opacity: 0, filter: 'blur(4px)', duration: blurDur }, 0.55)
      tl.to(cardState3Ref.current, { opacity: 1, filter: 'blur(0px)', duration: blurDur }, 0.59)
      tl.to(cardNumber2Ref.current, { opacity: 0, duration: 0.04 }, 0.57)
      tl.to(cardNumber3Ref.current, { opacity: 1, duration: 0.04 }, 0.61)

      // ── Transition 3 → 4 at 0.72
      tl.to(image4Ref.current, { yPercent: 0, duration: slideDur, ease: 'power1.inOut' }, 0.72)
      tl.to(cardState3Ref.current, { opacity: 0, filter: 'blur(4px)', duration: blurDur }, 0.72)
      tl.to(cardState4Ref.current, { opacity: 1, filter: 'blur(0px)', duration: blurDur }, 0.76)
      tl.to(cardNumber3Ref.current, { opacity: 0, duration: 0.04 }, 0.74)
      tl.to(cardNumber4Ref.current, { opacity: 1, duration: 0.04 }, 0.78)

      // "More information" CTA fades in once image 4 is mostly visible
      // (starts ~midway through the 3→4 slide so it lands cleanly on
      // top of the final frame) and fades out just before the shrink.
      tl.to(
        moreInfoBtnRef.current,
        { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' },
        0.80,
      )
      tl.to(
        moreInfoBtnRef.current,
        { opacity: 0, y: 24, duration: 0.04, ease: 'power2.in' },
        0.88,
      )

      // ─── Cursor card fade out ────────────────────────────────────
      tl.to(
        cursorCardRef.current,
        { opacity: 0, scale: 0.92, duration: 0.06, ease: 'power2.in' },
        0.86,
      )
      // Overlay 2 fades out just before shrink — visible from 0.26
      // all the way until 0.87.
      tl.to(
        secondOverlayRef.current,
        { opacity: 0, y: -24, duration: 0.05, ease: 'power2.in' },
        0.87,
      )

      // ─── PHASE 3 (0.89 → 1.00): Shrink + restore ──────────────────
      tl.to(
        cardRef.current,
        { scale: 1, borderRadius: 16, duration: 0.11, ease: 'power2.inOut' },
        0.89,
      )
      tl.to(
        [titleRef.current, subRef.current],
        { opacity: 1, y: 0, duration: 0.09 },
        0.91,
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
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Title + subtitle stack */}
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
          pb: { xs: 7, md: 10 },
          px: { xs: 3, md: 6 },
        }}
      >
        {/* First overlay: green tagline only — "A new chapter for urban Oman"
            (wordmark removed per design update; color #3F6A4C matches the
            green identity for Athuraya City). Vertically centered inside the
            title block so it sits mid-way between the navbar and the image
            card below (was pinned to the top before). */}
        <Box
          ref={overlayRef}
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            px: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            zIndex: 5,
          }}
        >
          <Typography
            component="span"
            sx={{
              display: 'inline-block',
              fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(15px, 2vw, 24px)',
              lineHeight: 1.4,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#3F6A4C',
              whiteSpace: { xs: 'normal', md: 'nowrap' },
              maxWidth: { xs: 720, md: 'none' },
              textAlign: 'center',
            }}
          >
            {t.athurayaCity.tagline}
          </Typography>
        </Box>

        {/*
          Second overlay: Athuraya logo PNG + green tagline (image 2).
          Sourced from Figma node 253-14085. The logo image contains the
          full brand identity (symbol + "A THURAYA CITY" + Arabic مدينة الأثرى).
        */}
        <Box
          ref={secondOverlayRef}
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            px: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 0.5, md: 1 },
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            zIndex: 6,  // above overlay 1
          }}
        >
          <Box
            component="img"
            src="/athuraya-logo.png"
            alt="Athuraya City"
            sx={{
              height: { xs: 90, sm: 110, md: 140, lg: 160 },
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
              mt: { xs: 0.5, md: 1 },
              fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(13px, 1.7vw, 20px)',
              lineHeight: 1.5,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#3F6A4C',
              // Allow normal wrapping so the copy breaks into ~2 lines
              // instead of stretching across the whole viewport.
              whiteSpace: 'normal',
              maxWidth: { xs: 720, md: 880 },
              mx: 'auto',
              textAlign: 'center',
            }}
          >
            {t.athurayaCity.secondOverlay}
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
              fontWeight: 400,
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
                  display: isRTL ? 'inline' : 'inline-block',
                  whiteSpace: 'pre',
                  color: '#333030',
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
                fontSize: isRTL ? { xs: 15, md: 19 } : { xs: 11.5, md: 14 },
                lineHeight: 1.65,
                letterSpacing: isRTL ? 0 : '0.05em',
                textTransform: isRTL ? 'none' : 'uppercase',
                color: 'rgba(255, 255, 255, 0.78)',
                maxWidth: 660,
              }}
            >
              {t.athurayaCity.subtitle}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Image area — 3 sliding images stacked */}
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
          {/* Image 1 (bottom layer) — always visible */}
          <Box
            ref={image1Ref}
            component="img"
            src="/athuraya-1.jpg"
            alt="Athuraya City — exterior"
            loading="lazy"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              zIndex: 1,
            }}
          />
          {/* Image 2 — starts below frame, slides up to cover image 1 */}
          <Box
            ref={image2Ref}
            component="img"
            src="/athuraya-2.jpg"
            alt="Athuraya City — lobby"
            loading="lazy"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              zIndex: 2,
              willChange: 'transform',
            }}
          />
          {/* Image 3 — starts below frame, slides up to cover image 2 */}
          <Box
            ref={image3Ref}
            component="img"
            src="/athuraya-3.jpg"
            alt="Athuraya City — residences"
            loading="lazy"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              zIndex: 3,
              willChange: 'transform',
            }}
          />
          {/* Image 4 — starts below frame, slides up to cover image 3 */}
          <Box
            ref={image4Ref}
            component="img"
            src="/athuraya-4.jpg"
            alt="Athuraya City — masterplan"
            loading="lazy"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              zIndex: 4,
              willChange: 'transform',
            }}
          />

          {/*
            "More information" CTA — anchored in the bottom third of the
            final slide (image 4). Sits above all images via z-index 7.
            Outer wrapper handles centering (translateX -50%) so GSAP can
            own the y-translate + opacity tween on the inner button
            without colliding with the centering transform.
            Design tokens from Figma node 257:14092:
              bg #77724f / radius 23 / size 237×52 / Inter 18 white / 0.5px tracking
          */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: '18%', md: '22%' },
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 7,
              pointerEvents: 'auto',
            }}
          >
            <Box
              ref={moreInfoBtnRef}
              component="button"
              type="button"
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              onFocus={() => setBtnHover(true)}
              onBlur={() => setBtnHover(false)}
              sx={{
                // Half-size compared to the Figma spec (was 237×52 / 18px
                // — felt oversized over the photograph). Still a clear
                // pill shape, just less dominant.
                height: { xs: 28, md: 32 },
                minWidth: { xs: 118, md: 140 },
                px: { xs: 1.75, md: 2.25 },
                bgcolor: '#77724f',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                fontWeight: 400,
                fontSize: { xs: 10.5, md: 12 },
                lineHeight: 1,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                willChange: 'transform, opacity',
                transition: 'background-color 200ms ease',
                '&:hover': { bgcolor: '#8a8559' },
                '&:focus-visible': {
                  outline: '2px solid rgba(255,255,255,0.65)',
                  outlineOffset: 2,
                },
              }}
            >
              {t.athurayaCity.moreInfo}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Cursor card */}
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
          // Soft-hide while the AI chat is open OR the "More information"
          // CTA is hovered. CSS opacity (not GSAP) so it doesn't fight
          // the inner cursorCardRef tweens.
          opacity: cursorHidden ? 0 : 1,
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
          {/* Left badge */}
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
            <Box aria-hidden sx={{
              position: 'absolute', left: 15, top: 16,
              width: { xs: 80, md: 120 }, height: 2,
              bgcolor: 'rgba(255, 255, 255, 0.20)',
            }} />
            <Box ref={cursorProgressRef} aria-hidden sx={{
              position: 'absolute', left: 15, top: 16,
              width: { xs: 80, md: 120 }, height: 2,
              bgcolor: '#fff',
            }} />
            <Box sx={{
              position: 'absolute', left: 0, right: 0, top: '50%',
              transform: 'translateY(-50%)', textAlign: 'center',
              fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontSize: { xs: 16, md: 18 }, letterSpacing: '0.04em',
            }}>
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
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', willChange: 'opacity',
                  }}
                >
                  <Box component="span" sx={{ color: 'rgba(255,255,255,0.95)' }}>{active}</Box>
                  <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)', mx: 0.5 }}>/</Box>
                  <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)' }}>4</Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right text card */}
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
            <Box ref={cardState1Ref} sx={{
              position: 'absolute', inset: 0, p: { xs: 1.5, md: 2.5 },
              color: '#fff', fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontSize: { xs: 14, md: 18 }, lineHeight: 1.5,
              willChange: 'opacity, filter',
            }}>
              <Box component="span" sx={{ fontWeight: 900 }}>{t.athurayaCity.cardOneName}</Box>
              {t.athurayaCity.cardOneBody}
            </Box>
            <Box ref={cardState2Ref} sx={{
              position: 'absolute', inset: 0, p: { xs: 1.5, md: 2.5 },
              color: '#fff', fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontSize: { xs: 14, md: 18 }, lineHeight: 1.5,
              willChange: 'opacity, filter',
            }}>
              {t.athurayaCity.cardTwoPrefix}
              <Box component="span" sx={{ fontWeight: 900 }}>{t.athurayaCity.cardTwoName}</Box>
              {t.athurayaCity.cardTwoBody}
            </Box>
            <Box ref={cardState3Ref} sx={{
              position: 'absolute', inset: 0, p: { xs: 1.5, md: 2.5 },
              color: '#fff', fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontSize: { xs: 14, md: 18 }, lineHeight: 1.5,
              willChange: 'opacity, filter',
            }}>
              <Box component="span" sx={{ fontWeight: 900 }}>{t.athurayaCity.cardThreeName}</Box>
              {t.athurayaCity.cardThreeBody}
            </Box>
            <Box ref={cardState4Ref} sx={{
              position: 'absolute', inset: 0, p: { xs: 1.5, md: 2.5 },
              color: '#fff', fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontSize: { xs: 14, md: 18 }, lineHeight: 1.5,
              willChange: 'opacity, filter',
            }}>
              {t.athurayaCity.cardFourPrefix}
              <Box component="span" sx={{ fontWeight: 900 }}>{t.athurayaCity.cardFourName}</Box>
              {t.athurayaCity.cardFourBody}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
