/**
 * InvestmentPage — /investment («سرمایه‌گذاری»)
 *
 * PERSIAN-ONLY page (linked from the navbar only when lang === 'fa'). Built in
 * the same visual language as the company-registration page (/invest): Peyda
 * type, olive accent, #000 canvas, premium themed cards, shared ContactCTA.
 * Forced RTL + Peyda so it renders correctly even if reached outside the fa
 * locale.
 *
 * THIS IS A SCAFFOLD: all copy lives in src/data/investmentFa.js as
 * placeholders. Replace the data there when the real content is ready.
 */

import { Box, Container, Typography, Stack, Button } from '@mui/material'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import LandscapeOutlinedIcon from '@mui/icons-material/LandscapeOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ContactCTA from '../components/ContactCTA'
import DATA from '../data/investmentFa'

const OLIVE = '#7c7856'
const OLIVE_BRIGHT = '#8c8d25'
// Peyda first so the page is correct even outside the fa locale.
const FONT = '"Peyda", "Arsenal SC", "Inter", system-ui, sans-serif'
const HAIR = '1px solid rgba(255,255,255,0.1)'
const HAIR_SOFT = '1px solid rgba(255,255,255,0.08)'

const ICONS = {
  apartment: ApartmentOutlinedIcon,
  store: StorefrontOutlinedIcon,
  hotel: HotelOutlinedIcon,
  landscape: LandscapeOutlinedIcon,
}

const THEME = {
  olive: { accent: '#a9aa45', glow: 'rgba(140,141,37,0.16)' },
  gold: { accent: '#c2a259', glow: 'rgba(194,162,89,0.14)' },
  slate: { accent: '#9aa6bd', glow: 'rgba(154,166,189,0.12)' },
  teal: { accent: '#6fae9c', glow: 'rgba(111,174,156,0.13)' },
}

function SectionHeading({ eyebrow, title, sx }) {
  return (
    <Box sx={{ mb: { xs: 3, md: 5 }, ...sx }}>
      {eyebrow && (
        <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: OLIVE_BRIGHT, mb: 1.5 }}>
          {eyebrow}
        </Typography>
      )}
      <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 28, md: 44 }, lineHeight: 1.15, letterSpacing: '-0.01em', color: '#fff' }}>
        {title}
      </Typography>
    </Box>
  )
}

