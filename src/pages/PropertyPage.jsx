/**
 * PropertyPage — light-theme property detail page (route `/property/:id`,
 * id = a project_units.id). Reached from the /project listing cards.
 *
 * Modelled on the reference luxury-listing layout: SALE badge, title + price
 * (with crypto equivalents), location, a Property Type / Bedrooms / Size / Ref
 * meta row, an "About this property" write-up composed from the REAL unit +
 * project fields (we don't fabricate prose beyond the data), a photo gallery,
 * a Mapbox map of the project, key details, and recommended similar homes.
 *
 * Data: fetchAllUnits() + fetchProjects() (same feed as the search), joined
 * client-side. unit_no stays internal — the public ref is IRF-<id>.
 */
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import KingBedRoundedIcon from '@mui/icons-material/KingBedRounded'
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { galleryFor } from '../projectGallery.js'
import { slugify } from './BuyPage.jsx'
import { LocalizedLink } from '../lib/localize.js'
import { FONT, OLIVE_BRIGHT } from '../components/invest/ui.jsx'
import { getProjectDetails } from '../data/projectDetails.js'
import { FEATURE_META, FEATURES_HEADING } from '../data/amenities.jsx'

// ── light palette ─────────────────────────────────────────────────────────
const PAPER = '#ffffff'
const INK = '#17140f'
const SUB = '#615d54'
const FAINT = '#9a968b'
const LINE = '#e7e3d9'
const LINE_2 = '#d7d2c4'
const OLIVE = OLIVE_BRIGHT // #8c8d25 — price / accents

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const POOL = Array.from({ length: 13 }, (_, i) => `/images/blog/muscat-${i + 1}.jpg`)

// Gallery mosaic — one large image + a 2x2 grid of four (reference layout).
const GALLERY_CSS = `
.pfp-gallery{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:10px;height:clamp(320px,42vw,520px)}
.pfp-gallery .g{position:relative;overflow:hidden;background:#eee}
.pfp-gallery img{width:100%;height:100%;object-fit:cover;display:block}
.pfp-gallery .g0{grid-row:1 / 3;grid-column:1}
.pfp-viewall{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(20,18,14,.42);color:#fff;font-family:${FONT};font-weight:600;font-size:14px;border:none;cursor:pointer}
.pfp-viewall:hover{background:rgba(20,18,14,.56)}
@media(max-width:760px){
  .pfp-gallery{grid-template-columns:1fr 1fr;grid-template-rows:auto;height:auto}
  .pfp-gallery .g0{grid-row:auto;grid-column:1 / 3;aspect-ratio:16 / 10}
  .pfp-gallery .g:not(.g0){aspect-ratio:4 / 3}
}
`
const hashId = (id) => { let x = 0; const s = String(id); for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x }

function typeGroup(raw) {
  const t = String(raw || '').toLowerCase()
  if (t.includes('studio')) return 'Studio'
  if (t.includes('penthouse') || t.includes('sky palace')) return 'Penthouse'
  if (t.includes('townhouse')) return 'Townhouse'
  if (t.includes('chalet')) return 'Chalet'
  if (t.includes('farm')) return 'Farm House'
  if (t.includes('villa')) return 'Villa'
  return 'Apartment'
}

const TYPE_WORDS = {
  en: { Apartment: 'Apartment', Villa: 'Villa', Penthouse: 'Penthouse', Townhouse: 'Townhouse', Studio: 'Studio', Chalet: 'Chalet', 'Farm House': 'Farm House' },
  ru: { Apartment: 'Квартира', Villa: 'Вилла', Penthouse: 'Пентхаус', Townhouse: 'Таунхаус', Studio: 'Студия', Chalet: 'Шале', 'Farm House': 'Фермерский дом' },
  ar: { Apartment: 'شقة', Villa: 'فيلا', Penthouse: 'بنتهاوس', Townhouse: 'تاون هاوس', Studio: 'استوديو', Chalet: 'شاليه', 'Farm House': 'بيت ريفي' },
  fa: { Apartment: 'آپارتمان', Villa: 'ویلا', Penthouse: 'پنت‌هاوس', Townhouse: 'تاون‌هاوس', Studio: 'استودیو', Chalet: 'شاله', 'Farm House': 'خانه مزرعه' },
}
const STUDIO_TITLE = { en: 'Studio Apartment', ru: 'Квартира-студия', ar: 'شقة استوديو', fa: 'آپارتمان استودیو' }

