// insightAliases.mjs — cross-language slug equivalence for blog articles.
//
// WHY THIS EXISTS: the hreflang builders in prerender-insights.mjs and
// api/sitemap.js both assumed one slug per article cluster, so a language
// edition published under a DIFFERENT slug was invisible to them. That was not
// hypothetical. `invest-oman-real-estate-2026` (en, ar) and `oman-realty-2026`
// (ru) are the same article: same scope, same opening figure, same ITC framing,
// same FAQ shape. Google saw two orphans, one of which claimed to have no
// Russian edition while the Russian edition sat two URLs away claiming to have
// no English one.
//
// hreflang does NOT require matching slugs, so the fix is to declare the
// equivalence once, here, and let both builders read it. The alternative,
// translating a second Russian article onto the shared slug, would have been
// self-cannibalization: two ru pages competing for «недвижимость Омана».
//
// ⚠️ Only put a pair here when the two rows really are editions of ONE article.
// A merely related article is an internal link, not an alias.
//
// The key is the CLUSTER HEAD (the slug the majority of languages use). The
// value maps a language to the slug that language actually publishes under.

export const SLUG_ALIASES = {
  'invest-oman-real-estate-2026': { ru: 'oman-realty-2026' },
}

// slug -> cluster head, for every alias slug (reverse of the map above).
const HEAD_OF = new Map()
for (const [head, byLang] of Object.entries(SLUG_ALIASES)) {
  HEAD_OF.set(head, head)
  for (const alias of Object.values(byLang)) HEAD_OF.set(alias, head)
}

/** The slug that represents this article's cluster, whichever edition you hold. */
export const clusterHead = (slug) => HEAD_OF.get(slug) || slug

/** The slug a given language publishes this cluster under. */
export function slugForLang(slug, lang) {
  const head = clusterHead(slug)
  return SLUG_ALIASES[head]?.[lang] || head
}

/** Article URL path for a language, alias applied. Prefix is caller's job. */
export const insightPathFor = (slug, lang) => `/insights/${slugForLang(slug, lang)}`

/**
 * Group rows (each {slug, lang}) into clusters keyed by head slug.
 * Returns Map<headSlug, { langs: string[], rows: row[] }> so a caller can ask
 * "which languages does this article exist in" and get the true answer across
 * every slug the cluster uses.
 */
export function clusterLangs(rows) {
  const out = new Map()
  for (const r of rows) {
    const head = clusterHead(r.slug)
    if (!out.has(head)) out.set(head, new Set())
    if (r.lang) out.get(head).add(r.lang)
  }
  return out
}
