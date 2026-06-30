// Returns HTTP 410 Gone for legacy Webflow URL families that have NO new
// equivalent (old country/project trees like /uae/*, /omans/*, Cloudflare
// email-protection artifacts). 410 tells Google to drop them faster than 404.
// Wired via vercel.json rewrites. Paths that DO have a new home are 301'd in
// vercel.json instead (see redirects).
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('X-Robots-Tag', 'noindex')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.status(410).send(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="robots" content="noindex"><title>410 — Gone</title>' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<style>body{background:#000;color:#fff;font-family:system-ui,sans-serif;display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center;text-align:center}a{color:#8c8d25}</style></head>' +
      '<body><div><h1>410 — Gone</h1><p>This page no longer exists.</p>' +
      '<p><a href="https://www.irfaninvest.com/">Go to Irfan Investment Group</a></p></div></body></html>',
  )
}
