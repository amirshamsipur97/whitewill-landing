import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#C9A961', contrastText: '#0a0a0a' },
    secondary: { main: '#ffffff' },
    background: { default: '#0a0a0a', paper: '#111111' },
    text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.65)' },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Inter", "Manrope", "Noto Kufi Arabic", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 300, letterSpacing: '0.02em', textTransform: 'uppercase' },
    h2: { fontWeight: 300, letterSpacing: '0.02em', textTransform: 'uppercase' },
    h3: { fontWeight: 400, letterSpacing: '0.04em' },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.05em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 2, paddingInline: 24, paddingBlock: 12 },
        outlined: { borderColor: 'rgba(255,255,255,0.2)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})

export default theme
