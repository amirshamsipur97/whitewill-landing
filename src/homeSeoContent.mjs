// Crawlable body copy for the homepage, all four languages.
//
// WHY: a full crawl on 2026-09-17 found the homepage shipping about 240 words in
// every language: one h1, the meta description and the shared footer link block.
// It is the page that owns "oman real estate" (see AGENTS.md rule 6) and it said
// nothing about Oman real estate. Same defect class as the project pages fixed on
// 2026-08-30: the content exists for people (React renders it), not for the
// crawler's first fetch.
//
// Every number is a placeholder filled at build time from live inventory
// ({UNITS} {PROJECTS} {ENTRY} {MEDIAN}); never type a count or a price here.
// English targets "oman real estate" ONLY. "Buy property in Oman" belongs to /buy.
export const HOME_SEO = {
  en: {
    heading: 'Oman Real Estate in 2026: What Foreigners Can Own and What It Costs',
    paras: [
      'Oman real estate is open to foreign buyers inside Integrated Tourism Complexes, where a buyer of any nationality holds full freehold title and receives a renewable residency with the purchase. Irfan Investment Group is a licensed real estate brokerage in Muscat. This site lists {UNITS} homes that are available today across {PROJECTS} developments, priced straight from developer inventory from OMR {ENTRY}.',
      'Across our live listings the market median is OMR {MEDIAN} per square metre. The table shows every community open to foreign ownership, how many homes are listed there now, the entry price and the median price per square metre, so you can compare Muscat, Salalah and the coast on the same basis.',
    ],
    cols: ['Community', 'Homes listed', 'From (OMR)', 'Median OMR per m²'],
    faq: [
      { q: 'Can foreigners own real estate in Oman?', a: 'Yes. Inside Integrated Tourism Complexes such as Al Mouj, Sultan Haitham City, Yiti, Muscat Bay, Jebel Sifah and Hawana Salalah, buyers of any nationality hold full freehold title that can be sold, rented or inherited.' },
      { q: 'How much does real estate in Oman cost?', a: 'Our live listings start from OMR {ENTRY} and the median is OMR {MEDIAN} per square metre. Al Mouj is the most expensive community and Sultan Haitham City the most affordable.' },
      { q: 'Does owning real estate in Oman give residency?', a: 'Yes. A freehold home in an ITC brings a renewable, sponsor-free owner visa for the buyer and immediate family, and homes from OMR 250,000 qualify for the five-year golden residency.' },
    ],
    linksHeading: 'Start here',
    links: [
      { href: '/project', label: 'All properties for sale in Oman' },
      { href: '/buy', label: 'Projects, prices and payment plans' },
      { href: '/property-prices-in-oman', label: 'Oman property price index by area' },
      { href: '/oman-golden-visa', label: 'Oman golden visa through property' },
      { href: '/invest', label: 'Company registration in Oman' },
      { href: '/insights', label: 'Guides to buying and investing in Oman' },
    ],
  },
  fa: {
    heading: 'املاک عمان در ۲۰۲۶: خارجی‌ها چه می‌توانند بخرند و با چه قیمتی',
    paras: [
      'بازار املاک عمان در مجتمع‌های گردشگری یکپارچه به روی خریداران خارجی باز است؛ خریدار از هر ملیتی، از جمله ایرانیان، سند مالکیت آزاد کامل می‌گیرد و همراه خرید، اقامت تمدیدپذیر دریافت می‌کند. گروه سرمایه‌گذاری ایرفان مشاور املاک دارای مجوز در مسقط با تیم فارسی‌زبان است. در این سایت {UNITS} واحد که همین امروز موجود است در {PROJECTS} پروژه فهرست شده، با قیمت مستقیم سازنده از {ENTRY} ریال عمان.',
      'میانه قیمت در موجودی زنده ما {MEDIAN} ریال عمان برای هر متر مربع است. جدول زیر همه مناطق مجاز برای مالکیت خارجی را نشان می‌دهد: تعداد واحد موجود، قیمت شروع و میانه قیمت هر متر، تا مسقط، صلاله و ساحل را با یک معیار مقایسه کنید.',
    ],
    cols: ['منطقه', 'واحد موجود', 'قیمت شروع (ریال عمان)', 'میانه هر متر مربع'],
    faq: [
      { q: 'آیا ایرانیان می‌توانند در عمان ملک بخرند؟', a: 'بله. در مجتمع‌های گردشگری یکپارچه مثل الموج، شهر سلطان هیثم، یتی، خلیج مسقط، جبل سیفه و هوانا صلاله، خریدار از هر ملیتی سند مالکیت آزاد کامل می‌گیرد که قابل فروش، اجاره و ارث است.' },
      { q: 'قیمت ملک در عمان چقدر است؟', a: 'موجودی زنده ما از {ENTRY} ریال عمان شروع می‌شود و میانه قیمت {MEDIAN} ریال برای هر متر مربع است. الموج گران‌ترین و شهر سلطان هیثم ارزان‌ترین منطقه است.' },
      { q: 'آیا خرید ملک در عمان اقامت می‌دهد؟', a: 'بله. ملک فری‌هولد در این مجتمع‌ها ویزای مالک تمدیدپذیر و بدون اسپانسر برای خریدار و خانواده می‌آورد و از ۲۵۰٬۰۰۰ ریال عمان به اقامت طلایی پنج‌ساله می‌رسد.' },
    ],
    linksHeading: 'از اینجا شروع کنید',
    links: [
      { href: '/project', label: 'همه املاک برای فروش در عمان' },
      { href: '/buy', label: 'پروژه‌ها، قیمت‌ها و شرایط پرداخت' },
      { href: '/property-prices-in-oman', label: 'شاخص قیمت ملک عمان به تفکیک منطقه' },
      { href: '/oman-golden-visa', label: 'گلدن ویزای عمان با خرید ملک' },
      { href: '/invest', label: 'ثبت شرکت در عمان' },
      { href: '/insights', label: 'راهنماهای خرید و سرمایه‌گذاری در عمان' },
    ],
  },
  ar: {
    heading: 'العقارات في سلطنة عُمان 2026: ما الذي يمكن للأجانب تملّكه وكم يكلّف',
    paras: [
      'سوق العقارات في سلطنة عُمان مفتوح أمام المشترين الأجانب داخل المجمعات السياحية المتكاملة، حيث يحصل المشتري من أي جنسية على صك تملك حر كامل وعلى إقامة قابلة للتجديد مع الشراء. مجموعة عرفان للاستثمار وساطة عقارية مرخصة في مسقط. يعرض هذا الموقع {UNITS} وحدة متاحة اليوم في {PROJECTS} مشروعاً، بأسعار المطور مباشرة من {ENTRY} ريالاً عُمانياً.',
      'وسيط السعر في قوائمنا الحية {MEDIAN} ريالاً عُمانياً للمتر المربع. يوضح الجدول كل مجتمع مفتوح لتملك الأجانب وعدد الوحدات المعروضة فيه وسعر البداية ووسيط سعر المتر، لتقارن بين مسقط وصلالة والساحل على أساس واحد.',
    ],
    cols: ['المجتمع', 'الوحدات المعروضة', 'يبدأ من (ر.ع)', 'وسيط سعر المتر'],
    faq: [
      { q: 'هل يمكن للأجانب تملك العقارات في سلطنة عُمان؟', a: 'نعم. داخل المجمعات السياحية المتكاملة مثل الموج ومدينة السلطان هيثم وييتي وخليج مسقط وجبل سيفة وهوانا صلالة، يحصل المشتري من أي جنسية على تملك حر كامل قابل للبيع والتأجير والتوريث.' },
      { q: 'كم تبلغ أسعار العقارات في سلطنة عُمان؟', a: 'تبدأ قوائمنا الحية من {ENTRY} ريالاً عُمانياً، ووسيط السعر {MEDIAN} ريالاً للمتر المربع. الموج هو الأعلى سعراً ومدينة السلطان هيثم الأقل.' },
      { q: 'هل يمنح تملك العقار في سلطنة عُمان إقامة؟', a: 'نعم. العقار بنظام التملك الحر داخل هذه المجمعات يمنح تأشيرة مالك قابلة للتجديد دون كفيل للمشتري وأسرته، وتؤهل العقارات من 250,000 ريال للإقامة الذهبية لخمس سنوات.' },
    ],
    linksHeading: 'ابدأ من هنا',
    links: [
      { href: '/project', label: 'جميع العقارات للبيع في سلطنة عُمان' },
      { href: '/buy', label: 'المشاريع والأسعار وخطط الدفع' },
      { href: '/property-prices-in-oman', label: 'مؤشر أسعار العقارات حسب المنطقة' },
      { href: '/oman-golden-visa', label: 'الإقامة الذهبية في عُمان عبر العقار' },
      { href: '/invest', label: 'تأسيس الشركات في سلطنة عُمان' },
      { href: '/insights', label: 'أدلة الشراء والاستثمار في سلطنة عُمان' },
    ],
  },
  ru: {
    heading: 'Недвижимость в Омане в 2026 году: что могут купить иностранцы и сколько это стоит',
    paras: [
      'Рынок недвижимости Омана открыт для иностранных покупателей внутри интегрированных туристических комплексов, где покупатель любого гражданства получает полный фригольд и продлеваемую резиденцию вместе с покупкой. Irfan Investment Group это лицензированное агентство недвижимости в Маскате. На сайте {UNITS} объектов, доступных сегодня, в {PROJECTS} проектах, по ценам застройщиков от {ENTRY} оманских риалов.',
      'Медиана по нашим актуальным объявлениям составляет {MEDIAN} оманских риалов за квадратный метр. В таблице показаны все районы, открытые для иностранцев: число объектов, стартовая цена и медианная цена за метр, чтобы сравнить Маскат, Салалу и побережье на одной основе.',
    ],
    cols: ['Район', 'Объектов', 'От (OMR)', 'Медиана OMR за м²'],
    faq: [
      { q: 'Могут ли иностранцы владеть недвижимостью в Омане?', a: 'Да. Внутри интегрированных туристических комплексов, таких как Al Mouj, Sultan Haitham City, Yiti, Muscat Bay, Jebel Sifah и Hawana Salalah, покупатель любого гражданства получает полный фригольд с правом продажи, аренды и наследования.' },
      { q: 'Сколько стоит недвижимость в Омане?', a: 'Наши актуальные объявления начинаются от {ENTRY} оманских риалов, медиана составляет {MEDIAN} риалов за квадратный метр. Самый дорогой район Al Mouj, самый доступный Sultan Haitham City.' },
      { q: 'Даёт ли покупка недвижимости в Омане резидентство?', a: 'Да. Фригольд в таком комплексе даёт продлеваемую визу собственника без спонсора для покупателя и семьи, а объекты от 250 000 риалов подходят для пятилетней золотой резиденции.' },
    ],
    linksHeading: 'С чего начать',
    links: [
      { href: '/project', label: 'Вся недвижимость на продажу в Омане' },
      { href: '/buy', label: 'Проекты, цены и планы оплаты' },
      { href: '/property-prices-in-oman', label: 'Индекс цен на недвижимость по районам' },
      { href: '/oman-golden-visa', label: 'Золотая виза Омана через недвижимость' },
      { href: '/invest', label: 'Регистрация компании в Омане' },
      { href: '/insights', label: 'Гиды по покупке и инвестициям в Омане' },
    ],
  },
}
