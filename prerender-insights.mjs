// prerender-insights.mjs — build-time prerender of every published article.
//
// WHY: Search Console showed 42 pages flagged "Duplicate, Google chose
// different canonical" and 59 "Discovered - currently not indexed". The
// site is a client-rendered SPA, so Googlebot's FIRST (unrendered) fetch of
// every URL used to return the identical index.html shell — Google saw 180
// copies of the same page. This script writes a real HTML file per article
// (dist/<lang>/insights/<slug>/index.html) containing the actual title,
// meta description, canonical, hreflang set, JSON-LD and the full article
// body. Vercel serves static files before SPA rewrites, so crawlers get
// unique content on the first fetch; React hydrates over it for users.
//
// Runs after `vite build && node inline-css.mjs` (see package.json).

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { marked } from 'marked'

const SITE = 'https://www.irfaninvest.com'
const SUPABASE_URL = 'https://owgvrxipqlusepozlujv.supabase.co'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3ZyeGlwcWx1c2Vwb3psdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTYxMjQsImV4cCI6MjA5MjM3MjEyNH0.vZK4z9p9pUF1rZ8LHadFReBcEcwidwy9ZdEXnSmK4Fs'

const LANGS = ['en', 'ru', 'ar', 'fa']
const RTL = new Set(['ar', 'fa'])

const langPrefix = (lang) => (lang === 'en' ? '' : `/${lang}`)
const urlFor = (lang, slug) => `${SITE}${langPrefix(lang)}/insights/${slug}`

const esc = (s) =>
  String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

async function fetchAll() {
  const rows = []
  let from = 0
  for (;;) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/insights?published=eq.true&select=slug,lang,title,excerpt,seo_title,seo_description,body_md,cover_image,category,author,tags,reading_minutes,published_at,updated_at&order=published_at.desc&offset=${from}&limit=100`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } },
    )
    if (!r.ok) throw new Error(`supabase ${r.status}`)
    const page = await r.json()
    rows.push(...page)
    if (page.length < 100) break
    from += 100
  }
  return rows
}

// FAQ extraction mirroring the client's InsightDetailPage parser: a "## FAQ"
// section whose "### question" headings each map to an answer paragraph.
function faqFrom(md) {
  const m = String(md || '').split(/^##\s+(?:FAQ|Frequently|سوالات|پرسش|الأسئلة|أسئلة|Часто|Вопросы).*$/im)[1]
  if (!m) return null
  const section = m.split(/^##\s+/m)[0]
  const qa = []
  const parts = section.split(/^###\s+/m).slice(1)
  for (const part of parts) {
    const [q, ...rest] = part.split('\n')
    const ans = rest.join('\n').trim().replace(/\n{2,}[\s\S]*$/, (s) => s)
    const text = rest.join(' ').replace(/\s+/g, ' ').trim()
    if (q?.trim() && text)
      qa.push({
        '@type': 'Question',
        name: q.trim(),
        acceptedAnswer: { '@type': 'Answer', text: text.slice(0, 900) },
      })
  }
  return qa.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa } : null
}

function buildHead(a, langsForSlug) {
  const title = a.seo_title || a.title
  const desc = a.seo_description || a.excerpt || ''
  const url = urlFor(a.lang, a.slug)
  const links = [
    `<link rel="canonical" href="${url}">`,
    ...langsForSlug.map(
      (l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l, a.slug)}">`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(langsForSlug.includes('en') ? 'en' : langsForSlug[0], a.slug)}">`,
  ].join('\n    ')

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: desc,
      image: a.cover_image || `${SITE}/peninsula.jpg`,
      datePublished: a.published_at,
      dateModified: a.updated_at || a.published_at,
      inLanguage: a.lang,
      author: { '@type': 'Organization', name: a.author || 'Irfan Investment Group' },
      publisher: {
        '@type': 'Organization',
        name: 'Irfan Investment Group',
        logo: { '@type': 'ImageObject', url: `${SITE}/logo.svg` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}${langPrefix(a.lang)}/` },
        { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE}${langPrefix(a.lang)}/insights` },
        { '@type': 'ListItem', position: 3, name: a.title, item: url },
      ],
    },
  ]
  const faq = faqFrom(a.body_md)
  if (faq) jsonld.push(faq)

  return { title, desc, url, links, jsonld }
}

function renderArticleHtml(a) {
  const rtl = RTL.has(a.lang)
  const body = marked.parse(String(a.body_md || ''))
  const date = a.published_at ? new Date(a.published_at).toISOString().slice(0, 10) : ''
  // Plain semantic HTML inside #root — React replaces it on hydration; until
  // then (and for crawlers) it IS the page. Minimal inline styling keeps it
  // readable if JS never runs, without fighting the app stylesheet.
  return `
<div dir="${rtl ? 'rtl' : 'ltr'}" style="max-width:760px;margin:0 auto;padding:96px 20px 48px;color:#fff;background:#000;font-family:Inter,system-ui,sans-serif;line-height:1.7">
  <p><a href="${langPrefix(a.lang)}/insights" style="color:#8c8d25">Insights</a></p>
  ${a.category ? `<p style="color:#8c8d25;letter-spacing:.14em;font-size:13px">${esc(a.category)}</p>` : ''}
  <h1>${esc(a.title)}</h1>
  <p style="color:#999">${esc(a.author || 'Irfan Investment Group')}${date ? ' · ' + date : ''}${a.reading_minutes ? ' · ' + a.reading_minutes + ' min' : ''}</p>
  ${a.cover_image ? `<img src="${esc(a.cover_image)}" alt="${esc(a.title)}" style="width:100%;border-radius:16px" />` : ''}
  <article>${body}</article>
</div>`
}

const template = readFileSync('dist/index.html', 'utf8')

function pageFor(a, langsForSlug) {
  const { title, desc, url, links, jsonld } = buildHead(a, langsForSlug)
  let html = template

  // <html lang> + title + description
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${a.lang}"`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${esc(desc)}$2`,
  )
  // OG / twitter — repoint the homepage tags at this article
  html = html
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${esc(a.cover_image || SITE + '/peninsula.jpg')}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${esc(a.cover_image || SITE + '/peninsula.jpg')}$2`)
  // The template carries the HOMEPAGE canonical — strip it, or the article
  // would ship two canonical tags and Google may keep the wrong one (the
  // exact duplicate-canonical problem this script exists to fix).
  html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '')
  // Canonical + hreflang + JSON-LD (same element id the client script reuses,
  // so hydration replaces rather than duplicates it)
  html = html.replace(
    '</head>',
    `    ${links}\n    <script type="application/ld+json" id="insight-jsonld">${JSON.stringify(jsonld)}</script>\n  </head>`,
  )
  // Real content inside #root for the crawler's first fetch
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${renderArticleHtml(a)}</div>`,
  )
  return html
}

const rows = await fetchAll()
const bySlug = new Map()
for (const r of rows) {
  if (!bySlug.has(r.slug)) bySlug.set(r.slug, [])
  bySlug.get(r.slug).push(r)
}

let count = 0
for (const [slug, variants] of bySlug) {
  const langsForSlug = LANGS.filter((l) => variants.some((v) => v.lang === l))
  for (const a of variants) {
    const out = join('dist', ...(a.lang === 'en' ? [] : [a.lang]), 'insights', slug, 'index.html')
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, pageFor(a, langsForSlug))
    count++
  }
}
console.log(`prerender-insights: wrote ${count} article pages for ${bySlug.size} slugs`)
