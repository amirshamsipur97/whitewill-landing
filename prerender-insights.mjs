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
import { POPULAR, COMMUNITIES, PROJECTS, servicesFor, footerSeoCopy } from './src/footerSeoLinks.mjs'
import { clusterHead, slugForLang, clusterLangs } from './src/insightAliases.mjs'

const SITE = 'https://www.irfaninvest.com'
const SUPABASE_URL = 'https://owgvrxipqlusepozlujv.supabase.co'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3ZyeGlwcWx1c2Vwb3psdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTYxMjQsImV4cCI6MjA5MjM3MjEyNH0.vZK4z9p9pUF1rZ8LHadFReBcEcwidwy9ZdEXnSmK4Fs'

const LANGS = ['en', 'ru', 'ar', 'fa']
const RTL = new Set(['ar', 'fa'])

const langPrefix = (lang) => (lang === 'en' ? '' : `/${lang}`)
// Alias-aware: asks insightAliases which slug THIS language publishes under,
// so a cluster split across two slugs still emits one correct hreflang set.
const urlFor = (lang, slug) => `${SITE}${langPrefix(lang)}/insights/${slugForLang(slug, lang)}`

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


// Mirror of footerLinksHtml() in prerender-routes.mjs. Without it an article's
// static HTML linked only to other articles, so 119 pages of blog equity never
// reached /project, /buy or the head-term landings until React mounted.
function footerLinksHtml(lang) {
  const c = footerSeoCopy(lang)
  const prefix = langPrefix(lang)
  const list = (items) => `<ul>${items.map((i) => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join('')}</ul>`
  return (
    `<h2>${esc(c.headings.popular)}</h2>` +
    list(POPULAR.map((x) => ({ href: `${prefix}${x.to}`, label: c.popular[x.key] }))) +
    `<h2>${esc(c.headings.communities)}</h2>` +
    list(COMMUNITIES.map((a) => ({ href: `${prefix}/project?area=${encodeURIComponent(a.area)}`, label: c.community.replace('{area}', a.label) }))) +
    `<h2>${esc(c.headings.projects)}</h2>` +
    list(PROJECTS.map((x) => ({ href: `${prefix}/buy/${x.slug}`, label: c.project.replace('{name}', x.name) }))) +
    `<h2>${esc(c.headings.services)}</h2>` +
    list(servicesFor(lang).map((s) => ({ href: `${prefix}${s.to}`, label: c.services[s.key] })))
  )
}

// The page chrome already prints the article title as the <h1>. Several
// article bodies ALSO open with a markdown `# Title` line, which marked would
// render as a second, identical <h1>.
//
// 🔑 This only ever broke the STATIC shell, which is the version a crawler
// reads: the client renderer (components/insights/Markdown.jsx) has always
// mapped h1 to an h2, so a human never saw it and it survived unnoticed until
// a site-wide audit on 2026-08-30 counted 40 pages across 17 slugs with two
// h1s. Demote here so the shell matches what React hydrates to, and so any
// future article that includes its own title line is covered without an edit
// to the row.
const mdRenderer = new marked.Renderer()
mdRenderer.heading = function (text, level, raw) {
  const l = level === 1 ? 2 : level
  const id = String(raw || '')
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\u0400-\u04FF]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `<h${l}${id ? ` id="${id}"` : ''}>${text}</h${l}>\n`
}

function renderArticleHtml(a) {
  const rtl = RTL.has(a.lang)
  const body = marked.parse(String(a.body_md || ''), { renderer: mdRenderer })
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
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${a.lang}"${RTL.has(a.lang) ? ' dir="rtl"' : ''}`)
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
    `<div id="root">${renderArticleHtml(a)}${footerLinksHtml(a.lang)}</div>`,
  )
  return html
}

const rows = await fetchAll()
const bySlug = new Map()
for (const r of rows) {
  if (!bySlug.has(r.slug)) bySlug.set(r.slug, [])
  bySlug.get(r.slug).push(r)
}
// True language coverage per ARTICLE, not per slug: a cluster split across two
// slugs (see src/insightAliases.mjs) counts as one article in four languages.
const langsByHead = clusterLangs(rows)

// ── Missing language editions ────────────────────────────────────────────────
// WHY: vercel.json rewrites /:lang/insights/:slug to the SPA shell for any
// slug, so a language edition that was never written still answered HTTP 200
// with the English homepage <title>, canonical="/" and robots="index, follow".
// A 2026-09-09 audit found 26 such URLs. They are textbook soft 404s, and the
// canonical pointing at the homepage is worse than the 200 itself.
//
// They are NOT in the sitemap, but Google reaches them anyway: it guesses
// localized variants of URLs it already knows, and any mistyped internal or
// external link lands here. So write a REAL page for each: noindex so it can
// never be indexed, follow so any inbound equity still flows, no canonical at
// all (a self-canonical on a noindex page is noise, and the homepage canonical
// was the bug), and a list of the editions that DO exist so a reader who
// arrived in the wrong language is one click from the right one.
//
// A static file wins over a rewrite in Vercel's pipeline, so these serve
// without touching vercel.json. Redirects run BEFORE the filesystem, so any
// combination already 301'd there keeps redirecting; those are skipped below
// purely so the build does not write files nothing can ever reach.
const redirectedPaths = new Set(
  (JSON.parse(readFileSync('vercel.json', 'utf8')).redirects || [])
    .map((r) => r.source)
    .filter((p) => p.includes('/insights/')),
)

