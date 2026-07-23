/**
 * SearchPage — the site's unit-level property search engine (route `/project`).
 *
 * Phase-3 redesign: editorial "Le Figaro Properties" layout — a horizontal
 * filter bar of label/value chips, breadcrumb + sort, and wide horizontal
 * listing cards (image left, details right → stacked on mobile). Deliberately
 * LIGHT-MODE on a milky-cream paper background with SHARP corners (no
 * border-radius) and warm hairline rules, per the client's reference.
 *
 * Data: fetchProjects() + fetchAllUnits() once, joined + filtered client-side.
 * Filters live in the URL (?q,?type,?beds,?price,?area,?sort) → shareable and
 * prerenderable. Near-identical units collapse into one card (count badge).
 *
 * Card imagery rotates through each project's OWN gallery (galleryFor) so
 * different units of the same project (e.g. Wadi Zaha) show different photos
 * instead of the single shared cover; projects with no gallery fall back to a
 * deterministic pick from a stock pool (varied per unit id).
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
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { galleryFor } from '../projectGallery.js'
import { slugify } from './BuyPage.jsx'
import { LocalizedLink } from '../lib/localize.js'
import { FONT, OLIVE_BRIGHT } from '../components/invest/ui.jsx'

// ── light "milky paper" palette (sharp corners, warm hairlines) ───────────
const PAPER = '#F6F1E7'      // page background (milky cream)
const SURFACE = '#FFFFFF'    // cards + filter surfaces
const INK = '#1c1b17'        // primary text / primary button
const SUB = '#5f5b50'        // secondary text
const FAINT = '#948f7e'      // muted labels
const LINE = '#E5DDCC'       // hairline rule
const LINE_2 = '#D2C7AF'     // stronger rule / hover
const CHIP = '#F1E8D3'       // filter chip fill (soft cream/gold)
const CHIP_LINE = '#E3D4AC'  // filter chip border
const ACCENT = OLIVE_BRIGHT  // #8c8d25 — price / accents

// Stock fallback pool (real files under public/images/blog) — used only when a
// project has no bundled gallery. Varied per unit so cards never look cloned.
const POOL = [
  ...Array.from({ length: 13 }, (_, i) => `/images/blog/muscat-${i + 1}.jpg`),
  ...Array.from({ length: 7 }, (_, i) => `/images/blog/sifah-${i + 1}.jpg`),
  ...Array.from({ length: 12 }, (_, i) => `/images/blog/salalah-${i + 1}.jpg`),
]
const hashId = (id) => {
  let x = 0
  const s = String(id)
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0
  return x
}
const poolFor = (id) => POOL[hashId(id) % POOL.length]

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

// Filter *values* stay language-neutral; display labels are localised below.
const TYPE_OPTIONS = ['Any', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Studio', 'Chalet']
const BEDS_VALUES = ['any', '0', '1', '2', '3', '4']
const PRICE_VALUES = [
  { v: 'any', max: Infinity }, { v: '100', max: 100000 }, { v: '200', max: 200000 },
  { v: '400', max: 400000 }, { v: '1000', max: 1000000 },
]
const SORT_VALUES = ['price_asc', 'price_desc', 'area_desc']

// Index-aligned localised labels (order matches the *_OPTIONS/VALUES arrays).
const LABELS = {
  en: {
    type: ['Any type', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Studio', 'Chalet'],
    beds: ['Any beds', 'Studio', '1 bed', '2 beds', '3 beds', '4+ beds'],
    price: ['Any price', 'Under OMR 100k', 'Under OMR 200k', 'Under OMR 400k', 'Under OMR 1M'],
    sort: ['Price (Low to High)', 'Price (High to Low)', 'Largest area'],
    anyArea: 'Any area',
  },
  ru: {
    type: ['Любой тип', 'Квартира', 'Вилла', 'Пентхаус', 'Таунхаус', 'Студия', 'Шале'],
    beds: ['Любые спальни', 'Студия', '1 спальня', '2 спальни', '3 спальни', '4+ спальни'],
    price: ['Любая цена', 'До 100 тыс. OMR', 'До 200 тыс. OMR', 'До 400 тыс. OMR', 'До 1 млн OMR'],
    sort: ['Цена (по возрастанию)', 'Цена (по убыванию)', 'Наибольшая площадь'],
    anyArea: 'Любой район',
  },
  ar: {
    type: ['كل الأنواع', 'شقة', 'فيلا', 'بنتهاوس', 'تاون هاوس', 'استوديو', 'شاليه'],
    beds: ['كل الغرف', 'استوديو', 'غرفة واحدة', 'غرفتان', '3 غرف', '4+ غرف'],
    price: ['أي سعر', 'أقل من 100 ألف ر.ع', 'أقل من 200 ألف ر.ع', 'أقل من 400 ألف ر.ع', 'أقل من مليون ر.ع'],
    sort: ['السعر (من الأقل)', 'السعر (من الأعلى)', 'الأكبر مساحة'],
    anyArea: 'كل المناطق',
  },
  fa: {
    type: ['همه انواع', 'آپارتمان', 'ویلا', 'پنت‌هاوس', 'تاون‌هاوس', 'استودیو', 'شاله'],
    beds: ['همه خواب‌ها', 'استودیو', '۱ خوابه', '۲ خوابه', '۳ خوابه', '۴+ خوابه'],
    price: ['هر قیمتی', 'زیر ۱۰۰ هزار ریال', 'زیر ۲۰۰ هزار ریال', 'زیر ۴۰۰ هزار ریال', 'زیر ۱ میلیون ریال'],
    sort: ['قیمت (کم به زیاد)', 'قیمت (زیاد به کم)', 'بزرگ‌ترین متراژ'],
    anyArea: 'همه مناطق',
  },
}

// Chip micro-labels (the small uppercase caption above each filter value).
const CHIP_LABELS = {
  en: { location: 'Location', type: 'Property type', beds: 'Bedrooms', price: 'Budget' },
  ru: { location: 'Район', type: 'Тип', beds: 'Спальни', price: 'Бюджет' },
  ar: { location: 'المنطقة', type: 'النوع', beds: 'الغرف', price: 'الميزانية' },
  fa: { location: 'منطقه', type: 'نوع ملک', beds: 'خواب', price: 'بودجه' },
}

const STR = {
  en: { crumbHome: 'Home', crumbSearch: 'Properties', heading: 'Properties for Sale in Oman', placeholder: 'Search by area, project or city…', search: 'Search', count: '{n} properties', sortBy: 'Sort by', empty: 'No properties match your filters.', reset: 'Clear filters', view: 'View the listing', contact: 'Contact', from: 'From', freehold: 'Freehold', similar: '{n} similar units available', photos: '{n} photos', by: 'By Irfan Investment' },
  ru: { crumbHome: 'Главная', crumbSearch: 'Недвижимость', heading: 'Недвижимость на продажу в Омане', placeholder: 'Поиск по району, проекту или городу…', search: 'Поиск', count: '{n} объектов', sortBy: 'Сортировка', empty: 'Ничего не найдено по фильтрам.', reset: 'Сбросить фильтры', view: 'Смотреть объект', contact: 'Связаться', from: 'От', freehold: 'Фрихолд', similar: 'Доступно похожих объектов: {n}', photos: '{n} фото', by: 'Irfan Investment' },
  ar: { crumbHome: 'الرئيسية', crumbSearch: 'العقارات', heading: 'عقارات للبيع في عُمان', placeholder: 'ابحث حسب المنطقة أو المشروع أو المدينة…', search: 'بحث', count: '{n} عقار', sortBy: 'ترتيب حسب', empty: 'لا توجد عقارات مطابقة.', reset: 'مسح الفلاتر', view: 'عرض العقار', contact: 'تواصل', from: 'من', freehold: 'تملّك حر', similar: '{n} وحدات مماثلة متاحة', photos: '{n} صور', by: 'بواسطة عرفان للاستثمار' },
  fa: { crumbHome: 'خانه', crumbSearch: 'املاک', heading: 'املاک برای فروش در عمان', placeholder: 'جستجو بر اساس منطقه، پروژه یا شهر…', search: 'جستجو', count: '{n} ملک', sortBy: 'مرتب‌سازی', empty: 'ملکی با این فیلترها پیدا نشد.', reset: 'پاک کردن فیلترها', view: 'مشاهدهٔ ملک', contact: 'تماس', from: 'از', freehold: 'فری‌هولد', similar: '{n} واحد مشابه موجود است', photos: '{n} عکس', by: 'توسط عرفان اینوست' },
}

// Localised unit-type words (project names themselves stay English brand nouns).
const TYPE_WORDS = {
  en: { Apartment: 'Apartment', Villa: 'Villa', Penthouse: 'Penthouse', Townhouse: 'Townhouse', Studio: 'Studio', Chalet: 'Chalet', 'Farm House': 'Farm House' },
  ru: { Apartment: 'Квартира', Villa: 'Вилла', Penthouse: 'Пентхаус', Townhouse: 'Таунхаус', Studio: 'Студия', Chalet: 'Шале', 'Farm House': 'Фермерский дом' },
  ar: { Apartment: 'شقة', Villa: 'فيلا', Penthouse: 'بنتهاوس', Townhouse: 'تاون هاوس', Studio: 'استوديو', Chalet: 'شاليه', 'Farm House': 'بيت ريفي' },
  fa: { Apartment: 'آپارتمان', Villa: 'ویلا', Penthouse: 'پنت‌هاوس', Townhouse: 'تاون‌هاوس', Studio: 'استودیو', Chalet: 'شاله', 'Farm House': 'خانه مزرعه' },
}
const STUDIO_TITLE = { en: 'Studio Apartment', ru: 'Квартира-студия', ar: 'شقة استوديو', fa: 'آپارتمان استودیو' }

// availability_status DB values are English (available/sold/reserved…) → map.
const AVAIL = {
  en: { available: 'Available', sold: 'Sold', 'sold out': 'Sold out', reserved: 'Reserved', 'under offer': 'Under offer' },
  ru: { available: 'Доступно', sold: 'Продано', 'sold out': 'Продано', reserved: 'Забронировано', 'under offer': 'На рассмотрении' },
  ar: { available: 'متاح', sold: 'مباع', 'sold out': 'نفدت الكمية', reserved: 'محجوز', 'under offer': 'قيد التفاوض' },
  fa: { available: 'موجود', sold: 'فروخته‌شده', 'sold out': 'تمام‌شده', reserved: 'رزرو شده', 'under offer': 'در حال مذاکره' },
}

// Localise Western digits to Persian / Arabic-Indic numerals for fa/ar.
const localizeDigits = (val, lang) => {
  const s = String(val)
  if (lang === 'fa') return s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
  if (lang === 'ar') return s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])
  return s
}

// "3-Bed Villa" / "ویلا ۳ خوابه" / "فيلا ٣ غرف" / "Вилла, 3 спальни"
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

const localizeStatus = (status, lang) => {
  const key = String(status || '').toLowerCase().trim()
  return (AVAIL[lang] || AVAIL.en)[key] || status
}

const fmtOmr = (n, lang) => localizeDigits('OMR ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n), lang)

// Component-scoped stylesheet — keeps the responsive rules (mobile stacking,
// chip scroll) that inline styles can't express. Sharp corners throughout.
const CSS = `
.pfx-page{background:${PAPER};color:${INK};min-height:100vh;font-family:${FONT}}
.pfx-wrap{max-width:1180px;margin:0 auto;padding:0 20px}
.pfx-bar{display:flex;gap:10px;align-items:stretch;flex-wrap:wrap}
.pfx-search{flex:1 1 260px;display:flex;align-items:center;gap:10px;background:${SURFACE};border:1px solid ${LINE};padding:0 16px;height:62px}
.pfx-search input{flex:1;min-width:0;background:transparent;border:none;outline:none;color:${INK};font-size:15px;font-family:${FONT}}
.pfx-search input::placeholder{color:${FAINT}}
.pfx-chips{display:flex;gap:10px;flex:2 1 460px;min-width:0}
.pfx-chip{position:relative;flex:1 1 0;min-width:128px;background:${CHIP};border:1px solid ${CHIP_LINE};padding:9px 14px;display:flex;flex-direction:column;justify-content:center;gap:2px;cursor:pointer}
.pfx-chip-label{font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:${SUB};font-weight:700;line-height:1}
.pfx-chip-val{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:14.5px;color:${INK};font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pfx-chip select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;font-size:16px}
.pfx-btn{height:62px;padding:0 32px;background:${INK};color:${PAPER};border:none;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.02em;font-family:${FONT};transition:background .2s}
.pfx-btn:hover{background:#000}
.pfx-card{display:flex;background:${SURFACE};border:1px solid ${LINE};overflow:hidden;transition:box-shadow .25s,border-color .25s}
.pfx-card:hover{border-color:${LINE_2};box-shadow:0 12px 34px rgba(43,36,18,.09)}
.pfx-media{position:relative;flex:0 0 42%;max-width:430px;aspect-ratio:4/3;background:#efeadf;overflow:hidden;display:block}
.pfx-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
.pfx-card:hover .pfx-media img{transform:scale(1.04)}
.pfx-body{flex:1 1 auto;padding:22px 26px 20px;display:flex;flex-direction:column;min-width:0}
.pfx-cta{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:46px;padding:0 22px;font-weight:700;font-size:14px;cursor:pointer;text-decoration:none;font-family:${FONT};transition:background .2s,color .2s,border-color .2s}
.pfx-cta-primary{background:${INK};color:${PAPER};border:1px solid ${INK}}
.pfx-cta-primary:hover{background:#000}
.pfx-cta-ghost{background:transparent;color:${INK};border:1px solid ${LINE_2}}
.pfx-cta-ghost:hover{border-color:${INK}}
.pfx-sortsel{position:relative;display:inline-flex;align-items:center;gap:6px;background:${SURFACE};border:1px solid ${LINE};padding:9px 12px;cursor:pointer}
.pfx-sortsel select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px}
@media(max-width:768px){
  .pfx-wrap{padding:0 14px}
  .pfx-bar{flex-direction:column}
  .pfx-search{flex:0 0 auto}
  .pfx-chips{flex:0 0 auto;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .pfx-chips::-webkit-scrollbar{display:none}
  .pfx-chip{min-width:46%;flex:0 0 auto}
  .pfx-btn{width:100%}
  .pfx-card{flex-direction:column}
  .pfx-media{flex-basis:auto;max-width:none;width:100%;aspect-ratio:16/10}
  .pfx-body{padding:18px 18px 18px}
}
`

// ── one listing card (image left, details right → stacked on mobile) ──────
function UnitCard({ item, t, rtl, lang }) {
  const { unit, project, count = 1, cover, photoCount } = item
  const beds = unit.bedrooms
  const type = typeGroup(unit.unit_type)
  const title = unitTitle(beds, type, lang)
  const typeWord = (TYPE_WORDS[lang] || TYPE_WORDS.en)[type] || type
  const area = [project.area?.name || project.location, project.area?.city].filter(Boolean).join(', ')
  const sqm = unit.total_area_sqm || unit.internal_area_sqm
  const to = `/buy/${slugify(project.name)}?unit=${unit.id}`
  const [imgErr, setImgErr] = useState(false)
  const src = imgErr || !cover ? poolFor(unit.id) : cover

  return (
    <article className="pfx-card" dir={rtl ? 'rtl' : 'ltr'}>
      <LocalizedLink to={to} className="pfx-media" aria-label={`${title} · ${project.name}`}>
        <img src={src} alt={`${title} in ${area}`} loading="lazy" onError={() => setImgErr(true)} />
        {/* FREEHOLD tag */}
        <span style={{ position: 'absolute', top: 12, insetInlineStart: 12, background: 'rgba(28,27,23,0.82)', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.09em', padding: '5px 10px', textTransform: 'uppercase' }}>
          {t.freehold}
        </span>
        {/* photo count */}
        {photoCount > 1 && (
          <span style={{ position: 'absolute', bottom: 12, insetInlineEnd: 12, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(28,27,23,0.7)', color: '#fff', fontFamily: FONT, fontSize: 11.5, fontWeight: 600, padding: '4px 9px' }}>
            <PhotoLibraryRoundedIcon sx={{ fontSize: 14 }} /> {localizeDigits(photoCount, lang)}
          </span>
        )}
        {/* similar-count badge */}
        {count > 1 && (
          <span style={{ position: 'absolute', bottom: 12, insetInlineStart: 12, background: 'rgba(140,141,37,0.92)', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 11.5, padding: '4px 9px', letterSpacing: '0.02em' }}>
            ×{localizeDigits(count, lang)}
          </span>
        )}
      </LocalizedLink>

      <div className="pfx-body">
        {/* eyebrow: area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: FAINT, fontFamily: FONT, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
          <PlaceRoundedIcon sx={{ fontSize: 14 }} /> {area}
        </div>

        {/* title */}
        <LocalizedLink to={to} style={{ textDecoration: 'none' }}>
          <h3 style={{ margin: '6px 0 0', fontFamily: FONT, fontWeight: 600, fontSize: 21, color: INK, lineHeight: 1.22, letterSpacing: '-0.01em' }}>
            {title} <span style={{ color: SUB, fontWeight: 400 }}>· {project.name}</span>
          </h3>
        </LocalizedLink>

        {/* detail line: view / floor when present */}
        {(unit.view || unit.floor_label) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7, color: SUB, fontFamily: FONT, fontSize: 13.5 }}>
            {unit.view && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><VisibilityOutlinedIcon sx={{ fontSize: 15, color: FAINT }} /> {unit.view}</span>}
            {unit.view && unit.floor_label && <span style={{ color: LINE_2 }}>·</span>}
            {unit.floor_label && <span>{unit.floor_label}</span>}
          </div>
        )}

        {/* price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
          {count > 1 && <span style={{ color: FAINT, fontFamily: FONT, fontSize: 13, fontWeight: 500 }}>{t.from}</span>}
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 25, color: ACCENT, letterSpacing: '-0.01em' }}>
            {unit.price_omr > 0 ? fmtOmr(unit.price_omr, lang) : '—'}
          </span>
          {unit.price_per_sqm_omr > 0 && (
            <span style={{ color: FAINT, fontFamily: FONT, fontSize: 12.5 }}>
              · {fmtOmr(Math.round(unit.price_per_sqm_omr), lang)}/m²
            </span>
          )}
        </div>
        {count > 1 && (
          <div style={{ color: ACCENT, fontFamily: FONT, fontSize: 12.5, marginTop: 3, fontWeight: 600 }}>
            {t.similar.replace('{n}', localizeDigits(count, lang))}
          </div>
        )}

        {/* spec rule */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 14, paddingTop: 13, borderTop: `1px solid ${LINE}`, color: INK, fontFamily: FONT, fontSize: 13.5 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><KingBedRoundedIcon sx={{ fontSize: 17, color: FAINT }} /> {beds === 0 || beds == null ? (TYPE_WORDS[lang] || TYPE_WORDS.en).Studio : localizeDigits(beds, lang)}</span>
          {sqm ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><SquareFootRoundedIcon sx={{ fontSize: 17, color: FAINT }} /> {localizeDigits(Math.round(sqm), lang)} m²</span> : null}
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ApartmentRoundedIcon sx={{ fontSize: 17, color: FAINT }} /> {typeWord}</span>
        </div>

        {/* footer: ref/agency + CTAs */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 'auto', paddingTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: SUB, fontFamily: FONT, fontSize: 12 }}>{t.by}</span>
            <span style={{ color: FAINT, fontFamily: FONT, fontSize: 11, letterSpacing: '0.05em' }}>Ref: IRF-{unit.id}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <LocalizedLink to={to} className="pfx-cta pfx-cta-ghost">{t.contact}</LocalizedLink>
            <LocalizedLink to={to} className="pfx-cta pfx-cta-primary">
              {t.view} <ArrowForwardRoundedIcon sx={{ fontSize: 17, transform: rtl ? 'scaleX(-1)' : 'none' }} />
            </LocalizedLink>
          </div>
        </div>
      </div>
    </article>
  )
}

