# "buy property in oman": what was wrong and what is now done (2026-09-10)

Owner reported the site sitting on **page 4** for its most valuable commercial
head term. This is the record of the diagnosis, because the second cause is
not something you find by reading your own code.

## Cause 1: we were bidding against ourselves

The homepage title opened `Buy Property in Oman & Invest` and `/buy` opened
`Buy Property in Oman from OMR 61,635`. Two of our own pages asking Google to
pick one for a single query.

The symptom was already sitting in GSC on 2026-09-05 and had been read as
something else: the **homepage was the only page in the top five that was
falling, at -22 percent**, and it was falling on the property cluster that
`/buy` exists to serve. That is what self-cannibalization looks like from the
outside.

🔑 **The keyword map is now one page per intent. Do not undo this.**

| route | owns | volume |
|---|---|---|
| `/` | "oman real estate" plus brand | 590/mo |
| `/buy` | **"buy property in oman"**, exact match, sole claimant | head term |
| `/project` | "properties / apartments for sale in oman" | cluster |

⚠️ Putting "Buy Property in Oman" back into the homepage title recreates the
exact defect. The brand still closes every title, so branded search is
unaffected.

## Cause 2: we answered the wrong shape of query

Read the live SERP instead of guessing. Page one for this term is **Bayut.om,
Savills, Realtor.com, Dubizzle Oman, omanreal.com and JamesEdition**, plus two
guides (DarGlobal, Uinvest Group).

What every portal puts in its snippet is **scale**: "Muscat (2,251)", "over
3500 properties", price ranges by region. Google is serving an **inventory
intent**, and `/buy` was answering it with 12 project cards and roughly 350
crawlable words.

We cannot out-list Bayut on volume. So `/buy` now states our numbers
**precisely**, which the two ranking guides never do and the portals only do
loosely: units and entry price **by area**, **by property type** and **by
budget band**. 643 → 952 words, three tables, in all four languages.

🔑 Every figure is computed at **build time** from the same inventory fetch
that feeds the AggregateOffer. Nothing is written into the copy. Same rule as
the price index: a count typed into a sentence is wrong the first time a unit
sells. If you need a new number on this page, add a label to `BUY_TABLES` and
let `buyInventoryTables()` fill it.

## The SERP told us which questions to answer

The "People also ask" box on that same query listed four questions. Two already
had answers in `BUY_SEO.faq`. The other two had no answer anywhere on the page
and are now in `BUY_FAQ_EXTRA`:

- Is it worth buying property in Oman?
- Can a foreigner live in Oman after buying property?

⚠️ `buyFaqJsonLd()` emits `BUY_SEO.faq` **plus** `BUY_FAQ_EXTRA`, exactly the
six the page renders. FAQ markup describing answers a visitor cannot see is a
rich-result violation, so add to both or neither.

## Caught in the prerendered output, before deploying

- **Aida stores prices with decimals.** The area table printed `85,971.27`
  among round thousands. `buyInventoryTables` now rounds, matching `fmtOmr`.
- **Area grouping falls back** between `project.areas.name` ("Al Mouj (The
  Wave)") and `projects.location` ("Almouj"). `BUY_AREA_LABELS` was keyed only
  on the short codes, so **five of six rows stayed in English** on the Arabic,
  Persian and Russian tables. Both key forms are now mapped.

## Already in place, checked rather than assumed

- The footer link block links `/buy` with the exact anchor "Buy property in
  Oman" from every article and route page, roughly 250 internal exact-match
  links. No change needed.
- `/buy` performance is fine: 77 KB of HTML, TTFB 0.56s, total 0.71s, and it
  does **not** load the 2.1 MB hero video. The known mobile LCP problem is the
  homepage, not this page.

## 🚨 What on-page cannot do

Everything above is on-page and technical, and it is now done. The page-one set
is Bayut, Savills, Realtor.com, Dubizzle and JamesEdition. Against domains of
that weight the deciding factor is **off-site authority**, and that is where
this site has its largest untouched gap:

1. **The Google Business Profile is still unclaimed.** For a commercial local
   query this is the single biggest missing signal, and a competitor already
   holds a GBP named for the Persian equivalent of this keyword. Owner action.
2. **Regional backlinks.** Semrush's `execute_report` rejects its own params
   object through the MCP, so backlink data has to be pulled from the Semrush
   UI by hand.
3. **Time.** The cannibalization signal has to be recrawled and re-evaluated
   before the un-split page can move.

Expect movement, not page one, from this commit alone. Re-measure in GSC in
two to three weeks: the number to watch is whether `/buy` replaces `/` as the
URL Google shows for this query. That swap is the proof the split worked, and
it should happen before any rank change does.
