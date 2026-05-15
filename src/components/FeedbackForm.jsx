import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Rating,
  Stack,
  Snackbar,
  Alert,
  Avatar,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { ceoImg } from '../assets'
import { useI18n } from '../i18n.jsx'
import { submitForm } from '../supabase'

export default function FeedbackForm() {
  const { t, lang } = useI18n()
  const [rating, setRating] = useState(5)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [snack, setSnack] = useState({ open: false, severity: 'success', msg: '' })
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitForm({
        source: 'feedback',
        full_name: form.name,
        email: form.email,
        message: form.message,
        rating,
        language: lang,
      })
      setSnack({ open: true, severity: 'success', msg: t.feedback.success })
      setForm({ name: '', email: '', message: '' })
      setRating(5)
    } catch (err) {
      setSnack({ open: true, severity: 'error', msg: err.message || 'Submit failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 44 }, fontWeight: 300, mb: 2 }}>
              {t.feedback.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 4 }}>
              {t.feedback.sub}
            </Typography>

            <Box component="form" onSubmit={submit}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t.feedback.rating}
                  </Typography>
                  <Rating
                    value={rating}
                    onChange={(_, v) => setRating(v ?? 0)}
                    size="large"
                    sx={{ display: 'block', mt: 0.5 }}
                  />
                </Box>
                <TextField
                  fullWidth
                  required
                  label={t.feedback.name}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <TextField
                  fullWidth
                  required
                  type="email"
                  label={t.feedback.email}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={4}
                  label={t.feedback.msg}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<SendIcon />}
                  disabled={submitting}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {submitting ? '...' : t.feedback.submit}
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                aspectRatio: '4 / 5',
                background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85)), url(${ceoImg}) center/cover`,
              }}
            >
              <Box sx={{ position: 'absolute', bottom: 24, left: 24 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    mb: 1.5,
                  }}
                >
                  MS
                </Avatar>
                <Typography variant="h6">Mohsen Shirdeli</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {t.feedback.ceo}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
