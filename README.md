# Whitewill — Real Estate Experts

A multilingual (EN / RU / AR with RTL) real-estate landing page built from Figma designs.

**Live:** https://fullapp-omega.vercel.app

## Stack

- **React 18 + Vite 6** — fast dev server, ESM build
- **MUI v9 Material** — design system + dark theme
- **Supabase** — Postgres (`properties`, `developers`, `areas`, `leads`) + Edge Function `submit-form`
- **i18n** — three locales with locale switcher, RTL support for Arabic

## Sections (all from the Figma reference)

- Hero — `team_bg`, real-estate-experts title, animated circular award badge
- Lead cards — Sell / Rent CTAs with property-type dialog
- Signature catalogs — horizontal carousel + iridescent magazine cover
- Awards row — TOP-10 best agencies
- Featured properties — live from Supabase (50 rows)
- Customer reviews — rating + read-full-review dialog
- Feedback form — star rating + write-in
- Whitewill projects — 3-card grid
- Office gallery, Partner platform, Offices map
- Sticky **expert popup** (broker avatar + WhatsApp / Telegram / phone)
- Cookie banner, language switcher

## Forms → Supabase + Google Sheets

Every form (Sell, Rent, Feedback, Partner) POSTs to the `submit-form` Edge Function:

```
Form → POST /functions/v1/submit-form
            ├─→ INSERT INTO public.leads
            └─→ forward to Google Apps Script → Google Sheet row
```

See [`scripts/README.md`](./scripts/README.md) for the Google Apps Script setup.

## Local dev

```bash
cp .env.example .env.local         # then put your Supabase URL + publishable key
npm install
npm run dev                        # http://localhost:5173
```

## Production build

```bash
npm run build      # → dist/
npm run preview    # serve dist/ locally
```

## Deploy

The project is wired to Vercel (`amirs-projects-0502e067/fullapp`):

```bash
vercel --prod
```

Required Vercel env vars (already set in project):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Repository layout

```
public/
  hero/              ← Figma assets used in the hero & expert popup
  catalogs/          ← signature-catalog images + magazine cover
src/
  App.jsx
  main.jsx
  theme.js           ← MUI dark theme
  i18n.jsx           ← en / ru / ar dictionary + provider
  supabase.js        ← client + `submitForm()` + `fetchProperties()`
  assets.js          ← shared image URLs
  components/
    Header.jsx
    HeroSection.jsx
    LeadCards.jsx
    CatalogCarousel.jsx
    AwardsRow.jsx
    Properties.jsx
    Testimonials.jsx
    FeedbackForm.jsx
    Projects.jsx
    OfficeGallery.jsx
    PartnerBanner.jsx
    Offices.jsx
    SiteFooter.jsx
    CookieBanner.jsx
    ExpertPopup.jsx
scripts/
  google-apps-script.gs  ← Google Sheet ingest script
  README.md              ← setup instructions
```
