// cityLandingContent.mjs — head-term city/type landing pages.
//
// WHY: after the 2026-07-25 overhaul the site covers the LONG TAIL well (316
// indexable unit pages titled "3-Bedroom Apartment for Sale in Muscat — OMR
// …"), but nothing targets the HEAD terms as a page in its own right:
//   buy property in muscat · buy apartment in muscat · buy property in salalah
// That is exactly the page type Bayut / Dubizzle / Imtilak / Vista rank with.
// `/buy` already owns "buy property in oman", so these link UP to it rather
// than competing with it.
//
// Shared between src/pages/CityLandingPage.jsx (runtime) and
// prerender-routes.mjs (build time). Plain data module: no JSX.
//
// Inventory facts (verified against Supabase 2026-07-25 — keep in sync):
//   Muscat governorate = cities "Muscat" (193) + "Al Seeb" (196) = 389 units,
//     from OMR 35,625 (Jebel Sifah studio); apartments from OMR 48,125.
//     Areas: Al Mouj (The Wave), Muscat Bay, Muscat Hills, Shatti Al Qurum,
//     Yiti, Jebel Sifah, Sultan Haitham City.
//   Salalah (Dhofar) = 6 units (4 villas + 2 chalets) from OMR 98,000, all in
//     Hawana Salalah.
// Deliberately NO hard unit counts in the prose — counts move with inventory.
// The live count is rendered from the feed instead.

