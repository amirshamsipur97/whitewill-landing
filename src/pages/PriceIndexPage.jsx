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
 * Design follows CityLandingPage (`.cl-*`) — same dark portal language, own
 * scoped `.pi-*` block. Motion is React-state driven with setTimeout, never
 * rAF: rAF does not fire in a hidden tab and would leave the page at
 * opacity:0 (see HANDOFF-SEO-2026-07-25 §4).
 */
import { useEffect, useMemo, useState } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { LocalizedLink } from '../lib/localize.js'
import { FONT, OLIVE_BRIGHT } from '../components/invest/ui.jsx'
import {
  buildPriceIndex, fmtInt, fmtOmr, fmtRange, fmtSqm,
} from '../priceIndexData.mjs'
import {
  priceIndexCopy, priceIndexFaqJsonLd, priceIndexJsonLd, fill,
} from '../priceIndexContent.mjs'

const PAPER = '#0b0b0c'
const SURFACE = '#151517'
const INK = '#f4f2ec'
const SUB = 'rgba(244,242,236,0.62)'
const FAINT = 'rgba(244,242,236,0.42)'
const LINE = 'rgba(255,255,255,0.10)'
const ACCENT = OLIVE_BRIGHT
const GOLD = '#B98C52'

const CSS = `
.pi-page{background:${PAPER};color:${INK};min-height:100vh;font-family:${FONT}}
.pi-wrap{max-width:1180px;margin:0 auto;padding:0 20px}

.pi-hero{position:relative;padding:132px 20px 52px;background:
  radial-gradient(900px 420px at 50% -10%,rgba(185,140,82,.16),transparent 70%),#0a0a0b;
  border-bottom:1px solid ${LINE}}
.pi-hero-wrap{max-width:1180px;margin:0 auto}
.pi-crumb{display:flex;gap:8px;align-items:center;flex-wrap:wrap;color:${FAINT};font-size:13px;margin-bottom:22px}
.pi-crumb a{color:${FAINT};text-decoration:none;transition:color .2s}
.pi-crumb a:hover{color:${INK}}
.pi-eyebrow{font-size:13px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:${GOLD}}
.pi-h1{margin:10px 0 0;font-weight:400;font-size:clamp(30px,4.6vw,54px);letter-spacing:-.02em;color:#fff;line-height:1.06}
.pi-lead{margin:15px 0 0;font-size:clamp(14.5px,1.4vw,16.5px);line-height:1.7;color:${SUB};max-width:720px}
.pi-updated{margin-top:16px;font-size:12.5px;color:${FAINT};letter-spacing:.02em}

.pi-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:12px;margin-top:28px}
.pi-stat{background:rgba(255,255,255,.04);border:1px solid ${LINE};border-radius:13px;padding:16px 18px}
.pi-stat b{display:block;font-size:clamp(21px,2.4vw,27px);font-weight:700;color:${ACCENT};letter-spacing:-.02em;line-height:1.15}
.pi-stat span{display:block;margin-top:5px;font-size:12.5px;color:${SUB}}

.pi-sec{padding:56px 0 0}
.pi-h2{font-weight:600;font-size:clamp(20px,2.3vw,27px);color:${INK};margin:0 0 6px;letter-spacing:-.01em}
.pi-sub{font-size:14.5px;line-height:1.6;color:${SUB};margin:0 0 20px;max-width:760px}

/* Tables scroll inside their own box — the page body must never scroll sideways. */
.pi-tablebox{overflow-x:auto;border:1px solid ${LINE};border-radius:14px;background:${SURFACE};-webkit-overflow-scrolling:touch}
.pi-table{width:100%;border-collapse:collapse;font-size:14px;min-width:640px}
.pi-table th{text-align:start;font-weight:600;font-size:11.5px;letter-spacing:.07em;text-transform:uppercase;color:${FAINT};padding:13px 16px;border-bottom:1px solid ${LINE};white-space:nowrap;background:rgba(255,255,255,.02)}
.pi-table td{padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.055);color:${SUB};white-space:nowrap}
.pi-table tr:last-child td{border-bottom:none}
.pi-table tbody tr{transition:background .2s}
.pi-table tbody tr:hover{background:rgba(255,255,255,.028)}
.pi-name{color:${INK};font-weight:600;text-decoration:none;transition:color .2s}
a.pi-name:hover{color:${ACCENT}}
.pi-num{color:${INK};font-weight:600;font-variant-numeric:tabular-nums}
.pi-lead-num{color:${ACCENT};font-weight:700;font-variant-numeric:tabular-nums}
.pi-thin{color:${GOLD};font-size:11px;vertical-align:super}
.pi-note{font-size:12.5px;color:${FAINT};margin:10px 0 0;line-height:1.6}

/* Bar chart — plain CSS widths, no charting library and no JS animation. */
.pi-bars{display:flex;flex-direction:column;gap:10px;margin-bottom:22px}
.pi-bar{display:grid;grid-template-columns:minmax(120px,190px) 1fr auto;align-items:center;gap:14px}
.pi-bar-label{font-size:13.5px;color:${SUB};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pi-bar-track{height:10px;background:rgba(255,255,255,.055);border-radius:999px;overflow:hidden}
.pi-bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,${GOLD},${ACCENT});transition:width .9s cubic-bezier(.2,.7,.3,1)}
.pi-bar-val{font-size:13.5px;font-weight:700;color:${INK};font-variant-numeric:tabular-nums;min-width:56px;text-align:end}
[dir=rtl] .pi-bar-fill{background:linear-gradient(270deg,${GOLD},${ACCENT})}

.pi-copy{max-width:860px;padding:64px 0 0}
.pi-copy h2{font-weight:600;font-size:clamp(21px,2.5vw,29px);color:${INK};margin:0 0 18px;line-height:1.25;letter-spacing:-.01em}
.pi-copy p{font-size:15.5px;line-height:1.85;color:${SUB};margin:0 0 18px}
.pi-method{border-inline-start:2px solid ${GOLD};padding-inline-start:20px}
.pi-faq{margin-top:34px}
.pi-faq h3{font-weight:600;font-size:17px;color:${INK};margin:0 0 8px}
.pi-faq p{font-size:15px;line-height:1.8;margin:0}
.pi-faq>div{margin-bottom:22px;padding-inline-start:14px;border-inline-start:2px solid rgba(255,255,255,.09);transition:border-color .3s}
.pi-faq>div:hover{border-inline-start-color:${ACCENT}}

.pi-cta{margin:56px 0 0;background:rgba(255,255,255,.035);border:1px solid ${LINE};border-radius:16px;padding:32px 30px}
.pi-cta h2{font-weight:600;font-size:clamp(19px,2.1vw,24px);color:${INK};margin:0 0 10px}
.pi-cta p{font-size:15px;line-height:1.75;color:${SUB};margin:0 0 20px;max-width:640px}
.pi-btn{display:inline-flex;align-items:center;gap:9px;height:48px;padding:0 24px;background:${INK};color:${PAPER};border-radius:9px;font-weight:700;font-size:14.5px;text-decoration:none;transition:background .2s,color .2s,gap .2s}
.pi-btn:hover{background:${GOLD};color:#fff;gap:14px}

.pi-links{margin:0;padding-inline-start:18px;list-style:disc;padding-bottom:96px}
.pi-links li{margin-bottom:9px}
.pi-links a{font-size:15px;color:${ACCENT};text-decoration:none;transition:opacity .2s}
.pi-links a:hover{opacity:.75;text-decoration:underline}

.pi-reveal{opacity:0;transform:translateY(20px);transition:opacity .8s cubic-bezier(.2,.7,.3,1),transform .8s cubic-bezier(.2,.7,.3,1)}
.pi-reveal.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.pi-reveal,.pi-reveal.in{opacity:1;transform:none;transition:none}.pi-bar-fill{transition:none}}
@media (max-width:720px){
  .pi-hero{padding:110px 16px 40px}
  .pi-bar{grid-template-columns:minmax(96px,1fr) 1.2fr auto;gap:10px}
}
`

