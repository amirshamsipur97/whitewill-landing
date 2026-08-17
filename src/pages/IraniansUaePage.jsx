/**
 * IraniansUaePage — /fa/oman-property-for-iranians-in-uae
 *
 * A Persian-only landing for Iranians who live in the UAE. The whole argument
 * is priced in dirhams, because that is the currency the reader thinks in, and
 * the comparison it makes is against the Dubai market rather than against
 * Tehran. Copy and every figure live in src/data/iraniansUaeContent.mjs; read
 * that file's header before changing a number, especially the note about
 * Oman's golden tier being MORE expensive than the UAE's.
 *
 * FA ONLY, ON PURPOSE. seoRoutes marks the route `langs: ['fa']`, so
 * prerender-routes writes one static page and the sitemap emits one URL, and
 * vercel.json allowlists only the /fa/ shape. The route itself is shared by
 * PageRoutes across every language prefix, so /oman-property-for-iranians-in-uae
 * without the prefix still renders in the SPA if somebody navigates there
 * client side; it just is not reachable from outside and is not indexed.
 * 🚨 If a future session wants this page in another language, it needs a real
 * translation AND its own vercel.json rewrite. Do not simply widen `langs`.
 *
 * Visual language is the dark site default (the invest kit in
 * components/invest/ui.jsx, Peyda, olive accent), NOT the light Perumnas look
 * of PriceIndexPage and GoldenVisaPage. Those two are deliberate exceptions
 * that each carry three fragile overrides; there was no reason to take that on
 * for a page whose job is a comparison table and a form.
 *
 * The lead form is the shared ContactCTA with its own `source`, so these leads
 * are separable from site-wide traffic in the leads table and in the Sheet.
 */
import { useEffect } from 'react'
import { Box, Container, Typography, Stack, Button } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ContactCTA from '../components/ContactCTA'
import { LocalizedLink } from '../lib/localize.js'
import {
  FONT, OLIVE_BRIGHT, HAIR, HAIR_SOFT,
  SectionHeading, DataTable, FaqAccordion, MarkerList,
} from '../components/invest/ui.jsx'
import { copy, links, faqJsonLd, breadcrumbJsonLd } from '../data/iraniansUaeContent.mjs'

// Same ids the prerenderer writes, so hydration replaces rather than duplicates.
const FAQ_ID = 'iranians-uae-faq-jsonld'
const CRUMB_ID = 'iranians-uae-breadcrumb-jsonld'

// Verdict tint on the comparison table: green where Oman genuinely wins, amber
// where it does not. The amber row is the golden-visa threshold and it stays.
const GOOD = '#8c8d25'
const WARN = '#c8a24a'

function StatCard({ value, label }) {
  return (
    <Box
      sx={{
        border: HAIR, borderRadius: '16px', px: { xs: 2.2, md: 2.8 }, py: { xs: 2, md: 2.6 },
        bgcolor: 'rgba(255,255,255,0.02)',
        backgroundImage: 'radial-gradient(120% 100% at 100% 0%, rgba(140,141,37,0.07) 0%, rgba(0,0,0,0) 60%)',
      }}
    >
      <Typography sx={{ fontFamily: FONT, fontSize: { xs: 20, md: 26 }, fontWeight: 600, color: '#fff', lineHeight: 1.25 }}>
        {value}
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: { xs: 12.5, md: 13.5 }, color: 'rgba(255,255,255,0.55)', mt: 0.6, lineHeight: 1.6 }}>
        {label}
      </Typography>
    </Box>
  )
}

function WhyCard({ title, body }) {
  return (
    <Box
      sx={{
        border: HAIR, borderRadius: '18px', p: { xs: 2.5, md: 3.2 },
        bgcolor: 'rgba(255,255,255,0.02)', height: '100%',
        transition: 'border-color .2s, transform .2s',
        '&:hover': { borderColor: 'rgba(140,141,37,0.4)', transform: 'translateY(-2px)' },
      }}
    >
      <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 19 }, fontWeight: 600, color: '#fff', mb: 1.2, lineHeight: 1.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.95 }}>
        {body}
      </Typography>
    </Box>
  )
}

function BandCard({ range, omr, count, body }) {
  return (
    <Box sx={{ border: HAIR, borderRadius: '18px', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.02)', height: '100%' }}>
      <Box sx={{ px: { xs: 2.5, md: 3 }, py: { xs: 2, md: 2.4 }, borderBottom: HAIR_SOFT, bgcolor: 'rgba(140,141,37,0.06)' }}>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 18 }, fontWeight: 600, color: '#fff', lineHeight: 1.45 }}>
          {range}
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: 13, color: OLIVE_BRIGHT, mt: 0.5 }}>
          {omr} · {count}
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.95, px: { xs: 2.5, md: 3 }, py: { xs: 2, md: 2.4 } }}>
        {body}
      </Typography>
    </Box>
  )
}

