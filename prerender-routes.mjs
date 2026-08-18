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
import {
  copy as uaeCopy, links as uaeLinks,
  faqJsonLd as uaeFaqJsonLd, breadcrumbJsonLd as uaeBreadcrumbJsonLd,
} from './src/data/iraniansUaeContent.mjs'
import { PROJECT_SEO, projectFaqJsonLd } from './src/projectSeoContent.mjs'
import { LANDINGS, landingCopy, landingFaqJsonLd } from './src/cityLandingContent.mjs'
import { POPULAR, COMMUNITIES, PROJECTS, servicesFor, footerSeoCopy } from './src/footerSeoLinks.mjs'
import { buildPriceIndex, fmtInt, fmtOmr, fmtRange, fmtSqm } from './src/priceIndexData.mjs'
import { priceIndexCopy, priceIndexFaqJsonLd, priceIndexJsonLd, fill } from './src/priceIndexContent.mjs'
import { buildGoldenVisa, TIER_5_OMR, TIER_10_OMR } from './src/goldenVisaData.mjs'
import { goldenVisaCopy, goldenVisaFaqJsonLd, goldenVisaJsonLd, fill as gvFill } from './src/goldenVisaContent.mjs'

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

// dist/index.html doubles as (a) the English homepage and (b) the SPA fallback
// every unknown URL falls through to. Those two jobs conflict: leaving it empty
// so 404s stay contentless meant the site's priority-1.0 page shipped
// `<div id="root"></div>` with no h1, copy or links, while /ar /ru /fa
// homepages were fully prerendered. Fix: write the pristine shell to
// dist/app.html and repoint vercel.json's catch-all rewrite there, freeing
// index.html to carry real homepage content.
writeFileSync('dist/app.html', template)

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
  // A route may declare `langs` to restrict itself to a subset (the Persian-only
  // UAE landing does). The hreflang cluster must then advertise only those
  // languages, and x-default falls to the first of them when en is not one.
  const routeLangs = r.langs?.length ? r.langs : LANGS
  const links = [
    `<link rel="canonical" href="${url}">`,
    ...routeLangs.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l, route)}">`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(routeLangs.includes('en') ? 'en' : routeLangs[0], route)}">`,
  ].join('\n    ')
  html = html.replace('</head>', `    ${links}\n  </head>`)

  // Minimal real content for the crawler's first fetch; React wipes it on mount.
  // The price index is the one LIGHT page on the site (Perumnas Figma kit), so
  // its shell must not flash a black box before React takes over.
  const light = route === PRICE_INDEX_ROUTE || route === GOLDEN_VISA_ROUTE
  const inner = light
    ? 'max-width:1100px;margin:0 auto;padding:96px 24px'
    : 'max-width:760px;margin:0 auto;padding:96px 20px'
  const body =
    `<h1>${esc(title.split('|')[0].trim())}</h1><p>${esc(desc)}</p>` +
    (route === '/buy' ? buySeoHtml(lang) : '') +
    (route === '/project' ? projectSeoHtml(lang) : '') +
    (LANDINGS[route.slice(1)] ? landingSeoHtml(route.slice(1), lang) : '') +
    (route === PRICE_INDEX_ROUTE ? priceIndexHtml(lang) : '') +
    (route === GOLDEN_VISA_ROUTE ? goldenVisaHtml(lang) : '') +
    (route === UAE_ROUTE ? iraniansUaeHtml() : '') +
    footerLinksHtml(lang)
  // The light page needs a FULL-BLEED white backdrop: the global stylesheet
  // paints body black, so a centred max-width block alone would sit between
  // two black bars until React mounts.
  const wrap = light
    ? `<div style="background:#fff;color:#12161D;min-height:100vh"><div style="${inner}">${body}</div></div>`
    : `<div style="${inner};color:#fff;background:#000">${body}</div>`
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div dir="${RTL.has(lang) ? 'rtl' : 'ltr'}" style="font-family:Inter,system-ui,sans-serif">${wrap}</div></div>`,
  )
  // FAQPage JSON-LD on /buy (same id the SPA reuses → hydration replaces it).
  if (route === '/buy') {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="buy-faq-jsonld">${JSON.stringify(buyFaqJsonLd(lang))}</script>\n  </head>`,
    )
  }
  if (route === '/project') {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="project-faq-jsonld">${JSON.stringify(projectFaqJsonLd(lang))}</script>\n  </head>`,
    )
  }
  // Project pages: RealEstateListing + AggregateOffer + Breadcrumb from live
  // inventory. BuyProjectPage.jsx emits these CLIENT-SIDE only, so all nine
  // money pages shipped no product markup on a crawler's first fetch.
  const pslug = route.startsWith('/buy/') ? route.slice(5) : null
  const agg = pslug ? aggBySlug.get(pslug) : null
  if (agg && agg.count > 0) {
    const purl = urlFor(lang, route)
    const pld = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'RealEstateListing',
          '@id': `${purl}#listing`,
          url: purl,
          name: agg.name,
          description: desc,
          ...(agg.min > 0 ? {
            offers: {
              '@type': 'AggregateOffer', priceCurrency: 'OMR',
              lowPrice: agg.min, ...(agg.max > 0 ? { highPrice: agg.max } : {}),
              offerCount: agg.count, availability: 'https://schema.org/InStock',
              seller: { '@id': `${SITE}/#organization` },
            },
          } : {}),
          ...(agg.area ? { address: { '@type': 'PostalAddress', addressLocality: agg.area, addressCountry: 'OM' } } : {}),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}${langPrefix(lang)}/` },
            { '@type': 'ListItem', position: 2, name: 'Buy', item: `${SITE}${langPrefix(lang)}/buy` },
            { '@type': 'ListItem', position: 3, name: agg.name, item: purl },
          ],
        },
      ],
    }
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(pld)}</script>\n  </head>`)
  }
  if (LANDINGS[route.slice(1)]) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="landing-faq-jsonld">${JSON.stringify(landingFaqJsonLd(route.slice(1), lang))}</script>\n  </head>`,
    )
  }
  // Price index: Dataset + Breadcrumb + FAQ, with the BUILD-TIME figures baked
  // in. Same script ids PriceIndexPage.jsx uses, so hydration replaces rather
  // than duplicates them.
  if (route === PRICE_INDEX_ROUTE && priceIndex.units > 0) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="price-index-faq-jsonld">${JSON.stringify(priceIndexFaqJsonLd(lang))}</script>\n` +
      `    <script type="application/ld+json" id="price-index-dataset-jsonld">${JSON.stringify(priceIndexJsonLd(lang, priceIndex, BUILD_DAY))}</script>\n  </head>`,
    )
  }
  if (route === UAE_ROUTE) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="iranians-uae-faq-jsonld">${JSON.stringify(uaeFaqJsonLd())}</script>\n` +
      `    <script type="application/ld+json" id="iranians-uae-breadcrumb-jsonld">${JSON.stringify(uaeBreadcrumbJsonLd())}</script>\n  </head>`,
    )
  }
  if (route === GOLDEN_VISA_ROUTE && goldenVisa.units > 0) {
    const v = gvVars(lang)
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="gv-faq-jsonld">${JSON.stringify(goldenVisaFaqJsonLd(lang, v))}</script>\n` +
      `    <script type="application/ld+json" id="gv-howto-jsonld">${JSON.stringify(goldenVisaJsonLd(lang, v))}</script>\n  </head>`,
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

