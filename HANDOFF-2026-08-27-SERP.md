# Why irfaninvest.com was absent from «خرید ملک در عمان» (2026-08-27)

Owner searched the term over a French OpenVPN and found no irfaninvest result
anywhere on page one, and asked whether it was a bug.

## It is not a bug. Proven, not assumed

Checked on production before touching anything:

| check | result |
|---|---|
| fa pillar HTTP | **200**, and **0 redirects** in the chain |
| robots meta | `index, follow, max-image-preview:large, max-snippet:-1` |
| canonical | self, correct |
| hreflang | fa + x-default, correct for an fa-only article |
| `noindex` anywhere in `dist/` | **zero occurrences** |
| robots.txt | open, only `/insights-admin` and `/api/` disallowed |
| in sitemap | yes, 660 URLs total, 72 fa |

Nothing is blocking indexation. This is a ranking and freshness problem.

## What was actually wrong, and part of it was mine

### 1. The 08-25 redirects were only half a job

Three fa pages were 301'd into the pillar on 08-25 (Pakistani buyers, Indian
NRI buyers, Salalah for Indian buyers). **The pillar was never updated to
absorb what they covered.** Measured before the fix: it said «پاکستان» **zero**
times and «ملیت» once.

🔑 **A 301 into a page that does not cover the source topic is a weak redirect.
Google can drop the position instead of transferring it.** When the page that
held the position is removed and the replacement does not answer the same
question, a temporary disappearance is the expected outcome, not a bug. That
risk should have been stated on 08-25 and was not.

### 2. The pillar was quoting an entry price two refreshes out of date

Its FAQ read «استودیوهای حدود ۳۵ هزار ریال عمانی» and «آپارتمان‌های مسقط از ۴۸
هزار», and the meta description repeated «از ۳۵ هزار ریال عمانی». The real
figure has been **OMR 61,635** since 15 August.

🚨 **It survived every price sweep because it writes the number in ROUNDED
PROSE.** A find-and-replace on `35,625` never matches «حدود ۳۵ هزار ریال».
Audited all 168 article rows for superseded figures: **exactly one row was
stale, and it was this one**, the most important Persian page on the site.
**Future sweeps must grep for rounded prose forms, not only exact figures.**

### 3. The price table hid two thirds of the inventory

It listed 8 of 12 projects and stopped at OMR 138,000, so Vistal, Sarooj
Villas, Sarooj Apartments, St. Regis and The Arc were all absent. That is
roughly OMR 80m of stock, about 64% of inventory value, missing from the
pillar. The page read as a budget-only shop.

## Fixed today

Pillar id 98 rewritten, 6,205 → 9,646 characters, live and deployed:

- Stale entry price corrected in the FAQ **and** the meta description.
- New section «ملیت شما مهم است یا نه», which is what the three redirected
  pages were about. The redirects are now topically sound.
- New section «اقساط و برنامه پرداخت». **Three of the ten competitors ranking
  for this query lead their title with payment terms** (rubyoman "5% پیش
  پرداخت", investroyal "اقساط 20 ساله", omanmelk "اقساط ۳ ساله بدون بهره"), and
  17 of our 109 leads ask for an instalment plan. The pillar had nothing.
- Two FAQ entries added: other nationalities, and instalments.
- Price table completed to all 12 projects, OMR 61,635 to 423,883.
- A surviving soft yield claim removed («درآمد اجاره می‌تواند بخشی از اقساط را
  بپوشاند»), which the 26 July no-yield pass had missed.
- sitemap lastmod moved 2026-08-17 → 2026-08-30, so it is a recrawl candidate.

## 🔴 The finding the owner has to act on

**A competitor has named their Google Business Profile literally «خرید ملک در
عمان»** and owns the entire right rail for this query: 5.0 from 5 reviews,
address in Muscat, phone +968 7930 7000, "Open 24 hours", with an
"Own this business?" link showing.

Our GBP is still unclaimed. It has been listed as open in every handoff since
July. This is the first time there is direct visual evidence of what it costs:
a competitor holds a whole SERP feature on our most valuable Persian term by
keyword-naming their profile.

## How to measure this, and how not to

**A VPN spot check is the wrong instrument.** All ten competitors ranking are
Iran-targeted domains, and Google weights local domains heavily for a Persian
query from a French IP. Use GSC → Performance → filter the query → Pages. That
is the only reliable read, and it needs the owner.

⏳ Give the pillar rewrite and the redirects 2 to 3 weeks before judging.
