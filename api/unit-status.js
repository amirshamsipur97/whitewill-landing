// Resolves /property/:id when no prerendered page exists for that id.
//
// HOW IT GETS HIT: Vercel checks the filesystem before applying rewrites, so
// every AVAILABLE unit is served straight from its prerendered
// dist/property/<id>/index.html and never reaches this function. Only ids with
// no page arrive here, which means one of three things:
//
//   sold      -> 301 to the project page. These are the ones that matter: each
//                inventory refresh retires a batch of units whose URLs Google
//                has already indexed (220 of them as of 2026-08-15), and until
//                now they answered 200 with the generic SPA shell, i.e. a soft
//                404 each. A 301 passes their accumulated signal to the project
//                page instead of throwing it away, which a 410 would do.
//   available -> 307 to the search portal, deep-linked to the unit. This is the
//                transient window between inserting a unit in Supabase and the
//                next deploy prerendering it. Temporary on purpose: once the
//                page exists this route stops being reached at all.
//   unknown   -> 410. The id was never ours.
//
// Language prefixes are preserved so /fa/property/260 lands on /fa/buy/<slug>.
const SUPABASE_URL = 'https://owgvrxipqlusepozlujv.supabase.co'
const ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3ZyeGlwcWx1c2Vwb3psdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTYxMjQsImV4cCI6MjA5MjM3MjEyNH0.vZK4z9p9pUF1rZ8LHadFReBcEcwidwy9ZdEXnSmK4Fs'

// Same rule as src/pages/BuyPage.jsx and prerender-routes.mjs. Keep in step.
const slugify = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const gone = (res, msg) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('X-Robots-Tag', 'noindex')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(410).send(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="robots" content="noindex"><title>410 | Listing gone</title>' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<style>body{background:#000;color:#fff;font-family:system-ui,sans-serif;display:flex;min-height:100vh;' +
      'margin:0;align-items:center;justify-content:center;text-align:center;padding:24px}a{color:#8c8d25}</style></head>' +
      `<body><div><h1>Listing gone</h1><p>${msg}</p>` +
      '<p><a href="/project">Browse available properties</a></p></div></body></html>',
  )
}

export default async function handler(req, res) {
  const id = String(req.query.id || '').trim()
  const lang = ['ru', 'ar', 'fa'].includes(String(req.query.lang)) ? `/${req.query.lang}` : ''

  if (!/^\d+$/.test(id)) return gone(res, 'That listing reference is not valid.')

  let row = null
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/project_units` +
        `?select=id,availability_status,projects(name)&id=eq.${id}&limit=1`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
    )
    if (r.ok) row = (await r.json())[0] || null
  } catch {
    // Supabase unreachable: fall through to the search portal rather than
    // telling a crawler the unit is gone on the strength of a network blip.
    res.setHeader('Cache-Control', 'no-store')
    res.redirect(307, `${lang}/project`)
    return
  }

  if (!row) return gone(res, 'This property reference does not exist.')

  const available = /avail|reserv/i.test(String(row.availability_status || ''))
  const slug = row.projects?.name ? slugify(row.projects.name) : ''

  if (available) {
    res.setHeader('Cache-Control', 'no-store')
    res.redirect(307, `${lang}/project?unit=${id}`)
    return
  }

  // Sold. Send its ranking signal to the project page, or to the portal if the
  // project somehow has no name to slugify.
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.redirect(301, slug ? `${lang}/buy/${slug}` : `${lang}/project`)
}
