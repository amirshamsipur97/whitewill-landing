/**
 * TermsPage — /terms. Mirrors PrivacyPage exactly: English-only body (the legal
 * reference language), heading in the site language.
 *
 * WHY IT EXISTS: /terms answered 404 while /privacy did not, and a missing
 * terms page is one of the things trust scanners such as ScamAdviser weigh when
 * they rate a young domain. It matters more than usual right now because the
 * outbound campaign sends cold messages to people who will look the company up
 * before replying.
 *
 * The substance is deliberately narrow and true: what this site is, what it is
 * not, and where the authoritative numbers come from. It makes no promise the
 * business cannot keep. Have a lawyer read it before relying on it in a
 * dispute; it is written to be honest, not to be a substitute for advice.
 */
import { Box, Container, Typography } from '@mui/material'
import { useI18n } from '../i18n.jsx'
import { FONT, OLIVE_BRIGHT } from '../components/invest/ui.jsx'

const TITLES = {
  en: 'Terms of Use',
  ru: 'Условия использования',
  ar: 'شروط الاستخدام',
  fa: 'شرایط استفاده',
}

const SECTIONS = [
  {
    h: '1. Who we are',
    p: 'Irfan Investment Group ("we", "our") is a real estate brokerage and business setup advisory registered in the Sultanate of Oman, operating the website www.irfaninvest.com. Our head office is Unit 617, 6th floor, office 1991, Al Ghubrah St, Muscat, Oman. You can reach us at muscat@irfaninvest.com or +968 766 44000.',
  },
  {
    h: '2. What this website is',
    p: 'This website presents property available through us in Oman, together with guidance on ownership, residency and company formation. We act as a broker and advisor introducing buyers to developers. We are not the developer of the projects listed here unless a page says so explicitly.',
  },
  {
    h: '3. Listings, prices and availability',
    p: 'Prices, unit availability, floor areas, payment plans and handover dates are supplied by the developers and change without notice. We refresh them from developer inventory files as those files reach us, and a listing can be sold or repriced between one refresh and the next. Nothing on this site is an offer capable of acceptance, and no figure here forms part of a contract. Confirm every commercial term in writing with us before you commit to anything.',
  },
  {
    h: '4. Areas, sizes and images',
    p: 'Stated areas follow the developer\'s own measurement basis, which differs between projects: some quote a sellable or built-up area, others add covered terraces or open terraces. Where we know the basis, we state it. Renders, floor plans and photographs are illustrative and are provided by the developer; finishes and views may differ from the final build.',
  },
  {
    h: '5. Ownership and residency information',
    p: 'Foreign ownership in Oman is permitted inside designated zones, principally Integrated Tourism Complexes and the approved future cities, and residency linked to property is granted by the relevant Omani authorities on their own criteria. We describe these rules as we understand them at the time of writing and update the site as they change. We do not decide applications and cannot guarantee any authority\'s outcome.',
  },
  {
    h: '6. Not financial or legal advice',
    p: 'Nothing here is financial, tax, investment or legal advice, and no yield, return or capital appreciation is promised. Property values can fall as well as rise. Take independent advice before you buy.',
  },
  {
    h: '7. Enquiries and communication',
    p: 'When you submit a form, use the chat assistant or ask for a consultation, you are asking us to contact you about that enquiry, by phone, WhatsApp or email. You can ask us to stop at any time and we will. How we handle your data is set out in our Privacy Policy.',
  },
  {
    h: '8. Intellectual property',
    p: 'The text, layout, data compilations and original imagery on this site belong to Irfan Investment Group. Developer renders, logos and brand names belong to their owners and appear here to describe the projects we represent. You may quote or link to our pages with attribution; do not republish substantial parts of the site as your own.',
  },
  {
    h: '9. Third party links',
    p: 'We link to developers, government pages and other external sites for reference. We do not control them and are not responsible for their content or their handling of your data.',
  },
  {
    h: '10. Availability of the site',
    p: 'We aim to keep the site accurate and available but do not guarantee uninterrupted access, and we may change or withdraw any part of it. Where the law allows, we are not liable for indirect or consequential loss arising from use of the site. Nothing here limits liability for fraud or for anything that cannot lawfully be limited.',
  },
  {
    h: '11. Governing law',
    p: 'These terms are governed by the laws of the Sultanate of Oman, and the Omani courts have jurisdiction over any dispute arising from them.',
  },
  {
    h: '12. Updates',
    p: 'We may revise these terms as our services or the applicable rules change. The current version always lives at this address. Last updated: August 2026.',
  },
]

export default function TermsPage() {
  const { lang } = useI18n()
  const rtl = lang === 'ar' || lang === 'fa'

  return (
    <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ bgcolor: '#000', color: '#fff', minHeight: '80vh',
      background: 'radial-gradient(70% 40% at 50% 0%, rgba(140,141,37,0.1) 0%, rgba(0,0,0,0) 60%), #000' }}>
      <Container maxWidth="md" sx={{ py: { xs: 12, md: 16 } }}>
        <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 30, md: 42 }, color: OLIVE_BRIGHT, mb: 5 }}>
          {TITLES[lang] || TITLES.en}
        </Typography>
        <Box dir="ltr" sx={{ textAlign: 'left' }}>
          {SECTIONS.map((s) => (
            <Box key={s.h} sx={{ mb: 4 }}>
              <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 600, fontSize: { xs: 17, md: 19 }, mb: 1.2 }}>{s.h}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15.5 }, lineHeight: 1.8, color: 'rgba(255,255,255,0.72)' }}>{s.p}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
