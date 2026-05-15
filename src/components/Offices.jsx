import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import DirectionsIcon from '@mui/icons-material/Directions'
import { useI18n } from '../i18n.jsx'

export default function Offices() {
  const { t } = useI18n()
  const mapSrc =
    'https://maps.google.com/maps?q=Muscat,Oman&t=&z=12&ie=UTF8&iwloc=&output=embed'

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{
            mb: 5,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
          }}
        >
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 56 }, fontWeight: 300 }}>
            {t.offices.title}
          </Typography>
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <LocationOnIcon sx={{ color: 'primary.main', mt: 0.4 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t.offices.address}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <PhoneIcon sx={{ color: 'primary.main' }} />
              <Button
                href="tel:+96876644000"
                color="inherit"
                sx={{ p: 0, justifyContent: 'flex-start', minWidth: 0 }}
              >
                +968 766 44000
              </Button>
            </Stack>
            <Button
              variant="outlined"
              startIcon={<DirectionsIcon />}
              href="https://maps.google.com/?q=Muscat,Oman"
              target="_blank"
              rel="noreferrer"
              sx={{ alignSelf: 'flex-start', mt: 1 }}
            >
              {t.offices.directions}
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            borderRadius: 1,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            aspectRatio: '16 / 7',
            bgcolor: 'background.paper',
          }}
        >
          <Box
            component="iframe"
            title="Whitewill Office, Muscat"
            src={mapSrc}
            sx={{
              width: '100%',
              height: '100%',
              border: 0,
              filter: 'grayscale(0.4) invert(0.92) hue-rotate(180deg)',
            }}
            allowFullScreen
            loading="lazy"
          />
        </Box>
      </Container>
    </Box>
  )
}
