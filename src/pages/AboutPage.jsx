/**
 * AboutPage — /about
 *
 * Composes the existing landing components into a focused About story:
 *   1) Scroll-locked video hero (reuses the same /video/hero.mp4 from
 *      ScrollVideoHero so we keep one cinematic language)
 *   2) Vision/mission text — adapted from Figma 334:17789, with the UAE
 *      framing removed; the focus is squarely on Oman + emerging
 *      destinations
 *   3) AboutFounder — drop-in reuse of the existing component
 *   4) Global branches — Muscat, Tehran, Moscow, Hong Kong, each with a
 *      flag emoji, address, phone, and a soft hover lift
 *   5) Contact CTA — reuses submitForm() so leads flow into the same
 *      Supabase → Google Sheet pipeline as the rest of the site
 */

import { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Stack,
} from '@mui/material'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'
import AboutFounder from '../components/AboutFounder'
import ContactCTA from '../components/ContactCTA'
import { BRANCHES } from '../data/branches'

gsap.registerPlugin(ScrollTrigger)

const OLIVE = '#7c7856'
const OLIVE_BRIGHT = '#8c8d25'

// ── Scroll-locked video hero ───────────────────────────────────────────
function VideoHero() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return
    const ctx = gsap.context(() => {
      // Title fades + lifts slightly on scroll-out so it feels anchored
      // to the video while not blocking the next section.
      gsap.fromTo(
        titleRef.current,
        { y: 0, opacity: 1 },
        {
          y: -60,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'center top',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Belt-and-suspenders for the muted autoplay: some browsers (Safari in
  // particular) won't kick off the network fetch from the `autoplay`
  // attribute alone when the element is created via SPA navigation. An
  // explicit load() + play() pair right after mount forces the request
  // through and starts playback as soon as the first frame is ready.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    try {
      v.muted = true // required for autoplay policies
      v.load()
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } catch {}
  }, [])

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 520, md: 760 },
        overflow: 'hidden',
        bgcolor: '#000',
      }}
    >
      {/* On phones we serve the lighter `hero-mobile.mp4` (3.3 MB) instead
          of the 8 MB desktop master — iOS Safari often times out on the
          larger file over cellular. `preload="metadata"` keeps the wire
          small until the section is actually visible. */}
      <Box
        component="video"
        ref={videoRef}
        src={typeof window !== 'undefined' && window.innerWidth <= 768 ? '/video/hero-mobile.mp4' : '/video/hero.mp4'}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/peninsula.jpg"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.45) 75%, #000 100%)',
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          pb: { xs: 6, md: 10 },
        }}
      >
        <Box ref={titleRef}>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 11, md: 12 },
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              mb: 2,
            }}
          >
            About Irfan Investment
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 300,
              fontSize: { xs: 42, sm: 60, md: 84 },
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#fff',
              maxWidth: 980,
            }}
          >
            Connecting global capital with Oman&apos;s next chapter.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

// ── Vision/mission section ────────────────────────────────────────────
//
// The whole block is parked dead-centre of the viewport and pinned for a
// short stretch of scroll so the eye lands on it. Across that pin range,
// a single `filter: blur(...)` tween drives the focus story:
//
//   – at scroll-in   : blur 14px  (text is faint, unreadable)
//   – at pin centre  : blur 0     (text is razor-sharp)
//   – at scroll-out  : blur 14px  (text fades back into the page)
//
// Implemented as ONE scrub-bound tween with a sine ease — easier than
// chaining two `fromTo`s and stays perfectly symmetric on reverse scroll.
function VisionSection() {
  const sectionRef = useRef(null)
  const blockRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !blockRef.current) return
    const ctx = gsap.context(() => {
      // 0 → 0.5 → 1 maps to clear → blurred → clear when run through
      // a sine ease — we want the inverse (blur → clear → blur), so we
      // animate a `progress` proxy and read out a derived blur value.
      const blurAmt = { v: 14 }
      gsap.to(blurAmt, {
        v: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: (self) => {
            // Symmetric V-curve: max blur at the edges, 0 at centre.
            const t = self.progress // 0..1
            // distance from centre (0..0.5), normalised to 0..1
            const d = Math.abs(t - 0.5) * 2
            // ease the curve so the clear zone is wider than the blur
            const eased = Math.pow(d, 1.6)
            const px = (eased * 14).toFixed(2)
            if (blockRef.current) {
              blockRef.current.style.filter = `blur(${px}px)`
              // Pair the blur with a soft opacity dip so the transition
              // reads "out of focus" instead of "smudged".
              blockRef.current.style.opacity = String(1 - eased * 0.55)
            }
          },
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const lines = [
    'Founded with a clear vision to redefine how investors discover and access premium real estate opportunities, Irfan Investment Group has grown into a trusted platform connecting global capital with high-value developments across Oman.',
    'With a strong focus on Oman and emerging investment destinations, we combine market intelligence, strategic partnerships, and deep regional insight to deliver carefully curated property opportunities.',
    'Our approach is driven by transparency, data-led decision making, and a long-term investment mindset — built around the people we serve, not the deals we close.',
  ]

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        bgcolor: '#000',
        color: '#fff',
        // Tall enough that the scroll-bound blur has runway both ways.
        // `display: flex` + `alignItems: center` centres the block vertically.
        minHeight: { xs: '120vh', md: '140vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 8, md: 12 },
      }}
    >
      <Box
        ref={blockRef}
        sx={{
          width: '100%',
          maxWidth: 820,
          mx: 'auto',
          px: { xs: 3, md: 4 },
          textAlign: 'center',
          // CSS-driven smoothing for hardware-friendly compositing —
          // GSAP only writes the filter value, the GPU does the rest.
          willChange: 'filter, opacity',
          filter: 'blur(14px)',
          opacity: 0.45,
        }}
      >
        <Box ref={innerRef} sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: OLIVE_BRIGHT,
              mb: 2,
            }}
          >
            Our vision
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: 32, md: 48 },
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              color: '#fff',
            }}
          >
            Visionary leadership for a new investment frontier.
          </Typography>
        </Box>

        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
          {lines.map((line, i) => (
            <Typography
              key={i}
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontWeight: 400,
                fontSize: { xs: 15.5, md: 18 },
                lineHeight: 1.7,
                color: i === 0 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.78)',
                textAlign: 'center',
                maxWidth: 720,
              }}
            >
              {line}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

