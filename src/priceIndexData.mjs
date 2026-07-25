// priceIndexData.mjs — the maths behind /property-prices-in-oman.
//
// WHY: the SEO overhaul closed every on-site gap, but the site still has
// nothing anyone would voluntarily LINK to. Listings do not earn backlinks;
// data does. This turns the ~400-unit live inventory into a per-m² price index
// that journalists, forums and relocation blogs can cite — the one asset class
// Bayut and Dubizzle cannot copy from us because it is our own portfolio.
//
// Shared verbatim between src/pages/PriceIndexPage.jsx (runtime, live data)
// and prerender-routes.mjs (build time, baked into the static HTML). Plain
// data module: no JSX, importable from node.
//
// HONESTY RULES BAKED IN — this page must never read as "the Oman market":
//   • every figure is unit-weighted over Irfan's own AVAILABLE inventory;
//   • every row carries its sample size `n`;
//   • rows under MIN_SAMPLE are flagged so a 2-unit "median" is never quoted
//     as if it were a market rate.

export const MIN_SAMPLE = 5

const TYPE_MAP = [
  [/villa/i, 'Villa'],
  [/penthouse/i, 'Penthouse'],
  [/town\s*house|townhouse/i, 'Townhouse'],
  [/chalet/i, 'Chalet'],
  [/studio/i, 'Studio'],
]
export const typeGroup = (t) => {
  for (const [re, name] of TYPE_MAP) if (re.test(String(t || ''))) return name
  return 'Apartment'
}

// MUST match src/pages/BuyPage.jsx slugify so project links hit real routes.
export const slugify = (name) =>
  String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

// A home whose REGISTERED area is mostly private plot rather than floor.
//
// project_units.total_area_sqm follows two conventions in the source data,
// verified unit by unit on 2026-07-25:
//   • Wadi Zaha records the plot ALONGSIDE a covered-only total (total ==
//     internal, garden in its own column) — the total is already the right
//     denominator, so those villas must NOT be excluded;
//   • Hawana Salalah villas and the Jebel Sifah farm houses fold the plot INTO
//     the total (total ≈ internal + garden), so dividing by it prices land and
//     floor at the same rate and returns ~300 OMR/m² next to a ~950 median.
// The test therefore needs BOTH conditions. It currently catches exactly five
// units out of ~395; they keep their unit count and price columns and are left
// out of the per-m² figures only.
export function isPlotDominant(u) {
  const total = Number(u?.total_area_sqm)
  const internal = Number(u?.internal_area_sqm)
  const garden = Number(u?.total_garden_sqm)
  if (!(total > 0) || !(garden > 0)) return false
  if (!(total > internal)) return false
  return garden / total > 0.5
}

// Price per m² is COMPUTED, never read from project_units.price_per_sqm_omr.
// Two reasons. That column is NULL for 87 of the 395 available units (all of
// Yenaier), and where it IS filled it is not internally consistent: it matches
// price / total_area for 285 of 308 units, but Vistal stores hand-rounded
// marketing rates (2,000 / 2,300 / 2,600) that are 5-19% above the arithmetic,
// and the plot-heavy homes above store price / internal instead.
//
// Dividing the listed price by the listed area is also the only definition a
// reader can REPRODUCE from our own unit pages, which show total_area_sqm as
// the home's built-up area. An index nobody can check is not citable.
export function pricePerSqm(u) {
  const price = Number(u?.price_omr)
  const area = Number(u?.total_area_sqm)
  if (!(price > 0) || !(area > 0)) return null
  if (isPlotDominant(u)) return null
  return price / area
}

