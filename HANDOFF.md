# Irfan Investment (whitewill-landing) — Session Handoff

_Last updated: 2026-07-09._ Consolidated reference for continuing work in a new session._

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


---

## 2026-07-02 session — SEO overhaul, lead popup, daily blog agent, Vapi auto-call

### Shipped (all live on irfaninvest.com)
- **4-lang SEO**: every route in `src/seo.jsx` now has localized {en,ru,ar,fa} title+description targeting buy-property-in-Oman keywords. Fixed critical bug (fa-only titles on /investment, /investment/legal, /car-import shown to ALL langs). Dynamic /buy/:slug titles + blog fallback localized. `index.html` static homepage meta updated ("Buy Property & Invest in Oman").
- **JSON-LD**: `BuyProjectPage.jsx` emits RealEstateListing (AggregateOffer from live unit `price_omr`) + BreadcrumbList per project.
- **Perf**: removed unused deps (three/animejs/framer-motion), vendor manualChunks in `vite.config.js` → entry 996K→317K (gzip 94K).
- **Lead popup** (`src/components/LeadPopup.jsx` + `src/data/dialCodes.js` + `public/images/popup/`): Figma-exact (node 630-20014 v3). Auto-opens 3s on landing, re-opens every 20s until submitted (session flag `irfan_popup_lead_done`). Site-wide purple launcher (#351D93, bottom-left, chat-pill metrics, Figma icon rotates 45° via GSAP). First/Last name + flag dial selector (161 countries, GCC first) + phone → `submitForm()` → leads table + Google Sheet + GA4 `generate_lead` → redirect /buy. Scroll locked while open (`window.__lenis.stop()` + overflow hidden); dial list = body portal (transformed card would clip fixed elements). Mobile-optimized.
- **Chat pill label** now "Start AI Assistant" / «شروع دستیار هوشمند» / etc (i18n.jsx + i18n.fa.js).

### n8n (analytics-test.app.n8n.cloud)
- **`KjDPPqA7lRm0U2M2` "Daily SEO Blog Agent (Fable 5)" — ACTIVE, DAILY** (05:00): web-research topic pick (web_search_20260209) → 4-lang articles on `claude-fable-5` (fallback opus-4-8) → AUTO-PUBLISH to insights. Verified run 2026-07-02 (4 langs, 8.5 min). OpenAI editor node disabled (key never set). ⚠️ Anthropic key is plaintext in Config node.
- **`GBgpcthXcl5MbwZw` "New Lead Auto Call (Vapi)" — ACTIVE**: polls Form Property Database sheet every 2 min → new rows (dedupe + cutoff 2026-07-02) → Vapi call from assistant Sam (+17754512951) → logs to irfanapp. Guards: max 5/run, valid-phone ≥11 chars, fresh<45min OR local 10-21h.
- **`M2Yct119lYGxAuGu` main workflow**: published the stale draft (active version was crashing "Interested?" on every call-ended webhook). Analytics branch verified post-publish.

### Open items / next session
1. **Google Ads conversion label**: create Lead conversion action in Google Ads → set `VITE_GOOGLE_ADS_LEAD_LABEL` env in Vercel → redeploy. Everything else is wired (`trackLead()` fires generate_lead; Ads tag AW-1774372667 + Conversion Linker installed).
2. **Live end-to-end Vapi test** with a real number (popup → sheet → auto-call within ~2-4 min). Watch the sheet Phone column for `#ERROR!` (values starting with `+` parse as formulas — if real leads break, fix Apps Script to prefix with apostrophe).
3. Rotate the Anthropic API key exposed in n8n Config (and the Supabase anon key/admin password are also in that node).
4. Big workflow still has Google Sheets OAuth broken on "Save * to Client Sheet" nodes (credential `cJSsSNhyRDc1s6sR` tokenless) — user must reconnect in n8n UI.
5. WhatsApp confirmation nodes still on Twilio sandbox (fail silently).

---

## Session log 2026-07-03 → 2026-07-09 (perf + ads + SEO sprint)

### Site / performance (all deployed)
- **PageSpeed: mobile 58→85, desktop 47→98.** The big levers: `useIsMobile` now reads matchMedia synchronously (phones were mounting desktop-only sections for one tick → ~40MB video downloads); ALL below-fold landing sections are wrapped in `DeferredMount` (App.jsx, IO rootMargin 200%) incl. AboutFounder/Logos/GlobalPresence/Waterfront/ContactCTA/SiteFooter/PropertyMap; main CSS is **inlined into index.html at build** by root-level `inline-css.mjs` (chained in `npm run build`; NOTE `.vercelignore` excludes `scripts/` — that's why the file lives at repo root); Google Fonts CSS async; gtag injected at window.load+1.5s (dataLayer stub queues events — conversion tracking intact); splash MIN/MAX 500/1200ms; heavy images recompressed (originals in session scratchpad img-backup).
- **Hero = 10s LOOPING Mutrah drone video** (5s+5s from Desktop/Video/Mutrah Drone_1/2.mp4, built with npm `ffmpeg-static`): `public/video/hero-loop.mp4` 1920×1080 CRF22 (5.9MB) + `hero-loop-mobile.mp4` 1280×720 (2.1MB) + first-frame posters `public/images/hero-poster{,-mobile}.jpg`. ScrollVideoHero: autoplay/muted/loop, NO scrub; GSAP text stages on fixed pacing. A poster `<img>` sits permanently UNDER the video — Safari's backdrop-filter (LeadPopup) can't sample video and went black without it. Old hero.mp4/hero-mobile.mp4 kept (AboutPage uses them).
- **Buy galleries:** 14 projects have real photos in `src/assets/projects/<slug>/N.jpg` (see whitewill-add-project-workflow memory). Remaining placeholders: TSCY, Aida, Sarooj Villas, Muscat Bay Ready, Shops(Pearl-Ready), Plumeria, Maysan.

### Blog / SEO agent (n8n `KjDPPqA7lRm0U2M2`, ACTIVE, daily 05:00 UTC)
- Hardened: forced tool_use (`emit_article`) → schema-valid JSON; completeness loop (`Fetch saved langs`→`Find missing langs`→re-queue, max 2 retries then LOUD fail); `wrongLanguage()` script check (fa keyword once dragged the ar article into Persian — fixed + data repaired); em-dash ban; "current year 2026" rule.
- **Outage post-mortems:** Jul 6-7 = n8n exec quota exhausted (2-min Vapi poll ≈21.6k/mo); user upgraded to **Pro (10k/mo)** and Vapi poll is now cron `*/4 6-17 * * *` + `*/30` overnight (≈6.2k/mo; whole account ≈7.7k). Jul 9 = **Anthropic API credits ran out**; user topped up $19.42 (~10 days) — recommend auto-reload. Manual re-run recipe: `execute_workflow` MCP on KjDPPqA7lRm0U2M2, mode manual.
- SEO shipped: related-articles strip on article pages, ItemList JSON-LD on /insights, Insights footer link, **build-time prerender** (`prerender-insights.mjs` → 54 static article pages with full meta/content; new articles get prerendered on next deploy). GSC verified `sc-domain:irfaninvest.com`: only 12 indexed / 59 discovered-not-indexed / 42 duplicate-wrong-canonical (SPA shell problem — prerender is the fix, watch GSC over next weeks).
- Admin panel `/insights-admin` (password in edge fn `insights-admin`): language tabs + date sort; visitor launchers hidden on admin route.

### Google Ads (account 855-960-9654)
- **C1 "AE | EN | Oman Property & Investment" (24001281094), ACTIVE, learning until ~Jul 17 — DO NOT TOUCH.** 7-day: 552 impr / 70 clicks / CTR 12.7% / $167 / 4 conv @ ~$42. Panel "shows no numbers" gotcha = date-range picker stuck on an old custom range.
- **Old campaign autopsy (23646910314 "UAE | Property | Lead Gen", paused):** its 39.4K impressions were **98.3% Display Network**, search CPC $8.04, CTR 0.59%, broad match, landing `/property/investment` now 404. Its 11 conv ≈ same CPA. Lesson: never enable Display expansion in search campaigns.
- **Semrush MCP is CONNECTED** (mcp 465e59d3…, uses API units). Country research saved in `marketing/semrush/05-gcc-europe-expansion.md`: **Oman = 10x AE volume** (invest in oman 2,400/mo; oman investor visa 320 @ $0.20), UK best in Europe (golden visa 90), Germany = Persian diaspora (خرید ملک در عمان 70/mo), in/pk cheap volume. Master strategy in `06-master-ads-strategy.md` (portfolio C1 AE / C2 OM / C3 UK / C4 FA-DE).
- **NEXT ACTION (user approved, wizard was interrupted): build C2 "OM | EN" Search campaign** — clone C1 structure; geo Oman presence; Maximize Conversions; budget **$15/day, publish ENABLED (user explicitly said do NOT pause)**; ad groups: Invest in Oman / Investor Visa & Residency / Buy Property & Real Estate (+ apartments-for-sale-in-muscat tight group); attach shared negative list + campaign-level sovereign-fund negatives (investment authority/fund, oia, future fund); reuse C1 RSA copy adapted. Then: fix 404 redirect `/property/investment→/buy` in vercel.json; after Jul 17 add sovereign-fund negatives to C1; then C3 UK, C4 FA.

### Misc
- Client quotation prompt (EN→FA, site $2k + dashboard $2k + CRM $3-4k market) delivered in chat 2026-07-07 — user runs it through OpenAI.
- Persian RTL: Claude Code renderer can't do RTL (issues #38005/#45652/#30100); chat style = pure-Persian rules (memory persian-rtl-writing-style); long Persian deliverables → Artifacts (proven RTL).
