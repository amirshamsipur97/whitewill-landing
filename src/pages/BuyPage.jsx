/**
 * BuyPage — /buy
 *
 * A clean, gallery-style listing of every development in our portfolio.
 * Inspired by the Figma "NEW BUILDINGS IN OMAN" layout (16:4855) but
 * styled with our own header, fonts, and brand palette.
 *
 * Each card links to /buy/:slug where the project detail page either:
 *   • shows live inventory + map + filter (projects with stock), or
 *   • shows the project info + inquiry form (everything else).
 */

import { useEffect, useMemo, useState } from 'react'
import { LocalizedLink as RouterLink } from '../lib/localize.js'
import {
  Box,
  Container,
  Typography,
  Stack,
  InputBase,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Skeleton,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { getProjectDetails } from '../data/projectDetails.js'
import BuyFiltersModal, { DEFAULT_FILTERS, unitPasses, countMatchingProjects } from '../components/BuyFiltersModal.jsx'
import { coverForSlug, galleryFor } from '../projectGallery.js'
import { OPEN_EVENT as SALALAH_OPEN_EVENT } from '../components/SalalahPopup.jsx'
import { LocalizedLink } from '../lib/localize.js'
import { BUY_SEO, buyFaqJsonLd } from '../buySeoContent.mjs'

// ── Salalah featured banner (above the listings; SEO copy in the DOM) ──
const SALALAH_BANNER = {
  en: {
    badge: 'Featured · Khareef Season',
    title: 'Hawana Salalah — Freehold Villas & Chalets for Sale in Salalah, Oman',
    sub: 'From OMR 98,000 · up to 10.6% rental returns · new Lubana Island lagoon villas · freehold with Omani residency eligibility for all nationalities.',
    ctaView: 'Explore Hawana Salalah',
    ctaLeads: 'Get the price list',
  },
  ru: {
    badge: 'Проект недели · Сезон харифа',
    title: 'Hawana Salalah — виллы и шале фрихолд в Салале, Оман',
    sub: 'От 98 000 OMR · доходность до 10,6% · новые виллы у лагуны Lubana Island · фрихолд с правом на резидентство Омана для всех национальностей.',
    ctaView: 'Смотреть Hawana Salalah',
    ctaLeads: 'Получить прайс-лист',
  },
  ar: {
    badge: 'مشروع مميز · موسم الخريف',
    title: 'هوانا صلالة: فلل وشاليهات تملّك حر للبيع في صلالة، عُمان',
    sub: 'من 98,000 ر.ع · عائد إيجاري حتى 10.6% · فلل جزيرة لبانة الجديدة على البحيرة · تملّك حر مع أهلية الإقامة العُمانية لجميع الجنسيات.',
    ctaView: 'استكشف هوانا صلالة',
    ctaLeads: 'احصل على قائمة الأسعار',
  },
  fa: {
    badge: 'پروژه ویژه · موسم خریف',
    title: 'هوانا صلاله؛ فروش ویلا و شاله فری‌هولد در سلاله عمان',
    sub: 'از ۹۸٬۰۰۰ ریال عمان · بازده اجاره تا ۱۰.۶٪ · ویلاهای لاگونی جدید جزیره لوبانا · مالکیت کامل با امکان اقامت عمان برای همه ملیت‌ها.',
    ctaView: 'مشاهده هوانا صلاله',
    ctaLeads: 'دریافت لیست قیمت',
  },
}

// ── brand tokens ────────────────────────────────────────────────────────
const OLIVE = '#7c7856'
const OLIVE_BRIGHT = '#8c8d25'
const INDIGO = '#391FAF'

// Stock cover photos keyed by project name. We rotate through the assets
// already in /public/images so the grid looks polished out of the box —
// when the client supplies hero photos per project, swap in by name.
const PLACEHOLDER_POOL = [
  '/images/carosel-1.jpg',
  '/images/carosel-2.jpg',
  '/images/carosel-3.jpg',
  '/images/carosel-4.jpg',
  '/images/luxury-1.jpg',
  '/images/luxury-2.jpg',
  '/images/luxury-3.jpg',
  '/images/luxury-4.jpg',
  '/images/waterfront-bg-v2.jpg',
]

function coverFor(project, index) {
  // Bundled gallery cover first (src/assets/projects/<slug>/ — see
  // projectGallery.js), then the legacy /public drop-in path, else the
  // round-robin placeholder via onError below.
  const slug = slugify(project.name)
  const bundled = coverForSlug(slug)
  const specific = `/images/projects/${slug}.jpg`
  return { primary: bundled || specific, fallback: PLACEHOLDER_POOL[index % PLACEHOLDER_POOL.length] }
}

export function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Format the entry-from price for a project's available units.
// Skip null/0 prices — `Number(null)` is 0 (not NaN), which would
// otherwise let an unpriced unit (e.g. POA penthouse) collapse
// Math.min to zero and silently hide a project's real entry price.
function priceFrom(units) {
  const prices = units
    .map((u) => u.price_omr)
    .filter((p) => p != null && Number(p) > 0)
    .map(Number)
  if (!prices.length) return null
  return Math.min(...prices)
}

function fmtOmr(n) {
  if (n == null) return ''
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
}

// ── card component ─────────────────────────────────────────────────────
// ── Salalah special releases row (branded Figma covers, one row of 3) ──
const SALALAH_RELEASES = [
  { key: 'Amazi', name: 'Lubana Island', location: 'Amazi · Hawana Salalah', gallerySlug: 'amazi', from: '98,000', to: '/buy/hawana-salalah?release=Amazi' },
  { key: 'Muscat Bay', name: 'Muscat Bay', location: 'Zen Residences · Muscat Bay', gallerySlug: 'muscat-bay', from: '138,000', by: 'Zen Development and Investment', to: '/buy/zen-residences' },
  { key: 'Olive Farms', name: 'Olive Farms', location: 'Raya · Jebel Sifah', gallerySlug: 'olive-farms', from: '77,250', to: '/buy/jebel-sifah?release=Olive%20Farms' },
]
const RELEASES_L = {
  en: { title: 'Special Releases', from: 'From OMR {p}', onRequest: 'Prices on request', by: 'Muriya (Orascom Development)' },
  ru: { title: 'Специальные релизы', from: 'От {p} OMR', onRequest: 'Цены по запросу', by: 'Muriya (Orascom Development)' },
  ar: { title: 'إصدارات مميزة', from: 'من {p} ر.ع', onRequest: 'الأسعار عند الطلب', by: 'موريّا (أوراسكوم)' },
  fa: { title: 'عرضه‌های ویژه', from: 'از {p} ریال عمان', onRequest: 'قیمت‌ها با درخواست', by: 'موریا (اوراسکوم)' },
}

// Localized "special" tag for featured (Salalah) cards.
const FEATURED_TAG = {
  en: '✦ Special · Salalah',
  ru: '✦ Спецпроект · Салала',
  ar: '✦ مميز · صلالة',
  fa: '✦ ویژه · صلاله',
}

function ProjectCard({ project, units, index, t, lang }) {
  const details = getProjectDetails(project.name, lang)
  const cover = coverFor(project, index)
  const minPrice = priceFrom(units)
  const isItc = !!project.area?.is_itc
  const slug = slugify(project.name)
  const isFeatured = !!details?.featured

  // Locations and developer line.
  const location = [project.area?.name, project.area?.city].filter(Boolean).join(', ')
  const dev = project.developer?.name

  return (
    <Box
      component={RouterLink}
      to={`/buy/${slug}`}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        borderRadius: '14px',
        overflow: 'hidden',
        bgcolor: 'rgba(255,255,255,0.02)',
        border: isFeatured ? '1px solid rgba(20,184,166,0.55)' : '1px solid rgba(255,255,255,0.06)',
        animation: isFeatured ? 'irfanGlowPulse 2.8s ease-in-out infinite' : 'none',
        transition: 'transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 220ms ease, box-shadow 320ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: isFeatured ? 'rgba(45,212,191,0.9)' : 'rgba(255,255,255,0.18)',
          boxShadow: isFeatured ? '0 0 34px rgba(20,184,166,0.8), 0 24px 60px rgba(0,0,0,0.5)' : '0 24px 60px rgba(0,0,0,0.5)',
        },
        '&:hover .pc-img': { transform: 'scale(1.05)' },
        '&:hover .pc-arrow': { opacity: 1, transform: 'translate(0,0)' },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          bgcolor: '#111',
        }}
      >
        <Box
          component="img"
          className="pc-img"
          src={cover.primary}
          onError={(e) => {
            if (e.currentTarget.src.endsWith(cover.fallback)) return
            e.currentTarget.src = cover.fallback
          }}
          alt={project.name}
          loading="lazy"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)',
          }}
        />

        {/* Featured sparkle tag (Salalah special) */}
        {isFeatured && (
          <Chip
            label={FEATURED_TAG[lang] || FEATURED_TAG.en}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 56,
              zIndex: 2,
              fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#fff',
              bgcolor: 'rgba(14,142,133,0.9)',
              border: '1px solid rgba(45,212,191,0.8)',
              backdropFilter: 'blur(8px)',
              animation: 'irfanSparkle 2s ease-in-out infinite',
            }}
          />
        )}

        {/* Top-left status badge */}
        {units.length > 0 && (
          <Chip
            label={t.buyPage.unitsAvailable.replace('{n}', units.length)}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#fff',
              bgcolor: 'rgba(57,31,175,0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              '& .MuiChip-label': { px: 1.2 },
            }}
          />
        )}

        {/* Top-right ITC + arrow badges */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ position: 'absolute', top: 12, right: 12, alignItems: 'center' }}
        >
          {isItc && (
            <Chip
              label="ITC"
              size="small"
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#fff',
                bgcolor: 'rgba(140,141,37,0.92)',
                border: '1px solid rgba(255,255,255,0.2)',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
          <Box
            className="pc-arrow"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
              opacity: 0,
              transform: 'translate(-6px, 6px)',
              transition: 'opacity 220ms ease, transform 220ms ease',
            }}
          >
            <ArrowOutwardRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
        </Stack>

        {/* Bottom dark fade for legibility */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Meta */}
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: { xs: 17, md: 19 },
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {project.name}
        </Typography>
        {location && (
          <Stack direction="row" spacing={0.65} alignItems="center" sx={{ mb: 1.5 }}>
            <PlaceRoundedIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: { xs: 14, md: 14.5 },
                fontWeight: 500,
                color: 'rgba(255,255,255,0.72)',
                letterSpacing: '0.01em',
                lineHeight: 1.35,
              }}
            >
              {location}
            </Typography>
          </Stack>
        )}

        {dev && (
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 11.5,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              mb: 1.75,
            }}
          >
            {dev}
          </Typography>
        )}

        {/*
          Footer row — fixed layout: HANDOVER on the left, PRICE on
          the right. We use a 1fr / 1fr grid (not space-between) so
          the two columns share equal width regardless of whether
          handover or price is missing — every card in the grid
          ends up with the same anchor points and reads cleanly.
        */}
        <Box
          sx={{
            pt: 1.5,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: 1.5,
            alignItems: 'flex-end',
          }}
        >
          {/* LEFT — Handover */}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 10.5,
                color: 'rgba(255,255,255,0.42)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 0.4,
              }}
            >
              {t.buyPage.handover}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: { xs: 13.5, md: 14 },
                fontWeight: 500,
                color: details?.handover ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {details?.handover || t.buyPage.handoverTBA}
            </Typography>
          </Box>

          {/* RIGHT — Price */}
          <Box sx={{ textAlign: 'right', minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 10.5,
                color: 'rgba(255,255,255,0.42)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 0.4,
              }}
            >
              {minPrice ? t.buyPage.startingFrom : t.buyPage.priceLabel}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: { xs: 15.5, md: 16.5 },
                fontWeight: 700,
                color: minPrice ? OLIVE_BRIGHT : 'rgba(255,255,255,0.7)',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
              }}
            >
              {minPrice ? `OMR ${fmtOmr(minPrice)}` : t.buyPage.inquiryOnly}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── main page ─────────────────────────────────────────────────────────
