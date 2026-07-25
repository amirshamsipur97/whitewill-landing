# HANDOFF — SEO overhaul, 2026-07-25

One long session. Everything below is **built, deployed to production and
verified live** on `https://www.irfaninvest.com` unless explicitly marked open.

> ⚠️ **FIRST THING NEXT SESSION:** at the time of writing there were **225
> uncommitted files** on top of `86dc015`. Production is live but the source is
> only on disk. Check `git status` and commit before doing anything else.

---

## 0. The story in one paragraph

The site had a strong technical base (prerendering, hreflang, 4 languages) but
its biggest asset — a 400-unit property inventory at `/project` — was invisible
to Google, and nothing targeted the head terms the business actually wants.
Three root causes were found and fixed, then the surrounding gaps (content,
schema, internal linking, blog, images, page weight) were closed one by one.

---

## 1. The three root causes (all fixed)

| # | Cause | Fix |
|---|---|---|
| 1 | `vercel.json` had `/property/:path*` → `/buy` **301** — a legacy Webflow rule that redirected all ~395 unit pages | Narrowed to `/property/investment` only |
| 2 | `/property/:id` had **no branch in `seo.jsx`**, so it fell to the 404 catch-all = `noindex` | Added an indexable branch; `PropertyPage.jsx` then writes real per-unit title/desc + JSON-LD |
| 3 | `/project` was **not in the sitemap** and its prerendered body was one `<h1>` + one `<p>` | Added to sitemap; `src/projectSeoContent.mjs` gives it copy, FAQ, links, schema |

---

## 2. What shipped

### Unit pages (the long tail)
- **395 static pages** at `dist/property/{id}/index.html`, English only.
  Keyword titles (`"3-Bedroom Apartment for Sale in Muscat — OMR 834,897"`),
  `Key details`, `About {project}`, internal links,
  `RealEstateListing` + `Offer` + `BreadcrumbList`.
- **Duplicate handling:** ~79 of 395 are near-identical (same
  `project|type|beds|price` — the grouping key in `SearchPage.jsx`).
  Representative = **lowest unit id**; duplicates carry
  `<link rel=canonical>` → representative and are **excluded from the sitemap**.
  Result: **316 canonical + 79 canonicalized**.
- Localized `/ar|/fa|/ru/property/:id` canonicalize to the **English** URL and
  emit no hreflang (only EN is prerendered). Title is forced to English
  (`TYPE_WORDS.en`) — it used to mix scripts: `"3-Bedroom شقة for Sale…"`.

### Head-term landing pages
`/buy-property-in-muscat` · `/buy-apartment-in-muscat` · `/buy-property-in-salalah`
- `src/cityLandingContent.mjs` (config + copy ×4 langs) +
  `src/pages/CityLandingPage.jsx` (one reusable component, `slug` prop).
- Photographic hero (image auto-derived from the largest project in the filtered
  set), the `/project` glass search bar + 3 filter chips that hand off to
  `/project?q=&type=&beds=&price=`, live stat pills, community **image tiles**,
  24-card grid with inline lead capture, copy + FAQ + links.
- Emits `FAQPage` + `ItemList` + `BreadcrumbList`.
- **First crawlable faceted links on the site**: community tiles are real
  `<a href="/project?area=…">`. Verified: Al Mouj → 124 cards.

### Lead capture
- `/project` and `/property/:id` had **no inline lead form** — visitors browsed
  400 units and left. Both now open a modal on the card "Contact" button.
- **`src/components/QuickInquiryModal.jsx` (NEW)** replaced the SARA
  one-question-at-a-time chat on `/buy`, `/project`, `/property`. Same props
  API and same rich payload (`project_inquiry_<slug>[_unit]`), but all fields
  visible at once. `ProjectInquiryModal.jsx` is now **orphaned** (kept).
- The AI chat agent stays only in the ChatWidget.

