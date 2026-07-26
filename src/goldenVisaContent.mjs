// goldenVisaContent.mjs — copy for /oman-golden-visa, in 4 languages.
//
// Shared between src/pages/GoldenVisaPage.jsx (runtime) and
// prerender-routes.mjs (build time). Plain data module: no JSX.
//
// SAME TWO RULES as priceIndexContent.mjs, for the same reasons:
//  1. NO hard figures in the prose. Unit counts and prices are computed from
//     live inventory and interpolated as {qualify5} {qualify10} {units} etc.
//     A number typed into a sentence goes stale the day stock moves.
//  2. The honest caveat is not a footnote. Most of our inventory does NOT
//     meet the Golden Residency threshold, and the page says so in the lead,
//     in the routes section AND in the FAQ. A visa page that oversells is
//     both a policy risk and a refund conversation later.
//
// THE ONE THING THIS PAGE MUST NEVER DO is blur the two residency routes:
//   • Oman Golden (Long Term) Residency — 5 years at OMR 250,000, 10 years at
//     OMR 500,000, per omanresidence.gov.om.
//   • Property-linked investor residency — available on an ITC purchase at any
//     value, renewable, but it is NOT the Golden Residency.
// Conflating them is the single most common error in this niche's marketing.

export const TOKEN_KEYS = ['units', 'qualify5', 'qualify10', 'areas', 'projects', 'entry', 'tier5', 'tier10', 'updated']

export function fill(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars?.[k] != null ? String(vars[k]) : m))
}

