import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
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

/**
 * Header — built to match the Figma "Demo design" navbar exactly.
 * Reference design tokens (from Figma node 158:16615):
 *  - bg:          rgba(8, 8, 10, 0.55) + backdrop-blur(9px)
 *  - border-bot:  1px rgba(255,255,255,0.08)
 *  - shadow:      0 12px 32px rgba(0,0,0,0.35) + inset 0 1px 0 rgba(255,255,255,0.06)
 *  - nav font:    Inter Medium 14 / 24.5 / letter-spacing 0.7 / color #fff
 *  - address:     Inter Regular 12 / 14.4 / color #f1e0e0
 *  - phone:       Inter Medium 14 / 24.5 / color #fff
 *  - online pill: border 1px #69ef1c, radius 6, height 18, text #69ef1c 11px
 *  - dividers:    vertical 48px, 1px rgba(255,255,255,0.12)
 *  - nav gap:     50px between items
 */

// Tailwind/MUI-friendly tokens lifted straight from the Figma node.
const NAV_FONT = {
  // Navbar links pinned to Arsenal SC Bold per brand spec.
  fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '24.5px',
  letterSpacing: '0.7px',
}
const ADDRESS_FONT = {
  // Address line stays Regular — it's body copy, not a UI control.
  fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '14.4px',
  color: '#f1e0e0',
}
const ONLINE_GREEN = '#69ef1c'

function VerticalDivider() {
  return (
    <Box
      aria-hidden
      sx={{
        width: '1px',
        height: 48,
        bgcolor: 'rgba(255,255,255,0.12)',
        flexShrink: 0,
      }}
    />
  )
}

