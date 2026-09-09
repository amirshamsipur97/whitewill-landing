# Four-language cluster repair + today's article (2026-09-09)

## What today's article actually turned out to be

The queue said "give `invest-oman-real-estate-2026` a Persian and a Russian
edition." Checking the Russian half first changed the plan, and that check is
the point of this document.

`oman-realty-2026` (ru, the site's article id 2) **already was** the Russian
edition: same scope, same opening figure of 61,635, same ITC framing, same FAQ
shape. Writing a second Russian article on the shared slug would have put two
of our own pages in front of «недвижимость Омана».

So Russian got an **alias, not a translation**. Persian, which had no
equivalent, got a genuinely new article.

⚠️ **Rule that earned its place today:** before filling a "language gap", read
the other language's existing articles for the same intent. A gap in the slug
matrix is not proof of a gap in the content.

## The alias mechanism (new)

`src/insightAliases.mjs` declares that one article may publish under different
slugs in different languages. hreflang does not require matching slugs, so this
is legal and correct; what was broken was that both builders assumed otherwise.

```js
export const SLUG_ALIASES = {
  'invest-oman-real-estate-2026': { ru: 'oman-realty-2026' },
}
```

`prerender-insights.mjs` and `api/sitemap.js` both import it. Result: one
reciprocal four-language hreflang set instead of two orphans each declaring the
other did not exist, and `/ru/insights/invest-oman-real-estate-2026` 301s.

⚠️ Only alias rows that really are **editions of one article**. A merely
related article is an internal link.

## The soft-404 fix (21 URLs)

`/:lang/insights/:slug` rewrites to the SPA shell for **any** slug, so a
language edition that was never written answered **HTTP 200** carrying the
English homepage `<title>`, `canonical="/"` and `robots="index, follow"`. The
canonical was the worst part: it told Google those URLs were the homepage.

They are not in the sitemap, but Google reaches them anyway by guessing
localized variants of URLs it already knows.

`prerender-insights.mjs` now writes a real page for each missing combination:
`noindex` so it can never be indexed, `follow` so inbound equity still flows,
**no canonical at all**, and the editions that do exist listed in the reader's
own language. Static files beat rewrites in Vercel's pipeline, so this needed
no `vercel.json` entry. Redirects run *before* the filesystem, so combinations
already 301'd there are skipped; the skip list is read from `vercel.json` at
build time rather than hardcoded, so it cannot drift.

Count is self-maintaining: publish a missing edition and its stub disappears on
the next build.

## The measurement mistake, and the method that is correct

The per-area price table was first built with `avg(price_per_sqm_omr)`. That is
the column `src/priceIndexData.mjs` explicitly says never to read:

- it is **NULL for all of Yenaier**, so Sultan Haitham City was priced without
  87 of its units;
- **Vistal stores hand-rounded marketing rates** 5 to 19 percent above the
  arithmetic, inflating Al Mouj.

It disagreed with our own price index by 4 percent (1,107 vs 1,063), which is
how it was caught: the build log prints the index median every run.

🔑 **The site's method, and the only one to use in an article:** compute price
divided by `total_area_sqm`, take the **median**, exclude plot-dominant units.
It is the only definition a reader can reproduce from our own unit pages.

Corrected figures, published in all four languages:

| Area | Units | From (OMR) | Median OMR/m² |
|---|---:|---:|---:|
| Sultan Haitham City | 232 | 61,635 | 844 |
| Jebel Sifah | 18 | 63,500 | 950 |
| Muscat Bay | 13 | 138,000 | 1,111 |
| Salalah | 6 | 98,000 | 1,178 |
| Yiti | 76 | 85,971 | 1,369 |
| Al Mouj Muscat | 107 | 140,316 | 2,237 |

Portfolio median 1,063, mean 1,335, over 452 available units in 12 projects.

## Evidence behind the Persian article

From `oman-fa-google-ads-database-2026-07-21.xlsx`, «سرمایه گذاری در املاک
عمان» is **priority 1, commercial**, and sits in the «خرید ملک در عمان» ad
group. A rental cluster («اجاره خانه در عمان چقدر است» and siblings) sits at
priority 2 and had no page at all.

The Persian buying pillar `kharid-melk-dar-oman-2026` (9,646 chars) covers
process and costs and contains **no yield, rent, ROI or exit**. So the new
article was scoped to returns, which fills the rental cluster without
overlapping either the buying pillar or the three-routes pillar.

Lead data agrees: of 108 leads in 90 days, 100 are English, and one and two
bedroom units draw both the most enquiries and the most rental demand. Those
counts (113 and 167) are now in the article.

## Cluster after today

| lang | slug | chars (was) |
|---|---|---|
| en | invest-oman-real-estate-2026 | 9,150 (5,715) |
| fa | invest-oman-real-estate-2026 | 7,796 (new) |
| ar | invest-oman-real-estate-2026 | 6,783 (3,342) |
| ru | oman-realty-2026 | 7,964 (3,876) |

Also fixed: a Russian median stale at 991; an English meta description
truncated mid-word ("Here i") since launch; two `seo_title` over 60 chars
(ids 19, 20); the cluster moved off `muscat-4.jpg`, which three articles shared.

## 🚨 Open, and not fixed today

**`geo_country` never reaches the database.** `/api/geo` works and returns a
country, and `submitForm` sends the field, but the `submit-form` edge function
writes a fixed allowlist into `raw_data` and `geo_country` is not in it: 99 of
99 recent leads have it null while `language` (added in the same change) lands
on all 99. **The edge function needs redeploying**, which this session did not
do. Until then "which country do leads come from" is still unanswerable.

Owner-only, still open: rotate the blog admin password (repo is public, value
remains in git history); claim the Google Business Profile; apex to www 307 in
Vercel Domains; Request Indexing for today's URLs; Muscat business-district
photography for the nine articles still on Pexels covers.

Content gaps left: `property-tax-in-oman-2026`, `buy-apartment-in-oman-2026`
and `school-setup-consultants-oman-2026` are English only (each now serves 3
noindex stubs instead of 3 soft 404s). Sarooj Apartments is next by inventory.
