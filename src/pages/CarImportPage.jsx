/**
 * CarImportPage — /car-import («واردات خودرو از عمان به ایران»)
 *
 * PERSIAN-ONLY page (navbar item shown only when lang === 'fa'). Same visual
 * language as the investment pages: Peyda, olive accent, Figma card material,
 * forced RTL. Content: src/data/carImportFa.js (scaffold / placeholders).
 */

import { Box, Container, Typography, Stack, Button } from '@mui/material'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ContactCTA from '../components/ContactCTA'
import { FONT, OLIVE, OLIVE_BRIGHT, HAIR, HAIR_SOFT, SectionHeading, DocGrid, FaqAccordion } from '../components/invest/ui'
import C from '../data/carImportFa'

const ICONS = {
  car: DirectionsCarFilledOutlinedIcon,
  buy: ShoppingCartOutlinedIcon,
  customs: GavelOutlinedIcon,
  shipping: LocalShippingOutlinedIcon,
  insurance: VerifiedUserOutlinedIcon,
  delivery: HandshakeOutlinedIcon,
}

// Figma card material (node 407:19700)
const CARD_MATERIAL = {
  position: 'relative',
  borderRadius: '15px',
  border: '1px solid rgba(255,255,255,0.1)',
  overflow: 'hidden',
  backgroundImage: 'radial-gradient(75% 60% at 70% 50%, rgba(230,237,245,0.12) 0%, rgba(230,237,245,0) 72%), linear-gradient(153deg, rgba(20,21,24,0.9) 0%, rgba(10,11,13,0.95) 100%)',
  boxShadow: 'inset 0 1px 1px 1px rgba(255,255,255,0.08)',
}

function CtaButton({ children, onClick, big }) {
  return (
    <Button onClick={onClick} endIcon={<ArrowBackRoundedIcon />} sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, textTransform: 'none', fontSize: big ? { xs: 16, md: 17 } : 16, px: big ? 4 : 3.5, py: big ? 1.5 : 1.4, borderRadius: '12px', '&:hover': { bgcolor: OLIVE } }}>{children}</Button>
  )
}

export default function CarImportPage() {
  const scrollToContact = () => document.getElementById('car-import-contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Box dir="rtl" sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, textAlign: 'right' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', minHeight: { xs: 460, md: 620 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Box component="img" src="/peninsula.jpg" alt="واردات خودرو از عمان" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.88) 100%)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', pb: { xs: 6, md: 9 }, pt: { xs: 12, md: 16 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 15 }, fontWeight: 700, letterSpacing: '0.14em', color: OLIVE_BRIGHT, mb: 2 }}>{C.hero.eyebrow}</Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 34, sm: 46, md: 64 }, lineHeight: 1.18, maxWidth: 940, mb: 2.5 }}>{C.hero.title}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 20 }, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, maxWidth: 740, mb: 2 }}>{C.hero.subtitle}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.9, maxWidth: 740, mb: 3.5 }}>{C.hero.intro}</Typography>
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

      {/* ── Services ─────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.servicesHeading.eyebrow} title={C.servicesHeading.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.6)', maxWidth: 820, mt: -1.5, mb: { xs: 4, md: 5 }, lineHeight: 1.8 }}>{C.servicesHeading.intro}</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {C.services.map((s) => {
            const Icon = ICONS[s.icon] || DirectionsCarFilledOutlinedIcon
            return (
              <Box key={s.title} sx={{ ...CARD_MATERIAL, display: 'flex', flexDirection: 'column', p: { xs: 3, md: 3.5 }, transition: 'border-color .2s, transform .2s', '&:hover': { borderColor: 'rgba(140,141,37,0.5)', transform: 'translateY(-3px)' } }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: 'rgba(140,141,37,0.15)', border: '1px solid rgba(140,141,37,0.35)', mb: 2 }}>
                  <Icon sx={{ fontSize: 24, color: OLIVE_BRIGHT }} />
                </Box>
                <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 19, md: 21 }, fontWeight: 600, mb: 1, lineHeight: 1.3 }}>{s.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.66)', lineHeight: 1.9 }}>{s.body}</Typography>
              </Box>
            )
          })}
        </Box>
      </Container>

      {/* ── Why us ───────────────────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, borderBottom: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.why.eyebrow} title={C.why.title} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
            {C.why.items.map((w) => (
              <Box key={w.title} sx={{ border: HAIR, borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 20 }, fontWeight: 600, color: OLIVE_BRIGHT, mb: 1 }}>{w.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.9 }}>{w.body}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Process steps ────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.steps.eyebrow} title={C.steps.title} />
        <Stack spacing={0}>
          {C.steps.items.map((step, i) => (
            <Box key={step.title} sx={{ display: 'grid', gridTemplateColumns: { xs: '40px 1fr', md: '64px 1fr' }, gap: { xs: 2, md: 4 }, alignItems: 'start', py: { xs: 2.5, md: 3.5 }, borderTop: i === 0 ? 'none' : HAIR_SOFT }}>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 22, md: 34 }, fontWeight: 700, color: 'rgba(140,141,37,0.5)' }}>{String(i + 1).padStart(2, '0')}</Typography>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 19, md: 24 }, fontWeight: 600, mb: 0.5 }}>{step.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16 }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: 760 }}>{step.body}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* ── Required documents ───────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
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

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 10 } }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(140,141,37,0.35)', px: { xs: 3, md: 8 }, py: { xs: 6, md: 9 }, textAlign: 'center', bgcolor: 'rgba(13,13,15,0.6)', backgroundImage: 'radial-gradient(100% 120% at 50% 0%, rgba(140,141,37,0.22) 0%, rgba(0,0,0,0) 70%)' }}>
          <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 28, md: 46 }, lineHeight: 1.25, color: '#fff', maxWidth: 820, mx: 'auto', mb: 2.5 }}>{C.cta.headline}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 660, mx: 'auto', mb: 4 }}>{C.cta.subheadline}</Typography>
          <CtaButton onClick={scrollToContact} big>{C.cta.cta}</CtaButton>
        </Box>
      </Container>

      <Box id="car-import-contact"><ContactCTA source="car_import_contact" /></Box>
    </Box>
  )
}
