import { forwardRef, useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { gsap } from 'gsap'
import { useI18n } from '../i18n.jsx'

/**
 * GlobalPresencePanel — flush-left overlay that appears at the START of
 * the AKDT video. Lists Irfan Investment's four global branches; each
 * card expands with a GSAP-driven height tween + icon rotation when
 * tapped. Timeline indicator on the left fills 01→04 in lock-step with
 * scroll (parent owns that tween via the `progressRef` passed in).
 *
 * Design (Figma):
 *   - 267:15737 + 267:15810 — layout + collapsed/expanded states
 *   - 279:17052 — timeline indicator
 *   - 279:17065 — + / × icon
 *
 * Look & feel:
 *   - Panel sits flush against the LEFT edge of the video card (no
 *     floating gap, no left-side rounding).
 *   - Subtle animated film-grain SVG overlay shifts every few seconds
 *     for a "live" texture feel — kept low opacity so it never fights
 *     the content.
 */

const GlobalPresencePanel = forwardRef(function GlobalPresencePanel(
  { progressRef, expandedId: controlledExpandedId, onChangeExpanded },
  ref,
) {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar' || lang === 'fa'

  // Order: Muscat → Tehran → Hong Kong → Moscow (matches Figma + the
  // user's scroll-progress mapping: 01 Oman, 02 Iran, 03 China, 04 Russia).
  const branches = [
    { id: 'muscat',   flag: '/flags/om.svg', eyebrow: t.globalPresencePanel.muscatEyebrow, title: t.globalPresencePanel.muscatTitle,   desc: t.globalPresencePanel.muscatDesc },
    { id: 'tehran',   flag: '/flags/ir.svg', eyebrow: null,                                 title: t.globalPresencePanel.tehranTitle,   desc: t.globalPresencePanel.tehranDesc },
    { id: 'hongKong', flag: '/flags/cn.svg', eyebrow: null,                                 title: t.globalPresencePanel.hongKongTitle, desc: t.globalPresencePanel.hongKongDesc },
    { id: 'moscow',   flag: '/flags/ru.svg', eyebrow: null,                                 title: t.globalPresencePanel.moscowTitle,   desc: t.globalPresencePanel.moscowDesc },
  ]
  // Tall enough to fit the new eyebrow + title comfortably and to give
  // the timeline progress line real vertical room.
  const CARD_COLLAPSED_HEIGHT = 124

  // Controlled / uncontrolled hybrid: if a parent passes `expandedId`,
  // we use it (scroll-driven auto-expand). Otherwise fall back to local
  // state for click-driven toggling (default: Muscat open).
  const [internalExpandedId, setInternalExpandedId] = useState('muscat')
  const expandedId = controlledExpandedId !== undefined ? controlledExpandedId : internalExpandedId
  const setExpandedId = (next) => {
    if (onChangeExpanded) onChangeExpanded(next)
    if (controlledExpandedId === undefined) setInternalExpandedId(next)
  }

  // Per-card refs collected by id so GSAP can target individual elements
  // without React.Children walking.
  const wrapRefs = useRef({})       // outer card box — height tween target
  const iconRefs = useRef({})       // + / × icon — rotation tween target
  const descRefs = useRef({})       // description block — opacity tween + measured height

  // Drive every per-card animation through GSAP when expandedId changes.
  // We use height: 'auto' so the tween reaches the natural expanded
  // height without us having to measure manually.
  useEffect(() => {
    branches.forEach((b) => {
      const wrap = wrapRefs.current[b.id]
      const icon = iconRefs.current[b.id]
      const desc = descRefs.current[b.id]
      if (!wrap || !icon || !desc) return

      const expanded = b.id === expandedId

      // Icon rotates between + (0°) and × (45°)
      gsap.to(icon, {
        rotation: expanded ? 45 : 0,
        duration: 0.42,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })

      // Description fades + slides slightly so it doesn't pop in
      gsap.to(desc, {
        opacity: expanded ? 1 : 0,
        y: expanded ? 0 : -4,
        duration: 0.32,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      // Card height — GSAP supports 'auto' as a target value
      gsap.to(wrap, {
        height: expanded ? 'auto' : CARD_COLLAPSED_HEIGHT,
        duration: 0.46,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    })
  }, [expandedId])

  // Set initial state on mount: Muscat open, others collapsed.
  useEffect(() => {
    branches.forEach((b) => {
      const wrap = wrapRefs.current[b.id]
      const icon = iconRefs.current[b.id]
      const desc = descRefs.current[b.id]
      if (!wrap || !icon || !desc) return
      const expanded = b.id === expandedId
      gsap.set(wrap, { height: expanded ? 'auto' : 92 })
      gsap.set(icon, { rotation: expanded ? 45 : 0 })
      gsap.set(desc, { opacity: expanded ? 1 : 0, y: expanded ? 0 : -4 })
    })
    // Intentionally only run once on mount — subsequent updates handled above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = (id) => setExpandedId((cur) => (cur === id ? null : id))

  return (
    <Box
      ref={ref}
      sx={{
        position: 'absolute',
        // Flush against the left edge of the section (left edge of the
        // fullscreen video card when pinned). No floating gap.
        top: 0,
        bottom: 0,
        ...(isRTL ? { right: 0 } : { left: 0 }),
        width: { xs: '92%', sm: '70%', md: 'min(520px, 30vw)' },
        zIndex: 8,
        pointerEvents: 'auto',
        bgcolor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        // Only right edge gets a border (and only-right rounded corner)
        // so the panel reads as one slab attached to the video.
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '40px 0 80px -20px rgba(0,0,0,0.55)',
        px: { xs: 2.5, md: 4 },
        py: { xs: 4, md: 6 },
        color: '#fff',
        opacity: 0,                // GSAP-controlled
        willChange: 'transform, opacity',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        direction: isRTL ? 'rtl' : 'ltr',

        // ── Live film-grain overlay ─────────────────────────────────
        // SVG noise drawn through a pseudo-element so it stays behind
        // the text. We animate `background-position` (not transform) so
        // the noise PATTERN shifts inside the box while the box itself
        // stays fixed — no more visible jumps outside the panel edges.
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.15,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1, 0 0 0 0 1, 0 0 0 0 1, 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
          animation: 'gp-grain-shift 1s steps(10) infinite',
        },
        '@keyframes gp-grain-shift': {
          '0%':   { backgroundPosition: '0 0' },
          '10%':  { backgroundPosition: '-32px 22px' },
          '20%':  { backgroundPosition: '14px -40px' },
          '30%':  { backgroundPosition: '-58px 8px' },
          '40%':  { backgroundPosition: '24px 36px' },
          '50%':  { backgroundPosition: '-20px -28px' },
          '60%':  { backgroundPosition: '40px 14px' },
          '70%':  { backgroundPosition: '-12px -48px' },
          '80%':  { backgroundPosition: '34px 30px' },
          '90%':  { backgroundPosition: '-26px -10px' },
          '100%': { backgroundPosition: '0 0' },
        },
      }}
    >
      {/* Title block */}
      <Box sx={{ mb: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Typography
          component="h3"
          sx={{
            fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: { xs: 22, md: 26 },
            lineHeight: 1.1,
            m: 0,
            color: '#fff',
          }}
        >
          {t.globalPresencePanel.title}
        </Typography>
        <Typography
          component="p"
          sx={{
            fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
            fontWeight: 400,
            fontSize: { xs: 14, md: 16 },
            lineHeight: 1.3,
            mt: { xs: 1.25, md: 1.5 },
            mb: 0,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          }}
        >
          {t.globalPresencePanel.subtitle}
        </Typography>
        <Typography
          component="p"
          sx={{
            fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
            fontWeight: 400,
            fontSize: { xs: 11.5, md: 12 },
            lineHeight: 1.55,
            mt: { xs: 1.5, md: 2 },
            mb: 0,
            color: 'rgba(255,255,255,0.78)',
          }}
        >
          {t.globalPresencePanel.body}
        </Typography>
      </Box>

      {/* Timeline + cards row */}
      <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, alignItems: 'stretch', position: 'relative', zIndex: 1 }}>
        {/*
          Vertical timeline indicator (Figma node 279:17052).
          Two PARALLEL columns so the numbers don't sit on top of the
          line — a clear horizontal gap separates them visually (per
          user request: «بین خط timeline و شماره ها فاصله باشد»):

            ┌───────┬────┬─────────┐
            │ 01    │    │   ┃     │
            │       │    │   ┃     │  ← bright fg (scaleY 0→1)
            │ 02    │    │   │     │  ← dim bg (full height)
            │       │    │   │     │
            │ 03    │    │   │     │
            │       │    │   │     │
            │ 04    │    │   │     │
            └───────┴────┴─────────┘
              numbers   gap   line
        */}
        <Box
          aria-hidden
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 1.25,   // visible horizontal gap between numbers and line
          }}
        >
          {/* Left: numbers stacked with space-between */}
          <Box
            sx={{
              width: 22,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fff',
              fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 400,
              py: 0.5,
              lineHeight: '26px',
            }}
          >
            {['01', '02', '03', '04'].map((n) => (
              <Box key={n}>{n}</Box>
            ))}
          </Box>

          {/* Right: continuous line with dim bg + bright fg progress */}
          <Box
            sx={{
              position: 'relative',
              width: 1,
              alignSelf: 'stretch',
              my: 1,       // small top/bottom inset so the line doesn't kiss the column edges
            }}
          >
            {/* Background dim line */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                width: '1px',
                bgcolor: 'rgba(255,255,255,0.22)',
              }}
            />
            {/* Foreground bright line — GSAP scrubs scaleY 0 → 1 */}
            <Box
              ref={progressRef}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '1px',
                bgcolor: '#fff',
                transformOrigin: 'top center',
                willChange: 'transform',
              }}
            />
          </Box>
        </Box>

        {/* Cards column */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {branches.map((b, i) => {
            const isFirst = i === 0
            const isLast = i === branches.length - 1
            return (
              <Box
                key={b.id}
                ref={(el) => { wrapRefs.current[b.id] = el }}
                sx={{
                  border: '1px solid rgba(255,255,255,0.30)',
                  borderTopWidth: isFirst ? 1 : 0,
                  borderBottomWidth: isLast ? 1 : 0,
                  overflow: 'hidden',
                  // No CSS transition — GSAP handles height tween for
                  // a smoother curve and no jump on mount.
                }}
              >
                {/* Card header — always visible */}
                <Box
                  component="button"
                  type="button"
                  onClick={() => toggle(b.id)}
                  sx={{
                    width: '100%',
                    height: CARD_COLLAPSED_HEIGHT,
                    px: { xs: 2, md: 2.5 },
                    py: 1.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.75, md: 2.25 },
                    bgcolor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: isRTL ? 'right' : 'left',
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                    '&:focus-visible': {
                      outline: '2px solid rgba(255,255,255,0.5)',
                      outlineOffset: -2,
                    },
                  }}
                >
                  {/* Flag — slightly larger to match the taller card */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 56,
                      height: 38,
                      overflow: 'hidden',
                      borderRadius: '2px',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                      bgcolor: '#fff',
                    }}
                  >
                    <Box
                      component="img"
                      src={b.flag}
                      alt=""
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>

                  {/* Eyebrow (Muscat only) + title */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {b.eyebrow && (
                      <Typography
                        component="div"
                        sx={{
                          fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                          fontWeight: 500,
                          fontSize: { xs: 10.5, md: 11.5 },
                          lineHeight: 1.2,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'rgba(255,255,255,0.7)',
                          mb: 0.75,
                        }}
                      >
                        {b.eyebrow}
                      </Typography>
                    )}
                    <Typography
                      component="div"
                      sx={{
                        fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                        fontWeight: 700,
                        fontSize: { xs: 15, md: 17 },
                        lineHeight: 1.15,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        color: '#fff',
                      }}
                    >
                      {b.title}
                    </Typography>
                  </Box>

                  {/* + / × icon (Figma node 279:17065) — GSAP rotates 0° ↔ 45° */}
                  <Box
                    aria-hidden
                    sx={{
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      ref={(el) => { iconRefs.current[b.id] = el }}
                      component="img"
                      src="/icons/plus-cross.svg"
                      alt=""
                      sx={{
                        width: 16,
                        height: 16,
                        display: 'block',
                        // Make the SVG's currentColor strokes follow this
                        // color (it uses var(--stroke-0, white)) — already
                        // white by default so no override needed.
                        willChange: 'transform',
                      }}
                    />
                  </Box>
                </Box>

                {/* Card description — spans FULL WIDTH of the card
                    (extends under the flag) per user request:
                    «نوشته رو در تمام سکشن‌ها تا زیر پرچم برام قرار بده». */}
                <Box
                  ref={(el) => { descRefs.current[b.id] = el }}
                  sx={{
                    px: { xs: 2, md: 2.5 },
                    pb: 2.5,
                    pt: 0.5,
                    willChange: 'opacity, transform',
                  }}
                >
                  <Typography
                    component="p"
                    sx={{
                      fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                      fontWeight: 400,
                      fontSize: { xs: 13, md: 14 },
                      lineHeight: 1.55,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.86)',
                      m: 0,
                      textAlign: 'justify',
                    }}
                  >
                    {b.desc}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
})

export default GlobalPresencePanel
