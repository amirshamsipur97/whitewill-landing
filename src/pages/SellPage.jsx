import { useEffect, useMemo, useState } from 'react'
import { LocalizedLink as RouterLink } from '../lib/localize.js'
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Skeleton,
  Alert,
  Link,
  Breadcrumbs,
  Divider,
  Tooltip,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import GridViewIcon from '@mui/icons-material/GridView'
import MapIcon from '@mui/icons-material/Map'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { fetchProperties } from '../supabase'
import { useI18n } from '../i18n.jsx'
import PropertyCard from '../components/PropertyCard.jsx'

const PAGE_SIZE = 9

export default function SellPage() {
  const { t, lang } = useI18n()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // filters
  const [city, setCity] = useState(0) // index into cities[]
  const [type, setType] = useState('all')
  const [bedrooms, setBedrooms] = useState('any')
  const [priceRange, setPriceRange] = useState('any')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)
  const [activeChips, setActiveChips] = useState([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchProperties({ limit: 60 })
      .then((data) => {
        if (cancelled) return
        setItems(data || [])
        setError(null)
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || 'fetch error')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    let arr = [...items]
    // city filter (skip when index 0 = all cities)
    if (city > 0) {
      const cityName = t.sellPage.cities[city]?.toLowerCase()
      arr = arr.filter((p) => {
        const c = (p.area?.city || p.area?.governorate || '').toLowerCase()
        return c.includes(cityName) || cityName.includes(c)
      })
    }
    if (type !== 'all') {
      arr = arr.filter((p) => p.property_type === type)
    }
    if (bedrooms !== 'any') {
      const n = Number(bedrooms)
      arr = arr.filter((p) => (n === 4 ? (p.bedrooms ?? 0) >= 4 : p.bedrooms === n))
    }
    if (priceRange !== 'any') {
      const [min, max] = priceRange.split('-').map(Number)
      arr = arr.filter((p) => {
        const v = Number(p.price_omr)
        if (Number.isNaN(v)) return false
        if (max) return v >= min && v <= max
        return v >= min
      })
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      arr = arr.filter((p) =>
        [p.title, p.area?.name, p.area?.city, p.developer?.name]
          .filter(Boolean)
          .some((s) => String(s).toLowerCase().includes(q)),
      )
    }
    if (sort === 'priceAsc') arr.sort((a, b) => (a.price_omr ?? 0) - (b.price_omr ?? 0))
    if (sort === 'priceDesc') arr.sort((a, b) => (b.price_omr ?? 0) - (a.price_omr ?? 0))
    if (sort === 'newest')
      arr.sort((a, b) => Number(b.year_built ?? 0) - Number(a.year_built ?? 0))
    return arr
  }, [items, city, type, bedrooms, priceRange, search, sort, t.sellPage.cities])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [city, type, bedrooms, priceRange, search, sort])

  // active filter chips
  useEffect(() => {
    const chips = []
    if (type !== 'all') chips.push({ key: 'type', label: type })
    if (bedrooms !== 'any') chips.push({ key: 'bedrooms', label: `${bedrooms} ${t.sellPage.bedroomsLabel}` })
    if (priceRange !== 'any') chips.push({ key: 'price', label: priceRange.replace('-', '–') + ' OMR' })
    setActiveChips(chips)
  }, [type, bedrooms, priceRange, t.sellPage.bedroomsLabel])

  const removeChip = (key) => {
    if (key === 'type') setType('all')
    if (key === 'bedrooms') setBedrooms('any')
    if (key === 'price') setPriceRange('any')
  }

  const resetAll = () => {
    setCity(0)
    setType('all')
    setBedrooms('any')
    setPriceRange('any')
    setSearch('')
    setSort('default')
  }

  return (
    <Box sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2, color: 'text.secondary' }}>
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            {t.sellPage.breadcrumbHome}
          </Link>
          <Typography color="text.primary" variant="body2">
            {t.sellPage.breadcrumbReal}
          </Typography>
        </Breadcrumbs>

        {/* Page title */}
        <Typography
          component="h1"
          sx={{
            fontWeight: 300,
            fontSize: { xs: 28, md: 42 },
            letterSpacing: '0.02em',
            mb: { xs: 3, md: 4 },
            color: '#F0EAE3',
          }}
        >
          {t.sellPage.title}
        </Typography>

        {/* City tabs */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 1.5,
          }}
        >
          {t.sellPage.cities.map((c, i) => (
            <Chip
              key={c}
              label={c}
              onClick={() => setCity(i)}
              variant={city === i ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 999,
                bgcolor: city === i ? 'primary.main' : 'transparent',
                color: city === i ? 'primary.contrastText' : 'text.primary',
                borderColor: 'divider',
                fontWeight: 500,
                '&:hover': { bgcolor: city === i ? 'primary.main' : 'rgba(255,255,255,0.04)' },
              }}
            />
          ))}
        </Box>

        {/* Filter row: selects + search */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={type}
              displayEmpty
              onChange={(e) => setType(e.target.value)}
              sx={{ bgcolor: 'background.paper' }}
            >
              <MenuItem value="all">{t.sellPage.typeLabel}: All</MenuItem>
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="villa">Villa</MenuItem>
              <MenuItem value="penthouse">Penthouse</MenuItem>
              <MenuItem value="townhouse">Townhouse</MenuItem>
              <MenuItem value="serviced_apartment">Serviced Apartment</MenuItem>
              <MenuItem value="plot">Plot</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              sx={{ bgcolor: 'background.paper' }}
            >
              <MenuItem value="any">{t.sellPage.bedroomsLabel}: Any</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4+</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              sx={{ bgcolor: 'background.paper' }}
            >
              <MenuItem value="any">{t.sellPage.priceLabel}: Any</MenuItem>
              <MenuItem value="0-50000">≤ 50k OMR</MenuItem>
              <MenuItem value="50000-100000">50k–100k</MenuItem>
              <MenuItem value="100000-200000">100k–200k</MenuItem>
              <MenuItem value="200000-500000">200k–500k</MenuItem>
              <MenuItem value="500000-99999999">500k+ OMR</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            placeholder={t.sellPage.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ bgcolor: 'background.paper' }}
          />
        </Stack>

        {/* Filter footer */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            mb: 4,
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              size="small"
              startIcon={<TuneIcon />}
              variant="outlined"
              color="inherit"
              sx={{ borderColor: 'divider' }}
            >
              {t.sellPage.moreFilters}
            </Button>
            {activeChips.map((c) => (
              <Chip
                key={c.key}
                label={c.label}
                size="small"
                onDelete={() => removeChip(c.key)}
                deleteIcon={<CloseIcon fontSize="small" />}
                sx={{ bgcolor: 'rgba(201,169,97,0.15)', color: '#F0EAE3', borderRadius: 999 }}
              />
            ))}
            {(activeChips.length > 0 || city > 0 || search) && (
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={resetAll}
                color="inherit"
                sx={{ color: 'primary.main' }}
              >
                {t.sellPage.reset}
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t.sellPage.foundLabel}{' '}
              <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {filtered.length} {t.sellPage.offers}
              </Box>
            </Typography>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                sx={{ bgcolor: 'background.paper' }}
              >
                <MenuItem value="default">{t.sellPage.sortOptions.default}</MenuItem>
                <MenuItem value="priceAsc">{t.sellPage.sortOptions.priceAsc}</MenuItem>
                <MenuItem value="priceDesc">{t.sellPage.sortOptions.priceDesc}</MenuItem>
                <MenuItem value="newest">{t.sellPage.sortOptions.newest}</MenuItem>
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={view}
              exclusive
              size="small"
              onChange={(_, v) => v && setView(v)}
            >
              <ToggleButton value="grid">
                <Tooltip title={t.sellPage.view.grid}>
                  <GridViewIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="map">
                <Tooltip title={t.sellPage.view.map}>
                  <MapIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 4, opacity: 0.4 }} />

        {/* Errors / empty / loading */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Map view placeholder */}
        {view === 'map' && !loading && (
          <Box
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              aspectRatio: '16 / 8',
              mb: 4,
            }}
          >
            <Box
              component="iframe"
              title="Properties map"
              src="https://maps.google.com/maps?q=Muscat,Oman&t=&z=10&ie=UTF8&iwloc=&output=embed"
              sx={{
                width: '100%',
                height: '100%',
                border: 0,
                filter: 'grayscale(0.3) invert(0.92) hue-rotate(180deg)',
              }}
              allowFullScreen
              loading="lazy"
            />
          </Box>
        )}

        {/* Grid */}
        {view === 'grid' && (
          <>
            <Grid container spacing={3}>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton
                      variant="rectangular"
                      height={325}
                      sx={{ borderRadius: 1, mb: 1 }}
                    />
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                  </Grid>
                ))}

              {!loading &&
                pageItems.map((p) => (
                  <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <PropertyCard property={p} t={t} lang={lang} />
                  </Grid>
                ))}
            </Grid>

            {!loading && filtered.length === 0 && (
              <Alert severity="info" sx={{ mt: 4 }}>
                {t.sellPage.noResults}
              </Alert>
            )}

            {/* Pagination */}
            {!loading && filtered.length > PAGE_SIZE && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, p) => {
                    setPage(p)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  color="primary"
                  shape="rounded"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}
