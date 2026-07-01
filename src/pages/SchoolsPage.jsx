/**
 * SchoolsPage — "International Schools in Oman" (logical path /schools).
 *
 * A premium, fully-localized (en/ru/ar/fa) service page that positions Irfan
 * Investment as the partner who relocates a family completely — including
 * choosing the right international school. It is the flagship landing page of
 * the wider "Education & Family Relocation" hub.
 *
 * Design language matches the sibling advisory/service pages (InvestPage /
 * InvestmentPage): black canvas, olive accent, hair-line borders, the shared
 * invest/ui kit, and the reusable ContactCTA lead form. Direction-aware so it
 * reads LTR for en/ru and RTL (Peyda) for ar/fa.
 *
 * All copy lives in the i18n dict under `schoolsPage` so the four language
 * variants stay in lockstep. Per-page JSON-LD (WebPage + Breadcrumb + Service +
 * EducationalOrganization + FAQ) is injected on mount and cleaned up on unmount.
 */
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Box, Container, Typography, Button, Stack } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import { useI18n } from '../i18n.jsx'
import { LocalizedLink as RouterLink } from '../lib/localize.js'
import { fetchSchools } from '../supabase'
import {
  FONT, OLIVE, OLIVE_BRIGHT, HAIR, HAIR_SOFT,
  SectionHeading, Chips, DocGrid, FaqAccordion,
} from '../components/invest/ui'
import ContactCTA from '../components/ContactCTA'
import SCHOOLS from '../data/schoolsContent'

// Mapbox is heavy (~1MB) — load the schools map lazily.
const SchoolsMap = lazy(() => import('../components/SchoolsMap'))

// Normalise a school name (any language keeps the Latin brand) to a key so
// featured cards can be matched to their Supabase row (logo, website, coords).
function schoolKey(name = '') {
  const n = name.toLowerCase()
  if (/jabal|ma.?rifa/.test(n)) return 'jabal'
  if (/cheltenham/.test(n)) return 'cheltenham'
  // ABA ("American British Academy") must be tested before the plain
  // "british" rule, otherwise it collides with The British School Muscat.
  if (/\baba\b|american british/.test(n)) return 'aba'
  if (/british/.test(n)) return 'british'
  if (/downe/.test(n)) return 'downe'
  if (/amity/.test(n)) return 'amity'
  return null
}

// Short "visit official website" + map heading copy, kept local to the page.
const WEB = {
  en: { visit: 'Official website', mapEyebrow: 'ON THE MAP', mapTitle: 'Where the schools are', mapBody: 'Explore the location of each school across Muscat, just as you would browse our property map, then let us plan your home and commute around your choice.' },
  ru: { visit: 'Официальный сайт', mapEyebrow: 'НА КАРТЕ', mapTitle: 'Где находятся школы', mapBody: 'Изучите расположение каждой школы в Маскате — так же, как на нашей карте недвижимости — а мы спланируем жильё и дорогу вокруг вашего выбора.' },
  ar: { visit: 'الموقع الرسمي', mapEyebrow: 'على الخريطة', mapTitle: 'أين تقع المدارس', mapBody: 'استكشف موقع كل مدرسة في مسقط، تماماً كما تتصفّح خريطة عقاراتنا، ثم دعنا نخطّط لسكنك وطريق تنقّلك حول اختيارك.' },
  fa: { visit: 'وب‌سایت رسمی', mapEyebrow: 'روی نقشه', mapTitle: 'مدارس کجا هستند', mapBody: 'موقعیت هر مدرسه را در مسقط ببینید، درست مثل مرور نقشهٔ املاک ما، سپس بگذارید خانه و مسیر رفت‌وآمد را حول انتخاب شما برنامه‌ریزی کنیم.' },
}

const SITE = 'https://www.irfaninvest.com'
const HERO_IMG = '/images/schools/hero-education.jpg' // education hero (Figma material)
const LIFESTYLE_IMG = '/images/schools/muscat-lifestyle.jpg' // Muscat landmark band
const JABAL_LOGO = '/images/schools/jabal-al-marifa-logo.png'

