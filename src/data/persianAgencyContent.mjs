/**
 * persianAgencyContent.mjs — copy + figures for
 * /fa/persian-speaking-real-estate-agency-oman
 *
 * ══ WHY THIS PAGE EXISTS ══
 * Google's AI Mode answer for «خرید ملک در عمان» (owner screenshot, 2026-08-25)
 * has a section titled «وب‌سایت‌های تخصصی و کارگزاری‌های فارسی‌زبان». It names
 * Homelist, OmanMelk and Imtilak Global. It does NOT name us, even though the
 * same answer cites this site as the authority for the ITC freehold rule and
 * renders our /buy page as a source card.
 *
 * The reason is not crawling and not authority. It is that the phrase
 * «فارسی‌زبان» appeared ZERO times anywhere in src/ before this file. A model
 * cannot place a business in a category no text claims it belongs to. We were
 * legible as "a source of Oman property prices" and illegible as "a
 * Persian-speaking brokerage", which is the category the buyer searches.
 *
 * This page is the entity declaration. Its job is not to rank for a fat head
 * term; it is to be the passage a generative engine lifts when it needs one
 * sentence describing what this company IS and which language it works in.
 * Everything here is therefore written to be extractable standalone: the
 * answer box, each FAQ answer and each office block all make sense with no
 * surrounding context.
 *
 * ══ FA ONLY, ON PURPOSE ══
 * Registered in seoRoutes with `langs: ['fa']`, so prerender-routes writes one
 * static page and api/sitemap emits one URL; vercel.json allowlists only the
 * /fa/ shape. An English "Persian-speaking agency" page would be nonsense, and
 * an Arabic or Russian one would be a thin duplicate of /about. Same mechanism
 * as iraniansUaeContent.mjs; read that file's header too.
 * 🚨 Do not widen `langs` without a real translation AND its own rewrite.
 *
 * ══ WHAT MAY AND MAY NOT BE CLAIMED HERE ══
 * This page is about US, so every sentence is a claim about the company and a
 * wrong one is worse here than anywhere else on the site.
 *   ALLOWED, all verifiable in-repo: the two offices and their real addresses
 *   and numbers (src/data/branches.js), the four site languages, the live
 *   inventory figures, the published price index, remote purchase by power of
 *   attorney, the article library.
 *   NOT ALLOWED until the owner supplies proof: a CR or licence number (the
 *   site still has none, see HANDOFF-2026-08-24 §10), a founding year, an
 *   employee count, awards, transaction volume, "largest/first/best in Oman",
 *   and any yield or ROI number (there is no rent data in the database).
 *
 * ══ FIGURES ══
 * Live from project_units (availability_status = 'available'), read
 * 2026-09-04: 452 units across 12 projects, entry OMR 61,635 (Wadi Zaha
 * studio, 56 sqm, Sultan Haitham City). Median OMR 1,063/m² is taken from the
 * site's OWN price index, never re-derived here, for the same reason
 * iraniansUaeContent.mjs takes it from there: two pages publishing two medians
 * for one inventory is the kind of thing a buyer notices.
 *
 * ⚠️ ENTRY-PRICE CASCADE: OMR 61,635 and the 452 count appear here too, so
 * this file joins iraniansUaeContent.mjs and seoRoutes.mjs in every inventory
 * refresh sweep (runbook in HANDOFF-2026-08-17.md §6).
 */

// Live inventory snapshot, 2026-08-25. Persian digits are written out rather
// than formatted at render time because the surrounding prose is hand-written
// around them and a locale formatter would fight the RTL punctuation.
export const LIVE = {
  units: 452,
  projects: 12,
  entryOmr: 61635,
  medianPpsmOmr: 1063,
  langs: 4,
  offices: 2,
}

