import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'

/**
 * BackToTop — fixed-position pill that scrolls the page back to the very
 * top. Appears once the user has scrolled past one viewport-height so it
 * never clutters the hero. Sits centred at the bottom of the viewport
 * with a comfortable safe-area inset on iOS Safari.
 *
 * Smooth scroll uses Lenis if it's mounted (the rest of the site rides
 * on Lenis already, see main.jsx), otherwise it falls back to the
 * browser's native smooth scroll so it still works in any context the
 * component is dropped into.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Box
      component="button"
      type="button"
      aria-label="Back to top"
      onClick={handleClick}
      sx={{
        position: 'fixed',
        left: '50%',
        // `env(safe-area-inset-bottom)` keeps the button clear of the iOS
        // home indicator. 22px otherwise.
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 22px)',
        transform: visible
          ? 'translate(-50%, 0) scale(1)'
          : 'translate(-50%, 18px) scale(0.85)',
        zIndex: 1500,
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition:
          'opacity 280ms ease, transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1), background-color 200ms ease, box-shadow 200ms ease',
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.18)',
        bgcolor: 'rgba(20,20,20,0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45), 0 0 0 4px rgba(140,141,37,0.0)',
        '&:hover': {
          bgcolor: 'rgba(40,40,40,0.92)',
          borderColor: 'rgba(255,255,255,0.32)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.5), 0 0 0 4px rgba(140,141,37,0.18)',
        },
        '&:active': {
          transform: visible ? 'translate(-50%, 1px) scale(0.96)' : undefined,
        },
        '&:focus-visible': {
          outline: '2px solid #8c8d25',
          outlineOffset: 3,
        },
      }}
    >
      <KeyboardArrowUpRoundedIcon sx={{ fontSize: 26 }} />
    </Box>
  )
}
