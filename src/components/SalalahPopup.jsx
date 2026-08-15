import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useI18n } from '../i18n.jsx'
import { localizePath, stripLang } from '../lib/localize.js'
import { submitForm } from '../supabase.js'
import { DIAL_CODES, DEFAULT_DIAL } from '../data/dialCodes.js'
import { galleryFor } from '../projectGallery.js'
import { isPaidVisit } from '../lib/attribution.js'

/**
 * SalalahPopup — THE single site-wide lead popup (Muscat / Oman-focused).
 *
 * (Filename kept for import stability; content is now Muscat/Oman, switched
 * from Salalah 2026-07-23 to chase the higher-volume "buy apartment in
 * Muscat" / "buy property in Oman" demand.) One popup model across the
 * whole site. Same lead pipeline (first/last name + phone → `submit-form`
 * edge fn → Supabase `leads` + Google Sheet + GA4 `generate_lead`):
 *  - mounted once in App.jsx; auto-opens on the landing page and /buy,
 *    re-opens after 45s until a lead is submitted (session flag);
 *  - a purple "Investment plan" launcher pill (bottom-left, every page)
 *    toggles it;
 *  - opens via the `irfan:open-salalah-popup` window event (name kept so the
 *    Buy-page banner keeps working);
 *  - image panel (506px) cycles Muscat Bay (Zen Residences) + Al Mouj
 *    (Vistal) renders; top strip on mobile;
 *  - a successful lead routes to /buy (the full Oman list).
 */

const SLIDE_MS = 2600
const FIRST_MS = 5000
const REOPEN_MS = 45000
const DONE_KEY = 'irfan_popup_muscat_done'
export const OPEN_EVENT = 'irfan:open-salalah-popup'

// ── geo-currency ─────────────────────────────────────────────────────
// ⚠️ DO NOT name communities next to this price. It is the entry price of ONE
// development (Yenaier, OMR 54,600). Al Mouj starts at OMR 133,634 and
// Muscat Bay at OMR 138,000, so listing them beside a $12,500 deposit implied
// a deposit ~2.8x lower than reality. Same class of error as the "up to 8%
// yield" claim removed on 2026-07-26: a true number attached to the wrong thing.
// Cheapest available Muscat apartment: Yenaier, Sultan Haitham City
// from OMR 54,600 (10% down = OMR 5,460). OMR is pegged at 1 = $2.6008,
// AED (3.6725/$) and SAR (3.75/$) are pegged to USD, so those three are
// stable. RUB floats — values are marked approximate; refresh ~quarterly
// (rate used: ~90 ₽/$). Visitor country comes from /api/geo (Vercel edge
// header). Everything except AE/SA/RU sees USD.
const GEO_CURRENCY = {
  OM: { price: 'OMR 54,600', down: 'OMR 5,460' },
  AE: { price: 'AED 521,000', down: 'AED 52,100' },
  SA: { price: 'SAR 532,000', down: 'SAR 53,200' },
  RU: { price: '≈13 млн RUB', down: '≈1,3 млн RUB' },
}
const DEFAULT_CURRENCY = { price: '$142,000 USD', down: '$14,200 USD' }

const PURPLE = '#351D93'
const TEAL = '#0E8E85'
const TITLE_FONT = '"Arsenal SC", "Peyda", "Inter", sans-serif'
const BODY_FONT = '"Inter", "Peyda", sans-serif'
const FIELD_TEXT = { fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 16, letterSpacing: '0.615px', color: '#222' }
const TOGGLE_ICON = '/images/popup/toggle-icon.svg'

const PLACEHOLDER_CSS = `
.salalah-popup-field::placeholder { color: #b5aeae; letter-spacing: 0.615px; opacity: 1; }
`

const flagUrl = (iso) => `https://flagcdn.com/w40/${iso}.png`

