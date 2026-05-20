import { useEffect, useRef } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * "About founder" section — 3-column layout from Figma node 163:14495.
 *
 * Background olive "M" mark: STATIC plain <img>. No motion, no Three.js,
 * no scaling/opacity tween — it just sits there at its original smaller
 * size and serves as decorative wallpaper.
 *
 * Scroll choreography (scrub-bound, reverses on scroll-up like the hero):
 *   - PHOTO: expo-zooms in from scale 0.78
 *   - LEFT column: slides in from −X with stagger (logo → title → body1 → body2)
 *   - RIGHT column: mirrors from +X
 *   - NAME + TITLE: fade up last
 *
 * scrub: 1.2 → smooth two-way binding to scroll progress.
 */

const BODY_FONT = {
  fontFamily: '"Inter", system-ui, sans-serif',
  fontWeight: 400,
  fontSize: { xs: '14px', md: '15px' },
  lineHeight: 1.55,
  textAlign: 'justify',
  color: 'rgba(255, 255, 255, 0.9)',
}

const TITLE_FONT = {
  fontFamily: '"Inter", system-ui, sans-serif',
  fontWeight: 500,
  fontSize: { xs: '20px', md: '24px' },
  lineHeight: 1.2,
  color: '#fff',
}

export default function AboutFounder() {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar'

  // Refs for GSAP — each one will be animated independently.
  const sectionRef = useRef(null)
  const leftLogoRef = useRef(null)
  const leftTitleRef = useRef(null)
  const leftBody1Ref = useRef(null)
  const leftBody2Ref = useRef(null)
  const photoRef = useRef(null)
  const nameRef = useRef(null)
  const titleRef = useRef(null)
  const rightLogoRef = useRef(null)
  const rightTitleRef = useRef(null)
  const rightBody1Ref = useRef(null)
  const rightBody2Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // -------- Initial states (CSS-level → no FOUC before scroll) --------
      gsap.set(
        [leftLogoRef.current, leftTitleRef.current, leftBody1Ref.current, leftBody2Ref.current],
        { opacity: 0, x: -60, filter: 'blur(8px)' },
      )
      gsap.set(
        [rightLogoRef.current, rightTitleRef.current, rightBody1Ref.current, rightBody2Ref.current],
        { opacity: 0, x: 60, filter: 'blur(8px)' },
      )
      gsap.set(photoRef.current, {
        opacity: 0,
        scale: 0.78,
        y: 30,
        filter: 'blur(10px)',
      })
      gsap.set([nameRef.current, titleRef.current], {
        opacity: 0,
        y: 22,
      })

      // -------- Master scrub timeline --------
      // ~10% slower than the snappy version — adds breathing room between
      // each reveal without making the user wait for the show to start.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 25%',       // was top 35% → 10% longer scroll distance
          scrub: 0.95,          // was 0.8 → slightly more smoothing
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      })

      // ─── Columns + photo appear with scrub ─────────────────────────────
      // All stagger positions stretched by ~10% so each item has more space.

      // Photo lands first — anchors the eye to the center
      tl.to(
        photoRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.25,
          ease: 'power3.out',
        },
        0,
      )

      // Left column sweeps in from the left
      tl.to(leftLogoRef.current,  { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22 }, 0.09)
      tl.to(leftTitleRef.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22 }, 0.20)
      tl.to(leftBody1Ref.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22 }, 0.31)
      tl.to(leftBody2Ref.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22 }, 0.42)

      // Right column mirrors from the right
      tl.to(rightLogoRef.current,  { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22 }, 0.09)
      tl.to(rightTitleRef.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22 }, 0.20)
      tl.to(rightBody1Ref.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22 }, 0.31)
      tl.to(rightBody2Ref.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22 }, 0.42)

      // Founder name + title fade up last
      tl.to(nameRef.current,  { opacity: 1, y: 0, duration: 0.22 }, 0.53)
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.22 }, 0.61)
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
        py: { xs: 8, md: 14 },
        overflow: 'hidden',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
        }}
      >
        {/*
          Decorative olive "M" mark — plain static image, no motion.
          Sits centered behind the columns at the smaller size requested.
        */}
        <Box
          component="img"
          src="/maison-mark.png"
          alt=""
          aria-hidden
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -45%)',
            width: { xs: '73%', sm: '60%', md: '52%', lg: '47%' },
            maxWidth: 730,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            opacity: { xs: 0.55, md: 0.95 },
            filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.45))',
          }}
        />

        <Grid
          container
          spacing={{ xs: 4, md: 3, lg: 4 }}
          alignItems="flex-start"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          {/* LEFT — Maison Shirdel column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              <Box
                ref={leftLogoRef}
                component="img"
                src="/maison-shirdel-logo.png"
                alt="Maison Shirdel — Defined by Elegance"
                sx={{
                  width: { xs: 180, md: 220 },
                  height: 'auto',
                  maxWidth: '100%',
                  alignSelf: 'flex-start',
                  display: 'block',
                  objectFit: 'contain',
                  willChange: 'transform, opacity, filter',
                }}
              />

              <Typography ref={leftTitleRef} sx={{ ...TITLE_FONT, willChange: 'transform, opacity, filter' }}>
                {t.aboutFounder.maisonTitle}
              </Typography>
              <Typography ref={leftBody1Ref} sx={{ ...BODY_FONT, willChange: 'transform, opacity, filter' }}>
                {t.aboutFounder.maisonBody1}
              </Typography>
              <Typography ref={leftBody2Ref} sx={{ ...BODY_FONT, willChange: 'transform, opacity, filter' }}>
                {t.aboutFounder.maisonBody2}
              </Typography>
            </Stack>
          </Grid>

          {/* CENTER — Founder photo + name */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Stack spacing={2.5} alignItems="center" sx={{ width: '100%' }}>
              <Box
                ref={photoRef}
                sx={{
                  width: { xs: '100%', sm: 320, md: 303 },
                  aspectRatio: '1 / 1',
                  // No background — the photo is a transparent PNG, so
                  // whatever sits behind the section (the olive "M" mark
                  // + the section's bg) shows through naturally.
                  overflow: 'hidden',
                  position: 'relative',
                  willChange: 'transform, opacity, filter',
                }}
              >
                <Box
                  component="img"
                  src="/mohsen.png"
                  alt={t.aboutFounder.founderName}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                  }}
                />
              </Box>

              <Box
                sx={{
                  width: { xs: '100%', sm: 320, md: 303 },
                  textAlign: 'center',
                  pt: 1,
                }}
              >
                <Typography
                  ref={nameRef}
                  sx={{
                    fontFamily: '"Inter", system-ui, sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: 20, md: 24 },
                    lineHeight: 1.4,
                    letterSpacing: '0.04em',
                    color: '#fff',
                    textAlign: 'center',
                    width: '100%',
                    m: 0,
                    willChange: 'transform, opacity',
                  }}
                >
                  {t.aboutFounder.founderName}
                </Typography>
                <Typography
                  ref={titleRef}
                  sx={{
                    fontFamily: '"Inter", system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: 15, md: 18 },
                    lineHeight: 1.5,
                    letterSpacing: '0.04em',
                    color: 'rgba(255,255,255,0.85)',
                    textAlign: 'center',
                    width: '100%',
                    mt: 0.5,
                    m: 0,
                    willChange: 'transform, opacity',
                  }}
                >
                  {t.aboutFounder.founderTitle}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* RIGHT — Irfan Investment column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              <Box ref={rightLogoRef} sx={{ willChange: 'transform, opacity, filter' }}>
                <Box
                  component="img"
                  src="/irfan-logo-section.svg"
                  alt="Irfan Investment Group"
                  sx={{ height: { xs: 50, md: 60 }, width: 'auto' }}
                />
              </Box>

              <Typography ref={rightTitleRef} sx={{ ...TITLE_FONT, willChange: 'transform, opacity, filter' }}>
                {t.aboutFounder.irfanTitle}
              </Typography>
              <Typography ref={rightBody1Ref} sx={{ ...BODY_FONT, willChange: 'transform, opacity, filter' }}>
                {t.aboutFounder.irfanBody1}
              </Typography>
              <Typography ref={rightBody2Ref} sx={{ ...BODY_FONT, willChange: 'transform, opacity, filter' }}>
                {t.aboutFounder.irfanBody2}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
