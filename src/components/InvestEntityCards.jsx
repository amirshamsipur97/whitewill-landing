/**
 * InvestEntityCards — the 4 premium "business entity" cards on /invest
 * (LLC · SPC · Branch · Free Zone).
 *
 * Adapted from a themed pricing-card pattern into the site's olive-luxury
 * language: a tinted badge chip, a soft radial accent glow, themed check
 * icons, a featured (headline) card, and a scroll-triggered reveal. Each
 * card's CTA scrolls to the shared lead form (#invest-contact).
 *
 * Data: ENTITIES in src/data/investContent.js.
 */

import { useEffect, useRef } from 'react'
import { Box, Typography, Button, Stack, Chip } from '@mui/material'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const FONT = '"Arsenal SC", "Inter", system-ui, sans-serif'

// Per-card accent — all kept low-saturation so they read as a luxury set,
// not a rainbow. `accent` tints badge/checks/glow; `glow` is the radial wash.
const THEME = {
  olive: { accent: '#a9aa45', glow: 'rgba(140,141,37,0.16)' },
  gold:  { accent: '#c2a259', glow: 'rgba(194,162,89,0.14)' },
  slate: { accent: '#9aa6bd', glow: 'rgba(154,166,189,0.12)' },
  teal:  { accent: '#6fae9c', glow: 'rgba(111,174,156,0.13)' },
}

function MiniList({ items, accent }) {
  return (
    <Stack spacing={1.1}>
      {items.map((it) => (
        <Box key={it} sx={{ display: 'flex', gap: 1.1, alignItems: 'flex-start' }}>
          <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: accent, mt: '2px', flexShrink: 0 }} />
          <Typography sx={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.78)' }}>{it}</Typography>
        </Box>
      ))}
    </Stack>
  )
}

function Label({ children }) {
  return (
    <Typography sx={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)', mb: 1.2, mt: 0 }}>
      {children}
    </Typography>
  )
}

function EntityCard({ e, onCta, labels }) {
  const t = THEME[e.theme] || THEME.olive
  const { accent } = t
  return (
    <Box
      data-entity-card
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        p: { xs: 3, md: 3.25 },
        bgcolor: 'rgba(13,13,15,0.6)',
        backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${t.glow} 0%, rgba(0,0,0,0) 70%)`,
        border: e.featured ? `1px solid ${accent}66` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: e.featured ? `0 0 0 1px ${accent}22, 0 18px 50px -20px ${accent}55` : '0 8px 24px -16px rgba(0,0,0,0.6)',
        transition: 'transform .25s ease, border-color .25s ease',
        '&:hover': { transform: 'translateY(-4px)', borderColor: `${accent}88` },
      }}
    >
      {/* Badge row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.3, py: 0.55, borderRadius: '12px', border: `1px solid ${accent}40`, background: `linear-gradient(96deg, ${accent}26 12%, rgba(23,23,23,0.25) 70%)` }}>
          <Box sx={{ width: 13, height: 13, borderRadius: '4px', bgcolor: accent }} />
          <Typography sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#e7e7e7' }}>{e.code}</Typography>
        </Box>
        {e.badge && (
          <Chip
            label={e.badge}
            size="small"
            sx={{ height: 22, fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: '#0a0a0a', bgcolor: accent, '& .MuiChip-label': { px: 1 } }}
          />
        )}
      </Box>

      {/* Name + tagline */}
      <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 23, md: 25 }, fontWeight: 600, lineHeight: 1.12, color: '#fff', mb: 0.6 }}>
        {e.name}
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: 14.5, fontWeight: 600, color: accent, mb: 1.5 }}>{e.tagline}</Typography>

      {/* Price */}
      {e.price && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)', mb: 0.3 }}>
            {labels.startingFrom}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 30, md: 34 }, fontWeight: 700, letterSpacing: '-0.5px', color: '#fff', lineHeight: 1.1 }}>
            {e.price}
          </Typography>
        </Box>
      )}

      {/* Description */}
      <Typography sx={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.6)', mb: 2.5, minHeight: { md: 110 } }}>
        {e.description}
      </Typography>

      {/* CTA */}
      <Button
        onClick={() => onCta(e)}
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          alignSelf: 'stretch',
          mb: 3,
          py: 1.15,
          borderRadius: '999px',
          fontFamily: FONT,
          fontSize: 14.5,
          fontWeight: 600,
          textTransform: 'none',
          ...(e.featured
            ? { bgcolor: accent, color: '#0a0a0a', '&:hover': { bgcolor: accent, filter: 'brightness(1.08)' } }
            : { color: '#fff', border: '1px solid rgba(255,255,255,0.14)', background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', '&:hover': { borderColor: `${accent}88`, background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))' } }),
        }}
      >
        {e.cta}
      </Button>

      {/* Key features */}
      <Label>{labels.keyFeatures}</Label>
      <MiniList items={e.features} accent={accent} />

      {/* Advantages */}
      <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Label>{labels.advantages}</Label>
        <MiniList items={e.advantages} accent={accent} />
      </Box>

      {/* Ideal for */}
      <Box sx={{ mt: 'auto', pt: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Label>{labels.idealFor}</Label>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {e.idealFor.map((x) => (
            <Box key={x} sx={{ px: 1.3, py: 0.5, borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)' }}>
              <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: 'rgba(255,255,255,0.72)' }}>{x}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default function InvestEntityCards({ entities, labels }) {
  const ref = useRef(null)

  const scrollToContact = () => {
    document.getElementById('invest-contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Scroll-triggered staggered reveal — skipped for reduced-motion users.
  // Guarded with gsap.context so it cleans up on unmount (ScrollManager also
  // kills triggers on route change).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-entity-card]'), {
        y: 48,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%' },
      })
    }, el)
    return () => ctx.revert()
  }, [entities])

  return (
    <Box
      ref={ref}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
        gap: { xs: 2.5, md: 3 },
        alignItems: 'stretch',
      }}
    >
      {entities.map((e) => (
        <EntityCard key={e.code} e={e} onCta={scrollToContact} labels={labels} />
      ))}
    </Box>
  )
}
