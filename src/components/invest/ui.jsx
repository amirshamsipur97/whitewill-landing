/**
 * Shared UI atoms for the Persian investment / banking pages
 * (InvestmentPage + InvestmentLegalPage). Olive-luxury, Peyda, RTL-friendly.
 */
import { useState } from 'react'
import { Box, Typography, Stack, Collapse } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

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

// Premium "required documents" material: a responsive grid of cards, each with
// a tinted file icon + the document name. `icon` lets a caller swap the glyph
// (e.g. a checkmark for requirement lists). Names are usually Latin → laid LTR.
export function DocGrid({ items, icon: Icon = DescriptionOutlinedIcon, cols = 3 }) {
  return (
    <Box dir="ltr" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: `repeat(${cols}, 1fr)` }, gap: { xs: 1.5, md: 2 } }}>
      {items.map((d, i) => (
        <Box
          key={d}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.6,
            border: HAIR, borderRadius: '14px', px: { xs: 2, md: 2.4 }, py: { xs: 1.6, md: 2 },
            bgcolor: 'rgba(255,255,255,0.02)',
            backgroundImage: 'radial-gradient(120% 100% at 0% 0%, rgba(140,141,37,0.06) 0%, rgba(0,0,0,0) 60%)',
            transition: 'border-color .2s, transform .2s',
            '&:hover': { borderColor: 'rgba(140,141,37,0.45)', transform: 'translateY(-2px)' },
          }}
        >
          <Box sx={{ width: 38, height: 38, borderRadius: '11px', display: 'grid', placeItems: 'center', bgcolor: 'rgba(140,141,37,0.15)', border: '1px solid rgba(140,141,37,0.32)', flexShrink: 0 }}>
            <Icon sx={{ fontSize: 19, color: OLIVE_BRIGHT }} />
          </Box>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 13.5, md: 14.5 }, fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{d}</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.28)', ml: 'auto', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</Typography>
        </Box>
      ))}
    </Box>
  )
}

// Generic data table. `columns` = header labels, `rows` = array of cell arrays.
// Latin cells render LTR (so brand/model lists keep order); Persian cells RTL.
const hasFa = (s) => /[؀-ۿ]/.test(String(s))
export function DataTable({ columns, rows, minWidth }) {
  const n = columns.length
  const grid = n === 2 ? '1fr 1.5fr' : `repeat(${n}, 1fr)`
  return (
    <Box sx={{ overflowX: 'auto', border: HAIR, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.02)' }}>
      <Box sx={{ minWidth: minWidth || (n > 2 ? 560 : 'auto') }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: grid, gap: 1.5, px: { xs: 2, md: 3 }, py: 2, borderBottom: HAIR, bgcolor: 'rgba(255,255,255,0.03)' }}>
          {columns.map((c) => (
            <Typography key={c} sx={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: OLIVE_BRIGHT }}>{c}</Typography>
          ))}
        </Box>
        {rows.map((r, i) => (
          <Box key={i} sx={{ display: 'grid', gridTemplateColumns: grid, gap: 1.5, px: { xs: 2, md: 3 }, py: { xs: 1.6, md: 2 }, borderTop: i === 0 ? 'none' : HAIR_SOFT, alignItems: 'center' }}>
            {r.map((cell, j) => (
              <Typography key={j} dir={hasFa(cell) ? 'rtl' : 'ltr'} sx={{ fontFamily: FONT, fontSize: { xs: 13.5, md: 14.5 }, fontWeight: j === 0 ? 600 : 400, color: j === 0 ? '#fff' : 'rgba(255,255,255,0.74)', lineHeight: 1.7, textAlign: 'right' }}>{cell}</Typography>
            ))}
          </Box>
        ))}
      </Box>
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
