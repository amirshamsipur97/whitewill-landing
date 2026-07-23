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

## 🔜 NEXT SESSION (Phase 2 — roadmap, in priority order)
1. **SEO wiring for /project** — add a `/project` branch to `src/seo.jsx` (4-lang title/description targeting "properties for sale in oman", "buy apartment in muscat") + add to `prerender-routes.mjs` / `seoRoutes.mjs` so it prerenders. Currently the page only sets `document.title` client-side.
2. **Deep-link the unit** — card link is `/buy/:slug`; pass `?unit=<id>` and have `BuyProjectPage` scroll to / highlight that unit row (it already reads `?release=`; extend with `?unit=`).
3. **Landing/home search entry** — put the search bar (or a CTA) on the landing hero so visitors enter the funnel from `/`.
4. **Area filter** — add an Area/location dropdown (SHC, Al Mouj, Yiti, Muscat Bay, Sifah, Salalah) beside Type/Beds/Price. Data already there (`project.area?.name` / `project.location`).
5. **Per-unit detail page (optional, matches reference fully)** — `/project/:ref` with gallery + description + Features & Amenities + inquiry form. Only if the client wants individual property pages; our data is rich at project level, thin at unit level, so Phase-1 (card → project page) is usually enough.
6. **Dedupe near-identical units** — Jebel Sifah shows 3 identical studios, Yenaier many identical 3-bed villas. Consider grouping "N similar from OMR X" per (project, type, beds, price) to reduce repetition.
7. **Map view toggle** — reuse `PropertyMap.jsx` for a list/map switch.
8. **Localize the dropdown option labels** (currently English in all langs) + the `STR` strings are done for hero/breadcrumb/count.

## Gotchas / notes
- `fetchProjects()` filters `.not('latitude','is',null)` → units in a coord-less project are dropped from results (393 of 405 priced show). Fine for now (empty-area projects have 0 units anyway); if a real project is missing, give it lat/lng.
- Do NOT use `/images/projects/${slug}.jpg` as an image fallback — a miss resolves to the SPA index.html and renders as a dark/broken card. `coverFor` now uses `coverForSlug || PLACEHOLDER_POOL` only.
- Keep the existing `/buy` (project-card listing, SEO-ranked for "buy property in oman") — the new `/project` is the unit-search layer, not a replacement.
- Design language: dark olive-luxury (`INK #0d0e0c`, `CARD #141512`, `OLIVE_BRIGHT #8c8d25`), matches the rest of the site.
