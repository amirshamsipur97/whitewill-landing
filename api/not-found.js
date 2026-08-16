// Real HTTP 404 for URLs that match no route in src/App.jsx.
//
// WHY THIS EXISTS: vercel.json used to rewrite EVERY unmatched path to
// /app.html, which answers 200. So /nonsense-page-xyz, a mistyped ad landing
// and a dead legacy link were all indistinguishable from a real page to a
// crawler, and Search Console files them as soft 404s. This also hid a live
// bug once: /oman/investment was a dead ad landing for weeks while every
// status check reported 200 (see HANDOFF-2026-07-29.md).
//
// The catch-all now sits AFTER an explicit allowlist of real routes, so only
// genuinely unknown paths reach this function. If you add a <Route> to
// App.jsx, add the matching rewrite to vercel.json or the new page will 404.
//
// 404 not 410: unlike /uae/* and /omans/* (which are permanently gone and get
// api/gone.js), an unknown path here is usually a typo or a stale external
// link, and may become real later.
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('X-Robots-Tag', 'noindex')
  res.setHeader('Cache-Control', 'public, max-age=300')
  res.status(404).send(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="robots" content="noindex">' +
      '<title>404 | Page not found | Irfan Investment Group</title>' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<style>body{background:#000;color:#fff;font-family:system-ui,-apple-system,sans-serif;' +
      'display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center;text-align:center;padding:24px}' +
      'h1{font-size:clamp(28px,6vw,44px);margin:0 0 12px}p{color:rgba(255,255,255,.7);margin:0 0 26px}' +
      'a{color:#8c8d25;text-decoration:none;margin:0 10px;white-space:nowrap}a:hover{text-decoration:underline}</style></head>' +
      '<body><div><h1>Page not found</h1>' +
      '<p>The page you asked for does not exist.</p>' +
      '<p><a href="/">Home</a><a href="/buy">Projects</a><a href="/project">All properties</a>' +
      '<a href="/insights">Insights</a></p></div></body></html>',
  )
}
