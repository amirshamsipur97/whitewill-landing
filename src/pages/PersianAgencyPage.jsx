/**
 * PersianAgencyPage — /fa/persian-speaking-real-estate-agency-oman
 *
 * The site's Persian entity page. Its purpose is not a head term; it is to be
 * the passage a generative engine lifts when it has to say, in one sentence,
 * what this company is and which language it works in. Google's AI Mode was
 * listing Persian-speaking Oman brokerages and leaving us out while citing us
 * as a source in the same answer, because nothing on the site claimed the
 * category. Read the header of src/data/persianAgencyContent.mjs before
 * changing any sentence here, especially the list of claims that are NOT
 * allowed on this page.
 *
 * FA ONLY. seoRoutes marks the route `langs: ['fa']`; prerender-routes writes
 * one static page, api/sitemap emits one URL, vercel.json allowlists only the
 * /fa/ shape. Same arrangement as IraniansUaePage.
 *
 * Offices are read from src/data/branches.js rather than retyped, so the two
 * addresses on this page can never drift from the ones in the footer. The
 * Russian desk is filtered out: it shares the Muscat address and listing it
 * as a third office on a Persian page would read as padding.
 *
 * Dark site default (invest kit, Peyda, olive), not the light Perumnas look.
 * Lead form is the shared ContactCTA with its own source so these leads stay
 * separable in the leads table and in the Sheet.
 */
import { useEffect } from 'react'
import { Box, Container, Typography, Stack, Button } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ContactCTA from '../components/ContactCTA'
import { LocalizedLink } from '../lib/localize.js'
import { BRANCHES } from '../data/branches.js'
import {
  FONT, OLIVE_BRIGHT, HAIR, HAIR_SOFT,
  SectionHeading, FaqAccordion, MarkerList,
} from '../components/invest/ui.jsx'
import { copy, links, faqJsonLd, breadcrumbJsonLd, agencyJsonLd } from '../data/persianAgencyContent.mjs'

// Same ids the prerenderer writes, so hydration replaces rather than duplicates.
const FAQ_ID = 'persian-agency-faq-jsonld'
const CRUMB_ID = 'persian-agency-breadcrumb-jsonld'
const ORG_ID = 'persian-agency-org-jsonld'

// Muscat HQ + Tehran. The Russian desk shares the Muscat address (see
// branches.js) and is deliberately not shown as a separate office here.
const OFFICES = BRANCHES.filter((b) => b.code === 'om' || b.code === 'ir')

const OFFICE_FA = {
  om: { city: 'مسقط، عمان', label: 'دفتر مرکزی' },
  ir: { city: 'تهران، ایران', label: 'دفتر منطقه‌ای' },
}

function Card({ title, body }) {
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

function StatCard({ value, label }) {
  return (
    <Box
      sx={{
        border: HAIR, borderRadius: '16px', px: { xs: 2.2, md: 2.8 }, py: { xs: 2, md: 2.6 },
        bgcolor: 'rgba(255,255,255,0.02)',
        backgroundImage: 'radial-gradient(120% 100% at 100% 0%, rgba(140,141,37,0.07) 0%, rgba(0,0,0,0) 60%)',
      }}
    >
      <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
        {value}
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: { xs: 12.5, md: 13.5 }, color: 'rgba(255,255,255,0.55)', mt: 0.6, lineHeight: 1.6 }}>
        {label}
      </Typography>
    </Box>
  )
}

