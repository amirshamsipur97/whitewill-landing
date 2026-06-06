/**
 * CarImportPage — /car-import («واردات خودرو از عمان به ایران»)
 *
 * PERSIAN-ONLY page (navbar item only when lang === 'fa'). Peyda, olive accent,
 * Figma card material, forced RTL. SEO-oriented, table-driven. Content lives in
 * src/data/carImportFa.js.
 */

import { Box, Container, Typography, Stack, Button } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import ContactCTA from '../components/ContactCTA'
import CarCarousel from '../components/CarCarousel'
import { FONT, OLIVE, OLIVE_BRIGHT, HAIR, HAIR_SOFT, SectionHeading, MarkerList, DataTable, FaqAccordion } from '../components/invest/ui'
import C from '../data/carImportFa'

const band = { borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }
const card = { border: HAIR, borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }

function Lead({ children }) {
  return <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15.5, md: 17 }, color: 'rgba(255,255,255,0.74)', maxWidth: 920, mt: -1.5, mb: { xs: 4, md: 5 }, lineHeight: 1.9 }}>{children}</Typography>
}
function TableTitle({ children }) {
  return <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: OLIVE_BRIGHT, mb: 2 }}>{children}</Typography>
}

export default function CarImportPage() {
  const scrollToContact = () => document.getElementById('car-import-contact')?.scrollIntoView({ behavior: 'smooth' })
  const cta = (big) => (
    <Button onClick={scrollToContact} endIcon={<ArrowBackRoundedIcon />} sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, textTransform: 'none', fontSize: big ? { xs: 16, md: 17 } : 16, px: big ? 4 : 3.5, py: big ? 1.5 : 1.4, borderRadius: '12px', '&:hover': { bgcolor: OLIVE } }}>{big ? C.cta.cta : C.hero.cta}</Button>
  )

  return (
    <Box dir="rtl" sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, textAlign: 'right' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', minHeight: { xs: 470, md: 620 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Box component="img" src="/peninsula.jpg" alt="واردات خودرو از عمان به ایران" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.88) 100%)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', pb: { xs: 6, md: 9 }, pt: { xs: 12, md: 16 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 15 }, fontWeight: 700, letterSpacing: '0.14em', color: OLIVE_BRIGHT, mb: 2 }}>{C.hero.eyebrow}</Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 36, sm: 48, md: 66 }, lineHeight: 1.15, mb: 2 }}>{C.hero.title}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 21 }, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, maxWidth: 780, mb: 2.5 }}>{C.hero.subtitle}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.9, maxWidth: 800, mb: 3.5 }}>{C.hero.intro}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mb: 4 }}>
            {C.hero.benefits.map((b) => (
              <Box key={b} sx={{ px: 1.8, py: 0.7, borderRadius: '999px', border: `1px solid ${OLIVE_BRIGHT}55`, bgcolor: 'rgba(140,141,37,0.12)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 14 }, color: '#e9eac0' }}>{b}</Typography>
              </Box>
            ))}
          </Box>
          {cta(false)}
        </Container>
      </Box>

      {/* ── General rules ────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.generalRules.eyebrow} title={C.generalRules.title} />
        <Box sx={card}><MarkerList items={C.generalRules.items} /></Box>
      </Container>

      {/* ── Used-car conditions + table ──────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.usedConditions.eyebrow} title={C.usedConditions.title} />
          <Lead>{C.usedConditions.intro}</Lead>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' }, gap: { xs: 3, md: 5 }, alignItems: 'start' }}>
            <Box sx={card}><MarkerList items={C.usedConditions.items} /></Box>
            <Box>
              <TableTitle>{C.usedConditions.tableTitle}</TableTitle>
              <DataTable columns={C.usedConditions.table.columns} rows={C.usedConditions.table.rows} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── From Oman (advantages) ───────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.fromOman.eyebrow} title={C.fromOman.title} />
        <Lead>{C.fromOman.intro}</Lead>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 } }}>
          {C.fromOman.advantages.map((a) => (
            <Box key={a} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', ...card, p: { xs: 2.5, md: 3 } }}>
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 20, color: OLIVE_BRIGHT, mt: '2px', flexShrink: 0 }} />
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15.5 }, color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>{a}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Carousel + suitable cars ─────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.carousel.eyebrow} title={C.carousel.title} />
          <Lead>{C.carousel.intro}</Lead>
          <CarCarousel items={C.carousel.items} />
          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <TableTitle>{C.suitableCars.title}</TableTitle>
            <DataTable columns={C.suitableCars.table.columns} rows={C.suitableCars.table.rows} />
          </Box>
        </Container>
      </Box>

      {/* ── Allowed brands ───────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.allowedBrands.eyebrow} title={C.allowedBrands.title} />
        <Lead>{C.allowedBrands.intro}</Lead>
        <DataTable columns={C.allowedBrands.table.columns} rows={C.allowedBrands.table.rows} />
      </Container>

      {/* ── Banned cars ──────────────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.banned.eyebrow} title={C.banned.title} />
          <Lead>{C.banned.intro}</Lead>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 1.5, md: 2 } }}>
            {C.banned.items.map((r) => (
              <Box key={r} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', border: HAIR_SOFT, borderRadius: '12px', px: 2, py: 1.8, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <BlockRoundedIcon sx={{ fontSize: 18, color: '#c95a4a', mt: '2px', flexShrink: 0 }} />
                <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>{r}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Tariffs (gasoline + EV) ──────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.tariffs.eyebrow} title={C.tariffs.title} />
        <Lead>{C.tariffs.intro}</Lead>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 5 }, alignItems: 'start' }}>
          <Box>
            <TableTitle>{C.tariffs.gasolineTitle}</TableTitle>
            <DataTable columns={C.tariffs.gasoline.columns} rows={C.tariffs.gasoline.rows} />
          </Box>
          <Box>
            <TableTitle>{C.tariffs.evTitle}</TableTitle>
            <DataTable columns={C.tariffs.ev.columns} rows={C.tariffs.ev.rows} />
          </Box>
        </Box>
      </Container>

      {/* ── Costs ────────────────────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.costs.eyebrow} title={C.costs.title} />
          <Lead>{C.costs.intro}</Lead>
          <DataTable columns={C.costs.table.columns} rows={C.costs.table.rows} />
        </Container>
      </Box>

      {/* ── Standards + Documents (two tables) ───────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 5, md: 6 }, alignItems: 'start' }}>
          <Box>
            <SectionHeading eyebrow={C.standards.eyebrow} title={C.standards.title} sx={{ mb: { xs: 3, md: 4 } }} />
            <DataTable columns={C.standards.table.columns} rows={C.standards.table.rows} />
          </Box>
          <Box>
            <SectionHeading eyebrow={C.documents.eyebrow} title={C.documents.title} sx={{ mb: { xs: 3, md: 4 } }} />
            <DataTable columns={C.documents.table.columns} rows={C.documents.table.rows} />
          </Box>
        </Box>
      </Container>

      {/* ── Iranians abroad ──────────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.iraniansAbroad.eyebrow} title={C.iraniansAbroad.title} />
          <Lead>{C.iraniansAbroad.intro}</Lead>
          <DataTable columns={C.iraniansAbroad.table.columns} rows={C.iraniansAbroad.table.rows} />
        </Container>
      </Box>

      {/* ── Veterans ─────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.veterans.eyebrow} title={C.veterans.title} />
        <Lead>{C.veterans.intro}</Lead>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' }, gap: { xs: 3, md: 5 }, alignItems: 'start' }}>
          <Box sx={card}><MarkerList items={C.veterans.benefits} /></Box>
          <DataTable columns={C.veterans.table.columns} rows={C.veterans.table.rows} />
        </Box>
      </Container>

      {/* ── Steps (12) ───────────────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.steps.eyebrow} title={C.steps.title} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 1.5, md: 2 } }}>
            {C.steps.items.map((s, i) => (
              <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1.6, border: HAIR_SOFT, borderRadius: '12px', px: { xs: 2, md: 2.5 }, py: { xs: 1.6, md: 2 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: 'rgba(140,141,37,0.55)', minWidth: 30 }}>{String(i + 1).padStart(2, '0')}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15.5 }, color: 'rgba(255,255,255,0.84)', lineHeight: 1.6 }}>{s}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Our services ─────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.services.eyebrow} title={C.services.title} />
        <Lead>{C.services.intro}</Lead>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 } }}>
          {C.services.items.map((s) => (
            <Box key={s} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', ...card, p: { xs: 2.5, md: 3 } }}>
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 20, color: OLIVE_BRIGHT, mt: '2px', flexShrink: 0 }} />
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15.5 }, color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>{s}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.faq.eyebrow} title={C.faq.title} />
          <FaqAccordion items={C.faq.items} />
        </Container>
      </Box>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(140,141,37,0.35)', px: { xs: 3, md: 8 }, py: { xs: 6, md: 9 }, textAlign: 'center', bgcolor: 'rgba(13,13,15,0.6)', backgroundImage: 'radial-gradient(100% 120% at 50% 0%, rgba(140,141,37,0.22) 0%, rgba(0,0,0,0) 70%)' }}>
          <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 28, md: 46 }, lineHeight: 1.25, color: '#fff', maxWidth: 820, mx: 'auto', mb: 2.5 }}>{C.cta.headline}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 680, mx: 'auto', mb: 4 }}>{C.cta.subheadline}</Typography>
          {cta(true)}
        </Box>
      </Container>

      <Box id="car-import-contact"><ContactCTA source="car_import_contact" /></Box>
    </Box>
  )
}
