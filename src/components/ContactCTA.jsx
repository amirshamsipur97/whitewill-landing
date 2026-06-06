/**
 * ContactCTA — reusable "Plan your next investment" form section.
 *
 * Extracted from AboutPage so the landing page can drop in the same
 * lead-capture experience without duplicating the markup.
 *
 * Behaviour:
 *   • Heading + subtitle ride a one-way scroll-blur (blurred on enter,
 *     snaps clear by the time it reaches the centre of the viewport,
 *     stays clear from that point on — so the form below is always
 *     legible once the user has scrolled to it).
 *   • Submit goes through submitForm() → Supabase `leads` → Google Sheet.
 *     The `source` prop lets each call-site (about / landing) track
 *     where the lead came from.
 */

import { useEffect, useRef, useState } from 'react'
import { Box, Container, Typography, Button, Snackbar, Alert } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { submitForm } from '../supabase'
import { useI18n } from '../i18n.jsx'

const OLIVE = '#7c7856'
const OLIVE_BRIGHT = '#8c8d25'

export default function ContactCTA({
  source = 'contact_cta',
  // Props still accepted as overrides, but they default to whatever
  // the active locale provides via i18n. That way LandingPage and
  // AboutPage automatically pick up the localized copy without
  // passing it explicitly.
  eyebrow,
  title,
  subtitle,
}) {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar' || lang === 'fa'
  const c = t.contactCta
  const localizedEyebrow = eyebrow ?? c.eyebrow
  const localizedTitle = title ?? c.title
  const localizedSubtitle = subtitle ?? c.subtitle
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [snack, setSnack] = useState({ open: false, ok: false, msg: '' })

  const sectionRef = useRef(null)
  const headRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !headRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(headRef.current, {
        ease: 'none',
        scrollTrigger: {
          trigger: headRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: (self) => {
            const t = self.progress
            // One-way ramp: 1 → 0 across the first half, then locked at 0.
            const d = Math.max(0, 0.5 - t) * 2
            const eased = Math.pow(d, 1.6)
            const px = (eased * 14).toFixed(2)
            if (headRef.current) {
              headRef.current.style.filter = `blur(${px}px)`
              headRef.current.style.opacity = String(1 - eased * 0.55)
            }
          },
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    if (!form.full_name.trim() || !form.email.trim()) {
      setSnack({ open: true, ok: false, msg: c.errorMsg })
      return
    }
    setSubmitting(true)
    try {
      await submitForm({
        source,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        message: form.message || null,
        page_url: typeof window !== 'undefined' ? window.location.href : null,
      })
      setSnack({ open: true, ok: true, msg: c.successMsg })
      setForm({ full_name: '', email: '', phone: '', message: '' })
    } catch {
      setSnack({ open: true, ok: false, msg: c.errorMsg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        bgcolor: '#000',
        color: '#fff',
        py: { xs: 8, md: 14 },
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Container maxWidth="md">
        <Box
          ref={headRef}
          sx={{
            textAlign: 'center',
            mb: { xs: 4, md: 5 },
            willChange: 'filter, opacity',
            filter: 'blur(14px)',
            opacity: 0.45,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: OLIVE_BRIGHT,
              mb: 2,
            }}
          >
            {localizedEyebrow}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: 32, md: 48 },
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              mb: 2,
            }}
          >
            {localizedTitle}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: { xs: 17, md: 20 },
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 620,
              mx: 'auto',
              lineHeight: 1.55,
            }}
          >
            {localizedSubtitle}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            p: { xs: 3, md: 5 },
            bgcolor: 'rgba(255,255,255,0.02)',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          {[
            { k: 'full_name', label: c.placeholderName, required: true, col: { xs: '1 / -1', md: 'auto' } },
            { k: 'email', label: c.placeholderEmail, type: 'email', required: true, col: { xs: '1 / -1', md: 'auto' } },
            { k: 'phone', label: c.placeholderPhone, col: '1 / -1' },
            { k: 'message', label: c.placeholderMessage, textarea: true, col: '1 / -1' },
          ].map((f) => (
            <Box key={f.k} sx={{ gridColumn: f.col }}>
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                {f.label}
                {f.required && <Box component="span" sx={{ color: OLIVE_BRIGHT, ml: 0.5 }}>*</Box>}
              </Typography>
              <Box
                component={f.textarea ? 'textarea' : 'input'}
                type={f.type || 'text'}
                value={form[f.k]}
                onChange={update(f.k)}
                rows={f.textarea ? 4 : undefined}
                sx={{
                  width: '100%',
                  bgcolor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 15,
                  px: 2,
                  py: 1.5,
                  outline: 'none',
                  resize: f.textarea ? 'vertical' : undefined,
                  transition: 'border-color 200ms ease, background-color 200ms ease',
                  '&:focus': { borderColor: OLIVE_BRIGHT, bgcolor: 'rgba(255,255,255,0.06)' },
                  '&::placeholder': { color: 'rgba(255,255,255,0.3)' },
                }}
              />
            </Box>
          ))}

          {/* On RTL the form's "end" is the LEFT side, but the
              ArrowForward icon must visually still point in the
              "submit" direction. We swap to ArrowBack (visual
              right→left feel) via CSS mirror so the button reads
              naturally either way. */}
          <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              endIcon={
                <ArrowForwardRoundedIcon
                  sx={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
                />
              }
              disabled={submitting}
              sx={{
                bgcolor: OLIVE_BRIGHT,
                color: '#000',
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontWeight: 600,
                py: 1.5,
                px: 4,
                fontSize: 14,
                textTransform: 'none',
                letterSpacing: '0.04em',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { bgcolor: OLIVE },
                '&.Mui-disabled': { bgcolor: 'rgba(140,141,37,0.4)', color: 'rgba(0,0,0,0.6)' },
              }}
            >
              {submitting ? c.sending : c.submit}
            </Button>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.ok ? 'success' : 'error'} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