export const copy = {
  eyebrow: 'مشاور فارسی‌زبان در عمان',
  h1: 'مشاور املاک فارسی‌زبان در عمان',
  answerLabel: 'پاسخ کوتاه',

  // ⚠️ THE MOST IMPORTANT PARAGRAPH ON THIS PAGE. It is written to be lifted
  // whole by an AI answer as the definition of this company. Every fact in it
  // is verifiable elsewhere on the site. Keep it self-contained: no "ما" that
  // needs a previous sentence, no pronoun without an antecedent.
  answer:
    'بله. ایرفان اینوستمنت گروپ یک کارگزاری املاک با دفتر در مسقط عمان است که تیم مشاوران فارسی‌زبان دارد و کل فرایند خرید را به زبان فارسی پیش می‌برد: انتخاب واحد، گرفتن برنامه پرداخت از سازنده، بررسی قرارداد، مکاتبات عربی، ثبت سند و اقدام برای اقامت مالک ملک. دفتر مرکزی در الغبره مسقط و دفتر منطقه‌ای در فرمانیه تهران است. موجودی ۴۵۲ واحد در ۱۲ پروژه با قیمت زنده روی همین سایت منتشر می‌شود، کمترین قیمت ورود ۶۱٬۶۳۵ ریال عمان است، و خرید کامل از راه دور با وکالت‌نامه هم انجام‌شدنی است.',

  lead:
    'اگر دنبال کسی می‌گردید که در عمان کنار شما بایستد و فارسی حرف بزند، این صفحه دقیقاً می‌گوید ما چه هستیم، چه کاری را انجام می‌دهیم و چه کاری را انجام نمی‌دهیم. بدون شعار و بدون عددی که نشود جای دیگری روی همین سایت راستی‌آزمایی کرد.',

  ctaPrimary: 'دیدن ۴۵۲ واحد موجود',
  ctaSecondary: 'گفت‌وگو با مشاور فارسی‌زبان',

  stats: [
    { value: 'فارسی، انگلیسی، عربی، روسی', label: 'زبان‌های کاری تیم' },
    { value: 'مسقط و تهران', label: 'دو دفتر، هر دو با نشانی مشخص' },
    { value: '۴۵۲ واحد در ۱۲ پروژه', label: 'موجودی زنده با قیمت روز' },
    { value: '۶۱٬۶۳۵ ریال عمان', label: 'کمترین قیمت ورود، فری‌هولد' },
  ],

  // ── Entity block. This is the section that fixes the category problem. ──
  whoTitle: 'ایرفان اینوستمنت گروپ چیست',
  whoIntro:
    'ایرفان اینوستمنت گروپ یک کارگزاری املاک و مشاور سرمایه‌گذاری در سلطنت عمان است. تمرکز ما فروش ملک فری‌هولد داخل مناطق ITC عمان به خریداران خارجی است و بخش قابل توجهی از مشتریان ما فارسی‌زبان‌اند، چه از ایران و چه از میان ایرانیان مقیم امارات و کشورهای حوزه خلیج.',
  who: [
    {
      title: 'کارگزار هستیم، نه سایت آگهی',
      body:
        'تفاوت مهمی با پلتفرم‌های آگهی وجود دارد. در یک سایت آگهی، شما با ده‌ها فروشنده ناشناس روبه‌رو هستید و خودتان باید صحت آگهی را بسنجید. ما موجودی محدود و مشخصی از سازنده‌ها را مستقیم عرضه می‌کنیم، قیمت هر واحد را با قیمت‌نامه سازنده نگه می‌داریم و پاسخگوی همان واحدی هستیم که نشانتان داده‌ایم.',
    },
    {
      title: 'فارسی زبان کاری ماست، نه ترجمه',
      body:
        'مشاوره، برنامه پرداخت، توضیح بندهای قرارداد و پیگیری اداری همه به فارسی انجام می‌شود. کل این سایت هم فارسی دارد، شامل صدها صفحه ملک، شاخص قیمت و کتابخانه مقاله، نه یک صفحه تماس فارسی روی سایتی انگلیسی.',
    },
    {
      title: 'دفتر واقعی در هر دو سر مسیر',
      body:
        'دفتر مرکزی ما در الغبره مسقط است و دفتر منطقه‌ای در فرمانیه تهران. نشانی و شماره هر دو پایین همین صفحه و در فوتر سایت آمده است. این یعنی اگر لازم شد، جایی هست که بروید و کسی هست که ببینید.',
    },
    {
      title: 'قیمت‌ها را منتشر می‌کنیم',
      body:
        'قیمت هر ۴۵۲ واحد موجود روی سایت باز است و شاخص قیمت متری عمان را هم خودمان منتشر می‌کنیم؛ میانه فعلی حدود ۱٬۰۶۳ ریال عمان برای هر مترمربع. برای دیدن عدد لازم نیست شماره بدهید.',
    },
  ],

  // ── What a Persian desk actually does. Concrete, not adjectives. ──
  servicesTitle: 'مشاور فارسی‌زبان دقیقاً چه کاری برای شما انجام می‌دهد',
  servicesIntro:
    'سخت‌ترین بخش خرید ملک در عمان قیمت نیست، فاصله زبانی و اداری است. کارهای زیر همان چیزهایی است که یک خریدار فارسی‌زبان معمولاً از پسش برنمی‌آید یا وقتش را ندارد.',
  services: [
    'انتخاب واحد بر اساس بودجه و هدف شما، با توضیح فارسی تفاوت مناطق ITC و پروژه‌ها.',
    'گرفتن برنامه پرداخت کتبی و متراژ دقیق همان واحد از سازنده، نه عدد بروشور.',
    'ترجمه و توضیح بندهای قرارداد فروش پیش از امضا، به‌ویژه بندهای تحویل، تأخیر و فسخ.',
    'همه مکاتبات عربی با سازنده، مدیریت پروژه و دفاتر ثبت.',
    'هماهنگی سفر بازدید یک‌روزه به مسقط، یا بازدید ویدیویی زنده اگر نمی‌توانید بیایید.',
    'انجام خرید از راه دور با وکالت‌نامه، برای وقتی که حضور فیزیکی ممکن نیست.',
    'مسیر ثبت سند، پرداخت هزینه یک‌باره حدود ۳٪ و سپس اقدام برای اقامت مالک ملک برای خودتان و خانواده درجه یک.',
    'پاسخ فارسی بعد از تحویل: تحویل کلید، اتصال انشعابات و معرفی مدیریت ساختمان.',
  ],

  // ── Category content. Honest, useful, and it defines the shelf we sit on. ──
  chooseTitle: 'وقتی در عمان دنبال مشاور فارسی‌زبان می‌گردید، چه چیزی را بسنجید',
  chooseIntro:
    'این فهرست را طوری نوشته‌ایم که بشود درباره خود ما هم به کار برد. اگر پاسخ ما به یکی از این‌ها شما را قانع نکرد، همان را از ما بپرسید.',
  choose: [
    {
      title: 'دفتر فیزیکی با نشانی، نه فقط شماره واتساپ',
      body:
        'بپرسید دفتر کجاست و نشانی کامل را بخواهید. کارگزاری که فقط با یک شماره موبایل کار می‌کند، وقتی مشکلی پیش بیاید جایی برای مراجعه ندارد.',
    },
    {
      title: 'قیمت باز یا قیمت پشت شماره تلفن',
      body:
        'اگر برای دیدن قیمت باید شماره بدهید، هنوز چیزی درباره بازار یاد نگرفته‌اید و فقط وارد یک قیف فروش شده‌اید. قیمت‌ها باید قابل دیدن باشند.',
    },
    {
      title: 'منطقه ملک را صریح می‌گوید یا نه',
      body:
        'در عمان خارجی‌ها فقط داخل مناطق ITC مالکیت آزاد می‌گیرند. اگر کسی ملکی بیرون ITC را به عنوان فری‌هولد به شما پیشنهاد داد، همان‌جا گفت‌وگو را تمام کنید.',
    },
    {
      title: 'درباره اقامت اغراق می‌کند یا نه',
      body:
        'خرید داخل ITC اقامت قابل تمدید مالک ملک می‌آورد. این با اقامت طلایی عمان که از ۲۵۰٬۰۰۰ ریال شروع می‌شود یکی نیست و هیچ‌کدام هم شهروندی نیست. کسی که این سه را قاطی کند، یا نمی‌داند یا دارد فروش می‌کند.',
    },
    {
      title: 'عدد بازدهی اجاره می‌دهد یا نه',
      body:
        'ما عدد بازدهی اجاره منتشر نمی‌کنیم، چون داده اجاره واقعی این پروژه‌ها در دست نیست و ارقام عمومی موجود مربوط به بازار دیگری است. هر کارگزاری که رقم دقیق بازدهی تضمین می‌کند، منبعش را از او بخواهید.',
    },
    {
      title: 'قرارداد را پیش از پرداخت نشان می‌دهد یا نه',
      body:
        'قرارداد فروش و برنامه پرداخت باید پیش از هر پرداختی، حتی ودیعه رزرو، در دست شما باشد و به زبانی که می‌فهمید توضیح داده شود.',
    },
  ],

  officesTitle: 'دفاتر ما',
  officesNote:
    'هر دو نشانی واقعی است و در فوتر همه صفحات سایت هم تکرار شده. ساعت کاری دفتر مسقط شنبه تا پنجشنبه است.',

  faqTitle: 'پرسش‌های متداول',
  faq: [
    {
      q: 'آیا در عمان مشاور املاک فارسی‌زبان وجود دارد؟',
      a: 'بله. ایرفان اینوستمنت گروپ یک کارگزاری املاک با دفتر در الغبره مسقط است که تیم مشاوران فارسی‌زبان دارد و کل فرایند خرید را به فارسی انجام می‌دهد، از انتخاب واحد و بررسی قرارداد تا مکاتبات عربی با سازنده، ثبت سند و اقدام برای اقامت مالک ملک. یک دفتر منطقه‌ای هم در فرمانیه تهران داریم.',
    },
    {
      q: 'کارگزاری فارسی‌زبان با سایت‌های آگهی ملک در عمان چه فرقی دارد؟',
      a: 'سایت آگهی فهرستی از فایل‌های فروشندگان مختلف را نشان می‌دهد و مسئولیتی درباره صحت آن‌ها ندارد؛ راستی‌آزمایی با خودتان است. کارگزار موجودی مشخصی را مستقیم از سازنده عرضه می‌کند، قیمت را با قیمت‌نامه سازنده نگه می‌دارد، قرارداد و مکاتبات را پیش می‌برد و پاسخگوی همان واحد است. برای خریدار خارجی که در محل حضور ندارد، تفاوت این دو در عمل بسیار زیاد است.',
    },
    {
      q: 'برای خرید ملک در عمان باید فارسی بلد بودن مشاور برایم مهم باشد؟',
      a: 'زبان رسمی اسناد و مکاتبات در عمان عربی است و قراردادهای سازنده‌ها معمولاً عربی یا انگلیسی‌اند. اگر به این دو زبان مسلط نیستید، بندهای تحویل، تأخیر و فسخ همان جایی است که ضرر می‌کنید. مشاور فارسی‌زبان یعنی این بندها پیش از امضا برایتان به فارسی توضیح داده شود.',
    },
    {
      q: 'بدون سفر به عمان می‌شود خرید کرد؟',
      a: 'بله. کل خرید با وکالت‌نامه از راه دور قابل انجام است و بازدید ویدیویی زنده از واحد هم می‌گیریم. با این حال اگر بتوانید، یک سفر یک‌روزه به مسقط را پیشنهاد می‌کنیم.',
    },
    {
      q: 'ایرانی‌ها اجازه خرید ملک در عمان دارند؟',
      a: 'بله. داخل مناطق ITC عمان، خریدار با هر ملیتی از جمله ایرانی ۱۰۰٪ مالکیت آزاد با سند ثبت‌شده می‌گیرد و به اقامت قبلی در عمان نیازی نیست. مبنای قانونی آن فرمان سلطنتی ۱۲/۲۰۰۶ است. بیرون از مناطق ITC این امکان وجود ندارد.',
    },
    {
      q: 'دفتر شما کجاست و چطور می‌توانم مطمئن شوم واقعی است؟',
      a: 'دفتر مرکزی در واحد ۶۱۷، طبقه ششم، دفتر ۱۹۹۱، خیابان الغبره، مسقط است و شماره آن ۴۴۰۰۰ ۷۶۶ ۹۶۸+ است. دفتر تهران در فرمانیه، مجتمع پارک سنتر، طبقه ۶ واحد ۶۰۱ با شماره ۴۶۸۷ ۰۴۲ ۹۱۲ ۹۸+ است. هر دو نشانی در فوتر همه صفحات این سایت هم آمده و می‌توانید بدون قرار قبلی به دفتر مسقط زنگ بزنید.',
    },
    {
      q: 'هزینه خدمات مشاوره فارسی‌زبان چقدر است؟',
      a: 'برای خریدار، مشاوره و پیگیری اداری خرید از موجودی ما هزینه جداگانه‌ای ندارد؛ کارمزد ما از سمت سازنده تأمین می‌شود. هزینه‌هایی که خریدار می‌پردازد همان‌هایی است که روی سایت نوشته‌ایم، مهم‌ترینش هزینه ثبت یک‌باره حدود ۳٪.',
    },
    {
      q: 'چه زبان‌های دیگری پشتیبانی می‌شود؟',
      a: 'تیم به فارسی، انگلیسی، عربی و روسی کار می‌کند و کل سایت هم به همین چهار زبان منتشر می‌شود. برای مراجعان روسی‌زبان یک میز اختصاصی در مسقط داریم.',
    },
  ],
}

