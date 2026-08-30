/**
 * iraniansUaeContent.mjs — copy + figures for /fa/oman-property-for-iranians-in-uae
 *
 * WHY THIS PAGE EXISTS: the Persian side of the site already ranks for
 * «خرید ملک در عمان», but every fa page speaks to a buyer sitting in Iran.
 * The segment the owner wants to work is different: Iranians who already
 * LIVE in the UAE. They hold dirhams, hold a UAE residency, know the Dubai
 * market by heart, and are an hour and a quarter from Muscat. None of the
 * existing fa pages answer the only question that buyer actually asks:
 * what does my dirham budget buy in Oman, and what residency comes with it.
 *
 * THE PAGE IS PERSIAN ONLY. It is registered in seoRoutes with
 * `langs: ['fa']`, so prerender-routes and the sitemap emit the fa URL and
 * nothing else, and vercel.json allowlists only /fa/<slug>. An English or
 * Arabic edition of "Oman property for Iranians in the UAE" would be a thin
 * duplicate of pages that already exist, which is the exact problem the
 * 07-25 SEO sprint spent a week undoing.
 *
 * ══ THE HONEST LINE, DO NOT SOFTEN IT ══
 * Oman's GOLDEN residency is MORE expensive than the UAE's: OMR 250,000
 * (~AED 2.39m) against AED 2m. If this page implied otherwise it would be
 * lying, and the buyer would find out in one search. What Oman actually has
 * that the UAE does not is a renewable owner residency attached to ANY ITC
 * purchase, which starts around AED 589,000. That is the entire pitch and it
 * is true. Same editorial rule as GoldenVisaPage: separate the two permits
 * instead of blurring them.
 *
 * ══ FIGURES ══
 * OMR figures are live from project_units (availability_status ilike
 * '%avail%'), read 2026-08-31: 475 units, entry OMR 61,635 (Wadi Zaha studio,
 * 56 sqm, Sultan Haitham City), 146 units at or under OMR 100,000, 145 units
 * at or above the OMR 250,000 golden threshold.
 *
 * The median per sqm is deliberately taken from the site's OWN price index
 * (OMR 1,107/m², printed by prerender-routes on every build) and NOT from a
 * fresh median over project_units, which counts rows
 * the index excludes. Two pages publishing two different medians for the same
 * inventory is the kind of thing a buyer notices, so this one follows
 * /property-prices-in-oman. Re-read the build log when refreshing it.
 *
 * AED conversions use OMR 1 = USD 2.6008 and AED 3.6725/USD, i.e.
 * OMR 1 = AED 9.5514. Both legs are pegs, so these are stable, not estimates.
 * Same rate that produced the AED line in SalalahPopup's GEO_CURRENCY block;
 * if that block is ever recomputed, recompute this file in the same pass.
 *
 * UAE-side figures are external and are labelled as such on the page:
 * the AED 2m golden visa property threshold (federal, confirmed unchanged by
 * the Feb 2026 circular) and Dubai's mid-2026 apartment average of about
 * AED 1,969 per sqft (~AED 21,200 per sqm) with studios entering around
 * AED 650,000 to 800,000. These are market references, not our data, and the
 * page says so. Recheck them before any campaign that leans on the number.
 *
 * ⚠️ ENTRY-PRICE CASCADE: OMR 61,635 appears here too. When an inventory
 * refresh moves the site minimum, this file is part of the sweep (see the
 * runbook in HANDOFF-2026-08-17.md §6), and both the OMR and the AED line
 * have to move together.
 */

// OMR 1 = AED 9.5514 (both pegged to USD).
export const OMR_TO_AED = 9.5514

// Live inventory snapshot, 2026-08-17.
export const LIVE = {
  units: 475,
  entryOmr: 61635,
  entryAed: 588700,
  entryArea: 56,
  medianPpsmOmr: 1107, // from the site price index, see header
  medianPpsmAed: 10573,
  underMidBand: 146, // units at or under OMR 100,000 (~AED 955,000)
  goldenEligible: 145, // units at or above OMR 250,000
}

