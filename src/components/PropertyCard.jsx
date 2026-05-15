import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

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
  return 'OMR ' + new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n)
}

function typeLabel(p) {
  return p.property_type
    ? p.property_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : ''
}

export default function PropertyCard({ property: p, t, lang }) {
  const tag = p.foreign_ownership_allowed
    ? t.sellPage.tags.fromDeveloper
    : p.is_itc_zone
    ? t.sellPage.tags.forInvestors
    : null

  const completion = p.year_built
    ? p.status === 'completed'
      ? 'Completed'
      : `Q1 ${p.year_built}`
    : '—'

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color .2s, transform .2s',
        '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' },
      }}
    >
      <CardActionArea sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}>
        {/* Image */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '462 / 325',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${imageFor(p)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Tag chip top right */}
          {tag && (
            <Chip
              label={tag}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                bgcolor: 'rgba(15, 27, 32, 0.85)',
                backdropFilter: 'blur(4px)',
                color: '#F0EAE3',
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 999,
                border: '1px solid rgba(191,158,119,0.4)',
              }}
            />
          )}
          {/* Bedrooms ribbon top left */}
          {p.bedrooms != null && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                px: 1.2,
                py: 0.5,
                borderRadius: 0.5,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {p.bedrooms} BR
            </Box>
          )}
        </Box>

        {/* Content */}
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              fontSize: 18,
              lineHeight: 1.2,
              mb: 0.5,
              minHeight: 44,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {p.title}
          </Typography>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', color: 'text.secondary', mb: 2, minHeight: 20 }}
          >
            {p.area?.name && (
              <>
                <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
                <Typography variant="body2" sx={{ fontSize: 12 }}>
                  {p.area.name}
                  {p.area.city ? ` / ${p.area.city}` : ''}
                </Typography>
              </>
            )}
          </Stack>

          {/* Info row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 2,
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {typeLabel(p)}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'primary.main' }}>
                {p.price_omr != null
                  ? `${t.sellPage.priceFrom} ${formatPrice(p.price_omr, lang)}`
                  : t.sellPage.priceOnRequest}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {t.sellPage.developer}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 12,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {p.developer?.name || '—'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {t.sellPage.completion}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 500 }}>
                {completion}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
