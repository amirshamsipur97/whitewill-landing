// ─────────────────────────────────────────────────────────────────
// Demo + real details per project, keyed by exact `projects.name`
// in Supabase. Used by the PropertyMap DetailsPanel.
//
// When the real spec sheet is delivered, swap fields per project —
// the shape is intentionally flat so a future migration to a
// `project_details` table is a 1:1 mapping.
// ─────────────────────────────────────────────────────────────────

const D = {
  'TSCY': {
    tagline: 'The Sustainable City — Yiti',
    description:
      'Oman\'s first net-zero master community on the Yiti coastline — villas and townhouses powered by solar with shaded green streets, organic farms, and bike-first urbanism.',
    units: ['Villa', 'Townhouse'],
    bedrooms: '2 – 5',
    priceFrom: 'OMR 165,000',
    handover: '2026 – 2027',
  },
  'Aida': {
    tagline: 'Cliffside resort living — Yenkit',
    description:
      'A Dar Al Arkan & Trump Organization masterpiece — branded residences perched on a 130-metre cliff above the Sea of Oman, with golf, beach club and 5-star hospitality on site.',
    units: ['Apartment', 'Villa'],
    bedrooms: '1 – 4',
    priceFrom: 'OMR 85,971',
    handover: '2027 – 2028',
  },
  'Jebel Sifah': {
    tagline: 'Mountain & marina escape — 45 min from Muscat',
    description:
      'An integrated marina town by Muriya — apartments, townhouses and villas wrapped around a championship golf course, beach, and Sifawy Boutique Hotel.',
    units: ['Apartment', 'Townhouse', 'Villa'],
    bedrooms: '1 – 5',
    priceFrom: 'OMR 95,000',
    handover: 'Ready & off-plan',
  },
  'Muscat Bay (Zen/Luma)': {
    tagline: 'New phases at Muscat Bay — Zen & Luma',
    description:
      'Modern hillside apartments and villas inside the gated Muscat Bay community — direct beach access, dual marinas and a Jumeirah hotel as neighbour.',
    units: ['Apartment', 'Townhouse'],
    bedrooms: '1 – 4',
    priceFrom: 'OMR 135,000',
    handover: '2026',
  },
  'Muscat Bay Ready': {
    tagline: 'Move-in-ready inventory · Muscat Bay',
    description:
      'A curated list of completed villas and apartments inside Muscat Bay — keys in hand, freehold, with full beach-club membership.',
    units: ['Apartment', 'Villa'],
    bedrooms: '2 – 5',
    priceFrom: 'OMR 180,000',
    handover: 'Ready',
  },
  'Hay Al Wafa': {
    tagline: 'Family neighbourhood · Al Mouj',
    description:
      'The newest residential phase at Al Mouj Muscat — contemporary villas grouped around shaded pocket parks within walking distance of the marina and Pulse playground.',
    units: ['Villa'],
    bedrooms: '3 – 5',
    priceFrom: 'OMR 245,000',
    handover: '2026 – 2027',
  },
  'Wadi Zaha': {
    tagline: 'Wadi-front community · Sultan Haitham City',
    description:
      'A mixed-use district at SHC — studios, 1–3 BR apartments, garden villas, sky villas and rooftop penthouses with central park, boulevard and mountain views.',
    units: ['Apartment', 'Sky Villa', 'Penthouse', 'Townhouse', 'Villa'],
    bedrooms: 'Studio – 4',
    priceFrom: 'OMR 48,125',
    handover: '2026 – 2027',
  },
  'Sarooj Apartments': {
    tagline: 'Lifestyle apartments · Al Mouj',
    description:
      'Sarooj is Al Mouj\'s new low-rise apartment district — sea-view residences with retail, F&B and a residents\' beach club at street level.',
    units: ['Apartment'],
    bedrooms: '1 – 3',
    priceFrom: 'OMR 110,000',
    handover: '2027',
  },
  'Sarooj Villas': {
    tagline: 'Coastal villas · Al Mouj',
    description:
      'Beach-edge villas in the Sarooj district — private gardens, rooftop terraces and unobstructed sea views.',
    units: ['Villa'],
    bedrooms: '3 – 5',
    priceFrom: 'OMR 290,000',
    handover: '2027',
  },
  'Yenaier': {
    tagline: 'Mixed-use mid-rise residences · Sultan Haitham City',
    description:
      'A vertical neighbourhood inside Sultan Haitham City — Loggia Studios and 1- to 3-bedroom Sky Residences and Sky Villas, plus two full-floor Sky Palace penthouses, all over a plaza-level retail and F&B podium.',
    units: ['Studio', 'Apartment', 'Penthouse'],
    bedrooms: 'Studio – 3',
    priceFrom: 'OMR 54,600',
    handover: '2027',
  },
  'Azura': {
    tagline: 'Branded residences · Sultan Haitham City',
    description:
      'Sleek mid-rise apartments in Oman\'s flagship new city, designed around shaded promenades, lagoons and a smart-city backbone.',
    units: ['Apartment'],
    bedrooms: '1 – 3',
    priceFrom: 'OMR 88,000',
    handover: '2026 – 2027',
  },
  'Vistal': {
    tagline: 'Beachfront residences · Al Mouj',
    description:
      'A low-rise residential community at Al Mouj — 1- and 2-bedroom apartments plus beachfront duplexes with sea, pool and golf-course views.',
    units: ['Apartment', 'Duplex'],
    bedrooms: '1 – 3',
    priceFrom: 'OMR 133,634',
    handover: '2026 – 2027',
  },
  'St. Regis': {
    tagline: 'St. Regis Residences · Muscat',
    description:
      'Branded residences with full St. Regis services — Butler service, private pools and the brand\'s signature waterfront hospitality.',
    units: ['Apartment', 'Penthouse'],
    bedrooms: '2 – 5',
    priceFrom: 'OMR 540,000',
    handover: '2028',
  },
  'Bellevue': {
    tagline: 'Hillside apartments · Sultan Haitham City',
    description:
      'Apartments with panoramic city and lagoon views from elevated terraces — high-spec finishes and rooftop amenities.',
    units: ['Apartment'],
    bedrooms: '1 – 3',
    priceFrom: 'OMR 95,000',
    handover: '2027',
  },
  'Opal': {
    tagline: 'Apartments at Muscat Hills',
    description:
      'Contemporary apartments next to the championship golf course — clubhouse access, pool deck and bistro included.',
    units: ['Apartment'],
    bedrooms: '1 – 3',
    priceFrom: 'OMR 78,000',
    handover: '2026',
  },
  'Golf Hills': {
    tagline: 'Golf-front villas · Muscat Hills',
    description:
      'Villas fronting the 7th and 8th fairways — private pools, full-height glazing and roof-deck living.',
    units: ['Villa'],
    bedrooms: '4 – 5',
    priceFrom: 'OMR 320,000',
    handover: '2026',
  },
  'Shops (Pearl-Ready)': {
    tagline: 'Retail units · Muscat Hills (Pearl)',
    description:
      'Ready-to-fit retail and F&B units inside the Pearl plaza — high footfall from golf, club and residential traffic.',
    units: ['Retail unit'],
    bedrooms: '—',
    priceFrom: 'OMR 65,000',
    handover: 'Ready',
  },
  'Hawana Salalah': {
    tagline: 'Resort residences · Salalah',
    description:
      'An integrated tourist destination by Muriya — apartments, townhouses and villas inside a 6-million-m² master plan with marina, beaches and three hotels.',
    units: ['Apartment', 'Townhouse', 'Villa'],
    bedrooms: '1 – 4',
    priceFrom: 'OMR 85,000',
    handover: 'Ready & off-plan',
  },
  'Plumeria (Sohar)': {
    tagline: 'Beachfront community · Sohar',
    description:
      'A new freehold beachfront community on Oman\'s Al Batinah coast — villas, townhouses and a hotel & beach club anchoring the master plan.',
    units: ['Townhouse', 'Villa'],
    bedrooms: '3 – 5',
    priceFrom: 'OMR 145,000',
    handover: '2027',
  },
  'Mandarine Oriental': {
    tagline: 'Mandarin Oriental Residences · Muscat',
    description:
      'Ultra-luxury branded residences with the Mandarin Oriental service legacy — spa, fine dining and bespoke concierge for owners.',
    units: ['Apartment', 'Penthouse'],
    bedrooms: '2 – 5',
    priceFrom: 'OMR 620,000',
    handover: '2028',
  },
  'Maysan (Duqum)': {
    tagline: 'Coastal community · Duqm SEZ',
    description:
      'A planned residential community supporting Duqm\'s special economic zone — apartments and townhouses for the next wave of growth on Oman\'s east coast.',
    units: ['Apartment', 'Townhouse'],
    bedrooms: '1 – 4',
    priceFrom: 'OMR 72,000',
    handover: '2027 – 2028',
  },
}

