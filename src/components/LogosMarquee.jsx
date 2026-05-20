import { Box } from '@mui/material'

/**
 * Continuous brand marquee — transparent PNG logos straight from the
 * client's design files (high-res, no background, brand-true type).
 *
 * Layout per logo (matches the Figma "line logo" frame 180:17347):
 *
 *     ┌──────────────────────────────────────────┐
 *     │  🌾(flipped)   [LOGO]   🌾(normal)        │
 *     └──────────────────────────────────────────┘
 *
 * The laurel branch graphic asset only exists in one orientation; we
 * use CSS `transform: scaleX(-1)` to mirror it for the left side so
 * each logo is "framed" with a symmetric wreath.
 *
 * Loop trick: the row is rendered twice and translated -50% so the
 * tail of the first copy hands off seamlessly to the head of the
 * second one.
 *
 * Hover: logo scales 1.5×; the whole track pauses so the user can
 * actually read the brand they care about.
 */

const LOGOS = [
  { key: 'al-mouj',          src: '/projects/al-mouj.png',          name: 'Al Mouj Muscat' },
  { key: 'muscat-bay',       src: '/projects/muscat-bay.png',       name: 'Khaleej Muscat' },
  { key: 'dar-global',       src: '/projects/dar-global.png',       name: 'DAR Global' },
  { key: 'sustainable-city', src: '/projects/sustainable-city.png', name: 'The Sustainable City · Yiti' },
  { key: 'wadi-zaha',        src: '/projects/wadi-zaha.png',        name: 'Wadi Zaha' },
  { key: 'al-osool',         src: '/projects/al-osool.png',         name: 'Al Osool' },
]

const LOGO_H = { xs: 42, md: 62 }
const LAUREL_H = { xs: 64, md: 90 }

function Laurel({ flipped = false }) {
  return (
    <Box
      component="img"
      src="/projects/laurel.png"
      alt=""
      aria-hidden
      sx={{
        height: LAUREL_H,
        width: 'auto',
        display: 'block',
        flexShrink: 0,
        opacity: 0.95,
        // Single asset, mirrored via CSS for the "right" side.
        transform: flipped ? 'scaleX(-1)' : 'none',
      }}
    />
  )
}

function LogoBadge({ logo }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Hover scale removed per request — logos hold their size.
        cursor: 'default',
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        sx={{
          height: LOGO_H,
          width: 'auto',
          display: 'block',
          maxWidth: 'none',
        }}
      />
    </Box>
  )
}

// One logo "cell" = laurel + logo + mirrored laurel.
// Orientation matches the user's reference: leaves open INWARD toward
// the logo on both sides → the left laurel uses the raw asset (curves
// to the right, leaves opening toward the logo), and the right laurel
// is scaleX(-1) mirrored so its leaves open toward the logo as well.
function LogoCell({ logo }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, md: 2.5 },
        flexShrink: 0,
      }}
    >
      <Laurel />
      <LogoBadge logo={logo} />
      <Laurel flipped />
    </Box>
  )
}

function Row() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        // Spacing BETWEEN cells (each cell already has its own laurels
        // on both sides → keep cell-to-cell gap small).
        gap: { xs: 2, md: 4 },
        px: { xs: 1.5, md: 2.5 },
        flexShrink: 0,
      }}
    >
      {LOGOS.map((logo, i) => (
        <LogoCell key={logo.key + '-' + i} logo={logo} />
      ))}
    </Box>
  )
}

export default function LogosMarquee() {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: '#000',
        py: { xs: 4, md: 6 },
        overflow: 'hidden',
        position: 'relative',
        // Edge fade — logos enter/exit smoothly at viewport edges.
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: { xs: 32, md: 80 },
          zIndex: 2,
          pointerEvents: 'none',
        },
        '&::before': {
          left: 0,
          background: 'linear-gradient(90deg, #000, transparent)',
        },
        '&::after': {
          right: 0,
          background: 'linear-gradient(-90deg, #000, transparent)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: 'marqueeSlide 50s linear infinite',
          '&:hover': { animationPlayState: 'paused' },
          '@keyframes marqueeSlide': {
            '0%':   { transform: 'translate3d(0, 0, 0)' },
            '100%': { transform: 'translate3d(-50%, 0, 0)' },
          },
          willChange: 'transform',
        }}
      >
        <Row />
        <Row />
      </Box>
    </Box>
  )
}
