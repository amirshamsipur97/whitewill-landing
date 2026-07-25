/**
 * PriceIndexPage — /property-prices-in-oman
 *
 * WHY: this is the site's first LINKABLE asset. Listing pages do not earn
 * backlinks; numbers do. Oman has no official per-square-metre index, so a
 * current, sourced, honestly-caveated one computed from our own ~400-unit
 * inventory is something relocation blogs, forums and journalists can cite —
 * and the one thing Bayut and Dubizzle cannot lift from us.
 *
 * Data is LIVE: recomputed from the same fetchers the portal uses on every
 * page load, so a sold unit leaves the index with no manual step. The
 * prerenderer bakes the build-time numbers into the static HTML from the very
 * same module (src/priceIndexData.mjs) so a crawler sees real figures.
 *
 * BUILT ON MATERIAL, not hand-rolled boxes: MUI Card / Table / TableSortLabel
 * / Slider / ToggleButtonGroup / Chip carry the interaction states, ripples and
 * elevation, and the page's own SectionHeading + FaqAccordion come from the
 * shared kit in components/invest/ui.jsx so it matches the rest of the site.
 *
 * Three things make it USEFUL rather than just readable:
 *   1. the budget slider — "what does OMR X actually buy, and where",
 *      answered from the same inventory and handed off to the portal;
 *   2. every table sorts on any column;
 *   3. community cards carry the real project photography and link straight
 *      into the filtered listings.
 *
 * Imagery is DERIVED from the inventory (largest project in each community),
 * never hardcoded, so it can never point at a delisted development.
 *
 * MOTION IS DELIBERATELY LIGHT: opacity plus an 8px lift, ~380ms, and that is
 * all. Driven by React state via setTimeout — never rAF, which does not fire
 * in a hidden tab and would leave the page at opacity:0
 * (see HANDOFF-SEO-2026-07-25 §4).
 */
