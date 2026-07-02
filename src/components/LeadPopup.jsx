import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useI18n } from '../i18n.jsx'
import { localizePath, stripLang } from '../lib/localize.js'
import { submitForm } from '../supabase.js'
import { DIAL_CODES, DEFAULT_DIAL } from '../data/dialCodes.js'

/**
 * LeadPopup — Google-Ads lead-capture popup + site-wide purple launcher.
 * Figma: card node 630-20014 (variant "3"), toggle icon node 629-19952.
 *
 * - The purple launcher pill (same size as the chat pill, bottom-left) is
 *   mounted on EVERY page and toggles the popup; its icon rotates 45° while
 *   the popup is open.
 * - The popup auto-opens 3s after arriving on the LANDING page only, and
 *   re-opens every 20s after being dismissed — until a lead is submitted
 *   (sessionStorage flag), then never again for the session.
 * - While open: page dimmed 20% + blurred, page scroll locked (Lenis paused).
 * - Submit: first/last name + phone → shared `submit-form` pipeline
 *   (Supabase `leads` + Google Sheet + GA4 `generate_lead` + optional Ads
 *   conversion) → redirect to /buy.
 */

// ── config ───────────────────────────────────────────────────────────
const SLIDES = ['/images/popup/slide-1.jpg', '/images/popup/slide-2.jpg', '/images/popup/slide-3.jpg']
const TOGGLE_ICON = '/images/popup/toggle-icon.svg'
const SLIDE_MS = 2000
const FIRST_MS = 3000
const REOPEN_MS = 20000
const DONE_KEY = 'irfan_popup_lead_done'

const PURPLE = '#351D93'
const TITLE_FONT = '"Arsenal SC", "Peyda", "Inter", sans-serif'
const BODY_FONT = '"Inter", "Peyda", sans-serif'

// Figma field text: Arsenal SC Bold 16, tracking 0.615.
const FIELD_TEXT = { fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 16, letterSpacing: '0.615px', color: '#222' }

// Figma placeholders: #b5aeae — uppercase on the phone field, capitalized on names.
const PLACEHOLDER_CSS = `
.lead-popup-field::placeholder { color: #b5aeae; letter-spacing: 0.615px; opacity: 1; }
.lead-popup-field--upper::placeholder { text-transform: uppercase; }
.lead-popup-field--cap::placeholder { text-transform: capitalize; }
`

const flagUrl = (iso) => `https://flagcdn.com/w40/${iso}.png`

const STRINGS = {
  en: {
    title: 'Start Your Property Investment in Oman',
    body1: 'Secure your investment with ',
    bodyBold: 'only a 20% down payment',
    body2: " (from $28,000 USD) and access some of Oman's most promising residential and investment opportunities.",
    prompt: 'Enter your phone number to begin investing in Oman',
    firstName: 'First name',
    lastName: 'Last name',
    yourNumber: 'Your number',
    cta: 'Get Your Investment Plan',
    sending: 'Sending…',
    launcher: 'Investment plan',
    invalid: 'Please enter a valid phone number',
    failed: 'Something went wrong — please try again.',
  },
  ru: {
    title: 'Начните инвестировать в недвижимость Омана',
    body1: 'Оформите инвестицию ',
    bodyBold: 'с первым взносом всего 20%',
    body2: ' (от $28 000 USD) и получите доступ к самым перспективным жилым и инвестиционным проектам Омана.',
    prompt: 'Введите номер телефона, чтобы начать инвестировать',
    firstName: 'Имя',
    lastName: 'Фамилия',
    yourNumber: 'Ваш номер',
    cta: 'Получить инвестиционный план',
    sending: 'Отправка…',
    launcher: 'Инвестиционный план',
    invalid: 'Введите корректный номер телефона',
    failed: 'Что-то пошло не так — попробуйте ещё раз.',
  },
  ar: {
    title: 'ابدأ استثمارك العقاري في عُمان',
    body1: 'أمّن استثمارك ',
    bodyBold: 'بدفعة أولى 20% فقط',
    body2: ' (ابتداءً من 28,000 دولار) واحصل على أفضل الفرص السكنية والاستثمارية في عُمان.',
    prompt: 'أدخل رقم هاتفك لبدء الاستثمار في عُمان',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    yourNumber: 'رقمك',
    cta: 'احصل على خطتك الاستثمارية',
    sending: 'جارٍ الإرسال…',
    launcher: 'الخطة الاستثمارية',
    invalid: 'يرجى إدخال رقم هاتف صحيح',
    failed: 'حدث خطأ — يرجى المحاولة مرة أخرى.',
  },
  fa: {
    title: 'سرمایه‌گذاری ملکی خود را در عمان شروع کنید',
    body1: 'سرمایه‌گذاری خود را ',
    bodyBold: 'فقط با ۲۰٪ پیش‌پرداخت',
    body2: ' (از ۲۸,۰۰۰ دلار) آغاز کنید و به بهترین فرصت‌های مسکونی و سرمایه‌گذاری عمان دسترسی پیدا کنید.',
    prompt: 'برای شروع سرمایه‌گذاری در عمان شماره تلفن خود را وارد کنید',
    firstName: 'نام',
    lastName: 'نام خانوادگی',
    yourNumber: 'شماره شما',
    cta: 'دریافت پلن سرمایه‌گذاری',
    sending: 'در حال ارسال…',
    launcher: 'پلن سرمایه‌گذاری',
    invalid: 'لطفاً یک شماره تلفن معتبر وارد کنید',
    failed: 'مشکلی پیش آمد — دوباره تلاش کنید.',
  },
}

