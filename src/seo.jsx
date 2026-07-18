import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ALL_LANGS, langFromPath, stripLang, localizePath } from './lib/localize.js'
import { ROUTES, projectMeta } from './seoRoutes.mjs'

/**
 * SeoManager — per-route <head> metadata for the SPA.
 *
 * index.html ships homepage defaults for non-JS scrapers. On every client
 * navigation this rewrites title/description/canonical/OG/Twitter/robots so
 * each route is indexed on its own terms.
 *
 * CRITICAL (post-Webflow migration): unknown URLs (legacy /uae/*, /omans/*,
 * /ru/*, random crawls) must NOT inherit the homepage meta — that produced
 * "Duplicate, Google chose different canonical" across 100+ junk URLs. So
 * unknown paths get `noindex` + a self-canonical, and the app renders a real
 * 404 page for them. Legacy paths with a real new home are 301-redirected at
 * the edge (vercel.json); truly-dead ones return 410 (api/gone.js).
 */

const SITE = 'https://www.irfaninvest.com'

const DEFAULT_DESC =
  'A premium real estate brokerage in Oman, connecting global capital with curated developments across Oman and emerging investment destinations.'


// A ROUTES value may carry localized strings ({en,ru,ar,fa}) or a plain
// string. Resolve to the active language, falling back to English.
function pick(v, lang) {
  return v && typeof v === 'object' ? v[lang] || v.en : v
}

function titleCase(s) {
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// Returns { title, desc, index }. Input is the LOGICAL path (language prefix
// already stripped). `index:false` → emit noindex (junk / 404 / admin), so it
// never competes with real pages for indexing.
function resolve(pathname, lang = 'en') {
  if (ROUTES[pathname]) {
    const r = ROUTES[pathname]
    return { title: pick(r.title, lang), desc: pick(r.desc, lang), index: true }
  }

  // Blog articles — generic until InsightDetailPage writes precise tags.
  if (/^\/insights\/[^/]+\/?$/.test(pathname)) {
    const r = ROUTES['/insights']
    return { title: pick(r.title, lang), desc: pick(r.desc, lang), index: true }
  }

  // Project pages — CTR-optimized localized templates shared with the
  // build-time prerenderer (projectMeta in seoRoutes.mjs).
  const m = pathname.match(/^\/buy\/([^/]+)\/?$/)
  if (m) {
    const pm = projectMeta(titleCase(decodeURIComponent(m[1])))
    return { title: pick(pm.title, lang), desc: pick(pm.desc, lang), index: true }
  }

  // Admin tool — never index.
  if (pathname.startsWith('/insights-admin')) {
    return { title: 'Admin — Irfan Investment Group', desc: '', index: false }
  }

  // Anything else (legacy Webflow URL, random crawl, real 404) → noindex.
  return { title: 'Page not found | Irfan Investment Group', desc: 'The page you requested could not be found.', index: false }
}

function setMeta(attr, value, content) {
  let el = document.head.querySelector(`meta[${attr}="${value}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const OG_LOCALE = { en: 'en_US', ar: 'ar_OM', ru: 'ru_RU', fa: 'fa_IR' }

// Manage the set of <link rel="alternate" hreflang> tags for the 4 language
// variants of a logical path, plus x-default (English). Tagged with
// data-hreflang so we can clear stale ones on every navigation.
// Exported so InsightDetailPage can refresh alternates for the article URL.
export function setAlternates(logicalPath) {
  document.head.querySelectorAll('link[data-hreflang]').forEach((el) => el.remove())
  if (!logicalPath) return
  const add = (hreflang, href) => {
    const el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    el.setAttribute('hreflang', hreflang)
    el.setAttribute('href', href)
    el.setAttribute('data-hreflang', '1')
    document.head.appendChild(el)
  }
  for (const l of ALL_LANGS) add(l, SITE + localizePath(logicalPath, l))
  add('x-default', SITE + localizePath(logicalPath, 'en'))
}

export default function SeoManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const lang = langFromPath(pathname)
    const logical = stripLang(pathname)
    const { title, desc, index } = resolve(logical, lang)
    const selfPath = localizePath(logical === '/' ? '/' : logical.replace(/\/$/, ''), lang)
    const url = SITE + selfPath

    document.title = title
    setMeta('name', 'description', desc)
    setMeta(
      'name',
      'robots',
      index ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow',
    )
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:locale', OG_LOCALE[lang] || 'en_US')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', desc)
    // Self-referential canonical for every page.
    setCanonical(url)
    // hreflang only for indexable pages; clear it on noindex/404/admin.
    setAlternates(index ? (logical === '/' ? '/' : logical.replace(/\/$/, '')) : null)
  }, [pathname])

  return null
}
