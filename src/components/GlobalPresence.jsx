import { useEffect, useMemo, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * GLOBAL PRESENCE — short editorial text block sitting between the
 * AthurayaCity section and the AKDT scroll-video section.
 *
 * Reuses DiscoverProperties' character-color-reveal pattern (Figma node
 * 274:17048): every character starts dim (#333030) and tweens to white
 * one-by-one as the block scrolls into view. Tied to scroll via
 * `scrub`, so the reveal reverses naturally when scrolling back up.
 *
 *   start: 'top 85%'   — fade begins as the block enters from bottom
 *   end:   'top 25%'   — fully revealed by the time it's near the top
 */
export default function GlobalPresence() {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar'

  const sectionRef = useRef(null)

  // Fixed-slot ref array — index-based so React re-renders don't wipe it.
  const charsRef = useRef([])
  const setCharRef = (i) => (el) => {
    if (el) charsRef.current[i] = el
  }

  // Pre-compute the flat list of characters across all 4 segments.
  // Segment 0 = title; segments 1/2/3 = body prefix / bold name / suffix.
  const segments = useMemo(
    () => [
      { text: t.globalPresence.title, where: 'title', bold: true },
      { text: t.globalPresence.bodyPrefix, where: 'body', bold: false },
      { text: t.globalPresence.bodyName, where: 'body', bold: true },
      { text: t.globalPresence.bodySuffix, where: 'body', bold: false },
    ],
    [t.globalPresence],
  )

  // Split into reveal "units" — the smallest chunk that gets its own
  // ref + stagger slot:
  //   • EN / RU: one unit per character (classic per-letter wave).
  //   • AR: one unit per WORD, preserving any whitespace as separate
  //     units so visual spacing stays right. Why words: Arabic
  //     letters rely on the OpenType shaping engine seeing adjacent
  //     letters in the SAME text run. Char-level splitting wraps
  //     every letter in `display:inline-block`, which breaks initial
  //     /medial/final glyph substitution and reorders embedded Latin
  //     via the bidi algorithm (IRFAN INVESTMENT → TNEMTSEVNI NAFRI).
  //     Word-level split keeps each word as one text run, so shaping
  //     and bidi work normally, while still giving the stagger
  //     animation multiple targets to wave across.
  const allChars = useMemo(() => {
    const out = []
    segments.forEach((seg, sIdx) => {
      const parts = isRTL
        ? seg.text.split(/(\s+)/).filter((p) => p.length > 0)
        : seg.text.split('')
      parts.forEach((char, cIdx) => {
        out.push({ char, sIdx, cIdx, where: seg.where, bold: seg.bold })
      })
    })
    return out
  }, [segments, isRTL])

  // Split for rendering: title chars on top line, body chars in paragraph.
  const titleChars = allChars.filter((c) => c.where === 'title')
  const bodyChars = allChars.filter((c) => c.where === 'body')
  // Offsets into the global ref array — title comes first.
  const titleOffset = 0
  const bodyOffset = titleChars.length

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(charsRef.current, { color: '#333030' })

      gsap.to(charsRef.current, {
        color: '#FFFFFF',
        duration: 0.2,
        // Tighter stagger than DiscoverProperties (0.022 → 0.012) so a
        // longer text — title + ~150 body chars — still finishes within
        // the trigger range without leaving trailing chars dim.
        // In RTL we have ~20 words instead of ~150 chars, so each
        // word can take a bigger slice of the timeline (looks the
        // same to the eye).
        stagger: { each: isRTL ? 0.06 : 0.012, from: 'start' },
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 0.3,
          onLeave: () => gsap.set(charsRef.current, { color: '#FFFFFF' }),
          onLeaveBack: () => gsap.set(charsRef.current, { color: '#333030' }),
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [lang]) // re-run on language change so the new chars get refs + initial color

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        position: 'relative',
        bgcolor: '#000',
        color: '#fff',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6 },
        textAlign: 'center',
        direction: isRTL ? 'rtl' : 'ltr',
        overflow: 'hidden',

        // ── Decorative stroke-only background pattern (Figma 286:18310) ──
        // Subtle interlocking vesica shapes drawn as a wide horizontal
        // band behind the text. Painted via ::before so we can hold the
        // pattern at a low opacity without affecting the foreground
        // content's color, and let it bleed full-bleed to the edges.
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/patterns/global-presence.svg')`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center center',
          backgroundSize: 'auto 100%',
          opacity: 0.55,
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ maxWidth: 1227, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: { xs: 20, md: 28 },
            lineHeight: 1.2,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            m: 0,
            mb: { xs: 3, md: 3.5 },
          }}
        >
          {titleChars.map((c, i) => (
            <Box
              key={`title-${i}`}
              component="span"
              ref={setCharRef(titleOffset + i)}
              sx={{
                display: 'inline-block',
                whiteSpace: 'pre',
                color: '#333030',
                willChange: 'color',
              }}
            >
              {c.char}
            </Box>
          ))}
        </Typography>

        <Typography
          component="p"
          sx={{
            fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
            fontWeight: 400,
            fontSize: { xs: 16, md: 26 },
            lineHeight: 1.5,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            m: 0,
            mx: 'auto',
            maxWidth: 1100,
          }}
        >
          {bodyChars.map((c, i) => (
            <Box
              key={`body-${i}`}
              component="span"
              ref={setCharRef(bodyOffset + i)}
              sx={{
                display: 'inline-block',
                whiteSpace: 'pre',
                color: '#333030',
                fontWeight: c.bold ? 700 : 400,
                willChange: 'color',
              }}
            >
              {c.char}
            </Box>
          ))}
        </Typography>
      </Box>
    </Box>
  )
}
