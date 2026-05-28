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
import { Link as RouterLink } from 'react-router-dom'
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
  // Try a project-specific image first (drop-in convention), else round-robin.
  const slug = slugify(project.name)
  const specific = `/images/projects/${slug}.jpg`
  // Browsers won't error if missing; we leave fallback to onError below.
  return { primary: specific, fallback: PLACEHOLDER_POOL[index % PLACEHOLDER_POOL.length] }
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
function ProjectCard({ project, units, index, t, lang }) {
  const details = getProjectDetails(project.name, lang)
  const cover = coverFor(project, index)
  const minPrice = priceFrom(units)
  const isItc = !!project.area?.is_itc
  const slug = slugify(project.name)

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
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 220ms ease, box-shadow 320ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'rgba(255,255,255,0.18)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
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
        const hay = [p.name, p.area?.name, p.area?.city, p.area?.governorate, p.developer?.name]
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
