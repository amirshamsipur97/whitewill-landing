import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { gsap } from 'gsap'
import { useI18n } from '../i18n.jsx'
import { submitForm } from '../supabase'

// ───────────────────────── static data ─────────────────────────

// Commonly relevant dialing codes for Oman/UAE/GCC + global majors.
// Keep this list short — long lists hurt mobile UX.
const COUNTRY_CODES = [
  { code: '+968', flag: '🇴🇲', label: 'Oman' },
  { code: '+971', flag: '🇦🇪', label: 'UAE' },
  { code: '+966', flag: '🇸🇦', label: 'Saudi Arabia' },
  { code: '+974', flag: '🇶🇦', label: 'Qatar' },
  { code: '+973', flag: '🇧🇭', label: 'Bahrain' },
  { code: '+965', flag: '🇰🇼', label: 'Kuwait' },
  { code: '+7',   flag: '🇷🇺', label: 'Russia' },
  { code: '+44',  flag: '🇬🇧', label: 'United Kingdom' },
  { code: '+1',   flag: '🇺🇸', label: 'United States' },
  { code: '+91',  flag: '🇮🇳', label: 'India' },
  { code: '+92',  flag: '🇵🇰', label: 'Pakistan' },
  { code: '+98',  flag: '🇮🇷', label: 'Iran' },
  { code: '+90',  flag: '🇹🇷', label: 'Türkiye' },
  { code: '+49',  flag: '🇩🇪', label: 'Germany' },
  { code: '+33',  flag: '🇫🇷', label: 'France' },
  { code: '+34',  flag: '🇪🇸', label: 'Spain' },
  { code: '+39',  flag: '🇮🇹', label: 'Italy' },
  { code: '+86',  flag: '🇨🇳', label: 'China' },
]

const NATIONALITIES = [
  'Omani', 'Emirati', 'Saudi', 'Qatari', 'Bahraini', 'Kuwaiti',
  'Russian', 'British', 'American', 'Indian', 'Pakistani', 'Iranian',
  'Turkish', 'German', 'French', 'Italian', 'Spanish', 'Chinese',
  'Egyptian', 'Lebanese', 'Jordanian', 'Syrian', 'Iraqi',
  'Canadian', 'Australian', 'Other',
]

// Inline SVG noise → no extra request, no CSP issue.
const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>\")"

// ───────────────────────── styled atoms ─────────────────────────

const FIELD_LABEL_SX = {
  display: 'block',
  fontFamily: '"Arsenal SC", "Inter", sans-serif',
  fontSize: 13,
  fontWeight: 400,
  color: 'rgba(255,255,255,0.7)',
  mb: 1,
  letterSpacing: '0.3px',
}

const FIELD_BASE_SX = {
  width: '100%',
  fontFamily: '"Arsenal SC", "Inter", sans-serif',
  fontSize: 15,
  color: '#ffffff',
  bgcolor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '10px',
  px: 2,
  py: 1.5,
  outline: 'none',
  transition: 'border-color 180ms ease, background-color 180ms ease',
  '&::placeholder': { color: 'rgba(255,255,255,0.38)' },
  '&:hover': { borderColor: 'rgba(255,255,255,0.32)' },
  '&:focus': {
    borderColor: '#7c7856',
    bgcolor: 'rgba(255,255,255,0.06)',
  },
}

// ───────────────────────── main component ─────────────────────────