// Arabic translations layered over the English defaults — only the
// fields that meaningfully change per-locale (tagline + description).
// Numeric / structural fields (priceFrom, units, bedrooms, handover)
// stay shared since they're the same in every language.
const AR_OVERLAY = {
  'TSCY': {
    tagline: 'المدينة المستدامة — يتي',
    description: 'أول مجتمع رئيسي بصافي انبعاثات صفرية في عُمان على ساحل يتي — فلل وتاون هاوس بالطاقة الشمسية، شوارع خضراء مظلّلة، مزارع عضوية وتخطيط حضري يعطي الأولوية للدراجة.',
  },
  'Aida': {
    tagline: 'إقامات منتجعية على المنحدر — ينكيت',
    description: 'تحفة من Dar Al Arkan و Trump Organization — إقامات مُوقَّعة على منحدر بارتفاع 130 متراً فوق بحر عُمان، مع غولف ونادي شاطئي وضيافة 5 نجوم في الموقع.',
  },
  'Jebel Sifah': {
    tagline: 'ملاذ جبلي وبحري — على بُعد 45 دقيقة من مسقط',
    description: 'مدينة مارينا متكاملة من Muriya — شقق وتاون هاوس وفلل تحيط بملعب غولف عالمي وشاطئ وفندق Sifawy البوتيكي.',
  },
  'Muscat Bay (Zen/Luma)': {
    tagline: 'مراحل جديدة في خليج مسقط — Zen و Luma',
    description: 'شقق وفلل عصرية على التلال داخل مجتمع خليج مسقط المسوّر — وصول مباشر للشاطئ، مارينا مزدوجة، وفندق جميرا كجار.',
  },
  'Muscat Bay Ready': {
    tagline: 'مخزون جاهز للسكن · خليج مسقط',
    description: 'قائمة منتقاة من الفلل والشقق المكتملة داخل خليج مسقط — مفاتيح بالأيدي، تملك حر، مع عضوية كاملة للنادي الشاطئي.',
  },
  'Hay Al Wafa': {
    tagline: 'حي عائلي ذو طابع — مسقط الكبرى',
    description: 'تطوير سكني هادئ بأسعار في المتناول وحدائق مجتمعية ووصول سهل لمراكز مسقط التجارية والمدنية.',
  },
  'Wadi Zaha': {
    tagline: 'إقامات راقية مع إطلالات على الجبال',
    description: 'مزيج من الشقق والتاون هاوس مع تفاصيل تصميم راقية، تطل على وادي عُماني درامي، على بُعد دقائق من مسقط الكبرى.',
  },
  'Sarooj Apartments': {
    tagline: 'شقق على الواجهة البحرية — حي السروج',
    description: 'مبانٍ منخفضة الارتفاع على الواجهة البحرية مع إطلالات على البحر ووصول للمنتجعات، استوديوهات إلى 3 غرف بأسعار في المتناول.',
  },
  'Sarooj Villas': {
    tagline: 'فلل بحرية — حي السروج',
    description: 'فلل على حافة الشاطئ في حي السروج — حدائق خاصة وشرفات على السطح وإطلالات بحرية غير محجوبة.',
  },
  'Yenaier': {
    tagline: 'إقامات متعددة الاستخدامات متوسطة الارتفاع · مدينة السلطان هيثم',
    description: 'حي عمودي داخل مدينة السلطان هيثم — استوديوهات Loggia وشقق Sky Residences وفلل Sky Villas من غرفة إلى 3 غرف، بالإضافة إلى بنتهاوس Sky Palace بطابق كامل، فوق منصة تجارية للبيع بالتجزئة والمأكولات.',
  },
  'Azura': {
    tagline: 'إقامات مُوقَّعة · مدينة السلطان هيثم',
    description: 'شقق أنيقة متوسطة الارتفاع في المدينة الرائدة الجديدة بعُمان، مصممة حول ممرات مظللة وبحيرات وبنية تحتية ذكية.',
  },
  'Vistal': {
    tagline: 'إقامات على الواجهة البحرية · الموج',
    description: 'مجتمع سكني منخفض الارتفاع في الموج — شقق غرفة وغرفتين بالإضافة إلى دوبلكسات شاطئية بإطلالات على البحر والمسبح وملعب الغولف.',
  },
  'St. Regis': {
    tagline: 'إقامات St. Regis · مسقط',
    description: 'إقامات مُوقَّعة مع كامل خدمات St. Regis — خدمة الخادم الشخصي، مسابح خاصة، وضيافة العلامة المميزة على الواجهة البحرية.',
  },
  'Bellevue': {
    tagline: 'إقامات منتقاة · الموج',
    description: 'مجموعة بوتيكية من الشقق والمنازل المتراصة المطلة على المارينا، بتشطيبات عصرية ووصول سهل لخدمات الموج.',
  },
  'Opal': {
    tagline: 'تطوير سكني — مسقط',
    description: 'شقق عصرية في موقع مريح، تجمع بين البساطة الأنيقة والقيمة طويلة الأمد للمستثمر والساكن النهائي على حد سواء.',
  },
  'Golf Hills': {
    tagline: 'إقامات بإطلالات على الغولف — تلال مسقط',
    description: 'فلل وشقق متموجة فوق ملعب الغولف لتلال مسقط، مع إطلالات بانورامية وتشطيبات بمعايير عالمية.',
  },
  'Shops (Pearl-Ready)': {
    tagline: 'منافذ تجزئة بالتجزئة — مسقط',
    description: 'مساحات تجزئة جاهزة بحركة عالية ومواقف وفيرة وعروض مرنة للمشغّلين الجدد والمؤسسين.',
  },
  'Hawana Salalah': {
    tagline: 'حياة المنتجع · صلالة',
    description: 'مجتمع مارينا حائز على جوائز في الجنوب — شقق وفلل بقربها فنادق وخدمات نادي شاطئي على مدار العام.',
  },
  'Plumeria (Sohar)': {
    tagline: 'حياة حضرية · صحار',
    description: 'تطوير سكني عصري في صحار يخدم العائلات والمهنيين، بقربه مدارس ومستشفيات ومراكز تجارية.',
  },
  'Mandarine Oriental': {
    tagline: 'إقامات Mandarin Oriental — مسقط',
    description: 'إقامات فائقة الفخامة مُديرها الفندق الأيقوني، مع خدمة الكونسيرج والوصول إلى الكتالوج الكامل للضيافة.',
  },
  'Maysan (Duqum)': {
    tagline: 'سكن وقيادة قطاع — الدقم',
    description: 'تطوير سكني في المنطقة الاقتصادية الخاصة بالدقم — يستهدف موظفي القطاع والمستثمرين الباحثين عن نمو القيمة على المدى المتوسط.',
  },
}