const STRINGS = {
  en: {
    badge: 'Muscat & Oman · Freehold Release',
    title: 'Own a Freehold Apartment in Muscat',
    subBold: 'Start with only {DOWN} down payment (10%)',
    sub2: ' and own an apartment in Muscat. Full freehold title for all nationalities, with investor residency included.',
    chips: ['From {PRICE}', 'No tax on rental income', 'Only 10% down payment', 'Freehold + residency visa'],
    urgency: 'Muscat freehold apartments at these prices are limited. Leave your details and get the full Muscat & Oman price list + payment plan within 10 minutes.',
    firstName: 'First name',
    lastName: 'Last name',
    yourNumber: 'Your number',
    cta: 'Get the Muscat Price List',
    sending: 'Sending…',
    launcher: 'Investment plan',
    invalid: 'Please enter a valid phone number',
    failed: 'Something went wrong — please try again.',
  },
  ru: {
    badge: 'Маскат и Оман · Фрихолд',
    title: 'Своя квартира в Маскате во фрихолд',
    subBold: 'Первый взнос от {DOWN} (10%)',
    sub2: ', и вы владеете квартирой в Маскате. Полный фрихолд для всех национальностей, с визой резидента.',
    chips: ['От {PRICE}', 'Без налога на доход от аренды', 'Первый взнос всего 10%', 'Фрихолд + виза резидента'],
    urgency: 'Квартиры во фрихолд в Маскате по таким ценам ограничены. Оставьте контакты — пришлём полный прайс-лист по Маскату и Оману и план оплаты в течение 10 минут.',
    firstName: 'Имя',
    lastName: 'Фамилия',
    yourNumber: 'Ваш номер',
    cta: 'Получить прайс-лист Маската',
    sending: 'Отправка…',
    launcher: 'Инвестиционный план',
    invalid: 'Введите корректный номер телефона',
    failed: 'Что-то пошло не так — попробуйте ещё раз.',
  },
  ar: {
    badge: 'مسقط وعُمان · تملّك حر',
    title: 'تملّك شقة في مسقط بتملّك حر',
    subBold: 'ابدأ بدفعة أولى {DOWN} فقط (10%)',
    sub2: ' وتملّك شقة في مسقط. تملّك حر كامل لجميع الجنسيات مع إقامة المستثمر.',
    chips: ['من {PRICE}', 'بدون ضريبة على دخل الإيجار', 'دفعة أولى 10% فقط', 'تملّك حر + إقامة'],
    urgency: 'شقق التملّك الحر في مسقط بهذه الأسعار محدودة. اترك بياناتك واحصل على قائمة أسعار مسقط وعُمان كاملة وخطة الدفع خلال 10 دقائق.',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    yourNumber: 'رقمك',
    cta: 'احصل على قائمة أسعار مسقط',
    sending: 'جارٍ الإرسال…',
    launcher: 'الخطة الاستثمارية',
    invalid: 'يرجى إدخال رقم هاتف صحيح',
    failed: 'حدث خطأ — يرجى المحاولة مرة أخرى.',
  },
  fa: {
    badge: 'مسقط و عمان · فروش فری‌هولد',
    title: 'در مسقط صاحب آپارتمان فری‌هولد شوید',
    subBold: 'با پیش‌پرداخت فقط {DOWN} (۱۰٪)',
    sub2: ' در مسقط صاحب آپارتمان شوید. مالکیت کامل برای همه ملیت‌ها همراه با اقامت سرمایه‌گذار.',
    chips: ['از {PRICE}', 'بدون مالیات بر درآمد اجاره', 'فقط ۱۰٪ پیش‌پرداخت', 'فری‌هولد + ویزای اقامت'],
    urgency: 'آپارتمان‌های فری‌هولد مسقط با این قیمت‌ها محدود است. مشخصات خود را بگذارید تا لیست کامل قیمت مسقط و عمان و طرح پرداخت را تا ۱۰ دقیقه دیگر دریافت کنید.',
    firstName: 'نام',
    lastName: 'نام خانوادگی',
    yourNumber: 'شماره شما',
    cta: 'دریافت لیست قیمت مسقط',
    sending: 'در حال ارسال…',
    launcher: 'پلن سرمایه‌گذاری',
    invalid: 'لطفاً یک شماره تلفن معتبر وارد کنید',
    failed: 'مشکلی پیش آمد؛ دوباره تلاش کنید.',
  },
}