// Same pattern for /project — the search portal had no crawlable body copy at
// all, which is why it never competed with Bayut/Dubizzle/Vista for the
// "apartments for sale in muscat" cluster.
function projectSeoHtml(lang) {
  const c = PROJECT_SEO[lang] || PROJECT_SEO.en
  const prefix = langPrefix(lang)
  const paras = c.paras.map((p) => `<p>${esc(p)}</p>`).join('')
  const faq = c.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')
  const links = c.links
    .map((l) => `<li><a href="${prefix}${l.href}" style="color:#8c8d25">${esc(l.label)}</a></li>`)
    .join('')
  return `<h2>${esc(c.heading)}</h2>${paras}${faq}<h3>${esc(c.linksHeading)}</h3><ul>${links}</ul>`
}

// Head-term landings (/buy-property-in-muscat, /buy-apartment-in-muscat,
// /buy-property-in-salalah). The listing grid renders client-side; what the
// crawler needs on the first fetch is the copy, the community links and the
// FAQ — the same shape that makes /buy the site's strongest SEO page.
function landingSeoHtml(slug, lang) {
  const c = landingCopy(slug, lang)
  if (!c) return ''
  const cfg = LANDINGS[slug]
  const prefix = langPrefix(lang)
  const paras = c.paras.map((p) => `<p>${esc(p)}</p>`).join('')
  const faq = c.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')
  const areas = (cfg.areaLinks || [])
    .map((a) => `<li><a href="${prefix}/project?area=${encodeURIComponent(a.area)}" style="color:#8c8d25">${esc(a.label)}</a></li>`)
    .join('')
  const links = c.links
    .map((l) => `<li><a href="${prefix}${l.href}" style="color:#8c8d25">${esc(l.label)}</a></li>`)
    .join('')
  return (
    `<p>${esc(c.lead)}</p>` +
    (areas ? `<h2>${esc(c.areasHeading)}</h2><ul>${areas}</ul>` : '') +
    `<h2>${esc(c.heading)}</h2>${paras}${faq}` +
    `<h3>${esc(c.linksHeading)}</h3><ul>${links}</ul>`
  )
}

// ── /property-prices-in-oman ───────────────────────────────────────────────
// The one page on this site built to be CITED rather than browsed, so its
// numbers must exist in the HTML a crawler (or a journalist's reader-mode)
// gets on the first fetch — a client-only table is worth nothing as a linkable
// asset. Computed from the SAME module the React page uses, over the SAME
// inventory fetch that feeds the /buy/:slug AggregateOffer.
const PRICE_INDEX_ROUTE = '/property-prices-in-oman'
const GOLDEN_VISA_ROUTE = '/oman-golden-visa'
const UAE_ROUTE = '/oman-property-for-iranians-in-uae'

