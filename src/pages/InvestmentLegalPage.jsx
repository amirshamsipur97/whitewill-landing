/**
 * InvestmentLegalPage — /investment/legal
 * («الزامات قانونی دریافت وام، تامین مالی و خدمات بانکی در عمان»)
 *
 * PERSIAN-ONLY legal/compliance reference, linked from /investment. Same visual
 * language (Peyda, olive accent, RTL). Content: src/data/investmentLegalFa.js.
 */

import { Box, Container, Typography, Stack, Button } from '@mui/material'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined'
import ContactCTA from '../components/ContactCTA'
import { FONT, OLIVE, OLIVE_BRIGHT, HAIR, HAIR_SOFT, SectionHeading, MarkerList, Chips, FaqAccordion } from '../components/invest/ui'
import C from '../data/investmentLegalFa'

const card = { border: HAIR, borderRadius: '16px', p: { xs: 3, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.02)' }
const band = { borderTop: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }

// A grid of {title, body} cards.
function CardGrid({ items, cols = 3 }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: `repeat(${cols}, 1fr)` }, gap: { xs: 2.5, md: 3 } }}>
      {items.map((it) => (
        <Box key={it.title} sx={card}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 19 }, fontWeight: 600, color: OLIVE_BRIGHT, mb: 1 }}>{it.title}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.9 }}>{it.body}</Typography>
        </Box>
      ))}
    </Box>
  )
}

function Lead({ children }) {
  return <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15.5, md: 17 }, color: 'rgba(255,255,255,0.74)', maxWidth: 920, mt: -1.5, mb: { xs: 4, md: 5 }, lineHeight: 1.9 }}>{children}</Typography>
}