export const GOLDEN_VISA = {
  en: {
    eyebrow: 'Irfan Investment · Residency',
    h1: 'Oman Golden Visa Through Property',
    lead: 'Oman grants long term residency to foreign buyers who invest at the published thresholds, and a separate renewable residency to anyone who buys inside an Integrated Tourism Complex. Of the {units} homes we currently have for sale, {qualify5} meet the five year threshold and {qualify10} meet the ten year one. Read which route applies to you before you budget.',
    updatedLabel: 'Inventory checked',
    stats: {
      qualify5: 'homes qualify, 5 year',
      qualify10: 'homes qualify, 10 year',
      tier5: 'five year threshold',
      entry: 'lowest qualifying price',
    },

    routesHeading: 'Two different residencies, often confused',
    routesSub: 'Both come from buying property in Oman. They are not the same permit and they do not need the same budget.',
    routes: [
      {
        name: 'Oman Golden Residency',
        sub: 'Long term, investment threshold applies',
        body: 'Granted against a qualifying investment at the published thresholds: five years from {tier5} and ten years from {tier10}. It is renewable, it can include immediate family, and it is the permit people mean when they say Oman golden visa. In our current list {qualify5} homes clear the five year threshold and {qualify10} clear the ten year one.',
      },
      {
        name: 'Property linked investor residency',
        sub: 'Available on any ITC purchase',
        body: 'Buying freehold inside an Integrated Tourism Complex carries its own renewable residency for the owner, with no minimum in the hundreds of thousands. This is the route most of our buyers actually use, because our entry price is {entry} while the Golden Residency starts at {tier5}. It is a real residency permit. It is not the Golden Residency, and anyone who tells you otherwise is selling.',
      },
    ],

    qualifyHeading: 'Which of our homes qualify',
    qualifySub: 'Computed from the units we have available today, at the two published thresholds. Every row carries its count so you can see how thin or deep the choice is.',
    cols: {
      area: 'Community',
      city: 'City',
      tier: 'Threshold',
      units: 'Homes',
      from: 'From',
      median: 'Median price',
      type: 'Type',
    },
    tier5Label: 'Five year',
    tier10Label: 'Ten year',
    noneRow: 'No qualifying homes in this community today',

    ownershipHeading: 'Where foreigners can actually buy',
    ownershipParas: [
      'Foreign nationals may take full freehold title in Oman inside designated Integrated Tourism Complexes, and only there. This is not a technicality to skim past: a property outside an ITC cannot give you freehold title as a foreign buyer, whatever the price, and therefore cannot support a residency application built on ownership. Every home in our list sits inside an ITC.',
      'Title is registered with the Ministry of Housing in your own name. Ownership is not time limited and it passes to your heirs. Oman levies no annual property tax and no tax on rental income, which is a large part of why the yield maths works here at all.',
      'A purchase does not make you an Omani citizen and there is no route from property to citizenship. Residency is residency: it lets you live in the country, sponsor immediate family and come and go without a visit visa. Treat anyone marketing an Omani passport against a property purchase as a warning sign.',
    ],

    processHeading: 'How the process runs',
    processSub: 'The order matters. Residency follows ownership, not the other way round.',
    steps: [
      { n: '01', t: 'Choose a qualifying home', d: 'If the Golden Residency is the goal, the price has to clear the threshold on its own. We will tell you plainly when a unit you like does not qualify.' },
      { n: '02', t: 'Reserve and pay', d: 'A reservation agreement, then the payment plan for that development. Off plan and ready stock follow different schedules.' },
      { n: '03', t: 'Register the title', d: 'Title is registered at the Ministry of Housing in your name. This is the document the residency application rests on.' },
      { n: '04', t: 'Apply for residency', d: 'The application goes in against the registered title, with the usual identity, medical and background paperwork. We prepare and submit the file.' },
      { n: '05', t: 'Add your family', d: 'Immediate family are added as dependants once the principal permit is issued.' },
    ],

    heading: 'What this actually buys you',
    paras: [
      'The honest case for Oman is not that it is the cheapest residency in the Gulf. It is that the entry ticket is low, the ownership is real freehold rather than a lease, the running costs are unusually light because there is no annual property tax and no tax on rental income, and the country is not yet crowded with foreign buyers. That last point is the part that expires.',
      'The honest case against is just as short. Thresholds and rules are set by the government and can move, our list is a portfolio rather than the whole market, and a residency that depends on ownership ends if you sell. Anyone who presents a property purchase as a guaranteed permit is overselling a process that has conditions.',
    ],

    faqHeading: 'Frequently asked questions',
    tableNote: 'Thresholds are {tier5} for five years and {tier10} for ten, counted over the {units} homes available today. A community with fewer than five qualifying homes is flagged, because a choice of two is barely a choice.',
    faq: [
      {
        q: 'How much do I need to invest for the Oman golden visa?',
        a: 'The published thresholds are {tier5} for five year residency and {tier10} for ten year residency. Of the homes we have available today, {qualify5} clear the five year threshold and {qualify10} clear the ten year one. Cheaper homes still carry the separate ITC investor residency, which is a different permit.',
      },
      {
        q: 'Can any nationality buy property in Oman?',
        a: 'Yes, inside a designated Integrated Tourism Complex. Buyers of any nationality can take full freehold title there, registered at the Ministry of Housing, with no local partner and no time limit on ownership. Outside those zones foreign freehold is not available.',
      },
      {
        q: 'Does buying property in Oman give me citizenship?',
        a: 'No. There is no route from property ownership to Omani citizenship. What a qualifying purchase gives you is renewable residency for yourself and your immediate family. Be careful with anyone marketing a passport.',
      },
      {
        q: 'Does the residency cover my family?',
        a: 'Immediate family are added as dependants on the principal holder’s permit once it is issued. Bring the family documents with you at application time rather than afterwards, it is considerably faster.',
      },
      {
        q: 'What happens to my residency if I sell the property?',
        a: 'The residency is tied to the qualifying investment. If you sell and hold nothing else that qualifies, the basis for the permit goes with it. Plan the exit and the permit together rather than separately.',
      },
      {
        q: 'Do I have to live in Oman to keep it?',
        a: 'The permit does not require you to relocate, which is why a large share of buyers use it as a second base rather than a full move. Confirm the current residence conditions with us before you rely on that for planning, since these are set by the government and do change.',
      },
      {
        q: 'Are there taxes on the property or the rent?',
        a: 'Oman levies no annual property tax and no tax on rental income. Registration and transaction costs, furnishing and annual service charges are separate and vary by development, so ask for the full cost sheet on any unit before you budget against a headline price.',
      },
      {
        q: 'Is the cheapest home on your list enough for the golden visa?',
        a: 'No. Our entry price is {entry}, well under the {tier5} five year threshold. That home is an excellent purchase and it carries ITC investor residency, but it is not a Golden Residency. We would rather say so here than at the signing table.',
      },
    ],

    ctaHeading: 'Find out which homes qualify for you',
    ctaText: 'Tell us your budget and we will come back with the units that clear the threshold you are aiming at, the ones that do not, and the honest difference between the two routes.',
    ctaBtn: 'Browse qualifying properties',

    linksHeading: 'Related pages',
    links: [
      { href: '/project', label: 'Search every property for sale in Oman' },
      { href: '/property-prices-in-oman', label: 'Oman property prices: what a square metre costs by area' },
      { href: '/buy-property-in-muscat', label: 'Buy property in Muscat: communities and prices' },
      { href: '/buy', label: 'Buy property in Oman: the full guide' },
      { href: '/invest', label: 'Company registration and business setup in Oman' },
    ],
  },

  fa: {
    eyebrow: 'عرفان اینوست · اقامت',
    h1: 'گلدن ویزای عمان از راه خرید ملک',
    lead: 'عمان به خریداران خارجی که در آستانه‌های اعلام‌شده سرمایه‌گذاری کنند اقامت بلندمدت می‌دهد، و جدا از آن، به هر کسی که داخل مجتمع گردشگری یکپارچه (ITC) ملک بخرد اقامت قابل تمدید می‌دهد. از {units} ملکی که هم‌اکنون برای فروش داریم، {qualify5} واحد آستانه پنج‌ساله و {qualify10} واحد آستانه ده‌ساله را پوشش می‌دهند. پیش از بودجه‌بندی، بخوانید کدام مسیر به شما مربوط است.',
    updatedLabel: 'بررسی موجودی',
    stats: {
      qualify5: 'واحد واجد شرایط، پنج‌ساله',
      qualify10: 'واحد واجد شرایط، ده‌ساله',
      tier5: 'آستانه پنج‌ساله',
      entry: 'ارزان‌ترین واحد واجد شرایط',
    },

    routesHeading: 'دو اقامت متفاوت که مدام اشتباه گرفته می‌شوند',
    routesSub: 'هر دو از خرید ملک در عمان می‌آیند. ولی یک مجوز نیستند و بودجه یکسانی هم نمی‌خواهند.',
    routes: [
      {
        name: 'اقامت طلایی عمان',
        sub: 'بلندمدت، با آستانه سرمایه‌گذاری',
        body: 'در برابر سرمایه‌گذاری واجد شرایط در آستانه‌های اعلام‌شده صادر می‌شود: پنج سال از {tier5} و ده سال از {tier10}. قابل تمدید است، خانواده درجه یک را شامل می‌شود، و همان مجوزی است که مردم وقتی می‌گویند «گلدن ویزای عمان» منظورشان است. در فهرست فعلی ما {qualify5} واحد آستانه پنج‌ساله و {qualify10} واحد آستانه ده‌ساله را رد می‌کنند.',
      },
      {
        name: 'اقامت سرمایه‌گذاری متصل به ملک',
        sub: 'با هر خرید در منطقه ITC',
        body: 'خرید فری‌هولد داخل مجتمع گردشگری یکپارچه، خودش برای مالک اقامت قابل تمدید دارد، بدون حداقل چندصد هزار ریالی. بیشتر خریداران ما عملاً از همین مسیر می‌روند، چون قیمت ورود ما {entry} است در حالی که اقامت طلایی از {tier5} شروع می‌شود. این یک اقامت واقعی است. ولی اقامت طلایی نیست، و هر کس خلاف این بگوید دارد چیزی می‌فروشد.',
      },
    ],

    qualifyHeading: 'کدام واحدهای ما واجد شرایط‌اند',
    qualifySub: 'محاسبه‌شده از واحدهای موجود امروز، بر اساس دو آستانه اعلام‌شده. هر ردیف تعداد خودش را دارد تا ببینید انتخاب چقدر باز یا محدود است.',
    cols: {
      area: 'منطقه',
      city: 'شهر',
      tier: 'آستانه',
      units: 'واحد',
      from: 'از',
      median: 'میانه قیمت',
      type: 'نوع',
    },
    tier5Label: 'پنج‌ساله',
    tier10Label: 'ده‌ساله',
    noneRow: 'امروز واحد واجد شرایطی در این منطقه نیست',

    ownershipHeading: 'خارجی‌ها دقیقاً کجا می‌توانند بخرند',
    ownershipParas: [
      'اتباع خارجی در عمان فقط داخل مجتمع‌های گردشگری یکپارچهٔ تعیین‌شده می‌توانند مالکیت کامل فری‌هولد بگیرند، و جای دیگری نه. این یک نکته حاشیه‌ای نیست: ملکی بیرون از ITC، با هر قیمتی، برای خریدار خارجی سند فری‌هولد نمی‌دهد و در نتیجه نمی‌تواند پایه درخواست اقامتی باشد که بر مالکیت بنا شده. تمام واحدهای فهرست ما داخل ITC هستند.',
      'سند به نام خودتان در وزارت مسکن ثبت می‌شود. مالکیت محدود به زمان نیست و به وراث می‌رسد. عمان نه مالیات سالانه ملک دارد نه مالیات بر درآمد اجاره، و بخش بزرگی از اینکه اصلاً ریاضی بازدهی اینجا جواب می‌دهد از همین است.',
      'خرید ملک شما را شهروند عمان نمی‌کند و هیچ مسیری از ملک به تابعیت وجود ندارد. اقامت یعنی اقامت: اجازه زندگی در کشور، اسپانسری خانواده درجه یک، و رفت‌وآمد بدون ویزای بازدید. هر کس در برابر خرید ملک پاسپورت عمانی تبلیغ می‌کند، خودش علامت خطر است.',
    ],

    processHeading: 'روند کار چطور پیش می‌رود',
    processSub: 'ترتیبش مهم است. اقامت بعد از مالکیت می‌آید، نه برعکس.',
    steps: [
      { n: '۰۱', t: 'انتخاب واحد واجد شرایط', d: 'اگر هدف اقامت طلایی است، قیمت باید خودش آستانه را رد کند. اگر واحدی که پسندیده‌اید واجد شرایط نباشد، صریح می‌گوییم.' },
      { n: '۰۲', t: 'رزرو و پرداخت', d: 'قرارداد رزرو، بعد برنامه پرداخت همان پروژه. واحدهای پیش‌فروش و آماده زمان‌بندی متفاوتی دارند.' },
      { n: '۰۳', t: 'ثبت سند', d: 'سند در وزارت مسکن به نام شما ثبت می‌شود. درخواست اقامت روی همین سند بنا می‌شود.' },
      { n: '۰۴', t: 'درخواست اقامت', d: 'پرونده در برابر سند ثبت‌شده تشکیل می‌شود، با مدارک هویتی، پزشکی و سوءپیشینه. آماده‌سازی و ارسال با ماست.' },
      { n: '۰۵', t: 'افزودن خانواده', d: 'خانواده درجه یک پس از صدور مجوز اصلی به‌عنوان تحت تکفل اضافه می‌شوند.' },
    ],

    heading: 'واقعاً چه چیزی می‌خرید',
    paras: [
      'استدلال صادقانه به نفع عمان این نیست که ارزان‌ترین اقامت خلیج است. این است که بلیت ورود پایین است، مالکیت واقعاً فری‌هولد است نه اجاره بلندمدت، هزینه نگهداری به‌طور غیرمعمول سبک است چون نه مالیات سالانه ملک هست نه مالیات بر اجاره، و کشور هنوز از خریدار خارجی اشباع نشده. همین نکته آخر است که تاریخ انقضا دارد.',
      'استدلال صادقانه علیهش هم به همان کوتاهی است. آستانه‌ها و قواعد را دولت تعیین می‌کند و می‌تواند تغییر کند، فهرست ما یک سبد است نه کل بازار، و اقامتی که به مالکیت وابسته است با فروش ملک تمام می‌شود. هر کس خرید ملک را مجوز تضمین‌شده جلوه بدهد، دارد فرایندی شرط‌دار را بیش از واقع می‌فروشد.',
    ],

    faqHeading: 'پرسش‌های پرتکرار',
    tableNote: 'آستانه‌ها {tier5} برای پنج سال و {tier10} برای ده سال است، شمرده‌شده روی {units} واحد موجود امروز. منطقه‌ای که کمتر از پنج واحد واجد شرایط دارد علامت خورده، چون انتخاب میان دو گزینه عملاً انتخاب نیست.',
    faq: [
      {
        q: 'برای گلدن ویزای عمان چقدر باید سرمایه‌گذاری کنم؟',
        a: 'آستانه‌های اعلام‌شده {tier5} برای اقامت پنج‌ساله و {tier10} برای اقامت ده‌ساله است. از واحدهایی که امروز موجود داریم، {qualify5} واحد آستانه پنج‌ساله و {qualify10} واحد آستانه ده‌ساله را رد می‌کنند. واحدهای ارزان‌تر همچنان اقامت سرمایه‌گذاری ITC را دارند که مجوز دیگری است.',
      },
      {
        q: 'آیا هر ملیتی می‌تواند در عمان ملک بخرد؟',
        a: 'بله، داخل مجتمع گردشگری یکپارچه تعیین‌شده. خریداران هر ملیتی آنجا می‌توانند مالکیت کامل فری‌هولد بگیرند، ثبت‌شده در وزارت مسکن، بدون شریک محلی و بدون محدودیت زمانی. بیرون از آن مناطق، فری‌هولد برای خارجی وجود ندارد.',
      },
      {
        q: 'آیا خرید ملک در عمان تابعیت می‌دهد؟',
        a: 'نه. هیچ مسیری از مالکیت ملک به تابعیت عمان وجود ندارد. چیزی که خرید واجد شرایط می‌دهد اقامت قابل تمدید برای خودتان و خانواده درجه یک است. مراقب هر کسی باشید که پاسپورت تبلیغ می‌کند.',
      },
      {
        q: 'آیا اقامت شامل خانواده می‌شود؟',
        a: 'خانواده درجه یک پس از صدور مجوز دارنده اصلی، به‌عنوان تحت تکفل اضافه می‌شوند. مدارک خانواده را همان موقع درخواست همراه بیاورید نه بعد از آن، خیلی سریع‌تر پیش می‌رود.',
      },
      {
        q: 'اگر ملک را بفروشم اقامتم چه می‌شود؟',
        a: 'اقامت به سرمایه‌گذاری واجد شرایط گره خورده است. اگر بفروشید و چیز دیگری که واجد شرایط باشد نداشته باشید، پایه مجوز هم با آن می‌رود. خروج و مجوز را با هم برنامه‌ریزی کنید نه جدا از هم.',
      },
      {
        q: 'آیا برای حفظ آن باید در عمان زندگی کنم؟',
        a: 'این مجوز شما را به مهاجرت کامل ملزم نمی‌کند، و به همین دلیل بخش بزرگی از خریداران از آن به‌عنوان پایگاه دوم استفاده می‌کنند نه نقل مکان کامل. ولی چون شرایط را دولت تعیین می‌کند و تغییر می‌کند، پیش از تکیه بر این در برنامه‌ریزی، شرایط روز را از ما بپرسید.',
      },
      {
        q: 'مالیاتی روی ملک یا اجاره هست؟',
        a: 'عمان نه مالیات سالانه ملک دارد نه مالیات بر درآمد اجاره. هزینه‌های ثبت و انتقال، مبلمان و شارژ سالانه جداگانه‌اند و در هر پروژه فرق می‌کنند، پس پیش از بودجه‌بندی روی قیمت تیتر، برگه کامل هزینه هر واحد را بخواهید.',
      },
      {
        q: 'آیا ارزان‌ترین واحد فهرست شما برای گلدن ویزا کافی است؟',
        a: 'نه. قیمت ورود ما {entry} است، به‌مراتب پایین‌تر از آستانه پنج‌ساله {tier5}. آن واحد خرید بسیار خوبی است و اقامت سرمایه‌گذاری ITC را دارد، ولی اقامت طلایی نیست. ترجیح می‌دهیم اینجا بگوییم تا پای میز امضا.',
      },
    ],

    ctaHeading: 'ببینید کدام واحدها برای شما واجد شرایط‌اند',
    ctaText: 'بودجه‌تان را بگویید تا واحدهایی که آستانه مورد نظرتان را رد می‌کنند، واحدهایی که نمی‌کنند، و تفاوت صادقانه دو مسیر را برایتان بفرستیم.',
    ctaBtn: 'مشاهده املاک واجد شرایط',

    linksHeading: 'صفحات مرتبط',
    links: [
      { href: '/project', label: 'جستجوی همه املاک برای فروش در عمان' },
      { href: '/property-prices-in-oman', label: 'قیمت ملک در عمان: هر متر مربع در هر منطقه چقدر است' },
      { href: '/buy-property-in-muscat', label: 'خرید ملک در مسقط: مناطق و قیمت‌ها' },
      { href: '/buy', label: 'خرید ملک در عمان: راهنمای کامل' },
      { href: '/invest', label: 'ثبت شرکت و راه‌اندازی کسب‌وکار در عمان' },
    ],
  },

  ar: {
    eyebrow: 'عرفان للاستثمار · الإقامة',
    h1: 'الإقامة الذهبية في عُمان عبر العقار',
    lead: 'تمنح عُمان إقامة طويلة الأمد للمشترين الأجانب الذين يستثمرون عند الحدود المعلنة، وإقامة قابلة للتجديد منفصلة لكل من يشتري داخل مجمع سياحي متكامل. من بين {units} وحدة معروضة لدينا اليوم، تستوفي {qualify5} حد الخمس سنوات وتستوفي {qualify10} حد العشر سنوات. اقرأ أي المسارين ينطبق عليك قبل أن تضع ميزانيتك.',
    updatedLabel: 'تاريخ فحص المخزون',
    stats: {
      qualify5: 'وحدة مؤهلة، خمس سنوات',
      qualify10: 'وحدة مؤهلة، عشر سنوات',
      tier5: 'حد الخمس سنوات',
      entry: 'أرخص وحدة مؤهلة',
    },

    routesHeading: 'إقامتان مختلفتان كثيراً ما يُخلط بينهما',
    routesSub: 'كلتاهما تأتيان من شراء عقار في عُمان. لكنهما ليستا التصريح نفسه ولا تتطلبان الميزانية نفسها.',
    routes: [
      {
        name: 'الإقامة الذهبية العُمانية',
        sub: 'طويلة الأمد، بحد استثماري',
        body: 'تُمنح مقابل استثمار مؤهل عند الحدود المعلنة: خمس سنوات من {tier5} وعشر سنوات من {tier10}. قابلة للتجديد، وتشمل الأسرة المباشرة، وهي التصريح الذي يقصده الناس حين يقولون الإقامة الذهبية. في قائمتنا الحالية تتجاوز {qualify5} وحدة حد الخمس سنوات وتتجاوز {qualify10} حد العشر سنوات.',
      },
      {
        name: 'إقامة المستثمر المرتبطة بالعقار',
        sub: 'متاحة مع أي شراء داخل مجمع سياحي متكامل',
        body: 'الشراء بالتملّك الحر داخل مجمع سياحي متكامل يحمل بذاته إقامة قابلة للتجديد للمالك، دون حد أدنى بمئات الآلاف. هذا هو المسار الذي يسلكه معظم مشترينا فعلياً، لأن سعر الدخول لدينا {entry} بينما تبدأ الإقامة الذهبية من {tier5}. هي إقامة حقيقية. لكنها ليست الإقامة الذهبية، ومن يقول لك غير ذلك فهو يبيع.',
      },
    ],

    qualifyHeading: 'أي وحداتنا مؤهلة',
    qualifySub: 'محتسبة من الوحدات المتاحة اليوم عند الحدين المعلنين. كل صف يحمل عدده حتى ترى مدى اتساع الخيار أو ضيقه.',
    cols: {
      area: 'المنطقة',
      city: 'المدينة',
      tier: 'الحد',
      units: 'وحدات',
      from: 'من',
      median: 'وسيط السعر',
      type: 'النوع',
    },
    tier5Label: 'خمس سنوات',
    tier10Label: 'عشر سنوات',
    noneRow: 'لا توجد وحدات مؤهلة في هذه المنطقة اليوم',

    ownershipHeading: 'أين يستطيع الأجانب الشراء فعلياً',
    ownershipParas: [
      'يستطيع الأجانب التملّك الحر الكامل في عُمان داخل المجمعات السياحية المتكاملة المعتمدة فقط، ولا مكان سواها. هذه ليست تفصيلة عابرة: العقار خارج تلك المجمعات لا يمنح المشتري الأجنبي سنداً حراً مهما كان سعره، وبالتالي لا يصلح أساساً لطلب إقامة قائم على الملكية. كل وحدة في قائمتنا تقع داخل مجمع سياحي متكامل.',
      'يُسجَّل السند باسمك لدى وزارة الإسكان. الملكية غير محددة بمدة وتنتقل إلى الورثة. ولا تفرض عُمان ضريبة عقارية سنوية ولا ضريبة على دخل الإيجار، وهذا جزء كبير من سبب نجاح حسابات العائد هنا أصلاً.',
      'الشراء لا يجعلك مواطناً عُمانياً ولا يوجد مسار من العقار إلى الجنسية. الإقامة تبقى إقامة: تتيح لك العيش في البلد وكفالة الأسرة المباشرة والدخول والخروج دون تأشيرة زيارة. واعتبر من يسوّق جواز سفر عُمانياً مقابل شراء عقار علامة تحذير.',
    ],

    processHeading: 'كيف تسير الإجراءات',
    processSub: 'الترتيب مهم. الإقامة تأتي بعد الملكية وليس قبلها.',
    steps: [
      { n: '٠١', t: 'اختيار وحدة مؤهلة', d: 'إذا كان الهدف الإقامة الذهبية فالسعر يجب أن يتجاوز الحد بذاته. وسنقول لك بوضوح إن كانت الوحدة التي أعجبتك غير مؤهلة.' },
      { n: '٠٢', t: 'الحجز والدفع', d: 'اتفاقية حجز ثم خطة السداد الخاصة بذلك المشروع. الوحدات على الخارطة والجاهزة لها جداول مختلفة.' },
      { n: '٠٣', t: 'تسجيل السند', d: 'يُسجَّل السند لدى وزارة الإسكان باسمك. وهذا هو المستند الذي يقوم عليه طلب الإقامة.' },
      { n: '٠٤', t: 'تقديم طلب الإقامة', d: 'يُقدَّم الطلب مقابل السند المسجَّل مع أوراق الهوية والفحص الطبي والسجل. نتولى نحن إعداد الملف وتقديمه.' },
      { n: '٠٥', t: 'إضافة الأسرة', d: 'تُضاف الأسرة المباشرة كمعالين بعد صدور تصريح صاحب الطلب الأساسي.' },
    ],

    heading: 'ما الذي تشتريه فعلاً',
    paras: [
      'الحجة الصادقة لصالح عُمان ليست أنها أرخص إقامة في الخليج. بل أن تذكرة الدخول منخفضة، والملكية تملّك حر حقيقي لا إيجار طويل، وتكاليف التشغيل خفيفة بشكل غير معتاد لعدم وجود ضريبة عقارية سنوية ولا ضريبة على الإيجار، وأن البلد لم يكتظ بعد بالمشترين الأجانب. وهذه النقطة الأخيرة هي التي لها تاريخ انتهاء.',
      'والحجة الصادقة ضدها قصيرة بالقدر نفسه. الحدود والقواعد تضعها الحكومة ويمكن أن تتغير، وقائمتنا محفظة لا السوق كله، والإقامة القائمة على الملكية تنتهي إذا بعت. ومن يقدّم شراء عقار على أنه تصريح مضمون فهو يبالغ في بيع إجراء له شروط.',
    ],

    faqHeading: 'الأسئلة الشائعة',
    tableNote: 'الحدود هي {tier5} لخمس سنوات و{tier10} لعشر سنوات، محسوبة على {units} وحدة متاحة اليوم. وتُعلَّم المنطقة التي فيها أقل من خمس وحدات مؤهلة، لأن الاختيار بين وحدتين ليس اختياراً حقيقياً.',
    faq: [
      {
        q: 'كم أحتاج أن أستثمر للحصول على الإقامة الذهبية العُمانية؟',
        a: 'الحدود المعلنة هي {tier5} لإقامة خمس سنوات و{tier10} لإقامة عشر سنوات. ومن الوحدات المتاحة لدينا اليوم تتجاوز {qualify5} حد الخمس سنوات وتتجاوز {qualify10} حد العشر سنوات. أما الوحدات الأقل سعراً فتحمل إقامة المستثمر داخل المجمع السياحي، وهي تصريح مختلف.',
      },
      {
        q: 'هل يستطيع أي جنسية شراء عقار في عُمان؟',
        a: 'نعم، داخل مجمع سياحي متكامل معتمد. يستطيع المشترون من أي جنسية التملّك الحر الكامل هناك، مسجَّلاً لدى وزارة الإسكان، دون شريك محلي ودون حد زمني للملكية. وخارج تلك المناطق لا يتوفر التملّك الحر للأجانب.',
      },
      {
        q: 'هل يمنحني شراء عقار في عُمان الجنسية؟',
        a: 'لا. لا يوجد مسار من ملكية العقار إلى الجنسية العُمانية. ما يمنحه الشراء المؤهل هو إقامة قابلة للتجديد لك ولأسرتك المباشرة. واحذر ممن يسوّق جواز سفر.',
      },
      {
        q: 'هل تشمل الإقامة أسرتي؟',
        a: 'تُضاف الأسرة المباشرة كمعالين على تصريح صاحب الطلب الأساسي بعد صدوره. أحضر مستندات الأسرة معك وقت التقديم بدلاً من بعده، فذلك أسرع بكثير.',
      },
      {
        q: 'ماذا يحدث لإقامتي إذا بعت العقار؟',
        a: 'الإقامة مرتبطة بالاستثمار المؤهل. فإذا بعت ولم تحتفظ بشيء آخر مؤهل، ذهب معه أساس التصريح. خطط للخروج وللتصريح معاً لا منفصلين.',
      },
      {
        q: 'هل يجب أن أعيش في عُمان للحفاظ عليها؟',
        a: 'لا يلزمك التصريح بالانتقال الكامل، ولهذا يستخدمه كثير من المشترين كقاعدة ثانية لا كانتقال كامل. لكن لأن الشروط تضعها الحكومة وتتغير، تأكد منا من شروط الإقامة الحالية قبل أن تبني عليها خططك.',
      },
      {
        q: 'هل هناك ضرائب على العقار أو الإيجار؟',
        a: 'لا تفرض عُمان ضريبة عقارية سنوية ولا ضريبة على دخل الإيجار. أما رسوم التسجيل والانتقال والتأثيث ورسوم الخدمات السنوية فمنفصلة وتختلف بين مشروع وآخر، فاطلب كشف التكلفة الكامل لأي وحدة قبل أن تبني ميزانيتك على السعر المعلن.',
      },
      {
        q: 'هل أرخص وحدة في قائمتكم تكفي للإقامة الذهبية؟',
        a: 'لا. سعر الدخول لدينا {entry}، وهو أقل بكثير من حد الخمس سنوات البالغ {tier5}. تلك الوحدة صفقة ممتازة وتحمل إقامة المستثمر داخل المجمع السياحي، لكنها ليست الإقامة الذهبية. ونفضّل قول ذلك هنا لا عند طاولة التوقيع.',
      },
    ],

    ctaHeading: 'اعرف أي الوحدات مؤهلة لك',
    ctaText: 'أخبرنا بميزانيتك ونعود إليك بالوحدات التي تتجاوز الحد الذي تستهدفه، وتلك التي لا تتجاوزه، والفارق الصادق بين المسارين.',
    ctaBtn: 'تصفّح العقارات المؤهلة',

    linksHeading: 'صفحات ذات صلة',
    links: [
      { href: '/project', label: 'ابحث في كل العقارات المعروضة للبيع في عُمان' },
      { href: '/property-prices-in-oman', label: 'أسعار العقارات في عُمان: تكلفة المتر المربع حسب المنطقة' },
      { href: '/buy-property-in-muscat', label: 'شراء عقار في مسقط: المجتمعات والأسعار' },
      { href: '/buy', label: 'شراء عقار في عُمان: الدليل الكامل' },
      { href: '/invest', label: 'تأسيس الشركات وبدء الأعمال في عُمان' },
    ],
  },

  ru: {
    eyebrow: 'Irfan Investment · ВНЖ',
    h1: 'Золотая виза Омана через недвижимость',
    lead: 'Оман предоставляет долгосрочное резидентство иностранным покупателям, инвестирующим на опубликованных порогах, и отдельное продлеваемое резидентство каждому, кто покупает внутри интегрированного туристического комплекса. Из {units} объектов, выставленных у нас сегодня, {qualify5} проходят пятилетний порог и {qualify10} десятилетний. Прежде чем считать бюджет, разберитесь, какой путь ваш.',
    updatedLabel: 'Данные по объектам на',
    stats: {
      qualify5: 'объектов, 5 лет',
      qualify10: 'объектов, 10 лет',
      tier5: 'порог пяти лет',
      entry: 'самый доступный подходящий объект',
    },

    routesHeading: 'Два разных резидентства, которые постоянно путают',
    routesSub: 'Оба следуют из покупки недвижимости в Омане. Но это не одно и то же разрешение, и бюджет им нужен разный.',
    routes: [
      {
        name: 'Золотое резидентство Омана',
        sub: 'Долгосрочное, с инвестиционным порогом',
        body: 'Выдаётся под подходящую инвестицию на опубликованных порогах: пять лет от {tier5} и десять лет от {tier10}. Продлевается, охватывает ближайшую семью, и именно его имеют в виду, когда говорят «золотая виза Омана». В нашем текущем списке {qualify5} объектов проходят пятилетний порог и {qualify10} десятилетний.',
      },
      {
        name: 'Инвесторское резидентство от недвижимости',
        sub: 'Доступно при любой покупке внутри ITC',
        body: 'Покупка во фрихолд внутри интегрированного туристического комплекса сама по себе даёт владельцу продлеваемое резидентство, без минимума в сотни тысяч. Именно этим путём и идёт большинство наших покупателей, потому что цена входа у нас {entry}, а Золотое резидентство начинается с {tier5}. Это настоящее разрешение на проживание. Но это не Золотое резидентство, и тот, кто утверждает обратное, вам продаёт.',
      },
    ],

    qualifyHeading: 'Какие из наших объектов подходят',
    qualifySub: 'Рассчитано по доступным сегодня объектам на двух опубликованных порогах. В каждой строке указано количество, чтобы было видно, насколько широк выбор.',
    cols: {
      area: 'Район',
      city: 'Город',
      tier: 'Порог',
      units: 'Объектов',
      from: 'От',
      median: 'Медианная цена',
      type: 'Тип',
    },
    tier5Label: 'Пять лет',
    tier10Label: 'Десять лет',
    noneRow: 'Сегодня в этом районе подходящих объектов нет',

    ownershipHeading: 'Где иностранцы действительно могут покупать',
    ownershipParas: [
      'Иностранные граждане могут получить полный фрихолд в Омане только внутри обозначенных интегрированных туристических комплексов, и больше нигде. Это не мелкая формальность: объект вне ITC не даёт иностранному покупателю фрихолд-титул при любой цене и, значит, не может служить основанием для заявления на резидентство, построенного на владении. Все объекты нашего списка находятся внутри ITC.',
      'Титул регистрируется в Министерстве жилищного строительства на ваше имя. Владение не ограничено сроком и переходит наследникам. В Омане нет ежегодного налога на недвижимость и нет налога на доход от аренды, и во многом именно поэтому арифметика доходности здесь вообще сходится.',
      'Покупка не делает вас гражданином Омана, и пути от недвижимости к гражданству не существует. Резидентство остаётся резидентством: оно позволяет жить в стране, спонсировать ближайшую семью и въезжать без гостевой визы. Любого, кто рекламирует оманский паспорт за покупку недвижимости, стоит считать тревожным сигналом.',
    ],

    processHeading: 'Как идёт процесс',
    processSub: 'Порядок важен. Резидентство следует за владением, а не наоборот.',
    steps: [
      { n: '01', t: 'Выбор подходящего объекта', d: 'Если цель Золотое резидентство, цена должна сама проходить порог. Если понравившийся объект не подходит, мы скажем об этом прямо.' },
      { n: '02', t: 'Бронирование и оплата', d: 'Договор бронирования, затем план оплаты по этому проекту. У объектов на стадии строительства и готовых графики разные.' },
      { n: '03', t: 'Регистрация титула', d: 'Титул регистрируется в Министерстве жилищного строительства на ваше имя. Именно на этом документе держится заявление на резидентство.' },
      { n: '04', t: 'Заявление на резидентство', d: 'Заявление подаётся против зарегистрированного титула с обычным пакетом: личные документы, медицина, справка о несудимости. Подготовку и подачу берём на себя.' },
      { n: '05', t: 'Добавление семьи', d: 'Ближайшая семья добавляется как иждивенцы после выдачи основного разрешения.' },
    ],

    heading: 'Что вы на самом деле покупаете',
    paras: [
      'Честный аргумент за Оман не в том, что это самое дешёвое резидентство в Заливе. Он в том, что билет на вход низкий, владение это настоящий фрихолд, а не аренда, текущие расходы необычно лёгкие, поскольку нет ни ежегодного налога на недвижимость, ни налога на аренду, и страна ещё не переполнена иностранными покупателями. Именно у последнего пункта есть срок годности.',
      'Честный аргумент против столь же короткий. Пороги и правила устанавливает государство, и они могут измениться, наш список это портфель, а не весь рынок, а резидентство, опирающееся на владение, заканчивается вместе с продажей. Тот, кто подаёт покупку недвижимости как гарантированное разрешение, перепродаёт процедуру, у которой есть условия.',
    ],

    faqHeading: 'Частые вопросы',
    tableNote: 'Пороги составляют {tier5} для пяти лет и {tier10} для десяти, подсчёт по {units} объектам, доступным сегодня. Район, где подходящих объектов меньше пяти, помечен: выбор из двух это едва ли выбор.',
    faq: [
      {
        q: 'Сколько нужно инвестировать для золотой визы Омана?',
        a: 'Опубликованные пороги: {tier5} для пятилетнего резидентства и {tier10} для десятилетнего. Из доступных сегодня объектов {qualify5} проходят пятилетний порог и {qualify10} десятилетний. Более доступные объекты дают отдельное инвесторское резидентство внутри ITC, а это другое разрешение.',
      },
      {
        q: 'Может ли покупать недвижимость в Омане гражданин любой страны?',
        a: 'Да, внутри обозначенного интегрированного туристического комплекса. Покупатели любого гражданства получают там полный фрихолд, зарегистрированный в Министерстве жилищного строительства, без местного партнёра и без ограничения срока владения. Вне этих зон фрихолд иностранцам недоступен.',
      },
      {
        q: 'Даёт ли покупка недвижимости в Омане гражданство?',
        a: 'Нет. Пути от владения недвижимостью к оманскому гражданству не существует. Подходящая покупка даёт продлеваемое резидентство вам и вашей ближайшей семье. С теми, кто рекламирует паспорт, будьте осторожны.',
      },
      {
        q: 'Распространяется ли резидентство на семью?',
        a: 'Ближайшая семья добавляется как иждивенцы к разрешению основного заявителя после его выдачи. Документы на семью лучше привезти сразу при подаче, а не потом, так значительно быстрее.',
      },
      {
        q: 'Что будет с резидентством, если я продам объект?',
        a: 'Резидентство привязано к подходящей инвестиции. Если вы продали и не удерживаете ничего другого подходящего, основание разрешения уходит вместе с объектом. Планируйте выход и разрешение вместе, а не по отдельности.',
      },
      {
        q: 'Нужно ли жить в Омане, чтобы его сохранить?',
        a: 'Разрешение не обязывает вас переезжать полностью, поэтому значительная часть покупателей использует его как вторую базу. Но поскольку условия устанавливает государство и они меняются, уточните у нас действующие требования, прежде чем строить на этом планы.',
      },
      {
        q: 'Есть ли налоги на объект или на аренду?',
        a: 'В Омане нет ежегодного налога на недвижимость и нет налога на доход от аренды. Регистрационные и транзакционные расходы, меблировка и ежегодные сервисные сборы считаются отдельно и отличаются по проектам, поэтому запросите полный лист расходов по объекту, прежде чем считать бюджет от заявленной цены.',
      },
      {
        q: 'Хватит ли самого доступного объекта из вашего списка для золотой визы?',
        a: 'Нет. Цена входа у нас {entry}, что заметно ниже пятилетнего порога {tier5}. Этот объект отличная покупка и даёт инвесторское резидентство внутри ITC, но это не Золотое резидентство. Мы предпочитаем сказать это здесь, а не за столом подписания.',
      },
    ],

    ctaHeading: 'Узнайте, какие объекты подходят именно вам',
    ctaText: 'Назовите бюджет, и мы вернёмся со списком объектов, которые проходят нужный вам порог, тех, которые не проходят, и честной разницей между двумя путями.',
    ctaBtn: 'Смотреть подходящие объекты',

    linksHeading: 'Связанные страницы',
    links: [
      { href: '/project', label: 'Поиск по всей недвижимости на продажу в Омане' },
      { href: '/property-prices-in-oman', label: 'Цены на недвижимость Омана: сколько стоит квадратный метр по районам' },
      { href: '/buy-property-in-muscat', label: 'Купить недвижимость в Маскате: районы и цены' },
      { href: '/buy', label: 'Купить недвижимость в Омане: полный гид' },
      { href: '/invest', label: 'Регистрация компании и запуск бизнеса в Омане' },
    ],
  },
}