function useLeadForm({ lang, t, onDone }) {
  const [sel, setSel] = useState(DEFAULT_DIAL)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e?.preventDefault?.()
    const digits = phone.replace(/[^0-9]/g, '')
    if (digits.length < 6) { setError(t.invalid); return }
    setError('')
    setSending(true)
    try {
      await submitForm({
        source: 'popup_muscat',
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim() || undefined,
        phone: `${sel.code} ${digits}`,
        phone_country_code: sel.code,
        country: sel.label,
        language: lang,
        message: 'Muscat popup — Muscat/Oman apartment price list + payment plan request',
      })
      onDone()
    } catch {
      setError(t.failed)
    } finally {
      setSending(false)
    }
  }

  return { sel, setSel, firstName, setFirstName, lastName, setLastName, phone, setPhone, sending, error, submit }
}

export default function SalalahPopup() {
  const { lang } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const t = STRINGS[lang] || STRINGS.en
  const rtl = lang === 'fa' || lang === 'ar'
  const logical = stripLang(pathname)
  // Pages where the popup auto-opens (launcher works everywhere).
  // NOT on ad clicks: / and /buy are both Google Ads landing pages, and an
  // interstitial covering the page on arrival costs Quality Score (which costs
  // CPC) and trips the mobile intrusive-interstitial signal on the same pages
  // we rank organically. Organic visitors still get it; the launcher button
  // stays for everyone, so nobody loses the offer, they just have to ask.
  const onAutoOpenPage = (logical === '/' || logical === '/buy') && !isPaidVisit()

  // Muscat visuals: Muscat Bay (Zen Residences) + Al Mouj (Vistal) renders.
  const slides = [...galleryFor('zen-residences'), ...galleryFor('vistal').slice(0, 3)]

  const [open, setOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [dialOpen, setDialOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, maxHeight: 236 })
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)

  // Resolve visitor country once → local currency (AE/SA/RU), USD otherwise.
  // On dev (no /api/geo) or any failure it silently stays USD.
  useEffect(() => {
    let cancelled = false
    fetch('/api/geo')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.country && GEO_CURRENCY[d.country]) setCurrency(GEO_CURRENCY[d.country])
      })
      .catch(() => { /* keep USD */ })
    return () => { cancelled = true }
  }, [])

  // Fill {PRICE}/{DOWN} placeholders with the visitor's currency.
  const fill = (s) => String(s || '').replace('{PRICE}', currency.price).replace('{DOWN}', currency.down)

  const overlayRef = useRef(null)
  const cardRef = useRef(null)
  const closeIconRef = useRef(null)
  const launcherIconRef = useRef(null)
  const dialBtnRef = useRef(null)
  const timerRef = useRef(null)
  const doneRef = useRef(false)

  const isDone = () => {
    try { return doneRef.current || sessionStorage.getItem(DONE_KEY) === '1' } catch { return doneRef.current }
  }

  const animateClose = useCallback((after) => {
    const overlay = overlayRef.current
    const card = cardRef.current
    if (!overlay || !card) { after?.(); return }
    gsap.to(card, { autoAlpha: 0, y: 28, scale: 0.97, duration: 0.32, ease: 'power2.in' })
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.32,
      delay: 0.06,
      ease: 'power2.in',
      onComplete: () => { gsap.set(overlay, { display: 'none' }); after?.() },
    })
  }, [])

  const close = useCallback(() => {
    setDialOpen(false)
    animateClose(() => {
      setOpen(false)
      clearTimeout(timerRef.current)
      const p = stripLang(window.location.pathname)
      if (!isDone() && (p === '/' || p === '/buy')) {
        timerRef.current = setTimeout(() => setOpen(true), REOPEN_MS)
      }
    })
  }, [animateClose])

  // Auto-open ~5s after arriving on the landing page or /buy
  // (once per session until a lead is submitted).
  useEffect(() => {
    if (!onAutoOpenPage || isDone()) return
    timerRef.current = setTimeout(() => setOpen(true), FIRST_MS)
    return () => clearTimeout(timerRef.current)
  }, [onAutoOpenPage])

  // The Salalah banner (and anything else) can open it via a window event.
  // Explicit opens always work, even after a submitted lead.
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    const overlay = overlayRef.current
    const card = cardRef.current
    if (!overlay || !card) return
    if (open) {
      clearTimeout(timerRef.current)
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 44, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', delay: 0.05 },
      )
      gsap.to([closeIconRef.current, launcherIconRef.current].filter(Boolean), { rotate: 45, duration: 0.45, ease: 'power3.out' })
    } else if (launcherIconRef.current) {
      gsap.to(launcherIconRef.current, { rotate: 0, duration: 0.35, ease: 'power3.out' })
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!dialOpen) return
    const onDown = (e) => { if (!e.target.closest?.('[data-salalah-dial]')) setDialOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [dialOpen])

  useEffect(() => {
    if (!open || slides.length < 2) return
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), SLIDE_MS)
    return () => clearInterval(id)
  }, [open, slides.length])

  // Lock page scroll while open (Lenis + native overflow).
  useEffect(() => {
    if (!open) return
    const lenis = typeof window !== 'undefined' ? window.__lenis : null
    lenis?.stop?.()
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
      lenis?.start?.()
    }
  }, [open])

  const handleDone = useCallback(() => {
    doneRef.current = true
    try { sessionStorage.setItem(DONE_KEY, '1') } catch { /* private mode */ }
    clearTimeout(timerRef.current)
    setOpen(false)
    if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' })
    navigate(localizePath('/buy', lang))
  }, [lang, navigate])

  const form = useLeadForm({ lang, t, onDone: handleDone })

  const toggleDial = () => {
    if (!dialOpen && dialBtnRef.current) {
      const r = dialBtnRef.current.getBoundingClientRect()
      const below = window.innerHeight - r.bottom - 16
      setDropPos({
        top: r.bottom + 6,
        left: Math.max(8, Math.min(r.left, window.innerWidth - 288)),
        maxHeight: Math.max(180, Math.min(300, below)),
      })
    }
    setDialOpen((v) => !v)
  }

  return (
    <>
      <style>{PLACEHOLDER_CSS}</style>

      {/* ── site-wide launcher pill (inherited from LeadPopup) ── */}
      <button
        type="button"
        aria-label={t.launcher}
        onClick={() => (open ? close() : setOpen(true))}
        className="fixed bottom-10 left-10 z-40 flex items-center gap-3 rounded-full py-3 pl-3 pr-5 text-sm font-medium text-white shadow-lg transition-colors hover:brightness-110"
        style={{
          backgroundColor: PURPLE,
          fontFamily: TITLE_FONT,
          letterSpacing: '0.4px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset',
        }}
      >
        <span ref={launcherIconRef} className="inline-flex items-center justify-center leading-none" style={{ width: 20, height: 20 }}>
          <img src={TOGGLE_ICON} alt="" aria-hidden="true" style={{ width: 20, height: 20, display: 'block' }} />
        </span>
        <span className="inline-flex items-center leading-none">{t.launcher}</span>
      </button>

      <div
        ref={overlayRef}
        onMouseDown={(e) => { if (e.target === overlayRef.current) close() }}
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: 16,
        }}
      >
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          className="flex w-full max-w-[1126px] flex-col overflow-hidden md:min-h-[430px] md:flex-row"
          style={{ borderRadius: 25, background: '#000', maxHeight: '92vh' }}
        >
          {/* mobile image strip — the bigger-visual promise holds on phones too */}
          {slides.length > 0 && (
            <div className="relative block h-[185px] w-full shrink-0 overflow-hidden md:hidden">
              <img src={slides[slide % slides.length]} alt="Freehold apartments in Muscat, Oman" className="h-full w-full object-cover" />
              <span
                className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase text-white"
                style={{ background: TEAL, fontFamily: TITLE_FONT, letterSpacing: '0.6px' }}
              >
                {t.badge}
              </span>
            </div>
          )}

          {/* content panel */}
          <div
            dir={rtl ? 'rtl' : 'ltr'}
            data-lenis-prevent
            className="relative flex-1 overflow-x-hidden overflow-y-auto px-6 py-7 sm:px-10 sm:py-8"
            style={{ background: '#000', overscrollBehavior: 'contain' }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute top-5 z-10 opacity-80 transition-opacity hover:opacity-100"
              style={rtl ? { right: 22 } : { left: 22 }}
            >
              <span ref={closeIconRef} className="block" style={{ width: 16, height: 16 }}>
                <img src={TOGGLE_ICON} alt="" aria-hidden="true" style={{ width: 16, height: 16, display: 'block' }} />
              </span>
            </button>

            <div className="relative z-[1] mt-6">
              {/* badge (desktop) */}
              <span
                className="hidden rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase text-white md:inline-block"
                style={{ background: TEAL, fontFamily: TITLE_FONT, letterSpacing: '0.8px' }}
              >
                {t.badge}
              </span>

              <h2
                className="text-white md:mt-4"
                style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1.22 }}
              >
                {t.title}
              </h2>
              <p
                className="text-white/85"
                style={{ fontFamily: BODY_FONT, fontSize: 'clamp(13.5px, 1.5vw, 16px)', lineHeight: 1.6, marginTop: 6 }}
              >
                <strong style={{ color: '#fff', fontWeight: 700 }}>{fill(t.subBold)}</strong>
                {t.sub2}
              </p>

              {/* offer chips — the psychological core: concrete numbers first */}
              <div className="mt-4 grid grid-cols-2 gap-2" style={{ maxWidth: 560 }}>
                {t.chips.map((c, i) => (
                  <div
                    key={c}
                    className="rounded-[8px] px-3 py-2.5 text-white"
                    style={{
                      background: i === 0 ? 'rgba(14,142,133,0.28)' : 'rgba(255,255,255,0.07)',
                      border: `1px solid ${i === 0 ? 'rgba(20,184,166,0.55)' : 'rgba(255,255,255,0.12)'}`,
                      fontFamily: TITLE_FONT,
                      fontWeight: 700,
                      fontSize: 'clamp(13px, 1.4vw, 15.5px)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {fill(c)}
                  </div>
                ))}
              </div>

              <p
                className="text-white/80"
                style={{ fontFamily: BODY_FONT, fontSize: 'clamp(12.5px, 1.4vw, 14.5px)', lineHeight: 1.6, marginTop: 14, marginBottom: 12, maxWidth: 560 }}
              >
                {t.urgency}
              </p>

              <form onSubmit={form.submit} className="w-full max-w-[560px]">
                <div className="grid gap-2 sm:gap-[6px]" style={{ gridTemplateColumns: '261fr 284fr' }}>
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => form.setFirstName(e.target.value)}
                    placeholder={t.firstName}
                    className="salalah-popup-field h-[46px] w-full min-w-0 rounded-[5px] bg-white px-4 outline-none sm:h-[42px]"
                    style={FIELD_TEXT}
                  />
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => form.setLastName(e.target.value)}
                    placeholder={t.lastName}
                    className="salalah-popup-field h-[46px] w-full min-w-0 rounded-[5px] bg-white px-4 outline-none sm:h-[42px]"
                    style={FIELD_TEXT}
                  />
                </div>

                <div dir="ltr" className="mt-2 flex flex-col gap-2 sm:mt-[10px] sm:flex-row sm:gap-0 sm:rounded-[5px] sm:bg-white">
                  <div className="flex h-[46px] min-w-0 flex-1 rounded-[5px] bg-white sm:h-[42px]">
                    <button
                      ref={dialBtnRef}
                      data-salalah-dial
                      type="button"
                      onClick={toggleDial}
                      className="flex h-full shrink-0 items-center gap-2 pl-3.5 pr-2.5"
                      aria-label="Country code"
                      aria-expanded={dialOpen}
                      style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 15, color: '#6f6a6a', letterSpacing: '0.615px' }}
                    >
                      <img
                        src={flagUrl(form.sel.iso)}
                        alt={form.sel.label}
                        style={{ width: 24, height: 16, borderRadius: 2, objectFit: 'cover', flexShrink: 0, display: 'block' }}
                      />
                      <span style={{ whiteSpace: 'nowrap' }}>{form.sel.code}</span>
                      <svg
                        width="9"
                        height="6"
                        viewBox="0 0 12 8"
                        aria-hidden="true"
                        style={{ flexShrink: 0, transform: dialOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
                      >
                        <path fill="#6f6a6a" d="M6 8L0 0h12z" />
                      </svg>
                    </button>
                    <span aria-hidden="true" style={{ width: 1, background: '#d9d4d4', margin: '7px 0', flexShrink: 0 }} />
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => form.setPhone(e.target.value)}
                      placeholder={t.yourNumber}
                      className="salalah-popup-field min-w-0 flex-1 bg-transparent px-3 outline-none"
                      style={FIELD_TEXT}
                    />
                  </div>
                  <div className="rounded-[5px] bg-white p-[3px] sm:flex sm:shrink-0 sm:items-center sm:bg-transparent sm:p-0 sm:pr-[3px]">
                    <button
                      type="submit"
                      disabled={form.sending}
                      className="h-[40px] w-full rounded-[5px] px-4 uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:h-[36px] sm:w-[282px]"
                      style={{ background: PURPLE, fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 12, letterSpacing: '0.615px' }}
                    >
                      {form.sending ? t.sending : t.cta}
                    </button>
                  </div>
                </div>

                {dialOpen && createPortal(
                  <div
                    data-salalah-dial
                    data-lenis-prevent
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    className="fixed z-[80] w-[280px] overflow-y-auto rounded-[8px] bg-white shadow-xl"
                    style={{
                      top: dropPos.top,
                      left: dropPos.left,
                      maxHeight: dropPos.maxHeight,
                      border: '1px solid #e5e0e0',
                      overscrollBehavior: 'contain',
                    }}
                  >
                    {DIAL_CODES.map((cc, i) => (
                      <button
                        key={cc.iso + cc.code}
                        type="button"
                        onClick={() => { form.setSel(cc); setDialOpen(false) }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-black/5"
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 13,
                          color: '#222',
                          borderBottom: i === 5 ? '1px solid #eee9e9' : 'none',
                        }}
                      >
                        <img
                          src={flagUrl(cc.iso)}
                          alt=""
                          loading="lazy"
                          style={{ width: 24, height: 16, borderRadius: 2, objectFit: 'cover', flexShrink: 0, display: 'block' }}
                        />
                        <span className="font-semibold" style={{ minWidth: 44 }}>{cc.code}</span>
                        <span className="text-black/50 truncate">{cc.label}</span>
                      </button>
                    ))}
                  </div>,
                  document.body,
                )}
              </form>
              {form.error && (
                <p className="mt-2" style={{ color: '#ff8a8a', fontFamily: BODY_FONT, fontSize: 13 }}>{form.error}</p>
              )}
            </div>
          </div>

          {/* image panel — 10% larger than the old 460px layout */}
          {slides.length > 0 && (
            <div className="relative hidden w-[506px] shrink-0 overflow-hidden md:block">
              {slides.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="Freehold apartments in Muscat, Oman"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === slide ? 1 : 0 }}
                  loading="lazy"
                />
              ))}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }}
              />
              <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center justify-between" style={{ width: 102 }}>
                {[{ d: -1, label: 'Previous image', path: 'M12.5 4L7 9.5L12.5 15' }, { d: 1, label: 'Next image', path: 'M7.5 4L13 9.5L7.5 15' }].map((b) => (
                  <button
                    key={b.d}
                    type="button"
                    aria-label={b.label}
                    onClick={() => setSlide((s) => (s + b.d + slides.length) % slides.length)}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px]"
                    style={{ background: 'rgba(171,163,163,0.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                  >
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
                      <path d={b.path} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
