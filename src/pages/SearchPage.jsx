/**
 * SearchPage — the site's unit-level property search engine (route `/project`,
 * repurposed from the old "Project" nav item that pointed at the landing page).
 *
 * Standardised on the LuxuryProperty-style portal the client referenced:
 *   • a prominent search bar (location / project) + Property Type + Beds +
 *     Price dropdowns + Search button;
 *   • breadcrumb + live result count + sort;
 *   • a grid of UNIT cards (cover, badges, title, area, price, public ref,
 *     beds · area · type) — each card links to the rich project detail page
 *     (/buy/:slug) which already holds the full unit table, gallery + inquiry.
 *
 * Data: fetchProjects() + fetchAllUnits() once, joined + filtered client-side
 * (407 units → instant, no per-filter round-trips). Filters live in the URL
 * (?q, ?type, ?beds, ?price, ?sort) so results are shareable and prerenderable.
 *
 * unit_no is internal-only (business rule) → cards show a generated public
 * ref `IRF-<id>`, never the raw unit_no.
 */
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import KingBedRoundedIcon from '@mui/icons-material/KingBedRounded'
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { coverForSlug } from '../projectGallery.js'
import { slugify } from './BuyPage.jsx'
import { LocalizedLink } from '../lib/localize.js'
import { FONT, OLIVE_BRIGHT } from '../components/invest/ui.jsx'

const INK = '#0d0e0c'
const CARD = '#141512'
const LINE = 'rgba(255,255,255,0.10)'
const LINE_SOFT = 'rgba(255,255,255,0.07)'
const TEXT = 'rgba(255,255,255,0.82)'
const MUTED = 'rgba(255,255,255,0.5)'

const PLACEHOLDER_POOL = [
  '/images/blog/muscat-11.jpg', '/images/blog/muscat-12.jpg', '/images/blog/muscat-13.jpg',
  '/images/blog/sifah-1.jpg', '/images/blog/salalah-4.jpg', '/images/blog/muscat-9.jpg',
]

// Map the 16 raw unit types onto the search dropdown's coarse groups.
function typeGroup(raw) {
  const t = String(raw || '').toLowerCase()
  if (t.includes('studio')) return 'Studio'
  if (t.includes('penthouse') || t.includes('sky palace')) return 'Penthouse'
  if (t.includes('townhouse')) return 'Townhouse'
  if (t.includes('chalet')) return 'Chalet'
  if (t.includes('farm')) return 'Farm House'
  if (t.includes('villa')) return 'Villa'
  return 'Apartment' // Apartment*, Sky Residence, Duplex, other
}

