/**
 * GoldenVisaPage — /oman-golden-visa
 *
 * WHY: "oman golden visa" is 260/mo in the Oman geo at LOW competition and
 * +175% year on year (GKP, 2026-07-23), and the site had no page for it at
 * all. The C1 campaign proved the cost of that gap the expensive way: its
 * golden-visa keyword cluster spent ~$210 in the UAE and converted zero,
 * because the ads had nowhere honest to land.
 *
 * DESIGN is deliberately a copy of PriceIndexPage, which is the client's
 * approved light look: the Perumnas kit (TCwUAiZbL29LTXvPdymh8I node 5:32) for
 * layout and tokens, the Tables kit (7CQA0rYUdROKqkHcT2HvHx node 202:20434)
 * for the data table. Same Neutral 0/25/100/600/900 scale, same Inter Display
 * type ramp, same three signature moves — full-bleed photo dissolving into
 * white, left-heading / right-body split, naked stat numbers.
 *
 * THREE TRAPS of being a light page on a dark site, all inherited from
 * PriceIndexPage and all still live here:
 *  1. components/invest/ui.jsx hardcodes white text, so its SectionHeading and
 *     FaqAccordion cannot be reused; light equivalents are local.
 *  2. The global stylesheet paints html, body AND #root black. The override
 *     needs !important because an id selector outranks a type selector. React
 *     unmounts this <style> block, so the dark site restores itself.
 *  3. The prerendered shell needs its own full-bleed white wrapper, otherwise
 *     the pre-React paint is a centred column between two black bars.
 *
 * EDITORIAL RULE, and the reason this page can be trusted: it separates the
 * two residencies instead of blurring them. Oman's Golden Residency has a real
 * threshold (OMR 250,000 / 500,000) that MOST of our stock does not meet, and
 * the ITC purchase route is a different, lower permit. Saying so costs a few
 * leads and buys every one that remains.
 *
 * Motion: CSS transition driven by React state via setTimeout, never rAF,
 * which does not fire in a hidden tab and would leave the page at opacity 0.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Collapse } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { galleryFor, thumbForSlug } from '../projectGallery.js'
import { LocalizedLink, useLocalizedNavigate } from '../lib/localize.js'
import { FONT } from '../components/invest/ui.jsx'
import { slugify, fmtInt, fmtOmr } from '../priceIndexData.mjs'
import { buildGoldenVisa, TIER_5_OMR, TIER_10_OMR } from '../goldenVisaData.mjs'
import {
  goldenVisaCopy, goldenVisaFaqJsonLd, goldenVisaJsonLd, fill,
} from '../goldenVisaContent.mjs'

// Perumnas kit tokens, verbatim — identical to PriceIndexPage on purpose.
const N0 = '#FFFFFF'
const N25 = '#FAFAFB'
const N100 = '#E5E5E6'
const N600 = '#61656E'
const N900 = '#12161D'
const OLIVE = '#6f7020'

const FALLBACK_IMG = '/images/hero-poster.jpg'
const FALLBACK_THUMB = '/images/hero-poster-640.webp'
const TILE_SIZES = '(max-width:600px) 88vw, (max-width:900px) 45vw, 320px'

const CSS = `
html,body,#root{background:${N0} !important}
.gv-page{background:${N0};color:${N900};min-height:100vh;font-family:${FONT};
  -webkit-font-smoothing:antialiased}
.gv-wrap{max-width:1280px;margin:0 auto;padding:0 24px}

.gv-hero{position:relative;min-height:min(70vh,600px);display:flex;align-items:center;
  justify-content:center;text-align:center;padding:150px 24px 120px;overflow:hidden;background:#c9d3dc}
.gv-hero-bg{position:absolute;inset:0;z-index:0;opacity:0;transition:opacity .7s ease}
.gv-hero-bg.in{opacity:1}
.gv-hero-bg img{width:100%;height:100%;object-fit:cover;display:block}
.gv-hero-fade{position:absolute;inset:0;z-index:1;background:
  radial-gradient(760px 380px at 50% 44%,rgba(8,12,18,.34),rgba(8,12,18,0) 74%),
  linear-gradient(180deg,rgba(8,12,18,.38) 0%,rgba(8,12,18,.18) 32%,rgba(8,12,18,.03) 56%,rgba(255,255,255,.46) 80%,${N0} 100%)}
.gv-hero-in{position:relative;z-index:2;max-width:920px}
.gv-crumb{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;
  color:rgba(255,255,255,.78);font-size:14px;margin-bottom:26px}
.gv-crumb a{color:rgba(255,255,255,.78);text-decoration:none;transition:color .18s}
.gv-crumb a:hover{color:#fff}
.gv-eyebrow{font-size:14px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(255,255,255,.9);text-shadow:0 1px 12px rgba(0,0,0,.4)}
.gv-d2{margin:14px 0 0;font-weight:500;font-size:clamp(32px,5vw,68px);line-height:1.09;
  letter-spacing:-.035em;color:#fff;text-shadow:0 2px 22px rgba(0,0,0,.5)}
.gv-hero-meta{margin:24px 0 0;font-size:13.5px;color:rgba(255,255,255,.8);
  text-shadow:0 1px 12px rgba(0,0,0,.45)}

.gv-split{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
.gv-h1{font-weight:500;font-size:clamp(28px,3.4vw,44px);line-height:1.18;letter-spacing:-.01em;
  color:${N900};margin:0}
.gv-h2{font-weight:500;font-size:clamp(24px,2.8vw,36px);line-height:1.3;letter-spacing:-.01em;
  color:${N900};margin:0 0 10px}
.gv-h3{font-weight:500;font-size:clamp(18px,1.8vw,23px);line-height:1.34;color:${N900};margin:0}
.gv-p{font-size:clamp(15.5px,1.35vw,18px);line-height:1.62;color:${N600};margin:0 0 20px}

.gv-stats{display:flex;flex-wrap:wrap;gap:14px 56px;margin-top:36px}
.gv-stat b{display:block;font-weight:500;font-size:clamp(26px,3vw,36px);line-height:1.2;
  letter-spacing:-.02em;color:${N900};font-variant-numeric:tabular-nums}
.gv-stat span{display:block;margin-top:8px;font-size:14px;color:${N600}}

.gv-sec{padding:96px 0 0}
.gv-sec-head{max-width:780px;margin-bottom:34px}
.gv-note{font-size:14px;color:${N600};margin:18px 0 0;line-height:1.55}

/* ── the two routes, side by side. The whole point of the page. ────────── */
.gv-routes{display:grid;grid-template-columns:1fr 1fr;gap:28px}
.gv-route{border:1px solid ${N100};border-radius:18px;padding:30px 30px 32px;background:${N25}}
.gv-route:first-child{border-inline-start:3px solid ${OLIVE}}
.gv-route-sub{margin:8px 0 18px;font-size:13px;font-weight:600;letter-spacing:.1em;
  text-transform:uppercase;color:${OLIVE}}
