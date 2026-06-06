/**
 * CarCarousel — horizontal, snap-scrolling showcase of car models for the
 * car-import page. Each card shows the car image (when provided), brand and
 * model. Image-less items fall back to a placeholder so the carousel works
 * before the real photos are added.
 */
import { useRef } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { FONT, OLIVE_BRIGHT, HAIR, HAIR_SOFT } from './invest/ui'

export default function CarCarousel({ items = [] }) {
  const ref = useRef(null)
  const scroll = (dir) => {
    const el = ref.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        ref={ref}
        sx={{
          display: 'flex', gap: { xs: 2, md: 2.5 }, overflowX: 'auto',
          scrollSnapType: 'x mandatory', pb: 1,
          scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map((c, i) => (
          <Box key={i} sx={{ flex: '0 0 auto', width: { xs: 230, md: 290 }, scrollSnapAlign: 'start' }}>
            <Box
              sx={{
                position: 'relative', aspectRatio: '16 / 10', borderRadius: '16px',
                overflow: 'hidden', mb: 1.5,
                border: HAIR,
                backgroundImage: 'radial-gradient(80% 70% at 60% 40%, rgba(230,237,245,0.10) 0%, rgba(230,237,245,0) 70%), linear-gradient(153deg, rgba(20,21,24,0.9) 0%, rgba(10,11,13,0.95) 100%)',
                boxShadow: 'inset 0 1px 1px 1px rgba(255,255,255,0.08)',
                display: 'grid', placeItems: 'center',
              }}
            >
              {c.image
                ? <Box component="img" src={c.image} alt={`${c.brand} ${c.model}`} loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                : <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 52, color: 'rgba(255,255,255,0.18)' }} />}
            </Box>
            <Typography dir="ltr" sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: OLIVE_BRIGHT, textAlign: 'right' }}>{c.brand}</Typography>
            <Typography dir="ltr" sx={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: '#fff', textAlign: 'right' }}>{c.model}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <IconButton onClick={() => scroll(-1)} aria-label="بعدی" sx={{ border: HAIR_SOFT, color: '#fff', '&:hover': { borderColor: OLIVE_BRIGHT } }}><ChevronRightRoundedIcon /></IconButton>
        <IconButton onClick={() => scroll(1)} aria-label="قبلی" sx={{ border: HAIR_SOFT, color: '#fff', '&:hover': { borderColor: OLIVE_BRIGHT } }}><ChevronLeftRoundedIcon /></IconButton>
      </Box>
    </Box>
  )
}
