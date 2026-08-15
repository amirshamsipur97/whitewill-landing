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
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import KingBedRoundedIcon from '@mui/icons-material/KingBedRounded'
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded'
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import { useI18n } from '../i18n.jsx'
import { fetchProjects, fetchAllUnits } from '../supabase'
import { galleryFor } from '../projectGallery.js'
import { slugify } from './BuyPage.jsx'
import { LocalizedLink } from '../lib/localize.js'
import QuickInquiryModal from '../components/QuickInquiryModal'
// mapbox-gl weighs 1.76 MB — never let it into this page's initial chunk.
const SearchMap = lazy(() => import('../components/SearchMap'))
import { PROJECT_SEO, projectFaqJsonLd } from '../projectSeoContent.mjs'
import { FONT, OLIVE_BRIGHT } from '../components/invest/ui.jsx'

// ── uniform dark palette (matches the hero; whole /project page is dark) ───
const PAPER = '#0b0b0c'      // page background (dark, matches hero)
const SURFACE = '#151517'    // cards + controls
const INK = '#f4f2ec'        // primary text (near-white)
const SUB = 'rgba(244,242,236,0.62)'   // secondary text
const FAINT = 'rgba(244,242,236,0.42)' // muted labels
const LINE = 'rgba(255,255,255,0.10)'  // hairline rule
const LINE_2 = 'rgba(255,255,255,0.20)'// stronger rule / hover
const CHIP = 'rgba(255,255,255,0.05)'
const CHIP_LINE = 'rgba(255,255,255,0.12)'
const ACCENT = OLIVE_BRIGHT  // #8c8d25 — price / accents
const PURPLE = '#351D93'     // Investment-Plan brand purple — interactive hovers
const PURPLE_HI = '#472bb0'  // brighter purple for pressed/hover fill
const GOLD = '#B98C52'       // Figma "Find Property" button gold
const GOLD_HI = '#C89E63'    // hover
const HERO_BG = '/images/hero-poster.jpg' // drone Muscat still behind the glass

// Stock fallback pool — used ONLY when a project has no bundled gallery
// (currently just "Aida" in Yiti). Deliberately restricted to the neutral,
// UNBRANDED Muscat-area renders. The sifah-* images are Jebel Sifah / Olive
// Farms / Solaris branded renders (some with text overlays) and the salalah-*
// are Salalah-specific — using either as a fallback made Aida cards look like
// Olive Farms / Solaris. Projects WITH their own gallery are unaffected.
const POOL = Array.from({ length: 13 }, (_, i) => `/images/blog/muscat-${i + 1}.jpg`)
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

// Filter-chip labels (the 5 dropdowns in the Figma panel).
const CHIP_LABELS = {
  en: { location: 'Location', type: 'Property Type', price: 'Pricing Range', size: 'Property Size', beds: 'Bedrooms' },
  ru: { location: 'Район', type: 'Тип недвижимости', price: 'Диапазон цен', size: 'Площадь', beds: 'Спальни' },
  ar: { location: 'المنطقة', type: 'نوع العقار', price: 'نطاق السعر', size: 'المساحة', beds: 'غرف النوم' },
  fa: { location: 'منطقه', type: 'نوع ملک', price: 'محدودهٔ قیمت', size: 'متراژ', beds: 'خواب' },
}

// Property-size buckets (sqm) — the Figma "Property Size" dropdown.
const SIZE_VALUES = [
  { v: 'any', min: 0, max: Infinity }, { v: 's', min: 0, max: 100 },
  { v: 'm', min: 100, max: 200 }, { v: 'l', min: 200, max: 400 }, { v: 'xl', min: 400, max: Infinity },
]
const SIZE_LABELS = {
  en: ['Any size', 'Under 100 m²', '100–200 m²', '200–400 m²', '400+ m²'],
  ru: ['Любая площадь', 'До 100 m²', '100–200 m²', '200–400 m²', '400+ m²'],
  ar: ['أي مساحة', 'أقل من 100 م²', '100–200 م²', '200–400 م²', '400+ م²'],
  fa: ['هر متراژ', 'زیر ۱۰۰ m²', '۱۰۰–۲۰۰ m²', '۲۰۰–۴۰۰ m²', '۴۰۰+ m²'],
}

