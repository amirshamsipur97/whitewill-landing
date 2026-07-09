/**
 * projectGallery.js — per-project image galleries, zero-config.
 *
 * Drop images into  src/assets/projects/<slug>/  (slug = slugify(project.name),
 * same rule as routes, e.g. "St. Regis" → st-regis). Vite picks them up at
 * build time via import.meta.glob, hashes + optimizes cache headers for free.
 *
 *   - Files sort naturally (1.jpg, 2.jpg, … 10.jpg), so name by display order.
 *   - First image = cover (Buy grid card + project hero + og:image).
 *   - Remaining images render as the Gallery section on the project page.
 *
 * No manifest to maintain: add/remove files and rebuild.
 */

const files = import.meta.glob('./assets/projects/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const GALLERIES = {}
for (const [path, url] of Object.entries(files)) {
  const m = path.match(/projects\/([^/]+)\//)
  if (!m) continue
  ;(GALLERIES[m[1]] ||= []).push({ path, url })
}
for (const slug of Object.keys(GALLERIES)) {
  GALLERIES[slug] = GALLERIES[slug]
    .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))
    .map((x) => x.url)
}

/** All images for a project slug, cover first. [] when none supplied yet. */
export function galleryFor(slug) {
  return GALLERIES[slug] || []
}

/** Bundled cover image URL for a slug, or null to fall back to legacy paths. */
export function coverForSlug(slug) {
  return GALLERIES[slug]?.[0] || null
}
