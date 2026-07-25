import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../i18n.jsx'
import { submitForm } from '../supabase'
import { slugify } from '../pages/BuyPage.jsx'
import { galleryFor } from '../projectGallery.js'
import { DIAL_CODES, DEFAULT_DIAL } from '../data/dialCodes.js'

/**
 * QuickInquiryModal — the SIMPLE, direct lead form for property inquiries.
 *
 * Drop-in replacement for the old SARA chat flow (ProjectInquiryModal) on the
 * /buy, /project and /property pages. Same props API ({ open, project, unit,
 * onClose }) and the SAME rich lead payload (unit context, source
 * `project_inquiry_<slug>[_unit]`) so the sales sheet keeps a complete brief —
 * but ALL fields are visible at once (first name, last name, phone) exactly
 * like the site-wide "Investment plan" popup, so visitors can enter their
 * details fast without a one-question-at-a-time conversation.
 *
 * The conversational AI agent now lives ONLY in the AI-assist chat widget.
 */

const PURPLE = '#351D93'
const TEAL = '#0E8E85'
const TITLE_FONT = '"Arsenal SC", "Peyda", "Inter", sans-serif'
const BODY_FONT = '"Inter", "Peyda", sans-serif'
const FIELD_TEXT = { fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 16, letterSpacing: '0.615px', color: '#222' }

// No entrance animation: the modal renders fully opaque and static. An
// earlier gsap tween froze mid-animation and a CSS keyframe kept restarting
// from opacity:0 (something re-applies styles each frame) — a static modal is
// bulletproof and always visible. A one-shot fade can be revisited later.
const PLACEHOLDER_CSS = `
.qim-field::placeholder { color: #b5aeae; letter-spacing: 0.615px; opacity: 1; }
`
const flagUrl = (iso) => `https://flagcdn.com/w40/${iso}.png`

const STRINGS = {
  en: {
    badge: 'Property Enquiry',
    titleUnit: 'Request price & floor plan',
    titleGeneral: 'Enquire about {project}',
    sub: 'Leave your details and our team will send you the price, floor plan and payment plan within 10 minutes.',
    firstName: 'First name', lastName: 'Last name', yourNumber: 'Your number',
    cta: 'Get the details', sending: 'Sending…',
    successTitle: 'Thank you!', successBody: 'Our team will contact you shortly with the full details.',
    invalid: 'Please enter a valid phone number', failed: 'Something went wrong — please try again.',
    from: 'From', ref: 'Ref',
  },
  ar: {
    badge: 'استفسار عقاري',
    titleUnit: 'اطلب السعر والمخطط',
    titleGeneral: 'استفسر عن {project}',
    sub: 'اترك بياناتك وسيرسل لك فريقنا السعر والمخطط وخطة الدفع خلال 10 دقائق.',
    firstName: 'الاسم الأول', lastName: 'اسم العائلة', yourNumber: 'رقمك',
    cta: 'احصل على التفاصيل', sending: 'جارٍ الإرسال…',
    successTitle: 'شكراً لك!', successBody: 'سيتواصل معك فريقنا قريباً بكل التفاصيل.',
    invalid: 'يرجى إدخال رقم هاتف صحيح', failed: 'حدث خطأ — يرجى المحاولة مرة أخرى.',
    from: 'من', ref: 'مرجع',
  },
  fa: {
    badge: 'استعلام ملک',
    titleUnit: 'دریافت قیمت و نقشه',
    titleGeneral: 'استعلام درباره {project}',
    sub: 'مشخصات خود را بگذارید تا تیم ما قیمت، نقشه و طرح پرداخت را تا ۱۰ دقیقه دیگر برایتان بفرستد.',
    firstName: 'نام', lastName: 'نام خانوادگی', yourNumber: 'شماره شما',
    cta: 'دریافت اطلاعات', sending: 'در حال ارسال…',
    successTitle: 'سپاسگزاریم!', successBody: 'تیم ما به‌زودی با اطلاعات کامل با شما تماس می‌گیرد.',
    invalid: 'لطفاً یک شماره تلفن معتبر وارد کنید', failed: 'مشکلی پیش آمد؛ دوباره تلاش کنید.',
    from: 'از', ref: 'کد',
  },
  ru: {
    badge: 'Запрос по недвижимости',
    titleUnit: 'Запросить цену и планировку',
    titleGeneral: 'Запрос по {project}',
    sub: 'Оставьте контакты — команда пришлёт цену, планировку и план оплаты в течение 10 минут.',
    firstName: 'Имя', lastName: 'Фамилия', yourNumber: 'Ваш номер',
    cta: 'Получить детали', sending: 'Отправка…',
    successTitle: 'Спасибо!', successBody: 'Наша команда скоро свяжется с вами со всеми деталями.',
    invalid: 'Введите корректный номер телефона', failed: 'Что-то пошло не так — попробуйте ещё раз.',
    from: 'от', ref: 'Ref',
  },
}

const fmtOmr = (n) => (n > 0 ? `OMR ${Number(n).toLocaleString()}` : null)

