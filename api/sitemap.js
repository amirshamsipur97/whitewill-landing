// Dynamic multilingual sitemap.xml — served at /sitemap.xml via vercel.json.
// Emits every static route + every PUBLISHED blog article, in ALL 4 languages
// (en at /path, ar/ru/fa at /{lang}/path), each <url> annotated with the full
// set of hreflang <xhtml:link> alternates + x-default (Google's recommended
// multilingual sitemap form). New articles the SEO agent publishes appear
// automatically.

const SUPABASE_URL = 'https://owgvrxipqlusepozlujv.supabase.co'
const ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3ZyeGlwcWx1c2Vwb3psdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTYxMjQsImV4cCI6MjA5MjM3MjEyNH0.vZK4z9p9pUF1rZ8LHadFReBcEcwidwy9ZdEXnSmK4Fs'
const SITE = 'https://www.irfaninvest.com'

const LANGS = ['en', 'ar', 'ru', 'fa']
const PREFIX = { en: '', ar: '/ar', ru: '/ru', fa: '/fa' }

const STATIC = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/buy', priority: '0.9', changefreq: 'weekly' },
  // The unit-level search portal (400+ listings) — was missing entirely, so
  // the site's main "apartments for sale in muscat" asset was never submitted.
  { path: '/project', priority: '0.9', changefreq: 'daily' },
  // Head-term city/type landings.
  { path: '/buy-property-in-muscat', priority: '0.9', changefreq: 'weekly' },
  { path: '/buy-apartment-in-muscat', priority: '0.9', changefreq: 'weekly' },
  { path: '/buy-property-in-salalah', priority: '0.8', changefreq: 'weekly' },
  // Per-m² price index — the linkable data asset. Recomputed from live
  // inventory on every load, so it genuinely changes weekly.
  { path: '/property-prices-in-oman', priority: '0.8', changefreq: 'weekly' },
  // Low competition + 175% YoY growth on the golden-visa cluster, and the
  // only page on the site targeting residency intent.
  { path: '/oman-golden-visa', priority: '0.9', changefreq: 'weekly' },
  // Persian-only segment landing (Iranians resident in the UAE). `langs`
  // keeps the other three out of the sitemap — they are not served either,
  // see the vercel.json allowlist.
  { path: '/oman-property-for-iranians-in-uae', priority: '0.8', changefreq: 'monthly', langs: ['fa'] },
  { path: '/invest', priority: '0.8', changefreq: 'monthly' },
  { path: '/schools', priority: '0.8', changefreq: 'monthly' },
  { path: '/investment', priority: '0.7', changefreq: 'monthly' },
  { path: '/investment/legal', priority: '0.6', changefreq: 'monthly' },
  { path: '/car-import', priority: '0.7', changefreq: 'monthly' },
  { path: '/maison-shirdel', priority: '0.7', changefreq: 'monthly' },
  { path: '/insights', priority: '0.8', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
]

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
// MUST match src/pages/BuyPage.jsx slugify so sitemap URLs equal the real routes.
function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
function loc(lang, path) {
  const pre = PREFIX[lang] || ''
  return path === '/' ? SITE + (pre || '/') : SITE + pre + path
}
// `langs` defaults to all four; articles pass only the languages they exist in.
function altBlock(path, langs = LANGS) {
  const lines = langs.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(loc(l, path))}"/>`,
  )
  const xdef = langs.includes('en') ? 'en' : langs[0]
  if (xdef) lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(loc(xdef, path))}"/>`)
  return lines.join('\n')
}

// Prerendered pages only change when the site is rebuilt. Vercel exposes the
// deployment's git SHA/time; fall back to today when running locally.
const BUILD_DATE = (process.env.VERCEL_DEPLOYMENT_CREATED_AT
  ? new Date(Number(process.env.VERCEL_DEPLOYMENT_CREATED_AT))
  : new Date()
).toISOString().slice(0, 10)