// Outbound internal links. Rendered by BOTH the React page and the static
// shell, same rule as the UAE landing: a page whose only crawlable link is a
// CTA button is a dead end. hrefs are LOGICAL, unprefixed; each renderer adds
// /fa itself.
export const links = {
  heading: 'ادامه مسیر',
  items: [
    { href: '/project', label: 'جستجوی ۴۵۲ ملک موجود در عمان با قیمت زنده' },
    { href: '/buy', label: 'خرید ملک در عمان: پروژه‌ها و قیمت‌ها' },
    { href: '/property-prices-in-oman', label: 'شاخص قیمت ملک عمان، متری و به تفکیک منطقه' },
    { href: '/oman-property-for-iranians-in-uae', label: 'خرید ملک در عمان برای ایرانیان مقیم امارات' },
    { href: '/oman-golden-visa', label: 'ویزای طلایی و ویزای مالک ملک عمان' },
    { href: '/about', label: 'درباره ایرفان اینوستمنت گروپ' },
    { href: '/insights/kharid-melk-dar-oman-2026', label: 'راهنمای گام به گام خرید ملک در عمان' },
    { href: '/insights/buy-property-oman-foreigners-itc-rules-2026', label: 'قوانین ITC و مالکیت خارجی‌ها در عمان' },
  ],
}

