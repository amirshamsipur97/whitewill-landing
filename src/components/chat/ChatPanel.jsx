import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import SpinnerDots from './SpinnerDots'
import { submitForm } from '../../supabase'
import { useI18n } from '../../i18n.jsx'

/**
 * Floating chat panel — replaces the CtaPill while open.
 *
 * Tabs:
 *   - "Chat":   real conversation with Sara (Claude-powered) via the
 *               `chat` Supabase Edge Function. Messages and full session
 *               metadata are stored in chat_conversations + chat_messages
 *               for later analytics / user-psychology work.
 *   - "Contact": form (Name, Email, Country+phone, Project) posted to the
 *               existing submit-form Edge Function with source=chat_widget.
 *
 * Close triggers: X button, Escape key.
 *
 * The portrait video at the top uses /video/remi.mp4 (placeholder — we'll
 * swap when the Sara video lands).
 */

// Top countries by likely visitor mix. Flag emojis render natively, no fonts.
const COUNTRIES = [
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dial: '+968' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dial: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dial: '+966' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dial: '+974' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dial: '+973' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dial: '+965' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dial: '+98' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dial: '+91' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dial: '+92' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dial: '+44' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dial: '+1' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dial: '+7' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dial: '+86' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dial: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dial: '+33' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dial: '+90' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dial: '+20' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dial: '+962' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dial: '+961' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', dial: '+964' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', dial: '+963' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dial: '+61' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dial: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dial: '+82' },
  { code: 'OTHER', name: 'Other', flag: '🌐', dial: '' },
]

const QUICK_CHIPS = [
  'Where should I start?',
  'What do you do?',
  'I have a project',
]

// Session ID persists for the browser session only — drops when the
// user closes the tab. Keeps the same conversation across tab switches.
function getSessionId() {
  if (typeof window === 'undefined') return ''
  let id = window.sessionStorage.getItem('ww_chat_session')
  if (!id) {
    id = crypto.randomUUID()
    window.sessionStorage.setItem('ww_chat_session', id)
  }
  return id
}

export default function ChatPanel({ open, onClose }) {
  const [tab, setTab] = useState('chat')
  const containerRef = useRef(null)
  // `shouldRender` lags behind `open` on the way out so the exit
  // animation has time to play before the DOM node is unmounted.
  const [shouldRender, setShouldRender] = useState(open)

  // Bring the node back into the DOM the moment the parent says "open".
  useEffect(() => {
    if (open) setShouldRender(true)
  }, [open])

  // Open / close animation — GSAP-driven for a tactile spring-y feel.
  useEffect(() => {
    if (!shouldRender) return
    const el = containerRef.current
    if (!el) return

    if (open) {
      // OPEN — pops out of the bottom-right corner: scale + rise + fade,
      // with a hint of forward-tilt that settles to flat. `back.out(1.4)`
      // gives that slight "overshoot then settle" bounce.
      gsap.fromTo(
        el,
        {
          opacity: 0,
          scale: 0.6,
          y: 80,
          rotateX: 14,
          filter: 'blur(8px)',
          transformOrigin: 'bottom right',
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'back.out(1.4)',
        },
      )
    } else {
      // CLOSE — collapses back toward the corner it came from, then we
      // unmount via onComplete so the DOM node actually goes away.
      gsap.to(el, {
        opacity: 0,
        scale: 0.7,
        y: 60,
        rotateX: 10,
        filter: 'blur(6px)',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => setShouldRender(false),
      })
    }
  }, [open, shouldRender])

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!shouldRender) return null

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Chat with Sara"
      className="fixed right-10 bottom-10 z-50 w-[360px] h-[640px] rounded-[26px] bg-[#0a0a0a] text-white shadow-2xl flex flex-col overflow-hidden"
      style={{
        transformOrigin: 'bottom right',
        // 3D perspective so the rotateX entry-tilt reads correctly.
        perspective: 1200,
        willChange: 'transform, opacity, filter',
        boxShadow:
          '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08) inset',
      }}
    >
      <Header tab={tab} onTab={setTab} onClose={onClose} />
      <div className="flex-1 overflow-hidden">
        {tab === 'chat' ? <ChatTab /> : <ContactTab />}
      </div>
    </div>
  )
}

