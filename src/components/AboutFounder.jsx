import { useEffect, useRef } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'
import { useIsMobile } from '../hooks/useIsMobile.js'

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
  fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
  fontWeight: 400,
  fontSize: { xs: '14px', md: '15px' },
  lineHeight: 1.55,
  textAlign: 'justify',
  color: 'rgba(255, 255, 255, 0.9)',
}

const TITLE_FONT = {
  fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
  fontWeight: 700,
  fontSize: { xs: '22px', md: '26px' },
  lineHeight: 1.2,
  color: '#fff',
}

export default function AboutFounder() {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar' || lang === 'fa'
  const isMobile = useIsMobile()

  // Refs for GSAP — each one will be animated independently.
  // Declared unconditionally above any early return so the hook order
  // stays stable when useIsMobile flips after mount (React rules-of-hooks).
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
    // Desktop-only choreography. On mobile we render an entirely
    // different layout (AboutFounderMobile) that has none of these
    // refs attached, so the GSAP setup would no-op anyway. Bailing
    // out early also avoids creating a ScrollTrigger we'd never use.
    if (isMobile) return
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
  }, [isMobile])

  // Mobile renders the Figma node 336:18007 layout — stacked vertically
  // with the decorative geometric pattern + circular portrait band
  // between the two brand blocks. Desktop keeps the 3-column layout.
  if (isMobile) {
    return <AboutFounderMobile t={t} isRTL={isRTL} />
  }

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
          sx={{ position: 'relative', zIndex: 1, alignItems: 'flex-start' }}
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
            <Stack spacing={2.5} sx={{ width: '100%', alignItems: 'center' }}>
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
                    fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
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
                    fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
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
                {/* Same /logo.svg the navbar uses. The previous
                    `irfan-logo-section.svg` had `preserveAspectRatio="none"`
                    plus width/height="100%" on the SVG root — Safari + iOS
                    interpreted that as "stretch to fill parent", and on
                    mobile the right column is narrow enough that the
                    text mark wrapped and looked squished. The clean
                    navbar SVG ships with a real viewBox and no stretch
                    override, so the aspect ratio stays locked. */}
                <Box
                  component="img"
                  src="/logo.svg"
                  alt="Irfan Investment Group"
                  sx={{
                    height: { xs: 48, md: 60 },
                    width: 'auto',
                    maxWidth: '100%',
                    display: 'block',
                  }}
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

// ───────────────────────────────────────────────────────────────────
// Mobile layout — Figma node 336:18007
// Vertical stack: Maison block → decorative geometric band with the
// circular founder portrait centered → Irfan Investment block.
// The pattern SVG (public/patterns/about-pattern.svg) is rendered
// behind the portrait at low opacity. Pattern strokes were retinted
// to rgba(255,255,255,0.18) at download time to read on the black bg.
// ───────────────────────────────────────────────────────────────────
// Shared text styles for the two brand blocks. `mx: 'auto'` + a fixed
// maxWidth on the paragraph wrapper is the trick that keeps the text
// optically centered on the page regardless of how MUI's parent flex
// box happens to lay it out.
const MOBILE_BLOCK_TITLE = {
  fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
  fontWeight: 700,
  fontSize: 22,
  lineHeight: 1.2,
  color: '#fff',
  textAlign: 'center',
  width: '100%',
  m: 0,
  mt: 1.25,
}

const MOBILE_BLOCK_BODY = {
  fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
  fontWeight: 400,
  fontSize: 14,
  lineHeight: 1.55,
  color: 'rgba(255,255,255,0.88)',
  textAlign: 'center',
  maxWidth: 300,
  mx: 'auto',
  mt: 1,
}

function AboutFounderMobile({ t, isRTL }) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        bgcolor: '#000',
        py: { xs: 7 },
        px: 3,
        overflow: 'hidden',
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: 'center',
      }}
    >
      {/* Inner wrapper — fixed-width, centered with mx:auto. Everything
          inside is laid out relative to THIS box, which guarantees the
          whole stack reads as centered on the viewport. */}
      <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto' }}>
        {/* ── Maison Shirdel block ────────────────────────────────── */}
        <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo: explicit width derived from the natural 532×130
              aspect at the target 60px height (= 245px). Bare img with
              auto width inside a flex parent gets stretched on Safari
              when the parent has alignItems:center + spacing; pinning
              both dimensions kills the squish. */}
          <Box
            component="img"
            src="/maison-shirdel-logo.png"
            alt="Maison Shirdel — Defined by Elegance"
            sx={{
              width: 245,
              height: 60,
              maxWidth: '90%',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0,
              mb: 1,
            }}
          />
          <Typography sx={MOBILE_BLOCK_TITLE}>
            {t.aboutFounder.maisonTitle}
          </Typography>
          <Typography sx={MOBILE_BLOCK_BODY}>
            {t.aboutFounder.maisonBodyMobile}
          </Typography>
        </Box>

        {/* ── Decorative band with circular portrait ──────────────── */}
        <Box
          sx={{
            position: 'relative',
            height: 220,
            // Bleed past the inner wrapper AND the outer section padding
            // so the geometric pattern reaches both viewport edges.
            mx: 'calc(50% - 50vw)',
            mb: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src="/patterns/about-pattern.svg"
            alt=""
            aria-hidden
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              maxWidth: 'none',
              height: 'auto',
              pointerEvents: 'none',
              userSelect: 'none',
              opacity: 0.55,
            }}
          />

          {/* Gradient ring + circular portrait. Figma node 341:18046
              shows a 3px ring with a pink → amber gradient (the flat
              `#ff00c5` returned by the MCP was Figma's selection
              outline, not the rendered fill). We approximate with a
              padded conic-style linear gradient wrapper. */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: 112,
              height: 112,
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(180deg, #FF1493 0%, #FF4F8A 35%, #F08C2E 70%, #F3A833 100%)',
              boxShadow: '0 10px 28px rgba(0,0,0,0.6)',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                bgcolor: '#000',
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
          </Box>
        </Box>

        {/* ── Irfan Investment Group block ────────────────────────── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo SVG is 150×60 natural; at height 72 the width is 180. */}
          <Box
            component="img"
            src="/logo.svg"
            alt="Irfan Investment Group"
            sx={{
              width: 180,
              height: 72,
              maxWidth: '90%',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0,
              mb: 1,
            }}
          />
          <Typography sx={MOBILE_BLOCK_TITLE}>
            {t.aboutFounder.irfanTitle}
          </Typography>
          <Typography sx={MOBILE_BLOCK_BODY}>
            {t.aboutFounder.irfanBodyMobile}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
