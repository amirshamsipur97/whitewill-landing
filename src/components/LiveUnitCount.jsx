/**
 * LiveUnitCount — the big counting number under the hero.
 *
 * WHY IT IS LIVE AND NOT A CONSTANT: this site has been bitten twice by
 * hardcoded inventory numbers going stale (the 473 → 478 sweep on 2026-08-18
 * touched two files). The count comes from `fetchAvailableUnitCount()`, a
 * head-only PostgREST request that returns an integer and no body, so it costs
 * essentially nothing above the fold. FALLBACK is the last verified figure, so
 * a failed request shows a slightly stale number rather than a zero or a gap.
 *
 * WHY IT IS NOT INSIDE ScrollVideoHero: that hero is pinned for 500vh and its
 * text stages are driven by a scrubbed GSAP timeline with hand-tuned centering.
 * Adding a block inside it would mean re-tuning that timeline. This sits in its
 * own band immediately after, where its animation is independent.
 *
 * MOTION, and the three traps it avoids:
 *  1. GSAP drives the tween, not a bespoke rAF loop. gsap.ticker is already
 *     shared site-wide (see ScrollVideoHero's header note), so this adds no
 *     second animation loop.
 *  2. It fires from ScrollTrigger `once: true`, so the number never re-counts
 *     while the visitor scrolls back and forth.
 *  3. `prefers-reduced-motion` and a hidden tab both SNAP to the final value.
 *     A count-up that starts in a background tab would otherwise be discovered
 *     mid-animation, or stuck at zero.
 *
 * No pinning anywhere here, deliberately: the pin-spacer crash on route change
 * is a known hazard in this repo.
 *
 * ══ WHY THIS SAYS 478 WHILE /project SAYS 373 ══
 * Both are correct and they measure different things. This counts UNITS. The
 * portal collapses near-identical units into one card, keyed
 * `project_id|typeGroup|bedrooms|round(price)` (SearchPage.jsx), and shows a
 * count badge on the card, so 478 units render as 373 listings.
 * The owner chose on 2026-08-18 to keep the true unit count here and make the
 * sub-line say what the portal does, rather than shrink this number.
 * 🚨 Do NOT "fix" 478 down to 373: it is not a bug, and the sub-line is what
 * keeps the pair honest. If you change one, change the other.
 */
import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n'
import { LocalizedLink } from '../lib/localize'
import { fetchAvailableUnitCount } from '../supabase'

gsap.registerPlugin(ScrollTrigger)

const OLIVE_BRIGHT = '#8c8d25'
const TITLE_FONT = '"Arsenal SC", "Peyda", "Manrope", "Inter", system-ui, sans-serif'

// Last verified count, 2026-08-18. Only ever shown if the count request fails.
const FALLBACK = 478

const COPY = {
  en: {
    eyebrow: 'Live inventory',
    lead: 'units available right now',
    sub: 'Straight from the developer inventory, updated as units sell. Identical units share one listing in the portal, so you will see fewer cards than units.',
    cta: 'Choose your unit now',
  },
  ru: {
    eyebrow: 'Живой фонд',
    lead: 'объектов доступно прямо сейчас',
    sub: 'Напрямую из фонда застройщика, обновляется по мере продаж. В портале одинаковые объекты объединены в одну карточку, поэтому карточек меньше, чем объектов.',
    cta: 'Выберите свой объект',
  },
  ar: {
    eyebrow: 'المخزون الحي',
    lead: 'وحدة متاحة الآن',
    sub: 'مباشرة من مخزون المطوّر ويُحدَّث مع بيع الوحدات. في البوابة تُجمع الوحدات المتطابقة في إعلان واحد، فيظهر عدد البطاقات أقل من عدد الوحدات.',
    cta: 'اختر وحدتك الآن',
  },
  fa: {
    eyebrow: 'موجودی زنده',
    lead: 'واحد همین الان موجود است',
    sub: 'مستقیم از انبار سازنده و با فروش هر واحد به‌روز می‌شود. در پورتال، واحدهای یکسان زیر یک آگهی جمع می‌شوند، پس تعداد کارت‌ها از تعداد واحدها کمتر است.',
    cta: 'همین الان واحد خود را انتخاب کنید',
  },
}

// Persian articles on this site use Persian digits; Arabic ones use Latin.
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const formatCount = (n, lang) => {
  const s = String(Math.round(n))
  return lang === 'fa' ? s.replace(/\d/g, (d) => FA_DIGITS[+d]) : s
}

