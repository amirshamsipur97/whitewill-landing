// prerender-routes.mjs — build-time prerender of every STATIC route × language.
//
// WHY: prerender-insights.mjs fixed the SPA-shell duplicate problem for blog
// articles (indexed pages jumped 12 → 73), but the static routes (/, /buy,
// /invest, /schools, …) and especially their /ar /ru /fa variants still served
// the identical index.html shell on the crawler's first fetch. Search Console
// kept 37 pages in "Duplicate, Google chose different canonical" and 22 in
// "Crawled - currently not indexed" — almost all of them these routes. This
// script writes dist{/lang}{route}/index.html per variant with the route's own
// localized <title>, description, canonical, hreflang set and OG tags (from
// src/seoRoutes.mjs — the same data SeoManager uses client-side), plus a
// minimal crawlable h1/p inside #root. React hydrates over it for users.
//
// Runs LAST in the build chain (after prerender-insights.mjs) — see package.json.

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { ROUTES, projectMeta } from './src/seoRoutes.mjs'
import { BUY_SEO, buyFaqJsonLd } from './src/buySeoContent.mjs'

const SITE = 'https://www.irfaninvest.com'
const LANGS = ['en', 'ru', 'ar', 'fa']
const RTL = new Set(['ar', 'fa'])
const OG_LOCALE = { en: 'en_US', ar: 'ar_OM', ru: 'ru_RU', fa: 'fa_IR' }

const langPrefix = (lang) => (lang === 'en' ? '' : `/${lang}`)
const urlFor = (lang, route) =>
  `${SITE}${langPrefix(lang)}${route === '/' ? (lang === 'en' ? '/' : '') : route}`

const esc = (s) =>
  String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const pick = (v, lang) => (v && typeof v === 'object' ? v[lang] || v.en : v)

const template = readFileSync('dist/index.html', 'utf8')

function pageFor(route, lang) {
  const r = ROUTES[route]
  const title = pick(r.title, lang)
  const desc = pick(r.desc, lang)
  const url = urlFor(lang, route)
  let html = template

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"${RTL.has(lang) ? ' dir="rtl"' : ''}`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
  html = html
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${OG_LOCALE[lang]}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)

  // Strip the template's homepage canonical, then emit this page's own
  // canonical + the full hreflang cluster (mirrors SeoManager.setAlternates).
  html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '')
  const links = [
    `<link rel="canonical" href="${url}">`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l, route)}">`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor('en', route)}">`,
  ].join('\n    ')
  html = html.replace('</head>', `    ${links}\n  </head>`)

  // Minimal real content for the crawler's first fetch; React wipes it on mount.
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div dir="${RTL.has(lang) ? 'rtl' : 'ltr'}" style="max-width:760px;margin:0 auto;padding:96px 20px;color:#fff;background:#000;font-family:Inter,system-ui,sans-serif"><h1>${esc(title)}</h1><p>${esc(desc)}</p>${route === '/buy' ? buySeoHtml(lang) : ''}</div></div>`,
  )
  // FAQPage JSON-LD on /buy (same id the SPA reuses → hydration replaces it).
  if (route === '/buy') {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="buy-faq-jsonld">${JSON.stringify(buyFaqJsonLd(lang))}</script>\n  </head>`,
    )
  }
  return html
}

// Crawlable "buy property in Oman" copy + FAQ + guide links for the static
// /buy pages — mirrors the SEO block BuyPage.jsx renders below the grid.
function buySeoHtml(lang) {
  const c = BUY_SEO[lang] || BUY_SEO.en
  const prefix = langPrefix(lang)
  const paras = c.paras.map((p) => `<p>${esc(p)}</p>`).join('')
  const faq = c.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')
  const links = c.links
    .map((l) => `<li><a href="${prefix}${l.href}" style="color:#8c8d25">${esc(l.label)}</a></li>`)
    .join('')
  return `<h2>${esc(c.heading)}</h2>${paras}${faq}<h3>${esc(c.linksHeading)}</h3><ul>${links}</ul>`
}

// /buy/:slug project pages — same selection as api/sitemap.js (projects with
// at least one available unit), same slugify as src/pages/BuyPage.jsx, and the
// same projectMeta templates SeoManager applies client-side. These are the
// money pages (yenaier / yiti query clusters rank pos 6-9 with 0 clicks — the
// generic shell meta was the CTR problem).
const SUPABASE_URL = 'https://owgvrxipqlusepozlujv.supabase.co'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3ZyeGlwcWx1c2Vwb3psdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTYxMjQsImV4cCI6MjA5MjM3MjEyNH0.vZK4z9p9pUF1rZ8LHadFReBcEcwidwy9ZdEXnSmK4Fs'

const slugify = (name) =>
  String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

async function fetchProjects() {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?select=name,project_units!inner(id)&project_units.availability_status=eq.available`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } },
  )
  if (!r.ok) throw new Error(`supabase projects ${r.status}`)
  return (await r.json()).map((p) => p.name).filter(Boolean)
}

function projectPageFor(name, lang) {
  const pm = projectMeta(name)
  const route = `/buy/${slugify(name)}`
  const fake = { title: pm.title, desc: pm.desc }
  // Reuse pageFor by temporarily registering the route meta.
  ROUTES[route] = fake
  const html = pageFor(route, lang)
  delete ROUTES[route]
  return html
}

let count = 0
let skipped = 0
for (const route of Object.keys(ROUTES)) {
  for (const lang of LANGS) {
    // dist/index.html IS the English homepage (and the SPA fallback shell for
    // unknown URLs) — never overwrite it, or every 404/unknown route would
    // carry the homepage canonical again.
    if (route === '/' && lang === 'en') continue
    const segs = route === '/' ? [] : route.split('/').filter(Boolean)
    const out = join('dist', ...(lang === 'en' ? [] : [lang]), ...segs, 'index.html')
    // prerender-insights.mjs already wrote real article pages; /insights index
    // itself is safe, but never clobber an existing file from an earlier step.
    if (existsSync(out)) {
      skipped++
      continue
    }
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, pageFor(route, lang))
    count++
  }
}
let projCount = 0
const names = await fetchProjects()
for (const name of names) {
  const slug = slugify(name)
  for (const lang of LANGS) {
    const out = join('dist', ...(lang === 'en' ? [] : [lang]), 'buy', slug, 'index.html')
    // /buy/hawana-salalah has dedicated ROUTES meta written above — keep it.
    if (existsSync(out)) continue
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, projectPageFor(name, lang))
    projCount++
  }
}
console.log(`prerender-routes: wrote ${count} route pages (${skipped} skipped) + ${projCount} project pages for ${names.length} projects`)
