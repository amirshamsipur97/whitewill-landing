import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography, IconButton, Modal, Slider } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { gsap } from 'gsap'
import { useI18n } from '../i18n.jsx'

// ───────────────────────────── tokens ─────────────────────────────
const OLIVE_BRIGHT = '#8c8d25'
const SEGMENT_HEIGHT = 47

const BEDROOM_OPTIONS = [
  { label: 'Studio', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5+', value: 5 },
]

// Top-4 chips shown directly in the bar — modal exposes the full list.
const TOP_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Townhouse']

export function countActiveFilters(f) {
  let n = 0
  if (f.search?.trim()) n++
  if (f.type && f.type !== 'All') n++
  if (Array.isArray(f.locations) && f.locations.length > 0) n++
  if (Array.isArray(f.bedrooms) && f.bedrooms.length > 0) n++
  if (f.priceMin != null || f.priceMax != null) n++
  if (f.sizeMin != null || f.sizeMax != null) n++
  return n
}

export const EMPTY_FILTERS = {
  search: '',
  type: 'All',
  locations: [],
  bedrooms: [],
  priceMin: null,
  priceMax: null,
  sizeMin: null,
  sizeMax: null,
}

// ─────────────────────────── helpers ────────────────────────────
const fmtOmr = (n) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)

// Hook: closes the popover when the user clicks outside
function useClickAway(ref, onAway) {
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current) return
      if (ref.current.contains(e.target)) return
      onAway(e)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [ref, onAway])
}