// Crawlable body for the Persian-only UAE landing. The React page is a stack
// of MUI cards, so without this the crawler's first fetch would be an h1, a
// meta description and a footer: no comparison table, no FAQ, no outbound
// links. Everything here is the SAME data the page renders, never a second
// version of it. Persian only, so it takes no `lang` argument.
function iraniansUaeHtml() {
  const p = langPrefix('fa')
  const why = uaeCopy.why.map((w) => `<h3>${esc(w.title)}</h3><p>${esc(w.body)}</p>`).join('')
  const rows = uaeCopy.compareRows
    .map((r) => `<tr><td>${esc(r.k)}</td><td>${esc(r.uae)}</td><td>${esc(r.om)}</td></tr>`)
    .join('')
  const table =
    `<table><thead><tr>${uaeCopy.compareCols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>` +
    `<tbody>${rows}</tbody></table>`
  const bands = uaeCopy.bands
    .map((b) => `<h3>${esc(b.range)}</h3><p>${esc(b.omr)} · ${esc(b.count)}. ${esc(b.body)}</p>`)
    .join('')
  const steps = uaeCopy.steps.map((s) => `<li>${esc(s)}</li>`).join('')
  const faq = uaeCopy.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')
  const items = uaeLinks.items
    .map((l) => `<li><a href="${p}${l.href}" style="color:#8c8d25">${esc(l.label)}</a></li>`)
    .join('')
  const terms = uaeCopy.terms.map((t) => `<li>${esc(t)}</li>`).join('')
  return (
    `<p><strong>${esc(uaeCopy.answerLabel)}:</strong> ${esc(uaeCopy.answer)}</p>` +
    `<p>${esc(uaeCopy.lead)}</p>` +
    `<h2>${esc(uaeCopy.whyTitle)}</h2><p>${esc(uaeCopy.whyIntro)}</p>${why}` +
    `<h2>${esc(uaeCopy.termsTitle)}</h2><p>${esc(uaeCopy.termsIntro)}</p><ul>${terms}</ul>` +
    `<h2>${esc(uaeCopy.compareTitle)}</h2><p>${esc(uaeCopy.compareNote)}</p>${table}` +
    `<p>${esc(uaeCopy.compareSource)}</p>` +
    `<h2>${esc(uaeCopy.bandsTitle)}</h2>${bands}` +
    `<h2>${esc(uaeCopy.stepsTitle)}</h2><ol>${steps}</ol><p>${esc(uaeCopy.stepsNote)}</p>` +
    `<h2>${esc(uaeCopy.faqTitle)}</h2>${faq}` +
    `<h2>${esc(uaeLinks.heading)}</h2><ul>${items}</ul>`
  )
}
const BUILD_DAY = (process.env.VERCEL_DEPLOYMENT_CREATED_AT
  ? new Date(Number(process.env.VERCEL_DEPLOYMENT_CREATED_AT))
  : new Date()
).toISOString().slice(0, 10)

