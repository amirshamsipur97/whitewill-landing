/**
 * InvestmentPage — /investment («بانکداری، تامین مالی و سرمایه‌گذاری در عمان»)
 *
 * PERSIAN-ONLY page (navbar item shown only when lang === 'fa'). Same visual
 * language as /invest: Peyda type, olive accent, premium themed cards, forced
 * RTL. Content: src/data/investmentFa.js. Links to the legal-requirements page
 * (/investment/legal).
 */

import { Box, Container, Typography, Stack, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import ContactCTA from '../components/ContactCTA'
import { FONT, OLIVE, OLIVE_BRIGHT, HAIR, HAIR_SOFT, SectionHeading, MarkerList, DocGrid, FaqAccordion } from '../components/invest/ui'
import C from '../data/investmentFa'

const ICONS = {
  account: AccountBalanceOutlinedIcon,
  sme: TrendingUpOutlinedIcon,
  trade: PublicOutlinedIcon,
  property: ApartmentOutlinedIcon,
  advisory: InsightsOutlinedIcon,
  international: SwapHorizOutlinedIcon,
}

function CtaButton({ children, onClick, big }) {
  return (
    <Button
      onClick={onClick}
      endIcon={<ArrowBackRoundedIcon />}
      sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, textTransform: 'none', fontSize: big ? { xs: 16, md: 17 } : 16, px: big ? 4 : 3.5, py: big ? 1.5 : 1.4, borderRadius: '12px', '&:hover': { bgcolor: OLIVE } }}
    >
      {children}
    </Button>
  )
}

