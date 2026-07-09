import { useEffect, useRef, useState } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { useI18n } from '../i18n.jsx'
import TalkToModal from './TalkToModal'

// Structural duplicate of Figma node 293-18929, scaled 1.2× for stronger
// presence per design feedback. Base Figma dims (273×373 + 58 CTA + 11 gap)
// → here (328×448 + 70 CTA + 13 gap).
//
// Video behavior:
//   - preload="auto" → eager fetch
//   - on loadeddata → tiny play→pause to force first-frame paint
//     (fixes Chrome/Safari "black until hover" bug)
//   - hover anywhere on the card (video OR cta button) → play from 0
//   - leave → pause + reset

const CARD_W = 328       // 273 × 1.2
const MEDIA_H = 448      // 373 × 1.2
const CTA_H = 70         // 58 × 1.2
const STACK_GAP = 13     // 11 × 1.2
const GRADIENT_TOP = 250 // 208 × 1.2
const GRADIENT_H = 198   // 165 × 1.2

// Stable English slugs for Supabase routing — independent of i18n locale.
const AGENT_SLUGS = ['polina', 'sara', 'mahdi', 'fayzal']

function TeamCard({ name, role, cta, videoSrc, onCtaClick }) {
  const vidRef = useRef(null)

  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    let cancelled = false

    const primeFirstFrame = () => {
      if (cancelled) return
      // play() + immediate pause forces the decoder to render frame 0.
      // Without this, some browsers leave the <video> element black until
      // play() is called the first time.
      const p = v.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          if (cancelled) return
          v.pause()
          v.currentTime = 0
        }).catch(() => {
          // Autoplay blocked — fall back to setting currentTime, which
          // also nudges most browsers into painting the first frame.
          try { v.currentTime = 0.001 } catch {}
        })
      }
    }

    if (v.readyState >= 2) {
      primeFirstFrame()
    } else {
      v.addEventListener('loadeddata', primeFirstFrame, { once: true })
    }

    // The clips total ~8 MB: with preload="none" they cost nothing at page
    // load, and this observer starts the fetch one viewport before the
    // section scrolls in, so hover-to-play still feels instant.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        try { v.load() } catch {}
        io.disconnect()
      }
    }, { rootMargin: '100% 0px' })
    io.observe(v)

    return () => {
      cancelled = true
      io.disconnect()
      v.removeEventListener('loadeddata', primeFirstFrame)
    }
  }, [])

  const onEnter = () => {
    const v = vidRef.current
    if (!v) return
    v.currentTime = 0
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }
  const onLeave = () => {
    const v = vidRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    // Hover handlers on the outer column so BOTH the video card and the
    // CTA pill below it count as hover targets.
    <Box
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${STACK_GAP}px`,
        width: CARD_W,
        flexShrink: 0,
      }}
    >
      {/* ─── Media card ─── */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: MEDIA_H,
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: 'rgba(111,108,108,0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <video
          ref={vidRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            backgroundColor: '#000000',
          }}
        />

        {/* Bottom gradient overlay — scaled from Figma h=165/top=208 */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${GRADIENT_TOP}px`,
            height: `${GRADIENT_H}px`,
            background:
              'linear-gradient(to top, #000 37.576%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Name + Role overlaid on gradient */}
        <Box
          sx={{
            position: 'absolute',
            left: '31px',
            right: '16px',
            bottom: '48px',
            color: '#ffefef',
            pointerEvents: 'none',
          }}
        >
          <Typography
            component="p"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: 1.2,
              letterSpacing: '0.52px',
              mb: '7px',
              wordBreak: 'break-word',
            }}
          >
            {name}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: 1.35,
              letterSpacing: '0.64px',
              wordBreak: 'break-word',
            }}
          >
            {role}
          </Typography>
        </Box>
      </Box>

      {/* ─── CTA pill ─── */}
      <Box
        component="button"
        type="button"
        onClick={onCtaClick}
        sx={{
          width: '100%',
          height: CTA_H,
          borderRadius: '24px',
          border: 'none',
          backgroundColor: '#7c7856',
          color: '#ffffff',
          cursor: 'pointer',
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontWeight: 700,
          fontSize: '18px',
          letterSpacing: '0.64px',
          textTransform: 'capitalize',
          lineHeight: '24px',
          transition: 'background-color 200ms ease',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: '#8e8a63',
          },
          '&:focus-visible': {
            outline: '2px solid #ffffff',
            outlineOffset: '2px',
          },
        }}
      >
        {cta}
      </Box>
    </Box>
  )
}

export default function HearFromTheTeam() {
  const { t } = useI18n()
  const members = t.hearFromTeam.members
  const [openAgent, setOpenAgent] = useState(null)

  return (
    <>
      <Box
        id="team-section"
        component="section"
        sx={{
          // pt is intentionally TINY — AkdtScrollVideo above pins at
          // `height: 100vh` with the video card centered, so the
          // bottom ~150 px of that section is already empty black.
          // That trailing space + a small pt here gives the visual
          // "gap above the heading" — adding more pt double-counts and
          // makes the heading feel pushed down the page.
          // pb stays generous so PropertyMap below has breathing room.
          pt: { xs: 4, md: 6 },
          pb: { xs: 12, md: 18 },
          // Pure #000000 — matches AKDT/GlobalPresence above. The page-wide
          // bg→white scrub is anchored to this section (App.jsx) so the white
          // interpolation is in progress at midpoint and complete by bottom.
          // Because this section paints solid black, the in-progress fade is
          // invisible until the user scrolls past onto LeadCards.
          bgcolor: '#000000',
          position: 'relative',
          color: '#ffffff',
        }}
      >
        <Container maxWidth="xl">
          <Typography
            component="h2"
            sx={{
              textAlign: 'center',
              color: '#ffffff',
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: { xs: 22, md: 28 },
              // Heading-to-cards gap. Tuned so the visual distance
              // below the heading roughly matches the visual distance
              // above it (AkdtScrollVideo's trailing black ~150 px +
              // section pt ~48 px ≈ 200 px).
              mb: { xs: 14, md: 22 },
            }}
          >
            {t.hearFromTeam.title}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, max-content)',
                lg: 'repeat(4, max-content)',
              },
              justifyContent: 'center',
              gap: { xs: 6, md: 4, lg: 5 },
            }}
          >
            {members.map((m, i) => (
              <TeamCard
                key={i}
                name={m.name}
                role={m.role}
                cta={m.cta}
                videoSrc={m.video}
                onCtaClick={() =>
                  setOpenAgent({
                    slug: AGENT_SLUGS[i],
                    name: m.name,
                    role: m.role,
                    cta: m.cta,
                  })
                }
              />
            ))}
          </Box>
        </Container>
      </Box>

      <TalkToModal
        open={!!openAgent}
        agent={openAgent}
        onClose={() => setOpenAgent(null)}
      />
    </>
  )
}
