# Property Search Engine — Session Handoff (2026-07-23)

Repurposing the site's "Project" nav into a real, unit-level property search
portal modelled on the LuxuryProperty.com structure the client referenced.

## Inventory (the data this powers)
- **22 projects · 407 units (405 priced)** · 11 areas (6 with stock) · 16 unit types · OMR 35,625–898,521.
- Active areas: Sultan Haitham City (208u), Al Mouj (124u), Yiti/Aida (49u), Muscat Bay (13u), Jebel Sifah (7u), Salalah (6u).
- Empty placeholders (0 units): Muscat Hills, Sohar, Duqum, Qantab, Qurum.
- Data via `fetchProjects()` (only projects WITH lat/lng) + `fetchAllUnits()` in `src/supabase.js`.
- ⚠️ `unit_no` is internal-only (business rule) → cards show a generated public ref `IRF-<id>`, never unit_no.

## ✅ DONE this session (Phase 1 — shipped, live)
- **`src/pages/SearchPage.jsx`** — new unit-level search engine. Route **`/project`** (all 4 langs via PageRoutes). Reuses design tokens (`FONT`, `OLIVE_BRIGHT` from `components/invest/ui.jsx`), `slugify` (from BuyPage), `coverForSlug`, `LocalizedLink`.
  - Search hero: location text box (matches project/area/city/type) + Property Type + Beds + Price dropdowns + Search button.
  - Breadcrumb (Home › Properties) + live count + Sort (price asc/desc, area desc).
  - Filters live in the **URL** (`?q,?type,?beds,?price,?sort`) → shareable + prerenderable. Client-side filter/sort over 407 units (instant).
  - Unit cards: cover (gallery or stock-pool fallback), FREEHOLD + availability badges, title "`{beds}-Bed {type} · {project}`" (studios de-duped → "Studio Apartment"), area, OMR price, beds·area·type stat row, `Ref: IRF-<id>`, "View details" → links to rich **`/buy/:slug`** project page (reused as the detail page per the approved architecture).
  - Verified live-local: renders, `type=Villa` → 40 results, sort works, all cards have images.
- **Nav repurposed:** `Header.jsx` + `SiteFooter.jsx` "Project" item `to:'/'` → `to:'/project'`.
- **Route:** `App.jsx` lazy `SearchPage` + `<Route path="project">`.

## ✅ DONE Phase 2 (2026-07-23, shipped)
1. **SEO wiring** — added `'/project'` to `src/seoRoutes.mjs` ROUTES (4-lang title/desc). Both `seo.jsx` (client) and `prerender-routes.mjs` (build) read ROUTES → `/project` now prerenders in **all 4 langs** with proper `<title>`/meta (verified: `dist/{,,ar/,fa/,ru/}project/index.html`). Removed the redundant client `document.title` from SearchPage.
2. **Localized dropdown labels** — `LABELS[lang]` index-aligned arrays for type/beds/price/sort/anyArea in en/ru/ar/fa. Verified on `/fa/project` (RTL, all labels Persian).
3. **Area filter** — Area dropdown derived from projects-with-stock (`project.area?.name || location`), added as `?area=` param. Localized "Any area" / "همه مناطق".
4. **Deep-link `?unit=<id>`** — search card links now `/buy/:slug?unit=<id>`. `BuyProjectPage` reads it, adds `id="unit-<id>"` to each row and persistently highlights the matching row (olive bg + left border). VERIFIED the param flows to the project page.
   - ⚠️ **Auto-scroll to the row is NOT wired** — this page runs Lenis *transform*-scroll (`window.__lenis.scroll` decoupled from `window.scrollY`) + GSAP ScrollTrigger pins + DeferredMount, so the inventory row sits ~5000px down and `lenis.scrollTo`/`scrollTo` land in pinned/empty space (black) or get clamped (DeferredMount not mounted). Native `window.scrollTo` also shows black. **Follow-up:** wire a scroll via the site's actual ScrollTrigger scroller-proxy, or lazy-render the inventory higher, then re-enable auto-scroll + also confirm the persist-highlight paints (couldn't visually confirm on dev — row is off-screen and DeferredMount blocks programmatic reach).

