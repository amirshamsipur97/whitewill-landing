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
 * ── DESIGN ────────────────────────────────────────────────────────────────
 * Two Figma kits, deliberately combined:
 *
 *  1. PAGE — "Perumnas / Real Estate Website Design" (TCwUAiZbL29LTXvPdymh8I,
 *     node 5:32). A LIGHT editorial layout, which is why this is the one page
 *     on the site that is not dark: a figures page has to read like a
 *     reference document, and white is what makes a table legible. Its token
 *     set is used verbatim (Neutral 0/25/100/600/900 + the Inter Display type
 *     scale), along with its three signature moves — a full-bleed photo that
 *     dissolves into white, a left-heading / right-body asymmetric split, and
 *     naked stat numbers with no boxes around them.
 *
 *  2. TABLES — "Tables design samples" (7CQA0rYUdROKqkHcT2HvHx, node
 *     202:20434): no container border, small grey column labels, a single
 *     heavy rule under the header, hairline row dividers, a bold first
 *     column, soft pastel tag chips, and an accent-coloured active sort
 *     column with an underline bar. The kit's blue is swapped for the brand
 *     olive so the page still belongs to irfaninvest.
 *
 * NOTE: components/invest/ui.jsx cannot be reused here — SectionHeading and
 * FaqAccordion hardcode white text and rgba(255,255,255,…) surfaces for the
 * dark pages. Light equivalents are built locally instead.
 *
 * The site header is a permanently dark blurred bar, so it sits happily over
 * both the photo hero and the white body.
 *
 * Three things make the page USEFUL rather than just readable: the budget
 * slider, sorting on every column of every table, and community tiles that
 * link straight into the filtered listings.
 *
 * Imagery is DERIVED from the inventory (largest project in each community),
 * never hardcoded, so it can never point at a delisted development.
 *
 * MOTION IS DELIBERATELY LIGHT. Two mechanisms, on purpose:
 *  • sections fade in on a CSS transition driven by React state via
 *    setTimeout — never rAF, which does not fire in a hidden tab and would
 *    leave the page at opacity:0 (see HANDOFF-SEO-2026-07-25 §4);
 *  • the two PHOTO ROWS use GSAP (useSoftReveal below) for a staggered fade,
 *    because a stagger that only animates the cards that are actually new is
 *    not expressible in CSS. GSAP's ticker IS rAF, so that hook refuses to
 *    animate while the document is hidden and renders the cards plainly
 *    instead — motion is a nicety, a blank card is a bug.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import {
  Card, CardActionArea, Chip, Collapse, Slider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TableSortLabel, Tooltip,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { galleryFor, thumbForSlug } from '../projectGallery.js'
import { LocalizedLink, useLocalizedNavigate } from '../lib/localize.js'
import { FONT } from '../components/invest/ui.jsx'
import {
  buildPriceIndex, median, slugify, typeGroup,
  fmtInt, fmtOmr, fmtRange, fmtSqm,
} from '../priceIndexData.mjs'
import {
  priceIndexCopy, priceIndexFaqJsonLd, priceIndexJsonLd, fill,
} from '../priceIndexContent.mjs'

// ── Perumnas kit tokens (Figma variables, verbatim) ────────────────────────
const N0 = '#FFFFFF'
const N25 = '#FAFAFB'
const N100 = '#E5E5E6'
const N600 = '#61656E'
const N900 = '#12161D'
// Brand olive, darkened from #8c8d25 to clear AA on white. Replaces the
// Tables kit's blue for active sort / data emphasis.
const OLIVE = '#6f7020'
const GOLD = '#B98C52'

// Pastel tag chips from the Tables kit, repurposed to band the sample size —
// so the chip carries information instead of decoration.
const BANDS = {
  high: { bg: '#E3F5E9', fg: '#1E6B3A' },
  mid: { bg: '#E8E9F5', fg: '#3D4270' },
  thin: { bg: '#FCF3DC', fg: '#7A5C13' },
}
const bandFor = (n) => (n < 5 ? BANDS.thin : n < 50 ? BANDS.mid : BANDS.high)

// Neutral site-owned image for a community we have no project photography for
// (Aida/Yiti ships without a gallery folder). Deliberately NOT another
// project's photo — showing Al Mouj under a Yiti heading would be a lie.
const FALLBACK_IMG = '/images/hero-poster.jpg'
// 640w cut of the same frame, so a fallback tile does not pull a 1920px poster
// for a 310px slot either. Its own file, because the full-size poster path is
// a literal string in several prerendered pages and must not change.
const FALLBACK_THUMB = '/images/hero-poster-640.webp'

// Community tiles render far smaller than the 1600px cover they are cut from,
// so they ship a srcset with the 640w variant and a `sizes` that tells the
// browser the real display width. Without `sizes` the browser assumes 100vw
// and picks the big file anyway.
const TILE_SIZES = '(max-width:600px) 88vw, (max-width:900px) 45vw, 320px'
const BTILE_SIZES = '(max-width:600px) 44vw, 180px'

function TileImg({ pic, alt, sizes }) {
  const full = pic?.url || FALLBACK_IMG
  const thumb = pic?.url ? pic.thumb : FALLBACK_THUMB
  return (
    <img
      src={full}
      srcSet={thumb ? `${thumb} 640w, ${full} 1600w` : undefined}
      sizes={thumb ? sizes : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  )
}

const CSS = `
/* The global stylesheet paints html, body AND #root black for the rest of the
   site. On the one light page that shows as black overscroll edges and black
   bars beside the centred content, so it has to be overridden — including the
   #root rule, which outranks a bare type selector. This <style> block is
   rendered inside the component, so React removes it on unmount and the dark
   site is restored automatically. */
html,body,#root{background:${N0} !important}
.pi-page{background:${N0};color:${N900};min-height:100vh;font-family:${FONT};
  -webkit-font-smoothing:antialiased}
.pi-wrap{max-width:1280px;margin:0 auto;padding:0 24px}

/* ── hero: full-bleed photograph dissolving into the white page ─────────── */
.pi-hero{position:relative;min-height:min(72vh,620px);display:flex;align-items:center;
  justify-content:center;text-align:center;padding:150px 24px 120px;overflow:hidden;background:#c9d3dc}
.pi-hero-bg{position:absolute;inset:0;z-index:0;opacity:0;transition:opacity .7s ease}
.pi-hero-bg.in{opacity:1}
.pi-hero-bg img{width:100%;height:100%;object-fit:cover;display:block}
/* The kit's signature move is the wash to white at the bottom. The radial
   scrim is ours: the hero image is DERIVED from inventory, so it can be a
   near-white render (Vistal currently is) and white type over it would fail
   contrast. The scrim guarantees legibility whatever photo turns up. */
.pi-hero-fade{position:absolute;inset:0;z-index:1;background:
  radial-gradient(760px 380px at 50% 44%,rgba(8,12,18,.34),rgba(8,12,18,0) 74%),
  linear-gradient(180deg,rgba(8,12,18,.38) 0%,rgba(8,12,18,.18) 32%,rgba(8,12,18,.03) 56%,rgba(255,255,255,.46) 80%,${N0} 100%)}
.pi-hero-in{position:relative;z-index:2;max-width:900px}
.pi-crumb{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;
  color:rgba(255,255,255,.78);font-size:14px;margin-bottom:26px}
.pi-crumb a{color:rgba(255,255,255,.78);text-decoration:none;transition:color .18s}
.pi-crumb a:hover{color:#fff}
.pi-eyebrow{font-size:14px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(255,255,255,.9);text-shadow:0 1px 12px rgba(0,0,0,.4)}
.pi-d2{margin:14px 0 0;font-weight:500;font-size:clamp(34px,5.2vw,72px);line-height:1.09;
  letter-spacing:-.035em;color:#fff;text-shadow:0 2px 22px rgba(0,0,0,.5)}
.pi-hero-sub{margin:18px auto 0;max-width:620px;font-size:clamp(15px,1.4vw,18px);line-height:1.5;
  color:rgba(255,255,255,.94);text-shadow:0 1px 14px rgba(0,0,0,.4)}
.pi-hero-meta{margin:22px 0 0;font-size:13.5px;color:rgba(255,255,255,.8);letter-spacing:.02em;
  text-shadow:0 1px 12px rgba(0,0,0,.45)}

/* ── asymmetric split: heading left, body right (kit's core rhythm) ─────── */
.pi-split{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
/* Flip a split so the panel sits on the left and the heading on the right,
   without changing DOM order (which the mobile stack and screen readers
   follow). Desktop only — see the max-width:900px block. */
.pi-split--flip>*:first-child{order:2}
.pi-split--flip>*:last-child{order:1}
.pi-h1{font-weight:500;font-size:clamp(28px,3.4vw,44px);line-height:1.18;letter-spacing:-.01em;
  color:${N900};margin:0}
.pi-h2{font-weight:500;font-size:clamp(24px,2.8vw,36px);line-height:1.3;letter-spacing:-.01em;
  color:${N900};margin:0 0 10px}
.pi-h3{font-weight:500;font-size:clamp(19px,1.9vw,24px);line-height:1.34;color:${N900};margin:0}
.pi-p{font-size:clamp(15.5px,1.35vw,18px);line-height:1.62;color:${N600};margin:0 0 20px}
.pi-lbl{font-size:14px;line-height:1.4;color:${N600}}

/* naked stat numbers — no boxes, exactly the kit's +100 / +60K / +70K row */
.pi-stats{display:flex;flex-wrap:wrap;gap:14px 56px;margin-top:36px}
.pi-stat b{display:block;font-weight:500;font-size:clamp(26px,3vw,36px);line-height:1.2;
  letter-spacing:-.02em;color:${N900};font-variant-numeric:tabular-nums}
.pi-stat span{display:block;margin-top:8px;font-size:14px;color:${N600}}

.pi-sec{padding:96px 0 0}
.pi-sec-head{max-width:760px;margin-bottom:34px}
.pi-note{font-size:14px;color:${N600};margin:16px 0 0;line-height:1.55}

/* ── community strip: the kit's bleeding 3-up photo row ─────────────────── */
.pi-strip{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(310px,1fr);gap:28px;
  overflow-x:auto;padding-bottom:8px;scroll-snap-type:x proximity}
.pi-strip::-webkit-scrollbar{height:6px}
.pi-strip::-webkit-scrollbar-thumb{background:${N100};border-radius:99px}
.pi-tile{scroll-snap-align:start}
.pi-tileimg{position:relative;aspect-ratio:16/11;overflow:hidden;border-radius:14px;background:${N25}}
.pi-tileimg img{width:100%;height:100%;object-fit:cover;display:block;
  transition:transform .42s cubic-bezier(.4,0,.2,1)}
.pi-tile:hover .pi-tileimg img{transform:scale(1.04)}
.pi-tilefoot{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;
  margin-top:18px;padding-bottom:16px;border-bottom:1px solid ${N100}}
.pi-tilename{font-weight:500;font-size:18px;line-height:1.35;color:${N900}}
.pi-tilemeta{margin-top:6px;font-size:14px;color:${N600}}
.pi-tilerate b{font-weight:500;font-size:26px;line-height:1;letter-spacing:-.02em;color:${OLIVE};
  font-variant-numeric:tabular-nums}
.pi-tilerate span{display:block;margin-top:5px;font-size:12.5px;color:${N600};text-align:end}

/* ── bar chart: grey track, olive fill, no chrome ───────────────────────── */
.pi-bars{display:flex;flex-direction:column;gap:14px}
.pi-bar{display:grid;grid-template-columns:minmax(130px,210px) 1fr auto;align-items:center;gap:18px}
.pi-bar-label{font-size:15px;color:${N900};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pi-bar-track{height:8px;background:${N100};border-radius:99px;overflow:hidden}
.pi-bar-fill{height:100%;border-radius:99px;background:${OLIVE};
  transition:width .52s cubic-bezier(.4,0,.2,1)}
.pi-bar-val{font-size:15px;font-weight:500;color:${N900};font-variant-numeric:tabular-nums;
  min-width:74px;text-align:end}

/* light segmented control */
.pi-seg{display:inline-flex;border:1px solid ${N100};border-radius:10px;overflow:hidden;
  margin-bottom:28px;background:${N0}}
.pi-seg button{appearance:none;border:0;background:transparent;font-family:${FONT};font-size:14px;
  color:${N600};padding:10px 18px;cursor:pointer;transition:background .18s,color .18s}
.pi-seg button+button{border-inline-start:1px solid ${N100}}
.pi-seg button[aria-pressed=true]{background:${N900};color:#fff}

/* ── budget explorer ───────────────────────────────────────────────────── */
.pi-panel{border:1px solid ${N100};border-radius:16px;background:${N25};padding:38px 34px}
.pi-budgetnum{font-weight:500;font-size:clamp(30px,4vw,44px);line-height:1.1;letter-spacing:-.025em;
  color:${N900};margin:6px 0 10px;font-variant-numeric:tabular-nums}
.pi-chips{display:flex;flex-wrap:wrap;gap:9px;margin-top:26px}
/* Communities within budget, as photo cards instead of text chips. */
/* Sits in the wider text column now, so the cards can breathe. */
.pi-budget-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(152px,1fr));
  gap:16px;margin-top:30px}
.pi-btile{display:block;text-align:start;padding:0;background:transparent;border:0;
  font-family:inherit;cursor:pointer}
.pi-btile-img{display:block;position:relative;aspect-ratio:4/3;overflow:hidden;
  border-radius:11px;background:${N100};border:1px solid ${N100}}
.pi-btile-img img{width:100%;height:100%;object-fit:cover;display:block;
  transition:transform .42s cubic-bezier(.4,0,.2,1)}
.pi-btile:hover .pi-btile-img img{transform:scale(1.06)}
.pi-btile:hover .pi-btile-img{border-color:${OLIVE}}
.pi-btile-name{display:block;margin-top:8px;font-size:13.5px;font-weight:500;color:${N900};
  line-height:1.35;transition:color .18s}
.pi-btile:hover .pi-btile-name{color:${OLIVE}}

/* ── FAQ: the kit's bordered accordion cards ───────────────────────────── */
/* ── table of contents: a plain ordered list of real anchors ─────────────── */
.pi-toc{margin:56px 0 8px;padding:22px 26px;background:${N25};border:1px solid ${N100};
  border-radius:16px}
.pi-toc-h{margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.15em;
  text-transform:uppercase;color:${N600}}
.pi-toc ol{margin:0;padding:0;list-style:none;display:grid;gap:8px 28px;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
.pi-toc a{color:${N900};font-size:15px;text-decoration:none;border-bottom:1px solid transparent}
.pi-toc a:hover{color:${OLIVE};border-bottom-color:${OLIVE}}

/* ── citation block ─────────────────────────────────────────────────────── */
.pi-cite-label{margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.15em;
  text-transform:uppercase;color:${N600}}
.pi-cite{margin:0 0 16px;padding:18px 20px;background:${N25};border:1px solid ${N100};
  border-inline-start:3px solid ${OLIVE};border-radius:12px;font-size:15px;line-height:1.65;
  color:${N900};overflow-wrap:anywhere}
.pi-cite-btn{appearance:none;border:1px solid ${N900};background:transparent;color:${N900};
  font-family:inherit;font-size:14px;font-weight:600;padding:10px 20px;border-radius:999px;
  cursor:pointer;transition:background-color .18s,color .18s}
.pi-cite-btn:hover{background:${N900};color:${N0}}
.pi-cite-json{display:inline-block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:14px;color:${OLIVE};text-decoration:none;border-bottom:1px solid ${OLIVE};
  direction:ltr;unicode-bidi:isolate}

.pi-faq{display:flex;flex-direction:column;gap:16px}
.pi-faqcard{border:1px solid ${N100};border-radius:12px;background:${N0};overflow:hidden}
.pi-faqq{display:flex;align-items:flex-start;gap:20px;width:100%;text-align:start;appearance:none;
  border:0;background:transparent;font-family:${FONT};padding:24px 26px;cursor:pointer}
.pi-faqq h3{flex:1;font-weight:500;font-size:clamp(17px,1.7vw,22px);line-height:1.38;color:${N900};margin:0}
.pi-faqa{padding:0 26px 24px;font-size:clamp(15px,1.3vw,17px);line-height:1.62;color:${N600}}

.pi-cta{margin-top:96px;border-top:1px solid ${N100};padding-top:56px}
.pi-btn{display:inline-flex;align-items:center;gap:10px;height:52px;padding:0 28px;background:${N900};
  color:#fff;border-radius:10px;font-weight:500;font-size:16px;text-decoration:none;
  transition:background .18s,gap .18s}
.pi-btn:hover{background:${OLIVE};gap:15px}
.pi-links{margin:28px 0 0;padding:0 0 110px;list-style:none}
.pi-links li{border-bottom:1px solid ${N100}}
.pi-links a{display:block;padding:17px 0;font-size:16px;color:${N900};text-decoration:none;
  transition:color .18s,padding-inline-start .18s}
.pi-links a:hover{color:${OLIVE};padding-inline-start:6px}

.pi-rv{opacity:0;transform:translateY(8px);transition:opacity .38s ease,transform .38s cubic-bezier(.4,0,.2,1)}
.pi-rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  .pi-rv,.pi-rv.in{opacity:1;transform:none;transition:none}
  .pi-bar-fill,.pi-tileimg img{transition:none}
}
@media (max-width:900px){
  .pi-split{grid-template-columns:1fr;gap:26px}
  /* stacked: heading before the tool again */
  .pi-split--flip>*:first-child{order:1}
  .pi-split--flip>*:last-child{order:2}
  .pi-sec{padding:68px 0 0}
  .pi-panel{padding:26px 20px}
  .pi-hero{padding:126px 20px 90px;min-height:auto}
  .pi-bar{grid-template-columns:minmax(96px,1fr) 1.1fr auto;gap:12px}
  .pi-stats{gap:20px 32px}
}
`

// ── Tables-kit cell styling ────────────────────────────────────────────────
// Small grey labels, ONE heavy rule under the header, hairline row dividers,
// bold first column, and an olive active-sort column with an underline bar.
const headSx = {
  fontFamily: FONT, fontSize: 14, fontWeight: 400, color: N600,
  borderBottom: `2px solid ${N900}`, whiteSpace: 'nowrap',
  py: 1.6, px: 2, verticalAlign: 'bottom', lineHeight: 1.35,
  '& .MuiTableSortLabel-root': { color: N600, alignItems: 'flex-end' },
  '& .MuiTableSortLabel-root:hover': { color: N900 },
  '& .MuiTableSortLabel-root.Mui-active': { color: OLIVE, fontWeight: 500 },
  '& .MuiTableSortLabel-icon': { color: `${OLIVE} !important`, fontSize: 17 },
}
const headActiveSx = { boxShadow: `inset 0 -2px 0 0 ${OLIVE}` }
const cellSx = {
  fontFamily: FONT, fontSize: 16, color: N900, borderBottom: `1px solid ${N100}`,
  whiteSpace: 'nowrap', py: 2.1, px: 2,
}
const cellMutedSx = { ...cellSx, color: N600 }

/**
 * Softly reveals newly-added children of `ref` with GSAP, staggered.
 *
 * Two things make this less trivial than a one-line `gsap.from()`:
 *
 * 1. THE CARDS RE-RENDER CONSTANTLY. The budget cards are recomputed on every
 *    slider step, so animating "all children" would replay the whole reveal
 *    on each nudge of the slider. Only children whose `data-reveal-key` was
 *    not present on the previous pass are animated, so an existing card sits
 *    still while a newly affordable community fades in beside it.
 *
 * 2. GSAP'S TICKER IS requestAnimationFrame. rAF does not fire while the tab
 *    is hidden, so a tween started then never advances and its targets stay
 *    at the from-state — invisible, permanently. That is the exact trap that
 *    made a modal on this project look "frozen" (see HANDOFF §4). When the
 *    document is hidden we therefore skip the tween entirely and let the
 *    cards render plainly; motion is a nicety, a blank card is a bug.
 *    Cleanup also clears the inline props so a tween killed mid-flight can
 *    never leave a card stuck either.
 */
function useSoftReveal(ref, keys) {
  const seen = useRef(new Set())
  const signature = keys.join('|')
  useEffect(() => {
    const host = ref.current
    if (!host) return
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      seen.current = new Set(keys)
      return
    }
    const fresh = [...host.children].filter((el) => !seen.current.has(el.dataset.revealKey))
    seen.current = new Set(keys)
    if (!fresh.length) return
    const tw = gsap.fromTo(
      fresh,
      { autoAlpha: 0, y: 18, scale: 0.985 },
      {
        autoAlpha: 1, y: 0, scale: 1,
        duration: 0.62, ease: 'power2.out', stagger: 0.075,
        clearProps: 'all',
      },
    )
    return () => {
      tw.kill()
      // autoAlpha also writes visibility:hidden — never leave that behind.
      gsap.set(fresh, { clearProps: 'all' })
    }
  }, [signature])
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

/** Sortable table in the Tables-kit idiom. `cols` = [{key,label,render,value}]. */
function DataTable({ cols, rows, defaultKey, defaultDir = 'desc' }) {
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
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 720, borderCollapse: 'separate', borderSpacing: 0 }}>
        <TableHead>
          <TableRow>
            {cols.map((c) => (
              <TableCell
                key={c.key}
                sx={{ ...headSx, ...(key === c.key ? headActiveSx : {}) }}
                sortDirection={key === c.key ? dir : false}
              >
                <TableSortLabel
                  active={key === c.key}
                  direction={key === c.key ? dir : 'asc'}
                  onClick={() => onSort(c.key)}
                >
                  {c.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.key} sx={{ '&:hover td': { bgcolor: N25 }, '&:last-child td': { borderBottom: 0 } }}>
              {cols.map((c, i) => (
                <TableCell key={c.key} sx={i === 0 ? { ...cellSx, fontWeight: 600 } : (c.muted ? cellMutedSx : cellSx)}>
                  {c.render(r)}
                </TableCell>
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
  const [openFaq, setOpenFaq] = useState(0)

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
    // Each entry is { url, thumb }: the tiles render at ~310 CSS px, so they
    // must not pull the 1600px cover. thumb is the 640w variant when one
    // exists (see projectGallery.js).
    const img = {}
    for (const [area, byProject] of count) {
      for (const [name] of [...byProject.entries()].sort((x, y) => y[1] - x[1])) {
        const slug = slugify(name)
        const g = galleryFor(slug)
        if (g?.length) { img[area] = { url: g[0], thumb: thumbForSlug(slug) }; break }
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
    return { areaImg: img, heroImg: hero || img[top]?.url || null }
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

  // GSAP soft reveal for the two photo rows. Keys drive which children are
  // treated as "new" on a re-render.
  const stripRef = useRef(null)
  const budgetTilesRef = useRef(null)
  useSoftReveal(stripRef, index.byArea.map((a) => a.key))
  useSoftReveal(budgetTilesRef, affordable?.areas || [])

  const shown = useMounted()
  const rv = (i) => ({ className: `pi-rv${shown ? ' in' : ''}`, style: { transitionDelay: `${i * 60}ms` } })

  // A ready-made citation, built from the same live figures as the tables so a
  // quote can never drift from what the page shows. The sample size, the date
  // and the "freehold stock open to foreign buyers" scope are inside the
  // string on purpose: whoever copies it carries the caveat with the number.
  const [copied, setCopied] = useState(false)
  const citation = hasData
    ? `Irfan Investment Group, Oman Property Price Index, ${updated}. Median ${fmtInt(index.overall.medianPpsm)} OMR per m² across ${fmtInt(index.units)} freehold homes listed for sale in ${fmtInt(index.areas)} Omani communities open to foreign buyers. https://www.irfaninvest.com/property-prices-in-oman`
    : ''
  const copyCitation = () => {
    navigator.clipboard?.writeText(citation).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 2200) },
      () => {},
    )
  }

  // Sample-size chip: pastel band from the Tables kit, carrying real meaning.
  const sample = (row) => {
    const b = bandFor(row.n)
    const chip = (
      <Chip
        size="small" label={fmtInt(row.n)}
        sx={{
          fontFamily: FONT, fontSize: 13.5, fontWeight: 500, height: 26, borderRadius: '6px',
          bgcolor: b.bg, color: b.fg, '& .MuiChip-label': { px: 1.1 },
        }}
      />
    )
    return row.thin ? <Tooltip title={c.thinNote}><span>{chip}</span></Tooltip> : chip
  }
  const bedLabel = (k) => (k === '0' ? c.studio : k)
  const strong = (v) => <span style={{ color: OLIVE, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
  const tnum = (v) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</span>
  const nameLink = (to, label) => (
    <LocalizedLink to={to} style={{ color: N900, fontWeight: 600, textDecoration: 'none', borderBottom: `1px solid ${N100}` }}>
      {label}
    </LocalizedLink>
  )

  // Bars are scaled against the leader, so the chart reads as a comparison
  // rather than an absolute claim. The toggle swaps the whole metric.
  const barVal = (a) => (metric === 'ppsm' ? a.medianPpsm : a.medianPrice) || 0
  const bars = useMemo(() => [...index.byArea].sort((a, b) => barVal(b) - barVal(a)), [index, metric])
  const barMax = Math.max(1, ...bars.map(barVal))

  return (
    <div className="pi-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{CSS}</style>

      {/* ── hero: full-bleed photograph washing into white ── */}
      <section className="pi-hero">
        <div className={`pi-hero-bg${heroImg && shown ? ' in' : ''}`} aria-hidden="true">
          {/* Decorative; the container is position:absolute/inset:0 so no
              intrinsic size is needed and no CLS is possible. `fetchpriority`
              is deliberately LOWERCASE — React 18 drops the camelCase spelling
              with a console warning. */}
          {heroImg && <img src={heroImg} alt="" fetchpriority="high" decoding="async" />}
        </div>
        <div className="pi-hero-fade" aria-hidden="true" />

        <div className="pi-hero-in">
          <nav className="pi-crumb">
            <LocalizedLink to="/">Home</LocalizedLink><span>/</span>
            <LocalizedLink to="/project">Oman</LocalizedLink><span>/</span>
            <span style={{ color: '#fff' }}>{c.h1}</span>
          </nav>
          <div className="pi-eyebrow">{c.eyebrow}</div>
          <h1 className="pi-d2">{c.h1}</h1>
          <p className="pi-hero-sub">{t.heroSub}</p>
          <p className="pi-hero-meta">{c.updatedLabel}: {updated}</p>
        </div>
      </section>

      <div className="pi-wrap">
        {/* ── intro split + naked stat row ── */}
        <section className={`pi-split ${rv(0).className}`} style={{ paddingTop: 8, ...rv(0).style }}>
          <h2 className="pi-h1">{t.introHeading}</h2>
          <div>
            <p className="pi-p">{fill(c.lead, vars)}</p>
            {hasData && (
              <div className="pi-stats">
                {[
                  [fmtInt(index.units), c.stats.units],
                  [fmtInt(index.areas), c.stats.areas],
                  [fmtInt(index.overall.medianPpsm), c.stats.median],
                  [fmtOmr(index.overall.minPrice), c.stats.entry],
                ].map(([v, label]) => (
                  <div className="pi-stat" key={label}><b>{v}</b><span>{label}</span></div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── table of contents ──
            A reference page with eight sections needs a way in. It is also the
            shape Google uses for the "Jump to" links it sometimes attaches to a
            result, and it costs one <nav> of real anchors. */}
        {hasData && (
          <nav className="pi-toc" aria-label={c.tocHeading}>
            <h2 className="pi-toc-h">{c.tocHeading}</h2>
            <ol>
              {[
                ['#by-community', c.areasHeading],
                ['#by-city', c.citiesHeading],
                ['#by-type', c.typesHeading],
                ['#by-bedrooms', c.bedsHeading],
                ['#by-development', c.projectsHeading],
                ['#method', c.methodHeading],
                ['#analysis', c.heading],
                ['#faq', t.faqHeading],
                ['#cite', c.citeHeading],
              ].map(([href, label]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ol>
          </nav>
        )}

        {hasData && (
          <>
            {/* ── community photo strip ── */}
            <section className={`pi-sec ${rv(1).className}`} style={rv(1).style}>
              <div className="pi-sec-head">
                <h2 className="pi-h2">{t.communitiesHeading}</h2>
                <p className="pi-p" style={{ margin: 0 }}>{t.communitiesSub}</p>
              </div>
              <div className="pi-strip" ref={stripRef}>
                {index.byArea.map((a) => (
                  <Card key={a.key} data-reveal-key={a.key} className="pi-tile" elevation={0} sx={{ bgcolor: 'transparent', borderRadius: 0 }}>
                    <CardActionArea
                      onClick={() => navLocal(`/project?area=${encodeURIComponent(a.key)}`)}
                      sx={{ borderRadius: '14px', display: 'block', textAlign: 'start' }}
                    >
                      <div className="pi-tileimg">
                        <TileImg pic={areaImg[a.key]} alt={`Property for sale in ${a.label}, Oman`} sizes={TILE_SIZES} />
                      </div>
                      <div className="pi-tilefoot">
                        <div>
                          <div className="pi-tilename">{a.label}</div>
                          <div className="pi-tilemeta">{fmtInt(a.n)} {t.homes} · {t.from} {fmtOmr(a.minPrice)}</div>
                        </div>
                        <div className="pi-tilerate">
                          <b>{fmtInt(a.medianPpsm)}</b>
                          <span>{c.cols.medianPpsm}</span>
                        </div>
                      </div>
                    </CardActionArea>
                  </Card>
                ))}
              </div>
            </section>

            {/* ── chart + community table ── */}
            <section id="by-community" className={`pi-sec ${rv(2).className}`} style={rv(2).style}>
              <div className="pi-sec-head">
                <h2 className="pi-h2">{c.areasHeading}</h2>
                <p className="pi-p" style={{ margin: 0 }}>{c.areasSub}</p>
              </div>

              <div className="pi-seg" role="group">
                <button type="button" aria-pressed={metric === 'ppsm'} onClick={() => setMetric('ppsm')}>{t.metricPpsm}</button>
                <button type="button" aria-pressed={metric === 'price'} onClick={() => setMetric('price')}>{t.metricTotal}</button>
              </div>

              <div className="pi-bars" style={{ marginBottom: 44 }}>
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

              <DataTable
                defaultKey="ppsm"
                rows={index.byArea}
                cols={[
                  { key: 'name', label: c.cols.area, value: (r) => r.label, render: (r) => nameLink(`/project?area=${encodeURIComponent(r.key)}`, r.label) },
                  { key: 'city', label: c.cols.city, muted: true, value: (r) => r.city || '', render: (r) => r.city || '–' },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: sample },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => strong(fmtInt(r.medianPpsm)) },
                  { key: 'range', label: c.cols.rangePpsm, muted: true, value: (r) => r.minPpsm, render: (r) => tnum(fmtRange(r.minPpsm, r.maxPpsm)) },
                  { key: 'price', label: c.cols.medianPrice, value: (r) => r.medianPrice, render: (r) => tnum(fmtOmr(r.medianPrice)) },
                  { key: 'size', label: c.cols.typicalSize, muted: true, value: (r) => r.medianArea, render: (r) => tnum(fmtSqm(r.medianArea)) },
                ]}
              />
              <p className="pi-note">{t.sortHint} · {c.thinNote}</p>
            </section>

            {/* ── budget explorer: the practical half of the page ── */}
            {priceBounds && budget != null && (
              <section className={`pi-sec ${rv(3).className}`} style={rv(3).style}>
                {/* Heading stays FIRST in the DOM for reading order; CSS
                    order flips the panel to the left column on desktop only,
                    so the mobile stack still reads heading then tool. */}
                <div className="pi-split pi-split--flip">
                  <div>
                    <h2 className="pi-h2">{t.budgetHeading}</h2>
                    <p className="pi-p">{t.budgetSub}</p>
                    {/* The reachable communities live HERE, in the text
                        column, rather than inside the panel: the panel was
                        getting tall while this half sat empty. They still
                        react to the slider, and each opens that community's
                        listings pre-filtered to the chosen budget. */}
                    {affordable?.n > 0 && affordable.areas.length > 0 && (
                      <div className="pi-budget-tiles" ref={budgetTilesRef}>
                        {affordable.areas.map((a) => (
                          <button
                            type="button" key={a} data-reveal-key={a} className="pi-btile"
                            onClick={() => navLocal(`/project?area=${encodeURIComponent(a)}&price=${bucketFor(budget)}`)}
                          >
                            <span className="pi-btile-img">
                              <TileImg pic={areaImg[a]} alt={`Property for sale in ${a}, Oman`} sizes={BTILE_SIZES} />
                            </span>
                            <span className="pi-btile-name">{a}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pi-panel">
                    <div className="pi-lbl">{t.budgetLabel}</div>
                    <div className="pi-budgetnum">{fmtOmr(budget)}</div>

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
                        color: OLIVE, mt: 0.5,
                        '& .MuiSlider-rail': { bgcolor: N100, opacity: 1 },
                        '& .MuiSlider-thumb': {
                          width: 20, height: 20, bgcolor: N0, border: `2px solid ${OLIVE}`,
                          '&:hover,&.Mui-focusVisible': { boxShadow: `0 0 0 8px rgba(111,112,32,.12)` },
                        },
                        '& .MuiSlider-valueLabel': { fontFamily: FONT, fontSize: 12.5, bgcolor: N900 },
                      }}
                    />

                    {affordable?.n > 0 ? (
                      <>
                        <div className="pi-stats" style={{ marginTop: 26, gap: '18px 40px' }}>
                          {[
                            [fmtInt(affordable.n), t.budgetHomes],
                            [fmtSqm(affordable.size), t.budgetSize],
                            [fmtInt(affordable.areas.length), t.budgetAreas],
                            [fmtInt(affordable.types.length), t.budgetTypes],
                          ].map(([v, label]) => (
                            <div className="pi-stat" key={label}>
                              <b style={{ fontSize: 26 }}>{v}</b><span>{label}</span>
                            </div>
                          ))}
                        </div>

                        <LocalizedLink className="pi-btn" to={`/project?price=${bucketFor(budget)}`} style={{ marginTop: 30 }}>
                          {t.budgetCta} <ArrowForwardRoundedIcon sx={{ fontSize: 19, transform: rtl ? 'scaleX(-1)' : 'none' }} />
                        </LocalizedLink>
                      </>
                    ) : (
                      <p className="pi-p" style={{ margin: '20px 0 0' }}>{t.budgetNone}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ── remaining breakdowns ── */}
            {[
              {
                // City is the coarser cut and the one people actually search
                // ("property prices in Muscat"). Community stays the headline
                // table because it is where the real spread lives.
                id: 'by-city',
                heading: c.citiesHeading, sub: c.citiesSub, rows: index.byCity, defaultKey: 'ppsm', defaultDir: 'desc',
                cols: [
                  { key: 'name', label: c.cols.city, value: (r) => r.label, render: (r) => r.label },
                  { key: 'areas', label: c.citiesCol, muted: true, value: (r) => (r.areas || []).length, render: (r) => (r.areas || []).join(', ') || '–' },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: sample },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => strong(fmtInt(r.medianPpsm)) },
                  { key: 'range', label: c.cols.rangePpsm, muted: true, value: (r) => r.minPpsm, render: (r) => tnum(fmtRange(r.minPpsm, r.maxPpsm)) },
                  { key: 'price', label: c.cols.medianPrice, value: (r) => r.medianPrice, render: (r) => tnum(fmtOmr(r.medianPrice)) },
                  { key: 'from', label: c.cols.from, muted: true, value: (r) => r.minPrice, render: (r) => tnum(fmtOmr(r.minPrice)) },
                ],
              },
              {
                id: 'by-type',
                heading: c.typesHeading, sub: c.typesSub, rows: index.byType, defaultKey: 'ppsm', defaultDir: 'desc',
                cols: [
                  { key: 'name', label: c.cols.type, value: (r) => r.label, render: (r) => r.label },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: sample },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => strong(fmtInt(r.medianPpsm)) },
                  { key: 'range', label: c.cols.rangePpsm, muted: true, value: (r) => r.minPpsm, render: (r) => tnum(fmtRange(r.minPpsm, r.maxPpsm)) },
                  { key: 'price', label: c.cols.medianPrice, value: (r) => r.medianPrice, render: (r) => tnum(fmtOmr(r.medianPrice)) },
                  { key: 'from', label: c.cols.from, muted: true, value: (r) => r.minPrice, render: (r) => tnum(fmtOmr(r.minPrice)) },
                  { key: 'size', label: c.cols.typicalSize, muted: true, value: (r) => r.medianArea, render: (r) => tnum(fmtSqm(r.medianArea)) },
                ],
              },
              {
                id: 'by-bedrooms',
                heading: c.bedsHeading, sub: c.bedsSub, rows: index.byBeds, defaultKey: 'name', defaultDir: 'asc',
                cols: [
                  { key: 'name', label: c.cols.beds, value: (r) => Number(r.key), render: (r) => bedLabel(r.key) },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: sample },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => strong(fmtInt(r.medianPpsm)) },
                  { key: 'price', label: c.cols.medianPrice, value: (r) => r.medianPrice, render: (r) => tnum(fmtOmr(r.medianPrice)) },
                  { key: 'from', label: c.cols.from, muted: true, value: (r) => r.minPrice, render: (r) => tnum(fmtOmr(r.minPrice)) },
                  { key: 'size', label: c.cols.typicalSize, muted: true, value: (r) => r.medianArea, render: (r) => tnum(fmtSqm(r.medianArea)) },
                ],
              },
              {
                id: 'by-development',
                heading: c.projectsHeading, sub: c.projectsSub, rows: index.byProject, defaultKey: 'ppsm', defaultDir: 'desc',
                cols: [
                  { key: 'name', label: c.cols.project, value: (r) => r.label, render: (r) => nameLink(`/buy/${r.slug}`, r.label) },
                  { key: 'area', label: c.cols.area, muted: true, value: (r) => r.area || '', render: (r) => r.area || '–' },
                  { key: 'n', label: c.cols.units, value: (r) => r.n, render: sample },
                  { key: 'ppsm', label: c.cols.medianPpsm, value: (r) => r.medianPpsm, render: (r) => strong(fmtInt(r.medianPpsm)) },
                  { key: 'range', label: c.cols.rangePpsm, muted: true, value: (r) => r.minPpsm, render: (r) => tnum(fmtRange(r.minPpsm, r.maxPpsm)) },
                  { key: 'from', label: c.cols.from, value: (r) => r.minPrice, render: (r) => tnum(fmtOmr(r.minPrice)) },
                ],
              },
            ].map((s, i) => (
              <section id={s.id} className={`pi-sec ${rv(4 + i).className}`} style={rv(4 + i).style} key={s.heading}>
                <div className="pi-sec-head">
                  <h2 className="pi-h2">{s.heading}</h2>
                  <p className="pi-p" style={{ margin: 0 }}>{s.sub}</p>
                </div>
                <DataTable cols={s.cols} rows={s.rows} defaultKey={s.defaultKey} defaultDir={s.defaultDir} />
              </section>
            ))}
          </>
        )}

        {/* ── method: the kit's asymmetric split + feature-list rhythm ── */}
        <section id="method" className={`pi-sec pi-split ${rv(7).className}`} style={rv(7).style}>
          <h2 className="pi-h1">{c.methodHeading}</h2>
          <div>
            {c.methodParas.map((p, i) => <p className="pi-p" key={i}>{fill(p, vars)}</p>)}
          </div>
        </section>

        {/* ── how to cite ──
            The page exists to be cited, so it hands over a formatted citation
            and a JSON feed rather than hoping someone constructs one. The
            caveat travels inside the citation string on purpose: whoever
            copies it repeats the caveat with the number. */}
        {hasData && (
          <section id="cite" className={`pi-sec pi-split ${rv(8).className}`} style={rv(8).style}>
            <h2 className="pi-h1">{c.citeHeading}</h2>
            <div>
              <p className="pi-p">{c.citeIntro}</p>
              <p className="pi-cite-label">{c.citeLabel}</p>
              <blockquote className="pi-cite">{citation}</blockquote>
              <button type="button" className="pi-cite-btn" onClick={copyCitation}>
                {copied ? c.citeCopied : c.citeCopy}
              </button>
              <p className="pi-cite-label" style={{ marginTop: 34 }}>{c.citeDataLabel}</p>
              <p className="pi-p" style={{ margin: '0 0 10px' }}>{c.citeDataNote}</p>
              <a className="pi-cite-json" href="/api/price-index.json">/api/price-index.json</a>
            </div>
          </section>
        )}

        <section id="analysis" className={`pi-sec pi-split ${rv(9).className}`} style={rv(9).style}>
          <h2 className="pi-h1">{c.heading}</h2>
          <div>
            {c.paras.map((p, i) => <p className="pi-p" key={i}>{p}</p>)}
          </div>
        </section>

        {/* ── FAQ: left heading, right accordion cards ── */}
        <section id="faq" className={`pi-sec pi-split ${rv(10).className}`} style={rv(10).style}>
          <div>
            <h2 className="pi-h1">{t.faqHeading}</h2>
            <p className="pi-p" style={{ marginTop: 18 }}>{t.faqSub}</p>
          </div>
          <div className="pi-faq">
            {c.faq.map((f, i) => (
              <div className="pi-faqcard" key={i}>
                <button
                  type="button" className="pi-faqq"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <h3>{f.q}</h3>
                  {openFaq === i
                    ? <RemoveRoundedIcon sx={{ fontSize: 22, color: N900, flexShrink: 0, mt: '2px' }} />
                    : <AddRoundedIcon sx={{ fontSize: 22, color: N900, flexShrink: 0, mt: '2px' }} />}
                </button>
                <Collapse in={openFaq === i}>
                  <div className="pi-faqa">{f.a}</div>
                </Collapse>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA + related pages ── */}
        <section className={`pi-cta ${rv(11).className}`} style={rv(11).style}>
          <div className="pi-split">
            <h2 className="pi-h1">{c.ctaHeading}</h2>
            <div>
              <p className="pi-p">{c.ctaText}</p>
              <LocalizedLink className="pi-btn" to="/project">
                {c.ctaBtn} <ArrowForwardRoundedIcon sx={{ fontSize: 19, transform: rtl ? 'scaleX(-1)' : 'none' }} />
              </LocalizedLink>
            </div>
          </div>

          <h3 className="pi-h3" style={{ marginTop: 72 }}>{c.linksHeading}</h3>
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
