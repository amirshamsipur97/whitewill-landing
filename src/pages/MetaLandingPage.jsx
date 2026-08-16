import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n.jsx'
import { submitForm } from '../supabase.js'
import { trackLead, trackQuizStart, trackContactClick } from '../analytics.js'
import { DIAL_CODES, DEFAULT_DIAL } from '../data/dialCodes.js'

/**
 * MetaLandingPage — /lp/oman
 *
 * Deliberately MINIMAL Meta-ads quiz funnel (v4, text-only on request):
 * hero -> nationality dropdown -> 3 one-question steps -> contact form.
 * No photos, banners or gallery copy at all. No site chrome (App.jsx hides
 * Header/Footer/launchers on /lp/*), not in seo.jsx ROUTES so SeoManager
 * emits noindex with a proper /lp/ title.
 *
 * Pixel funnel: PageView -> InitiateCheckout (first answer) -> Lead
 * (form submit) + Contact (WhatsApp tap). Answers ride in `message`
 * through the shared submit-form pipeline (Supabase leads + Sheet).
 */

const WHATSAPP_URL = 'https://wa.me/message/L22KC3L6RYINE1'
const PURPLE = '#351D93'
const GOLD = '#A09958'
const PAPER = '#f2f1ec'
const INK = '#232323'
const TITLE_FONT = '"Arsenal SC", "Peyda", "Inter", sans-serif'
const BODY_FONT = '"Inter", "Peyda", sans-serif'

