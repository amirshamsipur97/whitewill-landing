import {
  Box,
  Container,
  Grid,
  Typography,
  CardActionArea,
  Stack,
} from '@mui/material'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { projects } from '../assets'
import { useI18n } from '../i18n.jsx'

export default function Projects() {
  const { t } = useI18n()
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
            {t.projects.title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 360 }}>
            {t.projects.sub}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {projects.map((p) => (
            <Grid key={p.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <CardActionArea
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  '&:hover .proj-img': { transform: 'scale(1.06)' },
                }}
              >
                <Box sx={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                  <Box
                    className="proj-img"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${p.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.6s ease',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85))',
                    }}
                  />
                  <Stack
                    direction="row"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      p: 3,
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 500 }}>
                        {p.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {p.sub}
                      </Typography>
                    </Box>
                    <ArrowOutwardIcon sx={{ color: 'primary.main' }} />
                  </Stack>
                </Box>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
