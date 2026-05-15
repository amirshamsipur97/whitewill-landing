import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Skeleton,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined'
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined'
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { fetchProperties } from '../supabase'
import { useI18n } from '../i18n.jsx'

const TYPE_FILTERS = ['all', 'apartment', 'villa', 'penthouse', 'townhouse']

const TYPE_IMAGES = {
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
  penthouse: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
  townhouse: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  serviced_apartment: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  plot: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
}

function imageFor(p) {
  return TYPE_IMAGES[p.property_type] || TYPE_IMAGES.apartment
}

function formatPrice(omr, lang) {
  if (omr == null) return ''
  const n = Number(omr)
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'ar' ? 'ar-OM' : 'en-US'
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n) + ' OMR'
}

export default function PropertiesSection() {
  const { t, lang } = useI18n()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const isSm = useMediaQuery((th) => th.breakpoints.down('md'))

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchProperties({ limit: 50 })
      .then((data) => {
        if (!cancelled) {
          setItems(data)
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((p) => p.property_type === filter)),
    [filter, items],
  )

  const filterLabel = (key) =>
    ({
      all: t.properties.filterAll,
      apartment: t.properties.filterApartment,
      villa: t.properties.filterVilla,
      penthouse: t.properties.filterPenthouse,
      townhouse: t.properties.filterTownhouse,
    })[key]

  const statusLabel = (s) =>
    ({
      for_sale: t.properties.forSale,
      for_rent: t.properties.forRent,
      sold: t.properties.sold,
      rented: t.properties.rented,
    })[s] || s

  const statusColor = (s) =>
    s === 'for_sale' ? 'primary' : s === 'for_rent' ? 'info' : 'default'

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{
            mb: 4,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 56 }, fontWeight: 300 }}>
              {t.properties.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1, maxWidth: 560 }}>
              {t.properties.sub}
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={filter}
            exclusive
            size={isSm ? 'small' : 'medium'}
            onChange={(_, v) => v && setFilter(v)}
            sx={{
              flexWrap: 'wrap',
              '& .MuiToggleButton-root': {
                color: 'text.secondary',
                borderColor: 'divider',
                px: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.main' },
                },
              },
            }}
          >
            {TYPE_FILTERS.map((k) => (
              <ToggleButton key={k} value={k}>
                {filterLabel(k)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{t.properties.error}</Alert>}

        <Grid container spacing={3}>
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" sx={{ mt: 1 }} width="80%" />
                <Skeleton variant="text" width="50%" />
              </Grid>
            ))}

          {!loading && filtered.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                {t.properties.empty}
              </Typography>
            </Grid>
          )}

          {!loading &&
            filtered.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, border-color 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => setActive(p)}
                    sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        aspectRatio: '4 / 3',
                        backgroundImage: `url(${imageFor(p)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ position: 'absolute', top: 12, left: 12, flexWrap: 'wrap', gap: 1 }}
                      >
                        <Chip
                          size="small"
                          color={statusColor(p.status)}
                          label={statusLabel(p.status)}
                          sx={{ fontWeight: 600 }}
                        />
                        {p.is_itc_zone && (
                          <Chip
                            size="small"
                            variant="outlined"
                            label={t.properties.itcZone}
                            sx={{ bgcolor: 'rgba(0,0,0,0.6)', borderColor: 'primary.main', color: 'primary.main' }}
                          />
                        )}
                      </Stack>
                    </Box>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {p.title}
                      </Typography>
                      {p.area && (
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                          <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {p.area.name}
                            {p.area.city ? `, ${p.area.city}` : ''}
                          </Typography>
                        </Stack>
                      )}
                      <Typography
                        variant="h6"
                        sx={{ color: 'primary.main', fontWeight: 700, mb: 1.5 }}
                      >
                        {formatPrice(p.price_omr, lang)}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          mt: 'auto',
                          pt: 1.5,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          color: 'text.secondary',
                          flexWrap: 'wrap',
                        }}
                      >
                        {p.bedrooms != null && (
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            <KingBedOutlinedIcon fontSize="small" />
                            <Typography variant="caption">{p.bedrooms} {t.properties.bedrooms}</Typography>
                          </Stack>
                        )}
                        {p.bathrooms != null && (
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            <BathtubOutlinedIcon fontSize="small" />
                            <Typography variant="caption">{p.bathrooms} {t.properties.bathrooms}</Typography>
                          </Stack>
                        )}
                        {p.area_sqm != null && (
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            <SquareFootOutlinedIcon fontSize="small" />
                            <Typography variant="caption">
                              {Number(p.area_sqm).toFixed(0)} {t.properties.sqm}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>

      <Dialog
        open={Boolean(active)}
        onClose={() => setActive(null)}
        maxWidth="md"
        fullWidth
      >
        {active && (
          <>
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '16 / 7',
                backgroundImage: `url(${imageFor(active)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <IconButton
                onClick={() => setActive(null)}
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogTitle sx={{ pb: 0 }}>
              {active.title}
              {active.area && (
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
                  {active.area.name}
                  {active.area.city ? `, ${active.area.city}` : ''}
                  {active.area.governorate ? `, ${active.area.governorate}` : ''}
                </Typography>
              )}
            </DialogTitle>
            <DialogContent>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  size="small"
                  color={statusColor(active.status)}
                  label={statusLabel(active.status)}
                />
                {active.is_itc_zone && <Chip size="small" variant="outlined" label={t.properties.itcZone} />}
                {active.foreign_ownership_allowed && (
                  <Chip size="small" variant="outlined" label={t.properties.foreignOwnership} />
                )}
              </Stack>

              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>
                {formatPrice(active.price_omr, lang)}
                <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                  ≈ ${Number(active.price_usd).toLocaleString()}
                </Typography>
              </Typography>

              {active.description && (
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>{active.description}</Typography>
              )}

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {active.bedrooms != null && (
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t.properties.bedrooms}
                    </Typography>
                    <Typography variant="subtitle2">{active.bedrooms}</Typography>
                  </Grid>
                )}
                {active.bathrooms != null && (
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t.properties.bathrooms}
                    </Typography>
                    <Typography variant="subtitle2">{active.bathrooms}</Typography>
                  </Grid>
                )}
                {active.area_sqm != null && (
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t.properties.sqm}
                    </Typography>
                    <Typography variant="subtitle2">{Number(active.area_sqm).toFixed(0)}</Typography>
                  </Grid>
                )}
                {active.year_built && (
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t.properties.year}
                    </Typography>
                    <Typography variant="subtitle2">{active.year_built}</Typography>
                  </Grid>
                )}
                {active.developer?.name && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t.properties.developer}
                    </Typography>
                    <Typography variant="subtitle2">{active.developer.name}</Typography>
                  </Grid>
                )}
                {active.view && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t.properties.view}
                    </Typography>
                    <Typography variant="subtitle2">
                      <VisibilityOutlinedIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      {active.view}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {Array.isArray(active.amenities) && active.amenities.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    {t.properties.amenities}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {active.amenities.map((a) => (
                      <Chip key={a} label={a} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}
