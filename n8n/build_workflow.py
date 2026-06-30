#!/usr/bin/env python3
"""Generates the irfaninvest SEO blog-agent n8n workflow as importable JSON.
Run:  python3 build_workflow.py   ->  irfaninvest-seo-blog-agent.json

v2 pipeline:
  - sources from the SITE (ai_knowledge content) AND the web (Anthropic
    web_search tool on the strategist -> research notes with current facts)
  - SEO system: keyword placement, H2/H3 + FAQ section, internal links,
    900-1200 words, meta title/description limits
  - unique per-article cover image from Pexels (by primary keyword)
  - saves drafts (published=false) to the insights table for review
"""
import json, os

SUPABASE_URL = "https://owgvrxipqlusepozlujv.supabase.co"
SUPABASE_ANON = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
                 "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3ZyeGlwcWx1c2Vwb3psdWp2Iiwicm9sZSI6ImFub24i"
                 "LCJpYXQiOjE3NzY3OTYxMjQsImV4cCI6MjA5MjM3MjEyNH0.vZK4z9p9pUF1rZ8LHadFReBcEcwidwy9ZdEXnSmK4Fs")


def code(name, js, x, y, mode="runOnceForAllItems"):
    return {"parameters": {"jsCode": js, "mode": mode},
            "id": name.replace(" ", "_").lower(), "name": name,
            "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [x, y]}


def http_get(name, url, x, y, headers=None, options=None):
    p = {"url": url, "options": options or {}}
    if headers:
        p["sendHeaders"] = True
        p["headerParameters"] = {"parameters": headers}
    return {"parameters": p, "id": name.replace(" ", "_").lower(), "name": name,
            "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, y]}


def http_post_json(name, url, json_body, x, y, headers, options=None, retry=None, on_error=None):
    p = {"method": "POST", "url": url, "sendHeaders": True,
         "headerParameters": {"parameters": headers},
         "sendBody": True, "specifyBody": "json", "jsonBody": json_body, "options": options or {}}
    node = {"parameters": p, "id": name.replace(" ", "_").lower(), "name": name,
            "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, y]}
    if on_error:
        # never block the pipeline (e.g. OpenAI key missing) — pass the item
        # through so the Claude-written article still saves.
        node["onError"] = on_error
    if retry:
        # node-level auto-retry — survives Anthropic 429 rate limits by waiting
        # and retrying until the per-minute token budget frees up.
        node["retryOnFail"] = True
        node["maxTries"] = retry.get("maxTries", 5)
        node["waitBetweenTries"] = retry.get("waitBetweenTries", 25000)
    return node


supa_headers = [
    {"name": "apikey", "value": "={{ $('Config').first().json.supabaseAnonKey }}"},
    {"name": "Authorization", "value": "=Bearer {{ $('Config').first().json.supabaseAnonKey }}"},
]
anthropic_headers = [
    {"name": "x-api-key", "value": "={{ $('Config').first().json.anthropicKey }}"},
    {"name": "anthropic-version", "value": "2023-06-01"},
    {"name": "content-type", "value": "application/json"},
]
admin_headers = supa_headers + [{"name": "content-type", "value": "application/json"}]
pexels_headers = [{"name": "Authorization", "value": "={{ $('Config').first().json.pexelsKey }}"}]
openai_headers = [
    {"name": "Authorization", "value": "=Bearer {{ $('Config').first().json.openaiKey }}"},
    {"name": "content-type", "value": "application/json"},
]

BUILD_SEEDS = r"""
const topics = $('Get site topics').all().map(i => i.json.topic).filter(Boolean);
const uniqTopics = [...new Set(topics)];
const baseEn = ['invest in oman real estate','company registration in oman','oman residency by investment','buy apartment oman','import car from oman to iran','business setup oman','oman property for foreigners'];
const baseFa = ['سرمایه گذاری در عمان','ثبت شرکت در عمان','خرید ملک در عمان','اقامت از طریق سرمایه گذاری عمان','واردات خودرو از عمان به ایران','افتتاح حساب بانکی در عمان'];
const seeds = [];
baseEn.forEach(q => seeds.push({ q, hl: 'en' }));
baseFa.forEach(q => seeds.push({ q, hl: 'fa' }));
uniqTopics.slice(0, 6).forEach(q => seeds.push({ q, hl: 'fa' }));
return seeds.map(s => ({ json: s }));
""".strip()

AGGREGATE = r"""
const items = $input.all();
const kw = new Set();
for (const it of items) {
  let raw = it.json.data !== undefined ? it.json.data : it.json;
  let arr = raw;
  if (typeof raw === 'string') { try { arr = JSON.parse(raw); } catch (e) { arr = []; } }
  const sugg = Array.isArray(arr) && Array.isArray(arr[1]) ? arr[1] : [];
  sugg.forEach(s => kw.add(String(s).trim()));
}
const rows = $('Get site topics').all().map(i => i.json);
const topics = [...new Set(rows.map(r => r.topic).filter(Boolean))];
const brandContext = rows.map(r => r.content).filter(Boolean).join('\n\n').slice(0, 12000);
const existingSlugs = [...new Set($('Get existing slugs').all().map(i => i.json.slug).filter(Boolean))];
return [{ json: { keywords: [...kw].slice(0, 150), topics, existingSlugs, brandContext } }];
""".strip()

PREP_TOPIC = r"""
const c = $('Config').first().json;
const d = $input.first().json;
const sys = 'You are an SEO content strategist for Irfan Investment Group, a premium real-estate and business-setup advisory in Oman (real estate, company registration, corporate banking & financing, investment, car import from Oman to Iran). Use the web_search tool to research what is CURRENTLY trending and ranking for these topics and to collect up-to-date facts, figures, regulations and dates. Then choose ONE high-opportunity blog topic that matches the brand and does NOT duplicate already-published articles.';
const user = 'SITE TOPICS:\n' + d.topics.join(', ') + '\n\nTRENDING KEYWORD CANDIDATES (Google autocomplete):\n' + d.keywords.join(', ') + '\n\nALREADY PUBLISHED SLUGS (avoid overlap):\n' + (d.existingSlugs.join(', ') || '(none)') + '\n\nAfter researching with web_search, return ONLY valid JSON, no prose, no code fences:\n{"topic":"short topic title","slug":"kebab-case-latin-slug","category":"one of: Investment, Real Estate, Company Registration, Banking, Car Import, Guide","primaryKeyword":"main keyword","secondaryKeywords":["kw1","kw2","kw3","kw4","kw5"],"searchIntent":"informational|commercial|transactional","researchNotes":["8-12 concrete factual bullets you found via web_search, include any current numbers, dates, rules, sources"],"outline":["H2 1","H2 2","H2 3","H2 4"]}';
return [{ json: { body: { model: c.model, max_tokens: 2500, system: sys, tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 2 }], messages: [{ role: 'user', content: user }] } } }];
""".strip()

PARSE_SELECTION = r"""
const resp = $input.first().json;
let txt = Array.isArray(resp.content) ? resp.content.filter(c => c.type === 'text').map(c => c.text).join('\n') : '';
let clean = txt.replace(/```json/g, '').replace(/```/g, '').trim();
const s = clean.indexOf('{'); const e = clean.lastIndexOf('}');
if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);
let sel;
try { sel = JSON.parse(clean); } catch (err) { throw new Error('Topic JSON parse failed: ' + clean.slice(0, 400)); }
const existing = ($('Aggregate keywords').first().json.existingSlugs) || [];
if (existing.includes(sel.slug)) sel.slug = sel.slug + '-2026';
// Relevant cover-photo query: prefer a strategist-supplied visual concept,
// else a curated query per category (long keyword phrases return poor stock photos).
const CAT_IMG = {
  'Real Estate': 'Muscat Oman modern apartment building waterfront',
  'Investment': 'Muscat Oman city skyline business district',
  'Company Registration': 'modern business office meeting professionals',
  'Banking': 'finance banking office documents handshake',
  'Car Import': 'luxury car showroom vehicle',
  'Guide': 'Muscat Oman skyline modern architecture'
};
const imageQuery = (sel.imageQuery && String(sel.imageQuery).length > 3)
  ? String(sel.imageQuery)
  : (CAT_IMG[sel.category] || 'Muscat Oman skyline modern architecture');
return [{ json: { sel, imageQuery } }];
""".strip()

FAN_OUT = r"""
const c = $('Config').first().json;
const sel = $('Parse selection').first().json.sel;
const agg = $('Aggregate keywords').first().json;
const px = $input.first().json;
let cover = '/peninsula.jpg';
try { const p = (px.photos || [])[0]; if (p && p.src) cover = p.src.landscape || p.src.large2x || p.src.large || p.src.original || cover; } catch (e) {}
const langs = String(c.langs || 'en').split(',').map(s => s.trim()).filter(Boolean);
const brand = (agg.brandContext || '').slice(0, 2000);
const notes = Array.isArray(sel.researchNotes) ? sel.researchNotes.join('\n- ') : '';
const outline = Array.isArray(sel.outline) ? sel.outline.join('; ') : '';
return langs.map(lang => ({ json: {
  lang, slug: sel.slug, topic: sel.topic, category: sel.category,
  primaryKeyword: sel.primaryKeyword, secondaryKeywords: sel.secondaryKeywords || [],
  searchIntent: sel.searchIntent || '', coverImage: cover, brandContext: brand,
  researchNotes: notes, outline
} }));
""".strip()

PREP_ARTICLE = r"""
const c = $('Config').first().json;
const langName = { en: 'English', ru: 'Russian', ar: 'Arabic', fa: 'Persian (Farsi)' };
return $input.all().map(it => {
  const d = it.json;
  const ln = langName[d.lang] || d.lang;
  const rtl = (d.lang === 'ar' || d.lang === 'fa') ? ' Write natural ' + ln + ' for a right-to-left audience; no Latin filler text.' : '';
  const sys = 'You are an expert multilingual SEO copywriter for Irfan Investment Group (premium real estate and business setup in Oman). Ground brand claims in the SITE SOURCE MATERIAL and incorporate the RESEARCH NOTES (current facts from web research); do not contradict them or invent specific prices or legal guarantees. Write an original, genuinely helpful, SEO-optimized article. SEO rules: put the primary keyword in the title, the first 100 words, at least one H2, and use it naturally 4-8 times; clear H2/H3 hierarchy; short paragraphs and bullet lists; include a "## FAQ" section with 3-5 question-style H3s answering real search queries; add 1-2 internal links as Markdown to relevant pages (/invest, /investment, /investment/legal, /car-import, or /insights); finish with a soft CTA to contact a consultant. Target 900-1200 words. Write entirely in ' + ln + '.' + rtl;
  const user = 'TOPIC: ' + d.topic + '\nPRIMARY KEYWORD: ' + d.primaryKeyword + '\nSECONDARY KEYWORDS: ' + (d.secondaryKeywords || []).join(', ') + '\nSEARCH INTENT: ' + d.searchIntent + '\nSUGGESTED OUTLINE: ' + (d.outline || '') + '\n\nRESEARCH NOTES (current facts from web search - use them, keep accurate):\n- ' + (d.researchNotes || '(none)') + '\n\nSITE SOURCE MATERIAL (the firm\'s own content - use for brand facts/services):\n' + (d.brandContext || '(none)') + '\n\nReturn ONLY valid JSON, no prose, no code fences:\n{"title":"...","excerpt":"<=155 chars meta description containing the primary keyword","body_md":"900-1200 word GitHub-flavored Markdown article with ## H2 and ### H3 headings, short paragraphs, bullet lists, a ## FAQ section, 1-2 internal Markdown links, an intro and a closing CTA","tags":["5-8","keywords"],"seo_title":"<=60 chars","seo_description":"<=155 chars"}';
  return { json: { lang: d.lang, slug: d.slug, category: d.category, coverImage: d.coverImage, body: { model: c.model, max_tokens: 7000, system: sys, messages: [{ role: 'user', content: user }] } } };
});
""".strip()

PARSE_ARTICLE = r"""
const preps = $('Prep article request').all();
const out = [];
$input.all().forEach((it, i) => {
  const meta = (preps[i] && preps[i].json) || {};
  const resp = it.json;
  let txt = Array.isArray(resp.content) ? resp.content.filter(c => c.type === 'text').map(c => c.text).join('\n') : '';
  let clean = txt.replace(/```json/g, '').replace(/```/g, '').trim();
  const s = clean.indexOf('{'); const e = clean.lastIndexOf('}');
  if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);
  let a;
  try { a = JSON.parse(clean); } catch (err) { console.log('Skip ' + (meta.lang || '?') + ': invalid/truncated JSON'); return; }
  if (!a.title || !a.body_md) { console.log('Skip ' + (meta.lang || '?') + ': missing fields'); return; }
  out.push({ json: { row: {
    lang: meta.lang, slug: meta.slug, title: a.title, excerpt: a.excerpt || '',
    body_md: a.body_md, category: meta.category || a.category || 'Guide',
    tags: a.tags || [], seo_title: a.seo_title || '', seo_description: a.seo_description || '',
    cover_image: meta.coverImage || '/peninsula.jpg', published: false
  } } });
});
if (out.length === 0) throw new Error('All languages failed to parse - check Anthropic output / max_tokens');
return out;
""".strip()

PREP_SEO_REVIEW = r"""
const c = $('Config').first().json;
const sel = $('Parse selection').first().json.sel;
const langName = { en: 'English', ru: 'Russian', ar: 'Arabic', fa: 'Persian (Farsi)' };
return $input.all().map(it => {
  const row = it.json.row;
  const ln = langName[row.lang] || row.lang;
  const sys = 'You are a senior multilingual SEO editor. Improve the given article for on-page SEO and keyword optimization WITHOUT changing its language (' + ln + ') or core meaning. Ensure the primary keyword appears in the title, the first 100 words, at least one H2, and naturally 4-8 times; strengthen secondary/semantic keywords; tighten the meta title (<=60 chars) and meta description (<=155 chars, must contain the primary keyword); keep clear H2/H3 structure, the FAQ section, and any internal Markdown links; fix awkward phrasing and improve readability. Also propose the best 2-4 word ENGLISH image search query that matches the article so the cover photo fits the text.';
  const user = 'PRIMARY KEYWORD: ' + (sel.primaryKeyword || '') + '\nSECONDARY KEYWORDS: ' + ((sel.secondaryKeywords || []).join(', ')) + '\nLANGUAGE: ' + ln + '\n\nARTICLE TITLE: ' + row.title + '\nCURRENT META TITLE: ' + (row.seo_title || '') + '\nCURRENT META DESC: ' + (row.seo_description || '') + '\n\nARTICLE MARKDOWN:\n' + row.body_md + '\n\nReturn ONLY a JSON object: {"title":"...","excerpt":"<=155 chars","body_md":"improved full Markdown article","tags":["5-8 keywords"],"seo_title":"<=60","seo_description":"<=155","image_query":"english 2-4 words","seo_score":0-100,"notes":"one short line"}';
  const body = { model: c.openaiModel || 'gpt-4o-mini', messages: [{ role: 'system', content: sys }, { role: 'user', content: user }], response_format: { type: 'json_object' }, max_tokens: 5000, temperature: 0.4 };
  return { json: { meta: row, body } };
});
""".strip()

APPLY_REVIEW = r"""
const preps = $('Prep SEO review').all();
const out = [];
$input.all().forEach((it, i) => {
  const meta = (preps[i] && preps[i].json.meta) || {};
  const resp = it.json;
  let txt = '';
  try { txt = resp.choices[0].message.content || ''; } catch (e) {}
  let a = null;
  try { a = JSON.parse(txt); } catch (e) { console.log('SEO editor JSON parse failed for ' + (meta.lang || '?') + ' - keeping original'); }
  const row = Object.assign({}, meta);
  if (a) {
    if (a.title) row.title = a.title;
    if (a.excerpt) row.excerpt = a.excerpt;
    if (a.body_md) row.body_md = a.body_md;
    if (Array.isArray(a.tags) && a.tags.length) row.tags = a.tags;
    if (a.seo_title) row.seo_title = a.seo_title;
    if (a.seo_description) row.seo_description = a.seo_description;
  }
  out.push({ json: { row, imageQuery: (a && a.image_query) || '', seoScore: (a && a.seo_score) || null } });
});
return out;
""".strip()

FINALIZE = r"""
const reviews = $('Apply SEO review').all();
const out = [];
$input.all().forEach((it, i) => {
  const rev = (reviews[i] && reviews[i].json) || {};
  const row = Object.assign({}, rev.row || {});
  const px = it.json;
  try {
    const p = (px.photos || [])[0];
    if (p && p.src && rev.imageQuery) row.cover_image = p.src.landscape || p.src.large2x || p.src.large || row.cover_image;
  } catch (e) {}
  out.push({ json: { row } });
});
return out;
""".strip()

nodes = []
nodes.append({
    "parameters": {"rule": {"interval": [{"field": "weeks", "weeksInterval": 1, "triggerAtDay": [1], "triggerAtHour": 8}]}},
    "id": "schedule_trigger", "name": "Weekly trigger",
    "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.2, "position": [-100, 300]})

nodes.append({
    "parameters": {"assignments": {"assignments": [
        {"id": "c1", "name": "supabaseUrl", "type": "string", "value": SUPABASE_URL},
        {"id": "c2", "name": "supabaseAnonKey", "type": "string", "value": SUPABASE_ANON},
        {"id": "c3", "name": "adminPassword", "type": "string", "value": "__SET_INSIGHTS_ADMIN_PASSWORD__"},
        {"id": "c4", "name": "anthropicKey", "type": "string", "value": "__SET_ANTHROPIC_API_KEY__"},
        {"id": "c5", "name": "model", "type": "string", "value": "claude-sonnet-4-5-20250929"},
        {"id": "c6", "name": "langs", "type": "string", "value": "en,ru,ar,fa"},
        {"id": "c7", "name": "pexelsKey", "type": "string", "value": "__SET_PEXELS_API_KEY__"},
        {"id": "c8", "name": "openaiKey", "type": "string", "value": "__SET_OPENAI_API_KEY__"},
        {"id": "c9", "name": "openaiModel", "type": "string", "value": "gpt-4o-mini"},
    ]}, "options": {}},
    "id": "config", "name": "Config", "type": "n8n-nodes-base.set", "typeVersion": 3.4, "position": [120, 300]})

nodes.append(http_get("Get site topics",
    "={{ $('Config').first().json.supabaseUrl }}/rest/v1/ai_knowledge?select=page,topic,content",
    340, 200, headers=supa_headers))
nodes.append(code("Collapse topics", "return [{ json: { ok: true } }];", 540, 200))
nodes.append(http_get("Get existing slugs",
    "={{ $('Config').first().json.supabaseUrl }}/rest/v1/insights?select=slug",
    740, 200, headers=supa_headers))
nodes.append(code("Build seeds", BUILD_SEEDS, 940, 200))
nodes.append(http_get("Google autocomplete",
    "=https://suggestqueries.google.com/complete/search?client=chrome&hl={{ $json.hl }}&q={{ encodeURIComponent($json.q) }}",
    1140, 200, options={"response": {"response": {"responseFormat": "text", "neverError": True}}}))
nodes.append(code("Aggregate keywords", AGGREGATE, 1340, 200))
nodes.append(code("Prep topic request", PREP_TOPIC, 1540, 200))
nodes.append(http_post_json("Anthropic select topic", "https://api.anthropic.com/v1/messages",
    "={{ JSON.stringify($json.body) }}", 1740, 200, anthropic_headers,
    retry={"maxTries": 5, "waitBetweenTries": 20000}))
nodes.append(code("Parse selection", PARSE_SELECTION, 1940, 200))
nodes.append(http_get("Pick cover image",
    "=https://api.pexels.com/v1/search?orientation=landscape&per_page=1&query={{ encodeURIComponent($json.imageQuery) }}",
    2140, 200, headers=pexels_headers, options={"response": {"response": {"neverError": True}}}))
nodes.append(code("Fan out languages", FAN_OUT, 2340, 200))
nodes.append(code("Prep article request", PREP_ARTICLE, 2540, 200))
nodes.append(http_post_json("Anthropic write article", "https://api.anthropic.com/v1/messages",
    "={{ JSON.stringify($json.body) }}", 2740, 200, anthropic_headers,
    options={"batching": {"batch": {"batchSize": 1, "batchInterval": 65000}}},
    retry={"maxTries": 3, "waitBetweenTries": 20000}))
nodes.append(code("Parse article", PARSE_ARTICLE, 2940, 200))
# --- OpenAI SEO editor pass (review + keyword optimize + align image to text) ---
nodes.append(code("Prep SEO review", PREP_SEO_REVIEW, 3140, 200))
nodes.append(http_post_json("OpenAI SEO editor", "https://api.openai.com/v1/chat/completions",
    "={{ JSON.stringify($json.body) }}", 3340, 200, openai_headers,
    options={"batching": {"batch": {"batchSize": 1, "batchInterval": 8000}}},
    on_error="continueRegularOutput"))
nodes.append(code("Apply SEO review", APPLY_REVIEW, 3540, 200))
nodes.append(http_get("Refetch cover image",
    "=https://api.pexels.com/v1/search?orientation=landscape&per_page=1&query={{ encodeURIComponent($json.imageQuery || 'oman business') }}",
    3740, 200, headers=pexels_headers, options={"response": {"response": {"neverError": True}}}))
nodes.append(code("Finalize row", FINALIZE, 3940, 200))
nodes.append(http_post_json("Save draft to blog",
    "={{ $('Config').first().json.supabaseUrl }}/functions/v1/insights-admin",
    "={{ JSON.stringify({ action: 'upsert', password: $('Config').first().json.adminPassword, row: $json.row }) }}",
    4140, 200, admin_headers))
nodes.append({"parameters": {}, "id": "done", "name": "Drafts ready",
              "type": "n8n-nodes-base.noOp", "typeVersion": 1, "position": [4340, 200]})

order = ["Weekly trigger", "Config", "Get site topics", "Collapse topics", "Get existing slugs",
         "Build seeds", "Google autocomplete", "Aggregate keywords", "Prep topic request",
         "Anthropic select topic", "Parse selection", "Pick cover image", "Fan out languages",
         "Prep article request", "Anthropic write article", "Parse article",
         "Prep SEO review", "OpenAI SEO editor", "Apply SEO review", "Refetch cover image", "Finalize row",
         "Save draft to blog", "Drafts ready"]
connections = {}
for a, b in zip(order, order[1:]):
    connections[a] = {"main": [[{"node": b, "type": "main", "index": 0}]]}

workflow = {
    "name": "Irfan Investment — SEO Blog Agent",
    "nodes": nodes,
    "connections": connections,
    "active": False,
    "settings": {"executionOrder": "v1"},
    "pinData": {},
    "meta": {"templateId": "irfaninvest-seo-blog-agent"},
}

out = os.path.join(os.path.dirname(__file__), "irfaninvest-seo-blog-agent.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(workflow, f, ensure_ascii=False, indent=2)
print("wrote", out, "nodes:", len(nodes))
