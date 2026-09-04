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
  'The Arc Residences': {
    tagline: 'Signature residences · Yiti',
    description:
      'A single curved tower on the Yiti waterfront, split into three collections: Opal, Oria and Onda. The release runs from 2-bedroom signature apartments to duplexes, sky terraces and full-floor penthouses, with private pools on most of the upper homes.',
    units: ['Apartment', 'Duplex', 'Penthouse'],
    bedrooms: '2 – 4',
    priceFrom: 'OMR 423,883',
    features: ['seaView', 'marina', 'mountainView', 'waterfront', 'privatePool', 'concierge', 'gym', 'parking', 'freehold'],
    sections: [
      {
        title: 'The development',
        body: 'The Arc Residences takes its name from its plan: one curved building on the Yiti waterfront, divided into three collections. Opal faces the sea and the marina, Oria looks to the mountains and the marina, and Onda sits between them. The current release spans 27 homes, from 2-bedroom apartments of about 166 sqm to a 1,086 sqm penthouse.',
      },
      {
        title: 'Residences & design',
        body: 'Five formats share the tower. Signature apartments run from 2 to 4 bedrooms with covered terraces; duplexes stack living and sleeping levels across two floors; Sky Terrace and Sky Garden homes add outdoor rooms of 90 to 840 sqm; and two seventh-floor penthouses take a full plate each. Private pools come with the Sky Garden, Sky Terrace and penthouse homes.',
      },
      {
        title: 'Location & connectivity',
        body: 'Yiti sits on the coast south of Muscat, reached by the new coastal road past Bandar Jissah and Muscat Bay. Homes look out over the marina, the Sea of Oman and the hills behind the bay.',
      },
      {
        title: 'Investment & ownership',
        body: 'Yiti is open to buyers of every nationality on a freehold title that carries eligibility for the renewable Oman property owner residency. Prices in this release start at OMR 423,883 excluding VAT and reach OMR 2,168,938 for the largest penthouse.',
      },
    ],
  },
  'Aida': {
    tagline: 'Cliffside resort living — Yenkit',
    description:
      'A Dar Al Arkan & Trump Organization masterpiece — branded residences perched on a 130-metre cliff above the Sea of Oman, with golf, beach club and 5-star hospitality on site.',
    units: ['Apartment', 'Villa'],
    bedrooms: '1 – 4',
    priceFrom: 'OMR 85,971',
    handover: '2027 – 2028',
    features: ['seaView', 'golfCourse', 'beachClub', 'infinityPool', 'fiveStarHotel', 'spa', 'concierge', 'brandedResidences', 'smartHome', 'freehold'],
    sections: [
      {
        title: 'The development',
        body: 'Aida is a landmark branded-residence community rising along the cliffs of Yiti, just south of Muscat. Master-developed by Dar Al Arkan with the Trump Organization, it pairs Trump-branded golf and hospitality with freehold homes set 130 metres above the Sea of Oman — one of the most ambitious luxury real estate launches in Oman to date.',
      },
      {
        title: 'Location & connectivity',
        body: 'Set within the Yiti sustainable tourism zone, Aida is roughly 20 minutes from central Muscat and Muscat International Airport via the coastal road, while the marina, old town and Muttrah corniche stay within an easy drive.',
      },
      {
        title: 'Residences & design',
        body: 'Choose from 1- to 4-bedroom apartments and cliff-edge villas finished to international branded-residence standards — floor-to-ceiling glazing, private terraces and panoramic sea views. An 18-hole golf course, beach club, spa and 5-star hotel sit on site, with concierge and hospitality managed to Trump standards.',
      },
      {
        title: 'Investment & ownership',
        body: 'Aida lies in a designated Integrated Tourism Complex (ITC), so homes are sold freehold to all nationalities with residency eligibility. With handover scheduled for 2027–2028 and prices from OMR 85,971, off-plan buyers can secure one of Oman’s most anticipated coastal addresses ahead of completion.',
      },
    ],
  },
  'Jebel Sifah': {
    tagline: 'Mountain & marina escape — 45 min from Muscat',
    description:
      'An integrated marina town by Muriya — apartments, townhouses and villas wrapped around a championship golf course, beach, and Sifawy Boutique Hotel. Now selling in the new Raya district: Solaris golf-view apartments and Olive Farms farm houses at Raya, ready apartments at Golf Lake and Jebel Sifah Heights, and Raya standalone villas.',
    units: ['Apartment', 'Farm House', 'Villa'],
    bedrooms: '1 – 5',
    priceFrom: 'OMR 63,500',
    handover: 'Ready & off-plan',
    subProjects: [
      {
        key: 'Solaris',
        name: 'Solaris · Raya',
        gallerySlug: 'solaris',
        location: 'Raya · Jebel Sifah',
        blurb: {
          en: 'Golf-view studios and apartments in Raya at Jebel Sifah — 2-bed apartments from OMR 81,035 with golf-front gardens on the ground floor, off-plan with 10% down and a ~2-year plan, delivery from Q4 2027.',
          ru: 'Студии и апартаменты с видом на гольф в Рая, Джебель-Сифа — 2-спальные апартаменты от 81 035 OMR, часть с садами у гольф-поля; офф-план: 10% взнос, план ~2 года, передача с Q4 2027.',
          ar: 'استوديوهات وشقق بإطلالة على الغولف في رايا بجبل صيفة: شقق بغرفتين من 81,035 ر.ع وبعضها بحدائق مطلة على الغولف، على الخارطة بدفعة أولى 10% وخطة نحو سنتين، والتسليم من الربع الأخير 2027.',
          fa: 'استودیو و آپارتمان با منظره گلف در رایا در جبل سیفه؛ آپارتمان دوخوابه از ۸۱٬۰۳۵ ریال که برخی باغچه رو به گلف دارند. پیش‌فروش با ۱۰٪ پیش‌پرداخت و طرح حدود دوساله، تحویل از پایان ۲۰۲۷.',
        },
      },
      {
        key: 'Olive Farms',
        name: 'Olive Farms · Raya',
        gallerySlug: 'olive-farms',
        location: 'Raya · Jebel Sifah',
        blurb: {
          en: 'Freehold farm houses in Raya at Jebel Sifah — three-bedroom farm houses on 350 m² plots with private gardens, from OMR 123,600. Off-plan, 10% down + 7.5% quarterly over 3 years.',
          ru: 'Фермерские дома (фрихолд) в Рая, Джебель-Сифа — 1–3 спальни на участках 260–350 м² с садом, от 123 600 OMR. Офф-план: 10% взнос + 7,5% ежеквартально, 3 года.',
          ar: 'بيوت مزارع تملّك حر في رايا بجبل صيفة: ثلاث غرف نوم على قطع 350 م² بحدائق خاصة، من 123,600 ر.ع. على الخارطة: 10% دفعة أولى ثم 7.5% كل ثلاثة أشهر لثلاث سنوات.',
          fa: 'خانه‌مزرعه‌های فری‌هولد در رایا در جبل سیفه؛ یک تا سه‌خوابه روی زمین ۲۶۰ تا ۳۵۰ متری با باغ اختصاصی، از ۱۲۳٬۶۰۰ ریال عمان. پیش‌فروش با ۱۰٪ پیش‌پرداخت و ۷.۵٪ فصلی در سه سال.',
        },
      },
    ],
  },
  'Zen Residences': {
    tagline: 'Studios, apartments & lofts · Muscat Bay',
    description:
      'A new launch by Zen Development and Investment inside the gated Muscat Bay community at Bandar Jissah — studios, apartments and double-height lofts above a private bay, with a five-star Jumeirah resort, marina and beach as neighbours.',
    units: ['Apartment'],
    bedrooms: '2 – 3',
    priceFrom: 'OMR 138,000',
    handover: '2026 – 2027',
    features: ['seaView', 'beachAccess', 'infinityPool', 'fiveStarHotel', 'fineDining', 'spa', 'gym', 'landscapedGardens', 'concierge', 'freehold'],
    sections: [
      {
        title: 'The development',
        body: 'Zen Residences is a new community by Zen Development and Investment within Muscat Bay, a gated coastal destination set in a private bay at Bandar Jissah just east of the capital. Launched in 2024, it brings studios, apartments and striking double-height lofts to terraced grounds a short walk from the beach and marina.',
      },
      {
        title: 'Location & connectivity',
        body: 'Bandar Jissah sits around 20 minutes from central Muscat and roughly 35 minutes from Muscat International Airport along a scenic headland road. The five-star Jumeirah Muscat Bay resort, private beach, marina and restaurants are all inside the community.',
      },
      {
        title: 'Residences & design',
        body: 'Homes range from studios and one- to three-bedroom apartments to double-height lofts, several with a maid’s room. Current availability spans 2-bedroom apartments and 2- to 3-bedroom lofts of about 128 to 171 sqm with garden or pool views, finished in a calm, contemporary style.',
      },
      {
        title: 'Lifestyle & amenities',
        body: 'Residents enjoy an infinity pool, a Zen garden with a yoga platform, a gym and workout area, mini-golf, a children’s playground, a BBQ area and a scenic jogging track — alongside Muscat Bay’s private beach, padel and watersports, dining and the Jumeirah hotel.',
      },
      {
        title: 'Investment & ownership',
        body: 'Muscat Bay is a designated Integrated Tourism Complex, so homes are sold freehold to all nationalities with residency eligibility. Off-plan prices start from OMR 138,000 (excluding VAT) on a staged 10 / 70 / 20 payment plan. Contact us for the live availability list.',
      },
    ],
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
    tagline: 'Apartments, townhouses & villas · Sultan Haitham City',
    description:
      'Furnished two-bedroom apartments plus three and four-bedroom townhouses and five-bedroom villas by Al Abrar Real Estate in Hay Al Wafa, one of the first residential neighbourhoods of Sultan Haitham City.',
    units: ['Apartment', 'Townhouse', 'Villa'],
    bedrooms: '2 – 5',
    priceFrom: 'OMR 92,088',
    handover: '2026',
    features: ['pool', 'centralPark', 'retailDining', 'gym', 'cyclingPaths', 'schools', 'parking', 'smartHome'],
    sections: [
      {
        title: 'The development',
        body: 'Hay Al Wafa is one of the first residential neighbourhoods of Sultan Haitham City, developed by Al Abrar Real Estate. The current release spans fully furnished two-bedroom apartments in Buildings 59 and 61, low-rise blocks arranged around the neighbourhood swimming pool and tree-lined boulevard, together with garden-row and courtyard townhouses from Phase 3 and five-bedroom villas from Phase 2.',
      },
      {
        title: 'Location & connectivity',
        body: 'Sultan Haitham City in Seeb is Oman\'s flagship new smart urban district, with direct expressway links to central Muscat and Muscat International Airport. Schools, clinics, mosques, parks and retail are all planned within walking distance across the wider city.',
      },
      {
        title: 'Residences & design',
        body: 'Two efficient two-bedroom apartment layouts of about 127 to 128 sqm built-up area (158 to 161 sqm gross) across floors one to five, handed over fully furnished with a pool, boulevard or side aspect. The townhouse release adds three-bedroom garden-row homes of about 230 sqm and four-bedroom courtyard townhouses of about 256 sqm, while the villas offer five bedrooms across roughly 430 sqm on 400 sqm plots.',
      },
      {
        title: 'Investment & ownership',
        body: 'Apartments start from OMR 92,088 with furniture included, townhouses from OMR 149,500 and five-bedroom villas from OMR 242,000. Extended 60-month payment options are available at adjusted pricing; contact us for the live availability list and eligibility details.',
      },
    ],
  },
  'Wadi Zaha': {
    tagline: 'Wadi-front community · Sultan Haitham City',
    description:
      'A mixed-use district at SHC — studios, 1–3 BR apartments, sky villas and rooftop penthouses with central park, boulevard and mountain views.',
    units: ['Apartment', 'Sky Villa', 'Penthouse'],
    bedrooms: 'Studio – 3',
    priceFrom: 'OMR 61,635',
    handover: '2026 – 2027',
    features: ['mountainView', 'centralPark', 'pool', 'cyclingPaths', 'retailDining', 'gym', 'smartHome', 'schools', 'freehold'],
    sections: [
      {
        title: 'The development',
        body: 'Wadi Zaha is a wadi-front residential district inside Sultan Haitham City, blending studios and 1- to 3-bedroom apartments with sky villas and rooftop penthouses. The community is organised around a central park and tree-lined boulevard, framed by dramatic mountain and wadi views.',
      },
      {
        title: 'Location & connectivity',
        body: 'As part of Sultan Haitham City — Oman’s flagship new urban district east of Muscat — Wadi Zaha benefits from smart-city infrastructure, new expressway links to the capital and walkable access to the schools, healthcare and retail planned across the wider city.',
      },
      {
        title: 'Residences & design',
        body: 'The mix spans compact studios to family sky villas and penthouses, with light-filled interiors, private outdoor space and views over the wadi and surrounding hills. Pedestrian-first streets, pocket parks and cycling paths shape an outdoor, community-led lifestyle.',
      },
      {
        title: 'Investment & ownership',
        body: 'Starting from OMR 61,635 with handover in 2026–2027, Wadi Zaha is among the most affordable freehold-eligible launches in Oman’s new capital district — an attractive off-plan position as Sultan Haitham City matures.',
      },
    ],
  },
  'Sarooj Apartments': {
    tagline: 'Lifestyle apartments · Sultan Haitham City',
    description:
      'Sarooj Oasis is a low-rise apartment district inside Sultan Haitham City, Oman\'s flagship new urban development near Muscat. The current release covers 1- and 2-bedroom homes across two G+5 blocks.',
    units: ['Apartment'],
    bedrooms: '1 – 2',
    priceFrom: 'OMR 66,593',
    handover: '2027',
  },
  'Sarooj Villas': {
    tagline: 'Family villas · Sultan Haitham City',
    description:
      'Sarooj\'s villa release spans attached and stand-alone family homes, from 4-bedroom attached villas on 214 sqm plots to 5- and 6-bedroom stand-alone villas on plots of up to 630 sqm.',
    units: ['Villa'],
    bedrooms: '4 – 6',
    priceFrom: 'OMR 172,200',
    handover: '2027',
  },
  'Yenaier': {
    tagline: 'Mixed-use mid-rise residences · Sultan Haitham City',
    description:
      'A vertical neighbourhood inside Sultan Haitham City — Loggia Studios and 1- to 3-bedroom Sky Residences and Sky Villas, plus two full-floor Sky Palace penthouses, all over a plaza-level retail and F&B podium.',
    units: ['Studio', 'Apartment', 'Penthouse'],
    bedrooms: 'Studio – 3',
    priceFrom: 'OMR 67,200',
    handover: '2027',
    features: ['skyViews', 'retailDining', 'infinityPool', 'gym', 'concierge', 'smartHome', 'landscapedGardens', 'parking', 'freehold'],
    sections: [
      {
        title: 'The development',
        body: 'Yenaier is a mixed-use, mid-rise residential neighbourhood inside Sultan Haitham City — Oman’s flagship new urban development east of Muscat. It layers Loggia Studios, 1- to 3-bedroom Sky Residences and Sky Villas, and two full-floor Sky Palace penthouses above a lively plaza-level podium of retail and dining.',
      },
      {
        title: 'Location & connectivity',
        body: 'Sultan Haitham City is a fully planned smart city designed for around 100,000 residents, linked to Muscat by new expressways and minutes from the airport corridor. Yenaier residents step straight onto landscaped boulevards, parks and community retail without leaving the neighbourhood.',
      },
      {
        title: 'Residences & design',
        body: 'Homes range from efficient Loggia Studios to expansive sky villas and penthouses, all with contemporary finishes, generous balconies and elevated city and park views. The plaza podium brings cafés, shops and everyday services to the doorstep, while shared amenity decks add pool, fitness and lounge space.',
      },
      {
        title: 'Investment & ownership',
        body: 'With prices from OMR 67,200 and handover in 2027, Yenaier is one of the most accessible entry points into Sultan Haitham City’s long-term growth story — appealing to first-time owners and investors seeking off-plan upside in a government-backed masterplan.',
      },
    ],
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
    priceFrom: 'OMR 140,316',
    handover: '2026 – 2027',
    features: ['seaView', 'beachAccess', 'golfCourse', 'pool', 'marina', 'gym', 'landscapedGardens', 'freehold'],
    sections: [
      {
        title: 'The development',
        body: 'Vistal is a low-rise beachfront community at Al Mouj Muscat, Oman’s premier integrated waterfront destination. It combines 1- and 2-bedroom apartments with beachfront duplexes, all oriented to capture sea, pool and golf-course views.',
      },
      {
        title: 'Location & connectivity',
        body: 'Al Mouj sits on the Muscat coastline beside the airport, wrapping a marina, an 18-hole PGA-standard golf course and a vibrant walk of shops, cafés and restaurants. Vistal residents are minutes from the beach, the marina and Muscat International Airport.',
      },
      {
        title: 'Residences & design',
        body: 'Apartments and duplexes feature contemporary interiors, full-height glazing and generous terraces that open toward the shoreline. Residents share landscaped gardens, pools and direct beach access within one of the region’s most established master communities.',
      },
      {
        title: 'Investment & ownership',
        body: 'Al Mouj is a freehold Integrated Tourism Complex open to all nationalities, with title that carries Omani residency. Priced from OMR 140,316 with handover in 2026–2027, Vistal offers off-plan beachfront ownership in a proven, rental-strong location.',
      },
    ],
  },
  'St. Regis': {
    tagline: 'St. Regis Residences · Muscat',
    description:
      'Branded residences with full St. Regis services — Butler service, private pools and the brand\'s signature waterfront hospitality.',
    units: ['Apartment', 'Penthouse'],
    bedrooms: '2 – 5',
    priceFrom: 'OMR 441,631',
    handover: '2028',
    features: ['waterfront', 'butlerService', 'privatePool', 'brandedResidences', 'spa', 'fineDining', 'gym', 'concierge', 'freehold'],
    sections: [
      {
        title: 'The development',
        body: 'The St. Regis Residences bring one of the world’s most storied luxury hospitality brands to the Muscat waterfront. These fully branded residences pair private homes with the signature St. Regis service legacy, including the brand’s renowned butler service.',
      },
      {
        title: 'Location & connectivity',
        body: 'Set on a prime stretch of the Muscat coast, the residences place the capital’s beaches, dining and business districts within easy reach, with Muscat International Airport a short drive away.',
      },
      {
        title: 'Residences & design',
        body: 'Choose from 2- to 5-bedroom residences and penthouses with private pools, expansive sea-facing terraces and interiors finished to St. Regis standards. Owners enjoy spa, fine dining, fitness and bespoke concierge curated by the hotel team.',
      },
      {
        title: 'Investment & ownership',
        body: 'St. Regis is sold freehold, open to all nationalities, and the purchase carries eligibility for Oman investor residency. Available units currently start at OMR 441,631, with handover in 2028.',
      },
    ],
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
    tagline: 'Waterfront resort community · Salalah',
    description:
      'Oman\'s largest resort destination by Muriya — freehold chalets, twin villas and standalone villas across 6 million m² of lagoons, marina and white-sand beach on the Dhofar coast.',
    units: ['Chalet', 'Twin Villa', 'Villa'],
    bedrooms: '1 – 3',
    priceFrom: 'OMR 98,000',
    handover: 'Ready & off-plan',
    featured: true,
    features: ['waterfront', 'beachAccess', 'marina', 'privatePool', 'fiveStarHotel', 'spa', 'landscapedGardens', 'freehold'],
    // Muriya portfolio sub-projects shown as selectable releases on the page.
    // `key` must match project_units.subproject; `gallerySlug` maps to
    // src/assets/projects/<gallerySlug>/ (falls back to the main gallery).
    subProjects: [
      {
        key: 'Amazi',
        name: 'Amazi · Lubana Island',
        gallerySlug: 'amazi',
        location: 'Hawana Salalah · Salalah',
        blurb: {
          en: 'The waterfront heart of Hawana Salalah — lagoon chalets, twin villas and the new Lubana Island villas, freehold with residency eligibility.',
          ru: 'Прибрежное сердце Hawana Salalah — шале у лагун, твин-виллы и новые виллы Lubana Island, фрихолд с правом на резидентство.',
          ar: 'قلب هوانا صلالة على الواجهة المائية: شاليهات البحيرات والفلل التوأم وفلل جزيرة لبانة الجديدة، تملّك حر مع أهلية الإقامة.',
          fa: 'قلب رو به آب هوانا صلاله؛ شاله‌های لاگونی، ویلاهای دوقلو و ویلاهای جدید جزیره لوبانا، فری‌هولد با امکان اقامت.',
        },
      },
    ],
    sections: [
      {
        title: 'The destination',
        body: 'Hawana Salalah is Oman\'s largest integrated tourism destination, master-developed by Muriya (Orascom Development) on the Dhofar coast. Across roughly 6 million m² it gathers a 170-berth marina, seven kilometres of white-sand beach, swimmable lagoons, five hotels and a water park — with freehold homes woven between them.',
      },
      {
        title: 'Lubana Island',
        body: 'Lubana Island is the newest residential release at Hawana Salalah — an island neighbourhood in the Amazi district set directly on the lagoons, by Muriya (Orascom Development). The current offer is 3-bedroom lagoon-view villas: single-storey villas of 145 m² built-up with 413 m² gardens on plots of ~558 m² from OMR 170,500, and G+1 villas of 170 m² built-up plus a study room, with 454 m² gardens on plots of 580 m², from OMR 268,600 (prices before 5% VAT). Off-plan with a 3-year developer payment plan — 10% down, then 7.5% quarterly — and delivery three years from contract.',
      },
      {
        title: 'Homes & starting prices',
        body: 'Current availability spans four formats: 1-bedroom waterfront chalets from OMR 98,000 with projected rental returns up to 10.6%, 2-bedroom beachfront chalets from OMR 129,000, 2-bedroom twin villas with private gardens from OMR 160,000, and 3-bedroom standalone villas from OMR 260,000 — with flexible developer payment plans on off-plan releases and ready units for immediate handover.',
      },
      {
        title: 'Two high seasons',
        body: 'Salalah is the only Gulf destination with two distinct tourist seasons: the khareef monsoon (June–September) draws hundreds of thousands of GCC visitors escaping the summer heat, while mild winters bring European charter tourism. For owners this means an unusually long rental calendar — a holiday home here earns in summer and winter alike, which is why projected yields run well above regional averages.',
      },
      {
        title: 'Location & access',
        body: 'The community sits on Taqah Road, about 15 minutes from Salalah city centre and 20 minutes from Salalah International Airport — connected year-round to Muscat and, especially during khareef, directly to Dubai, Sharjah, Abu Dhabi, Riyadh, Jeddah, Dammam, Doha and Kuwait.',
      },
      {
        title: 'Freehold & investor visa',
        body: 'Hawana Salalah is a designated Integrated Tourism Complex (ITC): homes are sold freehold to all nationalities, ownership qualifies buyers to apply for Omani residency, and there is no income tax or annual property tax. Book a free consultation for the current inventory list across Hawana and Lubana Island.',
      },
    ],
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
  'The Arc Residences': {
    tagline: 'إقامات مُوقَّعة · يتي',
    description: 'برج واحد منحني على واجهة يتي البحرية، مقسّم إلى ثلاث مجموعات: أوبال وأوريا وأوندا. يمتد الإطلاق من شقق بغرفتي نوم إلى دوبلكس وسكاي تراس وبنتهاوس بطابق كامل، مع مسابح خاصة في معظم الوحدات العلوية.',
    sections: [
      { title: 'عن المشروع', body: 'يستمد The Arc Residences اسمه من مخططه: مبنى واحد منحني على واجهة يتي البحرية، مقسّم إلى ثلاث مجموعات. تطل أوبال على البحر والمارينا، وتنظر أوريا إلى الجبال والمارينا، وتقع أوندا بينهما. يضم الإطلاق الحالي 27 مسكناً، من شقق بغرفتي نوم بنحو 166 م² إلى بنتهاوس بمساحة 1,086 م².' },
      { title: 'الوحدات والتصميم', body: 'خمس صيغ داخل البرج نفسه. شقق Signature من غرفتين إلى أربع غرف نوم مع تراسات مغطّاة، ودوبلكس يوزّع المعيشة والنوم على طابقين، ووحدات Sky Terrace وSky Garden تضيف مساحات خارجية من 90 إلى 840 م²، وبنتهاوسان في الطابق السابع يشغل كل منهما طابقاً كاملاً. المسابح الخاصة ترافق وحدات Sky Garden وSky Terrace والبنتهاوس.' },
      { title: 'الموقع والوصول', body: 'تقع يتي على الساحل جنوب مسقط، ويصلها الطريق الساحلي الجديد عبر بندر الجصة وخليج مسقط. تطل المساكن على المارينا وبحر عُمان وتلال الخليج.' },
      { title: 'الاستثمار والتملّك', body: 'يتي مفتوحة لجميع الجنسيات بتملّك حر يؤهّل لإقامة مالك العقار العمانية القابلة للتجديد. تبدأ أسعار هذا الإطلاق من 423,883 ر.ع غير شاملة الضريبة وتصل إلى 2,168,938 ر.ع لأكبر بنتهاوس.' },
    ],
  },
  'TSCY': {
    tagline: 'المدينة المستدامة — يتي',
    description: 'أول مجتمع رئيسي بصافي انبعاثات صفرية في عُمان على ساحل يتي — فلل وتاون هاوس بالطاقة الشمسية، شوارع خضراء مظلّلة، مزارع عضوية وتخطيط حضري يعطي الأولوية للدراجة.',
  },
  'Aida': {
    tagline: 'إقامات منتجعية على المنحدر — ينكيت',
    description: 'تحفة من Dar Al Arkan و Trump Organization — إقامات مُوقَّعة على منحدر بارتفاع 130 متراً فوق بحر عُمان، مع غولف ونادي شاطئي وضيافة 5 نجوم في الموقع.',
    sections: [
      {
        title: 'عن المشروع',
        body: 'عايدة مجتمع إقامات مُوقَّعة بارز يرتفع على منحدرات يتي جنوب مسقط. يطوّره Dar Al Arkan بالشراكة مع Trump Organization، ويجمع بين الغولف والضيافة بعلامة ترامب ومنازل تملّك حر على ارتفاع 130 متراً فوق بحر عُمان — أحد أبرز إطلاقات العقارات الفاخرة في عُمان.',
      },
      {
        title: 'الموقع والوصول',
        body: 'ضمن منطقة يتي السياحية المستدامة، تبعد عايدة نحو 20 دقيقة عن وسط مسقط ومطار مسقط الدولي عبر الطريق الساحلي، مع بقاء المارينا والبلدة القديمة وكورنيش مطرح على مسافة قريبة بالسيارة.',
      },
      {
        title: 'الوحدات والتصميم',
        body: 'شقق من غرفة إلى 4 غرف وفلل على حافة المنحدر بمعايير الإقامات المُوقَّعة العالمية — واجهات زجاجية ممتدة وشرفات خاصة وإطلالات بحرية بانورامية. ملعب غولف 18 حفرة ونادٍ شاطئي وسبا وفندق 5 نجوم في الموقع مع خدمات كونسيرج بمعايير ترامب.',
      },
      {
        title: 'الاستثمار والتملّك',
        body: 'تقع عايدة ضمن مجمّع سياحي متكامل (ITC)، فتُباع المنازل تملّكاً حراً لجميع الجنسيات مع أهلية الإقامة. مع تسليم متوقع 2027–2028 وأسعار من 85,971 ر.ع، يدخل مشترو المخطط أحد أكثر العناوين الساحلية ترقّباً في عُمان.',
      },
    ],
  },
  'Jebel Sifah': {
    tagline: 'ملاذ جبلي وبحري — على بُعد 45 دقيقة من مسقط',
    description: 'مدينة مارينا متكاملة من Muriya — شقق وتاون هاوس وفلل تحيط بملعب غولف عالمي وشاطئ وفندق Sifawy البوتيكي.',
  },
  'Zen Residences': {
    tagline: 'استوديوهات وشقق ولوفت · خليج مسقط',
    description: 'مشروع جديد من Zen Development and Investment داخل مجتمع خليج مسقط المسوّر في بندر الجصة — استوديوهات وشقق ولوفت بسقف مزدوج فوق خليج خاص، بجوار منتجع جميرا الخمس نجوم والمارينا والشاطئ.',
    sections: [
      { title: 'عن المشروع', body: 'Zen Residences مجتمع جديد من Zen Development and Investment داخل خليج مسقط، وجهة ساحلية مسوّرة في خليج خاص ببندر الجصة شرق العاصمة. أُطلق في 2024، ويقدّم استوديوهات وشققاً ولوفت لافتة بسقف مزدوج على أرضٍ مدرّجة على بُعد خطوات من الشاطئ والمارينا.' },
      { title: 'الموقع والوصول', body: 'تبعد بندر الجصة نحو 20 دقيقة عن وسط مسقط وقرابة 35 دقيقة عن مطار مسقط الدولي عبر طريق ساحلي خلاب. منتجع جميرا خليج مسقط الخمس نجوم والشاطئ الخاص والمارينا والمطاعم جميعها داخل المجتمع.' },
      { title: 'الوحدات والتصميم', body: 'تتنوع المنازل من استوديوهات وشقق بغرفة إلى ثلاث غرف نوم إلى لوفت بسقف مزدوج، عدد منها بغرفة خادمة. يشمل المتاح حالياً شققاً بغرفتي نوم ولوفت بغرفتين إلى ثلاث غرف بمساحات من نحو 128 إلى 171 م² بإطلالة على الحديقة أو المسبح، بتشطيب هادئ وعصري.' },
      { title: 'نمط الحياة والمرافق', body: 'يستمتع السكان بمسبح إنفينيتي وحديقة Zen بمنصة يوغا وصالة رياضية ومنطقة تمارين وملعب ميني غولف وملعب أطفال ومنطقة شواء ومضمار جري بإطلالات خلابة — إلى جانب الشاطئ الخاص بخليج مسقط وملاعب البادل والرياضات المائية والمطاعم وفندق جميرا.' },
      { title: 'الاستثمار والتملك', body: 'خليج مسقط مجمع سياحي متكامل، لذا تُباع المنازل تملكاً حراً لجميع الجنسيات مع أحقية الإقامة. تبدأ أسعار البيع على الخريطة من 138,000 ريال عُماني (غير شامل الضريبة) بخطة سداد 10 / 70 / 20. تواصل معنا للحصول على قائمة التوفر المحدثة.' },
    ],
  },
  'Muscat Bay Ready': {
    tagline: 'مخزون جاهز للسكن · خليج مسقط',
    description: 'قائمة منتقاة من الفلل والشقق المكتملة داخل خليج مسقط — مفاتيح بالأيدي، تملك حر، مع عضوية كاملة للنادي الشاطئي.',
  },
  'Hay Al Wafa': {
    tagline: 'شقق وتاون هاوس وفلل · مدينة السلطان هيثم',
    description: 'شقق مفروشة بغرفتي نوم مع تاون هاوس بثلاث وأربع غرف وفلل بخمس غرف من العبرار العقارية في حي الوفاء، أحد أوائل الأحياء السكنية في مدينة السلطان هيثم.',
    sections: [
      { title: 'عن المشروع', body: 'حي الوفاء من أوائل الأحياء السكنية في مدينة السلطان هيثم، من تطوير شركة العبرار العقارية. يشمل الطرح الحالي شققاً مفروشة بالكامل بغرفتي نوم في المبنيين 59 و61 حول مسبح الحي والجادة المشجّرة، إضافة إلى تاون هاوس من المرحلة الثالثة وفلل بخمس غرف من المرحلة الثانية.' },
      { title: 'الموقع والوصول', body: 'مدينة السلطان هيثم في السيب هي المدينة الذكية الرائدة في عُمان، بروابط مباشرة عبر الطريق السريع إلى وسط مسقط ومطار مسقط الدولي. المدارس والعيادات والمساجد والحدائق والتجزئة كلها مخطّطة على مسافة قريبة داخل المدينة.' },
      { title: 'الوحدات والتصميم', body: 'تصميمان عمليان للشقق بغرفتي نوم بمساحة بناء نحو 127 إلى 128 م² (158 إلى 161 م² إجمالية) على الطوابق من الأول إلى الخامس، تُسلَّم مفروشة بالكامل. ويضيف طرح التاون هاوس منازل صف حدائقية بثلاث غرف بنحو 230 م² وتاون هاوس بفناء بأربع غرف بنحو 256 م²، بينما تقدم الفلل خمس غرف نوم على نحو 430 م² فوق قطع بمساحة 400 م².' },
      { title: 'الاستثمار والتملّك', body: 'تبدأ الشقق من 92,088 ر.ع شاملة الأثاث، والتاون هاوس من 149,500 ر.ع، والفلل بخمس غرف من 242,000 ر.ع. تتوفر خيارات سداد ممتدة حتى 60 شهراً بأسعار معدّلة؛ تواصل معنا لقائمة التوفر المحدثة وتفاصيل الأهلية.' },
    ],
  },
  'Wadi Zaha': {
    tagline: 'إقامات راقية مع إطلالات على الجبال',
    description: 'مزيج من الشقق والتاون هاوس مع تفاصيل تصميم راقية، تطل على وادي عُماني درامي، على بُعد دقائق من مسقط الكبرى.',
    sections: [
      {
        title: 'عن المشروع',
        body: 'وادي زاها حيّ سكني على ضفة الوادي داخل مدينة السلطان هيثم، يمزج استوديوهات وشققاً من غرفة إلى 3 غرف مع فلل بحدائق وفلل سماوية وبنتهاوس على الأسطح، منتظمة حول حديقة مركزية وجادة مشجّرة بإطلالات جبلية ووادي درامية.',
      },
      {
        title: 'الموقع والوصول',
        body: 'كجزء من مدينة السلطان هيثم — التطوير الحضري الرائد في عُمان شرق مسقط — يستفيد وادي زاها من البنية الذكية وروابطها الطرقية الجديدة مع العاصمة ووصولها سيراً إلى المدارس والرعاية الصحية والتجزئة المخطّطة في المدينة.',
      },
      {
        title: 'الوحدات والتصميم',
        body: 'يمتد المزيج من استوديوهات مدمجة إلى فلل سماوية عائلية وبنتهاوس، بمساحات داخلية مضيئة وفضاءات خارجية خاصة وإطلالات على الوادي والتلال. شوارع تعطي الأولوية للمشاة وحدائق صغيرة ومسارات دراجات تصوغ نمط حياة مجتمعياً في الهواء الطلق.',
      },
      {
        title: 'الاستثمار والتملّك',
        body: 'ابتداءً من 61,635 ر.ع وتسليم 2026–2027، يُعدّ وادي زاها من أكثر الإطلاقات المؤهّلة للتملّك الحر اقتصاداً في العاصمة الجديدة — موقع مخطط قوي مع نضوج مدينة السلطان هيثم.',
      },
    ],
  },
  'Sarooj Apartments': {
    tagline: 'شقق سكنية · مدينة السلطان هيثم',
    description: 'حي «واحة ساروج» السكني منخفض الارتفاع داخل مدينة السلطان هيثم، ويضم في الإطلاق الحالي شققاً من غرفة إلى غرفتي نوم موزّعة على مبنيين بارتفاع أرضي و5 طوابق.',
  },
  'Sarooj Villas': {
    tagline: 'فلل عائلية · مدينة السلطان هيثم',
    description: 'إطلاق الفلل من ساروج يشمل فللاً متلاصقة ومستقلة، من فلل 4 غرف نوم على أراضٍ بمساحة 214 م² إلى فلل 5 و6 غرف مستقلة على أراضٍ تصل إلى 630 م².',
  },
  'Yenaier': {
    tagline: 'إقامات متعددة الاستخدامات متوسطة الارتفاع · مدينة السلطان هيثم',
    description: 'حي عمودي داخل مدينة السلطان هيثم — استوديوهات Loggia وشقق Sky Residences وفلل Sky Villas من غرفة إلى 3 غرف، بالإضافة إلى بنتهاوس Sky Palace بطابق كامل، فوق منصة تجارية للبيع بالتجزئة والمأكولات.',
    sections: [
      {
        title: 'عن المشروع',
        body: 'ينيِر حيّ سكني متعدد الاستخدامات متوسط الارتفاع داخل مدينة السلطان هيثم، التطوير الحضري الرائد في عُمان شرق مسقط. يجمع استوديوهات Loggia وشقق Sky Residences وفلل Sky Villas من غرفة إلى 3 غرف، وبنتهاوسين Sky Palace بطابق كامل، فوق منصة تجارية ومطاعم على مستوى الساحة.',
      },
      {
        title: 'الموقع والوصول',
        body: 'مدينة السلطان هيثم مدينة ذكية مخطّطة بالكامل لنحو 100,000 ساكن، مرتبطة بمسقط عبر طرق سريعة جديدة وعلى مقربة من محور المطار. يخرج سكان ينيِر مباشرة إلى جادات وحدائق ومتاجر مجتمعية دون مغادرة الحي.',
      },
      {
        title: 'الوحدات والتصميم',
        body: 'تتنوّع المنازل من استوديوهات Loggia عملية إلى فلل سماوية وبنتهاوس واسعة، جميعها بتشطيبات عصرية وشرفات رحبة وإطلالات على المدينة والحدائق. تضيف المنصة التجارية المقاهي والمتاجر والخدمات اليومية، فيما توفّر طوابق المرافق المشتركة مسبحاً ولياقة ومساحات استراحة.',
      },
      {
        title: 'الاستثمار والتملّك',
        body: 'بأسعار من 67,200 ر.ع وتسليم في 2027، يُعدّ ينيِر من أيسر نقاط الدخول إلى قصة نمو مدينة السلطان هيثم — جاذب للمالكين الجدد والمستثمرين الباحثين عن فرص المخطط ضمن تطوير مدعوم حكومياً.',
      },
    ],
  },
  'Azura': {
    tagline: 'إقامات مُوقَّعة · مدينة السلطان هيثم',
    description: 'شقق أنيقة متوسطة الارتفاع في المدينة الرائدة الجديدة بعُمان، مصممة حول ممرات مظللة وبحيرات وبنية تحتية ذكية.',
  },
  'Vistal': {
    tagline: 'إقامات على الواجهة البحرية · الموج',
    description: 'مجتمع سكني منخفض الارتفاع في الموج — شقق غرفة وغرفتين بالإضافة إلى دوبلكسات شاطئية بإطلالات على البحر والمسبح وملعب الغولف.',
    sections: [
      {
        title: 'عن المشروع',
        body: 'فيستال مجتمع منخفض الارتفاع على الواجهة البحرية في الموج مسقط، الوجهة البحرية المتكاملة الأبرز في عُمان. يجمع شقق غرفة وغرفتين مع دوبلكسات شاطئية، جميعها موجّهة لالتقاط إطلالات البحر والمسبح وملعب الغولف.',
      },
      {
        title: 'الموقع والوصول',
        body: 'يقع الموج على ساحل مسقط بجوار المطار، محيطاً بمارينا وملعب غولف بمعايير PGA من 18 حفرة وممشى نابض بالمتاجر والمقاهي والمطاعم. سكان فيستال على بُعد دقائق من الشاطئ والمارينا ومطار مسقط الدولي.',
      },
      {
        title: 'الوحدات والتصميم',
        body: 'تتميّز الشقق والدوبلكسات بتصاميم داخلية عصرية وواجهات زجاجية كاملة الارتفاع وشرفات رحبة تنفتح على الشاطئ. يتشارك السكان حدائق منسّقة ومسابح ووصولاً مباشراً للشاطئ ضمن أحد أعرق المجتمعات الكبرى في المنطقة.',
      },
      {
        title: 'الاستثمار والتملّك',
        body: 'الموج مجمّع سياحي متكامل تملّك حر مفتوح لجميع الجنسيات مع إقامة عُمانية. بسعر من 140,316 ر.ع وتسليم 2026–2027، يقدّم فيستال تملّكاً شاطئياً على المخطط في موقع مثبت قوي الإيجار.',
      },
    ],
  },
  'St. Regis': {
    tagline: 'إقامات St. Regis · مسقط',
    description: 'إقامات مُوقَّعة مع كامل خدمات St. Regis — خدمة الخادم الشخصي، مسابح خاصة، وضيافة العلامة المميزة على الواجهة البحرية.',
    sections: [
      {
        title: 'عن المشروع',
        body: 'إقامات St. Regis تجلب واحدة من أعرق علامات الضيافة الفاخرة في العالم إلى واجهة مسقط البحرية. تجمع هذه الإقامات المُوقَّعة بالكامل بين المنازل الخاصة وإرث خدمة St. Regis، بما فيها خدمة الخادم الشخصي الشهيرة.',
      },
      {
        title: 'الموقع والوصول',
        body: 'على امتداد مميّز من ساحل مسقط، تضع الإقامات شواطئ العاصمة ومطاعمها ومراكز الأعمال في المتناول، مع مطار مسقط الدولي على مسافة قصيرة بالسيارة.',
      },
      {
        title: 'الوحدات والتصميم',
        body: 'اختر من إقامات وبنتهاوس من غرفتين إلى 5 غرف بمسابح خاصة وشرفات بحرية ممتدة وتشطيبات بمعايير St. Regis. يتمتّع الملّاك بسبا ومطاعم راقية ولياقة وكونسيرج مخصّص يديره فريق الفندق.',
      },
      {
        title: 'الاستثمار والتملّك',
        body: 'تُباع St. Regis تملّكاً حراً لجميع الجنسيات، والشراء يمنح أهلية إقامة المستثمر في عُمان. تبدأ الوحدات المتاحة حالياً من 441,631 ر.ع، والتسليم في 2028.',
      },
    ],
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
    tagline: 'مجتمع منتجعي على الواجهة البحرية · صلالة',
    description: 'أكبر وجهة منتجعية في عُمان من تطوير موريّا: شاليهات وفلل تملّك حر وسط بحيرات ومارينا وشاطئ رملي أبيض على ساحل ظفار.',
    sections: [
      {
        title: 'الوجهة',
        body: 'هوانا صلالة أكبر وجهة سياحية متكاملة في عُمان، بتطوير رئيسي من موريّا (أوراسكوم) على ساحل ظفار. تمتد على نحو 6 ملايين متر مربع وتضم مارينا بسعة 170 مرسى، وسبعة كيلومترات من الشاطئ الأبيض، وبحيرات صالحة للسباحة، وخمسة فنادق ومدينة مائية، وتتوزع بينها منازل تملّك حر.',
      },
      {
        title: 'جزيرة لبانة (Lubana Island)',
        body: 'جزيرة لبانة هي أحدث إطلاق سكني في هوانا صلالة: حيّ جزيري في منطقة أمازي يقع مباشرة على البحيرات، من تطوير موريّا (أوراسكوم). العرض الحالي فلل بثلاث غرف نوم بإطلالة على البحيرة: فلل بطابق أرضي بمساحة بناء 145 م² وحديقة 413 م² على قطعة نحو 558 م² من 170,500 ر.ع، وفلل أرضي وأول بمساحة بناء 170 م² مع غرفة مكتب وحديقة 454 م² على قطعة 580 م² من 268,600 ر.ع (الأسعار قبل ضريبة القيمة المضافة 5%). بيع على الخارطة بخطة دفع من المطوّر لثلاث سنوات: 10% دفعة أولى ثم 7.5% كل ثلاثة أشهر، والتسليم بعد ثلاث سنوات من العقد.',
      },
      {
        title: 'المنازل وأسعار البداية',
        body: 'تشمل الوحدات المتاحة أربعة أنماط: شاليهات بغرفة نوم واحدة على الواجهة المائية من 98,000 ر.ع بعائد إيجاري متوقع يصل إلى 10.6%، وشاليهات بغرفتين على الشاطئ من 129,000 ر.ع، وفلل توأم بغرفتين مع حدائق خاصة من 160,000 ر.ع، وفلل مستقلة بثلاث غرف من 260,000 ر.ع، مع خطط دفع مرنة من المطوّر ووحدات جاهزة للتسليم الفوري.',
      },
      {
        title: 'موسمان ذروة في السنة',
        body: 'صلالة هي الوجهة الخليجية الوحيدة بموسمين سياحيين متمايزين: موسم الخريف (يونيو إلى سبتمبر) يجذب مئات الآلاف من زوار الخليج هرباً من حرارة الصيف، بينما يجلب الشتاء المعتدل سياحة أوروبية. للملّاك يعني ذلك تقويماً إيجارياً طويلاً بشكل استثنائي، فبيت العطلات هنا يعمل صيفاً وشتاءً، ولهذا تتجاوز العوائد المتوقعة متوسطات المنطقة.',
      },
      {
        title: 'الموقع والوصول',
        body: 'يقع المجتمع على طريق طاقة، على بعد نحو 15 دقيقة من وسط صلالة و20 دقيقة من مطار صلالة الدولي المرتبط بمسقط على مدار العام، وبرحلات مباشرة في موسم الخريف من دبي والشارقة وأبوظبي والرياض وجدة والدمام والدوحة والكويت.',
      },
      {
        title: 'التملّك الحر وإقامة المستثمر',
        body: 'هوانا صلالة مجمع سياحي متكامل (ITC) معتمد: تُباع المنازل تملّكاً حراً لجميع الجنسيات، ويؤهل التملّك للتقدم بطلب الإقامة العُمانية، بلا ضريبة دخل ولا ضريبة عقارية سنوية. احجز استشارة مجانية للحصول على قائمة الوحدات الحالية في هوانا وجزيرة لبانة.',
      },
    ],
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
  'The Arc Residences': {
    tagline: 'Сигнатурные резиденции · Yiti',
    description: 'Одна изогнутая башня на набережной Yiti, разделённая на три коллекции: Opal, Oria и Onda. В релизе всё, от сигнатурных квартир с 2 спальнями до дуплексов, sky terrace и пентхаусов во весь этаж, причём у большинства верхних домов есть частный бассейн.',
    sections: [
      { title: 'О проекте', body: 'The Arc Residences назван по своей планировке: одно изогнутое здание на набережной Yiti, разделённое на три коллекции. Opal смотрит на море и марину, Oria на горы и марину, Onda находится между ними. Текущий релиз включает 27 домов, от квартир с 2 спальнями площадью около 166 кв. м до пентхауса в 1 086 кв. м.' },
      { title: 'Резиденции и дизайн', body: 'В башне пять форматов. Сигнатурные квартиры от 2 до 4 спален с крытыми террасами; дуплексы разносят гостиную и спальни по двум уровням; дома Sky Terrace и Sky Garden добавляют открытые пространства от 90 до 840 кв. м; два пентхауса на седьмом этаже занимают по целому этажу каждый. Частные бассейны идут с домами Sky Garden, Sky Terrace и пентхаусами.' },
      { title: 'Расположение и транспорт', body: 'Yiti расположен на побережье к югу от Маската, к нему ведёт новая прибрежная дорога мимо Бандар-Джиссы и Muscat Bay. Из домов открывается вид на марину, Оманское море и холмы за бухтой.' },
      { title: 'Инвестиции и собственность', body: 'Yiti открыт для покупателей всех национальностей: фрихолд с правом на продлеваемую резидентскую визу собственника недвижимости. Цены этого релиза начинаются от 423 883 OMR без НДС и доходят до 2 168 938 OMR за самый большой пентхаус.' },
    ],
  },
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
  'Zen Residences': {
    tagline: 'Студии, апартаменты и лофты · Muscat Bay',
    description: 'Новый проект Zen Development and Investment внутри закрытого сообщества Muscat Bay в Бандар-Джисса — студии, апартаменты и двухуровневые лофты над частной бухтой, по соседству с пятизвёздочным курортом Jumeirah, мариной и пляжем.',
    sections: [
      { title: 'О проекте', body: 'Zen Residences — новое сообщество от Zen Development and Investment внутри Muscat Bay, закрытого прибрежного направления в частной бухте Бандар-Джисса к востоку от столицы. Запущенное в 2024 году, оно предлагает студии, апартаменты и эффектные двухуровневые лофты на террасированной территории в нескольких шагах от пляжа и марины.' },
      { title: 'Расположение и транспорт', body: 'Бандар-Джисса находится примерно в 20 минутах от центра Маската и около 35 минут от международного аэропорта Маската по живописной прибрежной дороге. Пятизвёздочный курорт Jumeirah Muscat Bay, частный пляж, марина и рестораны расположены внутри сообщества.' },
      { title: 'Резиденции и дизайн', body: 'Дома варьируются от студий и апартаментов с 1–3 спальнями до двухуровневых лофтов, часть с комнатой для персонала. В текущем наличии — апартаменты с 2 спальнями и лофты с 2–3 спальнями площадью примерно от 128 до 171 кв. м с видом на сад или бассейн, в спокойном современном стиле.' },
      { title: 'Образ жизни и удобства', body: 'Резидентам доступны инфинити-бассейн, сад Zen с площадкой для йоги, тренажёрный зал и зона тренировок, мини-гольф, детская площадка, зона барбекю и живописная беговая дорожка — наряду с частным пляжем Muscat Bay, паделом и водными видами спорта, ресторанами и отелем Jumeirah.' },
      { title: 'Инвестиции и собственность', body: 'Muscat Bay — designated Integrated Tourism Complex, поэтому дома продаются в полную собственность (фрихолд) гражданам всех стран с правом на резидентство. Цены на стадии строительства начинаются от 138 000 OMR (без НДС) по поэтапному плану оплаты 10 / 70 / 20. Свяжитесь с нами для актуального списка наличия.' },
    ],
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
  'Hawana Salalah': {
    tagline: 'Курортное сообщество на воде · Салала',
    description: 'Крупнейший курорт Омана от Muriya — шале, твин-виллы и отдельные виллы в полную собственность среди лагун, марины и белопесчаного пляжа на побережье Дофара.',
    sections: [
      { title: 'О курорте', body: 'Hawana Salalah — крупнейшее интегрированное туристическое направление Омана, мастер-девелопер Muriya (Orascom Development). На территории около 6 млн м² — марина на 170 стоянок, семь километров белопесчаного пляжа, лагуны для купания, пять отелей и аквапарк, а между ними — дома в полную собственность (фрихолд).' },
      { title: 'Остров Лубана (Lubana Island)', body: 'Lubana Island — новейший жилой релиз Hawana Salalah: островной квартал в районе Амази прямо на лагунах, девелопер Muriya (Orascom Development). В текущем предложении — виллы с 3 спальнями и видом на лагуну: одноэтажные виллы 145 м² застройки с садом 413 м² на участках ~558 м² от 170 500 OMR и виллы G+1 площадью 170 м² с кабинетом и садом 454 м² на участках 580 м² от 268 600 OMR (цены до НДС 5%). Продажа офф-план с 3-летним планом оплаты от застройщика: 10% первый взнос, далее по 7,5% ежеквартально; передача через три года с даты контракта.' },
      { title: 'Дома и стартовые цены', body: 'Доступны четыре формата: шале с 1 спальней у воды от 98 000 OMR с прогнозируемой доходностью до 10,6%, шале с 2 спальнями у пляжа от 129 000 OMR, твин-виллы с 2 спальнями и частным садом от 160 000 OMR и отдельные виллы с 3 спальнями от 260 000 OMR — с гибкими планами оплаты от застройщика и готовыми юнитами к немедленной передаче.' },
      { title: 'Два высоких сезона', body: 'Салала — единственное направление Залива с двумя выраженными туристическими сезонами: муссон харифа (июнь–сентябрь) привозит сотни тысяч гостей из стран Залива, спасающихся от жары, а мягкая зима — европейских туристов. Для владельца это необычно длинный арендный календарь: дом для отдыха здесь зарабатывает и летом, и зимой, поэтому прогнозируемая доходность выше средней по региону.' },
      { title: 'Расположение и доступ', body: 'Сообщество расположено на дороге Така, примерно в 15 минутах от центра Салалы и в 20 минутах от международного аэропорта Салалы — круглый год есть рейсы в Маскат, а в сезон харифа прямые рейсы из Дубая, Шарджи, Абу-Даби, Эр-Рияда, Джидды, Даммама, Дохи и Кувейта.' },
      { title: 'Фрихолд и виза инвестора', body: 'Hawana Salalah — сертифицированный Integrated Tourism Complex (ITC): дома продаются в полную собственность гражданам всех стран, покупка даёт право подать на резидентство Омана, налога на доход и ежегодного налога на недвижимость нет. Запишитесь на бесплатную консультацию за актуальным списком юнитов в Хаване и на острове Лубана.' },
    ],
  },
  'Vistal': {
    tagline: 'Резиденции у воды · Al Mouj',
    description: 'Малоэтажное жилое сообщество в Al Mouj — 1- и 2-комнатные апартаменты плюс пляжные дуплексы с видами на море, бассейн и поле для гольфа.',
  },
  'Sarooj Apartments': {
    tagline: 'Жилые апартаменты · Sultan Haitham City',
    description: 'Малоэтажный жилой квартал Sarooj Oasis расположен внутри Sultan Haitham City. В текущем релизе апартаменты с 1 и 2 спальнями в двух корпусах высотой в пять этажей над первым.',
  },
  'Sarooj Villas': {
    tagline: 'Семейные виллы · Sultan Haitham City',
    description: 'Виллы Sarooj включают сблокированные и отдельно стоящие дома: от вилл с 4 спальнями на участках 214 м² до отдельно стоящих вилл с 5 и 6 спальнями на участках до 630 м².',
  },
  'Wadi Zaha': {
    tagline: 'Резиденции премиум-класса с видом на горы',
    description: 'Смесь апартаментов и таунхаусов с продуманными деталями дизайна, видом на драматичное вади и в нескольких минутах от Маската.',
  },
  'Hay Al Wafa': {
    tagline: 'Апартаменты, таунхаусы и виллы · Sultan Haitham City',
    description: 'Меблированные апартаменты с 2 спальнями, таунхаусы с 3 и 4 спальнями и виллы с 5 спальнями от Al Abrar Real Estate в Hay Al Wafa, одном из первых жилых кварталов Sultan Haitham City.',
    sections: [
      { title: 'О проекте', body: 'Hay Al Wafa — один из первых жилых кварталов Sultan Haitham City, девелопер Al Abrar Real Estate. Текущий релиз включает меблированные апартаменты с 2 спальнями в корпусах 59 и 61 вокруг квартального бассейна и зелёного бульвара, а также таунхаусы третьей очереди и виллы с 5 спальнями второй очереди.' },
      { title: 'Расположение и транспорт', body: 'Sultan Haitham City в Сибе — флагманский умный городской район Омана с прямыми скоростными трассами до центра Маската и международного аэропорта Маската. Школы, клиники, мечети, парки и магазины запланированы в пешей доступности по всему городу.' },
      { title: 'Резиденции и дизайн', body: 'Две практичные планировки квартир с 2 спальнями площадью около 127–128 кв. м застройки (158–161 кв. м брутто) на этажах с первого по пятый, передаются меблированными. Таунхаусы добавляют садовые дома с 3 спальнями около 230 кв. м и таунхаусы с внутренним двором с 4 спальнями около 256 кв. м, а виллы предлагают 5 спален примерно на 430 кв. м на участках 400 кв. м.' },
      { title: 'Инвестиции и собственность', body: 'Квартиры от 92 088 OMR с мебелью, таунхаусы от 149 500 OMR, виллы с 5 спальнями от 242 000 OMR. Доступна рассрочка до 60 месяцев по скорректированным ценам; свяжитесь с нами для актуального списка наличия.' },
    ],
  },
}

// Persian (fa) overlay. Added with Zen Residences; other projects fall back
// to the English base until their fa copy is written.
const FA_OVERLAY = {
  'The Arc Residences': {
    tagline: 'رزیدنس‌های شاخص · یتی',
    description: 'یک برج منحنی روی ساحل یتی که به سه کالکشن تقسیم شده است: اوپال، اوریا و اوندا. این عرضه از آپارتمان‌های دوخوابه تا دوبلکس، اسکای‌تراس و پنت‌هاوس تمام‌طبقه را در بر می‌گیرد و بیشتر واحدهای طبقات بالا استخر اختصاصی دارند.',
    sections: [
      { title: 'درباره پروژه', body: 'نام The Arc Residences از پلان آن می‌آید: یک ساختمان منحنی روی ساحل یتی که به سه کالکشن تقسیم شده است. اوپال رو به دریا و مارینا، اوریا رو به کوه و مارینا، و اوندا میان این دو. عرضه فعلی ۲۷ واحد دارد؛ از آپارتمان دوخوابه حدود ۱۶۶ مترمربع تا پنت‌هاوس ۱٬۰۸۶ مترمربعی.' },
      { title: 'واحدها و طراحی', body: 'پنج قالب در یک برج. آپارتمان‌های Signature از دو تا چهار خوابه با تراس سرپوشیده؛ دوبلکس‌ها که فضای نشیمن و خواب را در دو طبقه پخش می‌کنند؛ واحدهای Sky Terrace و Sky Garden با فضای باز ۹۰ تا ۸۴۰ مترمربع؛ و دو پنت‌هاوس طبقه هفتم که هرکدام یک طبقه کامل را می‌گیرند. استخر اختصاصی همراه واحدهای Sky Garden و Sky Terrace و پنت‌هاوس است.' },
      { title: 'موقعیت و دسترسی', body: 'یتی روی ساحل جنوب مسقط است و جاده ساحلی جدید از کنار بندر جصه و خلیج مسقط به آن می‌رسد. واحدها رو به مارینا، دریای عمان و تپه‌های پشت خلیج باز می‌شوند.' },
      { title: 'سرمایه‌گذاری و مالکیت', body: 'یتی برای خریداران هر ملیتی باز است؛ سند فری‌هولد که واجد شرایط اقامت قابل تمدید مالک ملک عمان است. قیمت این عرضه از ۴۲۳٬۸۸۳ ریال عمان بدون احتساب مالیات شروع می‌شود و تا ۲٬۱۶۸٬۹۳۸ ریال برای بزرگ‌ترین پنت‌هاوس می‌رسد.' },
    ],
  },
  'Zen Residences': {
    tagline: 'استودیو، آپارتمان و لافت · خلیج مسقط',
    description: 'پروژه‌ای جدید از Zen Development and Investment داخل مجتمع محصور خلیج مسقط در بندر جصه؛ استودیو، آپارتمان و لافت‌های دوطبقه بر فراز خلیجی خصوصی، در همسایگی اقامتگاه پنج‌ستاره جمیرا، مارینا و ساحل.',
    sections: [
      { title: 'درباره پروژه', body: 'Zen Residences مجتمعی جدید از Zen Development and Investment در خلیج مسقط است؛ مقصدی ساحلی و محصور در خلیجی خصوصی در بندر جصه، شرق پایتخت. این پروژه که در سال ۲۰۲۴ رونمایی شد، استودیو، آپارتمان و لافت‌های چشمگیر دوطبقه را روی زمینی تراس‌بندی‌شده در چند قدمی ساحل و مارینا ارائه می‌دهد.' },
      { title: 'موقعیت و دسترسی', body: 'بندر جصه حدود ۲۰ دقیقه تا مرکز مسقط و نزدیک ۳۵ دقیقه تا فرودگاه بین‌المللی مسقط از مسیر ساحلی زیبا فاصله دارد. اقامتگاه پنج‌ستاره جمیرا خلیج مسقط، ساحل خصوصی، مارینا و رستوران‌ها همگی داخل مجتمع هستند.' },
      { title: 'واحدها و طراحی', body: 'خانه‌ها از استودیو و آپارتمان‌های یک تا سه‌خوابه تا لافت‌های دوطبقه را شامل می‌شوند، چند مورد با اتاق خدمتکار. موجودی فعلی شامل آپارتمان‌های دوخوابه و لافت‌های دو تا سه‌خوابه با مساحت حدود ۱۲۸ تا ۱۷۱ مترمربع و چشم‌انداز باغ یا استخر است، با طراحی آرام و مدرن.' },
      { title: 'سبک زندگی و امکانات', body: 'ساکنان از استخر اینفینیتی، باغ Zen با سکوی یوگا، سالن ورزش و فضای تمرین، مینی‌گلف، زمین بازی کودکان، فضای باربیکیو و مسیر دو با چشم‌انداز زیبا بهره‌مند می‌شوند؛ در کنار ساحل خصوصی خلیج مسقط، پدل و ورزش‌های آبی، رستوران‌ها و هتل جمیرا.' },
      { title: 'سرمایه‌گذاری و مالکیت', body: 'خلیج مسقط یک مجتمع گردشگری یکپارچه است، بنابراین خانه‌ها به‌صورت مالکیت کامل (فری‌هولد) به همه ملیت‌ها با امکان اقامت فروخته می‌شوند. قیمت‌های پیش‌فروش از ۱۳۸٬۰۰۰ ریال عمان (بدون مالیات بر ارزش افزوده) با طرح پرداخت مرحله‌ای ۱۰ / ۷۰ / ۲۰ آغاز می‌شود. برای فهرست به‌روز موجودی با ما تماس بگیرید.' },
    ],
  },
  'Hawana Salalah': {
    tagline: 'مجتمع تفریحی رو به آب · صلاله',
    description: 'بزرگ‌ترین مقصد تفریحی عمان از موریا؛ شاله، ویلای دوقلو و ویلای مستقل با مالکیت کامل، میان لاگون‌ها، مارینا و ساحل شنی سفید در کرانه ظفار.',
    sections: [
      { title: 'درباره مقصد', body: 'هوانا صلاله بزرگ‌ترین مقصد گردشگری یکپارچه عمان است که موریا (اوراسکوم) آن را در ساحل ظفار توسعه داده است. در حدود ۶ میلیون مترمربع، مارینایی با ۱۷۰ اسکله، هفت کیلومتر ساحل شنی سفید، لاگون‌های قابل شنا، پنج هتل و یک پارک آبی را در خود جای داده و خانه‌های فری‌هولد میان همین امکانات قرار گرفته‌اند.' },
      { title: 'جزیره لوبانا (Lubana Island)', body: 'جزیره لوبانا جدیدترین عرضه مسکونی هوانا صلاله است؛ محله‌ای جزیره‌ای در ناحیه اَمازی، درست روی لاگون‌ها و ساخته موریا (اوراسکوم). عرضه فعلی ویلاهای سه‌خوابه با منظره لاگون است: ویلای یک‌طبقه با ۱۴۵ مترمربع بنا، باغ ۴۱۳ متری روی زمین حدود ۵۵۸ متر از ۱۷۰٬۵۰۰ ریال عمان، و ویلای دوطبقه (همکف + اول) با ۱۷۰ مترمربع بنا به‌همراه اتاق کار، باغ ۴۵۴ متری روی زمین ۵۸۰ متر از ۲۶۸٬۶۰۰ ریال عمان (قیمت‌ها بدون ۵٪ مالیات ارزش افزوده). فروش پیش‌ساخت با طرح پرداخت سه‌ساله سازنده: ۱۰٪ پیش‌پرداخت و سپس هر سه ماه ۷.۵٪؛ تحویل سه سال پس از قرارداد.' },
      { title: 'خانه‌ها و قیمت شروع', body: 'موجودی فعلی چهار نوع واحد دارد: شاله یک‌خوابه رو به آب از ۹۸٬۰۰۰ ریال عمان با بازده اجاره پیش‌بینی‌شده تا ۱۰.۶ درصد، شاله دوخوابه کنار ساحل از ۱۲۹٬۰۰۰ ریال، ویلای دوقلوی دوخوابه با باغ اختصاصی از ۱۶۰٬۰۰۰ ریال و ویلای مستقل سه‌خوابه از ۲۶۰٬۰۰۰ ریال؛ با طرح پرداخت منعطف سازنده برای واحدهای پیش‌فروش و واحدهای آماده تحویل فوری.' },
      { title: 'دو فصل پیک در سال', body: 'صلاله تنها مقصد خلیج با دو فصل گردشگری مجزاست: موسم خریف (ژوئن تا سپتامبر) صدها هزار گردشگر خلیجی را که از گرمای تابستان فرار می‌کنند جذب می‌کند و زمستان معتدل هم گردشگران اروپایی را می‌آورد. برای مالک یعنی تقویم اجاره‌ای غیرمعمول طولانی؛ خانه تعطیلات در اینجا هم تابستان درآمد دارد هم زمستان، و برای همین بازده پیش‌بینی‌شده بالاتر از میانگین منطقه است.' },
      { title: 'موقعیت و دسترسی', body: 'این مجتمع در جاده طاقه قرار دارد؛ حدود ۱۵ دقیقه تا مرکز شهر صلاله و ۲۰ دقیقه تا فرودگاه بین‌المللی صلاله که در تمام سال به مسقط و در موسم خریف با پروازهای مستقیم به دبی، شارجه، ابوظبی، ریاض، جده، دمام، دوحه و کویت متصل است.' },
      { title: 'فری‌هولد و ویزای سرمایه‌گذار', body: 'هوانا صلاله یک مجتمع گردشگری یکپارچه (ITC) مصوب است: خانه‌ها به همه ملیت‌ها با مالکیت کامل فروخته می‌شوند، خرید ملک امکان درخواست اقامت عمان را فراهم می‌کند و نه مالیات بر درآمد دارد نه مالیات سالانه ملک. برای فهرست به‌روز واحدهای هوانا و جزیره لوبانا مشاوره رایگان رزرو کنید.' },
    ],
  },
  'Hay Al Wafa': {
    tagline: 'آپارتمان، تاون‌هاوس و ویلا · شهر سلطان هیثم',
    description: 'آپارتمان‌های دوخوابه مبله به‌همراه تاون‌هاوس‌های سه و چهارخوابه و ویلاهای پنج‌خوابه از Al Abrar Real Estate در حی الوفاء، یکی از نخستین محله‌های مسکونی شهر سلطان هیثم.',
    sections: [
      { title: 'درباره پروژه', body: 'حی الوفاء یکی از نخستین محله‌های مسکونی شهر سلطان هیثم است که Al Abrar Real Estate آن را توسعه داده است. عرضه فعلی شامل آپارتمان‌های دوخوابه کاملاً مبله در ساختمان‌های ۵۹ و ۶۱ دور استخر محله و بلوار درخت‌کاری‌شده، به‌علاوه تاون‌هاوس‌های فاز ۳ و ویلاهای پنج‌خوابه فاز ۲ است.' },
      { title: 'موقعیت و دسترسی', body: 'شهر سلطان هیثم در السیب، شهر هوشمند پیشتاز عمان است؛ با اتصال مستقیم بزرگراهی به مرکز مسقط و فرودگاه بین‌المللی مسقط. مدرسه، درمانگاه، مسجد، پارک و مراکز خرید همگی در فاصله پیاده‌روی در سطح شهر برنامه‌ریزی شده‌اند.' },
      { title: 'واحدها و طراحی', body: 'دو تیپ کارآمد آپارتمان دوخوابه با زیربنای حدود ۱۲۷ تا ۱۲۸ مترمربع (۱۵۸ تا ۱۶۱ مترمربع ناخالص) در طبقات یک تا پنج که کاملاً مبله تحویل می‌شوند. تاون‌هاوس‌ها شامل خانه‌های ردیفی باغ‌دار سه‌خوابه حدود ۲۳۰ مترمربع و تاون‌هاوس‌های حیاط‌دار چهارخوابه حدود ۲۵۶ مترمربع‌اند و ویلاها پنج خواب در حدود ۴۳۰ مترمربع بنا روی قطعات ۴۰۰ متری دارند.' },
      { title: 'سرمایه‌گذاری و مالکیت', body: 'آپارتمان‌ها از ۹۲٬۰۸۸ ریال عمان با مبلمان، تاون‌هاوس‌ها از ۱۴۹٬۵۰۰ ریال و ویلاهای پنج‌خوابه از ۲۴۲٬۰۰۰ ریال شروع می‌شوند. پرداخت اقساطی تا ۶۰ ماه با قیمت تعدیل‌شده هم در دسترس است؛ برای فهرست به‌روز موجودی با ما تماس بگیرید.' },
    ],
  },
  'TSCY': {
    tagline: 'شهر پایدار ییتی · The Sustainable City',
    description: 'نخستین شهرک کربن‌صفر عمان در ساحل ییتی؛ ویلا و تاون‌هاوس با انرژی خورشیدی، خیابان‌های سبز سایه‌دار، مزرعه‌های ارگانیک و طراحی دوچرخه‌محور.',
  },
  'Aida': {
    tagline: 'زندگی تفریحی بر فراز صخره · ینکیت',
    description: 'شاهکار Dar Al Arkan و Trump Organization؛ اقامتگاه‌های برنددار روی صخره‌ای ۱۳۰ متری بر فراز دریای عمان، با گلف، باشگاه ساحلی و هتل ۵ ستاره داخل مجموعه.',
    sections: [
      { title: 'درباره پروژه', body: 'آیدا مجموعه‌ای شاخص از اقامتگاه‌های برنددار است که روی صخره‌های ییتی، در جنوب مسقط بالا می‌رود. توسعه‌دهنده اصلی آن Dar Al Arkan با همکاری Trump Organization است و گلف و هتلداری با برند ترامپ را کنار خانه‌های فری‌هولد در ارتفاع ۱۳۰ متری از دریای عمان قرار می‌دهد؛ یکی از بلندپروازانه‌ترین پروژه‌های لوکس تاریخ عمان.' },
      { title: 'موقعیت و دسترسی', body: 'آیدا داخل منطقه گردشگری پایدار ییتی است؛ حدود ۲۰ دقیقه تا مرکز مسقط و فرودگاه بین‌المللی مسقط از جاده ساحلی، و مارینا، شهر قدیم و کورنیش مطرح هم در فاصله رانندگی کوتاه قرار دارند.' },
      { title: 'واحدها و طراحی', body: 'از آپارتمان‌های ۱ تا ۴ خوابه تا ویلاهای لبه صخره با استاندارد بین‌المللی اقامتگاه برنددار: شیشه تمام‌قد، تراس اختصاصی و ویو پانورامای دریا. زمین گلف ۱۸ حفره، باشگاه ساحلی، اسپا و هتل ۵ ستاره داخل مجموعه‌اند و خدمات با استاندارد ترامپ مدیریت می‌شود.' },
      { title: 'سرمایه‌گذاری و مالکیت', body: 'آیدا در یک مجتمع گردشگری یکپارچه (ITC) است؛ خانه‌ها به همه ملیت‌ها فری‌هولد فروخته می‌شوند و واجد شرایط اقامت‌اند. با تحویل ۲۰۲۷ تا ۲۰۲۸ و قیمت از ۸۵٬۹۷۱ ریال عمان، خریداران پیش‌فروش یکی از منتظرترین آدرس‌های ساحلی عمان را پیش از تکمیل می‌گیرند.' },
    ],
  },
  'Jebel Sifah': {
    tagline: 'کوهستان و مارینا · ۴۵ دقیقه تا مسقط',
    description: 'شهرک مارینایی یکپارچه از موریا؛ آپارتمان، تاون‌هاوس و ویلا دور زمین گلف قهرمانی، ساحل و هتل بوتیک Sifawy. فروش فعلی در محله جدید Raya: استودیو و آپارتمان‌های Solaris با ویو گلف و خانه‌های باغی فری‌هولد Olive Farms.',
  },
  'Muscat Bay Ready': {
    tagline: 'واحدهای آماده تحویل · خلیج مسقط',
    description: 'فهرستی منتخب از ویلا و آپارتمان‌های تکمیل‌شده داخل خلیج مسقط؛ کلید آماده، مالکیت کامل و عضویت کامل باشگاه ساحلی.',
  },
  'Wadi Zaha': {
    tagline: 'محله‌ای در کنار وادی · شهر سلطان هیثم',
    description: 'محله‌ای مختلط در شهر سلطان هیثم؛ استودیو و آپارتمان‌های ۱ تا ۳ خوابه، ویلاهای باغی، اسکای‌ویلا و پنت‌هاوس‌های بام با پارک مرکزی، بلوار و چشم‌انداز کوهستان.',
    sections: [
      { title: 'درباره پروژه', body: 'وادی زاها محله‌ای مسکونی در کنار وادی داخل شهر سلطان هیثم است؛ ترکیبی از استودیو و آپارتمان‌های ۱ تا ۳ خوابه با ویلاهای باغی، اسکای‌ویلا و پنت‌هاوس‌های بام. محله دور یک پارک مرکزی و بلوار درخت‌کاری‌شده شکل گرفته و قاب آن چشم‌انداز کوه و وادی است.' },
      { title: 'موقعیت و دسترسی', body: 'به‌عنوان بخشی از شهر سلطان هیثم، شهر جدید پرچم‌دار عمان در شرق مسقط، وادی زاها از زیرساخت شهر هوشمند، اتصال بزرگراهی جدید به پایتخت و دسترسی پیاده به مدارس، درمان و مراکز خرید برنامه‌ریزی‌شده در سطح شهر بهره می‌برد.' },
      { title: 'واحدها و طراحی', body: 'ترکیب واحدها از استودیوهای جمع‌وجور تا اسکای‌ویلاهای خانوادگی و پنت‌هاوس؛ فضاهای داخلی پرنور، فضای باز اختصاصی و ویو وادی و تپه‌های اطراف. خیابان‌های پیاده‌محور، پارک‌های کوچک و مسیر دوچرخه سبک زندگی اجتماعی و روباز می‌سازند.' },
      { title: 'سرمایه‌گذاری و مالکیت', body: 'با شروع از ۶۱٬۶۳۵ ریال عمان و تحویل ۲۰۲۶ تا ۲۰۲۷، وادی زاها از اقتصادی‌ترین عرضه‌های واجد فری‌هولد در پایتخت جدید عمان است؛ موقعیت پیش‌فروش جذابی همگام با بلوغ شهر سلطان هیثم.' },
    ],
  },
  'Sarooj Apartments': {
    tagline: 'آپارتمان‌های مسکونی · شهر سلطان هیثم',
    description: 'واحه ساروج، محله‌ای آپارتمانی و کم‌ارتفاع داخل شهر سلطان هیثم؛ عرضه فعلی شامل واحدهای یک و دو خوابه در دو بلوک همکف به‌اضافه ۵ طبقه است.',
  },
  'Sarooj Villas': {
    tagline: 'ویلاهای خانوادگی · شهر سلطان هیثم',
    description: 'عرضه ویلایی ساروج شامل ویلاهای چسبیده و مستقل است؛ از ویلاهای ۴ خوابه روی زمین ۲۱۴ مترمربع تا ویلاهای ۵ و ۶ خوابه مستقل روی زمین‌های تا ۶۳۰ مترمربع.',
  },
  'Yenaier': {
    tagline: 'برج‌های میان‌مرتبه چندکاربری · شهر سلطان هیثم',
    description: 'محله‌ای عمودی داخل شهر سلطان هیثم؛ استودیوهای Loggia، اسکای‌رزیدنس و اسکای‌ویلاهای ۱ تا ۳ خوابه و دو پنت‌هاوس تمام‌طبقه Sky Palace، همه روی پودیوم پلازا با خرید و رستوران.',
    sections: [
      { title: 'درباره پروژه', body: 'ینایر محله‌ای مسکونی میان‌مرتبه و چندکاربری داخل شهر سلطان هیثم، شهر جدید پرچم‌دار عمان در شرق مسقط است. استودیوهای Loggia، اسکای‌رزیدنس و اسکای‌ویلاهای ۱ تا ۳ خوابه و دو پنت‌هاوس تمام‌طبقه Sky Palace روی پودیومی سرزنده از خرید و رستوران در سطح پلازا چیده شده‌اند.' },
      { title: 'موقعیت و دسترسی', body: 'شهر سلطان هیثم شهری هوشمند و کاملاً برنامه‌ریزی‌شده برای حدود ۱۰۰ هزار نفر است که با بزرگراه‌های جدید به مسقط وصل می‌شود و چند دقیقه با کریدور فرودگاه فاصله دارد. ساکنان ینایر بدون خروج از محله به بلوارهای سبز، پارک‌ها و خرید روزمره دسترسی دارند.' },
      { title: 'واحدها و طراحی', body: 'خانه‌ها از استودیوهای بهینه Loggia تا اسکای‌ویلاها و پنت‌هاوس‌های جادار؛ همه با متریال مدرن، بالکن‌های بزرگ و ویو مرتفع شهر و پارک. پودیوم پلازا کافه، فروشگاه و خدمات روزمره را جلوی در می‌آورد و دک‌های مشترک، استخر و باشگاه و لانژ اضافه می‌کنند.' },
      { title: 'سرمایه‌گذاری و مالکیت', body: 'با قیمت از ۶۷٬۲۰۰ ریال عمان و تحویل ۲۰۲۷، ینایر یکی از در دسترس‌ترین نقاط ورود به داستان رشد بلندمدت شهر سلطان هیثم است؛ جذاب برای خریداران اولین خانه و سرمایه‌گذارانی که رشد پیش‌فروش در مسترپلن دولتی می‌خواهند.' },
    ],
  },
  'Azura': {
    tagline: 'اقامتگاه‌های برنددار · شهر سلطان هیثم',
    description: 'آپارتمان‌های میان‌مرتبه و مدرن در شهر جدید پرچم‌دار عمان؛ طراحی‌شده دور پیاده‌راه‌های سایه‌دار، لاگون‌ها و ستون فقرات شهر هوشمند.',
  },
  'Vistal': {
    tagline: 'اقامتگاه‌های لب ساحل · الموج',
    description: 'شهرکی مسکونی کم‌ارتفاع در الموج؛ آپارتمان‌های ۱ و ۲ خوابه به‌همراه دوبلکس‌های لب ساحل با ویو دریا، استخر و زمین گلف.',
    sections: [
      { title: 'درباره پروژه', body: 'ویستال شهرکی کم‌ارتفاع و لب ساحل در الموج مسقط، مهم‌ترین مقصد ساحلی یکپارچه عمان است. آپارتمان‌های ۱ و ۲ خوابه را با دوبلکس‌های لب ساحل ترکیب می‌کند؛ همه رو به دریا، استخر و زمین گلف طراحی شده‌اند.' },
      { title: 'موقعیت و دسترسی', body: 'الموج در ساحل مسقط و کنار فرودگاه است؛ دور مارینا، زمین گلف ۱۸ حفره با استاندارد PGA و پیاده‌راهی پر از فروشگاه، کافه و رستوران. ساکنان ویستال چند دقیقه با ساحل، مارینا و فرودگاه بین‌المللی مسقط فاصله دارند.' },
      { title: 'واحدها و طراحی', body: 'آپارتمان‌ها و دوبلکس‌ها فضای داخلی مدرن، شیشه تمام‌قد و تراس‌های بزرگ رو به خط ساحل دارند. باغ‌های منظرسازی‌شده، استخرها و دسترسی مستقیم ساحل بین ساکنان یکی از جاافتاده‌ترین شهرک‌های منطقه مشترک است.' },
      { title: 'سرمایه‌گذاری و مالکیت', body: 'الموج مجتمع گردشگری یکپارچه فری‌هولد و باز برای همه ملیت‌هاست و سندش اقامت عمان به همراه دارد. با قیمت از ۱۳۳٬۶۳۴ ریال عمان و تحویل ۲۰۲۶ تا ۲۰۲۷، ویستال مالکیت پیش‌فروش لب ساحل در موقعیتی اثبات‌شده و قوی در بازار اجاره ارائه می‌کند.' },
    ],
  },
  'St. Regis': {
    tagline: 'رزیدنس‌های St. Regis · مسقط',
    description: 'اقامتگاه‌های برنددار با خدمات کامل St. Regis؛ سرویس باتلر، استخرهای اختصاصی و مهمان‌نوازی امضادار برند در ساحل مسقط.',
    sections: [
      { title: 'درباره پروژه', body: 'رزیدنس‌های سنت رجیس یکی از خوش‌نام‌ترین برندهای هتلداری لوکس جهان را به ساحل مسقط می‌آورد. این اقامتگاه‌های کاملاً برنددار خانه اختصاصی را با میراث خدمات سنت رجیس، از جمله سرویس معروف باتلر، ترکیب می‌کنند.' },
      { title: 'موقعیت و دسترسی', body: 'در قطعه‌ای ممتاز از ساحل مسقط؛ ساحل‌ها، رستوران‌ها و مناطق تجاری پایتخت در دسترس آسان و فرودگاه بین‌المللی مسقط چند دقیقه رانندگی فاصله دارد.' },
      { title: 'واحدها و طراحی', body: 'از رزیدنس‌های ۲ تا ۵ خوابه تا پنت‌هاوس؛ با استخر اختصاصی، تراس‌های بزرگ رو به دریا و متریالی با استاندارد سنت رجیس. مالکان از اسپا، رستوران‌های سطح بالا، باشگاه و کانسیرژ اختصاصی تیم هتل بهره‌مند می‌شوند.' },
      { title: 'سرمایه‌گذاری و مالکیت', body: 'اقامتگاه‌های برنددار در بازفروش و اجاره عملکردی ممتاز دارند و سنت رجیس فری‌هولد با امکان اقامت فروخته می‌شود. با قیمت از ۵۴۰٬۰۰۰ ریال عمان و تحویل ۲۰۲۸، این یکی از خاص‌ترین آدرس‌های عمان است.' },
    ],
  },
  'Bellevue': {
    tagline: 'آپارتمان‌های تپه‌ای · شهر سلطان هیثم',
    description: 'آپارتمان‌هایی با ویو پانورامای شهر و لاگون از تراس‌های مرتفع؛ متریال درجه‌یک و امکانات روف‌تاپ.',
  },
  'Opal': {
    tagline: 'آپارتمان در مسقط هیلز',
    description: 'آپارتمان‌های مدرن کنار زمین گلف قهرمانی؛ همراه با دسترسی کلاب‌هاوس، استخر و بیسترو.',
  },
  'Golf Hills': {
    tagline: 'ویلاهای لب گلف · مسقط هیلز',
    description: 'ویلاهایی رو به فیروی ۷ و ۸ زمین گلف؛ استخر اختصاصی، شیشه تمام‌قد و زندگی روی روف‌دک.',
  },
  'Shops (Pearl-Ready)': {
    tagline: 'واحدهای تجاری · مسقط هیلز (Pearl)',
    description: 'واحدهای تجاری و رستورانی آماده تحویل در پلازای Pearl؛ با ترافیک بالای گلف، باشگاه و ساکنان مجموعه.',
  },
  'Plumeria (Sohar)': {
    tagline: 'شهرک ساحلی · صحار',
    description: 'شهرک ساحلی فری‌هولد جدید در ساحل الباطنه عمان؛ ویلا، تاون‌هاوس و هتل و باشگاه ساحلی در مرکز مسترپلن.',
  },
  'Mandarine Oriental': {
    tagline: 'رزیدنس‌های ماندارین اورینتال · مسقط',
    description: 'اقامتگاه‌های برنددار فوق لوکس با میراث خدمات Mandarin Oriental؛ اسپا، رستوران‌های سطح بالا و کانسیرژ اختصاصی مالکان.',
  },
  'Maysan (Duqum)': {
    tagline: 'شهرک ساحلی · منطقه اقتصادی دقم',
    description: 'شهرکی مسکونی برنامه‌ریزی‌شده در خدمت منطقه ویژه اقتصادی دقم؛ آپارتمان و تاون‌هاوس برای موج بعدی رشد در ساحل شرقی عمان.',
  },
}

// Merge defaults + active-locale overrides. Numeric/structural fields
// stay shared; only tagline + description (and any future copy fields)
// pull from the overlay. Fallback chain: locale → English default.
export function getProjectDetails(name, lang = 'en') {
  const base = D[name]
  if (!base) return null
  const overlay =
    lang === 'ar' ? AR_OVERLAY[name]
    : lang === 'ru' ? RU_OVERLAY[name]
    : lang === 'fa' ? FA_OVERLAY[name]
    : null
  return overlay ? { ...base, ...overlay } : base
}

export default D
