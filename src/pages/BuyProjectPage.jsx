/**
 * BuyProjectPage — /buy/:slug
 *
 * Detail view for a single development. Two layouts in one component:
 *   1) projects WITH live inventory  → hero + info + filter toolbar + unit
 *      list + small Mapbox map showing the project location, plus the
 *      shared Inquiry modal CTA.
 *   2) projects WITHOUT live inventory → hero + info + inline inquiry
 *      form (the same modal we use elsewhere) so the lead doesn't stall.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LocalizedLink as RouterLink, useLocalizedNavigate as useNavigate } from '../lib/localize.js'
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Skeleton,
  Button,
  Divider,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
// Feature/amenity line icons (MUI outlined — same thin-line language as the
// Figma "Features" spec). Mapped to stable feature keys in FEATURE_META below.
import WavesOutlined from '@mui/icons-material/WavesOutlined'
import WaterOutlined from '@mui/icons-material/WaterOutlined'
import TerrainOutlined from '@mui/icons-material/TerrainOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import GolfCourseOutlined from '@mui/icons-material/GolfCourseOutlined'
import BeachAccessOutlined from '@mui/icons-material/BeachAccessOutlined'
import SailingOutlined from '@mui/icons-material/SailingOutlined'
import PoolOutlined from '@mui/icons-material/PoolOutlined'
import HotelOutlined from '@mui/icons-material/HotelOutlined'
import SpaOutlined from '@mui/icons-material/SpaOutlined'
import FitnessCenterOutlined from '@mui/icons-material/FitnessCenterOutlined'
import RoomServiceOutlined from '@mui/icons-material/RoomServiceOutlined'
import RestaurantOutlined from '@mui/icons-material/RestaurantOutlined'
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined'
import SettingsRemoteOutlined from '@mui/icons-material/SettingsRemoteOutlined'
import ParkOutlined from '@mui/icons-material/ParkOutlined'
import DirectionsBikeOutlined from '@mui/icons-material/DirectionsBikeOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import LocalParkingOutlined from '@mui/icons-material/LocalParkingOutlined'
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchProjectUnits } from '../supabase'
import { getProjectDetails } from '../data/projectDetails.js'
import ProjectInquiryModal from '../components/ProjectInquiryModal'
import { slugify } from './BuyPage.jsx'
import { galleryFor, coverForSlug } from '../projectGallery.js'

const OLIVE = '#7c7856'
const OLIVE_BRIGHT = '#8c8d25'
const INDIGO = '#391FAF'

// Feature key → icon + localized label. `projectDetails.js` stores stable
// English keys so the icon mapping is locale-independent; the label is picked
// per active language here (falls back to English).
const FEATURE_META = {
  seaView:           { icon: WavesOutlined,            en: 'Sea View',           ar: 'إطلالة بحرية',       ru: 'Вид на море' },
  waterfront:        { icon: WaterOutlined,            en: 'Waterfront',         ar: 'واجهة بحرية',        ru: 'Набережная' },
  mountainView:      { icon: TerrainOutlined,          en: 'Mountain View',      ar: 'إطلالة جبلية',       ru: 'Вид на горы' },
  skyViews:          { icon: VisibilityOutlined,       en: 'Sky Views',          ar: 'إطلالات سماوية',     ru: 'Панорамные виды' },
  golfCourse:        { icon: GolfCourseOutlined,       en: 'Golf Course',        ar: 'ملعب غولف',          ru: 'Гольф-поле' },
  beachClub:         { icon: BeachAccessOutlined,      en: 'Beach Club',         ar: 'نادٍ شاطئي',         ru: 'Пляжный клуб' },
  beachAccess:       { icon: BeachAccessOutlined,      en: 'Beach Access',       ar: 'وصول للشاطئ',        ru: 'Выход к пляжу' },
  marina:            { icon: SailingOutlined,          en: 'Marina',             ar: 'مارينا',             ru: 'Марина' },
  infinityPool:      { icon: PoolOutlined,             en: 'Infinity Pool',      ar: 'مسبح لا متناهٍ',     ru: 'Бассейн-инфинити' },
  pool:              { icon: PoolOutlined,             en: 'Swimming Pool',      ar: 'مسبح',               ru: 'Бассейн' },
  privatePool:       { icon: PoolOutlined,             en: 'Private Pool',       ar: 'مسبح خاص',           ru: 'Частный бассейн' },
  fiveStarHotel:     { icon: HotelOutlined,            en: '5-Star Hotel',       ar: 'فندق 5 نجوم',        ru: '5-звёздочный отель' },
  spa:               { icon: SpaOutlined,              en: 'Spa & Wellness',     ar: 'سبا وعافية',         ru: 'Спа' },
  gym:               { icon: FitnessCenterOutlined,    en: 'Fitness Centre',     ar: 'صالة لياقة',         ru: 'Фитнес-центр' },
  concierge:         { icon: RoomServiceOutlined,      en: 'Concierge',          ar: 'كونسيرج',            ru: 'Консьерж' },
  butlerService:     { icon: RoomServiceOutlined,      en: 'Butler Service',     ar: 'خدمة الخادم الشخصي', ru: 'Сервис дворецкого' },
  retailDining:      { icon: RestaurantOutlined,       en: 'Retail & Dining',    ar: 'تجزئة ومطاعم',       ru: 'Магазины и рестораны' },
  fineDining:        { icon: RestaurantOutlined,       en: 'Fine Dining',        ar: 'مطاعم راقية',        ru: 'Высокая кухня' },
  brandedResidences: { icon: WorkspacePremiumOutlined, en: 'Branded Residences', ar: 'إقامات مُوقَّعة',    ru: 'Брендированные резиденции' },
  smartHome:         { icon: SettingsRemoteOutlined,   en: 'Smart Home',         ar: 'منزل ذكي',           ru: 'Умный дом' },
  landscapedGardens: { icon: ParkOutlined,             en: 'Landscaped Gardens', ar: 'حدائق منسّقة',       ru: 'Ландшафтные сады' },
  centralPark:       { icon: ParkOutlined,             en: 'Central Park',       ar: 'حديقة مركزية',       ru: 'Центральный парк' },
  cyclingPaths:      { icon: DirectionsBikeOutlined,   en: 'Cycling Paths',      ar: 'مسارات دراجات',      ru: 'Велодорожки' },
  schools:           { icon: SchoolOutlined,           en: 'Schools Nearby',     ar: 'مدارس قريبة',        ru: 'Школы рядом' },
  parking:           { icon: LocalParkingOutlined,     en: 'Parking',            ar: 'مواقف سيارات',       ru: 'Парковка' },
  freehold:          { icon: VerifiedOutlined,         en: 'Freehold Ownership', ar: 'تملّك حر',           ru: 'Полная собственность' },
}

const FEATURES_HEADING = {
  en: 'Features & amenities',
  ar: 'المزايا والمرافق',
  ru: 'Особенности и удобства',
  fa: 'امکانات و ویژگی‌ها',
}

const GALLERY_HEADING = {
  en: 'Gallery',
  ar: 'المعرض',
  ru: 'Галерея',
  fa: 'گالری تصاویر',
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN

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

// Optional looping video hero per project (files in public/video/). The cover
// image stays permanently mounted underneath as the instant LCP paint and
// iOS/fallback layer; the video fades in only once it is actually playing.
// preload="none" + lazy src assignment keep PageSpeed untouched, and
// reduced-motion / data-saver visitors never download a byte of it.
const HERO_VIDEO = {
  'hawana-salalah': { desktop: '/video/hawana-hero.mp4', mobile: '/video/hawana-hero-mobile.mp4' },
}

function HeroLoopVideo({ sources }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (navigator.connection?.saveData) return
    let started = false
    const start = () => {
      if (started) return
      started = true
      const mobile = window.matchMedia?.('(max-width: 900px)').matches
      video.src = mobile ? sources.mobile : sources.desktop
      video.play().catch(() => { /* autoplay blocked → cover image stays */ })
    }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { start(); io.disconnect() } },
      { rootMargin: '200px' },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [sources])

  return (
    <Box
      component="video"
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: playing ? 1 : 0,
        transition: 'opacity 700ms ease',
        pointerEvents: 'none',
      }}
    />
  )
}

