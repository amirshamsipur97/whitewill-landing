/**
 * analytics.js — single source of truth for GA4 + Google Ads tracking.
 *
 * The gtag library + base config live in index.html. There, GA4 is configured
 * with { send_page_view: false } so this module controls page_view manually —
 * essential for a SPA, otherwise GA4 only ever records ONE page_view (the
 * homepage title) for the whole visit.
 *
 * Every page_view we send carries:
 *   - page_title    : "<localized page name> | <LANG>"  (so the GA4 default
 *                     "Views by Page title" report shows the page AND language)
 *   - content_group : page category (Buy, Blog, Investment, …) — fills
 *                     GA4's built-in "Content group" dimension, no setup needed
 *   - site_language : 'en' | 'ru' | 'ar' | 'fa'  (custom dimension)
 *   - page_path / page_location
 *
 * Leads (any form submit on the site) send the GA4 recommended `generate_lead`
 * event with lead_source + site_language, and — if a Google Ads conversion is
 * configured via env — a matching Ads `conversion` event.
 */

export const GA_ID = 'G-P2PTCKJKYK'          // GA4 Measurement ID
export const ADS_ID = 'AW-17743726667'       // Google Ads tag (Google tag GT-M3KMFWHL)

// Google Ads conversion ACTION label for the lead conversion. The Ads tag above
// is always installed (index.html) so Ads can detect it; this label is only
// needed to fire the specific "lead" conversion. Get it from Google Ads ->
// Goals -> Conversions -> your lead action -> "Tag setup" (the part after the
// slash in send_to). Set it via env to activate per-lead conversion tracking.
export const ADS_LEAD_LABEL = import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL || ''

function gtag(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

// ── Page registry ───────────────────────────────────────────────────
// Localized, human page names per route. `group` is the GA4 content group.
const PAGES = {
  '/':                  { group: 'Home',        names: { en: 'Home', ru: 'Главная', ar: 'الرئيسية', fa: 'خانه' } },
  '/buy':               { group: 'Buy',         names: { en: 'Buy Property', ru: 'Купить', ar: 'شراء', fa: 'خرید ملک' } },
  '/maison-shirdel':    { group: 'Maison Shirdel', names: { en: 'Maison Shirdel', ru: 'Maison Shirdel', ar: 'Maison Shirdel', fa: 'Maison Shirdel' } },
  '/invest':            { group: 'Company Registration', names: { en: 'Company Registration', ru: 'Регистрация компании', ar: 'تأسيس الشركات', fa: 'ثبت شرکت' } },
  '/investment':        { group: 'Investment',  names: { en: 'Investment & Banking', ru: 'Инвестиции', ar: 'الاستثمار', fa: 'سرمایه‌گذاری' } },
  '/investment/legal':  { group: 'Investment',  names: { en: 'Financing — Legal', ru: 'Финансирование — право', ar: 'التمويل — قانوني', fa: 'الزامات قانونی وام' } },
  '/car-import':        { group: 'Car Import',  names: { en: 'Car Import', ru: 'Импорт авто', ar: 'استيراد السيارات', fa: 'واردات خودرو' } },
  '/insights':          { group: 'Blog',        names: { en: 'Blog', ru: 'Блог', ar: 'بلاگ', fa: 'بلاگ' } },
  '/insights-admin':    { group: 'Admin',       names: { en: 'Blog Admin', ru: 'Blog Admin', ar: 'Blog Admin', fa: 'Blog Admin' } },
  '/about':             { group: 'About',       names: { en: 'About', ru: 'О нас', ar: 'عنّا', fa: 'درباره ما' } },
}

function pickName(names, lang) {
  return names[lang] || names.en
}

// Resolve a pathname (incl. dynamic routes) to a { title, group } for GA4.
export function resolvePage(pathname, lang) {
  if (PAGES[pathname]) {
    const p = PAGES[pathname]
    return { title: pickName(p.names, lang), group: p.group }
  }
  // /buy/:slug — a single project page
  let m = pathname.match(/^\/buy\/([^/]+)/)
  if (m) {
    const slug = decodeURIComponent(m[1])
    return { title: `${{ en: 'Project', ru: 'Проект', ar: 'مشروع', fa: 'پروژه' }[lang] || 'Project'}: ${slug}`, group: 'Project' }
  }
  // /insights/:slug — a single blog article
  m = pathname.match(/^\/insights\/([^/]+)/)
  if (m) {
    const slug = decodeURIComponent(m[1])
    return { title: `${{ en: 'Article', ru: 'Статья', ar: 'مقال', fa: 'مقاله' }[lang] || 'Article'}: ${slug}`, group: 'Blog' }
  }
  return { title: pickName(PAGES['/'].names, lang), group: 'Home' }
}

/** Manual SPA page_view. Call on every route or language change. */
export function trackPageView({ path, lang }) {
  const p = path || (typeof window !== 'undefined' ? window.location.pathname : '/')
  const { title, group } = resolvePage(p, lang)
  const L = (lang || 'en').toUpperCase()
  gtag('event', 'page_view', {
    page_title: `${title} | ${L}`,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_path: p,
    content_group: group,
    site_language: lang || 'en',
  })
}

/**
 * Lead generation — fire once per successful form submit (any form on the site).
 * @param {object} o
 * @param {string} o.source    where the lead came from (form source)
 * @param {string} [o.language] site language at submit time
 * @param {number} [o.value]   monetary value for the conversion (optional)
 * @param {string} [o.currency]
 */
export function trackLead({ source, language, value = 0, currency = 'OMR' } = {}) {
  gtag('event', 'generate_lead', {
    lead_source: source || 'website',
    site_language: language || 'en',
    value,
    currency,
  })
  // Direct Google Ads conversion (only if configured via env).
  if (ADS_ID && ADS_LEAD_LABEL) {
    gtag('event', 'conversion', {
      send_to: `${ADS_ID}/${ADS_LEAD_LABEL}`,
      value,
      currency,
    })
  }
}
