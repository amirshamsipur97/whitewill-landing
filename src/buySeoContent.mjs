// buySeoContent.mjs — crawlable SEO copy for the /buy listing page, shared
// between the React page (src/pages/BuyPage.jsx) and the build-time route
// prerenderer (prerender-routes.mjs). Plain data module: no JSX.
//
// Targets: "buy property in oman" (en) / «خرید ملک در عمان» (fa) plus the
// ar/ru equivalents already used in seoRoutes.mjs titles. Facts must stay
// consistent with live inventory: Jebel Sifah studios from OMR 35,625,
// Hawana Salalah chalets from OMR 98,000, Hay Al Wafa 2BHK from OMR 92,088.

export const BUY_SEO = {
  en: {
    heading: 'Buy Property in Oman: Freehold Homes for Foreign Investors',
    paras: [
      'Foreigners of all nationalities can buy property in Oman with full freehold ownership inside government approved Integrated Tourism Complexes (ITC) such as Al Mouj and Muscat Bay in Muscat, Hawana Salalah on the Dhofar coast and Jebel Sifah near the capital. Every listing on this page comes straight from developer inventory with live prices: studios at Jebel Sifah start from about OMR 35,625, beachfront chalets in Hawana Salalah from OMR 98,000 and furnished two bedroom apartments in Sultan Haitham City from OMR 92,088.',
      'Buying property in Oman can also qualify you for an investor residency permit that stays renewable while you own the home, with a long term Golden Residency tier at higher investment levels. There is no annual property tax and no tax on rental income. Irfan Investment Group manages the whole purchase for you, from reservation and the sale and purchase agreement to Ministry of Housing registration and handover, in English, Arabic, Russian and Persian.',
    ],
    faq: [
      {
        q: 'Can foreigners buy property in Oman?',
        a: 'Yes. Foreigners can buy freehold property in Oman inside Integrated Tourism Complexes (ITC) such as Al Mouj, Muscat Bay, Jebel Sifah and Hawana Salalah. Outside ITC zones, foreign buyers can hold long usufruct rights of up to 99 years instead of freehold title.',
      },
      {
        q: 'How much does it cost to buy property in Oman?',
        a: 'Entry prices in 2026: studios at Jebel Sifah from about OMR 35,625, one bedroom chalets at Hawana Salalah from OMR 98,000, furnished two bedroom apartments in Sultan Haitham City from OMR 92,088, and resale apartments in Muscat ITC districts typically between OMR 60,000 and 150,000.',
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
      'خرید ملک در عمان برای همه ملیت‌ها، از جمله ایرانیان، در مجتمع‌های گردشگری یکپارچه (ITC) مانند الموج و خلیج مسقط در پایتخت، هوانا صلاله در ساحل ظفار و جبل سیفه در نزدیکی مسقط با سند مالکیت آزاد (فری‌هولد) ممکن است. همه واحدهای این صفحه مستقیم از اینونتوری سازنده و با قیمت به‌روز هستند: استودیو در جبل سیفه از حدود ۳۵٬۶۲۵ ریال عمان، شاله ساحلی در هوانا صلاله از ۹۸٬۰۰۰ ریال و آپارتمان دوخوابه مبله در شهر سلطان هیثم از ۹۲٬۰۸۸ ریال عمان.',
      'خرید ملک در عمان می‌تواند اقامت سرمایه‌گذاری هم برای شما بیاورد؛ اقامتی که تا زمان مالکیت قابل تمدید است و در سطوح بالاتر سرمایه‌گذاری به اقامت طلایی بلندمدت می‌رسد. در عمان نه مالیات سالانه ملک وجود دارد و نه مالیات بر درآمد اجاره. گروه سرمایه‌گذاری ایرفان کل مسیر خرید، از رزرو و قرارداد تا ثبت در وزارت مسکن و تحویل، را به فارسی برای شما انجام می‌دهد.',
    ],
    faq: [
      {
        q: 'آیا ایرانیان می‌توانند در عمان ملک بخرند؟',
        a: 'بله. ایرانیان مانند سایر ملیت‌ها می‌توانند در مجتمع‌های ITC مانند الموج، خلیج مسقط، جبل سیفه و هوانا صلاله ملک با سند مالکیت آزاد بخرند. خارج از مناطق ITC، مالکیت به شکل حق انتفاع تا ۹۹ سال است.',
      },
      {
        q: 'قیمت خرید ملک در عمان چقدر است؟',
        a: 'قیمت‌های شروع در ۲۰۲۶: استودیو در جبل سیفه از حدود ۳۵٬۶۲۵ ریال عمان، شاله یک‌خوابه در هوانا صلاله از ۹۸٬۰۰۰ ریال، آپارتمان دوخوابه مبله در شهر سلطان هیثم از ۹۲٬۰۸۸ ریال و آپارتمان‌های بازفروش در مناطق ITC مسقط معمولاً بین ۶۰ تا ۱۵۰ هزار ریال عمان.',
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
      'يمكن للأجانب من جميع الجنسيات شراء عقار في عُمان بتملّك حر كامل داخل المجمعات السياحية المتكاملة (ITC) مثل الموج وخليج مسقط في العاصمة، وهوانا صلالة على ساحل ظفار، وجبل سيفة قرب مسقط. جميع الوحدات في هذه الصفحة من مخزون المطورين مباشرة وبأسعار محدثة: استوديوهات جبل سيفة من نحو 35,625 ر.ع، وشاليهات هوانا صلالة الشاطئية من 98,000 ر.ع، وشقق مفروشة بغرفتي نوم في مدينة السلطان هيثم من 92,088 ر.ع.',
      'شراء عقار في عُمان قد يؤهلك أيضاً لإقامة مستثمر قابلة للتجديد طوال فترة التملك، مع فئة الإقامة الذهبية طويلة الأمد عند مستويات استثمار أعلى. لا توجد ضريبة سنوية على العقار ولا ضريبة على دخل الإيجار. تتولى مجموعة عرفان للاستثمار رحلة الشراء كاملة، من الحجز والعقد حتى التسجيل في وزارة الإسكان والتسليم.',
    ],
    faq: [
      {
        q: 'هل يستطيع الأجانب شراء عقار في عُمان؟',
        a: 'نعم. يمكن للأجانب التملّك الحر داخل المجمعات السياحية المتكاملة مثل الموج وخليج مسقط وجبل سيفة وهوانا صلالة. خارج مناطق ITC يتاح حق الانتفاع حتى 99 عاماً بدلاً من التملك الحر.',
      },
      {
        q: 'كم تكلفة شراء عقار في عُمان؟',
        a: 'أسعار الدخول في 2026: استوديو في جبل سيفة من نحو 35,625 ر.ع، شاليه بغرفة نوم في هوانا صلالة من 98,000 ر.ع، شقة مفروشة بغرفتي نوم في مدينة السلطان هيثم من 92,088 ر.ع، وشقق إعادة البيع في مناطق ITC بمسقط عادة بين 60,000 و150,000 ر.ع.',
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
      'Иностранцы любых национальностей могут купить недвижимость в Омане в полную собственность (фрихолд) внутри интегрированных туристических комплексов (ITC): Al Mouj и Muscat Bay в Маскате, Hawana Salalah на побережье Дофара и Jebel Sifah рядом со столицей. Все лоты на этой странице идут напрямую из инвентаря застройщиков с актуальными ценами: студии в Jebel Sifah от примерно 35 625 OMR, пляжные шале в Hawana Salalah от 98 000 OMR, меблированные квартиры с 2 спальнями в Sultan Haitham City от 92 088 OMR.',
      'Покупка недвижимости в Омане также даёт право на инвесторскую резиденцию, продлеваемую всё время владения, а при более высоких уровнях инвестиций доступна долгосрочная золотая резиденция. Ежегодного налога на недвижимость и налога на арендный доход нет. Irfan Investment Group сопровождает сделку целиком: бронирование, договор, регистрация в министерстве жилья и передача ключей, на русском языке.',
    ],
    faq: [
      {
        q: 'Могут ли иностранцы купить недвижимость в Омане?',
        a: 'Да. Иностранцам доступен фрихолд внутри комплексов ITC: Al Mouj, Muscat Bay, Jebel Sifah, Hawana Salalah. Вне зон ITC возможен узуфрукт до 99 лет вместо полной собственности.',
      },
      {
        q: 'Сколько стоит недвижимость в Омане?',
        a: 'Входные цены 2026 года: студии в Jebel Sifah от ~35 625 OMR, шале с 1 спальней в Hawana Salalah от 98 000 OMR, меблированные квартиры с 2 спальнями в Sultan Haitham City от 92 088 OMR, вторичные квартиры в ITC-районах Маската обычно 60 000–150 000 OMR.',
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
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
