/**
 * CityLandingPage — one reusable page behind the head-term SEO landings
 * (/buy-property-in-muscat, /buy-apartment-in-muscat, /buy-property-in-salalah).
 *
 * WHY: the 316 prerendered unit pages own the long tail ("3-Bedroom Apartment
 * for Sale in Muscat — OMR …"), but nothing on the site targeted the head
 * terms as a page in its own right. This is the listing-portal pattern that
 * Bayut / Dubizzle / Imtilak / Vista rank with: exact-match H1, real filtered
 * inventory, community links, substantive copy, FAQ and ItemList schema.
 *
 * Design mirrors the /project portal hero (Figma 953-28313): a photographic
 * hero drawn from the real inventory, a glass search panel carrying the same
 * AI search + filter chips (which hand off to /project), image community
 * tiles, and a soft IntersectionObserver reveal. Deliberately CSS-driven
 * motion, no gsap — a tween on this page froze mid-animation before.
 *
 * Config + copy: src/cityLandingContent.mjs (shared with prerender-routes.mjs).
 * Lead capture: QuickInquiryModal inline, same as /project.
 */
import { useEffect, useMemo, useState } from 'react'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import KingBedRoundedIcon from '@mui/icons-material/KingBedRounded'
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { galleryFor } from '../projectGallery.js'
import { slugify } from './BuyPage.jsx'
import { LocalizedLink, useLocalizedNavigate } from '../lib/localize.js'
import { FONT, OLIVE_BRIGHT } from '../components/invest/ui.jsx'
import QuickInquiryModal from '../components/QuickInquiryModal'
import { LANDINGS, landingCopy, landingFaqJsonLd } from '../cityLandingContent.mjs'

const SITE = 'https://www.irfaninvest.com'
const PAPER = '#0b0b0c'
const SURFACE = '#151517'
const INK = '#f4f2ec'
const SUB = 'rgba(244,242,236,0.62)'
const FAINT = 'rgba(244,242,236,0.42)'
const LINE = 'rgba(255,255,255,0.10)'
const ACCENT = OLIVE_BRIGHT
const GOLD = '#B98C52'
const GOLD_HI = '#C89E63'
const PURPLE = '#351D93'

