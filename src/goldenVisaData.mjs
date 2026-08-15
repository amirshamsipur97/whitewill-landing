// goldenVisaData.mjs — which of our live units clear the residency thresholds.
//
// Shared verbatim between src/pages/GoldenVisaPage.jsx (runtime) and
// prerender-routes.mjs (build time), the same arrangement priceIndexData.mjs
// uses, so the static HTML and the hydrated page can never disagree.
//
// The thresholds are GOVERNMENT figures, not ours: Oman's Long Term (Golden)
// Residency is published at OMR 250,000 for five years and OMR 500,000 for
// ten (omanresidence.gov.om). They are declared here as named constants rather
// than sprinkled through the copy so that a rule change is a one line edit.
//
// HONESTY NOTE that the page depends on: most of our stock does NOT clear
// these thresholds. Our entry price is around OMR 54,600. The page's job is to
// say that plainly and point those buyers at the separate ITC investor
// residency, not to imply every purchase is a golden visa.

export const TIER_5_OMR = 250000
export const TIER_10_OMR = 500000

const priceOf = (it) => Number(it?.unit?.price_omr)

function median(xs) {
  const s = xs.filter((n) => Number.isFinite(n)).sort((a, b) => a - b)
  if (!s.length) return null
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function bucket(key, label, items, extra = {}) {
  const prices = items.map(priceOf).filter((n) => n > 0)
  return {
    key,
    label,
    n: items.length,
    minPrice: prices.length ? Math.round(Math.min(...prices)) : null,
    medianPrice: prices.length ? Math.round(median(prices)) : null,
    ...extra,
  }
}

/**
 * @param items [{ unit, project }] — AVAILABLE units joined to their project.
 *   `project.area` (runtime shape from supabase.js) and `project.areas` (raw
 *   PostgREST shape used at build time) are both accepted.
 */
export function buildGoldenVisa(items) {
  const list = (items || []).filter((it) => it?.unit && it?.project && priceOf(it) > 0)
  const areaOf = (it) => it.project.area?.name || it.project.areas?.name || it.project.location || null
  const cityOf = (it) => it.project.area?.city || it.project.areas?.city || null

  const q5 = list.filter((it) => priceOf(it) >= TIER_5_OMR)
  const q10 = list.filter((it) => priceOf(it) >= TIER_10_OMR)
  const allPrices = list.map(priceOf)

  // Community rows for the qualifying set only. Sorted by how much choice the
  // community actually offers, because a row of one is barely a choice.
  const groups = new Map()
  for (const it of q5) {
    const a = areaOf(it)
    if (!a) continue
    if (!groups.has(a)) groups.set(a, [])
    groups.get(a).push(it)
  }
  const byArea = [...groups.entries()]
    .map(([area, sub]) =>
      bucket(area, area, sub, {
        city: cityOf(sub[0]),
        tenYear: sub.filter((it) => priceOf(it) >= TIER_10_OMR).length,
      }),
    )
    .sort((a, b) => b.n - a.n)

  return {
    units: list.length,
    qualify5: q5.length,
    qualify10: q10.length,
    // The cheapest thing we sell, used to make the "this does not qualify"
    // point concrete rather than abstract.
    entryPrice: allPrices.length ? Math.round(Math.min(...allPrices)) : null,
    // The cheapest thing that DOES qualify, which is the number a golden visa
    // buyer is actually shopping against.
    lowestQualifying: q5.length ? Math.round(Math.min(...q5.map(priceOf))) : null,
    areas: byArea.length,
    projects: new Set(q5.map((it) => it.project.name).filter(Boolean)).size,
    byArea,
  }
}