export const LANDINGS = {
  'buy-property-in-muscat': {
    // Matches project.areas.city — "Al Seeb" (Sultan Haitham City) is inside
    // Muscat Governorate, so both belong on a Muscat page.
    filter: { cities: ['Muscat', 'Al Seeb'] },
    areaLinks: [
      { area: 'Al Mouj (The Wave)', label: 'Al Mouj' },
      { area: 'Muscat Bay', label: 'Muscat Bay' },
      { area: 'Muscat Hills', label: 'Muscat Hills' },
      { area: 'Sultan Haitham City', label: 'Sultan Haitham City' },
      { area: 'Jebel Sifah', label: 'Jebel Sifah' },
      { area: 'Yiti', label: 'Yiti' },
    ],
    en: {
      h1: 'Buy Property in Muscat',
      lead: 'Freehold apartments, villas and townhouses for sale in Muscat, priced from live developer inventory and open to buyers of every nationality.',
      heading: 'Buying property in Muscat as a foreigner',
      paras: [
        'Muscat is where almost all of Oman\'s freehold stock sits. Foreign buyers of any nationality can take full freehold title inside the government approved Integrated Tourism Complexes that ring the capital: Al Mouj on the marina, Muscat Bay, Muscat Hills, Shatti Al Qurum on the beach, Yiti and Jebel Sifah down the coast, and the new Sultan Haitham City district in Al Seeb. Outside those zones foreign ownership is limited to usufruct rights of up to 99 years, which is why every listing on this page sits inside an ITC.',
        'Entry prices in Muscat currently start from about OMR 35,625 for a studio at Jebel Sifah and OMR 48,125 for an apartment in Sultan Haitham City, with marina and beachfront homes at Al Mouj and Muscat Bay running well into six figures. A purchase also qualifies you for an Oman investor residency permit that stays renewable for as long as you own the property, and Oman charges no annual property tax and no tax on rental income. Irfan Investment Group runs the whole transaction, from reservation and sale agreement to Ministry of Housing registration and handover.',
      ],
      areasHeading: 'Freehold communities in Muscat',
      faq: [
        {
          q: 'Can a foreigner buy property in Muscat?',
          a: 'Yes. Any nationality can buy freehold property in Muscat inside an Integrated Tourism Complex — Al Mouj, Muscat Bay, Muscat Hills, Shatti Al Qurum, Yiti, Jebel Sifah and Sultan Haitham City. The title is full ownership, registered at the Ministry of Housing, and it can be resold or inherited.',
        },
        {
          q: 'How much does it cost to buy property in Muscat?',
          a: 'Studios start from about OMR 35,625 at Jebel Sifah and apartments from about OMR 48,125 in Sultan Haitham City. Mid-market two bedroom apartments in the ITC districts typically sit between OMR 90,000 and 150,000, while marina and beachfront villas at Al Mouj, Muscat Bay and Muscat Hills run considerably higher.',
        },
        {
          q: 'Does buying property in Muscat give residency?',
          a: 'Yes. An ITC purchase entitles the owner to an Oman investor residency permit, renewable for as long as you hold the property, and higher investment levels qualify for the 10 year Golden Residency. The permit can normally cover a spouse and children.',
        },
        {
          q: 'Which area of Muscat is best to buy in?',
          a: 'Al Mouj offers marina living with a golf course and the deepest resale market. Muscat Bay and Muscat Hills are quieter and more exclusive. Sultan Haitham City is the new master-planned district with the lowest entry prices, and Jebel Sifah is the most affordable resort option on the coast.',
        },
      ],
      linksHeading: 'Related pages',
      links: [
        { href: '/buy-apartment-in-muscat', label: 'Buy an apartment in Muscat: prices by community' },
        { href: '/project', label: 'Search all properties for sale in Oman' },
        { href: '/buy', label: 'Buy property in Oman: full guide and price list' },
        { href: '/buy-property-in-salalah', label: 'Buy property in Salalah: villas and chalets' },
      ],
    },
    fa: {
      h1: 'خرید ملک در مسقط',
      lead: 'آپارتمان، ویلا و تاون‌هاوس فری‌هولد برای فروش در مسقط، با قیمت واقعی از اینونتوری سازنده و باز برای همه ملیت‌ها.',
      heading: 'خرید ملک در مسقط برای خارجی‌ها',
      paras: [
        'تقریباً همه موجودی فری‌هولد عمان در مسقط است. خریداران خارجی از هر ملیتی می‌توانند داخل مجتمع‌های گردشگری یکپارچه (ITC) مورد تأیید دولت سند کامل مالکیت بگیرند: الموج در مارینا، خلیج مسقط، مسقط هیلز، شاطئ القرم در ساحل، ییتی و جبل سیفه در امتداد ساحل، و شهر جدید سلطان هیثم در السیب. بیرون از این مناطق، مالکیت خارجی فقط به شکل حق انتفاع تا ۹۹ سال است؛ به همین دلیل همه واحدهای این صفحه داخل مناطق ITC هستند.',
        'قیمت‌های ورودی در مسقط از حدود ۳۵٬۶۲۵ ریال عمان برای استودیو در جبل سیفه و ۴۸٬۱۲۵ ریال برای آپارتمان در شهر سلطان هیثم شروع می‌شود، و خانه‌های ساحلی و مارینا در الموج و خلیج مسقط بسیار بالاتر می‌روند. خرید، اقامت سرمایه‌گذاری عمان را هم به همراه دارد که تا زمان مالکیت قابل تمدید است. عمان نه مالیات سالانه ملک دارد و نه مالیات بر درآمد اجاره. گروه سرمایه‌گذاری ایرفان کل معامله را از رزرو و قرارداد تا ثبت در وزارت مسکن و تحویل، به فارسی انجام می‌دهد.',
      ],
      areasHeading: 'مجموعه‌های فری‌هولد در مسقط',
      faq: [
        {
          q: 'آیا یک خارجی می‌تواند در مسقط ملک بخرد؟',
          a: 'بله. هر ملیتی می‌تواند در مسقط داخل مجتمع‌های ITC ملک با سند کامل بخرد: الموج، خلیج مسقط، مسقط هیلز، شاطئ القرم، ییتی، جبل سیفه و شهر سلطان هیثم. سند در وزارت مسکن ثبت می‌شود و قابل فروش مجدد و ارث است.',
        },
        {
          q: 'خرید ملک در مسقط چقدر هزینه دارد؟',
          a: 'استودیو از حدود ۳۵٬۶۲۵ ریال عمان در جبل سیفه و آپارتمان از حدود ۴۸٬۱۲۵ ریال در شهر سلطان هیثم شروع می‌شود. آپارتمان دوخوابه در مناطق ITC معمولاً بین ۹۰ تا ۱۵۰ هزار ریال است و ویلاهای ساحلی الموج و خلیج مسقط بسیار بالاتر.',
        },
        {
          q: 'آیا خرید ملک در مسقط اقامت می‌دهد؟',
          a: 'بله. خرید در مناطق ITC اقامت سرمایه‌گذاری عمان را به مالک می‌دهد که تا زمان مالکیت قابل تمدید است و سطوح بالاتر مشمول اقامت طلایی ۱۰ ساله می‌شوند. این اقامت معمولاً همسر و فرزندان را هم پوشش می‌دهد.',
        },
        {
          q: 'کدام منطقه مسقط برای خرید بهتر است؟',
          a: 'الموج زندگی کنار مارینا با زمین گلف و عمیق‌ترین بازار فروش مجدد را دارد. خلیج مسقط و مسقط هیلز آرام‌تر و خاص‌ترند. شهر سلطان هیثم منطقه جدید با کمترین قیمت ورود است و جبل سیفه اقتصادی‌ترین گزینه ساحلی.',
        },
      ],
      linksHeading: 'صفحات مرتبط',
      links: [
        { href: '/buy-apartment-in-muscat', label: 'خرید آپارتمان در مسقط: قیمت‌ها بر اساس منطقه' },
        { href: '/project', label: 'جستجوی همه املاک برای فروش در عمان' },
        { href: '/buy', label: 'خرید ملک در عمان: راهنمای کامل و لیست قیمت' },
        { href: '/buy-property-in-salalah', label: 'خرید ملک در صلاله: ویلا و شاله' },
      ],
    },
    ar: {
      h1: 'شراء عقار في مسقط',
      lead: 'شقق وفلل وتاون هاوس بتملّك حر للبيع في مسقط، بأسعار من مخزون المطورين مباشرة ومتاحة لجميع الجنسيات.',
      heading: 'شراء عقار في مسقط للأجانب',
      paras: [
        'تضم مسقط تقريباً كل مخزون التملّك الحر في عُمان. يستطيع المشترون الأجانب من أي جنسية الحصول على ملكية حرة كاملة داخل المجمعات السياحية المتكاملة المعتمدة من الحكومة: الموج على المارينا، وخليج مسقط، ومسقط هيلز، وشاطئ القرم، وييتي وجبل سيفة على الساحل، ومدينة السلطان هيثم الجديدة في السيب. خارج هذه المناطق تقتصر ملكية الأجانب على حق الانتفاع حتى 99 عاماً، ولهذا فإن جميع الوحدات في هذه الصفحة داخل مناطق ITC.',
        'تبدأ أسعار الدخول في مسقط من نحو 35,625 ر.ع لاستوديو في جبل سيفة و48,125 ر.ع لشقة في مدينة السلطان هيثم، بينما ترتفع منازل المارينا والواجهة البحرية في الموج وخليج مسقط كثيراً. كما يؤهل الشراء لإقامة مستثمر عُمانية قابلة للتجديد طوال فترة التملك، ولا توجد ضريبة سنوية على العقار ولا ضريبة على دخل الإيجار. تدير مجموعة عرفان للاستثمار الصفقة بالكامل من الحجز والعقد حتى التسجيل في وزارة الإسكان والتسليم.',
      ],
      areasHeading: 'مجتمعات التملّك الحر في مسقط',
      faq: [
        {
          q: 'هل يمكن للأجنبي شراء عقار في مسقط؟',
          a: 'نعم. يمكن لأي جنسية الشراء بتملّك حر في مسقط داخل مجمع سياحي متكامل: الموج، خليج مسقط، مسقط هيلز، شاطئ القرم، ييتي، جبل سيفة ومدينة السلطان هيثم. الملكية كاملة ومسجلة في وزارة الإسكان وقابلة لإعادة البيع والتوريث.',
        },
        {
          q: 'كم تكلفة شراء عقار في مسقط؟',
          a: 'تبدأ الاستوديوهات من نحو 35,625 ر.ع في جبل سيفة والشقق من نحو 48,125 ر.ع في مدينة السلطان هيثم. وتتراوح الشقق بغرفتي نوم في مناطق ITC عادة بين 90,000 و150,000 ر.ع، بينما ترتفع فلل الموج وخليج مسقط ومسقط هيلز أكثر.',
        },
        {
          q: 'هل يمنح شراء عقار في مسقط الإقامة؟',
          a: 'نعم. الشراء داخل ITC يمنح المالك إقامة مستثمر عُمانية قابلة للتجديد طوال فترة التملك، وتؤهل مستويات الاستثمار الأعلى للإقامة الذهبية لعشر سنوات، وتشمل عادة الزوج والأبناء.',
        },
        {
          q: 'ما أفضل منطقة للشراء في مسقط؟',
          a: 'الموج يوفر الحياة على المارينا مع ملعب غولف وأعمق سوق لإعادة البيع. خليج مسقط ومسقط هيلز أهدأ وأكثر خصوصية. مدينة السلطان هيثم هي المنطقة الجديدة بأقل أسعار دخول، وجبل سيفة أكثر الخيارات الساحلية اقتصادية.',
        },
      ],
      linksHeading: 'صفحات ذات صلة',
      links: [
        { href: '/buy-apartment-in-muscat', label: 'شراء شقة في مسقط: الأسعار حسب المجتمع' },
        { href: '/project', label: 'ابحث في جميع العقارات للبيع في عُمان' },
        { href: '/buy', label: 'شراء عقار في عُمان: الدليل الكامل وقائمة الأسعار' },
        { href: '/buy-property-in-salalah', label: 'شراء عقار في صلالة: فلل وشاليهات' },
      ],
    },
    ru: {
      h1: 'Купить недвижимость в Маскате',
      lead: 'Квартиры, виллы и таунхаусы во фрихолд на продажу в Маскате — цены из живого инвентаря застройщиков, доступно покупателям любой национальности.',
      heading: 'Покупка недвижимости в Маскате иностранцем',
      paras: [
        'В Маскате сосредоточен практически весь фрихолд-фонд Омана. Иностранцы любой национальности получают полное право собственности внутри одобренных государством интегрированных туристических комплексов: Al Mouj на марине, Muscat Bay, Muscat Hills, Shatti Al Qurum на пляже, Yiti и Jebel Sifah на побережье, а также новый район Sultan Haitham City в Эс-Сибе. Вне этих зон иностранцам доступен только узуфрукт до 99 лет — поэтому все лоты на этой странице находятся внутри ITC.',
        'Стартовые цены в Маскате — от примерно 35 625 OMR за студию в Jebel Sifah и 48 125 OMR за квартиру в Sultan Haitham City; дома у марины и на первой линии в Al Mouj и Muscat Bay стоят существенно дороже. Покупка также даёт право на инвесторскую резиденцию Омана, продлеваемую всё время владения. Ежегодного налога на недвижимость и налога на арендный доход в Омане нет. Irfan Investment Group ведёт сделку целиком — от брони и договора до регистрации в министерстве жилья и передачи ключей.',
      ],
      areasHeading: 'Фрихолд-сообщества Маската',
      faq: [
        {
          q: 'Может ли иностранец купить недвижимость в Маскате?',
          a: 'Да. Любая национальность может купить фрихолд в Маскате внутри комплекса ITC: Al Mouj, Muscat Bay, Muscat Hills, Shatti Al Qurum, Yiti, Jebel Sifah и Sultan Haitham City. Право собственности полное, регистрируется в министерстве жилья, его можно перепродать и наследовать.',
        },
        {
          q: 'Сколько стоит недвижимость в Маскате?',
          a: 'Студии от примерно 35 625 OMR в Jebel Sifah, квартиры от 48 125 OMR в Sultan Haitham City. Двухспальные квартиры в районах ITC обычно 90 000–150 000 OMR, виллы у марины и на первой линии в Al Mouj, Muscat Bay и Muscat Hills — заметно дороже.',
        },
        {
          q: 'Даёт ли покупка в Маскате резиденцию?',
          a: 'Да. Покупка внутри ITC даёт инвесторскую резиденцию Омана, продлеваемую всё время владения; более высокие уровни инвестиций дают золотую резиденцию на 10 лет. Обычно резиденция распространяется на супруга и детей.',
        },
        {
          q: 'Какой район Маската выбрать?',
          a: 'Al Mouj — жизнь у марины с полем для гольфа и самый ликвидный вторичный рынок. Muscat Bay и Muscat Hills тише и более закрытые. Sultan Haitham City — новый район с самым низким входом, Jebel Sifah — самый доступный курортный вариант.',
        },
      ],
      linksHeading: 'Связанные страницы',
      links: [
        { href: '/buy-apartment-in-muscat', label: 'Купить квартиру в Маскате: цены по районам' },
        { href: '/project', label: 'Поиск по всей недвижимости Омана' },
        { href: '/buy', label: 'Купить недвижимость в Омане: полный гид' },
        { href: '/buy-property-in-salalah', label: 'Купить недвижимость в Салале: виллы и шале' },
      ],
    },
  },

  'buy-apartment-in-muscat': {
    filter: { cities: ['Muscat', 'Al Seeb'], types: ['Apartment', 'Studio', 'Penthouse'] },
    areaLinks: [
      { area: 'Al Mouj (The Wave)', label: 'Al Mouj' },
      { area: 'Muscat Bay', label: 'Muscat Bay' },
      { area: 'Sultan Haitham City', label: 'Sultan Haitham City' },
      { area: 'Jebel Sifah', label: 'Jebel Sifah' },
      { area: 'Yiti', label: 'Yiti' },
    ],
    en: {
      h1: 'Buy an Apartment in Muscat',
      lead: 'Freehold studios, apartments and penthouses for sale across Muscat, with live developer pricing and Oman investor residency included.',
      heading: 'Apartments for sale in Muscat: prices and communities',
      paras: [
        'Apartments are the entry point to Muscat property for most foreign buyers, and every one on this page is freehold — full ownership, registered at the Ministry of Housing, available to any nationality because it sits inside an Integrated Tourism Complex. The cheapest freehold apartment ticket in the capital region is currently a studio at Jebel Sifah from about OMR 35,625, followed by Sultan Haitham City in Al Seeb from about OMR 48,125.',
        'Above that entry band, one and two bedroom apartments at Al Mouj, Muscat Bay and Yiti give you marina, beach or bay frontage and the most liquid resale market in Oman, with penthouses at the top of each building. Rental yields on well-placed Muscat apartments run to roughly 8 percent gross, helped by the fact that Oman charges no tax on rental income and no annual property tax. Buying also opens the Oman investor residency route for you and your family.',
      ],
      areasHeading: 'Where to buy an apartment in Muscat',
      faq: [
        {
          q: 'How much is an apartment in Muscat?',
          a: 'Studios start from about OMR 35,625 at Jebel Sifah and one bedroom apartments from about OMR 48,125 in Sultan Haitham City. Two bedroom apartments inside the ITC districts typically sit between OMR 90,000 and 150,000, and apartments at Al Mouj and Muscat Bay go higher again depending on view and floor.',
        },
        {
          q: 'Can foreigners buy an apartment in Muscat?',
          a: 'Yes, with full freehold title, provided the apartment is inside an Integrated Tourism Complex such as Al Mouj, Muscat Bay, Jebel Sifah, Yiti or Sultan Haitham City. Every apartment listed on this page meets that condition.',
        },
        {
          q: 'What rental yield do Muscat apartments produce?',
          a: 'Well-located apartments in the ITC districts typically produce up to about 8 percent gross yield. Oman levies no tax on rental income and no annual property tax, so the net return stays close to the gross figure after service charges.',
        },
        {
          q: 'Can I pay for a Muscat apartment in instalments?',
          a: 'Yes on off-plan units. Payment plans usually start with a reservation fee and around 10 percent down, with the balance staged against construction milestones and handover. Our consultants will send the exact plan for any unit on request.',
        },
      ],
      linksHeading: 'Related pages',
      links: [
        { href: '/buy-property-in-muscat', label: 'Buy property in Muscat: villas, townhouses and apartments' },
        { href: '/project', label: 'Search all properties for sale in Oman' },
        { href: '/buy', label: 'Buy property in Oman: full guide and price list' },
        { href: '/buy/jebel-sifah', label: 'Apartments and studios for sale in Jebel Sifah' },
      ],
    },
    fa: {
      h1: 'خرید آپارتمان در مسقط',
      lead: 'استودیو، آپارتمان و پنت‌هاوس فری‌هولد برای فروش در سراسر مسقط، با قیمت روز سازنده و همراه با اقامت سرمایه‌گذاری عمان.',
      heading: 'آپارتمان برای فروش در مسقط: قیمت‌ها و مناطق',
      paras: [
        'آپارتمان نقطه ورود بیشتر خریداران خارجی به بازار مسقط است و همه واحدهای این صفحه فری‌هولد هستند: مالکیت کامل، ثبت‌شده در وزارت مسکن و در دسترس هر ملیتی، چون داخل مجتمع گردشگری یکپارچه قرار دارند. ارزان‌ترین بلیت ورود فری‌هولد در منطقه پایتخت در حال حاضر استودیو در جبل سیفه از حدود ۳۵٬۶۲۵ ریال عمان است و بعد از آن شهر سلطان هیثم در السیب از حدود ۴۸٬۱۲۵ ریال.',
        'بالاتر از این باند ورودی، آپارتمان‌های یک و دوخوابه در الموج، خلیج مسقط و ییتی مشرف به مارینا، ساحل یا خلیج هستند و نقدشونده‌ترین بازار فروش مجدد عمان را دارند؛ پنت‌هاوس‌ها هم در بالاترین طبقه هر ساختمان. بازده اجاره آپارتمان‌های خوش‌موقعیت مسقط تا حدود ۸ درصد ناخالص می‌رسد، به کمک این واقعیت که عمان نه مالیات بر درآمد اجاره دارد و نه مالیات سالانه ملک. خرید، مسیر اقامت سرمایه‌گذاری را هم برای شما و خانواده‌تان باز می‌کند.',
      ],
      areasHeading: 'کجای مسقط آپارتمان بخریم',
      faq: [
        {
          q: 'قیمت آپارتمان در مسقط چقدر است؟',
          a: 'استودیو از حدود ۳۵٬۶۲۵ ریال عمان در جبل سیفه و آپارتمان یک‌خوابه از حدود ۴۸٬۱۲۵ ریال در شهر سلطان هیثم شروع می‌شود. آپارتمان دوخوابه داخل مناطق ITC معمولاً بین ۹۰ تا ۱۵۰ هزار ریال است و آپارتمان‌های الموج و خلیج مسقط بسته به ویو و طبقه بالاتر می‌روند.',
        },
        {
          q: 'آیا خارجی‌ها می‌توانند در مسقط آپارتمان بخرند؟',
          a: 'بله، با سند کامل فری‌هولد، به شرط آنکه آپارتمان داخل مجتمع گردشگری یکپارچه مانند الموج، خلیج مسقط، جبل سیفه، ییتی یا شهر سلطان هیثم باشد. همه آپارتمان‌های این صفحه این شرط را دارند.',
        },
        {
          q: 'بازده اجاره آپارتمان‌های مسقط چقدر است؟',
          a: 'آپارتمان‌های خوش‌موقعیت در مناطق ITC معمولاً تا حدود ۸ درصد بازده ناخالص می‌دهند. عمان مالیات بر درآمد اجاره و مالیات سالانه ملک ندارد، پس بازده خالص بعد از شارژ خدمات به عدد ناخالص نزدیک می‌ماند.',
        },
        {
          q: 'آیا می‌توانم آپارتمان مسقط را قسطی بخرم؟',
          a: 'بله برای واحدهای پیش‌فروش. طرح‌های پرداخت معمولاً با هزینه رزرو و حدود ۱۰ درصد پیش‌پرداخت شروع می‌شود و باقی مبلغ بر اساس مراحل ساخت و تحویل تقسیم می‌شود. مشاوران ما طرح دقیق هر واحد را برایتان می‌فرستند.',
        },
      ],
      linksHeading: 'صفحات مرتبط',
      links: [
        { href: '/buy-property-in-muscat', label: 'خرید ملک در مسقط: ویلا، تاون‌هاوس و آپارتمان' },
        { href: '/project', label: 'جستجوی همه املاک برای فروش در عمان' },
        { href: '/buy', label: 'خرید ملک در عمان: راهنمای کامل و لیست قیمت' },
        { href: '/buy/jebel-sifah', label: 'خرید آپارتمان و استودیو در جبل سیفه' },
      ],
    },
    ar: {
      h1: 'شراء شقة في مسقط',
      lead: 'استوديوهات وشقق وبنتهاوس بتملّك حر للبيع في مسقط، بأسعار محدثة من المطورين ومع إقامة المستثمر العُمانية.',
      heading: 'شقق للبيع في مسقط: الأسعار والمجتمعات',
      paras: [
        'الشقق هي نقطة الدخول إلى سوق مسقط لمعظم المشترين الأجانب، وكل شقة في هذه الصفحة بتملّك حر: ملكية كاملة مسجلة في وزارة الإسكان ومتاحة لأي جنسية لأنها داخل مجمع سياحي متكامل. أرخص دخول للتملك الحر في منطقة العاصمة حالياً هو استوديو في جبل سيفة من نحو 35,625 ر.ع، تليه مدينة السلطان هيثم في السيب من نحو 48,125 ر.ع.',
        'وفوق هذه الفئة، توفر الشقق بغرفة وغرفتي نوم في الموج وخليج مسقط وييتي إطلالة على المارينا أو الشاطئ أو الخليج، وأكثر أسواق إعادة البيع سيولة في عُمان، مع بنتهاوس في أعلى كل مبنى. تصل عوائد الإيجار للشقق جيدة الموقع إلى نحو 8% إجمالاً، بمساعدة عدم وجود ضريبة على دخل الإيجار ولا ضريبة سنوية على العقار. كما يفتح الشراء مسار إقامة المستثمر لك ولعائلتك.',
      ],
      areasHeading: 'أين تشتري شقة في مسقط',
      faq: [
        {
          q: 'كم سعر الشقة في مسقط؟',
          a: 'تبدأ الاستوديوهات من نحو 35,625 ر.ع في جبل سيفة، والشقق بغرفة نوم من نحو 48,125 ر.ع في مدينة السلطان هيثم. الشقق بغرفتي نوم داخل مناطق ITC عادة بين 90,000 و150,000 ر.ع، وترتفع شقق الموج وخليج مسقط حسب الإطلالة والدور.',
        },
        {
          q: 'هل يمكن للأجانب شراء شقة في مسقط؟',
          a: 'نعم بتملّك حر كامل، شرط أن تكون الشقة داخل مجمع سياحي متكامل مثل الموج أو خليج مسقط أو جبل سيفة أو ييتي أو مدينة السلطان هيثم. جميع الشقق المعروضة هنا تحقق هذا الشرط.',
        },
        {
          q: 'ما عائد الإيجار لشقق مسقط؟',
          a: 'تحقق الشقق جيدة الموقع في مناطق ITC عادة عائداً إجمالياً يصل إلى نحو 8%. لا تفرض عُمان ضريبة على دخل الإيجار ولا ضريبة سنوية على العقار، لذا يبقى العائد الصافي قريباً من الإجمالي بعد رسوم الخدمات.',
        },
        {
          q: 'هل يمكن الشراء بالتقسيط؟',
          a: 'نعم للوحدات على المخطط. تبدأ خطط الدفع عادة برسوم حجز ونحو 10% دفعة أولى، ويوزع الباقي على مراحل الإنشاء والتسليم. يرسل مستشارونا الخطة الدقيقة لأي وحدة عند الطلب.',
        },
      ],
      linksHeading: 'صفحات ذات صلة',
      links: [
        { href: '/buy-property-in-muscat', label: 'شراء عقار في مسقط: فلل وتاون هاوس وشقق' },
        { href: '/project', label: 'ابحث في جميع العقارات للبيع في عُمان' },
        { href: '/buy', label: 'شراء عقار في عُمان: الدليل الكامل وقائمة الأسعار' },
        { href: '/buy/jebel-sifah', label: 'شقق واستوديوهات للبيع في جبل سيفة' },
      ],
    },
    ru: {
      h1: 'Купить квартиру в Маскате',
      lead: 'Студии, квартиры и пентхаусы во фрихолд на продажу в Маскате — актуальные цены застройщиков и инвесторская резиденция Омана.',
      heading: 'Квартиры на продажу в Маскате: цены и районы',
      paras: [
        'Квартира — точка входа в рынок Маската для большинства иностранных покупателей, и каждая на этой странице во фрихолд: полная собственность, регистрируемая в министерстве жилья, доступная любой национальности, потому что находится внутри интегрированного туристического комплекса. Самый доступный фрихолд в столичном регионе сейчас — студия в Jebel Sifah от примерно 35 625 OMR, затем Sultan Haitham City в Эс-Сибе от примерно 48 125 OMR.',
        'Выше этого уровня квартиры с одной и двумя спальнями в Al Mouj, Muscat Bay и Yiti дают вид на марину, пляж или залив и самый ликвидный вторичный рынок Омана, с пентхаусами на верхних этажах. Арендная доходность удачно расположенных квартир доходит примерно до 8% годовых брутто — этому помогает отсутствие налога на арендный доход и ежегодного налога на недвижимость. Покупка также открывает путь к инвесторской резиденции для вас и семьи.',
      ],
      areasHeading: 'Где купить квартиру в Маскате',
      faq: [
        {
          q: 'Сколько стоит квартира в Маскате?',
          a: 'Студии от примерно 35 625 OMR в Jebel Sifah, квартиры с одной спальней от 48 125 OMR в Sultan Haitham City. Двухспальные внутри районов ITC обычно 90 000–150 000 OMR, в Al Mouj и Muscat Bay дороже в зависимости от вида и этажа.',
        },
        {
          q: 'Могут ли иностранцы купить квартиру в Маскате?',
          a: 'Да, с полным правом собственности, если квартира находится внутри комплекса ITC: Al Mouj, Muscat Bay, Jebel Sifah, Yiti или Sultan Haitham City. Все квартиры на этой странице отвечают этому условию.',
        },
        {
          q: 'Какая доходность у квартир в Маскате?',
          a: 'Удачно расположенные квартиры в районах ITC обычно дают до 8% брутто. В Омане нет налога на арендный доход и ежегодного налога на недвижимость, поэтому чистая доходность близка к брутто за вычетом сервисных сборов.',
        },
        {
          q: 'Можно ли купить в рассрочку?',
          a: 'Да, для объектов на стадии строительства. План обычно начинается с брони и около 10% первого взноса, остаток распределяется по этапам строительства и передаче. Консультанты пришлют точный план по любому лоту.',
        },
      ],
      linksHeading: 'Связанные страницы',
      links: [
        { href: '/buy-property-in-muscat', label: 'Купить недвижимость в Маскате: виллы, таунхаусы, квартиры' },
        { href: '/project', label: 'Поиск по всей недвижимости Омана' },
        { href: '/buy', label: 'Купить недвижимость в Омане: полный гид' },
        { href: '/buy/jebel-sifah', label: 'Квартиры и студии на продажу в Jebel Sifah' },
      ],
    },
  },

  'buy-property-in-salalah': {
    filter: { cities: ['Salalah'] },
    areaLinks: [{ area: 'Hawana Salalah', label: 'Hawana Salalah' }],
    en: {
      h1: 'Buy Property in Salalah',
      lead: 'Freehold beachfront villas and chalets for sale in Hawana Salalah, on the Dhofar coast — the strongest holiday-rental market in Oman.',
      heading: 'Buying property in Salalah, Oman',
      paras: [
        'Salalah sits on Oman\'s Dhofar coast and behaves unlike anywhere else in the Gulf: the khareef monsoon turns the region green between June and September and fills the city with regional visitors, which is why Salalah carries the strongest seasonal rental demand in the country. Freehold ownership for foreign buyers is concentrated in Hawana Salalah, the Integrated Tourism Complex on the beach with its own marina, lagoons, hotels and waterpark. Ownership there is full freehold, open to every nationality, and registered at the Ministry of Housing.',
        'Entry pricing in Salalah starts from about OMR 98,000 for a one bedroom beachfront chalet, with two and three bedroom villas above that. Because demand peaks in khareef and again in winter, owners typically run the property as a short-let for part of the year and use it themselves for the rest. As with the rest of Oman, there is no annual property tax and no tax on rental income, and the purchase qualifies the owner for a renewable Oman investor residency permit.',
      ],
      areasHeading: 'Freehold communities in Salalah',
      faq: [
        {
          q: 'Can foreigners buy property in Salalah?',
          a: 'Yes. Foreign buyers of any nationality can own freehold property inside Hawana Salalah, the Integrated Tourism Complex on the Salalah beachfront. The title is full ownership registered at the Ministry of Housing and can be resold or inherited.',
        },
        {
          q: 'How much does property in Salalah cost?',
          a: 'One bedroom beachfront chalets in Hawana Salalah start from about OMR 98,000, with two and three bedroom villas priced above that depending on plot, view and proximity to the marina and lagoon.',
        },
        {
          q: 'Is Salalah a good rental investment?',
          a: 'Salalah has two strong seasons: the khareef monsoon from roughly June to September, when the region turns green and draws heavy regional tourism, and the winter months. That twin-season pattern gives Salalah the most pronounced short-let demand of any Omani market, and there is no tax on the rental income.',
        },
        {
          q: 'Does a Salalah property give Oman residency?',
          a: 'Yes. Because Hawana Salalah is an Integrated Tourism Complex, buying there qualifies the owner for an Oman investor residency permit that remains renewable for as long as the property is held.',
        },
      ],
      linksHeading: 'Related pages',
      links: [
        { href: '/buy/hawana-salalah', label: 'Hawana Salalah: available units, prices and payment plan' },
        { href: '/buy-property-in-muscat', label: 'Buy property in Muscat: apartments and villas' },
        { href: '/project', label: 'Search all properties for sale in Oman' },
        { href: '/buy', label: 'Buy property in Oman: full guide and price list' },
      ],
    },
    fa: {
      h1: 'خرید ملک در صلاله',
      lead: 'ویلا و شاله ساحلی فری‌هولد برای فروش در هوانا صلاله، در ساحل ظفار — قوی‌ترین بازار اجاره تعطیلاتی عمان.',
      heading: 'خرید ملک در صلاله، عمان',
      paras: [
        'صلاله در ساحل ظفار عمان قرار دارد و رفتاری متفاوت با هر جای دیگر خلیج فارس دارد: موسم خریف بین ژوئن تا سپتامبر منطقه را سرسبز می‌کند و شهر را از گردشگران منطقه پر می‌کند؛ به همین دلیل صلاله بالاترین تقاضای اجاره فصلی کشور را دارد. مالکیت فری‌هولد برای خریداران خارجی در هوانا صلاله متمرکز است، مجتمع گردشگری یکپارچه‌ای در ساحل با مارینا، تالاب، هتل‌ها و پارک آبی اختصاصی. مالکیت آنجا کاملاً فری‌هولد، باز برای همه ملیت‌ها و ثبت‌شده در وزارت مسکن است.',
        'قیمت ورودی در صلاله از حدود ۹۸٬۰۰۰ ریال عمان برای شاله ساحلی یک‌خوابه شروع می‌شود و ویلاهای دو و سه‌خوابه بالاتر از آن هستند. چون تقاضا در خریف و دوباره در زمستان اوج می‌گیرد، مالکان معمولاً بخشی از سال ملک را اجاره کوتاه‌مدت می‌دهند و بقیه سال خودشان استفاده می‌کنند. مثل بقیه عمان، نه مالیات سالانه ملک وجود دارد و نه مالیات بر درآمد اجاره، و خرید، اقامت سرمایه‌گذاری قابل تمدید عمان را برای مالک می‌آورد.',
      ],
      areasHeading: 'مجموعه‌های فری‌هولد در صلاله',
      faq: [
        {
          q: 'آیا خارجی‌ها می‌توانند در صلاله ملک بخرند؟',
          a: 'بله. خریداران خارجی از هر ملیتی می‌توانند داخل هوانا صلاله، مجتمع گردشگری یکپارچه در ساحل صلاله، ملک فری‌هولد داشته باشند. سند مالکیت کامل و ثبت‌شده در وزارت مسکن است و قابل فروش مجدد و ارث.',
        },
        {
          q: 'قیمت ملک در صلاله چقدر است؟',
          a: 'شاله ساحلی یک‌خوابه در هوانا صلاله از حدود ۹۸٬۰۰۰ ریال عمان شروع می‌شود و ویلاهای دو و سه‌خوابه بسته به زمین، ویو و فاصله از مارینا و تالاب بالاتر قیمت‌گذاری می‌شوند.',
        },
        {
          q: 'آیا صلاله برای سرمایه‌گذاری اجاره‌ای خوب است؟',
          a: 'صلاله دو فصل قوی دارد: موسم خریف تقریباً از ژوئن تا سپتامبر که منطقه سرسبز می‌شود و گردشگری منطقه‌ای سنگینی جذب می‌کند، و ماه‌های زمستان. این الگوی دوفصلی بالاترین تقاضای اجاره کوتاه‌مدت را در بازار عمان به صلاله می‌دهد و درآمد اجاره هم مالیات ندارد.',
        },
        {
          q: 'آیا ملک در صلاله اقامت عمان می‌دهد؟',
          a: 'بله. چون هوانا صلاله یک مجتمع گردشگری یکپارچه است، خرید در آن مالک را واجد شرایط اقامت سرمایه‌گذاری عمان می‌کند که تا زمان مالکیت قابل تمدید است.',
        },
      ],
      linksHeading: 'صفحات مرتبط',
      links: [
        { href: '/buy/hawana-salalah', label: 'هوانا صلاله: واحدهای موجود، قیمت و طرح پرداخت' },
        { href: '/buy-property-in-muscat', label: 'خرید ملک در مسقط: آپارتمان و ویلا' },
        { href: '/project', label: 'جستجوی همه املاک برای فروش در عمان' },
        { href: '/buy', label: 'خرید ملک در عمان: راهنمای کامل و لیست قیمت' },
      ],
    },
    ar: {
      h1: 'شراء عقار في صلالة',
      lead: 'فلل وشاليهات شاطئية بتملّك حر للبيع في هوانا صلالة على ساحل ظفار — أقوى سوق للإيجار الموسمي في عُمان.',
      heading: 'شراء عقار في صلالة، عُمان',
      paras: [
        'تقع صلالة على ساحل ظفار وتختلف عن أي مكان آخر في الخليج: يحوّل موسم الخريف المنطقة إلى اللون الأخضر بين يونيو وسبتمبر ويملأ المدينة بالزوار من دول المنطقة، ولهذا تتمتع صلالة بأقوى طلب إيجار موسمي في البلاد. يتركز التملّك الحر للأجانب في هوانا صلالة، المجمع السياحي المتكامل على الشاطئ بمارينا وبحيرات وفنادق ومدينة ألعاب مائية. الملكية هناك حرة كاملة، متاحة لجميع الجنسيات ومسجلة في وزارة الإسكان.',
        'تبدأ أسعار الدخول في صلالة من نحو 98,000 ر.ع لشاليه شاطئي بغرفة نوم واحدة، وفوقها فلل بغرفتين وثلاث غرف. ولأن الطلب يبلغ ذروته في الخريف ثم في الشتاء، يشغّل الملاك العقار عادة كإيجار قصير المدى جزءاً من السنة ويستخدمونه بأنفسهم بقية العام. وكما في بقية عُمان، لا توجد ضريبة سنوية على العقار ولا ضريبة على دخل الإيجار، ويؤهل الشراء المالك لإقامة مستثمر عُمانية قابلة للتجديد.',
      ],
      areasHeading: 'مجتمعات التملّك الحر في صلالة',
      faq: [
        {
          q: 'هل يمكن للأجانب شراء عقار في صلالة؟',
          a: 'نعم. يمكن للمشترين الأجانب من أي جنسية التملّك الحر داخل هوانا صلالة، المجمع السياحي المتكامل على واجهة صلالة البحرية. الملكية كاملة ومسجلة في وزارة الإسكان وقابلة لإعادة البيع والتوريث.',
        },
        {
          q: 'كم تكلفة العقار في صلالة؟',
          a: 'تبدأ الشاليهات الشاطئية بغرفة نوم في هوانا صلالة من نحو 98,000 ر.ع، والفلل بغرفتين وثلاث غرف أعلى من ذلك حسب الأرض والإطلالة والقرب من المارينا والبحيرة.',
        },
        {
          q: 'هل صلالة استثمار إيجاري جيد؟',
          a: 'لصلالة موسمان قويان: موسم الخريف من يونيو إلى سبتمبر تقريباً حين تخضرّ المنطقة وتجذب سياحة إقليمية كثيفة، ثم أشهر الشتاء. هذا النمط المزدوج يمنح صلالة أوضح طلب على الإيجار قصير المدى في السوق العُماني، ولا ضريبة على دخل الإيجار.',
        },
        {
          q: 'هل يمنح عقار صلالة الإقامة العُمانية؟',
          a: 'نعم. لأن هوانا صلالة مجمع سياحي متكامل، فإن الشراء فيها يؤهل المالك لإقامة مستثمر عُمانية تظل قابلة للتجديد طوال فترة التملك.',
        },
      ],
      linksHeading: 'صفحات ذات صلة',
      links: [
        { href: '/buy/hawana-salalah', label: 'هوانا صلالة: الوحدات المتاحة والأسعار وخطة الدفع' },
        { href: '/buy-property-in-muscat', label: 'شراء عقار في مسقط: شقق وفلل' },
        { href: '/project', label: 'ابحث في جميع العقارات للبيع في عُمان' },
        { href: '/buy', label: 'شراء عقار في عُمان: الدليل الكامل وقائمة الأسعار' },
      ],
    },
    ru: {
      h1: 'Купить недвижимость в Салале',
      lead: 'Виллы и шале во фрихолд на первой линии в Hawana Salalah на побережье Дофара — сильнейший рынок краткосрочной аренды в Омане.',
      heading: 'Покупка недвижимости в Салале, Оман',
      paras: [
        'Салала расположена на побережье Дофара и ведёт себя иначе, чем остальной Залив: муссон хариф с июня по сентябрь делает регион зелёным и наполняет город туристами со всего Залива — поэтому у Салалы самый сильный сезонный арендный спрос в стране. Фрихолд для иностранцев сосредоточен в Hawana Salalah, интегрированном туристическом комплексе на пляже с собственной мариной, лагунами, отелями и аквапарком. Собственность там полная, доступна любой национальности и регистрируется в министерстве жилья.',
        'Стартовые цены в Салале — от примерно 98 000 OMR за пляжное шале с одной спальней, виллы с двумя и тремя спальнями дороже. Поскольку спрос пикует в хариф и зимой, владельцы обычно сдают объект посуточно часть года, а остальное время живут сами. Как и в остальном Омане, нет ежегодного налога на недвижимость и налога на арендный доход, а покупка даёт право на продлеваемую инвесторскую резиденцию.',
      ],
      areasHeading: 'Фрихолд-сообщества Салалы',
      faq: [
        {
          q: 'Могут ли иностранцы купить недвижимость в Салале?',
          a: 'Да. Покупатели любой национальности могут владеть фрихолдом внутри Hawana Salalah — интегрированного туристического комплекса на побережье Салалы. Право собственности полное, регистрируется в министерстве жилья, объект можно перепродать и наследовать.',
        },
        {
          q: 'Сколько стоит недвижимость в Салале?',
          a: 'Пляжные шале с одной спальней в Hawana Salalah от примерно 98 000 OMR; виллы с двумя и тремя спальнями дороже в зависимости от участка, вида и близости к марине и лагуне.',
        },
        {
          q: 'Салала — хорошая инвестиция в аренду?',
          a: 'У Салалы два сильных сезона: хариф примерно с июня по сентябрь, когда регион зеленеет и привлекает мощный региональный турпоток, и зимние месяцы. Такая двухсезонность даёт Салале самый выраженный спрос на краткосрочную аренду в Омане, а налог на арендный доход отсутствует.',
        },
        {
          q: 'Даёт ли недвижимость в Салале резиденцию Омана?',
          a: 'Да. Поскольку Hawana Salalah — интегрированный туристический комплекс, покупка там даёт владельцу инвесторскую резиденцию Омана, продлеваемую всё время владения.',
        },
      ],
      linksHeading: 'Связанные страницы',
      links: [
        { href: '/buy/hawana-salalah', label: 'Hawana Salalah: доступные лоты, цены и план оплаты' },
        { href: '/buy-property-in-muscat', label: 'Купить недвижимость в Маскате: квартиры и виллы' },
        { href: '/project', label: 'Поиск по всей недвижимости Омана' },
        { href: '/buy', label: 'Купить недвижимость в Омане: полный гид' },
      ],
    },
  },
}

export const LANDING_SLUGS = Object.keys(LANDINGS)

export function landingCopy(slug, lang) {
  const l = LANDINGS[slug]
  if (!l) return null
  return l[lang] || l.en
}

// FAQPage JSON-LD — shared so the SPA and the prerendered page emit identical
// structured data.
export function landingFaqJsonLd(slug, lang) {
  const c = landingCopy(slug, lang)
  if (!c) return null
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
