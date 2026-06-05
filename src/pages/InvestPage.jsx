/**
 * InvestPage — /invest
 *
 * "Company Registration & Investment in Oman" — a comprehensive, multilingual
 * content/service landing page in the site's visual language (Arsenal SC type,
 * olive accent, #000 canvas, shared ContactCTA lead form).
 *
 * COPY IS LANGUAGE-DRIVEN: the active language comes from useI18n(); content
 * lives in src/data/invest/{en,ru,ar}.js (same shape — see en.js). Arabic
 * renders right-to-left via the app's RTL provider. Figures are verified
 * against current (2025–2026) Omani regulations (see the data file header).
 */

import { Box, Container, Typography, Stack, Button } from '@mui/material'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ContactCTA from '../components/ContactCTA'
import InvestEntityCards from '../components/InvestEntityCards'
import { useI18n } from '../i18n'
import { getInvestContent } from '../data/investContent'

const OLIVE = '#7c7856'
const OLIVE_BRIGHT = '#8c8d25'
const FONT = '"Arsenal SC", "Inter", system-ui, sans-serif'
const HAIR = '1px solid rgba(255,255,255,0.1)'
const HAIR_SOFT = '1px solid rgba(255,255,255,0.08)'

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

// A two-column "definition" table (left label, right value), hairline rows.
function DefTable({ rows, left, right, leftKey, rightKey }) {
  return (
    <Box sx={{ border: HAIR, borderRadius: '16px', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.02)' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1.3fr' }, px: { xs: 2.5, md: 3.5 }, py: 2, borderBottom: HAIR, bgcolor: 'rgba(255,255,255,0.03)' }}>
        <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: OLIVE_BRIGHT }}>{left}</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: OLIVE_BRIGHT, display: { xs: 'none', sm: 'block' } }}>{right}</Typography>
      </Box>
      {rows.map((r, i) => (
        <Box key={i} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1.3fr' }, gap: { xs: 0.5, sm: 2 }, px: { xs: 2.5, md: 3.5 }, py: { xs: 2, md: 2.4 }, borderTop: i === 0 ? 'none' : HAIR_SOFT }}>
          <Box>
            <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 17 }, fontWeight: 600, color: '#fff', lineHeight: 1.35 }}>{r[leftKey]}</Typography>
            {r.ref && r.ref !== '—' && (
              <Typography sx={{ fontFamily: FONT, fontSize: 13, color: OLIVE_BRIGHT, mt: 0.3 }}>{r.ref}</Typography>
            )}
          </Box>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>{r[rightKey]}</Typography>
        </Box>
      ))}
    </Box>
  )
}

// Bulleted list with a tinted marker.
function MarkerList({ items, color = OLIVE_BRIGHT, icon: Icon }) {
  return (
    <Stack spacing={1}>
      {items.map((it, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start' }}>
          {Icon ? (
            <Icon sx={{ fontSize: 18, color, mt: '2px', flexShrink: 0 }} />
          ) : (
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: color, mt: '9px', flexShrink: 0 }} />
          )}
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15 }, color: 'rgba(255,255,255,0.74)', lineHeight: 1.55 }}>{it}</Typography>
        </Box>
      ))}
    </Stack>
  )
}

