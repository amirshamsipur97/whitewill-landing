import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import CloseIcon from '@mui/icons-material/Close'
import { reviews } from '../assets'
import { useI18n } from '../i18n.jsx'

export default function Testimonials() {
  const { t } = useI18n()
  const [open, setOpen] = useState(null)

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          sx={{ mb: 5, justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 56 }, fontWeight: 300 }}>
            {t.reviews.title}
          </Typography>
          <Chip
            icon={<StarIcon sx={{ color: 'primary.main !important' }} />}
            label={
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ fontWeight: 700 }}>5.0</Box>
                <Box sx={{ color: 'text.secondary', fontSize: 12 }}>· {reviews.length} {t.reviews.ratings}</Box>
              </Stack>
            }
            variant="outlined"
            sx={{ borderColor: 'divider', py: 2.5, px: 1 }}
          />
        </Stack>

        <Grid container spacing={3}>
          {reviews.map((r, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      {r.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{r.name}</Typography>
                      <Rating value={r.rating} size="small" readOnly />
                    </Box>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {r.text}
                  </Typography>
                  <Button
                    onClick={() => setOpen(r)}
                    sx={{ alignSelf: 'flex-start', mt: 2, color: 'primary.main', px: 0 }}
                  >
                    {t.reviews.readFull}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={Boolean(open)} onClose={() => setOpen(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          {open?.name}
          <IconButton
            onClick={() => setOpen(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Rating value={open?.rating || 0} readOnly sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {open?.text}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
