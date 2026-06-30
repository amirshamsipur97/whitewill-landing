# Irfan Investment (whitewill-landing) — Session Handoff

_Last updated: 2026-06-30. Consolidated reference for continuing work in a new session._

---

## 1. Live URLs
- **Production:** https://www.irfaninvest.com  (root 307→www; both via Vercel)
- **Fallback (vercel.app):** https://whitewill-landing.vercel.app  (map broken there — Mapbox token is domain-locked to irfaninvest.com)
- **Blog (Insights):** https://www.irfaninvest.com/insights · article: `/insights/<slug>`
- **Blog admin (hidden, password-gated):** https://www.irfaninvest.com/insights-admin
- **Sitemap (dynamic, multilingual):** https://www.irfaninvest.com/sitemap.xml
- **Analytics dashboard (separate repo `irfanapp`):** https://irfanapp.vercel.app

### Language URLs (Phase 2)
English is prefix-less; others are path-prefixed:
`/buy` · `/ar/buy` · `/ru/buy` · `/fa/buy` (same for every route). `/insights-admin` is English-only.

---

## 2. Repo, stack, deploy
- **Local repo:** `/Users/amirshamsipur/Claude code/whitewill-landing`
- **GitHub:** https://github.com/amirshamsipur97/whitewill-landing
- **Stack:** Vite 6 + React 18 (SPA), React Router v7, MUI v9, Supabase, Vercel (PRO).
- **Deploy:** from the repo dir → `vercel deploy --prod --yes` (server-side build w/ stored env, auto-assigns domains). CLI is logged in as `amirshamsipur1997-4522`, team `amirshamsipurs-projects`.
- **Build check:** `npm run build`. **Local preview for QA:** the Claude preview server (name `whitewill`, port 5173).
- ⚠️ Vercel MCP returns 403 for this account — use the **CLI** for Vercel, not the MCP.

---

## 3. External system IDs
- **Supabase project:** `owgvrxipqlusepozlujv` ("irfaninvest property") · region ap-northeast-1 · PG 17.
- **GA4:** property `519295313`, Measurement ID `G-P2PTCKJKYK`. **Google tag:** `GT-P3MWCKNB`. **Google Ads tag:** `AW-1774372667` (installed in index.html).
- **Google Ads accounts:** manager `3573049942` / client `8559609654`.
- **n8n SEO workflow:** `https://analytics-test.app.n8n.cloud/workflow/KjDPPqA7lRm0U2M2` (currently INACTIVE).
- **Figma:** file `6miTfu9ktj3SlAFCmSSER8` (Irfan-invest).
- **Mapbox token (working):** `pk.eyJ1IjoiYW1pcnJlemExOTk3Ii…hI5u32jzYuHgxS63CiNxdQ` (account amirreza1997; not URL-restricted).
- **Google Sheets:** leads `1z3iSemlEHMAolB0sTLbM3SD3Zd3ySzNPM7J93tIEN-I`; chat analytics `1OJoKaIltqb3lLRIXx7vRqSMzf-QTfCA4Ibz3gTwjzhU`.

### Secrets — WHERE they live (not printed here to avoid leaking)
- **Insights admin password:** set via Supabase edge-fn env `INSIGHTS_ADMIN_PASSWORD` (value kept out of the repo).
- **Anthropic / OpenAI / Pexels / n8n API keys:** held in the **n8n `Config` node** and Supabase Edge Function secrets — NOT in the repo. (Supabase secrets: `ANTHROPIC_API_KEY`, `GOOGLE_SHEET_*`.) Rotate the keys shared in chat when convenient.

---

## 4. What's built (state)
- **Real estate site:** 4-language (en/ru/ar/fa), olive-luxury, RTL for ar/fa. Routes: `/`, `/buy`, `/buy/:slug`, `/sell`, `/maison-shirdel`, `/invest`, `/investment`, `/investment/legal`, `/car-import`, `/insights`, `/insights/:slug`, `/about`.
- **AI chat agent "Sara"** (Supabase edge fn `chat`, v9): Persian language support + reads `ai_knowledge` advisory content + live property inventory; prompt-cached.
- **Insights/blog:** Supabase `insights` table (multilingual, markdown body) + `insights-admin` edge fn (v2, password-gated CRUD incl. `setPublished`) + admin page with markdown preview + a green **Publish** button per draft.
- **GA4 + Google Ads:** manual SPA `page_view` (page+language+content_group), `generate_lead` on every form submit, Ads tag installed; custom dimensions `site_language`/`lead_source` registered in GA4.
- **n8n SEO blog agent** (`n8n/` in repo): weekly → web-search trend research (Anthropic web_search) + site `ai_knowledge` + Google autocomplete → strategist picks topic → writes 4-lang articles → **OpenAI SEO-editor pass** → Pexels cover image → saves **drafts** to `/insights-admin`. Files: `n8n/build_workflow.py` (generator), `irfaninvest-seo-blog-agent.json`, `README.md`.
- **SEO Phase 1 (migration cleanup):** real 404 (`NotFoundPage`, noindex), per-route canonical/robots in `src/seo.jsx`, dynamic sitemap (`api/sitemap.js`), legacy redirects + 410 (`vercel.json`, `api/gone.js`), Org+WebSite+Article+Breadcrumb+FAQ JSON-LD.
- **SEO Phase 2 (multilingual URLs):** localized URLs (`/ar`,`/ru`,`/fa`) + hreflang + per-language canonical + multilingual sitemap. `src/lib/localize.js` is the helper hub; `BrowserRouter` is in `main.jsx`.

---

## 5. Pending / next steps
- **n8n agent:** runs manually (Test workflow). Toggle **Active** for the weekly schedule once happy. Tier-1 Anthropic throttle = ~4–5 min/run; adding Anthropic credits (Tier 2) lets us speed it up.
- **Google Search Console:** resubmit `/sitemap.xml`; "Validate Fix" the duplicate/redirect/404 issues; check International Targeting (hreflang).
- **SEO Phase 3 (not started):** SSR/prerender (vite-react-ssg or react-snap) for faster indexing + Core Web Vitals; full `<title>` localization of static pages; CWV tuning (Mapbox/video heavy on homepage).
- **Security launch-blocker:** RLS still OFF on ~13 Supabase tables incl. `leads` (anon key can read all leads). Write policies before public scale.

---

## 6. Known gotchas (don't undo)
- **MUI v9:** `<Stack>` does NOT accept `alignItems`/`justifyContent` as props — put them in `sx` (else they leak to the DOM + don't apply).
- **GSAP pin-spacer vs React Router:** `Node.prototype` patches + `app:beforenav` event in `main.jsx`/`ScrollManager` must stay (prevents blank-page crash on nav).
- **iOS video scrub:** `primeForScrub` in ScrollVideoHero must stay.
- **Heavy desktop-only sections** (DiscoverProperties, AthurayaCity, AkdtScrollVideo, HorizontalCarousel) are dropped on mobile (`!isMobile`).
- Persian/Arabic copy: **no em-dashes**; use Peyda font; RTL.

---

## 7. Memory
Full details persist in auto-memory (loads every session) — see `MEMORY.md` index and:
`whitewill-project-refs`, `whitewill-insights-blog`, `irfaninvest-advisory-pages`,
`whitewill-deploy-workflow`, `whitewill-invest-i18n`, `whitewill-react-gsap-gotchas`,
`whitewill-business-rules`, `irfaninvest-growth-stack`.
