// seoRoutes.mjs — localized per-route <head> metadata, shared between the
// SPA SeoManager (src/seo.jsx) and the build-time route prerenderer
// (prerender-routes.mjs). Plain data module: no JSX, importable from node.

export const ROUTES = {
  '/': {
    title: {
      en: 'Buy Property in Oman & Invest | Irfan Investment Group',
      ru: 'Irfan Investment Group: купить недвижимость в Омане',
      ar: 'Irfan Investment Group: شراء العقارات والاستثمار في عُمان',
      fa: 'خرید ملک در عمان و سرمایه‌گذاری | گروه سرمایه‌گذاری ایرفان',
    },
    desc: {
      en: 'Premium real estate brokerage in Oman. Buy apartments, villas and off-plan property in Muscat with freehold ownership and Oman residency for foreign investors.',
      ru: 'Премиальное агентство недвижимости в Омане. Купите квартиру, виллу или строящийся объект в Маскате: полное право собственности и резидентство Омана для иностранных инвесторов.',
      ar: 'وساطة عقارية فاخرة في سلطنة عُمان. اشترِ شققاً وفللاً وعقارات على الخريطة في مسقط بتملك حر وإقامة عُمان للمستثمرين الأجانب.',
      fa: 'مشاور املاک لوکس در عمان. خرید آپارتمان، ویلا و پروژه‌های پیش‌فروش در مسقط با سند مالکیت آزاد و اقامت عمان برای سرمایه‌گذاران خارجی.',
    },
  },
  '/buy': {
    title: {
      en: 'Buy Property in Oman 2026: Apartments & Villas from OMR 54,600 | Irfan',
      ru: 'Купить недвижимость в Омане: квартиры и виллы | Irfan Investment',
      ar: 'شراء عقار في عُمان: شقق وفلل للبيع | Irfan Investment',
      fa: 'خرید ملک در عمان ۲۰۲۶ | لیست آپارتمان و ویلا با قیمت | ایرفان',
    },
    desc: {
      en: 'Browse freehold apartments, villas and chalets for sale in Muscat, Salalah and Jebel Sifah. Live prices from OMR 54,600, full unit inventory and Oman investor residency with your purchase.',
      ru: 'Подборка недвижимости на продажу в Омане: квартиры, виллы и элитные резиденции в Маскате и Салале от ведущих застройщиков, с правом собственности для иностранцев.',
      ar: 'تصفح عقارات مختارة للبيع في عُمان: شقق وفلل ومساكن فاخرة في مسقط وصلالة من كبار المطورين، بتملك حر للأجانب.',
      fa: 'مجموعه‌ای منتخب از املاک برای فروش در عمان: آپارتمان، ویلا و اقامتگاه‌های لوکس در مسقط و صلاله از معتبرترین سازندگان، با مالکیت آزاد برای خارجی‌ها.',
    },
  },
  '/project': {
    title: {
      en: 'Properties for Sale in Oman: Search Apartments & Villas | Irfan',
      ru: 'Недвижимость на продажу в Омане: поиск квартир и вилл | Irfan',
      ar: 'عقارات للبيع في عُمان: ابحث عن شقق وفلل | Irfan Investment',
      fa: 'جستجوی ملک در عمان: آپارتمان و ویلا برای فروش | ایرفان',
    },
    desc: {
      en: 'Search 400+ freehold apartments, villas and studios for sale across Muscat, Al Mouj, Muscat Bay, Jebel Sifah, Yiti and Salalah. Filter by type, bedrooms and price. Live developer prices from OMR 54,600 with Oman investor residency.',
      ru: 'Поиск более 400 объектов недвижимости на продажу в Омане: квартиры, виллы и студии в Маскате, Аль-Мудж, Джебель-Сифа и Салале. Фильтры по типу, спальням и цене. Актуальные цены от 54 600 OMR.',
      ar: 'ابحث في أكثر من 400 عقار تملّك حر للبيع في عُمان: شقق وفلل واستوديوهات في مسقط والموج وجبل سيفة وصلالة. فلترة حسب النوع والغرف والسعر. أسعار مباشرة من 54,600 ر.ع مع إقامة المستثمر.',
      fa: 'جستجو در بیش از ۴۰۰ ملک فری‌هولد برای فروش در عمان: آپارتمان، ویلا و استودیو در مسقط، الموج، جبل سیفه و صلاله. فیلتر بر اساس نوع، خواب و قیمت. قیمت زنده از ۵۴٬۶۰۰ ریال عمان با اقامت سرمایه‌گذار.',
    },
  },
  // ── head-term city/type landing pages ──────────────────────────────────
  // The 316 unit pages cover the long tail ("3-Bedroom Apartment for Sale in
  // Muscat — OMR …"); these own the head terms. Body copy + FAQ live in
  // src/cityLandingContent.mjs. Keep volatile unit COUNTS out of the meta —
  // only the min price, which is stable.
  '/buy-property-in-muscat': {
    title: {
      en: 'Buy Property in Muscat: Freehold Apartments & Villas from OMR 54,600 | Irfan',
      ru: 'Купить недвижимость в Маскате: фрихолд от 54 600 OMR | Irfan',
      ar: 'شراء عقار في مسقط: تملّك حر من 54,600 ر.ع | Irfan Investment',
      fa: 'خرید ملک در مسقط: فری‌هولد از ۵۴٬۶۰۰ ریال عمان | ایرفان',
    },
    desc: {
      en: 'Buy freehold property in Muscat: apartments, villas and townhouses in Al Mouj, Muscat Bay, Muscat Hills, Sultan Haitham City, Jebel Sifah and Yiti. Open to all nationalities, from OMR 54,600, with Oman investor residency.',
      ru: 'Купить недвижимость в Маскате во фрихолд: квартиры, виллы и таунхаусы в Al Mouj, Muscat Bay, Muscat Hills, Sultan Haitham City, Jebel Sifah и Yiti. Для всех национальностей, от 54 600 OMR, с инвесторской резиденцией.',
      ar: 'شراء عقار بتملّك حر في مسقط: شقق وفلل وتاون هاوس في الموج وخليج مسقط ومسقط هيلز ومدينة السلطان هيثم وجبل سيفة وييتي. متاح لجميع الجنسيات من 54,600 ر.ع مع إقامة المستثمر.',
      fa: 'خرید ملک فری‌هولد در مسقط: آپارتمان، ویلا و تاون‌هاوس در الموج، خلیج مسقط، مسقط هیلز، شهر سلطان هیثم، جبل سیفه و ییتی. برای همه ملیت‌ها، از ۵۴٬۶۰۰ ریال عمان همراه با اقامت سرمایه‌گذاری.',
    },
  },
  '/buy-apartment-in-muscat': {
    title: {
      en: 'Buy an Apartment in Muscat: Freehold Apartments for Sale from OMR 54,600 | Irfan',
      ru: 'Купить квартиру в Маскате: фрихолд-квартиры от 54 600 OMR | Irfan',
      ar: 'شراء شقة في مسقط: شقق تملّك حر للبيع من 54,600 ر.ع | Irfan Investment',
      fa: 'خرید آپارتمان در مسقط: آپارتمان فری‌هولد از ۵۴٬۶۰۰ ریال عمان | ایرفان',
    },
    desc: {
      en: 'Freehold apartments for sale in Muscat: apartments from OMR 54,600 and one-bedroom homes from OMR 63,500 in Al Mouj, Muscat Bay, Sultan Haitham City, Jebel Sifah and Yiti. All nationalities, no tax on rental income, investor residency included.',
      ru: 'Квартиры во фрихолд на продажу в Маскате: квартиры от 54 600 OMR и дома с одной спальней от 63 500 OMR в Al Mouj, Muscat Bay, Sultan Haitham City, Jebel Sifah и Yiti. Для всех национальностей, без налога на доход от аренды, резиденция инвестора.',
      ar: 'شقق تملّك حر للبيع في مسقط: شقق من 54,600 ر.ع ومساكن بغرفة نوم من 63,500 ر.ع في الموج وخليج مسقط ومدينة السلطان هيثم وجبل سيفة وييتي. لجميع الجنسيات، بدون ضريبة على دخل الإيجار، مع إقامة المستثمر.',
      fa: 'آپارتمان فری‌هولد برای فروش در مسقط: آپارتمان از ۵۴٬۶۰۰ و واحد یک‌خوابه از ۶۳٬۵۰۰ ریال عمان در الموج، خلیج مسقط، شهر سلطان هیثم، جبل سیفه و ییتی. همه ملیت‌ها، بدون مالیات بر درآمد اجاره، همراه با اقامت سرمایه‌گذاری.',
    },
  },
  '/buy-property-in-salalah': {
    title: {
      en: 'Buy Property in Salalah: Freehold Beachfront Villas & Chalets from OMR 98,000 | Irfan',
      ru: 'Купить недвижимость в Салале: фрихолд у моря от 98 000 OMR | Irfan',
      ar: 'شراء عقار في صلالة: فلل وشاليهات شاطئية تملّك حر من 98,000 ر.ع | Irfan',
      fa: 'خرید ملک در صلاله: ویلا و شاله ساحلی فری‌هولد از ۹۸٬۰۰۰ ریال عمان | ایرفان',
    },
    desc: {
      en: 'Buy freehold property in Salalah, Oman: beachfront villas and chalets in Hawana Salalah from OMR 98,000. Open to all nationalities, strong khareef season rental demand, no tax on rental income, Oman investor residency included.',
      ru: 'Купить недвижимость в Салале во фрихолд: пляжные виллы и шале в Hawana Salalah от 98 000 OMR. Для всех национальностей, сильный арендный сезон хариф, без налога на аренду, с инвесторской резиденцией Омана.',
      ar: 'شراء عقار بتملّك حر في صلالة: فلل وشاليهات شاطئية في هوانا صلالة من 98,000 ر.ع. متاح لجميع الجنسيات، طلب إيجار قوي في موسم الخريف، بلا ضريبة على دخل الإيجار، مع إقامة المستثمر.',
      fa: 'خرید ملک فری‌هولد در صلاله عمان: ویلا و شاله ساحلی در هوانا صلاله از ۹۸٬۰۰۰ ریال عمان. برای همه ملیت‌ها، تقاضای قوی اجاره در فصل خریف، بدون مالیات بر درآمد اجاره، همراه با اقامت سرمایه‌گذاری.',
    },
  },
  // Data asset, not a listing page — the one page here worth LINKING to.
  // Oman publishes no official per-m² index, so this targets the "how much
  // does property cost in Oman / price per square meter" cluster that the
  // portals answer only with a listing grid. Copy + tables live in
  // src/priceIndexContent.mjs / src/priceIndexData.mjs. No figures in the
  // meta: they move with inventory.
  '/property-prices-in-oman': {
    title: {
      en: 'Oman Property Price Index: Price per m² by Area 2026 | Irfan',
      ru: 'Индекс цен на недвижимость Омана: цена за м² по районам 2026 | Irfan',
      ar: 'مؤشر أسعار العقارات في عُمان: سعر المتر حسب المنطقة 2026 | Irfan',
      fa: 'شاخص قیمت ملک در عمان: قیمت هر متر بر اساس منطقه ۲۰۲۶ | ایرفان',
    },
    desc: {
      en: 'How much property costs in Oman, area by area: median price per square metre for Al Mouj, Muscat Bay, Sultan Haitham City, Yiti, Jebel Sifah and Hawana Salalah, computed from live freehold inventory and updated continuously.',
      ru: 'Сколько стоит недвижимость в Омане по районам: медианная цена за квадратный метр в Al Mouj, Muscat Bay, Sultan Haitham City, Yiti, Jebel Sifah и Hawana Salalah. Расчёт по актуальному фрихолд-предложению.',
      ar: 'كم تكلّف العقارات في عُمان منطقة بمنطقة: وسيط سعر المتر المربع في الموج وخليج مسقط ومدينة السلطان هيثم وييتي وجبل سيفة وهوانا صلالة، محتسب من مخزون التملّك الحر المتاح ويُحدَّث باستمرار.',
      fa: 'قیمت ملک در عمان منطقه به منطقه: میانه قیمت هر مترمربع در الموج، خلیج مسقط، شهر سلطان هیثم، ییتی، جبل سیفه و هوانا صلاله، محاسبه‌شده از موجودی زنده فری‌هولد و به‌روزرسانی پیوسته.',
    },
  },
  '/maison-shirdel': {
    title: {
      en: 'Maison Shirdel: Luxury Residences in Oman | Irfan Investment',
      ru: 'Maison Shirdel: элитные резиденции в Омане | Irfan Investment',
      ar: 'ميزون شيردل: مساكن فاخرة في عُمان | Irfan Investment',
      fa: 'میزون شیردل: اقامتگاه‌های لوکس در عمان | Irfan Investment',
    },
    desc: {
      en: 'Discover Maison Shirdel, a collection of luxury residences for sale in Oman curated by Irfan Investment Group.',
      ru: 'Maison Shirdel, коллекция элитных резиденций на продажу в Омане от Irfan Investment Group.',
      ar: 'اكتشف ميزون شيردل، مجموعة مساكن فاخرة للبيع في عُمان من Irfan Investment Group.',
      fa: 'میزون شیردل، مجموعه‌ای از اقامتگاه‌های لوکس برای فروش در عمان از Irfan Investment Group.',
    },
  },
  // Residency intent. 260/mo in the Oman geo at LOW competition and +175% YoY
  // (GKP 2026-07-23), and until this page the site had nothing for it.
  '/oman-golden-visa': {
    title: {
      en: 'Oman Golden Visa 2026: Residency by Buying Property | Irfan',
      ru: 'Золотая виза Омана 2026: ВНЖ за покупку недвижимости | Irfan',
      ar: 'الإقامة الذهبية في عُمان 2026: الإقامة عبر شراء عقار | Irfan',
      fa: 'گلدن ویزای عمان ۲۰۲۶: اقامت با خرید ملک | Irfan',
    },
    desc: {
      en: 'How to get Oman residency by buying property: the OMR 250,000 five year and OMR 500,000 ten year thresholds, which freehold homes qualify today, ITC ownership rules for foreign buyers, and the step by step process.',
      ru: 'Как получить ВНЖ Омана за покупку недвижимости: пороги OMR 250 000 на пять лет и OMR 500 000 на десять, какие объекты подходят сегодня, правила фрихолда в зонах ITC и пошаговый процесс.',
      ar: 'كيف تحصل على الإقامة في عُمان عبر شراء عقار: حدّا 250,000 ر.ع لخمس سنوات و500,000 ر.ع لعشر سنوات، وأي الوحدات مؤهلة اليوم، وقواعد التملّك الحر في المجمعات السياحية، والخطوات كاملة.',
      fa: 'دریافت اقامت عمان با خرید ملک: آستانه ۲۵۰٬۰۰۰ ریالی پنج‌ساله و ۵۰۰٬۰۰۰ ریالی ده‌ساله، اینکه امروز کدام واحدها واجد شرایط‌اند، قوانین مالکیت فری‌هولد در مناطق ITC، و مراحل گام‌به‌گام.',
    },
  },
  '/invest': {
    title: {
      en: 'Company Registration & Investment in Oman | Irfan Investment Group',
      ru: 'Регистрация компании и инвестиции в Омане | Irfan Investment Group',
      ar: 'تسجيل الشركات والاستثمار في عُمان | Irfan Investment Group',
      fa: 'ثبت شرکت و سرمایه‌گذاری در عمان | Irfan Investment Group',
    },
    desc: {
      en: 'Company formation & business setup in Oman with up to 100% foreign ownership: LLC, SPC & joint-stock registration, Commercial Registration (CR), licensing, corporate banking, investor visas and tax. Updated 2026 framework.',
      ru: 'Регистрация компании в Омане со 100% иностранным владением: LLC, SPC, коммерческая регистрация (CR), лицензии, корпоративный банкинг, инвесторские визы и налоги.',
      ar: 'تأسيس الشركات في عُمان بملكية أجنبية تصل إلى 100%: تسجيل LLC وSPC والشركات المساهمة، والسجل التجاري، والتراخيص، والخدمات المصرفية للشركات، وتأشيرات المستثمرين.',
      fa: 'ثبت شرکت و راه‌اندازی کسب‌وکار در عمان با مالکیت خارجی تا ۱۰۰٪: ثبت LLC و SPC، ثبت تجاری (CR)، مجوزها، بانکداری شرکتی، ویزای سرمایه‌گذار و مالیات.',
    },
  },
  '/investment': {
    title: {
      en: 'Banking, Financing & Investment in Oman | Irfan Investment Group',
      ru: 'Банкинг, финансирование и инвестиции в Омане | Irfan Investment Group',
      ar: 'الخدمات المصرفية والتمويل والاستثمار في عُمان | Irfan Investment Group',
      fa: 'بانکداری، تامین مالی و سرمایه‌گذاری در عمان | Irfan Investment Group',
    },
    desc: {
      en: 'Corporate bank accounts, business loans and property financing, investment residency and investment advisory in Oman.',
      ru: 'Открытие корпоративных счетов, бизнес-кредиты и финансирование недвижимости, инвестиционное резидентство и консультации по инвестициям в Омане.',
      ar: 'فتح حسابات مصرفية للشركات، وقروض الأعمال وتمويل العقارات، والإقامة الاستثمارية والاستشارات الاستثمارية في عُمان.',
      fa: 'افتتاح حساب بانکی شرکتی، وام کسب‌وکار و خرید ملک، تامین مالی شرکت‌ها، اقامت سرمایه‌گذاری و مشاوره سرمایه‌گذاری در عمان.',
    },
  },
  '/investment/legal': {
    title: {
      en: 'Legal Requirements for Loans & Financing in Oman | Irfan Investment',
      ru: 'Юридические требования к кредитам и финансированию в Омане',
      ar: 'المتطلبات القانونية للقروض والتمويل في عُمان | Irfan Investment',
      fa: 'الزامات قانونی دریافت وام و تامین مالی در عمان | Irfan Investment',
    },
    desc: {
      en: 'Complete guide to legal, banking and compliance requirements for financing in Oman: Central Bank of Oman, KYC, AML, UBO, source of funds and documentation.',
      ru: 'Полный гид по юридическим, банковским и комплаенс-требованиям для финансирования в Омане: ЦБ Омана, KYC, AML, UBO, источник средств и документы.',
      ar: 'دليل كامل للمتطلبات القانونية والمصرفية والامتثال للتمويل في عُمان: البنك المركزي العُماني، KYC، AML، UBO، مصدر الأموال والمستندات.',
      fa: 'راهنمای کامل الزامات قانونی، بانکی و انطباقی دریافت تسهیلات در عمان: بانک مرکزی عمان، KYC، AML، UBO، منبع سرمایه و مدارک.',
    },
  },
  '/car-import': {
    title: {
      en: 'Car Import from Oman to Iran | Irfan Investment Group',
      ru: 'Импорт автомобилей из Омана в Иран | Irfan Investment Group',
      ar: 'استيراد السيارات من عُمان إلى إيران | Irfan Investment Group',
      fa: 'واردات خودرو از عمان به ایران | Irfan Investment Group',
    },
    desc: {
      en: 'Car import services from Oman to Iran: vehicle selection and purchase, customs clearance, shipping and transit, insurance and delivery.',
      ru: 'Услуги импорта автомобилей из Омана в Иран: подбор и покупка, таможенное оформление, доставка и транзит, страхование.',
      ar: 'خدمات استيراد السيارات من عُمان إلى إيران؛ اختيار وشراء السيارة، والتخليص الجمركي، والشحن والعبور، والتأمين والتسليم.',
      fa: 'خدمات واردات خودرو از عمان به ایران؛ انتخاب و خرید خودرو، ترخیص گمرکی، حمل و ترانزیت، بیمه و تحویل.',
    },
  },
  '/about': {
    title: {
      en: 'About Irfan Investment Group: Real Estate Advisory in Oman',
      ru: 'О компании Irfan Investment Group: недвижимость в Омане',
      ar: 'عن Irfan Investment Group: استشارات عقارية في عُمان',
      fa: 'درباره Irfan Investment Group: مشاور املاک در عمان',
    },
    desc: {
      en: 'Irfan Investment Group is a strategic investment division focused on business growth and international real estate opportunities in Oman.',
      ru: 'Irfan Investment Group, стратегическое инвестиционное подразделение, специализирующееся на росте бизнеса и международной недвижимости в Омане.',
      ar: 'Irfan Investment Group قسم استثماري استراتيجي يركز على نمو الأعمال وفرص العقارات الدولية في عُمان.',
      fa: 'Irfan Investment Group یک مجموعه سرمایه‌گذاری راهبردی متمرکز بر رشد کسب‌وکار و فرصت‌های املاک بین‌المللی در عمان است.',
    },
  },
  '/insights': {
    title: {
      en: 'Insights: Real Estate & Investment in Oman | Irfan Investment Group',
      ru: 'Инсайты: недвижимость и инвестиции в Омане | Irfan Investment',
      ar: 'مقالات: العقارات والاستثمار في عُمان | Irfan Investment Group',
      fa: 'مقالات: املاک و سرمایه‌گذاری در عمان | Irfan Investment Group',
    },
    desc: {
      en: 'Guides, market analysis and updates on real estate, investment, company formation and doing business in Oman.',
      ru: 'Гиды, анализ рынка и новости о недвижимости, инвестициях, регистрации компаний и ведении бизнеса в Омане.',
      ar: 'أدلة وتحليلات سوقية وتحديثات حول العقارات والاستثمار وتأسيس الشركات وممارسة الأعمال في عُمان.',
      fa: 'راهنماها، تحلیل بازار و به‌روزرسانی‌ها درباره املاک، سرمایه‌گذاری، ثبت شرکت و کسب‌وکار در عمان.',
    },
  },
  // Salalah flagship landing — hand-tuned meta targeting the Salalah keyword
  // cluster (salalah house, villa in salalah, hawana salalah property, buy
  // property in salalah). Must stay ahead of the generic /buy/:slug template.
  '/buy/hawana-salalah': {
    title: {
      en: 'Hawana Salalah: Villas & Houses for Sale in Salalah, Oman | Freehold',
      ru: 'Хавана Салала: виллы и дома на продажу в Салале, Оман | Фрихолд',
      ar: 'هوانا صلالة: فلل وشاليهات للبيع في صلالة | تملك حر وإقامة',
      fa: 'هوانا صلاله: ویلا و خانه برای فروش در صلاله عمان | مالکیت آزاد',
    },
    desc: {
      en: 'Buy property in Salalah: freehold waterfront chalets and villas at Hawana Salalah from OMR 98,000. Two rental seasons, Omani residency eligibility, 3-year payment plans. New Lubana Island release.',
      ru: 'Купите недвижимость в Салале: шале у воды и виллы во фрихолде в Hawana Salalah от 98 000 OMR. Два арендных сезона, право на резидентство Омана, рассрочка до 3 лет.',
      ar: 'اشترِ عقاراً في صلالة: شاليهات وفلل بتملك حر في هوانا صلالة من 98,000 ر.ع. موسمان إيجاريان، أهلية إقامة المستثمر، وخطط دفع 3 سنوات. إصدار جزيرة لوبانا الجديد.',
      fa: 'خرید ملک در صلاله: شاله‌های رو به آب و ویلا با مالکیت آزاد در هوانا صلاله از ۹۸٬۰۰۰ ریال عمانی. دو فصل اجاره در سال، واجد شرایط اقامت عمان و طرح پرداخت ۳ ساله.',
    },
  },
  // International Schools — localized per language (title/desc are objects).
  '/schools': {
    title: {
      en: 'International Schools in Oman | Complete Guide for Expat Families',
      ru: 'Международные школы в Омане | Полный гид для семей экспатов',
      ar: 'المدارس الدولية في عُمان | دليل كامل للعائلات الوافدة',
      fa: 'مدارس بین‌المللی عمان | راهنمای کامل برای خانواده‌های مهاجر',
    },
    desc: {
      en: 'International schools in Muscat and Oman: British, Cambridge, IB and American curricula, fees and admissions. Irfan Investment helps your family relocate, invest and settle in Oman.',
      ru: 'Международные школы Маската и Омана: британская, кембриджская, IB и американская программы, стоимость и поступление. Irfan Investment помогает вашей семье переехать, инвестировать и обустроиться.',
      ar: 'المدارس الدولية في مسقط وعُمان: المناهج البريطانية وكامبريدج والبكالوريا الدولية والأمريكية، والرسوم والقبول. تساعد Irfan Investment عائلتك على الانتقال والاستثمار والاستقرار.',
      fa: 'مدارس بین‌المللی مسقط و عمان؛ برنامه‌های بریتانیایی، کمبریج، IB و آمریکایی، شهریه و پذیرش. Irfan Investment به خانواده شما برای مهاجرت، سرمایه‌گذاری و اسکان کمک می‌کند.',
    },
  },
  '/privacy': {
    title: {
      en: 'Privacy Policy | Irfan Investment Group',
      ru: 'Политика конфиденциальности | Irfan Investment Group',
      ar: 'سياسة الخصوصية | Irfan Investment Group',
      fa: 'سیاست حریم خصوصی | Irfan Investment Group',
    },
    desc: {
      en: 'How Irfan Investment Group collects, uses and protects your personal data across www.irfaninvest.com, including analytics and advertising tools.',
      ru: 'Как Irfan Investment Group собирает, использует и защищает ваши персональные данные на www.irfaninvest.com.',
      ar: 'كيف تجمع Irfan Investment Group بياناتك الشخصية وتستخدمها وتحميها على www.irfaninvest.com.',
      fa: 'نحوه جمع‌آوری، استفاده و حفاظت از داده‌های شخصی شما در وب‌سایت Irfan Investment Group.',
    },
  },
}

