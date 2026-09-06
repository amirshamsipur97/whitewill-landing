# What the keyword data and GSC actually say (2026-09-05)

Written because today's article was chosen against the property-first habit,
and the evidence for that should not live only in a commit message.

## 1. Search Console, last 28 days

856 clicks (+26%) and 48.9K impressions (+46%). Total web search clicks since
June: 1,658, growing from near zero in early June to roughly 30 to 45 a day by
late August.

**Top pages by clicks:**

| page | clicks | trend |
|---|---:|---|
| Best Business Ideas in Oman for Foreigners | 80 | +38% |
| Company Registration in Oman Cost | 49 | +81% |
| Bank Loan in Oman for Foreigners | 41 | +11% |
| Homepage (Buy Property in Oman & Invest) | 40 | **-22%** |
| Investing in the Oman Stock Market (MSX) | 29 | -6% |

🔑 **Four of the top five are business and investment content. The one property
page in the list is the only one falling.**

**Top queries:** `irfan investment group` 8 · «خرید ملک در عمان» 8 (+14%) ·
`irfan investment` 4 · «قیمت خانه در عمان به پول ایران» 4 (+33%) ·
`business in oman` 3 (**+200%**).

## 2. The keyword databases in the repo

From `oman-en-ar-google-ads-database-2026-07-25.xlsx`:

| keyword | vol/mo | intent |
|---|---:|---|
| **invest in oman** | **2,400** | Investment |
| oman real estate | 590 | Buy |
| real estate companies in oman | 260 | Buy |
| oman golden visa | 260 | Residency |
| property for sale in oman | 70 | Buy |

And from the July Semrush sweep (`marketing/semrush/02-keyword-data-ae.md`),
the AE database: `oman property` 170/mo, `buying property in oman` 20/mo,
`property for sale in oman` 20/mo.

🔑 **`invest in oman` at 2,400/mo is four times the entire property cluster
combined.** The Persian database (`oman-fa-google-ads-database-2026-07-21.xlsx`,
233 keywords) is property-led, which is why the fa side stays property-first,
but the English side clearly is not.

## 3. What was missing

The site already holds 20 slugs in the business and investment cluster, and
GSC shows they are the engine. But the head term had no owner:

- `invest-oman-real-estate-2026` is real-estate-scoped and exists in **en and
  ar only**, no fa, no ru.
- `/invest` is the company-registration service route, not an investment guide.

Nothing tied property, company formation and listed equities together, which is
what somebody searching `invest in oman` is actually comparing.

## 4. What was published

`invest-in-oman-2026-guide`, ids 196-199, all four languages. A pillar over the
three real routes with the entry cost of each, linking down to the satellites
that already earn the clicks.

Figures, all verified against live data or the existing cluster before writing:
company from **OMR 500** mainland LLC with 100% foreign ownership under the
Foreign Capital Investment Law · property from **OMR 61,635** across **452
units in 12 projects**, 141 under OMR 100,000, **122** clearing the OMR 250,000
golden threshold, 3% one-off registration · MSX up to 100% foreign ownership in
most listed companies · no personal income tax until **2028**, then above an
OMR 42,000 threshold under Royal Decree 56/2025.

⚠️ **Two broken cross-language links were caught before publishing**, not after:
`company-formation-cost-oman-2026` exists in **English only**, and the Arabic
and Russian drafts linked it as `/ar/` and `/ru/`. Both now point at `/invest`,
which exists in all four. **Before publishing any article, check that every
linked slug exists in the language you are linking from.** A slug existing is
not the same as its language edition existing.

## 5. What this changes going forward

The property queue is not wrong, but it is not the whole plan. English demand
is investment-led and the English satellites are already the top performers,
while the property homepage is the only page in the top five that is falling.

Next candidates on this evidence, in order:
1. **A Persian and Russian edition of `invest-oman-real-estate-2026`**, which
   is en and ar only today while its cluster leads the site.
2. **`company-formation-cost-oman-2026` in fa, ar and ru.** It is the number
   two page on the site by clicks, up 81%, and exists in English only.
3. Only then the next uncovered project (Sarooj Apartments).