function Header({ tab, onTab, onClose }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-4 text-[13px]">
        <TabBtn label="Chat" active={tab === 'chat'} onClick={() => onTab('chat')} />
        <TabBtn label="Contact" active={tab === 'contact'} onClick={() => onTab('contact')} />
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path
            d="M1 1 L9 9 M9 1 L1 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

function TabBtn({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="relative pb-0.5" aria-pressed={active}>
      <span
        className={
          active ? 'text-white' : 'text-white/45 hover:text-white/70 transition-colors'
        }
      >
        {label}
      </span>
      {active && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
      )}
    </button>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  CHAT TAB  — real conversation with Sara (Claude)
// ───────────────────────────────────────────────────────────────────────────

function ChatTab() {
  const { lang } = useI18n()
  const sessionId = useMemo(getSessionId, [])
  // messages: { role: 'assistant'|'user', content: string }[]
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hey — I'm Sara, Irfan Investment's AI assistant.\nAnything catch your eye?",
    },
  ])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  // Auto-scroll to bottom on new messages.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  async function send(text) {
    const message = (text ?? draft).trim()
    if (!message || sending) return

    setError('')
    setMessages((m) => [...m, { role: 'user', content: message }])
    setDraft('')
    setSending(true)

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          message,
          language: lang,
          page_url: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Chat is unavailable.')
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  // Two visual modes inside the chat tab:
  //   - "intro" (no user messages yet): big video + Sara intro card + chips
  //     → mirrors the original static design the user wants to see again.
  //   - "conversation" (at least one user message): same big video header,
  //     real chat bubbles in a scrollable area below.
  const hasConversation = messages.some((m) => m.role === 'user')

  return (
    <div className="h-full flex flex-col">
      {/*
        Big video header — 400px tall, anchored to top so more of Sara's
        head + shoulders shows (not just chin). The gradient fades the
        bottom 30% into black for a clean transition into the text below.
      */}
      <div className="relative h-[400px] shrink-0 overflow-hidden">
        <video
          src="/video/remi.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
          aria-hidden
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 60%, rgba(10,10,10,0.85) 90%, #0a0a0a 100%)',
          }}
          aria-hidden
        />
      </div>

      {/* Content area — intro vs conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 -mt-16 relative">
        {!hasConversation ? (
          <div>
            <p className="text-[11px] tracking-[0.18em] text-white/55 uppercase mb-1.5">
              Sara
            </p>
            <p className="text-[15px] leading-[1.45] text-white/95">
              {messages[0].content}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 pb-3">
              {QUICK_CHIPS.map((chip, i) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => send(chip)}
                  disabled={sending}
                  className={
                    i === 0
                      ? 'rounded-full bg-white/95 text-black text-[12.5px] px-3 py-1.5 hover:bg-white transition-colors disabled:opacity-50'
                      : 'rounded-full bg-white/10 text-white/70 text-[12.5px] px-3 py-1.5 hover:bg-white/20 transition-colors disabled:opacity-50'
                  }
                >
                  {chip}
                </button>
              ))}
            </div>
            {sending && (
              <div className="flex items-center gap-2 text-white/50 text-[12px] pt-2">
                <SpinnerDots size={14} />
                <span>Sara is thinking…</span>
              </div>
            )}
            {error && (
              <p className="text-[12px] text-red-300/90 pt-2">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-3 pb-2">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-white/50 text-[12px]">
                <SpinnerDots size={14} />
                <span>Sara is thinking…</span>
              </div>
            )}
            {error && (
              <p className="text-[12px] text-red-300/90">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="flex items-center gap-2 px-4 pb-4 pt-2 border-t border-white/5"
      >
        <span className="text-white/70 pl-1">
          <SpinnerDots size={18} />
        </span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={sending}
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-white/40 disabled:opacity-50"
        />
      </form>
    </div>
  )
}

function Bubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          isUser
            ? 'max-w-[80%] rounded-2xl px-3 py-2 bg-white/95 text-black text-[13.5px] leading-[1.4] whitespace-pre-wrap'
            : 'max-w-[85%] text-[14px] leading-[1.5] text-white/95 whitespace-pre-wrap'
        }
      >
        {content}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  CONTACT TAB
// ───────────────────────────────────────────────────────────────────────────

function ContactTab() {
  const { lang } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('OM')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorText, setErrorText] = useState('')

  const selectedCountry = COUNTRIES.find((c) => c.code === country) || COUNTRIES[0]

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrorText('')
    try {
      await submitForm({
        source: 'chat_widget',
        full_name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() ? `${selectedCountry.dial} ${phone.trim()}`.trim() : undefined,
        message: message.trim(),
        language: lang,
        extra: {
          country_code: selectedCountry.code,
          country_name: selectedCountry.name,
        },
      })
      setStatus('ok')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setErrorText(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'ok') {
    return (
      <div className="px-5 pt-16 pb-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-white text-black grid place-items-center mb-3">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
            <path
              d="M3 8 L7 12 L13 4"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-[15px] text-white/90">
          Thanks — we&apos;ll be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col gap-2.5 px-5 pt-14 pb-4 overflow-y-auto"
    >
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="chat-input"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="chat-input"
      />

      {/* Country + Phone — split row, country dropdown shows flag inline */}
      <div className="flex gap-2">
        <div className="relative shrink-0">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="chat-input appearance-none cursor-pointer"
            style={{
              width: 120,                    // was 78 → wider so dial codes fit
              paddingLeft: 12,
              paddingRight: 28,              // room for the dropdown caret
              fontSize: 14,
              letterSpacing: 0.5,
            }}
            aria-label="Country"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} style={{ color: '#000' }}>
                {c.flag}  {c.dial || c.code}
              </option>
            ))}
          </select>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
            aria-hidden
          >
            <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="chat-input flex-1 min-w-0"
          inputMode="tel"
        />
      </div>

      <textarea
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us what you're looking for"
        className="chat-input resize-none flex-1"
      />
      {status === 'error' && (
        <p className="text-[12px] text-red-300">{errorText}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-1 rounded-full bg-white text-black h-10 text-[13.5px] font-medium hover:bg-white/90 disabled:opacity-60 transition-colors"
      >
        {status === 'sending' ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
