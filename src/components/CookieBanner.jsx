import { useEffect, useState } from 'react'
import { Box, Button, Container, Link, Stack, Typography, Slide } from '@mui/material'
import { useI18n } from '../i18n.jsx'

const KEY = 'ww_cookie_ack'

export default function CookieBanner() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setOpen(!localStorage.getItem(KEY))
  }, [])

  const dismiss = () => {
    localStorage.setItem(KEY, '1')
    setOpen(false)
  }

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 1300,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 6,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t.cookie.msg}{' '}
              <Link href="#" underline="hover" sx={{ color: 'primary.main' }}>
                {t.cookie.policy}
              </Link>
            </Typography>
            <Button variant="contained" color="primary" onClick={dismiss}>
              {t.cookie.continue}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Slide>
  )
}