export default function BuyPage() {
  const { t, lang } = useI18n()
  const [projects, setProjects] = useState([])
  const [allUnits, setAllUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // FAQPage JSON-LD for the SEO block below the grid. The prerendered
  // static /buy pages emit the identical payload (id kept in sync so
  // hydration replaces rather than duplicates it).
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'buy-faq-jsonld'
    el.textContent = JSON.stringify(buyFaqJsonLd(lang))
    document.getElementById('buy-faq-jsonld')?.remove()
    document.head.appendChild(el)
    return () => el.remove()
  }, [lang])

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchProjects(), fetchAllUnits()])
      .then(([projs, units]) => {
        if (cancelled) return
        setProjects(projs || [])
        setAllUnits(units || [])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  // Index units by project
  const unitsByProject = useMemo(() => {
    const m = new Map()
    for (const u of allUnits) {
      const status = (u.availability_status || '').toLowerCase()
      if (status !== 'available' && status !== 'reserved') continue
      if (!m.has(u.project_id)) m.set(u.project_id, [])
      m.get(u.project_id).push(u)
    }
    return m
  }, [allUnits])

  // A project passes if it matches text+city filters AND, when any
  // unit-level filter is set, has at least one unit that passes.
  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    const hasUnitFilter =
      filters.bedrooms !== 'any' ||
      filters.propertyType !== 'all' ||
      filters.priceRange[0] > 0 || filters.priceRange[1] < 1_000_000 ||
      filters.areaRange[0] > 0 || filters.areaRange[1] < 600

    return projects.filter((p) => {
      if (q) {
        // Unit layout_type is included so sub-projects encoded there
        // (e.g. "Lubana Island · 3-Bed Villa") are searchable too.
        const hay = [
          p.name, p.area?.name, p.area?.city, p.area?.governorate, p.developer?.name,
          ...(unitsByProject.get(p.id) || []).map((u) => u.layout_type),
        ]
          .filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.city !== 'all' && p.area?.city !== filters.city) return false
      if (!hasUnitFilter) return true
      const units = unitsByProject.get(p.id) || []
      return units.some(u => unitPasses(u, filters))
    })
  }, [projects, filters, unitsByProject])

  // Active-filter chip summary (rendered next to the Filters button so
  // the user can see at a glance what's narrowing the list, and tap to
  // clear individually).
  const activeChips = useMemo(() => {
    const chips = []
    if (filters.bedrooms !== 'any') {
      chips.push({ key: 'bedrooms', label: `${filters.bedrooms === 'S' ? 'Studio' : `${filters.bedrooms}${filters.bedrooms === 4 ? '+' : ''} BR`}`, reset: { bedrooms: 'any' } })
    }
    if (filters.propertyType !== 'all') {
      chips.push({ key: 'type', label: filters.propertyType, reset: { propertyType: 'all' } })
    }
    if (filters.city !== 'all') {
      chips.push({ key: 'city', label: filters.city, reset: { city: 'all' } })
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1_000_000) {
      chips.push({ key: 'price', label: `OMR ${fmtOmr(filters.priceRange[0])} – ${fmtOmr(filters.priceRange[1])}`, reset: { priceRange: [0, 1_000_000] } })
    }
    if (filters.areaRange[0] > 0 || filters.areaRange[1] < 600) {
      chips.push({ key: 'area', label: `${filters.areaRange[0]} – ${filters.areaRange[1]} m²`, reset: { areaRange: [0, 600] } })
    }
    return chips
  }, [filters])

  const matchCount = useMemo(
    () => countMatchingProjects(projects, unitsByProject, filters),
    [projects, unitsByProject, filters],
  )

  // Sort: available stock first, then by name.
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const ua = (unitsByProject.get(a.id) || []).length
      const ub = (unitsByProject.get(b.id) || []).length
      if ((ua > 0) !== (ub > 0)) return ub - ua
      return a.name.localeCompare(b.name)
    })
  }, [filtered, unitsByProject])

  return (
    <Box
      component="section"
      sx={{
        bgcolor: '#000',
        color: '#fff',
        minHeight: '100vh',
        pt: { xs: 5, md: 8 },
        pb: { xs: 10, md: 14 },
      }}
    >
      <style>{`
        @keyframes irfanGlowPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(20,184,166,0.30), 0 0 0 1px rgba(20,184,166,0.35); }
          50% { box-shadow: 0 0 28px rgba(20,184,166,0.72), 0 0 0 1px rgba(45,212,191,0.85); }
        }
        @keyframes irfanSparkle {
          0%, 100% { opacity: 0.88; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.07); }
        }
      `}</style>
      <Container maxWidth="xl">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              mb: 2,
            }}
          >
            {t.buyPage.eyebrow}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: 26, sm: 32, md: 40 },
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              mb: 2,
            }}
          >
            {t.buyPage.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 14.5, md: 16.5 },
              color: 'rgba(255,255,255,0.65)',
              maxWidth: 720,
              lineHeight: 1.55,
            }}
          >
            {t.buyPage.subtitle}
          </Typography>
        </Box>

        {/* ── Salalah featured banner — seen BEFORE the listings ─────── */}
        {(() => {
          const bt = SALALAH_BANNER[lang] || SALALAH_BANNER.en
          const bannerImg = galleryFor('hawana-salalah')[1] || coverForSlug('hawana-salalah')
          const bannerRtl = lang === 'fa' || lang === 'ar'
          return (
            <Box
              component="aside"
              dir={bannerRtl ? 'rtl' : 'ltr'}
              sx={{
                position: 'relative',
                mb: { xs: 4, md: 5 },
                borderRadius: '18px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.12)',
                minHeight: { xs: 300, md: 240 },
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Box
                component="img"
                src={bannerImg}
                alt="Lubana Island lagoon villas at Hawana Salalah, Oman"
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: bannerRtl
                    ? 'linear-gradient(270deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.55) 46%, rgba(0,0,0,0.12) 100%)'
                    : 'linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.55) 46%, rgba(0,0,0,0.12) 100%)',
                }}
              />
              <Box sx={{ position: 'relative', p: { xs: 2.5, md: 4 }, maxWidth: 760 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    bgcolor: '#0E8E85',
                    color: '#fff',
                    borderRadius: '999px',
                    px: 1.6,
                    py: 0.55,
                    fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif',
                    fontWeight: 700,
                    fontSize: 11.5,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    mb: 1.4,
                  }}
                >
                  {bt.badge}
                </Box>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: 19, sm: 23, md: 27 },
                    lineHeight: 1.22,
                    mb: 1,
                  }}
                >
                  {bt.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Inter", "Peyda", sans-serif',
                    fontSize: { xs: 13, md: 14.5 },
                    color: 'rgba(255,255,255,0.82)',
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  {bt.sub}
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                  <Box
                    component={LocalizedLink}
                    to="/buy/hawana-salalah"
                    sx={{
                      bgcolor: '#fff',
                      color: '#000',
                      borderRadius: '999px',
                      px: 2.4,
                      py: 1,
                      fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif',
                      fontWeight: 700,
                      fontSize: 13.5,
                      textDecoration: 'none',
                      transition: 'opacity .2s',
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    {bt.ctaView}
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(SALALAH_OPEN_EVENT))}
                    sx={{
                      bgcolor: 'transparent',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.55)',
                      borderRadius: '999px',
                      px: 2.4,
                      py: 1,
                      cursor: 'pointer',
                      fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif',
                      fontWeight: 700,
                      fontSize: 13.5,
                      transition: 'background .2s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                    }}
                  >
                    {bt.ctaLeads}
                  </Box>
                </Stack>
              </Box>
            </Box>
          )
        })()}

        {/* ── Salalah special releases — one row of 3 branded covers ── */}
        {(() => {
          const rl = RELEASES_L[lang] || RELEASES_L.en
          return (
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: 17, md: 20 },
                  mb: 2,
                }}
              >
                <Box component="span" sx={{ color: '#2dd4bf', mr: 1 }}>✦</Box>
                {rl.title}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                {SALALAH_RELEASES.map((rel) => {
                  const img = galleryFor(rel.gallerySlug)[0]
                  return (
                    <Box
                      key={rel.key}
                      component={RouterLink}
                      to={rel.to || `/buy/hawana-salalah?release=${encodeURIComponent(rel.key)}`}
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(20,184,166,0.35)',
                        transition: 'transform 300ms cubic-bezier(0.22,0.61,0.36,1), border-color .2s, box-shadow .3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: 'rgba(45,212,191,0.85)',
                          boxShadow: '0 0 26px rgba(20,184,166,0.5)',
                        },
                        '&:hover .rel-img': { transform: 'scale(1.04)' },
                      }}
                    >
                      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', overflow: 'hidden', bgcolor: '#111' }}>
                        <Box
                          component="img"
                          className="rel-img"
                          src={img}
                          alt={`${rel.name} — ${rel.location}`}
                          loading="lazy"
                          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms cubic-bezier(0.22,0.61,0.36,1)' }}
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography sx={{ fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif', fontWeight: 700, fontSize: 16.5, color: '#fff' }}>
                          {rel.name}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Inter", "Peyda", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', mb: 0.8 }}>
                          {rel.location} · {rel.by || rl.by}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif', fontWeight: 700, fontSize: 13.5, color: '#c9a24b' }}>
                          {rel.from ? rl.from.replace('{p}', rel.from) : rl.onRequest}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )
        })()}

        {/* ── Filter bar — single Filters button + active-chip summary ─ */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'center' }}
          sx={{ mb: 3 }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => setFiltersOpen(true)}
            sx={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              height: 48,
              px: 2.5,
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '12px',
              color: '#fff',
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: '0.04em',
              transition: 'all 180ms ease',
              '&:hover': { borderColor: OLIVE_BRIGHT, color: OLIVE_BRIGHT },
            }}
          >
            <TuneRoundedIcon sx={{ fontSize: 18 }} />
            {t.buyPage.filters}
            {activeChips.length > 0 && (
              <Box
                component="span"
                sx={{
                  ml: 0.5,
                  bgcolor: OLIVE_BRIGHT,
                  color: '#000',
                  borderRadius: 999,
                  px: 1,
                  py: '2px',
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {activeChips.length}
              </Box>
            )}
          </Box>

          {/* Active filter chips — clickable to remove individually */}
          {activeChips.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, flex: 1 }}>
              {activeChips.map((c) => (
                <Box
                  key={c.key}
                  component="button"
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, ...c.reset }))}
                  sx={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    bgcolor: 'rgba(140,141,37,0.16)',
                    border: '1px solid rgba(140,141,37,0.45)',
                    color: OLIVE_BRIGHT,
                    fontFamily: '"Arsenal SC", "Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: 12.5,
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 999,
                    '&:hover': { bgcolor: 'rgba(140,141,37,0.28)' },
                  }}
                >
                  {c.label}
                  <CloseRoundedIcon sx={{ fontSize: 14 }} />
                </Box>
              ))}
            </Stack>
          )}

          <Box sx={{ flex: 1 }} />
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.5)',
              alignSelf: { md: 'center' },
            }}
          >
            {loading
              ? '—'
              : (sorted.length === 1 ? t.buyPage.projectCountOne : t.buyPage.projectCountMany).replace('{n}', sorted.length)}
          </Typography>
        </Stack>

        {/* ── Grid ─────────────────────────────────────────────────── */}
        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{ borderRadius: '14px', overflow: 'hidden' }}>
                <Skeleton variant="rectangular" sx={{ paddingTop: '75%', bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Box sx={{ p: 2.5 }}>
                  <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.05)', width: '70%', height: 24 }} />
                  <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.05)', width: '50%', height: 18 }} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : sorted.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, color: 'rgba(255,255,255,0.5)' }}>
            <Typography sx={{ fontSize: 16 }}>{t.buyPage.emptyState}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {sorted.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                units={unitsByProject.get(p.id) || []}
                index={i}
                t={t}
                lang={lang}
              />
            ))}
          </Box>
        )}

        {/* ── Crawlable SEO block: "buy property in Oman" copy + FAQ ──
            Real localized text content on the listing page (cards alone
            carry almost no indexable text). Mirrored into the prerendered
            static /buy pages by prerender-routes.mjs. */}
        {(() => {
          const c = BUY_SEO[lang] || BUY_SEO.en
          const rtl = lang === 'fa' || lang === 'ar'
          return (
            <Box
              component="section"
              dir={rtl ? 'rtl' : 'ltr'}
              sx={{
                mt: { xs: 8, md: 12 },
                pt: { xs: 5, md: 7 },
                borderTop: '1px solid rgba(255,255,255,0.08)',
                maxWidth: 860,
                mx: 'auto',
                textAlign: rtl ? 'right' : 'left',
              }}
            >
              <Typography component="h2" sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 600, mb: 2.5, color: '#fff' }}>
                {c.heading}
              </Typography>
              {c.paras.map((p, i) => (
                <Typography key={i} sx={{ fontSize: 15.5, lineHeight: 1.85, color: 'rgba(255,255,255,0.72)', mb: 2 }}>
                  {p}
                </Typography>
              ))}
              <Box sx={{ mt: 4 }}>
                {c.faq.map((f, i) => (
                  <Box key={i} sx={{ mb: 2.5 }}>
                    <Typography component="h3" sx={{ fontSize: 16.5, fontWeight: 600, color: '#fff', mb: 0.75 }}>
                      {f.q}
                    </Typography>
                    <Typography sx={{ fontSize: 14.5, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>
                      {f.a}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography component="h3" sx={{ fontSize: 16.5, fontWeight: 600, color: '#fff', mt: 4, mb: 1 }}>
                {c.linksHeading}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {c.links.map((l) => (
                  <Box component="li" key={l.href} sx={{ mb: 0.75 }}>
                    <Typography
                      component={LocalizedLink}
                      to={l.href}
                      sx={{ fontSize: 14.5, color: '#8c8d25', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {l.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )
        })()}
      </Container>

      <BuyFiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        matchCount={matchCount}
      />
    </Box>
  )
}
