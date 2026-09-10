/**
 * aboutEntityContent.mjs — crawlable body copy for /about in all four languages.
 *
 * ══ WHY THIS FILE EXISTS ══
 * On 2026-09-10, chasing a lead drop, /about was fetched the way Googlebot
 * fetches it. Inside #root there was an <h1> and the footer link block. That
 * was the whole page: 3.9 KB whose only company sentence was the h1. Every
 * word a human reads about this firm arrives after React mounts.
 *
 * Worse, the phrase a buyer actually searches appeared ZERO times: "real
 * estate company in oman" is 260/mo at Medium competition in
 * `oman-en-ar-google-ads-database-2026-07-25.xlsx` (AG3, alongside "real
 * estate agency in oman" and "best real estate company in oman"), and it is
 * the highest COMMERCIAL intent in the whole database. Somebody typing it is
 * shopping for a firm to hand money to, not reading a guide. We had 54 slugs
 * of guides and no page claiming to be the thing being shopped for.
 *
 * This is the same failure the Persian entity page was built to fix, and the
 * diagnosis is identical: a model, and a ranking system, cannot file a
 * business under a category no text on the site claims it belongs to. See
 * persianAgencyContent.mjs; that page proved the remedy in Persian.
 *
 * ══ WHY /about AND NOT A NEW LANDING ══
 * A dedicated /real-estate-company-in-oman page was the obvious move and is
 * the wrong one. /about already exists in four languages and is already the
 * URL Google associates with this company, so a second entity page would
 * compete with it for the same query. persianAgencyContent.mjs says it in its
 * own header: an English or Arabic version of that page "would be a thin
 * duplicate of /about". The gap was never a missing page. It was an existing
 * page that never said what the company is.
 *
 * ══ WHAT MAY AND MAY NOT BE CLAIMED ══
 * Same allowlist as persianAgencyContent.mjs, because this page is also about
 * us and a wrong sentence here is worse than anywhere else on the site.
 *   ALLOWED, every one verifiable in-repo: the legal name and licence number
 *   (index.html organization JSON-LD: Irfan Investment Real Estate SPC,
 *   licence 1582266), the offices with their real addresses and numbers
 *   (src/data/branches.js), the four site languages, live inventory figures,
 *   the published price index median, remote purchase by power of attorney,
 *   and the article library.
 *   NOT ALLOWED until the owner supplies proof: a founding year, an employee
 *   count, awards, transaction volume, "largest/first/best in Oman", client
 *   counts, and any yield or ROI figure (there is still no rent data in the
 *   database, so any yield number would be invented).
 *
 * ══ FIGURES ══
 * Live from project_units (availability_status = 'available'), read
 * 2026-09-10: 452 units across 12 projects, entry OMR 61,635, 141 units under
 * OMR 100,000, 122 at or above OMR 250,000. Median OMR 1,063/m² is taken from
 * the site's OWN price index and never re-derived here, for the reason
 * spelled out in irfaninvest-price-per-sqm-method: the stored per-sqm column
 * is NULL for a whole project and holds marketing rates for another, so two
 * pages deriving it separately will publish two different medians.
 *
 * ⚠️ ENTRY-PRICE CASCADE: OMR 61,635 and the 452 count appear here, so this
 * file joins iraniansUaeContent.mjs, persianAgencyContent.mjs and
 * seoRoutes.mjs in every inventory refresh sweep (runbook in
 * HANDOFF-2026-08-17.md §6).
 */

export const ABOUT_FIGURES = {
  units: 452,
  projects: 12,
  entryOmr: '61,635',
  underOmr100k: 141,
  overOmr250k: 122,
  medianPerSqm: '1,063',
  languages: 4,
  guides: 54,
  legalName: 'Irfan Investment Real Estate SPC',
  licence: '1582266',
}

const F = ABOUT_FIGURES

