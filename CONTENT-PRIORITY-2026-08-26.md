# Content priority, rebuilt from site data (2026-08-26)

Method the 08-24 handoff asked for: map **inventory value × content coverage ×
lead demand**, and stop choosing topics by intuition. This is the rerun, and it
found something bigger than a topic list.

## The finding: the library is inverted

Total live inventory: **OMR 126,062,875 across 478 units in 12 projects.**

| project | inventory value | share | articles (all langs) | dedicated articles | data age |
|---|---:|---:|---:|---:|---:|
| **St. Regis** | 32,409,919 | 26% | 4 | **0** | **94 days** |
| **The Arc Residences** | 28,684,480 | 23% | 7 | 1 | 11 days |
| **Vistal** | 19,098,413 | 15% | 4 | **0 → 1** | 15 days |
| Sarooj Villas | 9,782,650 | 8% | 4 | 1 | 11 days |
| Aida | 9,324,081 | 7% | 21 | 0 | **92 days** |
| Yenaier | 6,399,595 | 5% | 19 | 0 | 90 days (bldg 101 refreshed 08-18) |
| Wadi Zaha | 5,833,235 | 5% | 19 | 0 | 11 days |
| Hay Al Wafa | 5,437,246 | 4% | 15 | 0 | 15 days |
| Sarooj Apartments | 3,646,154 | 3% | 4 | 0 | 11 days |
| Zen Residences | 2,205,000 | 2% | 5 | 0 | 57 days |
| Jebel Sifah | 2,156,003 | 2% | **58** | 0 | 15 days |
| Hawana Salalah | 1,086,100 | 1% | **68** | 0 | 47 days |

🔑 **Hawana Salalah and Jebel Sifah hold OMR 3.2m of stock, 2.6% of inventory,
and are mentioned in 126 of the 160 articles.** That is the residue of the
Salalah ad campaigns, which have been off since 08-20.

🔑 **St. Regis and Vistal hold OMR 51.5m, 41% of all inventory value and 130
units, and had zero dedicated articles between them.**

## Lead demand says the same thing

Of the 109 leads carrying a real message:

| ask | leads | share |
|---|---:|---:|
| price | 48 | 44% |
| payment plan / instalments | 17 | 16% |
| a named project | 14 | 13% |
| residency | 2 | 2% |
| rent or yield | 2 | 2% |

The single most repeated message is the popup's verbatim
"Muscat/Oman apartment price list + payment plan request". Buyers want prices
and instalments. Residency and yield content, which the library is full of, is
almost never what they ask for. "Price list" appears in only 3 of 160 articles.

## Queue, in order

1. ✅ **Vistal** (done 08-26, ids 175-178, 4 langs).
   Chosen first over St. Regis purely on data freshness: 71 units, the most of
   any project, OMR 19.1m, zero coverage, and inventory only 15 days old.
2. 🔴 **St. Regis. BLOCKED ON A DATA REFRESH.** Biggest asset on the site,
   OMR 32.4m, 59 units, zero dedicated articles, and the oldest inventory we
   hold at 94 days. Writing a price-detail article off 24-May data would
   publish stale numbers at the top of the funnel. **Ask the owner for the
   current St. Regis file first**, then write it the same way as Vistal.
3. **The Arc Residences, second article.** OMR 28.7m, fresh data, carries the
   site's most expensive stock (a penthouse at OMR 2,168,938) and three
   collections (Opal, Onda, Oria) that the single existing article does not
   break down.
4. **"Oman apartment price list by project"**, all languages. Directly answers
   the 44% price ask and the popup's own wording, and nothing on the site is
   shaped like a price list. The price index page is per m², not per project.
5. **Payment plans, expanded.** Already the strongest asset per the 08-24
   handoff, but it prints real terms for only 3 of 12 projects. Still blocked
   on the owner supplying the remaining plan sheets.
6. **Aida refresh then article.** OMR 9.3m and 92-day-old data, 21 mentions but
   no dedicated page.

## Rules that came out of this

- **Do not write a price article off inventory older than about 60 days.**
  Check `created_at` on `project_units` per project first. It is a floor, not a
  refresh date: an UPDATE does not move it, so Yenaier reads 90 days even
  though building 101 was refreshed on 08-18.
- **Stop writing Salalah and Jebel Sifah content.** Between them they are 2.6%
  of inventory and 79% of the library.
- Coverage counts above are keyword mentions across the whole body, so they
  overstate real coverage. The "dedicated articles" column, which matches the
  project name in the TITLE, is the honest one.
