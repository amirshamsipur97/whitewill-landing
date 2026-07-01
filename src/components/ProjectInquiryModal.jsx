import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography, IconButton, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { gsap } from 'gsap'
import { useI18n } from '../i18n.jsx'
import { submitForm } from '../supabase'
import { COUNTRY_CODES, DEFAULT_DIAL_CODE, countryForDialCode } from '../data/countryCodes.js'

// ───────────────────────── shared atoms ─────────────────────────
const OLIVE = '#7c7856'
const OLIVE_HOVER = '#8e8a63'

const FIELD_SX = {
  width: '100%',
  fontFamily: '"Arsenal SC", "Inter", sans-serif',
  fontSize: 15,
  color: '#fff',
  bgcolor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '10px',
  px: 2, py: 1.5,
  outline: 'none',
  '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
  '&:focus': { borderColor: OLIVE, bgcolor: 'rgba(255,255,255,0.08)' },
}

// ───────────────────────── adaptive question flow ─────────────────
//
// Each step has a `key` (form-state field), a question, and either `options`
// or `input`. Steps with `if` only show when the predicate against current
// form state is true → that's how we skip "land/industrial" questions when
// the user picks Residential.

// When the user opened the modal from a SPECIFIC UNIT (e.g. St. Regis #1b),
// we already know purpose/type/bedrooms. `hasUnit=true` drops those steps —
// the flow becomes just timeline + contact info.
function buildFlow(t, hasUnit) {
  const Q = t.projectInquiry.questions
  const O = t.projectInquiry.options
  const P = t.projectInquiry.placeholders
  if (hasUnit) {
    return [
      { key: 'timeline', q: Q.timeline, options: O.timeline },
      { key: 'name',     q: Q.name,     input: { type: 'text',  placeholder: P.name } },
      { key: 'email',    q: Q.email,    input: { type: 'email', placeholder: P.email } },
      { key: 'phone',    q: Q.phone,    input: { type: 'tel',   placeholder: P.phone } },
    ]
  }
  return [
    { key: 'purpose',         q: Q.purpose,         options: O.purpose },
    { key: 'residentialType', q: Q.residentialType, options: O.residentialType,
      if: (f) => f.purpose === O.purpose[0] },
    { key: 'bedrooms',        q: Q.bedrooms,        options: O.bedrooms,
      if: (f) => f.purpose === O.purpose[0] },
    { key: 'budget',          q: Q.budget,          options: O.budget,
      if: (f) => f.purpose === O.purpose[0] },
    { key: 'commercialType',  q: Q.commercialType,  options: O.commercialType,
      if: (f) => f.purpose === O.purpose[1] },
    { key: 'commercialSize',  q: Q.commercialSize,  options: O.commercialSize,
      if: (f) => f.purpose === O.purpose[1] },
    { key: 'landUse',         q: Q.landUse,         options: O.landUse,
      if: (f) => f.purpose === O.purpose[2] },
    { key: 'landSize',        q: Q.landSize,        options: O.landSize,
      if: (f) => f.purpose === O.purpose[2] },
    { key: 'timeline',        q: Q.timeline,        options: O.timeline },
    { key: 'name',            q: Q.name,            input: { type: 'text',  placeholder: P.name } },
    { key: 'email',           q: Q.email,           input: { type: 'email', placeholder: P.email } },
    { key: 'phone',           q: Q.phone,           input: { type: 'tel',   placeholder: P.phone } },
  ]
}

