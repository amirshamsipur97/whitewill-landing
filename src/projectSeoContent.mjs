// projectSeoContent.mjs — crawlable SEO copy for the /project property-search
// portal, shared between the React page (src/pages/SearchPage.jsx) and the
// build-time prerenderer (prerender-routes.mjs). Plain data module: no JSX.
//
// WHY: /project prerendered to an <h1> + one <p> and nothing else, so the page
// that holds 400+ units had no crawlable body copy, no H2s, no FAQ and no
// internal links — while Bayut / Dubizzle / Vista / Imtilak rank with exactly
// that pattern. Targets the listing-portal query cluster:
//   buy apartment in muscat · property for sale in muscat ·
//   apartments for sale in muscat · villas for sale in oman ·
//   properties for sale in oman
//
// Facts must stay consistent with live inventory (see HANDOFF-SEARCH-ENGINE.md):
// Jebel Sifah apartments from OMR 63,500, Muscat apartments (Wadi Zaha, Sultan
// Haitham City) from OMR 61,635, Hawana Salalah chalets from OMR 98,000.

export const PROJECT_SEO = {
  en: {
    heading: 'Buy Apartments and Villas for Sale in Muscat and Across Oman',
    paras: [
      'This is the full Irfan Investment Group property portal: more than 400 apartments, villas, townhouses, chalets and studios for sale across Oman, each one priced from live developer inventory rather than an estimate. Filter by area, property type, bedrooms, size and budget to find exactly what you want, then open any listing for its floor area, view, floor level and current price in Omani rial.',
      'Most of the inventory sits in Muscat, inside the freehold communities foreign buyers can actually own in: Al Mouj on the marina, Muscat Bay, Muscat Hills, the new Sultan Haitham City district and Yiti. Apartments for sale in Muscat currently start from about OMR 61,635, apartments at Jebel Sifah from OMR 63,500, and beachfront chalets in Hawana Salalah from OMR 98,000. Every one of these communities is a government approved Integrated Tourism Complex, so the title is full freehold for all nationalities and the purchase qualifies you for an Oman investor residency permit.',
    ],
    areasHeading: 'Where to buy in Oman',
    faq: [
      {
        q: 'How do I buy an apartment in Muscat as a foreigner?',
        a: 'Choose a unit inside an Integrated Tourism Complex such as Al Mouj, Muscat Bay, Muscat Hills or Sultan Haitham City, reserve it with a deposit, sign the sale and purchase agreement, then register the title at the Ministry of Housing. All nationalities can hold full freehold title in these zones, and Irfan Investment Group handles the process end to end in English, Arabic, Russian and Persian.',
      },
      {
        q: 'What is the cheapest property for sale in Muscat?',
        a: 'Entry level apartments in Muscat currently start from around OMR 61,635 in Sultan Haitham City. If you widen the search just outside the capital, one-bedroom apartments at Jebel Sifah start from about OMR 63,500, with golf and marina living well below Muscat prices.',
      },
      {
        q: 'Can I get Oman residency by buying property?',
        a: 'Yes. Buying a freehold home inside an ITC entitles the owner to an Oman investor residency permit that stays renewable for as long as you own the property, and higher investment levels qualify for the 10 year Golden Residency tier.',
      },
      {
        q: 'Are the prices on this page up to date?',
        a: 'Yes. Every unit is pulled from the developer inventory we hold directly, with the price, floor, built up area and view shown per unit, and sold units removed. If a listing is on this page it was available at the last sync.',
      },
    ],
    linksHeading: 'Browse by community',
    links: [
      { href: '/property-prices-in-oman', label: 'Oman property prices: median price per square metre by area' },
      { href: '/buy-apartment-in-muscat', label: 'Buy an apartment in Muscat: prices by community' },
      { href: '/buy-property-in-muscat', label: 'Buy property in Muscat: apartments, villas and townhouses' },
      { href: '/buy-property-in-salalah', label: 'Buy property in Salalah: beachfront villas and chalets' },
      { href: '/buy', label: 'Buy property in Oman: full guide and price list' },
      { href: '/buy/jebel-sifah', label: 'Apartments and studios for sale in Jebel Sifah' },
      { href: '/buy/hawana-salalah', label: 'Villas and chalets for sale in Hawana Salalah' },
      { href: '/insights/buy-apartment-in-oman-2026', label: 'Buy an apartment in Oman: 2026 price map' },
    ],
  },

  fa: {
    heading: 'خرید آپارتمان و ویلا در مسقط و سراسر عمان',
    paras: [
      'این پورتال کامل املاک گروه سرمایه‌گذاری ایرفان است: بیش از ۴۰۰ آپارتمان، ویلا، تاون‌هاوس، شاله و استودیو برای فروش در سراسر عمان، همه با قیمت واقعی از اینونتوری سازنده و نه تخمین. با فیلتر منطقه، نوع ملک، تعداد خواب، متراژ و بودجه دقیقاً همان چیزی را که می‌خواهید پیدا کنید و بعد هر آگهی را برای دیدن متراژ، ویو، طبقه و قیمت روز به ریال عمان باز کنید.',
      'بیشتر موجودی در مسقط است؛ داخل همان مناطقی که خارجی‌ها واقعاً می‌توانند مالک شوند: الموج در مارینا، خلیج مسقط، مسقط هیلز، شهر جدید سلطان هیثم و ییتی. قیمت آپارتمان در مسقط در حال حاضر از حدود ۶۱٬۶۳۵ ریال عمان شروع می‌شود، آپارتمان جبل سیفه از ۶۳٬۵۰۰ ریال و شاله ساحلی در هوانا صلاله از ۹۸٬۰۰۰ ریال. همه این مجموعه‌ها مجتمع گردشگری یکپارچه (ITC) مورد تأیید دولت هستند، پس سند کاملاً فری‌هولد و برای همه ملیت‌ها است و خرید، اقامت سرمایه‌گذاری عمان را هم برای شما می‌آورد.',
    ],
    areasHeading: 'کجای عمان بخریم',
    faq: [
      {
        q: 'چطور به‌عنوان یک خارجی در مسقط آپارتمان بخرم؟',
        a: 'یک واحد داخل مجتمع گردشگری یکپارچه مانند الموج، خلیج مسقط، مسقط هیلز یا شهر سلطان هیثم انتخاب کنید، با پیش‌پرداخت رزرو کنید، قرارداد خرید را امضا کنید و سپس سند را در وزارت مسکن ثبت کنید. در این مناطق همه ملیت‌ها سند کامل فری‌هولد می‌گیرند و گروه ایرفان تمام مسیر را به فارسی برای شما انجام می‌دهد.',
      },
      {
        q: 'ارزان‌ترین ملک برای فروش در مسقط چند است؟',
        a: 'آپارتمان‌های نقطه ورود در مسقط در حال حاضر از حدود ۶۱٬۶۳۵ ریال عمان در شهر سلطان هیثم شروع می‌شوند. اگر کمی بیرون از پایتخت را هم ببینید، آپارتمان‌های جبل سیفه از حدود ۶۳٬۵۰۰ ریال عمان شروع می‌شوند؛ زندگی گلف و مارینا با قیمتی به‌مراتب کمتر از مسقط.',
      },
      {
        q: 'آیا با خرید ملک اقامت عمان می‌گیرم؟',
        a: 'بله. خرید خانه فری‌هولد داخل مناطق ITC اقامت سرمایه‌گذاری عمان را به مالک می‌دهد که تا زمان مالکیت قابل تمدید است و سطوح بالاتر سرمایه‌گذاری مشمول اقامت طلایی ۱۰ ساله می‌شوند.',
      },
      {
        q: 'قیمت‌های این صفحه به‌روز هستند؟',
        a: 'بله. هر واحد مستقیم از اینونتوری سازنده‌ای که در اختیار داریم می‌آید، با قیمت، طبقه، متراژ و ویو برای هر واحد، و واحدهای فروخته‌شده حذف می‌شوند. اگر آگهی در این صفحه هست یعنی در آخرین به‌روزرسانی موجود بوده است.',
      },
    ],
    linksHeading: 'مرور بر اساس مجموعه',
    links: [
      { href: '/property-prices-in-oman', label: 'قیمت ملک در عمان: میانه قیمت هر متر مربع بر اساس منطقه' },
      { href: '/buy-apartment-in-muscat', label: 'خرید آپارتمان در مسقط: قیمت‌ها بر اساس منطقه' },
      { href: '/buy-property-in-muscat', label: 'خرید ملک در مسقط: آپارتمان، ویلا و تاون‌هاوس' },
      { href: '/buy-property-in-salalah', label: 'خرید ملک در صلاله: ویلا و شاله ساحلی' },
      { href: '/buy', label: 'خرید ملک در عمان: راهنمای کامل و لیست قیمت' },
      { href: '/buy/jebel-sifah', label: 'خرید آپارتمان و استودیو در جبل سیفه' },
      { href: '/buy/hawana-salalah', label: 'خرید ویلا و شاله ساحلی در هوانا صلاله' },
      { href: '/insights/kharid-melk-dar-oman-2026', label: 'راهنمای گام به گام خرید ملک در عمان' },
    ],
  },

  ar: {
    heading: 'شقق وفلل للبيع في مسقط وجميع أنحاء عُمان',
    paras: [
      'هذه بوابة العقارات الكاملة لمجموعة عرفان للاستثمار: أكثر من 400 شقة وفيلا وتاون هاوس وشاليه واستوديو للبيع في عُمان، بأسعار مأخوذة مباشرة من مخزون المطورين وليست تقديرية. صفِّ النتائج حسب المنطقة ونوع العقار وعدد الغرف والمساحة والميزانية، ثم افتح أي إعلان لمعرفة المساحة والإطلالة والدور والسعر الحالي بالريال العُماني.',
      'معظم المخزون في مسقط، داخل مجتمعات التملّك الحر التي يستطيع الأجانب تملّكها فعلياً: الموج على المارينا، وخليج مسقط، ومسقط هيلز، ومدينة السلطان هيثم الجديدة، وييتي. تبدأ أسعار الشقق للبيع في مسقط حالياً من نحو 61,635 ر.ع، وشقق جبل سيفة من 63,500 ر.ع، والشاليهات الشاطئية في هوانا صلالة من 98,000 ر.ع. جميع هذه المجتمعات مجمعات سياحية متكاملة معتمدة من الحكومة، لذا فالملكية حرة كاملة لجميع الجنسيات ويؤهل الشراء لإقامة المستثمر العُمانية.',
    ],
    areasHeading: 'أين تشتري في عُمان',
    faq: [
      {
        q: 'كيف أشتري شقة في مسقط كأجنبي؟',
        a: 'اختر وحدة داخل مجمع سياحي متكامل مثل الموج أو خليج مسقط أو مسقط هيلز أو مدينة السلطان هيثم، احجزها بدفعة أولى، وقّع عقد البيع والشراء، ثم سجّل الملكية في وزارة الإسكان. جميع الجنسيات تحصل على تملّك حر كامل في هذه المناطق، وتتولى مجموعة عرفان العملية بالكامل.',
      },
      {
        q: 'ما أرخص عقار للبيع في مسقط؟',
        a: 'تبدأ الشقق الاقتصادية في مسقط حالياً من نحو 61,635 ر.ع في مدينة السلطان هيثم. وإذا وسّعت البحث خارج العاصمة قليلاً، تبدأ شقق جبل سيفة من نحو 63,500 ر.ع مع حياة الجولف والمارينا بأسعار أقل من مسقط.',
      },
      {
        q: 'هل أحصل على الإقامة العُمانية بشراء عقار؟',
        a: 'نعم. شراء منزل بتملّك حر داخل مجمع سياحي متكامل يمنح المالك إقامة مستثمر قابلة للتجديد طوال فترة التملك، وتؤهل مستويات الاستثمار الأعلى للإقامة الذهبية لعشر سنوات.',
      },
      {
        q: 'هل الأسعار في هذه الصفحة محدّثة؟',
        a: 'نعم. كل وحدة مأخوذة من مخزون المطور مباشرة، مع السعر والدور والمساحة والإطلالة لكل وحدة، وتُزال الوحدات المباعة. وجود الإعلان هنا يعني أنه كان متاحاً عند آخر تحديث.',
      },
    ],
    linksHeading: 'تصفّح حسب المجتمع',
    links: [
      { href: '/property-prices-in-oman', label: 'أسعار العقارات في عُمان: وسيط سعر المتر المربع حسب المنطقة' },
      { href: '/buy-apartment-in-muscat', label: 'شراء شقة في مسقط: الأسعار حسب المجتمع' },
      { href: '/buy-property-in-muscat', label: 'شراء عقار في مسقط: شقق وفلل وتاون هاوس' },
      { href: '/buy-property-in-salalah', label: 'شراء عقار في صلالة: فلل وشاليهات شاطئية' },
      { href: '/buy', label: 'شراء عقار في عُمان: الدليل الكامل وقائمة الأسعار' },
      { href: '/buy/jebel-sifah', label: 'شقق واستوديوهات للبيع في جبل سيفة' },
      { href: '/buy/hawana-salalah', label: 'فلل وشاليهات للبيع في هوانا صلالة' },
      { href: '/insights', label: 'جميع مقالات الاستثمار العقاري في عُمان' },
    ],
  },

  ru: {
    heading: 'Квартиры и виллы на продажу в Маскате и по всему Оману',
    paras: [
      'Это полный портал недвижимости Irfan Investment Group: более 400 квартир, вилл, таунхаусов, шале и студий на продажу в Омане, каждая с ценой из живого инвентаря застройщика, а не с оценки. Фильтруйте по району, типу, спальням, площади и бюджету, затем откройте любой лот, чтобы увидеть площадь, вид, этаж и текущую цену в оманских риалах.',
      'Большая часть инвентаря, в Маскате, внутри фрихолд-сообществ, где иностранцы действительно могут владеть: Al Mouj на марине, Muscat Bay, Muscat Hills, новый район Sultan Haitham City и Yiti. Квартиры на продажу в Маскате сейчас начинаются примерно от 61 635 OMR, квартиры в Jebel Sifah от 63 500 OMR, пляжные шале в Hawana Salalah от 98 000 OMR. Все эти комплексы, одобренные государством ITC, поэтому право собственности полностью фрихолд для всех национальностей, а покупка даёт право на инвесторскую резиденцию Омана.',
    ],
    areasHeading: 'Где покупать в Омане',
    faq: [
      {
        q: 'Как иностранцу купить квартиру в Маскате?',
        a: 'Выберите лот внутри комплекса ITC, Al Mouj, Muscat Bay, Muscat Hills или Sultan Haitham City, забронируйте депозитом, подпишите договор купли-продажи и зарегистрируйте право в министерстве жилья. В этих зонах полный фрихолд доступен всем национальностям, а Irfan Investment Group ведёт сделку целиком на русском языке.',
      },
      {
        q: 'Какая самая доступная недвижимость в Маскате?',
        a: 'Стартовые квартиры в Маскате сейчас от примерно 61 635 OMR в Sultan Haitham City. Если расширить поиск чуть за пределы столицы, квартиры в Jebel Sifah начинаются от 63 500 OMR: гольф и марина заметно дешевле Маската.',
      },
      {
        q: 'Даёт ли покупка недвижимости резиденцию Омана?',
        a: 'Да. Покупка фрихолд-жилья внутри ITC даёт владельцу инвесторскую резиденцию, продлеваемую всё время владения, а более высокие уровни инвестиций дают право на золотую резиденцию на 10 лет.',
      },
      {
        q: 'Актуальны ли цены на этой странице?',
        a: 'Да. Каждый лот берётся напрямую из инвентаря застройщика с ценой, этажом, площадью и видом по каждой единице, проданные лоты удаляются. Если лот на этой странице, он был доступен на момент последней синхронизации.',
      },
    ],
    linksHeading: 'Смотреть по сообществам',
    links: [
      { href: '/property-prices-in-oman', label: 'Цены на недвижимость в Омане: медианная цена за квадратный метр по районам' },
      { href: '/buy-apartment-in-muscat', label: 'Купить квартиру в Маскате: цены по районам' },
      { href: '/buy-property-in-muscat', label: 'Купить недвижимость в Маскате: квартиры и виллы' },
      { href: '/buy-property-in-salalah', label: 'Купить недвижимость в Салале: виллы и шале' },
      { href: '/buy', label: 'Купить недвижимость в Омане: полный гид и прайс-лист' },
      { href: '/buy/jebel-sifah', label: 'Квартиры и студии на продажу в Jebel Sifah' },
      { href: '/buy/hawana-salalah', label: 'Виллы и шале на продажу в Hawana Salalah' },
      { href: '/insights', label: 'Все статьи об инвестициях в Оман' },
    ],
  },
}

// FAQPage JSON-LD for a language block — shared so the SPA and the prerendered
// static page emit identical structured data.
export function projectFaqJsonLd(lang) {
  const c = PROJECT_SEO[lang] || PROJECT_SEO.en
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