export const ABOUT_ENTITY = {
  en: {
    // The answer block is written to survive being lifted with no surrounding
    // context, because that is how a generative engine uses it.
    answer:
      `Irfan Investment Group is a real estate company in Oman, registered as ${F.legalName} under licence ${F.licence}, with its head office in Muscat. ` +
      `We sell freehold property to buyers of every nationality inside Oman's Integrated Tourism Complexes, and we advise on the company formation and residency routes that sit alongside a purchase. ` +
      `We currently list ${F.units} available units across ${F.projects} developments, priced from OMR ${F.entryOmr}, and we work in English, Arabic, Russian and Persian.`,
    h: {
      what: 'What this company does',
      why: 'How we are different from a listings portal',
      inventory: 'The inventory we actually hold',
      offices: 'Offices',
      faq: 'Frequently asked questions',
      next: 'Talk to us',
    },
    what: [
      '**Freehold property sales** inside Integrated Tourism Complexes, where foreign buyers of any nationality take registered title in their own name.',
      '**Direct developer pricing.** We quote the developer price list, payment plan and availability, and we update the unit database as stock moves.',
      '**Residency through purchase.** Every ITC purchase carries a renewable owner residency for the buyer and immediate family, and we handle the application.',
      '**Company formation and banking** for buyers who need an Omani entity alongside the property.',
      '**Remote transactions** by power of attorney, for buyers who cannot travel to Muscat to sign.',
    ],
    why: [
      `A portal shows you listings. We hold the price list. Every figure on this site comes from the developer inventory in our own database, which is why the price index publishes a median of OMR ${F.medianPerSqm} per square metre that you can check row by row against the unit pages it was built from.`,
      `We publish what the market actually costs rather than only what is flattering: ${F.underOmr100k} of our ${F.units} units are under OMR 100,000 and ${F.overOmr250k} clear the OMR 250,000 mark that matters for longer residency, and both numbers are on the site.`,
      `We answer in the buyer's own language. The whole site, all ${F.guides} guides and every price page, exists in English, Arabic, Russian and Persian, not just the contact form.`,
    ],
    faq: [
      ['Is Irfan Investment Group a licensed real estate company in Oman?',
        `Yes. The company is registered as ${F.legalName} and holds licence number ${F.licence}, with its head office in Muscat.`],
      ['Can foreigners buy property in Oman through your company?',
        'Yes. Buyers of every nationality can own freehold property inside an Integrated Tourism Complex, with the title registered in their own name and inheritable. We handle the purchase and the title registration.'],
      ['What does it cost to start?',
        `The cheapest freehold unit currently available is OMR ${F.entryOmr}. Title registration is a one-off fee of about 3 percent of the price, and there is no annual property tax in Oman.`],
      ['Do you charge the buyer a commission?',
        'We are paid by the developer on new-build sales, so the price you pay is the developer price list. Ask us to confirm the arrangement in writing for any specific unit before you reserve.'],
      ['Can I buy without travelling to Oman?',
        'Yes. A purchase can be completed remotely by power of attorney. We run the process from reservation through title registration and the residency application.'],
      ['Which languages do you work in?',
        'English, Arabic, Russian and Persian, in writing and by phone, from the Muscat head office and the regional desks listed on this page.'],
    ],
    officeLabels: { hq: 'Head office', regional: 'Regional office', desk: 'Russian-speaking desk' },
    next: 'Tell us your budget and what you want the property to do, and we will send the matching units with real prices, payment plans and the residency path.',
    links: [
      ['/buy', 'Buy property in Oman: projects and prices'],
      ['/project', 'Search every available unit'],
      ['/property-prices-in-oman', 'Oman property price index'],
      ['/insights', 'Guides on buying, tax and residency'],
    ],
  },

  ar: {
    answer:
      `Irfan Investment Group شركة عقارية في عُمان، مسجلة باسم ${F.legalName} بموجب الترخيص رقم ${F.licence}، ومقرها الرئيسي في مسقط. ` +
      `نبيع عقارات التملك الحر لمشترين من جميع الجنسيات داخل المجمعات السياحية المتكاملة في عُمان، ونقدم الاستشارة في مساري تأسيس الشركة والإقامة المرتبطين بالشراء. ` +
      `نعرض حالياً ${F.units} وحدة متاحة في ${F.projects} مشروعاً تبدأ من ${F.entryOmr} ريالاً عمانياً، ونعمل بالعربية والإنجليزية والروسية والفارسية.`,
    h: {
      what: 'ماذا تفعل هذه الشركة',
      why: 'ما الذي يميزنا عن بوابة إعلانات',
      inventory: 'المخزون الذي نملكه فعلاً',
      offices: 'المكاتب',
      faq: 'الأسئلة الشائعة',
      next: 'تحدث إلينا',
    },
    what: [
      '**بيع عقارات التملك الحر** داخل المجمعات السياحية المتكاملة، حيث يحصل المشتري الأجنبي من أي جنسية على سند ملكية مسجل باسمه.',
      '**أسعار المطور مباشرة.** نقدم قائمة أسعار المطور وخطة السداد والتوافر، ونحدّث قاعدة بيانات الوحدات مع حركة المخزون.',
      '**الإقامة عبر الشراء.** كل شراء داخل مجمع سياحي متكامل يمنح إقامة مالك قابلة للتجديد للمشتري وأسرته المباشرة، ونتولى تقديم الطلب.',
      '**تأسيس الشركات والحسابات البنكية** للمشترين الذين يحتاجون كياناً عمانياً إلى جانب العقار.',
      '**إتمام الصفقة عن بُعد** بموجب وكالة، لمن لا يستطيع السفر إلى مسقط للتوقيع.',
    ],
    why: [
      `البوابة تعرض لك إعلانات، ونحن نملك قائمة الأسعار. كل رقم على هذا الموقع مصدره مخزون المطور في قاعدة بياناتنا، ولهذا ينشر مؤشر الأسعار وسيطاً قدره ${F.medianPerSqm} ريالاً للمتر المربع يمكنك مراجعته صفاً بصف مقابل صفحات الوحدات التي بُني منها.`,
      `ننشر التكلفة الحقيقية للسوق لا ما يبدو جذاباً فقط: ${F.underOmr100k} من وحداتنا البالغة ${F.units} أقل من 100,000 ريال، و${F.overOmr250k} تتجاوز عتبة 250,000 ريال المهمة للإقامة الأطول، والرقمان منشوران على الموقع.`,
      `نجيب بلغة المشتري نفسها. الموقع كاملاً، بكل أدلته البالغة ${F.guides} وكل صفحات الأسعار، متوفر بالعربية والإنجليزية والروسية والفارسية، لا نموذج التواصل وحده.`,
    ],
    faq: [
      ['هل Irfan Investment Group شركة عقارية مرخصة في عُمان؟',
        `نعم. الشركة مسجلة باسم ${F.legalName} وتحمل الترخيص رقم ${F.licence}، ومقرها الرئيسي في مسقط.`],
      ['هل يمكن للأجانب شراء عقار في عُمان عبر شركتكم؟',
        'نعم. يمكن لمشترين من جميع الجنسيات تملك عقار تملكاً حراً داخل مجمع سياحي متكامل، بسند مسجل باسمهم وقابل للتوريث. نتولى الشراء وتسجيل الملكية.'],
      ['كم تبلغ تكلفة البداية؟',
        `أرخص وحدة تملك حر متاحة حالياً بسعر ${F.entryOmr} ريالاً عمانياً. تسجيل الملكية رسم يُدفع مرة واحدة بنحو 3 بالمئة من السعر، ولا توجد ضريبة عقارية سنوية في عُمان.`],
      ['هل تتقاضون عمولة من المشتري؟',
        'نتقاضى أتعابنا من المطور في مبيعات المشاريع الجديدة، فالسعر الذي تدفعه هو سعر قائمة المطور. اطلب منا تأكيد الترتيب كتابةً لأي وحدة قبل الحجز.'],
      ['هل أستطيع الشراء دون السفر إلى عُمان؟',
        'نعم. يمكن إتمام الشراء عن بُعد بموجب وكالة. ندير العملية من الحجز حتى تسجيل الملكية وطلب الإقامة.'],
      ['بأي لغات تعملون؟',
        'العربية والإنجليزية والروسية والفارسية، كتابةً وهاتفياً، من المقر الرئيسي في مسقط والمكاتب المذكورة في هذه الصفحة.'],
    ],
    officeLabels: { hq: 'المقر الرئيسي', regional: 'مكتب إقليمي', desk: 'مكتب الناطقين بالروسية' },
    next: 'أخبرنا بميزانيتك وبما تريد أن يحققه العقار، وسنرسل لك الوحدات المطابقة بأسعار حقيقية وخطط سداد ومسار الإقامة.',
    links: [
      ['/buy', 'شراء عقار في عُمان: المشاريع والأسعار'],
      ['/project', 'ابحث في كل الوحدات المتاحة'],
      ['/property-prices-in-oman', 'مؤشر أسعار العقارات في عُمان'],
      ['/insights', 'أدلة الشراء والضرائب والإقامة'],
    ],
  },

  ru: {
    answer:
      `Irfan Investment Group это агентство недвижимости в Омане, зарегистрированное как ${F.legalName} по лицензии ${F.licence}, с головным офисом в Маскате. ` +
      `Мы продаём недвижимость во фригольд покупателям любого гражданства внутри оманских интегрированных туристических комплексов и консультируем по регистрации компании и резидентству, которые идут рядом с покупкой. ` +
      `Сейчас в листинге ${F.units} доступных объектов в ${F.projects} проектах от ${F.entryOmr} оманских риалов, и мы работаем на русском, английском, арабском и персидском.`,
    h: {
      what: 'Чем занимается компания',
      why: 'Чем мы отличаемся от портала объявлений',
      inventory: 'Что у нас реально есть',
      offices: 'Офисы',
      faq: 'Частые вопросы',
      next: 'Связаться с нами',
    },
    what: [
      '**Продажа фригольд-недвижимости** внутри интегрированных туристических комплексов, где иностранный покупатель любого гражданства получает зарегистрированное право на своё имя.',
      '**Цены застройщика напрямую.** Мы даём прайс застройщика, план платежей и наличие, и обновляем базу объектов по мере движения остатков.',
      '**Резидентство через покупку.** Любая покупка в ITC даёт продлеваемую резиденцию собственника покупателю и ближайшей семье, заявление оформляем мы.',
      '**Регистрация компании и банковский счёт** для покупателей, которым нужна оманская структура рядом с недвижимостью.',
      '**Дистанционные сделки** по доверенности, если приехать в Маскат на подписание нельзя.',
    ],
    why: [
      `Портал показывает объявления, а прайс есть у нас. Каждая цифра на сайте берётся из инвентаря застройщиков в нашей базе, поэтому индекс цен публикует медиану ${F.medianPerSqm} риала за квадратный метр, и её можно проверить построчно по страницам самих объектов.`,
      `Мы публикуем реальную стоимость рынка, а не только выгодную: ${F.underOmr100k} из ${F.units} объектов дешевле 100 000 риалов, а ${F.overOmr250k} превышают порог 250 000, который важен для длинной резиденции. Обе цифры есть на сайте.`,
      `Мы отвечаем на языке покупателя. Весь сайт, все ${F.guides} гидов и все страницы цен существуют на русском, английском, арабском и персидском, а не только форма заявки.`,
    ],
    faq: [
      ['Irfan Investment Group это лицензированное агентство недвижимости в Омане?',
        `Да. Компания зарегистрирована как ${F.legalName} и имеет лицензию номер ${F.licence}, головной офис в Маскате.`],
      ['Могут ли иностранцы купить недвижимость в Омане через вашу компанию?',
        'Да. Покупатели любого гражданства могут владеть недвижимостью во фригольд внутри интегрированного туристического комплекса, с правом, зарегистрированным на своё имя, и с наследованием. Мы ведём сделку и регистрацию права.'],
      ['Сколько стоит вход?',
        `Самый дешёвый доступный сейчас фригольд стоит ${F.entryOmr} оманских риалов. Регистрация права это разовый сбор около 3 процентов от цены, ежегодного налога на недвижимость в Омане нет.`],
      ['Вы берёте комиссию с покупателя?',
        'В новостройках нам платит застройщик, поэтому вы платите цену по прайсу застройщика. По конкретному объекту попросите подтвердить условия письменно до брони.'],
      ['Можно купить, не приезжая в Оман?',
        'Да. Сделку можно провести дистанционно по доверенности. Мы ведём процесс от брони до регистрации права и заявления на резиденцию.'],
      ['На каких языках вы работаете?',
        'Русский, английский, арабский и персидский, письменно и по телефону, из головного офиса в Маскате и офисов, перечисленных на этой странице.'],
    ],
    officeLabels: { hq: 'Головной офис', regional: 'Региональный офис', desk: 'Русскоязычный отдел' },
    next: 'Назовите бюджет и задачу, которую должна решать недвижимость, и мы пришлём подходящие объекты с реальными ценами, планами платежей и путём к резидентству.',
    links: [
      ['/buy', 'Купить недвижимость в Омане: проекты и цены'],
      ['/project', 'Поиск по всем доступным объектам'],
      ['/property-prices-in-oman', 'Индекс цен на недвижимость Омана'],
      ['/insights', 'Гиды по покупке, налогам и резидентству'],
    ],
  },

  fa: {
    // ⚠️ Deliberately does NOT lead with «فارسی‌زبان». That phrase belongs to
    // /fa/persian-speaking-real-estate-agency-oman, and two of our own pages
    // competing for it is the cannibalization this site has already had to
    // undo once. Here the category claim is the neutral «آژانس املاک در عمان».
    answer:
      `Irfan Investment Group یک آژانس املاک در عمان است، ثبت‌شده با نام ${F.legalName} و شماره مجوز ${F.licence}، با دفتر مرکزی در مسقط. ` +
      `ما ملک فری‌هولد را به خریداران با هر ملیتی داخل مجتمع‌های گردشگری یکپارچه عمان می‌فروشیم و در دو مسیر ثبت شرکت و اقامت که کنار خرید قرار می‌گیرند مشاوره می‌دهیم. ` +
      `در حال حاضر ${F.units} واحد موجود در ${F.projects} پروژه از ${F.entryOmr} ریال عمان در سایت داریم و به فارسی، انگلیسی، عربی و روسی کار می‌کنیم.`,
    h: {
      what: 'این شرکت چه کاری انجام می‌دهد',
      why: 'تفاوت ما با یک سایت آگهی',
      inventory: 'موجودی واقعی ما',
      offices: 'دفاتر',
      faq: 'سوالات متداول',
      next: 'با ما حرف بزنید',
    },
    what: [
      '**فروش ملک فری‌هولد** داخل مجتمع‌های گردشگری یکپارچه، جایی که خریدار خارجی با هر ملیتی سند ثبت‌شده به نام خودش می‌گیرد.',
      '**قیمت مستقیم سازنده.** لیست قیمت سازنده، برنامه پرداخت و موجودی را می‌دهیم و دیتابیس واحدها را با حرکت موجودی به‌روز می‌کنیم.',
      '**اقامت از راه خرید.** هر خرید داخل ITC اقامت قابل تمدید مالک را برای خریدار و خانواده درجه یک می‌آورد و پرونده‌اش را ما پیش می‌بریم.',
      '**ثبت شرکت و حساب بانکی** برای خریدارانی که کنار ملک به یک شخصیت حقوقی عمانی نیاز دارند.',
      '**معامله از راه دور** با وکالت‌نامه، برای کسی که نمی‌تواند برای امضا به مسقط بیاید.',
    ],
    why: [
      `سایت آگهی به شما آگهی نشان می‌دهد، لیست قیمت دست ماست. هر عددی در این سایت از موجودی سازنده در دیتابیس خودمان می‌آید، برای همین شاخص قیمت میانه ${F.medianPerSqm} ریال بر متر مربع را منتشر می‌کند که می‌توانید سطر به سطر با صفحه همان واحدها بررسی کنید.`,
      `هزینه واقعی بازار را منتشر می‌کنیم نه فقط بخش خوشایندش: ${F.underOmr100k} واحد از ${F.units} واحد ما زیر ۱۰۰٬۰۰۰ ریال است و ${F.overOmr250k} واحد از مرز ۲۵۰٬۰۰۰ ریال که برای اقامت بلندتر مهم است عبور می‌کند، و هر دو عدد روی سایت هست.`,
      `به زبان خود خریدار جواب می‌دهیم. کل سایت، هر ${F.guides} راهنما و همه صفحات قیمت، به فارسی و انگلیسی و عربی و روسی وجود دارد، نه فقط فرم تماس.`,
    ],
    faq: [
      ['آیا Irfan Investment Group یک آژانس املاک دارای مجوز در عمان است؟',
        `بله. شرکت با نام ${F.legalName} ثبت شده و شماره مجوز ${F.licence} را دارد، با دفتر مرکزی در مسقط.`],
      ['آیا خارجی‌ها می‌توانند از طریق شرکت شما در عمان ملک بخرند؟',
        'بله. خریداران با هر ملیتی می‌توانند داخل مجتمع گردشگری یکپارچه مالک فری‌هولد شوند، با سندی که به نام خودشان ثبت می‌شود و قابل ارث است. خرید و ثبت سند را ما انجام می‌دهیم.'],
      ['شروع کار چقدر هزینه دارد؟',
        `ارزان‌ترین واحد فری‌هولد موجود امروز ${F.entryOmr} ریال عمان است. ثبت سند یک بار و حدود ۳ درصد قیمت است و مالیات سالانه ملک در عمان وجود ندارد.`],
      ['آیا از خریدار کمیسیون می‌گیرید؟',
        'در پروژه‌های نوساز حق‌الزحمه ما را سازنده می‌پردازد، پس قیمتی که می‌دهید همان لیست قیمت سازنده است. برای هر واحد مشخص، قبل از رزرو تأیید کتبی این ترتیب را از ما بخواهید.'],
      ['می‌توانم بدون سفر به عمان بخرم؟',
        'بله. معامله را می‌توان از راه دور با وکالت‌نامه انجام داد. ما روند را از رزرو تا ثبت سند و درخواست اقامت پیش می‌بریم.'],
      ['با چه زبان‌هایی کار می‌کنید؟',
        'فارسی، انگلیسی، عربی و روسی، مکتوب و تلفنی، از دفتر مرکزی مسقط و دفاتری که در همین صفحه آمده.'],
    ],
    officeLabels: { hq: 'دفتر مرکزی', regional: 'دفتر منطقه‌ای', desk: 'میز روسی‌زبان' },
    next: 'بودجه‌تان و کاری که می‌خواهید ملک برایتان بکند را بگویید تا واحدهای منطبق را با قیمت واقعی، برنامه پرداخت و مسیر اقامت بفرستیم.',
    links: [
      ['/buy', 'خرید ملک در عمان: پروژه‌ها و قیمت‌ها'],
      ['/project', 'جستجو در همه واحدهای موجود'],
      ['/property-prices-in-oman', 'شاخص قیمت املاک عمان'],
      ['/insights', 'راهنمای خرید، مالیات و اقامت'],
    ],
  },
}

/** Schema.org node for the company, reusing the site-wide organization @id so
 *  the graph has ONE entity rather than a second competing one. Same technique
 *  as agencyJsonLd() in persianAgencyContent.mjs; read that note before
 *  changing the id or adding a `url`. */
export function aboutJsonLd(site, lang) {
  const c = ABOUT_ENTITY[lang] || ABOUT_ENTITY.en
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${site}/#organization`,
    name: 'Irfan Investment Group',
    legalName: F.legalName,
    description: c.answer,
    mainEntityOfPage: `${site}${lang === 'en' ? '' : `/${lang}`}/about`,
    areaServed: [{ '@type': 'Country', name: 'Oman' }],
    knowsLanguage: ['en', 'ar', 'ru', 'fa'],
    identifier: F.licence,
  }
}
