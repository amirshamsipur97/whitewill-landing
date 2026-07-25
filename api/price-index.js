// Machine-readable companion to /property-prices-in-oman, served at
// /api/price-index.json (rewrite in vercel.json).
//
// WHY: the price index page exists to be CITED. A Dataset in JSON-LD that
// advertises no distribution is a claim rather than a dataset, and anyone who
// actually wants to chart or check our figures currently has to scrape four
// HTML tables. This serves the same numbers, from the same module the page and
// the prerenderer use, so the three can never disagree.
//
// It is computed live on request rather than baked at build time for the same
// reason the page is: a unit that sells leaves the index with no manual step.

import { buildPriceIndex } from '../src/priceIndexData.mjs'

const SUPABASE_URL = 'https://owgvrxipqlusepozlujv.supabase.co'
const ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3ZyeGlwcWx1c2Vwb3psdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTYxMjQsImV4cCI6MjA5MjM3MjEyNH0.vZK4z9p9pUF1rZ8LHadFReBcEcwidwy9ZdEXnSmK4Fs'
const SITE = 'https://www.irfaninvest.com'

async function fetchInventory() {
  const h = { apikey: ANON, Authorization: `Bearer ${ANON}` }
  const [pr, ur] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/projects?select=id,name,location,areas(name,city)`, { headers: h }),
    fetch(
      `${SUPABASE_URL}/rest/v1/project_units?select=id,unit_type,bedrooms,total_area_sqm,internal_area_sqm,total_garden_sqm,price_omr,project_id&availability_status=eq.available&limit=2000`,
      { headers: h },
    ),
  ])
  if (!pr.ok) throw new Error(`supabase projects ${pr.status}`)
  if (!ur.ok) throw new Error(`supabase units ${ur.status}`)
  const byId = new Map((await pr.json()).map((p) => [p.id, p]))
  return (await ur.json())
    .map((u) => ({ unit: u, project: byId.get(u.project_id) }))
    .filter((x) => x.project)
}

// Only the fields a reader needs. `n` travels with every row on purpose: a
// median without its sample size is not quotable, which is the same rule the
// page's own tables follow.
const row = (r) => ({
  name: r.label,
  units: r.n,
  medianPricePerSqm: r.medianPpsm,
  minPricePerSqm: r.minPpsm,
  maxPricePerSqm: r.maxPpsm,
  medianPrice: r.medianPrice,
  minPrice: r.minPrice,
  medianAreaSqm: r.medianArea,
  lowSample: r.thin,
})

export default async function handler(req, res) {
  try {
    const index = buildPriceIndex(await fetchInventory())
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    // Public and cacheable: this is a citable artefact, not user data.
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json({
      name: 'Oman Property Price Index',
      publisher: 'Irfan Investment Group',
      source: `${SITE}/property-prices-in-oman`,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      generatedAt: new Date().toISOString(),
      currency: 'OMR',
      // Stated in the payload, not just on the page: whoever pulls this feed
      // and never reads the page still gets the scope and the exclusions.
      scope:
        'Freehold homes currently listed for sale by Irfan Investment Group inside Omani Integrated Tourism Complexes, the zones open to buyers of any nationality. A portfolio index, not an official national statistic. Developer list prices before negotiation, excluding registration and transaction costs, furnishing and service charges.',
      method:
        'Price per square metre is the asking price divided by the published total area of the home. Medians rather than means. Homes whose registered area is mostly private plot rather than floor area are excluded from the per-square-metre figures only.',
      totals: {
        units: index.units,
        communities: index.areas,
        cities: index.cities,
        developments: index.projects,
        plotDominantExcluded: index.plotExcluded,
        medianPricePerSqm: index.overall.medianPpsm,
        medianPrice: index.overall.medianPrice,
        minPrice: index.overall.minPrice,
        medianAreaSqm: index.overall.medianArea,
      },
      byCommunity: index.byArea.map((r) => ({ ...row(r), city: r.city })),
      byCity: index.byCity.map((r) => ({ ...row(r), communities: r.areas })),
      byType: index.byType.map(row),
      byBedrooms: index.byBeds.map((r) => ({ ...row(r), bedrooms: Number(r.key) })),
      byDevelopment: index.byProject.map((r) => ({
        ...row(r),
        community: r.area,
        url: `${SITE}/buy/${r.slug}`,
      })),
    })
  } catch (e) {
    res.status(502).json({ error: 'price index unavailable', detail: String(e?.message || e) })
  }
}