// UAE-side reference figures. External, labelled on the page.
export const UAE_REF = {
  goldenAed: 2000000,
  dubaiPpsmAed: 21200,
  dubaiStudioLowAed: 650000,
  dubaiStudioHighAed: 800000,
}

// Oman residency thresholds, in both currencies.
export const OMAN_TIERS = {
  fiveYearOmr: 250000,
  fiveYearAed: 2390000,
  tenYearOmr: 500000,
  tenYearAed: 4780000,
}

export const copy = {
  eyebrow: 'ویژه ایرانیان مقیم امارات',
  h1: 'خرید ملک در عمان برای ساکنین امارات ۲۰۲۶',
  answerLabel: 'پاسخ کوتاه',
  answer:
    'خرید ملک در عمان برای ساکنین امارات آزاد است و به ملیت یا اقامت اماراتی شما وابسته نیست. داخل مناطق ITC عمان، خریدار با هر ملیتی ۱۰۰٪ مالکیت آزاد با سند ثبت‌شده می‌گیرد، از حدود ۵۸۸٬۷۰۰ درهم شروع می‌شود، و همان خرید مالک و خانواده درجه یک را واجد شرایط اقامت قابل تمدید عمان می‌کند. مسقط یک ساعت و ربع با دبی فاصله دارد و کل خرید از راه دور هم قابل انجام است.',
  lead:
    'شما درهم دارید، اقامت امارات دارید و یک ساعت و ربع با مسقط فاصله دارید. این صفحه دقیقاً همان چیزی را می‌گوید که بودجه درهمی شما در عمان می‌خرد و چه اقامتی همراهش می‌آید. همه قیمت‌ها از موجودی زنده ماست، نه از بروشور.',
  ctaPrimary: 'دیدن املاک موجود',
  ctaSecondary: 'دریافت لیست قیمت',

  stats: [
    { value: '۴۷۵', label: 'واحد موجود در ۱۲ پروژه' },
    { value: '۵۸۸٬۷۰۰ درهم', label: 'کمترین قیمت ورود، فری‌هولد' },
    { value: '۱ ساعت و ۱۵ دقیقه', label: 'پرواز دبی به مسقط' },
    { value: 'اقامت قابل تمدید', label: 'با هر خرید در منطقه ITC' },
  ],

  whyTitle: 'چرا وقتی در امارات زندگی می‌کنید، عمان معنا پیدا می‌کند',
  whyIntro:
    'این صفحه برای کسی نوشته شده که از ایران خرید نمی‌کند. برای کسی نوشته شده که در دبی، ابوظبی یا شارجه کار می‌کند، حسابش درهمی است و دنبال یک پایه دوم در همان منطقه می‌گردد.',
  why: [
    {
      title: 'بودجه درهمی، بازار ارزان‌تر',
      body:
        'میانه قیمت هر مترمربع در موجودی زنده ما حدود ۱۰٬۵۷۰ درهم است. میانگین آپارتمان در دبی در میانه ۲۰۲۶ حدود ۲۱٬۲۰۰ درهم برای هر مترمربع گزارش می‌شود. یعنی همان بودجه، تقریباً دو برابر متراژ. عدد سمت عمان مال ماست، عدد سمت دبی مرجع بازار است.',
    },
    {
      title: 'اقامتی که با خرید کوچک هم می‌آید',
      body:
        'در امارات، مسیر اقامت طلایی از راه ملک از ۲ میلیون درهم شروع می‌شود. در عمان هر خرید داخل منطقه ITC، حتی یک استودیو ۵۸۸٬۷۰۰ درهمی، مالک و خانواده درجه یک را واجد شرایط اقامت قابل تمدید مالک ملک می‌کند. این تفاوت اصلی است.',
    },
    {
      title: 'نزدیک، نه دور',
      body:
        'پرواز دبی به مسقط حدود یک ساعت و ربع است و مرز زمینی هم باز است. ملک عمان برای شما یک دارایی در کشور دیگر نیست؛ آخر هفته می‌شود رفت و برگشت، و همان روز قرارداد را دید و امضا کرد.',
    },
  ],

  termsTitle: 'شرایط خرید ملک در عمان برای ساکنین امارات',
  termsIntro:
    'هیچ شرط ملیتی در کار نیست. آنچه تعیین می‌کند شما می‌توانید بخرید یا نه، ملیت یا اقامت شما نیست، بلکه منطقه‌ای است که ملک در آن قرار دارد.',
  terms: [
    'خرید داخل مناطق ITC برای هر ملیتی آزاد است، بر پایه فرمان سلطنتی ۱۲/۲۰۰۶.',
    'به اقامت قبلی در عمان نیاز نیست و اقامت اماراتی شما نه شرط است و نه مانع.',
    'سند مالکیت آزاد به نام خودتان ثبت می‌شود، با حق کامل ارث.',
    'هزینه ثبت یک‌باره حدود ۳٪ است و بعد از آن مالیات سالانه ملک وجود ندارد.',
    'خرید با وکالت‌نامه کاملاً از راه دور انجام می‌شود و نیازی به حضور فیزیکی نیست.',
    'هر خرید داخل ITC، مالک و خانواده درجه یک را واجد شرایط اقامت قابل تمدید مالک ملک می‌کند.',
  ],

  compareTitle: 'مقایسه عدد به عدد با امارات',
  compareNote:
    'یک نکته را صریح می‌گوییم چون در یک جستجو معلوم می‌شود: پله اقامت طلایی عمان از امارات گران‌تر است. مزیت عمان آن پله نیست، بلکه اقامتی است که با خریدهای کوچک هم می‌آید.',
  compareCols: ['موضوع', 'امارات', 'عمان'],
  compareRows: [
    {
      k: 'کمترین خریدی که اقامت می‌آورد',
      uae: 'مسیر اقامت از راه ملک زیر ۲ میلیون درهم وجود ندارد',
      om: 'حدود ۵۸۸٬۷۰۰ درهم، هر خرید داخل ITC',
      good: true,
    },
    {
      k: 'آستانه اقامت طلایی از راه ملک',
      uae: '۲٬۰۰۰٬۰۰۰ درهم برای ویزای ۱۰ ساله',
      om: 'حدود ۲٬۳۹۰٬۰۰۰ درهم برای ۵ ساله و حدود ۴٬۷۸۰٬۰۰۰ درهم برای ۱۰ ساله',
      good: false,
    },
    {
      k: 'میانه قیمت هر مترمربع',
      uae: 'حدود ۲۱٬۲۰۰ درهم، میانگین آپارتمان دبی در میانه ۲۰۲۶',
      om: 'حدود ۱۰٬۵۷۰ درهم، میانه موجودی زنده ما',
      good: true,
    },
    {
      k: 'کمترین قیمت یک استودیو',
      uae: 'حدود ۶۵۰٬۰۰۰ تا ۸۰۰٬۰۰۰ درهم در محله‌های ارزان‌تر دبی',
      om: '۵۸۸٬۷۰۰ درهم برای یک استودیو ۵۶ مترمربعی در شهر سلطان هیثم',
      good: true,
    },
    {
      k: 'مالکیت برای غیرشهروند',
      uae: 'فری‌هولد در مناطق مشخص‌شده',
      om: 'فری‌هولد ۱۰۰٪ داخل مناطق ITC، برای هر ملیتی، بر پایه فرمان سلطنتی ۱۲/۲۰۰۶',
      good: null,
    },
    {
      k: 'مالیات سالانه ملک',
      uae: 'ندارد',
      om: 'ندارد. هزینه ثبت یک‌باره حدود ۳٪، بدون مالیات بر عایدی سرمایه و بدون مالیات بر درآمد اجاره برای اشخاص حقیقی',
      good: null,
    },
  ],
  compareSource:
    'ارقام سمت امارات مرجع بازار است: آستانه ۲ میلیون درهمی ویزای طلایی (فدرال، تأییدشده در بخشنامه فوریه ۲۰۲۶) و میانگین قیمت آپارتمان دبی در میانه ۲۰۲۶. ارقام سمت عمان از موجودی زنده خود ماست و با هر به‌روزرسانی انبار تغییر می‌کند.',

  bandsTitle: 'بودجه درهمی شما در عمان چه می‌خرد',
  bands: [
    {
      range: 'تا حدود ۹۵۵٬۰۰۰ درهم',
      omr: 'تا ۱۰۰٬۰۰۰ ریال عمان',
      count: '۱۴۶ واحد موجود',
      body:
        'استودیو و آپارتمان یک تا دوخوابه در شهر سلطان هیثم، جبل سیفه و ییتی. هر کدام از این‌ها اقامت قابل تمدید مالک ملک را می‌آورد. در دبی همین بودجه معمولاً یک استودیو کوچک است، بدون هیچ مسیر اقامتی.',
    },
    {
      range: 'حدود ۹۵۵٬۰۰۰ تا ۲٬۳۹۰٬۰۰۰ درهم',
      omr: '۱۰۰٬۰۰۰ تا ۲۵۰٬۰۰۰ ریال عمان',
      count: 'بیشترین تنوع موجودی',
      body:
        'آپارتمان‌های بزرگ‌تر، تاون‌هاوس و ویلا در حی الوفا، ساروج، ویستال و زن رزیدنسز. هنوز زیر پله اقامت طلایی، اما با اقامت مالک ملک و متراژی که در دبی با همین پول به دست نمی‌آید.',
    },
    {
      range: 'بالای حدود ۲٬۳۹۰٬۰۰۰ درهم',
      omr: 'از ۲۵۰٬۰۰۰ ریال عمان',
      count: '۱۴۵ واحد موجود',
      body:
        'اینجا پله اقامت طلایی ۵ ساله عمان باز می‌شود: آیدا، سنت رجیس و د آرک رزیدنسز. اگر هدفتان اقامت طلایی است و نه صرفاً ملک، مقایسه با ۲ میلیون درهم امارات را با حوصله انجام دهید؛ در این محدوده امارات ارزان‌تر است.',
    },
  ],

  stepsTitle: 'از دبی، قدم به قدم',
  steps: [
    'محدوده بودجه‌تان را به ریال عمان تبدیل کنید و در پورتال ما فیلتر بگذارید. قیمت‌ها زنده است.',
    'لیست کوتاه بسازید و از ما برنامه پرداخت و متراژ دقیق همان واحدها را کتبی بخواهید.',
    'یک سفر یک‌روزه به مسقط. صبح پرواز، بازدید حضوری، شب برگشت. اگر نمی‌توانید بیایید، بازدید ویدیویی می‌گیریم.',
    'رزرو با ودیعه و امضای قرارداد فروش. کل مسیر با وکالت‌نامه از راه دور هم انجام می‌شود.',
    'ثبت سند و پرداخت هزینه یک‌باره حدود ۳٪، سپس اقدام برای اقامت مالک ملک برای خودتان و خانواده درجه یک.',
  ],
  stepsNote:
    'کارهای اداری عربی و هماهنگی با سازنده با تیم ماست. دفتر ما در مسقط است و همان شماره واتساپ سایت پاسخگوی شماست.',

  faqTitle: 'پرسش‌های متداول',
  faq: [
    {
      q: 'آیا ساکنین امارات می‌توانند در عمان ملک بخرند؟',
      a: 'بله. خرید ملک در عمان برای ساکنین امارات هیچ محدودیتی ندارد. داخل مناطق ITC، خریدار با هر ملیتی ۱۰۰٪ مالکیت آزاد با سند ثبت‌شده می‌گیرد و به اقامت قبلی در عمان نیازی نیست. اقامت اماراتی شما نه شرط است و نه مانع.',
    },
    {
      q: 'من اقامت امارات دارم. برای خرید ملک در عمان مشکلی هست؟',
      a: 'نه. داخل مناطق ITC عمان، خرید برای هر ملیتی آزاد است و به اقامت قبلی در عمان یا هر کشور دیگری وابسته نیست. اقامت اماراتی شما نه شرط است و نه مانع.',
    },
    {
      q: 'خرید در عمان اقامت می‌دهد؟ با ویزای طلایی امارات چه فرقی دارد؟',
      a: 'هر خرید داخل ITC، مالک و خانواده درجه یک را واجد شرایط ویزای قابل تمدید مالک ملک می‌کند و این از حدود ۵۸۸٬۷۰۰ درهم شروع می‌شود. اقامت طلایی عمان جداست و از ۲۵۰٬۰۰۰ ریال، یعنی حدود ۲٬۳۹۰٬۰۰۰ درهم، شروع می‌شود که از آستانه ۲ میلیون درهمی امارات بالاتر است. اگر هدف اصلی شما ویزای طلایی است، امارات در همین یک مورد ارزان‌تر است؛ اگر هدف شما اقامت دوم با خرید کوچک‌تر است، عمان مسیری دارد که امارات ندارد.',
    },
    {
      q: 'با بودجه‌ای که در دبی فقط یک استودیو می‌خرد، در عمان چه می‌شود خرید؟',
      a: 'حدود ۵۸۸٬۷۰۰ درهم در عمان یک استودیو ۵۶ مترمربعی فری‌هولد در شهر سلطان هیثم می‌خرد و همان خرید اقامت مالک ملک را می‌آورد. در مجموع ۱۴۶ واحد موجود ما زیر حدود ۹۵۵٬۰۰۰ درهم قیمت دارند.',
    },
    {
      q: 'برای خرید باید حتماً به عمان بیایم؟',
      a: 'نه. کل خرید با وکالت‌نامه از راه دور قابل انجام است. ولی چون از دبی یک ساعت و ربع راه است، بیشتر خریدارها یک سفر یک‌روزه می‌آیند و واحد را از نزدیک می‌بینند.',
    },
    {
      q: 'قیمت‌های این صفحه چقدر واقعی است؟',
      a: 'ارقام ریالی از موجودی زنده ۴۷۵ واحد ما می‌آید و با هر به‌روزرسانی انبار عوض می‌شود. تبدیل درهم با نرخ ثابت انجام شده، چون هم ریال عمان و هم درهم به دلار میخکوب‌اند. ارقام سمت امارات مرجع بازار است و روی صفحه هم همین‌طور علامت خورده.',
    },
  ],
}

