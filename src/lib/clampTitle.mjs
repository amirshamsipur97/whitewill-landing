// Keep <title> inside Google's ~60 character display width without touching
// the keyword part. 58 of 662 sitemap pages were over on 2026-09-17, almost
// all because of the brand suffix. Order: shorten the brand, then drop the
// suffix. The part before " | " is never cut: a long keyword phrase is a copy
// decision, not something to truncate mechanically.
export function clampTitle(title, max = 60) {
  if (!title || title.length <= max) return title
  let s = title
    .replace(/\| Irfan Investment Group$/, '| Irfan')
    .replace(/\| Irfan Investment$/, '| Irfan')
  if (s.length <= max) return s
  const i = s.lastIndexOf(' | ')
  if (i > 0) s = s.slice(0, i)
  return s
}