const RU_OVERLAY = {
  'TSCY': {
    tagline: 'The Sustainable City — Yiti',
    description: 'Первое в Омане устойчивое сообщество с нулевыми выбросами на побережье Йити — виллы и таунхаусы на солнечной энергии, тенистые зелёные улицы, органические фермы и приоритет велосипедов в планировке.',
  },
  'Aida': {
    tagline: 'Курортная жизнь на скале — Йенкит',
    description: 'Шедевр Dar Al Arkan и Trump Organization — брендированные резиденции на 130-метровой скале над Оманским заливом, с гольфом, пляжным клубом и 5-звёздочным гостеприимством на месте.',
  },
  'Aida ': {},
  'Jebel Sifah': {
    tagline: 'Горный и яхтенный курорт — 45 минут от Маската',
    description: 'Интегрированная марина-город от Muriya — апартаменты, таунхаусы и виллы вокруг чемпионского гольф-курса, пляжа и бутик-отеля Sifawy.',
  },
  'Muscat Bay (Zen/Luma)': {
    tagline: 'Новые фазы Muscat Bay — Zen и Luma',
    description: 'Современные апартаменты и виллы на склоне внутри закрытого сообщества Muscat Bay — прямой доступ к пляжу, две марины и отель Jumeirah рядом.',
  },
  'Muscat Bay Ready': {
    tagline: 'Готовая к заселению недвижимость · Muscat Bay',
    description: 'Подборка готовых вилл и апартаментов внутри Muscat Bay — ключи в руки, фрихолд, полное членство в пляжном клубе.',
  },
  'Yenaier': {
    tagline: 'Многофункциональные среднеэтажные резиденции · Sultan Haitham City',
    description: 'Вертикальный квартал внутри Sultan Haitham City — Loggia-студии, Sky Residences и Sky Villas с 1–3 спальнями, плюс два пентхауса Sky Palace на полный этаж, над торгово-ресторанной плазой.',
  },
  'St. Regis': {
    tagline: 'Резиденции St. Regis · Маскат',
    description: 'Брендированные резиденции с полным сервисом St. Regis — служба батлера, частные бассейны и фирменное гостеприимство бренда на побережье.',
  },
  'Vistal': {
    tagline: 'Резиденции у воды · Al Mouj',
    description: 'Малоэтажное жилое сообщество в Al Mouj — 1- и 2-комнатные апартаменты плюс пляжные дуплексы с видами на море, бассейн и поле для гольфа.',
  },
  'Wadi Zaha': {
    tagline: 'Резиденции премиум-класса с видом на горы',
    description: 'Смесь апартаментов и таунхаусов с продуманными деталями дизайна, видом на драматичное вади и в нескольких минутах от Маската.',
  },
}

// Merge defaults + active-locale overrides. Numeric/structural fields
// stay shared; only tagline + description (and any future copy fields)
// pull from the overlay. Fallback chain: locale → English default.
export function getProjectDetails(name, lang = 'en') {
  const base = D[name]
  if (!base) return null
  const overlay = lang === 'ar' ? AR_OVERLAY[name] : lang === 'ru' ? RU_OVERLAY[name] : null
  return overlay ? { ...base, ...overlay } : base
}

export default D