function coverFor(project) {
  const slug = slugify(project.name)
  // Deterministic fallback by id so each project keeps a stable cover.
  const idx = (Number(project.id) || project.name.charCodeAt(0)) % PLACEHOLDER_POOL.length
  return {
    // Bundled gallery cover (src/assets/projects/<slug>/) wins over the
    // legacy /public drop-in path; placeholder stays as onError fallback.
    primary: coverForSlug(slug) || `/images/projects/${slug}.jpg`,
    fallback: PLACEHOLDER_POOL[idx],
  }
}

function fmtOmr(n) {
  if (n == null) return ''
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(n))
}

// Bedroom set + price stats for the toolbar.
function statsFor(units) {
  const bedSet = new Set()
  const typeSet = new Set()
  const viewSet = new Set()
  const prices = []
  for (const u of units) {
    if (u.bedrooms != null) bedSet.add(String(u.bedrooms))
    if (u.unit_type) typeSet.add(u.unit_type)
    if (u.view) viewSet.add(u.view)
    // Skip POA / unpriced units: Number(null) is 0, which would otherwise
    // sink Math.min to zero and break the "starting from" range display.
    if (u.price_omr != null) {
      const n = Number(u.price_omr)
      if (Number.isFinite(n) && n > 0) prices.push(n)
    }
  }
  return {
    bedrooms: [...bedSet].sort((a, b) => Number(a) - Number(b)),
    types: [...typeSet].sort(),
    views: [...viewSet].sort(),
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
  }
}