export default function QuickInquiryModal({ open, project, unit, onClose }) {
  const { lang } = useI18n()
  const t = STRINGS[lang] || STRINGS.en
  const rtl = lang === 'fa' || lang === 'ar'
  const hasUnit = !!unit

  const overlayRef = useRef(null)
  const cardRef = useRef(null)
  const dialBtnRef = useRef(null)

  const [sel, setSel] = useState(DEFAULT_DIAL)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [dialOpen, setDialOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, maxHeight: 236 })

  const slides = useMemo(
    () => (project?.name ? galleryFor(slugify(project.name)) : []),
    [project?.name],
  )

  // Reset whenever opened / target changes.
  useEffect(() => {
    if (!open) return
    setFirstName(''); setLastName(''); setPhone(''); setSel(DEFAULT_DIAL)
    setSending(false); setDone(false); setError(''); setDialOpen(false)
  }, [open, project?.id, unit?.id])

  // Scroll lock while open (entrance is pure CSS — see PLACEHOLDER_CSS).
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

  // ESC to close.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Close the dial dropdown on outside click.
  useEffect(() => {
    if (!dialOpen) return
    const onDown = (e) => { if (!e.target.closest?.('[data-qim-dial]')) setDialOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [dialOpen])

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

  const submit = async (e) => {
    e?.preventDefault?.()
    const digits = phone.replace(/[^0-9]/g, '')
    if (digits.length < 6) { setError(t.invalid); return }
    setError(''); setSending(true)
    try {
      const slug = (project?.name || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
      const messageParts = hasUnit
        ? [
            unit.floor_label && `Floor: ${unit.floor_label}`,
            `Type: ${unit.layout_type || unit.unit_type}`,
            unit.bedrooms != null && `Bedrooms: ${unit.bedrooms}`,
            unit.view && `View: ${unit.view}`,
            unit.total_area_sqm && `Total area: ${Math.round(unit.total_area_sqm)} m²`,
            unit.price_omr && `Unit price: OMR ${Number(unit.price_omr).toLocaleString()}`,
          ]
        : [`General enquiry — ${project?.name || ''}`]
      const unitBudget = hasUnit && unit?.price_omr != null ? `OMR ${Number(unit.price_omr).toLocaleString()}` : null

      await submitForm({
        source: `project_inquiry_${slug}${hasUnit ? '_unit' : ''}`,
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim() || undefined,
        phone: `${sel.code} ${digits}`,
        phone_country_code: sel.code,
        country: sel.label,
        property_interest: hasUnit ? unit.unit_type : null,
        budget: unitBudget || undefined,
        message: messageParts.filter(Boolean).join(' · '),
        language: lang,
        extra: {
          project_id: project?.id ?? null,
          project_name: project?.name ?? null,
          developer: project?.developer?.name ?? null,
          unit_id: unit?.id ?? null,
          unit_layout: unit?.layout_type ?? null,
          unit_floor: unit?.floor_label ?? null,
          unit_view: unit?.view ?? null,
          unit_bedrooms: unit?.bedrooms ?? null,
          unit_total_area_sqm: unit?.total_area_sqm ?? null,
          unit_price_omr: unit?.price_omr ?? null,
          purpose: hasUnit ? 'Residential home' : null,
          bedrooms: hasUnit && unit?.bedrooms != null ? String(unit.bedrooms) : null,
          budget: unitBudget,
        },
      })
      setDone(true)
    } catch {
      setError(t.failed)
    } finally {
      setSending(false)
    }
  }

  if (!open || !project) return null

  const title = hasUnit ? t.titleUnit : t.titleGeneral.replace('{project}', project.name)
  const summary = hasUnit
    ? [unit.layout_type || unit.unit_type, unit.bedrooms != null && `${unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} BR`}`, fmtOmr(unit.price_omr)]
        .filter(Boolean).join('  ·  ')
    : null

  return createPortal(
    <>
      <style>{PLACEHOLDER_CSS}</style>
      <div
        ref={overlayRef}
        className="qim-overlay"
        onMouseDown={(e) => { if (e.target === overlayRef.current) onClose() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1500,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          padding: 16,
        }}
      >
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          className="qim-card flex w-full max-w-[980px] flex-col overflow-hidden md:min-h-[420px] md:flex-row"
          style={{ borderRadius: 22, background: '#000', maxHeight: '92vh' }}
        >
          {/* mobile image strip */}
          {slides.length > 0 && (
            <div className="relative block h-[150px] w-full shrink-0 overflow-hidden md:hidden">
              <img src={slides[0]} alt={project.name} className="h-full w-full object-cover" />
            </div>
          )}

          {/* content panel */}
          <div
            dir={rtl ? 'rtl' : 'ltr'}
            data-lenis-prevent
            className="relative flex-1 overflow-x-hidden overflow-y-auto px-6 py-7 sm:px-9 sm:py-8"
            style={{ background: '#000', overscrollBehavior: 'contain' }}
          >
            <button
              type="button" aria-label="Close" onClick={onClose}
              className="absolute top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              style={rtl ? { left: 16 } : { right: 16 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
            </button>

            {done ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center" style={{ gap: 14 }}>
                <div style={{ color: TEAL }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" /><path d="M7 12.5l3.2 3.2L17 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 className="text-white" style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 24 }}>{t.successTitle}</h3>
                <p className="text-white/70" style={{ fontFamily: BODY_FONT, fontSize: 14.5, maxWidth: 360 }}>{t.successBody}</p>
              </div>
            ) : (
              <div className="mt-4">
                <span className="inline-block rounded-full px-3 py-1.5 text-[11.5px] font-bold uppercase text-white" style={{ background: TEAL, fontFamily: TITLE_FONT, letterSpacing: '0.7px' }}>
                  {t.badge}
                </span>

                <h2 className="text-white md:mt-3.5" style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 'clamp(21px, 2.6vw, 29px)', lineHeight: 1.22, marginTop: 12 }}>
                  {title}
                </h2>

                {/* what they're enquiring about */}
                <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-white/85" style={{ fontFamily: BODY_FONT, fontSize: 14 }}>
                  <span style={{ color: TEAL, fontWeight: 700 }}>{project.name}</span>
                  {summary && <span className="text-white/45">|</span>}
                  {summary && <span>{summary}</span>}
                  {hasUnit && <span className="text-white/40" style={{ fontSize: 12 }}>· {t.ref} IRF-{unit.id}</span>}
                </div>

                <p className="text-white/75" style={{ fontFamily: BODY_FONT, fontSize: 'clamp(13px, 1.4vw, 14.5px)', lineHeight: 1.6, marginTop: 14, marginBottom: 14, maxWidth: 520 }}>
                  {t.sub}
                </p>

                <form onSubmit={submit} className="w-full max-w-[520px]">
                  <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <input type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t.firstName}
                      className="qim-field h-[46px] w-full min-w-0 rounded-[6px] bg-white px-4 outline-none" style={FIELD_TEXT} />
                    <input type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t.lastName}
                      className="qim-field h-[46px] w-full min-w-0 rounded-[6px] bg-white px-4 outline-none" style={FIELD_TEXT} />
                  </div>

                  <div dir="ltr" className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-2">
                    <div className="flex h-[46px] min-w-0 flex-1 rounded-[6px] bg-white">
                      <button ref={dialBtnRef} data-qim-dial type="button" onClick={toggleDial} aria-label="Country code" aria-expanded={dialOpen}
                        className="flex h-full shrink-0 items-center gap-2 pl-3.5 pr-2.5"
                        style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 15, color: '#6f6a6a', letterSpacing: '0.615px' }}>
                        <img src={flagUrl(sel.iso)} alt={sel.label} style={{ width: 24, height: 16, borderRadius: 2, objectFit: 'cover', flexShrink: 0, display: 'block' }} />
                        <span style={{ whiteSpace: 'nowrap' }}>{sel.code}</span>
                        <svg width="9" height="6" viewBox="0 0 12 8" aria-hidden="true" style={{ flexShrink: 0, transform: dialOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path fill="#6f6a6a" d="M6 8L0 0h12z" /></svg>
                      </button>
                      <span aria-hidden="true" style={{ width: 1, background: '#d9d4d4', margin: '7px 0', flexShrink: 0 }} />
                      <input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.yourNumber}
                        className="qim-field min-w-0 flex-1 bg-transparent px-3 outline-none" style={FIELD_TEXT} />
                    </div>
                    <button type="submit" disabled={sending}
                      className="h-[46px] shrink-0 rounded-[6px] px-6 uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-[220px]"
                      style={{ background: PURPLE, fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 13, letterSpacing: '0.615px' }}>
                      {sending ? t.sending : t.cta}
                    </button>
                  </div>

                  {dialOpen && createPortal(
                    <div data-qim-dial data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}
                      className="fixed z-[1600] w-[280px] overflow-y-auto rounded-[8px] bg-white shadow-xl"
                      style={{ top: dropPos.top, left: dropPos.left, maxHeight: dropPos.maxHeight, border: '1px solid #e5e0e0', overscrollBehavior: 'contain' }}>
                      {DIAL_CODES.map((cc, i) => (
                        <button key={cc.iso + cc.code} type="button" onClick={() => { setSel(cc); setDialOpen(false) }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-black/5"
                          style={{ fontFamily: BODY_FONT, fontSize: 13, color: '#222', borderBottom: i === 5 ? '1px solid #eee9e9' : 'none' }}>
                          <img src={flagUrl(cc.iso)} alt="" loading="lazy" style={{ width: 24, height: 16, borderRadius: 2, objectFit: 'cover', flexShrink: 0, display: 'block' }} />
                          <span className="font-semibold" style={{ minWidth: 44 }}>{cc.code}</span>
                          <span className="text-black/50 truncate">{cc.label}</span>
                        </button>
                      ))}
                    </div>,
                    document.body,
                  )}
                </form>
                {error && <p className="mt-2" style={{ color: '#ff8a8a', fontFamily: BODY_FONT, fontSize: 13 }}>{error}</p>}
              </div>
            )}
          </div>

          {/* image panel (desktop) */}
          {slides.length > 0 && (
            <div className="relative hidden w-[420px] shrink-0 overflow-hidden md:block">
              <img src={slides[0]} alt={project.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  )
}