// "Living in Muscat" band copy (short, kept local to the page).
const LIFESTYLE = {
  en: { eyebrow: 'LIVING IN MUSCAT', title: 'A city your family will love', body: 'Beyond the classroom, Muscat gives families a safe, welcoming home: beaches and mountains, parks and marinas, modern healthcare and a warm international community, all minutes from the leading schools.' },
  ru: { eyebrow: 'ЖИЗНЬ В МАСКАТЕ', title: 'Город, который полюбит ваша семья', body: 'За пределами класса Маскат дарит семьям безопасный и гостеприимный дом: пляжи и горы, парки и марины, современное здравоохранение и тёплое международное сообщество, в нескольких минутах от ведущих школ.' },
  ar: { eyebrow: 'الحياة في مسقط', title: 'مدينة ستحبها عائلتك', body: 'إلى جانب الدراسة، تمنح مسقط العائلات بيتاً آمناً ومرحّباً: شواطئ وجبال، حدائق ومارينا، رعاية صحية حديثة ومجتمع دولي ودود، على بُعد دقائق من أبرز المدارس.' },
  fa: { eyebrow: 'زندگی در مسقط', title: 'شهری که خانواده‌تان دوستش خواهد داشت', body: 'فراتر از کلاس درس، مسقط برای خانواده‌ها خانه‌ای امن و مهمان‌نواز فراهم می‌کند؛ ساحل و کوه، پارک و مارینا، خدمات درمانی مدرن و جامعه‌ای بین‌المللی و گرم، تنها چند دقیقه تا بهترین مدارس.' },
}

// Section wrapper: consistent rhythm + optional hairline-bordered band.
function Section({ children, band = false, id }) {
  const inner = (
    <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
      {children}
    </Container>
  )
  if (!band) return <Box id={id} component="section" data-reveal>{inner}</Box>
  return (
    <Box
      id={id}
      component="section"
      data-reveal
      sx={{ borderTop: HAIR_SOFT, borderBottom: HAIR_SOFT, bgcolor: 'rgba(255,255,255,0.015)' }}
    >
      {inner}
    </Box>
  )
}

// Generic premium card shell (olive radial wash + lift on hover).
const cardSx = {
  border: HAIR,
  borderRadius: '16px',
  p: { xs: 2.5, md: 3 },
  bgcolor: 'rgba(255,255,255,0.02)',
  backgroundImage: 'radial-gradient(120% 100% at 0% 0%, rgba(140,141,37,0.06) 0%, rgba(0,0,0,0) 60%)',
  transition: 'border-color .2s, transform .2s',
  '&:hover': { borderColor: 'rgba(140,141,37,0.45)', transform: 'translateY(-3px)' },
  height: '100%',
}