function priceIndexHtml(lang) {
  const idx = priceIndex
  if (!idx.units) return ''
  const c = priceIndexCopy(lang)
  const prefix = langPrefix(lang)
  const vars = {
    units: fmtInt(idx.units), areas: idx.areas, projects: idx.projects,
    updated: BUILD_DAY, excluded: idx.plotExcluded,
  }

  // Table chrome mirrors the "Tables design samples" Figma kit: no container
  // border, small grey column labels, ONE heavy rule under the header and
  // hairline row dividers. Same look the React page renders after hydration.
  const dagger = (r) => (r.thin ? '<sup>†</sup>' : '')
  const table = (head, rows) =>
    `<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:15px">` +
    `<thead><tr>${head.map((h) => `<th style="text-align:start;padding:12px 14px;color:#61656E;font-weight:400;border-bottom:2px solid #12161D">${esc(h)}</th>`).join('')}</tr></thead>` +
    `<tbody>${rows
      .map((cells) => `<tr>${cells.map((v) => `<td style="padding:15px 14px;border-bottom:1px solid #E5E5E6">${v}</td>`).join('')}</tr>`)
      .join('')}</tbody></table></div>`

  const areaTable = table(
    [c.cols.area, c.cols.city, c.cols.units, c.cols.medianPpsm, c.cols.rangePpsm, c.cols.medianPrice, c.cols.typicalSize],
    idx.byArea.map((a) => [
      `<a href="${prefix}/project?area=${encodeURIComponent(a.key)}" style="color:#6f7020">${esc(a.label)}</a>${dagger(a)}`,
      esc(a.city || '–'), fmtInt(a.n), `<strong>${fmtInt(a.medianPpsm)}</strong>`,
      esc(fmtRange(a.minPpsm, a.maxPpsm)), esc(fmtOmr(a.medianPrice)), esc(fmtSqm(a.medianArea)),
    ]),
  )
  const typeTable = table(
    [c.cols.type, c.cols.units, c.cols.medianPpsm, c.cols.rangePpsm, c.cols.medianPrice, c.cols.from, c.cols.typicalSize],
    idx.byType.map((t) => [
      esc(t.label) + dagger(t), fmtInt(t.n), `<strong>${fmtInt(t.medianPpsm)}</strong>`,
      esc(fmtRange(t.minPpsm, t.maxPpsm)), esc(fmtOmr(t.medianPrice)), esc(fmtOmr(t.minPrice)), esc(fmtSqm(t.medianArea)),
    ]),
  )
  const bedTable = table(
    [c.cols.beds, c.cols.units, c.cols.medianPpsm, c.cols.medianPrice, c.cols.from, c.cols.typicalSize],
    idx.byBeds.map((b) => [
      esc(b.key === '0' ? c.studio : b.key) + dagger(b), fmtInt(b.n), `<strong>${fmtInt(b.medianPpsm)}</strong>`,
      esc(fmtOmr(b.medianPrice)), esc(fmtOmr(b.minPrice)), esc(fmtSqm(b.medianArea)),
    ]),
  )
  const projTable = table(
    [c.cols.project, c.cols.area, c.cols.units, c.cols.medianPpsm, c.cols.rangePpsm, c.cols.from],
    idx.byProject.map((p) => [
      `<a href="${prefix}/buy/${p.slug}" style="color:#6f7020">${esc(p.label)}</a>${dagger(p)}`,
      esc(p.area || '–'), fmtInt(p.n), `<strong>${fmtInt(p.medianPpsm)}</strong>`,
      esc(fmtRange(p.minPpsm, p.maxPpsm)), esc(fmtOmr(p.minPrice)),
    ]),
  )
  const cityTable = table(
    [c.cols.city, c.citiesCol, c.cols.units, c.cols.medianPpsm, c.cols.rangePpsm, c.cols.medianPrice, c.cols.from],
    idx.byCity.map((x) => [
      `<strong>${esc(x.label)}</strong>${dagger(x)}`, esc((x.areas || []).join(', ') || '–'),
      fmtInt(x.n), `<strong>${fmtInt(x.medianPpsm)}</strong>`,
      esc(fmtRange(x.minPpsm, x.maxPpsm)), esc(fmtOmr(x.medianPrice)), esc(fmtOmr(x.minPrice)),
    ]),
  )

  // Same anchors the React page renders, so a crawler that never executes JS
  // still sees the section structure and the in-page links.
  const toc =
    `<h2>${esc(c.tocHeading)}</h2><ol>` +
    [
      ['#by-community', c.areasHeading], ['#by-city', c.citiesHeading],
      ['#by-type', c.typesHeading], ['#by-bedrooms', c.bedsHeading],
      ['#by-development', c.projectsHeading], ['#method', c.methodHeading],
      ['#analysis', c.heading], ['#faq', c.ui.faqHeading], ['#cite', c.citeHeading],
    ].map(([h, l]) => `<li><a href="${h}" style="color:#6f7020">${esc(l)}</a></li>`).join('') +
    `</ol>`

  // The citation string is built from the same build-time figures as the
  // tables, so the static copy can never quote a number the page does not show.
  const citation =
    `Irfan Investment Group, Oman Property Price Index, ${BUILD_DAY}. ` +
    `Median ${fmtInt(idx.overall.medianPpsm)} OMR per m² across ${fmtInt(idx.units)} freehold homes ` +
    `listed for sale in ${fmtInt(idx.areas)} Omani communities open to foreign buyers. ` +
    `https://www.irfaninvest.com/property-prices-in-oman`
  const cite =
    `<h2 id="cite">${esc(c.citeHeading)}</h2><p>${esc(c.citeIntro)}</p>` +
    `<p><strong>${esc(c.citeLabel)}</strong></p><blockquote>${esc(citation)}</blockquote>` +
    `<p><strong>${esc(c.citeDataLabel)}</strong></p><p>${esc(c.citeDataNote)}</p>` +
    `<p><a href="/api/price-index.json" style="color:#6f7020">/api/price-index.json</a></p>`

  const stats =
    `<ul><li><strong>${fmtInt(idx.units)}</strong> ${esc(c.stats.units)}</li>` +
    `<li><strong>${fmtInt(idx.areas)}</strong> ${esc(c.stats.areas)}</li>` +
    `<li><strong>${fmtInt(idx.overall.medianPpsm)}</strong> ${esc(c.stats.median)}</li>` +
    `<li><strong>${esc(fmtOmr(idx.overall.minPrice))}</strong> ${esc(c.stats.entry)}</li></ul>`

  const paras = (list) => list.map((p) => `<p>${esc(fill(p, vars))}</p>`).join('')
  const links = c.links
    .map((l) => `<li><a href="${prefix}${l.href}" style="color:#8c8d25">${esc(l.label)}</a></li>`)
    .join('')

  return (
    `<p>${esc(fill(c.lead, vars))}</p>` +
    `<p>${esc(c.updatedLabel)}: ${BUILD_DAY}</p>` + stats + toc +
    `<h2 id="by-community">${esc(c.areasHeading)}</h2><p>${esc(c.areasSub)}</p>${areaTable}` +
    `<h2 id="by-city">${esc(c.citiesHeading)}</h2><p>${esc(c.citiesSub)}</p>${cityTable}` +
    `<h2 id="by-type">${esc(c.typesHeading)}</h2><p>${esc(c.typesSub)}</p>${typeTable}` +
    `<h2 id="by-bedrooms">${esc(c.bedsHeading)}</h2><p>${esc(c.bedsSub)}</p>${bedTable}` +
    `<h2 id="by-development">${esc(c.projectsHeading)}</h2><p>${esc(c.projectsSub)}</p>${projTable}` +
    `<p>${esc(c.thinNote)}</p>` +
    `<h2 id="method">${esc(c.methodHeading)}</h2>${paras(c.methodParas)}` +
    cite +
    `<h2 id="analysis">${esc(c.heading)}</h2>${paras(c.paras)}` +
    `<h2 id="faq">${esc(c.ui.faqHeading)}</h2>` +
    c.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('') +
    `<h2>${esc(c.ctaHeading)}</h2><p>${esc(c.ctaText)}</p>` +
    `<p><a href="${prefix}/project" style="color:#8c8d25">${esc(c.ctaBtn)}</a></p>` +
    `<h3>${esc(c.linksHeading)}</h3><ul>${links}</ul>`
  )
}

