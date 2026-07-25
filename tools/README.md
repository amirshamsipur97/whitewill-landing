# tools/

Re-runnable maintenance scripts from the 2026-07-25 SEO overhaul.
Both are **idempotent** — safe to run again. See `HANDOFF-SEO-2026-07-25.md`.

## optimize_images.py
Image weight pass. Converts `src/assets/projects/**` to WebP (safe: reached only
through the `import.meta.glob` in `src/projectGallery.js`, zero direct imports)
and recompresses `public/**` **in place** (names/extensions are literal strings
in code and prerendered HTML, so they must not change). Only rewrites a public
file when the saving is >20% — most were already well compressed.

    DRY=1 python3 tools/optimize_images.py    # preview
    python3 tools/optimize_images.py          # apply

Run this after adding new project photos.

## retrofit_articles.mjs
Appends a localized "Browse live listings" block with topically-chosen links to
`/project` and the head-term landings, to every published article that does not
already have one. Additive only — never edits existing prose.

    DRY=1 node tools/retrofit_articles.mjs
    node tools/retrofit_articles.mjs

⚠️ Writes through `POST /functions/v1/insights-admin`, NOT PostgREST: a direct
`PATCH` on `insights` with the anon key returns 2xx and silently updates
nothing (RLS). Run this after adding new money pages so older articles link to
them.