export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10)
  let articlePaths = []
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/insights?select=slug,lang,updated_at,published_at&published=eq.true`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
    )
    const rows = (await r.json()) || []
    // Track WHICH languages each slug was actually written in. Emitting all 4
    // for every slug submitted URLs like /ru/insights/<en-only-slug>, which
    // have no prerendered file and fall through to the SPA shell — a 200 that
    // carries the HOMEPAGE canonical, i.e. a self-inflicted
    // "Duplicate, Google chose different canonical".
    const latest = new Map()
    const langsFor = new Map()
    for (const a of rows) {
      if (!a.slug) continue
      const d = (a.updated_at || a.published_at || today).slice(0, 10)
      if (!latest.has(a.slug) || d > latest.get(a.slug)) latest.set(a.slug, d)
      if (!langsFor.has(a.slug)) langsFor.set(a.slug, new Set())
      if (a.lang) langsFor.get(a.slug).add(a.lang)
    }
    articlePaths = [...latest.entries()].map(([slug, lastmod]) => ({
      path: `/insights/${slug}`,
      lastmod,
      priority: '0.7',
      changefreq: 'monthly',
      langs: LANGS.filter((l) => langsFor.get(slug)?.has(l)),
    }))
  } catch {
    /* still serve static routes */
  }

  // Project detail pages (/buy/:slug) — only projects that have at least one
  // available unit (content-rich, worth indexing). Slug must match the route.
  let projectPaths = []
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/projects?select=name,project_units!inner(id)&project_units.availability_status=eq.available`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
    )
    const rows = (await r.json()) || []
    const seen = new Set()
    for (const p of rows) {
      const slug = slugify(p.name)
      if (!slug || seen.has(slug)) continue
      seen.add(slug)
      projectPaths.push({ path: `/buy/${slug}`, lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' })
    }
  } catch {
    /* still serve static + article routes */
  }

  // Individual unit pages (/property/:id) — the deep long-tail inventory.
  // English only, matching prerender-routes.mjs, so these are emitted WITHOUT
  // hreflang alternates (the localized variants are not prerendered).
  // Only the REPRESENTATIVE of each near-identical group is submitted: the
  // duplicates canonicalize to it (see prerender-routes.mjs), and submitting a
  // canonicalized URL is a conflicting signal.
  let unitPaths = []
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/project_units?select=id,unit_type,bedrooms,price_omr,project_id&availability_status=eq.available&limit=2000`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
    )
    const rows = (await r.json()) || []
    const typeGroup = (t) => {
      const s = String(t || '')
      if (/villa/i.test(s)) return 'Villa'
      if (/penthouse/i.test(s)) return 'Penthouse'
      if (/town\s*house|townhouse/i.test(s)) return 'Townhouse'
      if (/chalet/i.test(s)) return 'Chalet'
      if (/studio/i.test(s)) return 'Studio'
      return 'Apartment'
    }
    const rep = new Map()
    for (const u of rows) {
      if (u?.id == null) continue
      const k = `${u.project_id}|${typeGroup(u.unit_type)}|${u.bedrooms ?? 0}|${Math.round(Number(u.price_omr))}`
      const cur = rep.get(k)
      if (!cur || u.id < cur.id) rep.set(k, u)
    }
    unitPaths = [...rep.values()].map((u) => ({
      path: `/property/${u.id}`, lastmod: BUILD_DATE, priority: '0.6', changefreq: 'weekly',
    }))
  } catch {
    /* still serve the rest */
  }

  const logical = [
    ...STATIC.map((s) => ({ ...s, lastmod: BUILD_DATE })),
    ...projectPaths,
    ...articlePaths,
  ]

  const urls = []
  for (const p of logical) {
    // Only emit the languages this path actually has a page for.
    const langs = p.langs?.length ? p.langs : LANGS
    const alts = altBlock(p.path, langs)
    for (const lang of langs) {
      const href = loc(lang, p.path)
      urls.push(
        `  <url>\n    <loc>${esc(href)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n${alts}\n  </url>`,
      )
    }
  }
  for (const p of unitPaths) {
    urls.push(
      `  <url>\n    <loc>${esc(loc('en', p.path))}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
    )
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls.join('\n') +
    `\n</urlset>\n`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  res.status(200).send(body)
}
