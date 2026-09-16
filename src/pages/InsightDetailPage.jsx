/**
 * InsightDetailPage — a single article. Renders the markdown body in the site's
 * design language and writes per-article SEO metadata (title, description,
 * Open Graph, canonical, JSON-LD Article schema) into <head> so JS-rendering
 * crawlers index each article on its own. 4-language + RTL aware.
 */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LocalizedLink as RouterLink } from '../lib/localize.js'
import { Box, Container, Typography, Skeleton } from '@mui/material'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useI18n } from '../i18n.jsx'
import { fetchInsightBySlug, fetchInsights } from '../supabase.js'
import Markdown from '../components/insights/Markdown.jsx'
import { FONT, OLIVE_BRIGHT, HAIR } from '../components/invest/ui.jsx'
import { INSIGHTS_UI, formatDate, RTL_LANGS } from './insights/strings.js'
import { localizePath } from '../lib/localize.js'
import { setAlternates } from '../seo.jsx'
import ContactCTA from '../components/ContactCTA'
import { OPEN_EVENT } from '../components/SalalahPopup.jsx'
import { trackContactClick } from '../analytics.js'

/* ── conversion layer ───────────────────────────────────────────────────
   Articles are the site's largest organic surface and, until 2026-09-16, its
   worst converter: 60 days of leads showed the top five business articles
   (about 500 clicks a month between them) producing two leads, while the
   project pages and the popup produced the rest. Two reasons, both fixed here:
   the closing form talked about "your next investment" under a guide about
   company registration or bank loans, and a reader who did not scroll to the
   very end never saw a way to ask anything. So: topic-aware copy on the
   closing form, and one compact card a third of the way down with the two
   lowest-friction actions (the popup that already converts, or WhatsApp). */
const BUSINESS_CATEGORIES = new Set(['Company Registration', 'Banking', 'Investment', 'Car Import', 'ثبت شرکت'])
const WHATSAPP_URL = 'https://wa.me/message/L22KC3L6RYINE1'
const ARTICLE_CTA = {
  en: {
    property: { eyebrow: 'Talk to an advisor', title: 'Want the live price list for the homes in this guide?', subtitle: 'Leave your name and WhatsApp number. An advisor sends the current units, prices and payment plans within one business day.', mid: 'Want current prices and payment plans for the homes mentioned here?', midBtn: 'Get the price list' },
    business: { eyebrow: 'Free consultation', title: 'Setting up a company, bank account or residency in Oman?', subtitle: 'Tell us what you are planning. Our company-formation team replies within one business day with the exact steps, costs and timeline for your case.', mid: 'Have a question about your own company, visa or bank account in Oman?', midBtn: 'Ask an advisor' },
    wa: 'WhatsApp',
  },
  fa: {
    property: { eyebrow: 'مشاوره رایگان فارسی', title: 'لیست قیمت زنده واحدهای این راهنما را می‌خواهید؟', subtitle: 'نام و شماره واتساپ خود را بنویسید. مشاور فارسی‌زبان ما ظرف یک روز کاری واحدهای موجود، قیمت روز و برنامه پرداخت را می‌فرستد.', mid: 'قیمت روز و برنامه پرداخت واحدهایی که اینجا آمده را می‌خواهید؟', midBtn: 'دریافت لیست قیمت' },
    business: { eyebrow: 'مشاوره رایگان فارسی', title: 'ثبت شرکت، حساب بانکی یا اقامت عمان در برنامه‌تان است؟', subtitle: 'بنویسید چه کاری می‌خواهید بکنید. تیم ثبت شرکت ما ظرف یک روز کاری مراحل دقیق، هزینه و زمان‌بندی پرونده شما را می‌فرستد.', mid: 'درباره شرکت، ویزا یا حساب بانکی خودتان در عمان سوال دارید؟', midBtn: 'سوال از مشاور' },
    wa: 'واتساپ',
  },
  ar: {
    property: { eyebrow: 'تحدث مع مستشار', title: 'هل تريد قائمة الأسعار الحالية للوحدات المذكورة في هذا الدليل؟', subtitle: 'اترك اسمك ورقم واتساب. يرسل لك مستشارنا الوحدات المتاحة والأسعار وخطط الدفع خلال يوم عمل واحد.', mid: 'هل تريد الأسعار الحالية وخطط الدفع للوحدات المذكورة هنا؟', midBtn: 'احصل على قائمة الأسعار' },
    business: { eyebrow: 'استشارة مجانية', title: 'هل تخطط لتأسيس شركة أو فتح حساب بنكي أو الحصول على إقامة في عُمان؟', subtitle: 'أخبرنا بما تخطط له. يرد فريق تأسيس الشركات خلال يوم عمل واحد بالخطوات الدقيقة والتكاليف والمدة لحالتك.', mid: 'لديك سؤال عن شركتك أو إقامتك أو حسابك البنكي في عُمان؟', midBtn: 'اسأل مستشاراً' },
    wa: 'واتساب',
  },
  ru: {
    property: { eyebrow: 'Консультация', title: 'Нужен актуальный прайс-лист по объектам из этого гида?', subtitle: 'Оставьте имя и номер WhatsApp. Консультант пришлёт доступные лоты, цены и планы оплаты в течение одного рабочего дня.', mid: 'Хотите актуальные цены и планы оплаты по объектам из статьи?', midBtn: 'Получить прайс-лист' },
    business: { eyebrow: 'Бесплатная консультация', title: 'Планируете компанию, банковский счёт или резидентство в Омане?', subtitle: 'Расскажите о задаче. Команда по регистрации компаний ответит в течение одного рабочего дня с точными шагами, стоимостью и сроками для вашего случая.', mid: 'Есть вопрос о своей компании, визе или счёте в Омане?', midBtn: 'Спросить консультанта' },
    wa: 'WhatsApp',
  },
}