export const goldenVisaCopy = (lang) => GOLDEN_VISA[lang] || GOLDEN_VISA.en

const SITE = 'https://www.irfaninvest.com'
const PATH = '/oman-golden-visa'
const urlFor = (lang) => `${SITE}${lang === 'en' ? '' : `/${lang}`}${PATH}`

export function goldenVisaFaqJsonLd(lang, vars) {
  const c = goldenVisaCopy(lang)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((f) => ({
      '@type': 'Question',
      name: fill(f.q, vars),
      acceptedAnswer: { '@type': 'Answer', text: fill(f.a, vars) },
    })),
  }
}

/**
 * HowTo describes the purchase-to-residency sequence, BreadcrumbList places
 * the page. Deliberately no Offer/Product markup: the thing being described is
 * a government permit, not something we sell.
 */
export function goldenVisaJsonLd(lang, vars) {
  const c = goldenVisaCopy(lang)
  const url = urlFor(lang)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        '@id': `${url}#howto`,
        name: c.h1,
        description: fill(c.lead, vars),
        totalTime: 'P90D',
        step: c.steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.t,
          text: s.d,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}${lang === 'en' ? '' : `/${lang}`}/` },
          { '@type': 'ListItem', position: 2, name: 'Properties for Sale in Oman', item: `${SITE}${lang === 'en' ? '' : `/${lang}`}/project` },
          { '@type': 'ListItem', position: 3, name: GOLDEN_VISA.en.h1, item: url },
        ],
      },
    ],
  }
}
