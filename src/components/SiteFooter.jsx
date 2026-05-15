import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link,
  IconButton,
  Divider,
} from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import TelegramIcon from '@mui/icons-material/Telegram'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import { useI18n } from '../i18n.jsx'

export default function SiteFooter() {
  const { t } = useI18n()
  const MENU = [
    {
      title: t.footer.agency,
      items: [t.footer.menu.about, t.footer.menu.team, t.footer.menu.careers, t.footer.menu.news, t.footer.menu.contacts],
    },
    {
      title: t.footer.properties,
      items: [t.footer.menu.buy, t.footer.menu.sell, t.footer.menu.rent, t.footer.menu.projects, t.footer.menu.catalogs],
    },
    {
      title: t.footer.legal,
      items: [t.footer.menu.userAgreement, t.footer.menu.privacy, t.footer.menu.cookie],
    },
  ]
  return (
    <Box
      component="footer"
      sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.2em', mb: 2 }}>
              WHITEWILL
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t.footer.desc}
            </Typography>
            <Link
              href="tel:+96876644000"
              underline="none"
              sx={{ color: 'text.primary', fontWeight: 500, display: 'block', mb: 2 }}
            >
              +968 766 44000
            </Link>
            <Stack direction="row" spacing={1}>
              <IconButton
                href="https://wa.me/96876644000"
                target="_blank"
                rel="noreferrer"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
              <IconButton
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <TelegramIcon fontSize="small" />
              </IconButton>
              <IconButton
                href="https://facebook.com/"
                target="_blank"
                rel="noreferrer"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {MENU.map((col) => (
            <Grid key={col.title} size={{ xs: 6, md: 2 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                {col.title}
              </Typography>
              <Stack spacing={1}>
                {col.items.map((item) => (
                  <Link
                    key={item}
                    href="#"
                    underline="hover"
                    sx={{ color: 'text.primary', fontSize: 14 }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          {t.footer.license}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {t.footer.disclaimer}
        </Typography>
      </Container>
    </Box>
  )
}
