/**
 * InvestPage — /invest
 *
 * "Company Registration & Investment in Oman" — a content/service landing page
 * built in the same visual language as the rest of the site (Arsenal SC type,
 * olive accent, #000 canvas, shared ContactCTA lead form).
 *
 * CONTENT IS DATA-DRIVEN: edit the arrays below (HERO, INTRO, SERVICES,
 * WHY_OMAN, STEPS, FAQ) to drop in the real copy — the layout adapts.
 */

import { Box, Container, Typography, Stack, Button } from '@mui/material'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ContactCTA from '../components/ContactCTA'

const OLIVE = '#7c7856'
const OLIVE_BRIGHT = '#8c8d25'
const FONT = '"Arsenal SC", "Inter", system-ui, sans-serif'

// ── EDIT ME — page copy ────────────────────────────────────────────────────
const HERO = {
  eyebrow: 'Company Registration & Investment',
  title: 'Set up your company and invest in Oman',
  subtitle:
    'End-to-end company formation, licensing, and investment advisory — so international investors can establish, operate, and grow in Oman with confidence.',
  cta: 'Talk to an advisor',
}

const INTRO =
  'Oman offers a stable, strategically located, and increasingly open economy for foreign investment. We guide you through every step — from choosing the right legal structure and securing licenses to opening bank accounts, arranging residency, and identifying high-yield real-estate and business opportunities.'

const SERVICES = [
  { icon: BusinessOutlinedIcon, title: 'Company Formation', body: 'LLC, SPC, branch, or free-zone entity setup — structured for your activity, ownership, and tax goals.' },
  { icon: DescriptionOutlinedIcon, title: 'Licensing & Permits', body: 'Commercial registration, municipality and activity licenses, and sector-specific approvals handled end to end.' },
  { icon: AccountBalanceOutlinedIcon, title: 'Corporate Banking', body: 'Introductions and support to open corporate bank accounts and set up payment infrastructure.' },
  { icon: BadgeOutlinedIcon, title: 'Visas & Residency', body: 'Investor and employee residency, work permits, and family visas coordinated with your company setup.' },
  { icon: TrendingUpOutlinedIcon, title: 'Investment Advisory', body: 'Market entry strategy, opportunity sourcing, and due diligence tailored to your capital and objectives.' },
  { icon: ApartmentOutlinedIcon, title: 'Real-Estate Investment', body: 'Access freehold developments and income-generating assets across Oman through our brokerage network.' },
  { icon: VerifiedUserOutlinedIcon, title: 'Compliance & PRO', body: 'Ongoing accounting, tax, renewals, and government liaison so your entity stays in good standing.' },
]

const WHY_OMAN = [
  { stat: '100%', label: 'Foreign ownership in many sectors' },
  { stat: 'Gateway', label: 'Strategic access to GCC, East Africa & Asia' },
  { stat: 'Freehold', label: 'Property ownership for foreigners in ITC zones' },
  { stat: 'Stable', label: 'Pro-business, politically stable environment' },
]

const STEPS = [
  { title: 'Consultation', body: 'We learn your goals, sector, and budget, then recommend the right structure and jurisdiction.' },
  { title: 'Structuring & Documents', body: 'We prepare incorporation documents, reserve your trade name, and define ownership.' },
  { title: 'Registration & Licensing', body: 'We file with the authorities and obtain your commercial registration and licenses.' },
  { title: 'Banking & Residency', body: 'We open your corporate account and arrange investor/employee residency.' },
  { title: 'Invest & Grow', body: 'We help you deploy capital — businesses, real estate, or both — and stay compliant.' },
]

// ── small atoms ────────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, sx }) {
  return (
    <Box sx={{ mb: { xs: 3, md: 5 }, ...sx }}>
      {eyebrow && (
        <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: OLIVE_BRIGHT, mb: 1.5 }}>
          {eyebrow}
        </Typography>
      )}
      <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 28, md: 44 }, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff' }}>
        {title}
      </Typography>
    </Box>
  )
}

export default function InvestPage() {
  const scrollToContact = () => {
    document.getElementById('invest-contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box sx={{ bgcolor: '#000', color: '#fff' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', minHeight: { xs: 460, md: 620 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Box component="img" src="/peninsula.jpg" alt="Invest in Oman" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', pb: { xs: 6, md: 9 }, pt: { xs: 12, md: 16 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 15 }, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: OLIVE_BRIGHT, mb: 2 }}>
            {HERO.eyebrow}
          </Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 36, sm: 48, md: 68 }, lineHeight: 1.04, letterSpacing: '-0.02em', maxWidth: 900, mb: 2.5 }}>
            {HERO.title}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: 680, mb: 4 }}>
            {HERO.subtitle}
          </Typography>
          <Button
            onClick={scrollToContact}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, textTransform: 'none', fontSize: 16, px: 3.5, py: 1.4, borderRadius: '12px', '&:hover': { bgcolor: OLIVE } }}
          >
            {HERO.cta}
          </Button>
        </Container>
      </Box>

      {/* ── Intro ────────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 24 }, lineHeight: 1.6, color: 'rgba(255,255,255,0.86)', maxWidth: 920 }}>
          {INTRO}
        </Typography>
      </Container>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow="What we do" title="Our services" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {SERVICES.map((s) => {
            const Icon = s.icon
            return (
              <Box key={s.title} sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)', transition: 'border-color .2s, transform .2s', '&:hover': { borderColor: 'rgba(140,141,37,0.5)', transform: 'translateY(-3px)' } }}>
                <Icon sx={{ fontSize: 30, color: OLIVE_BRIGHT, mb: 1.5 }} />
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 19, md: 21 }, fontWeight: 600, mb: 1 }}>{s.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>{s.body}</Typography>
              </Box>
            )
          })}
        </Box>
      </Container>

      {/* ── Why Oman ─────────────────────────────────────────────────── */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow="Why Oman" title="A stable, open place to invest" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 3, md: 4 } }}>
            {WHY_OMAN.map((w) => (
              <Box key={w.label}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 28, md: 40 }, fontWeight: 700, color: OLIVE_BRIGHT, lineHeight: 1 }}>{w.stat}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.72)', mt: 1, lineHeight: 1.45 }}>{w.label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow="How it works" title="From idea to incorporated — and invested" />
        <Stack spacing={0}>
          {STEPS.map((step, i) => (
            <Box key={step.title} sx={{ display: 'grid', gridTemplateColumns: { xs: '40px 1fr', md: '64px 1fr' }, gap: { xs: 2, md: 4 }, alignItems: 'start', py: { xs: 2.5, md: 3.5 }, borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 22, md: 34 }, fontWeight: 700, color: 'rgba(140,141,37,0.5)' }}>
                {String(i + 1).padStart(2, '0')}
              </Typography>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 19, md: 24 }, fontWeight: 600, mb: 0.5 }}>{step.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16 }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 720 }}>{step.body}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* ── Contact / lead form (shared component) ───────────────────── */}
      <Box id="invest-contact">
        <ContactCTA />
      </Box>
    </Box>
  )
}
