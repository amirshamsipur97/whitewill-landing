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

        {/* Body */}
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
          <Markdown>{a.body_md}</Markdown>
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
    </Box>
  )
}