const TYPE_OPTIONS = ['Any', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Studio', 'Chalet']
const BEDS_OPTIONS = [
  { v: 'any', label: 'Any beds' },
  { v: '0', label: 'Studio' },
  { v: '1', label: '1 bed' },
  { v: '2', label: '2 beds' },
  { v: '3', label: '3 beds' },
  { v: '4', label: '4+ beds' },
]
const PRICE_OPTIONS = [
  { v: 'any', label: 'Any price', max: Infinity },
  { v: '100', label: 'Under OMR 100k', max: 100000 },
  { v: '200', label: 'Under OMR 200k', max: 200000 },
  { v: '400', label: 'Under OMR 400k', max: 400000 },
  { v: '1000', label: 'Under OMR 1M', max: 1000000 },
]
const SORT_OPTIONS = [
  { v: 'price_asc', label: 'Price (Low to High)' },
  { v: 'price_desc', label: 'Price (High to Low)' },
  { v: 'area_desc', label: 'Largest area' },
]

const STR = {
  en: { crumbHome: 'Home', crumbSearch: 'Properties', heading: 'Properties for Sale in Oman', placeholder: 'Search by area, project or city…', search: 'Search', count: '{n} properties', sortBy: 'Sort', empty: 'No properties match your filters.', reset: 'Clear filters', view: 'View details', from: 'From', freehold: 'Freehold' },
  ru: { crumbHome: 'Главная', crumbSearch: 'Недвижимость', heading: 'Недвижимость на продажу в Омане', placeholder: 'Поиск по району, проекту или городу…', search: 'Поиск', count: '{n} объектов', sortBy: 'Сортировка', empty: 'Ничего не найдено по фильтрам.', reset: 'Сбросить фильтры', view: 'Подробнее', from: 'От', freehold: 'Фрихолд' },
  ar: { crumbHome: 'الرئيسية', crumbSearch: 'العقارات', heading: 'عقارات للبيع في عُمان', placeholder: 'ابحث حسب المنطقة أو المشروع أو المدينة…', search: 'بحث', count: '{n} عقار', sortBy: 'ترتيب', empty: 'لا توجد عقارات مطابقة.', reset: 'مسح الفلاتر', view: 'التفاصيل', from: 'من', freehold: 'تملّك حر' },
  fa: { crumbHome: 'خانه', crumbSearch: 'املاک', heading: 'املاک برای فروش در عمان', placeholder: 'جستجو بر اساس منطقه، پروژه یا شهر…', search: 'جستجو', count: '{n} ملک', sortBy: 'مرتب‌سازی', empty: 'ملکی با این فیلترها پیدا نشد.', reset: 'پاک کردن فیلترها', view: 'مشاهده جزئیات', from: 'از', freehold: 'فری‌هولد' },
}

const fmtOmr = (n) => 'OMR ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)

function coverFor(project, index) {
  // Bundled gallery cover if the project has real photos; otherwise a stable
  // stock image from the pool (never the /images/projects/*.jpg path — a miss
  // there resolves to the SPA index.html and renders as a broken/dark card).
  const slug = slugify(project?.name || '')
  return coverForSlug(slug) || PLACEHOLDER_POOL[index % PLACEHOLDER_POOL.length]
}

// ── one unit result card (links to the rich project page) ────────────────
function UnitCard({ item, index, t, rtl }) {
  const { unit, project } = item
  const beds = unit.bedrooms
  const type = typeGroup(unit.unit_type)
  const isStudio = beds === 0 || beds == null || type === 'Studio'
  const title = isStudio ? 'Studio Apartment' : `${beds}-Bed ${type}`
  const area = [project.area?.name || project.location, project.area?.city].filter(Boolean).join(', ')
  const sqm = unit.total_area_sqm || unit.internal_area_sqm
  const [imgErr, setImgErr] = useState(false)
  const cover = imgErr ? PLACEHOLDER_POOL[index % PLACEHOLDER_POOL.length] : coverFor(project, index)

  return (
    <LocalizedLink
      to={`/buy/${slugify(project.name)}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <article
        style={{
          background: CARD, border: `1px solid ${LINE}`, borderRadius: 16, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', height: '100%', transition: 'border-color .2s, transform .2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${OLIVE_BRIGHT}88`; e.currentTarget.style.transform = 'translateY(-3px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE; e.currentTarget.style.transform = 'none' }}
      >
        <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: '#1c1d18' }}>
          <img src={cover} alt={`${title} in ${area}`} loading="lazy" onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <span style={{ position: 'absolute', top: 12, insetInlineStart: 12, background: 'rgba(140,141,37,0.9)', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 11, letterSpacing: '0.5px', padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase' }}>
            {t.freehold}
          </span>
          {unit.availability_status && (
            <span style={{ position: 'absolute', top: 12, insetInlineEnd: 12, background: 'rgba(0,0,0,0.55)', color: '#fff', fontFamily: FONT, fontSize: 11, padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(6px)', textTransform: 'capitalize' }}>
              {unit.availability_status}
            </span>
          )}
        </div>

        <div style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }} dir={rtl ? 'rtl' : 'ltr'}>
          <h3 style={{ margin: 0, fontFamily: FONT, fontWeight: 600, fontSize: 17, color: '#fff', lineHeight: 1.3 }}>
            {title} · {project.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: MUTED, fontFamily: FONT, fontSize: 13.5 }}>
            <PlaceRoundedIcon sx={{ fontSize: 15 }} /> {area}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 19, color: OLIVE_BRIGHT }}>
              {unit.price_omr > 0 ? fmtOmr(unit.price_omr) : t.from + ' —'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 14, marginTop: 6, paddingTop: 12, borderTop: `1px solid ${LINE_SOFT}`, color: TEXT, fontFamily: FONT, fontSize: 13 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><KingBedRoundedIcon sx={{ fontSize: 16, color: MUTED }} /> {beds === 0 || beds == null ? 'Studio' : beds}</span>
            {sqm ? <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><SquareFootRoundedIcon sx={{ fontSize: 16, color: MUTED }} /> {Math.round(sqm)} m²</span> : null}
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><ApartmentRoundedIcon sx={{ fontSize: 16, color: MUTED }} /> {type}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12 }}>
            <span style={{ color: MUTED, fontFamily: FONT, fontSize: 11.5, letterSpacing: '0.4px' }}>Ref: IRF-{unit.id}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: OLIVE_BRIGHT, fontFamily: FONT, fontWeight: 600, fontSize: 13 }}>
              {t.view} <ArrowOutwardRoundedIcon sx={{ fontSize: 15 }} />
            </span>
          </div>
        </div>
      </article>
    </LocalizedLink>
  )
}

