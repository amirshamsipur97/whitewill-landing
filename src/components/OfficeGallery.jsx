import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  ImageList,
  ImageListItem,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { officePhotos } from '../assets'
import { useI18n } from '../i18n.jsx'

export default function OfficeGallery() {
  const { t } = useI18n()
  const [active, setActive] = useState(0)
  const next = () => setActive((i) => (i + 1) % officePhotos.length)
  const prev = () => setActive((i) => (i - 1 + officePhotos.length) % officePhotos.length)

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Stack spacing={2} sx={{ textAlign: 'center', mb: 6, alignItems: 'center' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 56 }, fontWeight: 300 }}>
            {t.office.title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 720 }}>
            {t.office.sub}
          </Typography>
        </Stack>

        <Box
          sx={{
            position: 'relative',
            borderRadius: 1,
            overflow: 'hidden',
            aspectRatio: '16 / 7',
            background: `url(${officePhotos[active]}) center/cover`,
            transition: 'background-image 0.4s',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
          >
            <IconButton
              onClick={prev}
              sx={{
                bgcolor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={next}
              sx={{
                bgcolor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Box>

        <ImageList cols={4} gap={12} sx={{ mt: 2 }}>
          {officePhotos.map((src, i) => (
            <ImageListItem
              key={src}
              onClick={() => setActive(i)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                outline: i === active ? '2px solid' : 'none',
                outlineColor: 'primary.main',
                opacity: i === active ? 1 : 0.6,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 1 },
              }}
            >
              <img src={src} alt={`Office ${i + 1}`} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      </Container>
    </Box>
  )
}