.gv-route p{margin:0;font-size:15.5px;line-height:1.62;color:${N600}}

/* ── qualifying table, Tables kit: no container border, one 2px rule ───── */
.gv-tablewrap{overflow-x:auto}
.gv-table{border-collapse:collapse;width:100%;font-size:15px;min-width:640px}
.gv-table th{text-align:start;padding:12px 14px;color:${N600};font-weight:400;
  border-bottom:2px solid ${N900};white-space:nowrap}
.gv-table td{padding:15px 14px;border-bottom:1px solid ${N100};vertical-align:top}
.gv-table tbody tr:hover{background:${N25}}
.gv-table td:first-child{font-weight:500;color:${N900}}
.gv-num{font-variant-numeric:tabular-nums}
.gv-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12.5px;
  font-weight:600;background:#E3F5E9;color:#1E6B3A}
.gv-chip--thin{background:#FCF3DC;color:#7A5C13}

/* ── process steps ─────────────────────────────────────────────────────── */
.gv-steps{display:grid;gap:0}
.gv-step{display:grid;grid-template-columns:76px 1fr;gap:24px;padding:26px 0;
  border-top:1px solid ${N100}}
.gv-step:last-child{border-bottom:1px solid ${N100}}
.gv-step-n{font-variant-numeric:tabular-nums;font-size:15px;font-weight:600;color:${OLIVE};
  letter-spacing:.06em}
.gv-step p{margin:8px 0 0;font-size:15.5px;line-height:1.6;color:${N600}}

/* ── community tiles ───────────────────────────────────────────────────── */
.gv-strip{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(310px,1fr);gap:28px;
  overflow-x:auto;padding-bottom:8px;scroll-snap-type:x proximity}
.gv-strip::-webkit-scrollbar{height:6px}
.gv-strip::-webkit-scrollbar-thumb{background:${N100};border-radius:99px}
.gv-tile{scroll-snap-align:start;text-align:start;background:none;border:0;padding:0;
  cursor:pointer;font-family:inherit}
.gv-tileimg{position:relative;aspect-ratio:16/11;overflow:hidden;border-radius:14px;background:${N25}}
.gv-tileimg img{width:100%;height:100%;object-fit:cover;display:block;
  transition:transform .5s cubic-bezier(.2,.7,.3,1)}
.gv-tile:hover .gv-tileimg img{transform:scale(1.04)}
.gv-tilefoot{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;padding:14px 2px 0}
.gv-tilename{font-weight:500;font-size:17px;color:${N900}}
.gv-tilemeta{margin-top:4px;font-size:13.5px;color:${N600}}
.gv-tilerate b{font-weight:500;font-size:17px;color:${N900};font-variant-numeric:tabular-nums}

/* ── FAQ ───────────────────────────────────────────────────────────────── */
.gv-faq{display:flex;flex-direction:column;gap:16px}
.gv-faq-item{border:1px solid ${N100};border-radius:14px;background:${N25};overflow:hidden;
  transition:border-color .2s}
.gv-faq-item:hover{border-inline-start:3px solid ${OLIVE}}
.gv-faq-q{width:100%;display:flex;justify-content:space-between;align-items:center;gap:18px;
  padding:20px 22px;background:none;border:0;cursor:pointer;text-align:start;font-family:inherit;
  font-size:16.5px;font-weight:500;color:${N900};line-height:1.4}
.gv-faq-a{padding:0 22px 22px;font-size:15.5px;line-height:1.62;color:${N600}}

.gv-links{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:10px}
.gv-links a{color:${OLIVE};font-size:15.5px;text-decoration:none;border-bottom:1px solid transparent}
.gv-links a:hover{border-bottom-color:${OLIVE}}

.gv-cta{margin-top:96px;border-top:1px solid ${N100};padding:56px 0 0}
.gv-btn{display:inline-flex;align-items:center;gap:10px;margin-top:22px;padding:14px 26px;
  border-radius:999px;background:${N900};color:${N0};font-size:15.5px;font-weight:600;
  text-decoration:none;transition:opacity .18s}
.gv-btn:hover{opacity:.86}

.gv-rv{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease}
.gv-rv.in{opacity:1;transform:none}

@media (max-width:900px){
  .gv-split,.gv-routes{grid-template-columns:1fr;gap:28px}
  .gv-sec{padding:64px 0 0}
  .gv-step{grid-template-columns:56px 1fr;gap:16px}
}
@media (prefers-reduced-motion:reduce){
  .gv-rv{transition:none}
  .gv-tileimg img{transition:none}
}
`

/** setTimeout, never rAF: rAF does not fire in a hidden tab and the page would
 *  stay at opacity 0 forever. */
function useMounted() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 60)
    return () => clearTimeout(id)
  }, [])
  return on
}

export default function GoldenVisaPage() {
  const { lang } = useI18n()
  const navLocal = useLocalizedNavigate()
  const c = goldenVisaCopy(lang)
  const rtl = lang === 'fa' || lang === 'ar'
  const shown = useMounted()

  const [items, setItems] = useState([])
  const [openFaq, setOpenFaq] = useState(-1)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchProjects(), fetchAllUnits()])
      .then(([projects, units]) => {
        if (cancelled) return
        const byId = new Map((projects || []).map((p) => [p.id, p]))
        setItems(
          (units || [])
            .map((u) => ({ unit: u, project: byId.get(u.project_id) }))
            .filter((x) => x.project),
        )
      })
      .catch(() => { /* the copy still renders without live figures */ })
    return () => { cancelled = true }
  }, [])

  const gv = useMemo(() => buildGoldenVisa(items), [items])
  const hasData = gv.units > 0

  const vars = {
    units: fmtInt(gv.units),
    qualify5: fmtInt(gv.qualify5),
    qualify10: fmtInt(gv.qualify10),
    areas: gv.areas,
    projects: gv.projects,
    entry: fmtOmr(gv.entryPrice),
    tier5: fmtOmr(TIER_5_OMR),
    tier10: fmtOmr(TIER_10_OMR),
  }

  // Hero + tile imagery derived from the QUALIFYING inventory, never
  // hardcoded, so a delisted development can't linger on the page.
  const { areaImg, heroImg } = useMemo(() => {
    const count = new Map()
    for (const it of items) {
      if (Number(it.unit.price_omr) < TIER_5_OMR) continue
      const a = it.project.area?.name
      if (!a) continue
      const m = count.get(a) || new Map()
      m.set(it.project.name, (m.get(it.project.name) || 0) + 1)
      count.set(a, m)
    }
    const img = {}
    for (const [area, byProject] of count) {
      for (const [name] of [...byProject.entries()].sort((x, y) => y[1] - x[1])) {
        const slug = slugify(name)
        const g = galleryFor(slug)
        if (g?.length) { img[area] = { url: g[0], thumb: thumbForSlug(slug) }; break }
      }
    }
    const top = gv.byArea?.[0]?.key
    let hero = null
    if (top) {
      const names = [...(count.get(top) || new Map()).entries()].sort((x, y) => y[1] - x[1]).map((e) => e[0])
      for (const n of names) {
        const g = galleryFor(slugify(n))
        if (g?.length) { hero = g[1] || g[0]; break }
      }
    }
    return { areaImg: img, heroImg: hero || img[top]?.url || null }
  }, [items, gv])

  // JSON-LD is injected into <head> and removed on unmount so a client-side
  // route change never leaves another page's schema behind.
  useEffect(() => {
    if (!hasData) return undefined
    const blocks = [
      ['gv-faq-jsonld', goldenVisaFaqJsonLd(lang, vars)],
      ['gv-howto-jsonld', goldenVisaJsonLd(lang, vars)],
    ]
    const nodes = blocks.map(([id, data]) => {
      document.getElementById(id)?.remove()
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = id
      s.textContent = JSON.stringify(data)
      document.head.appendChild(s)
      return s
    })
    return () => nodes.forEach((n) => n.remove())
  }, [lang, hasData, gv])

  const rv = (i) => ({ className: `gv-rv${shown ? ' in' : ''}`, style: { transitionDelay: `${i * 60}ms` } })

  return (
    <div className="gv-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{CSS}</style>

      <section className="gv-hero">
        <div className={`gv-hero-bg${heroImg && shown ? ' in' : ''}`} aria-hidden="true">
          {/* Decorative: the wrapper is aria-hidden and absolutely positioned,
              so no intrinsic size is needed and no CLS is possible.
              `fetchpriority` is lowercase on purpose, React 18 drops the
              camelCase spelling with a console warning. */}
          {heroImg && <img src={heroImg} alt="" fetchpriority="high" decoding="async" />}
        </div>
        <div className="gv-hero-fade" aria-hidden="true" />
        <div className="gv-hero-in">
          <nav className="gv-crumb">
            <LocalizedLink to="/">Home</LocalizedLink><span>/</span>
            <LocalizedLink to="/project">Oman</LocalizedLink><span>/</span>
            <span style={{ color: '#fff' }}>{c.h1}</span>
          </nav>
          <p className="gv-eyebrow">{c.eyebrow}</p>
          <h1 className="gv-d2">{c.h1}</h1>
          {hasData && <p className="gv-hero-meta">{c.updatedLabel}: {new Date().toISOString().slice(0, 10)}</p>}
        </div>
      </section>

      <div className="gv-wrap">
        {/* intro split + naked stat row */}
        <section className={`gv-split ${rv(0).className}`} style={{ paddingTop: 8, ...rv(0).style }}>
          <h2 className="gv-h1">{c.routesHeading}</h2>
          <div>
            <p className="gv-p">{fill(c.lead, vars)}</p>
            {hasData && (
              <div className="gv-stats">
                {[
                  [fmtInt(gv.qualify5), c.stats.qualify5],
                  [fmtInt(gv.qualify10), c.stats.qualify10],
                  [fmtOmr(TIER_5_OMR), c.stats.tier5],
                  [fmtOmr(gv.lowestQualifying), c.stats.entry],
                ].map(([v, label]) => (
                  <div className="gv-stat" key={label}><b>{v}</b><span>{label}</span></div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* the two routes — the page's reason to exist */}
        <section id="routes" className={`gv-sec ${rv(1).className}`} style={rv(1).style}>
          <div className="gv-sec-head">
            <h2 className="gv-h2">{c.routesHeading}</h2>
            <p className="gv-p" style={{ margin: 0 }}>{c.routesSub}</p>
          </div>
          <div className="gv-routes">
            {c.routes.map((r) => (
              <div className="gv-route" key={r.name}>
                <h3 className="gv-h3">{r.name}</h3>
                <p className="gv-route-sub">{r.sub}</p>
                <p>{fill(r.body, vars)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* which of our homes qualify — live */}
        {hasData && gv.byArea.length > 0 && (
          <section id="qualifying" className={`gv-sec ${rv(2).className}`} style={rv(2).style}>
            <div className="gv-sec-head">
              <h2 className="gv-h2">{c.qualifyHeading}</h2>
              <p className="gv-p" style={{ margin: 0 }}>{c.qualifySub}</p>
            </div>
            <div className="gv-tablewrap">
              <table className="gv-table">
                <thead>
                  <tr>
                    <th>{c.cols.area}</th>
                    <th>{c.cols.city}</th>
                    <th>{c.tier5Label}</th>
                    <th>{c.tier10Label}</th>
                    <th>{c.cols.from}</th>
                    <th>{c.cols.median}</th>
                  </tr>
                </thead>
                <tbody>
                  {gv.byArea.map((a) => (
                    <tr key={a.key}>
                      <td>
                        <LocalizedLink to={`/project?area=${encodeURIComponent(a.key)}`} style={{ color: OLIVE, textDecoration: 'none' }}>
                          {a.label}
                        </LocalizedLink>
                      </td>
                      <td style={{ color: N600 }}>{a.city || '–'}</td>
                      <td><span className={`gv-chip${a.n < 5 ? ' gv-chip--thin' : ''}`}>{fmtInt(a.n)}</span></td>
                      <td className="gv-num">{a.tenYear > 0 ? fmtInt(a.tenYear) : '–'}</td>
                      <td className="gv-num">{fmtOmr(a.minPrice)}</td>
                      <td className="gv-num">{fmtOmr(a.medianPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="gv-note">{fill(c.tableNote, vars)}</p>
          </section>
        )}

        {/* community photo strip, qualifying communities only */}
        {hasData && gv.byArea.length > 0 && (
          <section className={`gv-sec ${rv(3).className}`} style={rv(3).style}>
            <div className="gv-strip">
              {gv.byArea.map((a) => {
                const pic = areaImg[a.key]
                const full = pic?.url || FALLBACK_IMG
                const thumb = pic?.url ? pic.thumb : FALLBACK_THUMB
                return (
                  <button
                    type="button"
                    className="gv-tile"
                    key={a.key}
                    onClick={() => navLocal(`/project?area=${encodeURIComponent(a.key)}`)}
                  >
                    <span className="gv-tileimg">
                      <img
                        src={full}
                        srcSet={thumb ? `${thumb} 640w, ${full} 1600w` : undefined}
                        sizes={thumb ? TILE_SIZES : undefined}
                        alt={`Qualifying property for sale in ${a.label}, Oman`}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="gv-tilefoot">
                      <span>
                        <span className="gv-tilename">{a.label}</span>
                        <span className="gv-tilemeta">{fmtInt(a.n)} · {fmtOmr(a.minPrice)}</span>
                      </span>
                      <span className="gv-tilerate"><b>{fmtInt(a.tenYear)}</b></span>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        <section id="ownership" className={`gv-sec gv-split ${rv(4).className}`} style={rv(4).style}>
          <h2 className="gv-h1">{c.ownershipHeading}</h2>
          <div>{c.ownershipParas.map((p, i) => <p className="gv-p" key={i}>{p}</p>)}</div>
        </section>

        <section id="process" className={`gv-sec ${rv(5).className}`} style={rv(5).style}>
          <div className="gv-sec-head">
            <h2 className="gv-h2">{c.processHeading}</h2>
            <p className="gv-p" style={{ margin: 0 }}>{c.processSub}</p>
          </div>
          <div className="gv-steps">
            {c.steps.map((s) => (
              <div className="gv-step" key={s.n}>
                <div className="gv-step-n">{s.n}</div>
                <div>
                  <h3 className="gv-h3">{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="analysis" className={`gv-sec gv-split ${rv(6).className}`} style={rv(6).style}>
          <h2 className="gv-h1">{c.heading}</h2>
          <div>{c.paras.map((p, i) => <p className="gv-p" key={i}>{p}</p>)}</div>
        </section>

        <section id="faq" className={`gv-sec gv-split ${rv(7).className}`} style={rv(7).style}>
          <div><h2 className="gv-h1">{c.faqHeading}</h2></div>
          <div className="gv-faq">
            {c.faq.map((f, i) => (
              <div className="gv-faq-item" key={i}>
                <button
                  type="button"
                  className="gv-faq-q"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span>{fill(f.q, vars)}</span>
                  {openFaq === i
                    ? <RemoveRoundedIcon sx={{ fontSize: 20, color: OLIVE, flexShrink: 0 }} />
                    : <AddRoundedIcon sx={{ fontSize: 20, color: OLIVE, flexShrink: 0 }} />}
                </button>
                <Collapse in={openFaq === i} timeout={260}>
                  <div className="gv-faq-a">{fill(f.a, vars)}</div>
                </Collapse>
              </div>
            ))}
          </div>
        </section>

        <section className={`gv-cta ${rv(8).className}`} style={rv(8).style}>
          <h2 className="gv-h1">{c.ctaHeading}</h2>
          <p className="gv-p" style={{ marginTop: 18, maxWidth: 720 }}>{c.ctaText}</p>
          <LocalizedLink className="gv-btn" to="/project">
            {c.ctaBtn}<ArrowForwardRoundedIcon sx={{ fontSize: 19 }} />
          </LocalizedLink>

          <h3 className="gv-h3" style={{ marginTop: 72 }}>{c.linksHeading}</h3>
          <ul className="gv-links">
            {c.links.map((l) => (
              <li key={l.href}><LocalizedLink to={l.href}>{l.label}</LocalizedLink></li>
            ))}
          </ul>
          <div style={{ height: 96 }} />
        </section>
      </div>
    </div>
  )
}
