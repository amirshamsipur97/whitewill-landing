/**
 * Content for SchoolsPage (/schools), the flagship page of the
 * "Education & Family Relocation" hub. Kept out of the shared i18n dict
 * (mirrors the data/investmentFa pattern) because the volume is large.
 *
 * Exports a { en, ru, ar, fa } map; SchoolsPage picks by active language.
 * School details are indicative and neutral; figures are guidance ranges for
 * the 2025/26 cycle and must be confirmed with each school.
 */

const en = {
  metaTitle: 'International Schools in Oman | Complete Guide for Expat Families',
  metaDesc:
    'A practical guide to international schools in Muscat and Oman, British, Cambridge, IB and American curricula, fees and admissions, with Irfan Investment helping your family relocate, invest and settle.',
  breadcrumb: { home: 'Home', label: 'International Schools' },
  schema: {
    serviceName: 'International School Selection and Family Relocation in Oman',
    serviceType: 'Education and relocation advisory',
  },
  hero: {
    eyebrow: 'EDUCATION & FAMILY RELOCATION',
    title: 'International Schools in Oman',
    titleAccent: 'Helping Your Family Build the Future',
    subtitle:
      'Discover the leading British and international schools in Muscat while our team helps you relocate, invest and settle in Oman with confidence.',
    ctaPrimary: 'Talk to an Education Advisor',
    ctaSecondary: 'Explore Our Guides',
    imageAlt: 'Families and students in Muscat, Oman',
    stats: [
      { value: '50+', label: 'International schools across Oman' },
      { value: '4', label: 'Major curricula: British, Cambridge, IB, American' },
      { value: 'Aug / Sep', label: 'Academic year start' },
      { value: '3 to 18', label: 'Ages catered for' },
    ],
  },
  why: {
    eyebrow: 'WHY IT MATTERS',
    title: 'Why Education Matters When Relocating',
    intro:
      'For most families, the right school decides everything else: where you live, how you invest and how quickly everyone feels at home. Planning education first turns a move to Oman into a long-term life decision rather than a short stay.',
    items: [
      { title: 'Relocation that starts with school', body: 'Choosing the school first lets you plan your home, commute and daily routine around it, so the move feels settled from day one.' },
      { title: 'Long-term family planning', body: 'A stable, well-matched school keeps your children on a consistent academic path and gives the whole family a reason to put down roots.' },
      { title: 'A sound long-term investment', body: 'Quality education protects your most important investment, your children’s future, and sits naturally alongside property and business decisions in Oman.' },
      { title: 'Your children’s future', body: 'British, Cambridge, IB and American pathways in Muscat lead to recognised qualifications and to universities in the UK, Europe, North America and the Gulf.' },
      { title: 'Quality of life', body: 'Muscat offers a safe, family-friendly lifestyle with beaches, parks and an international community, an easy environment for children to thrive.' },
      { title: 'A clear path to residency', body: 'Settling your family is closely tied to property, business and investor-residency options, which our team coordinates end to end.' },
    ],
  },
  system: {
    eyebrow: 'THE SYSTEM',
    title: 'The International School System in Oman',
    intro:
      'Oman’s private-education sector is built around internationally recognised curricula, with the British system the most widely offered in Muscat. All licensed schools also teach Arabic, Islamic studies and Omani social studies alongside their main curriculum, as required by the Ministry of Education.',
    curriculaLabel: 'CURRICULA YOU WILL FIND',
    curricula: ['British curriculum', 'Cambridge (CAIE)', 'IGCSE', 'A-Levels', 'International Baccalaureate (IB)', 'American (AP)', 'Omani GED pathway'],
    stages: [
      { title: 'Early Years', tag: 'Ages 3 to 5', body: 'Foundation Stage and kindergarten, play-based learning that settles young children and builds early literacy and numeracy.' },
      { title: 'Primary', tag: 'Years 1 to 6', body: 'The core primary years, where children follow the British, IB or American framework and develop strong academic foundations.' },
      { title: 'Secondary', tag: 'Years 7 to 11 / IGCSE', body: 'Lower secondary leading to IGCSE or equivalent examinations, the gateway to sixth form and college choices.' },
      { title: 'Sixth Form & University', tag: 'Years 12 to 13 / A-Levels & IB', body: 'A-Levels or the IB Diploma prepare students for universities in the UK, Europe, North America and the Gulf.' },
    ],
  },
  featured: {
    eyebrow: 'FEATURED SCHOOLS',
    title: 'A Selection of Muscat International Schools',
    intro:
      'Leading Muscat international schools we work with directly. As your family relocates to Oman, our advisors help you shortlist the right school and secure your children’s admission, coordinated with your home, visas and move. Tap any school to visit its official website. Details are indicative and change year to year.',
    feeLabel: 'Indicative annual tuition',
    cta: 'Ask us which school fits your family',
    cards: [
      { name: 'Jabal Al Ma’rifa International School', curriculum: 'British / Cambridge + Omani GED', location: 'Knowledge Oasis Muscat, Rusayl', locality: 'Muscat', ages: 'Early Years to Grade 12', highlight: 'A newly established British-framework school at Knowledge Oasis Muscat, opening for its first academic year and growing through the grades.', fees: 'From ~OMR 3,500 / year (indicative)' },
      { name: 'The British School Muscat', curriculum: 'British / IGCSE & A-Levels', location: 'Madinat as Sultan Qaboos', locality: 'Muscat', ages: 'Ages 3 to 18 (FS1 to Year 13)', highlight: 'One of Oman’s longest-established British schools, with a purpose-built campus, sixth form centre and a full English National Curriculum pathway.', fees: '~OMR 4,240 to 10,280 / year' },
      { name: 'Cheltenham Muscat', curriculum: 'British / IGCSE & A-Levels', location: 'Al Mouj Muscat', locality: 'Muscat', ages: 'KG1 to Grade 12', highlight: 'A British-curriculum school in the Al Mouj waterfront community, popular with families living in the west of Muscat.', fees: '~OMR 3,899 to 8,111 / year' },
      { name: 'The American British Academy (ABA)', curriculum: 'IB / American', location: 'Al Ghubra, Muscat', locality: 'Muscat', ages: 'Pre-K to Grade 12', highlight: 'An established international school offering the IB programme with an American-style structure, drawing a diverse expatriate community.', fees: '~OMR 3,790 to 10,210 / year' },
      { name: 'Downe House Muscat', curriculum: 'British (Cambridge), girls', location: 'Al Bandar, west Muscat', locality: 'Muscat', ages: 'Grade 1 to Grade 12', highlight: 'The Oman campus of a leading British girls’ school, with a modern purpose-built campus and Cambridge IGCSE and A-Level pathways.', fees: '~OMR 3,470 to 7,500 / year' },
    ],
  },
  fees: {
    eyebrow: 'FEES',
    title: 'Estimated Tuition Fees',
    intro:
      'International school costs in Oman usually combine one-off application and registration charges with annual tuition that rises by stage. The figures below are indicative ranges across premium and mid-market schools in Muscat for the 2025/26 cycle.',
    components: [
      { label: 'Application / assessment fee', amount: 'OMR 50 to 200', desc: 'One-off, usually non-refundable, paid when you apply or sit the entrance assessment.' },
      { label: 'Registration / reservation deposit', amount: 'OMR 300+ or 10 to 40%', desc: 'Secures the place once an offer is made, normally credited toward the first term of tuition.' },
      { label: 'One-off enrolment / capital fee', amount: 'OMR 2,700 to 3,500', desc: 'Charged by some premium schools on entry, often with sibling discounts. Many mid-market schools have none.' },
      { label: 'Refundable security deposit', amount: '~OMR 100', desc: 'Held by a few schools and refunded on departure with proper notice and fees cleared.' },
    ],
    columns: ['Stage / year group', 'Indicative annual tuition (OMR)'],
    rows: [
      ['Early Years (FS / KG)', '3,000 to 5,400'],
      ['Primary (Years 1 to 6)', '5,000 to 6,000'],
      ['Lower secondary (Years 7 to 9)', '6,000 to 8,500'],
      ['IGCSE (Years 10 to 11)', '6,800 to 9,200'],
      ['Sixth Form / A-Levels (Years 12 to 13)', '8,100 to 10,300'],
    ],
    disclaimer:
      'Fees vary annually and should always be confirmed directly with each school. Figures shown are indicative ranges for guidance only.',
  },
  admissions: {
    eyebrow: 'ADMISSIONS',
    title: 'The Admissions Process',
    intro:
      'Most international schools in Oman follow a similar admissions journey. Places in popular year groups fill early, so it is wise to start well before your intended start date. Our team can manage the process on your behalf.',
    steps: [
      { title: 'Enquiry', body: 'Register your interest and share your children’s ages, current curriculum and preferred start date.' },
      { title: 'School visit', body: 'Tour the campus, meet staff and get a feel for the community, in person or virtually.' },
      { title: 'Application', body: 'Submit the online application with the required documents and reports.' },
      { title: 'Assessment', body: 'Children sit an age-appropriate assessment or cognitive test, especially from the upper primary years.' },
      { title: 'Interview', body: 'A short meeting with the child and family, sometimes with a reference from the previous school.' },
      { title: 'Offer', body: 'The school issues a formal offer of a place with the fee schedule and start date.' },
      { title: 'Registration', body: 'Accept the offer, pay the registration fee or deposit and complete enrolment to secure the seat.' },
    ],
    docsTitle: 'DOCUMENTS YOU WILL USUALLY NEED',
    docs: ['Child passport and residence card', 'Recent school reports', 'Birth certificate', 'Transfer certificate from previous school', 'Immunisation records', 'Passport-style photographs', 'Both parents passports and resident cards', 'Any assessment or test results'],
  },
  relocation: {
    eyebrow: 'BEYOND THE CLASSROOM',
    title: 'Family Relocation Services',
    intro:
      'Choosing a school is one part of a bigger move. Irfan Investment supports families end to end, so school, home, business and residency all come together on one timeline.',
    services: [
      { title: 'School selection', body: 'A tailored shortlist and introductions, matched to your children, curriculum and area.' },
      { title: 'Property search', body: 'Homes to buy or rent in family-friendly communities close to your chosen school.' },
      { title: 'Business setup', body: 'Company formation and licensing in Oman with up to full foreign ownership.' },
      { title: 'Residence', body: 'Investor and family residency pathways coordinated alongside your property or business.' },
      { title: 'Bank account', body: 'Help opening personal and corporate accounts with Omani banks.' },
      { title: 'Visas', body: 'Guidance on family visas and the residence cards schools require for enrolment.' },
      { title: 'Moving support', body: 'Practical help with the logistics of relocating your household to Muscat.' },
      { title: 'Settlement', body: 'Local know-how on neighbourhoods, healthcare and daily life so you settle quickly.' },
    ],
    links: [
      { label: 'Buy property in Oman', to: '/buy' },
      { label: 'Company registration', to: '/invest' },
      { label: 'Insights & guides', to: '/insights' },
      { label: 'About Irfan Investment', to: '/about' },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently Asked Questions',
    items: [
      { q: 'What are the best international schools in Muscat?', a: 'Muscat has a wide choice of well-regarded international schools, including The British School Muscat, the American British Academy, Cheltenham Muscat and Downe House Muscat, alongside newer schools such as Jabal Al Ma’rifa. The best fit depends on your children’s ages, the curriculum you want and where you plan to live, which is exactly what our advisors help you weigh up.' },
      { q: 'Which curricula do international schools in Oman offer?', a: 'The British curriculum (Cambridge IGCSE and A-Levels) is the most widely offered, followed by the International Baccalaureate and American programmes. All licensed schools also teach Arabic, Islamic studies and Omani social studies alongside their main curriculum.' },
      { q: 'How much does international school in Oman cost?', a: 'Annual tuition typically ranges from around OMR 3,000 in the early years to roughly OMR 10,000 at sixth form in premium schools, with mid-market schools costing noticeably less. Most schools also charge one-off application and registration fees. Always confirm current figures with the school.' },
      { q: 'Are there British curriculum schools in Muscat?', a: 'Yes. The British curriculum is the most common international option in Muscat, with several schools offering the full English National Curriculum through Cambridge IGCSE and A-Levels.' },
      { q: 'Is the Cambridge curriculum available in Oman?', a: 'Yes. Cambridge (CAIE) is the most widely used examination board in Oman for IGCSE and A-Levels, offered across many British-curriculum schools in Muscat and beyond.' },
      { q: 'When does the school year start in Oman?', a: 'International schools follow a three-term year on the British calendar, with the autumn term starting in late August or early September and the year ending around late June.' },
      { q: 'Do my children need a residence visa to enrol?', a: 'Schools can usually begin the application before residency is finalised, but an Oman resident card is normally required before a child starts, in line with Ministry of Education rules. We coordinate residency so it aligns with your school timeline.' },
      { q: 'How far in advance should we apply?', a: 'Popular year groups fill early, so we recommend applying several months ahead of your intended start, and earlier still for entry points like the start of primary or sixth form.' },
      { q: 'Which areas of Muscat are best for families with school-age children?', a: 'Family-friendly areas include Al Mouj, Madinat as Sultan Qaboos, Qurum, Shatti Al Qurum, Azaiba and Bausher, each within reach of several international schools. We match your home search to your chosen school and commute.' },
      { q: 'Can Irfan Investment help us choose a school and relocate?', a: 'Yes. We help expat families shortlist and approach schools, then bring home, business, banking and residency together on one timeline so the whole move is handled in one place.' },
      { q: 'Do international schools in Oman teach in English?', a: 'Yes. International schools teach mainly in English, while also delivering Arabic and Islamic studies as required by the Ministry of Education. Many schools support children who are new to English.' },
    ],
  },
  cta: {
    eyebrow: 'GET STARTED',
    title: 'Book an Education Consultation',
    subtitle: 'Tell us about your family and your timeline. An advisor will share a tailored school shortlist and a clear plan to relocate, invest and settle in Oman.',
  },
}

const ru = {
  metaTitle: 'Международные школы в Омане | Полный гид для семей экспатов',
  metaDesc:
    'Практический гид по международным школам Маската и Омана: британская, кембриджская, IB и американская программы, стоимость и поступление. Irfan Investment помогает вашей семье переехать, инвестировать и обустроиться.',
  breadcrumb: { home: 'Главная', label: 'Международные школы' },
  schema: {
    serviceName: 'Подбор международной школы и переезд семьи в Оман',
    serviceType: 'Консультации по образованию и переезду',
  },
  hero: {
    eyebrow: 'ОБРАЗОВАНИЕ И ПЕРЕЕЗД СЕМЬИ',
    title: 'Международные школы в Омане',
    titleAccent: 'Помогаем вашей семье строить будущее',
    subtitle:
      'Откройте для себя ведущие британские и международные школы Маската, пока наша команда помогает вам уверенно переехать, инвестировать и обустроиться в Омане.',
    ctaPrimary: 'Поговорить с консультантом по образованию',
    ctaSecondary: 'Смотреть наши гиды',
    imageAlt: 'Семьи и ученики в Маскате, Оман',
    stats: [
      { value: '50+', label: 'Международных школ по всему Оману' },
      { value: '4', label: 'Основные программы: британская, Cambridge, IB, американская' },
      { value: 'Авг / Сен', label: 'Начало учебного года' },
      { value: '3 до 18', label: 'Возраст учащихся' },
    ],
  },
  why: {
    eyebrow: 'ПОЧЕМУ ЭТО ВАЖНО',
    title: 'Почему образование важно при переезде',
    intro:
      'Для большинства семей правильная школа определяет всё остальное: где вы живёте, как инвестируете и как быстро все чувствуют себя как дома. Планирование образования в первую очередь превращает переезд в Оман в долгосрочное жизненное решение, а не в короткое пребывание.',
    items: [
      { title: 'Переезд начинается со школы', body: 'Сначала выбрав школу, вы планируете жильё, дорогу и распорядок дня вокруг неё, поэтому переезд ощущается обустроенным с первого дня.' },
      { title: 'Долгосрочное планирование семьи', body: 'Стабильная и подходящая школа удерживает детей на последовательном академическом пути и даёт всей семье причину пустить корни.' },
      { title: 'Надёжная долгосрочная инвестиция', body: 'Качественное образование защищает вашу самую важную инвестицию, будущее ваших детей, и естественно сочетается с решениями по недвижимости и бизнесу в Омане.' },
      { title: 'Будущее ваших детей', body: 'Британская, кембриджская, IB и американская программы в Маскате ведут к признанным квалификациям и в университеты Великобритании, Европы, Северной Америки и Залива.' },
      { title: 'Качество жизни', body: 'Маскат предлагает безопасный, удобный для семьи образ жизни с пляжами, парками и международным сообществом, благоприятную среду для развития детей.' },
      { title: 'Понятный путь к ВНЖ', body: 'Обустройство семьи тесно связано с недвижимостью, бизнесом и инвесторским ВНЖ, которые наша команда координирует от начала до конца.' },
    ],
  },
  system: {
    eyebrow: 'СИСТЕМА',
    title: 'Система международных школ в Омане',
    intro:
      'Сектор частного образования Омана построен на международно признанных программах, при этом британская система предлагается в Маскате чаще всего. Все лицензированные школы также преподают арабский язык, исламоведение и оманское обществознание наряду с основной программой, как того требует Министерство образования.',
    curriculaLabel: 'ПРОГРАММЫ, КОТОРЫЕ ВЫ ВСТРЕТИТЕ',
    curricula: ['Британская программа', 'Cambridge (CAIE)', 'IGCSE', 'A-Levels', 'International Baccalaureate (IB)', 'Американская (AP)', 'Оманский путь GED'],
    stages: [
      { title: 'Ранние годы', tag: 'Возраст 3 до 5', body: 'Foundation Stage и детский сад, обучение через игру, которое адаптирует малышей и развивает ранние навыки чтения и счёта.' },
      { title: 'Начальная школа', tag: 'Годы 1 до 6', body: 'Основные начальные годы, где дети следуют британской, IB или американской программе и формируют прочную академическую базу.' },
      { title: 'Средняя школа', tag: 'Годы 7 до 11 / IGCSE', body: 'Младшая средняя школа, ведущая к экзаменам IGCSE или эквивалентным, путь к старшим классам и выбору колледжа.' },
      { title: 'Старшие классы и университет', tag: 'Годы 12 до 13 / A-Levels и IB', body: 'A-Levels или диплом IB готовят учащихся к университетам Великобритании, Европы, Северной Америки и Залива.' },
    ],
  },
  featured: {
    eyebrow: 'ИЗБРАННЫЕ ШКОЛЫ',
    title: 'Подборка международных школ Маската',
    intro:
      'Ведущие международные школы Маската, с которыми мы работаем напрямую. Пока ваша семья переезжает в Оман, наши консультанты помогут выбрать подходящую школу и обеспечить зачисление детей — согласованно с жильём, визами и переездом. Нажмите на любую школу, чтобы перейти на её официальный сайт. Сведения ориентировочные и меняются год от года.',
    feeLabel: 'Ориентировочная годовая плата',
    cta: 'Спросите, какая школа подойдёт вашей семье',
    cards: [
      { name: 'Jabal Al Ma’rifa International School', curriculum: 'Британская / Cambridge + оманский GED', location: 'Knowledge Oasis Muscat, Русайл', locality: 'Маскат', ages: 'Ранние годы до 12 класса', highlight: 'Новая школа британского формата в Knowledge Oasis Muscat, открывающая свой первый учебный год и постепенно растущая по классам.', fees: 'От ~OMR 3,500 / год (ориентир.)' },
      { name: 'The British School Muscat', curriculum: 'Британская / IGCSE и A-Levels', location: 'Madinat as Sultan Qaboos', locality: 'Маскат', ages: 'Возраст 3 до 18 (FS1 до Year 13)', highlight: 'Одна из старейших британских школ Омана с собственным кампусом, центром старших классов и полной британской национальной программой.', fees: '~OMR 4,240 до 10,280 / год' },
      { name: 'Cheltenham Muscat', curriculum: 'Британская / IGCSE и A-Levels', location: 'Al Mouj Muscat', locality: 'Маскат', ages: 'KG1 до 12 класса', highlight: 'Школа британской программы в прибрежном районе Al Mouj, популярная среди семей на западе Маската.', fees: '~OMR 3,899 до 8,111 / год' },
      { name: 'The American British Academy (ABA)', curriculum: 'IB / Американская', location: 'Al Ghubra, Маскат', locality: 'Маскат', ages: 'Pre-K до 12 класса', highlight: 'Устоявшаяся международная школа с программой IB и структурой американского типа, объединяющая разнообразное сообщество экспатов.', fees: '~OMR 3,790 до 10,210 / год' },
      { name: 'Downe House Muscat', curriculum: 'Британская (Cambridge), для девочек', location: 'Al Bandar, запад Маската', locality: 'Маскат', ages: '1 до 12 класса', highlight: 'Оманский кампус ведущей британской школы для девочек с современным кампусом и программами Cambridge IGCSE и A-Level.', fees: '~OMR 3,470 до 7,500 / год' },
    ],
  },
  fees: {
    eyebrow: 'СТОИМОСТЬ',
    title: 'Ориентировочная стоимость обучения',
    intro:
      'Стоимость международной школы в Омане обычно складывается из разовых сборов за подачу заявления и регистрацию и годовой платы, которая растёт по ступеням. Приведённые цифры являются ориентировочными диапазонами для премиальных и среднеценовых школ Маската на цикл 2025/26.',
    components: [
      { label: 'Сбор за заявление / тестирование', amount: 'OMR 50 до 200', desc: 'Разовый, обычно невозвратный, оплачивается при подаче заявления или вступительном тестировании.' },
      { label: 'Регистрационный / резервный депозит', amount: 'OMR 300+ или 10 до 40%', desc: 'Закрепляет место после получения предложения, обычно зачитывается в счёт первого семестра.' },
      { label: 'Разовый вступительный / капитальный взнос', amount: 'OMR 2,700 до 3,500', desc: 'Взимается некоторыми премиальными школами при поступлении, часто со скидками для братьев и сестёр. У многих среднеценовых школ его нет.' },
      { label: 'Возвратный депозит', amount: '~OMR 100', desc: 'Удерживается в некоторых школах и возвращается при отъезде при должном уведомлении и погашенных платежах.' },
    ],
    columns: ['Ступень / класс', 'Ориентировочная годовая плата (OMR)'],
    rows: [
      ['Ранние годы (FS / KG)', '3,000 до 5,400'],
      ['Начальная (Годы 1 до 6)', '5,000 до 6,000'],
      ['Младшая средняя (Годы 7 до 9)', '6,000 до 8,500'],
      ['IGCSE (Годы 10 до 11)', '6,800 до 9,200'],
      ['Старшие классы / A-Levels (Годы 12 до 13)', '8,100 до 10,300'],
    ],
    disclaimer:
      'Стоимость меняется ежегодно, и её всегда следует уточнять напрямую в каждой школе. Приведённые цифры являются ориентировочными диапазонами только для справки.',
  },
  admissions: {
    eyebrow: 'ПОСТУПЛЕНИЕ',
    title: 'Процесс поступления',
    intro:
      'Большинство международных школ Омана проходят похожий путь поступления. Места в популярных классах заполняются рано, поэтому стоит начинать заранее. Наша команда может вести процесс от вашего имени.',
    steps: [
      { title: 'Запрос', body: 'Заявите о своём интересе и сообщите возраст детей, текущую программу и желаемую дату начала.' },
      { title: 'Посещение школы', body: 'Осмотрите кампус, познакомьтесь с персоналом и почувствуйте атмосферу, лично или онлайн.' },
      { title: 'Заявление', body: 'Подайте онлайн-заявление с необходимыми документами и характеристиками.' },
      { title: 'Тестирование', body: 'Дети проходят тестирование по возрасту или когнитивный тест, особенно со старших начальных классов.' },
      { title: 'Собеседование', body: 'Короткая встреча с ребёнком и семьёй, иногда с рекомендацией из прежней школы.' },
      { title: 'Предложение', body: 'Школа выдаёт официальное предложение места с графиком оплаты и датой начала.' },
      { title: 'Регистрация', body: 'Примите предложение, оплатите регистрационный сбор или депозит и завершите зачисление, чтобы закрепить место.' },
    ],
    docsTitle: 'ДОКУМЕНТЫ, КОТОРЫЕ ОБЫЧНО НУЖНЫ',
    docs: ['Паспорт и резидентская карта ребёнка', 'Недавние школьные характеристики', 'Свидетельство о рождении', 'Справка о переводе из прежней школы', 'Прививочная карта', 'Фотографии паспортного формата', 'Паспорта и резидентские карты обоих родителей', 'Любые результаты тестов или оценивания'],
  },
  relocation: {
    eyebrow: 'ЗА ПРЕДЕЛАМИ КЛАССА',
    title: 'Услуги по переезду семьи',
    intro:
      'Выбор школы — лишь часть большого переезда. Irfan Investment сопровождает семьи от начала до конца, чтобы школа, жильё, бизнес и резидентство сложились в единый график.',
    services: [
      { title: 'Подбор школы', body: 'Персональный список и представления, подобранные под ваших детей, программу и район.' },
      { title: 'Поиск недвижимости', body: 'Жильё для покупки или аренды в удобных для семьи районах рядом с выбранной школой.' },
      { title: 'Открытие бизнеса', body: 'Регистрация компании и лицензирование в Омане с возможностью полного иностранного владения.' },
      { title: 'Резидентство', body: 'Инвесторские и семейные пути ВНЖ, согласованные с вашей недвижимостью или бизнесом.' },
      { title: 'Банковский счёт', body: 'Помощь в открытии личных и корпоративных счетов в оманских банках.' },
      { title: 'Визы', body: 'Сопровождение по семейным визам и резидентским картам, которые школы требуют для зачисления.' },
      { title: 'Поддержка при переезде', body: 'Практическая помощь с логистикой переезда вашего домохозяйства в Маскат.' },
      { title: 'Обустройство', body: 'Местные знания о районах, здравоохранении и быте, чтобы вы быстро освоились.' },
    ],
    links: [
      { label: 'Купить недвижимость в Омане', to: '/buy' },
      { label: 'Регистрация компании', to: '/invest' },
      { label: 'Аналитика и гиды', to: '/insights' },
      { label: 'Об Irfan Investment', to: '/about' },
    ],
  },
  faq: {
    eyebrow: 'ВОПРОСЫ',
    title: 'Часто задаваемые вопросы',
    items: [
      { q: 'Какие лучшие международные школы в Маскате?', a: 'В Маскате большой выбор уважаемых международных школ, включая The British School Muscat, American British Academy, Cheltenham Muscat и Downe House Muscat, а также более новые школы, такие как Jabal Al Ma’rifa. Лучший вариант зависит от возраста детей, желаемой программы и района проживания, и именно в этом помогают наши консультанты.' },
      { q: 'Какие программы предлагают международные школы Омана?', a: 'Чаще всего предлагается британская программа (Cambridge IGCSE и A-Levels), затем International Baccalaureate и американские программы. Все лицензированные школы также преподают арабский язык, исламоведение и оманское обществознание наряду с основной программой.' },
      { q: 'Сколько стоит международная школа в Омане?', a: 'Годовая плата обычно составляет от около OMR 3,000 в ранние годы до примерно OMR 10,000 в старших классах премиальных школ; среднеценовые школы заметно дешевле. Большинство школ также взимают разовые сборы за заявление и регистрацию. Всегда уточняйте актуальные цифры в школе.' },
      { q: 'Есть ли в Маскате школы британской программы?', a: 'Да. Британская программа — самый распространённый международный вариант в Маскате; несколько школ предлагают полную британскую национальную программу через Cambridge IGCSE и A-Levels.' },
      { q: 'Доступна ли в Омане кембриджская программа?', a: 'Да. Cambridge (CAIE) — наиболее используемый экзаменационный совет в Омане для IGCSE и A-Levels, представленный во многих школах британской программы в Маскате и за его пределами.' },
      { q: 'Когда начинается учебный год в Омане?', a: 'Международные школы работают по трёхсеместровому году британского календаря: осенний семестр начинается в конце августа или начале сентября, а год заканчивается примерно в конце июня.' },
      { q: 'Нужна ли детям резидентская виза для зачисления?', a: 'Школы обычно могут начать процесс до оформления резидентства, но оманская резидентская карта, как правило, требуется до начала учёбы согласно правилам Министерства образования. Мы согласуем резидентство с вашим школьным графиком.' },
      { q: 'За сколько времени стоит подавать заявление?', a: 'Популярные классы заполняются рано, поэтому мы рекомендуем подавать заявление за несколько месяцев до желаемого начала, а для точек входа, таких как начало начальной школы или старших классов, ещё раньше.' },
      { q: 'Какие районы Маската лучше всего подходят семьям с детьми школьного возраста?', a: 'Удобные для семьи районы включают Al Mouj, Madinat as Sultan Qaboos, Qurum, Shatti Al Qurum, Azaiba и Bausher, каждый в пределах досягаемости нескольких международных школ. Мы подбираем жильё под выбранную школу и дорогу.' },
      { q: 'Может ли Irfan Investment помочь выбрать школу и переехать?', a: 'Да. Мы помогаем семьям экспатов составить список и связаться со школами, а затем объединяем жильё, бизнес, банк и резидентство в единый график, чтобы весь переезд решался в одном месте.' },
      { q: 'Преподают ли международные школы Омана на английском?', a: 'Да. Международные школы преподают преимущественно на английском, при этом ведут арабский язык и исламоведение по требованию Министерства образования. Многие школы поддерживают детей, которые только начинают изучать английский.' },
    ],
  },
  cta: {
    eyebrow: 'НАЧНИТЕ',
    title: 'Записаться на образовательную консультацию',
    subtitle: 'Расскажите о своей семье и сроках. Консультант подготовит персональный список школ и понятный план переезда, инвестиций и обустройства в Омане.',
  },
}

const ar = {
  metaTitle: 'المدارس الدولية في عُمان | دليل كامل للعائلات الوافدة',
  metaDesc:
    'دليل عملي للمدارس الدولية في مسقط وعُمان: المناهج البريطانية وكامبريدج والبكالوريا الدولية والأمريكية، والرسوم والقبول، مع مساعدة Irfan Investment لعائلتك على الانتقال والاستثمار والاستقرار.',
  breadcrumb: { home: 'الرئيسية', label: 'المدارس الدولية' },
  schema: {
    serviceName: 'اختيار المدرسة الدولية وانتقال العائلة في عُمان',
    serviceType: 'استشارات التعليم والانتقال',
  },
  hero: {
    eyebrow: 'التعليم وانتقال العائلة',
    title: 'المدارس الدولية في عُمان',
    titleAccent: 'نساعد عائلتك على بناء المستقبل',
    subtitle:
      'اكتشف أبرز المدارس البريطانية والدولية في مسقط بينما يساعدك فريقنا على الانتقال والاستثمار والاستقرار في عُمان بثقة.',
    ctaPrimary: 'تحدّث مع مستشار تعليمي',
    ctaSecondary: 'استعرض أدلتنا',
    imageAlt: 'عائلات وطلاب في مسقط، عُمان',
    stats: [
      { value: '50+', label: 'مدرسة دولية في أنحاء عُمان' },
      { value: '4', label: 'مناهج رئيسية: بريطاني، كامبريدج، IB، أمريكي' },
      { value: 'أغسطس / سبتمبر', label: 'بداية العام الدراسي' },
      { value: '3 إلى 18', label: 'الأعمار المستهدفة' },
    ],
  },
  why: {
    eyebrow: 'لماذا يهم ذلك',
    title: 'لماذا يهم التعليم عند الانتقال',
    intro:
      'بالنسبة لمعظم العائلات، تحدد المدرسة المناسبة كل شيء آخر: أين تسكن، وكيف تستثمر، وكم بسرعة يشعر الجميع بأنهم في بيتهم. التخطيط للتعليم أولاً يحوّل الانتقال إلى عُمان إلى قرار حياتي طويل الأمد بدلاً من إقامة قصيرة.',
    items: [
      { title: 'انتقال يبدأ من المدرسة', body: 'اختيار المدرسة أولاً يتيح لك تخطيط السكن والمواصلات والروتين اليومي حولها، فيشعر الانتقال بالاستقرار من اليوم الأول.' },
      { title: 'تخطيط عائلي طويل الأمد', body: 'مدرسة مستقرة ومناسبة تبقي أطفالك على مسار أكاديمي متّسق وتمنح العائلة بأكملها سبباً لترسيخ جذورها.' },
      { title: 'استثمار سليم طويل الأمد', body: 'التعليم الجيد يحمي أهم استثماراتك، وهو مستقبل أطفالك، ويتكامل بشكل طبيعي مع قرارات العقار والأعمال في عُمان.' },
      { title: 'مستقبل أطفالك', body: 'تقود المسارات البريطانية وكامبريدج والبكالوريا الدولية والأمريكية في مسقط إلى مؤهلات معترف بها وإلى جامعات في بريطانيا وأوروبا وأمريكا الشمالية والخليج.' },
      { title: 'جودة الحياة', body: 'توفّر مسقط نمط حياة آمناً ومناسباً للعائلات مع شواطئ وحدائق ومجتمع دولي، بيئة سهلة لازدهار الأطفال.' },
      { title: 'مسار واضح للإقامة', body: 'يرتبط استقرار عائلتك ارتباطاً وثيقاً بخيارات العقار والأعمال وإقامة المستثمر، وهو ما ينسّقه فريقنا من البداية إلى النهاية.' },
    ],
  },
  system: {
    eyebrow: 'النظام',
    title: 'نظام المدارس الدولية في عُمان',
    intro:
      'يقوم قطاع التعليم الخاص في عُمان على مناهج معترف بها دولياً، ويعدّ النظام البريطاني الأكثر انتشاراً في مسقط. كما تدرّس جميع المدارس المرخّصة اللغة العربية والتربية الإسلامية والدراسات الاجتماعية العُمانية إلى جانب منهجها الرئيسي، وفقاً لمتطلبات وزارة التربية والتعليم.',
    curriculaLabel: 'المناهج التي ستجدها',
    curricula: ['المنهج البريطاني', 'كامبريدج (CAIE)', 'IGCSE', 'A-Levels', 'البكالوريا الدولية (IB)', 'الأمريكي (AP)', 'مسار الدبلوم العُماني GED'],
    stages: [
      { title: 'السنوات المبكرة', tag: 'الأعمار 3 إلى 5', body: 'المرحلة التأسيسية والروضة، تعلّم قائم على اللعب يهيّئ الصغار ويبني مهارات القراءة والحساب المبكرة.' },
      { title: 'الابتدائية', tag: 'السنوات 1 إلى 6', body: 'سنوات الابتدائية الأساسية، حيث يتبع الأطفال المنهج البريطاني أو IB أو الأمريكي ويبنون أسساً أكاديمية قوية.' },
      { title: 'الثانوية', tag: 'السنوات 7 إلى 11 / IGCSE', body: 'الثانوية الدنيا المؤدية إلى امتحانات IGCSE أو ما يعادلها، بوابة المرحلة السادسة وخيارات الكلية.' },
      { title: 'المرحلة السادسة والجامعة', tag: 'السنوات 12 إلى 13 / A-Levels و IB', body: 'تُعدّ شهادات A-Levels أو دبلوم IB الطلاب لجامعات بريطانيا وأوروبا وأمريكا الشمالية والخليج.' },
    ],
  },
  featured: {
    eyebrow: 'مدارس مختارة',
    title: 'مجموعة من المدارس الدولية في مسقط',
    intro:
      'أبرز المدارس الدولية في مسقط التي نتعامل معها مباشرةً. مع انتقال عائلتك إلى عُمان، يساعدك مستشارونا على اختيار المدرسة المناسبة وتأمين قبول أطفالك، بالتنسيق مع سكنك وتأشيراتك وانتقالك. اضغط على أي مدرسة لزيارة موقعها الرسمي. التفاصيل إرشادية وتتغير من عام لآخر.',
    feeLabel: 'الرسوم السنوية الإرشادية',
    cta: 'اسألنا عن المدرسة المناسبة لعائلتك',
    cards: [
      { name: 'Jabal Al Ma’rifa International School', curriculum: 'بريطاني / كامبريدج + GED عُماني', location: 'واحة المعرفة مسقط، الرسيل', locality: 'مسقط', ages: 'السنوات المبكرة حتى الصف 12', highlight: 'مدرسة حديثة بإطار بريطاني في واحة المعرفة مسقط، تفتتح عامها الدراسي الأول وتتوسع عبر الصفوف تدريجياً.', fees: 'من ~OMR 3,500 / سنة (إرشادي)' },
      { name: 'The British School Muscat', curriculum: 'بريطاني / IGCSE و A-Levels', location: 'مدينة السلطان قابوس', locality: 'مسقط', ages: 'الأعمار 3 إلى 18 (FS1 حتى Year 13)', highlight: 'من أعرق المدارس البريطانية في عُمان، بحرم مخصّص ومركز للمرحلة السادسة ومسار كامل للمنهج الوطني البريطاني.', fees: '~OMR 4,240 إلى 10,280 / سنة' },
      { name: 'Cheltenham Muscat', curriculum: 'بريطاني / IGCSE و A-Levels', location: 'الموج مسقط', locality: 'مسقط', ages: 'KG1 حتى الصف 12', highlight: 'مدرسة بمنهج بريطاني في مجتمع الموج الساحلي، محبّبة لدى العائلات في غرب مسقط.', fees: '~OMR 3,899 إلى 8,111 / سنة' },
      { name: 'The American British Academy (ABA)', curriculum: 'IB / أمريكي', location: 'الغبرة، مسقط', locality: 'مسقط', ages: 'ما قبل الروضة حتى الصف 12', highlight: 'مدرسة دولية راسخة تقدّم برنامج IB بهيكل أمريكي، وتجمع مجتمعاً وافداً متنوعاً.', fees: '~OMR 3,790 إلى 10,210 / سنة' },
      { name: 'Downe House Muscat', curriculum: 'بريطاني (كامبريدج)، للبنات', location: 'البندر، غرب مسقط', locality: 'مسقط', ages: 'الصف 1 حتى الصف 12', highlight: 'الحرم العُماني لمدرسة بريطانية رائدة للبنات، بحرم حديث مخصّص ومسارات Cambridge IGCSE و A-Level.', fees: '~OMR 3,470 إلى 7,500 / سنة' },
    ],
  },
  fees: {
    eyebrow: 'الرسوم',
    title: 'الرسوم الدراسية التقديرية',
    intro:
      'تجمع تكاليف المدرسة الدولية في عُمان عادةً بين رسوم التقديم والتسجيل لمرة واحدة ورسوم سنوية ترتفع حسب المرحلة. الأرقام أدناه نطاقات إرشادية لمدارس متميّزة ومتوسطة في مسقط لدورة 2025/26.',
    components: [
      { label: 'رسوم التقديم / التقييم', amount: 'OMR 50 إلى 200', desc: 'لمرة واحدة، غير قابلة للاسترداد غالباً، تُدفع عند التقديم أو اختبار القبول.' },
      { label: 'وديعة التسجيل / الحجز', amount: 'OMR 300+ أو 10 إلى 40%', desc: 'تثبّت المقعد بعد العرض، وتُحتسب عادةً ضمن رسوم الفصل الأول.' },
      { label: 'رسوم التحاق / رأسمالية لمرة واحدة', amount: 'OMR 2,700 إلى 3,500', desc: 'تفرضها بعض المدارس المتميّزة عند الالتحاق، وغالباً بخصومات للإخوة. كثير من المدارس المتوسطة لا تفرضها.' },
      { label: 'وديعة تأمين قابلة للاسترداد', amount: '~OMR 100', desc: 'تحتفظ بها بعض المدارس وتُعاد عند المغادرة بإشعار مناسب وتسوية الرسوم.' },
    ],
    columns: ['المرحلة / الصف', 'الرسوم السنوية الإرشادية (OMR)'],
    rows: [
      ['السنوات المبكرة (FS / KG)', '3,000 إلى 5,400'],
      ['الابتدائية (السنوات 1 إلى 6)', '5,000 إلى 6,000'],
      ['الثانوية الدنيا (السنوات 7 إلى 9)', '6,000 إلى 8,500'],
      ['IGCSE (السنوات 10 إلى 11)', '6,800 إلى 9,200'],
      ['المرحلة السادسة / A-Levels (السنوات 12 إلى 13)', '8,100 إلى 10,300'],
    ],
    disclaimer:
      'تتغير الرسوم سنوياً ويجب دائماً تأكيدها مباشرةً مع كل مدرسة. الأرقام المعروضة نطاقات إرشادية لغرض التوجيه فقط.',
  },
  admissions: {
    eyebrow: 'القبول',
    title: 'عملية القبول',
    intro:
      'تتبع معظم المدارس الدولية في عُمان رحلة قبول متشابهة. تمتلئ المقاعد في الصفوف المطلوبة مبكراً، لذا يُستحسن البدء قبل تاريخ الالتحاق المنشود بوقت كافٍ. يمكن لفريقنا إدارة العملية نيابةً عنك.',
    steps: [
      { title: 'الاستفسار', body: 'سجّل اهتمامك وشارك أعمار أطفالك ومنهجهم الحالي وتاريخ البدء المفضّل.' },
      { title: 'زيارة المدرسة', body: 'تجوّل في الحرم وقابل الكادر واستشعر المجتمع، حضورياً أو افتراضياً.' },
      { title: 'التقديم', body: 'قدّم الطلب الإلكتروني مع المستندات والتقارير المطلوبة.' },
      { title: 'التقييم', body: 'يخضع الأطفال لتقييم مناسب للعمر أو اختبار قدرات، خاصةً من الصفوف الابتدائية العليا.' },
      { title: 'المقابلة', body: 'لقاء قصير مع الطفل والعائلة، أحياناً مع توصية من المدرسة السابقة.' },
      { title: 'العرض', body: 'تصدر المدرسة عرضاً رسمياً بالمقعد مع جدول الرسوم وتاريخ البدء.' },
      { title: 'التسجيل', body: 'اقبل العرض وادفع رسوم التسجيل أو الوديعة وأكمل الالتحاق لتثبيت المقعد.' },
    ],
    docsTitle: 'المستندات التي ستحتاجها عادةً',
    docs: ['جواز سفر الطفل وبطاقة الإقامة', 'تقارير مدرسية حديثة', 'شهادة الميلاد', 'شهادة نقل من المدرسة السابقة', 'سجلات التطعيم', 'صور بحجم جواز السفر', 'جوازا سفر الوالدين وبطاقتا الإقامة', 'أي نتائج اختبارات أو تقييم'],
  },
  relocation: {
    eyebrow: 'ما وراء الصف',
    title: 'خدمات انتقال العائلة',
    intro:
      'اختيار المدرسة جزء من انتقال أكبر. تدعم Irfan Investment العائلات من البداية إلى النهاية، لتتكامل المدرسة والسكن والأعمال والإقامة ضمن جدول زمني واحد.',
    services: [
      { title: 'اختيار المدرسة', body: 'قائمة مخصّصة وتعريفات، تُطابق أطفالك والمنهج والمنطقة.' },
      { title: 'البحث عن عقار', body: 'منازل للشراء أو الإيجار في مجتمعات مناسبة للعائلات قرب مدرستك المختارة.' },
      { title: 'تأسيس الأعمال', body: 'تأسيس الشركات والترخيص في عُمان مع إمكانية التملّك الأجنبي الكامل.' },
      { title: 'الإقامة', body: 'مسارات إقامة المستثمر والعائلة، منسّقة مع عقارك أو عملك.' },
      { title: 'الحساب البنكي', body: 'مساعدة في فتح حسابات شخصية وشركاتية لدى البنوك العُمانية.' },
      { title: 'التأشيرات', body: 'إرشاد حول تأشيرات العائلة وبطاقات الإقامة التي تطلبها المدارس للالتحاق.' },
      { title: 'دعم الانتقال', body: 'مساعدة عملية في لوجستيات نقل أسرتك إلى مسقط.' },
      { title: 'الاستقرار', body: 'معرفة محلية بالأحياء والرعاية الصحية والحياة اليومية لتستقر بسرعة.' },
    ],
    links: [
      { label: 'شراء عقار في عُمان', to: '/buy' },
      { label: 'تأسيس الشركات', to: '/invest' },
      { label: 'مقالات وأدلة', to: '/insights' },
      { label: 'عن Irfan Investment', to: '/about' },
    ],
  },
  faq: {
    eyebrow: 'الأسئلة',
    title: 'الأسئلة الشائعة',
    items: [
      { q: 'ما أفضل المدارس الدولية في مسقط؟', a: 'تضم مسقط خيارات واسعة من المدارس الدولية المرموقة، منها The British School Muscat و American British Academy و Cheltenham Muscat و Downe House Muscat، إلى جانب مدارس أحدث مثل Jabal Al Ma’rifa. يعتمد الخيار الأفضل على أعمار أطفالك والمنهج المطلوب ومكان سكنك، وهذا تحديداً ما يساعدك مستشارونا على الموازنة فيه.' },
      { q: 'ما المناهج التي تقدّمها المدارس الدولية في عُمان؟', a: 'المنهج البريطاني (Cambridge IGCSE و A-Levels) هو الأكثر انتشاراً، يليه البكالوريا الدولية والبرامج الأمريكية. كما تدرّس جميع المدارس المرخّصة اللغة العربية والتربية الإسلامية والدراسات الاجتماعية العُمانية إلى جانب منهجها الرئيسي.' },
      { q: 'كم تكلفة المدرسة الدولية في عُمان؟', a: 'تتراوح الرسوم السنوية عادةً من نحو OMR 3,000 في السنوات المبكرة إلى نحو OMR 10,000 في المرحلة السادسة بالمدارس المتميّزة، بينما تكون المدارس المتوسطة أرخص بوضوح. تفرض معظم المدارس أيضاً رسوم تقديم وتسجيل لمرة واحدة. أكّد دائماً الأرقام الحالية مع المدرسة.' },
      { q: 'هل توجد مدارس بمنهج بريطاني في مسقط؟', a: 'نعم. المنهج البريطاني هو الخيار الدولي الأكثر شيوعاً في مسقط، وتقدّم عدة مدارس المنهج الوطني البريطاني الكامل عبر Cambridge IGCSE و A-Levels.' },
      { q: 'هل منهج كامبريدج متاح في عُمان؟', a: 'نعم. كامبريدج (CAIE) هي هيئة الامتحانات الأكثر استخداماً في عُمان لـ IGCSE و A-Levels، وتُقدَّم في كثير من مدارس المنهج البريطاني في مسقط وخارجها.' },
      { q: 'متى يبدأ العام الدراسي في عُمان؟', a: 'تتبع المدارس الدولية عاماً من ثلاثة فصول وفق التقويم البريطاني، يبدأ فصل الخريف في أواخر أغسطس أو أوائل سبتمبر وينتهي العام نحو أواخر يونيو.' },
      { q: 'هل يحتاج أطفالي إلى تأشيرة إقامة للالتحاق؟', a: 'يمكن للمدارس عادةً بدء الطلب قبل اكتمال الإقامة، لكن بطاقة الإقامة العُمانية مطلوبة عادةً قبل بدء الطفل، وفقاً لأنظمة وزارة التربية والتعليم. ننسّق الإقامة لتتوافق مع جدول مدرستك.' },
      { q: 'قبل كم من الوقت ينبغي التقديم؟', a: 'تمتلئ الصفوف المطلوبة مبكراً، لذا نوصي بالتقديم قبل البدء المنشود بعدة أشهر، وأبكر من ذلك لنقاط الدخول مثل بداية الابتدائية أو المرحلة السادسة.' },
      { q: 'ما أفضل مناطق مسقط للعائلات ذات الأطفال في سن الدراسة؟', a: 'تشمل المناطق المناسبة للعائلات الموج ومدينة السلطان قابوس والقرم وشاطئ القرم والعذيبة وبوشر، وكل منها قريب من عدة مدارس دولية. نطابق بحثك عن السكن مع مدرستك المختارة ومسافة التنقل.' },
      { q: 'هل تستطيع Irfan Investment مساعدتنا في اختيار مدرسة والانتقال؟', a: 'نعم. نساعد العائلات الوافدة على وضع قائمة بالمدارس والتواصل معها، ثم نجمع السكن والأعمال والبنك والإقامة في جدول زمني واحد ليُدار الانتقال كله من مكان واحد.' },
      { q: 'هل تدرّس المدارس الدولية في عُمان بالإنجليزية؟', a: 'نعم. تدرّس المدارس الدولية أساساً بالإنجليزية، مع تقديم اللغة العربية والتربية الإسلامية وفق متطلبات وزارة التربية والتعليم. وتدعم كثير من المدارس الأطفال الجدد على الإنجليزية.' },
    ],
  },
  cta: {
    eyebrow: 'ابدأ الآن',
    title: 'احجز استشارة تعليمية',
    subtitle: 'أخبرنا عن عائلتك وجدولك الزمني. سيشاركك المستشار قائمة مدارس مخصّصة وخطة واضحة للانتقال والاستثمار والاستقرار في عُمان.',
  },
}

const fa = {
  metaTitle: 'مدارس بین‌المللی عمان | راهنمای کامل برای خانواده‌های مهاجر',
  metaDesc:
    'راهنمای کاربردی مدارس بین‌المللی مسقط و عمان؛ برنامه‌های بریتانیایی، کمبریج، IB و آمریکایی، شهریه و پذیرش. Irfan Investment به خانواده شما برای مهاجرت، سرمایه‌گذاری و اسکان کمک می‌کند.',
  breadcrumb: { home: 'خانه', label: 'مدارس بین‌المللی' },
  schema: {
    serviceName: 'انتخاب مدرسه بین‌المللی و اسکان خانواده در عمان',
    serviceType: 'مشاوره تحصیلی و مهاجرتی',
  },
  hero: {
    eyebrow: 'تحصیل و اسکان خانواده',
    title: 'مدارس بین‌المللی در عمان',
    titleAccent: 'به خانواده شما برای ساختن آینده کمک می‌کنیم',
    subtitle:
      'برترین مدارس بریتانیایی و بین‌المللی مسقط را بشناسید، در حالی که تیم ما به شما برای مهاجرت، سرمایه‌گذاری و اسکان مطمئن در عمان کمک می‌کند.',
    ctaPrimary: 'گفت‌وگو با مشاور تحصیلی',
    ctaSecondary: 'مشاهده راهنماها',
    imageAlt: 'خانواده‌ها و دانش‌آموزان در مسقط، عمان',
    stats: [
      { value: '+۵۰', label: 'مدرسه بین‌المللی در سراسر عمان' },
      { value: '۴', label: 'برنامه اصلی: بریتانیایی، کمبریج، IB، آمریکایی' },
      { value: 'مرداد / شهریور', label: 'شروع سال تحصیلی' },
      { value: '۳ تا ۱۸', label: 'بازه سنی' },
    ],
  },
  why: {
    eyebrow: 'چرا اهمیت دارد',
    title: 'چرا تحصیل هنگام مهاجرت اهمیت دارد',
    intro:
      'برای بیشتر خانواده‌ها، مدرسه درست همه چیز دیگر را تعیین می‌کند؛ اینکه کجا زندگی کنید، چگونه سرمایه‌گذاری کنید و چه‌قدر سریع همه احساس کنند در خانه‌اند. برنامه‌ریزی تحصیل در گام نخست، مهاجرت به عمان را به یک تصمیم بلندمدت زندگی تبدیل می‌کند نه یک اقامت کوتاه.',
    items: [
      { title: 'مهاجرتی که از مدرسه آغاز می‌شود', body: 'انتخاب مدرسه در ابتدا به شما امکان می‌دهد خانه، مسیر رفت‌وآمد و روال روزانه را پیرامون آن بچینید تا مهاجرت از روز نخست سامان‌یافته باشد.' },
      { title: 'برنامه‌ریزی بلندمدت خانواده', body: 'یک مدرسه پایدار و متناسب، فرزندان شما را در مسیر تحصیلی منسجم نگه می‌دارد و به کل خانواده دلیلی برای ریشه‌دواندن می‌دهد.' },
      { title: 'سرمایه‌گذاری بلندمدت مطمئن', body: 'آموزش باکیفیت از مهم‌ترین سرمایه شما یعنی آینده فرزندانتان محافظت می‌کند و در کنار تصمیم‌های ملکی و کسب‌وکار در عمان قرار می‌گیرد.' },
      { title: 'آینده فرزندان شما', body: 'مسیرهای بریتانیایی، کمبریج، IB و آمریکایی در مسقط به مدارک معتبر و به دانشگاه‌های بریتانیا، اروپا، آمریکای شمالی و خلیج فارس می‌رسند.' },
      { title: 'کیفیت زندگی', body: 'مسقط سبک زندگی امن و خانواده‌محور با سواحل، پارک‌ها و جامعه‌ای بین‌المللی ارائه می‌دهد؛ محیطی آسان برای رشد کودکان.' },
      { title: 'مسیری روشن به اقامت', body: 'اسکان خانواده شما با گزینه‌های ملک، کسب‌وکار و اقامت سرمایه‌گذاری پیوند نزدیک دارد که تیم ما آن را از ابتدا تا انتها هماهنگ می‌کند.' },
    ],
  },
  system: {
    eyebrow: 'نظام آموزشی',
    title: 'نظام مدارس بین‌المللی در عمان',
    intro:
      'بخش آموزش خصوصی عمان بر پایه برنامه‌های آموزشی شناخته‌شده بین‌المللی بنا شده و نظام بریتانیایی بیش از همه در مسقط ارائه می‌شود. همه مدارس دارای مجوز نیز در کنار برنامه اصلی، زبان عربی، تعلیمات اسلامی و مطالعات اجتماعی عمان را طبق الزام وزارت آموزش تدریس می‌کنند.',
    curriculaLabel: 'برنامه‌هایی که خواهید یافت',
    curricula: ['برنامه بریتانیایی', 'کمبریج (CAIE)', 'IGCSE', 'A-Levels', 'بکالوریای بین‌المللی (IB)', 'آمریکایی (AP)', 'مسیر دیپلم عمانی GED'],
    stages: [
      { title: 'سال‌های نخستین', tag: 'سنین ۳ تا ۵', body: 'مرحله پایه و مهدکودک؛ یادگیری مبتنی بر بازی که کودکان خردسال را آماده می‌کند و سواد و حساب اولیه را می‌سازد.' },
      { title: 'ابتدایی', tag: 'سال‌های ۱ تا ۶', body: 'سال‌های اصلی ابتدایی که کودکان از برنامه بریتانیایی، IB یا آمریکایی پیروی می‌کنند و پایه‌های تحصیلی محکمی می‌سازند.' },
      { title: 'متوسطه', tag: 'سال‌های ۷ تا ۱۱ / IGCSE', body: 'متوسطه اول که به آزمون‌های IGCSE یا معادل آن می‌رسد؛ دروازه ورود به مرحله ششم و انتخاب کالج.' },
      { title: 'مرحله ششم و دانشگاه', tag: 'سال‌های ۱۲ تا ۱۳ / A-Levels و IB', body: 'مدارک A-Levels یا دیپلم IB دانش‌آموزان را برای دانشگاه‌های بریتانیا، اروپا، آمریکای شمالی و خلیج فارس آماده می‌کنند.' },
    ],
  },
  featured: {
    eyebrow: 'مدارس منتخب',
    title: 'گزیده‌ای از مدارس بین‌المللی مسقط',
    intro:
      'برترین مدارس بین‌المللی مسقط که ما مستقیماً با آن‌ها در ارتباطیم. همزمان با مهاجرت خانواده‌تان به عمان، مشاوران ما به شما کمک می‌کنند مدرسهٔ مناسب را انتخاب و پذیرش فرزندانتان را قطعی کنید، هماهنگ با خانه، ویزا و جابه‌جایی. روی هر مدرسه بزنید تا وارد وب‌سایت رسمی‌اش شوید. جزئیات جنبهٔ راهنما دارند و سال‌به‌سال تغییر می‌کنند.',
    feeLabel: 'شهریه سالانه تقریبی',
    cta: 'بپرسید کدام مدرسه برای خانواده شما مناسب است',
    cards: [
      { name: 'Jabal Al Ma’rifa International School', curriculum: 'بریتانیایی / کمبریج + GED عمان', location: 'واحه دانش مسقط، الرسیل', locality: 'مسقط', ages: 'سال‌های نخستین تا پایه ۱۲', highlight: 'مدرسه‌ای تازه‌تأسیس با چارچوب بریتانیایی در واحه دانش مسقط که نخستین سال تحصیلی خود را آغاز می‌کند و به‌تدریج در پایه‌ها گسترش می‌یابد.', fees: 'از حدود ۳٬۵۰۰ ریال عمان در سال (تقریبی)' },
      { name: 'The British School Muscat', curriculum: 'بریتانیایی / IGCSE و A-Levels', location: 'مدینة السلطان قابوس', locality: 'مسقط', ages: 'سنین ۳ تا ۱۸ (FS1 تا Year 13)', highlight: 'یکی از قدیمی‌ترین مدارس بریتانیایی عمان با پردیس اختصاصی، مرکز مرحله ششم و مسیر کامل برنامه ملی بریتانیا.', fees: 'حدود ۴٬۲۴۰ تا ۱۰٬۲۸۰ ریال عمان در سال' },
      { name: 'Cheltenham Muscat', curriculum: 'بریتانیایی / IGCSE و A-Levels', location: 'الموج مسقط', locality: 'مسقط', ages: 'KG1 تا پایه ۱۲', highlight: 'مدرسه‌ای با برنامه بریتانیایی در مجتمع ساحلی الموج که میان خانواده‌های ساکن غرب مسقط محبوب است.', fees: 'حدود ۳٬۸۹۹ تا ۸٬۱۱۱ ریال عمان در سال' },
      { name: 'The American British Academy (ABA)', curriculum: 'IB / آمریکایی', location: 'الغبره، مسقط', locality: 'مسقط', ages: 'پیش‌دبستان تا پایه ۱۲', highlight: 'مدرسه بین‌المللی جاافتاده که برنامه IB را با ساختاری به سبک آمریکایی ارائه می‌دهد و جامعه‌ای متنوع از مهاجران را گرد هم می‌آورد.', fees: 'حدود ۳٬۷۹۰ تا ۱۰٬۲۱۰ ریال عمان در سال' },
      { name: 'Downe House Muscat', curriculum: 'بریتانیایی (کمبریج)، دخترانه', location: 'البندر، غرب مسقط', locality: 'مسقط', ages: 'پایه ۱ تا پایه ۱۲', highlight: 'پردیس عمانِ یک مدرسه دخترانه بریتانیایی برجسته با پردیسی مدرن و مسیرهای Cambridge IGCSE و A-Level.', fees: 'حدود ۳٬۴۷۰ تا ۷٬۵۰۰ ریال عمان در سال' },
    ],
  },
  fees: {
    eyebrow: 'شهریه',
    title: 'شهریه تحصیلی تقریبی',
    intro:
      'هزینه مدرسه بین‌المللی در عمان معمولاً ترکیبی است از هزینه‌های یک‌بارِ تقاضا و ثبت‌نام و شهریه سالانه که با مرحله تحصیلی بالا می‌رود. ارقام زیر بازه‌های راهنما برای مدارس ممتاز و میان‌رده مسقط در دوره ۲۰۲۵/۲۶ هستند.',
    components: [
      { label: 'هزینه تقاضا / ارزیابی', amount: '۵۰ تا ۲۰۰ ریال عمان', desc: 'یک‌بار و معمولاً غیرقابل‌بازگشت؛ هنگام تقاضا یا آزمون ورودی پرداخت می‌شود.' },
      { label: 'ودیعه ثبت‌نام / رزرو', amount: '۳۰۰+ ریال یا ۱۰ تا ۴۰٪', desc: 'پس از ارائه پذیرش، جایگاه را تثبیت می‌کند و معمولاً به شهریه ترم اول منظور می‌شود.' },
      { label: 'هزینه یک‌بارِ ورود / سرمایه‌ای', amount: '۲٬۷۰۰ تا ۳٬۵۰۰ ریال عمان', desc: 'برخی مدارس ممتاز هنگام ورود دریافت می‌کنند، اغلب با تخفیف برای خواهر و برادر. بسیاری از مدارس میان‌رده آن را ندارند.' },
      { label: 'ودیعه قابل‌بازگشت', amount: 'حدود ۱۰۰ ریال عمان', desc: 'برخی مدارس نگه می‌دارند و هنگام خروج با اطلاع به‌موقع و تسویه شهریه بازمی‌گردانند.' },
    ],
    columns: ['مرحله / پایه', 'شهریه سالانه تقریبی (ریال عمان)'],
    rows: [
      ['سال‌های نخستین (FS / KG)', '۳٬۰۰۰ تا ۵٬۴۰۰'],
      ['ابتدایی (سال‌های ۱ تا ۶)', '۵٬۰۰۰ تا ۶٬۰۰۰'],
      ['متوسطه اول (سال‌های ۷ تا ۹)', '۶٬۰۰۰ تا ۸٬۵۰۰'],
      ['IGCSE (سال‌های ۱۰ تا ۱۱)', '۶٬۸۰۰ تا ۹٬۲۰۰'],
      ['مرحله ششم / A-Levels (سال‌های ۱۲ تا ۱۳)', '۸٬۱۰۰ تا ۱۰٬۳۰۰'],
    ],
    disclaimer:
      'شهریه‌ها سالانه تغییر می‌کنند و همیشه باید مستقیماً با هر مدرسه تأیید شوند. ارقام نمایش‌داده‌شده تنها بازه‌های راهنما هستند.',
  },
  admissions: {
    eyebrow: 'پذیرش',
    title: 'فرآیند پذیرش',
    intro:
      'بیشتر مدارس بین‌المللی عمان مسیر پذیرش مشابهی دارند. جایگاه در پایه‌های پرطرفدار زود پر می‌شود، پس بهتر است پیش از تاریخ شروع موردنظر آغاز کنید. تیم ما می‌تواند فرآیند را از طرف شما پیش ببرد.',
    steps: [
      { title: 'استعلام', body: 'علاقه خود را ثبت کنید و سن فرزندان، برنامه فعلی و تاریخ شروع دلخواه را به اشتراک بگذارید.' },
      { title: 'بازدید از مدرسه', body: 'از پردیس بازدید کنید، با کادر آشنا شوید و فضای مدرسه را حضوری یا مجازی حس کنید.' },
      { title: 'درخواست', body: 'فرم آنلاین را همراه با مدارک و کارنامه‌های لازم ارسال کنید.' },
      { title: 'ارزیابی', body: 'کودکان آزمونی متناسب با سن یا آزمون توانایی می‌دهند، به‌ویژه از پایه‌های بالاتر ابتدایی.' },
      { title: 'مصاحبه', body: 'دیداری کوتاه با کودک و خانواده، گاه همراه با معرفی‌نامه از مدرسه قبلی.' },
      { title: 'پذیرش', body: 'مدرسه پذیرش رسمی جایگاه را همراه با جدول شهریه و تاریخ شروع صادر می‌کند.' },
      { title: 'ثبت‌نام', body: 'پذیرش را بپذیرید، هزینه ثبت‌نام یا ودیعه را بپردازید و ثبت‌نام را برای تثبیت جایگاه کامل کنید.' },
    ],
    docsTitle: 'مدارکی که معمولاً نیاز دارید',
    docs: ['گذرنامه و کارت اقامت کودک', 'کارنامه‌های اخیر مدرسه', 'شناسنامه / گواهی تولد', 'گواهی انتقال از مدرسه قبلی', 'سوابق واکسیناسیون', 'عکس‌های اندازه گذرنامه', 'گذرنامه و کارت اقامت هر دو والد', 'هرگونه نتیجه آزمون یا ارزیابی'],
  },
  relocation: {
    eyebrow: 'فراتر از کلاس درس',
    title: 'خدمات اسکان خانواده',
    intro:
      'انتخاب مدرسه بخشی از یک مهاجرت بزرگ‌تر است. Irfan Investment از خانواده‌ها از ابتدا تا انتها پشتیبانی می‌کند تا مدرسه، خانه، کسب‌وکار و اقامت همگی در یک برنامه زمانی کنار هم بیایند.',
    services: [
      { title: 'انتخاب مدرسه', body: 'فهرستی متناسب و معرفی‌ها، هماهنگ با فرزندان، برنامه آموزشی و منطقه شما.' },
      { title: 'جست‌وجوی ملک', body: 'خانه برای خرید یا اجاره در محله‌های خانواده‌پسند نزدیک مدرسه منتخب شما.' },
      { title: 'راه‌اندازی کسب‌وکار', body: 'ثبت شرکت و اخذ مجوز در عمان با امکان مالکیت کامل خارجی.' },
      { title: 'اقامت', body: 'مسیرهای اقامت سرمایه‌گذار و خانواده، هماهنگ با ملک یا کسب‌وکار شما.' },
      { title: 'حساب بانکی', body: 'کمک برای افتتاح حساب‌های شخصی و شرکتی در بانک‌های عمان.' },
      { title: 'ویزا', body: 'راهنمایی درباره ویزای خانواده و کارت‌های اقامتی که مدارس برای ثبت‌نام لازم دارند.' },
      { title: 'پشتیبانی جابه‌جایی', body: 'کمک عملی در امور لجستیک انتقال خانوار شما به مسقط.' },
      { title: 'اسکان', body: 'دانش محلی درباره محله‌ها، خدمات درمانی و زندگی روزمره تا سریع مستقر شوید.' },
    ],
    links: [
      { label: 'خرید ملک در عمان', to: '/buy' },
      { label: 'ثبت شرکت', to: '/invest' },
      { label: 'سرمایه‌گذاری و بانکداری', to: '/investment' },
      { label: 'بلاگ و راهنماها', to: '/insights' },
    ],
  },
  faq: {
    eyebrow: 'پرسش‌ها',
    title: 'پرسش‌های پرتکرار',
    items: [
      { q: 'بهترین مدارس بین‌المللی مسقط کدام‌اند؟', a: 'مسقط گزینه‌های گسترده‌ای از مدارس بین‌المللی معتبر دارد، از جمله The British School Muscat، American British Academy، Cheltenham Muscat و Downe House Muscat، در کنار مدارس تازه‌تری مانند Jabal Al Ma’rifa. بهترین انتخاب به سن فرزندان، برنامه موردنظر و محل سکونت شما بستگی دارد و دقیقاً همین جاست که مشاوران ما به سنجش کمک می‌کنند.' },
      { q: 'مدارس بین‌المللی عمان چه برنامه‌هایی ارائه می‌دهند؟', a: 'برنامه بریتانیایی (Cambridge IGCSE و A-Levels) بیش از همه ارائه می‌شود و پس از آن بکالوریای بین‌المللی و برنامه‌های آمریکایی قرار دارند. همه مدارس دارای مجوز نیز در کنار برنامه اصلی، عربی، تعلیمات اسلامی و مطالعات اجتماعی عمان را تدریس می‌کنند.' },
      { q: 'هزینه مدرسه بین‌المللی در عمان چقدر است؟', a: 'شهریه سالانه معمولاً از حدود ۳٬۰۰۰ ریال عمان در سال‌های نخستین تا حدود ۱۰٬۰۰۰ ریال در مرحله ششمِ مدارس ممتاز است و مدارس میان‌رده به‌وضوح ارزان‌ترند. بیشتر مدارس هزینه‌های یک‌بار تقاضا و ثبت‌نام نیز دریافت می‌کنند. همیشه ارقام روز را با مدرسه تأیید کنید.' },
      { q: 'آیا در مسقط مدارس با برنامه بریتانیایی وجود دارد؟', a: 'بله. برنامه بریتانیایی رایج‌ترین گزینه بین‌المللی در مسقط است و چند مدرسه برنامه ملی کامل بریتانیا را از طریق Cambridge IGCSE و A-Levels ارائه می‌دهند.' },
      { q: 'آیا برنامه کمبریج در عمان موجود است؟', a: 'بله. کمبریج (CAIE) پرکاربردترین مرجع آزمون در عمان برای IGCSE و A-Levels است و در بسیاری از مدارس با برنامه بریتانیایی در مسقط و فراتر از آن ارائه می‌شود.' },
      { q: 'سال تحصیلی در عمان چه زمانی آغاز می‌شود؟', a: 'مدارس بین‌المللی سالی سه‌ترمه را بر اساس تقویم بریتانیایی دنبال می‌کنند؛ ترم پاییز در اواخر اوت یا اوایل سپتامبر آغاز و سال تحصیلی حدود اواخر ژوئن پایان می‌یابد.' },
      { q: 'آیا فرزندان من برای ثبت‌نام به ویزای اقامت نیاز دارند؟', a: 'مدارس معمولاً می‌توانند درخواست را پیش از نهایی‌شدن اقامت آغاز کنند، اما کارت اقامت عمان طبق مقررات وزارت آموزش معمولاً پیش از شروع کودک لازم است. ما اقامت را با برنامه زمانی مدرسه شما هماهنگ می‌کنیم.' },
      { q: 'چه‌قدر زودتر باید درخواست دهیم؟', a: 'پایه‌های پرطرفدار زود پر می‌شوند، پس توصیه می‌کنیم چند ماه پیش از شروع موردنظر درخواست دهید و برای نقاط ورود مانند آغاز ابتدایی یا مرحله ششم حتی زودتر.' },
      { q: 'کدام مناطق مسقط برای خانواده‌های دارای فرزند در سن مدرسه بهترند؟', a: 'مناطق خانواده‌پسند شامل الموج، مدینة السلطان قابوس، القرم، شاطئ القرم، العذیبه و بوشر هستند که هر کدام در دسترس چند مدرسه بین‌المللی قرار دارند. ما جست‌وجوی خانه شما را با مدرسه منتخب و مسیر رفت‌وآمد هماهنگ می‌کنیم.' },
      { q: 'آیا Irfan Investment می‌تواند در انتخاب مدرسه و مهاجرت کمک کند؟', a: 'بله. ما به خانواده‌های مهاجر کمک می‌کنیم فهرست مدارس را بسازند و با آن‌ها تماس بگیرند، سپس خانه، کسب‌وکار، بانک و اقامت را در یک برنامه زمانی گرد هم می‌آوریم تا کل مهاجرت در یک جا مدیریت شود.' },
      { q: 'آیا مدارس بین‌المللی عمان به انگلیسی تدریس می‌کنند؟', a: 'بله. مدارس بین‌المللی عمدتاً به انگلیسی تدریس می‌کنند و در کنار آن طبق الزام وزارت آموزش، عربی و تعلیمات اسلامی نیز ارائه می‌دهند. بسیاری از مدارس از کودکانی که تازه با انگلیسی آشنا می‌شوند پشتیبانی می‌کنند.' },
    ],
  },
  cta: {
    eyebrow: 'شروع کنید',
    title: 'رزرو مشاوره تحصیلی',
    subtitle: 'درباره خانواده و برنامه زمانی خود به ما بگویید. مشاور فهرستی متناسب از مدارس و برنامه‌ای روشن برای مهاجرت، سرمایه‌گذاری و اسکان در عمان ارائه می‌دهد.',
  },
}

const dict = { en, ru, ar, fa }

export default dict