// Static twin of GoldenVisaPage. Same module, same build-time figures, so the
// crawler's first fetch and the hydrated page can never quote different
// numbers. The honest split between the two residency routes is preserved
// here too: it is the reason the page is worth ranking.
function gvVars(lang) {
  return {
    units: fmtInt(goldenVisa.units),
    qualify5: fmtInt(goldenVisa.qualify5),
    qualify10: fmtInt(goldenVisa.qualify10),
    areas: goldenVisa.areas,
    projects: goldenVisa.projects,
    entry: fmtOmr(goldenVisa.entryPrice),
    tier5: fmtOmr(TIER_5_OMR),
    tier10: fmtOmr(TIER_10_OMR),
    updated: BUILD_DAY,
  }
}

function goldenVisaHtml(lang) {
  const gv = goldenVisa
  if (!gv.units) return ''
  const c = goldenVisaCopy(lang)
  const prefix = langPrefix(lang)
  const v = gvVars(lang)
  const F = (x) => esc(gvFill(x, v))

  const stats =
    `<ul><li><strong>${fmtInt(gv.qualify5)}</strong> ${esc(c.stats.qualify5)}</li>` +
    `<li><strong>${fmtInt(gv.qualify10)}</strong> ${esc(c.stats.qualify10)}</li>` +
    `<li><strong>${esc(fmtOmr(TIER_5_OMR))}</strong> ${esc(c.stats.tier5)}</li>` +
    `<li><strong>${esc(fmtOmr(gv.lowestQualifying))}</strong> ${esc(c.stats.entry)}</li></ul>`

  const routes = c.routes
    .map((r) => `<h3>${esc(r.name)}</h3><p><em>${esc(r.sub)}</em></p><p>${F(r.body)}</p>`)
    .join('')

  const table =
    `<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:15px">` +
    `<thead><tr>${[c.cols.area, c.cols.city, c.tier5Label, c.tier10Label, c.cols.from, c.cols.median]
      .map((h) => `<th style="text-align:start;padding:12px 14px;color:#61656E;font-weight:400;border-bottom:2px solid #12161D">${esc(h)}</th>`)
      .join('')}</tr></thead><tbody>` +
    gv.byArea
      .map((a) => `<tr>${[
        `<a href="${prefix}/project?area=${encodeURIComponent(a.key)}" style="color:#6f7020">${esc(a.label)}</a>`,
        esc(a.city || '–'), fmtInt(a.n), a.tenYear > 0 ? fmtInt(a.tenYear) : '–',
        esc(fmtOmr(a.minPrice)), esc(fmtOmr(a.medianPrice)),
      ].map((cell) => `<td style="padding:15px 14px;border-bottom:1px solid #E5E5E6">${cell}</td>`).join('')}</tr>`)
      .join('') +
    `</tbody></table></div>`

  const steps = c.steps
    .map((st) => `<h3>${esc(st.n)} ${esc(st.t)}</h3><p>${esc(st.d)}</p>`)
    .join('')

  const links = c.links
    .map((l) => `<li><a href="${prefix}${l.href}" style="color:#8c8d25">${esc(l.label)}</a></li>`)
    .join('')

  return (
    `<p>${F(c.lead)}</p>` + stats +
    `<h2 id="routes">${esc(c.routesHeading)}</h2><p>${esc(c.routesSub)}</p>${routes}` +
    `<h2 id="qualifying">${esc(c.qualifyHeading)}</h2><p>${esc(c.qualifySub)}</p>${table}` +
    `<p>${F(c.tableNote)}</p>` +
    `<h2 id="ownership">${esc(c.ownershipHeading)}</h2>` +
    c.ownershipParas.map((x) => `<p>${esc(x)}</p>`).join('') +
    `<h2 id="process">${esc(c.processHeading)}</h2><p>${esc(c.processSub)}</p>${steps}` +
    `<h2 id="analysis">${esc(c.heading)}</h2>` +
    c.paras.map((x) => `<p>${esc(x)}</p>`).join('') +
    `<h2 id="faq">${esc(c.faqHeading)}</h2>` +
    c.faq.map((f) => `<h3>${F(f.q)}</h3><p>${F(f.a)}</p>`).join('') +
    `<h2>${esc(c.ctaHeading)}</h2><p>${esc(c.ctaText)}</p>` +
    `<p><a href="${prefix}/project" style="color:#8c8d25">${esc(c.ctaBtn)}</a></p>` +
    `<h3>${esc(c.linksHeading)}</h3><ul>${links}</ul>`
  )
}