const CSS = `
.cl-page{background:${PAPER};color:${INK};min-height:100vh;font-family:${FONT}}
.cl-wrap{max-width:1180px;margin:0 auto;padding:0 20px}

/* ── hero ─────────────────────────────────────────────── */
.cl-hero{position:relative;padding:132px 20px 60px;overflow:hidden;background:#0a0a0b}
.cl-hero-bg{position:absolute;inset:0;z-index:0;opacity:0;transform:scale(1.06);transition:opacity 1.1s ease,transform 1.6s cubic-bezier(.2,.7,.3,1)}
.cl-hero-bg.in{opacity:.42;transform:scale(1)}
.cl-hero-bg img{width:100%;height:100%;object-fit:cover;display:block}
.cl-hero-veil{position:absolute;inset:0;z-index:1;background:
  linear-gradient(180deg,rgba(10,10,11,.86) 0%,rgba(10,10,11,.62) 42%,rgba(11,11,12,.96) 100%),
  radial-gradient(1100px 460px at 50% -8%,rgba(255,255,255,.06),transparent 68%)}
.cl-flag{position:absolute;top:0;inset-inline-start:40px;width:74px;height:auto;aspect-ratio:158/238;z-index:3;pointer-events:none;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.cl-hero-wrap{position:relative;z-index:2;max-width:1180px;margin:0 auto}
.cl-crumb{display:flex;gap:8px;align-items:center;flex-wrap:wrap;color:${FAINT};font-size:13px;margin-bottom:20px}
.cl-crumb a{color:${FAINT};text-decoration:none;transition:color .2s}
.cl-crumb a:hover{color:${INK}}
.cl-panel{max-width:1060px;margin:0 auto;text-align:center;background:rgba(255,255,255,.032);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:38px 38px 32px;box-shadow:0 24px 70px rgba(0,0,0,.32)}
.cl-eyebrow{font-size:13.5px;color:rgba(255,255,255,.8);font-weight:500;letter-spacing:.02em}
.cl-h1{margin:9px 0 0;font-weight:400;font-size:clamp(30px,4.6vw,54px);letter-spacing:-.02em;color:#fff;line-height:1.04}
.cl-lead{margin:13px auto 0;font-size:clamp(14.5px,1.4vw,16.5px);line-height:1.65;color:rgba(255,255,255,.62);max-width:640px}

.cl-search{display:flex;align-items:center;gap:10px;margin-top:26px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13);border-radius:12px;padding:8px 8px 8px 20px;transition:border-color .2s;text-align:start}
.cl-search:focus-within{border-color:rgba(255,255,255,.32)}
.cl-search input{flex:1;min-width:0;background:transparent;border:none;outline:none;color:#fff;font-family:${FONT};font-size:15.5px;text-align:start}
.cl-search input::placeholder{color:rgba(255,255,255,.42)}
.cl-find{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 24px;background:${GOLD};color:#fff;border:none;border-radius:9px;font-family:${FONT};font-weight:600;font-size:15px;cursor:pointer;transition:background .2s,transform .2s}
.cl-find:hover{background:${GOLD_HI};transform:translateY(-1px)}

.cl-filters{display:flex;gap:12px;margin-top:14px;flex-wrap:wrap}
.cl-fchip{position:relative;flex:1 1 0;min-width:150px;display:flex;align-items:center;gap:8px;height:54px;padding:0 11px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.13);border-radius:11px;cursor:pointer;transition:border-color .2s,background .2s}
.cl-fchip:hover{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.075)}
.cl-fchip-div{width:1px;height:20px;background:rgba(255,255,255,.16);flex-shrink:0}
.cl-fchip-txt{flex:1;font-size:13.5px;color:rgba(255,255,255,.84);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:start}
.cl-fchip select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px}

.cl-stats{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:22px}
.cl-stat{display:flex;align-items:baseline;gap:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.11);border-radius:999px;padding:9px 18px}
.cl-stat b{font-size:17px;font-weight:700;color:${ACCENT};letter-spacing:-.01em}
.cl-stat span{font-size:12.5px;color:rgba(255,255,255,.55)}

/* ── sections ─────────────────────────────────────────── */
.cl-sec{padding:60px 0 0}
.cl-h2{font-weight:600;font-size:clamp(21px,2.4vw,28px);color:${INK};margin:0 0 6px;letter-spacing:-.01em}
.cl-sub{font-size:14.5px;color:${SUB};margin:0 0 22px}

/* community image tiles */
.cl-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
.cl-tile{position:relative;display:block;aspect-ratio:4/3;border-radius:14px;overflow:hidden;background:#1a1a1b;border:1px solid ${LINE};text-decoration:none}
.cl-tile img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.7,.3,1)}
.cl-tile:hover img{transform:scale(1.07)}
.cl-tile::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 38%,rgba(0,0,0,.78) 100%)}
.cl-tile-name{position:absolute;left:14px;right:14px;bottom:12px;z-index:2;display:flex;align-items:center;gap:6px;color:#fff;font-weight:600;font-size:15.5px;text-shadow:0 2px 10px rgba(0,0,0,.6)}

/* listing cards */
.cl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(262px,1fr));gap:18px}
.cl-card{background:${SURFACE};border:1px solid ${LINE};border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:border-color .25s,box-shadow .25s,transform .25s}
.cl-card:hover{border-color:${PURPLE};box-shadow:0 16px 40px rgba(53,29,147,.16);transform:translateY(-3px)}
.cl-media{position:relative;display:block;aspect-ratio:4/3;overflow:hidden;background:#1a1a1b}
.cl-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s cubic-bezier(.2,.7,.3,1)}
.cl-card:hover .cl-media img{transform:scale(1.06)}
.cl-tag{position:absolute;top:11px;inset-inline-start:11px;z-index:2;background:rgba(20,20,20,.82);color:#fff;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:5px 9px;border-radius:5px}
.cl-body{padding:14px 15px 15px;display:flex;flex-direction:column;flex:1}
.cl-area{color:${FAINT};font-size:11.5px;text-transform:uppercase;letter-spacing:.07em;font-weight:600}
.cl-title{font-weight:600;font-size:16.5px;color:${INK};margin:5px 0 0;line-height:1.3;text-decoration:none;display:block}
.cl-price{font-weight:700;font-size:19px;color:${ACCENT};margin-top:9px}
.cl-specs{display:flex;gap:14px;margin-top:10px;padding-top:10px;border-top:1px solid ${LINE};color:${SUB};font-size:13px}
.cl-actions{display:flex;gap:8px;margin-top:13px}
.cl-btn{flex:1;height:40px;border-radius:8px;font-family:${FONT};font-size:13.5px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;transition:background .2s,color .2s,border-color .2s}
.cl-btn-ghost{background:transparent;color:${INK};border:1px solid ${LINE}}
.cl-btn-ghost:hover{border-color:${PURPLE};color:#fff;background:rgba(53,29,147,.22)}
.cl-btn-primary{background:${INK};color:${PAPER};border:1px solid ${INK};font-weight:700}
.cl-btn-primary:hover{background:${PURPLE};border-color:${PURPLE};color:#fff}

/* copy block */
.cl-copy{max-width:860px;margin:0 auto;padding:64px 0 96px}
.cl-copy h2{font-weight:600;font-size:clamp(22px,2.6vw,30px);color:${INK};margin:0 0 18px;line-height:1.25;letter-spacing:-.01em}
.cl-copy p{font-size:15.5px;line-height:1.85;color:${SUB};margin:0 0 18px}
.cl-faq{margin-top:34px}
.cl-faq h3{font-weight:600;font-size:17px;color:${INK};margin:0 0 8px}
.cl-faq p{font-size:15px;line-height:1.8;margin:0}
.cl-faq>div{margin-bottom:22px;padding-inline-start:14px;border-inline-start:2px solid rgba(255,255,255,.09);transition:border-color .3s}
.cl-faq>div:hover{border-inline-start-color:${ACCENT}}
.cl-links{margin:0;padding-inline-start:18px;list-style:disc}
.cl-links li{margin-bottom:9px}
.cl-links a{font-size:15px;color:${ACCENT};text-decoration:none;transition:opacity .2s}
.cl-links a:hover{opacity:.75;text-decoration:underline}
.cl-more{display:inline-flex;align-items:center;gap:8px;color:${ACCENT};font-size:15px;font-weight:600;text-decoration:none;margin-top:24px;transition:gap .2s}
.cl-more:hover{gap:13px}

/* Soft reveal — progressive enhancement. The hidden state only applies once
   JS has added .cl-anim to the root, so if the observer never runs (or JS
   fails) the content is visible rather than stuck at opacity:0. */
.cl-reveal{opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.2,.7,.3,1),transform .8s cubic-bezier(.2,.7,.3,1)}
.cl-reveal.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.cl-reveal,.cl-reveal.in{opacity:1;transform:none;transition:none}.cl-hero-bg{transition:none}}
@media (max-width:720px){
  .cl-hero{padding:112px 16px 44px}
  .cl-panel{padding:26px 18px 22px;border-radius:16px}
  .cl-flag{width:52px;inset-inline-start:16px}
  .cl-search{flex-wrap:wrap;padding:10px}
  .cl-find{width:100%}
}
`