export default function Header() {
  const { t, lang, setLang } = useI18n()
  const navigate = useNavigate()
  const [langAnchor, setLangAnchor] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const headerRef = useRef(null)

  // ── Hide / show navbar around pinned project sections ─────────────
  // DiscoverProperties + AthurayaCity dispatch `navbar:hide` when their
  // pin engages and `navbar:show` when it disengages. We tween yPercent
  // so the bar slides smoothly out and back in. Decoupled via events so
  // Header doesn't need to know about which sections exist.
  useEffect(() => {
    const hide = () => {
      if (!headerRef.current) return
      gsap.to(headerRef.current, {
        yPercent: -100,
        duration: 0.55,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    }
    const show = () => {
      if (!headerRef.current) return
      gsap.to(headerRef.current, {
        yPercent: 0,
        duration: 0.55,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    }
    window.addEventListener('navbar:hide', hide)
    window.addEventListener('navbar:show', show)
    return () => {
      window.removeEventListener('navbar:hide', hide)
      window.removeEventListener('navbar:show', show)
    }
  }, [])

  const navLinks = [
    { label: t.nav.buy, to: '/buy' },
    { label: t.nav.sell, to: '/sell' },
    { label: t.nav.project, to: '/' },
    { label: t.nav.maison, to: '/maison-shirdel' },
    { label: t.nav.invest, to: '/invest' },
    { label: t.nav.about, to: '/about' },
  ]

  const current = LANGS.find((l) => l.code === lang) || LANGS[0]

  return (
    <AppBar
      ref={headerRef}
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(8, 8, 10, 0.55)',
        backdropFilter: 'blur(9px) saturate(160%)',
        WebkitBackdropFilter: 'blur(9px) saturate(160%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 32px rgba(0,0,0,0.35)',
        willChange: 'transform',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 80 },
          px: { xs: 2, md: 6 },
          gap: { md: 3 },
        }}
      >
        {/* Logo */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: { md: 2 },
            textDecoration: 'none',
            color: 'inherit',
            transition: 'opacity 200ms ease',
            '&:hover': { opacity: 0.85 },
          }}
        >
          <Box
            component="img"
            src="/logo.svg"
            alt="Irfan Investment"
            sx={{
              height: { xs: 36, md: 44 },
              width: 'auto',
              display: 'block',
            }}
          />
        </Box>

        {/* Nav links — Figma uses 50px gap between items, hidden < lg */}
        <Stack
          direction="row"
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            gap: '50px',
            ml: 2,
          }}
        >
          {navLinks.map((item) => (
            <Box
              key={item.label}
              component={RouterLink}
              to={item.to}
              sx={{
                ...NAV_FONT,
                color: '#fff',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                position: 'relative',
                transition: 'opacity 180ms ease',
                '&:hover': { opacity: 0.75 },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Stack>

        {/* Pushes everything after to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Divider before phone block (lg+) */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
          <VerticalDivider />
        </Box>

        {/* Phone + Online badge */}
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}
        >
          <PhoneIcon sx={{ fontSize: 18, color: '#fff' }} />
          <Box
            component="a"
            href={`tel:${t.phone.replace(/[^+\d]/g, '')}`}
            sx={{
              ...NAV_FONT,
              color: '#fff',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { opacity: 0.85 },
            }}
          >
            {t.phone}
          </Box>
          <Box
            sx={{
              border: `1px solid ${ONLINE_GREEN}`,
              borderRadius: '6px',
              height: 18,
              px: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                color: ONLINE_GREEN,
                fontSize: 11,
                fontWeight: 500,
                lineHeight: 1,
                fontFamily: '"Arsenal SC", "Inter", system-ui, sans-serif',
                letterSpacing: '0.5px',
              }}
            >
              {t.online}
            </Typography>
          </Box>
        </Stack>

        {/* Divider between phone and address (lg+) */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
          <VerticalDivider />
        </Box>

        {/* Address — pre-line so '\n' in the string becomes a real line break */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            maxWidth: 260,
          }}
        >
          <Typography sx={{ ...ADDRESS_FONT, whiteSpace: 'pre-line' }}>
            {t.address}
          </Typography>
        </Box>

        {/* Language switcher */}
        <Button
          color="inherit"
          startIcon={<LanguageIcon sx={{ fontSize: 18 }} />}
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
          onClick={(e) => setLangAnchor(e.currentTarget)}
          sx={{
            ...NAV_FONT,
            color: '#fff',
            textTransform: 'none',
            ml: { xs: 0, lg: 2 },
            px: 1.5,
            minWidth: 0,
            '& .MuiButton-startIcon': { mr: 0.75 },
            '& .MuiButton-endIcon': { ml: 0.5 },
          }}
        >
          <Box component="span" sx={{ mr: 0.5, fontSize: 14 }}>
            {current.flag}
          </Box>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {current.label.split(' ')[0]}
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
              <ListItemIcon sx={{ minWidth: 32, fontSize: 18 }}>
                {l.flag}
              </ListItemIcon>
              <ListItemText primary={l.label} />
              {lang === l.code && (
                <CheckIcon
                  fontSize="small"
                  sx={{ ml: 1, color: 'primary.main' }}
                />
              )}
            </MenuItem>
          ))}
        </Menu>

        {/* Mobile hamburger */}
        <IconButton
          color="inherit"
          sx={{ display: { xs: 'inline-flex', lg: 'none' }, ml: 1 }}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile drawer — keeps all the desktop info available on phones */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        // MUI v6/v9 renamed `PaperProps` → `slotProps.paper`. Using
        // the old name leaks the prop to the DOM as `paperprops` and
        // triggers an "unknown attribute" warning.
        slotProps={{ paper: { sx: { bgcolor: 'background.default', width: 300 } } }}
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
                <ListItemText
                  primary={item.label}
                  // MUI v6/v9 renamed primary/secondaryTypographyProps
                  // → slotProps.primary / slotProps.secondary.
                  slotProps={{ primary: { sx: NAV_FONT } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href={`tel:${t.phone.replace(/[^+\d]/g, '')}`}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <PhoneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={t.phone}
                secondary={t.online}
                slotProps={{ secondary: { sx: { color: ONLINE_GREEN } } }}
              />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem>
            <Typography sx={{ ...ADDRESS_FONT, whiteSpace: 'pre-line' }}>
              {t.address}
            </Typography>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  )
}
