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
  { path: '/invest', priority: '0.8', changefreq: 'monthly' },
  { path: '/schools', priority: '0.8', changefreq: 'monthly' },
  { path: '/investment', priority: '0.7', changefreq: 'monthly' },
  { path: '/investment/legal', priority: '0.6', changefreq: 'monthly' },
  { path: '/car-import', priority: '0.7', changefreq: 'monthly' },
  { path: '/maison-shirdel', priority: '0.7', changefreq: 'monthly' },
  { path: '/insights', priority: '0.8', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
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
function altBlock(path) {
  const lines = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(loc(l, path))}"/>`,
  )
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(loc('en', path))}"/>`)
  return lines.join('\n')
}

export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10)
  let articlePaths = []
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/insights?select=slug,updated_at,published_at&published=eq.true`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
    )
    const rows = (await r.json()) || []
    const latest = new Map()
    for (const a of rows) {
      if (!a.slug) continue
      const d = (a.updated_at || a.published_at || today).slice(0, 10)
      if (!latest.has(a.slug) || d > latest.get(a.slug)) latest.set(a.slug, d)
    }
    articlePaths = [...latest.entries()].map(([slug, lastmod]) => ({
      path: `/insights/${slug}`, lastmod, priority: '0.7', changefreq: 'monthly',
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
      projectPaths.push({ path: `/buy/${slug}`, lastmod: today, priority: '0.8', changefreq: 'weekly' })
    }
  } catch {
    /* still serve static + article routes */
  }

  const logical = [
    ...STATIC.map((s) => ({ ...s, lastmod: today })),
    ...projectPaths,
    ...articlePaths,
  ]

  const urls = []
  for (const p of logical) {
    const alts = altBlock(p.path)
    for (const lang of LANGS) {
      const href = loc(lang, p.path)
      urls.push(
        `  <url>\n    <loc>${esc(href)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n${alts}\n  </url>`,
      )
    }
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