export default function InvestmentPage() {
  const scrollToContact = () => document.getElementById('investment-contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Box dir="rtl" sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, textAlign: 'right' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', minHeight: { xs: 480, md: 640 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Box component="img" src="/peninsula.jpg" alt="بانکداری و سرمایه‌گذاری در عمان" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.88) 100%)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', pb: { xs: 6, md: 9 }, pt: { xs: 12, md: 16 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 15 }, fontWeight: 700, letterSpacing: '0.14em', color: OLIVE_BRIGHT, mb: 2 }}>{C.hero.eyebrow}</Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 32, sm: 44, md: 62 }, lineHeight: 1.2, letterSpacing: '-0.01em', maxWidth: 980, mb: 2.5 }}>{C.hero.title}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 21 }, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, maxWidth: 760, mb: 2 }}>{C.hero.subtitle}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.9, maxWidth: 760, mb: 3.5 }}>{C.hero.intro}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mb: 4 }}>
            {C.hero.benefits.map((b) => (
              <Box key={b} sx={{ px: 1.8, py: 0.7, borderRadius: '999px', border: `1px solid ${OLIVE_BRIGHT}55`, bgcolor: 'rgba(140,141,37,0.12)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 14 }, color: '#e9eac0' }}>{b}</Typography>
              </Box>
            ))}
          </Box>
          <CtaButton onClick={scrollToContact}>{C.hero.cta}</CtaButton>
        </Container>
      </Box>

      {/* ── Services grid (6) ────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.servicesHeading.eyebrow} title={C.servicesHeading.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.6)', maxWidth: 820, mt: -1.5, mb: { xs: 4, md: 5 }, lineHeight: 1.8 }}>{C.servicesHeading.intro}</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {C.services.map((s) => {
            const Icon = ICONS[s.icon] || AccountBalanceOutlinedIcon
            return (
              <Box key={s.title} sx={{ display: 'flex', flexDirection: 'column', border: HAIR, borderRadius: '18px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)', backgroundImage: 'radial-gradient(120% 80% at 50% 0%, rgba(140,141,37,0.07) 0%, rgba(0,0,0,0) 70%)', transition: 'border-color .2s, transform .2s', '&:hover': { borderColor: 'rgba(140,141,37,0.5)', transform: 'translateY(-3px)' } }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: 'rgba(140,141,37,0.15)', border: '1px solid rgba(140,141,37,0.35)', mb: 2 }}>
                  <Icon sx={{ fontSize: 24, color: OLIVE_BRIGHT }} />
                </Box>
                <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 19, md: 21 }, fontWeight: 600, mb: 1, lineHeight: 1.3 }}>{s.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.66)', lineHeight: 1.8, mb: 2.5 }}>{s.body}</Typography>
                <Box sx={{ mt: 'auto', pt: 2.5, borderTop: HAIR_SOFT, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {s.features.map((f) => (
                    <Box key={f} sx={{ px: 1.2, py: 0.4, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.04)', border: HAIR_SOFT }}>
                      <Typography dir="ltr" sx={{ fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{f}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Container>

      {/* ── Why Oman (6) ─────────────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, borderBottom: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.whyOman.eyebrow} title={C.whyOman.title} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
            {C.whyOman.items.map((w) => (
              <Box key={w.title} sx={{ border: HAIR, borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 20 }, fontWeight: 600, color: OLIVE_BRIGHT, mb: 1 }}>{w.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.9 }}>{w.body}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Financing solutions (10) ─────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.financing.eyebrow} title={C.financing.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.6)', maxWidth: 820, mt: -1.5, mb: { xs: 4, md: 5 }, lineHeight: 1.8 }}>{C.financing.intro}</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
          {C.financing.items.map((f) => (
            <Box key={f.title} sx={{ border: HAIR, borderRadius: '14px', p: { xs: 2.5, md: 3 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16.5, md: 18 }, fontWeight: 600, mb: 0.8 }}>{f.title}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.68)', lineHeight: 1.8 }}>{f.body}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Banking partners (5) ─────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.banks.eyebrow} title={C.banks.title} />
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.6)', maxWidth: 820, mt: -1.5, mb: { xs: 4, md: 5 }, lineHeight: 1.8 }}>{C.banks.intro}</Typography>
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            {C.banks.items.map((b) => (
              <Box key={b.name} sx={{ border: HAIR, borderRadius: '16px', p: { xs: 2.5, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2.5 }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', borderRadius: '12px', px: { xs: 2, md: 2.5 }, py: { xs: 1.4, md: 1.8 }, boxShadow: '0 6px 20px -10px rgba(0,0,0,0.6)' }}>
                    {b.logo
                      ? <Box component="img" src={b.logo} alt={b.name} loading="lazy" sx={{ height: { xs: 28, md: 34 }, width: 'auto', maxWidth: { xs: 180, md: 230 }, objectFit: 'contain', display: 'block' }} />
                      : <Typography dir="ltr" sx={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: '#0a0a0a' }}>{b.name}</Typography>}
                  </Box>
                </Box>
                <Typography dir="ltr" component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 17 }, fontWeight: 600, color: 'rgba(255,255,255,0.85)', mb: 2, textAlign: 'right' }}>{b.name}</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
                  {[['نقاط قوت', b.strengths], ['انواع وام', b.loanTypes], ['مناسب چه کسانی', b.suitableFor], ['شرایط دریافت تسهیلات', b.terms]].map(([label, val]) => (
                    <Box key={label}>
                      <Typography sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: OLIVE_BRIGHT, mb: 0.6 }}>{label}</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.8 }}>{val}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── Loan eligibility (5) ─────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.eligibility.eyebrow} title={C.eligibility.title} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {C.eligibility.items.map((e) => (
            <Box key={e.audience} sx={{ border: HAIR, borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 19 }, fontWeight: 600, mb: 1.8 }}>{e.audience}</Typography>
              <MarkerList items={e.requirements} />
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Required documents (10) ──────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, borderBottom: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.documents.eyebrow} title={C.documents.title} />
          <DocGrid items={C.documents.items} />
        </Container>
      </Box>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.faq.eyebrow} title={C.faq.title} />
        <FaqAccordion items={C.faq.items} />
      </Container>

      {/* ── Link to legal-requirements page ──────────────────────────── */}
      <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 10 } }}>
        <Box component={RouterLink} to="/investment/legal" sx={{ textDecoration: 'none', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, border: HAIR, borderRadius: '18px', p: { xs: 3, md: 4 }, bgcolor: 'rgba(255,255,255,0.02)', transition: 'border-color .2s', '&:hover': { borderColor: 'rgba(140,141,37,0.5)' } }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '14px', display: 'grid', placeItems: 'center', bgcolor: 'rgba(140,141,37,0.15)', border: '1px solid rgba(140,141,37,0.35)', flexShrink: 0 }}>
            <GavelOutlinedIcon sx={{ fontSize: 26, color: OLIVE_BRIGHT }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 22 }, fontWeight: 600, color: '#fff', mb: 0.5 }}>الزامات قانونی دریافت وام و تامین مالی در عمان</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.66)', lineHeight: 1.7 }}>راهنمای کامل KYC، AML، UBO، مدارک و شرایط دریافت تسهیلات بانکی را مطالعه کنید.</Typography>
          </Box>
          <ArrowBackRoundedIcon sx={{ color: OLIVE_BRIGHT, fontSize: 26 }} />
        </Box>
      </Container>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 10 } }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(140,141,37,0.35)', px: { xs: 3, md: 8 }, py: { xs: 6, md: 9 }, textAlign: 'center', bgcolor: 'rgba(13,13,15,0.6)', backgroundImage: 'radial-gradient(100% 120% at 50% 0%, rgba(140,141,37,0.22) 0%, rgba(0,0,0,0) 70%)' }}>
          <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 26, md: 46 }, lineHeight: 1.25, color: '#fff', maxWidth: 880, mx: 'auto', mb: 2.5 }}>{C.cta.headline}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 700, mx: 'auto', mb: 4 }}>{C.cta.subheadline}</Typography>
          <CtaButton onClick={scrollToContact} big>{C.cta.cta}</CtaButton>
        </Box>
      </Container>

      <Box id="investment-contact"><ContactCTA source="investment_contact" /></Box>
    </Box>
  )
}
