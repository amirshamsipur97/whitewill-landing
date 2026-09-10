// buySeoContent.mjs — crawlable SEO copy for the /buy listing page, shared
// between the React page (src/pages/BuyPage.jsx) and the build-time route
// prerenderer (prerender-routes.mjs). Plain data module: no JSX.
//
// Targets: "buy property in oman" (en) / «خرید ملک در عمان» (fa) plus the
// ar/ru equivalents already used in seoRoutes.mjs titles. Facts must stay
// consistent with live inventory: Jebel Sifah apartments from OMR 63,500,
// Hawana Salalah chalets from OMR 98,000, Hay Al Wafa 2BHK from OMR 92,088.

export const BUY_SEO = {
  en: {
    heading: 'Buy Property in Oman: Freehold Homes for Foreign Investors',
    paras: [
      'Foreigners of all nationalities can buy property in Oman with full freehold ownership inside government approved Integrated Tourism Complexes (ITC) such as Al Mouj and Muscat Bay in Muscat, Hawana Salalah on the Dhofar coast and Jebel Sifah near the capital. Every listing on this page comes straight from developer inventory with live prices: apartments at Jebel Sifah start from about OMR 63,500, beachfront chalets in Hawana Salalah from OMR 98,000 and furnished two bedroom apartments in Sultan Haitham City from OMR 92,088.',
      'Buying property in Oman can also qualify you for an investor residency permit that stays renewable while you own the home, with a long term Golden Residency tier at higher investment levels. There is no annual property tax and no tax on rental income. Irfan Investment Group manages the whole purchase for you, from reservation and the sale and purchase agreement to Ministry of Housing registration and handover, in English, Arabic, Russian and Persian.',
    ],
    faq: [
      {
        q: 'Can foreigners buy property in Oman?',
        a: 'Yes. Foreigners can buy freehold property in Oman inside Integrated Tourism Complexes (ITC) such as Al Mouj, Muscat Bay, Jebel Sifah and Hawana Salalah. Outside ITC zones, foreign buyers can hold long usufruct rights of up to 99 years instead of freehold title.',
      },
      {
        q: 'How much does it cost to buy property in Oman?',
        a: 'Entry prices in 2026: apartments at Jebel Sifah from about OMR 63,500, one bedroom chalets at Hawana Salalah from OMR 98,000, furnished two bedroom apartments in Sultan Haitham City from OMR 92,088, and resale apartments in Muscat ITC districts typically between OMR 60,000 and 150,000.',
      },
      {
        q: 'Does buying property in Oman give you residency?',
        a: 'Yes. An ITC property purchase entitles the owner to an Oman investor residency permit that remains renewable while you hold the property, and higher investment levels qualify for the 10 year Golden Residency. Ask our consultants for the current thresholds.',
      },
      {
        q: 'Which are the best areas to buy property in Oman?',
        a: 'Muscat offers Al Mouj, Muscat Bay and Muscat Hills for city and marina living; Jebel Sifah is the most affordable resort entry point; Hawana Salalah delivers the strongest holiday rental season thanks to khareef; and Sultan Haitham City is the new smart city district with furnished apartments.',
      },
    ],
    linksHeading: 'Helpful guides',
    links: [
      { href: '/property-prices-in-oman', label: 'Oman property price index: what a square metre costs by area' },
      { href: '/insights/buy-property-oman-foreigners-itc-rules-2026', label: 'Buying property in Oman as a foreigner: ITC rules and costs' },
      { href: '/insights/buy-apartment-in-oman-2026', label: 'Buy an apartment in Oman: 2026 price map' },
      { href: '/buy/hawana-salalah', label: 'Villas and chalets for sale in Hawana Salalah' },
      { href: '/buy/jebel-sifah', label: 'Apartments for sale in Jebel Sifah' },
      { href: '/buy-property-in-muscat', label: 'Buy property in Muscat' },
      { href: '/buy-apartment-in-muscat', label: 'Buy an apartment in Muscat' },
    ],
  },

  fa: {
    heading: 'خرید ملک در عمان: مالکیت آزاد برای ایرانیان و خارجی‌ها',
    paras: [
      'خرید ملک در عمان برای همه ملیت‌ها، از جمله ایرانیان، در مجتمع‌های گردشگری یکپارچه (ITC) مانند الموج و خلیج مسقط در پایتخت، هوانا صلاله در ساحل ظفار و جبل سیفه در نزدیکی مسقط با سند مالکیت آزاد (فری‌هولد) ممکن است. همه واحدهای این صفحه مستقیم از اینونتوری سازنده و با قیمت به‌روز هستند: آپارتمان در جبل سیفه از حدود ۶۳٬۵۰۰ ریال عمان، شاله ساحلی در هوانا صلاله از ۹۸٬۰۰۰ ریال و آپارتمان دوخوابه مبله در شهر سلطان هیثم از ۹۲٬۰۸۸ ریال عمان.',
      'خرید ملک در عمان می‌تواند اقامت سرمایه‌گذاری هم برای شما بیاورد؛ اقامتی که تا زمان مالکیت قابل تمدید است و در سطوح بالاتر سرمایه‌گذاری به اقامت طلایی بلندمدت می‌رسد. در عمان نه مالیات سالانه ملک وجود دارد و نه مالیات بر درآمد اجاره. گروه سرمایه‌گذاری ایرفان کل مسیر خرید، از رزرو و قرارداد تا ثبت در وزارت مسکن و تحویل، را به فارسی برای شما انجام می‌دهد.',
    ],
    faq: [
      {
        q: 'آیا ایرانیان می‌توانند در عمان ملک بخرند؟',
        a: 'بله. ایرانیان مانند سایر ملیت‌ها می‌توانند در مجتمع‌های ITC مانند الموج، خلیج مسقط، جبل سیفه و هوانا صلاله ملک با سند مالکیت آزاد بخرند. خارج از مناطق ITC، مالکیت به شکل حق انتفاع تا ۹۹ سال است.',
      },
      {
        q: 'قیمت خرید ملک در عمان چقدر است؟',
        a: 'قیمت‌های شروع در ۲۰۲۶: آپارتمان در جبل سیفه از حدود ۶۳٬۵۰۰ ریال عمان، شاله یک‌خوابه در هوانا صلاله از ۹۸٬۰۰۰ ریال، آپارتمان دوخوابه مبله در شهر سلطان هیثم از ۹۲٬۰۸۸ ریال و آپارتمان‌های بازفروش در مناطق ITC مسقط معمولاً بین ۶۰ تا ۱۵۰ هزار ریال عمان.',
      },
      {
        q: 'آیا خرید ملک در عمان اقامت می‌دهد؟',
        a: 'بله. خرید ملک در مناطق ITC اقامت سرمایه‌گذاری عمان را به همراه دارد که تا زمان مالکیت قابل تمدید است و سطوح بالاتر سرمایه‌گذاری مشمول اقامت طلایی ۱۰ ساله می‌شوند. برای آستانه‌های به‌روز با مشاوران ما صحبت کنید.',
      },
      {
        q: 'بهترین مناطق برای خرید ملک در عمان کدام‌اند؟',
        a: 'در مسقط: الموج، خلیج مسقط و مسقط هیلز برای زندگی شهری و مارینا. جبل سیفه اقتصادی‌ترین نقطه ورود است، هوانا صلاله به لطف فصل خریف بهترین درآمد اجاره تعطیلاتی را دارد و شهر سلطان هیثم شهر هوشمند جدید با آپارتمان‌های مبله است.',
      },
    ],
    linksHeading: 'راهنماهای مرتبط',
    links: [
      { href: '/property-prices-in-oman', label: 'شاخص قیمت ملک عمان: قیمت هر متر مربع در هر منطقه' },
      { href: '/insights/kharid-melk-dar-oman-2026', label: 'راهنمای گام به گام خرید ملک در عمان برای ایرانیان' },
      { href: '/buy/hawana-salalah', label: 'خرید ویلا و شاله ساحلی در هوانا صلاله' },
      { href: '/buy/jebel-sifah', label: 'خرید آپارتمان در جبل سیفه' },
      { href: '/buy-property-in-muscat', label: 'خرید ملک در مسقط' },
      { href: '/buy-apartment-in-muscat', label: 'خرید آپارتمان در مسقط' },
      { href: '/insights', label: 'همه مقالات سرمایه‌گذاری در عمان' },
    ],
  },

  ar: {
    heading: 'شراء عقار في عُمان: تملّك حر للمستثمرين الأجانب',
    paras: [
      'يمكن للأجانب من جميع الجنسيات شراء عقار في عُمان بتملّك حر كامل داخل المجمعات السياحية المتكاملة (ITC) مثل الموج وخليج مسقط في العاصمة، وهوانا صلالة على ساحل ظفار، وجبل سيفة قرب مسقط. جميع الوحدات في هذه الصفحة من مخزون المطورين مباشرة وبأسعار محدثة: شقق جبل سيفة من نحو 63,500 ر.ع، وشاليهات هوانا صلالة الشاطئية من 98,000 ر.ع، وشقق مفروشة بغرفتي نوم في مدينة السلطان هيثم من 92,088 ر.ع.',
      'شراء عقار في عُمان قد يؤهلك أيضاً لإقامة مستثمر قابلة للتجديد طوال فترة التملك، مع فئة الإقامة الذهبية طويلة الأمد عند مستويات استثمار أعلى. لا توجد ضريبة سنوية على العقار ولا ضريبة على دخل الإيجار. تتولى مجموعة عرفان للاستثمار رحلة الشراء كاملة، من الحجز والعقد حتى التسجيل في وزارة الإسكان والتسليم.',
    ],
    faq: [
      {
        q: 'هل يستطيع الأجانب شراء عقار في عُمان؟',
        a: 'نعم. يمكن للأجانب التملّك الحر داخل المجمعات السياحية المتكاملة مثل الموج وخليج مسقط وجبل سيفة وهوانا صلالة. خارج مناطق ITC يتاح حق الانتفاع حتى 99 عاماً بدلاً من التملك الحر.',
      },
      {
        q: 'كم تكلفة شراء عقار في عُمان؟',
        a: 'أسعار الدخول في 2026: شقة في جبل سيفة من نحو 63,500 ر.ع، شاليه بغرفة نوم في هوانا صلالة من 98,000 ر.ع، شقة مفروشة بغرفتي نوم في مدينة السلطان هيثم من 92,088 ر.ع، وشقق إعادة البيع في مناطق ITC بمسقط عادة بين 60,000 و150,000 ر.ع.',
      },
      {
        q: 'هل يمنح شراء العقار في عُمان الإقامة؟',
        a: 'نعم. شراء عقار في ITC يمنح المالك إقامة مستثمر قابلة للتجديد طوال فترة التملك، وتؤهل مستويات الاستثمار الأعلى للإقامة الذهبية لعشر سنوات. اسأل مستشارينا عن الحدود المحدثة.',
      },
      {
        q: 'ما أفضل المناطق لشراء عقار في عُمان؟',
        a: 'في مسقط: الموج وخليج مسقط ومسقط هيلز للحياة المدينية والمارينا. جبل سيفة أرخص نقطة دخول للمنتجعات، وهوانا صلالة الأقوى في دخل الإيجار الموسمي بفضل الخريف، ومدينة السلطان هيثم هي المدينة الذكية الجديدة بشقق مفروشة.',
      },
    ],
    linksHeading: 'أدلة مفيدة',
    links: [
      { href: '/property-prices-in-oman', label: 'مؤشر أسعار العقارات في عُمان: تكلفة المتر المربع حسب المنطقة' },
      { href: '/insights/buy-property-oman-foreigners-itc-rules-2026', label: 'شراء عقار في عُمان للأجانب: قواعد ITC والتكاليف' },
      { href: '/buy/hawana-salalah', label: 'فلل وشاليهات للبيع في هوانا صلالة' },
      { href: '/buy/jebel-sifah', label: 'شقق للبيع في جبل سيفة' },
      { href: '/buy-property-in-muscat', label: 'شراء عقار في مسقط' },
      { href: '/buy-apartment-in-muscat', label: 'شراء شقة في مسقط' },
      { href: '/insights', label: 'جميع مقالات الاستثمار في عُمان' },
    ],
  },

  ru: {
    heading: 'Купить недвижимость в Омане: фрихолд для иностранных инвесторов',
    paras: [
      'Иностранцы любых национальностей могут купить недвижимость в Омане в полную собственность (фрихолд) внутри интегрированных туристических комплексов (ITC): Al Mouj и Muscat Bay в Маскате, Hawana Salalah на побережье Дофара и Jebel Sifah рядом со столицей. Все лоты на этой странице идут напрямую из инвентаря застройщиков с актуальными ценами: квартиры в Jebel Sifah от примерно 63 500 OMR, пляжные шале в Hawana Salalah от 98 000 OMR, меблированные квартиры с 2 спальнями в Sultan Haitham City от 92 088 OMR.',
      'Покупка недвижимости в Омане также даёт право на инвесторскую резиденцию, продлеваемую всё время владения, а при более высоких уровнях инвестиций доступна долгосрочная золотая резиденция. Ежегодного налога на недвижимость и налога на арендный доход нет. Irfan Investment Group сопровождает сделку целиком: бронирование, договор, регистрация в министерстве жилья и передача ключей, на русском языке.',
    ],
    faq: [
      {
        q: 'Могут ли иностранцы купить недвижимость в Омане?',
        a: 'Да. Иностранцам доступен фрихолд внутри комплексов ITC: Al Mouj, Muscat Bay, Jebel Sifah, Hawana Salalah. Вне зон ITC возможен узуфрукт до 99 лет вместо полной собственности.',
      },
      {
        q: 'Сколько стоит недвижимость в Омане?',
        a: 'Входные цены 2026 года: квартиры в Jebel Sifah от ~63 500 OMR, шале с 1 спальней в Hawana Salalah от 98 000 OMR, меблированные квартиры с 2 спальнями в Sultan Haitham City от 92 088 OMR, вторичные квартиры в ITC-районах Маската обычно 60 000–150 000 OMR.',
      },
      {
        q: 'Даёт ли покупка недвижимости в Омане резиденцию?',
        a: 'Да. Покупка в ITC даёт инвесторскую резиденцию, продлеваемую всё время владения; более высокие уровни инвестиций дают право на золотую резиденцию на 10 лет. Актуальные пороги уточняйте у наших консультантов.',
      },
      {
        q: 'Где лучше покупать недвижимость в Омане?',
        a: 'В Маскате: Al Mouj, Muscat Bay и Muscat Hills для городской жизни у марины. Jebel Sifah, самый доступный курортный вход, Hawana Salalah, сильнейший арендный сезон благодаря харифу, Sultan Haitham City, новый умный город с меблированными квартирами.',
      },
    ],
    linksHeading: 'Полезные гиды',
    links: [
      { href: '/property-prices-in-oman', label: 'Индекс цен на недвижимость Омана: сколько стоит квадратный метр по районам' },
      { href: '/insights/buy-property-oman-foreigners-itc-rules-2026', label: 'Покупка недвижимости в Омане для иностранцев: правила ITC' },
      { href: '/buy/hawana-salalah', label: 'Виллы и шале на продажу в Hawana Salalah' },
      { href: '/buy/jebel-sifah', label: 'Квартиры на продажу в Jebel Sifah' },
      { href: '/buy-property-in-muscat', label: 'Купить недвижимость в Маскате' },
      { href: '/buy-apartment-in-muscat', label: 'Купить квартиру в Маскате' },
      { href: '/insights', label: 'Все статьи об инвестициях в Оман' },
    ],
  },
}