export default function InvestPage() {
  const { lang } = useI18n()
  const C = getInvestContent(lang)
  const H = C.headings
  const TH = C.tableHeads

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
            {C.hero.eyebrow}
          </Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 36, sm: 48, md: 68 }, lineHeight: 1.04, letterSpacing: '-0.02em', maxWidth: 900, mb: 2.5 }}>
            {C.hero.title}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: 680, mb: 4 }}>
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

      {/* ── Intro + headline stats ───────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 24 }, lineHeight: 1.6, color: 'rgba(255,255,255,0.86)', maxWidth: 920 }}>
          {C.intro}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 3, md: 4 }, mt: { xs: 5, md: 7 } }}>
          {C.whyOman.map((w) => (
            <Box key={w.label}>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 30, md: 44 }, fontWeight: 700, color: OLIVE_BRIGHT, lineHeight: 1 }}>{w.stat}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.72)', mt: 1, lineHeight: 1.45 }}>{w.label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Legal framework ──────────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={H.legal.eyebrow} title={H.legal.title} />
          <DefTable rows={C.laws} left={TH.law} right={TH.purpose} leftKey="law" rightKey="purpose" />
          <Typography sx={{ fontFamily: FONT, fontSize: 14, color: 'rgba(255,255,255,0.5)', mt: 2.5, maxWidth: 920, lineHeight: 1.6 }}>
            {H.legalNote}
          </Typography>
        </Container>
      </Box>

      {/* ── Government authorities ────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={H.authorities.eyebrow} title={H.authorities.title} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 } }}>
          {C.authorities.map((a) => (
            <Box key={a.name} sx={{ border: HAIR, borderRadius: '16px', p: { xs: 2.5, md: 3 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <AccountBalanceOutlinedIcon sx={{ fontSize: 26, color: OLIVE_BRIGHT, mb: 1.2 }} />
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 17 }, fontWeight: 600, lineHeight: 1.3, mb: 0.8 }}>{a.name}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.68)', lineHeight: 1.5 }}>{a.fn}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Foreign ownership rules ───────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, borderBottom: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={H.ownership.eyebrow} title={H.ownership.title} />
          <DefTable rows={C.ownershipRules} left={TH.item} right={TH.status} leftKey="item" rightKey="status" />
        </Container>
      </Box>

      {/* ── Business entities (premium 4-card) ───────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={H.entities.eyebrow} title={H.entities.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.6)', maxWidth: 760, mt: -1.5, mb: { xs: 4, md: 5 }, lineHeight: 1.6 }}>
          {H.entitiesIntro}
        </Typography>
        <InvestEntityCards entities={C.entities} labels={C.entityLabels} />
      </Container>

      {/* ── Entity comparison table ──────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, borderBottom: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={H.comparison.eyebrow} title={H.comparison.title} />
          <Box sx={{ overflowX: 'auto', border: HAIR, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.02)' }}>
            <Box sx={{ minWidth: 860 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1.1fr repeat(6, 1fr)', px: { xs: 2, md: 3 }, py: 2, borderBottom: HAIR, bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: OLIVE_BRIGHT }}>{TH.entity}</Typography>
                {C.comparison.columns.map((c) => (
                  <Typography key={c} sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: OLIVE_BRIGHT }}>{c}</Typography>
                ))}
              </Box>
              {C.comparison.rows.map((r, i) => (
                <Box key={r.entity} sx={{ display: 'grid', gridTemplateColumns: '1.1fr repeat(6, 1fr)', px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.4 }, borderTop: i === 0 ? 'none' : HAIR_SOFT, alignItems: 'center' }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 16 }, fontWeight: 700, color: '#fff' }}>{r.entity}</Typography>
                  {r.cells.map((cell, j) => (
                    <Typography key={j} sx={{ fontFamily: FONT, fontSize: { xs: 13.5, md: 14.5 }, color: 'rgba(255,255,255,0.74)', lineHeight: 1.4, pr: 1.5 }}>{cell}</Typography>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Recommended structure by business type ───────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={H.recommended.eyebrow} title={H.recommended.title} />
        <DefTable rows={C.recommended} left={TH.businessType} right={TH.recommended} leftKey="type" rightKey="structure" />
      </Container>

      {/* ── Registration process ─────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={H.process.eyebrow} title={H.process.title} />
          <Stack spacing={0}>
            {C.steps.map((step, i) => (
              <Box key={step.title} sx={{ display: 'grid', gridTemplateColumns: { xs: '40px 1fr', md: '64px 1fr' }, gap: { xs: 2, md: 4 }, alignItems: 'start', py: { xs: 2.5, md: 3.5 }, borderTop: i === 0 ? 'none' : HAIR_SOFT }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 22, md: 34 }, fontWeight: 700, color: 'rgba(140,141,37,0.5)' }}>
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: 19, md: 24 }, fontWeight: 600, mb: 0.5 }}>{step.title}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16 }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 760 }}>{step.body}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── Post-registration ─────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={H.postReg.eyebrow} title={H.postReg.title} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {C.postReg.map((p) => (
            <Box key={p.title} sx={{ border: HAIR, borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <VerifiedOutlinedIcon sx={{ fontSize: 26, color: OLIVE_BRIGHT, mb: 1.2 }} />
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 19 }, fontWeight: 600, mb: 0.8 }}>{p.title}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>{p.body}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Tax & compliance ─────────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, borderBottom: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={H.tax.eyebrow} title={H.tax.title} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 } }}>
            {C.tax.map((t) => (
              <Box key={t.title} sx={{ border: HAIR, borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 38, md: 46 }, fontWeight: 700, color: OLIVE_BRIGHT, lineHeight: 1, mb: 1 }}>{t.rate}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 17 }, fontWeight: 600, mb: 0.6, lineHeight: 1.25 }}>{t.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 14, color: 'rgba(255,255,255,0.66)', lineHeight: 1.5 }}>{t.body}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Documents + timeline ─────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: { xs: 5, md: 7 } }}>
          <Box>
            <SectionHeading eyebrow={H.docs.eyebrow} title={H.docs.title} sx={{ mb: { xs: 3, md: 4 } }} />
            <Stack spacing={3}>
              {C.docs.map((d) => (
                <Box key={d.group}>
                  <Typography sx={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: OLIVE_BRIGHT, mb: 1.4 }}>{d.group}</Typography>
                  <MarkerList items={d.items} icon={CheckCircleOutlineRoundedIcon} />
                </Box>
              ))}
            </Stack>
            <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.5)', mt: 3, lineHeight: 1.6 }}>
              {H.docsNote}
            </Typography>
          </Box>
          <Box>
            <SectionHeading eyebrow={H.timeline.eyebrow} title={H.timeline.title} sx={{ mb: { xs: 3, md: 4 } }} />
            <Stack spacing={0}>
              {C.timeline.map((t, i) => (
                <Box key={t.process} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, py: 2.2, borderTop: i === 0 ? 'none' : HAIR_SOFT }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15.5, md: 16.5 }, color: 'rgba(255,255,255,0.82)' }}>{t.process}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15.5 }, fontWeight: 600, color: OLIVE_BRIGHT, whiteSpace: 'nowrap' }}>{t.time}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* ── Popular activities ───────────────────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={H.activities.eyebrow} title={H.activities.title} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.2, md: 1.5 } }}>
            {C.activities.map((a) => (
              <Box key={a} sx={{ px: 2.2, py: 1.1, borderRadius: '999px', border: HAIR, bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.8)' }}>{a}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Compliance documents to maintain ─────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={H.maintain.eyebrow} title={H.maintain.title} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {C.maintain.map((m) => (
            <Box key={m.group} sx={{ border: HAIR, borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <GavelOutlinedIcon sx={{ fontSize: 24, color: OLIVE_BRIGHT, mb: 1.2 }} />
              <Typography sx={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, mb: 1.6 }}>{m.group}</Typography>
              <MarkerList items={m.items} />
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── Why foreign investors choose Oman ────────────────────────── */}
      <Box sx={{ borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={H.whyInvest.eyebrow} title={H.whyInvest.title} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
            {C.whyInvest.map((w) => (
              <Box key={w.title} sx={{ border: HAIR, borderRadius: '18px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)', backgroundImage: 'radial-gradient(120% 80% at 50% 0%, rgba(140,141,37,0.08) 0%, rgba(0,0,0,0) 72%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1.2 }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: 34, md: 44 }, fontWeight: 700, color: OLIVE_BRIGHT, lineHeight: 1 }}>{w.stat}</Typography>
                  {w.statSuffix && <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{w.statSuffix}</Typography>}
                </Box>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 18, md: 20 }, fontWeight: 600, mb: 0.8 }}>{w.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>{w.body}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Premium closing CTA ──────────────────────────────────────── */}
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
          <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 30, md: 50 }, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#fff', maxWidth: 820, mx: 'auto', mb: 2.5 }}>
            {C.cta.headline}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, maxWidth: 640, mx: 'auto', mb: 4 }}>
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
      <Box id="invest-contact">
        <ContactCTA source="invest_contact" />
      </Box>
    </Box>
  )
}