### Internal linking
- **`src/footerSeoLinks.mjs` + `src/components/FooterSeoLinks.jsx`** — 21
  keyword-anchored links in 3 columns (5 head-term pages, 7 `/project?area=`
  facets, 9 `/buy/{slug}` projects). Mounted **eagerly** in `App.jsx` (outside
  the footer's `DeferredMount`) **and** injected into every prerendered page
  incl. all 395 unit pages and all 119 articles.
- Header dropdown on the "Properties" nav item, grouped by city (Muscat holds
  both type-level pages), `keepMounted` so the links exist while closed.
- Nav labels corrected: `/buy` → **Projects**, `/project` → **Properties**
  (they were inverted vs. their content). **URLs deliberately unchanged.**

### Blog
- Measured: 119 published articles (en 32 / ar 28 / fa 31 / ru 28), avg 3.82
  internal links, **0 linking to `/project` or the new landings**.
- n8n prompt fixed **and published** — now demands 3-4 internal links with at
  least one to a listing page, 1100-1500 words.
- **All 119 articles retrofitted** with a localized `## Browse live listings`
  block (additive, idempotent). Avg links **3.82 → 6.48**, zero-link articles
  **6 → 0**, `/project` **0 → 116 (97%)**.
- `prerender-insights.mjs` now injects the footer link block (articles were
  link dead ends in static HTML) and emits `dir="rtl"` for ar/fa.

### Technical sweep
- **mapbox-gl off the 9 project money pages**: extracted to
  `src/components/ProjectMap.jsx`, `lazy()`-imported, **and** gated behind a
  `WhenVisible` wrapper. BuyProjectPage chunk 43 KB → 27 KB. Verified live:
  **0 requests / 0 KB on load; loads and renders after scrolling.**
- **EN homepage prerendered at last.** `dist/index.html` was both the homepage
  and the SPA fallback. Fixed by writing the pristine shell to **`dist/app.html`**
  and repointing vercel.json's catch-all there. Verified: homepage has h1 + 21
  links; unknown URLs still serve a contentless shell.
- `/buy/:slug` now ships `RealEstateListing` + `AggregateOffer` (real
  lowPrice/highPrice/offerCount) + `BreadcrumbList` — **9/9 pages, 4 langs**.
  Injection lives in `pageFor()` keyed by `aggBySlug`, so it covers the
  ROUTES-driven `/buy/hawana-salalah` too.
- Sitemap: **per-article language accuracy** (was emitting 4 langs for every
  slug → ~29 URLs served the SPA shell with the homepage canonical), real
  `lastmod` via `BUILD_DATE`, `/privacy` added.
- `index.html` SearchAction → `/project?q=` (was `/insights?q=`, which ignores it).
- Nested `<main>` removed; `/project` heading skip (h1→h3) fixed with a
  visually-hidden h2.

### Images
- **54.0 MB → 30.9 MB (−43%)**. Script: scratchpad `optimize_images.py` (`DRY=1`).
- `src/assets/projects/**` → **WebP q82** (73 files). Safe because
  `projectGallery.js` reaches them only via `import.meta.glob(...{jpg,jpeg,png,webp})`
  and there are **zero direct imports**.
- `public/**` recompressed **in place** (names/extensions are literal strings in
  code and prerendered HTML). Only rewritten when the saving was **>20%** —
  PSNR measurement showed most public JPEGs were already well compressed.
- CLS was a **false alarm**: 329/329 images on `/project` are already protected
  by CSS `aspect-ratio`.

---

## 3. Numbers

| | Before | After |
|---|---|---|
| Indexable unit pages | 0 (301'd) | 316 canonical (+79 canonicalized) |
| Sitemap URLs | 224 | 531 |
| `/project` crawlable words | ~40 | 479 |
| Articles linking to `/project` | 0 | 116 (97%) |
| Avg internal links per article | 3.82 | 6.48 |
| Images | 54.0 MB | 30.9 MB |
| mapbox on `/buy/*` | 528 KB | 0 KB on load |

**GSC baseline captured 2026-07-25 (data PREDATES all of this — chart ended
~mid-July):** Indexed **75** / Not indexed **190**. The 52 "Page with redirect"
turned out to be **healthy** protocol/www + legacy redirects, not the
`/property` bug — Google simply had not crawled `/project` yet (it shipped
2026-07-23). Re-check ~mid-Aug; target Indexed 250-350.

---

## 4. Gotchas that cost real time — read before debugging

1. **The automated browser tab is `document.visibilityState === "hidden"`.**
   `requestAnimationFrame`, CSS animations/transitions **and
   IntersectionObserver do not fire.** Two "frozen animation" bugs and one
   "broken map" were all this. Proof it is the environment: `SiteFooter`
   (long-proven `DeferredMount`/IO in production) also fails to mount there.
   → Never gate visibility on rAF (use `setTimeout`), always give an
   IO-dependent feature a scroll/timeout backstop, and **verify modals and
   animations via DOM (`getComputedStyle`, `read_page`), never screenshots** —
   full-screen fixed overlays capture as pure black.
2. **Never toggle animation classes with imperative `classList.add`** on a
   React-rendered node: a re-render rewrites `className` from the JSX and wipes
   it. Drive entrance state from React state.
3. **A direct PostgREST `PATCH` on `insights` with the anon key returns 2xx and
   updates NOTHING** (RLS). The real write path is
   `POST /functions/v1/insights-admin` with `{action:'upsert', password, row}` —
   password lives in the n8n workflow's Config node.
4. **n8n `update_workflow` saves a DRAFT.** Call `publish_workflow` after, or
   the live run keeps the old version.
5. `PropertyPage.jsx` has **three** `<main>` blocks (loading / not-found / page)
   — replace all of them or JSX will not balance.
6. macOS blocks terminal access to `~/Downloads`; ask for files to be copied
   into the repo folder instead.

---

## 5. File map (what this session created or changed)

**New**
```
src/cityLandingContent.mjs        head-term landing config + copy ×4 langs
src/pages/CityLandingPage.jsx     the reusable landing page
src/projectSeoContent.mjs         /project SEO copy + FAQ
src/footerSeoLinks.mjs            site-wide keyword link data
src/components/FooterSeoLinks.jsx site-wide keyword link block
src/components/QuickInquiryModal.jsx  simple lead form (replaces SARA chat)
src/components/ProjectMap.jsx     mapbox split out for lazy loading
```
**Changed** — `vercel.json`, `index.html`, `api/sitemap.js`,
`prerender-routes.mjs`, `prerender-insights.mjs`, `src/seo.jsx`,
`src/seoRoutes.mjs`, `src/App.jsx`, `src/i18n.jsx`, `src/i18n.fa.js`,
`src/buySeoContent.mjs`, `src/components/Header.jsx`,
`src/components/SiteFooter.jsx`, `src/pages/{SearchPage,PropertyPage,BuyProjectPage}.jsx`,
plus ~160 image files.

**Scratchpad scripts worth keeping** — `optimize_images.py`,
`retrofit_articles.mjs` (both re-runnable, both idempotent).

---

## 6. Still open, ranked

1. **Oman property price index page** — the linkable asset for the backlink
   strategy. Per-m² by area from `project_units.price_per_sqm_omr` (the column
   already exists), `Dataset` schema, auto-refreshing. **Must** state "based on
   Irfan's ~400-unit portfolio", not "the Oman market".
2. **Per-area landing pages** — the 7 "Buy by community" footer anchors
   (Al Mouj, Muscat Bay, Muscat Hills, Sultan Haitham City, Jebel Sifah, Yiti,
   Hawana Salalah) all canonicalize to `/project`. High-intent head terms with
   anchor text but no target page.
3. **Backlink execution** (nothing built, strategy agreed): Google Business
   Profile is the biggest free win and is **still not claimed** — a competitor's
   GBP is literally named «خرید ملک در عمان». Then developer "authorized agent"
   listings (Muriya etc.), agency profiles on Bayut/Dubizzle/Mawa, PR using the
   +175% YoY Golden Visa data.
4. `public/images/blog/*` are still **byte-identical duplicates** of
   `src/assets/projects/*` (same bytes deployed twice); no `srcset`/`sizes`.
   Converting public/ to WebP needs reference rewrites incl. 119 DB
   `cover_image` URLs (doable via the insights-admin edge fn).
5. Footer Terms/Cookies still `href="/"`; article `author` is always
   Organization (no Person E-E-A-T); dead components `LuxuryShowcase.jsx`,
   `HeroSection.jsx` (the latter owns the 1.9 MB `team.png`); hero-poster
   preload fires on every prerendered page that never shows it.

---

## 7. Manual actions for the user

- Submit `sitemap.xml` again in Search Console.
- URL-inspect the three landing pages (quota is ~10-12/day; do **not** try to
  submit hundreds — the sitemap does that job).
- Do not touch the `/buy` and `/project` **URLs**. They are indexed and hold
  authority; anchor text is free to change, slugs are not.
- ~mid-Aug: check Indexing → Pages. If Indexed is still under ~150, escalate.