export default function SchoolsPage() {
  const { lang } = useI18n()
  const S = SCHOOLS[lang] || SCHOOLS.en
  const isRTL = lang === 'ar' || lang === 'fa'
  const dir = isRTL ? 'rtl' : 'ltr'
  const LF = LIFESTYLE[lang] || LIFESTYLE.en
  const W = WEB[lang] || WEB.en
  const rootRef = useRef(null)

  // Featured-school location/website/logo data (Supabase `schools` table).
  const [schools, setSchools] = useState([])
  useEffect(() => {
    let alive = true
    fetchSchools().then((rows) => { if (alive) setSchools(rows) }).catch(() => {})
    return () => { alive = false }
  }, [])
  const schoolByKey = {}
  for (const s of schools) { const k = schoolKey(s.name); if (k) schoolByKey[k] = s }

  const scrollToContact = () =>
    document.getElementById('schools-contact')?.scrollIntoView({ behavior: 'smooth' })

  // ── GSAP scroll-reveal for below-hero sections ──────────────────────────
  // The hero stays untouched (keeps LCP fast and content crawlable). Sections
  // gently fade/slide up as they enter. gsap.context scopes the selector to
  // this page and reverts cleanly on unmount, so no ScrollTriggers or
  // pin-spacers leak across route changes.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 32,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [lang])

  // ── Per-page structured data (localized) ────────────────────────────────
  useEffect(() => {
    const url = `${SITE}${lang === 'en' ? '' : '/' + lang}/schools`
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: S.metaTitle,
          description: S.metaDesc,
          inLanguage: lang,
          isPartOf: { '@id': `${SITE}/#website` },
          about: { '@id': `${url}#service` },
          breadcrumb: { '@id': `${url}#breadcrumb` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: S.breadcrumb.home, item: `${SITE}${lang === 'en' ? '/' : '/' + lang}` },
            { '@type': 'ListItem', position: 2, name: S.breadcrumb.label, item: url },
          ],
        },
        {
          '@type': ['Service', 'EducationalOrganization'],
          '@id': `${url}#service`,
          name: S.schema.serviceName,
          description: S.metaDesc,
          url,
          inLanguage: lang,
          areaServed: { '@type': 'Country', name: 'Oman' },
          provider: { '@id': `${SITE}/#organization` },
          serviceType: S.schema.serviceType,
        },
        {
          '@type': 'ItemList',
          '@id': `${url}#schools`,
          name: S.featured.title,
          itemListElement: (S.featured.cards || []).map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'EducationalOrganization',
              name: c.name,
              address: { '@type': 'PostalAddress', addressLocality: c.locality || 'Muscat', addressCountry: 'OM' },
            },
          })),
        },
        {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: (S.faq.items || []).map((it) => ({
            '@type': 'Question',
            name: it.q,
            acceptedAnswer: { '@type': 'Answer', text: it.a },
          })),
        },
      ],
    }
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-schools-schema', '1')
    el.textContent = JSON.stringify(graph)
    document.head.appendChild(el)
    return () => { el.remove() }
  }, [lang, S])

  const textAlign = isRTL ? 'right' : 'left'

  return (
    <Box ref={rootRef} dir={dir} sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, textAlign, overflowX: 'hidden' }}>
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ pt: { xs: 11, md: 13 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Box component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13, '&:hover': { color: '#fff' } }}>
            {S.breadcrumb.home}
          </Box>
          <Box sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, transform: isRTL ? 'scaleX(-1)' : 'none' }}>/</Box>
          <Box sx={{ color: OLIVE_BRIGHT, fontSize: 13 }}>{S.breadcrumb.label}</Box>
        </Stack>
      </Container>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', minHeight: { xs: 520, md: 660 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden', mt: { xs: 2, md: 3 } }}>
        <Box
          component="img"
          src={HERO_IMG}
          alt={S.hero.imageAlt}
          loading="eager"
          fetchpriority="high"
          width="1920"
          height="1080"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.42)' }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.85) 100%)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', pb: { xs: 6, md: 9 }, pt: { xs: 12, md: 16 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: OLIVE_BRIGHT, mb: 2 }}>
            {S.hero.eyebrow}
          </Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 34, md: 60 }, lineHeight: 1.08, letterSpacing: '-0.02em', maxWidth: 980, mb: 1 }}>
            {S.hero.title}
            <Box component="span" sx={{ display: 'block', color: OLIVE_BRIGHT, fontWeight: 400 }}>{S.hero.titleAccent}</Box>
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.82)', maxWidth: 720, lineHeight: 1.7, mt: 2.5 }}>
            {S.hero.subtitle}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.8} sx={{ mt: { xs: 3.5, md: 4.5 } }}>
            <Button
              onClick={scrollToContact}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon sx={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />}
              sx={{ bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 600, px: 3.5, py: 1.5, borderRadius: '10px', '&:hover': { bgcolor: OLIVE } }}
            >
              {S.hero.ctaPrimary}
            </Button>
            <Button
              component={RouterLink}
              to="/insights"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontFamily: FONT, fontWeight: 600, px: 3.5, py: 1.5, borderRadius: '10px', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
            >
              {S.hero.ctaSecondary}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ── Stat strip ─────────────────────────────────────────────────── */}
      <Box sx={{ borderBottom: HAIR_SOFT }}>
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
            {(S.hero.stats || []).map((st) => (
              <Box key={st.label} sx={{ textAlign: isRTL ? 'right' : 'left' }}>
                <Typography sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 26, md: 36 }, color: OLIVE_BRIGHT, lineHeight: 1 }}>{st.value}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: { xs: 12.5, md: 13.5 }, color: 'rgba(255,255,255,0.6)', mt: 0.8 }}>{st.label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Section 2 — Why education matters when relocating ──────────── */}
      <Section>
        <SectionHeading eyebrow={S.why.eyebrow} title={S.why.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.9, maxWidth: 860, mb: { xs: 3.5, md: 5 } }}>
          {S.why.intro}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {(S.why.items || []).map((it) => (
            <Box key={it.title} sx={cardSx}>
              <Typography component="h3" sx={{ fontFamily: FONT, fontWeight: 600, fontSize: { xs: 17, md: 18.5 }, color: '#fff', mb: 1.2 }}>{it.title}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.72)', lineHeight: 1.8 }}>{it.body}</Typography>
            </Box>
          ))}
        </Box>
      </Section>

      {/* ── Section 3 — The international school system in Oman ─────────── */}
      <Section band>
        <SectionHeading eyebrow={S.system.eyebrow} title={S.system.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.9, maxWidth: 860, mb: { xs: 3.5, md: 5 } }}>
          {S.system.intro}
        </Typography>

        {/* Curricula chips */}
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', mb: 1.8 }}>{S.system.curriculaLabel}</Typography>
          <Chips items={S.system.curricula || []} />
        </Box>

        {/* Education pathway / timeline */}
        <Box dir={dir} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 2.5 } }}>
          {(S.system.stages || []).map((st, i) => (
            <Box key={st.title} sx={{ ...cardSx, position: 'relative' }}>
              <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: OLIVE_BRIGHT, letterSpacing: '0.08em', mb: 1 }}>{String(i + 1).padStart(2, '0')}</Typography>
              <Typography component="h3" sx={{ fontFamily: FONT, fontWeight: 600, fontSize: { xs: 16, md: 17.5 }, color: '#fff', mb: 0.5 }}>{st.title}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: OLIVE_BRIGHT, mb: 1 }}>{st.tag}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{st.body}</Typography>
            </Box>
          ))}
        </Box>
      </Section>

      {/* ── Section 4 — Featured schools ───────────────────────────────── */}
      <Section>
        <SectionHeading eyebrow={S.featured.eyebrow} title={S.featured.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.9, maxWidth: 860, mb: { xs: 3.5, md: 5 } }}>
          {S.featured.intro}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {(S.featured.cards || []).map((c) => {
            const meta = schoolByKey[schoolKey(c.name)]
            const logo = meta?.logo || (/jabal|ma.?rifa/i.test(c.name) ? JABAL_LOGO : null)
            const website = meta?.website || null
            return (
            <Box key={c.name} sx={{ ...cardSx, p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Logo band — links to the school's official website when known */}
              <Box
                {...(website ? { component: 'a', href: website, target: '_blank', rel: 'noopener noreferrer' } : {})}
                sx={{ position: 'relative', aspectRatio: '16 / 10', bgcolor: logo ? '#ffffff' : '#f0efe9', display: 'grid', placeItems: 'center', p: { xs: 1.75, md: 2.25 }, borderBottom: HAIR, textDecoration: 'none' }}
              >
                {logo
                  ? <Box component="img" src={logo} alt={`${c.name} logo`} loading="lazy" sx={{ maxWidth: '90%', maxHeight: '86%', objectFit: 'contain' }} />
                  : <SchoolOutlinedIcon sx={{ fontSize: 48, color: '#1D1D1D' }} />}
                <Box sx={{ position: 'absolute', top: 12, insetInlineEnd: 12, px: 1.4, py: 0.5, borderRadius: '999px', bgcolor: 'rgba(0,0,0,0.55)', border: HAIR }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: 11.5, color: OLIVE_BRIGHT }}>{c.curriculum}</Typography>
                </Box>
              </Box>
              <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography component="h3" sx={{ fontFamily: FONT, fontWeight: 600, fontSize: { xs: 17.5, md: 19 }, color: '#fff', mb: 1.4 }}>{c.name}</Typography>
                <Stack spacing={1} sx={{ mb: 1.6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PlaceOutlinedIcon sx={{ fontSize: 16, color: OLIVE_BRIGHT, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.72)' }}>{c.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsOutlinedIcon sx={{ fontSize: 16, color: OLIVE_BRIGHT, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.72)' }}>{c.ages}</Typography>
                  </Box>
                </Stack>
                <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.66)', lineHeight: 1.7, mb: 1.6 }}>{c.highlight}</Typography>
                <Box sx={{ mt: 'auto', pt: 1.5, borderTop: HAIR_SOFT, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>{S.featured.feeLabel}</Typography>
                    <Typography dir="ltr" sx={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#fff', textAlign: isRTL ? 'right' : 'left' }}>{c.fees}</Typography>
                  </Box>
                  {website && (
                    <Box component="a" href={website} target="_blank" rel="noopener noreferrer"
                      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, flexShrink: 0, color: OLIVE_BRIGHT, textDecoration: 'none', fontFamily: FONT, fontSize: 12.5, fontWeight: 600, '&:hover': { color: '#fff' } }}>
                      {W.visit}<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            )
          })}
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button
            onClick={scrollToContact}
            variant="text"
            endIcon={<ArrowForwardRoundedIcon sx={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />}
            sx={{ color: OLIVE_BRIGHT, fontFamily: FONT, fontWeight: 600, px: 0, '&:hover': { bgcolor: 'transparent', color: '#fff' } }}
          >
            {S.featured.cta}
          </Button>
        </Box>
      </Section>

      {/* ── Schools map — pins for each featured school (Supabase `schools`) ── */}
      {schools.some((s) => s.latitude != null) && (
        <Section band>
          <SectionHeading eyebrow={W.mapEyebrow} title={W.mapTitle} />
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.9, maxWidth: 860, mb: { xs: 3, md: 4 } }}>
            {W.mapBody}
          </Typography>
          <Box sx={{ height: { xs: 380, md: 480 }, borderRadius: '16px', overflow: 'hidden', border: HAIR }}>
            <Suspense fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.03)' }} />}>
              <SchoolsMap schools={schools} visitLabel={W.visit} />
            </Suspense>
          </Box>
        </Section>
      )}

      {/* ── Section 5 — Estimated tuition fees ─────────────────────────── */}
      <Section band>
        <SectionHeading eyebrow={S.fees.eyebrow} title={S.fees.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.9, maxWidth: 860, mb: { xs: 3, md: 4 } }}>
          {S.fees.intro}
        </Typography>

        {/* Fee components */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: { xs: 1.5, md: 2 }, mb: { xs: 3.5, md: 4.5 } }}>
          {(S.fees.components || []).map((cmp) => (
            <Box key={cmp.label} sx={cardSx}>
              <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#fff', mb: 0.6 }}>{cmp.label}</Typography>
              <Typography dir="ltr" sx={{ fontFamily: FONT, fontSize: 15.5, fontWeight: 600, color: OLIVE_BRIGHT, mb: 0.6, textAlign: isRTL ? 'right' : 'left' }}>{cmp.amount}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{cmp.desc}</Typography>
            </Box>
          ))}
        </Box>

        {/* Tuition-by-stage table (dir-aware) */}
        <FeeTable columns={S.fees.columns} rows={S.fees.rows} isRTL={isRTL} />

        <Typography sx={{ fontFamily: FONT, fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', mt: 2.5, maxWidth: 760, lineHeight: 1.7 }}>
          {S.fees.disclaimer}
        </Typography>
      </Section>

      {/* ── Section 6 — Admissions process ─────────────────────────────── */}
      <Section>
        <SectionHeading eyebrow={S.admissions.eyebrow} title={S.admissions.title} />
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.9, maxWidth: 860, mb: { xs: 3.5, md: 5 } }}>
          {S.admissions.intro}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 }, mb: { xs: 4, md: 5 } }}>
          {(S.admissions.steps || []).map((st, i) => (
            <Box key={st.title} sx={{ ...cardSx, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '11px', flexShrink: 0, display: 'grid', placeItems: 'center', bgcolor: 'rgba(140,141,37,0.15)', border: '1px solid rgba(140,141,37,0.32)' }}>
                <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: OLIVE_BRIGHT }}>{i + 1}</Typography>
              </Box>
              <Box>
                <Typography component="h3" sx={{ fontFamily: FONT, fontWeight: 600, fontSize: { xs: 16, md: 17 }, color: '#fff', mb: 0.6 }}>{st.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{st.body}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', mb: 1.8 }}>{S.admissions.docsTitle}</Typography>
        <DocGrid items={S.admissions.docs || []} icon={CheckCircleOutlineRoundedIcon} cols={3} />
      </Section>

      {/* ── Living in Muscat — full-width image band (Figma material) ───── */}
      <Box component="section" data-reveal sx={{ position: 'relative', minHeight: { xs: 360, md: 460 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Box component="img" src={LIFESTYLE_IMG} alt={LF.title} loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 5, md: 7 } }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: OLIVE_BRIGHT, mb: 1.5 }}>{LF.eyebrow}</Typography>
          <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 26, md: 42 }, lineHeight: 1.2, color: '#fff', maxWidth: 760, mb: 1.5 }}>{LF.title}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.85)', maxWidth: 680, lineHeight: 1.8 }}>{LF.body}</Typography>
        </Container>
      </Box>

      {/* ── Section 7 — Family relocation services ─────────────────────── */}
      <Section band>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' }, gap: { xs: 4, md: 6 }, alignItems: 'start' }}>
          <Box>
            <SectionHeading eyebrow={S.relocation.eyebrow} title={S.relocation.title} sx={{ mb: { xs: 2, md: 3 } }} />
            <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, color: 'rgba(255,255,255,0.78)', lineHeight: 1.9, mb: 3 }}>
              {S.relocation.intro}
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.2 }}>
              {(S.relocation.links || []).map((lk) => (
                <Box
                  key={lk.to}
                  component={RouterLink}
                  to={lk.to}
                  sx={{ px: 2, py: 0.9, borderRadius: '999px', border: HAIR, bgcolor: 'rgba(255,255,255,0.03)', textDecoration: 'none', transition: 'border-color .2s', '&:hover': { borderColor: 'rgba(140,141,37,0.5)' } }}
                >
                  <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.85)' }}>{lk.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
            {(S.relocation.services || []).map((sv) => (
              <Box key={sv.title} sx={cardSx}>
                <AutoStoriesOutlinedIcon sx={{ fontSize: 22, color: OLIVE_BRIGHT, mb: 1.2 }} />
                <Typography component="h3" sx={{ fontFamily: FONT, fontWeight: 600, fontSize: { xs: 15.5, md: 16.5 }, color: '#fff', mb: 0.6 }}>{sv.title}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{sv.body}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Section>

      {/* ── Section 8 — FAQ ────────────────────────────────────────────── */}
      <Section>
        <SectionHeading eyebrow={S.faq.eyebrow} title={S.faq.title} />
        <FaqAccordion items={S.faq.items || []} />
      </Section>

      {/* ── Section 9 — Contact CTA (reused lead form) ─────────────────── */}
      <Box id="schools-contact">
        <ContactCTA source="schools_contact" eyebrow={S.cta.eyebrow} title={S.cta.title} subtitle={S.cta.subtitle} />
      </Box>
    </Box>
  )
}

// Direction-aware tuition table: olive header, hairline rows, numbers stay LTR.
function FeeTable({ columns = [], rows = [], isRTL }) {
  const n = columns.length || 1
  const grid = `1.4fr repeat(${Math.max(1, n - 1)}, 1fr)`
  return (
    <Box sx={{ overflowX: 'auto', border: HAIR, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.02)' }}>
      <Box sx={{ minWidth: { xs: 560, md: 'auto' } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: grid, gap: 1.5, px: { xs: 2, md: 3 }, py: 2, borderBottom: HAIR, bgcolor: 'rgba(255,255,255,0.03)' }}>
          {columns.map((c) => (
            <Typography key={c} sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: OLIVE_BRIGHT, textAlign: isRTL ? 'right' : 'left' }}>{c}</Typography>
          ))}
        </Box>
        {rows.map((r, i) => (
          <Box key={i} sx={{ display: 'grid', gridTemplateColumns: grid, gap: 1.5, px: { xs: 2, md: 3 }, py: { xs: 1.6, md: 2 }, borderTop: i === 0 ? 'none' : HAIR_SOFT, alignItems: 'center' }}>
            {r.map((cell, j) => (
              <Typography
                key={j}
                dir={j === 0 ? undefined : 'ltr'}
                sx={{ fontFamily: FONT, fontSize: { xs: 13.5, md: 14.5 }, fontWeight: j === 0 ? 600 : 400, color: j === 0 ? '#fff' : 'rgba(255,255,255,0.74)', lineHeight: 1.7, textAlign: isRTL ? 'right' : 'left' }}
              >
                {cell}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