// ── lead-capture state (kept in one hook so the JSX stays readable) ──
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
        source: 'popup_investment',
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim() || undefined,
        phone: `${sel.code} ${digits}`,
        phone_country_code: sel.code,
        country: sel.label,
        language: lang,
        message: 'Landing lead popup — investment plan request',
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

export default function LeadPopup() {
  const { lang } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const t = STRINGS[lang] || STRINGS.en
  const rtl = lang === 'fa' || lang === 'ar'
  const isLanding = stripLang(pathname) === '/'

  const [open, setOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [dialOpen, setDialOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, maxHeight: 236 })

  const overlayRef = useRef(null)
  const cardRef = useRef(null)
  const launcherIconRef = useRef(null)
  const closeIconRef = useRef(null)
  const dialBtnRef = useRef(null)
  const timerRef = useRef(null)
  const doneRef = useRef(false)

  const isDone = () => {
    try { return doneRef.current || sessionStorage.getItem(DONE_KEY) === '1' } catch { return doneRef.current }
  }

  // ── open / close (GSAP, soft fades — no bounce) ────────────────────
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
      // Re-open only while the visitor is still on the landing page.
      if (!isDone() && stripLang(window.location.pathname) === '/') {
        timerRef.current = setTimeout(() => setOpen(true), REOPEN_MS)
      }
    })
  }, [animateClose])

  // First auto-open: 3s after arriving on the landing page.
  useEffect(() => {
    if (!isLanding || isDone()) return
    timerRef.current = setTimeout(() => setOpen(true), FIRST_MS)
    return () => clearTimeout(timerRef.current)
  }, [isLanding])

  // Opening animation + launcher/close icon 45° rotation.
  useEffect(() => {
    const overlay = overlayRef.current
    const card = cardRef.current
    if (!overlay || !card) return
    const icons = [launcherIconRef.current, closeIconRef.current].filter(Boolean)
    if (open) {
      clearTimeout(timerRef.current)
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 44, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', delay: 0.05 },
      )
      gsap.to(icons, { rotate: 45, duration: 0.45, ease: 'power3.out' })
    } else {
      gsap.to(icons, { rotate: 0, duration: 0.45, ease: 'power3.out' })
    }
  }, [open])

  // Escape closes; clicking outside the dial list closes just the list.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!dialOpen) return
    const onDown = (e) => { if (!e.target.closest?.('[data-dial-part]')) setDialOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [dialOpen])

  // Image slider: advance every 2s while open.
  useEffect(() => {
    if (!open) return
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS)
    return () => clearInterval(id)
  }, [open])

  // Focus lock: pause Lenis + native overflow so wheel/touch gestures inside
  // the popup (and the dial list) never scroll the page behind the backdrop.
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

  // Successful lead: remember for the session, close instantly, go to /buy.
  const handleDone = useCallback(() => {
    doneRef.current = true
    try { sessionStorage.setItem(DONE_KEY, '1') } catch { /* private mode */ }
    clearTimeout(timerRef.current)
    setOpen(false)
    if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' })
    navigate(localizePath('/buy', lang))
  }, [lang, navigate])

  const form = useLeadForm({ lang, t, onDone: handleDone })

  // The dial list opens BELOW the field through a body portal — the
  // GSAP-transformed card would otherwise become its containing block and
  // clip it. Page scroll is locked while open, so fixed coords stay valid.
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

      {/* ── site-wide launcher pill — same metrics as the chat pill ── */}
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

      {/* ── overlay: 20% dark + blur ── */}
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
          background: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: 16,
        }}
      >
        {/* ── card (Figma: 1004×374, r25) ── */}
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          className="flex w-full max-w-[1004px] overflow-hidden md:min-h-[374px]"
          style={{ borderRadius: 25, background: '#000', maxHeight: '92vh' }}
        >
          {/* left / content panel — scrolls internally on short phone screens */}
          <div
            dir={rtl ? 'rtl' : 'ltr'}
            data-lenis-prevent
            className="relative flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-12 sm:py-8"
            style={{ background: '#000', overscrollBehavior: 'contain' }}
          >
            {/* decorative outline vector — Figma: top/bottom 4%, 527px, stretched */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2"
              style={{ top: '4%', bottom: '4%', width: 527 }}
            >
              <img src="/images/popup/vector.svg" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>

            {/* close — same Figma toggle icon, rotates 45° while open */}
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
              <h2
                className="text-white"
                style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 'clamp(22px, 3vw, 31px)', lineHeight: 1.25 }}
              >
                {t.title}
              </h2>
              <p
                className="text-white"
                style={{ fontFamily: BODY_FONT, fontSize: 'clamp(14px, 1.6vw, 18px)', lineHeight: '26px', fontWeight: 400, marginTop: 8 }}
              >
                {t.body1}
                <strong style={{ fontWeight: 700 }}>{t.bodyBold}</strong>
                {t.body2}
              </p>

              {/* Figma 630:20107 — Arsenal SC Bold 18 */}
              <p
                className="text-white"
                style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 'clamp(15px, 1.7vw, 18px)', marginTop: 16, marginBottom: 12 }}
              >
                {t.prompt}
              </p>

              <form onSubmit={form.submit} className="w-full max-w-[551px]">
                {/* first / last name — Figma: h42, r5, 6px gap */}
                <div className="grid gap-2 sm:gap-[6px]" style={{ gridTemplateColumns: '261fr 284fr' }}>
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => form.setFirstName(e.target.value)}
                    placeholder={t.firstName}
                    className="lead-popup-field lead-popup-field--cap h-[46px] w-full min-w-0 rounded-[5px] bg-white px-4 outline-none sm:h-[42px]"
                    style={FIELD_TEXT}
                  />
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => form.setLastName(e.target.value)}
                    placeholder={t.lastName}
                    className="lead-popup-field lead-popup-field--cap h-[46px] w-full min-w-0 rounded-[5px] bg-white px-4 outline-none sm:h-[42px]"
                    style={FIELD_TEXT}
                  />
                </div>

                {/* phone row — white bar h42 r5 with the purple CTA INSET
                    (h36, r5, 3px frame). Always LTR; on phones the CTA drops
                    to its own full-width framed row. */}
                <div dir="ltr" className="mt-2 flex flex-col gap-2 sm:mt-[10px] sm:flex-row sm:gap-0 sm:rounded-[5px] sm:bg-white">
                  <div className="flex h-[46px] min-w-0 flex-1 rounded-[5px] bg-white sm:h-[42px]">
                    <button
                      ref={dialBtnRef}
                      data-dial-part
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
                      className="lead-popup-field lead-popup-field--upper min-w-0 flex-1 bg-transparent px-3 outline-none"
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

                {/* dial dropdown — body portal, opens DOWNWARD and may spill
                    past the card; wheel/touch scroll stays inside the list */}
                {dialOpen && createPortal(
                  <div
                    data-dial-part
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
                          // thin divider after the GCC block (our primary market)
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

          {/* right / image slider (hidden on small screens) */}
          <div className="relative hidden w-[350px] shrink-0 overflow-hidden md:block">
            {SLIDES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Oman development"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                style={{ opacity: i === slide ? 1 : 0 }}
                loading="lazy"
              />
            ))}
            {/* prev / next — frosted squares, centred at the bottom (Figma) */}
            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center justify-between" style={{ width: 102 }}>
              {[{ d: -1, label: 'Previous image', path: 'M12.5 4L7 9.5L12.5 15' }, { d: 1, label: 'Next image', path: 'M7.5 4L13 9.5L7.5 15' }].map((b) => (
                <button
                  key={b.d}
                  type="button"
                  aria-label={b.label}
                  onClick={() => setSlide((s) => (s + b.d + SLIDES.length) % SLIDES.length)}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px]"
                  style={{ background: 'rgba(171,163,163,0.13)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                >
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
                    <path d={b.path} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
