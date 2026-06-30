/**
 * MaisonShirdelPage — /maison-shirdel
 *
 * The luxury sub-brand showcase. Lists every available unit priced
 * over OMR 200,000 — i.e. the high-end inventory we steward under
 * the Maison Shirdel umbrella.
 *
 * Design intent (per client direction):
 *   • Olive #7C7856 carries the whole page as the primary accent
 *     (instead of the lime OLIVE_BRIGHT used on /buy).
 *   • Maison Shirdel wordmark sits at the top of the hero.
 *   • Editorial copy on the luxury / major-investment specialism.
 *   • Unit cards group by project so the user can see "the four
 *     buildings we curate at this tier" before scrolling into stock.
 *
 * Filtering happens client-side on the same fetchAllUnits payload
 * the /buy page already uses, so the live AI agent and the visible
 * page stay in sync without a second SQL trip.
 */

import { useEffect, useMemo, useState } from 'react'
import { LocalizedLink as RouterLink } from '../lib/localize.js'
import { Box, Container, Typography, Stack, Skeleton } from '@mui/material'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { getProjectDetails } from '../data/projectDetails.js'
import { slugify } from './BuyPage.jsx'

const MAISON = '#7C7856'           // primary brand olive
const MAISON_BRIGHT = '#A39E72'    // hover / highlight
const LUX_THRESHOLD = 200_000      // OMR — unit price minimum for this tier

// Stock cover photos — same convention as /buy: per-project image if
// it exists in /public/images/projects/<slug>.jpg, else a rotating
// fallback. Luxury-toned stock keeps the page coherent until client
// hands over hero photography.
const COVER_POOL = [
  '/images/luxury-1.jpg',
  '/images/luxury-2.jpg',
  '/images/luxury-3.jpg',
  '/images/luxury-4.jpg',
  '/images/waterfront-bg-v2.jpg',
]

function coverFor(project, index) {
  const slug = slugify(project.name)
  return {
    primary: `/images/projects/${slug}.jpg`,
    fallback: COVER_POOL[index % COVER_POOL.length],
  }
}

function fmtOmr(n) {
  if (n == null) return ''
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
}