function OpportunityCard({ o, onCta }) {
  const t = THEME[o.theme] || THEME.olive
  const { accent } = t
  const Icon = ICONS[o.icon] || ApartmentOutlinedIcon
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        p: { xs: 3, md: 3.25 },
        bgcolor: 'rgba(13,13,15,0.6)',
        backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${t.glow} 0%, rgba(0,0,0,0) 70%)`,
        border: o.featured ? `1px solid ${accent}66` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: o.featured ? `0 0 0 1px ${accent}22, 0 18px 50px -20px ${accent}55` : '0 8px 24px -16px rgba(0,0,0,0.6)',
        transition: 'transform .25s ease, border-color .25s ease',
        '&:hover': { transform: 'translateY(-4px)', borderColor: `${accent}88` },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: `${accent}1f`, border: `1px solid ${accent}40` }}>
          <Icon sx={{ fontSize: 22, color: accent }} />
        </Box>
        {o.badge && (
          <Box sx={{ px: 1.3, py: 0.4, borderRadius: '999px', bgcolor: accent }}>
            <Typography sx={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#0a0a0a' }}>{o.badge}</Typography>
          </Box>
        )}
      </Box>

      <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 21, md: 23 }, fontWeight: 600, lineHeight: 1.2, color: '#fff', mb: 0.5 }}>
        {o.name}
      </Typography>
      {o.tagline && (
        <Typography sx={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: accent, mb: 1.5 }}>{o.tagline}</Typography>
      )}
      <Typography sx={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', mb: 2.5 }}>
        {o.description}
      </Typography>

      <Stack spacing={1.1} sx={{ mb: 3 }}>
        {(o.features || []).map((f) => (
          <Box key={f} sx={{ display: 'flex', gap: 1.1, alignItems: 'flex-start' }}>
            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: accent, mt: '2px', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)' }}>{f}</Typography>
          </Box>
        ))}
      </Stack>

      <Button
        onClick={onCta}
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          mt: 'auto',
          alignSelf: 'stretch',
          py: 1.15,
          borderRadius: '999px',
          fontFamily: FONT,
          fontSize: 14.5,
          fontWeight: 600,
          textTransform: 'none',
          ...(o.featured
            ? { bgcolor: accent, color: '#0a0a0a', '&:hover': { bgcolor: accent, filter: 'brightness(1.08)' } }
            : { color: '#fff', border: '1px solid rgba(255,255,255,0.14)', background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', '&:hover': { borderColor: `${accent}88` } }),
        }}
      >
        {o.cta}
      </Button>
    </Box>
  )
}

export default function InvestmentPage() {
  const C = DATA
  const scrollToContact = () => {
    document.getElementById('investment-contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box dir="rtl" sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, textAlign: 'right' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', minHeight: { xs: 440, md: 600 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Box component="img" src="/peninsula.jpg" alt="سرمایه‌گذاری در عمان" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', pb: { xs: 6, md: 9 }, pt: { xs: 12, md: 16 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 15 }, fontWeight: 700, letterSpacing: '0.16em', color: OLIVE_BRIGHT, mb: 2 }}>
            {C.hero.eyebrow}
          </Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 34, sm: 46, md: 64 }, lineHeight: 1.15, letterSpacing: '-0.01em', maxWidth: 900, mb: 2.5 }}>
            {C.hero.title}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, maxWidth: 680, mb: 4 }}>
            {C.hero.subtitle}
          </Typography>
          <Button
            onClick={scrollToContact}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, textTransform: 'none', fontSize: 16, px: 3.5, py: 1.4, borderRadius: '12px', '&:hover': { bgcolor: OLIVE } }}
          >
            {C.hero.cta}
          </Button>
        </Container>
      </Box>

      {/* ── Intro + stats ────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 24 }, lineHeight: 1.9, color: 'rgba(255,255,255,0.86)', maxWidth: 920 }}>
          {C.intro}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 3, md: 4 }, mt: { xs: 5, md: 7 } }}>
          {C.stats.map((s, i) => (
            <Box key={i}>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 30, md: 44 }, fontWeight: 700, color: OLIVE_BRIGHT, lineHeight: 1 }}>{s.stat}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.72)', mt: 1, lineHeight: 1.7 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Opportunities (premium cards) ────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.headings.opportunities.eyebrow} title={C.headings.opportunities.title} />
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.6)', maxWidth: 760, mt: -1.5, mb: { xs: 4, md: 5 }, lineHeight: 1.8 }}>
            {C.headings.opportunitiesIntro}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: { xs: 2.5, md: 3 }, alignItems: 'stretch' }}>
            {C.opportunities.map((o) => (
              <OpportunityCard key={o.name} o={o} onCta={scrollToContact} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Why invest ───────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.headings.why.eyebrow} title={C.headings.why.title} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {C.why.map((w) => (
            <Box key={w.title} sx={{ border: HAIR, borderRadius: '18px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)', backgroundImage: 'radial-gradient(120% 80% at 50% 0%, rgba(140,141,37,0.08) 0%, rgba(0,0,0,0) 72%)' }}>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 34, md: 44 }, fontWeight: 700, color: OLIVE_BRIGHT, lineHeight: 1, mb: 1.2 }}>{w.stat}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 20 }, fontWeight: 600, mb: 0.8 }}>{w.title}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.68)', lineHeight: 1.7 }}>{w.body}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Process steps ────────────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.headings.process.eyebrow} title={C.headings.process.title} />
          <Stack spacing={0}>
            {C.steps.map((step, i) => (
              <Box key={step.title} sx={{ display: 'grid', gridTemplateColumns: { xs: '40px 1fr', md: '64px 1fr' }, gap: { xs: 2, md: 4 }, alignItems: 'start', py: { xs: 2.5, md: 3.5 }, borderTop: i === 0 ? 'none' : HAIR_SOFT }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 22, md: 34 }, fontWeight: 700, color: 'rgba(140,141,37,0.5)' }}>
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: 19, md: 24 }, fontWeight: 600, mb: 0.5 }}>{step.title}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16 }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: 760 }}>{step.body}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid rgba(140,141,37,0.35)',
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 9 },
            textAlign: 'center',
            bgcolor: 'rgba(13,13,15,0.6)',
            backgroundImage: 'radial-gradient(100% 120% at 50% 0%, rgba(140,141,37,0.22) 0%, rgba(0,0,0,0) 70%)',
          }}
        >
          <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 28, md: 48 }, lineHeight: 1.2, color: '#fff', maxWidth: 820, mx: 'auto', mb: 2.5 }}>
            {C.cta.headline}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 640, mx: 'auto', mb: 4 }}>
            {C.cta.subheadline}
          </Typography>
          <Button
            onClick={scrollToContact}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, textTransform: 'none', fontSize: { xs: 16, md: 17 }, px: 4, py: 1.5, borderRadius: '12px', '&:hover': { bgcolor: OLIVE } }}
          >
            {C.cta.cta}
          </Button>
        </Box>
      </Container>

      {/* ── Contact / lead form (shared component) ───────────────────── */}
      <Box id="investment-contact">
        <ContactCTA source="investment_contact" />
      </Box>
    </Box>
  )
}
