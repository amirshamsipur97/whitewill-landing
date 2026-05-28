/**
 * BuyFiltersModal — full-screen filter sheet for the /buy page.
 *
 * Structure mirrors the reference design (Bedrooms tabs, Search,
 * Property type, Price slider, Area slider, Floor slider, City chips,
 * Property type chips, Reset / Show options footer). Styled with the
 * site's existing dark palette + olive accent so it lives inside the
 * brand instead of looking grafted on.
 *
 * Filters compose project-level: a project passes if it has at least
 * one available unit matching every active filter. The visible chip
 * count in the footer reflects this composed result.
 */

import { useMemo } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Slider,
  Stack,
  Typography,
  InputBase,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useI18n } from '../i18n.jsx'

const OLIVE = '#7c7856'
const OLIVE_BRIGHT = '#8c8d25'

// Hard-coded boundaries — picked to comfortably cover the current
// inventory range (48k–900k OMR, 52–501 m²) while still giving the
// user a meaningful slider step. Update whenever inventory shifts.
const PRICE_MIN = 0
const PRICE_MAX = 1_000_000
const AREA_MIN = 0
const AREA_MAX = 600
const FLOOR_MIN = 0
const FLOOR_MAX = 50

export const DEFAULT_FILTERS = {
  bedrooms: 'any',           // 'any' | 'S' | 1 | 2 | 3 | 4
  search: '',
  propertyType: 'all',       // 'all' | 'Apartment' | 'Villa' | 'Townhouse' | 'Studio' | 'Penthouse'
  priceRange: [PRICE_MIN, PRICE_MAX],
  areaRange: [AREA_MIN, AREA_MAX],
  floorMax: FLOOR_MAX,
  city: 'all',               // 'all' | 'Muscat' | 'Salalah' | 'Sohar' | …
}

const BEDROOM_TABS = [
  { v: 'S',  label: 'S' },
  { v: 1,    label: '1' },
  { v: 2,    label: '2' },
  { v: 3,    label: '3' },
  { v: 4,    label: '4+' },
]

// Property type chips: `v` is the canonical bucket used by the
// filter logic (English category names), `key` is the i18n key used
// to fetch the localized display label.
const PROPERTY_TYPES = [
  { v: 'all',        key: 'showAll' },
  { v: 'Apartment',  key: 'apartments' },
  { v: 'Villa',      key: 'villas' },
  { v: 'Townhouse',  key: 'townhouses' },
  { v: 'Studio',     key: 'studios' },
  { v: 'Penthouse',  key: 'penthouses' },
]

const fmtOmr = (n) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)

// Map a unit to one of the PROPERTY_TYPES values. Inventory uses
// project-specific labels (e.g. "Apartment 1BHK", "Sky Villa", "Sky
// Residence") — collapse them into the broad bucket the user filters by.
function categoryOf(unit) {
  const t = (unit.unit_type || '').toLowerCase()
  if (t.includes('studio')) return 'Studio'
  if (t.includes('penthouse') || t.includes('sky palace')) return 'Penthouse'
  if (t.includes('townhouse')) return 'Townhouse'
  if (t.includes('villa')) return 'Villa'
  return 'Apartment'
}

// Does a single unit pass the active filter set? Used by the page to
// decide whether a project (= a group of units) has any match.
export function unitPasses(unit, filters) {
  if (unit.availability_status !== 'available' && unit.availability_status !== 'reserved') return false

  if (filters.bedrooms !== 'any') {
    const b = unit.bedrooms
    if (filters.bedrooms === 'S') {
      if (b !== 0) return false
    } else if (filters.bedrooms === 4) {
      if (b == null || b < 4) return false
    } else {
      if (b !== filters.bedrooms) return false
    }
  }

  if (filters.propertyType !== 'all' && categoryOf(unit) !== filters.propertyType) return false

  const price = Number(unit.price_omr)
  if (Number.isFinite(price) && price > 0) {
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
  } else if (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) {
    return false
  }

  const area = Number(unit.total_area_sqm ?? unit.internal_area_sqm)
  if (Number.isFinite(area) && area > 0) {
    if (area < filters.areaRange[0] || area > filters.areaRange[1]) return false
  }

  return true
}

// Does a project pass the project-level filters (search, city)?
// Unit-level filters are checked separately so we can report whether
// the project has matching inventory.
function projectPassesText(project, filters) {
  if (filters.city !== 'all') {
    const city = project.area?.city || ''
    if (city !== filters.city) return false
  }
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    const hay = [
      project.name,
      project.location,
      project.area?.name,
      project.area?.city,
      project.developer?.name,
    ].filter(Boolean).join(' ').toLowerCase()
    if (!hay.includes(q)) return false
  }
  return true
}

