// priceIndexContent.mjs — copy for /property-prices-in-oman, in 4 languages.
//
// Shared between src/pages/PriceIndexPage.jsx (runtime) and
// prerender-routes.mjs (build time). Plain data module: no JSX.
//
// TWO RULES, both deliberate:
//  1. NO hard figures in the prose. Every number on the page is computed from
//     live inventory (src/priceIndexData.mjs) and rendered into the tables and
//     stat pills. Prose that quotes a price goes stale the day stock moves —
//     the same rule cityLandingContent.mjs follows. The only interpolations
//     allowed are the structural counts: {units} {areas} {projects} {updated}.
//  2. The portfolio disclaimer is not a footnote. It sits in the lead, in the
//     method section AND in the FAQ, because the whole point of a citable page
//     is that whoever cites it repeats the caveat with it.

export const TOKEN_KEYS = ['units', 'areas', 'projects', 'updated', 'excluded']

export function fill(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars?.[k] != null ? String(vars[k]) : m))
}

export const PRICE_INDEX = {
  en: {
    eyebrow: 'Irfan Investment · Market Data',
    h1: 'Oman Property Price Index',
    lead: 'What a square metre actually costs in Oman, area by area — calculated from {units} freehold homes currently for sale across {areas} communities. A portfolio index, not a national average: read the method before you quote it.',
    updatedLabel: 'Updated',
    stats: {
      units: 'units priced',
      areas: 'communities',
      median: 'median OMR / m²',
      entry: 'entry price',
    },
    areasHeading: 'Price per square metre by community',
    areasSub: 'Sorted most to least expensive. Every figure is the median of the units listed in that community today.',
    typesHeading: 'Price per square metre by property type',
    typesSub: 'Apartments dominate the freehold inventory; villas trade at a lower rate per metre but a higher ticket.',
    bedsHeading: 'Price by number of bedrooms',
    bedsSub: 'Smaller homes cost more per square metre almost everywhere — the fixed cost of a kitchen and a bathroom is spread over less floor area.',
    projectsHeading: 'Price per square metre by development',
    projectsSub: 'The same table at project level. Each name links to that development’s live price list.',
    cols: {
      area: 'Community',
      city: 'City',
      project: 'Development',
      type: 'Type',
      beds: 'Bedrooms',
      units: 'Units',
      medianPpsm: 'Median OMR / m²',
      rangePpsm: 'Range OMR / m²',
      medianPrice: 'Median price',
      from: 'From',
      typicalSize: 'Typical size',
    },
    studio: 'Studio',
    thinNote: '† Fewer than five units on the market in this row — read it as an indication, not a rate.',
    ui: {
      metricPpsm: 'Per m²',
      metricTotal: 'Median price',
      communitiesHeading: 'Communities at a glance',
      communitiesSub: 'Tap a community to open its live listings.',
      budgetHeading: 'What your budget buys',
      budgetSub: 'Move the slider to see how much of the live inventory is within reach, and where.',
      budgetLabel: 'Your budget',
      budgetHomes: 'homes within budget',
      budgetSize: 'median size at this budget',
      budgetAreas: 'communities in reach',
      budgetTypes: 'property types',
      budgetNone: 'Nothing in the inventory at this level yet. The lowest asking price today is shown in the stat bar above.',
      budgetCta: 'See these homes',
      homes: 'homes',
      from: 'from',
      viewListings: 'View listings',
      sortHint: 'Sort by any column',
    },
    methodHeading: 'How this index is calculated',
    methodParas: [
      'The dataset is Irfan Investment Group’s own live inventory: every unit we currently have available for sale in Oman, {units} of them across {projects} developments in {areas} communities, as at {updated}. It is recalculated from the same database that powers our listings, so a unit that sells drops out of the index automatically.',
      'Price per square metre is simply the asking price divided by the area we publish for that home, so you can reproduce any figure here from the listing page itself. We publish the median rather than the average, because a single large development restocking would otherwise swing the headline number. Each row shows the number of units behind it so you can judge the weight of the figure yourself, and rows built on fewer than five units are flagged.',
      'Two deliberate exclusions. Homes whose registered area is mostly private plot rather than floor area — {excluded} of them today, villas and farm houses sold with their land — are left out of the per-square-metre columns, because land and floor do not price at the same rate and mixing them would make those homes look four times cheaper than they are. They still count in the unit and price columns. Units we have not yet priced are excluded outright.',
      'This is a portfolio index, not an official measure of the Oman property market. It covers only freehold stock inside Integrated Tourism Complexes — the zones where foreign buyers can own outright — so it says nothing about the leasehold and Omani-national market that makes up most transactions in the country. Prices are developer list prices before negotiation, and exclude registration and transaction costs, furnishing and service charges. There is no official per-square-metre index published for Oman, which is exactly why we publish ours.',
    ],
    heading: 'What the numbers say about buying in Oman',
    paras: [
      'The spread between the cheapest and the most expensive square metre in this index is roughly fourfold, and almost all of it is location rather than build quality. Waterfront and marina addresses in Muscat carry the highest rate per metre in the country; the newer inland master plans in Al Seeb sit at the bottom of the range while offering the largest floor areas for the money. Between those two poles sit the resort communities down the coast, where the same money buys a smaller home in a more scenic setting.',
      'Two patterns hold across almost every community. Small homes cost more per square metre than large ones, so a studio will always look expensive on this measure and a four bedroom villa cheap — compare the total price column before drawing conclusions. And villas trade at a lower rate per metre than apartments in the same district, because land-heavy product is priced against a different buyer. If you are working to a budget rather than a location, the price by bedroom table is the more useful of the two.',
    ],
    faq: [
      {
        q: 'What is the average price per square metre of property in Oman?',
        a: 'Across the freehold homes currently for sale in this inventory the median works out at the figure shown in the stat bar above, but the honest answer is that a single national average is close to meaningless: the range between the cheapest and most expensive community in the table is about fourfold. Use the community table to find the rate for the area you are actually considering.',
      },
      {
        q: 'Which area of Muscat is the most expensive per square metre?',
        a: 'Al Mouj (The Wave) is consistently the highest priced community per square metre in this inventory, followed by the other waterfront addresses. Sultan Haitham City in Al Seeb is consistently the lowest priced, which is why it accounts for the largest share of entry level purchases. The table above is re-sorted from live data every time the page loads.',
      },
      {
        q: 'Is this the official Oman property price index?',
        a: 'No. There is no official per square metre index published for Oman. This is a portfolio index calculated from Irfan Investment Group’s own available inventory of freehold homes inside Integrated Tourism Complexes. It is a real, current, verifiable sample of the market open to foreign buyers, and it is not a national statistic. Please cite it as such.',
      },
      {
        q: 'How often is the index updated?',
        a: 'It is recalculated from the live inventory database every time the page is loaded, and the static version of the page is rebuilt with the site. A unit that is reserved or sold leaves the index on its own, with no manual step, so the figures track our actual availability rather than a periodic snapshot.',
      },
      {
        q: 'Do these prices include fees, furnishing and service charges?',
        a: 'No. These are developer list prices for the home itself, before negotiation. Registration and transaction costs, furniture, and annual service or community charges are all additional, and they vary by development. Ask us for the full cost breakdown on any unit before you budget against these figures.',
      },
      {
        q: 'Can foreigners buy property at these prices in Oman?',
        a: 'Yes. Every home in this index sits inside an Integrated Tourism Complex, the zones where buyers of any nationality can take full freehold title registered at the Ministry of Housing. A purchase also qualifies the owner for a renewable Oman investor residency permit, and Oman levies no annual property tax and no tax on rental income.',
      },
    ],
    ctaHeading: 'Want the full price list behind these numbers?',
    ctaText: 'Every unit in this index is a real home you can view, with a floor plan, a payment plan and a reference number. Browse the live inventory or ask us for the breakdown for a specific community.',
    ctaBtn: 'Browse every property in Oman',
    linksHeading: 'Related pages',
    links: [
      { href: '/project', label: 'Search every property for sale in Oman' },
      { href: '/buy-property-in-muscat', label: 'Buy property in Muscat: communities and prices' },
      { href: '/buy-apartment-in-muscat', label: 'Buy an apartment in Muscat: entry prices by district' },
      { href: '/buy-property-in-salalah', label: 'Buy property in Salalah: beachfront villas and chalets' },
      { href: '/buy', label: 'Buy property in Oman: the full guide' },
    ],
  },

  fa: {
    eyebrow: 'عرفان اینوست · داده‌های بازار',
    h1: 'شاخص قیمت ملک در عمان',
    lead: 'قیمت واقعی هر مترمربع در عمان، منطقه به منطقه — محاسبه‌شده از {units} ملک فری‌هولد که هم‌اکنون در {areas} منطقه برای فروش موجود است. این یک شاخص سبد املاک ماست، نه میانگین ملی؛ پیش از استناد، روش محاسبه را بخوانید.',
    updatedLabel: 'به‌روزرسانی',
    stats: {
      units: 'واحد قیمت‌گذاری‌شده',
      areas: 'منطقه',
      median: 'میانه ریال عمان بر متر',
      entry: 'قیمت ورود',
    },
    areasHeading: 'قیمت هر مترمربع بر اساس منطقه',
    areasSub: 'از گران‌ترین به ارزان‌ترین. هر رقم، میانه واحدهای موجود همان منطقه در امروز است.',
    typesHeading: 'قیمت هر مترمربع بر اساس نوع ملک',
    typesSub: 'آپارتمان بیشترین سهم موجودی فری‌هولد را دارد؛ ویلا نرخ هر متر پایین‌تر ولی قیمت کل بالاتری دارد.',
    bedsHeading: 'قیمت بر اساس تعداد خواب',
    bedsSub: 'خانه‌های کوچک‌تر تقریباً همه‌جا هر متر گران‌ترند، چون هزینه ثابت آشپزخانه و سرویس روی متراژ کمتری پخش می‌شود.',
    projectsHeading: 'قیمت هر مترمربع بر اساس پروژه',
    projectsSub: 'همان جدول در سطح پروژه. هر نام به لیست قیمت زنده همان پروژه لینک است.',
    cols: {
      area: 'منطقه',
      city: 'شهر',
      project: 'پروژه',
      type: 'نوع',
      beds: 'خواب',
      units: 'واحد',
      medianPpsm: 'میانه ریال بر متر',
      rangePpsm: 'بازه ریال بر متر',
      medianPrice: 'میانه قیمت',
      from: 'از',
      typicalSize: 'متراژ معمول',
    },
    studio: 'استودیو',
    thinNote: '† کمتر از پنج واحد در این ردیف موجود است؛ آن را نشانه بدانید، نه نرخ.',
    ui: {
      metricPpsm: 'هر متر',
      metricTotal: 'میانه قیمت',
      communitiesHeading: 'مناطق در یک نگاه',
      communitiesSub: 'روی هر منطقه بزنید تا آگهی‌های زنده‌اش باز شود.',
      budgetHeading: 'با بودجه‌تان چه می‌خرید',
      budgetSub: 'اسلایدر را حرکت دهید تا ببینید چه بخشی از موجودی در دسترس شماست و کجا.',
      budgetLabel: 'بودجه شما',
      budgetHomes: 'ملک در این بودجه',
      budgetSize: 'میانه متراژ در این بودجه',
      budgetAreas: 'منطقه در دسترس',
      budgetTypes: 'نوع ملک',
      budgetNone: 'هنوز چیزی در این سطح در موجودی نیست. کمترین قیمت امروز در نوار آمار بالا آمده است.',
      budgetCta: 'دیدن این ملک‌ها',
      homes: 'ملک',
      from: 'از',
      viewListings: 'دیدن آگهی‌ها',
      sortHint: 'با هر ستون مرتب کنید',
    },
    methodHeading: 'روش محاسبه این شاخص',
    methodParas: [
      'داده‌ها موجودی زنده خود گروه سرمایه‌گذاری ایرفان است: هر واحدی که هم‌اکنون در عمان برای فروش داریم، {units} واحد در {projects} پروژه و {areas} منطقه، تا تاریخ {updated}. محاسبه از همان پایگاه داده‌ای انجام می‌شود که آگهی‌های سایت را تغذیه می‌کند، پس واحدی که فروخته شود خودبه‌خود از شاخص خارج می‌شود.',
      'قیمت هر مترمربع یعنی قیمت درخواستی تقسیم بر همان مساحتی که برای آن ملک منتشر می‌کنیم، پس هر رقم این صفحه را می‌توانید از خود صفحه آگهی بازتولید کنید. ما میانه را منتشر می‌کنیم نه میانگین، چون در غیر این صورت شارژ شدن موجودی یک پروژه بزرگ عدد اصلی را جابه‌جا می‌کرد. هر ردیف تعداد واحد پشت خود را نشان می‌دهد تا وزن رقم را خودتان بسنجید، و ردیف‌های با کمتر از پنج واحد علامت‌گذاری شده‌اند.',
      'دو استثنای عمدی. ملک‌هایی که مساحت ثبت‌شده‌شان بیشتر زمین اختصاصی است تا زیربنا — امروز {excluded} مورد، ویلا و خانه‌باغ‌هایی که با زمین فروخته می‌شوند — از ستون‌های قیمت هر متر کنار گذاشته شده‌اند، چون زمین و زیربنا با یک نرخ قیمت نمی‌خورند و آمیختن‌شان این خانه‌ها را چهار برابر ارزان‌تر از واقعیت نشان می‌داد. این‌ها همچنان در ستون تعداد و قیمت شمرده می‌شوند. واحدهایی که هنوز قیمت‌گذاری نشده‌اند به‌کلی کنار گذاشته می‌شوند.',
      'این شاخص سبد املاک ماست، نه سنجه رسمی بازار ملک عمان. فقط موجودی فری‌هولد داخل مجتمع‌های گردشگری یکپارچه (ITC) را پوشش می‌دهد، یعنی مناطقی که خارجی‌ها می‌توانند مالک کامل شوند؛ بنابراین درباره بازار اجاره‌داری بلندمدت و بازار شهروندان عمانی که بیشتر معاملات کشور را می‌سازد چیزی نمی‌گوید. قیمت‌ها لیست سازنده پیش از مذاکره است و هزینه ثبت و انتقال، مبلمان و شارژ خدمات را شامل نمی‌شود. برای عمان هیچ شاخص رسمی هر مترمربعی منتشر نمی‌شود، و دقیقاً به همین دلیل ما شاخص خودمان را منتشر می‌کنیم.',
    ],
    heading: 'این اعداد درباره خرید در عمان چه می‌گویند',
    paras: [
      'فاصله ارزان‌ترین تا گران‌ترین مترمربع در این شاخص حدود چهار برابر است و تقریباً همه‌اش موقعیت است نه کیفیت ساخت. آدرس‌های ساحلی و مارینا در مسقط بالاترین نرخ هر متر کشور را دارند؛ طرح‌های جامع جدیدتر داخل السیب پایین بازه‌اند و در ازای همان پول بیشترین متراژ را می‌دهند. میان این دو سر، مجموعه‌های تفریحی امتداد ساحل قرار دارند که همان پول در آن‌ها خانه کوچک‌تری در منظره‌ای بهتر می‌خرد.',
      'دو الگو تقریباً در همه مناطق برقرار است. خانه کوچک هر متر گران‌تر از خانه بزرگ است، پس استودیو با این معیار همیشه گران و ویلای چهارخوابه ارزان به نظر می‌رسد؛ پیش از نتیجه‌گیری ستون قیمت کل را ببینید. و ویلا در همان منطقه نرخ هر متر پایین‌تری از آپارتمان دارد، چون محصول زمین‌محور برای خریدار دیگری قیمت‌گذاری می‌شود. اگر بودجه معیار شماست نه منطقه، جدول قیمت بر اساس خواب کاربردی‌تر است.',
    ],
    faq: [
      {
        q: 'میانگین قیمت هر مترمربع ملک در عمان چقدر است؟',
        a: 'در میان املاک فری‌هولد موجود در این سبد، میانه همان رقمی است که در نوار آمار بالا می‌بینید؛ اما پاسخ صادقانه این است که یک میانگین ملی تقریباً بی‌معناست: فاصله ارزان‌ترین تا گران‌ترین منطقه جدول حدود چهار برابر است. برای منطقه‌ای که واقعاً در نظر دارید، از جدول مناطق استفاده کنید.',
      },
      {
        q: 'گران‌ترین منطقه مسقط بر حسب متر کدام است؟',
        a: 'الموج (The Wave) به‌طور پیوسته گران‌ترین منطقه هر متر در این سبد است و پس از آن سایر آدرس‌های ساحلی. شهر سلطان هیثم در السیب همواره ارزان‌ترین است و به همین دلیل بیشترین سهم خریدهای سطح ورودی را دارد. جدول بالا با هر بار باز شدن صفحه از داده زنده دوباره مرتب می‌شود.',
      },
      {
        q: 'آیا این شاخص رسمی قیمت ملک عمان است؟',
        a: 'خیر. برای عمان هیچ شاخص رسمی هر مترمربعی منتشر نمی‌شود. این یک شاخص سبد است که از موجودی خود گروه سرمایه‌گذاری ایرفان از املاک فری‌هولد داخل مجتمع‌های ITC محاسبه می‌شود. نمونه‌ای واقعی، به‌روز و قابل راستی‌آزمایی از بخشی از بازار است که به روی خریدار خارجی باز است، و یک آمار ملی نیست. لطفاً با همین عنوان به آن استناد کنید.',
      },
      {
        q: 'این شاخص هر چند وقت به‌روز می‌شود؟',
        a: 'با هر بار باز شدن صفحه از پایگاه داده موجودی زنده دوباره محاسبه می‌شود و نسخه ایستای صفحه همراه هر بیلد سایت بازسازی می‌شود. واحدی که رزرو یا فروخته شود بدون هیچ اقدام دستی از شاخص خارج می‌شود، پس ارقام موجودی واقعی ما را دنبال می‌کنند نه یک عکس فوری دوره‌ای.',
      },
      {
        q: 'آیا این قیمت‌ها شامل هزینه‌ها، مبلمان و شارژ خدمات است؟',
        a: 'خیر. این‌ها قیمت لیست سازنده برای خود ملک و پیش از مذاکره است. هزینه ثبت و انتقال، مبلمان و شارژ سالانه خدمات یا مجموعه همگی جداگانه‌اند و بسته به پروژه فرق می‌کنند. پیش از بودجه‌بندی بر پایه این ارقام، ریز کل هزینه‌های هر واحد را از ما بخواهید.',
      },
      {
        q: 'آیا خارجی‌ها می‌توانند با همین قیمت‌ها در عمان ملک بخرند؟',
        a: 'بله. هر ملکی در این شاخص داخل یک مجتمع گردشگری یکپارچه است، یعنی مناطقی که خریدار از هر ملیتی می‌تواند سند کامل فری‌هولد ثبت‌شده در وزارت مسکن بگیرد. خرید همچنین اقامت سرمایه‌گذاری قابل تمدید عمان را برای مالک به همراه دارد و عمان نه مالیات سالانه ملک دارد و نه مالیات بر درآمد اجاره.',
      },
    ],
    ctaHeading: 'لیست کامل قیمت پشت این اعداد را می‌خواهید؟',
    ctaText: 'هر واحد در این شاخص یک ملک واقعی و قابل بازدید است، با نقشه، شرایط پرداخت و کد پیگیری. موجودی زنده را ببینید یا ریز قیمت یک منطقه مشخص را از ما بخواهید.',
    ctaBtn: 'مشاهدهٔ همهٔ املاک عمان',
    linksHeading: 'صفحات مرتبط',
    links: [
      { href: '/project', label: 'جستجوی همه املاک برای فروش در عمان' },
      { href: '/buy-property-in-muscat', label: 'خرید ملک در مسقط: مناطق و قیمت‌ها' },
      { href: '/buy-apartment-in-muscat', label: 'خرید آپارتمان در مسقط: قیمت ورودی هر منطقه' },
      { href: '/buy-property-in-salalah', label: 'خرید ملک در صلاله: ویلا و شاله ساحلی' },
      { href: '/buy', label: 'خرید ملک در عمان: راهنمای کامل' },
    ],
  },

  ar: {
    eyebrow: 'عرفان للاستثمار · بيانات السوق',
    h1: 'مؤشر أسعار العقارات في عُمان',
    lead: 'كم يكلّف المتر المربع فعلياً في عُمان، منطقة بمنطقة — محتسب من {units} وحدة تملّك حر معروضة للبيع حالياً في {areas} مناطق. هذا مؤشر لمحفظتنا وليس متوسطاً وطنياً: اقرأ المنهجية قبل الاقتباس.',
    updatedLabel: 'آخر تحديث',
    stats: {
      units: 'وحدة مسعّرة',
      areas: 'منطقة',
      median: 'وسيط ر.ع / م²',
      entry: 'سعر الدخول',
    },
    areasHeading: 'سعر المتر المربع حسب المنطقة',
    areasSub: 'مرتّبة من الأغلى إلى الأرخص. كل رقم هو وسيط الوحدات المعروضة في تلك المنطقة اليوم.',
    typesHeading: 'سعر المتر المربع حسب نوع العقار',
    typesSub: 'الشقق تشكّل معظم مخزون التملّك الحر؛ الفلل بسعر أقل للمتر لكن بقيمة إجمالية أعلى.',
    bedsHeading: 'السعر حسب عدد الغرف',
    bedsSub: 'المنازل الأصغر أغلى للمتر في كل مكان تقريباً، لأن التكلفة الثابتة للمطبخ ودورة المياه تتوزع على مساحة أقل.',
    projectsHeading: 'سعر المتر المربع حسب المشروع',
    projectsSub: 'الجدول نفسه على مستوى المشروع. كل اسم يقود إلى قائمة الأسعار الحية لذلك المشروع.',
    cols: {
      area: 'المنطقة',
      city: 'المدينة',
      project: 'المشروع',
      type: 'النوع',
      beds: 'الغرف',
      units: 'الوحدات',
      medianPpsm: 'وسيط ر.ع / م²',
      rangePpsm: 'المدى ر.ع / م²',
      medianPrice: 'وسيط السعر',
      from: 'من',
      typicalSize: 'المساحة المعتادة',
    },
    studio: 'استوديو',
    thinNote: '† أقل من خمس وحدات معروضة في هذا الصف — اقرأه كمؤشر لا كسعر سوق.',
    ui: {
      metricPpsm: 'للمتر',
      metricTotal: 'وسيط السعر',
      communitiesHeading: 'المناطق في لمحة',
      communitiesSub: 'اضغط على أي منطقة لفتح إعلاناتها المباشرة.',
      budgetHeading: 'ماذا تشتري بميزانيتك',
      budgetSub: 'حرّك المؤشر لترى كم من المخزون في متناولك، وأين.',
      budgetLabel: 'ميزانيتك',
      budgetHomes: 'وحدة ضمن الميزانية',
      budgetSize: 'وسيط المساحة عند هذه الميزانية',
      budgetAreas: 'منطقة في المتناول',
      budgetTypes: 'نوع عقار',
      budgetNone: 'لا يوجد شيء في المخزون عند هذا المستوى بعد. أقل سعر مطلوب اليوم مذكور في شريط الإحصاءات أعلاه.',
      budgetCta: 'شاهد هذه الوحدات',
      homes: 'وحدة',
      from: 'من',
      viewListings: 'عرض الإعلانات',
      sortHint: 'رتّب حسب أي عمود',
    },
    methodHeading: 'كيف يُحتسب هذا المؤشر',
    methodParas: [
      'البيانات هي مخزون مجموعة عرفان للاستثمار نفسه: كل وحدة متاحة لدينا للبيع في عُمان، وعددها {units} وحدة في {projects} مشاريع و{areas} مناطق، حتى {updated}. تُحتسب من قاعدة البيانات ذاتها التي تغذّي إعلاناتنا، فالوحدة التي تُباع تخرج من المؤشر تلقائياً.',
      'سعر المتر المربع هو ببساطة السعر المطلوب مقسوماً على المساحة التي ننشرها لتلك الوحدة، فيمكنك إعادة احتساب أي رقم هنا من صفحة الإعلان نفسها. ننشر الوسيط لا المتوسط، لأن إعادة طرح مشروع كبير واحد كانت ستحرّك الرقم الرئيسي. يُظهر كل صف عدد الوحدات خلفه لتحكم بنفسك على وزن الرقم، والصفوف المبنية على أقل من خمس وحدات مُعلَّمة.',
      'استثناءان متعمدان. الوحدات التي تشكّل الأرض الخاصة معظم مساحتها المسجّلة بدل المساحة المبنية — وعددها اليوم {excluded}، وهي فلل وبيوت مزارع تُباع مع أرضها — مستبعدة من أعمدة سعر المتر، لأن الأرض والمساحة المبنية لا تُسعَّران بالمعدل نفسه وخلطهما كان سيُظهر هذه المنازل أرخص بأربعة أضعاف مما هي عليه. وتبقى محسوبة في عمودي عدد الوحدات والسعر. أما الوحدات التي لم نسعّرها بعد فمستبعدة تماماً.',
      'هذا مؤشر لمحفظتنا وليس قياساً رسمياً لسوق العقار العُماني. يغطي فقط مخزون التملّك الحر داخل المجمعات السياحية المتكاملة، أي المناطق التي يملك فيها الأجانب ملكية كاملة، ولذلك لا يقول شيئاً عن سوق حق الانتفاع وسوق المواطنين العُمانيين الذي يشكّل معظم الصفقات في البلاد. الأسعار هي أسعار قوائم المطورين قبل التفاوض، ولا تشمل رسوم التسجيل والمعاملات ولا التأثيث ولا رسوم الخدمات. لا يوجد مؤشر رسمي لسعر المتر في عُمان، ولهذا بالذات ننشر مؤشرنا.',
    ],
    heading: 'ماذا تقول الأرقام عن الشراء في عُمان',
    paras: [
      'الفارق بين أرخص متر وأغلاه في هذا المؤشر نحو أربعة أضعاف، ومعظمه موقع لا جودة بناء. عناوين الواجهة البحرية والمارينا في مسقط تحمل أعلى سعر للمتر في البلاد؛ أما المخططات الداخلية الأحدث في السيب فتقع في أسفل المدى وتمنح أكبر مساحة مقابل المال. وبين الطرفين تقع مجتمعات المنتجعات على الساحل، حيث يشتري المبلغ نفسه منزلاً أصغر في موقع أجمل.',
      'هناك نمطان يصحّان في كل منطقة تقريباً. المنازل الصغيرة أغلى للمتر من الكبيرة، فالاستوديو يبدو دائماً غالياً بهذا المقياس والفيلا بأربع غرف تبدو رخيصة — راجع عمود السعر الإجمالي قبل الحكم. والفلل تُسعَّر للمتر بأقل من الشقق في المنطقة نفسها لأن المنتج القائم على الأرض يُسعَّر لمشترٍ مختلف. إن كنت تعمل ضمن ميزانية لا موقع محدد، فجدول السعر حسب الغرف أنفع لك.',
    ],
    faq: [
      {
        q: 'كم متوسط سعر المتر المربع للعقارات في عُمان؟',
        a: 'وسيط الوحدات المعروضة في هذه المحفظة هو الرقم الظاهر في شريط الإحصاءات أعلاه، لكن الإجابة الصادقة أن أي متوسط وطني واحد يكاد يكون بلا معنى: الفارق بين أرخص وأغلى منطقة في الجدول نحو أربعة أضعاف. استخدم جدول المناطق لمعرفة سعر المنطقة التي تفكّر فيها فعلاً.',
      },
      {
        q: 'ما أغلى مناطق مسقط لسعر المتر؟',
        a: 'الموج (The Wave) هي باستمرار أغلى منطقة للمتر في هذه المحفظة، تليها بقية عناوين الواجهة البحرية. ومدينة السلطان هيثم في السيب هي الأرخص باستمرار، ولذلك تستحوذ على أكبر حصة من مشتريات مستوى الدخول. ويعاد ترتيب الجدول أعلاه من البيانات الحية عند كل فتح للصفحة.',
      },
      {
        q: 'هل هذا هو المؤشر الرسمي لأسعار العقارات في عُمان؟',
        a: 'لا. لا يوجد مؤشر رسمي منشور لسعر المتر في عُمان. هذا مؤشر محفظة يُحتسب من مخزون مجموعة عرفان للاستثمار من وحدات التملّك الحر داخل المجمعات السياحية المتكاملة. إنه عيّنة حقيقية وحديثة وقابلة للتحقق من الشريحة المفتوحة للمشتري الأجنبي، وليس إحصاءً وطنياً. يرجى الاقتباس منه بهذا الوصف.',
      },
      {
        q: 'كم مرة يُحدَّث المؤشر؟',
        a: 'يُعاد احتسابه من قاعدة بيانات المخزون الحية عند كل تحميل للصفحة، وتُعاد كتابة النسخة الثابتة مع كل بناء للموقع. الوحدة التي تُحجز أو تُباع تخرج من المؤشر من تلقاء نفسها دون أي خطوة يدوية، فالأرقام تتبع توافرنا الفعلي لا لقطة دورية.',
      },
      {
        q: 'هل تشمل هذه الأسعار الرسوم والتأثيث ورسوم الخدمات؟',
        a: 'لا. هذه أسعار قوائم المطور للوحدة نفسها قبل التفاوض. أما رسوم التسجيل والمعاملات والأثاث ورسوم الخدمات أو المجتمع السنوية فكلها إضافية وتختلف بين مشروع وآخر. اطلب منّا التفصيل الكامل للتكلفة على أي وحدة قبل أن تبني ميزانيتك على هذه الأرقام.',
      },
      {
        q: 'هل يستطيع الأجانب الشراء بهذه الأسعار في عُمان؟',
        a: 'نعم. كل وحدة في هذا المؤشر تقع داخل مجمع سياحي متكامل، أي المناطق التي يحصل فيها المشتري من أي جنسية على تملّك حر كامل مسجَّل في وزارة الإسكان. كما يؤهل الشراء المالك لإقامة مستثمر عُمانية قابلة للتجديد، ولا تفرض عُمان ضريبة سنوية على العقار ولا ضريبة على دخل الإيجار.',
      },
    ],
    ctaHeading: 'تريد قائمة الأسعار الكاملة خلف هذه الأرقام؟',
    ctaText: 'كل وحدة في هذا المؤشر عقار حقيقي يمكن معاينته، بمخطط وخطة سداد ورقم مرجعي. تصفّح المخزون الحي أو اطلب منّا تفصيل منطقة بعينها.',
    ctaBtn: 'تصفح جميع عقارات عُمان',
    linksHeading: 'صفحات ذات صلة',
    links: [
      { href: '/project', label: 'ابحث في جميع العقارات المعروضة للبيع في عُمان' },
      { href: '/buy-property-in-muscat', label: 'شراء عقار في مسقط: المناطق والأسعار' },
      { href: '/buy-apartment-in-muscat', label: 'شراء شقة في مسقط: أسعار الدخول حسب المنطقة' },
      { href: '/buy-property-in-salalah', label: 'شراء عقار في صلالة: فلل وشاليهات شاطئية' },
      { href: '/buy', label: 'شراء عقار في عُمان: الدليل الكامل' },
    ],
  },

  ru: {
    eyebrow: 'Irfan Investment · Данные рынка',
    h1: 'Индекс цен на недвижимость Омана',
    lead: 'Сколько на самом деле стоит квадратный метр в Омане, район за районом — расчёт по {units} объектам во фрихолде, выставленным на продажу сейчас в {areas} районах. Это индекс нашего портфеля, а не средняя по стране: прочитайте методику, прежде чем цитировать.',
    updatedLabel: 'Обновлено',
    stats: {
      units: 'объектов в расчёте',
      areas: 'районов',
      median: 'медиана OMR / м²',
      entry: 'цена входа',
    },
    areasHeading: 'Цена квадратного метра по районам',
    areasSub: 'От самого дорогого к самому доступному. Каждая цифра — медиана объектов, выставленных в этом районе сегодня.',
    typesHeading: 'Цена квадратного метра по типу недвижимости',
    typesSub: 'Квартиры составляют основную часть фрихолд-предложения; виллы дешевле за метр, но дороже целиком.',
    bedsHeading: 'Цена по количеству спален',
    bedsSub: 'Небольшие объекты почти везде дороже за метр: фиксированная стоимость кухни и санузла раскладывается на меньшую площадь.',
    projectsHeading: 'Цена квадратного метра по проектам',
    projectsSub: 'Та же таблица на уровне проекта. Каждое название ведёт к актуальному прайсу проекта.',
    cols: {
      area: 'Район',
      city: 'Город',
      project: 'Проект',
      type: 'Тип',
      beds: 'Спальни',
      units: 'Объектов',
      medianPpsm: 'Медиана OMR / м²',
      rangePpsm: 'Диапазон OMR / м²',
      medianPrice: 'Медианная цена',
      from: 'От',
      typicalSize: 'Типичная площадь',
    },
    studio: 'Студия',
    thinNote: '† В этой строке меньше пяти объектов — читайте её как ориентир, а не как ставку рынка.',
    ui: {
      metricPpsm: 'За м²',
      metricTotal: 'Медианная цена',
      communitiesHeading: 'Районы с одного взгляда',
      communitiesSub: 'Нажмите на район, чтобы открыть его актуальные лоты.',
      budgetHeading: 'Что купит ваш бюджет',
      budgetSub: 'Двигайте ползунок, чтобы увидеть, какая часть предложения вам доступна и где.',
      budgetLabel: 'Ваш бюджет',
      budgetHomes: 'объектов в бюджете',
      budgetSize: 'медианная площадь при таком бюджете',
      budgetAreas: 'районов в доступе',
      budgetTypes: 'типов недвижимости',
      budgetNone: 'На этом уровне в предложении пока ничего нет. Минимальная цена на сегодня указана в строке статистики выше.',
      budgetCta: 'Посмотреть эти объекты',
      homes: 'объектов',
      from: 'от',
      viewListings: 'Смотреть лоты',
      sortHint: 'Сортировка по любому столбцу',
    },
    methodHeading: 'Как рассчитан индекс',
    methodParas: [
      'Источник данных — собственный актуальный портфель Irfan Investment Group: все объекты, доступные у нас к продаже в Омане, {units} штук в {projects} проектах и {areas} районах, по состоянию на {updated}. Расчёт идёт из той же базы, что питает наши объявления, поэтому проданный объект выпадает из индекса автоматически.',
      'Цена за квадратный метр — это цена предложения, делённая на ту площадь, которую мы публикуем для этого объекта, поэтому любую цифру отсюда можно перепроверить прямо на странице лота. Мы публикуем медиану, а не среднее: иначе пополнение одного крупного проекта смещало бы итоговую цифру. В каждой строке указано число объектов за ней, чтобы вы сами оценили вес значения, а строки менее чем из пяти объектов помечены.',
      'Два намеренных исключения. Объекты, у которых бо́льшую часть зарегистрированной площади составляет собственный участок, а не площадь дома — сегодня их {excluded}, это виллы и фермерские дома, продаваемые с землёй, — исключены из колонок цены за метр: земля и дом не стоят одинаково за метр, и их смешение делало бы такие объекты вчетверо дешевле, чем они есть. В колонках количества и цены они остаются. Объекты без цены исключены полностью.',
      'Это индекс портфеля, а не официальная оценка рынка недвижимости Омана. Он охватывает только фрихолд внутри интегрированных туристических комплексов — зон, где иностранцы могут владеть недвижимостью полностью, — и потому ничего не говорит о рынке долгосрочной аренды прав и о рынке граждан Омана, на который приходится большинство сделок в стране. Цены — прайс застройщика до переговоров, без учёта регистрационных и транзакционных расходов, меблировки и сервисных сборов. Официального индекса цены за метр в Омане не публикуется — именно поэтому мы публикуем свой.',
    ],
    heading: 'Что цифры говорят о покупке в Омане',
    paras: [
      'Разрыв между самым дешёвым и самым дорогим метром в индексе — примерно четырёхкратный, и почти весь он объясняется локацией, а не качеством строительства. Набережные и марины Маската держат самую высокую ставку за метр в стране; более новые мастер-планы вглубь материка в Эс-Сибе находятся внизу диапазона и дают наибольшую площадь за те же деньги. Между этими полюсами — курортные комьюнити вдоль побережья, где та же сумма покупает меньший дом в более живописном месте.',
      'Две закономерности работают почти в каждом районе. Маленькие объекты дороже за метр, чем большие, поэтому студия по этому показателю всегда выглядит дорогой, а вилла с четырьмя спальнями — дешёвой: смотрите на колонку полной цены. И виллы стоят за метр меньше, чем квартиры в том же районе, потому что продукт с землёй ориентирован на другого покупателя. Если вы отталкиваетесь от бюджета, а не от локации, таблица по спальням полезнее.',
    ],
    faq: [
      {
        q: 'Какова средняя цена за квадратный метр недвижимости в Омане?',
        a: 'По объектам, выставленным в этом портфеле, медиана равна значению в строке статистики выше, но честный ответ в том, что единая средняя по стране почти бессмысленна: разрыв между самым дешёвым и самым дорогим районом в таблице примерно четырёхкратный. Пользуйтесь таблицей по районам для того района, который рассматриваете.',
      },
      {
        q: 'Какой район Маската самый дорогой за метр?',
        a: 'Al Mouj (The Wave) стабильно самый дорогой район за квадратный метр в этом портфеле, за ним идут другие адреса у воды. Sultan Haitham City в Эс-Сибе стабильно самый доступный, поэтому на него приходится наибольшая доля покупок начального уровня. Таблица выше пересортировывается по живым данным при каждой загрузке страницы.',
      },
      {
        q: 'Это официальный индекс цен на недвижимость Омана?',
        a: 'Нет. Официального индекса цены за квадратный метр в Омане не публикуется. Это индекс портфеля, рассчитанный по собственному предложению Irfan Investment Group во фрихолде внутри интегрированных туристических комплексов. Это реальная, актуальная и проверяемая выборка того сегмента, который открыт иностранному покупателю, и это не национальная статистика. Просим ссылаться на него именно так.',
      },
      {
        q: 'Как часто обновляется индекс?',
        a: 'Он пересчитывается из живой базы предложения при каждой загрузке страницы, а статическая версия перестраивается вместе с сайтом. Забронированный или проданный объект выпадает из индекса сам, без ручных действий, поэтому цифры отражают нашу реальную доступность, а не периодический срез.',
      },
      {
        q: 'Включают ли эти цены сборы, меблировку и сервисные платежи?',
        a: 'Нет. Это прайс застройщика за сам объект, до переговоров. Регистрационные и транзакционные расходы, мебель, ежегодные сервисные и общинные сборы оплачиваются дополнительно и отличаются от проекта к проекту. Запросите у нас полную смету по конкретному лоту, прежде чем строить бюджет на этих цифрах.',
      },
      {
        q: 'Могут ли иностранцы покупать по этим ценам в Омане?',
        a: 'Да. Каждый объект в индексе находится внутри интегрированного туристического комплекса — зоны, где покупатель любой национальности получает полное право собственности, зарегистрированное в Министерстве жилищного строительства. Покупка также даёт право на продлеваемую инвесторскую резиденцию Омана, а ежегодного налога на недвижимость и налога на доход от аренды в Омане нет.',
      },
    ],
    ctaHeading: 'Нужен полный прайс, стоящий за этими цифрами?',
    ctaText: 'Каждый объект в индексе — реальный дом, который можно посмотреть, с планировкой, планом оплаты и референс-номером. Откройте живой каталог или запросите разбивку по конкретному району.',
    ctaBtn: 'Вся недвижимость Омана',
    linksHeading: 'Смежные страницы',
    links: [
      { href: '/project', label: 'Поиск по всей недвижимости на продажу в Омане' },
      { href: '/buy-property-in-muscat', label: 'Купить недвижимость в Маскате: районы и цены' },
      { href: '/buy-apartment-in-muscat', label: 'Купить квартиру в Маскате: цены входа по районам' },
      { href: '/buy-property-in-salalah', label: 'Купить недвижимость в Салале: виллы и шале у моря' },
      { href: '/buy', label: 'Купить недвижимость в Омане: полный гид' },
    ],
  },
}

