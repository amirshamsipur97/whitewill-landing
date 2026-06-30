/**
 * NotFoundPage — rendered for any unmatched route (App.jsx catch-all).
 * Replaces the old behaviour of rendering the homepage for unknown URLs,
 * which made every legacy/junk URL look like a duplicate of the homepage in
 * Google. SeoManager emits `noindex` for unknown paths, so this page is never
 * indexed; legacy URLs with a real new home are 301'd at the edge (vercel.json)
 * before they ever reach React.
 */
import { Box, Container, Typography, Stack } from '@mui/material'
import { LocalizedLink as RouterLink } from '../lib/localize.js'
import { useI18n } from '../i18n.jsx'
import { FONT, OLIVE_BRIGHT, HAIR } from '../components/invest/ui.jsx'

const COPY = {
  en: { code: '404', title: 'Page not found', body: 'The page you were looking for has moved or no longer exists.', cta: 'Back to home', links: 'Popular pages' },
  ru: { code: '404', title: 'Страница не найдена', body: 'Запрошенная страница была перемещена или больше не существует.', cta: 'На главную', links: 'Популярные страницы' },
  ar: { code: '404', title: 'الصفحة غير موجودة', body: 'الصفحة التي تبحث عنها قد نُقلت أو لم تعد موجودة.', cta: 'العودة إلى الرئيسية', links: 'صفحات مهمة' },
  fa: { code: '404', title: 'صفحه پیدا نشد', body: 'صفحه‌ای که دنبالش بودید جابه‌جا شده یا دیگر وجود ندارد.', cta: 'بازگشت به خانه', links: 'صفحات پرکاربرد' },
}

const QUICK_LINKS = [
  { to: '/buy', label: 'Buy' },
  { to: '/invest', label: 'Company Registration' },
  { to: '/insights', label: 'Insights' },
  { to: '/about', label: 'About' },
]

export default function NotFoundPage() {
  const { lang } = useI18n()
  const rtl = lang === 'ar' || lang === 'fa'
  const c = COPY[lang] || COPY.en

  return (
    <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ bgcolor: '#000', color: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center',
      background: 'radial-gradient(70% 60% at 50% 0%, rgba(140,141,37,0.1) 0%, rgba(0,0,0,0) 60%), #000' }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: { xs: 12, md: 16 } }}>
        <Typography sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 64, md: 96 }, lineHeight: 1, color: OLIVE_BRIGHT }}>{c.code}</Typography>
        <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 26, md: 34 }, mt: 2, mb: 1.5 }}>{c.title}</Typography>
        <Typography sx={{ fontFamily: FONT, color: 'rgba(255,255,255,0.6)', fontSize: { xs: 15, md: 16 }, mb: 4 }}>{c.body}</Typography>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-block', fontFamily: FONT, fontWeight: 700, color: '#0b0b0b', bgcolor: OLIVE_BRIGHT, borderRadius: '10px', px: 3.5, py: 1.3, textDecoration: 'none', '&:hover': { bgcolor: '#a0a12c' } }}>
          {c.cta}
        </Box>
        <Typography sx={{ fontFamily: FONT, fontSize: 12, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', mt: 6, mb: 2 }}>{c.links.toUpperCase()}</Typography>
        <Stack direction="row" spacing={3} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          {QUICK_LINKS.map((l) => (
            <Box key={l.to} component={RouterLink} to={l.to} sx={{ fontFamily: FONT, fontSize: 14, color: OLIVE_BRIGHT, textDecoration: 'none', borderBottom: `1px solid ${OLIVE_BRIGHT}44`, pb: '2px', '&:hover': { borderBottomColor: OLIVE_BRIGHT } }}>
              {l.label}
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