// setTimeout, not requestAnimationFrame: rAF never fires while the tab is
// hidden, which would leave every section stuck at opacity:0.
function useMounted() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 60)
    return () => clearTimeout(id)
  }, [])
  return on
}

const today = () => new Date().toISOString().slice(0, 10)

export default function PriceIndexPage() {
  const { lang } = useI18n()
  const rtl = lang === 'fa' || lang === 'ar'
  const c = priceIndexCopy(lang)

  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchProjects(), fetchAllUnits()])
      .then(([p, u]) => { if (!cancelled) { setProjects(p); setUnits(u) } })
      .catch(() => { /* the copy and method still render */ })
    return () => { cancelled = true }
  }, [])

  const index = useMemo(() => {
    const byId = new Map(projects.map((p) => [p.id, p]))
    return buildPriceIndex(
      units.map((u) => ({ unit: u, project: byId.get(u.project_id) })).filter((x) => x.project),
    )
  }, [projects, units])

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
  const rv = (i) => ({ className: `pi-reveal${shown ? ' in' : ''}`, style: { transitionDelay: `${i * 80}ms` } })

  const thin = (row) => (row.thin ? <span className="pi-thin" title={c.thinNote}>†</span> : null)
  const anyThin = (rows) => rows.some((r) => r.thin)
  const bedLabel = (k) => (k === '0' ? c.studio : k)

  // Bars are scaled against the most expensive community, so the chart reads
  // as a comparison rather than an absolute claim.
  const maxPpsm = Math.max(1, ...index.byArea.map((a) => a.medianPpsm || 0))

  const Table = ({ head, rows }) => (
    <>
      <div className="pi-tablebox">
        <table className="pi-table">
          <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </>
  )

  return (
    <div className="pi-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{CSS}</style>

      <section className="pi-hero">
        <div className="pi-hero-wrap">
          <nav className="pi-crumb">
            <LocalizedLink to="/">Home</LocalizedLink><span>/</span>
            <LocalizedLink to="/project">Oman</LocalizedLink><span>/</span>
            <span style={{ color: SUB }}>{c.h1}</span>
          </nav>
          <div className="pi-eyebrow">{c.eyebrow}</div>
          <h1 className="pi-h1">{c.h1}</h1>
          <p className="pi-lead">{fill(c.lead, vars)}</p>
          <div className="pi-updated">{c.updatedLabel}: {updated}</div>

          {hasData && (
            <div className="pi-stats">
              <div className="pi-stat"><b>{fmtInt(index.units)}</b><span>{c.stats.units}</span></div>
              <div className="pi-stat"><b>{fmtInt(index.areas)}</b><span>{c.stats.areas}</span></div>
              <div className="pi-stat"><b>{fmtInt(index.overall.medianPpsm)}</b><span>{c.stats.median}</span></div>
              <div className="pi-stat"><b>{fmtOmr(index.overall.minPrice)}</b><span>{c.stats.entry}</span></div>
            </div>
          )}
        </div>
      </section>

      <div className="pi-wrap">
        {hasData && (
          <>
            {/* ── by community ── */}
            <section className={`pi-sec ${rv(0).className}`} style={rv(0).style}>
              <h2 className="pi-h2">{c.areasHeading}</h2>
              <p className="pi-sub">{c.areasSub}</p>

              <div className="pi-bars">
                {index.byArea.map((a) => (
                  <div className="pi-bar" key={a.key}>
                    <span className="pi-bar-label">{a.label}</span>
                    <span className="pi-bar-track">
                      <span className="pi-bar-fill" style={{ width: shown ? `${Math.round(((a.medianPpsm || 0) / maxPpsm) * 100)}%` : '0%' }} />
                    </span>
                    <span className="pi-bar-val">{fmtInt(a.medianPpsm)}</span>
                  </div>
                ))}
              </div>

              <Table
                head={[c.cols.area, c.cols.city, c.cols.units, c.cols.medianPpsm, c.cols.rangePpsm, c.cols.medianPrice, c.cols.typicalSize]}
                rows={index.byArea.map((a) => (
                  <tr key={a.key}>
                    <td>
                      <LocalizedLink className="pi-name" to={`/project?area=${encodeURIComponent(a.key)}`}>{a.label}</LocalizedLink>
                      {thin(a)}
                    </td>
                    <td>{a.city || '—'}</td>
                    <td className="pi-num">{fmtInt(a.n)}</td>
                    <td className="pi-lead-num">{fmtInt(a.medianPpsm)}</td>
                    <td>{fmtRange(a.minPpsm, a.maxPpsm)}</td>
                    <td className="pi-num">{fmtOmr(a.medianPrice)}</td>
                    <td>{fmtSqm(a.medianArea)}</td>
                  </tr>
                ))}
              />
              {anyThin(index.byArea) && <p className="pi-note">{c.thinNote}</p>}
            </section>

            {/* ── by type ── */}
            <section className={`pi-sec ${rv(1).className}`} style={rv(1).style}>
              <h2 className="pi-h2">{c.typesHeading}</h2>
              <p className="pi-sub">{c.typesSub}</p>
              <Table
                head={[c.cols.type, c.cols.units, c.cols.medianPpsm, c.cols.rangePpsm, c.cols.medianPrice, c.cols.from, c.cols.typicalSize]}
                rows={index.byType.map((t) => (
                  <tr key={t.key}>
                    <td><span className="pi-name">{t.label}</span>{thin(t)}</td>
                    <td className="pi-num">{fmtInt(t.n)}</td>
                    <td className="pi-lead-num">{fmtInt(t.medianPpsm)}</td>
                    <td>{fmtRange(t.minPpsm, t.maxPpsm)}</td>
                    <td className="pi-num">{fmtOmr(t.medianPrice)}</td>
                    <td>{fmtOmr(t.minPrice)}</td>
                    <td>{fmtSqm(t.medianArea)}</td>
                  </tr>
                ))}
              />
              {anyThin(index.byType) && <p className="pi-note">{c.thinNote}</p>}
            </section>

            {/* ── by bedrooms ── */}
            <section className={`pi-sec ${rv(2).className}`} style={rv(2).style}>
              <h2 className="pi-h2">{c.bedsHeading}</h2>
              <p className="pi-sub">{c.bedsSub}</p>
              <Table
                head={[c.cols.beds, c.cols.units, c.cols.medianPpsm, c.cols.medianPrice, c.cols.from, c.cols.typicalSize]}
                rows={index.byBeds.map((b) => (
                  <tr key={b.key}>
                    <td><span className="pi-name">{bedLabel(b.key)}</span>{thin(b)}</td>
                    <td className="pi-num">{fmtInt(b.n)}</td>
                    <td className="pi-lead-num">{fmtInt(b.medianPpsm)}</td>
                    <td className="pi-num">{fmtOmr(b.medianPrice)}</td>
                    <td>{fmtOmr(b.minPrice)}</td>
                    <td>{fmtSqm(b.medianArea)}</td>
                  </tr>
                ))}
              />
              {anyThin(index.byBeds) && <p className="pi-note">{c.thinNote}</p>}
            </section>

            {/* ── by development ── */}
            <section className={`pi-sec ${rv(3).className}`} style={rv(3).style}>
              <h2 className="pi-h2">{c.projectsHeading}</h2>
              <p className="pi-sub">{c.projectsSub}</p>
              <Table
                head={[c.cols.project, c.cols.area, c.cols.units, c.cols.medianPpsm, c.cols.rangePpsm, c.cols.from]}
                rows={index.byProject.map((p) => (
                  <tr key={p.key}>
                    <td>
                      <LocalizedLink className="pi-name" to={`/buy/${p.slug}`}>{p.label}</LocalizedLink>
                      {thin(p)}
                    </td>
                    <td>{p.area || '—'}</td>
                    <td className="pi-num">{fmtInt(p.n)}</td>
                    <td className="pi-lead-num">{fmtInt(p.medianPpsm)}</td>
                    <td>{fmtRange(p.minPpsm, p.maxPpsm)}</td>
                    <td className="pi-num">{fmtOmr(p.minPrice)}</td>
                  </tr>
                ))}
              />
              {anyThin(index.byProject) && <p className="pi-note">{c.thinNote}</p>}
            </section>
          </>
        )}

        {/* ── method + analysis + FAQ ── */}
        <section className={`pi-copy ${rv(4).className}`} style={{ textAlign: rtl ? 'right' : 'left', ...rv(4).style }}>
          <div className="pi-method">
            <h2>{c.methodHeading}</h2>
            {c.methodParas.map((p, i) => <p key={i}>{fill(p, vars)}</p>)}
          </div>

          <div style={{ marginTop: 48 }}>
            <h2>{c.heading}</h2>
            {c.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="pi-faq">
            {c.faq.map((f, i) => (
              <div key={i}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <div className="pi-cta">
            <h2>{c.ctaHeading}</h2>
            <p>{c.ctaText}</p>
            <LocalizedLink className="pi-btn" to="/project">
              {c.ctaBtn} <ArrowForwardRoundedIcon sx={{ fontSize: 18, transform: rtl ? 'scaleX(-1)' : 'none' }} />
            </LocalizedLink>
          </div>

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