// ─────────────────────────── small atoms ───────────────────────────
function Segment({ children, sx, ...rest }) {
  return (
    <Box
      sx={{
        height: SEGMENT_HEIGHT,
        border: '1px solid #ffffff',
        bgcolor: '#000',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 220ms ease, border-color 220ms ease',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}

// ─────────────────────────── main component ───────────────────────────
export default function PropertyToolbar({
  filters,
  onChange,
  areas = [],
  unitTypes = [],
  priceRange = [0, 1_000_000],
  sizeRange = [0, 500],
  resultsCount = 0,
  projects = [],
  onProjectSelect,
}) {
  const { t } = useI18n()
  const L = t.map.toolbar

  const [locOpen, setLocOpen] = useState(false)
  const [bedsOpen, setBedsOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ── Search autocomplete state ──────────────────────────────────────
  // `searchFocused` gates dropdown visibility (closes on blur unless the
  // user is clicking into a suggestion); `activeIdx` powers keyboard nav.
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const searchSegmentRef = useRef(null)

  // Prefix-match projects against the current query. Case-insensitive,
  // matched on the project's display name only (the toolbar's free-text
  // search filter still hits every field — this is just the *suggestion*
  // surface). Capped at 6 entries so the popover never crowds the bar.
  const suggestions = useMemo(() => {
    const q = (filters.search || '').trim().toLowerCase()
    if (!q) return []
    return projects
      .filter((p) => p.name?.toLowerCase().startsWith(q))
      .slice(0, 6)
  }, [filters.search, projects])

  // Ghost-text suffix shown after the typed query in the search input.
  // Empty if no match, the query already equals the first match, or the
  // user has cleared the input.
  const ghostSuffix = useMemo(() => {
    const q = filters.search || ''
    if (!q || suggestions.length === 0) return ''
    const top = suggestions[0].name
    if (top.toLowerCase() === q.toLowerCase()) return ''
    return top.slice(q.length)
  }, [filters.search, suggestions])

  // Clamp the highlighted index whenever the suggestion list changes so it
  // never points past the array.
  useEffect(() => {
    if (activeIdx >= suggestions.length) setActiveIdx(0)
  }, [suggestions.length, activeIdx])

  const pickProject = (p) => {
    if (!p) return
    set({ search: p.name })
    setSearchFocused(false)
    onProjectSelect?.(p)
  }

  const handleSearchKey = (e) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pickProject(suggestions[activeIdx] || suggestions[0])
    } else if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghostSuffix) {
      // Tab or → at the very end of the query accepts the ghost suffix
      // without flying the map — lets the user "complete" the name first
      // and then hit Enter to fly.
      const inputEl = e.currentTarget
      if (inputEl.selectionStart === inputEl.value.length) {
        e.preventDefault()
        set({ search: suggestions[0].name })
      }
    } else if (e.key === 'Escape') {
      setSearchFocused(false)
    }
  }

  // Close suggestions when the user clicks anywhere outside the search segment.
  useClickAway(searchSegmentRef, () => setSearchFocused(false))

  const set = (patch) => onChange({ ...filters, ...patch })
  const toggleBedroom = (v) =>
    set({
      bedrooms: filters.bedrooms.includes(v)
        ? filters.bedrooms.filter((x) => x !== v)
        : [...filters.bedrooms, v],
    })
  const toggleLocation = (id) =>
    set({
      locations: filters.locations.includes(id)
        ? filters.locations.filter((x) => x !== id)
        : [...filters.locations, id],
    })

  const activeCount = countActiveFilters(filters)

  // ── Chips shown in the bar: All + top-4 types (only those present in DB) ──
  const chipTypes = useMemo(() => {
    const present = new Set(unitTypes)
    return ['All', ...TOP_TYPES.filter((t) => present.has(t))]
  }, [unitTypes])

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        gap: 0,
        // More breathing room between the toolbar and the map/details
        // grid below — previously the bar sat right on top of the panel
        // and felt cramped.
        mt: { xs: 4, md: 5 },
        mb: { xs: 6, md: 8 },
      }}
    >
      {/* ── Search (with project-name autocomplete) ── */}
      <Box
        ref={searchSegmentRef}
        sx={{
          position: 'relative',
          flex: { xs: '1 1 100%', md: '1 1 350px' },
          minWidth: 0,
        }}
      >
        <Segment sx={{ px: '26px' }}>
          {/* Ghost-text overlay — shows the matching project-name suffix
              in dim grey *behind* the input so the user sees the
              auto-completion inline. The leading transparent span
              reserves the exact width of what they've typed so the
              suffix lines up to the right of the caret. */}
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 16,
                color: 'rgba(255,255,255,0.32)',
                whiteSpace: 'pre',
                overflow: 'hidden',
              }}
            >
              <Box component="span" sx={{ visibility: 'hidden' }}>
                {filters.search || ''}
              </Box>
              <Box component="span">{ghostSuffix}</Box>
            </Box>
            <Box
              component="input"
              value={filters.search}
              onChange={(e) => {
                set({ search: e.target.value })
                setActiveIdx(0)
                if (!searchFocused) setSearchFocused(true)
              }}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={handleSearchKey}
              placeholder={L.search}
              autoComplete="off"
              spellCheck="false"
              sx={{
                flex: 1,
                position: 'relative',
                zIndex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 16,
                p: 0,
                '&::placeholder': { color: 'rgba(124,120,86,0.5)' },
              }}
            />
          </Box>
          <SearchRoundedIcon sx={{ color: '#fff', fontSize: 20, ml: 1 }} />
        </Segment>

        {/* Suggestion dropdown — appears flush against the bottom of the
            search segment, sharing its border so the two read as one
            extended panel. Each row shows the matched prefix in bold and
            the remainder in regular weight, mirroring the ghost text. */}
        {searchFocused && suggestions.length > 0 && (
          <Box
            role="listbox"
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: '-1px',
              bgcolor: '#000',
              border: '1px solid #ffffff',
              borderTop: 'none',
              zIndex: 30,
              maxHeight: 320,
              overflowY: 'auto',
              boxShadow: '0 14px 40px rgba(0,0,0,0.55)',
            }}
          >
            {suggestions.map((p, i) => {
              const q = filters.search || ''
              const matchLen = q.length
              const head = p.name.slice(0, matchLen)
              const tail = p.name.slice(matchLen)
              const active = i === activeIdx
              return (
                <Box
                  key={p.id}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIdx(i)}
                  // Use mousedown so the click fires BEFORE the input's
                  // blur tears down the dropdown.
                  onMouseDown={(e) => {
                    e.preventDefault()
                    pickProject(p)
                  }}
                  sx={{
                    px: '26px',
                    py: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    color: '#fff',
                    fontFamily: '"Arsenal SC", "Inter", sans-serif',
                    bgcolor: active ? 'rgba(57,31,175,0.18)' : 'transparent',
                    transition: 'background-color 160ms ease',
                  }}
                >
                  <Box sx={{ fontSize: 15 }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>{head}</Box>
                    <Box component="span" sx={{ fontWeight: 400, color: 'rgba(255,255,255,0.75)' }}>{tail}</Box>
                  </Box>
                  {(p.area?.name || p.area?.city) && (
                    <Box sx={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                      {[p.area?.name, p.area?.city].filter(Boolean).join(' · ')}
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        )}
      </Box>

      {/* ── Type chips ──
          On mobile the chips wrap onto multiple lines so the user never
          needs to side-scroll to discover the rest of the property types.
          The segment grows in height (`auto` instead of the fixed
          SEGMENT_HEIGHT) and the row uses normal flex-wrap.  */}
      <Segment
        sx={{
          flex: { xs: '1 1 100%', md: '0 1 423px' },
          minWidth: 0,
          height: { xs: 'auto', md: SEGMENT_HEIGHT },
          minHeight: SEGMENT_HEIGHT,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          rowGap: { xs: '8px', md: 0 },
          py: { xs: '8px', md: 0 },
          overflowX: { xs: 'visible', md: 'auto' },
          gap: '15px',
          px: '14px',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {chipTypes.map((chip, i) => (
          <Box key={chip} sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {i > 0 && (
              <Box sx={{ width: '1px', height: 19, bgcolor: 'rgba(255,255,255,0.5)' }} />
            )}
            <Box
              component="button"
              type="button"
              onClick={() => set({ type: chip })}
              sx={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: filters.type === chip ? OLIVE_BRIGHT : '#fff',
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: 14.4,
                fontWeight: filters.type === chip ? 700 : 400,
                p: 0,
                whiteSpace: 'nowrap',
                transition: 'color 220ms ease, font-weight 220ms ease',
                '&:hover': { color: OLIVE_BRIGHT },
              }}
            >
              {chip === 'All' ? L.typeAll : chip}
            </Box>
          </Box>
        ))}
      </Segment>

      {/* ── Location dropdown ── */}
      <DropdownSegment
        label={
          filters.locations.length > 0
            ? `${filters.locations.length} ${L.selected}`
            : L.anyLocation
        }
        active={filters.locations.length > 0}
        open={locOpen}
        onToggle={() => { setLocOpen((v) => !v); setBedsOpen(false) }}
        onClose={() => setLocOpen(false)}
        width={150}
      >
        <LocationPopover
          areas={areas}
          selected={filters.locations}
          onToggle={toggleLocation}
          onClear={() => set({ locations: [] })}
          L={L}
        />
      </DropdownSegment>

      {/* ── Beds & Baths popup ── */}
      <DropdownSegment
        label={
          filters.bedrooms.length > 0
            ? `${filters.bedrooms.length} ${L.selected}`
            : L.bedsAndBaths
        }
        active={filters.bedrooms.length > 0}
        open={bedsOpen}
        onToggle={() => { setBedsOpen((v) => !v); setLocOpen(false) }}
        onClose={() => setBedsOpen(false)}
        width={150}
      >
        <BedsPopover
          options={BEDROOM_OPTIONS}
          selected={filters.bedrooms}
          onToggle={toggleBedroom}
          onClear={() => set({ bedrooms: [] })}
          L={L}
        />
      </DropdownSegment>

      {/* ── Filters button + count ── */}
      <Segment
        sx={{
          flex: { xs: '1 1 100%', md: '0 0 133px' },
          gap: '14px',
          px: '14px',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
        }}
        onClick={() => setFiltersOpen(true)}
      >
        <TuneRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: 14.4,
            color: '#fff',
          }}
        >
          {L.filters}
        </Typography>
        {activeCount > 0 && (
          <Box
            sx={{
              ml: 'auto',
              minWidth: 22, height: 22,
              borderRadius: '999px',
              bgcolor: OLIVE_BRIGHT,
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 700, fontSize: 12,
              px: 1,
            }}
          >
            {activeCount}
          </Box>
        )}
      </Segment>

      {/* ── Filters modal ── */}
      <FiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={onChange}
        unitTypes={unitTypes}
        priceRange={priceRange}
        sizeRange={sizeRange}
        resultsCount={resultsCount}
        L={L}
      />
    </Box>
  )
}

// ─────────────────────────── Dropdown shell ────────────────────────────
// Stays mounted; visibility is driven by CSS transitions for a buttery feel.
function DropdownSegment({ label, active, open, onToggle, onClose, width, children }) {
  const ref = useRef(null)
  const panelRef = useRef(null)
  useClickAway(ref, () => onClose())

  // Smooth opacity + slide + scale via GSAP, kept in sync with `open`
  useEffect(() => {
    if (!panelRef.current) return
    gsap.killTweensOf(panelRef.current)
    if (open) {
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: -10, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: 'power3.out' },
      )
    } else {
      gsap.to(panelRef.current, {
        autoAlpha: 0, y: -8, scale: 0.98,
        duration: 0.16, ease: 'power2.in',
      })
    }
  }, [open])

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        flex: { xs: '1 1 50%', md: `0 0 ${width}px` },
      }}
    >
      <Segment
        sx={{
          width: '100%',
          gap: '13px',
          px: '14px',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
        }}
        onClick={onToggle}
      >
        <Typography
          sx={{
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontSize: 14.4,
            color: active ? OLIVE_BRIGHT : '#fff',
            fontWeight: active ? 600 : 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
            transition: 'color 220ms ease',
          }}
        >
          {label}
        </Typography>
        <KeyboardArrowDownRoundedIcon
          sx={{
            color: '#fff',
            fontSize: 18,
            transition: 'transform 240ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </Segment>

      <Box
        ref={panelRef}
        sx={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          minWidth: 300,
          zIndex: 50,
          bgcolor: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '12px',
          boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
          p: 2,
          color: '#fff',
          visibility: 'hidden',  // GSAP autoAlpha flips this
          opacity: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

// ─────────────────────────── Location popover ───────────────────────────
function LocationPopover({ areas, selected, onToggle, onClear, L }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return areas
    return areas.filter((a) =>
      `${a.name} ${a.city || ''}`.toLowerCase().includes(s),
    )
  }, [areas, q])

  return (
    <Box>
      <Box
        component="input"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={L.searchLocation}
        sx={{
          width: '100%',
          height: 38,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '8px',
          color: '#fff',
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: 14,
          px: 1.5,
          outline: 'none',
          mb: 1.5,
          '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
          '&:focus': { borderColor: OLIVE_BRIGHT },
          transition: 'border-color 200ms ease',
        }}
      />
      <Box sx={{ maxHeight: 260, overflowY: 'auto', pr: 0.5 }}>
        {filtered.length === 0 && (
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', py: 2, textAlign: 'center' }}>
            {L.noResults}
          </Typography>
        )}
        {filtered.map((a) => {
          const checked = selected.includes(a.id)
          return (
            <Box
              key={a.id}
              component="label"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                py: 1,
                px: 1,
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: 14,
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                transition: 'background-color 180ms ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              <Box
                component="input"
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(a.id)}
                sx={{
                  width: 16, height: 16,
                  accentColor: OLIVE_BRIGHT,
                  cursor: 'pointer',
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Box>{a.name}</Box>
                {a.city && a.city !== a.name && (
                  <Box sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{a.city}</Box>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>
      {selected.length > 0 && (
        <Box
          component="button"
          type="button"
          onClick={onClear}
          sx={{
            mt: 1, background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.65)', fontSize: 12,
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            transition: 'color 200ms ease',
            '&:hover': { color: '#fff' },
          }}
        >
          {L.clear}
        </Box>
      )}
    </Box>
  )
}

// ─────────────────────────── Beds popover ───────────────────────────
function BedsPopover({ options, selected, onToggle, onClear, L }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 13, color: 'rgba(255,255,255,0.7)',
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          mb: 1.2,
        }}
      >
        {L.bedrooms}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {options.map((opt) => (
          <ChipBtn
            key={opt.value}
            active={selected.includes(opt.value)}
            onClick={() => onToggle(opt.value)}
            label={opt.label}
          />
        ))}
      </Box>
      {selected.length > 0 && (
        <Box
          component="button"
          type="button"
          onClick={onClear}
          sx={{
            mt: 1.5, background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.65)', fontSize: 12,
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            transition: 'color 200ms ease',
            '&:hover': { color: '#fff' },
          }}
        >
          {L.clear}
        </Box>
      )}
    </Box>
  )
}

function ChipBtn({ active, onClick, label }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        minWidth: 48, height: 38,
        px: 1.6,
        borderRadius: '999px',
        border: '1px solid',
        borderColor: active ? OLIVE_BRIGHT : 'rgba(255,255,255,0.22)',
        bgcolor: active ? OLIVE_BRIGHT : 'transparent',
        color: active ? '#000' : '#fff',
        cursor: 'pointer',
        fontFamily: '"Arsenal SC", "Inter", sans-serif',
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: OLIVE_BRIGHT,
          bgcolor: active ? OLIVE_BRIGHT : 'rgba(140,141,37,0.18)',
          transform: 'translateY(-1px)',
        },
        '&:active': { transform: 'translateY(0)' },
      }}
    >
      {label}
    </Box>
  )
}