const localizeDigits = (val, lang) => {
  const s = String(val)
  if (lang === 'fa') return s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
  if (lang === 'ar') return s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])
  return s
}
const fmtOmr = (n, lang) => localizeDigits('OMR ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n), lang)

function unitTitle(beds, type, lang) {
  const word = (TYPE_WORDS[lang] || TYPE_WORDS.en)[type] || type
  const isStudio = beds === 0 || beds == null || type === 'Studio'
  if (isStudio) return STUDIO_TITLE[lang] || STUDIO_TITLE.en
  const n = localizeDigits(beds, lang)
  if (lang === 'fa') return `${word} ${n} خوابه`
  if (lang === 'ar') return `${word} ${n} غرف`
  if (lang === 'ru') return `${word}, ${n} спальни`
  return `${beds}-Bed ${word}`
}

const STR = {
  en: { sale: 'For Sale', propertyType: 'Property Type', bedrooms: 'Bedrooms', size: 'Size', ref: 'Ref no.', about: 'About this property', aboutDev: 'About the development', showMore: 'Show more', showLess: 'Show less', showAll: 'Show all photos', floorPlan: 'Request floor plan', keyDetails: 'Key details', internalArea: 'Internal area', totalArea: 'Total area', gardenArea: 'Garden', view: 'View', floor: 'Floor', perSqm: 'Price per m²', developer: 'Developer', availability: 'Availability', location: 'Location', mapTitle: 'On the map', recommended: 'You may also like', contact: 'Contact our team', from: 'From', freehold: 'Freehold', studio: 'Studio', notFound: 'This property is no longer listed.', backToSearch: 'Back to search', crumbHome: 'Home', crumbSearch: 'Properties', approx: 'approx.' },
  ru: { sale: 'В продаже', propertyType: 'Тип', bedrooms: 'Спальни', size: 'Площадь', ref: 'Номер', about: 'Об объекте', aboutDev: 'О проекте', showMore: 'Показать ещё', showLess: 'Свернуть', showAll: 'Все фото', floorPlan: 'Запросить план', keyDetails: 'Ключевые детали', internalArea: 'Внутренняя площадь', totalArea: 'Общая площадь', gardenArea: 'Сад', view: 'Вид', floor: 'Этаж', perSqm: 'Цена за м²', developer: 'Застройщик', availability: 'Статус', location: 'Расположение', mapTitle: 'На карте', recommended: 'Вам также понравится', contact: 'Связаться с нами', from: 'От', freehold: 'Фрихолд', studio: 'Студия', notFound: 'Этот объект больше не в продаже.', backToSearch: 'Назад к поиску', crumbHome: 'Главная', crumbSearch: 'Недвижимость', approx: 'около' },
  ar: { sale: 'للبيع', propertyType: 'النوع', bedrooms: 'غرف النوم', size: 'المساحة', ref: 'الرقم', about: 'عن هذا العقار', aboutDev: 'عن المشروع', showMore: 'عرض المزيد', showLess: 'عرض أقل', showAll: 'كل الصور', floorPlan: 'اطلب المخطط', keyDetails: 'التفاصيل', internalArea: 'المساحة الداخلية', totalArea: 'المساحة الكلية', gardenArea: 'الحديقة', view: 'الإطلالة', floor: 'الطابق', perSqm: 'السعر لكل م²', developer: 'المطوّر', availability: 'الحالة', location: 'الموقع', mapTitle: 'على الخريطة', recommended: 'قد يعجبك أيضاً', contact: 'تواصل مع فريقنا', from: 'من', freehold: 'تملّك حر', studio: 'استوديو', notFound: 'لم يعد هذا العقار معروضاً.', backToSearch: 'العودة للبحث', crumbHome: 'الرئيسية', crumbSearch: 'العقارات', approx: 'حوالي' },
  fa: { sale: 'برای فروش', propertyType: 'نوع ملک', bedrooms: 'اتاق خواب', size: 'متراژ', ref: 'کد', about: 'دربارهٔ این ملک', aboutDev: 'دربارهٔ پروژه', showMore: 'بیشتر', showLess: 'کمتر', showAll: 'همهٔ عکس‌ها', floorPlan: 'درخواست نقشه', keyDetails: 'جزئیات کلیدی', internalArea: 'متراژ داخلی', totalArea: 'متراژ کل', gardenArea: 'باغ', view: 'منظره', floor: 'طبقه', perSqm: 'قیمت هر متر', developer: 'سازنده', availability: 'وضعیت', location: 'موقعیت', mapTitle: 'روی نقشه', recommended: 'شاید بپسندید', contact: 'تماس با تیم ما', from: 'از', freehold: 'فری‌هولد', studio: 'استودیو', notFound: 'این ملک دیگر در دسترس نیست.', backToSearch: 'بازگشت به جستجو', crumbHome: 'خانه', crumbSearch: 'املاک', approx: 'حدود' },
}

// Compose an honest description from the real unit + project fields (no invented facts).
function describe(u, p, lang) {
  const type = typeGroup(u.unit_type)
  const word = (TYPE_WORDS[lang] || TYPE_WORDS.en)[type] || type
  const beds = u.bedrooms
  const isStudio = beds === 0 || beds == null || type === 'Studio'
  const sqm = Math.round(Number(u.total_area_sqm || u.internal_area_sqm || 0))
  const area = p.area?.name || p.location || ''
  const city = p.area?.city || ''
  const dev = p.developer?.name || ''
  const view = u.view || ''
  const price = Number(u.price_omr)
  const pps = Number(u.price_per_sqm_omr)
  const n = (x) => localizeDigits(x, lang)
  if (lang === 'fa') {
    const p1 = `این ${isStudio ? 'استودیو' : `${word} ${n(beds)} خوابه`}${sqm ? ` با ${n(sqm)} مترمربع فضا` : ''} در پروژهٔ ${p.name}، ${area}${city ? `، ${city}` : ''} قرار دارد.${view ? ` این واحد رو به ${view} است.` : ''}`
    const p2 = `به‌صورت فری‌هولد و با قیمت ${fmtOmr(price, lang)}${pps ? `（حدود ${fmtOmr(Math.round(pps), lang)} هر متر）` : ''} عرضه می‌شود.${dev ? ` توسعه‌یافته توسط ${dev}.` : ''}${u.floor_label ? ` واقع در ${u.floor_label}.` : ''} برای نقشه، طرح پرداخت و بازدید خصوصی با تیم ما تماس بگیرید.`
    return [p1, p2]
  }
  if (lang === 'ar') {
    const p1 = `${isStudio ? 'استوديو' : `${word} بـ ${n(beds)} غرف`}${sqm ? ` بمساحة ${n(sqm)} م²` : ''} ضمن مشروع ${p.name}، ${area}${city ? `، ${city}` : ''}.${view ? ` يطل على ${view}.` : ''}`
    const p2 = `مُتاح بنظام التملّك الحر بسعر ${fmtOmr(price, lang)}${pps ? `（حوالي ${fmtOmr(Math.round(pps), lang)} للمتر）` : ''}.${dev ? ` بتطوير ${dev}.` : ''}${u.floor_label ? ` في ${u.floor_label}.` : ''} تواصل مع فريقنا للمخطط وخطة السداد ومعاينة خاصة.`
    return [p1, p2]
  }
  if (lang === 'ru') {
    const p1 = `${isStudio ? 'Студия' : `${word.toLowerCase()} с ${n(beds)} спальнями`}${sqm ? ` площадью ${n(sqm)} м²` : ''} в проекте ${p.name}, ${area}${city ? `, ${city}` : ''}.${view ? ` Вид на ${String(view).toLowerCase()}.` : ''}`
    const p2 = `Продаётся во фрихолд по цене ${fmtOmr(price, lang)}${pps ? ` (около ${fmtOmr(Math.round(pps), lang)} за м²)` : ''}.${dev ? ` Застройщик — ${dev}.` : ''}${u.floor_label ? ` Этаж: ${u.floor_label}.` : ''} Запросите планировку, план оплаты и частный показ у нашей команды.`
    return [p1, p2]
  }
  const p1 = `This ${isStudio ? 'studio' : `${beds}-bedroom ${word.toLowerCase()}`}${sqm ? ` offers ${n(sqm)} m² of space` : ''} within ${p.name}, one of ${area}'s${city ? ` ${city}` : ''} established addresses.${view ? ` The home looks out over ${String(view).toLowerCase()} views.` : ''}`
  const p2 = `It is offered freehold and priced at ${fmtOmr(price, lang)}${pps ? ` (about ${fmtOmr(Math.round(pps), lang)} per m²)` : ''}.${dev ? ` Developed by ${dev}.` : ''}${u.floor_label ? ` Set on the ${u.floor_label}.` : ''} Ask our team for the full floor plan, payment plan and a private viewing.`
  return [p1, p2]
}

// Crypto equivalents (approximate, for display only — like the reference).
const RATES = { btc: 90000, eth: 3000 } // USD per coin (approx)
function cryptoFor(priceOmr) {
  const usd = priceOmr * 2.6
  return {
    btc: (usd / RATES.btc).toLocaleString('en-US', { maximumFractionDigits: 2 }),
    eth: (usd / RATES.eth).toLocaleString('en-US', { maximumFractionDigits: 0 }),
    usdt: usd.toLocaleString('en-US', { maximumFractionDigits: 0 }),
  }
}

function coverFor(project, unitId) {
  const gal = galleryFor(slugify(project?.name || ''))
  if (gal.length) return gal[hashId(unitId) % gal.length]
  return POOL[hashId(unitId) % POOL.length]
}

function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ color: FAINT, fontFamily: FONT, fontSize: 13, marginBottom: 4 }}>{label}</div>
      <div style={{ color: INK, fontFamily: FONT, fontSize: 16.5, fontWeight: 600 }}>{value}</div>
    </div>
  )
}