export default function TalkToModal({ open, onClose, agent }) {
  const { t, lang } = useI18n()
  const backdropRef = useRef(null)
  const panelRef = useRef(null)
  const closingRef = useRef(false)

  const [form, setForm] = useState({
    name: '', email: '',
    countryCode: '+968', phone: '',
    nationality: '',
    lookingFor: '',
    propertyType: '',
    location: '',
    timePreference: '',
    specialRequests: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [snack, setSnack] = useState({ open: false, severity: 'success', msg: '' })

  // Reset state every time we open with a different (or same) agent
  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, countryCode: '+968' }))
      closingRef.current = false
    }
  }, [open, agent?.slug])

  // ── Open animation + body scroll lock ─────────────────────────
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'

    // Defer one frame so refs are mounted
    const raf = requestAnimationFrame(() => {
      if (!backdropRef.current || !panelRef.current) return
      const tl = gsap.timeline()
      tl.set([backdropRef.current, panelRef.current], { autoAlpha: 0 })
      tl.to(backdropRef.current, {
        autoAlpha: 1, duration: 0.3, ease: 'power2.out',
      })
      tl.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 30, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' },
        '-=0.18',
      )
      tl.fromTo(
        '.tt-field',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.045, ease: 'power2.out' },
        '-=0.32',
      )
    })

    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [open])

  // ── Close (animated) ─────────────────────────────────────────
  const handleClose = () => {
    if (closingRef.current) return
    if (!panelRef.current || !backdropRef.current) {
      onClose()
      return
    }
    closingRef.current = true
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, {
      autoAlpha: 0, y: 18, scale: 0.97, duration: 0.25, ease: 'power2.in',
    })
    tl.to(
      backdropRef.current,
      { autoAlpha: 0, duration: 0.22, ease: 'power2.in' },
      '-=0.12',
    )
  }

  // ── ESC to close ──────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // ── Submit ────────────────────────────────────────────────────
  const handleField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await submitForm({
        source: `talk_to_${agent.slug}`,
        full_name: form.name.trim(),
        email: form.email.trim(),
        phone: `${form.countryCode} ${form.phone}`.trim(),
        property_interest: form.propertyType || null,
        preferred_location: form.location || null,
        message: form.specialRequests || null,
        language: lang,
        extra: {
          agent_slug: agent.slug,
          agent_name: agent.name,
          nationality: form.nationality || null,
          looking_for: form.lookingFor || null,
          time_preference: form.timePreference || null,
        },
      })
      setSnack({ open: true, severity: 'success', msg: t.talkToModal.success })
      setForm({
        name: '', email: '', countryCode: '+968', phone: '',
        nationality: '', lookingFor: '', propertyType: '',
        location: '', timePreference: '', specialRequests: '',
      })
      // close after a beat so user sees the snackbar
      setTimeout(() => handleClose(), 800)
    } catch (err) {
      setSnack({
        open: true, severity: 'error',
        msg: err?.message || t.talkToModal.errorGeneric,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !agent) {
    // Snackbar must still be mountable after close
    return (
      <Snackbar
        open={snack.open}
        autoHideDuration={4500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    )
  }

  const L = t.talkToModal.labels
  const P = t.talkToModal.placeholders
  const propertyTypes = t.talkToModal.propertyTypes
  const timePreferences = t.talkToModal.timePreferences
  const locations = t.talkToModal.locations

  return (
    <>
      {/* Backdrop */}
      <Box
        ref={backdropRef}
        onClick={handleClose}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1400,
          bgcolor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Glass panel */}
        <Box
          ref={panelRef}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 760,
            maxHeight: '92vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'rgba(18,18,18,0.55)',
            backdropFilter: 'blur(40px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.3)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            color: '#ffffff',
            boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
            // Grain — fixed on the box, doesn't move on scroll, mixed for warmth
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: GRAIN_BG,
              backgroundRepeat: 'repeat',
              opacity: 0.5,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              borderRadius: 'inherit',
              zIndex: 0,
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: { xs: 3, md: 5 },
              py: 2.5,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              bgcolor: 'rgba(0,0,0,0.18)',
              flexShrink: 0,
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: { xs: 20, md: 24 },
                fontWeight: 500,
                color: '#ffffff',
                letterSpacing: '0.3px',
              }}
            >
              {agent.cta}
            </Typography>
            <IconButton
              onClick={handleClose}
              aria-label="Close"
              sx={{
                color: '#ffffff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={submit}
            sx={{
              position: 'relative',
              zIndex: 1,
              overflowY: 'auto',
              px: { xs: 3, md: 5 },
              py: { xs: 3, md: 4 },
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                columnGap: 3,
                rowGap: 2.5,
              }}
            >
              {/* Name */}
              <Box className="tt-field">
                <Typography component="label" sx={FIELD_LABEL_SX}>
                  {L.name}*
                </Typography>
                <Box
                  component="input"
                  required
                  type="text"
                  value={form.name}
                  onChange={handleField('name')}
                  placeholder={P.name}
                  sx={FIELD_BASE_SX}
                />
              </Box>

              {/* Email */}
              <Box className="tt-field">
                <Typography component="label" sx={FIELD_LABEL_SX}>
                  {L.email}*
                </Typography>
                <Box
                  component="input"
                  required
                  type="email"
                  value={form.email}
                  onChange={handleField('email')}
                  placeholder={P.email}
                  sx={FIELD_BASE_SX}
                />
              </Box>

              {/* Mobile w/ country code */}
              <Box className="tt-field">
                <Typography component="label" sx={FIELD_LABEL_SX}>
                  {L.mobile}*
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 1 }}>
                  <Box
                    component="select"
                    value={form.countryCode}
                    onChange={handleField('countryCode')}
                    sx={{
                      ...FIELD_BASE_SX,
                      px: 1.2,
                      appearance: 'none',
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='white' d='M6 8L0 0h12z' opacity='0.6'/></svg>\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      pr: 3,
                      '& option': { color: '#000' },
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </Box>
                  <Box
                    component="input"
                    required
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={handleField('phone')}
                    placeholder={P.mobile}
                    sx={FIELD_BASE_SX}
                  />
                </Box>
              </Box>

              {/* Nationality */}
              <Box className="tt-field">
                <Typography component="label" sx={FIELD_LABEL_SX}>
                  {L.nationality}*
                </Typography>
                <Box
                  component="select"
                  required
                  value={form.nationality}
                  onChange={handleField('nationality')}
                  sx={{
                    ...FIELD_BASE_SX,
                    appearance: 'none',
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='white' d='M6 8L0 0h12z' opacity='0.6'/></svg>\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    pr: 4,
                    '& option': { color: '#000' },
                    color: form.nationality ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <option value="" disabled>{P.nationality}</option>
                  {NATIONALITIES.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Box>
              </Box>

              {/* Looking for (free text) */}
              <Box className="tt-field">
                <Typography component="label" sx={FIELD_LABEL_SX}>
                  {L.lookingFor}*
                </Typography>
                <Box
                  component="input"
                  required
                  type="text"
                  value={form.lookingFor}
                  onChange={handleField('lookingFor')}
                  placeholder={P.lookingFor}
                  sx={FIELD_BASE_SX}
                />
              </Box>

              {/* Interested in - Property Type */}
              <Box className="tt-field">
                <Typography component="label" sx={FIELD_LABEL_SX}>
                  {L.propertyType}*
                </Typography>
                <Box
                  component="select"
                  required
                  value={form.propertyType}
                  onChange={handleField('propertyType')}
                  sx={{
                    ...FIELD_BASE_SX,
                    appearance: 'none',
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='white' d='M6 8L0 0h12z' opacity='0.6'/></svg>\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    pr: 4,
                    '& option': { color: '#000' },
                    color: form.propertyType ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <option value="" disabled>{P.propertyType}</option>
                  {propertyTypes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Box>
              </Box>

              {/* Location */}
              <Box className="tt-field">
                <Typography component="label" sx={FIELD_LABEL_SX}>
                  {L.location}*
                </Typography>
                <Box
                  component="select"
                  required
                  value={form.location}
                  onChange={handleField('location')}
                  sx={{
                    ...FIELD_BASE_SX,
                    appearance: 'none',
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='white' d='M6 8L0 0h12z' opacity='0.6'/></svg>\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    pr: 4,
                    '& option': { color: '#000' },
                    color: form.location ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <option value="" disabled>{P.location}</option>
                  {locations.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </Box>
              </Box>

              {/* Time preference */}
              <Box className="tt-field">
                <Typography component="label" sx={FIELD_LABEL_SX}>
                  {L.timePreference}*
                </Typography>
                <Box
                  component="select"
                  required
                  value={form.timePreference}
                  onChange={handleField('timePreference')}
                  sx={{
                    ...FIELD_BASE_SX,
                    appearance: 'none',
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='white' d='M6 8L0 0h12z' opacity='0.6'/></svg>\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    pr: 4,
                    '& option': { color: '#000' },
                    color: form.timePreference ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <option value="" disabled>{P.timePreference}</option>
                  {timePreferences.map((tm) => (
                    <option key={tm} value={tm}>{tm}</option>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Special Requests (full width) */}
            <Box className="tt-field" sx={{ mt: 3 }}>
              <Typography component="label" sx={FIELD_LABEL_SX}>
                {L.specialRequests}*
              </Typography>
              <Box
                component="textarea"
                required
                rows={4}
                value={form.specialRequests}
                onChange={handleField('specialRequests')}
                placeholder={P.specialRequests}
                sx={{
                  ...FIELD_BASE_SX,
                  resize: 'vertical',
                  minHeight: 110,
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  lineHeight: 1.5,
                }}
              />
            </Box>

            {/* Submit */}
            <Box
              className="tt-field"
              sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
            >
              <Box
                component="button"
                type="submit"
                disabled={submitting}
                sx={{
                  position: 'relative',
                  minWidth: { xs: '100%', sm: 340 },
                  height: 56,
                  borderRadius: '14px',
                  border: 'none',
                  bgcolor: '#7c7856',
                  color: '#ffffff',
                  cursor: submitting ? 'wait' : 'pointer',
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: '0.4px',
                  transition: 'background-color 200ms ease, transform 200ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  '&:hover:not(:disabled)': {
                    bgcolor: '#8e8a63',
                  },
                  '&:active:not(:disabled)': { transform: 'translateY(1px)' },
                  '&:disabled': { opacity: 0.7 },
                }}
              >
                {submitting && <CircularProgress size={18} sx={{ color: '#fff' }} />}
                {t.talkToModal.submit}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  )
}