import { useEffect, useMemo, useState } from 'react'
import {
  Card, CardActionArea, Chip, Divider, Paper, Slider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  ToggleButton, ToggleButtonGroup, Tooltip,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { galleryFor } from '../projectGallery.js'
import { LocalizedLink, useLocalizedNavigate } from '../lib/localize.js'
import { FONT, OLIVE_BRIGHT, SectionHeading, FaqAccordion } from '../components/invest/ui.jsx'
import {
  buildPriceIndex, median, slugify, typeGroup,
  fmtInt, fmtOmr, fmtRange, fmtSqm,
} from '../priceIndexData.mjs'
import {
  priceIndexCopy, priceIndexFaqJsonLd, priceIndexJsonLd, fill,
} from '../priceIndexContent.mjs'

const PAPER = '#0b0b0c'
const INK = '#f4f2ec'
const SUB = 'rgba(244,242,236,0.62)'
const FAINT = 'rgba(244,242,236,0.42)'
const LINE = 'rgba(255,255,255,0.10)'
const ACCENT = OLIVE_BRIGHT
const GOLD = '#B98C52'

// Neutral site-owned image for a community we have no project photography for
// (Aida/Yiti ships without a gallery folder). Deliberately NOT another
// project's photo — showing Al Mouj under a Yiti heading would be a lie.
const FALLBACK_IMG = '/images/hero-poster.jpg'

const CSS = `
.pi-page{background:${PAPER};color:${INK};min-height:100vh;font-family:${FONT}}
.pi-wrap{max-width:1180px;margin:0 auto;padding:0 20px}

.pi-hero{position:relative;padding:128px 20px 56px;overflow:hidden;background:#0a0a0b}
.pi-hero-bg{position:absolute;inset:0;z-index:0;opacity:0;transition:opacity .7s ease}
.pi-hero-bg.in{opacity:.34}
.pi-hero-bg img{width:100%;height:100%;object-fit:cover;display:block}
.pi-hero-veil{position:absolute;inset:0;z-index:1;background:
  linear-gradient(180deg,rgba(10,10,11,.9) 0%,rgba(10,10,11,.68) 45%,rgba(11,11,12,.97) 100%),
  radial-gradient(900px 420px at 50% -10%,rgba(185,140,82,.18),transparent 70%)}
.pi-hero-wrap{position:relative;z-index:2;max-width:1180px;margin:0 auto}
.pi-crumb{display:flex;gap:8px;align-items:center;flex-wrap:wrap;color:${FAINT};font-size:13px;margin-bottom:20px}
.pi-crumb a{color:${FAINT};text-decoration:none;transition:color .18s}
.pi-crumb a:hover{color:${INK}}
.pi-h1{margin:10px 0 0;font-weight:300;font-size:clamp(30px,4.6vw,54px);letter-spacing:-.02em;color:#fff;line-height:1.06}
.pi-lead{margin:15px 0 0;font-size:clamp(14.5px,1.4vw,16.5px);line-height:1.72;color:${SUB};max-width:720px}

.pi-sec{padding:60px 0 0}
.pi-sub{font-size:14.5px;line-height:1.6;color:${SUB};margin:-14px 0 22px;max-width:760px}
.pi-note{font-size:12.5px;color:${FAINT};margin:12px 0 0;line-height:1.6}

/* Bar chart — plain CSS widths. No charting library, no JS animation loop. */
.pi-bars{display:flex;flex-direction:column;gap:11px;margin:0 0 24px}
.pi-bar{display:grid;grid-template-columns:minmax(120px,190px) 1fr auto;align-items:center;gap:14px}
.pi-bar-label{font-size:13.5px;color:${SUB};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pi-bar-track{height:10px;background:rgba(255,255,255,.055);border-radius:999px;overflow:hidden}
.pi-bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,${GOLD},${ACCENT});transition:width .52s cubic-bezier(.4,0,.2,1)}
.pi-bar-val{font-size:13.5px;font-weight:700;color:${INK};font-variant-numeric:tabular-nums;min-width:64px;text-align:end}
[dir=rtl] .pi-bar-fill{background:linear-gradient(270deg,${GOLD},${ACCENT})}

.pi-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(238px,1fr));gap:16px}
.pi-cardimg{position:relative;aspect-ratio:16/10;overflow:hidden;background:#1a1a1b}
.pi-cardimg img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .42s cubic-bezier(.4,0,.2,1)}
.pi-card:hover .pi-cardimg img{transform:scale(1.05)}
.pi-cardimg::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.8) 100%)}
.pi-cardname{position:absolute;left:14px;right:14px;bottom:11px;z-index:2;display:flex;align-items:center;gap:6px;color:#fff;font-weight:600;font-size:15.5px;text-shadow:0 2px 10px rgba(0,0,0,.6)}
.pi-cardbody{padding:14px 15px 15px}
.pi-cardrate{font-size:23px;font-weight:700;color:${ACCENT};letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1}
.pi-cardunit{font-size:11.5px;color:${FAINT};text-transform:uppercase;letter-spacing:.07em;font-weight:600;margin-top:3px}
.pi-cardmeta{display:flex;justify-content:space-between;gap:8px;margin-top:12px;padding-top:11px;border-top:1px solid ${LINE};font-size:13px;color:${SUB}}

.pi-copy{max-width:860px;padding:70px 0 0}
.pi-copy p{font-size:15.5px;line-height:1.85;color:${SUB};margin:0 0 18px}
.pi-method{border-inline-start:2px solid ${GOLD};padding-inline-start:22px}

.pi-links{margin:0;padding-inline-start:18px;list-style:disc;padding-bottom:96px}
.pi-links li{margin-bottom:9px}
.pi-links a{font-size:15px;color:${ACCENT};text-decoration:none;transition:opacity .18s}
.pi-links a:hover{opacity:.75;text-decoration:underline}

/* Light reveal: opacity + 8px, 380ms. Nothing slides across the screen. */
.pi-rv{opacity:0;transform:translateY(8px);transition:opacity .38s ease,transform .38s cubic-bezier(.4,0,.2,1)}
.pi-rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  .pi-rv,.pi-rv.in{opacity:1;transform:none;transition:none}
  .pi-bar-fill,.pi-cardimg img{transition:none}
}
@media (max-width:720px){
  .pi-hero{padding:106px 16px 40px}
  .pi-bar{grid-template-columns:minmax(92px,1fr) 1.1fr auto;gap:10px}
}
`

// MUI overrides kept in one place so every table/control on the page shares
// the site's dark palette instead of Material's default light surfaces.
const cellSx = { fontFamily: FONT, fontSize: 14, color: SUB, borderColor: 'rgba(255,255,255,.055)', whiteSpace: 'nowrap', py: 1.6 }
const headSx = {
  fontFamily: FONT, fontSize: 11.5, fontWeight: 700, letterSpacing: '.07em',
  textTransform: 'uppercase', color: FAINT, borderColor: LINE,
  whiteSpace: 'nowrap', bgcolor: 'rgba(255,255,255,.022)',
  '& .MuiTableSortLabel-root': { color: FAINT },
  '& .MuiTableSortLabel-root:hover': { color: INK },
  '& .MuiTableSortLabel-root.Mui-active': { color: ACCENT },
  '& .MuiTableSortLabel-icon': { color: `${ACCENT} !important` },
}
const panelSx = {
  bgcolor: 'rgba(255,255,255,.028)', border: `1px solid ${LINE}`, borderRadius: '16px',
  backgroundImage: 'none', color: INK,
}

// setTimeout, not requestAnimationFrame: rAF never fires while the tab is
// hidden, which would leave every section stuck at opacity:0.
function useMounted() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 50)
    return () => clearTimeout(id)
  }, [])
  return on
}