export default function IraniansUaePage() {
  // FAQPage + BreadcrumbList. Both are also written into the static shell, and
  // both reuse that shell's id so hydration replaces instead of duplicating.
  // Removed on unmount like every other page-scoped JSON-LD on this site.
  useEffect(() => {
    const nodes = [[FAQ_ID, faqJsonLd()], [CRUMB_ID, breadcrumbJsonLd()]].map(([id, data]) => {
      const el = document.getElementById(id) || document.createElement('script')
      el.id = id
      el.type = 'application/ld+json'
      el.textContent = JSON.stringify(data)
      if (!el.parentNode) document.head.appendChild(el)
      return el
    })
    return () => { nodes.forEach((el) => el.parentNode?.removeChild(el)) }
  }, [])

  return (
    <Box dir="rtl" sx={{ bgcolor: '#000', color: '#fff', pt: { xs: 14, md: 18 }, pb: { xs: 8, md: 12 } }}>
      {/* Hero */}
      <Container maxWidth="lg">
        <Typography sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.16em', color: OLIVE_BRIGHT, mb: 2 }}>
          {copy.eyebrow}
        </Typography>
        <Typography
          component="h1"
          sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 32, md: 58 }, lineHeight: 1.18, letterSpacing: '-0.01em', color: '#fff', maxWidth: 900 }}
        >
          {copy.h1}
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15.5, md: 17.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 2, mt: { xs: 2.5, md: 3.5 }, maxWidth: 780 }}>
          {copy.lead}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.6} sx={{ mt: { xs: 3.5, md: 4.5 } }}>
          <Button
            component={LocalizedLink}
            to="/project"
            endIcon={<ArrowBackRoundedIcon />}
            sx={{
              fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#000', bgcolor: OLIVE_BRIGHT,
              px: 3.2, py: 1.4, borderRadius: '999px', '&:hover': { bgcolor: '#a0a12b' },
            }}
          >
            {copy.ctaPrimary}
          </Button>
          <Button
            href="#iranians-uae-form"
            sx={{
              fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#fff', border: HAIR,
              px: 3.2, py: 1.4, borderRadius: '999px', '&:hover': { borderColor: 'rgba(140,141,37,0.5)' },
            }}
          >
            {copy.ctaSecondary}
          </Button>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 1.4, md: 2 }, mt: { xs: 5, md: 7 } }}>
          {copy.stats.map((s) => <StatCard key={s.label} {...s} />)}
        </Box>
      </Container>

      {/* Why Oman when you already live in the UAE */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.whyTitle} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 2, mb: { xs: 3.5, md: 5 }, maxWidth: 820 }}>
          {copy.whyIntro}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 } }}>
          {copy.why.map((w) => <WhyCard key={w.title} {...w} />)}
        </Box>
      </Container>

      {/* Number-by-number comparison. The amber row is the one Oman loses. */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading title={copy.compareTitle} />
        <Box
          sx={{
            border: '1px solid rgba(200,162,74,0.35)', borderRadius: '14px',
            bgcolor: 'rgba(200,162,74,0.06)', px: { xs: 2.2, md: 3 }, py: { xs: 1.8, md: 2.2 },
            mb: { xs: 3, md: 4 },
          }}
        >
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15.5 }, color: 'rgba(255,255,255,0.86)', lineHeight: 1.95 }}>
            {copy.compareNote}
          </Typography>
        </Box>

        <DataTable
          columns={copy.compareCols}
          rows={copy.compareRows.map((r) => [r.k, r.uae, r.om])}
          minWidth={720}
        />

        <Box sx={{ display: 'flex', gap: 1.4, flexWrap: 'wrap', mt: 2.5 }}>
          {copy.compareRows.filter((r) => r.good !== null).map((r) => (
            <Box
              key={r.k}
              sx={{
                px: 1.8, py: 0.7, borderRadius: '999px',
                border: `1px solid ${r.good ? 'rgba(140,141,37,0.45)' : 'rgba(200,162,74,0.45)'}`,
                bgcolor: r.good ? 'rgba(140,141,37,0.08)' : 'rgba(200,162,74,0.08)',
              }}
            >
              <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: r.good ? GOOD : WARN }}>
                {r.good ? 'برتری عمان: ' : 'برتری امارات: '}{r.k}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 13.5 }, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, mt: 2.5, maxWidth: 860 }}>
          {copy.compareSource}
        </Typography>
      </Container>

      {/* Budget bands, in dirhams */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading title={copy.bandsTitle} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 } }}>
          {copy.bands.map((b) => <BandCard key={b.range} {...b} />)}
        </Box>
      </Container>

      {/* Steps */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading title={copy.stepsTitle} />
        <Box sx={{ maxWidth: 860 }}>
          <MarkerList items={copy.steps} />
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.55)', lineHeight: 1.95, mt: 3 }}>
            {copy.stepsNote}
          </Typography>
        </Box>
      </Container>

      {/* FAQ */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading title={copy.faqTitle} />
        <FaqAccordion items={copy.faq} />
      </Container>

      {/* Keyword-anchored internal links. Same list the static shell renders. */}
      <Container maxWidth="lg" sx={{ mt: { xs: 7, md: 11 } }}>
        <Typography component="h2" sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.16em', color: OLIVE_BRIGHT, mb: 2.5 }}>
          {links.heading}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 1.2, md: 1.6 } }}>
          {links.items.map((l) => (
            <LocalizedLink
              key={l.href}
              to={l.href}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  border: HAIR, borderRadius: '12px', px: { xs: 2, md: 2.4 }, py: { xs: 1.5, md: 1.8 },
                  bgcolor: 'rgba(255,255,255,0.02)', transition: 'border-color .2s',
                  '&:hover': { borderColor: 'rgba(140,141,37,0.45)' },
                }}
              >
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                  {l.label}
                </Typography>
              </Box>
            </LocalizedLink>
          ))}
        </Box>
      </Container>

      {/* Lead form. Own source so these leads are separable downstream. */}
      <Box id="iranians-uae-form" sx={{ mt: { xs: 8, md: 14 } }}>
        <ContactCTA source="iranians_uae" />
      </Box>
    </Box>
  )
}
