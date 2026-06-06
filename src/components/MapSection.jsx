import { useEffect, useRef } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * Map section — stylized Muscat coastline (Figma 173:14815) with the 5
 * flagship project logos pinned at their real-world locations.
 *
 * Map orientation (after inspecting the screenshot):
 *   Left   ≈  West Muscat (Al Seeb, Al Mouj, Al Khoud)
 *   Center ≈  Al Ghubrah, Al Qurum, Muscat city
 *   Right  ≈  Qantab, Bandar Jissah, Yiti, AIDA (the far-east coast)
 *
 * PROJECT_PINS coordinates are tuned visually against the map image; each
 * `top` / `left` is a percentage of the map container so they re-anchor
 * correctly at every viewport size.
 *
 * Scroll choreography:
 *   - Title + subtitle fade up
 *   - Map zooms in slightly
 *   - Each pin pulses in with a back-out stagger, drawing the eye
 *     across the coastline from West → East
 */

// Pin positions tuned EXACTLY to the user's reference screenshot:
//   Al Mouj Muscat       — far-west, in the bay (top-left of the map)
//   Khaleej Muscat       — top-center-right (Bandar Jissah headland)
//   Sustainable City Yiti — center-right, just below Khaleej
//   SOLARIS Jebel Sifah   — far-right, south-east coast
const PROJECT_PINS = [
  {
    key: 'al-mouj',
    name: 'Al Mouj Muscat',
    src: '/projects/al-mouj.svg',
    left: '11%',
    top: '24%',
    width: 150,
  },
  {
    key: 'muscat-bay',
    name: 'Khaleej Muscat',
    src: '/projects/muscat-bay.svg',
    left: '62%',
    top: '30%',
    width: 130,
  },
  {
    key: 'sustainable-city',
    name: 'The Sustainable City · Yiti',
    src: '/projects/sustainable-city.svg',
    left: '66%',
    top: '52%',
    width: 180,
  },
  {
    key: 'solaris',
    name: 'Solaris · Jebel Sifah',
    src: '/projects/solaris.svg',
    left: '88%',
    top: '62%',
    width: 120,
  },
]

export default function MapSection() {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar' || lang === 'fa'

  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const mapRef = useRef(null)
  const pinsRef = useRef([])
  pinsRef.current = []

  // Stable ref-array setter for the 5 pins.
  const addPinRef = (el) => {
    if (el && !pinsRef.current.includes(el)) pinsRef.current.push(el)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // -------- Initial states (CSS-level → no FOUC) ---------------------
      gsap.set([titleRef.current, subRef.current], {
        opacity: 0,
        y: 30,
        filter: 'blur(8px)',
      })
      gsap.set(mapRef.current, {
        opacity: 0,
        scale: 0.96,
        y: 30,
        filter: 'blur(10px)',
      })
      // Pins start hidden + tiny + slightly lifted up; back-out makes them
      // "drop in" with a small overshoot.
      gsap.set(pinsRef.current, {
        opacity: 0,
        scale: 0.4,
        y: -20,
      })

      // -------- Master scrub timeline ------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 15%',     // slightly longer travel so pins finish before exit
          scrub: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      })

      tl.to(titleRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.18 }, 0.00)
      tl.to(subRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.18 }, 0.08)
      tl.to(
        mapRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.25,
          ease: 'power3.out',
        },
        0.14,
      )

      // Pins drop in West → East with back-out bounce.
      pinsRef.current.forEach((pin, i) => {
        tl.to(
          pin,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.18,
            ease: 'back.out(2)',
          },
          0.40 + i * 0.08,
        )
      })
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
        // Half the previous top gap (was xs:12 / md:22) — keeps the section
        // breathing room but pulls the title closer to AboutFounder above.
        pt: { xs: 6, md: 11 },
        pb: { xs: 8, md: 14 },
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
          Title block — explicitly centered:
          flex column wrapper + alignItems center on Stack + textAlign:center
          + mx:auto + maxWidth on every Typography → bulletproof centering
          like the video-hero text we already shipped.
        */}
        <Stack
          spacing={2}
          sx={{
            width: '100%',
            textAlign: 'center',
            alignItems: 'center',
            mb: { xs: 5, md: 8 },
          }}
        >
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography
              ref={titleRef}
              component="h2"
              sx={{
                display: 'inline-block',
                fontFamily: '"Arsenal SC", "Manrope", "Inter", system-ui, sans-serif',
                fontWeight: 700,
                fontSize: { xs: 28, sm: 34, md: 44, lg: 52 },
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: '#fff',
                maxWidth: 900,
                m: 0,
                willChange: 'transform, opacity, filter',
              }}
            >
              {t.mapSection.title}
            </Typography>
          </Box>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography
              ref={subRef}
              component="span"
              sx={{
                display: 'inline-block',
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                fontWeight: 400,
                fontSize: { xs: 14, md: 16 },
                lineHeight: 1.55,
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: 720,
                willChange: 'transform, opacity, filter',
              }}
            >
              {t.mapSection.subtitle}
            </Typography>
          </Box>
        </Stack>

        {/* Map card — relative parent for the absolutely-positioned pins */}
        <Box
          ref={mapRef}
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: { xs: 3, md: 4 },
            overflow: 'hidden',
            boxShadow:
              '0 30px 80px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)',
            willChange: 'transform, opacity, filter',
          }}
        >
          <Box
            component="img"
            src="/oman-map.png"
            alt="Muscat coastline — Irfan Investment service area"
            loading="lazy"
            sx={{
              display: 'block',
              width: '100%',
              height: 'auto',
            }}
          />

          {/* Soft vignette (decorative) */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)',
            }}
          />

          {/*
            Project logo pins. Each pin is a card with:
              - the SVG logo (white, ~110px wide)
              - a small pulse dot below it to point at the location
            Positioned absolutely by percentage so they re-anchor on resize.
          */}
          {PROJECT_PINS.map((p) => (
            <Box
              key={p.key}
              ref={addPinRef}
              sx={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                transform: 'translate(-50%, -50%)',
                willChange: 'transform, opacity',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                component="img"
                src={p.src}
                alt={p.name}
                sx={{
                  width: { xs: p.width * 0.55, sm: p.width * 0.75, md: p.width },
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.6))',
                }}
              />
              {/* Pulse dot anchoring the pin to the map */}
              <Box
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#fff',
                  boxShadow:
                    '0 0 0 4px rgba(255,255,255,0.18), 0 0 20px rgba(255,255,255,0.5)',
                  animation: 'pinPulse 2.4s ease-in-out infinite',
                  '@keyframes pinPulse': {
                    '0%, 100%': {
                      boxShadow:
                        '0 0 0 4px rgba(255,255,255,0.18), 0 0 14px rgba(255,255,255,0.4)',
                    },
                    '50%': {
                      boxShadow:
                        '0 0 0 8px rgba(255,255,255,0.05), 0 0 24px rgba(255,255,255,0.65)',
                    },
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Area chips — kept from the previous version, centered list */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 1, md: 1.25 },
            mt: { xs: 4, md: 6 },
          }}
        >
          {t.mapSection.areaList.map((name) => (
            <Box
              key={name}
              sx={{
                px: 2.25,
                py: 0.75,
                borderRadius: 999,
                border: '1px solid rgba(255, 255, 255, 0.14)',
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                color: 'rgba(255, 255, 255, 0.88)',
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                fontWeight: 500,
                fontSize: { xs: 12.5, md: 13.5 },
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                transition: 'background-color 200ms ease, border-color 200ms ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.28)',
                },
              }}
            >
              {name}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
