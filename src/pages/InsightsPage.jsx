/**
 * InsightsPage — the blog index. Lists published articles for the current
 * site language as olive-glass cards. 4-language + RTL aware. Article content
 * is served from the Supabase `insights` table (public read of published rows).
 */
import { useEffect, useState } from 'react'
import { LocalizedLink as RouterLink } from '../lib/localize.js'
import { Box, Container, Typography, Skeleton } from '@mui/material'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useI18n } from '../i18n.jsx'
import { fetchInsights } from '../supabase.js'
import { FONT, OLIVE_BRIGHT, HAIR } from '../components/invest/ui.jsx'
import { INSIGHTS_UI, formatDate, RTL_LANGS } from './insights/strings.js'

const CARD_BG =
  'radial-gradient(75% 60% at 70% 0%, rgba(230,237,245,0.10) 0%, rgba(230,237,245,0) 70%), linear-gradient(153deg, rgba(20,21,24,0.9) 0%, rgba(10,11,13,0.95) 100%)'

function MetaRow({ a, lang, ui, rtl }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
      {a.published_at && (
        <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>
          {formatDate(a.published_at, lang)}
        </Typography>
      )}
      {a.reading_minutes ? (
        <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
          <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontFamily: FONT, fontSize: 12.5 }}>
            {a.reading_minutes} {ui.minRead}
          </Typography>
        </Box>
      ) : null}
    </Box>
  )
}

function ArticleCard({ a, lang, ui, rtl }) {
  return (
    <Box
      component={RouterLink}
      to={`/insights/${a.slug}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        borderRadius: '16px',
        border: HAIR,
        overflow: 'hidden',
        backgroundImage: CARD_BG,
        boxShadow: 'inset 0 1px 1px 1px rgba(255,255,255,0.06)',
        transition: 'border-color .2s, transform .2s',
        '&:hover': { borderColor: 'rgba(140,141,37,0.5)', transform: 'translateY(-4px)' },
        '&:hover .ins-cover img': { transform: 'scale(1.05)' },
      }}
    >
      {/* Cover */}
      <Box className="ins-cover" sx={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.03)' }}>
        {a.cover_image && (
          <Box component="img" src={a.cover_image} alt={a.title} loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }} />
        )}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }} />
        {a.category && (
          <Box sx={{ position: 'absolute', top: 12, insetInlineStart: 12, px: 1.4, py: 0.5, borderRadius: '999px', bgcolor: 'rgba(140,141,37,0.9)', backdropFilter: 'blur(4px)' }}>
            <Typography sx={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', color: '#0b0b0b' }}>{a.category}</Typography>
          </Box>
        )}
      </Box>

      {/* Body */}
      <Box sx={{ p: { xs: 2.2, md: 2.6 }, display: 'flex', flexDirection: 'column', flex: 1, textAlign: rtl ? 'right' : 'left' }}>
        <MetaRow a={a} lang={lang} ui={ui} rtl={rtl} />
        <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 500, fontSize: { xs: 18, md: 20 }, lineHeight: 1.4, color: '#fff', mt: 1.2, mb: 1 }}>
          {a.title}
        </Typography>
        {a.excerpt && (
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13.8, md: 14.5 }, lineHeight: 1.75, color: 'rgba(255,255,255,0.62)', mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {a.excerpt}
          </Typography>
        )}
        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.7, color: OLIVE_BRIGHT }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 13.5, fontWeight: 600 }}>{ui.readMore}</Typography>
          <ArrowForwardRoundedIcon sx={{ fontSize: 17, transform: rtl ? 'scaleX(-1)' : 'none' }} />
        </Box>
      </Box>
    </Box>
  )
}

export default function InsightsPage() {
  const { lang } = useI18n()
  const ui = INSIGHTS_UI[lang] || INSIGHTS_UI.en
  const rtl = RTL_LANGS.has(lang)
  const [articles, setArticles] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    setArticles(null)
    setError(false)
    fetchInsights({ lang, limit: 48 })
      .then((rows) => { if (alive) setArticles(rows) })
      .catch(() => { if (alive) { setError(true); setArticles([]) } })
    return () => { alive = false }
  }, [lang])

  const loading = articles === null

  return (
    <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ bgcolor: '#000', color: '#fff', fontFamily: FONT, minHeight: '80vh' }}>
      {/* Hero band */}
      <Box sx={{ position: 'relative', borderBottom: HAIR, background: 'radial-gradient(90% 120% at 50% -10%, rgba(140,141,37,0.14) 0%, rgba(0,0,0,0) 60%)' }}>
        <Container maxWidth="xl" sx={{ pt: { xs: 11, md: 16 }, pb: { xs: 5, md: 8 }, textAlign: rtl ? 'right' : 'left' }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 12, md: 13 }, fontWeight: 700, letterSpacing: '0.16em', color: OLIVE_BRIGHT, mb: 1.5 }}>
            {ui.eyebrow}
          </Typography>
          <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 32, sm: 44, md: 58 }, lineHeight: 1.15, letterSpacing: '-0.01em', mb: 2, maxWidth: 900 }}>
            {ui.title}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 19 }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 680 }}>
            {ui.subtitle}
          </Typography>
        </Container>
      </Box>

      {/* Grid */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{ borderRadius: '16px', border: HAIR, overflow: 'hidden' }}>
                <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16 / 10', bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Box sx={{ p: 2.4 }}>
                  <Skeleton width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                  <Skeleton width="90%" height={28} sx={{ bgcolor: 'rgba(255,255,255,0.06)', mt: 1 }} />
                  <Skeleton width="100%" sx={{ bgcolor: 'rgba(255,255,255,0.06)', mt: 1 }} />
                  <Skeleton width="70%" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : articles.length === 0 ? (
          <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
            <Typography sx={{ fontFamily: FONT, fontSize: { xs: 16, md: 18 }, color: 'rgba(255,255,255,0.55)' }}>
              {error ? `${ui.empty}` : ui.empty}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
            {articles.map((a) => (
              <ArticleCard key={a.id} a={a} lang={lang} ui={ui} rtl={rtl} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}
