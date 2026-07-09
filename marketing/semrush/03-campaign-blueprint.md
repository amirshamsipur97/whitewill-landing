# IrfanInvest — Google Ads Campaign Blueprint v1 (data-grounded)
Built from Semrush AE-database sweeps on 2026-07-02 (see 02-keyword-data-ae.md).

## Reality check (vs the generic "8 campaign groups" plan)
Total UAE search demand for Oman-property English keywords is ~1–2K/mo, not
tens of thousands. That is GOOD for us: KD 5–22, CPC $0.3–1.2, competitive
density 0.74, and whitewill.pro (the biggest brand-alike) has ZERO visibility.
Strategy = capture 100% of a small high-intent pool cheaply, in 3 languages,
instead of fighting portals for volume that doesn't exist.

## Account structure — 4 campaigns (not 8; volumes can't feed 8)

### C1 — Search EN "Oman Property & Investment" (geo: UAE; later +UK)
Landing: / and /projects/* | daily budget suggestion: AED 60–80
- AG1 Buy Property Oman: oman property, property for sale in oman, buying
  property in oman, oman property price, property developers in oman
  (phrase match) — CPC ~$0.8–1.2
- AG2 Oman Real Estate: oman real estate, real estate companies in oman,
  oman real estate market (phrase)
- AG3 Freehold & Residency-by-Property: oman freehold property, freehold
  property oman, oman property visa, oman residence visa property,
  oman residence permit (phrase+broad, low vol → broad ok with negatives)
- AG4 Muscat Inventory: al mouj apartments for sale, al mouj muscat
  apartments for sale, muscat hills apartments for sale, apartments in muscat,
  oman villa for sale, muscat villas (exact+phrase)
- AG5 Invest in Oman: oman investment, investment opportunities in oman,
  foreign investment in oman, how to invest money in oman (phrase; watch CPC
  $3.7 on "oman investment" — cap bids)

### C2 — Search FA «اقامت و سرمایه‌گذاری عمان» (geo: UAE; consider TR/OM/GE later)
Landing: /invest («ثبت شرکت»), /investment, / (fa) | budget: AED 40–60
- AG1 ثبت شرکت: ثبت شرکت در عمان، هزینه ثبت شرکت در عمان، ثبت شرکت عمان،
  ثبت شرکت در عمان برای ایرانیان (broad — tiny volumes need reach)
- AG2 اقامت: اقامت عمان، شرایط اقامت عمان، اخذ اقامت عمان، اقامت در عمان
  برای ایرانیان، اقامت از طریق خرید ملک عمان
- AG3 خرید ملک: خرید ملک در عمان، خرید آپارتمان مسقط، سرمایه گذاری ملکی
  عمان (no Semrush data — validate in Keyword Planner at launch)
NOTE: language targeting = Persian; Google Ads cannot serve inside Iran.

### C3 — Search AR «الإقامة والاستثمار في سلطنة عمان» (geo: UAE+SA+KW+QA)
Landing: / (ar) | budget: AED 30–40
- AG1 اقامة المستثمر: اقامة مستثمر في سلطنة عمان، الاقامة الدائمة في سلطنة
  عمان، كيفية الحصول على الإقامة في سلطنة عمان، الاقامة العقارية في سلطنة عمان
- AG2 شراء عقار: شراء عقار في عمان، عقارات للبيع في مسقط (validate in KP)

### C4 — Competitor/Location EN (geo: UAE) — SMALL, exact-only
al mouj, al mouj muscat, the wave muscat, property finder oman, muriya oman,
hawana salalah property. Do NOT use their brand names in ad copy (trademark
policy) — copy sells "Compare all Muscat waterfront projects".

## Negative keywords (account-level, from the sweeps)
rent, rental, for rent, hotel, hotel apartment, jobs, salary, visa on arrival,
tourist visa, visit visa, e visa, transit, flight, air, airline, currency,
cricket, football, weather, water park, aqua park, restaurant, salalah trip,
musandam tour, medical residency, intellectual property, insurance,
"oman visa for uae residents" (exact), khasab, airbnb, booking
(Rent terms go negative in C1/C4; can become their own remarketing campaign later.)

## RSA seed copy
### EN (AG1/AG3)
H: Buy Freehold Property in Oman · Muscat Waterfront Apartments · Oman
Investor Residency Visa · From AED 550K — Own in Oman · 100% Foreign
Ownership · Al Mouj & Muscat Bay Inventory · Off-Plan & Ready Units ·
Free Investment Consultation
D: Freehold ownership + renewable investor residency for you and your family.
Compare Muscat's top projects with a licensed advisor — payment plans from
developers. / Buy property in Oman with full legal support in English, Arabic
& Persian. Book a free call today.
### FA
H: اقامت عمان با خرید ملک · ثبت شرکت در عمان برای ایرانیان · مشاوره رایگان
سرمایه‌گذاری · مالکیت ۱۰۰٪ خارجی · پروژه‌های ساحلی مسقط · اقساط مستقیم از
سازنده · اقامت قابل تمدید خانوادگی
D: با خرید ملک فری‌هولد در عمان، اقامت سرمایه‌گذاری برای خودتان و خانواده
بگیرید. مشاوره فارسی، پشتیبانی حقوقی کامل. / ثبت شرکت و افتتاح حساب بانکی در
عمان با تیم فارسی‌زبان ایرفان اینوست. همین امروز مشاوره رایگان رزرو کنید.
(بدون خط تیره بلند در کپی — قانون پروژه)
### AR
H: تملك حر في سلطنة عمان · إقامة المستثمر عبر شراء عقار · شقق الموج مسقط ·
استشارة استثمارية مجانية · تملك أجنبي 100٪
D: اشترِ عقاراً في عمان واحصل على إقامة متجددة لك ولعائلتك. دعم قانوني كامل
واستشارة مجانية بالعربية.

## Landing gaps to fix BEFORE launch (conversion blockers)
1. EN/AR "Oman residency by property" dedicated landing does not exist —
   the fa-only advisory pages can't serve C1-AG3/C3-AG1 traffic.
2. UTM discipline: all final URLs get ?utm_source=google&utm_medium=cpc&
   utm_campaign={campaign}&utm_term={keyword} — leads table already captures
   source via submit-form edge fn.
3. LeadPopup is the primary conversion action — wire GA4 event → Google Ads
   conversion import before spending.

## Measurement loop (already mostly built)
Google Ads → GA4 (G-*) → Supabase leads (+ Sheet) → n8n Vapi auto-call.
Weekly: export Search Terms report → Claude reviews → new negatives + bid caps.

## Open items
- [ ] Validate fa/ar zero-volume terms in Google Keyword Planner (inside Ads UI)
- [ ] Decide on UK geo for C1 (global "buy property in oman" = UK 40/mo top country)
- [ ] Advertising Toolkit trial/purchase? ($99/mo) — unlocks competitor ad copy
- [ ] Build EN residency landing page
- [ ] Link GA4 conversions to Google Ads
