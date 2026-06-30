import { useState } from 'react'
import { useLocalizedNavigate as useNavigate } from '../lib/localize.js'
import {
  Container,
  Grid,
  CardActionArea,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { sellImg, rentImg } from '../assets'
import { useI18n } from '../i18n.jsx'
import { submitForm } from '../supabase'

export default function LeadCards() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const CARDS = [
    { key: 'sell', title: t.leadCards.sell, img: sellImg, navTo: '/sell' },
    { key: 'rent', title: t.leadCards.rent, img: rentImg },
  ]
  const [openKey, setOpenKey] = useState(null)
  const [snack, setSnack] = useState({ open: false, severity: 'success', msg: '' })
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', type: 'apartment', notes: '' })

  const card = CARDS.find((c) => c.key === openKey)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitForm({
        source: openKey === 'sell' ? 'sell_landing' : 'rent_landing',
        full_name: form.name,
        phone: form.phone,
        property_interest: form.type,
        message: form.notes || null,
        language: lang,
      })
      setOpenKey(null)
      setForm({ name: '', phone: '', type: 'apartment', notes: '' })
      setSnack({ open: true, severity: 'success', msg: t.leadDialog.success })
    } catch (err) {
      setSnack({ open: true, severity: 'error', msg: err.message || 'Submit failed' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClick = (c) => {
    if (c.navTo) navigate(c.navTo)
    else setOpenKey(c.key)
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {CARDS.map((c) => (
            <Grid key={c.key} size={{ xs: 12, md: 6 }}>
              <CardActionArea
                onClick={() => handleClick(c)}
                sx={{
                  position: 'relative',
                  height: 220,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover .lead-img': { transform: 'scale(1.05)' },
                }}
              >
                <Box
                  className="lead-img"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url(${c.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.6s ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 3, md: 5 },
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 300 }}>
                    {c.title}
                  </Typography>
                  <ArrowOutwardIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                </Box>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog
        open={Boolean(openKey)}
        onClose={() => setOpenKey(null)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { bgcolor: 'background.paper', backgroundImage: 'none' } } }}
      >
        <form onSubmit={submit}>
          <DialogTitle>{card?.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {t.leadDialog.desc}
            </Typography>
            <TextField
              fullWidth
              required
              label={t.leadDialog.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              required
              label={t.leadDialog.phone}
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label={t.leadDialog.type}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="apartment">{t.leadDialog.types.apartment}</MenuItem>
              <MenuItem value="villa">{t.leadDialog.types.villa}</MenuItem>
              <MenuItem value="penthouse">{t.leadDialog.types.penthouse}</MenuItem>
              <MenuItem value="commercial">{t.leadDialog.types.commercial}</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label={t.leadDialog.notes}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenKey(null)} color="inherit" disabled={submitting}>
              {t.leadDialog.cancel}
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? '...' : t.leadDialog.send}
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
