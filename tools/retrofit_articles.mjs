// Retrofit the published blog articles with links to the money pages that did
// not exist when they were written (/project + the three head-term landings).
// 0 of 119 articles linked to any of them.
//
// Additive only: appends one localized "Browse live listings" section. Never
// edits existing prose. Idempotent — skips an article that already has the
// section, and never links a target the article already links to.
//
// Run with DRY=1 to preview.

const U = 'https://owgvrxipqlusepozlujv.supabase.co'
const K = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3ZyeGlwcWx1c2Vwb3psdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTYxMjQsImV4cCI6MjA5MjM3MjEyNH0.vZK4z9p9pUF1rZ8LHadFReBcEcwidwy9ZdEXnSmK4Fs'
const H = { apikey: K, Authorization: `Bearer ${K}`, 'Content-Type': 'application/json' }
const DRY = process.env.DRY === '1'
// 🚨 NEVER hardcode this again. This repo is PUBLIC, and the literal sat here
// and in three handoff files, so the password it protected has to be treated
// as compromised and rotated. The insights-admin function can create, edit and
// unpublish every article on the site, which is the whole organic funnel.
//   INSIGHTS_ADMIN_PW=... node tools/retrofit_articles.mjs
const ADMIN_PW = process.env.INSIGHTS_ADMIN_PW
if (!ADMIN_PW) {
  console.error('Set INSIGHTS_ADMIN_PW in the environment. It is deliberately not stored in this repo.')
  process.exit(1)
}

const HEADING = {
  en: 'Browse live listings',
  fa: 'مشاهده املاک موجود',
  ar: 'تصفح العقارات المتاحة',
  ru: 'Смотреть актуальные объекты',
}
const INTRO = {
  en: 'Every unit below is priced from live developer inventory and updated as stock moves.',
  fa: 'قیمت همه واحدهای زیر از اینونتوری زنده سازنده است و با تغییر موجودی به‌روز می‌شود.',
  ar: 'جميع الوحدات أدناه بأسعار من مخزون المطورين مباشرة وتُحدَّث مع تغير التوافر.',
  ru: 'Все объекты ниже — с ценами из живого инвентаря застройщиков, обновляются по мере продаж.',
}
const ANCHOR = {
  '/project': {
    en: 'All properties for sale in Oman', fa: 'همه املاک برای فروش در عمان',
    ar: 'جميع العقارات للبيع في عُمان', ru: 'Вся недвижимость на продажу в Омане',
  },
  '/buy-property-in-muscat': {
    en: 'Buy property in Muscat', fa: 'خرید ملک در مسقط',
    ar: 'شراء عقار في مسقط', ru: 'Купить недвижимость в Маскате',
  },
  '/buy-apartment-in-muscat': {
    en: 'Buy an apartment in Muscat', fa: 'خرید آپارتمان در مسقط',
    ar: 'شراء شقة في مسقط', ru: 'Купить квартиру в Маскате',
  },
  '/buy-property-in-salalah': {
    en: 'Buy property in Salalah', fa: 'خرید ملک در صلاله',
    ar: 'شراء عقار في صلالة', ru: 'Купить недвижимость в Салале',
  },
}
const SALALAH = /salalah|صلال|салал|hawana|هوانا|amazi/i
const APARTMENT = /apartment|آپارتمان|شقة|شقق|квартир|studio|استودیو|استوديو|студи/i
const prefix = (lang) => (lang === 'en' ? '' : `/${lang}`)

function pickTargets(a) {
  const hay = `${a.title || ''} ${a.body_md || ''}`
  const t = ['/project']
  if (SALALAH.test(hay)) t.push('/buy-property-in-salalah')
  if (APARTMENT.test(hay)) t.push('/buy-apartment-in-muscat')
  if (t.length < 3) t.push('/buy-property-in-muscat')
  return t.slice(0, 3)
}

const res = await fetch(
  `${U}/rest/v1/insights?select=*&published=eq.true&limit=500`,
  { headers: H },
)
const rows = await res.json()

let changed = 0, skipped = 0, failed = 0
const preview = []

for (const a of rows) {
  const body = a.body_md || ''
  const lang = ANCHOR['/project'][a.lang] ? a.lang : 'en'
  if (body.includes(HEADING[lang])) { skipped++; continue }

  const existing = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)]
    .map((m) => m[1].replace(/^\/(fa|ar|ru)/, ''))
  const targets = pickTargets(a).filter((t) => !existing.includes(t))
  if (!targets.length) { skipped++; continue }

  const items = targets
    .map((t) => `- [${ANCHOR[t][lang]}](${prefix(a.lang)}${t})`)
    .join('\n')
  const block = `\n\n## ${HEADING[lang]}\n\n${INTRO[lang]}\n\n${items}\n`
  const next = body.replace(/\s+$/, '') + block

  if (preview.length < 4) preview.push({ slug: a.slug, lang: a.lang, block })
  if (DRY) { changed++; continue }

  // Direct PATCH is silently no-op'd by RLS; the blog's own write path is the
  // insights-admin edge function (same one the n8n agent posts to).
  const up = await fetch(`${U}/functions/v1/insights-admin`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({ action: 'upsert', password: ADMIN_PW, row: { ...a, body_md: next } }),
  })
  const txt = await up.text()
  if (up.ok && !/error/i.test(txt.slice(0, 200))) changed++
  else { failed++; if (failed <= 3) console.log('  FAIL', a.slug, up.status, txt.slice(0, 200)) }
}

console.log(`${DRY ? '[DRY RUN] ' : ''}articles: ${rows.length} | would change: ${changed} | skipped: ${skipped} | failed: ${failed}`)
console.log('\n─── sample blocks ───')
for (const p of preview) console.log(`\n[${p.lang}] ${p.slug}${p.block}`)