// ─────────────────────────── Filters modal ──────────────────────────
function FiltersModal({
  open, onClose, filters, onChange,
  unitTypes, priceRange, sizeRange, resultsCount, L,
}) {
  const [draft, setDraft] = useState(filters)
  const panelRef = useRef(null)

  useEffect(() => { if (open) setDraft(filters) }, [open, filters])

  // GSAP entry animation when modal opens
  useEffect(() => {
    if (!open || !panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { y: 24, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' },
    )
  }, [open])

  const setD = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const toggleBedroom = (v) =>
    setD({
      bedrooms: draft.bedrooms.includes(v)
        ? draft.bedrooms.filter((x) => x !== v)
        : [...draft.bedrooms, v],
    })

  const apply = () => { onChange(draft); onClose() }
  const clearAll = () =>
    setDraft({
      ...draft,
      type: 'All',
      bedrooms: [],
      priceMin: null, priceMax: null,
      sizeMin: null, sizeMax: null,
    })

  // Slider current values fall back to the full range when not set
  const priceVal = [
    draft.priceMin ?? priceRange[0],
    draft.priceMax ?? priceRange[1],
  ]
  const sizeVal = [
    draft.sizeMin ?? sizeRange[0],
    draft.sizeMax ?? sizeRange[1],
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
    >
      <Box
        ref={panelRef}
        sx={{
          width: '100%',
          maxWidth: 760,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '18px',
          color: '#fff',
          overflow: 'hidden',
          outline: 'none',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: { xs: 3, md: 4 }, py: 2.2,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
            {L.filtersTitle}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 3, md: 4 }, py: 3 }}>
          {/* Property Type */}
          {unitTypes.length > 0 && (
            <Section title={L.propertyType || 'Property Type'}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <ChipBtn
                  active={draft.type === 'All'}
                  onClick={() => setD({ type: 'All' })}
                  label={L.typeAll}
                />
                {unitTypes.map((tp) => (
                  <ChipBtn
                    key={tp}
                    active={draft.type === tp}
                    onClick={() => setD({ type: tp })}
                    label={tp}
                  />
                ))}
              </Box>
            </Section>
          )}

          {/* Price Range */}
          <Section
            title={L.priceRange}
            value={`OMR ${fmtOmr(priceVal[0])} — OMR ${fmtOmr(priceVal[1])}`}
          >
            <Box sx={{ px: 1.5 }}>
              <Slider
                value={priceVal}
                onChange={(_, val) =>
                  setD({ priceMin: val[0], priceMax: val[1] })
                }
                min={priceRange[0]}
                max={priceRange[1]}
                step={1000}
                disableSwap
                sx={SLIDER_SX}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography sx={LABEL_END_SX}>OMR {fmtOmr(priceRange[0])}</Typography>
                <Typography sx={LABEL_END_SX}>OMR {fmtOmr(priceRange[1])}</Typography>
              </Box>
            </Box>
          </Section>

          {/* Bedrooms */}
          <Section title={L.bedrooms}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {BEDROOM_OPTIONS.map((opt) => (
                <ChipBtn
                  key={opt.value}
                  active={draft.bedrooms.includes(opt.value)}
                  onClick={() => toggleBedroom(opt.value)}
                  label={opt.label}
                />
              ))}
            </Box>
          </Section>

          {/* Unit Size */}
          <Section
            title={L.unitSize}
            value={`${sizeVal[0]} m² — ${sizeVal[1]} m²`}
          >
            <Box sx={{ px: 1.5 }}>
              <Slider
                value={sizeVal}
                onChange={(_, val) =>
                  setD({ sizeMin: val[0], sizeMax: val[1] })
                }
                min={sizeRange[0]}
                max={sizeRange[1]}
                step={5}
                disableSwap
                sx={SLIDER_SX}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography sx={LABEL_END_SX}>{sizeRange[0]} m²</Typography>
                <Typography sx={LABEL_END_SX}>{sizeRange[1]} m²</Typography>
              </Box>
            </Box>
          </Section>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: { xs: 3, md: 4 }, py: 2.2,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
            bgcolor: 'rgba(255,255,255,0.02)',
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={clearAll}
            sx={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 14, fontFamily: '"Arsenal SC", "Inter", sans-serif',
              textDecoration: 'underline',
              transition: 'color 220ms ease',
              '&:hover': { color: '#fff' },
            }}
          >
            {L.clearFilters}
          </Box>
          <Box
            component="button"
            type="button"
            onClick={apply}
            sx={{
              px: 3.5, height: 48,
              borderRadius: '12px',
              border: 'none',
              bgcolor: '#fff',
              color: '#000',
              cursor: 'pointer',
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontWeight: 600,
              fontSize: 14,
              transition: 'background-color 200ms ease, transform 200ms ease',
              '&:hover': { bgcolor: '#e8e8e8' },
              '&:active': { transform: 'translateY(1px)' },
            }}
          >
            {L.showResults.replace('{n}', resultsCount)}
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

const SLIDER_SX = {
  color: OLIVE_BRIGHT,
  height: 4,
  py: 2,
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    opacity: 1,
    height: 4,
  },
  '& .MuiSlider-track': {
    border: 'none',
    height: 4,
  },
  '& .MuiSlider-thumb': {
    width: 18,
    height: 18,
    backgroundColor: '#fff',
    border: `2px solid ${OLIVE_BRIGHT}`,
    transition: 'box-shadow 200ms ease, transform 200ms ease',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0 0 0 8px rgba(140,141,37,0.18)`,
      transform: 'scale(1.05)',
    },
    '&.Mui-active': {
      boxShadow: `0 0 0 12px rgba(140,141,37,0.22)`,
    },
  },
}

const LABEL_END_SX = {
  fontSize: 11,
  fontFamily: '"Arsenal SC", "Inter", sans-serif',
  color: 'rgba(255,255,255,0.5)',
  letterSpacing: '0.3px',
}

function Section({ title, value, children }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
        <Typography sx={{
          fontSize: 14, fontWeight: 600,
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          color: '#fff',
        }}>
          {title}
        </Typography>
        {value && (
          <Typography sx={{
            fontSize: 13,
            color: OLIVE_BRIGHT,
            fontFamily: '"Arsenal SC", "Inter", sans-serif',
            fontWeight: 500,
          }}>
            {value}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  )
}