// The site-wide keyword-anchored link block, mirrored into EVERY prerendered
// page. The React component (components/FooterSeoLinks.jsx) renders the same
// links for users; emitting them here too means a crawler gets them on the
// first fetch without having to execute JS.
function footerLinksHtml(lang) {
  const c = footerSeoCopy(lang)
  const prefix = langPrefix(lang)
  const list = (items) => `<ul>${items.map((i) => `<li><a href="${i.href}" style="color:#8c8d25">${esc(i.label)}</a></li>`).join('')}</ul>`
  return (
    `<h2>${esc(c.headings.popular)}</h2>` +
    list(POPULAR.map((p) => ({ href: `${prefix}${p.to}`, label: c.popular[p.key] }))) +
    `<h2>${esc(c.headings.communities)}</h2>` +
    list(COMMUNITIES.map((a) => ({
      href: `${prefix}/project?area=${encodeURIComponent(a.area)}`,
      label: c.community.replace('{area}', a.label),
    }))) +
    `<h2>${esc(c.headings.projects)}</h2>` +
    list(PROJECTS.map((p) => ({
      href: `${prefix}/buy/${p.slug}`,
      label: c.project.replace('{name}', p.name),
    }))) +
    `<h2>${esc(c.headings.services)}</h2>` +
    list(servicesFor(lang).map((s) => ({ href: `${prefix}${s.to}`, label: c.services[s.key] })))
  )
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

// Copies a project's gallery cover to a stable, unhashed public path so the
// project page can point og:image at it.
//
// WHY a copy and not the bundled asset: the gallery is a Vite import.meta.glob,
// so the real filenames are content-hashed and only known inside the bundle,
// which this node script cannot resolve. The source file is still on disk at
// build time, so copying it to a predictable name is both simpler and stable
// across deploys, which matters because social platforms and WhatsApp cache
// og:image by URL.
function ogImageFor(slug) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const src = join('src', 'assets', 'projects', slug, `1.${ext}`)
    if (!existsSync(src)) continue
    const rel = `/images/og/${slug}.${ext}`
    const out = join('dist', 'images', 'og', `${slug}.${ext}`)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, readFileSync(src))
    return SITE + rel
  }
  return null
}

function projectPageFor(name, lang) {
  const pm = projectMeta(name)
  const slug = slugify(name)
  const route = `/buy/${slug}`
  const fake = { title: pm.title, desc: pm.desc }
  // Reuse pageFor by temporarily registering the route meta.
  ROUTES[route] = fake
  let html = pageFor(route, lang)
  delete ROUTES[route]

  // Point the share card at the project's own cover instead of the site-wide
  // peninsula.jpg default from index.html. src/projectGallery.js always meant
  // the first gallery image to be the og:image; only the article prerenderer
  // ever implemented it, so every project link shared to WhatsApp, LinkedIn or
  // a Meta ad previewed the same generic photo.
  const og = ogImageFor(slug)
  if (og) {
    html = html
      .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${og}$2`)
      .replace(/(<meta property="og:image:width" content=")[^"]*(")/, '$11600$2')
      .replace(/(<meta property="og:image:height" content=")[^"]*(")/, '$1900$2')
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${og}$2`)
  }

  return html
}

// One inventory fetch feeds the /buy/:slug AggregateOffer AND the unit pages.
let inventory = []
try { inventory = await fetchUnitsAndProjects() } catch { /* pages still render */ }
const aggBySlug = new Map()
for (const { unit, project } of inventory) {
  const k = slugify(project.name)
  const a = aggBySlug.get(k) || { count: 0, min: Infinity, max: 0, area: null, name: project.name }
  a.count++
  const price = Number(unit.price_omr)
  if (price > 0) { a.min = Math.min(a.min, price); a.max = Math.max(a.max, price) }
  a.area = a.area || project.areas?.name || project.areas?.city || project.location || null
  aggBySlug.set(k, a)
}
for (const a of aggBySlug.values()) if (a.min === Infinity) a.min = 0