export function median(xs) {
  const s = xs.filter((n) => Number.isFinite(n)).sort((a, b) => a - b)
  if (!s.length) return null
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

// Median is the headline everywhere: with 196 of 395 units in one master-plan
// district, a mean would be dragged around by whichever project last restocked.
function bucket(key, label, items, extra = {}) {
  const ppsm = items.map((it) => pricePerSqm(it.unit)).filter((n) => n != null)
  const prices = items.map((it) => Number(it.unit.price_omr)).filter((n) => n > 0)
  const areas = items.map((it) => Number(it.unit.total_area_sqm)).filter((n) => n > 0)
  return {
    key,
    label,
    n: items.length,
    thin: items.length < MIN_SAMPLE,
    medianPpsm: ppsm.length ? Math.round(median(ppsm)) : null,
    minPpsm: ppsm.length ? Math.round(Math.min(...ppsm)) : null,
    maxPpsm: ppsm.length ? Math.round(Math.max(...ppsm)) : null,
    medianPrice: prices.length ? Math.round(median(prices)) : null,
    minPrice: prices.length ? Math.round(Math.min(...prices)) : null,
    medianArea: areas.length ? Math.round(median(areas)) : null,
    ...extra,
  }
}

function groupBy(items, keyFn, labelFn = (k) => k, extraFn = () => ({})) {
  const m = new Map()
  for (const it of items) {
    const k = keyFn(it)
    if (k == null || k === '') continue
    if (!m.has(k)) m.set(k, [])
    m.get(k).push(it)
  }
  return [...m.entries()].map(([k, list]) => bucket(k, labelFn(k, list), list, extraFn(k, list)))
}

const byPpsmDesc = (a, b) => (b.medianPpsm ?? -1) - (a.medianPpsm ?? -1)

/**
 * @param items [{ unit, project }] — AVAILABLE units joined to their project.
 *   `project.area` (runtime, supabase.js) or `project.areas` (build time,
 *   raw PostgREST) both work.
 */
export function buildPriceIndex(items) {
  // A unit with no price is not "priced" and has no place in a price index —
  // two Yenaier units are currently in that state. Filtering here keeps the
  // headline count honest against the "{units} units priced" label.
  const list = (items || []).filter(
    (it) => it?.unit && it?.project && Number(it.unit.price_omr) > 0 && Number(it.unit.total_area_sqm) > 0,
  )
  const areaOf = (it) => it.project.area?.name || it.project.areas?.name || it.project.location || null
  const cityOf = (it) => it.project.area?.city || it.project.areas?.city || null

  const all = bucket('all', 'All', list)
  const byArea = groupBy(list, areaOf, (k) => k, (k, l) => ({ city: cityOf(l[0]) })).sort(byPpsmDesc)
  const byType = groupBy(list, (it) => typeGroup(it.unit.unit_type)).sort((a, b) => b.n - a.n)
  const byProject = groupBy(
    list,
    (it) => it.project.name,
    (k) => k,
    (k, l) => ({ slug: slugify(k), area: areaOf(l[0]) }),
  ).sort(byPpsmDesc)
  const byBeds = groupBy(
    list,
    (it) => (it.unit.bedrooms == null ? null : String(it.unit.bedrooms)),
    (k) => k,
  ).sort((a, b) => Number(a.key) - Number(b.key))
  // City is a coarser cut than community and the one people actually search
  // ("property prices in Muscat", "…in Salalah"). Al Seeb is administratively
  // its own wilayat but sits inside Muscat Governorate, so each row also
  // carries the communities behind it and the table states the distinction.
  const byCity = groupBy(
    list,
    cityOf,
    (k) => k,
    (k, l) => ({ areas: [...new Set(l.map(areaOf).filter(Boolean))].sort() }),
  ).sort(byPpsmDesc)

  return {
    units: all.n,
    // Stated in the method section — an exclusion nobody can see is not a
    // methodology, it is a fudge.
    plotExcluded: list.filter((it) => isPlotDominant(it.unit)).length,
    projects: byProject.length,
    areas: byArea.length,
    cities: new Set(list.map(cityOf).filter(Boolean)).size,
    overall: all,
    byArea,
    byCity,
    byType,
    byProject,
    byBeds,
  }
}

// ── formatting (shared so the static HTML and the React page agree) ─────────
// Latin digits everywhere in the tables, even in fa/ar: these are figures
// people copy into spreadsheets, and the rest of the site already prints
// prices with toLocaleString('en-US').
export const fmtInt = (n) => (n == null ? '–' : Number(n).toLocaleString('en-US'))
export const fmtOmr = (n) => (n == null ? '–' : `OMR ${Number(n).toLocaleString('en-US')}`)
export const fmtRange = (a, b) => (a == null || b == null ? '–' : `${fmtInt(a)} – ${fmtInt(b)}`)
export const fmtSqm = (n) => (n == null ? '–' : `${fmtInt(n)} m²`)
