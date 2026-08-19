import { createClient } from '@supabase/supabase-js'
import { trackLead } from './analytics.js'
import { getAttribution } from './lib/attribution.js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)

/**
 * POST a form submission to the `submit-form` Edge Function.
 * The Edge Function persists to `public.leads` and forwards to a
 * Google Apps Script webhook (Google Sheet) if configured.
 *
 * @param {object} payload
 * @param {string} payload.source - e.g. "rent_landing" | "feedback" | "partner"
 * @param {string} [payload.full_name]
 * @param {string} [payload.email]
 * @param {string} [payload.phone]
 * @param {string} [payload.message]
 * @param {string} [payload.property_interest]
 * @param {string} [payload.preferred_location]
 * @param {string} [payload.budget]
 * @param {number} [payload.rating]
 * @param {string} [payload.language]
 * @param {object} [payload.extra]
 */
export async function submitForm(payload) {
  // Campaign attribution. `getAttribution()` returns the first-touch UTM tags +
  // click ids captured on the landing pageview and persisted in sessionStorage,
  // so a form submitted from a deep SPA page (where the URL no longer carries
  // the query string) still records the campaign that produced the lead.
  // utm_source/medium/campaign map to leads columns; gclid/fbclid/etc. ride in
  // raw_data (the edge function spreads the whole body into it). Live URL params
  // still override, covering a direct submit on a freshly tagged URL.
  const attribution = getAttribution()
  const utmFromQuery = (() => {
    if (typeof window === 'undefined') return {}
    const sp = new URLSearchParams(window.location.search)
    const out = {}
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) {
      const v = sp.get(k)
      if (v) out[k] = v
    }
    return out
  })()

  const fnUrl = `${url}/functions/v1/submit-form`

  // ── dedup_key (required by the leads table) ────────────────────
  // The `public.leads` schema has `dedup_key text NOT NULL UNIQUE`. The
  // edge function used to mint one server-side but currently passes null
  // through, causing 500s. We mint a unique key client-side so every form
  // submission inserts cleanly: `${source}_${uuid}` keeps it human-greppable
  // while staying unique even if the same user submits twice.
  const mintDedupKey = () => {
    const src = (payload.source || 'form').replace(/[^a-z0-9_]/gi, '_').toLowerCase()
    const rand =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    return `${src}_${rand}`
  }

  const body = {
    ...attribution,
    ...utmFromQuery,
    page_url: typeof window !== 'undefined' ? window.location.href : undefined,
    ...payload,
    dedup_key: payload.dedup_key || mintDedupKey(),
  }

  const res = await fetch(fnUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Form submit failed (${res.status}): ${text}`)
  }

  // Lead generation — every form on the site routes through here, so this is
  // the single place we fire the GA4 `generate_lead` event (+ optional Google
  // Ads conversion). Wrapped so an analytics hiccup never breaks the submit.
  try {
    trackLead({ source: payload.source, language: payload.language })
  } catch { /* ignore analytics errors */ }

  return res.json()
}

// ── Insights / blog ────────────────────────────────────────────────
// Public reads go straight through the anon client; RLS exposes only
// rows where published = true. Writes go through the insights-admin
// edge function (see insightsAdmin below).

const INSIGHT_LIST_COLS =
  'id, slug, lang, title, excerpt, category, tags, reading_minutes, cover_image, author, published_at'

/** Published articles for a language, newest first. */
export async function fetchInsights({ lang = 'en', limit = 24, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('insights')
    .select(INSIGHT_LIST_COLS)
    .eq('lang', lang)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data ?? []
}

/** One published article by slug + language. Returns null if not found. */
export async function fetchInsightBySlug(slug, lang) {
  let q = supabase.from('insights').select('*').eq('slug', slug).eq('published', true)
  if (lang) q = q.eq('lang', lang)
  const { data, error } = await q.order('published_at', { ascending: false }).limit(1).maybeSingle()
  if (error) throw error
  return data ?? null
}

/**
 * Call the password-gated insights-admin edge function.
 * @param {string} action  'auth' | 'list' | 'get' | 'upsert' | 'delete'
 * @param {string} password
 * @param {object} [extra]  e.g. { id } or { row }
 */
export async function insightsAdmin(action, password, extra = {}) {
  const res = await fetch(`${url}/functions/v1/insights-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ action, password, ...extra }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export async function fetchProperties({ limit = 50 } = {}) {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      id, title, property_type, status, price_omr, price_usd,
      bedrooms, bathrooms, area_sqm, view, amenities, description,
      foreign_ownership_allowed, is_itc_zone, year_built,
      developer:developers(name, country_of_origin),
      area:areas(name, city, governorate)
    `)
    .order('listing_date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

/**
 * Fetch every available unit across every project — used by the global
 * filter toolbar so price/size ranges can be derived from actual data
 * and the map can dim projects with zero matching units.
 *
 * Returns flat list: [{ id, project_id, unit_type, bedrooms, view, total_area_sqm, price_omr, ... }]
 */
export async function fetchAllUnits() {
  const { data, error } = await supabase
    .from('project_units')
    .select(`
      id, project_id, unit_no, floor_label, unit_type, layout_type, bedrooms, view,
      internal_area_sqm, balcony_area_sqm, total_garden_sqm, total_area_sqm,
      price_omr, price_per_sqm_omr, availability_status, subproject
    `)
    .eq('availability_status', 'available')

  if (error) throw error
  return (data ?? []).map((u) => ({
    ...u,
    internal_area_sqm: u.internal_area_sqm != null ? Number(u.internal_area_sqm) : null,
    balcony_area_sqm:  u.balcony_area_sqm  != null ? Number(u.balcony_area_sqm)  : null,
    total_garden_sqm:  u.total_garden_sqm  != null ? Number(u.total_garden_sqm)  : null,
    total_area_sqm:    u.total_area_sqm    != null ? Number(u.total_area_sqm)    : null,
    price_omr:         u.price_omr         != null ? Number(u.price_omr)         : null,
    price_per_sqm_omr: u.price_per_sqm_omr != null ? Number(u.price_per_sqm_omr) : null,
  }))
}

/**
 * How many units are available site-wide, as a COUNT ONLY.
 *
 * The landing hero counter needs one integer, not the inventory. fetchAllUnits
 * pulls every column of every available row (hundreds of rows) and would be an
 * absurd payload to ship above the fold, so this uses PostgREST's
 * `head: true` + `count: 'exact'`: no body at all, just the Content-Range
 * header. Returns null on failure so the caller can fall back rather than
 * render a zero.
 */
export async function fetchAvailableUnitCount() {
  const { count, error } = await supabase
    .from('project_units')
    .select('id', { count: 'exact', head: true })
    .eq('availability_status', 'available')
  if (error) return null
  return typeof count === 'number' ? count : null
}

/**
 * Fetch all available units for a single project. Sorted by floor then unit_no.
 * Returns an empty array if the project has no inventory rows.
 *
 * unit_no is included in the result so the modal/AI form can pass it to
 * Supabase + the Google Sheet, but the DetailsPanel UI deliberately omits
 * it from the visible card (internal-only field per client request).
 */
export async function fetchProjectUnits(projectId) {
  if (projectId == null) return []
  const { data, error } = await supabase
    .from('project_units')
    .select(`
      id, unit_no, floor_label, unit_type, layout_type, bedrooms, view,
      internal_area_sqm, balcony_area_sqm, total_garden_sqm, total_area_sqm,
      price_omr, price_per_sqm_omr, availability_status, subproject
    `)
    .eq('project_id', projectId)
    .eq('availability_status', 'available')
    .order('floor_label', { ascending: true })
    .order('unit_no', { ascending: true })

  if (error) throw error
  return (data ?? []).map((u) => ({
    ...u,
    internal_area_sqm: u.internal_area_sqm != null ? Number(u.internal_area_sqm) : null,
    balcony_area_sqm:  u.balcony_area_sqm  != null ? Number(u.balcony_area_sqm)  : null,
    total_garden_sqm:  u.total_garden_sqm  != null ? Number(u.total_garden_sqm)  : null,
    total_area_sqm:    u.total_area_sqm    != null ? Number(u.total_area_sqm)    : null,
    price_omr:         u.price_omr         != null ? Number(u.price_omr)         : null,
    price_per_sqm_omr: u.price_per_sqm_omr != null ? Number(u.price_per_sqm_omr) : null,
  }))
}

/**
 * Fetch every project that has its own GPS coordinates, joined with
 * developer + area context for the popup.
 *
 * Returns: [{
 *   id, name, location, latitude, longitude,
 *   developer: { name },
 *   area: { name, city, governorate }
 * }]
 */
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, name, location, latitude, longitude,
      developer:developers(name, country_of_origin, website, description),
      area:areas(name, city, governorate)
    `)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []).map((p) => ({
    ...p,
    latitude: Number(p.latitude),
    longitude: Number(p.longitude),
  }))
}

/**
 * Featured international schools for the /schools page — location pins,
 * official website links and logos. Public read-only table `schools`.
 */
export async function fetchSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select('id, name, slug, website, curriculum, area, city, latitude, longitude, logo, sort_order')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((s) => ({
    ...s,
    latitude: s.latitude == null ? null : Number(s.latitude),
    longitude: s.longitude == null ? null : Number(s.longitude),
  }))
}
