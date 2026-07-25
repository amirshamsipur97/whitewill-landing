// footerSeoLinks.mjs — the site-wide keyword-anchored internal link block.
//
// WHY: before this, the only internal links with real anchor text lived on
// /buy, /project and the three head-term landings. The nine `/buy/{slug}`
// project pages — all prerendered, all indexable — were reachable only from
// /buy, i.e. two hops from most of the site. This block puts every money page
// one hop from EVERY page, with descriptive anchor text instead of the bare
// nav words. It renders eagerly (outside the footer's DeferredMount) so it is
// in the DOM for a crawler without needing a scroll to trigger.
//
// Proper nouns (community and project names) are NOT translated — only the
// surrounding phrase is, which keeps this maintainable across 4 languages.
//
// Project slugs verified against dist/buy/* on 2026-07-25. Keep in sync when
// a project sells out or a new one launches (the source of truth is
// api/sitemap.js: projects with >= 1 available unit).

// Real, indexable, prerendered destinations.
export const POPULAR = [
  { to: '/buy', key: 'oman' },
  { to: '/project', key: 'allOman' },
  { to: '/buy-property-in-muscat', key: 'muscat' },
  { to: '/buy-apartment-in-muscat', key: 'aptMuscat' },
  { to: '/buy-property-in-salalah', key: 'salalah' },
  { to: '/property-prices-in-oman', key: 'prices' },
]

// Facet links into the portal. `area` must match project.area.name exactly.
export const COMMUNITIES = [
  { area: 'Al Mouj (The Wave)', label: 'Al Mouj' },
  { area: 'Muscat Bay', label: 'Muscat Bay' },
  { area: 'Muscat Hills', label: 'Muscat Hills' },
  { area: 'Sultan Haitham City', label: 'Sultan Haitham City' },
  { area: 'Jebel Sifah', label: 'Jebel Sifah' },
  { area: 'Yiti', label: 'Yiti' },
  { area: 'Hawana Salalah', label: 'Hawana Salalah' },
]

// The nine projects that currently hold available stock.
export const PROJECTS = [
  { slug: 'vistal', name: 'Vistal' },
  { slug: 'st-regis', name: 'St. Regis' },
  { slug: 'zen-residences', name: 'Zen Residences' },
  { slug: 'aida', name: 'Aida' },
  { slug: 'jebel-sifah', name: 'Jebel Sifah' },
  { slug: 'wadi-zaha', name: 'Wadi Zaha' },
  { slug: 'yenaier', name: 'Yenaier' },
  { slug: 'hay-al-wafa', name: 'Hay Al Wafa' },
  { slug: 'hawana-salalah', name: 'Hawana Salalah' },
]

export const FOOTER_SEO = {
  en: {
    headings: { popular: 'Popular searches', communities: 'Buy by community', projects: 'Featured projects' },
    popular: {
      oman: 'Buy property in Oman',
      allOman: 'Properties for sale in Oman',
      muscat: 'Buy property in Muscat',
      aptMuscat: 'Buy an apartment in Muscat',
      salalah: 'Buy property in Salalah',
      prices: 'Oman property prices per m²',
    },
    community: 'Property for sale in {area}',
    project: '{name}: prices & available units',
  },
  fa: {
    headings: { popular: 'جستجوهای پرطرفدار', communities: 'خرید بر اساس منطقه', projects: 'پروژه‌های منتخب' },
    popular: {
      oman: 'خرید ملک در عمان',
      allOman: 'املاک برای فروش در عمان',
      muscat: 'خرید ملک در مسقط',
      aptMuscat: 'خرید آپارتمان در مسقط',
      salalah: 'خرید ملک در صلاله',
      prices: 'قیمت ملک در عمان هر متر',
    },
    community: 'ملک برای فروش در {area}',
    project: '{name}: قیمت‌ها و واحدهای موجود',
  },
  ar: {
    headings: { popular: 'عمليات البحث الشائعة', communities: 'الشراء حسب المنطقة', projects: 'مشاريع مختارة' },
    popular: {
      oman: 'شراء عقار في عُمان',
      allOman: 'عقارات للبيع في عُمان',
      muscat: 'شراء عقار في مسقط',
      aptMuscat: 'شراء شقة في مسقط',
      salalah: 'شراء عقار في صلالة',
      prices: 'أسعار العقارات في عُمان للمتر',
    },
    community: 'عقارات للبيع في {area}',
    project: '{name}: الأسعار والوحدات المتاحة',
  },
  ru: {
    headings: { popular: 'Популярные запросы', communities: 'Покупка по районам', projects: 'Избранные проекты' },
    popular: {
      oman: 'Купить недвижимость в Омане',
      allOman: 'Недвижимость на продажу в Омане',
      muscat: 'Купить недвижимость в Маскате',
      aptMuscat: 'Купить квартиру в Маскате',
      salalah: 'Купить недвижимость в Салале',
      prices: 'Цены на недвижимость Омана за м²',
    },
    community: 'Недвижимость на продажу в {area}',
    project: '{name}: цены и доступные лоты',
  },
}

export function footerSeoCopy(lang) {
  return FOOTER_SEO[lang] || FOOTER_SEO.en
}