// ── Branches grid ─────────────────────────────────────────────────────
function BranchesSection() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        bgcolor: '#000',
        color: '#fff',
        py: { xs: 8, md: 12 },
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: OLIVE_BRIGHT,
              mb: 2,
            }}
          >
            Global presence
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: 32, md: 48 },
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              mb: 2,
            }}
          >
            Four offices, one focus.
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 14.5, md: 16 },
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 680,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            From our headquarters in Muscat, our team operates an active branch
            in Tehran and a dedicated Russian-speaking desk — connecting buyers,
            developers, and capital across borders.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {BRANCHES.map((b, i) => (
            <Box
              key={b.code}
              ref={(el) => (cardsRef.current[i] = el)}
              sx={{
                position: 'relative',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                bgcolor: 'rgba(255,255,255,0.02)',
                p: { xs: 3, md: 4 },
                transition:
                  'transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 220ms ease, box-shadow 320ms ease, background-color 220ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  bgcolor: 'rgba(255,255,255,0.04)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                },
              }}
            >
              {/* Flag artwork from the Figma brand library, rendered as a
                  rounded card so all four flags read at the same visual
                  weight regardless of their native aspect ratio. */}
              <Box
                component="img"
                src={b.flag}
                alt={`${b.country} flag`}
                loading="lazy"
                sx={{
                  display: 'block',
                  width: { xs: 56, md: 64 },
                  height: { xs: 38, md: 44 },
                  objectFit: 'cover',
                  borderRadius: '6px',
                  mb: 2.5,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 10.5,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: OLIVE_BRIGHT,
                  mb: 0.75,
                }}
              >
                {b.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: { xs: 22, md: 26 },
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1.15,
                }}
              >
                {b.city}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 12.5,
                  color: 'rgba(255,255,255,0.55)',
                  mb: 2,
                }}
              >
                {b.country}
              </Typography>

              <Stack spacing={1.25} sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Stack direction="row" spacing={1.25} alignItems="flex-start">
                  <PlaceRoundedIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', mt: '2px' }} />
                  <Typography
                    sx={{
                      fontFamily: '"Arsenal SC", "Inter", sans-serif',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.78)',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {b.address}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <LocalPhoneRoundedIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                  <Box
                    component="a"
                    href={`tel:${b.phone.replace(/\s+/g, '')}`}
                    sx={{
                      fontFamily: '"Arsenal SC", "Inter", sans-serif',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.78)',
                      textDecoration: 'none',
                      '&:hover': { color: '#fff' },
                    }}
                  >
                    {b.phone}
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <EmailRoundedIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                  <Box
                    component="a"
                    href={`mailto:${b.email}`}
                    sx={{
                      fontFamily: '"Arsenal SC", "Inter", sans-serif',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.78)',
                      textDecoration: 'none',
                      wordBreak: 'break-all',
                      '&:hover': { color: '#fff' },
                    }}
                  >
                    {b.email}
                  </Box>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}


// ── Main page ─────────────────────────────────────────────────────────
export default function AboutPage() {
  // Scroll to top on mount so the user lands at the hero, not wherever
  // they were on the previous page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <Box sx={{ bgcolor: '#000', color: '#fff', minHeight: '100vh' }}>
      <VideoHero />
      <VisionSection />
      <AboutFounder />
      <BranchesSection />
      <ContactCTA />
    </Box>
  )
}