// …and the same fetch feeds the price index. Must be initialised before the
// route loop below, which is what calls pageFor().
const goldenVisa = buildGoldenVisa(inventory)
console.log(
  `prerender-routes: golden visa — ${goldenVisa.qualify5} of ${goldenVisa.units} units clear OMR ${TIER_5_OMR}, ${goldenVisa.qualify10} clear OMR ${TIER_10_OMR}`,
)

const priceIndex = buildPriceIndex(inventory)
console.log(
  `prerender-routes: price index over ${priceIndex.units} units — median ${priceIndex.overall.medianPpsm} OMR/m² across ${priceIndex.areas} communities`,
)

let count = 0
let skipped = 0
for (const route of Object.keys(ROUTES)) {
  // Routes that declare `langs` are emitted only in those languages.
  for (const lang of (ROUTES[route].langs?.length ? ROUTES[route].langs : LANGS)) {
    const segs = route === '/' ? [] : route.split('/').filter(Boolean)
    const out = join('dist', ...(lang === 'en' ? [] : [lang]), ...segs, 'index.html')
    // The EN homepage is the one file that MUST be overwritten (it starts life
    // as the raw shell); the pristine copy now lives at dist/app.html.
    const isEnHome = route === '/' && lang === 'en'
    // prerender-insights.mjs already wrote real article pages; /insights index
    // itself is safe, but never clobber an existing file from an earlier step.
    if (!isEnHome && existsSync(out)) {
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
// ── /property/:id unit pages ────────────────────────────────────────────────
// The deepest, most long-tail-capable inventory on the site (~315 available
// units). Until now they were 301'd to /buy by vercel.json AND had no seo.jsx
// branch, so not one of them could be indexed. Prerendered in ENGLISH ONLY:
// these target the English listing-portal cluster ("2 bedroom apartment for
// sale in muscat"), and 4× would quadruple the static output for languages
// whose demand is already served by /buy and the fa/ar pages. The other
// languages still render correctly client-side via SeoManager.
const TYPE_MAP = [
  [/villa/i, 'Villa'],
  [/penthouse/i, 'Penthouse'],
  [/town\s*house|townhouse/i, 'Townhouse'],
  [/chalet/i, 'Chalet'],
  [/studio/i, 'Studio'],
]
const typeGroup = (t) => {
  for (const [re, name] of TYPE_MAP) if (re.test(String(t || ''))) return name
  return 'Apartment'
}
// fmtOmr comes from priceIndexData.mjs — same output for a positive number,
// and '—' instead of "OMR NaN" when a price is missing.

async function fetchUnitsAndProjects() {
  const h = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
  const [pr, ur] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/projects?select=id,name,location,latitude,areas(name,city)&latitude=not.is.null`, { headers: h }),
    fetch(
      `${SUPABASE_URL}/rest/v1/project_units?select=id,unit_type,layout_type,bedrooms,view,floor_label,total_area_sqm,internal_area_sqm,total_garden_sqm,price_omr,price_per_sqm_omr,project_id&availability_status=eq.available&limit=2000`,
      { headers: h },
    ),
  ])
  if (!pr.ok) throw new Error(`supabase projects ${pr.status}`)
  if (!ur.ok) throw new Error(`supabase units ${ur.status}`)
  const projects = await pr.json()
  const units = await ur.json()
  const byId = new Map(projects.map((p) => [p.id, p]))
  return units
    .map((u) => ({ unit: u, project: byId.get(u.project_id) }))
    .filter((x) => x.project)
}

// Mirrors the near-identical-unit grouping in src/pages/SearchPage.jsx so the
// static pages agree with what the portal actually shows.
const groupKey = (u) =>
  `${u.project_id}|${typeGroup(u.unit_type)}|${u.bedrooms ?? 0}|${Math.round(Number(u.price_omr))}`

function propertyPageFor({ unit, project }, canonicalUrl) {
  const g = typeGroup(unit.unit_type || unit.layout_type)
  const beds = unit.bedrooms
  const bedLabel = beds === 0 || beds == null ? 'Studio' : `${beds}-Bedroom`
  const city = project.areas?.city || project.areas?.name || project.location || 'Oman'
  const sqm = Math.round(Number(unit.total_area_sqm || unit.internal_area_sqm || 0))
  const priceTxt = unit.price_omr > 0 ? fmtOmr(unit.price_omr) : null
  const route = `/property/${unit.id}`
  const url = `${SITE}${route}`

  const title = `${bedLabel} ${g} for Sale in ${city}${priceTxt ? `: ${priceTxt}` : ''} | Irfan`
  const desc = [
    `${bedLabel} ${g.toLowerCase()} for sale at ${project.name}, ${city}, Oman.`,
    sqm ? `${sqm} m² built-up area.` : '',
    priceTxt ? `Price ${priceTxt}.` : '',
    `Freehold ownership for all nationalities with Oman investor residency. Ref IRF-${unit.id}.`,
  ].filter(Boolean).join(' ')

  let html = template
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
  html = html
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)

  // Canonical: self for the representative of a group, or the representative's
  // URL for a near-identical duplicate (same project + type + beds + price).
  // ~80 of the 395 available units are duplicates of another listing, and
  // shipping them as standalone indexable pages would be textbook thin/
  // duplicate content. No hreflang alternates — the localized variants are not
  // prerendered and would resolve to the SPA shell on a crawler's first fetch.
  html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '')
  html = html.replace('</head>', `    <link rel="canonical" href="${canonicalUrl || url}">\n  </head>`)

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateListing',
        '@id': `${url}#listing`,
        url,
        name: title.replace(' | Irfan', ''),
        description: desc,
        ...(unit.price_omr > 0 ? {
          offers: {
            '@type': 'Offer',
            price: Number(unit.price_omr),
            priceCurrency: 'OMR',
            availability: 'https://schema.org/InStock',
            url,
            seller: { '@id': `${SITE}/#organization` },
          },
        } : {}),
        about: {
          '@type': g === 'Villa' || g === 'Townhouse' ? 'House' : 'Apartment',
          name: `${bedLabel} ${g} at ${project.name}`,
          ...(beds != null ? { numberOfRooms: beds } : {}),
          ...(sqm ? { floorSize: { '@type': 'QuantitativeValue', value: sqm, unitCode: 'MTK' } } : {}),
          address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: 'OM' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Properties for Sale in Oman', item: `${SITE}/project` },
          { '@type': 'ListItem', position: 3, name: title.replace(' | Irfan', ''), item: url },
        ],
      },
    ],
  }
  html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`)

  const facts = [
    ['Project', project.name],
    ['Area', city],
    ['Property type', g],
    ['Bedrooms', beds === 0 || beds == null ? 'Studio' : String(beds)],
    sqm ? ['Built-up area', `${sqm} m²`] : null,
    unit.view ? ['View', unit.view] : null,
    unit.floor_label ? ['Floor', unit.floor_label] : null,
    priceTxt ? ['Price', priceTxt] : null,
    ['Reference', `IRF-${unit.id}`],
    ['Ownership', 'Freehold, all nationalities'],
  ].filter(Boolean)
    .map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`)
    .join('')

  const body =
    `<h1>${esc(title.replace(' | Irfan', ''))}</h1>` +
    `<p>${esc(desc)}</p>` +
    `<h2>Key details</h2><ul>${facts}</ul>` +
    `<h2>About ${esc(project.name)}</h2>` +
    `<p>${esc(`${project.name} is a freehold development in ${city}, Oman. Buying here gives all nationalities full ownership title inside a government approved Integrated Tourism Complex, and qualifies the owner for a renewable Oman investor residency permit. There is no annual property tax and no tax on rental income.`)}</p>` +
    `<h2>Enquire about this property</h2>` +
    `<p>Request the floor plan, full price list and payment plan for reference IRF-${unit.id} from Irfan Investment Group.</p>` +
    `<ul>` +
    `<li><a href="/project" style="color:#8c8d25">All properties for sale in Oman</a></li>` +
    `<li><a href="/buy/${slugify(project.name)}" style="color:#8c8d25">${esc(`${project.name}: prices, available units and payment plan`)}</a></li>` +
    `<li><a href="/buy" style="color:#8c8d25">Buy property in Oman: full guide</a></li>` +
    `</ul>` + footerLinksHtml('en')

  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div style="max-width:760px;margin:0 auto;padding:96px 20px;color:#fff;background:#000;font-family:Inter,system-ui,sans-serif">${body}</div></div>`,
  )
  return html
}

let unitCount = 0
let dupCount = 0
try {
  const items = inventory.length ? inventory : await fetchUnitsAndProjects()
  // Pick a stable representative per group (lowest unit id) — must match the
  // representative api/sitemap.js submits.
  const rep = new Map()
  for (const it of items) {
    const k = groupKey(it.unit)
    const cur = rep.get(k)
    if (!cur || it.unit.id < cur.unit.id) rep.set(k, it)
  }
  for (const item of items) {
    const out = join('dist', 'property', String(item.unit.id), 'index.html')
    if (existsSync(out)) continue
    const r = rep.get(groupKey(item.unit))
    const isDup = r && r.unit.id !== item.unit.id
    if (isDup) dupCount++
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, propertyPageFor(item, isDup ? `${SITE}/property/${r.unit.id}` : null))
    unitCount++
  }
  console.log(`prerender-routes: wrote ${unitCount} unit pages (/property/:id, en) — ${unitCount - dupCount} canonical, ${dupCount} canonicalized to a duplicate`)
} catch (e) {
  // Never fail the whole build over the unit pages — the rest of the SEO
  // output is still valuable.
  console.warn(`prerender-routes: unit pages SKIPPED — ${e.message}`)
}

console.log(`prerender-routes: wrote ${count} route pages (${skipped} skipped) + ${projCount} project pages for ${names.length} projects + ${unitCount} unit pages`)