// Reduce a set of units to entry-from / max prices, ignoring nulls
// and zeros (same trick as the BuyPage fix so POA units don't sink
// Math.min to zero).
function priceStats(units) {
  const prices = units
    .map((u) => u.price_omr)
    .filter((p) => p != null && Number(p) > 0)
    .map(Number)
  if (!prices.length) return { min: null, max: null }
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

// ── Project card ──────────────────────────────────────────────────
function MaisonProjectCard({ project, units, index, t, lang }) {
  const m = t.maisonShirdelPage
  const details = getProjectDetails(project.name, lang)
  const cover = coverFor(project, index)
  const { min, max } = priceStats(units)
  const slug = slugify(project.name)
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
        borderRadius: '18px',
        overflow: 'hidden',
        bgcolor: 'rgba(255,255,255,0.02)',
        border: `1px solid ${MAISON}3D`, // ~24% alpha
        transition: 'transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 280ms ease, box-shadow 380ms ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: MAISON,
          boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px ${MAISON}80`,
        },
        '&:hover .mc-img': { transform: 'scale(1.06)' },
        '&:hover .mc-arrow': { opacity: 1, transform: 'translate(0,0)' },
      }}
    >
      {/* Cover image */}
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', bgcolor: '#111' }}>
        <Box
          component="img"
          className="mc-img"
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
            transition: 'transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)',
          }}
        />

        {/* Unit badge — olive-tinted to match the rest of the page */}
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            bgcolor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            border: `1px solid ${MAISON}`,
            borderRadius: 999,
            px: 1.5,
            py: 0.6,
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <VerifiedRoundedIcon sx={{ fontSize: 14, color: MAISON_BRIGHT }} />
          {(units.length === 1 ? m.luxuryUnitsOne : m.luxuryUnitsMany).replace('{n}', units.length)}
        </Box>

        {/* Bottom gradient + arrow on hover */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          className="mc-arrow"
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            opacity: 0,
            transform: 'translate(8px, -8px)',
            transition: 'opacity 280ms ease, transform 280ms ease',
            bgcolor: MAISON,
            color: '#fff',
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowOutwardRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>

      {/* Meta */}
      <Box sx={{ p: { xs: 2.25, md: 3 } }}>
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: { xs: 18, md: 22 },
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            mb: 0.75,
          }}
        >
          {project.name}
        </Typography>

        {location && (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
            <PlaceRoundedIcon sx={{ fontSize: 14, color: MAISON_BRIGHT }} />
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 12.5,
                color: 'rgba(255,255,255,0.65)',
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
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {dev}
          </Typography>
        )}

        <Box
          sx={{
            pt: 1.75,
            borderTop: `1px solid ${MAISON}33`,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 10.5,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            {m.entryPrice}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 17, md: 19 },
              fontWeight: 700,
              color: MAISON_BRIGHT,
              lineHeight: 1.15,
            }}
          >
            {fmtOmr(min)}
            {max != null && max !== min && (
              <Box component="span" sx={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500, fontSize: '0.75em', ml: 0.75 }}>
                — {fmtOmr(max)}
              </Box>
            )}
          </Typography>
          {details?.handover && (
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                mt: 0.75,
              }}
            >
              {m.handover} · {details.handover}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function MaisonShirdelPage() {
  const { t, lang } = useI18n()
  const m = t.maisonShirdelPage
  const [projects, setProjects] = useState([])
  const [allUnits, setAllUnits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchProjects(), fetchAllUnits()])
      .then(([projs, units]) => {
        if (cancelled) return
        setProjects(projs || [])
        setAllUnits(units || [])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  // Bucket only the luxury-tier units (> threshold) by project,
  // then keep only projects that actually have qualifying stock.
  const luxByProject = useMemo(() => {
    const m = new Map()
    for (const u of allUnits) {
      if (u.availability_status !== 'available') continue
      if (!(Number(u.price_omr) > LUX_THRESHOLD)) continue
      if (!m.has(u.project_id)) m.set(u.project_id, [])
      m.get(u.project_id).push(u)
    }
    return m
  }, [allUnits])

  const luxProjects = useMemo(() => {
    return projects
      .filter((p) => luxByProject.has(p.id))
      .sort((a, b) => {
        const ua = luxByProject.get(a.id) || []
        const ub = luxByProject.get(b.id) || []
        // Most expensive entry-from first — leads with the marquee tower.
        const minA = priceStats(ua).min ?? 0
        const minB = priceStats(ub).min ?? 0
        return minB - minA
      })
  }, [projects, luxByProject])

  const totalLuxUnits = useMemo(
    () => Array.from(luxByProject.values()).reduce((n, arr) => n + arr.length, 0),
    [luxByProject],
  )

  return (
    <Box component="main" sx={{ bgcolor: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 9, md: 14 },
          overflow: 'hidden',
          // Subtle olive wash — diagonal so it reads as a "frame" not a flat tint.
          background: `
            radial-gradient(60% 80% at 80% 10%, ${MAISON}26 0%, transparent 60%),
            radial-gradient(60% 80% at 10% 90%, ${MAISON}1A 0%, transparent 55%),
            #000
          `,
        }}
      >
        {/* Decorative pattern echo from the AboutFounder section. */}
        <Box
          component="img"
          src="/patterns/about-pattern.svg"
          alt=""
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '180%', md: '120%' },
            maxWidth: 'none',
            opacity: 0.16,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          {/*
            Center alignment is forced two ways for safety:
            • Outer wrapper uses `text-align: center` so inline-block
              content (the logo img we set to inline-block + mx:auto)
              centers naturally.
            • Every Typography below also gets an explicit
              `mx: 'auto'` + `maxWidth` so they don't stretch to the
              container edge and lose their visual centering on
              narrow viewports.
          */}
          <Box sx={{ textAlign: 'center', maxWidth: 880, mx: 'auto' }}>
            <Box
              component="img"
              src="/maison-shirdel-logo.png"
              alt="Maison Shirdel — Defined by Elegance"
              sx={{
                width: { xs: 240, md: 320 },
                height: 'auto',
                display: 'block',
                mx: 'auto',
                mb: { xs: 3, md: 4 },
                filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.55))',
              }}
            />

            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: MAISON_BRIGHT,
                mb: 2,
                textAlign: 'center',
              }}
            >
              {m.eyebrow}
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontWeight: 700,
                fontSize: { xs: 30, sm: 38, md: 50 },
                lineHeight: 1.08,
                letterSpacing: '-0.015em',
                mb: { xs: 2.5, md: 3 },
                textAlign: 'center',
                mx: 'auto',
              }}
            >
              {m.title1}{' '}
              <Box component="span" sx={{ color: MAISON_BRIGHT }}>{m.title2}</Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: { xs: 14.5, md: 16.5 },
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.65,
                maxWidth: 720,
                mx: 'auto',
                textAlign: 'center',
              }}
            >
              {m.heroBody}
            </Typography>

            {/* Quick stats strip — itself centered inside the hero
                column so it doesn't drift to one side on tablet. */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2.5, sm: 5 }}
              justifyContent="center"
              alignItems="center"
              divider={
                <Box
                  sx={{
                    width: { xs: 40, sm: 1 },
                    height: { xs: 1, sm: 40 },
                    bgcolor: `${MAISON}66`,
                    alignSelf: 'center',
                  }}
                />
              }
              sx={{
                mt: { xs: 4, md: 5 },
                mx: 'auto',
                width: 'fit-content',
                maxWidth: '100%',
                px: { xs: 3, md: 5 },
                py: { xs: 2.5, md: 3 },
                border: `1px solid ${MAISON}4D`,
                borderRadius: '14px',
                bgcolor: 'rgba(255,255,255,0.015)',
              }}
            >
              <Stat label={m.statLuxury} value={loading ? '—' : `${totalLuxUnits}+`} />
              <Stat label={m.statCurated} value={loading ? '—' : `${luxProjects.length}`} />
              <Stat label={m.statEntry} value={m.statEntryValue} />
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ── Listing ───────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ md: 'flex-end' }}
          sx={{ mb: { xs: 4, md: 5 }, gap: 2 }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: MAISON_BRIGHT,
                mb: 1.25,
              }}
            >
              {m.collectionEyebrow}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontWeight: 700,
                fontSize: { xs: 26, md: 36 },
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                mb: 1.5,
              }}
            >
              {m.collectionTitle}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: { xs: 14, md: 15.5 },
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.6,
                maxWidth: 640,
              }}
            >
              {m.collectionBody}
            </Typography>
          </Box>
        </Stack>

        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ borderRadius: '18px', overflow: 'hidden', border: `1px solid ${MAISON}33` }}>
                <Skeleton variant="rectangular" sx={{ paddingTop: '75%', bgcolor: 'rgba(255,255,255,0.04)' }} />
                <Box sx={{ p: 2.5 }}>
                  <Skeleton sx={{ bgcolor: 'rgba(255,255,255,0.05)', width: '60%', height: 26 }} />
                  <Skeleton sx={{ bgcolor: 'rgba(255,255,255,0.05)', width: '40%', height: 18 }} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : luxProjects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, color: 'rgba(255,255,255,0.5)' }}>
            <Typography sx={{ fontSize: 16 }}>{m.emptyState}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 2.5, md: 3.5 },
            }}
          >
            {luxProjects.map((p, i) => (
              <MaisonProjectCard
                key={p.id}
                project={p}
                units={luxByProject.get(p.id) || []}
                index={i}
                t={t}
                lang={lang}
              />
            ))}
          </Box>
        )}
      </Container>

      {/* ── Bottom call-to-action band ─────────────────────────── */}
      <Box
        sx={{
          py: { xs: 7, md: 9 },
          px: 3,
          borderTop: `1px solid ${MAISON}33`,
          textAlign: 'center',
          background: `linear-gradient(180deg, transparent 0%, ${MAISON}14 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: MAISON_BRIGHT,
              mb: 1.5,
            }}
          >
            {m.ctaEyebrow}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: 22, md: 28 },
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              mb: 2,
            }}
          >
            {m.ctaTitle}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 14, md: 15.5 },
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.65,
              maxWidth: 620,
              mx: 'auto',
              mb: 3.5,
            }}
          >
            {m.ctaBody}
          </Typography>
          <Box
            component={RouterLink}
            to="/about"
            sx={{
              display: 'inline-block',
              textDecoration: 'none',
              bgcolor: MAISON,
              color: '#fff',
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              px: 4,
              py: 1.75,
              borderRadius: 999,
              transition: 'background 200ms ease, transform 200ms ease',
              '&:hover': { bgcolor: MAISON_BRIGHT, transform: 'translateY(-1px)' },
            }}
          >
            {m.ctaButton}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

function Stat({ label, value }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 110 }}>
      <Typography
        sx={{
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontWeight: 700,
          fontSize: { xs: 22, md: 26 },
          color: '#fff',
          lineHeight: 1,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: 10.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          mt: 0.75,
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}