const typeGroup = (t) => {
  const s = String(t || '')
  if (/villa/i.test(s)) return 'Villa'
  if (/penthouse/i.test(s)) return 'Penthouse'
  if (/town\s*house|townhouse/i.test(s)) return 'Townhouse'
  if (/chalet/i.test(s)) return 'Chalet'
  if (/studio/i.test(s)) return 'Studio'
  return 'Apartment'
}
const fmtOmr = (n) => (n > 0 ? `OMR ${Number(n).toLocaleString('en-US')}` : null)

const UI = {
  en: { eyebrow: 'Irfan Investment · Property Portal', from: 'from', homes: 'homes available', home1: 'home available', areas: 'communities', area1: 'community', view: 'View', contact: 'Contact', freehold: 'Freehold', browseAll: 'Browse every property in Oman', listings: 'Available now', listingsSub: 'Live developer inventory, priced and ready to view.', tilesSub: 'Freehold districts where foreign buyers can own outright.', studio: 'Studio', bed: 'bed', find: 'Find Property', ph: 'Search for a property, like “2-bed apartment under 150k”', anyType: 'Property Type', anyBeds: 'Bedrooms', anyPrice: 'Pricing Range' },
  fa: { eyebrow: 'عرفان اینوست · پورتال املاک', from: 'از', homes: 'ملک موجود', areas: 'منطقه', view: 'مشاهده', contact: 'تماس', freehold: 'فری‌هولد', browseAll: 'مشاهدهٔ همهٔ املاک عمان', listings: 'موجود در حال حاضر', listingsSub: 'موجودی زندهٔ سازنده، قیمت‌گذاری‌شده و آمادهٔ بازدید.', tilesSub: 'مناطق فری‌هولد که خارجی‌ها می‌توانند کامل مالک شوند.', studio: 'استودیو', bed: 'خوابه', find: 'یافتن ملک', ph: 'ملک دلخواهت را توصیف کن، مثل «آپارتمان ۲خوابه زیر ۱۵۰هزار»', anyType: 'نوع ملک', anyBeds: 'خواب', anyPrice: 'محدودهٔ قیمت' },
  ar: { eyebrow: 'عرفان للاستثمار · بوابة العقارات', from: 'من', homes: 'عقار متاح', areas: 'منطقة', view: 'عرض', contact: 'تواصل', freehold: 'تملّك حر', browseAll: 'تصفح جميع عقارات عُمان', listings: 'متاح الآن', listingsSub: 'مخزون المطورين مباشرة، بأسعار محدثة وجاهز للمعاينة.', tilesSub: 'مناطق التملّك الحر المتاحة للأجانب بالكامل.', studio: 'استوديو', bed: 'غرفة', find: 'ابحث', ph: 'ابحث عن عقار مثل «شقة بغرفتين بأقل من 150 ألف»', anyType: 'نوع العقار', anyBeds: 'الغرف', anyPrice: 'نطاق السعر' },
  ru: { eyebrow: 'Irfan Investment · Портал недвижимости', from: 'от', homes: 'объектов', home1: 'объект', areas: 'районов', area1: 'район', view: 'Смотреть', contact: 'Связаться', freehold: 'Фрихолд', browseAll: 'Вся недвижимость Омана', listings: 'Доступно сейчас', listingsSub: 'Живой инвентарь застройщиков с ценами, готов к просмотру.', tilesSub: 'Фрихолд-районы, где иностранцы владеют полностью.', studio: 'Студия', bed: 'спальни', find: 'Найти', ph: 'Найти недвижимость, напр. «2 спальни до 150k»', anyType: 'Тип', anyBeds: 'Спальни', anyPrice: 'Цена' },
}

