import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchProjectUnits, fetchAllUnits } from '../supabase'
import { getProjectDetails } from '../data/projectDetails.js'
import ProjectInquiryModal from './ProjectInquiryModal'
import PropertyToolbar, { EMPTY_FILTERS } from './PropertyToolbar'

// ─────────────────────────── tokens & style ───────────────────────────
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
mapboxgl.accessToken = MAPBOX_TOKEN

const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11'
const INITIAL_CENTER = [56.5, 21.0]
const INITIAL_ZOOM = 5.4

// Labels stack messily at country zoom — show them only once the user
// zooms into a city, plus always on hover regardless of zoom.
const LABEL_ZOOM_THRESHOLD = 8.5

const OLIVE = '#7c7856'
const OLIVE_HOVER = '#8e8a63'
const OLIVE_BRIGHT = '#8c8d25'        // Figma 309-16691 — accent/price/CTA
const SELECTED = '#391FAF'            // Selected-marker indigo — set when a
                                      // project is picked from search or
                                      // clicked on the map.
const STAT_LABEL = '#a19797'           // Figma — gray for stat labels
const CTA_DARK_TEXT = '#110f0f'        // Figma — near-black text on light CTAs

// ─────────────────────────── helpers ─────────────────────────────────
function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

const fmtOmr = (n) => {
  if (n == null) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'OMR', maximumFractionDigits: 0,
  }).format(Number(n))
}

const fmtSqm = (n) => (n == null ? '' : `${Math.round(Number(n))} m²`)

function popupHtml(p, details) {
  const dev = p.developer?.name || ''
  const city = p.area?.city || ''
  const sub = [dev, city].filter(Boolean).join(' · ')
  const tagline = details?.tagline || ''
  const imageUrl = details?.imageUrl
  const imageInner = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(p.name)}" />`
    : `<div class="pm-popup-placeholder"><span>${escapeHtml(p.name)}</span></div>`
  return `
    <div class="pm-popup">
      <div class="pm-popup-image">${imageInner}</div>
      <div class="pm-popup-body">
        <div class="pm-popup-title">${escapeHtml(p.name)}</div>
        ${sub ? `<div class="pm-popup-sub">${escapeHtml(sub)}</div>` : ''}
        ${tagline ? `<div class="pm-popup-tagline">${escapeHtml(tagline)}</div>` : ''}
      </div>
    </div>
  `
}

