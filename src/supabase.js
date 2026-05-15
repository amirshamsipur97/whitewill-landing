import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)

/**
 * POST a form submission to the `submit-form` Edge Function.
 * The Edge Function persists to `public.leads` and forwards to a
 * Google Apps Script webhook (Google Sheet) if configured.
 *
 * @param {object} payload
 * @param {string} payload.source - e.g. "sell_landing" | "rent_landing" | "feedback" | "partner"
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
  const body = {
    ...utmFromQuery,
    page_url: typeof window !== 'undefined' ? window.location.href : undefined,
    ...payload,
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
  return res.json()
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