/** Split markdown after the Nth H2 so a card can sit between two halves. */
function splitAfterHeading(md, n = 3) {
  if (!md) return [md, null]
  const re = /\n## /g
  let m, count = 0
  while ((m = re.exec(md))) {
    count += 1
    if (count === n) return [md.slice(0, m.index + 1), md.slice(m.index + 1)]
  }
  return [md, null]
}

function MidArticleCTA({ copy, business, lang, rtl }) {
  const primary = () => {
    if (business) {
      document.getElementById('article-contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.dispatchEvent(new CustomEvent(OPEN_EVENT))
    }
  }
  return (
    <Box
      role="complementary"
      sx={{
        my: { xs: 4, md: 5 }, p: { xs: 2.5, md: 3 }, borderRadius: '16px',
        border: '1px solid rgba(140,141,37,0.45)',
        background: 'linear-gradient(135deg, rgba(140,141,37,0.16) 0%, rgba(140,141,37,0.04) 100%)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2,
      }}
    >
      <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 18 }, fontWeight: 500, lineHeight: 1.45, flex: '1 1 260px' }}>
        {copy.mid}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
        <Box
          component="button" type="button" onClick={primary}
          sx={{ cursor: 'pointer', border: 0, borderRadius: '10px', px: 2.4, py: 1.2, bgcolor: OLIVE_BRIGHT, color: '#000', fontFamily: FONT, fontWeight: 700, fontSize: 14.5, '&:hover': { bgcolor: '#7c7856' } }}
        >
          {copy.midBtn}
        </Box>
        <Box
          component="a" href={WHATSAPP_URL} target="_blank" rel="noopener"
          onClick={() => trackContactClick({ channel: 'whatsapp', language: lang })}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, textDecoration: 'none', borderRadius: '10px', px: 2.2, py: 1.2, border: '1px solid rgba(37,211,102,0.55)', color: '#25d366', fontFamily: FONT, fontWeight: 600, fontSize: 14.5, '&:hover': { bgcolor: 'rgba(37,211,102,0.08)' } }}
        >
          <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, fill: 'currentColor', transform: rtl ? 'scaleX(-1)' : 'none' }} aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z" />
          </Box>
          {copy.wa}
        </Box>
      </Box>
    </Box>
  )
}