function spreadOverlaps(projects) {
  const groups = new Map()
  projects.forEach((p, i) => {
    const key = `${p.latitude.toFixed(5)},${p.longitude.toFixed(5)}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(i)
  })
  const out = projects.map((p) => ({ ...p }))
  const OFFSET_DEG = 0.00045
  for (const [, idxs] of groups) {
    if (idxs.length < 2) continue
    idxs.forEach((idx, n) => {
      const angle = (2 * Math.PI * n) / idxs.length
      out[idx].latitude  = out[idx].latitude  + OFFSET_DEG * Math.cos(angle)
      out[idx].longitude = out[idx].longitude + OFFSET_DEG * Math.sin(angle)
    })
  }
  return out
}

// ─────────────────────────── small atoms ─────────────────────────────
function StatBlock({ label, value, highlight }) {
  if (!value) return null
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: 12, fontWeight: 500,
          color: STAT_LABEL,
          letterSpacing: '0.7px',
          lineHeight: '16px',
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: 16,
          fontWeight: highlight ? 700 : 500,
          color: highlight ? OLIVE_BRIGHT : '#fff',
          letterSpacing: '0.7px',
          lineHeight: '20px',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

// ─── Unit listing row (Figma 306-17270, latest) ──────────────────────
// Flat row — NO cream card background. White text, olive arrow on right.
// unit_no is intentionally omitted (internal-only).
function UnitRow({ unit, onClick, labels }) {
  const bedsText =
    unit.bedrooms === 0
      ? labels.studio
      : labels.bedsValue.replace('{n}', unit.bedrooms)

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'start',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr auto 20px',
          md: 'minmax(0, 1fr) 110px 110px 20px',
        },
        alignItems: 'center',
        columnGap: { xs: 2, md: 3 },
        py: 1.6,
        color: '#fff',
        flexShrink: 0,
        '& .row-arrow': {
          transition: 'transform 220ms ease, color 220ms ease',
        },
        '&:hover .row-arrow': {
          transform: 'translateX(5px)',
          color: '#a8a93a',
        },
        '&:hover .row-title': {
          color: OLIVE_BRIGHT,
        },
      }}
    >
      <Typography
        className="row-title"
        sx={{
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: { xs: 14, md: 16 },
          fontWeight: 700,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.7px',
          lineHeight: '16px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'color 220ms ease',
        }}
      >
        {unit.unit_type} · {bedsText}
      </Typography>

      <Typography
        sx={{
          display: { xs: 'none', md: 'block' },
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: 14, fontWeight: 500,
          color: '#fff',
          letterSpacing: '0.7px',
          lineHeight: '16px',
          opacity: 0.85,
        }}
      >
        {labels.startFrom}
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: { xs: 13, md: 14 },
          fontWeight: 500,
          color: '#fff',
          letterSpacing: '0.7px',
          lineHeight: '16px',
          whiteSpace: 'nowrap',
        }}
      >
        {fmtOmr(unit.price_omr)}
      </Typography>

      <ArrowForwardRoundedIcon
        className="row-arrow"
        sx={{
          color: OLIVE_BRIGHT,
          fontSize: 20,
          justifySelf: 'end',
        }}
      />
    </Box>
  )
}

// ─── Close/expand icon: + that rotates to × on hover (45°) ───────────
// Inlines the shared Figma "plus-cross" mark (node 309:16784) — same artwork
// as `/icons/plus-cross.svg` used by GlobalPresencePanel, but inlined here so
// the stroke can inherit `currentColor` and tint on hover.
function CloseRotateButton({ onClick, ariaLabel }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || 'Close'}
      sx={{
        position: 'absolute',
        top: { xs: 18, md: 24 },
        left: { xs: 22, md: 32 },
        width: 28,
        height: 28,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        padding: 0,
        '& svg': {
          width: 16,
          height: 16,
          display: 'block',
          transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), color 220ms ease',
          willChange: 'transform',
        },
        '&:hover': { color: OLIVE_BRIGHT },
        '&:hover svg': { transform: 'rotate(45deg)' },
      }}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
        <path
          d="M8 0V4C8 6.4 9.76 8 12 8H16M0 8H6M8 16V10"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </Box>
  )
}

// ─────────────────────────── DetailsPanel ─────────────────────────────
function DetailsPanel({ project, units, loadingUnits, onCtaClick, labels }) {
  // `lang` drives the localized project copy via getProjectDetails().
  // DetailsPanel is its own component (not a child render of the main
  // PropertyMap function), so it must read the locale itself — relying
  // on an outer-scope `lang` throws a ReferenceError on every render
  // and unmounts the whole tree (black screen after mount).
  const { lang } = useI18n()
  // Stable animation wrapper — never unmounts on view/project change, so
  // GSAP's ref always points to the same DOM node. This eliminates the
  // "jump" that happened when the previous design forwarded a ref through
  // forwardRef to one of three different inner layout components.
  const animRef = useRef(null)
  const [displayProject, setDisplayProject] = useState(project)
  const [selectedUnit, setSelectedUnit] = useState(null)

  useEffect(() => { setSelectedUnit(null) }, [project?.id])

  // OUT animation: fade the current content, then swap state on complete.
  useEffect(() => {
    if (!project) return
    if (displayProject?.id === project.id) return
    const el = animRef.current
    if (!el) { setDisplayProject(project); return }
    gsap.killTweensOf(el)
    gsap.to(el, {
      opacity: 0, y: -6, duration: 0.16, ease: 'power2.in',
      onComplete: () => setDisplayProject(project),
    })
  }, [project?.id, displayProject?.id])

  // IN animation: useLayoutEffect runs synchronously after the new DOM is
  // committed but BEFORE the browser paints — so opacity 0 is set in the
  // same frame as the new content, killing the one-frame flash that
  // useEffect would otherwise leave.
  useLayoutEffect(() => {
    if (!animRef.current) return
    gsap.killTweensOf(animRef.current)
    gsap.fromTo(
      animRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' },
    )
  }, [displayProject?.id, selectedUnit?.id])

  const details = displayProject ? getProjectDetails(displayProject.name, lang) : null
  const hasUnits = units && units.length > 0
  const view = !displayProject ? 'empty' : selectedUnit ? 'unit' : hasUnits ? 'units' : 'project'

  const isUnitView = view === 'unit'
  const ctaText = isUnitView
    ? labels.chooseUnitCta
    : null // listing/project CTA is rendered with mixed bold/regular below

  const ctaDisabled = !displayProject
  const handleCta = () => onCtaClick({ project: displayProject, unit: selectedUnit })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // Fixed total height matching the map column so the inner middle
        // child gets a real available height to scroll inside of.
        height: { xs: 720, md: 600 },
        bgcolor: '#000',
        borderRadius: '25px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Stable animation wrapper — children swap inside, ref never moves */}
      <Box
        ref={animRef}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          position: 'relative',
          willChange: 'opacity, transform',
        }}
      >
        {view === 'units' ? (
          <UnitsLayout
            project={displayProject}
            details={details}
            units={units}
            labels={labels}
            loadingUnits={loadingUnits}
            onPickUnit={setSelectedUnit}
          />
        ) : view === 'unit' ? (
          <UnitLayout
            project={displayProject}
            unit={selectedUnit}
            labels={labels}
            onBack={() => setSelectedUnit(null)}
          />
        ) : view === 'project' ? (
          <ProjectLayout
            project={displayProject}
            details={details}
            labels={labels}
          />
        ) : (
          <EmptyLayout labels={labels} />
        )}
      </Box>

      {/* CTA — pinned at the bottom. White for listing/project, olive for unit. */}
      <Box sx={{ p: { xs: 2.5, md: 3 }, pt: 0, flexShrink: 0 }}>
        <Box
          component="button"
          type="button"
          disabled={ctaDisabled}
          onClick={handleCta}
          sx={{
            width: '100%',
            height: 64,
            borderRadius: '15px',
            border: 'none',
            bgcolor: ctaDisabled
              ? 'rgba(255,255,255,0.25)'
              : isUnitView ? OLIVE_BRIGHT : '#fff',
            color: CTA_DARK_TEXT,
            cursor: ctaDisabled ? 'not-allowed' : 'pointer',
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontWeight: 500,
            fontSize: { xs: 15, md: 17 },
            letterSpacing: '0.7px',
            textTransform: 'uppercase',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'background-color 200ms ease, transform 200ms ease',
            '&:hover:not(:disabled)': {
              bgcolor: isUnitView ? '#a3a432' : '#f3f3f3',
            },
            '&:active:not(:disabled)': { transform: 'translateY(1px)' },
          }}
        >
          {isUnitView ? (
            ctaText
          ) : (
            <ListingCtaText
              template={labels.cta}
              projectName={displayProject?.name || ''}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

// "Get More Details About {project}" with bold project name
function ListingCtaText({ template, projectName }) {
  const [before, after] = String(template).split('{project}')
  return (
    <span>
      {before}
      <Box component="span" sx={{ fontWeight: 700, ml: 0.5 }}>
        {projectName}
      </Box>
      {after}
    </span>
  )
}

// ─── layout: units (Figma 306-17270 final) ───────────────────────────
const UnitsLayout = forwardRef(function UnitsLayout(
  { project, details, units, labels, loadingUnits, onPickUnit },
  contentRef,
) {
  const listRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    gsap.fromTo(
      listRef.current.querySelectorAll('.unit-row'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.32, stagger: 0.02, ease: 'power2.out' },
    )
  }, [units])

  const metaParts = [
    labels.unitsAvailable.replace('{count}', units.length),
    project.developer?.name,
    project.area?.city,
  ].filter(Boolean)

  return (
    <Box
      ref={contentRef}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        px: { xs: 3, md: 4 },
        pt: { xs: 3, md: 3.5 },
        pb: { xs: 2.5, md: 3 },
        gap: { xs: 2, md: 2.5 },
        color: '#fff',
        willChange: 'opacity, transform',
      }}
    >
      {/* Header — fixed */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: 13, fontWeight: 500,
            letterSpacing: '0.7px',
            textTransform: 'uppercase',
            mb: 0.5,
          }}
        >
          {labels.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: { xs: 26, md: 34 },
            fontWeight: 700,
            lineHeight: 1.15,
            mb: 0.8,
            letterSpacing: '-0.3px',
          }}
        >
          {project.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: { xs: 15, md: 17 },
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}
        >
          {metaParts.join(' · ')}
        </Typography>
        {details?.description && (
          <Typography
            sx={{
              mt: 1,
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 15, md: 16 }, fontWeight: 500,
              lineHeight: 1.55,
              opacity: 0.92,
              letterSpacing: '0.3px',
            }}
          >
            {details.description}
          </Typography>
        )}
      </Box>

      {/* Scrollable list */}
      <Box
        ref={listRef}
        data-lenis-prevent
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          display: 'flex',
          flexDirection: 'column',
          // Thin separator between rows for visual rhythm
          '& > .unit-row + .unit-row': {
            borderTop: '1px solid rgba(255,255,255,0.08)',
          },
          pr: 0.5,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderRadius: 3,
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.18) transparent',
        }}
      >
        {loadingUnits && units.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={20} sx={{ color: '#fff' }} />
          </Box>
        ) : (
          units.map((u) => (
            <Box key={u.id} className="unit-row">
              <UnitRow unit={u} onClick={() => onPickUnit(u)} labels={labels} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
})

// ─── layout: single unit detail (Figma 309-16691) ────────────────────
const UnitLayout = forwardRef(function UnitLayout(
  { project, unit, labels, onBack },
  contentRef,
) {
  // Read locale locally — this is a standalone forwardRef component,
  // so an outer-scope `lang` would be undefined and throw on render.
  const { lang } = useI18n()
  const paneRef = useRef(null)
  useEffect(() => {
    if (!paneRef.current) return
    gsap.fromTo(
      paneRef.current,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
    )
  }, [unit?.id])

  const bedsValue =
    unit.bedrooms === 0
      ? labels.studio
      : `${unit.bedrooms} ${unit.bedrooms === 1 ? labels.bedRoomSingular : labels.bedRoomPlural}`

  const subBeds =
    unit.bedrooms === 0
      ? labels.studio
      : labels.bedsValue.replace('{n}', unit.bedrooms)

  return (
    <Box
      ref={contentRef}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        position: 'relative',
        willChange: 'opacity, transform',
      }}
    >
      {/* Close/expand + icon — rotates 45° on hover */}
      <CloseRotateButton onClick={onBack} ariaLabel={labels.back} />

      <Box
        data-lenis-prevent
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          px: { xs: 3, md: 4 },
          pt: { xs: 7, md: 9 },        // leave room above for close icon
          pb: { xs: 3, md: 3 },
          color: '#fff',
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderRadius: 3,
          },
        }}
      >
        <Box ref={paneRef}>
          {/* Title + description */}
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 28, md: 34 },
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.3px',
              mb: 1,
            }}
          >
            {project.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12, fontWeight: 500,
              lineHeight: '20px',
              opacity: 0.9,
              letterSpacing: '0.3px',
              mb: 2.5,
            }}
          >
            {project.developer?.name ? `${project.developer.name} — ` : ''}
            {(getProjectDetails(project.name, lang)?.description) || project.location}
          </Typography>

          {/* Price block */}
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 24, md: 28 },
              fontWeight: 500,
              color: OLIVE_BRIGHT,
              letterSpacing: '0.5px',
              lineHeight: '32px',
            }}
          >
            {labels.startFromPrice.replace('{price}', fmtOmr(unit.price_omr))}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 13, fontWeight: 500,
              color: '#fff',
              letterSpacing: '0.7px',
              lineHeight: '20px',
              mb: 2.5,
            }}
          >
            {unit.unit_type} · {subBeds}
            <Box component="span" sx={{ ml: 2 }}>
              OMR {Math.round(unit.price_per_sqm_omr || 0).toLocaleString()} / m²
            </Box>
          </Typography>

          {/* Divider */}
          <Box
            sx={{
              height: '1px',
              bgcolor: 'rgba(255,255,255,0.22)',
              mb: 3,
            }}
          />

          {/* Stats grid — 2 cols (VIEW/FLOOR · LAYOUT/BEDS · INTERIOR/BALCONY · TOTAL AREA) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: 4,
              rowGap: 3,
            }}
          >
            <StatBlock label={labels.viewLabel} value={unit.view} />
            <StatBlock label={labels.floorLabel} value={unit.floor_label} />
            <StatBlock label={labels.layoutLabel} value={unit.layout_type} />
            <StatBlock label={labels.bedsLabel} value={bedsValue} />
            <StatBlock label={labels.interiorLabel} value={fmtSqm(unit.internal_area_sqm)} />
            <StatBlock label={labels.balconyLabel} value={fmtSqm(unit.balcony_area_sqm)} />
            {unit.total_garden_sqm > 0 && (
              <StatBlock label={labels.gardenLabel} value={fmtSqm(unit.total_garden_sqm)} />
            )}
            <StatBlock
              label={labels.totalAreaLabel}
              value={fmtSqm(unit.total_area_sqm)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
})

// ─── layout: project (no units) ──────────────────────────────────────
const ProjectLayout = forwardRef(function ProjectLayout(
  { project, details, labels },
  contentRef,
) {
  const metaParts = [project.developer?.name, project.area?.city].filter(Boolean)

  return (
    <Box
      ref={contentRef}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        px: { xs: 3, md: 4 },
        pt: { xs: 3, md: 3.5 },
        pb: { xs: 2.5, md: 3 },
        gap: { xs: 2, md: 2.5 },
        color: '#fff',
        willChange: 'opacity, transform',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: 13, fontWeight: 500,
            letterSpacing: '0.7px',
            textTransform: 'uppercase',
            mb: 0.5,
          }}
        >
          {labels.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: { xs: 26, md: 34 },
            fontWeight: 700,
            lineHeight: 1.15,
            mb: 0.8,
            letterSpacing: '-0.3px',
          }}
        >
          {project.name}
        </Typography>
        {metaParts.length > 0 && (
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 13, fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            {metaParts.join(' · ')}
          </Typography>
        )}
      </Box>

      <Box
        data-lenis-prevent
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          pr: 0.5,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 3,
          },
        }}
      >
        {details?.tagline && (
          <Typography
            sx={{
              fontSize: { xs: 15, md: 16 }, fontWeight: 600,
              color: OLIVE_BRIGHT,
              letterSpacing: '0.5px',
              mb: 1.5,
            }}
          >
            {details.tagline}
          </Typography>
        )}
        {details?.description && (
          <Typography
            sx={{
              fontSize: { xs: 15, md: 16 }, lineHeight: 1.6,
              opacity: 0.92, mb: 2.5,
            }}
          >
            {details.description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: 4, rowGap: 3,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.22)',
          }}
        >
          <StatBlock label={labels.developer} value={project.developer?.name} />
          <StatBlock
            label={labels.location}
            value={[project.location, project.area?.city].filter(Boolean).join(' · ')}
          />
          {details?.units?.length > 0 && (
            <StatBlock label={labels.units} value={details.units.join(', ')} />
          )}
          {details?.bedrooms && <StatBlock label={labels.bedrooms} value={details.bedrooms} />}
          {details?.priceFrom && (
            <StatBlock label={labels.priceFrom} value={details.priceFrom} highlight />
          )}
          {details?.handover && <StatBlock label={labels.handover} value={details.handover} />}
        </Box>
      </Box>
    </Box>
  )
})

function EmptyLayout({ labels }) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
        {labels.empty}
      </Typography>
    </Box>
  )
}

// ─────────────────────────── main component ───────────────────────────
export default function PropertyMap() {
  const { t, lang } = useI18n()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [units, setUnits] = useState([])
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquiryContext, setInquiryContext] = useState({ project: null, unit: null })
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [allUnits, setAllUnits] = useState([])

  // ── Global unit inventory — drives toolbar ranges, dropdown options,
  //    and live "which projects have matching units" computation.
  useEffect(() => {
    let cancelled = false
    fetchAllUnits()
      .then((data) => { if (!cancelled) setAllUnits(data) })
      .catch(() => { if (!cancelled) setAllUnits([]) })
    return () => { cancelled = true }
  }, [])

  // ── ScrollTrigger refresh after lazy-load ────────────────────────
  // PropertyMap is loaded via React.lazy. Before this chunk arrives,
  // every ScrollTrigger BELOW the map (HorizontalCarousel, Catalog,
  // etc.) has its start/end calculated against a smaller Suspense
  // fallback. Once we mount, the page extends → triggers fire at the
  // wrong scroll positions. Calling `ScrollTrigger.refresh()` forces
  // every trigger on the page to recompute against the now-correct
  // layout. We fire on mount AND after projects+units load (those
  // tweak the panel content and so the section height).
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (projects.length === 0 && allUnits.length === 0) return
    const id = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => clearTimeout(id)
  }, [projects.length, allUnits.length])

  // Unique areas across all projects → fed to the toolbar's Location dropdown
  const areas = useMemo(() => {
    const seen = new Map()
    projects.forEach((p) => {
      const name = p.area?.name
      if (name && !seen.has(name)) {
        seen.set(name, { id: name, name, city: p.area?.city })
      }
    })
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [projects])

  // Distinct unit_type values present in the DB — feeds the chip strip + modal.
  const unitTypes = useMemo(() => {
    const set = new Set()
    allUnits.forEach((u) => u.unit_type && set.add(u.unit_type))
    return [...set].sort()
  }, [allUnits])

  // Numeric ranges floor/ceil-snapped to nice numbers, used by the sliders.
  const priceRange = useMemo(() => {
    if (allUnits.length === 0) return [0, 1_000_000]
    const ps = allUnits.map((u) => u.price_omr).filter((x) => x != null)
    if (ps.length === 0) return [0, 1_000_000]
    return [Math.floor(Math.min(...ps) / 1000) * 1000, Math.ceil(Math.max(...ps) / 1000) * 1000]
  }, [allUnits])

  const sizeRange = useMemo(() => {
    if (allUnits.length === 0) return [0, 500]
    const ss = allUnits.map((u) => u.total_area_sqm).filter((x) => x != null)
    if (ss.length === 0) return [0, 500]
    return [Math.floor(Math.min(...ss)), Math.ceil(Math.max(...ss))]
  }, [allUnits])

  // ── Search & filter predicates ───────────────────────────────────────
  // Search is a free-text query that should hit BOTH project metadata
  // (name, location, area, city, governorate, developer) AND unit-level
  // metadata (unit_type, layout_type, view, bedrooms). The previous
  // implementation only checked unit fields, which meant:
  //   • Searching a project name like "St. Regis" or "Vistal" matched zero.
  //   • Searching a city/area/governorate like "Muscat" or "Sultan
  //     Haitham" matched zero.
  //   • Searching a developer like "Sotheby's" matched zero.
  //   • The 18 projects with no inventory rows in `project_units` could
  //     never appear — `allUnits.forEach` skipped them entirely.
  //
  // Fix:
  //   1. Project text predicate considers all the project-level columns.
  //   2. Unit text predicate keeps the old unit-field match (so "sea
  //      view" or "1BR" still narrow results).
  //   3. `matchingProjectIds` iterates `projects` (not `allUnits`) so
  //      unit-less projects can still match by their own metadata.
  //   4. Panel-side `filteredUnits` ignores the search term — otherwise
  //      typing "Muscat" would blank the unit list of a Muscat project.

  const SEARCH = (filters.search || '').trim().toLowerCase()

  const projectTextHaystack = (p) => [
    p.name, p.location,
    p.area?.name, p.area?.city, p.area?.governorate,
    p.developer?.name,
  ].filter(Boolean).join(' ').toLowerCase()

  const unitTextHaystack = (u) => {
    const bed = u.bedrooms != null
      ? `${u.bedrooms}br ${u.bedrooms} bedroom ${u.bedrooms} bed`
      : ''
    return `${u.layout_type || ''} ${u.unit_type || ''} ${u.view || ''} ${bed}`.toLowerCase()
  }

  const projectMatchesSearch = (p) => !SEARCH || projectTextHaystack(p).includes(SEARCH)
  const unitMatchesSearch    = (u) => !SEARCH || unitTextHaystack(u).includes(SEARCH)

  // Unit predicate WITHOUT the search term — used for price/size/type/
  // bedrooms gating. Search is handled separately at the project level.
  const unitMatchesNonSearch = (u) => {
    if (filters.type && filters.type !== 'All' && u.unit_type !== filters.type) return false
    if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(u.bedrooms)) return false
    if (filters.priceMin != null && (u.price_omr ?? 0) < filters.priceMin) return false
    if (filters.priceMax != null && (u.price_omr ?? Infinity) > filters.priceMax) return false
    if (filters.sizeMin != null && (u.total_area_sqm ?? 0) < filters.sizeMin) return false
    if (filters.sizeMax != null && (u.total_area_sqm ?? Infinity) > filters.sizeMax) return false
    return true
  }

  const anyUnitLevelFilter =
    (filters.type && filters.type !== 'All') ||
    filters.bedrooms.length > 0 ||
    filters.priceMin != null || filters.priceMax != null ||
    filters.sizeMin != null  || filters.sizeMax  != null

  // Projects whose pin should stay visible (map + panel selection list).
  // Returns null when no filters are active → "show every project".
  const matchingProjectIds = useMemo(() => {
    if (!SEARCH && !anyUnitLevelFilter) return null

    // Bucket units by project for O(1) lookup instead of N×M scans.
    const unitsByProject = new Map()
    for (const u of allUnits) {
      const list = unitsByProject.get(u.project_id)
      if (list) list.push(u)
      else unitsByProject.set(u.project_id, [u])
    }

    const set = new Set()
    for (const p of projects) {
      const projectUnits = unitsByProject.get(p.id) || []
      const passingUnits = anyUnitLevelFilter
        ? projectUnits.filter(unitMatchesNonSearch)
        : projectUnits

      // Price/size/type/bedrooms gating: the project must have ≥1 unit
      // satisfying these. Unit-less projects fail this when set.
      if (anyUnitLevelFilter && passingUnits.length === 0) continue

      if (!SEARCH) { set.add(p.id); continue }

      // Search matches if EITHER the project's own metadata contains the
      // term OR any of its (filter-passing) units do.
      if (projectMatchesSearch(p)) { set.add(p.id); continue }
      if (passingUnits.some(unitMatchesSearch)) { set.add(p.id); continue }
    }
    return set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUnits, projects, filters.type, filters.bedrooms, filters.priceMin, filters.priceMax,
      filters.sizeMin, filters.sizeMax, filters.search])

  // Visible projects on the map = matching set ∩ location filter.
  const visibleProjectIds = useMemo(() => {
    const base =
      matchingProjectIds == null
        ? new Set(projects.map((p) => p.id))
        : matchingProjectIds
    if (filters.locations.length === 0) return base
    const locSet = new Set(filters.locations)
    const out = new Set()
    projects.forEach((p) => {
      if (base.has(p.id) && p.area?.name && locSet.has(p.area.name)) out.add(p.id)
    })
    return out
  }, [matchingProjectIds, filters.locations, projects])

  // Units rendered in the side panel for the currently-selected project.
  // We apply only the non-search filters; the search term has already
  // selected the project, so listing all of its units (that pass price/
  // size/type/bedrooms) gives the user the most useful inventory view.
  const filteredUnits = useMemo(
    () => units.filter(unitMatchesNonSearch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [units, filters.type, filters.bedrooms, filters.priceMin, filters.priceMax,
     filters.sizeMin, filters.sizeMax],
  )

  // Live global count of matching units (drives the "Show N results"
  // button). Counts units whose project is visible AND that pass the
  // non-search unit filters.
  const totalMatchingUnits = useMemo(() => {
    if (!SEARCH && !anyUnitLevelFilter) return allUnits.length
    return allUnits.filter(
      (u) => visibleProjectIds.has(u.project_id) && unitMatchesNonSearch(u),
    ).length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUnits, visibleProjectIds, filters.type, filters.bedrooms,
      filters.priceMin, filters.priceMax, filters.sizeMin, filters.sizeMax,
      filters.search])

  useEffect(() => {
    let cancelled = false
    fetchProjects()
      .then((data) => {
        if (cancelled) return
        const spread = spreadOverlaps(data)
        setProjects(spread)
        if (spread.length > 0) setSelected(spread[0])
      })
      .catch((e) => { if (!cancelled) setError(e.message || String(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!selected?.id) { setUnits([]); return }
    let cancelled = false
    setLoadingUnits(true)
    fetchProjectUnits(selected.id)
      .then((data) => { if (!cancelled) setUnits(data) })
      .catch(() => { if (!cancelled) setUnits([]) })
      .finally(() => { if (!cancelled) setLoadingUnits(false) })
    return () => { cancelled = true }
  }, [selected?.id])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (!MAPBOX_TOKEN) { setError('Missing VITE_MAPBOX_TOKEN'); return }
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      attributionControl: true,
      cooperativeGestures: true,
    })
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || projects.length === 0) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    // Track label DOM nodes so the zoom listener can show/hide them.
    const labelEls = []

    projects.forEach((p) => {
      const details = getProjectDetails(p.name, lang)

      // ── DOT marker ──
      // CRITICAL: Mapbox writes `transform: translate3d(...)` on the OUTER
      // marker element to position it. If we wrote `transform: scale(1.35)`
      // on the same element for the hover effect, it would WIPE OUT the
      // positioning transform and snap the pin to (0,0). So we use a
      // wrap + inner dot pattern:
      //   * wrap (transparent button) — Mapbox positions this, never touch it
      //   * dot (visible circle)      — hover scale lives here, isolated
      const wrap = document.createElement('button')
      wrap.type = 'button'
      wrap.className = 'pm-marker'
      wrap.title = p.name
      wrap.setAttribute('aria-label', p.name)
      wrap.style.cssText = `
        background: transparent;
        border: 0; padding: 0;
        cursor: pointer;
        width: 18px; height: 18px;
        display: block;
        opacity: 1;
        transition: opacity 280ms ease;
        will-change: opacity;
      `
      wrap.dataset.projectId = String(p.id)

      const dot = document.createElement('span')
      dot.style.cssText = `
        display: block;
        width: 100%; height: 100%;
        background: ${OLIVE};
        border: 2px solid rgba(255,255,255,0.92);
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5), 0 0 0 3px rgba(124,120,86,0.20);
        transition: transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 320ms ease, background-color 380ms ease;
        transform-origin: center center;
        will-change: transform, background-color;
      `
      dot.dataset.dot = String(p.id)
      wrap.appendChild(dot)

      // ── Hover popup (rich card) ──
      const popup = new mapboxgl.Popup({
        offset: 18,
        closeButton: false,
        closeOnClick: false,
        anchor: 'bottom',
        maxWidth: '260px',
        className: 'pm-popup-wrapper',
      }).setHTML(popupHtml(p, details))

      let hideTimer = null
      const showPopup = () => {
        clearTimeout(hideTimer)
        popup.setLngLat([p.longitude, p.latitude]).addTo(map)
      }
      const hidePopup = () => {
        clearTimeout(hideTimer)
        hideTimer = setTimeout(() => popup.remove(), 120)
      }

      // Hover handlers respect the selected state — a picked marker keeps
      // its indigo background and rests at a slightly larger size.
      wrap.addEventListener('mouseenter', () => {
        const isSelected = dot.dataset.selected === '1'
        dot.style.transform = 'scale(1.35)'
        dot.style.boxShadow = isSelected
          ? '0 6px 20px rgba(57,31,175,0.55), 0 0 0 6px rgba(57,31,175,0.32)'
          : '0 6px 18px rgba(0,0,0,0.6), 0 0 0 6px rgba(124,120,86,0.32)'
        if (!isSelected) dot.style.background = OLIVE_HOVER
        showPopup()
      })
      wrap.addEventListener('mouseleave', () => {
        const isSelected = dot.dataset.selected === '1'
        dot.style.transform = isSelected ? 'scale(1.18)' : 'scale(1)'
        dot.style.boxShadow = isSelected
          ? '0 5px 16px rgba(57,31,175,0.48), 0 0 0 5px rgba(57,31,175,0.26)'
          : '0 4px 12px rgba(0,0,0,0.5), 0 0 0 3px rgba(124,120,86,0.20)'
        dot.style.background = isSelected ? SELECTED : OLIVE
        hidePopup()
      })
      wrap.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelected(p)
      })

      const dotMarker = new mapboxgl.Marker({ element: wrap, anchor: 'center' })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map)

      markersRef.current.push(dotMarker)

      // ── LABEL marker (separate, same lat/lng, anchor:left) ──
      // Independent Mapbox marker → its layout NEVER affects the dot's
      // bounding box. Shown only at zoom ≥ LABEL_ZOOM_THRESHOLD.
      const label = document.createElement('div')
      label.className = 'pm-marker-label'
      label.textContent = p.name
      label.style.cssText = `
        color: #ffffff;
        font-family: "Inter", sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.3px;
        padding: 4px 9px;
        background: rgba(0,0,0,0.72);
        border-radius: 999px;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border: 1px solid rgba(255,255,255,0.10);
        white-space: nowrap;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        line-height: 1;
        opacity: 0;
        pointer-events: none;
        transition: opacity 240ms ease;
        will-change: opacity;
      `
      label.dataset.projectId = String(p.id)
      const labelMarker = new mapboxgl.Marker({
        element: label,
        anchor: 'left',
        offset: [14, 0],   // 14px to the right of the dot center
      })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map)

      markersRef.current.push(labelMarker)
      labelEls.push(label)
    })

    // ── No auto-fitBounds — keeps the initial Oman-wide view (so all
    //    22 pins read at a glance instead of zooming into Muscat). ──

    // Zoom-aware label visibility.
    // Stored on the map ref so the separate visibility effect can re-run it
    // when the filtered set of visible projects changes.
    map.__pmSyncLabels = () => {
      const show = map.getZoom() >= LABEL_ZOOM_THRESHOLD
      labelEls.forEach((el) => {
        // Don't show a label if its dot is filtered out
        if (el.style.visibility === 'hidden') return
        el.style.opacity = show ? '1' : '0'
      })
    }
    map.on('zoom', map.__pmSyncLabels)
    map.__pmSyncLabels()

    return () => {
      map.off('zoom', map.__pmSyncLabels)
      map.__pmSyncLabels = null
    }
  }, [projects])

  // ── Live visibility sync ──
  // Toggles each marker's opacity based on the current filter result set.
  // Markers stay mounted (no expensive recreate), so the fade reads smoothly.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const all = document.querySelectorAll('.pm-marker, .pm-marker-label')
    all.forEach((el) => {
      const id = Number(el.dataset.projectId)
      const visible = visibleProjectIds.has(id)
      if (el.classList.contains('pm-marker')) {
        el.style.opacity = visible ? '1' : '0'
        el.style.pointerEvents = visible ? '' : 'none'
      } else {
        // label — also gate on current zoom level
        el.style.visibility = visible ? 'visible' : 'hidden'
        if (!visible) el.style.opacity = '0'
      }
    })
    if (map.__pmSyncLabels) map.__pmSyncLabels()
  }, [visibleProjectIds])

  // ── Selected-marker color sync ──
  // Paints the currently-selected dot indigo (SELECTED) and resets any
  // previously-selected dot back to OLIVE. The CSS `background-color`
  // transition on the dot makes the swap glide smoothly. We touch the
  // dots directly (no rerender) so the map state and marker DOM stay
  // independent.
  useEffect(() => {
    const selectedId = selected?.id
    document.querySelectorAll('.pm-marker span[data-dot]').forEach((dot) => {
      const id = Number(dot.dataset.dot)
      const isSel = id === selectedId
      dot.dataset.selected = isSel ? '1' : '0'
      dot.style.background = isSel ? SELECTED : OLIVE
      dot.style.boxShadow = isSel
        ? '0 5px 16px rgba(57,31,175,0.48), 0 0 0 5px rgba(57,31,175,0.26)'
        : '0 4px 12px rgba(0,0,0,0.5), 0 0 0 3px rgba(124,120,86,0.20)'
      dot.style.transform = isSel ? 'scale(1.18)' : 'scale(1)'
    })
  }, [selected?.id, projects.length])

  // ── Smooth fly-to a project ──
  // Used by the toolbar's search autocomplete. mapboxgl's `flyTo` with a
  // pronounced curve naturally zooms out, pans, then zooms back in along
  // one parabolic trajectory — exactly the "zoom out → move → zoom in"
  // motion the design calls for, in a single tween.
  const flyToProject = (p) => {
    const map = mapRef.current
    if (!map || !p || p.latitude == null || p.longitude == null) return
    setSelected(p)
    map.flyTo({
      center: [p.longitude, p.latitude],
      zoom: 13.5,
      curve: 1.9,            // higher = deeper zoom-out arc before zoom-in
      speed: 0.65,           // slightly slower than default for a graceful feel
      essential: true,       // respects prefers-reduced-motion = false
    })
  }

  const handleCtaClick = ({ project, unit }) => {
    setInquiryContext({ project, unit: unit || null })
    setInquiryOpen(true)
  }

  return (
    <Box
      component="section"
      id="property-map-section"
      sx={{
        pt: { xs: 4, md: 6 },
        pb: { xs: 8, md: 12 },
        bgcolor: 'transparent',
        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 3 } }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: { xs: 24, md: 32 },
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            {t.map.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 14, md: 16 },
              color: 'text.secondary',
              maxWidth: 640,
              mx: 'auto',
            }}
          >
            {t.map.subtitle}
          </Typography>
        </Box>

        {/* Filter toolbar — sits between the heading and the map/details grid */}
        <PropertyToolbar
          filters={filters}
          onChange={setFilters}
          areas={areas}
          unitTypes={unitTypes}
          priceRange={priceRange}
          sizeRange={sizeRange}
          resultsCount={totalMatchingUnits}
          projects={projects}
          onProjectSelect={flyToProject}
        />

        <Box
          sx={{
            display: 'grid',
            // On mobile the map renders ABOVE the DetailsPanel via grid
            // ordering — that way after tapping a pin, the project details
            // are right below, one short swipe away. On desktop the
            // side-by-side layout stays as-is.
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 3, md: 3 },
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ order: { xs: 2, md: 0 } }}>
            <DetailsPanel
              project={selected}
              units={filteredUnits}
              loadingUnits={loadingUnits}
              onCtaClick={handleCtaClick}
              labels={t.map.details}
            />
          </Box>

          <Box
            sx={{
              position: 'relative',
              order: { xs: 1, md: 0 },
              // Roomier on phones so all 22 pins read at a glance without
              // pinching first. `cooperativeGestures` is on (see map init)
              // so the user can still scroll the page through the map —
              // they need 2 fingers to actually pan/zoom.
              height: { xs: 540, md: 600 },
              borderRadius: { xs: '18px', md: '24px' },
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            }}
          >
            <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />

            {loading && (
              <Box sx={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', zIndex: 5,
              }}>
                <CircularProgress size={28} sx={{ color: '#fff', mr: 2 }} />
                <Typography>{t.map.loading}</Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 6 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>

      <style>{`
        /* Rich popup wrapper — dark glass card with image + body */
        .pm-popup-wrapper .mapboxgl-popup-content {
          background: #0f0f0f;
          color: #f5f5f5;
          border-radius: 14px;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 14px 44px rgba(0,0,0,0.6);
          font-family: "Inter", sans-serif;
        }
        .pm-popup-wrapper .mapboxgl-popup-tip {
          border-top-color: #0f0f0f !important;
          border-bottom-color: #0f0f0f !important;
        }
        .pm-popup { width: 240px; }
        .pm-popup-image {
          width: 100%;
          height: 120px;
          overflow: hidden;
          position: relative;
        }
        .pm-popup-image img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .pm-popup-placeholder {
          width: 100%; height: 100%;
          background:
            radial-gradient(120% 100% at 0% 0%, rgba(124,120,86,0.55) 0%, rgba(10,10,10,0) 55%),
            linear-gradient(135deg, #2a2820 0%, #0a0a0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pm-popup-placeholder span {
          color: rgba(255,255,255,0.78);
          font-family: "Inter", sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.55);
          padding: 0 14px;
          text-align: center;
        }
        .pm-popup-body {
          padding: 12px 14px 14px;
        }
        .pm-popup-title {
          font-size: 16px; font-weight: 700; color: #fff;
          line-height: 1.25; letter-spacing: 0.2px;
        }
        .pm-popup-sub {
          font-size: 11px; font-weight: 600;
          color: ${OLIVE_BRIGHT};
          margin-top: 4px; letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .pm-popup-tagline {
          font-size: 12px; font-weight: 400;
          color: rgba(255,255,255,0.65);
          margin-top: 6px; line-height: 1.45;
        }
      `}</style>

      <ProjectInquiryModal
        open={inquiryOpen}
        project={inquiryContext.project}
        unit={inquiryContext.unit}
        onClose={() => setInquiryOpen(false)}
      />
    </Box>
  )
}