// FAQPage JSON-LD for a language block. Shared so the SPA and the
// prerendered static page emit identical structured data.
export function buyFaqJsonLd(lang) {
  const c = BUY_SEO[lang] || BUY_SEO.en
  // ⚠️ Must stay the SAME set the page renders visibly (BUY_SEO.faq plus
  // BUY_FAQ_EXTRA, which buySeoHtml concatenates in that order). FAQ markup
  // describing answers a visitor cannot see on the page is a rich-result
  // violation, so if you add a question to one, add it to the other.
  const extra = BUY_FAQ_EXTRA[lang] || BUY_FAQ_EXTRA.en
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [...c.faq, ...extra].map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Inventory tables for /buy, added 2026-09-10.
//
// WHY: the owner reported /buy sitting on page 4 for "buy property in oman".
// Reading the live SERP for that query, page one is Bayut, Savills,
// Realtor.com, Dubizzle, omanreal.com and JamesEdition, and what the portals
// put in their snippets is SCALE: "Muscat (2,251)", "over 3500 properties",
// price ranges by region. Google is serving an inventory intent, and /buy was
// answering it with 12 project cards and roughly 350 crawlable words.
//
// We cannot out-list Bayut on volume. We can state our own numbers precisely,
// which the two GUIDES that also rank (DarGlobal, Uinvest) never do, and which
// the portals only state loosely. So the labels below drive tables built at
// BUILD TIME from live inventory in prerender-routes.mjs, never hardcoded, for
// the same reason the price index is computed rather than stored: a number
// typed into copy is wrong the first time a unit sells.
//
// 🔑 Do not paste counts into `paras`. Add them here as labels and let
// buyInventoryTables() fill them, or they will go stale silently.
export const BUY_TABLES = {
  en: {
    areaHeading: 'Where you can buy property in Oman, and what is available now',
    areaIntro: 'Every figure below is live developer inventory, counted at the last site build. Prices are the lowest currently available in each area.',
    areaCols: ['Area', 'Units available', 'From (OMR)', 'Developments'],
    typeHeading: 'What kind of property you can buy',
    typeCols: ['Property type', 'Units available', 'Price range (OMR)'],
    bandHeading: 'By budget',
    bandCols: ['Budget (OMR)', 'Units available'],
    bands: ['Under 100,000', '100,000 to 250,000', '250,000 and above'],
    totalNote: '{units} freehold units across {projects} developments, from OMR {entry}. All of it open to buyers of any nationality.',
  },
  fa: {
    areaHeading: 'کجا می‌توانید در عمان ملک بخرید و الان چه چیزی موجود است',
    areaIntro: 'هر عددی که در جدول زیر می‌بینید از موجودی زنده سازنده است و در آخرین بیلد سایت شمرده شده. قیمت‌ها پایین‌ترین قیمت موجود در هر منطقه است.',
    areaCols: ['منطقه', 'واحد موجود', 'شروع قیمت (ریال)', 'پروژه‌ها'],
    typeHeading: 'چه نوع ملکی می‌توانید بخرید',
    typeCols: ['نوع ملک', 'واحد موجود', 'بازه قیمت (ریال)'],
    bandHeading: 'بر اساس بودجه',
    bandCols: ['بودجه (ریال)', 'واحد موجود'],
    bands: ['زیر ۱۰۰٬۰۰۰', '۱۰۰٬۰۰۰ تا ۲۵۰٬۰۰۰', '۲۵۰٬۰۰۰ و بالاتر'],
    totalNote: '{units} واحد فری‌هولد در {projects} پروژه، از {entry} ریال عمان. همه برای خریداران با هر ملیتی باز است.',
  },
  ar: {
    areaHeading: 'أين يمكنك شراء عقار في عُمان، وما المتاح الآن',
    areaIntro: 'كل رقم في الجدول أدناه من مخزون المطور الحي، محسوب عند آخر بناء للموقع. الأسعار هي الأدنى المتاحة حالياً في كل منطقة.',
    areaCols: ['المنطقة', 'الوحدات المتاحة', 'يبدأ من (ريال)', 'المشاريع'],
    typeHeading: 'ما نوع العقار الذي يمكنك شراؤه',
    typeCols: ['نوع العقار', 'الوحدات المتاحة', 'نطاق السعر (ريال)'],
    bandHeading: 'حسب الميزانية',
    bandCols: ['الميزانية (ريال)', 'الوحدات المتاحة'],
    bands: ['أقل من 100,000', '100,000 إلى 250,000', '250,000 فأكثر'],
    totalNote: '{units} وحدة تملك حر في {projects} مشروعاً، تبدأ من {entry} ريال عماني. جميعها متاحة لمشترين من أي جنسية.',
  },
  ru: {
    areaHeading: 'Где можно купить недвижимость в Омане и что есть сейчас',
    areaIntro: 'Каждая цифра в таблице ниже взята из живого инвентаря застройщиков и посчитана при последней сборке сайта. Цены это минимум, доступный сейчас в каждом районе.',
    areaCols: ['Район', 'Доступно лотов', 'От (риал)', 'Проекты'],
    typeHeading: 'Какую недвижимость можно купить',
    typeCols: ['Тип недвижимости', 'Доступно лотов', 'Диапазон цен (риал)'],
    bandHeading: 'По бюджету',
    bandCols: ['Бюджет (риал)', 'Доступно лотов'],
    bands: ['до 100 000', '100 000 - 250 000', 'от 250 000'],
    totalNote: '{units} фригольд-объектов в {projects} проектах, от {entry} оманских риалов. Всё доступно покупателям любого гражданства.',
  },
}

// Area codes as they appear in `projects.location`, mapped to the name a buyer
// would actually search. Unmapped values fall through unchanged.
// ⚠️ Keyed by BOTH forms. buyInventoryTables groups on `project.areas.name`
// when the join supplies it and falls back to `projects.location`, so the same
// place arrives as either "Al Mouj (The Wave)" or "Almouj". Mapping only the
// short codes left five of six rows in English on the ar/fa/ru tables.
export const BUY_AREA_LABELS = {
  en: { SHC: 'Sultan Haitham City', Almouj: 'Al Mouj Muscat', Yiti: 'Yiti', Sifah: 'Jebel Sifah',
        'Bandar Jissah, Muscat Bay': 'Muscat Bay', Salalah: 'Salalah',
        'Sultan Haitham City': 'Sultan Haitham City', 'Al Mouj (The Wave)': 'Al Mouj Muscat',
        'Jebel Sifah': 'Jebel Sifah', 'Muscat Bay': 'Muscat Bay', 'Hawana Salalah': 'Hawana Salalah' },
  fa: { SHC: 'سلطان هیثم سیتی', Almouj: 'الموج مسقط', Yiti: 'ییتی', Sifah: 'جبل سیفه',
        'Bandar Jissah, Muscat Bay': 'مسقط بی', Salalah: 'صلاله',
        'Sultan Haitham City': 'سلطان هیثم سیتی', 'Al Mouj (The Wave)': 'الموج مسقط',
        'Jebel Sifah': 'جبل سیفه', 'Muscat Bay': 'مسقط بی', 'Hawana Salalah': 'هوانا صلاله' },
  ar: { SHC: 'مدينة السلطان هيثم', Almouj: 'الموج مسقط', Yiti: 'ييتي', Sifah: 'جبل سيفة',
        'Bandar Jissah, Muscat Bay': 'خليج مسقط', Salalah: 'صلالة',
        'Sultan Haitham City': 'مدينة السلطان هيثم', 'Al Mouj (The Wave)': 'الموج مسقط',
        'Jebel Sifah': 'جبل سيفة', 'Muscat Bay': 'خليج مسقط', 'Hawana Salalah': 'حوانا صلالة' },
  ru: { SHC: 'Sultan Haitham City', Almouj: 'Al Mouj Muscat', Yiti: 'Йити', Sifah: 'Jebel Sifah',
        'Bandar Jissah, Muscat Bay': 'Muscat Bay', Salalah: 'Салала',
        'Sultan Haitham City': 'Sultan Haitham City', 'Al Mouj (The Wave)': 'Al Mouj Muscat',
        'Jebel Sifah': 'Jebel Sifah', 'Muscat Bay': 'Muscat Bay', 'Hawana Salalah': 'Хавана Салала' },
}

// Raw `unit_type` values collapse into the buckets a buyer thinks in. The raw
// column has 16 distinct values including "Apartment 1BHK" and "Sky Residence",
// which are apartments to everyone except the developer's spreadsheet.
export const BUY_TYPE_LABELS = {
  en: { apartment: 'Apartments', villa: 'Villas', townhouse: 'Townhouses', penthouse: 'Penthouses',
        duplex: 'Duplexes', farm: 'Farm houses', chalet: 'Chalets' },
  fa: { apartment: 'آپارتمان', villa: 'ویلا', townhouse: 'تاون‌هاوس', penthouse: 'پنت‌هاوس',
        duplex: 'دوبلکس', farm: 'خانه مزرعه', chalet: 'شالیه ساحلی' },
  ar: { apartment: 'شقق', villa: 'فلل', townhouse: 'تاون هاوس', penthouse: 'بنتهاوس',
        duplex: 'دوبلكس', farm: 'بيوت مزارع', chalet: 'شاليهات' },
  ru: { apartment: 'Квартиры', villa: 'Виллы', townhouse: 'Таунхаусы', penthouse: 'Пентхаусы',
        duplex: 'Дуплексы', farm: 'Дома с участком', chalet: 'Шале' },
}

// Extra FAQ entries, added 2026-09-10 straight from the "People also ask" box
// on the live SERP for "buy property in oman". Google was showing exactly which
// questions it wants answered on this query and two of them had no answer
// anywhere on the page. The other two PAA questions ("Can foreigners buy
// property in Oman?" and the cost one) were already in BUY_SEO.faq.
export const BUY_FAQ_EXTRA = {
  en: [
    { q: 'Is it worth buying property in Oman?',
      a: 'It depends on what you want the property to do. Oman gives full freehold title to any nationality inside an ITC, charges no annual property tax and no capital gains tax on individuals, and entry sits well below comparable waterfront in Dubai or Abu Dhabi. The trade is a smaller resale market, so liquidity is lower and a sale can take months. It suits a buyer with a medium to long horizon, and suits a short-term flipper poorly.' },
    { q: 'Can a foreigner live in Oman after buying property?',
      a: 'Yes. A purchase inside an Integrated Tourism Complex entitles the owner and immediate family to a renewable residency that stays valid while you own the home, with no Omani sponsor required. Higher investment levels qualify for the longer Golden Residency tiers.' },
  ],
  fa: [
    { q: 'آیا خرید ملک در عمان ارزشش را دارد؟',
      a: 'بستگی دارد که می‌خواهید ملک چه کاری برایتان بکند. عمان به هر ملیتی داخل ITC سند فری‌هولد کامل می‌دهد، مالیات سالانه ملک و مالیات بر عایدی سرمایه برای اشخاص حقیقی ندارد، و قیمت ورود بسیار پایین‌تر از ملک ساحلی مشابه در دبی یا ابوظبی است. در مقابل بازار فروش مجدد کوچک‌تر است، پس نقدشوندگی کمتر است و فروش ممکن است چند ماه طول بکشد. برای افق میان‌مدت و بلندمدت مناسب است و برای خرید و فروش کوتاه‌مدت مناسب نیست.' },
    { q: 'آیا خارجی بعد از خرید ملک می‌تواند در عمان زندگی کند؟',
      a: 'بله. خرید داخل مجتمع گردشگری یکپارچه به مالک و خانواده درجه یک اقامت قابل تمدید می‌دهد که تا زمانی که مالک ملک هستید معتبر می‌ماند و به اسپانسر عمانی نیاز ندارد. سطوح بالاتر سرمایه‌گذاری واجد شرایط اقامت طلایی بلندمدت‌تر می‌شوند.' },
  ],
  ar: [
    { q: 'هل يستحق شراء عقار في عُمان؟',
      a: 'يعتمد على ما تريده من العقار. تمنح عُمان تملكاً حراً كاملاً لأي جنسية داخل المجمعات السياحية المتكاملة، ولا تفرض ضريبة عقارية سنوية ولا ضريبة أرباح رأسمالية على الأفراد، وسعر الدخول أقل بكثير من عقار ساحلي مماثل في دبي أو أبوظبي. في المقابل سوق إعادة البيع أصغر، فالسيولة أقل وقد يستغرق البيع عدة أشهر. يناسب المشتري ذا الأفق المتوسط والطويل، ولا يناسب المضارب قصير الأجل.' },
    { q: 'هل يمكن للأجنبي العيش في عُمان بعد شراء عقار؟',
      a: 'نعم. الشراء داخل مجمع سياحي متكامل يمنح المالك وأسرته المباشرة إقامة قابلة للتجديد تبقى سارية ما دمت تملك العقار، دون الحاجة إلى كفيل عماني. ومستويات الاستثمار الأعلى تؤهل لفئات الإقامة الذهبية الأطول.' },
  ],
  ru: [
    { q: 'Стоит ли покупать недвижимость в Омане?',
      a: 'Зависит от того, какую задачу должна решать недвижимость. Оман даёт полный фригольд любому гражданству внутри ITC, не берёт ежегодный налог на недвижимость и налог на прирост капитала с физлиц, а вход заметно дешевле сопоставимой первой линии в Дубае или Абу-Даби. Взамен рынок перепродажи меньше, ликвидность ниже и продажа может занять месяцы. Подходит покупателю со средним и длинным горизонтом и плохо подходит для быстрой перепродажи.' },
    { q: 'Может ли иностранец жить в Омане после покупки недвижимости?',
      a: 'Да. Покупка внутри интегрированного туристического комплекса даёт владельцу и ближайшей семье продлеваемую резиденцию, которая действует, пока вы владеете жильём, и оманский спонсор не нужен. Более высокие суммы инвестиций открывают длинные уровни золотой резиденции.' },
  ],
}