const TYPE_VALUES = ['Any', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Studio', 'Chalet']
const BED_VALUES = ['any', '0', '1', '2', '3', '4']
const PRICE_VALUES = ['any', '100', '200', '400', '1000']

// Entrance motion is driven by REACT STATE, never by an imperative
// classList.add. A re-render rewrites className from the JSX, which wipes an
// imperatively-added class and restarts the transition from its "from" state —
// that is exactly how the reveal got stuck at opacity:0 (and how a modal tween
// on this app froze before). State-driven + staggered delay is re-render safe.
// setTimeout, NOT requestAnimationFrame: rAF never fires while the tab is
// hidden (document.visibilityState === 'hidden'), which would leave the
// sections stuck at opacity:0 for anyone who opens the page in a background
// tab and then switches to it.
function useMounted() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 60)
    return () => clearTimeout(id)
  }, [])
  return on
}

export default function CityLandingPage({ slug }) {
  const { lang } = useI18n()
  const navLocal = useLocalizedNavigate()
  const rtl = lang === 'fa' || lang === 'ar'
  const cfg = LANDINGS[slug]
  const c = landingCopy(slug, lang)
  const t = UI[lang] || UI.en

  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [inquiry, setInquiry] = useState(null)
  const [q, setQ] = useState('')
  const [ptype, setPtype] = useState('Any')
  const [beds, setBeds] = useState('any')
  const [price, setPrice] = useState('any')
  const [heroIn, setHeroIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchProjects(), fetchAllUnits()])
      .then(([p, u]) => { if (!cancelled) { setProjects(p); setUnits(u) } })
      .catch(() => { /* page still renders its copy */ })
    return () => { cancelled = true }
  }, [])

  const { rows, count, minPrice, areaNames, heroImg, tileImg } = useMemo(() => {
    const byId = new Map(projects.map((p) => [p.id, p]))
    const cities = cfg?.filter?.cities
    const types = cfg?.filter?.types
    const matched = units
      .map((u) => ({ unit: u, project: byId.get(u.project_id) }))
      .filter((x) => x.project)
      .filter((x) => !cities || cities.includes(x.project.area?.city))
      .filter((x) => !types || types.includes(typeGroup(x.unit.unit_type)))

    // Collapse near-identical units exactly like /project does.
    const groups = new Map()
    for (const it of matched) {
      const k = `${it.unit.project_id}|${typeGroup(it.unit.unit_type)}|${it.unit.bedrooms ?? 0}|${Math.round(Number(it.unit.price_omr))}`
      if (!groups.has(k)) groups.set(k, it)
    }
    const list = [...groups.values()].sort(
      (a, b) => (Number(a.unit.price_omr) || 0) - (Number(b.unit.price_omr) || 0),
    )
    const prices = matched.map((x) => Number(x.unit.price_omr)).filter((n) => n > 0)

    // Imagery is derived from the real inventory, so it can never point at a
    // project that is no longer sold. Hero = biggest project in the set.
    const byProject = new Map()
    for (const it of matched) byProject.set(it.project.name, (byProject.get(it.project.name) || 0) + 1)
    const topProject = [...byProject.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    const gal = topProject ? galleryFor(slugify(topProject)) : []

    // Area → cover image. Walk EVERY project in the area, not just the first,
    // because some projects have no gallery folder (Aida/Yiti shipped without
    // one) — otherwise that tile renders as an empty black box.
    const tile = {}
    for (const it of matched) {
      const n = it.project.area?.name
      if (!n || tile[n]) continue
      const img = (galleryFor(slugify(it.project.name)) || [])[0]
      if (img) tile[n] = img
    }

    return {
      rows: list,
      count: matched.length,
      minPrice: prices.length ? Math.min(...prices) : 0,
      areaNames: [...new Set(matched.map((x) => x.project.area?.name).filter(Boolean))],
      heroImg: gal[1] || gal[0] || null,
      tileImg: tile,
    }
  }, [projects, units, cfg])

  useEffect(() => { if (heroImg) setHeroIn(true) }, [heroImg])

  const shown = useMounted()
  const rv = (i) => ({ className: `cl-reveal${shown ? ' in' : ''}`, style: { transitionDelay: `${i * 90}ms` } })

  // ── structured data: FAQ + ItemList + Breadcrumb ────────────────────────
  useEffect(() => {
    if (!c) return
    const faq = document.createElement('script')
    faq.type = 'application/ld+json'
    faq.id = 'landing-faq-jsonld'
    faq.textContent = JSON.stringify(landingFaqJsonLd(slug, lang))
    document.getElementById('landing-faq-jsonld')?.remove()
    document.head.appendChild(faq)

    const list = document.createElement('script')
    list.type = 'application/ld+json'
    list.id = 'landing-itemlist-jsonld'
    list.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Properties for Sale in Oman', item: `${SITE}/project` },
            { '@type': 'ListItem', position: 3, name: landingCopy(slug, 'en').h1, item: `${SITE}/${slug}` },
          ],
        },
        {
          '@type': 'ItemList',
          name: landingCopy(slug, 'en').h1,
          numberOfItems: rows.length,
          itemListElement: rows.slice(0, 25).map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE}/property/${it.unit.id}`,
            name: `${it.unit.bedrooms ? `${it.unit.bedrooms}-Bedroom ` : ''}${typeGroup(it.unit.unit_type)} at ${it.project.name}`,
          })),
        },
      ],
    })
    document.getElementById('landing-itemlist-jsonld')?.remove()
    document.head.appendChild(list)
    return () => { faq.remove(); list.remove() }
  }, [slug, lang, c, rows])

  if (!cfg || !c) return null

  // Hand the search off to the real portal, pre-scoped to this landing.
  const runSearch = (e) => {
    e?.preventDefault?.()
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
    if (ptype !== 'Any') p.set('type', ptype)
    if (beds !== 'any') p.set('beds', beds)
    if (price !== 'any') p.set('price', price)
    const onlyArea = cfg.areaLinks?.length === 1 ? cfg.areaLinks[0].area : null
    if (onlyArea && !p.has('q')) p.set('area', onlyArea)
    navLocal(`/project${p.toString() ? `?${p}` : ''}`)
  }

  const bedLabel = (n) => (n === '0' ? t.studio : n === '4' ? '4+' : n)

  return (
    <div className="cl-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{CSS}</style>

      {/* ── photographic hero + glass search panel ── */}
      <section className="cl-hero">
        <div className={`cl-hero-bg${heroIn ? ' in' : ''}`} aria-hidden="true">
          {heroImg && <img src={heroImg} alt={`${c.h1}, Oman`} fetchPriority="high" decoding="async" width="1600" height="1066" />}
        </div>
        <div className="cl-hero-veil" aria-hidden="true" />
        <img className="cl-flag" src="/images/oman-flag.png" alt="Flag of Oman" />

        <div className="cl-hero-wrap">
          <nav className="cl-crumb">
            <LocalizedLink to="/">Home</LocalizedLink><span>/</span>
            <LocalizedLink to="/project">Oman</LocalizedLink><span>/</span>
            <span style={{ color: SUB }}>{c.h1}</span>
          </nav>

          <div className="cl-panel">
            <div className="cl-eyebrow">{t.eyebrow}</div>
            <h1 className="cl-h1">{c.h1}</h1>
            <p className="cl-lead">{c.lead}</p>

            <form className="cl-search" onSubmit={runSearch}>
              <SearchRoundedIcon sx={{ fontSize: 22, color: 'rgba(255,255,255,.55)', flexShrink: 0 }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.ph} aria-label={t.ph} />
              <button type="submit" className="cl-find">{t.find}</button>
            </form>

            <div className="cl-filters">
              {[
                { icon: <HomeWorkOutlinedIcon sx={{ fontSize: 19 }} />, val: ptype === 'Any' ? t.anyType : ptype, set: setPtype, cur: ptype, opts: TYPE_VALUES, label: (v) => (v === 'Any' ? t.anyType : v) },
                { icon: <KingBedOutlinedIcon sx={{ fontSize: 19 }} />, val: beds === 'any' ? t.anyBeds : bedLabel(beds), set: setBeds, cur: beds, opts: BED_VALUES, label: (v) => (v === 'any' ? t.anyBeds : bedLabel(v)) },
                { icon: <PaymentsOutlinedIcon sx={{ fontSize: 19 }} />, val: price === 'any' ? t.anyPrice : `< OMR ${(Number(price) * 1000).toLocaleString('en-US')}`, set: setPrice, cur: price, opts: PRICE_VALUES, label: (v) => (v === 'any' ? t.anyPrice : `< OMR ${(Number(v) * 1000).toLocaleString('en-US')}`) },
              ].map((f, i) => (
                <label className="cl-fchip" key={i}>
                  <span style={{ display: 'inline-flex', color: 'rgba(255,255,255,.62)', flexShrink: 0 }}>{f.icon}</span>
                  <span className="cl-fchip-div" aria-hidden="true" />
                  <span className="cl-fchip-txt">{f.val}</span>
                  <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,.5)', flexShrink: 0 }} />
                  <select value={f.cur} onChange={(e) => f.set(e.target.value)}>
                    {f.opts.map((o) => <option key={o} value={o}>{f.label(o)}</option>)}
                  </select>
                </label>
              ))}
            </div>

            {(count > 0 || minPrice > 0) && (
              <div className="cl-stats">
                {count > 0 && <div className="cl-stat"><b>{count.toLocaleString('en-US')}</b><span>{count === 1 && t.home1 ? t.home1 : t.homes}</span></div>}
                {minPrice > 0 && <div className="cl-stat"><span>{t.from}</span><b>{fmtOmr(minPrice)}</b></div>}
                {areaNames.length > 0 && <div className="cl-stat"><b>{areaNames.length}</b><span>{areaNames.length === 1 && t.area1 ? t.area1 : t.areas}</span></div>}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="cl-wrap">
        {/* ── community image tiles ── */}
        {cfg.areaLinks?.length > 0 && (
          <section className={`cl-sec ${rv(0).className}`} style={rv(0).style}>
            <h2 className="cl-h2">{c.areasHeading}</h2>
            <p className="cl-sub">{t.tilesSub}</p>
            <div className="cl-tiles">
              {cfg.areaLinks.map((a) => (
                <LocalizedLink key={a.area} className="cl-tile" to={`/project?area=${encodeURIComponent(a.area)}`}>
                  {(tileImg[a.area] || heroImg) && (
                    <img src={tileImg[a.area] || heroImg} alt={`Property for sale in ${a.label}, Oman`} loading="lazy" />
                  )}
                  <span className="cl-tile-name">
                    <PlaceRoundedIcon sx={{ fontSize: 16, color: GOLD }} /> {a.label}
                  </span>
                </LocalizedLink>
              ))}
            </div>
          </section>
        )}

        {/* ── listings ── */}
        {rows.length > 0 && (
          <section className={`cl-sec ${rv(1).className}`} style={rv(1).style}>
            <h2 className="cl-h2">{t.listings}</h2>
            <p className="cl-sub">{t.listingsSub}</p>
            <div className="cl-grid">
              {rows.slice(0, 24).map((it) => {
                const g = typeGroup(it.unit.unit_type)
                const b = it.unit.bedrooms
                const img = (galleryFor(slugify(it.project.name)) || [])[0]
                const sqm = Math.round(Number(it.unit.total_area_sqm || it.unit.internal_area_sqm || 0))
                const label = b === 0 || b == null ? t.studio : `${b} ${t.bed}`
                return (
                  <article className="cl-card" key={it.unit.id}>
                    <LocalizedLink className="cl-media" to={`/property/${it.unit.id}`}>
                      {img && <img src={img} alt={`${label} ${g} for sale at ${it.project.name}, Oman`} loading="lazy" />}
                      <span className="cl-tag">{t.freehold}</span>
                    </LocalizedLink>
                    <div className="cl-body">
                      <div className="cl-area">{it.project.area?.name || it.project.location}</div>
                      <LocalizedLink className="cl-title" to={`/property/${it.unit.id}`}>
                        {label} {g} · {it.project.name}
                      </LocalizedLink>
                      <div className="cl-price">{fmtOmr(it.unit.price_omr) || '—'}</div>
                      <div className="cl-specs">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><KingBedRoundedIcon sx={{ fontSize: 15, color: FAINT }} /> {label}</span>
                        {sqm ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><SquareFootRoundedIcon sx={{ fontSize: 15, color: FAINT }} /> {sqm} m²</span> : null}
                      </div>
                      <div className="cl-actions">
                        <button type="button" className="cl-btn cl-btn-ghost" onClick={() => setInquiry({ project: it.project, unit: it.unit })}>{t.contact}</button>
                        <LocalizedLink className="cl-btn cl-btn-primary" to={`/property/${it.unit.id}`}>{t.view}</LocalizedLink>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <LocalizedLink className="cl-more" to="/project">
              {t.browseAll} <ArrowForwardRoundedIcon sx={{ fontSize: 17, transform: rtl ? 'scaleX(-1)' : 'none' }} />
            </LocalizedLink>
          </section>
        )}

        {/* ── SEO copy + FAQ + internal links ── */}
        <section className={`cl-copy ${rv(2).className}`} style={{ textAlign: rtl ? 'right' : 'left', ...rv(2).style }}>
          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 44 }}>
            <h2>{c.heading}</h2>
            {c.paras.map((p, i) => <p key={i}>{p}</p>)}
            <div className="cl-faq">
              {c.faq.map((f, i) => (
                <div key={i}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
            <h3 style={{ fontWeight: 600, fontSize: 17, color: INK, margin: '34px 0 12px' }}>{c.linksHeading}</h3>
            <ul className="cl-links">
              {c.links.map((l) => (
                <li key={l.href}><LocalizedLink to={l.href}>{l.label}</LocalizedLink></li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <QuickInquiryModal
        open={!!inquiry}
        onClose={() => setInquiry(null)}
        project={inquiry?.project}
        unit={inquiry?.unit}
      />
    </div>
  )
}
