/**
 * Shared UI atoms for the Persian investment / banking pages
 * (InvestmentPage + InvestmentLegalPage). Olive-luxury, Peyda, RTL-friendly.
 */
import { useState } from 'react'
import { Box, Typography, Stack, Collapse } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

export const OLIVE = '#7c7856'
export const OLIVE_BRIGHT = '#8c8d25'
export const FONT = '"Peyda", "Arsenal SC", "Inter", system-ui, sans-serif'
export const HAIR = '1px solid rgba(255,255,255,0.1)'
export const HAIR_SOFT = '1px solid rgba(255,255,255,0.08)'

export function SectionHeading({ eyebrow, title, sx }) {
  return (
    <Box sx={{ mb: { xs: 3, md: 5 }, ...sx }}>
      {eyebrow && (
        <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: OLIVE_BRIGHT, mb: 1.5 }}>
          {eyebrow}
        </Typography>
      )}
      <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 26, md: 42 }, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#fff' }}>
        {title}
      </Typography>
    </Box>
  )
}

export function MarkerList({ items, color = OLIVE_BRIGHT, icon: Icon = CheckCircleOutlineRoundedIcon }) {
  return (
    <Stack spacing={1.1}>
      {items.map((it, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.1, alignItems: 'flex-start' }}>
          <Icon sx={{ fontSize: 18, color, mt: '3px', flexShrink: 0 }} />
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15 }, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)' }}>{it}</Typography>
        </Box>
      ))}
    </Stack>
  )
}

// Pill chips (e.g. document lists, benefits).
export function Chips({ items }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 1.2 } }}>
      {items.map((a) => (
        <Box key={a} sx={{ px: 2, py: 0.9, borderRadius: '999px', border: HAIR, bgcolor: 'rgba(255,255,255,0.03)' }}>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13.5, md: 14.5 }, color: 'rgba(255,255,255,0.82)' }}>{a}</Typography>
        </Box>
      ))}
    </Box>
  )
}

export function FaqAccordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <Box sx={{ border: HAIR, borderRadius: '16px', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.02)' }}>
      {items.map((it, i) => (
        <Box key={i} sx={{ borderTop: i === 0 ? 'none' : HAIR_SOFT }}>
          <Box
            onClick={() => setOpen(open === i ? -1 : i)}
            sx={{ display: 'flex', alignItems: 'center', gap: 2, px: { xs: 2.5, md: 3.5 }, py: { xs: 2, md: 2.6 }, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.015)' } }}
          >
            <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 15.5, md: 17 }, fontWeight: 600, color: '#fff', flex: 1, lineHeight: 1.6 }}>{it.q}</Typography>
            {open === i ? <RemoveRoundedIcon sx={{ color: OLIVE_BRIGHT, fontSize: 22, flexShrink: 0 }} /> : <AddRoundedIcon sx={{ color: OLIVE_BRIGHT, fontSize: 22, flexShrink: 0 }} />}
          </Box>
          <Collapse in={open === i}>
            <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14.5, md: 15.5 }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.9, px: { xs: 2.5, md: 3.5 }, pb: { xs: 2.5, md: 3 } }}>{it.a}</Typography>
          </Collapse>
        </Box>
      ))}
    </Box>
  )
}