// compact recommended card
function MiniCard({ item, t, lang }) {
  const { unit, project } = item
  const type = typeGroup(unit.unit_type)
  const title = unitTitle(unit.bedrooms, type, lang)
  const area = [project.area?.name || project.location, project.area?.city].filter(Boolean).join(', ')
  const [err, setErr] = useState(false)
  const src = err ? POOL[hashId(unit.id) % POOL.length] : coverFor(project, unit.id)
  return (
    <LocalizedLink to={`/property/${unit.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{ background: PAPER, border: `1px solid ${LINE}`, overflow: 'hidden', height: '100%', transition: 'box-shadow .2s, border-color .2s' }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(40,34,20,.1)'; e.currentTarget.style.borderColor = LINE_2 }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = LINE }}>
        <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#eee' }}>
          <img src={src} alt={title} loading="lazy" onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ padding: '13px 14px 15px' }}>
          <div style={{ color: OLIVE, fontFamily: FONT, fontWeight: 700, fontSize: 16 }}>{unit.price_omr > 0 ? fmtOmr(unit.price_omr, lang) : '—'}</div>
          <div style={{ color: INK, fontFamily: FONT, fontSize: 14.5, fontWeight: 600, marginTop: 4 }}>{title}</div>
          <div style={{ color: FAINT, fontFamily: FONT, fontSize: 12.5, marginTop: 2 }}>{area}</div>
        </div>
      </article>
    </LocalizedLink>
  )
}

export default function PropertyPage() {
  const { id } = useParams()
  const { lang } = useI18n()
  const t = STR[lang] || STR.en
  const rtl = lang === 'fa' || lang === 'ar'
  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  useEffect(() => {
    let cancelled = false
    window.scrollTo?.(0, 0)
    Promise.all([fetchProjects(), fetchAllUnits()])
      .then(([p, u]) => { if (!cancelled) { setProjects(p || []); setUnits(u || []) } })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const projById = useMemo(() => { const m = {}; for (const p of projects) m[p.id] = p; return m }, [projects])
  const unit = useMemo(() => units.find((u) => String(u.id) === String(id)) || null, [units, id])
  const project = unit ? projById[unit.project_id] : null
  const details = useMemo(() => (project ? getProjectDetails(project.name, lang) : null), [project, lang])

  const recommended = useMemo(() => {
    if (!unit || !project) return []
    const areaName = project.area?.name || project.location
    const type = typeGroup(unit.unit_type)
    const scored = units
      .filter((u) => u.id !== unit.id && Number(u.price_omr) > 0 && projById[u.project_id])
      .map((u) => {
        const p = projById[u.project_id]
        let s = 0
        if ((p.area?.name || p.location) === areaName) s += 2
        if (typeGroup(u.unit_type) === type) s += 1
        s -= Math.min(2, Math.abs(Number(u.price_omr) - Number(unit.price_omr)) / Math.max(1, Number(unit.price_omr)))
        return { unit: u, project: p, s }
      })
      .sort((a, b) => b.s - a.s)
    // de-dupe by project+type+beds+price so we don't show clones
    const seen = new Set(); const out = []
    for (const it of scored) {
      const k = `${it.unit.project_id}|${typeGroup(it.unit.unit_type)}|${it.unit.bedrooms}|${Math.round(it.unit.price_omr)}`
      if (seen.has(k)) continue
      seen.add(k); out.push(it)
      if (out.length >= 4) break
    }
    return out
  }, [units, projById, unit, project])

  if (loading) {
    return <main style={{ background: PAPER, minHeight: '100vh' }}><div style={{ maxWidth: 1180, margin: '0 auto', padding: '130px 20px', fontFamily: FONT, color: FAINT }}>…</div></main>
  }
  if (!unit || !project) {
    return (
      <main style={{ background: PAPER, minHeight: '100vh' }} dir={rtl ? 'rtl' : 'ltr'}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '150px 20px', textAlign: 'center', fontFamily: FONT }}>
          <p style={{ color: INK, fontSize: 18, marginBottom: 18 }}>{t.notFound}</p>
          <LocalizedLink to="/project" style={{ color: OLIVE, fontFamily: FONT, fontWeight: 600, textDecoration: 'none' }}>← {t.backToSearch}</LocalizedLink>
        </div>
      </main>
    )
  }

  const type = typeGroup(unit.unit_type)
  const typeWord = (TYPE_WORDS[lang] || TYPE_WORDS.en)[type] || type
  const title = unitTitle(unit.bedrooms, type, lang)
  const area = [project.area?.name || project.location, project.area?.city].filter(Boolean).join(', ')
  const sqm = Math.round(Number(unit.total_area_sqm || unit.internal_area_sqm || 0))
  const beds = unit.bedrooms
  const gallery = galleryFor(slugify(project.name))
  const photos = gallery.length ? gallery : POOL
  const mosaic = (photos.length >= 5 ? photos : [...photos, ...POOL]).slice(0, 5)
  const paras = describe(unit, project, lang)
  const crypto = unit.price_omr > 0 ? cryptoFor(Number(unit.price_omr)) : null
  const hasCoords = project.latitude != null && project.longitude != null
  const mapSrc = hasCoords && MAPBOX_TOKEN
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+8c8d25(${project.longitude},${project.latitude})/${project.longitude},${project.latitude},13,0/1200x420@2x?access_token=${MAPBOX_TOKEN}`
    : null
  const inquiryTo = `/buy/${slugify(project.name)}?unit=${unit.id}`

  const metaCells = [
    { label: t.propertyType, value: typeWord },
    { label: t.bedrooms, value: beds === 0 || beds == null ? t.studio : localizeDigits(beds, lang) },
    { label: t.size, value: sqm ? `${localizeDigits(sqm, lang)} m²` : '—' },
    { label: t.ref, value: `IRF-${unit.id}` },
  ]
  const keyCells = [
    unit.internal_area_sqm ? { label: t.internalArea, value: `${localizeDigits(Math.round(unit.internal_area_sqm), lang)} m²` } : null,
    unit.total_area_sqm ? { label: t.totalArea, value: `${localizeDigits(Math.round(unit.total_area_sqm), lang)} m²` } : null,
    unit.total_garden_sqm ? { label: t.gardenArea, value: `${localizeDigits(Math.round(unit.total_garden_sqm), lang)} m²` } : null,
    unit.view ? { label: t.view, value: unit.view } : null,
    unit.floor_label ? { label: t.floor, value: unit.floor_label } : null,
    unit.price_per_sqm_omr ? { label: t.perSqm, value: fmtOmr(Math.round(unit.price_per_sqm_omr), lang) } : null,
    project.developer?.name ? { label: t.developer, value: project.developer.name } : null,
  ].filter(Boolean)

  return (
    <main style={{ background: PAPER, minHeight: '100vh', color: INK }} dir={rtl ? 'rtl' : 'ltr'}>
      <style>{GALLERY_CSS}</style>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '104px 20px 80px' }}>
        {/* breadcrumb */}
        <nav style={{ color: FAINT, fontFamily: FONT, fontSize: 12.5, marginBottom: 20 }}>
          <LocalizedLink to="/" style={{ color: FAINT, textDecoration: 'none' }}>{t.crumbHome}</LocalizedLink>
          <span style={{ margin: '0 8px' }}>›</span>
          <LocalizedLink to="/project" style={{ color: FAINT, textDecoration: 'none' }}>{t.crumbSearch}</LocalizedLink>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: SUB }}>{title}</span>
        </nav>

        {/* SALE badge */}
        <span style={{ display: 'inline-block', background: INK, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', marginBottom: 18 }}>{t.sale}</span>

        {/* title + price */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
          <h1 style={{ margin: 0, fontFamily: FONT, fontWeight: 600, fontSize: 'clamp(26px, 3.6vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.01em', maxWidth: 720 }}>
            {title} <span style={{ color: SUB, fontWeight: 400 }}>· {project.name}</span>
          </h1>
          <div style={{ textAlign: rtl ? 'left' : 'right', minWidth: 220 }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(24px, 3vw, 34px)', color: INK, whiteSpace: 'nowrap' }}>
              {unit.price_omr > 0 ? fmtOmr(unit.price_omr, lang) : '—'}
            </div>
            {crypto && (
              <div style={{ display: 'flex', gap: 14, justifyContent: rtl ? 'flex-start' : 'flex-end', flexWrap: 'wrap', marginTop: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: SUB, fontFamily: FONT, fontSize: 12.5, fontWeight: 600 }}><b style={{ color: '#f7931a' }}>₿</b> {crypto.btc} BTC</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: SUB, fontFamily: FONT, fontSize: 12.5, fontWeight: 600 }}><b style={{ color: '#627eea' }}>Ξ</b> {crypto.eth} ETH</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: SUB, fontFamily: FONT, fontSize: 12.5, fontWeight: 600 }}><b style={{ color: '#26a17b' }}>₮</b> {crypto.usdt} USDT</span>
              </div>
            )}
          </div>
        </div>

        {/* location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: SUB, fontFamily: FONT, fontSize: 15, marginTop: 14 }}>
          <PlaceRoundedIcon sx={{ fontSize: 19, color: FAINT }} /> {area}
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${LINE}`, margin: '26px 0' }} />

        {/* meta grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 22 }}>
          {metaCells.map((c) => <Stat key={c.label} label={c.label} value={c.value} />)}
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${LINE}`, margin: '26px 0' }} />

        {/* ── gallery mosaic (hero) ── */}
        <section>
          {!showAllPhotos ? (
            <div className="pfp-gallery">
              {mosaic.map((src, i) => (
                <div key={i} className={`g g${i}`}>
                  <img src={src} alt={`${title} ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
                  {i === 4 && photos.length > 5 && (
                    <button type="button" className="pfp-viewall" onClick={() => setShowAllPhotos(true)}>
                      <PhotoLibraryRoundedIcon sx={{ fontSize: 18 }} /> {t.showAll} ({localizeDigits(photos.length, lang)})
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
              {photos.map((src, i) => (
                <div key={i} style={{ aspectRatio: '4 / 3', overflow: 'hidden', background: '#eee' }}>
                  <img src={src} alt={`${title} ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
            {photos.length > 5 && (
              <button type="button" onClick={() => setShowAllPhotos((v) => !v)} style={ghostBtn}>
                <PhotoLibraryRoundedIcon sx={{ fontSize: 18 }} /> {showAllPhotos ? t.showLess : `${t.showAll} (${localizeDigits(photos.length, lang)})`}
              </button>
            )}
            <LocalizedLink to={inquiryTo} style={{ ...ghostBtn, textDecoration: 'none' }}>
              <DescriptionOutlinedIcon sx={{ fontSize: 18 }} /> {t.floorPlan}
            </LocalizedLink>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: `1px solid ${LINE}`, margin: '30px 0' }} />

        {/* about */}
        <section>
          <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, margin: '0 0 14px' }}>{t.about}</h2>
          <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.75, color: SUB, margin: '0 0 14px' }}>{paras[0]}</p>
          {expanded && <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.75, color: SUB, margin: '0 0 14px' }}>{paras[1]}</p>}
          <button type="button" onClick={() => setExpanded((v) => !v)} style={{ background: 'none', border: 'none', color: INK, fontFamily: FONT, fontSize: 15, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer', padding: 0 }}>
            {expanded ? t.showLess : t.showMore}
          </button>
        </section>

        {/* about the development (project blurb + sections) */}
        {details && (details.tagline || details.description) && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, margin: '0 0 12px' }}>
              {t.aboutDev} <span style={{ color: SUB, fontWeight: 400 }}>· {project.name}</span>
            </h2>
            {details.tagline && <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: OLIVE, margin: '0 0 12px' }}>{details.tagline}</p>}
            {details.description && <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.75, color: SUB, margin: 0 }}>{details.description}</p>}
            {Array.isArray(details.sections) && details.sections.map((s, i) => (
              <div key={i} style={{ marginTop: 18 }}>
                <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, margin: '0 0 6px', color: INK }}>{s.title}</h3>
                <p style={{ fontFamily: FONT, fontSize: 15.5, lineHeight: 1.7, color: SUB, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </section>
        )}

        {/* features & amenities */}
        {details?.features?.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, margin: '0 0 18px' }}>{FEATURES_HEADING[lang] || FEATURES_HEADING.en}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px 20px' }}>
              {details.features.map((key) => {
                const meta = FEATURE_META[key]
                if (!meta) return null
                const Icon = meta.icon
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon sx={{ fontSize: 22, color: OLIVE }} />
                    <span style={{ fontFamily: FONT, fontSize: 15, color: INK }}>{meta[lang] || meta.en}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* key details */}
        {keyCells.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, margin: '0 0 18px' }}>{t.keyDetails}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px 24px', border: `1px solid ${LINE}`, padding: '22px 24px' }}>
              {keyCells.map((c) => (
                <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: FAINT, fontFamily: FONT, fontSize: 13 }}>{c.label}</span>
                  <span style={{ color: INK, fontFamily: FONT, fontSize: 15.5, fontWeight: 600, textTransform: 'capitalize' }}>{c.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* map */}
        {mapSrc && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, margin: '0 0 16px' }}>{t.mapTitle}</h2>
            <a href={`https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', border: `1px solid ${LINE}`, overflow: 'hidden' }}>
              <img src={mapSrc} alt={`Map of ${project.name}`} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: SUB, fontFamily: FONT, fontSize: 14, marginTop: 10 }}>
              <PlaceRoundedIcon sx={{ fontSize: 18, color: FAINT }} /> {area}
            </div>
          </section>
        )}

        {/* contact CTA */}
        <section style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <LocalizedLink to={inquiryTo} style={{ ...primaryBtn, textDecoration: 'none' }}>
            {t.contact} <ArrowForwardRoundedIcon sx={{ fontSize: 18, transform: rtl ? 'scaleX(-1)' : 'none' }} />
          </LocalizedLink>
        </section>

        {/* recommended */}
        {recommended.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, margin: '0 0 18px' }}>{t.recommended}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
              {recommended.map((it) => <MiniCard key={it.unit.id} item={it} t={t} lang={lang} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

const ghostBtn = { display: 'inline-flex', alignItems: 'center', gap: 8, height: 46, padding: '0 20px', background: 'transparent', color: INK, border: `1px solid ${LINE_2}`, fontFamily: FONT, fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }
const primaryBtn = { display: 'inline-flex', alignItems: 'center', gap: 8, height: 50, padding: '0 28px', background: INK, color: '#fff', border: 'none', fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: 'pointer' }