// A label/value filter chip that overlays a real (transparent) <select>.
function FilterChip({ label, value, children }) {
  return (
    <label className="pfx-chip">
      <span className="pfx-chip-label">{label}</span>
      <span className="pfx-chip-val">
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <ExpandMoreRoundedIcon sx={{ fontSize: 18, color: SUB, flexShrink: 0 }} />
      </span>
      {children}
    </label>
  )
}

export default function SearchPage() {
  const { lang } = useI18n()
  const t = STR[lang] || STR.en
  const rtl = lang === 'fa' || lang === 'ar'
  const [params, setParams] = useSearchParams()

  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  const L = LABELS[lang] || LABELS.en
  const C = CHIP_LABELS[lang] || CHIP_LABELS.en
  const [q, setQ] = useState(params.get('q') || '')
  const type = params.get('type') || 'Any'
  const beds = params.get('beds') || 'any'
  const price = params.get('price') || 'any'
  const area = params.get('area') || 'any'
  const sort = params.get('sort') || 'price_asc'
  const committedQ = params.get('q') || ''

  useEffect(() => {
    // title/meta owned by seo.jsx (ROUTES['/project']); just load data here.
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
  }, [])

  const projById = useMemo(() => {
    const m = {}
    for (const p of projects) m[p.id] = p
    return m
  }, [projects])

  // Area options derived from projects that actually have priced units.
  const areaOptions = useMemo(() => {
    const withStock = new Set(units.filter((u) => Number(u.price_omr) > 0).map((u) => u.project_id))
    const names = new Set()
    for (const p of projects) {
      if (!withStock.has(p.id)) continue
      const name = p.area?.name || p.location
      if (name) names.add(name)
    }
    return [...names].sort()
  }, [projects, units])

  const setParam = (key, val, dflt) => {
    const next = new URLSearchParams(params)
    if (val == null || val === dflt) next.delete(key)
    else next.set(key, val)
    setParams(next, { replace: true })
  }

  const commitSearch = () => setParam('q', q.trim() || null, '')

  const results = useMemo(() => {
    const priceMax = PRICE_VALUES.find((o) => o.v === price)?.max ?? Infinity
    const needle = committedQ.trim().toLowerCase()
    const enriched = units
      .map((u) => ({ unit: u, project: projById[u.project_id] }))
      .filter((it) => it.project) // drop units whose project lacks coords/data
      .filter((it) => {
        const u = it.unit, p = it.project
        if (area !== 'any' && (p.area?.name || p.location) !== area) return false
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

    // Dedupe near-identical units into one card carrying a `count`.
    const groups = new Map()
    for (const it of enriched) {
      const u = it.unit
      const key = `${u.project_id}|${typeGroup(u.unit_type)}|${u.bedrooms ?? 0}|${Math.round(Number(u.price_omr))}`
      const g = groups.get(key)
      if (g) g.count += 1
      else groups.set(key, { ...it, count: 1 })
    }
    const grouped = [...groups.values()]
    grouped.sort((a, b) => {
      if (sort === 'price_desc') return (b.unit.price_omr || 0) - (a.unit.price_omr || 0)
      if (sort === 'area_desc') return (b.unit.total_area_sqm || 0) - (a.unit.total_area_sqm || 0)
      return (a.unit.price_omr || 0) - (b.unit.price_omr || 0)
    })

    // Assign each card an image, rotating through the project's OWN gallery so
    // sibling units don't clone the same cover; fall back to the stock pool.
    const seen = {}
    for (const g of grouped) {
      const slug = slugify(g.project.name)
      const gal = galleryFor(slug)
      const i = (seen[g.project.id] = (seen[g.project.id] ?? -1) + 1)
      g.cover = gal.length > 0 ? gal[i % gal.length] : null
      g.photoCount = gal.length
    }
    return grouped
  }, [units, projById, type, beds, price, area, sort, committedQ])

  const typeVal = L.type[TYPE_OPTIONS.indexOf(type)] || L.type[0]
  const bedsVal = L.beds[BEDS_VALUES.indexOf(beds)] || L.beds[0]
  const priceVal = L.price[PRICE_VALUES.findIndex((o) => o.v === price)] || L.price[0]
  const areaVal = area === 'any' ? L.anyArea : area

  return (
    <main className="pfx-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{CSS}</style>

      {/* ── heading + filter bar ── */}
      <section style={{ borderBottom: `1px solid ${LINE}`, padding: '104px 0 26px' }}>
        <div className="pfx-wrap">
          <h1 style={{ margin: '0 0 20px', fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(27px, 4vw, 44px)', letterSpacing: '-0.01em', color: INK }}>
            {t.heading}
          </h1>

          <div className="pfx-bar">
            <div className="pfx-search">
              <SearchRoundedIcon sx={{ fontSize: 21, color: FAINT }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitSearch() }}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
              />
            </div>

            <div className="pfx-chips">
              <FilterChip label={C.location} value={areaVal}>
                <select value={area} onChange={(e) => setParam('area', e.target.value, 'any')} aria-label={C.location}>
                  <option value="any">{L.anyArea}</option>
                  {areaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </FilterChip>
              <FilterChip label={C.type} value={typeVal}>
                <select value={type} onChange={(e) => setParam('type', e.target.value, 'Any')} aria-label={C.type}>
                  {TYPE_OPTIONS.map((o, i) => <option key={o} value={o}>{L.type[i]}</option>)}
                </select>
              </FilterChip>
              <FilterChip label={C.beds} value={bedsVal}>
                <select value={beds} onChange={(e) => setParam('beds', e.target.value, 'any')} aria-label={C.beds}>
                  {BEDS_VALUES.map((v, i) => <option key={v} value={v}>{L.beds[i]}</option>)}
                </select>
              </FilterChip>
              <FilterChip label={C.price} value={priceVal}>
                <select value={price} onChange={(e) => setParam('price', e.target.value, 'any')} aria-label={C.price}>
                  {PRICE_VALUES.map((o, i) => <option key={o.v} value={o.v}>{L.price[i]}</option>)}
                </select>
              </FilterChip>
            </div>

            <button type="button" className="pfx-btn" onClick={commitSearch}>
              <SearchRoundedIcon sx={{ fontSize: 19 }} /> {t.search}
            </button>
          </div>
        </div>
      </section>

      {/* ── breadcrumb + count + sort ── */}
      <section className="pfx-wrap" style={{ padding: '22px 20px 0' }}>
        <nav style={{ color: FAINT, fontFamily: FONT, fontSize: 12.5, marginBottom: 12, letterSpacing: '0.02em' }}>
          <LocalizedLink to="/" style={{ color: FAINT, textDecoration: 'none' }}>{t.crumbHome}</LocalizedLink>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: SUB }}>{t.crumbSearch}</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingBottom: 4 }}>
          <span style={{ fontFamily: FONT, fontSize: 15, color: INK, fontWeight: 600 }}>
            {loading ? '…' : t.count.replace('{n}', localizeDigits(results.length, lang))}
          </span>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: SUB, fontFamily: FONT, fontSize: 13 }}>
            {t.sortBy}
            <span className="pfx-sortsel">
              <span style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{L.sort[SORT_VALUES.indexOf(sort)] || L.sort[0]}</span>
              <ExpandMoreRoundedIcon sx={{ fontSize: 17, color: SUB }} />
              <select value={sort} onChange={(e) => setParam('sort', e.target.value, 'price_asc')} aria-label={t.sortBy}>
                {SORT_VALUES.map((v, i) => <option key={v} value={v}>{L.sort[i]}</option>)}
              </select>
            </span>
          </label>
        </div>
      </section>

      {/* ── listing cards ── */}
      <section className="pfx-wrap" style={{ padding: '18px 20px 88px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ background: SURFACE, border: `1px solid ${LINE}`, height: 230, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: SUB, fontFamily: FONT }}>
            <p style={{ fontSize: 16, marginBottom: 16 }}>{t.empty}</p>
            <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })}
              style={{ background: 'transparent', color: INK, border: `1px solid ${LINE_2}`, padding: '10px 20px', fontFamily: FONT, fontSize: 14, cursor: 'pointer' }}>
              {t.reset}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {results.map((item) => (
              <UnitCard key={item.unit.id} item={item} t={t} rtl={rtl} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
