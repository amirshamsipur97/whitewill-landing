import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { awards } from '../assets'
import { useI18n } from '../i18n.jsx'

export default function AwardsRow() {
  const { t } = useI18n()
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 300 }}>
              {t.awards.title1}
              <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                {t.awards.title2}
              </Box>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography sx={{ color: 'text.secondary', mb: 4, maxWidth: 600 }}>
              {t.awards.sub}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              {awards.map((a) => (
                <Box
                  key={a}
                  sx={{
                    flex: 1,
                    minWidth: 140,
                    px: 3,
                    py: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <EmojiEventsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
