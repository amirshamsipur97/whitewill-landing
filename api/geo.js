// Returns the visitor's country from Vercel's edge geo header.
// Used by the client for first-visit language auto-detection (see src/i18n.jsx).
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store')
  res.status(200).json({ country: req.headers['x-vercel-ip-country'] || null })
}