// Address lines carry a \n in branches.js. Rendered as separate lines so the
// Persian Tehran address does not run together, and left as plain text so the
// crawler reads a normal postal address.
function OfficeCard({ branch }) {
  const fa = OFFICE_FA[branch.code]
  return (
    <Box sx={{ border: HAIR, borderRadius: '18px', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.02)', height: '100%' }}>
      <Box sx={{ px: { xs: 2.5, md: 3 }, py: { xs: 2, md: 2.4 }, borderBottom: HAIR_SOFT, bgcolor: 'rgba(140,141,37,0.06)' }}>
        <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 19 }, fontWeight: 600, color: '#fff', lineHeight: 1.45 }}>
          {fa.city}
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: 13, color: OLIVE_BRIGHT, mt: 0.5 }}>
          {fa.label}
        </Typography>
      </Box>
      <Box sx={{ px: { xs: 2.5, md: 3 }, py: { xs: 2, md: 2.4 } }}>
        {branch.address.split('\n').map((line) => (
          <Typography key={line} sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.95 }}>
            {line}
          </Typography>
        ))}
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15 }, color: 'rgba(255,255,255,0.88)', lineHeight: 1.95, mt: 1.4, direction: 'ltr', textAlign: 'right' }}>
          {branch.phone}
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 14.5 }, color: 'rgba(255,255,255,0.6)', lineHeight: 1.95, direction: 'ltr', textAlign: 'right' }}>
          {branch.email}
        </Typography>
      </Box>
    </Box>
  )
}

export default function PersianAgencyPage() {
  // FAQPage + BreadcrumbList + the Persian face of the organization node. All
  // three are also written into the static shell and all three reuse that
  // shell's ids, so hydration replaces instead of duplicating. Removed on
  // unmount like every other page-scoped JSON-LD on this site.
  useEffect(() => {
    const nodes = [
      [FAQ_ID, faqJsonLd()],
      [CRUMB_ID, breadcrumbJsonLd()],
      [ORG_ID, agencyJsonLd()],
    ].map(([id, data]) => {
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

        {/* The extractable paragraph. Keep it first and keep it whole. */}
        <Box
          sx={{
            mt: { xs: 3, md: 4 }, maxWidth: 860, border: HAIR, borderRadius: '16px',
            borderInlineStartWidth: 3, borderInlineStartColor: OLIVE_BRIGHT,
            bgcolor: 'rgba(140,141,37,0.06)', px: { xs: 2.4, md: 3.2 }, py: { xs: 2, md: 2.6 },
          }}
        >
          <Typography sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.14em', color: OLIVE_BRIGHT, mb: 1 }}>
            {copy.answerLabel}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.88)', lineHeight: 2 }}>
            {copy.answer}
          </Typography>
        </Box>

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
            href="#persian-agency-form"
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

      {/* Who we are. The section that fixes the category problem. */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.whoTitle} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 2, mb: { xs: 3.5, md: 5 }, maxWidth: 860 }}>
          {copy.whoIntro}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
          {copy.who.map((w) => <Card key={w.title} {...w} />)}
        </Box>
      </Container>

      {/* What the desk actually does */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading title={copy.servicesTitle} />
        <Box sx={{ maxWidth: 880 }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 2, mb: 3 }}>
            {copy.servicesIntro}
          </Typography>
          <MarkerList items={copy.services} />
        </Box>
      </Container>

      {/* How to choose an agency. Category content, and it applies to us too. */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading title={copy.chooseTitle} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 2, mb: { xs: 3.5, md: 5 }, maxWidth: 860 }}>
          {copy.chooseIntro}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 } }}>
          {copy.choose.map((c) => <Card key={c.title} {...c} />)}
        </Box>
      </Container>

      {/* Offices. A real address is the single strongest trust signal here. */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 14 } }}>
        <SectionHeading title={copy.officesTitle} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
          {OFFICES.map((b) => <OfficeCard key={b.code} branch={b} />)}
        </Box>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 13.5 }, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, mt: 2.5, maxWidth: 860 }}>
          {copy.officesNote}
        </Typography>
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
            <LocalizedLink key={l.href} to={l.href} style={{ textDecoration: 'none' }}>
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
      <Box id="persian-agency-form" sx={{ mt: { xs: 8, md: 14 } }}>
        <ContactCTA source="persian_agency" />
      </Box>
    </Box>
  )
}