// Count the projects that pass — shown in the footer button.
export function countMatchingProjects(projects, unitsByProject, filters) {
  return projects.reduce((n, p) => {
    if (!projectPassesText(p, filters)) return n
    const units = unitsByProject.get(p.id) || []
    // If no unit-level filter is active, count the project as long as
    // it has any inventory at all — otherwise require at least one
    // unit passes.
    const noUnitFilter =
      filters.bedrooms === 'any' &&
      filters.propertyType === 'all' &&
      filters.priceRange[0] === PRICE_MIN && filters.priceRange[1] === PRICE_MAX &&
      filters.areaRange[0] === AREA_MIN && filters.areaRange[1] === AREA_MAX
    if (noUnitFilter) return n + 1
    return units.some(u => unitPasses(u, filters)) ? n + 1 : n
  }, 0)
}

// ───────────── Building blocks ─────────────

function Section({ children, sx }) {
  return <Box sx={{ mb: 4, ...sx }}>{children}</Box>
}

function Label({ children, hint }) {
  return (
    <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 1.5 }}>
      <Typography
        sx={{
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.92)',
        }}
      >
        {children}
      </Typography>
      {hint && (
        <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)' }}>
          {hint}
        </Typography>
      )}
    </Stack>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        border: '1px solid',
        borderColor: active ? OLIVE_BRIGHT : 'rgba(255,255,255,0.18)',
        bgcolor: active ? 'rgba(140,141,37,0.18)' : 'rgba(255,255,255,0.03)',
        color: active ? OLIVE_BRIGHT : 'rgba(255,255,255,0.85)',
        fontFamily: '"Arsenal SC", "Inter", sans-serif',
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        letterSpacing: '0.03em',
        px: 2,
        py: 0.9,
        borderRadius: 999,
        transition: 'all 180ms ease',
        '&:hover': { borderColor: OLIVE_BRIGHT, color: OLIVE_BRIGHT },
      }}
    >
      {children}
    </Box>
  )
}

function TabBar({ tabs, value, onChange }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        bgcolor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '999px',
        p: '4px',
        gap: '4px',
      }}
    >
      {tabs.map((t) => {
        const active = value === t.v
        return (
          <Box
            key={String(t.v)}
            component="button"
            type="button"
            onClick={() => onChange(active ? 'any' : t.v)}
            sx={{
              cursor: 'pointer',
              border: 'none',
              bgcolor: active ? OLIVE_BRIGHT : 'transparent',
              color: active ? '#000' : 'rgba(255,255,255,0.85)',
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: active ? 700 : 500,
              fontSize: 13.5,
              letterSpacing: '0.04em',
              py: 1.05,
              borderRadius: '999px',
              transition: 'all 180ms ease',
            }}
          >
            {t.label}
          </Box>
        )
      })}
    </Box>
  )
}

function RangeRow({ value, onChange, min, max, step, format }) {
  const [lo, hi] = value
  return (
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={1.5}>
        <Box sx={inputBoxSx}>
          <InputBase
            value={format(lo)}
            readOnly
            sx={inputBaseSx}
          />
        </Box>
        <Box sx={inputBoxSx}>
          <InputBase
            value={format(hi)}
            readOnly
            sx={inputBaseSx}
          />
        </Box>
      </Stack>
      <Slider
        value={value}
        onChange={(_, v) => onChange(v)}
        min={min}
        max={max}
        step={step}
        sx={sliderSx}
      />
    </Stack>
  )
}

const inputBoxSx = {
  flex: 1,
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  px: 1.5,
  py: 1.1,
}

const inputBaseSx = {
  width: '100%',
  color: '#fff',
  fontFamily: '"Arsenal SC", "Inter", sans-serif',
  fontSize: 14,
  '& input': { p: 0 },
}

const sliderSx = {
  color: OLIVE_BRIGHT,
  height: 3,
  py: 1.5,
  '& .MuiSlider-rail': { bgcolor: 'rgba(255,255,255,0.12)', opacity: 1 },
  '& .MuiSlider-track': { border: 'none' },
  '& .MuiSlider-thumb': {
    width: 14,
    height: 14,
    bgcolor: OLIVE_BRIGHT,
    border: '2px solid #0a0a0a',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    borderRadius: 0,
    '&:hover, &.Mui-active': {
      boxShadow: '0 0 0 8px rgba(140,141,37,0.16)',
    },
  },
}

// ───────────── Main component ─────────────