const today = () => new Date().toISOString().slice(0, 10)

// The portal only understands four price buckets (SearchPage PRICE_VALUES), so
// a free-form budget hands off to the smallest bucket that contains it.
const PORTAL_BUCKETS = [100000, 200000, 400000, 1000000]
const bucketFor = (budget) => {
  const b = PORTAL_BUCKETS.find((m) => budget <= m)
  return b ? String(b / 1000) : 'any'
}

/** Sortable Material table. `cols` = [{key,label,align,render,value}]. */
function SortableTable({ cols, rows, defaultKey, defaultDir = 'desc' }) {
  const [key, setKey] = useState(defaultKey)
  const [dir, setDir] = useState(defaultDir)
  const sorted = useMemo(() => {
    const col = cols.find((c) => c.key === key)
    if (!col) return rows
    const sign = dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const x = col.value(a); const y = col.value(b)
      if (typeof x === 'string' || typeof y === 'string') return sign * String(x).localeCompare(String(y))
      return sign * ((x ?? -Infinity) - (y ?? -Infinity))
    })
  }, [rows, cols, key, dir])

  const onSort = (k) => {
    if (k === key) setDir(dir === 'asc' ? 'desc' : 'asc')
    else { setKey(k); setDir(k === cols[0].key ? 'asc' : 'desc') }
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ ...panelSx, overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            {cols.map((c) => (
              <TableCell key={c.key} sx={headSx} sortDirection={key === c.key ? dir : false}>
                <TableSortLabel active={key === c.key} direction={key === c.key ? dir : 'asc'} onClick={() => onSort(c.key)}>
                  {c.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.key} hover sx={{ '&:last-child td': { border: 0 } }}>
              {cols.map((c) => (
                <TableCell key={c.key} sx={{ ...cellSx, ...(c.sx || {}) }}>{c.render(r)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default function PriceIndexPage() {
  const { lang } = useI18n()
  const navLocal = useLocalizedNavigate()
  const rtl = lang === 'fa' || lang === 'ar'
  const c = priceIndexCopy(lang)
  const t = c.ui

  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [metric, setMetric] = useState('ppsm')
  const [budget, setBudget] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchProjects(), fetchAllUnits()])
      .then(([p, u]) => { if (!cancelled) { setProjects(p); setUnits(u) } })
      .catch(() => { /* the copy and method still render */ })
    return () => { cancelled = true }
  }, [])

  const items = useMemo(() => {
    const byId = new Map(projects.map((p) => [p.id, p]))
    return units.map((u) => ({ unit: u, project: byId.get(u.project_id) })).filter((x) => x.project)
  }, [projects, units])

  const index = useMemo(() => buildPriceIndex(items), [items])

  // Community photography, derived from the inventory: for each area, walk its
  // projects largest-first and take the first one that actually ships a
  // gallery folder. Never hardcoded, so a delisted project cannot linger.
  const { areaImg, heroImg } = useMemo(() => {
    const count = new Map()
    for (const it of items) {
      const a = it.project.area?.name
      if (!a) continue
      const m = count.get(a) || new Map()
      m.set(it.project.name, (m.get(it.project.name) || 0) + 1)
      count.set(a, m)
    }
    const img = {}
    for (const [area, byProject] of count) {
      for (const [name] of [...byProject.entries()].sort((x, y) => y[1] - x[1])) {
        const g = galleryFor(slugify(name))
        if (g?.length) { img[area] = g[0]; break }
      }
    }
    // Hero = the most expensive community's photograph: apt for a price page,
    // and still entirely data-derived.
    const top = index.byArea?.[0]?.key
    let hero = null
    if (top) {
      const names = [...(count.get(top) || new Map()).entries()].sort((x, y) => y[1] - x[1]).map((e) => e[0])
      for (const n of names) {
        const g = galleryFor(slugify(n))
        if (g?.length) { hero = g[1] || g[0]; break }
      }
    }
    return { areaImg: img, heroImg: hero || img[top] || null }
  }, [items, index])

  // ── budget explorer ───────────────────────────────────────────────────────
  const priced = useMemo(() => items.filter((it) => Number(it.unit.price_omr) > 0), [items])
  const priceBounds = useMemo(() => {
    const p = priced.map((it) => Number(it.unit.price_omr))
    return p.length ? { min: Math.floor(Math.min(...p) / 5000) * 5000, max: Math.ceil(Math.max(...p) / 5000) * 5000 } : null
  }, [priced])

  useEffect(() => {
    // Seed the slider once, at the portfolio median — a sensible starting point
    // rather than an arbitrary number, and it re-seeds if inventory arrives late.
    if (budget == null && index.overall?.medianPrice) setBudget(index.overall.medianPrice)
  }, [index, budget])

  const affordable = useMemo(() => {
    if (!budget) return null
    const within = priced.filter((it) => Number(it.unit.price_omr) <= budget)
    return {
      n: within.length,
      size: within.length ? Math.round(median(within.map((it) => Number(it.unit.total_area_sqm)).filter(Boolean))) : null,
      areas: [...new Set(within.map((it) => it.project.area?.name).filter(Boolean))],
      types: [...new Set(within.map((it) => typeGroup(it.unit.unit_type)))],
    }
  }, [priced, budget])

  const updated = today()
  const vars = {
    units: fmtInt(index.units), areas: index.areas, projects: index.projects,
    updated, excluded: index.plotExcluded,
  }
  const hasData = index.units > 0

  // Dataset + Breadcrumb + FAQ. Reuses the ids the prerenderer writes, so
  // hydration replaces the build-time copy rather than duplicating it.
  useEffect(() => {
    if (!hasData) return
    const nodes = [
      ['price-index-faq-jsonld', priceIndexFaqJsonLd(lang)],
      ['price-index-dataset-jsonld', priceIndexJsonLd(lang, index, updated)],
    ].map(([id, data]) => {
      document.getElementById(id)?.remove()
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = id
      s.textContent = JSON.stringify(data)
      document.head.appendChild(s)
      return s
    })
    return () => nodes.forEach((n) => n.remove())
  }, [lang, index, hasData, updated])

  const shown = useMounted()
  const rv = (i) => ({ className: `pi-rv${shown ? ' in' : ''}`, style: { transitionDelay: `${i * 60}ms` } })

  const thin = (row) => (row.thin
    ? <Tooltip title={c.thinNote}><span style={{ color: GOLD, fontSize: 11, verticalAlign: 'super', cursor: 'help' }}>†</span></Tooltip>
    : null)
  const anyThin = (rows) => rows.some((r) => r.thin)
  const bedLabel = (k) => (k === '0' ? c.studio : k)

  const num = (v) => <span style={{ color: INK, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
  const lead = (v) => <span style={{ color: ACCENT, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
  const nameLink = (to, label, row) => (
    <>
      <LocalizedLink to={to} style={{ color: INK, fontWeight: 600, textDecoration: 'none' }}>{label}</LocalizedLink>
      {thin(row)}
    </>
  )

  // Bars are scaled against the leader, so the chart reads as a comparison
  // rather than an absolute claim. The toggle swaps the whole metric.
  const barVal = (a) => (metric === 'ppsm' ? a.medianPpsm : a.medianPrice) || 0
  const bars = useMemo(() => [...index.byArea].sort((a, b) => barVal(b) - barVal(a)), [index, metric])
  const barMax = Math.max(1, ...bars.map(barVal))

  return (
    <div className="pi-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{CSS}</style>

      {/* ── hero: real project photography + the headline figures ── */}
      <section className="pi-hero">
        <div className={`pi-hero-bg${heroImg && shown ? ' in' : ''}`} aria-hidden="true">
          {/* Decorative: the veil sits over it and the container is
              position:absolute/inset:0, so no intrinsic size is needed and no
              CLS is possible. `fetchpriority` is deliberately LOWERCASE —
              React 18 does not recognise the camelCase spelling and drops it
              with a console warning. */}
          {heroImg && <img src={heroImg} alt="" fetchpriority="high" decoding="async" />}
        </div>
        <div className="pi-hero-veil" aria-hidden="true" />

        <div className="pi-hero-wrap">
          <nav className="pi-crumb">
            <LocalizedLink to="/">Home</LocalizedLink><span>/</span>
            <LocalizedLink to="/project">Oman</LocalizedLink><span>/</span>
            <span style={{ color: SUB }}>{c.h1}</span>
          </nav>

          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.16em', color: ACCENT, textTransform: 'uppercase' }}>
            {c.eyebrow}
          </div>
          <h1 className="pi-h1">{c.h1}</h1>
          <p className="pi-lead">{fill(c.lead, vars)}</p>

          <Chip
            size="small"
            icon={<UpdateRoundedIcon sx={{ fontSize: 16 }} />}
            label={`${c.updatedLabel}: ${updated}`}
            sx={{
              mt: 2.2, fontFamily: FONT, fontSize: 12.5, color: SUB,
              bgcolor: 'rgba(255,255,255,.05)', border: `1px solid ${LINE}`,
              '& .MuiChip-icon': { color: GOLD },
            }}
          />

          {hasData && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(168px,1fr))', gap: 12, marginTop: 26 }}>
              {[
                [fmtInt(index.units), c.stats.units],
                [fmtInt(index.areas), c.stats.areas],
                [fmtInt(index.overall.medianPpsm), c.stats.median],
                [fmtOmr(index.overall.minPrice), c.stats.entry],
              ].map(([v, label], i) => (
                <Paper key={label} elevation={0} className={rv(i).className} style={rv(i).style} sx={{ ...panelSx, p: '16px 18px' }}>
                  <div style={{ fontSize: 'clamp(21px,2.4vw,27px)', fontWeight: 700, color: ACCENT, letterSpacing: '-.02em', lineHeight: 1.15 }}>{v}</div>
                  <div style={{ marginTop: 5, fontSize: 12.5, color: SUB }}>{label}</div>
                </Paper>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="pi-wrap">
        {hasData && (
          <>
            {/* ── community cards + chart + table ── */}
            <section className={`pi-sec ${rv(0).className}`} style={rv(0).style}>
              <SectionHeading eyebrow={t.communitiesHeading} title={c.areasHeading} sx={{ mb: 2 }} />
              <p className="pi-sub">{t.communitiesSub}</p>

              <div className="pi-cards" style={{ marginBottom: 34 }}>
                {index.byArea.map((a) => (
                  <Card key={a.key} className="pi-card" elevation={0} sx={{ ...panelSx, overflow: 'hidden', transition: 'border-color .18s, transform .18s', '&:hover': { borderColor: 'rgba(185,140,82,.5)', transform: 'translateY(-2px)' } }}>
                    <CardActionArea onClick={() => navLocal(`/project?area=${encodeURIComponent(a.key)}`)}>
                      <div className="pi-cardimg">
                        <img src={areaImg[a.key] || FALLBACK_IMG} alt={`Property for sale in ${a.label}, Oman`} loading="lazy" />
                        <span className="pi-cardname">
                          <PlaceRoundedIcon sx={{ fontSize: 16, color: GOLD }} /> {a.label}{a.thin ? ' †' : ''}
                        </span>
                      </div>
                      <div className="pi-cardbody">
                        <div className="pi-cardrate">{fmtInt(a.medianPpsm)}</div>
                        <div className="pi-cardunit">{c.cols.medianPpsm}</div>
                        <div className="pi-cardmeta">
                          <span>{fmtInt(a.n)} {t.homes}</span>
                          <span>{t.from} {fmtOmr(a.minPrice)}</span>
                        </div>
                      </div>
                    </CardActionArea>
                  </Card>
                ))}
              </div>

              <ToggleButtonGroup
                size="small" exclusive value={metric}
                onChange={(_, v) => v && setMetric(v)}
                sx={{
                  mb: 2.5,
                  '& .MuiToggleButton-root': {
                    fontFamily: FONT, fontSize: 13, textTransform: 'none', color: SUB,
                    borderColor: LINE, px: 2,
                  },
                  '& .Mui-selected': { color: `${INK} !important`, bgcolor: 'rgba(185,140,82,.18) !important', borderColor: 'rgba(185,140,82,.45) !important' },
                }}
              >
                <ToggleButton value="ppsm">{t.metricPpsm}</ToggleButton>
                <ToggleButton value="price">{t.metricTotal}</ToggleButton>
              </ToggleButtonGroup>

              <div className="pi-bars">
                {bars.map((a) => (
                  <div className="pi-bar" key={a.key}>
                    <span className="pi-bar-label">{a.label}</span>
                    <span className="pi-bar-track">
                      <span className="pi-bar-fill" style={{ width: shown ? `${Math.round((barVal(a) / barMax) * 100)}%` : '0%' }} />
                    </span>
                    <span className="pi-bar-val">{fmtInt(barVal(a) || null)}</span>
                  </div>
                ))}
              </div>

              <SortableTable
                defaultKey="ppsm"
                rows={index.byArea}
                cols={[
                  { key: 'name', label: c.cols.area, value: (r) => r.label, render: (r) => nameLink(`/project?area=${encodeURIComponent(r.key)}`, r.label, r) },
                  { key: 'city', label: c.cols.city, value: (r) => r.city || '', render: (r) => r.city || '—' },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: (r) => num(fmtInt(r.n)) },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => lead(fmtInt(r.medianPpsm)) },
                  { key: 'range', label: c.cols.rangePpsm, value: (r) => r.minPpsm, render: (r) => fmtRange(r.minPpsm, r.maxPpsm) },
                  { key: 'price', label: c.cols.medianPrice, value: (r) => r.medianPrice, render: (r) => num(fmtOmr(r.medianPrice)) },
                  { key: 'size', label: c.cols.typicalSize, value: (r) => r.medianArea, render: (r) => fmtSqm(r.medianArea) },
                ]}
              />
              <p className="pi-note">{t.sortHint}{anyThin(index.byArea) ? ` · ${c.thinNote}` : ''}</p>
            </section>

            {/* ── budget explorer: the practical half of the page ── */}
            {priceBounds && budget != null && (
              <section className={`pi-sec ${rv(1).className}`} style={rv(1).style}>
                <SectionHeading title={t.budgetHeading} sx={{ mb: 2 }} />
                <p className="pi-sub">{t.budgetSub}</p>

                <Paper elevation={0} sx={{ ...panelSx, p: { xs: 2.5, md: 4 } }}>
                  <div style={{ fontSize: 12.5, color: FAINT, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>{t.budgetLabel}</div>
                  <div style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: ACCENT, letterSpacing: '-.02em', margin: '4px 0 6px', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtOmr(budget)}
                  </div>

                  <Slider
                    value={budget}
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={5000}
                    onChange={(_, v) => setBudget(v)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => fmtOmr(v)}
                    aria-label={t.budgetLabel}
                    sx={{
                      color: GOLD, mt: 1,
                      '& .MuiSlider-rail': { opacity: 0.22 },
                      '& .MuiSlider-thumb': { width: 20, height: 20, '&:hover,&.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(185,140,82,.16)' } },
                      '& .MuiSlider-valueLabel': { fontFamily: FONT, fontSize: 12, bgcolor: '#1a1a1b', border: `1px solid ${LINE}` },
                    }}
                  />

                  <Divider sx={{ borderColor: LINE, my: 2.5 }} />

                  {affordable?.n > 0 ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 18 }}>
                        {[
                          [fmtInt(affordable.n), t.budgetHomes],
                          [fmtSqm(affordable.size), t.budgetSize],
                          [fmtInt(affordable.areas.length), t.budgetAreas],
                          [fmtInt(affordable.types.length), t.budgetTypes],
                        ].map(([v, label]) => (
                          <div key={label}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: INK, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                            <div style={{ fontSize: 12.5, color: SUB, marginTop: 3, lineHeight: 1.45 }}>{label}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                        {affordable.areas.map((a) => (
                          <Chip
                            key={a} label={a} size="small" clickable
                            onClick={() => navLocal(`/project?area=${encodeURIComponent(a)}&price=${bucketFor(budget)}`)}
                            sx={{ fontFamily: FONT, fontSize: 13, color: INK, bgcolor: 'rgba(255,255,255,.05)', border: `1px solid ${LINE}`, '&:hover': { bgcolor: 'rgba(185,140,82,.18)' } }}
                          />
                        ))}
                      </div>

                      <LocalizedLink
                        to={`/project?price=${bucketFor(budget)}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 24,
                          height: 46, padding: '0 22px', background: INK, color: PAPER,
                          borderRadius: 9, fontWeight: 700, fontSize: 14.5, textDecoration: 'none',
                        }}
                      >
                        {t.budgetCta} <ArrowForwardRoundedIcon sx={{ fontSize: 18, transform: rtl ? 'scaleX(-1)' : 'none' }} />
                      </LocalizedLink>
                    </>
                  ) : (
                    <p style={{ margin: 0, fontSize: 15, color: SUB, lineHeight: 1.7 }}>{t.budgetNone}</p>
                  )}
                </Paper>
              </section>
            )}

            {/* ── by type ── */}
            <section className={`pi-sec ${rv(2).className}`} style={rv(2).style}>
              <SectionHeading eyebrow={c.cols.type} title={c.typesHeading} sx={{ mb: 2 }} />
              <p className="pi-sub">{c.typesSub}</p>
              <SortableTable
                defaultKey="ppsm"
                rows={index.byType}
                cols={[
                  { key: 'name', label: c.cols.type, value: (r) => r.label, render: (r) => <>{<span style={{ color: INK, fontWeight: 600 }}>{r.label}</span>}{thin(r)}</> },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: (r) => num(fmtInt(r.n)) },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => lead(fmtInt(r.medianPpsm)) },
                  { key: 'range', label: c.cols.rangePpsm, value: (r) => r.minPpsm, render: (r) => fmtRange(r.minPpsm, r.maxPpsm) },
                  { key: 'price', label: c.cols.medianPrice, value: (r) => r.medianPrice, render: (r) => num(fmtOmr(r.medianPrice)) },
                  { key: 'from', label: c.cols.from, value: (r) => r.minPrice, render: (r) => fmtOmr(r.minPrice) },
                  { key: 'size', label: c.cols.typicalSize, value: (r) => r.medianArea, render: (r) => fmtSqm(r.medianArea) },
                ]}
              />
              {anyThin(index.byType) && <p className="pi-note">{c.thinNote}</p>}
            </section>

            {/* ── by bedrooms ── */}
            <section className={`pi-sec ${rv(3).className}`} style={rv(3).style}>
              <SectionHeading eyebrow={c.cols.beds} title={c.bedsHeading} sx={{ mb: 2 }} />
              <p className="pi-sub">{c.bedsSub}</p>
              <SortableTable
                defaultKey="name" defaultDir="asc"
                rows={index.byBeds}
                cols={[
                  { key: 'name', label: c.cols.beds, value: (r) => Number(r.key), render: (r) => <>{<span style={{ color: INK, fontWeight: 600 }}>{bedLabel(r.key)}</span>}{thin(r)}</> },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: (r) => num(fmtInt(r.n)) },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => lead(fmtInt(r.medianPpsm)) },
                  { key: 'price', label: c.cols.medianPrice, value: (r) => r.medianPrice, render: (r) => num(fmtOmr(r.medianPrice)) },
                  { key: 'from', label: c.cols.from, value: (r) => r.minPrice, render: (r) => fmtOmr(r.minPrice) },
                  { key: 'size', label: c.cols.typicalSize, value: (r) => r.medianArea, render: (r) => fmtSqm(r.medianArea) },
                ]}
              />
              {anyThin(index.byBeds) && <p className="pi-note">{c.thinNote}</p>}
            </section>

            {/* ── by development ── */}
            <section className={`pi-sec ${rv(4).className}`} style={rv(4).style}>
              <SectionHeading eyebrow={c.cols.project} title={c.projectsHeading} sx={{ mb: 2 }} />
              <p className="pi-sub">{c.projectsSub}</p>
              <SortableTable
                defaultKey="ppsm"
                rows={index.byProject}
                cols={[
                  { key: 'name', label: c.cols.project, value: (r) => r.label, render: (r) => nameLink(`/buy/${r.slug}`, r.label, r) },
                  { key: 'area', label: c.cols.area, value: (r) => r.area || '', render: (r) => r.area || '—' },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: (r) => num(fmtInt(r.n)) },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => lead(fmtInt(r.medianPpsm)) },
                  { key: 'range', label: c.cols.rangePpsm, value: (r) => r.minPpsm, render: (r) => fmtRange(r.minPpsm, r.maxPpsm) },
                  { key: 'from', label: c.cols.from, value: (r) => r.minPrice, render: (r) => num(fmtOmr(r.minPrice)) },
                ]}
              />
              {anyThin(index.byProject) && <p className="pi-note">{c.thinNote}</p>}
            </section>
          </>
        )}

        {/* ── method + analysis + FAQ ── */}
        <section className={`pi-copy ${rv(5).className}`} style={{ textAlign: rtl ? 'right' : 'left', ...rv(5).style }}>
          <div className="pi-method">
            <SectionHeading title={c.methodHeading} sx={{ mb: 2.5 }} />
            {c.methodParas.map((p, i) => <p key={i}>{fill(p, vars)}</p>)}
          </div>

          <div style={{ marginTop: 56 }}>
            <SectionHeading title={c.heading} sx={{ mb: 2.5 }} />
            {c.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div style={{ marginTop: 44 }}>
            <FaqAccordion items={c.faq} />
          </div>

          <Paper elevation={0} sx={{ ...panelSx, mt: 7, p: { xs: 3, md: 4 } }}>
            <h2 style={{ fontWeight: 600, fontSize: 'clamp(19px,2.1vw,24px)', color: INK, margin: '0 0 10px' }}>{c.ctaHeading}</h2>
            <p style={{ margin: '0 0 20px', maxWidth: 640 }}>{c.ctaText}</p>
            <LocalizedLink
              to="/project"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, height: 48,
                padding: '0 24px', background: INK, color: PAPER, borderRadius: 9,
                fontWeight: 700, fontSize: 14.5, textDecoration: 'none',
              }}
            >
              {c.ctaBtn} <ArrowForwardRoundedIcon sx={{ fontSize: 18, transform: rtl ? 'scaleX(-1)' : 'none' }} />
            </LocalizedLink>
          </Paper>

          <h3 style={{ fontWeight: 600, fontSize: 17, color: INK, margin: '48px 0 12px' }}>{c.linksHeading}</h3>
          <ul className="pi-links">
            {c.links.map((l) => (
              <li key={l.href}><LocalizedLink to={l.href}>{l.label}</LocalizedLink></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
