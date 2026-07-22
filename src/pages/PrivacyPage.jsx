/**
 * PrivacyPage — /privacy. Required for ad platform compliance: Meta (Facebook/
 * Instagram) ad review and lead campaigns expect a working privacy policy URL,
 * and Google Ads quality checks look for one too. English-only body (the legal
 * reference language); heading strings follow the site language.
 */
import { Box, Container, Typography } from '@mui/material'
import { useI18n } from '../i18n.jsx'
import { FONT, OLIVE_BRIGHT } from '../components/invest/ui.jsx'

const TITLES = {
  en: 'Privacy Policy',
  ru: 'Политика конфиденциальности',
  ar: 'سياسة الخصوصية',
  fa: 'سیاست حریم خصوصی',
}

const SECTIONS = [
  {
    h: '1. Who we are',
    p: 'Irfan Investment Group ("we", "our") is a real estate brokerage and business setup advisory registered in the Sultanate of Oman, operating the website www.irfaninvest.com. Contact: muscat@irfaninvest.com, +968 766 44000, Unit 617, 6th floor, Al Ghubrah St, Muscat, Oman.',
  },
  {
    h: '2. Information we collect',
    p: 'When you submit a form, chat with our AI assistant, or request a consultation, we collect the details you provide: name, phone number (with country code), email address, your message, and the language and page you used. Our systems also record standard technical data such as pages visited, approximate location derived from IP, device type and referral source.',
  },
  {
    h: '3. How we use your information',
    p: 'We use your contact details to respond to your enquiry, arrange consultations and property viewings, and send information about projects and services you asked about. Technical and usage data helps us improve the website, measure marketing performance and understand which content is useful.',
  },
  {
    h: '4. Analytics and advertising tools',
    p: 'The site uses Google Analytics 4 and Google Ads conversion tracking, and may use the Meta (Facebook) Pixel, to measure visits and the performance of our advertising on Google, Facebook and Instagram. These tools use cookies and similar identifiers and may process your IP address and page interactions. You can limit ad personalisation in your Google and Meta account settings, and control cookies in your browser settings.',
  },
  {
    h: '5. Sharing',
    p: 'We share lead details only with our own consultants and, where needed to serve you, with the developer of a project you asked about. We use trusted processors to run the website and store enquiries (including Supabase, Google Workspace and hosting providers). We never sell your personal data.',
  },
  {
    h: '6. Retention and your rights',
    p: 'We keep enquiry data for as long as needed to serve you and meet legal obligations. You may request access to, correction of, or deletion of your personal data at any time by writing to muscat@irfaninvest.com. We will respond within a reasonable period.',
  },
  {
    h: '7. Updates',
    p: 'We may update this policy as our services or legal requirements change. The latest version is always available at this address. Last updated: July 2026.',
  },
]

export default function PrivacyPage() {
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