export default function BuyFiltersModal({
  open,
  onClose,
  filters,
  setFilters,
  matchCount,
}) {
  const { t } = useI18n()
  const f = t.buyFilters
  const update = (patch) => setFilters((prev) => ({ ...prev, [Object.keys(patch)[0]]: Object.values(patch)[0] }))
  const reset = () => setFilters(DEFAULT_FILTERS)

  // City chip values stay in canonical form (Latin) since they're
  // matched against the `project.area.city` DB column. The "all"
  // sentinel gets a localized "All cities" label.
  const cityChips = ['all', 'Muscat', 'Al Seeb', 'Salalah', 'Sohar', 'Duqm']

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: '#0a0a0a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: { xs: 0, sm: '16px' },
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: '100vh', sm: '92vh' },
        },
      }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 3, sm: 4 },
          py: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky',
          top: 0,
          bgcolor: '#0a0a0a',
          zIndex: 2,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontWeight: 700,
            fontSize: { xs: 22, md: 26 },
            letterSpacing: '-0.01em',
          }}
        >
          {f.title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }} aria-label={f.closeAria}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      {/* ── Body ──────────────────────────────────────────────── */}
      <DialogContent sx={{ px: { xs: 3, sm: 4 }, py: 3 }}>
        {/* Bedrooms */}
        <Section>
          <Label>{f.bedrooms}</Label>
          <TabBar
            tabs={BEDROOM_TABS}
            value={filters.bedrooms}
            onChange={(v) => update({ bedrooms: v })}
          />
        </Section>

        {/* Search */}
        <Section>
          <Label>{f.search}</Label>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              px: 2,
              py: 1.25,
              gap: 1.25,
            }}
          >
            <SearchRoundedIcon sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 18 }} />
            <InputBase
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder={f.searchPlaceholder}
              sx={{
                flex: 1,
                color: '#fff',
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 14,
                '& input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
              }}
            />
          </Box>
        </Section>

        {/* Price + Area */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, md: 4 },
            mb: 4,
          }}
        >
          <Box>
            <Label hint={f.priceHint}>{f.price}</Label>
            <RangeRow
              value={filters.priceRange}
              onChange={(v) => update({ priceRange: v })}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={5000}
              format={(n) => `OMR ${fmtOmr(n)}`}
            />
          </Box>
          <Box>
            <Label hint={f.areaHint}>{f.area}</Label>
            <RangeRow
              value={filters.areaRange}
              onChange={(v) => update({ areaRange: v })}
              min={AREA_MIN}
              max={AREA_MAX}
              step={5}
              format={(n) => `${fmtOmr(n)} m²`}
            />
          </Box>
        </Box>

        {/* Floor */}
        <Section>
          <Label hint={f.floorHint}>{f.floor}</Label>
          <Stack spacing={1.25}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ ...inputBoxSx, flex: 0, minWidth: 140 }}>
                <InputBase
                  value={fmtOmr(filters.floorMax)}
                  readOnly
                  sx={inputBaseSx}
                />
              </Box>
            </Box>
            <Slider
              value={filters.floorMax}
              onChange={(_, v) => update({ floorMax: v })}
              min={FLOOR_MIN}
              max={FLOOR_MAX}
              step={1}
              sx={sliderSx}
            />
          </Stack>
        </Section>

        {/* Cities */}
        <Section>
          <Label>{f.cities}</Label>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {cityChips.map((c) => (
              <Chip
                key={c}
                active={filters.city === c}
                onClick={() => update({ city: c })}
              >
                {c === 'all' ? f.allCities : c}
              </Chip>
            ))}
          </Stack>
        </Section>

        {/* Property type chips */}
        <Section sx={{ mb: 1 }}>
          <Label>{f.propertyType}</Label>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {PROPERTY_TYPES.map((p) => (
              <Chip
                key={p.v}
                active={filters.propertyType === p.v}
                onClick={() => update({ propertyType: p.v })}
              >
                {f[p.key]}
              </Chip>
            ))}
          </Stack>
        </Section>
      </DialogContent>

      {/* ── Footer (sticky) ──────────────────────────────────── */}
      <Stack
        direction="row"
        sx={{
          position: 'sticky',
          bottom: 0,
          bgcolor: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          px: { xs: 3, sm: 4 },
          py: 2,
          gap: 2,
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={reset}
          sx={{
            cursor: 'pointer',
            bgcolor: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            px: 3,
            '&:hover': { color: '#fff' },
          }}
        >
          {f.reset}
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box
          component="button"
          type="button"
          onClick={onClose}
          sx={{
            cursor: 'pointer',
            bgcolor: OLIVE_BRIGHT,
            color: '#000',
            border: 'none',
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            px: 4,
            py: 1.5,
            borderRadius: '10px',
            transition: 'background 180ms ease, transform 180ms ease',
            '&:hover': { bgcolor: '#a3a52e', transform: 'translateY(-1px)' },
          }}
        >
          {(matchCount === 1 ? f.showOptionsOne : f.showOptionsMany).replace('{n}', matchCount)}
        </Box>
      </Stack>
    </Dialog>
  )
}