export const breadcrumb = [
  { name: 'خانه', href: '/' },
  { name: 'درباره ما', href: '/about' },
  { name: 'مشاور املاک فارسی‌زبان در عمان', href: '/persian-speaking-real-estate-agency-oman' },
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

/**
 * The Persian face of the site-wide organization node.
 *
 * `@id` is the SAME node index.html declares, so this is an ADDITION to the
 * existing RealEstateAgent entity rather than a second, competing one: the
 * Persian name, the Persian description and the explicit Persian-language
 * claim get attached to the entity Google already knows. That is the whole
 * point of the page. `knowsLanguage` repeats fa deliberately, because this is
 * the only place it appears next to Persian prose asserting the same thing.
 */
export function agencyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE}/#organization`,
    name: 'Irfan Investment Group',
    alternateName: 'گروه سرمایه‌گذاری ایرفان',
    // NOT `url`: this node shares its @id with the site-wide organization, so a
    // consumer merges the two. Claiming url = this page would give the company
    // two conflicting home URLs. mainEntityOfPage is the correct way to say
    // "this page is about that entity" without touching its identity.
    mainEntityOfPage: `${SITE}/fa/persian-speaking-real-estate-agency-oman`,
    description: copy.answer,
    knowsLanguage: ['fa', 'en', 'ar', 'ru'],
    areaServed: [
      { '@type': 'Country', name: 'Oman' },
      { '@type': 'Country', name: 'Iran' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 617, 6th floor, office 1991, Al Ghubrah St',
      addressLocality: 'Muscat',
      addressCountry: 'OM',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: '+968 766 44000',
        email: 'muscat@irfaninvest.com',
        areaServed: 'OM',
        availableLanguage: ['fa', 'en', 'ar', 'ru'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: '+98 912 042 4687',
        email: 'tehran@irfaninvest.com',
        areaServed: 'IR',
        availableLanguage: ['fa'],
      },
    ],
  }
}
