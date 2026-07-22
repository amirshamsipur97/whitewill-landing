// attribution.js — capture ad-click attribution once, keep it for the whole visit.
//
// UTM tags + click ids (gclid/fbclid/…) only live in the URL on the LANDING
// pageview. Inside the SPA the first client-side navigation drops the query
// string, so a form submitted from a deeper page used to lose its campaign
// tags — only 1 of 36 leads in a 30-day window carried any UTM. We snapshot
// the params on first load into sessionStorage (first touch wins) and read
// them back at submit time so every lead keeps the campaign that produced it.

const STORE_KEY = 'ww_attribution'

// Every param we want to preserve. utm_source/medium/campaign map to dedicated
// leads columns in the submit-form edge function; the rest ride along in the
// row's raw_data jsonb (the edge function spreads the whole body into it).
const PARAM_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid',
]

function readStore() {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeStore(obj) {
  if (typeof sessionStorage === 'undefined') return
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify(obj)) } catch { /* ignore quota/privacy errors */ }
}

/**
 * Snapshot campaign params from the current URL into sessionStorage.
 * First touch wins: once a campaign-tagged snapshot exists for this visit,
 * later (usually tag-less) pageviews never overwrite it. Idempotent and safe
 * to call on every page_view. Returns the stored attribution object.
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return {}
  const existing = readStore()
  // Already captured a tagged landing this session -> preserve first touch.
  if (existing && existing._tagged) return existing

  const sp = new URLSearchParams(window.location.search)
  const found = {}
  for (const k of PARAM_KEYS) {
    const v = sp.get(k)
    if (v) found[k] = v
  }
  const tagged = Object.keys(found).length > 0

  const snapshot = {
    ...found,
    _tagged: tagged,
    landing_page: (existing && existing.landing_page) || window.location.pathname + window.location.search,
    referrer: (existing && existing.referrer) || (typeof document !== 'undefined' ? document.referrer || null : null),
    first_seen: (existing && existing.first_seen) || new Date().toISOString(),
  }
  writeStore(snapshot)
  return snapshot
}

/**
 * Attribution fields to attach to a lead submit — the persisted campaign tags
 * plus landing_page/referrer/first_seen, minus the internal `_tagged` flag.
 */
export function getAttribution() {
  const s = readStore() || captureAttribution()
  if (!s) return {}
  const { _tagged, ...rest } = s
  return rest
}