// ── small embedded map ─────────────────────────────────────────────────
function ProjectMap({ project }) {
  const ref = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!ref.current || !MAPBOX_TOKEN) return
    if (project.latitude == null || project.longitude == null) return

    const map = new mapboxgl.Map({
      container: ref.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [Number(project.longitude), Number(project.latitude)],
      zoom: 13.5,
      pitch: 30,
      attributionControl: false,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right')

    // Marker
    const wrap = document.createElement('div')
    wrap.style.cssText = `
      width: 22px; height: 22px;
      background: ${INDIGO};
      border: 2px solid rgba(255,255,255,0.95);
      border-radius: 50%;
      box-shadow: 0 6px 18px rgba(57,31,175,0.45), 0 0 0 6px rgba(57,31,175,0.25);
    `
    new mapboxgl.Marker({ element: wrap, anchor: 'center' })
      .setLngLat([Number(project.longitude), Number(project.latitude)])
      .addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [project.id, project.latitude, project.longitude])

  if (project.latitude == null || project.longitude == null) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: 13,
          bgcolor: 'rgba(255,255,255,0.04)',
        }}
      >
        Location coming soon
      </Box>
    )
  }
  return <Box ref={ref} sx={{ width: '100%', height: '100%' }} />
}

// ── unit row ──────────────────────────────────────────────────────────
function UnitRow({ unit, onSelect, t }) {
  const p = t.buyProjectPage
  const view = unit.view ? `, ${unit.view} ${p.viewLabel}` : ''
  const floor = unit.floor_label ? ` · ${unit.floor_label} ${p.floorLabel}` : ''
  const bed = unit.bedrooms == null ? p.studio : `${unit.bedrooms}${p.bedShort}`
  const sqm = unit.total_area_sqm ? `${Math.round(Number(unit.total_area_sqm))} m²` : '—'
  const status = (unit.availability_status || 'available').toLowerCase()

  return (
    <Box
      onClick={onSelect}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1.2fr 0.8fr 0.7fr auto', md: '1.4fr 0.8fr 0.7fr auto' },
        gap: 2,
        alignItems: 'center',
        px: { xs: 2, md: 3 },
        py: 2,
        cursor: onSelect ? 'pointer' : 'default',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        transition: 'background-color 180ms ease',
        '&:hover': onSelect ? { bgcolor: 'rgba(255,255,255,0.03)' } : {},
      }}
    >
      <Box>
        <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 14.5, fontWeight: 600, color: '#fff' }}>
          {bed} {unit.unit_type || p.unitLabel}
        </Typography>
        <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', mt: 0.25 }}>
          {sqm}{view}{floor}
          {status === 'reserved' && (
            <Box component="span" sx={{ ml: 1, color: '#e7a23e' }}>· reserved</Box>
          )}
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: { md: 'left' } }}>
        {unit.layout_type ? `${p.layoutLabel} ${unit.layout_type}` : ''}
      </Typography>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 10.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {p.fromLabel}
        </Typography>
        <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 15, fontWeight: 600, color: OLIVE_BRIGHT, mt: 0.25 }}>
          OMR {fmtOmr(unit.price_omr)}
        </Typography>
      </Box>
      <ChevronRightRoundedIcon sx={{ color: 'rgba(255,255,255,0.35)' }} />
    </Box>
  )
}

