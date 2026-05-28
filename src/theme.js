import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#C9A961', contrastText: '#0a0a0a' },
    secondary: { main: '#ffffff' },
    background: { default: '#000000', paper: '#0a0a0a' },
    text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.65)' },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: { borderRadius: 4 },
  typography: {
    // Arsenal SC is the brand display + body face. Inter / Manrope stay
    // in the fallback stack so non-Latin glyphs (Arabic, Cyrillic) and
    // pre-cache renders never go to system serif.
    fontFamily: '"Arsenal SC", "Inter", "Manrope", "Noto Kufi Arabic", system-ui, -apple-system, sans-serif',
    // Headings + buttons explicitly Bold (700) per brand spec — Arsenal SC
    // only ships Regular + Bold, so we lean into Bold for visual hierarchy.
    h1: { fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' },
    h2: { fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' },
    h3: { fontWeight: 700, letterSpacing: '0.04em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.05em' },
    // Paragraph copy stays Regular for readability.
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
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
