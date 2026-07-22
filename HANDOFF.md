# Irfan Investment (whitewill-landing) — Session Handoff

_Last updated: 2026-07-15._ Consolidated reference for continuing work in a new session._

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

---

## §S. 2026-07-09→13 — Ads/SEO session: Salalah maneuver end-to-end

**Focus pivot:** site edits frozen except Ads/SEO. Operational DB = Google Sheet "Keywords-Ads"
(1cfCJvGMKq0fJpqe-TIna1WXbgcDjuONl1Uxib5c5YFc, 14 tabs) written via n8n workflow `abqoC37RIHWcaXDN`
"Sheet Writer" (webhook {sheet, rows[]}; creates tab if missing).

**Research (docs 07-11 in marketing/semrush/):** 4 competitor audits (vistaoman, alwalaaoman,
solomonoman, yourkanz) + mira-international + whitewill aida subdomain teardown. Verdicts: om db
volumes bid-grade; nobody in the niche executes SEO well; subfolders not subdomains; Salalah =
biggest untapped pocket (khareef: 1.07M visitors, 77% by land, UAE #1 / SA #2 sources).
Geo ranking: Oman(C2) >> UK+US golden visa(C3) > FA diaspora(C4) > RU-speakers abroad(C5 — Google
can't serve inside Russia). Semrush MCP died mid-session (free quota); trial sprint planned ~Jul 20.

**Site shipped (all deployed + verified):**
- RU geo auto-redirect: api/geo.js + first-visit logic in i18n.jsx (GEO_LANG map, extendable).
- /buy/hawana-salalah rebuilt: Supabase project id=19, 13 real units in 3 sub-projects via new
  project_units.subproject col (Amazi 6 from 98K incl Lubana LB-210/213; Olive Farms 3 FARM HOUSES
  from 77,250; Solaris 4 from 35,625 — all official Muriya sales offers), 6 sections ×4 langs,
  13-photo gallery, map pin 17.030139,54.310083, sub-project selector (default ALL, ?release= preselects),
  video hero (S1.mp4 → hawana-hero{,-mobile}.mp4, PSI-safe lazy pattern in BuyProjectPage HERO_VIDEO).
- /buy: Salalah SEO banner + "✦ Salalah Special Releases" row (3 branded Figma covers → gallery
  folders amazi/solaris/olive-farms) + glowing featured card (projectDetails featured:true) +
  dedicated SalalahPopup (bigger images, khareef offer chips, source=popup_salalah, event
  irfan:open-salalah-popup) + Buy search now matches unit layout_type ("lubana" works).
- ⚠️ Vercel edge cache served 40h-stale HTML — when prod looks stale check age/x-vercel-cache
  headers, fix with `vercel deploy --prod --yes --force`.

**Ads state:** C1 frozen till ~Jul 17 (surgery list in sheet Insights; best converter 'oman
investment' is QS-throttled). Account stats since launch: 105 clicks / 8 conv / 7.62% CR — funnel
healthy, volume low; 81% mobile, male 25-44. **C6 | AE+SA | Salalah wizard IN PROGRESS** —
"without guidance" selected, next = pick SEARCH type; bidding revised to Maximize Clicks
w/ $0.80 CPC cap (max-visits goal), switch to MaxConv after ~15-20 leads. Full spec in sheet tab
"C6 Salalah Build Sheet" + AR keyword bank (11 rows, 2026-07-11) + AR tourism negatives
(incl للايجار no-hamza). C2 Oman build sheet also ready ("C2 Build Sheet" tab).

**Costs (sheet tab "Costs"):** infra ≈ $115 fixed (Vercel 20 + Supabase Pro 25 + n8n Pro ~66 +
domain + Vapi number) + $25-90 variable APIs; ads separate (C1 $775/mo, C2 +$450 planned).

## 2026-07-13 → 07-15 sessions — C6 Salalah ads campaign + Sifah data correction + popup overhaul
- **Google Ads C6 "C6 | AE+SA | Salalah Waterfront Homes | Search" PUBLISHED (Jul 13, campaignId 24025469441, acct 855-960-9654):** Max Clicks + $0.80 CPC cap, $20/day, 10 cities presence-only (5 AE + 5 SA), EN+AR, Search partners/Display/AI Max OFF. AG1 18 EN keywords; AG2 | AR Salalah (10 AR keywords, AR RSA, /ar/ landing). 30 tourism+sovereign negatives applied campaign-level. Conversion goal = Submit lead forms. Learning ~5 days from Jul 13. ⚠️ Payment method issue (~$142) was blocking serving — user settling.
- **DATA CORRECTION: Solaris AND Olive Farms are at Raya · JEBEL SIFAH, not Salalah.** All 7 units moved to project id=2 in Supabase; subproject blocks moved to 'Jebel Sifah' in projectDetails.js (subProjects — capital P, page reads that key); Sifah page now a 2-release hub (count-aware heading, filter cards, map pin already correct); Hawana = pure Amazi/Lubana, 6 units, min OMR 98,000.
- **SalalahPopup = the ONLY popup site-wide** (LeadPopup deleted; launcher pill "Investment plan" opens it; mounts on all routes incl. landing). Geo-currency by IP via /api/geo: OM→OMR 98,000/9,800 · AE→AED 936,000/93,600 · SA→SAR 955,800/95,600 · RU→≈23/2,3 млн RUB · else $254,900/$25,490 USD. Down payment bolded at sentence start. Slides = 3 hawana photos + 4 new Amazi interious renders (files 14-17).
- **/buy "Special Releases" row (renamed from Salalah Special Releases): 3 mixed-destination cards** — Lubana Island→hawana?release=Amazi · Muscat Bay (new cover, Figma 770-22307)→/buy/zen-residences · Olive Farms (fresh cover 770-22342)→/buy/jebel-sifah?release=Olive%20Farms. Lubana cover upgraded to 1524×1088 (Figma 856-22759 @4x).
- **SEO round:** dedicated 4-lang meta for /buy/hawana-salalah (from OMR 98,000); vercel.json 301s: /property/*, /oman-property/* → /buy; /salalah → /buy/hawana-salalah (+/ar). n8n blog agent (KjDPPqA7lRm0U2M2) biased to Salalah topics + Salalah Pexels imagery + mandatory internal link to /buy/hawana-salalah (revert ~Sep 15).
- **NEXT SESSION = ADS FIXES ONLY** — see memory `irfaninvest-ads-campaign` "TOMORROW'S C6 FIX LIST" (billing check → stale Solaris headline/sitelinks → AR fixes → asset completion → day-3 search terms → master negatives attach → rename AG1 → CPC cap decision).

## 2026-07-20 → 07-21 sessions — Hay Al Wafa launch, fa-SEO push, C8 Persian campaign

**Site (all deployed + committed through `fc8b4f2`, pushed):**
- **Hay Al Wafa LIVE:** 36×2BHK units in Supabase (project_id=6, prices = "Handover Non-Eligible incl furniture" 92,088–99,543 OMR, OREX ignored/expired), pin moved to plus code M34P+3V (23.65519/58.08719), 4-lang projectDetails rewritten (old copy was WRONG "villas·Al Mouj"). unit_no stays internal-only.
- **Blog covers deduped:** 13 slugs re-assigned to own gallery (muscat-1..10, salalah-1..3) via SQL; 0 duplicate covers across 31 slugs; prod redeployed so og:image is fresh.
- **"buy property in oman"/«خرید ملک در عمان» push:** keyword-first home+/buy titles, shared `src/buySeoContent.mjs` → crawlable 4-lang copy+FAQ (+FAQPage JSON-LD id=buy-faq-jsonld) on /buy, mirrored into prerender-routes.mjs static pages.
- **fa i18n COMPLETE:** FA_OVERLAY for ALL 22 projects (5 with full sections) + fa labels on all 26 FEATURE_META chips. No English fallback left on /fa project pages.
- **Footer trust:** Russia branch → "Russian-speaking desk · Muscat" (WhatsApp +968 7758 4941, RU-language address line); Hong Kong branch DELETED; grids 4→3; About prose updated. GlobalPresencePanel (landing Figma section) still mentions HK/Moscow — untouched by design.
- **Favicon fixed for Google:** favicon-48/96/192.png + multi-size favicon.ico + apple-touch-icon (source: images/irfan-logo-circle.png). SVG-only was causing the generic globe in Search/Ads. Needs Google recrawl (~days); user should Request Indexing of / in GSC.
- fa popup copy fixed: «صلاله» spelling (was سلاله ×4) + «صاحب خانه‌ای» grammar.

**Google Ads — C8 Persian campaign LIVE (id 24053228816):**
- Search-only, Oman + **Presence-only**, langs fa+en+ar, goal Submit lead forms (⚠️ inherits the 2-action double-count), AI Max OFF, "using only your keywords".
- AG1 "Ad group 1": 16 phrase fa kws (core خرید ملک/خانه/آپارتمان + مسقط). AG2 "AG2 | Prices | قیمت ملک": 8 price kws, 15 keyword-exact headlines + DKI {KeyWord:قیمت ملک در عمان}, 4 descs. Ad strength stuck "Poor" on «Include popular keywords» = fa low-volume limitation, NOT fixable, does NOT affect auction (real CTR 13-14%).
- 22 campaign-level phrase negatives (رایگان/کاریابی/تور/تحصیل/سفارت/اجاره/عکس/قاچاق...).
- Day-1 burn: $40.38 = 3 clicks @ $13.46 CPC (MaxConv no-data overbidding) → bidding SWITCHED to **Target Impression Share / Absolute top / 90% / max CPC $5**, budget 40→**$50/day**. Serving paused end of day-1 (budget exhausted + strategy propagating); expect rank-1 from next morning with $1-5 clicks.
- Ad Preview (Tools→Troubleshooting) said "no keywords matched" during the outage — keywords ARE Eligible («خرید ملک در عمان» 14 impr/14.29% CTR). Re-test next day; if still not showing → real problem.
- User was mid-entry: 8 fa campaign-level sitelinks (data in chat/xlsx) to displace account-level English ones; callouts + structured snippet (انواع) pending; Business logo asset + advertiser verification pending.
- **Database file:** `../oman-fa-google-ads-database-2026-07-21.xlsx` (8 RTL sheets: 232 kws, SERP analysis incl. competitor GBP named «خرید ملک در عمان» = homelist's WhatsApp, 72 RSA lines, launch settings). AG3 اقامت / AG4 صلاله packages ready to paste from it.

**Next session TODOs:** ① re-test Ad Preview (Muscat/Persian) → confirm absolute-top serving ② finish sitelinks/callouts/snippet + Business logo if user didn't ③ build AG3+AG4 from xlsx ④ day-3 search terms + budget rightsizing (drop to $30-40 if IS≥90%) ⑤ Anthropic credits still EMPTY → top up, then n8n execute_workflow KjDPPqA7lRm0U2M2 (production mode) to backfill blog 07-20/21/22 ⑥ Google Business Profile for Muscat office (biggest SERP gap) ⑦ fa article «قیمت خانه در عمان به پول ایران» ⑧ conversion double-count + UTM fixes still pending account-wide.