## ✅ DONE Phase 3 (2026-07-23, part 1 — shipped)
1. **Landing/home search entry** — added a persistent glass search pill + olive Search button to `ScrollVideoHero.jsx`, anchored at the hero bottom. It's a real interactive `<form>` (unlike the pointer-events-none text steps) that fades on first scroll via the GSAP timeline (`autoAlpha`, so it stops catching clicks when hidden). Submit → `useLocalizedNavigate('/project?q=…')`, staying in the active language. VERIFIED: typing "Salalah" on `/` lands on `/project?q=Salalah` → 6 results.
4. **Dedupe near-identical units** — `results` now collapses each `(project, type, beds, exact price)` set into one card carrying a `count`; card shows a `×N` image badge, a "From" price prefix, and a localized "N similar units available" line. First unit is the representative the card links to. VERIFIED: `?type=Villa` 40 units → 34 grouped cards, Yenaier trio shows `×3`.
6. **Localize card title unit-type + availability badge** — new `TYPE_WORDS`/`STUDIO_TITLE`/`AVAIL` maps + `unitTitle()`, `localizeStatus()`, `localizeDigits()` helpers. Title, beds, area, count and status all localize (en/ru/ar/fa) with Persian/Arabic-Indic numerals; project names stay English brand nouns. VERIFIED on `/fa/project`: "ویلا ۳ خوابه", "موجود", "×۳", "۳ واحد مشابه موجود است".

## ✅ DONE Phase 3 (2026-07-23, part 2 — UI redesign, verified local, NOT committed)
**Full editorial "Le Figaro Properties" redesign of `SearchPage.jsx`** (built via ui-ux-pro-max skill). Deliberately **light-mode** on a milky-cream paper bg (`PAPER #F6F1E7`), **sharp corners everywhere (no border-radius)**, warm hairline rules (`LINE #E5DDCC`), brand olive kept only for price/accents, dark ink (`#1c1b17`) primary buttons.
- **Filter bar** = label/value chips (`FilterChip` overlays a transparent real `<select>` so native/a11y behaviour + the uppercase LOCATION/PROPERTY TYPE/BEDROOMS/BUDGET caption both work). White free-text search + dark "Search" button. Chips localized (`CHIP_LABELS` en/ru/ar/fa).
- **Horizontal listing cards** (image-left / details-right → stack on mobile) replacing the old grid: FREEHOLD tag, photo-count badge, ×N similar badge, area eyebrow, title, view/floor line, olive price + price/m², spec rule (beds·m²·type), agency+ref, Contact (ghost) + View-the-listing (ink) CTAs.
- **Responsive** via a component-scoped `<style>` block (`.pfx-*`, 768px breakpoint): bar goes column, chips horizontal-scroll (scrollbar hidden), search+button full-width, card stacks. ⚠️ gotcha fixed: in column mode `flex:1 1 260px` put the basis on the *vertical* axis → search box ballooned; override `.pfx-search{flex:0 0 auto}` at ≤768px.
- **Image variety (client ask)** — cards now rotate through each project's OWN `galleryFor(slug)` images by a per-project index (Wadi Zaha/Yenaier 4 imgs → 4 distinct covers instead of one shared cover). Projects with no gallery fall back to a hashed pick from a 32-image stock POOL (`/images/blog/*`), varied per unit id. VERIFIED: 8 Yenaier cards → images 1,2,3,4,1,2,3,4 (4 distinct).
- Verified: desktop en, mobile 375px, RTL `/fa/project` (mirrored bar, Persian digits, localized chips + "فری‌هولد").

## 🔜 NEXT (Phase 3 — remaining)
2. **Fix deep-link auto-scroll + verify highlight** (see ⚠️ in Phase 2) — the one item that needs the Lenis/ScrollTrigger scroller sorted.
3. **Per-unit detail page (optional, matches reference fully)** — `/project/:ref` with gallery + description + Features & Amenities + inquiry form. Our data is rich at project level, thin at unit level, so card→project page is usually enough.
5. **Map view toggle** — reuse `PropertyMap.jsx` for a list/map switch.

## Gotchas / notes
- `fetchProjects()` filters `.not('latitude','is',null)` → units in a coord-less project are dropped from results (393 of 405 priced show). Fine for now (empty-area projects have 0 units anyway); if a real project is missing, give it lat/lng.
- Do NOT use `/images/projects/${slug}.jpg` as an image fallback — a miss resolves to the SPA index.html and renders as a dark/broken card. `coverFor` now uses `coverForSlug || PLACEHOLDER_POOL` only.
- Keep the existing `/buy` (project-card listing, SEO-ranked for "buy property in oman") — the new `/project` is the unit-search layer, not a replacement.
- Design language: dark olive-luxury (`INK #0d0e0c`, `CARD #141512`, `OLIVE_BRIGHT #8c8d25`), matches the rest of the site.
