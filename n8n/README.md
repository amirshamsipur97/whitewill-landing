# Irfan Investment — SEO Blog Agent (n8n)

A weekly n8n workflow that researches trending keywords, picks one high-opportunity
topic, writes an SEO-optimized article in **all 4 site languages**, and saves them as
**drafts** in the blog (`insights` table) for your review at `/insights-admin`.

**File to import:** `irfaninvest-seo-blog-agent.json`
**Regenerate after edits:** `python3 build_workflow.py`

---

## What it does (node by node)

1. **Weekly trigger** — runs Mondays 08:00 (also runnable manually with “Execute workflow”).
2. **Config** — holds your keys/URLs (edit once after import — see below).
3. **Get site topics** — reads `ai_knowledge` (your real site topics) from Supabase.
4. **Get existing slugs** — reads published `insights` slugs so it never duplicates a topic.
5. **Build seeds** — builds seed phrases from your topics + core services (en + fa).
6. **Google autocomplete** — FREE keyword expansion (real, trending long-tail suggestions; no paid API).
7. **Aggregate keywords** — merges all suggestions + topics + existing slugs.
8. **Anthropic select topic** — the *strategist* agent picks ONE topic + primary/secondary keywords + category, avoiding duplicates.
9. **Fan out languages** — splits into en / ru / ar / fa, sharing one slug.
10. **Anthropic write article** — the *copywriter* agent writes a full SEO article per language (title, meta description, markdown body with H2/H3, tags, seo_title/description).
11. **Save draft to blog** — POSTs each article to the `insights-admin` edge function as `published:false`.
12. **Drafts ready** — end. Review + publish at `https://www.irfaninvest.com/insights-admin`.

---

## Setup (one time, ~5 min)

1. **Import:** n8n → top-right menu → *Import from File* → select `irfaninvest-seo-blog-agent.json`.
2. **Open the `Config` node** and fill the placeholders:
   - `anthropicKey` → your Anthropic API key (`sk-ant-...`). console.anthropic.com.
   - `adminPassword` → the Insights admin password (the value you set for the `insights-admin` edge function).
   - `pexelsKey` → free Pexels API key from https://www.pexels.com/api/ (for unique per-article cover images). If left unset, articles fall back to the `/peninsula.jpg` placeholder.
   - (Already filled: `supabaseUrl`, `supabaseAnonKey` (public), `model`, `langs`.)

**v2 pipeline:** the strategist agent uses Anthropic's **web_search** tool to pull current facts/trends (research notes), which the writer combines with the **site's own `ai_knowledge` content** (brand grounding). SEO system: keyword placement, H2/H3 + a `## FAQ` section, internal links, 1200-1600 words, meta title ≤60 / description ≤155. Each article gets a unique **Pexels** cover image chosen by the primary keyword.
3. **Run once manually** (Execute workflow) to test. Then **toggle Active** for the weekly schedule.
4. Go to `/insights-admin` → you’ll see 4 new **Draft** rows (en/ru/ar/fa) → review, tweak, **Publish**.

> Security note: keys live in the `Config` node for simplicity (matches the project’s existing
> pattern). To harden, move `anthropicKey`/`adminPassword` into n8n **Credentials** (HTTP Header
> Auth) and reference them from the HTTP nodes instead.

---

## How the “trending keyword” research works (no paid API)

- Seeds come from your **actual site topics** (`ai_knowledge`) + core services.
- **Google Autocomplete** (`suggestqueries.google.com`) returns what people are really typing —
  free, per language (`hl=en` / `hl=fa`). This is the trend signal.
- The strategist agent evaluates and clusters them, weighs relevance to the brand, and avoids
  any already-published slug.

Want harder numbers (search volume, CPC, difficulty)? Swap the **Google autocomplete** node for a
**DataForSEO / SerpApi** HTTP call (paid) — the rest of the workflow stays the same.

---

## Tuning

- **Cadence:** edit the *Weekly trigger* (e.g. daily, or twice a week).
- **Articles per run:** currently 1 topic × 4 languages. To produce more topics, loop the
  topic-selection stage or raise the count in `Prep topic request`.
- **Languages:** `Config.langs` (CSV). Set to `fa` only, `fa,en`, etc.
- **Cover image:** defaults to `/peninsula.jpg`; set per-article in the admin after generation,
  or wire an image step.
- **Auto-publish:** change `published: false` → `true` in **Parse article** (not recommended —
  keep human review for SEO quality).

---

## Notion (later)

Decision for now was “no Notion”. To add it: drop a **Notion** node after *Config* that reads a
database/page of briefs or seed topics, and feed its text into *Aggregate keywords* /
*Prep topic request*. You’ll need a Notion internal-integration token + the database ID.

---

## Out of scope (on purpose)

The request also mentioned “placing key sentences on the site”. Automatically rewriting the
React source copy is risky (can break the build/layout), so this agent uses the **blog** as the
sanctioned SEO-content channel. If you want automated on-page copy suggestions, we can add a node
that proposes copy changes as a **report/PR for review** rather than editing live code.

---

## Cost

- Anthropic: ~5 model calls per run (1 strategist + 4 articles). Roughly a few cents per run on
  Sonnet. Google autocomplete is free. Supabase reads/writes are within plan.