const STR = {
  en: { developer: 'Developer', devSite: 'Developer website', viewProject: 'View project', mapTitle: 'Projects on the map', mapHint: 'Tap a price to see that project’s units', pinsOne: '{n} project pinned', pins: '{n} projects pinned', inProject: '{n} units in {name}', clearPin: 'All projects', showMap: 'Map', showList: 'List', unitsIn: 'Units in {name}', crumbHome: 'Home', crumbSearch: 'Properties', heading: 'Properties for Sale in Oman', placeholder: 'Search by area, project or city…', search: 'Search', count: '{n} properties', sortBy: 'Sort by', empty: 'No properties match your filters.', reset: 'Clear filters', view: 'View the listing', contact: 'Contact', from: 'From', freehold: 'Freehold', similar: '{n} similar units available', photos: '{n} photos', by: 'By Irfan Investment', eyebrow: 'Irfan Investment · Property Portal', lead: "Access 400+ handpicked homes across Oman's most sought-after communities, every one priced, verified and ready to view.", stProps: 'Properties', stProjects: 'Projects', stAreas: 'Locations', stFrom: 'Starting from', aiPlaceholder: 'Search for a property, like “3-bed beachfront villa under 250k”', find: 'Find Property', aiThinking: 'Searching…', aiClear: 'Clear', aiFallback: 'AI is busy, showing keyword matches instead.', aiSender: 'Irfan Assistant' },
  ru: { developer: 'Застройщик', devSite: 'Сайт застройщика', viewProject: 'Открыть проект', mapTitle: 'Проекты на карте', mapHint: 'Нажмите на цену, чтобы увидеть объекты проекта', pinsOne: '{n} проект на карте', pins: '{n} проектов на карте', inProject: '{n} объектов в {name}', clearPin: 'Все проекты', showMap: 'Карта', showList: 'Список', unitsIn: 'Объекты в {name}', crumbHome: 'Главная', crumbSearch: 'Недвижимость', heading: 'Недвижимость на продажу в Омане', placeholder: 'Поиск по району, проекту или городу…', search: 'Поиск', count: '{n} объектов', sortBy: 'Сортировка', empty: 'Ничего не найдено по фильтрам.', reset: 'Сбросить фильтры', view: 'Смотреть объект', contact: 'Связаться', from: 'От', freehold: 'Фрихолд', similar: 'Доступно похожих объектов: {n}', photos: '{n} фото', by: 'Irfan Investment', eyebrow: 'Irfan Investment · Портал недвижимости', lead: 'Более 400 тщательно отобранных объектов в самых востребованных районах Омана, все с ценами, проверенные и готовые к просмотру.', stProps: 'Объектов', stProjects: 'Проектов', stAreas: 'Локаций', stFrom: 'От', aiPlaceholder: 'Найти недвижимость, напр. «вилла у моря до 250k»', find: 'Найти', aiThinking: 'Поиск…', aiClear: 'Сбросить', aiFallback: 'AI занят, показаны совпадения по словам.', aiSender: 'Ассистент Irfan' },
  ar: { developer: 'المطور', devSite: 'موقع المطور', viewProject: 'عرض المشروع', mapTitle: 'المشاريع على الخريطة', mapHint: 'اضغط على السعر لعرض وحدات المشروع', pinsOne: 'مشروع واحد على الخريطة', pins: '{n} مشاريع على الخريطة', inProject: '{n} وحدة في {name}', clearPin: 'كل المشاريع', showMap: 'الخريطة', showList: 'القائمة', unitsIn: 'وحدات {name}', crumbHome: 'الرئيسية', crumbSearch: 'العقارات', heading: 'عقارات للبيع في عُمان', placeholder: 'ابحث حسب المنطقة أو المشروع أو المدينة…', search: 'بحث', count: '{n} عقار', sortBy: 'ترتيب حسب', empty: 'لا توجد عقارات مطابقة.', reset: 'مسح الفلاتر', view: 'عرض العقار', contact: 'تواصل', from: 'من', freehold: 'تملّك حر', similar: '{n} وحدات مماثلة متاحة', photos: '{n} صور', by: 'بواسطة عرفان للاستثمار', eyebrow: 'عرفان للاستثمار · بوابة العقارات', lead: 'اطّلع على أكثر من 400 عقار مختار في أرقى مناطق عُمان، كل عرض مُسعّر وموثّق وجاهز للمعاينة.', stProps: 'عقار', stProjects: 'مشروع', stAreas: 'منطقة', stFrom: 'تبدأ من', aiPlaceholder: 'ابحث عن عقار مثل «فيلا على البحر بأقل من 250 ألف»', find: 'ابحث', aiThinking: 'جارٍ البحث…', aiClear: 'مسح', aiFallback: 'الذكاء مشغول، نعرض تطابقات الكلمات.', aiSender: 'مساعد عرفان' },
  fa: { developer: 'سازنده', devSite: 'وب‌سایت سازنده', viewProject: 'مشاهده پروژه', mapTitle: 'پروژه‌ها روی نقشه', mapHint: 'روی قیمت بزنید تا واحدهای آن پروژه را ببینید', pinsOne: '{n} پروژه روی نقشه', pins: '{n} پروژه روی نقشه', inProject: '{n} واحد در {name}', clearPin: 'همه پروژه‌ها', showMap: 'نقشه', showList: 'لیست', unitsIn: 'واحدهای {name}', crumbHome: 'خانه', crumbSearch: 'املاک', heading: 'املاک برای فروش در عمان', placeholder: 'جستجو بر اساس منطقه، پروژه یا شهر…', search: 'جستجو', count: '{n} ملک', sortBy: 'مرتب‌سازی', empty: 'ملکی با این فیلترها پیدا نشد.', reset: 'پاک کردن فیلترها', view: 'مشاهدهٔ ملک', contact: 'تماس', from: 'از', freehold: 'فری‌هولد', similar: '{n} واحد مشابه موجود است', photos: '{n} عکس', by: 'توسط عرفان اینوست', eyebrow: 'عرفان اینوست · پورتال املاک', lead: 'به بیش از ۴۰۰ ملک منتخب در بهترین مناطق عمان دسترسی داشته باشید؛ هر آگهی قیمت‌گذاری‌شده، تأییدشده و آمادهٔ بازدید است.', stProps: 'ملک', stProjects: 'پروژه', stAreas: 'منطقه', stFrom: 'شروع از', aiPlaceholder: 'ملک دلخواهت را توصیف کن، مثل «ویلای ۳خوابه ساحلی زیر ۲۵۰هزار»', find: 'یافتن ملک', aiThinking: 'در حال جستجو…', aiClear: 'پاک کردن', aiFallback: 'هوش مصنوعی مشغول است، نتایج کلیدواژه‌ای نمایش داده شد.', aiSender: 'دستیار عرفان' },
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
.pfx-chip{position:relative;flex:1 1 0;min-width:128px;background:${CHIP};border:1px solid ${CHIP_LINE};padding:9px 14px;display:flex;flex-direction:column;justify-content:center;gap:2px;cursor:pointer;transition:border-color .2s,box-shadow .2s,background .2s}
.pfx-chip:hover{border-color:${PURPLE};box-shadow:0 4px 14px rgba(53,29,147,.14)}
.pfx-chip:hover .pfx-chip-label{color:${PURPLE}}
.pfx-chip-label{font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:${SUB};font-weight:700;line-height:1}
.pfx-chip-val{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:14.5px;color:${INK};font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pfx-chip select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;font-size:16px}
.pfx-btn{height:62px;padding:0 32px;background:${INK};color:${PAPER};border:none;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.02em;font-family:${FONT};transition:background .2s,box-shadow .2s}
.pfx-btn:hover{background:${PURPLE};box-shadow:0 8px 22px rgba(53,29,147,.32)}
.pfx-card{display:flex;background:${SURFACE};border:1px solid ${LINE};overflow:hidden;transition:box-shadow .25s,border-color .25s}
.pfx-card:hover{border-color:${PURPLE};box-shadow:0 14px 38px rgba(53,29,147,.13)}
.pfx-media{position:relative;flex:0 0 42%;max-width:430px;aspect-ratio:4/3;background:#1b1b1d;overflow:hidden;display:block}
.pfx-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
.pfx-card:hover .pfx-media img{transform:scale(1.04)}
.pfx-body{flex:1 1 auto;padding:22px 26px 20px;display:flex;flex-direction:column;min-width:0}
.pfx-cta{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:46px;padding:0 22px;font-weight:700;font-size:14px;cursor:pointer;text-decoration:none;font-family:${FONT};transition:background .2s,color .2s,border-color .2s}
.pfx-cta-primary{background:${INK};color:${PAPER};border:1px solid ${INK}}
.pfx-cta-primary:hover{background:${PURPLE};border-color:${PURPLE};box-shadow:0 8px 20px rgba(53,29,147,.3)}
.pfx-cta-ghost{background:transparent;color:${INK};border:1px solid ${LINE_2}}
.pfx-cta-ghost:hover{border-color:${PURPLE};color:${PURPLE};background:rgba(53,29,147,.05)}
.pfx-sortsel{position:relative;display:inline-flex;align-items:center;gap:6px;background:${SURFACE};border:1px solid ${LINE};padding:9px 12px;cursor:pointer;transition:border-color .2s}
.pfx-sortsel:hover{border-color:${PURPLE}}
.pfx-sortsel select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px}
@keyframes pfxShimmer{0%{background-position:-500px 0}100%{background-position:500px 0}}
.pfx-skel{background-color:#1e1e21;background-image:linear-gradient(90deg,rgba(30,30,33,0) 0,rgba(255,255,255,.07) 50%,rgba(30,30,33,0) 100%);background-size:500px 100%;background-repeat:no-repeat;animation:pfxShimmer 1.25s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.pfx-skel{animation:none}}
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
/* ── dark glass hero panel (Figma 953-28313) ── */
.pfh-hero{position:relative;padding:120px 20px 56px;background:linear-gradient(180deg,#141416 0%,#0a0a0b 100%);overflow:hidden}
.pfh-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(1100px 460px at 50% -8%,rgba(255,255,255,.05),transparent 68%);z-index:0}
/* Oman flag — hangs from the top-start corner of the hero, below the header
   (matches the landing hero); mirrors to the top-right in RTL. */
.pfh-flag{position:absolute;top:0;inset-inline-start:40px;width:78px;height:auto;aspect-ratio:158/238;z-index:2;pointer-events:none;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.pfh-wrap{position:relative;z-index:1;max-width:1180px;margin:0 auto}
.pfh-panel{max-width:1060px;margin:0 auto;text-align:center;background:rgba(255,255,255,.032);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:40px 40px 34px;box-shadow:0 24px 70px rgba(0,0,0,.32)}
.pfh-eyebrow{font-family:${FONT};font-size:14px;color:rgba(255,255,255,.82);font-weight:500;letter-spacing:.01em}
.pfh-h1{margin:9px 0 0;font-family:${FONT};font-weight:400;font-size:clamp(30px,4.6vw,54px);letter-spacing:-.02em;color:#fff;line-height:1.03}
.pfh-lead{margin:13px auto 0;font-family:${FONT};font-size:clamp(14.5px,1.4vw,16.5px);line-height:1.6;color:rgba(255,255,255,.6);max-width:600px}
.pfh-search{display:flex;align-items:center;gap:10px;margin-top:26px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13);border-radius:12px;padding:8px 8px 8px 20px;transition:border-color .2s;text-align:start}
.pfh-search:focus-within{border-color:rgba(255,255,255,.32)}
.pfh-search-ico{color:rgba(255,255,255,.55);flex-shrink:0}
.pfh-search input{flex:1;min-width:0;background:transparent;border:none;outline:none;color:#fff;font-family:${FONT};font-size:15.5px;text-align:start}
.pfh-search input::placeholder{color:rgba(255,255,255,.42)}
.pfh-find{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 24px;background:${GOLD};color:#fff;border:none;border-radius:9px;font-family:${FONT};font-weight:600;font-size:15px;cursor:pointer;transition:background .2s}
.pfh-find:hover{background:${GOLD_HI}}
.pfh-find:disabled{opacity:.75;cursor:default}
.pfh-find-ico{display:none}
.pfh-fchip-div{width:1px;height:20px;background:rgba(255,255,255,.16);flex-shrink:0}
.pfh-filters{display:flex;gap:12px;margin-top:14px;flex-wrap:wrap}
.pfh-fchip{position:relative;flex:1 1 0;min-width:150px;display:flex;align-items:center;gap:8px;height:54px;padding:0 11px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.13);border-radius:11px;cursor:pointer;transition:border-color .2s,background .2s}
.pfh-fchip:hover{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.075)}
.pfh-fchip-txt{flex:1;font-family:${FONT};font-size:13.5px;color:rgba(255,255,255,.84);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:start}
.pfh-fchip select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px}
.pfh-spin{width:17px;height:17px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:pfhSpin .7s linear infinite}
@keyframes pfhSpin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.pfh-spin{animation-duration:1.6s}}
@media(max-width:768px){
  .pfh-hero{padding:96px 14px 34px}
  .pfh-flag{top:0;inset-inline-start:16px;width:54px}
  .pfh-panel{padding:24px 18px 20px;border-radius:16px}
  .pfh-search{gap:8px;padding:7px 7px 7px 16px}
  .pfh-search-ico{display:none}
  .pfh-find{flex:0 0 auto;width:48px;min-width:48px;height:48px;padding:0;border-radius:9px}
  .pfh-find-txt{display:none}
  .pfh-find-ico{display:block}
  .pfh-filters{flex-direction:column;gap:10px}
  .pfh-fchip{width:100%;min-width:0;flex:1 1 auto;height:58px;border-radius:14px}
}
/* ── AI reply as an iOS-style notification card (Figma 955-28582) ── */
.pfx-msg{position:relative;display:flex;gap:12px;max-width:640px;margin:0 auto;background:#fff;border-radius:16px;padding:15px 18px;box-shadow:0 8px 50px rgba(0,0,0,.5),0 0 0 .5px rgba(255,255,255,.06);font-family:-apple-system,"SF Pro Text","Peyda",${FONT}}
.pfx-cursor{display:inline-block;width:2px;height:1em;background:rgba(60,60,67,.7);margin-inline-start:2px;vertical-align:-2px;animation:pfxBlink .8s steps(1) infinite}
@keyframes pfxBlink{50%{opacity:0}}
.pfx-msg-dot{width:10px;height:10px;border-radius:50%;background:#007AFF;margin-top:6px;flex-shrink:0}
.pfx-msg-body{flex:1;min-width:0}
.pfx-msg-top{display:flex;align-items:center;gap:8px}
.pfx-msg-sender{font-weight:600;font-size:17px;letter-spacing:-.4px;color:#000}
.pfx-msg-time{font-size:15px;letter-spacing:-.24px;color:rgba(60,60,67,.6);white-space:nowrap}
.pfx-msg-x{display:inline-flex;align-items:center;justify-content:center;background:transparent;border:none;color:rgba(60,60,67,.3);cursor:pointer;padding:0;margin:0;flex-shrink:0;line-height:0}
.pfx-msg-x:hover{color:rgba(60,60,67,.55)}
.pfx-msg-subject{margin-top:2px;font-size:15px;letter-spacing:-.24px;color:#000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:capitalize}
.pfx-msg-preview{margin:3px 0 0;font-size:15px;line-height:1.35;letter-spacing:-.24px;color:rgba(60,60,67,.6);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}

/* ── Airbnb split view: results left, sticky map right ────────────────────
   (Figma VPf1TVnzXcQ4ESr0EPjiAN node 1:2575). The map column is sticky and
   viewport-tall so it stays put while the list scrolls past it. */
.pfx-split{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:26px;
  max-width:1560px;margin:0 auto;padding:18px 20px 88px;align-items:start}
.pfx-mapcol{position:sticky;top:88px;height:calc(100vh - 108px);border:1px solid ${LINE};
  border-radius:16px;overflow:hidden;background:#0f0f11}
.pfx-mapwrap{position:absolute;inset:0}
.pfx-maphead{position:absolute;top:12px;left:12px;right:12px;z-index:3;display:flex;
  align-items:center;gap:10px;pointer-events:none}
.pfx-mapbadge{pointer-events:auto;display:inline-flex;align-items:center;gap:8px;
  background:rgba(12,12,14,.82);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  border:1px solid ${LINE_2};border-radius:999px;padding:8px 14px;color:${INK};
  font-size:12.5px;font-weight:600;letter-spacing:.01em}
.pfx-mapclear{pointer-events:auto;margin-inline-start:auto;display:inline-flex;align-items:center;
  gap:6px;background:${INK};color:${PAPER};border:none;border-radius:999px;padding:8px 15px;
  font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;transition:background .18s}
.pfx-mapclear:hover{background:${GOLD};color:#fff}
/* Info card for the selected pin. Sits in the MAP COLUMN, not on the pin, so
   panning never drags it and long developer copy stays readable. */
.pfx-mapcard{position:absolute;bottom:12px;left:12px;right:12px;z-index:4;
  background:rgba(14,14,16,.93);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
  border:1px solid ${LINE_2};border-radius:14px;padding:16px 18px 15px;
  box-shadow:0 18px 46px rgba(0,0,0,.55);max-height:calc(100% - 88px);overflow-y:auto}
.pfx-mapcard-x{position:absolute;top:10px;inset-inline-end:10px;display:inline-flex;
  align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;
  background:rgba(255,255,255,.08);border:none;color:${SUB};cursor:pointer;transition:background .18s,color .18s}
.pfx-mapcard-x:hover{background:rgba(255,255,255,.16);color:${INK}}
.pfx-mapcard-area{display:flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;
  letter-spacing:.07em;text-transform:uppercase;color:${FAINT};padding-inline-end:30px}
.pfx-mapcard-name{margin-top:5px;font-size:19px;font-weight:600;color:${INK};line-height:1.25}
.pfx-mapcard-parent{margin-top:2px;font-size:12.5px;color:${SUB}}
.pfx-mapcard-dev{margin-top:12px;padding-top:12px;border-top:1px solid ${LINE}}
.pfx-mapcard-devrow{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.pfx-mapcard-devlabel{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${FAINT}}
.pfx-mapcard-devname{font-size:14.5px;font-weight:600;color:${INK}}
.pfx-mapcard-flagtxt{font-size:11.5px;color:${SUB};background:${CHIP};border:1px solid ${CHIP_LINE};
  border-radius:999px;padding:2px 8px}
.pfx-mapcard-devdesc{margin:7px 0 0;font-size:13px;line-height:1.55;color:${SUB}}
.pfx-mapcard-stats{display:flex;flex-wrap:wrap;gap:10px 22px;margin-top:13px;padding-top:12px;
  border-top:1px solid ${LINE}}
.pfx-mapcard-stats b{display:block;font-size:14.5px;font-weight:700;color:${ACCENT};line-height:1.3}
.pfx-mapcard-stats span{display:block;margin-top:2px;font-size:11px;letter-spacing:.06em;
  text-transform:uppercase;color:${FAINT}}
.pfx-mapcard-actions{display:flex;align-items:center;gap:14px;margin-top:14px;flex-wrap:wrap}
.pfx-mapcard-btn{display:inline-flex;align-items:center;height:38px;padding:0 18px;background:${INK};
  color:${PAPER};border-radius:999px;font-size:13.5px;font-weight:700;text-decoration:none;
  transition:background .18s,color .18s}
.pfx-mapcard-btn:hover{background:${GOLD};color:#fff}
.pfx-mapcard-link{font-size:13px;color:${ACCENT};text-decoration:none}
.pfx-mapcard-link:hover{text-decoration:underline}
.pfx-mapnote{position:absolute;bottom:14px;left:12px;z-index:3;pointer-events:none;
  background:rgba(12,12,14,.78);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  border:1px solid ${LINE};border-radius:10px;padding:7px 12px;color:${SUB};font-size:12px}
/* Mobile: one column at a time, toggled by a floating pill. */
.pfx-maptoggle{display:none}
@media (max-width:1024px){
  .pfx-split{grid-template-columns:1fr;gap:0}
  .pfx-mapcol{position:fixed;inset:64px 0 0;height:auto;border-radius:0;border:none;z-index:1200}
  .pfx-split.is-list .pfx-mapcol{display:none}
  .pfx-split.is-map .pfx-listcol{display:none}
  .pfx-maptoggle{display:inline-flex;position:fixed;bottom:22px;left:50%;transform:translateX(-50%);
    z-index:1300;align-items:center;gap:8px;background:${INK};color:${PAPER};border:none;
    border-radius:999px;padding:13px 22px;font-family:inherit;font-size:14px;font-weight:700;
    cursor:pointer;box-shadow:0 8px 26px rgba(0,0,0,.5)}
}
`

// Placeholder card shown while the live query re-filters (the grey "buffer").
function SkeletonCard() {
  return (
    <article className="pfx-card" aria-hidden="true">
      <div className="pfx-media pfx-skel" />
      <div className="pfx-body">
        <div className="pfx-skel" style={{ height: 11, width: '36%' }} />
        <div className="pfx-skel" style={{ height: 20, width: '64%', marginTop: 11 }} />
        <div className="pfx-skel" style={{ height: 13, width: '28%', marginTop: 12 }} />
        <div className="pfx-skel" style={{ height: 26, width: '44%', marginTop: 14 }} />
        <div style={{ display: 'flex', gap: 14, marginTop: 15, paddingTop: 14, borderTop: `1px solid ${LINE}` }}>
          <div className="pfx-skel" style={{ height: 12, width: 56 }} />
          <div className="pfx-skel" style={{ height: 12, width: 72 }} />
          <div className="pfx-skel" style={{ height: 12, width: 56 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 'auto', paddingTop: 18 }}>
          <div className="pfx-skel" style={{ height: 44, width: 104 }} />
          <div className="pfx-skel" style={{ height: 44, width: 150 }} />
        </div>
      </div>
    </article>
  )
}

// ── one listing card (image left, details right → stacked on mobile) ──────
function UnitCard({ item, t, rtl, lang, onContact }) {
  const { unit, project, count = 1, cover, photoCount } = item
  const beds = unit.bedrooms
  const type = typeGroup(unit.unit_type)
  const title = unitTitle(beds, type, lang)
  const typeWord = (TYPE_WORDS[lang] || TYPE_WORDS.en)[type] || type
  const area = [project.area?.name || project.location, project.area?.city].filter(Boolean).join(', ')
  const sqm = unit.total_area_sqm || unit.internal_area_sqm
  const to = `/property/${unit.id}`
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
            <button type="button" onClick={onContact} className="pfx-cta pfx-cta-ghost">{t.contact}</button>
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

// Dark glass filter chip (icon + value + chevron) overlaying a real <select>.
function HeroChip({ icon, value, children }) {
  return (
    <label className="pfh-fchip">
      <span style={{ display: 'inline-flex', color: 'rgba(255,255,255,0.62)', flexShrink: 0 }}>{icon}</span>
      <span className="pfh-fchip-div" aria-hidden="true" />
      <span className="pfh-fchip-txt">{value}</span>
      <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
      {children}
    </label>
  )
}

export default function SearchPage() {
  const { lang } = useI18n()
  const t = STR[lang] || STR.en
  const rtl = lang === 'fa' || lang === 'ar'
  const [params, setParams] = useSearchParams()
  const paramsRef = useRef(params)
  paramsRef.current = params

  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  // Inline lead capture: { project, unit } when a card's "Contact" is clicked.
  const [inquiry, setInquiry] = useState(null)

  const L = LABELS[lang] || LABELS.en
  const C = CHIP_LABELS[lang] || CHIP_LABELS.en
  const [aiQuery, setAiQuery] = useState(params.get('q') || '') // AI search box
  const [aiFilter, setAiFilter] = useState(null)                // parsed constraints
  const [aiReply, setAiReply] = useState('')                    // assistant message
  const [aiSubject, setAiSubject] = useState('')                // the query, shown as the card subject
  const [aiTime, setAiTime] = useState('')                      // arrival time on the card
  const [aiBusy, setAiBusy] = useState(false)
  const [typed, setTyped] = useState('')                        // typewriter output
  const msgRef = useRef(null)
  const type = params.get('type') || 'Any'
  const beds = params.get('beds') || 'any'
  const price = params.get('price') || 'any'
  const size = params.get('size') || 'any'
  const area = params.get('area') || 'any'
  const sort = params.get('sort') || 'price_asc'
  // Which map pin is active. A project id, so it survives a rename.
  const projectId = params.get('project') || ''
  const [showMap, setShowMap] = useState(false) // mobile: map replaces the list

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

  // Hero strip = the brand catalogue promise. The unit feed only loads
  // *available* stock (a subset), so the headline counts use the confirmed
  // full-catalogue facts (407 units / 22 projects / 11 areas) while the entry
  // price stays live-derived from the loaded inventory (falls back to 54,600).
  const minPrice = useMemo(() => {
    const m = units.reduce((min, u) => (Number(u.price_omr) > 0 ? Math.min(min, Number(u.price_omr)) : min), Infinity)
    return Number.isFinite(m) ? m : 54600
  }, [units])
  const CATALOGUE = { props: 400, projects: 22, areas: 11 }

  const setParam = (key, val, dflt) => {
    const next = new URLSearchParams(params)
    if (val == null || val === dflt) next.delete(key)
    else next.set(key, val)
    setParams(next, { replace: true })
  }

  // Manual dropdown change → drop any active AI result so the two don't fight.
  const clearAi = () => { setAiFilter(null); setAiReply('') }
  const onManual = (key, val, dflt) => { clearAi(); setParam(key, val, dflt) }

  // AI search — POST the free-text query to the property-search edge function
  // (Claude), which returns a structured filter + a short reply. We apply the
  // filter to the units already loaded and surface the reply. Falls back to a
  // plain keyword match if the AI is unavailable.
  const runAiSearch = async (text) => {
    const query = (text ?? aiQuery).trim()
    if (!query || aiBusy) return
    setAiBusy(true)
    setAiSubject(query)
    try { setAiTime(new Date().toLocaleTimeString({ fa: 'fa-IR', ar: 'ar', ru: 'ru-RU', en: 'en-US' }[lang] || 'en-US', { hour: 'numeric', minute: '2-digit' })) } catch { setAiTime('') }
    // AI result stands alone → clear manual dropdowns, keep ?q shareable.
    const next = new URLSearchParams()
    next.set('q', query)
    setParams(next, { replace: true })
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/property-search`
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
        body: JSON.stringify({ query, language: lang }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'ai_failed')
      setAiFilter(data.filter || {})
      // strip any em/en dashes so the reply never reads as AI-written
      setAiReply((data.reply || '').replace(/\s*[—–]\s*/g, ', '))
    } catch {
      setAiFilter({ q: query }) // graceful keyword fallback
      setAiReply(t.aiFallback)
    } finally {
      setAiBusy(false)
    }
  }

  // Deep-link / landing-pill entry: if ?q= is present on first load, run it.
  useEffect(() => {
    const q0 = params.get('q')
    if (q0) runAiSearch(q0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // GSAP: slide the AI card in, then typewrite the reply text.
  useEffect(() => {
    if (!aiReply) { setTyped(''); return }
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (msgRef.current) gsap.fromTo(msgRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
    if (reduce) { setTyped(aiReply); return }
    setTyped('')
    const obj = { n: 0 }
    const tw = gsap.to(obj, {
      n: aiReply.length,
      duration: Math.min(2.6, Math.max(0.7, aiReply.length * 0.016)),
      ease: 'none',
      delay: 0.22,
      onUpdate: () => setTyped(aiReply.slice(0, Math.round(obj.n))),
      onComplete: () => setTyped(aiReply),
    })
    return () => tw.kill()
  }, [aiReply])

  const results = useMemo(() => {
    const priceMax = PRICE_VALUES.find((o) => o.v === price)?.max ?? Infinity
    const sizeBucket = SIZE_VALUES.find((o) => o.v === size) || SIZE_VALUES[0]
    const af = aiFilter
    const enriched = units
      .map((u) => ({ unit: u, project: projById[u.project_id] }))
      .filter((it) => it.project) // drop units whose project lacks coords/data
      .filter((it) => {
        const u = it.unit, p = it.project
        const sqm = Number(u.total_area_sqm || u.internal_area_sqm || 0)
        if (u.price_omr == null || Number(u.price_omr) <= 0) return false
        // map pin selection: the list shows that RELEASE's own inventory.
        // The key is `<projectId>` or `<projectId>::<subproject>`, matching
        // how mapProjects buckets the pins.
        if (projectId) {
          const sub = (u.subproject || '').trim()
          if ((sub ? `${p.id}::${sub}` : String(p.id)) !== String(projectId)) return false
        }
        // manual dropdown filters
        if (area !== 'any' && (p.area?.name || p.location) !== area) return false
        if (type !== 'Any' && typeGroup(u.unit_type) !== type) return false
        if (beds !== 'any') {
          const b = u.bedrooms ?? 0
          if (beds === '4') { if (b < 4) return false } else if (String(b) !== beds) return false
        }
        if (Number(u.price_omr) > priceMax) return false
        if (size !== 'any' && (sqm < sizeBucket.min || sqm > sizeBucket.max)) return false
        // AI natural-language filter (from property-search)
        if (af) {
          const b = u.bedrooms ?? 0
          if (af.type && typeGroup(u.unit_type) !== af.type) return false
          if (af.bedsMin != null && b < af.bedsMin) return false
          if (af.bedsMax != null && b > af.bedsMax) return false
          if (af.priceMin != null && Number(u.price_omr) < af.priceMin) return false
          if (af.priceMax != null && Number(u.price_omr) > af.priceMax) return false
          if (af.sizeMin != null && sqm < af.sizeMin) return false
          if (af.sizeMax != null && sqm > af.sizeMax) return false
          if (af.q) {
            const hay = [p.name, p.location, p.area?.name, p.area?.city, u.unit_type].filter(Boolean).join(' ').toLowerCase()
            if (!hay.includes(af.q.toLowerCase())) return false
          }
          // viewKeywords are a SOFT preference (applied as a sort boost below),
          // not a hard filter — a beachfront community's units often carry a
          // "lagoon"/"garden" view label, so filtering them out empties results.
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
    // Soft view preference from AI search: float matching-view units to the top
    // (stable, so the price/area order holds within each partition).
    if (af && af.viewKeywords && af.viewKeywords.length) {
      const kw = af.viewKeywords
      const vmatch = (u) => { const v = String(u.view || '').toLowerCase(); return kw.some((k) => v.includes(k)) }
      grouped.sort((a, b) => (vmatch(b.unit) ? 1 : 0) - (vmatch(a.unit) ? 1 : 0))
    }

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
  }, [units, projById, type, beds, price, size, area, sort, aiFilter, projectId])

  // ── map pins ───────────────────────────────────────────────────────────
  // One pin per RELEASE: a project, or a named sub-project where the
  // inventory has one. Jebel Sifah sells as Olive Farms and Solaris, and
  // Hawana Salalah as Amazi and Lubana Island — pinning only the parent hid
  // four distinct developments behind two pins. Derived, never hardcoded: a
  // release that sells out drops off, a new one appears by itself. The `from`
  // price on the pill is that release's cheapest available unit.
  const mapProjects = useMemo(() => {
    const agg = new Map()
    for (const u of units) {
      const p = projById[u.project_id]
      const priceNum = Number(u.price_omr)
      if (!p || !(priceNum > 0)) continue
      if (p.latitude == null || p.longitude == null) continue
      const sub = (u.subproject || '').trim()
      const key = sub ? `${p.id}::${sub}` : String(p.id)
      const cur = agg.get(key) || {
        id: key,
        projectId: p.id,
        sub,
        name: sub || p.name,
        // A sub-project sits inside its parent, so the pill names both.
        parent: sub ? p.name : '',
        slug: slugify(p.name),
        lat: Number(p.latitude), lng: Number(p.longitude),
        area: p.area?.name || p.location || '',
        city: p.area?.city || '',
        developer: p.developer || null,
        count: 0, minPrice: Infinity, maxPrice: 0,
        types: new Set(), bedsMin: Infinity, bedsMax: 0,
      }
      cur.count++
      cur.minPrice = Math.min(cur.minPrice, priceNum)
      cur.maxPrice = Math.max(cur.maxPrice, priceNum)
      cur.types.add(typeGroup(u.unit_type))
      const b = Number(u.bedrooms)
      if (Number.isFinite(b)) {
        cur.bedsMin = Math.min(cur.bedsMin, b)
        cur.bedsMax = Math.max(cur.bedsMax, b)
      }
      agg.set(key, cur)
    }
    const list = [...agg.values()]
    // Sub-projects inherit the parent's single coordinate, so two releases of
    // the same resort would stack exactly on top of each other. Fan them out
    // around it — a display device only (they are all inside the same ITC,
    // a few hundred metres apart), never a claim about an exact address.
    const byParent = new Map()
    for (const r of list) {
      if (!byParent.has(r.projectId)) byParent.set(r.projectId, [])
      byParent.get(r.projectId).push(r)
    }
    for (const group of byParent.values()) {
      if (group.length < 2) continue
      const R = 0.0055 // ~600 m
      group.forEach((r, i) => {
        const a = (2 * Math.PI * i) / group.length
        r.lat += R * Math.cos(a)
        r.lng += R * Math.sin(a) / Math.cos((r.lat * Math.PI) / 180)
        r.fanned = true
      })
    }
    for (const r of list) r.types = [...r.types]
    return list.sort((a, b) => a.minPrice - b.minPrice)
  }, [units, projById])

  const selectedProject = mapProjects.find((p) => String(p.id) === String(projectId)) || null
  const selectPin = (id) => {
    clearAi()
    setParam('project', String(id) === String(projectId) ? null : String(id), null)
  }

  const busy = loading || aiBusy // skeleton while AI is thinking / data loads
  const SL = SIZE_LABELS[lang] || SIZE_LABELS.en
  const typeVal = L.type[TYPE_OPTIONS.indexOf(type)] || L.type[0]
  const bedsVal = L.beds[BEDS_VALUES.indexOf(beds)] || L.beds[0]
  const priceVal = L.price[PRICE_VALUES.findIndex((o) => o.v === price)] || L.price[0]
  const sizeVal = SL[SIZE_VALUES.findIndex((o) => o.v === size)] || SL[0]
  const areaVal = area === 'any' ? L.anyArea : area

  // ── structured data ─────────────────────────────────────────────────────
  // FAQPage (mirrors the prerendered payload, same id so hydration replaces
  // rather than duplicates) + an ItemList of the visible listings + a
  // BreadcrumbList. The ItemList is what lets a listing portal surface as a
  // rich result instead of a plain blue link.
  useEffect(() => {
    const SITE = 'https://www.irfaninvest.com'
    const faq = document.createElement('script')
    faq.type = 'application/ld+json'
    faq.id = 'project-faq-jsonld'
    faq.textContent = JSON.stringify(projectFaqJsonLd(lang))
    document.getElementById('project-faq-jsonld')?.remove()
    document.head.appendChild(faq)

    const list = document.createElement('script')
    list.type = 'application/ld+json'
    list.id = 'project-itemlist-jsonld'
    list.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Properties for Sale in Oman', item: `${SITE}/project` },
          ],
        },
        {
          '@type': 'ItemList',
          name: 'Properties for sale in Oman',
          numberOfItems: results.length,
          itemListElement: results.slice(0, 25).map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE}/property/${it.unit.id}`,
            name: `${unitTitle(it.unit.bedrooms, typeGroup(it.unit.unit_type), 'en')} · ${it.project.name}`,
          })),
        },
      ],
    })
    document.getElementById('project-itemlist-jsonld')?.remove()
    document.head.appendChild(list)

    return () => { faq.remove(); list.remove() }
  }, [lang, results])

  const seoCopy = PROJECT_SEO[lang] || PROJECT_SEO.en

  return (
    <div className="pfx-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{CSS}</style>

      {/* ── dark glass hero panel (Figma 953-28313) ── */}
      <section className="pfh-hero">
        <img className="pfh-flag" src="/images/oman-flag.png" alt="Flag of Oman" />
        <div className="pfh-wrap">
          <div className="pfh-panel" dir={rtl ? 'rtl' : 'ltr'}>
            <div className="pfh-eyebrow">{t.eyebrow}</div>
            <h1 className="pfh-h1">{t.heading}</h1>
            <p className="pfh-lead">{t.lead}</p>

            {/* AI natural-language search */}
            <form className="pfh-search" onSubmit={(e) => { e.preventDefault(); runAiSearch() }}>
              <SearchRoundedIcon className="pfh-search-ico" sx={{ fontSize: 22 }} />
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder={t.aiPlaceholder}
                aria-label={t.aiPlaceholder}
              />
              <button type="submit" className="pfh-find" disabled={aiBusy} aria-label={t.find}>
                {aiBusy && <span className="pfh-spin" />}
                <span className="pfh-find-txt">{aiBusy ? t.aiThinking : t.find}</span>
                {!aiBusy && <SearchRoundedIcon className="pfh-find-ico" sx={{ fontSize: 24 }} />}
              </button>
            </form>

            {/* 5 filter dropdowns */}
            <div className="pfh-filters">
              <HeroChip icon={<PlaceOutlinedIcon sx={{ fontSize: 19 }} />} value={area === 'any' ? C.location : areaVal}>
                <select value={area} onChange={(e) => onManual('area', e.target.value, 'any')} aria-label={C.location}>
                  <option value="any">{L.anyArea}</option>
                  {areaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </HeroChip>
              <HeroChip icon={<HomeWorkOutlinedIcon sx={{ fontSize: 19 }} />} value={type === 'Any' ? C.type : typeVal}>
                <select value={type} onChange={(e) => onManual('type', e.target.value, 'Any')} aria-label={C.type}>
                  {TYPE_OPTIONS.map((o, i) => <option key={o} value={o}>{L.type[i]}</option>)}
                </select>
              </HeroChip>
              <HeroChip icon={<PaymentsOutlinedIcon sx={{ fontSize: 18 }} />} value={price === 'any' ? C.price : priceVal}>
                <select value={price} onChange={(e) => onManual('price', e.target.value, 'any')} aria-label={C.price}>
                  {PRICE_VALUES.map((o, i) => <option key={o.v} value={o.v}>{L.price[i]}</option>)}
                </select>
              </HeroChip>
              <HeroChip icon={<StraightenRoundedIcon sx={{ fontSize: 18 }} />} value={size === 'any' ? C.size : sizeVal}>
                <select value={size} onChange={(e) => onManual('size', e.target.value, 'any')} aria-label={C.size}>
                  {SIZE_VALUES.map((o, i) => <option key={o.v} value={o.v}>{SL[i]}</option>)}
                </select>
              </HeroChip>
              <HeroChip icon={<KingBedOutlinedIcon sx={{ fontSize: 19 }} />} value={beds === 'any' ? C.beds : bedsVal}>
                <select value={beds} onChange={(e) => onManual('beds', e.target.value, 'any')} aria-label={C.beds}>
                  {BEDS_VALUES.map((v, i) => <option key={v} value={v}>{L.beds[i]}</option>)}
                </select>
              </HeroChip>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI reply as an iOS-style notification card (Figma 955-28582) ── */}
      {aiReply && (
        <section className="pfx-wrap" style={{ padding: '22px 20px 0' }}>
          <div ref={msgRef} className="pfx-msg" dir={rtl ? 'rtl' : 'ltr'}>
            <span className="pfx-msg-dot" />
            <div className="pfx-msg-body">
              <div className="pfx-msg-top">
                <span className="pfx-msg-sender">{t.aiSender}</span>
                <span style={{ marginInlineStart: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {aiTime && <span className="pfx-msg-time">{aiTime}</span>}
                  <button type="button" className="pfx-msg-x" onClick={clearAi} aria-label={t.aiClear}>
                    <CloseRoundedIcon sx={{ fontSize: 19 }} />
                  </button>
                </span>
              </div>
              {aiSubject && <div className="pfx-msg-subject">{aiSubject}</div>}
              <p className="pfx-msg-preview">{typed}{typed.length < aiReply.length && <span className="pfx-cursor" />}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── breadcrumb + count + sort ── */}
      <section className="pfx-wrap" style={{ padding: '22px 20px 0' }}>
        <nav style={{ color: FAINT, fontFamily: FONT, fontSize: 12.5, marginBottom: 12, letterSpacing: '0.02em' }}>
          <LocalizedLink to="/" style={{ color: FAINT, textDecoration: 'none' }}>{t.crumbHome}</LocalizedLink>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: SUB }}>{t.crumbSearch}</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingBottom: 4 }}>
          <span style={{ fontFamily: FONT, fontSize: 15, color: INK, fontWeight: 600 }}>
            {busy ? '…' : t.count.replace('{n}', localizeDigits(results.length, lang))}
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

      {/* ── Airbnb split view: units left, project map right ── */}
      <section className={`pfx-split ${showMap ? 'is-map' : 'is-list'}`}>
        <div className="pfx-listcol">
        {/* Visually-hidden h2 so the outline reads h1 -> h2 -> h3(card) rather
            than skipping a level straight from the page title to each listing. */}
        <h2 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          {selectedProject ? t.unitsIn.replace('{name}', selectedProject.name) : t.crumbSearch}
        </h2>
        {selectedProject && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${LINE}`,
          }}>
            <PlaceRoundedIcon sx={{ fontSize: 19, color: GOLD }} />
            <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: INK }}>
              {selectedProject.name}
            </span>
            <span style={{ fontFamily: FONT, fontSize: 13.5, color: SUB }}>
              {/* the project's TRUE available-unit count, so it matches the
                  number on the map pin; the card list shows fewer rows because
                  near-identical units collapse into one card. */}
              {t.inProject.replace('{n}', localizeDigits(selectedProject.count, lang)).replace('{name}', selectedProject.area)}
            </span>
            <button
              type="button" onClick={() => setParam('project', null, null)}
              style={{
                marginInlineStart: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'transparent', color: INK, border: `1px solid ${LINE_2}`,
                borderRadius: 999, padding: '7px 14px', fontFamily: FONT, fontSize: 13, cursor: 'pointer',
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 15 }} /> {t.clearPin}
            </button>
          </div>
        )}
        {busy ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: SUB, fontFamily: FONT }}>
            <p style={{ fontSize: 16, marginBottom: 16 }}>{t.empty}</p>
            <button type="button" onClick={() => { clearAi(); setAiQuery(''); setParams(new URLSearchParams(), { replace: true }) }}
              style={{ background: 'transparent', color: INK, border: `1px solid ${LINE_2}`, padding: '10px 20px', fontFamily: FONT, fontSize: 14, cursor: 'pointer' }}>
              {t.reset}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {results.map((item) => (
              <UnitCard
                key={item.unit.id}
                item={item}
                t={t}
                rtl={rtl}
                lang={lang}
                onContact={() => setInquiry({ project: item.project, unit: item.unit })}
              />
            ))}
          </div>
        )}
        </div>

        {/* ── map column ── */}
        <aside className="pfx-mapcol" aria-label={t.mapTitle}>
          <div className="pfx-maphead">
            <span className="pfx-mapbadge">
              <PlaceOutlinedIcon sx={{ fontSize: 16, color: GOLD }} />
              {(mapProjects.length === 1 ? t.pinsOne : t.pins).replace('{n}', localizeDigits(mapProjects.length, lang))}
            </span>
            {selectedProject && (
              <button type="button" className="pfx-mapclear" onClick={() => setParam('project', null, null)}>
                <CloseRoundedIcon sx={{ fontSize: 15 }} /> {t.clearPin}
              </button>
            )}
          </div>
          <div className="pfx-mapwrap">
            {/* mapbox-gl is 1.76 MB: only mount it once the data that decides
                the pins has arrived, so it never competes with the first paint. */}
            {mapProjects.length > 0 && (
              <Suspense fallback={null}>
                <SearchMap projects={mapProjects} selectedId={projectId} onSelect={selectPin} />
              </Suspense>
            )}
          </div>
          {!selectedProject && <div className="pfx-mapnote">{t.mapHint}</div>}

          {/* ── info card: who builds it, what is in it, where it is ──
              Anchored to the map column rather than to the pin, so panning
              never drags it around and the text stays readable. */}
          {selectedProject && (
            <div className="pfx-mapcard" dir={rtl ? 'rtl' : 'ltr'}>
              <button type="button" className="pfx-mapcard-x" onClick={() => setParam('project', null, null)} aria-label={t.clearPin}>
                <CloseRoundedIcon sx={{ fontSize: 17 }} />
              </button>

              <div className="pfx-mapcard-area">
                <PlaceRoundedIcon sx={{ fontSize: 14, color: GOLD }} />
                {selectedProject.area}{selectedProject.city ? `, ${selectedProject.city}` : ''}
              </div>
              <div className="pfx-mapcard-name">{selectedProject.name}</div>
              {selectedProject.parent && (
                <div className="pfx-mapcard-parent">{selectedProject.parent}</div>
              )}

              {selectedProject.developer?.name && (
                <div className="pfx-mapcard-dev">
                  <div className="pfx-mapcard-devrow">
                    <span className="pfx-mapcard-devlabel">{t.developer}</span>
                    <span className="pfx-mapcard-devname">{selectedProject.developer.name}</span>
                    {selectedProject.developer.country_of_origin && (
                      <span className="pfx-mapcard-flagtxt">{selectedProject.developer.country_of_origin}</span>
                    )}
                  </div>
                  {selectedProject.developer.description && (
                    <p className="pfx-mapcard-devdesc">{selectedProject.developer.description}</p>
                  )}
                </div>
              )}

              <div className="pfx-mapcard-stats">
                <div><b>{localizeDigits(selectedProject.count, lang)}</b><span>{t.stProps}</span></div>
                <div><b>{fmtOmr(selectedProject.minPrice, lang)}</b><span>{t.stFrom}</span></div>
                {selectedProject.types.length > 0 && (
                  <div>
                    <b>{selectedProject.types.map((x) => (TYPE_WORDS[lang] || TYPE_WORDS.en)[x] || x).join(' · ')}</b>
                    <span>{C.type}</span>
                  </div>
                )}
              </div>

              <div className="pfx-mapcard-actions">
                <LocalizedLink className="pfx-mapcard-btn" to={`/buy/${selectedProject.slug}`}>
                  {t.viewProject}
                </LocalizedLink>
                {selectedProject.developer?.website && (
                  <a
                    className="pfx-mapcard-link"
                    href={`https://${String(selectedProject.developer.website).replace(/^https?:\/\//, '')}`}
                    target="_blank" rel="noopener noreferrer nofollow"
                  >
                    {t.devSite}
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>

        <button type="button" className="pfx-maptoggle" onClick={() => setShowMap((v) => !v)}>
          {showMap ? <FormatListBulletedRoundedIcon sx={{ fontSize: 18 }} /> : <PlaceRoundedIcon sx={{ fontSize: 18 }} />}
          {showMap ? t.showList : t.showMap}
        </button>
      </section>

      {/* ── crawlable SEO copy + FAQ + internal links ──────────────────────
          The portal had no body content at all, so it never competed with
          Bayut/Dubizzle/Vista for the "apartments for sale in muscat" cluster.
          Same block the prerenderer writes into the static HTML. */}
      <section
        style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 96px', textAlign: rtl ? 'right' : 'left' }}
        dir={rtl ? 'rtl' : 'ltr'}
      >
        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 44 }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 'clamp(22px,2.6vw,30px)', color: INK, margin: '0 0 18px', lineHeight: 1.25 }}>
            {seoCopy.heading}
          </h2>
          {seoCopy.paras.map((p, i) => (
            <p key={i} style={{ fontFamily: FONT, fontSize: 15.5, lineHeight: 1.85, color: SUB, margin: '0 0 18px' }}>{p}</p>
          ))}

          <div style={{ marginTop: 34 }}>
            {seoCopy.faq.map((f, i) => (
              <div key={i} style={{ marginBottom: 22 }}>
                <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: INK, margin: '0 0 8px' }}>{f.q}</h3>
                <p style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.8, color: SUB, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: INK, margin: '34px 0 12px' }}>
            {seoCopy.linksHeading}
          </h3>
          <ul style={{ margin: 0, padding: rtl ? '0 18px 0 0' : '0 0 0 18px', listStyle: 'disc' }}>
            {seoCopy.links.map((l) => (
              <li key={l.href} style={{ marginBottom: 9 }}>
                <LocalizedLink to={l.href} style={{ fontFamily: FONT, fontSize: 15, color: ACCENT, textDecoration: 'none' }}>
                  {l.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <QuickInquiryModal
        open={!!inquiry}
        onClose={() => setInquiry(null)}
        project={inquiry?.project}
        unit={inquiry?.unit}
      />
    </div>
  )
}
