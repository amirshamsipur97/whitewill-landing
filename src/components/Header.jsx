import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LanguageIcon from '@mui/icons-material/Language'
import PhoneIcon from '@mui/icons-material/PhoneInTalk'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckIcon from '@mui/icons-material/Check'
import { useI18n, LANGS } from '../i18n.jsx'

export default function Header() {
  const { t, lang, setLang } = useI18n()
  const navigate = useNavigate()
  const [langAnchor, setLangAnchor] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navLinks = [
    { label: t.nav.buy, to: '/sell' },
    { label: t.nav.sell, to: '/sell' },
    { label: t.nav.rent, to: '/' },
    { label: t.nav.projects, to: '/' },
    { label: t.nav.about, to: '/' },
  ]

  const current = LANGS.find((l) => l.code === lang) || LANGS[0]

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 80 }, px: { xs: 2, md: 6 } }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: '0.2em', mr: 4, color: 'inherit', textDecoration: 'none' }}
        >
          WHITEWILL
        </Typography>

        <Stack
          direction="row"
          spacing={3}
          sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}
        >
          {navLinks.map((item) => (
            <Button
              key={item.label}
              component={RouterLink}
              to={item.to}
              color="inherit"
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ display: { xs: 'none', lg: 'flex' }, mr: 2, alignItems: 'center' }}
        >
          <Box sx={{ textAlign: 'right', maxWidth: 280 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>
              {t.address}
            </Typography>
          </Box>
        </Stack>

        <Button
          href="tel:+96896786933"
          startIcon={<PhoneIcon fontSize="small" />}
          color="inherit"
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            border: '1px solid',
            borderColor: 'divider',
            mr: 1,
          }}
          endIcon={
            <Chip
              label={t.online}
              size="small"
              color="success"
              sx={{ height: 18, fontSize: 10, '& .MuiChip-label': { px: 0.75 } }}
            />
          }
        >
          +968 (967) 8-6933
        </Button>

        <Button
          color="inherit"
          startIcon={<LanguageIcon fontSize="small" />}
          endIcon={<KeyboardArrowDownIcon fontSize="small" />}
          onClick={(e) => setLangAnchor(e.currentTarget)}
        >
          <Box component="span" sx={{ mr: 0.5 }}>{current.flag}</Box>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {current.label}
          </Box>
        </Button>
        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={() => setLangAnchor(null)}
        >
          {LANGS.map((l) => (
            <MenuItem
              key={l.code}
              selected={lang === l.code}
              onClick={() => {
                setLang(l.code)
                setLangAnchor(null)
              }}
              sx={{ minWidth: 180 }}
            >
              <ListItemIcon sx={{ minWidth: 32, fontSize: 18 }}>{l.flag}</ListItemIcon>
              <ListItemText primary={l.label} />
              {lang === l.code && <CheckIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />}
            </MenuItem>
          ))}
        </Menu>

        <IconButton
          color="inherit"
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: 'background.default', width: 280 } }}
      >
        <List>
          {navLinks.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false)
                  navigate(item.to)
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton component="a" href="tel:+96896786933">
              <ListItemText primary="+968 (967) 8-6933" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  )
}