export const priceIndexCopy = (lang) => PRICE_INDEX[lang] || PRICE_INDEX.en

const SITE = 'https://www.irfaninvest.com'
const PATH = '/property-prices-in-oman'
const urlFor = (lang) => `${SITE}${lang === 'en' ? '' : `/${lang}`}${PATH}`

export function priceIndexFaqJsonLd(lang) {
  const c = priceIndexCopy(lang)
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

/**
 * Dataset + Breadcrumb. `Dataset` is the schema type Google uses for its
 * dataset surfaces and is what makes a figures page citable rather than just
 * another listing page — it is the reason this page exists.
 * `index` comes from buildPriceIndex(); `updated` is an ISO date string.
 */
export function priceIndexJsonLd(lang, index, updated) {
  const c = priceIndexCopy(lang)
  const url = urlFor(lang)
  const vars = { units: index?.units ?? 0, areas: index?.areas ?? 0, projects: index?.projects ?? 0, updated }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        '@id': `${url}#dataset`,
        url,
        name: c.h1,
        description: fill(c.lead, vars),
        license: 'https://creativecommons.org/licenses/by/4.0/',
        isAccessibleForFree: true,
        creator: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        dateModified: updated,
        temporalCoverage: updated,
        spatialCoverage: { '@type': 'Place', name: 'Oman', address: { '@type': 'PostalAddress', addressCountry: 'OM' } },
        measurementTechnique: 'Median asking price per square metre of total area, computed over available freehold inventory',
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Median price per square metre', unitText: 'OMR/m²', ...(index?.overall?.medianPpsm ? { value: index.overall.medianPpsm } : {}) },
          { '@type': 'PropertyValue', name: 'Median asking price', unitText: 'OMR', ...(index?.overall?.medianPrice ? { value: index.overall.medianPrice } : {}) },
          { '@type': 'PropertyValue', name: 'Units in sample', ...(index?.units ? { value: index.units } : {}) },
        ],
        keywords: ['Oman property prices', 'price per square metre Oman', 'Muscat property prices', 'Oman real estate market data'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}${lang === 'en' ? '' : `/${lang}`}/` },
          { '@type': 'ListItem', position: 2, name: 'Properties for Sale in Oman', item: `${SITE}${lang === 'en' ? '' : `/${lang}`}/project` },
          { '@type': 'ListItem', position: 3, name: PRICE_INDEX.en.h1, item: url },
        ],
      },
    ],
  }
}