// ── quiz steps (exact wording supplied by the client) ────────────────
// Step 0 is the nationality dropdown, then these three option steps.
const QUESTIONS = [
  { key: 'lifestyle', q: 'What type of property lifestyle are you looking for?', options: ['Affordable & Practical', 'Premium Living', 'Luxury Living', 'Ultra-Luxury Living'] },
  { key: 'purpose', q: 'What is your main purpose for buying?', options: ['Investment', 'Primary Residence', 'Second Home', 'Holiday Home'] },
  { key: 'property_type', q: 'What is your preferred property type?', options: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'] },
]

// Every country we already ship in the phone selector: GCC first (our
// market), then the rest of the world alphabetically. Reused so the two
// dropdowns can never drift apart.
const COUNTRIES = DIAL_CODES.map((d) => d.label)
const TOTAL_STEPS = 1 + QUESTIONS.length // nationality + option questions
const FORM_STEP = TOTAL_STEPS           // 4
const DONE_STEP = TOTAL_STEPS + 1       // 5

// ── shared css: CTA light sweep + chip pulse + slider fade ───────────
const LP_CSS = `
@keyframes lpShine {
  0%   { left: -70%; }
  55%  { left: 130%; }
  100% { left: 130%; }
}
.lp-cta { position: relative; overflow: hidden; }
.lp-cta::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0; left: -70%;
  width: 42%;
  background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.34) 50%, transparent 100%);
  transform: skewX(-18deg);
  animation: lpShine 2.6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes lpPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(0.72); opacity: 0.65; }
}
.lp-deal-dot { animation: lpPulse 1.4s ease-in-out infinite; }
@keyframes lpWaPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
  50%      { transform: scale(1.14); box-shadow: 0 12px 30px rgba(37,211,102,0.45); }
}
.lp-wa { animation: lpWaPulse 1.7s ease-in-out infinite; }
@keyframes lpFadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes lpFadeOut { to { opacity: 0; transform: translateY(-10px); } }
.lp-step { animation: lpFadeIn 0.38s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.lp-step--out { animation: lpFadeOut 0.22s ease both; }
`

function Cta({ children, onClick, style }) {
  return (
    <button
      className="lp-cta"
      onClick={onClick}
      style={{
        display: 'block', width: '100%', maxWidth: 420, margin: '0 auto',
        background: PURPLE, color: '#fff', border: 'none', borderRadius: 999,
        padding: '17px 28px', fontFamily: TITLE_FONT, fontWeight: 700,
        fontSize: 17, letterSpacing: 0.5, cursor: 'pointer', ...style,
      }}
    >
      {children}
    </button>
  )
}

function SectionTitle({ children, size = 'clamp(22px, 5vw, 34px)' }) {
  return (
    <h2 style={{
      fontFamily: TITLE_FONT, fontWeight: 700, fontSize: size,
      lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: 1,
      textAlign: 'center', margin: '0 0 22px', color: INK,
    }}>
      {children}
    </h2>
  )
}

/** Floating "Limited-Time Deal" chip — right-aligned (balances the Oman
 *  flag on the left) with a per-visitor evergreen countdown. First visit
 *  arms a deadline just under 23h from now, persisted in localStorage so
 *  refreshes keep ticking; when it hits zero it re-arms for the next day. */
const DEAL_KEY = 'lp_deal_deadline'

function armDeadline() {
  const end = Date.now() + 23 * 3600 * 1000 - 1000
  try { localStorage.setItem(DEAL_KEY, String(end)) } catch {}
  return end
}

function DealChip() {
  const [shown, setShown] = useState(true)
  const [left, setLeft] = useState(null)

  useEffect(() => {
    let end
    try { end = Number(localStorage.getItem(DEAL_KEY)) || 0 } catch { end = 0 }
    if (!end || end <= Date.now()) end = armDeadline()
    const tick = () => {
      let ms = end - Date.now()
      if (ms <= 0) { end = armDeadline(); ms = end - Date.now() }
      setLeft(ms)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!shown) return null
  const fmt = (ms) => {
    const t = Math.max(0, Math.floor(ms / 1000))
    const h = String(Math.floor(t / 3600)).padStart(2, '0')
    const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0')
    const sec = String(t % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }
  return (
    <div style={{ position: 'fixed', top: 14, right: 14, zIndex: 60, background: '#fff', borderRadius: 999, padding: '9px 12px 9px 12px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 28px rgba(0,0,0,0.45)' }}>
      <span className="lp-deal-dot" style={{ width: 11, height: 11, borderRadius: '50%', background: '#A0153E', display: 'inline-block' }} />
      <span style={{ fontFamily: BODY_FONT, fontWeight: 600, fontSize: 13.5, color: '#1b1b1b', whiteSpace: 'nowrap' }}>Limited-Time Deal</span>
      {left !== null && (
        <span style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 13.5, color: '#A0153E', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{fmt(left)}</span>
      )}
      <button onClick={() => setShown(false)} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: 15, lineHeight: 1, padding: '0 2px' }}>✕</button>
    </div>
  )
}

// ── quiz funnel: 5 one-question steps, then the contact form ─────────
function QuizFunnel({ lang }) {
  const [step, setStep] = useState(0) // 0 nationality, 1..3 questions, 4 form, 5 done
  const [answers, setAnswers] = useState({})
  const [nationality, setNationality] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [dial, setDial] = useState(DEFAULT_DIAL)
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [leaving, setLeaving] = useState(false)
  const startedRef = useRef(false)

  // Soft step change: play the 0.22s exit animation, then swap the step —
  // the incoming step plays the 0.38s enter animation. Pure CSS, no libs.
  const goTo = (next) => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => { setStep(next); setLeaving(false) }, 220)
  }

  const start = () => {
    if (!startedRef.current) { startedRef.current = true; trackQuizStart({ language: lang }) }
  }

  const pick = (key, value) => {
    if (leaving) return
    start()
    setAnswers((a) => ({ ...a, [key]: value }))
    goTo(step + 1)
  }

  const confirmNationality = () => {
    if (leaving) return
    if (!nationality) { setError('Please select your nationality'); return }
    setError('')
    start()
    goTo(1)
  }

  const submit = async (e) => {
    e.preventDefault()
    const digits = phone.replace(/[^0-9]/g, '')
    if (!fullName.trim()) { setError('Please enter your name'); return }
    if (digits.length < 6) { setError('Please enter a valid phone number'); return }
    setError('')
    setSending(true)
    try {
      const summary = [
        `nationality: ${nationality || 'n/a'}`,
        ...QUESTIONS.map((q) => `${q.key}: ${answers[q.key] || 'n/a'}`),
      ].join(', ')
      await submitForm({
        source: 'meta_lp',
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        phone: `${dial.code} ${digits}`,
        phone_country_code: dial.code,
        country: dial.label,
        language: lang,
        message: `Meta LP quiz - ${summary}`,
      })
      trackLead({ source: 'meta_lp', language: lang })
      goTo(DONE_STEP)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const field = {
    width: '100%', boxSizing: 'border-box', background: '#fff',
    border: '1px solid rgba(0,0,0,0.2)', borderRadius: 14, padding: '15px 16px', color: INK,
    fontFamily: BODY_FONT, fontSize: 16, outline: 'none',
  }

  const q = QUESTIONS[step - 1]

  const stepHead = (
    <>
      <p style={{ textAlign: 'center', color: GOLD, fontFamily: BODY_FONT, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 6px' }}>
        Question {step + 1} of {TOTAL_STEPS}
      </p>
      {/* progress bar */}
      <div style={{ maxWidth: 260, height: 3, margin: '0 auto 24px', background: 'rgba(0,0,0,0.12)', borderRadius: 2 }}>
        <div style={{ width: `${((step + 1) / (TOTAL_STEPS + 1)) * 100}%`, height: '100%', background: GOLD, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
    </>
  )

  return (
    <div id="quiz" style={{ maxWidth: 620, margin: '0 auto', padding: '0 18px', minHeight: 340 }}>
      {step === 0 && (
        <div className={`lp-step${leaving ? ' lp-step--out' : ''}`}>
          {stepHead}
          <SectionTitle>What is your nationality?</SectionTitle>
          <div style={{ display: 'grid', gap: 12, maxWidth: 460, margin: '0 auto' }}>
            <select
              value={nationality}
              onChange={(e) => { setNationality(e.target.value); setError('') }}
              style={{
                ...field,
                appearance: 'none', cursor: 'pointer', paddingRight: 44,
                color: nationality ? INK : 'rgba(0,0,0,0.45)',
                // caret drawn in, since appearance:none drops the native one
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='M1 1l6 6 6-6' stroke='%23232323' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
              }}
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c} style={{ color: '#000' }}>{c}</option>
              ))}
            </select>
            {error && <div style={{ color: '#b00020', fontFamily: BODY_FONT, fontSize: 14 }}>{error}</div>}
            <Cta onClick={confirmNationality}>Continue</Cta>
          </div>
        </div>
      )}

      {step >= 1 && step <= QUESTIONS.length && (
        <div key={step} className={`lp-step${leaving ? ' lp-step--out' : ''}`}>
          {stepHead}
          <SectionTitle>{q.q}</SectionTitle>
          <div style={{ display: 'grid', gap: 12, maxWidth: 460, margin: '0 auto' }}>
            {q.options.map((o) => (
              <button key={o} onClick={() => pick(q.key, o)} style={{ background: GOLD, border: 'none', borderRadius: 0, padding: '19px 20px', color: '#fff', fontFamily: BODY_FONT, fontWeight: 500, fontSize: 17, cursor: 'pointer', textAlign: 'center' }}>
                {o}
              </button>
            ))}
          </div>
          <button onClick={() => goTo(step - 1)} style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: 'rgba(0,0,0,0.5)', fontFamily: BODY_FONT, fontSize: 14, cursor: 'pointer' }}>
            Back
          </button>
        </div>
      )}

      {step === FORM_STEP && (
        <div className={`lp-step${leaving ? ' lp-step--out' : ''}`}>
          <p style={{ textAlign: 'center', color: GOLD, fontFamily: BODY_FONT, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 24px' }}>
            Last step
          </p>
          <SectionTitle>Where should we send your options?</SectionTitle>
          <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 460, margin: '0 auto' }}>
            <input style={field} placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input style={field} type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div style={{ display: 'grid', gridTemplateColumns: '132px 1fr', gap: 10 }}>
              <select
                value={dial.code}
                onChange={(e) => setDial(DIAL_CODES.find((d) => d.code === e.target.value) || DEFAULT_DIAL)}
                style={{ ...field, padding: '15px 8px' }}
              >
                {DIAL_CODES.map((d) => (
                  <option key={`${d.iso}${d.code}`} value={d.code} style={{ color: '#000' }}>{`${d.code} ${d.label}`}</option>
                ))}
              </select>
              <input style={field} type="tel" inputMode="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {error && <div style={{ color: '#b00020', fontFamily: BODY_FONT, fontSize: 14 }}>{error}</div>}
            <Cta onClick={() => {}} style={{ opacity: sending ? 0.7 : 1 }}>
              {sending ? 'Sending…' : 'Get Investment Options'}
            </Cta>
            <p style={{ color: 'rgba(0,0,0,0.5)', fontFamily: BODY_FONT, fontSize: 12, textAlign: 'center', margin: 0 }}>
              By submitting you agree to our <a href="/privacy" style={{ color: 'rgba(0,0,0,0.65)' }}>privacy policy</a>. No spam, ever.
            </p>
          </form>
          <button onClick={() => goTo(QUESTIONS.length)} style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: 'rgba(0,0,0,0.5)', fontFamily: BODY_FONT, fontSize: 14, cursor: 'pointer' }}>
            Back
          </button>
        </div>
      )}

      {step === DONE_STEP && (
        <div className="lp-step" style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
          <SectionTitle>Thank you. Your options are on the way.</SectionTitle>
          <p style={{ color: 'rgba(0,0,0,0.65)', fontFamily: BODY_FONT, fontSize: 16, lineHeight: 1.6 }}>
            Our Muscat team will contact you within one business day with prices, floor plans and availability. Want answers now?
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackContactClick({ channel: 'whatsapp', language: lang })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 10, background: '#25D366', color: '#08300f', borderRadius: 999, padding: '11px 26px 11px 12px', fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}
          >
            <img src="/images/whatsapp-icon.png" alt="" width={34} height={34} style={{ display: 'block', borderRadius: 9 }} />
            Chat on WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}

