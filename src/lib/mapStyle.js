/**
 * mapStyle.js — the single place every Mapbox map on the site reads its style
 * from.
 *
 * WHY: the four maps (/project portal, /buy/:slug, /property/:id, /schools)
 * each hardcoded 'mapbox://styles/mapbox/dark-v11'. That is a MAPBOX-OWNED
 * stock style, so a style edited and published in our own Mapbox Studio
 * account had no route into the site at all — the two were never connected.
 *
 * Point VITE_MAPBOX_STYLE at a Studio style to switch all four at once:
 *
 *   VITE_MAPBOX_STYLE=mapbox://styles/<account>/<styleId>
 *
 * Get the value from Mapbox Studio → the style → Share → "Style URL".
 *
 * NOTE: Vite inlines VITE_* variables at BUILD time, so changing this in the
 * Vercel dashboard needs a redeploy to take effect — but never a code change.
 *
 * The fallback keeps the previous look, so an unset or mistyped variable
 * degrades to the old dark map rather than to a blank canvas.
 */
export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/dark-v11'

const configured = String(import.meta.env.VITE_MAPBOX_STYLE || '').trim()

// Accept both the mapbox:// form and a full https://api.mapbox.com/styles/...
// URL, which is what Studio's "Share" panel copies for some integrations.
export const MAP_STYLE =
  /^(mapbox:\/\/styles\/|https:\/\/api\.mapbox\.com\/styles\/)/.test(configured)
    ? configured
    : DEFAULT_MAP_STYLE