// CTR-optimized meta for /buy/:slug project pages. `name` is the display name
// (title-cased slug client-side; the real projects.name at prerender time).
// Shared by SeoManager and prerender-routes.mjs so crawler and client agree.
export function projectMeta(name) {
  return {
    title: {
      en: `${name}: Prices, Available Units & Payment Plan | Buy in Oman`,
      ru: `${name}: цены, юниты и план оплаты | Недвижимость в Омане`,
      ar: `${name}: الأسعار والوحدات المتاحة وخطة السداد | عقارات عُمان`,
      fa: `${name}: قیمت، واحدهای موجود و شرایط پرداخت | املاک عمان`,
    },
    desc: {
      en: `${name} in Oman: current prices, available units, payment plans, photos and investor residency visa details. View the live inventory with Irfan Investment Group.`,
      ru: `${name} в Омане: актуальные цены, доступные юниты, планы оплаты, фото и резидентская виза инвестора. Смотрите живой каталог Irfan Investment Group.`,
      ar: `${name} في عُمان: الأسعار الحالية والوحدات المتاحة وخطط السداد والصور وتفاصيل تأشيرة إقامة المستثمر مع Irfan Investment Group.`,
      fa: `${name} در عمان: قیمت‌های به‌روز، واحدهای موجود، شرایط پرداخت، تصاویر و جزئیات ویزای اقامت سرمایه‌گذار همراه Irfan Investment Group.`,
    },
  }
}