// ── main page ─────────────────────────────────────────────────────────
export default function BuyProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useI18n()

  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  // filter state for inventory section
  const [bedFilter, setBedFilter] = useState('any')
  const [viewFilter, setViewFilter] = useState('any')
  // ?release=<key> (from the /buy Salalah releases row) preselects a sub-project.
  const [subFilter, setSubFilter] = useState(() => {
    try { return new URLSearchParams(window.location.search).get('release') } catch { return null }
  })
  const [sortBy, setSortBy] = useState('price-asc')

  const [inquiryUnit, setInquiryUnit] = useState(null)
  const [inquiryOpen, setInquiryOpen] = useState(false)

  // Find project by slug
  const project = useMemo(() => {
    return projects.find((p) => slugify(p.name) === slug) || null
  }, [projects, slug])

  useEffect(() => {
    let cancelled = false
    fetchProjects()
      .then((data) => { if (!cancelled) setProjects(data || []) })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  // Load units once we know the project id.
  useEffect(() => {
    if (!project?.id) return
    let cancelled = false
    fetchProjectUnits(project.id)
      .then((data) => {
        if (cancelled) return
        const live = (data || []).filter((u) => {
          const s = (u.availability_status || '').toLowerCase()
          return s === 'available' || s === 'reserved'
        })
        setUnits(live)
      })
    return () => { cancelled = true }
  }, [project?.id])

  // Structured data for search engines: the project as a real-estate listing
  // plus a breadcrumb trail. Rebuilt when the project/units/language change,
  // removed on unmount so other routes don't inherit it.
  useEffect(() => {
    if (!project) return
    const prices = units
      .map((u) => Number(u.price_omr))
      .filter((n) => Number.isFinite(n) && n > 0)
    const url = `https://www.irfaninvest.com${lang === 'en' ? '' : `/${lang}`}/buy/${slugify(project.name)}`
    const listing = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: project.name,
      url,
      image: `https://www.irfaninvest.com${coverFor(project).primary}`,
      address: { '@type': 'PostalAddress', addressCountry: 'OM', addressLocality: project.city || 'Muscat' },
      ...(prices.length
        ? {
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'OMR',
              lowPrice: Math.min(...prices),
              highPrice: Math.max(...prices),
              offerCount: units.length,
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
      provider: { '@type': 'RealEstateAgent', name: 'Irfan Investment Group', url: 'https://www.irfaninvest.com' },
    }
    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.irfaninvest.com/' },
        { '@type': 'ListItem', position: 2, name: 'Buy', item: 'https://www.irfaninvest.com/buy' },
        { '@type': 'ListItem', position: 3, name: project.name, item: url },
      ],
    }
    const tags = [listing, breadcrumbs].map((data) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.setAttribute('data-project-jsonld', '1')
      el.textContent = JSON.stringify(data)
      document.head.appendChild(el)
      return el
    })
    return () => tags.forEach((el) => el.remove())
  }, [project, units, lang])

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#000', minHeight: '100vh', pt: 8 }}>
        <Container maxWidth="xl">
          <Skeleton variant="rectangular" sx={{ height: 360, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Container>
      </Box>
    )
  }

  if (!project) {
    return (
      <Box sx={{ bgcolor: '#000', minHeight: '100vh', pt: 8, pb: 12, color: '#fff' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 36, fontWeight: 300, mb: 2 }}>
            {t.buyProjectPage.notFoundTitle}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
            {t.buyProjectPage.notFoundBody.replace('{slug}', slug)}
          </Typography>
          <Button
            component={RouterLink}
            to="/buy"
            variant="contained"
            sx={{ bgcolor: OLIVE_BRIGHT, '&:hover': { bgcolor: OLIVE }, color: '#000', fontWeight: 600 }}
          >
            {t.buyProjectPage.backToBuy}
          </Button>
        </Container>
      </Box>
    )
  }

  const details = getProjectDetails(project.name, lang)
  const cover = coverFor(project)
  const isItc = !!project.area?.is_itc
  const stats = statsFor(units)
  const hasInventory = units.length > 0

  // Sub-projects (Muriya portfolio pages): by default the inventory shows
  // ALL releases; selecting a card filters, selecting it again clears.
  const subProjects = details?.subProjects || null
  const activeSub = subProjects ? subFilter : null

  // Filter + sort
  const filteredUnits = units
    .filter((u) => {
      if (activeSub && (u.subproject || '') !== activeSub) return false
      if (bedFilter !== 'any' && String(u.bedrooms) !== bedFilter) return false
      if (viewFilter !== 'any' && u.view !== viewFilter) return false
      return true
    })
    .sort((a, b) => {
      const pa = Number(a.price_omr) || 0
      const pb = Number(b.price_omr) || 0
      if (sortBy === 'price-asc') return pa - pb
      if (sortBy === 'price-desc') return pb - pa
      if (sortBy === 'size-asc') return (Number(a.total_area_sqm) || 0) - (Number(b.total_area_sqm) || 0)
      if (sortBy === 'size-desc') return (Number(b.total_area_sqm) || 0) - (Number(a.total_area_sqm) || 0)
      return 0
    })

  const openInquiry = (unit) => {
    setInquiryUnit(unit || null)
    setInquiryOpen(true)
  }

  return (
    <Box sx={{ bgcolor: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 420, md: 560 },
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={cover.primary}
          onError={(e) => {
            if (e.currentTarget.src.endsWith(cover.fallback)) return
            e.currentTarget.src = cover.fallback
          }}
          alt={project.name}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {HERO_VIDEO[slugify(project.name)] && (
          <HeroLoopVideo sources={HERO_VIDEO[slugify(project.name)]} />
        )}
        {/* Vignette */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.55) 75%, #000 100%)',
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pt: { xs: 5, md: 7 }, pb: { xs: 5, md: 7 }, minHeight: { xs: 420, md: 560 } }}>
          {/* Back link */}
          <Button
            component={RouterLink}
            to="/buy"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              alignSelf: 'flex-start',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 13,
              textTransform: 'none',
              mb: 'auto',
              '&:hover': { color: '#fff', bgcolor: 'transparent' },
            }}
          >
            {t.buyProjectPage.allProjects}
          </Button>

          <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 'auto' }}>
            {isItc && (
              <Chip
                label="ITC zone · foreign ownership allowed"
                size="small"
                sx={{
                  bgcolor: 'rgba(140,141,37,0.92)',
                  color: '#fff',
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              />
            )}
            {hasInventory && (
              <Chip
                label={t.buyProjectPage.unitsAvailable.replace('{n}', units.length)}
                size="small"
                sx={{
                  bgcolor: 'rgba(57,31,175,0.92)',
                  color: '#fff',
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              />
            )}
          </Stack>

          <Typography
            component="h1"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 300,
              fontSize: { xs: 38, sm: 52, md: 72 },
              lineHeight: 1,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            {project.name}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'rgba(255,255,255,0.85)' }}>
            <PlaceRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: { xs: 14, md: 16 } }}>
              {[project.area?.name, project.area?.city, project.area?.governorate].filter(Boolean).join(' · ')}
            </Typography>
            {project.developer?.name && (
              <>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)' }} />
                <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: { xs: 14, md: 16 } }}>
                  {project.developer.name}
                </Typography>
              </>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 10, md: 14 } }}>
        {/* ── Info row: tagline / description / stats ─────────────── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
            gap: { xs: 4, md: 8 },
            mb: { xs: 5, md: 8 },
          }}
        >
          <Box>
            {details?.tagline && (
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontStyle: 'italic',
                  fontSize: { xs: 20, md: 26 },
                  color: 'rgba(255,255,255,0.92)',
                  mb: 2,
                  lineHeight: 1.3,
                }}
              >
                {details.tagline}
              </Typography>
            )}
            {details?.description && (
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: { xs: 16.5, md: 19 },
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.65,
                  maxWidth: 680,
                }}
              >
                {details.description}
              </Typography>
            )}

            {/* Multi-section project copy (overview / location / design /
                investment) — richer, SEO-friendly body content. */}
            {Array.isArray(details?.sections) && details.sections.length > 0 && (
              <Stack spacing={{ xs: 3, md: 3.5 }} sx={{ mt: { xs: 4, md: 5 }, maxWidth: 680 }}>
                {details.sections.map((s, i) => (
                  <Box key={i}>
                    <Typography
                      component="h2"
                      sx={{
                        fontFamily: '"Arsenal SC", "Inter", sans-serif',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: OLIVE_BRIGHT,
                        mb: 1,
                      }}
                    >
                      {s.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Arsenal SC", "Inter", sans-serif',
                        fontSize: { xs: 15.5, md: 17 },
                        color: 'rgba(255,255,255,0.74)',
                        lineHeight: 1.7,
                      }}
                    >
                      {s.body}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <Box
            sx={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              p: { xs: 3, md: 4 },
              bgcolor: 'rgba(255,255,255,0.02)',
            }}
          >
            <Stack spacing={2.5} divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />}>
              {hasInventory && stats.minPrice != null && (
                <Box>
                  <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.buyProjectPage.priceRange}</Typography>
                  <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 22, fontWeight: 600, color: OLIVE_BRIGHT, mt: 0.5 }}>
                    OMR {fmtOmr(stats.minPrice)} – {fmtOmr(stats.maxPrice)}
                  </Typography>
                </Box>
              )}
              {(details?.bedrooms || stats.bedrooms.length > 0) && (
                <Box>
                  <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.buyProjectPage.bedrooms}</Typography>
                  <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 16, color: '#fff', mt: 0.5 }}>
                    {stats.bedrooms.length ? stats.bedrooms.join(', ') : details.bedrooms}
                  </Typography>
                </Box>
              )}
              {(details?.units || stats.types.length > 0) && (
                <Box>
                  <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.buyProjectPage.types}</Typography>
                  <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 16, color: '#fff', mt: 0.5 }}>
                    {stats.types.length ? stats.types.join(', ') : (details.units || []).join(', ')}
                  </Typography>
                </Box>
              )}
              {details?.handover && (
                <Box>
                  <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.buyProjectPage.handover}</Typography>
                  <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 16, color: '#fff', mt: 0.5 }}>{details.handover}</Typography>
                </Box>
              )}
              <Button
                onClick={() => openInquiry(null)}
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: OLIVE_BRIGHT,
                  color: '#000',
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: 14,
                  textTransform: 'none',
                  letterSpacing: '0.04em',
                  borderRadius: '10px',
                  '&:hover': { bgcolor: OLIVE },
                }}
              >
                {t.buyProjectPage.requestFloorplans}
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* ── Gallery (all bundled images beyond the hero cover) ───── */}
        {galleryFor(slugify(project.name)).length > 1 && (
          <Box sx={{ mb: { xs: 6, md: 9 }, pt: { xs: 1, md: 2 }, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontWeight: 300,
                fontSize: { xs: 24, md: 30 },
                letterSpacing: '-0.01em',
                mt: { xs: 4, md: 5 },
                mb: { xs: 3, md: 4 },
              }}
            >
              {GALLERY_HEADING[lang] || GALLERY_HEADING.en}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2, md: 3 },
              }}
            >
              {galleryFor(slugify(project.name)).slice(1).map((src, i) => (
                <Box
                  key={src}
                  component="img"
                  src={src}
                  alt={`${project.name} ${i + 2}`}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    aspectRatio: '16 / 10',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    display: 'block',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* ── Features & amenities (icon grid, Figma 378-17112) ────── */}
        {Array.isArray(details?.features) && details.features.length > 0 && (
          <Box sx={{ mb: { xs: 6, md: 9 }, pt: { xs: 1, md: 2 }, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontWeight: 300,
                fontSize: { xs: 24, md: 30 },
                letterSpacing: '-0.01em',
                mt: { xs: 4, md: 5 },
                mb: { xs: 3, md: 4 },
              }}
            >
              {FEATURES_HEADING[lang] || FEATURES_HEADING.en}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
                columnGap: { xs: 2, md: 6 },
                rowGap: { xs: 2, md: 2.75 },
                maxWidth: 920,
              }}
            >
              {details.features.map((key) => {
                const meta = FEATURE_META[key]
                if (!meta) return null
                const Icon = meta.icon
                return (
                  <Stack key={key} direction="row" spacing={1.5} alignItems="center">
                    <Icon sx={{ fontSize: 22, color: OLIVE_BRIGHT, flexShrink: 0 }} />
                    <Typography
                      sx={{
                        fontFamily: '"Arsenal SC", "Inter", sans-serif',
                        fontSize: { xs: 14.5, md: 16 },
                        color: 'rgba(255,255,255,0.86)',
                      }}
                    >
                      {meta[lang] || meta.en}
                    </Typography>
                  </Stack>
                )
              })}
            </Box>
          </Box>
        )}

        {/* ── Sub-projects / releases (Muriya portfolio pages) ────── */}
        {subProjects && (() => {
          // Heading adapts to how many releases the project currently sells.
          const N_TITLE = {
            en: { 1: 'The current release', 2: 'Two releases, one portfolio', 3: 'Three releases, one portfolio' },
            ru: { 1: 'Текущий релиз', 2: 'Два релиза — один портфель', 3: 'Три релиза — один портфель' },
            ar: { 1: 'الإصدار الحالي', 2: 'إصداران في محفظة واحدة', 3: 'ثلاثة إصدارات في محفظة واحدة' },
            fa: { 1: 'عرضه فعلی', 2: 'دو عرضه در یک مجموعه', 3: 'سه عرضه در یک مجموعه' },
          }
          const SUB_L = {
            en: { eyebrow: 'Communities', unitsFrom: '{n} homes · from OMR {p}', onRequest: 'Floor plans & prices on request' },
            ru: { eyebrow: 'Районы', unitsFrom: '{n} лотов · от {p} OMR', onRequest: 'Планировки и цены по запросу' },
            ar: { eyebrow: 'المجتمعات', unitsFrom: '{n} وحدات · من {p} ر.ع', onRequest: 'المخططات والأسعار عند الطلب' },
            fa: { eyebrow: 'ریزپروژه‌ها', unitsFrom: '{n} واحد · از {p} ریال عمان', onRequest: 'پلان‌ها و قیمت‌ها با درخواست' },
          }
          const L = SUB_L[lang] || SUB_L.en
          const nTitles = N_TITLE[lang] || N_TITLE.en
          L.title = nTitles[subProjects.length] || nTitles[3]
          const mainSlug = slugify(project.name)
          return (
            <Box sx={{ mb: { xs: 7, md: 9 } }}>
              <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase', mb: 1 }}>
                {L.eyebrow}
              </Typography>
              <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: { xs: 26, md: 34 }, fontWeight: 300, letterSpacing: '-0.01em', mb: 3 }}>
                {L.title}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${Math.min(subProjects.length, 3)}, 1fr)` }, gap: 2.5 }}>
                {subProjects.map((sub) => {
                  const subUnits = units.filter((u) => (u.subproject || '') === sub.key)
                  const minP = subUnits.length
                    ? Math.min(...subUnits.map((u) => Number(u.price_omr) || Infinity))
                    : null
                  const img = galleryFor(sub.gallerySlug)[0] || galleryFor(mainSlug)[0]
                  const selected = activeSub === sub.key
                  return (
                    <Box
                      key={sub.key}
                      component="button"
                      type="button"
                      onClick={() => setSubFilter(selected ? null : sub.key)}
                      sx={{
                        textAlign: 'start',
                        cursor: 'pointer',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        p: 0,
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: selected ? '1px solid rgba(45,212,191,0.85)' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: selected ? '0 0 22px rgba(20,184,166,0.45)' : 'none',
                        transition: 'border-color .25s, box-shadow .25s, transform .25s',
                        '&:hover': { transform: 'translateY(-3px)', borderColor: 'rgba(45,212,191,0.6)' },
                      }}
                    >
                      {img && (
                        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', bgcolor: '#111' }}>
                          <Box component="img" src={img} alt={sub.name} loading="lazy"
                            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      )}
                      <Box sx={{ p: 2.2 }}>
                        <Typography sx={{ fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', mb: 0.4 }}>
                          {sub.name}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Inter", "Peyda", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', mb: 1 }}>
                          {sub.location}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Inter", "Peyda", sans-serif', fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)', mb: 1.4 }}>
                          {sub.blurb?.[lang] || sub.blurb?.en}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Arsenal SC", "Peyda", "Inter", sans-serif', fontWeight: 700, fontSize: 13.5, color: selected ? '#2dd4bf' : 'rgba(255,255,255,0.85)' }}>
                          {subUnits.length && minP != null && Number.isFinite(minP)
                            ? L.unitsFrom.replace('{n}', subUnits.length).replace('{p}', minP.toLocaleString())
                            : L.onRequest}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )
        })()}

        {/* ── Inventory section (only if there are live units) ────── */}
        {hasInventory ? (
          <Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 3 }}>
              <Box>
                <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase', mb: 1 }}>
                  {t.buyProjectPage.availableUnits}
                </Typography>
                <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: { xs: 28, md: 36 }, fontWeight: 300, letterSpacing: '-0.01em' }}>
                  {t.buyProjectPage.liveInventory}
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.6)' }}>
                {t.buyProjectPage.filteredCount.replace('{shown}', filteredUnits.length).replace('{total}', units.length)}
              </Typography>
            </Stack>

            {/* Filter toolbar */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr) auto' },
                gap: 0,
                mb: 3,
              }}
            >
              <Box sx={{ border: '1px solid #fff', borderRight: { md: 'none' }, height: 52, px: 2.5, display: 'flex', alignItems: 'center' }}>
                <Box
                  component="select"
                  value={bedFilter}
                  onChange={(e) => setBedFilter(e.target.value)}
                  sx={{
                    flex: 1, bgcolor: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 14,
                    appearance: 'none',
                  }}
                >
                  <option value="any" style={{ background: '#000' }}>{t.buyProjectPage.anyBedrooms}</option>
                  {stats.bedrooms.map((b) => (
                    <option key={b} value={b} style={{ background: '#000' }}>
                      {b === '0'
                        ? t.buyProjectPage.studio
                        : (b === '1' ? t.buyProjectPage.bedroomSingular : t.buyProjectPage.bedroomPlural).replace('{n}', b)}
                    </option>
                  ))}
                </Box>
              </Box>
              <Box sx={{ border: '1px solid #fff', borderLeft: { md: 'none' }, borderRight: { md: 'none' }, height: 52, px: 2.5, display: 'flex', alignItems: 'center' }}>
                <Box
                  component="select"
                  value={viewFilter}
                  onChange={(e) => setViewFilter(e.target.value)}
                  sx={{
                    flex: 1, bgcolor: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 14,
                    appearance: 'none',
                  }}
                >
                  <option value="any" style={{ background: '#000' }}>{t.buyProjectPage.anyView}</option>
                  {stats.views.map((v) => (
                    <option key={v} value={v} style={{ background: '#000' }}>{v}</option>
                  ))}
                </Box>
              </Box>
              <Box sx={{ border: '1px solid #fff', height: 52, px: 2.5, display: 'flex', alignItems: 'center', gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                <Box
                  component="select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    flex: 1, bgcolor: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 14,
                    appearance: 'none',
                  }}
                >
                  <option value="price-asc" style={{ background: '#000' }}>{t.buyProjectPage.sort.priceAsc}</option>
                  <option value="price-desc" style={{ background: '#000' }}>{t.buyProjectPage.sort.priceDesc}</option>
                  <option value="size-asc" style={{ background: '#000' }}>{t.buyProjectPage.sort.sizeAsc}</option>
                  <option value="size-desc" style={{ background: '#000' }}>{t.buyProjectPage.sort.sizeDesc}</option>
                </Box>
              </Box>
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #fff',
                  height: 52, px: 3,
                  bgcolor: '#fff', color: '#000',
                  fontFamily: '"Arsenal SC", "Inter", sans-serif', fontSize: 13, fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {filteredUnits.length} results
              </Box>
            </Box>

            {/* Unit list + map side-by-side */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 3, md: 3 },
                alignItems: 'stretch',
              }}
            >
              <Box
                sx={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  maxHeight: { md: 620 },
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': { width: 6 },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3 },
                }}
              >
                {filteredUnits.length === 0 ? (
                  <Box sx={{ p: 6, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    <Typography sx={{ fontSize: 14 }}>No units match your filters.</Typography>
                  </Box>
                ) : (
                  filteredUnits.map((u, i) => (
                    <UnitRow key={i} unit={u} onSelect={() => openInquiry(u)} t={t} />
                  ))
                )}
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  minHeight: { xs: 320, md: 620 },
                }}
              >
                <ProjectMap project={project} />
              </Box>
            </Box>
          </Box>
        ) : (
          // ── No live inventory — inquiry CTA panel ──
          <Box
            sx={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              bgcolor: 'rgba(255,255,255,0.02)',
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              Inventory being finalised
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontWeight: 300,
                fontSize: { xs: 26, md: 34 },
                letterSpacing: '-0.01em',
                mb: 2,
              }}
            >
              Talk to a broker for current options
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: { xs: 14.5, md: 16 },
                color: 'rgba(255,255,255,0.65)',
                maxWidth: 540,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Listings for {project.name} are not yet on our public board, but our
              broker can share floor plans, payment plans, and off-market
              opportunities tailored to your budget and timeline.
            </Typography>
            <Button
              onClick={() => openInquiry(null)}
              variant="contained"
              sx={{
                bgcolor: OLIVE_BRIGHT,
                color: '#000',
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontWeight: 600,
                py: 1.5,
                px: 5,
                fontSize: 14,
                textTransform: 'none',
                letterSpacing: '0.04em',
                borderRadius: '10px',
                '&:hover': { bgcolor: OLIVE },
              }}
            >
              Request a callback
            </Button>
          </Box>
        )}
      </Container>

      <ProjectInquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        project={project}
        unit={inquiryUnit}
      />
    </Box>
  )
}
