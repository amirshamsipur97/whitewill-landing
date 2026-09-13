# AGENTS.md: irfaninvest.com (whitewill-landing)

Instructions for AI coding agents (Codex, Claude Code) working on this repo.
Read this first, then the newest `HANDOFF-*.md` files:
`HANDOFF-2026-09-10-HEAD-TERM.md`, `HANDOFF-2026-09-09-SEO.md`,
`SEO-KEYWORD-EVIDENCE-2026-09-05.md`, `SEO-AUDIT-2026-08-30.md`.

## What this is

Real estate agency site for Oman (Irfan Investment Group). React SPA on Vite,
statically prerendered for SEO, hosted on Vercel, data in Supabase.
Four languages: English at `/`, and `/fa`, `/ar`, `/ru` (fa and ar are RTL).

## Build

```
npm install
npm run build
```

The build is a chain, and each step matters for SEO:
`vite build` → `inline-css.mjs` → `prerender-insights.mjs` (every article, per
language, plus noindex stubs for missing language editions) →
`prerender-routes.mjs` (routes, 12 project pages, ~450 unit pages) →
`write-version.mjs`.

The prerender steps fetch live data from Supabase with the public anon key, so
the build needs network access. Always run a full build and read its log before
claiming a change works. The log prints the live price index median and unit
counts; use them to cross-check any figure you publish.

## Deploy: git push does NOT deploy

Production deploys only via `vercel deploy --prod --yes`, run by the owner.
Pushing to GitHub changes nothing on the live site. Never tell the owner a
change is live because it was pushed.

## Hard rules

1. **Never expose `unit_no`.** It is internal. The public unit reference is
   `IRF-<id>`.
2. **No em dashes or en dashes in any visitor-facing copy**, in any language.
   They read as AI-written. Rewrite the sentence instead.
3. **`vercel.json` is a route allowlist.** A new `<Route>` in `src/App.jsx`
   needs a matching rewrite or it 404s in production. `vercel.json` rejects
   unknown keys such as `_comment`.
4. **Price per m²:** never read `project_units.price_per_sqm_omr` (NULL for all
   of Yenaier, marketing-rounded for Vistal). Compute price divided by
   `total_area_sqm`, take the median, exclude plot-dominant units. The canonical
   implementation is `src/priceIndexData.mjs`.
5. **Counts and prices in copy are computed at build time, never typed into
   text.** See `BUY_TABLES` in `src/buySeoContent.mjs`.
6. **Keyword map, English only, one page per intent:**
   `/` = "oman real estate", `/buy` = "buy property in oman",
   `/project` = "properties for sale in oman", `/about` = "real estate company
   in oman". Do not put "Buy Property in Oman" back into the English homepage
   title; that recreated self-cannibalization. Do not change a non-English
   title without that language's Search Console data showing which URL ranks.
7. **Before linking an article in a language, confirm that language edition
   exists.** A slug existing is not the same as its Persian edition existing.
8. **Cross-language slug aliases** live in `src/insightAliases.mjs`. Read
   that language's existing articles before "filling" a language gap; the
   Russian edition of one article already existed under a different slug.
9. Titles 60 characters or fewer, meta descriptions 160 or fewer. FAQ JSON-LD
   must contain exactly the questions the page visibly renders.
10. **The repo is PUBLIC.** Never commit keys, passwords or tokens. The blog
    admin password is read from `INSIGHTS_ADMIN_PW`.

## Where content lives

- **Articles are NOT in this repo.** They are rows in the Supabase `insights`
  table (one row per slug and language). Writing them needs Supabase access,
  which a repo-only agent does not have. Edit templates and prerender code here;
  hand article text to the owner.
- Inventory: `project_units` and `projects` in Supabase.
- Route SEO metadata: `src/seoRoutes.mjs`. Sitemap: `api/sitemap.js`.
- Crawlable page copy: `src/buySeoContent.mjs`, `src/footerSeoLinks.mjs`,
  `src/data/projectDetails.js`.

## Time-boxed code to remove

- `RECRAWL_REDIRECTS` in `api/sitemap.js` lists three redirected Persian
  guides so Google processes their 301s. **Remove it by 2026-10-31.**

## Open problems (evidence in the handoff docs)

- CTR is about 1.9% at an average position around 6.5, so the snippet is the
  bottleneck, not rank. Unit pages are about half the sitemap; 196 of them still
  share a title with a near-identical sibling.
- "buy property in oman" averages position 20 and «خرید ملک در عمان» about 8.
  The page-one set is Bayut, Savills, Realtor.com, Dubizzle and JamesEdition:
  off-site authority (Google Business Profile still unclaimed, backlinks) is the
  ceiling, not more on-page work.
- Mobile LCP on the homepage is poor (2.1 MB hero video).
- The `submit-form` edge function drops `geo_country`, so lead country is null.
- Apex `irfaninvest.com` returns 307 rather than 301 to `www` (a Vercel domain
  setting).
