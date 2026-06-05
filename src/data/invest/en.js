// ─────────────────────────────────────────────────────────────────────────
// invest/en.js: English content for the /invest page (canonical structure).
// ru.js and ar.js mirror this exact shape; only human-readable strings are
// translated. Non-translatable values are kept identical across languages:
//   • law `ref` (e.g. "Royal Decree 50/2019")
//   • entity `code`, `theme`, `featured`, `price` (e.g. "OMR 1,599")
//   • tax `rate`, whyInvest `stat`
// Figures verified against current (2025–2026) Omani regulations.
// ─────────────────────────────────────────────────────────────────────────

export default {
  hero: {
    eyebrow: 'Company Registration & Investment in Oman',
    title: 'Set up your company and invest in Oman',
    subtitle:
      'End-to-end company formation, licensing, banking, residency and investment advisory, so international investors can establish, operate and grow in Oman with up to 100% foreign ownership.',
    cta: 'Talk to an advisor',
  },

  intro:
    'Oman has modernised its corporate and foreign-investment laws to become one of the most investor-friendly economies in the GCC. Foreign investors can own up to 100% of a company in most sectors, with no Omani partner required, no statutory minimum capital for an LLC, and remote registration through the Invest Easy portal. We guide you through every step: choosing the right legal structure, securing licenses, opening corporate bank accounts, arranging residency, and identifying high-yield real-estate and business opportunities.',

  whyOman: [
    { stat: '100%', label: 'Foreign ownership in most sectors' },
    { stat: 'No min.', label: 'Capital requirement for an LLC' },
    { stat: '15%', label: 'Flat corporate income tax rate' },
    { stat: 'Gateway', label: 'Strategic access to the GCC, East Africa & Asia' },
  ],

  headings: {
    legal: { eyebrow: 'Legal & regulatory framework', title: 'The laws that govern your setup' },
    legalNote:
      'Foreign investors can own 100% of companies in most sectors, subject to activity restrictions and licensing. A list of ~95 sovereignty-sensitive or reserved activities still requires special arrangements.',
    authorities: { eyebrow: "Who you'll deal with", title: 'Main government authorities' },
    ownership: { eyebrow: 'Current rules · 2026', title: 'Foreign ownership at a glance' },
    entities: { eyebrow: 'Choose your entity', title: 'Types of business entities in Oman' },
    entitiesIntro:
      'Four structures cover the vast majority of foreign-investor setups in Oman. Compare them below, then talk to an advisor to confirm the right fit for your activity and goals.',
    comparison: { eyebrow: 'Side by side', title: 'Compare the four entities' },
    recommended: { eyebrow: 'Quick guide', title: 'Recommended structure by business type' },
    process: { eyebrow: 'How it works', title: 'The registration process, step by step' },
    postReg: { eyebrow: 'After your CR', title: 'Post-registration requirements' },
    tax: { eyebrow: 'Tax & compliance', title: "What you'll pay, and when" },
    docs: { eyebrow: 'What to prepare', title: 'Documents required' },
    docsNote: 'Foreign documents usually require legalization / attestation before submission.',
    timeline: { eyebrow: 'How long it takes', title: 'Typical timeline' },
    activities: { eyebrow: 'Popular activities', title: 'Common 100%-foreign-owned activities' },
    maintain: { eyebrow: 'Stay compliant', title: 'Documents every company must maintain' },
    whyInvest: { eyebrow: 'The opportunity', title: 'Why foreign investors choose Oman' },
  },

  // Table column headers
  tableHeads: {
    law: 'Law', purpose: 'Purpose',
    item: 'Item', status: 'Status',
    businessType: 'Business type', recommended: 'Recommended structure',
    entity: 'Entity',
  },

  laws: [
    { law: 'Foreign Capital Investment Law', ref: 'Royal Decree 50/2019', purpose: 'Allows up to 100% foreign ownership in most sectors and grants equal treatment to local and foreign investors.' },
    { law: 'Commercial Companies Law', ref: 'Royal Decree 18/2019', purpose: 'Governs the formation, management, restructuring and liquidation of companies, plus corporate governance.' },
    { law: 'Commercial Registration Law', ref: '—', purpose: 'Governs the Commercial Registration (CR), every company’s legal identity.' },
    { law: 'Labour Law', ref: 'Royal Decree 53/2023', purpose: 'Employment, work permits and Omanisation requirements (replaced the 2003 law).' },
    { law: 'Income Tax Law', ref: 'Royal Decree 28/2009', purpose: 'Corporate income tax at a 15% standard rate.' },
    { law: 'VAT Law', ref: 'Royal Decree 121/2020', purpose: '5% Value Added Tax, in force since April 2021.' },
    { law: 'Personal Income Tax Law', ref: 'Royal Decree 56/2025 · NEW', purpose: 'A GCC first: 5% on personal income above OMR 42,000/year, effective 1 January 2028.' },
  ],

  authorities: [
    { name: 'Ministry of Commerce, Industry & Investment Promotion (MOCIIP)', fn: 'Company registration & Commercial Registration (CR)' },
    { name: 'Invest Oman', fn: 'Investment support & facilitation' },
    { name: 'Oman Tax Authority', fn: 'Corporate tax, VAT & tax-card registration' },
    { name: 'Ministry of Labour', fn: 'Labour approvals, work permits & Omanisation' },
    { name: 'Royal Oman Police (ROP)', fn: 'Investor & employee visas and residency' },
    { name: 'Municipality of Muscat', fn: 'Municipal / premises licenses' },
  ],

  ownershipRules: [
    { item: 'Foreign ownership', status: 'Up to 100% in most sectors' },
    { item: 'Local sponsor / partner', status: 'Not required in most activities' },
    { item: 'Minimum capital (LLC)', status: 'No statutory minimum' },
    { item: 'Foreign manager', status: 'Allowed' },
    { item: 'Foreign shareholder', status: 'Allowed' },
    { item: 'Remote registration', status: 'Available via the Invest Easy portal' },
    { item: 'Restricted activities', status: '~95 sovereignty-sensitive / reserved activities still apply' },
  ],

  entityLabels: { startingFrom: 'Starting from', keyFeatures: 'Key features', advantages: 'Advantages', idealFor: 'Ideal for' },

  entities: [
    {
      code: 'LLC', name: 'Limited Liability Company', tagline: 'The cornerstone of business in Oman',
      price: 'OMR 1,599', theme: 'olive', featured: true, badge: 'Most chosen',
      description: 'The most established and versatile entity in the Sultanate, granting up to 100% foreign ownership with full limited-liability protection. The default vehicle for companies that intend to trade, operate and scale on the Omani mainland.',
      features: ['Up to 100% foreign ownership in most sectors', 'Limited liability, personal assets protected', '1–50 shareholders', 'No statutory minimum capital', 'Unrestricted mainland trading', 'Full access to government tenders & contracts'],
      advantages: ['The structure banks and regulators know best', 'Eligible for investor residency visas', 'Straightforward corporate banking', 'Flexible ownership & profit distribution', 'Built for long-term growth'],
      idealFor: ['SMEs', 'Technology companies', 'Agencies', 'Consulting firms', 'Trading & import/export'],
      cta: 'Register an LLC',
    },
    {
      code: 'SPC', name: 'Single Person Company', tagline: 'Full ownership, full control',
      price: 'OMR 1,499', theme: 'gold',
      description: 'A limited-liability entity owned and controlled by a single shareholder, purpose-built for founders and professionals who want 100% ownership with no partners, while keeping the same legal protection as an LLC.',
      features: ['Single shareholder (individual or corporate)', 'Up to 100% foreign ownership', 'Limited liability protection', 'Complete management control', 'Separate legal personality', 'No statutory minimum capital'],
      advantages: ['100% ownership and decision-making power', 'Lean administration & faster setup', 'Eligible for corporate banking', 'Eligible for investor residency', 'Personal assets ring-fenced'],
      idealFor: ['Consultants', 'Freelancers', 'Coaches', 'Designers', 'Developers', 'Digital businesses'],
      cta: 'Set up an SPC',
    },
    {
      code: 'Branch', name: 'Branch Office', tagline: 'Your global brand, established in Oman',
      price: 'OMR 1,399', theme: 'slate',
      description: 'A direct extension of your foreign parent company, enabling immediate market entry under your existing brand and balance sheet: the natural route for executing local contracts and projects.',
      features: ['Extension of a foreign parent company', 'Operates under the parent’s name & reputation', 'Direct market entry, no new legal entity', 'Eligible to execute local contracts & projects', 'Centralised control from headquarters'],
      advantages: ['Fastest route to an Omani presence', 'Leverages established corporate reputation', 'Well-suited to government & project-based work', 'Seamless alignment with group operations'],
      idealFor: ['International corporations', 'Engineering firms', 'Contractors', 'Global service providers'],
      cta: 'Open a branch',
    },
    {
      code: 'Free Zone', name: 'Free Zone Company', tagline: 'Trade globally, operate tax-efficiently',
      price: 'OMR 1,299', theme: 'teal',
      description: 'An entity established within Oman’s free zones (Sohar, Salalah and Duqm) offering 100% foreign ownership, customs and tax incentives, and direct access to world-class ports and logistics corridors.',
      features: ['100% foreign ownership', 'Tax & customs incentives', 'Simplified licensing', 'Strategic access to ports & logistics hubs', 'Streamlined import/export operations'],
      advantages: ['Significant cost & duty savings', 'World-class logistics & port connectivity', 'Fast, simplified setup', 'Built for export-oriented trade'],
      idealFor: ['Manufacturing', 'Logistics', 'Warehousing', 'Import/export', 'International trade'],
      cta: 'Explore free zones',
    },
  ],

  comparison: {
    columns: ['Ownership', 'Liability', 'Shareholders', 'Investor Visa', 'Corporate Banking', 'Best Use Case'],
    rows: [
      { entity: 'LLC', cells: ['Up to 100%', 'Limited', '1–50', 'Eligible', 'Eligible', 'Mainland trading & SMEs'] },
      { entity: 'SPC', cells: ['Up to 100%', 'Limited', '1 (single)', 'Eligible', 'Eligible', 'Solo founders & professionals'] },
      { entity: 'Branch Office', cells: ['Parent-owned', 'Parent company', 'N/A', 'Case-by-case', 'Eligible', 'Foreign market entry & contracts'] },
      { entity: 'Free Zone', cells: ['100%', 'Limited', '1+', 'Eligible', 'Eligible', 'Export, logistics & manufacturing'] },
    ],
  },

  recommended: [
    { type: 'Consultant / Freelancer', structure: 'SPC' },
    { type: 'Marketing Agency', structure: 'SPC or LLC' },
    { type: 'Software Company', structure: 'LLC' },
    { type: 'AI & Technology Startup', structure: 'LLC' },
    { type: 'Import & Export Business', structure: 'LLC' },
    { type: 'Trading Company', structure: 'LLC' },
    { type: 'Manufacturing Business', structure: 'Free Zone Company or LLC' },
    { type: 'Foreign Corporate Expansion', structure: 'Branch Office' },
    { type: 'Large Investment Project', structure: 'SAOC' },
    { type: 'Public Investment Company', structure: 'SAOG' },
  ],

  steps: [
    { title: 'Select activity', body: 'Choose approved activities from the MOCIIP classification, e.g. software development, AI solutions, marketing, import/export, consultancy or data analytics.' },
    { title: 'Reserve trade name', body: 'Reserve a unique trade name (Arabic, or Arabic + English) that does not conflict with existing registrations.' },
    { title: 'Create an Invest Easy account', body: 'Register on the Invest Easy portal, which handles name reservation, incorporation, license issuance and manager registration.' },
    { title: 'Upload incorporation documents', body: 'Submit shareholder documents: passport/visa for individuals, or incorporation certificate, board resolution and AoA for corporate shareholders. Foreign documents usually require legalization.' },
    { title: 'Prepare constitutive documents', body: 'Draft the Memorandum of Association (MoA) and, where required, the Articles of Association (AoA).' },
    { title: 'Obtain activity approvals', body: 'Some sectors need extra approvals: education, tourism, healthcare, financial services and telecom each have a dedicated regulator.' },
    { title: 'Pay registration fees', body: 'Fees depend on the activity, legal structure, municipality and ownership.' },
    { title: 'Receive Commercial Registration (CR)', body: 'The CR is your company’s legal identity: name, registration number, activities and ownership. It is mandatory before operations begin.' },
  ],

  postReg: [
    { title: 'Tax registration', body: 'Register with the Oman Tax Authority. Corporate income tax is 15%; a tax card is typically required shortly after incorporation.' },
    { title: 'VAT registration', body: 'Mandatory once taxable turnover reaches OMR 38,500 (voluntary from OMR 19,250). VAT is charged at 5%.' },
    { title: 'Labour registration', body: 'Register with the Ministry of Labour before hiring staff or obtaining work permits.' },
    { title: 'Omanisation & Tawteen', body: 'Meet sector-based Omanisation targets. As of 2026, all companies must register on the Tawteen employment platform.' },
    { title: 'Municipality license', body: 'Office premises require municipal approval before full operation.' },
    { title: 'Corporate bank account', body: 'Open a corporate account with CR, MoA, UBO declaration, shareholder IDs and source-of-funds documentation (KYC/AML).' },
  ],

  tax: [
    { rate: '15%', title: 'Corporate Income Tax', body: 'Standard flat rate on company profits (Royal Decree 28/2009).' },
    { rate: '5%', title: 'Value Added Tax', body: 'On most goods & services; registration mandatory above OMR 38,500 turnover (Royal Decree 121/2020).' },
    { rate: '5%', title: 'Personal Income Tax, from 2028', body: 'A GCC first (Royal Decree 56/2025): 5% on personal income above OMR 42,000/year, effective 1 January 2028.' },
    { rate: '0%', title: 'Free Zone Incentives', body: 'Tax holidays and customs exemptions in the Sohar, Salalah and Duqm zones.' },
  ],

  docs: [
    { group: 'Individual investor', items: ['Passport copy', 'Passport photo', 'Address information', 'Contact details', 'Visa copy (if applicable)'] },
    { group: 'Corporate investor', items: ['Certificate of Incorporation', 'Shareholder Register', 'Board Resolution', 'Power of Attorney', 'Articles of Association', 'Passport copies of directors'] },
  ],

  timeline: [
    { process: 'Trade name reservation', time: '1–2 days' },
    { process: 'Incorporation review', time: '1–5 days' },
    { process: 'Sector approvals', time: '1–4 weeks' },
    { process: 'CR issuance', time: '1–3 days after approval' },
    { process: 'Corporate bank account', time: '1–4 weeks' },
  ],

  activities: [
    'Software Design & Development', 'Artificial Intelligence Solutions', 'Computer Systems Design',
    'Data Analytics Services', 'Marketing & Social Media', 'E-Commerce Solutions', 'Business Consultancy',
    'Import & Export of Technology Products', 'Cloud & API Development', 'Management Consultancy',
  ],

  maintain: [
    { group: 'Formation', items: ['Commercial Registration (CR)', 'Memorandum of Association (MoA)', 'Shareholder Register', 'Manager Appointment'] },
    { group: 'Compliance', items: ['UBO Register', 'Tax Registration Certificate', 'Labour Registration', 'Municipality License'] },
    { group: 'Operational', items: ['Lease Agreement', 'Accounting Records', 'Financial Statements', 'Corporate Resolutions'] },
  ],

  whyInvest: [
    { stat: '100%', title: 'Foreign Ownership', body: 'Own your company outright across most sectors, with no local partner required under the Foreign Capital Investment Law.' },
    { stat: '3', statSuffix: ' continents', title: 'Strategic Gateway', body: 'A natural hub linking the GCC, East Africa and Asia, with deep-water ports on the world’s busiest shipping routes.' },
    { stat: '15%', title: 'Competitive Tax Environment', body: 'A flat 15% corporate tax, 5% VAT, and free-zone incentives, among the most efficient regimes in the region.' },
    { stat: '2040', title: 'Stability & Vision', body: 'Decades of political stability, strong sovereign credit, and a long-term Vision 2040 diversification strategy.' },
    { stat: '2019', title: 'Modern Companies Law', body: 'A corporate framework aligned with international standards on governance, transparency and investor rights.' },
    { stat: '100%', statSuffix: ' online', title: 'Investor-Friendly Regulation', body: 'Remote registration via Invest Easy, streamlined licensing, and dedicated facilitation from Invest Oman.' },
  ],

  cta: {
    headline: 'Ready to Establish Your Business in Oman?',
    subheadline: 'Receive end-to-end support for company formation, licensing, banking, residency, and investment opportunities.',
    cta: 'Book a Consultation',
  },
}