const STUB_COPY = {
  en: { h: 'This guide is not available in English', p: 'It is published in the languages below.', o: 'Other languages', i: 'All insights', b: 'Back to home' },
  ru: { h: 'Этот материал недоступен на русском', p: 'Он опубликован на языках ниже.', o: 'Другие языки', i: 'Все материалы', b: 'На главную' },
  ar: { h: 'هذا الدليل غير متوفر بالعربية', p: 'وهو منشور باللغات التالية.', o: 'لغات أخرى', i: 'كل المقالات', b: 'الصفحة الرئيسية' },
  fa: { h: 'این راهنما به فارسی موجود نیست', p: 'این مطلب به زبان‌های زیر منتشر شده است.', o: 'زبان‌های دیگر', i: 'همه مقالات', b: 'صفحه اصلی' },
}
const LANG_NAME = { en: 'English', ru: 'Русский', ar: 'العربية', fa: 'فارسی' }

function stubPage(lang, headSlug, availableLangs, titleByLang) {
  const c = STUB_COPY[lang]
  const rtl = RTL.has(lang)
  let html = template
  const title = `${c.h} | Irfan Investment Group`
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"${rtl ? ' dir="rtl"' : ''}`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(c.p)}$2`)
  // The template ships the HOMEPAGE canonical. On a page that does not exist in
  // this language that tag was actively telling Google "this URL is the
  // homepage". Strip it and add none.
  html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '')
  html = html.replace(/<meta name="robots"[^>]*>\s*/g, '')
  html = html.replace(
    '</head>',
    `    <meta name="robots" content="noindex,follow">\n` +
      availableLangs
        .map((l) => `    <link rel="alternate" hreflang="${l}" href="${urlFor(l, headSlug)}">`)
        .join('\n') +
      `\n  </head>`,
  )
  const links = availableLangs
    .map(
      (l) =>
        `<li><a href="${langPrefix(l)}/insights/${slugForLang(headSlug, l)}" style="color:#8c8d25">${LANG_NAME[l]}: ${esc(titleByLang[l] || headSlug)}</a></li>`,
    )
    .join('')
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div dir="${rtl ? 'rtl' : 'ltr'}" style="max-width:680px;margin:0 auto;padding:96px 20px 48px;color:#fff;background:#000;font-family:Inter,system-ui,sans-serif;line-height:1.7">` +
      `<h1>${esc(c.h)}</h1><p style="color:#999">${esc(c.p)}</p>` +
      `<h2>${esc(c.o)}</h2><ul>${links}</ul>` +
      `<p><a href="${langPrefix(lang)}/insights" style="color:#8c8d25">${esc(c.i)}</a> · <a href="${langPrefix(lang)}/" style="color:#8c8d25">${esc(c.b)}</a></p>` +
      `</div></div>`,
  )
  return html
}

let count = 0
let stubs = 0
const writtenHeads = new Set()
for (const [slug, variants] of bySlug) {
  const head = clusterHead(slug)
  const langsForSlug = LANGS.filter((l) => langsByHead.get(head)?.has(l))
  for (const a of variants) {
    const out = join('dist', ...(a.lang === 'en' ? [] : [a.lang]), 'insights', slug, 'index.html')
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, pageFor(a, langsForSlug))
    count++
  }

  // One stub pass per cluster, not per slug, or an aliased cluster would write
  // the same missing language twice under two different slugs.
  if (writtenHeads.has(head)) continue
  writtenHeads.add(head)
  const titleByLang = {}
  for (const r of rows) if (clusterHead(r.slug) === head) titleByLang[r.lang] = r.title
  for (const lang of LANGS) {
    if (langsForSlug.includes(lang)) continue
    const path = `${langPrefix(lang)}/insights/${slugForLang(head, lang)}`
    if (redirectedPaths.has(path)) continue
    const out = join('dist', ...(lang === 'en' ? [] : [lang]), 'insights', slugForLang(head, lang), 'index.html')
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, stubPage(lang, head, langsForSlug, titleByLang))
    stubs++
  }
}
console.log(
  `prerender-insights: wrote ${count} article pages for ${bySlug.size} slugs, ` +
    `plus ${stubs} noindex stubs for missing language editions`,
)