// ───────────────────────── main component ──────────────────────────
export default function ProjectInquiryModal({ open, project, unit, onClose }) {
  const { t, lang } = useI18n()
  const backdropRef = useRef(null)
  const panelRef = useRef(null)
  const scrollRef = useRef(null)
  const closingRef = useRef(false)

  const hasUnit = !!unit

  const [form, setForm] = useState({})
  const [stepIdx, setStepIdx] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  const flow = useMemo(() => buildFlow(t, hasUnit), [t, hasUnit])
  const activeSteps = useMemo(
    () => flow.filter((s) => !s.if || s.if(form)),
    [flow, form],
  )

  // Reset whenever opened, project changes, or the user pivots to a unit
  useEffect(() => {
    if (!open) return
    setForm({})
    setStepIdx(0)
    setDone(false)
    setError(null)
    closingRef.current = false
  }, [open, project?.id, unit?.id])

  // GSAP open
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'

    const raf = requestAnimationFrame(() => {
      if (!backdropRef.current || !panelRef.current) return
      gsap.set([backdropRef.current, panelRef.current], { autoAlpha: 0 })
      const tl = gsap.timeline()
      tl.to(backdropRef.current, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
      tl.fromTo(panelRef.current,
        { autoAlpha: 0, scale: 0.92, y: 24 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' },
        '-=0.18'
      )
    })

    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Auto-scroll bubble area + fade last bubble on step change
  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    const els = scrollRef.current.querySelectorAll('.pi-bubble')
    const last = els[els.length - 1]
    if (last) {
      gsap.fromTo(last,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      )
    }
  }, [stepIdx, done])

  const handleClose = () => {
    if (closingRef.current) return
    if (!panelRef.current || !backdropRef.current) { onClose(); return }
    closingRef.current = true
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, { autoAlpha: 0, scale: 0.95, y: 12, duration: 0.25, ease: 'power2.in' })
    tl.to(backdropRef.current, { autoAlpha: 0, duration: 0.22, ease: 'power2.in' }, '-=0.12')
  }

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const onPickOption = (value) => {
    const step = activeSteps[stepIdx]
    setField(step.key, value)
    setTimeout(() => advance(), 220)
  }

  const advance = () => {
    if (stepIdx < activeSteps.length - 1) {
      setStepIdx((i) => i + 1)
    } else {
      submit()
    }
  }
  const goBack = () => { if (stepIdx > 0) setStepIdx((i) => i - 1) }

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const slug = (project?.name || 'unknown')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')

      // When a specific unit is selected, the inquiry inherits its
      // type/bedrooms/price so the sheet + sales team see a complete brief
      // without forcing the user to retype any of it.
      const inferredType = hasUnit
        ? unit.unit_type
        : (form.residentialType || form.commercialType || form.landUse || form.purpose || null)

      // Build the "Special Requests" message for unit inquiries from
      // the unit's own metadata — mirrors the column titles of the
      // source inventory sheet (Floor Name, Type, Total Area, View,
      // Price). Unit No. is deliberately omitted (per the user — it's
      // an internal field that doesn't belong in the customer-facing
      // sales sheet).
      const messageParts = hasUnit
        ? [
            unit.floor_label && `Floor: ${unit.floor_label}`,
            `Type: ${unit.layout_type || unit.unit_type}`,
            unit.bedrooms != null && `Bedrooms: ${unit.bedrooms}`,
            unit.view && `View: ${unit.view}`,
            unit.total_area_sqm && `Total area: ${Math.round(unit.total_area_sqm)} m²`,
            unit.price_per_sqm_omr && `Price / sqm: OMR ${Number(unit.price_per_sqm_omr).toLocaleString()}`,
            unit.price_omr && `Unit price: OMR ${Number(unit.price_omr).toLocaleString()}`,
            form.timeline && `Timeline: ${form.timeline}`,
          ]
        : [
            form.bedrooms && `Bedrooms: ${form.bedrooms}`,
            form.budget && `Budget: ${form.budget}`,
            form.commercialSize && `Size: ${form.commercialSize}`,
            form.landSize && `Plot: ${form.landSize}`,
            form.timeline && `Timeline: ${form.timeline}`,
          ]

      // When the inquiry came from a specific unit, the adaptive chat
      // flow skips the purpose / bedrooms / budget steps — but the
      // Google Sheet still expects those columns to be populated. Fill
      // them from the unit's own metadata so the sales team gets a
      // complete row instead of a half-empty one (Purpose / Type /
      // Bedrooms / Size / Budget were all blank before this).
      const unitBudget = hasUnit && unit?.price_omr != null
        ? `OMR ${Number(unit.price_omr).toLocaleString()}`
        : null
      const unitBedrooms = hasUnit && unit?.bedrooms != null
        ? String(unit.bedrooms)
        : null

      await submitForm({
        source: `project_inquiry_${slug}${hasUnit ? '_unit' : ''}`,
        full_name: form.name?.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim() ? `${form.dial_code || DEFAULT_DIAL_CODE} ${form.phone.trim()}` : form.phone?.trim(),
        phone_country_code: form.dial_code || DEFAULT_DIAL_CODE,
        country: countryForDialCode(form.dial_code || DEFAULT_DIAL_CODE),
        property_interest: inferredType,
        // Top-level budget is mapped to `leads.budget` in Supabase AND
        // forwarded as `budget` to the Apps Script — so populate it
        // with the unit price when we have one.
        budget: unitBudget || form.budget || undefined,
        message: messageParts.filter(Boolean).join(' · '),
        language: lang,
        extra: {
          project_id: project?.id ?? null,
          project_name: project?.name ?? null,
          developer: project?.developer?.name ?? null,
          // Unit context (only present when user opened modal from a
          // unit). `unit_no` is deliberately excluded — it's an
          // internal sheet reference number that the customer-facing
          // sales sheet shouldn't surface (the layout type already
          // identifies the floorplan).
          unit_id: unit?.id ?? null,
          unit_layout: unit?.layout_type ?? null,
          unit_floor: unit?.floor_label ?? null,
          unit_view: unit?.view ?? null,
          unit_bedrooms: unit?.bedrooms ?? null,
          unit_total_area_sqm: unit?.total_area_sqm ?? null,
          unit_price_omr: unit?.price_omr ?? null,
          unit_price_per_sqm_omr: unit?.price_per_sqm_omr ?? null,
          // Adaptive-flow answers — fall back to unit-derived values
          // for unit inquiries so the Sheet columns map cleanly.
          purpose:        form.purpose        || (hasUnit ? 'Residential home' : null),
          residential_type: form.residentialType,
          bedrooms:       form.bedrooms       || unitBedrooms,
          budget:         form.budget         || unitBudget,
          commercial_type: form.commercialType,
          commercial_size: form.commercialSize,
          land_use: form.landUse,
          land_size: form.landSize,
          timeline: form.timeline,
        },
      })
      setDone(true)
    } catch (err) {
      setError(err?.message || 'Submit failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !project) return null

  const step = activeSteps[stepIdx]
  const isInput = !!step?.input
  const currentValue = form[step?.key] ?? ''
  const canAdvance = isInput ? Boolean(currentValue && currentValue.trim()) : true
  const isLastStep = stepIdx === activeSteps.length - 1
  // Personalise the greeting when a specific unit is selected so the user
  // immediately sees "yes, I know which unit you mean."
  const greeting = hasUnit
    ? `Great taste — let's lock in ${project.name} unit ${unit.layout_type} (${unit.bedrooms ?? 0} br · ${unit.view}). Just a couple of questions:`
    : t.projectInquiry.greeting.replace('{project}', project.name)

  // Build bubble list — greeting + all asked questions + answers so far
  const bubbles = []
  bubbles.push({ role: 'ai', text: greeting })
  for (let i = 0; i <= stepIdx; i++) {
    const s = activeSteps[i]
    if (!s) break
    bubbles.push({ role: 'ai', text: s.q })
    if (i < stepIdx) {
      const v = form[s.key]
      if (v) bubbles.push({ role: 'user', text: v })
    }
  }

  return (
    <Box
      ref={backdropRef}
      onClick={handleClose}
      sx={{
        position: 'fixed', inset: 0, zIndex: 1500,
        bgcolor: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 500,
          height: { xs: '88vh', md: 'min(800px, 90vh)' },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '24px',
          color: '#fff',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          overflow: 'hidden',
        }}
      >
        {/* ── Video header (Sara) ───────────────────────────────── */}
        <Box
          sx={{
            position: 'relative',
            flexShrink: 0,
            height: { xs: 340, md: 440 },
            overflow: 'hidden',
          }}
        >
          <Box
            component="video"
            src="/video/remi.mp4"
            autoPlay muted loop playsInline preload="auto"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              pointerEvents: 'none',
              bgcolor: '#000',
            }}
            aria-hidden
          />
          {/* Bottom gradient → fades into #0a0a0a chat bg.
              Even tighter now (~15% dark wedge) so the video stays as
              prominent as possible. Text uses text-shadow for legibility. */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute', inset: 0,
              background:
                'linear-gradient(180deg, transparent 85%, rgba(10,10,10,0.72) 96%, #0a0a0a 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top-bar overlays — step counter (left) + close (right) */}
          <Box
            sx={{
              position: 'absolute', top: 0, left: 0, right: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 2.5, pt: 1.8, zIndex: 3,
            }}
          >
            {!done ? (
              <Box
                sx={{
                  px: 1.4, py: 0.5,
                  borderRadius: '999px',
                  bgcolor: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(8px)',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.5px',
                  fontWeight: 500,
                }}
              >
                {t.projectInquiry.progress
                  .replace('{current}', stepIdx + 1)
                  .replace('{total}', activeSteps.length)}
              </Box>
            ) : <span />}
            <IconButton
              onClick={handleClose}
              aria-label="Close"
              sx={{
                color: '#fff',
                bgcolor: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(8px)',
                width: 36, height: 36,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Name + project label, overlaid on the gradient at the bottom.
              text-shadow keeps it readable since the gradient is now thinner. */}
          <Box
            sx={{
              position: 'absolute',
              left: 22, right: 22,
              bottom: 14,
              zIndex: 2,
              textShadow: '0 2px 12px rgba(0,0,0,0.75)',
            }}
          >
            <Typography
              sx={{
                fontSize: 10, letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {t.projectInquiry.title.toUpperCase()}
            </Typography>
            <Typography
              sx={{
                fontSize: 20, fontWeight: 600,
                color: '#fff', lineHeight: 1.2,
              }}
            >
              SARA
            </Typography>
            <Typography
              sx={{
                fontSize: 12, fontWeight: 500,
                color: OLIVE,
                letterSpacing: '0.3px',
                mt: 0.25,
              }}
            >
              {project.name}
            </Typography>
          </Box>
        </Box>

        {/* ── Body ─────────────────────────────────────────────── */}
        {done ? (
          <SuccessScreen t={t} />
        ) : (
          <>
            {/* Bubble feed */}
            <Box
              ref={scrollRef}
              sx={{
                flex: 1,
                overflowY: 'auto',
                px: { xs: 2.5, md: 3 },
                pt: 2.5,
                pb: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.3,
                bgcolor: '#0a0a0a',
              }}
            >
              {bubbles.map((b, i) => (
                <Box
                  key={i}
                  className="pi-bubble"
                  sx={{
                    alignSelf: b.role === 'ai' ? 'flex-start' : 'flex-end',
                    maxWidth: '88%',
                    px: 1.8, py: 1.1,
                    borderRadius: '14px',
                    fontSize: 14,
                    lineHeight: 1.45,
                    bgcolor: b.role === 'ai'
                      ? 'rgba(255,255,255,0.06)'
                      : OLIVE,
                    color: '#fff',
                    border: b.role === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    fontWeight: b.role === 'user' ? 500 : 400,
                  }}
                >
                  {b.text}
                </Box>
              ))}
            </Box>

            {/* Input zone — chips or text */}
            <Box
              sx={{
                px: { xs: 2.5, md: 3 },
                py: 2,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                bgcolor: '#0a0a0a',
                flexShrink: 0,
              }}
            >
              {step && !isInput && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {step.options.map((opt) => {
                    const active = currentValue === opt
                    return (
                      <Box
                        key={opt}
                        component="button"
                        type="button"
                        onClick={() => onPickOption(opt)}
                        sx={{
                          px: 1.8, py: 1,
                          fontSize: 13, fontWeight: 600,
                          borderRadius: '999px',
                          border: '1px solid',
                          borderColor: active ? OLIVE : 'rgba(255,255,255,0.18)',
                          bgcolor: active ? OLIVE : 'rgba(255,255,255,0.04)',
                          color: '#fff',
                          cursor: 'pointer',
                          transition: 'all 180ms ease',
                          '&:hover': {
                            borderColor: OLIVE,
                            bgcolor: active ? OLIVE_HOVER : 'rgba(124,120,86,0.2)',
                          },
                        }}
                      >
                        {opt}
                      </Box>
                    )
                  })}
                </Box>
              )}

              {step && isInput && (
                <Box
                  component="form"
                  onSubmit={(e) => { e.preventDefault(); if (canAdvance) advance() }}
                  sx={{ display: 'flex', gap: 1 }}
                >
                  {step.input.type === 'tel' && (
                    <Box
                      component="select"
                      aria-label="Country code"
                      value={form.dial_code || DEFAULT_DIAL_CODE}
                      onChange={(e) => setField('dial_code', e.target.value)}
                      dir="ltr"
                      sx={{ ...FIELD_SX, flex: '0 0 110px', width: 110, appearance: 'none', cursor: 'pointer', '& option': { color: '#000' } }}
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option key={cc.code + cc.label} value={cc.code}>{cc.flag} {cc.code}</option>
                      ))}
                    </Box>
                  )}
                  <Box
                    component="input"
                    autoFocus
                    type={step.input.type}
                    inputMode={step.input.type === 'tel' ? 'tel' : undefined}
                    value={currentValue}
                    onChange={(e) => setField(step.key, e.target.value)}
                    placeholder={step.input.type === 'tel' ? '91 234 567' : step.input.placeholder}
                    sx={FIELD_SX}
                  />
                  <Box
                    component="button"
                    type="submit"
                    disabled={!canAdvance || submitting}
                    sx={{
                      flexShrink: 0,
                      px: 2.5,
                      borderRadius: '10px',
                      border: 'none',
                      bgcolor: canAdvance ? OLIVE : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: canAdvance ? 'pointer' : 'not-allowed',
                      transition: 'background-color 180ms ease',
                      '&:hover:not(:disabled)': { bgcolor: OLIVE_HOVER },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    {submitting && <CircularProgress size={14} sx={{ color: '#fff' }} />}
                    {isLastStep
                      ? (submitting ? t.projectInquiry.submitting : t.projectInquiry.submit)
                      : t.projectInquiry.next}
                  </Box>
                </Box>
              )}

              {error && (
                <Typography sx={{ mt: 1, fontSize: 12, color: '#ff8b8b' }}>{error}</Typography>
              )}

              {stepIdx > 0 && (
                <Box
                  component="button"
                  type="button"
                  onClick={goBack}
                  sx={{
                    mt: 1.2,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.6)',
                    background: 'none', border: 'none',
                    cursor: 'pointer',
                    p: 0,
                    '&:hover': { color: '#fff' },
                  }}
                >
                  ← {t.projectInquiry.back}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

function SuccessScreen({ t }) {
  const iconRef = useRef(null)
  useEffect(() => {
    if (iconRef.current) {
      gsap.fromTo(iconRef.current,
        { scale: 0, rotate: -30 },
        { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' },
      )
    }
  }, [])
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        px: 4,
        textAlign: 'center',
        bgcolor: '#0a0a0a',
      }}
    >
      <Box
        ref={iconRef}
        sx={{
          color: OLIVE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckCircleRoundedIcon sx={{ fontSize: 72 }} />
      </Box>
      <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 600, color: '#fff' }}>
        {t.projectInquiry.successTitle}
      </Typography>
      <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', maxWidth: 380 }}>
        {t.projectInquiry.successBody}
      </Typography>
    </Box>
  )
}