// Outbound internal links. Rendered by BOTH the React page and the static
// shell (prerender-routes.mjs), because a landing whose only crawlable link
// is a CTA button is a dead end for a crawler. hrefs are LOGICAL, unprefixed;
// each renderer adds /fa itself.
export const links = {
  heading: 'ادامه مسیر',
  items: [
    { href: '/project', label: 'جستجوی ۴۷۵ ملک موجود در عمان با قیمت زنده' },
    { href: '/buy-property-in-muscat', label: 'خرید ملک در مسقط' },
    { href: '/property-prices-in-oman', label: 'شاخص قیمت ملک عمان، متری و به تفکیک منطقه' },
    { href: '/oman-golden-visa', label: 'ویزای طلایی و ویزای مالک ملک عمان' },
    { href: '/insights/oman-vs-dubai-property-2026', label: 'عمان یا دبی برای خرید ملک: مقایسه قیمت، هزینه و اقامت' },
    { href: '/insights/kharid-melk-dar-oman-2026', label: 'راهنمای گام به گام خرید ملک در عمان' },
    { href: '/insights/cheap-property-for-sale-oman-muscat-2026', label: 'خرید خانه ارزان در عمان' },
  ],
}

// Breadcrumb: home → properties portal → this page.
export const breadcrumb = [
  { name: 'خانه', href: '/' },
  { name: 'املاک', href: '/project' },
  { name: 'ایرانیان مقیم امارات', href: '/oman-property-for-iranians-in-uae' },
]

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

const SITE = 'https://www.irfaninvest.com'

export function breadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: `${SITE}/fa${b.href === '/' ? '' : b.href}`,
    })),
  }
}