export default function LiveUnitCount() {
  const { lang } = useI18n()
  const c = COPY[lang] || COPY.en
  const isRTL = lang === 'ar' || lang === 'fa'

  const [target, setTarget] = useState(null)
  const sectionRef = useRef(null)
  const numberRef = useRef(null)
  const ruleRef = useRef(null)
  const tailRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetchAvailableUnitCount()
      .then((n) => { if (!cancelled) setTarget(n && n > 0 ? n : FALLBACK) })
      .catch(() => { if (!cancelled) setTarget(FALLBACK) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (target == null || !numberRef.current || !sectionRef.current) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const paint = (v) => { numberRef.current.textContent = formatCount(v, lang) }

    // Snap, never animate, when motion is unwelcome or nobody is looking.
    if (reduced || document.visibilityState === 'hidden') {
      paint(target)
      gsap.set([ruleRef.current, tailRef.current], { opacity: 1, scaleX: 1, y: 0 })
      return
    }

    paint(0)
    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      tl.fromTo(
        numberRef.current,
        { opacity: 0, y: 26, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
      )
        .to(counter, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => paint(counter.v),
          onComplete: () => paint(target),
        }, '<')
        // The rule draws out from the centre as the number lands.
        .fromTo(ruleRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.out' }, '<0.35')
        .fromTo(tailRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '<0.25')
    }, sectionRef)

    return () => ctx.revert()
  }, [target, lang])

  const Arrow = isRTL ? ArrowBackRoundedIcon : ArrowForwardRoundedIcon

  return (
    <Box
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      sx={{
        bgcolor: '#000',
        color: '#fff',
        py: { xs: 8, md: 14 },
        px: 2,
        textAlign: 'center',
        overflow: 'hidden',
        backgroundImage:
          'radial-gradient(120% 90% at 50% 0%, rgba(140,141,37,0.10) 0%, rgba(0,0,0,0) 62%)',
      }}
    >
      <Typography
        sx={{
          fontFamily: TITLE_FONT, fontSize: 12.5, fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: OLIVE_BRIGHT, mb: { xs: 2, md: 3 },
        }}
      >
        {c.eyebrow}
      </Typography>

      <Typography
        ref={numberRef}
        component="div"
        aria-label={`${target ?? FALLBACK} ${c.lead}`}
        sx={{
          fontFamily: TITLE_FONT,
          fontWeight: 700,
          // Deliberately huge: this is the one number the page is built around.
          fontSize: { xs: '5.5rem', sm: '8rem', md: '12rem', lg: '14rem' },
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          color: '#fff',
          textShadow: '0 6px 60px rgba(140,141,37,0.28)',
          fontVariantNumeric: 'tabular-nums',
          willChange: 'opacity, transform, filter',
        }}
      >
        {formatCount(target ?? FALLBACK, lang)}
      </Typography>

      <Box
        ref={ruleRef}
        sx={{
          width: { xs: 180, md: 320 }, height: 2, mx: 'auto', mt: { xs: 2.5, md: 3.5 },
          background: `linear-gradient(90deg, rgba(140,141,37,0) 0%, ${OLIVE_BRIGHT} 50%, rgba(140,141,37,0) 100%)`,
          transformOrigin: 'center',
        }}
      />

      <Box ref={tailRef} sx={{ willChange: 'opacity, transform' }}>
        <Typography
          component="p"
          sx={{
            fontFamily: TITLE_FONT, fontWeight: 600,
            fontSize: { xs: '1.35rem', md: '2rem' },
            mt: { xs: 2.5, md: 3.5 }, mb: 1.5, color: '#fff',
          }}
        >
          {c.lead}
        </Typography>

        <Typography
          sx={{
            maxWidth: 620, mx: 'auto',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.9, color: 'rgba(255,255,255,0.62)',
          }}
        >
          {c.sub}
        </Typography>

        <Button
          component={LocalizedLink}
          to="/project"
          endIcon={<Arrow />}
          sx={{
            mt: { xs: 3.5, md: 5 },
            fontFamily: TITLE_FONT, fontSize: { xs: 15, md: 17 }, fontWeight: 700,
            color: '#000', bgcolor: OLIVE_BRIGHT,
            px: { xs: 3.4, md: 4.4 }, py: { xs: 1.4, md: 1.7 }, borderRadius: '999px',
            textTransform: 'none',
            transition: 'transform .2s, background-color .2s, box-shadow .2s',
            '&:hover': {
              bgcolor: '#a0a12b', transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(140,141,37,0.35)',
            },
          }}
        >
          {c.cta}
        </Button>
      </Box>
    </Box>
  )
}