const SITE = 'https://www.irfaninvest.com'

function setMeta(attr, value, content) {
  let el = document.head.querySelector(`meta[${attr}="${value}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content || '')
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const JSONLD_ID = 'insight-jsonld'
function setJsonLd(obj) {
  let el = document.getElementById(JSONLD_ID)
  if (!obj) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.id = JSONLD_ID
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(obj)
}

// Pull a FAQPage schema out of a "## FAQ" markdown section (### question +
// following text). Returns null if no usable Q&A pairs are found.
function extractFaq(md) {
  if (!md) return null
  const m = md.split(/^##\s+(?:FAQ|Frequently|سوالات|پرسش|الأسئلة|أسئلة|Часто|Вопросы).*$/im)[1]
  if (!m) return null
  const parts = m.split(/^###\s+/m).slice(1)
  const qa = []
  for (const p of parts) {
    const nl = p.indexOf('\n')
    if (nl === -1) continue
    const q = p.slice(0, nl).trim()
    const ans = p.slice(nl + 1).split(/^##\s+/m)[0].replace(/[*_#>`]/g, '').trim()
    if (q && ans) qa.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: ans.slice(0, 900) } })
    if (qa.length >= 6) break
  }
  if (!qa.length) return null
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa }
}

function applyArticleSeo(a, lang) {
  const logical = `/insights/${a.slug}`
  const url = `${SITE}${localizePath(logical, lang)}`
  const title = (a.seo_title || a.title) + ' | Irfan Investment Group'
  const desc = a.seo_description || a.excerpt || a.title
  const img = a.cover_image ? (a.cover_image.startsWith('http') ? a.cover_image : SITE + a.cover_image) : `${SITE}/og-default.jpg`

  document.title = title
  setMeta('name', 'description', desc)
  setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1')
  setMeta('property', 'og:type', 'article')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', desc)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', img)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', desc)
  setMeta('name', 'twitter:image', img)
  setCanonical(url)
  setAlternates(logical) // hreflang for the 4 language variants of this article

  const graph = [
    {
      '@type': 'Article',
      headline: a.title,
      description: desc,
      image: img,
      inLanguage: lang,
      datePublished: a.published_at || undefined,
      dateModified: a.updated_at || a.published_at || undefined,
      author: { '@type': 'Organization', name: a.author || 'Irfan Investment Group' },
      publisher: {
        '@type': 'Organization',
        name: 'Irfan Investment Group',
        logo: { '@type': 'ImageObject', url: `${SITE}/logo.svg` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE}/insights` },
        { '@type': 'ListItem', position: 3, name: a.title, item: url },
      ],
    },
  ]
  const faq = extractFaq(a.body_md)
  if (faq) graph.push(faq)
  setJsonLd({ '@context': 'https://schema.org', '@graph': graph })
}

export default function InsightDetailPage() {
  const { slug } = useParams()
  const { lang } = useI18n()
  const ui = INSIGHTS_UI[lang] || INSIGHTS_UI.en
  const rtl = RTL_LANGS.has(lang)
  const [article, setArticle] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ok | notfound
  const [related, setRelated] = useState([])

  // Latest same-language articles for the "More insights" strip — internal
  // links between articles spread crawl equity and keep readers on the blog.
  useEffect(() => {
    let alive = true
    setRelated([])
    fetchInsights({ lang, limit: 6 })
      .then((rows) => {
        if (!alive) return
        setRelated((rows || []).filter((r) => r.slug !== slug).slice(0, 3))
      })
      .catch(() => {})
    return () => { alive = false }
  }, [slug, lang])

  useEffect(() => {
    let alive = true
    setStatus('loading')
    setArticle(null)
    // Prefer the current-language version; fall back to any language sharing
    // the slug so a link never dead-ends if a translation is missing.
    fetchInsightBySlug(slug, lang)
      .then((row) => (row ? row : fetchInsightBySlug(slug, null)))
      .then((row) => {
        if (!alive) return
        if (row) { setArticle(row); setStatus('ok') }
        else setStatus('notfound')
      })
      .catch(() => { if (alive) setStatus('notfound') })
    return () => { alive = false }
  }, [slug, lang])

  // Write SEO tags once the article resolves; clean up JSON-LD on unmount.
  useEffect(() => {
    if (status === 'ok' && article) applyArticleSeo(article, lang)
    // A missing article must not be indexed (avoids thin/duplicate pages).
    if (status === 'notfound') {
      setMeta('name', 'robots', 'noindex, follow')
      setJsonLd(null)
    }
    return () => setJsonLd(null)
  }, [status, article, lang])

  const BackLink = (
    <Box
      component={RouterLink}
      to="/insights"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.7, color: OLIVE_BRIGHT, textDecoration: 'none', fontFamily: FONT, fontSize: 14, fontWeight: 600, '&:hover': { opacity: 0.8 } }}
    >
      <ArrowBackRoundedIcon sx={{ fontSize: 18, transform: rtl ? 'scaleX(-1)' : 'none' }} />
      {ui.back}
    </Box>
  )

  if (status === 'notfound') {
    return (
      <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center', py: 12 }}>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 28, md: 40 }, mb: 2 }}>{ui.notFound}</Typography>
          <Typography sx={{ fontFamily: FONT, color: 'rgba(255,255,255,0.6)', mb: 4 }}>{ui.notFoundBody}</Typography>
          {BackLink}
        </Container>
      </Box>
    )
  }

  if (status === 'loading') {
    return (
      <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, minHeight: '80vh' }}>
        <Container maxWidth="md" sx={{ pt: { xs: 11, md: 15 }, pb: 8 }}>
          <Skeleton width="30%" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
          <Skeleton width="85%" height={56} sx={{ bgcolor: 'rgba(255,255,255,0.06)', mt: 2 }} />
          <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16/8', borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)', my: 4 }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} width={`${70 + ((i * 7) % 30)}%`} sx={{ bgcolor: 'rgba(255,255,255,0.05)', my: 1 }} />
          ))}
        </Container>
      </Box>
    )
  }

  const a = article
  return (
    <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, textAlign: rtl ? 'right' : 'left' }}>
      {/* Header */}
      <Box sx={{ borderBottom: HAIR, background: 'radial-gradient(90% 120% at 50% -10%, rgba(140,141,37,0.12) 0%, rgba(0,0,0,0) 60%)' }}>
        <Container maxWidth="md" sx={{ pt: { xs: 10, md: 14 }, pb: { xs: 4, md: 6 } }}>
          <Box sx={{ mb: 3 }}>{BackLink}</Box>
          {a.category && (
            <Typography sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.14em', color: OLIVE_BRIGHT, mb: 1.5 }}>
              {a.category}
            </Typography>
          )}
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 28, sm: 36, md: 48 }, lineHeight: 1.2, letterSpacing: '-0.01em', mb: 2.5 }}>
            {a.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.6, flexWrap: 'wrap', color: 'rgba(255,255,255,0.55)' }}>
            {a.author && <Typography sx={{ fontFamily: FONT, fontSize: 13.5 }}>{ui.by} {a.author}</Typography>}
            {a.published_at && (
              <>
                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Typography sx={{ fontFamily: FONT, fontSize: 13.5 }}>{formatDate(a.published_at, lang)}</Typography>
              </>
            )}
            {a.reading_minutes ? (
              <>
                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontFamily: FONT, fontSize: 13.5 }}>{a.reading_minutes} {ui.minRead}</Typography>
                </Box>
              </>
            ) : null}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Cover */}
        {a.cover_image && (
          <Box component="img" src={a.cover_image} alt={a.title} sx={{ display: 'block', width: '100%', aspectRatio: '16 / 8', objectFit: 'cover', borderRadius: '16px', border: HAIR, mb: { xs: 4, md: 5 } }} />
        )}

        {/* Body, with one conversion card after the third H2 */}
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
          {(() => {
            const business = BUSINESS_CATEGORIES.has(a.category)
            const copySet = ARTICLE_CTA[lang] || ARTICLE_CTA.en
            const copy = { ...(business ? copySet.business : copySet.property), wa: copySet.wa }
            const [head, tail] = (a.body_md || '').length > 2500 ? splitAfterHeading(a.body_md, 3) : [a.body_md, null]
            return (
              <>
                <Markdown>{head}</Markdown>
                {tail && <MidArticleCTA copy={copy} business={business} lang={lang} rtl={rtl} />}
                {tail && <Markdown>{tail}</Markdown>}
              </>
            )
          })()}
        </Box>

        {/* Tags */}
        {Array.isArray(a.tags) && a.tags.length > 0 && (
          <Box sx={{ maxWidth: 760, mx: 'auto', mt: 5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {a.tags.map((tag) => (
              <Box key={tag} sx={{ px: 1.6, py: 0.6, borderRadius: '999px', border: HAIR, bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: 'rgba(255,255,255,0.65)' }}>#{tag}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Related articles — same language, newest first */}
        {related.length > 0 && (
          <Box sx={{ maxWidth: 760, mx: 'auto', mt: 7, pt: 5, borderTop: HAIR }}>
            <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 22, md: 28 }, mb: 3 }}>
              {ui.moreReading}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              {related.map((r) => (
                <Box
                  key={r.id}
                  component={RouterLink}
                  to={`/insights/${r.slug}`}
                  sx={{
                    display: 'flex', flexDirection: 'column', textDecoration: 'none',
                    borderRadius: '14px', border: HAIR, overflow: 'hidden',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    transition: 'border-color .2s, transform .2s',
                    '&:hover': { borderColor: 'rgba(140,141,37,0.5)', transform: 'translateY(-3px)' },
                  }}
                >
                  {r.cover_image && (
                    <Box component="img" src={r.cover_image} alt={r.title} loading="lazy"
                      sx={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }} />
                  )}
                  <Box sx={{ p: 1.8, display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1 }}>
                    {r.published_at && (
                      <Typography sx={{ fontFamily: FONT, fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>
                        {formatDate(r.published_at, lang)}
                      </Typography>
                    )}
                    <Typography component="h3" sx={{ fontFamily: FONT, fontWeight: 500, fontSize: 14.5, lineHeight: 1.45, color: '#fff', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.title}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ maxWidth: 760, mx: 'auto', mt: 6, pt: 4, borderTop: HAIR }}>{BackLink}</Box>
      </Container>

      {/* THE LEAD FORM. Until 2026-08-20 the 154 article pages, which are the
          site's largest organic surface, had no way to convert at all: the only
          form in the DOM belonged to the popup, which renders 0x0 and hidden and
          does not auto-open on articles. A reader arrived from Google, read the
          whole guide and left, because there was nothing to fill in. With paid
          campaigns switched off and organic carrying the whole funnel, that gap
          was the funnel.
          `source` is its own value so article leads are separable in the leads
          table; ContactCTA already sends page_url, so the exact article is
          recorded without inventing 154 source strings. */}
      {(() => {
        const business = BUSINESS_CATEGORIES.has(a.category)
        const copySet = ARTICLE_CTA[lang] || ARTICLE_CTA.en
        const copy = business ? copySet.business : copySet.property
        return (
          <Box id="article-contact">
            <ContactCTA
              source={business ? 'insight_article_business' : 'insight_article'}
              eyebrow={copy.eyebrow}
              title={copy.title}
              subtitle={copy.subtitle}
            />
          </Box>
        )
      })()}
    </Box>
  )
}