export default function InvestmentLegalPage() {
  const scrollToContact = () => document.getElementById('legal-contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Box dir="rtl" sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, textAlign: 'right' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', minHeight: { xs: 440, md: 580 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Box component="img" src="/peninsula.jpg" alt="الزامات قانونی بانکی در عمان" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.9) 100%)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', pb: { xs: 6, md: 9 }, pt: { xs: 12, md: 16 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 15 }, fontWeight: 700, letterSpacing: '0.12em', color: OLIVE_BRIGHT, mb: 2 }}>{C.hero.eyebrow}</Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 30, sm: 42, md: 58 }, lineHeight: 1.2, maxWidth: 980, mb: 2.5 }}>{C.hero.title}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 20 }, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, maxWidth: 760, mb: 2 }}>{C.hero.subtitle}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.9, maxWidth: 760, mb: 3.5 }}>{C.hero.intro}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mb: 4 }}>
            {C.hero.benefits.map((b) => (
              <Box key={b} sx={{ px: 1.8, py: 0.7, borderRadius: '999px', border: `1px solid ${OLIVE_BRIGHT}55`, bgcolor: 'rgba(140,141,37,0.12)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13, md: 14 }, color: '#e9eac0' }}>{b}</Typography>
              </Box>
            ))}
          </Box>
          <Button onClick={scrollToContact} endIcon={<ArrowBackRoundedIcon />} sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, textTransform: 'none', fontSize: 16, px: 3.5, py: 1.4, borderRadius: '12px', '&:hover': { bgcolor: OLIVE } }}>{C.hero.cta}</Button>
        </Container>
      </Box>

      {/* ── 1. Regulatory authorities ────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.authorities.eyebrow} title={C.authorities.title} />
        <Lead>{C.authorities.intro}</Lead>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2.5, md: 3 } }}>
          {C.authorities.items.map((a) => (
            <Box key={a.name} sx={card}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4, mb: 2 }}>
                <AccountBalanceOutlinedIcon sx={{ fontSize: 26, color: OLIVE_BRIGHT }} />
                <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 19 }, fontWeight: 600, lineHeight: 1.3 }}>{a.name}</Typography>
              </Box>
              {[['نقش', a.role], ['مسئولیت', a.responsibility], ['ارتباط با تامین مالی', a.relevance]].map(([l, v]) => (
                <Box key={l} sx={{ mb: 1.2 }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: OLIVE_BRIGHT, mb: 0.3 }}>{l}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.8 }}>{v}</Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── 2. Loan eligibility + factors ────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.eligibility.eyebrow} title={C.eligibility.title} />
          <Lead>{C.eligibility.intro}</Lead>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 }, mb: { xs: 4, md: 5 } }}>
            {C.eligibility.items.map((e) => (
              <Box key={e.audience} sx={card}>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 18 }, fontWeight: 600, mb: 1.6 }}>{e.audience}</Typography>
                <MarkerList items={e.requirements} />
              </Box>
            ))}
          </Box>
          <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: OLIVE_BRIGHT, mb: 2 }}>عوامل ارزیابی</Typography>
          <CardGrid items={C.eligibility.factors} cols={3} />
        </Container>
      </Box>

      {/* ── 3. KYC ───────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.kyc.eyebrow} title={C.kyc.title} />
        <Lead>{C.kyc.body}</Lead>
        <Box dir="ltr"><Chips items={C.kyc.documents} /></Box>
      </Container>

      {/* ── 4. AML ───────────────────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.aml.eyebrow} title={C.aml.title} />
          <Lead>{C.aml.body}</Lead>
          <CardGrid items={C.aml.points} cols={4} />
        </Container>
      </Box>

      {/* ── 5. UBO ───────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.ubo.eyebrow} title={C.ubo.title} />
        <Lead>{C.ubo.body}</Lead>
        <CardGrid items={C.ubo.points} cols={4} />
      </Container>

      {/* ── 6. Source of funds ───────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.sourceOfFunds.eyebrow} title={C.sourceOfFunds.title} />
          <Lead>{C.sourceOfFunds.intro}</Lead>
          <Box sx={{ mb: { xs: 3.5, md: 4.5 } }}><CardGrid items={C.sourceOfFunds.sources} cols={3} /></Box>
          <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: OLIVE_BRIGHT, mb: 2 }}>مدارک مورد نیاز</Typography>
          <Box dir="ltr"><Chips items={C.sourceOfFunds.documents} /></Box>
        </Container>
      </Box>

      {/* ── 7. Business loan compliance ──────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.businessLoanCompliance.eyebrow} title={C.businessLoanCompliance.title} />
        <Lead>{C.businessLoanCompliance.intro}</Lead>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, md: 2.5 }, mb: { xs: 3.5, md: 4.5 } }}>
          {C.businessLoanCompliance.types.map((t) => (
            <Box key={t.title} sx={{ border: HAIR, borderRadius: '14px', p: { xs: 2.5, md: 3 }, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <Typography dir="ltr" sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 17.5 }, fontWeight: 600, mb: 0.8, textAlign: 'right' }}>{t.title}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.68)', lineHeight: 1.8 }}>{t.body}</Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: OLIVE_BRIGHT, mb: 2 }}>مدارک مورد نیاز</Typography>
        <Box dir="ltr"><Chips items={C.businessLoanCompliance.documents} /></Box>
      </Container>

      {/* ── 8. Property finance ──────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.propertyFinance.eyebrow} title={C.propertyFinance.title} />
          <Box sx={{ mb: { xs: 3.5, md: 4.5 } }}><CardGrid items={C.propertyFinance.types} cols={3} /></Box>
          <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: OLIVE_BRIGHT, mb: 2 }}>الزامات</Typography>
          <Box dir="ltr"><Chips items={C.propertyFinance.requirements} /></Box>
        </Container>
      </Box>

      {/* ── 9 + 10. Governance + tax ─────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 5, md: 7 } }}>
          <Box>
            <SectionHeading eyebrow={C.corporateGovernance.eyebrow} title={C.corporateGovernance.title} sx={{ mb: { xs: 3, md: 4 } }} />
            {C.corporateGovernance.intro && <Typography sx={{ fontFamily: FONT, fontSize: 15, color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.9 }}>{C.corporateGovernance.intro}</Typography>}
            <Box dir="ltr"><Chips items={C.corporateGovernance.items} /></Box>
          </Box>
          <Box>
            <SectionHeading eyebrow={C.taxCompliance.eyebrow} title={C.taxCompliance.title} sx={{ mb: { xs: 3, md: 4 } }} />
            <Typography sx={{ fontFamily: FONT, fontSize: 15, color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.9 }}>{C.taxCompliance.body}</Typography>
            <Stack spacing={1.5}>
              {C.taxCompliance.items.map((t) => (
                <Box key={t.title} sx={{ border: HAIR_SOFT, borderRadius: '12px', p: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <Typography dir="ltr" sx={{ fontFamily: FONT, fontSize: 15.5, fontWeight: 600, color: OLIVE_BRIGHT, mb: 0.3, textAlign: 'right' }}>{t.title}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: 14, color: 'rgba(255,255,255,0.68)', lineHeight: 1.8 }}>{t.body}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* ── 11. Rejection reasons ────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.rejectionReasons.eyebrow} title={C.rejectionReasons.title} />
          <Lead>{C.rejectionReasons.intro}</Lead>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 1.5, md: 2 } }}>
            {C.rejectionReasons.items.map((r, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', border: HAIR_SOFT, borderRadius: '12px', px: 2, py: 1.6, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#c9a23a', mt: '2px', flexShrink: 0 }} />
                <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>{r}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── 12. Readiness checklist ──────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow={C.readinessChecklist.eyebrow} title={C.readinessChecklist.title} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {C.readinessChecklist.groups.map((g) => (
            <Box key={g.audience} sx={card}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                <ChecklistRtlOutlinedIcon sx={{ fontSize: 24, color: OLIVE_BRIGHT }} />
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 18 }, fontWeight: 600 }}>{g.audience}</Typography>
              </Box>
              <MarkerList items={g.items} />
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── 13. FAQ ──────────────────────────────────────────────────── */}
      <Box sx={band}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionHeading eyebrow={C.faq.eyebrow} title={C.faq.title} />
          <FaqAccordion items={C.faq.items} />
        </Container>
      </Box>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(140,141,37,0.35)', px: { xs: 3, md: 8 }, py: { xs: 6, md: 9 }, textAlign: 'center', bgcolor: 'rgba(13,13,15,0.6)', backgroundImage: 'radial-gradient(100% 120% at 50% 0%, rgba(140,141,37,0.22) 0%, rgba(0,0,0,0) 70%)' }}>
          <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 26, md: 46 }, lineHeight: 1.25, color: '#fff', maxWidth: 880, mx: 'auto', mb: 2.5 }}>{C.cta.headline}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 760, mx: 'auto', mb: 4 }}>{C.cta.subheadline}</Typography>
          <Button onClick={scrollToContact} endIcon={<ArrowBackRoundedIcon />} sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, textTransform: 'none', fontSize: { xs: 16, md: 17 }, px: 4, py: 1.5, borderRadius: '12px', '&:hover': { bgcolor: OLIVE } }}>{C.cta.cta}</Button>
        </Box>
      </Container>

      <Box id="legal-contact"><ContactCTA source="investment_legal_contact" /></Box>
    </Box>
  )
}