const selStyle = {
  height: 46, background: '#1a1b16', color: '#fff', border: `1px solid ${LINE}`, borderRadius: 10,
  padding: '0 14px', fontFamily: FONT, fontSize: 14.5, outline: 'none', cursor: 'pointer', minWidth: 130,
}

export default function SearchPage() {
  const { lang } = useI18n()
  const t = STR[lang] || STR.en
  const rtl = lang === 'fa' || lang === 'ar'
  const [params, setParams] = useSearchParams()

  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  // live (uncommitted) search box; committed to URL on Search / Enter
  const [q, setQ] = useState(params.get('q') || '')
  const type = params.get('type') || 'Any'
  const beds = params.get('beds') || 'any'
  const price = params.get('price') || 'any'
  const sort = params.get('sort') || 'price_asc'
  const committedQ = params.get('q') || ''

  useEffect(() => {
    document.title = `${t.heading} | Irfan Investment Group`
    let cancelled = false
    Promise.all([fetchProjects(), fetchAllUnits()])
      .then(([projs, us]) => {
        if (cancelled) return
        setProjects(projs || [])
        setUnits(us || [])
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [t.heading])

  const projById = useMemo(() => {
    const m = {}
    for (const p of projects) m[p.id] = p
    return m
  }, [projects])

  const setParam = (key, val, dflt) => {
    const next = new URLSearchParams(params)
    if (val == null || val === dflt) next.delete(key)
    else next.set(key, val)
    setParams(next, { replace: true })
  }

  const commitSearch = () => setParam('q', q.trim() || null, '')

  const results = useMemo(() => {
    const priceMax = PRICE_OPTIONS.find((o) => o.v === price)?.max ?? Infinity
    const needle = committedQ.trim().toLowerCase()
    const enriched = units
      .map((u) => ({ unit: u, project: projById[u.project_id] }))
      .filter((it) => it.project) // drop units whose project lacks coords/data
      .filter((it) => {
        const u = it.unit, p = it.project
        if (type !== 'Any' && typeGroup(u.unit_type) !== type) return false
        if (beds !== 'any') {
          const b = u.bedrooms ?? 0
          if (beds === '4') { if (b < 4) return false } else if (String(b) !== beds) return false
        }
        if (Number(u.price_omr) > priceMax) return false
        if (u.price_omr == null || Number(u.price_omr) <= 0) return false
        if (needle) {
          const hay = [p.name, p.location, p.area?.name, p.area?.city, u.unit_type].filter(Boolean).join(' ').toLowerCase()
          if (!hay.includes(needle)) return false
        }
        return true
      })
    enriched.sort((a, b) => {
      if (sort === 'price_desc') return (b.unit.price_omr || 0) - (a.unit.price_omr || 0)
      if (sort === 'area_desc') return (b.unit.total_area_sqm || 0) - (a.unit.total_area_sqm || 0)
      return (a.unit.price_omr || 0) - (b.unit.price_omr || 0)
    })
    return enriched
  }, [units, projById, type, beds, price, sort, committedQ])

  return (
    <main style={{ background: INK, minHeight: '100vh', color: '#fff' }} dir={rtl ? 'rtl' : 'ltr'}>
      {/* ── search hero ── */}
      <section style={{ borderBottom: `1px solid ${LINE_SOFT}`, padding: '110px 20px 28px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 18px', fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '0.3px' }}>
            {t.heading}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', flex: '1 1 320px', minWidth: 260, alignItems: 'center', gap: 8, height: 46, background: '#1a1b16', border: `1px solid ${LINE}`, borderRadius: 10, padding: '0 14px' }}>
              <SearchRoundedIcon sx={{ fontSize: 20, color: MUTED }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitSearch() }}
                placeholder={t.placeholder}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: FONT, fontSize: 14.5 }}
              />
            </div>

            <select value={type} onChange={(e) => setParam('type', e.target.value, 'Any')} style={selStyle} aria-label="Property type">
              {TYPE_OPTIONS.map((o) => <option key={o} value={o} style={{ background: '#1a1b16' }}>{o === 'Any' ? 'Any type' : o}</option>)}
            </select>
            <select value={beds} onChange={(e) => setParam('beds', e.target.value, 'any')} style={selStyle} aria-label="Bedrooms">
              {BEDS_OPTIONS.map((o) => <option key={o.v} value={o.v} style={{ background: '#1a1b16' }}>{o.label}</option>)}
            </select>
            <select value={price} onChange={(e) => setParam('price', e.target.value, 'any')} style={selStyle} aria-label="Price">
              {PRICE_OPTIONS.map((o) => <option key={o.v} value={o.v} style={{ background: '#1a1b16' }}>{o.label}</option>)}
            </select>

            <button
              type="button"
              onClick={commitSearch}
              style={{ height: 46, padding: '0 26px', background: OLIVE_BRIGHT, color: '#0d0e0c', border: 'none', borderRadius: 10, fontFamily: FONT, fontWeight: 700, fontSize: 14.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <SearchRoundedIcon sx={{ fontSize: 18 }} /> {t.search}
            </button>
          </div>
        </div>
      </section>

      {/* ── breadcrumb + count + sort ── */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '22px 20px 0' }}>
        <nav style={{ color: MUTED, fontFamily: FONT, fontSize: 13, marginBottom: 8 }}>
          <LocalizedLink to="/" style={{ color: MUTED, textDecoration: 'none' }}>{t.crumbHome}</LocalizedLink>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: TEXT }}>{t.crumbSearch}</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: FONT, fontSize: 15, color: TEXT }}>
            {loading ? '…' : t.count.replace('{n}', results.length)}
          </span>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: MUTED, fontFamily: FONT, fontSize: 13.5 }}>
            {t.sortBy}:
            <select value={sort} onChange={(e) => setParam('sort', e.target.value, 'price_asc')} style={{ ...selStyle, height: 38, minWidth: 170 }}>
              {SORT_OPTIONS.map((o) => <option key={o.v} value={o.v} style={{ background: '#1a1b16' }}>{o.label}</option>)}
            </select>
          </label>
        </div>
      </section>

      {/* ── results grid ── */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 20px 80px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${LINE_SOFT}`, borderRadius: 16, aspectRatio: '3 / 4', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: MUTED, fontFamily: FONT }}>
            <p style={{ fontSize: 16, marginBottom: 14 }}>{t.empty}</p>
            <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })}
              style={{ background: 'transparent', color: OLIVE_BRIGHT, border: `1px solid ${OLIVE_BRIGHT}66`, borderRadius: 8, padding: '9px 18px', fontFamily: FONT, fontSize: 14, cursor: 'pointer' }}>
              {t.reset}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {results.map((item, i) => (
              <UnitCard key={item.unit.id} item={item} index={i} t={t} rtl={rtl} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