// ── page ─────────────────────────────────────────────────────────────
export default function MetaLandingPage() {
  const { lang } = useI18n()
  const scrollToQuiz = () => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div dir="ltr" style={{ background: `${PAPER} url(/images/lp-paper.jpg)`, backgroundSize: '1100px', minHeight: '100vh', paddingBottom: 90 }}>
      <style>{LP_CSS}</style>
      <DealChip />

      {/* hero — logo, one promise, one CTA (no photo: clean paper, per Figma) */}
      <section style={{ position: 'relative', textAlign: 'center', padding: '86px 18px 46px' }}>
        <img
          src="/images/oman-flag.png"
          alt="Oman"
          style={{ position: 'absolute', top: 0, left: 'clamp(18px, 8vw, 110px)', width: 'clamp(48px, 15.6vw, 110px)', height: 'auto', zIndex: 5, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.18))' }}
        />
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <img
            src="/images/irfan-logo-gold.svg"
            alt="Irfan Investment Group"
            width={112}
            height={112}
            style={{ display: 'block', margin: '0 auto 18px', width: 112, height: 112 }}
          />
          <h1 style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 'clamp(32px, 8vw, 56px)', lineHeight: 1.1, textTransform: 'uppercase', color: INK, margin: '10px 0 10px' }}>
            Own a Freehold Home in Oman
          </h1>
          <p style={{ fontFamily: TITLE_FONT, color: GOLD, fontSize: 'clamp(16px, 4vw, 21px)', letterSpacing: 1.2, textTransform: 'uppercase', margin: '0 0 26px' }}>
            Property + Residency Visa in One Purchase
          </p>
          <Cta onClick={scrollToQuiz}>Get Your Personal Offer</Cta>
        </div>
      </section>

      {/* quiz — the whole funnel, one question at a time */}
      <section style={{ padding: '38px 0 8px' }}>
        <QuizFunnel lang={lang} />
      </section>

      {/* mini footer */}
      <p style={{ color: 'rgba(0,0,0,0.5)', fontFamily: BODY_FONT, fontSize: 12.5, textAlign: 'center', marginTop: 46 }}>
        Irfan Investment Group · Muscat, Oman · <a href="/privacy" style={{ color: 'rgba(0,0,0,0.65)' }}>Privacy Policy</a>
      </p>

      {/* sticky WhatsApp — the official icon (Figma node 933-44240) */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackContactClick({ channel: 'whatsapp', language: lang })}
        aria-label="Chat on WhatsApp"
        className="lp-wa"
        style={{ position: 'fixed', right: 22, bottom: 26, zIndex: 50, display: 'block', width: 58, height: 58, borderRadius: 14, overflow: 'hidden' }}
      >
        <img src="/images/whatsapp-icon.png" alt="WhatsApp" width={58} height={58} style={{ display: 'block', width: '100%', height: '100%' }} />
      </a>
    </div>
  )
}
