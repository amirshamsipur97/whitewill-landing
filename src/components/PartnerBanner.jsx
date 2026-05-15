import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material'
import HandshakeIcon from '@mui/icons-material/Handshake'
import { ipadImg } from '../assets'
import { useI18n } from '../i18n.jsx'
import { submitForm } from '../supabase'

export default function PartnerBanner() {
  const { t, lang } = useI18n()
  const [open, setOpen] = useState(false)
  const [snack, setSnack] = useState({ open: false, severity: 'success', msg: '' })
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitForm({
        source: 'partner',
        full_name: form.name,
        phone: form.phone,
        email: form.email,
        language: lang,
      })
      setOpen(false)
      setForm({ name: '', phone: '', email: '' })
      setSnack({ open: true, severity: 'success', msg: t.partner.success })
    } catch (err) {
      setSnack({ open: true, severity: 'error', msg: err.message || 'Submit failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Grid container spacing={0} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 4, md: 8 } }}>
              <Typography
                variant="overline"
                sx={{ color: 'primary.main', letterSpacing: '0.2em' }}
              >
                {t.partner.eyebrow}
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: 36, md: 56 }, fontWeight: 300, mt: 1, mb: 2 }}
              >
                {t.partner.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 4, maxWidth: 480 }}>
                {t.partner.sub}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<HandshakeIcon />}
                onClick={() => setOpen(true)}
              >
                {t.partner.cta}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ minHeight: { xs: 280, md: 480 } }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: 'inherit',
                  background: `url(${ipadImg}) center/cover`,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={submit}>
          <DialogTitle>{t.partner.dialog}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                required
                label={t.partner.fullName}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextField
                required
                type="tel"
                label={t.leadDialog.phone}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <TextField
                required
                type="email"
                label={t.feedback.email}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit" disabled={submitting}>
              {t.leadDialog.cancel}
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? '...' : t.partner.apply}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
