/**
 * SiteFooter — branch-led footer.
 *
 * Layout (md+):
 *   ┌──────────────────────────────────────────────────────────────────┐
 *   │  [LOGO]                                  Sitemap | Buy / Sell /  │
 *   │  Maison Shirdel one-liner               About / Project / Maison │
 *   │  [social icons row]                                              │
 *   ├──────────────────────────────────────────────────────────────────┤
 *   │  [🇴🇲] Headquarters    [🇮🇷] Regional    [🇷🇺] Repr.    [🇭🇰] Asia  │
 *   │      Muscat                Tehran           Moscow        HK     │
 *   │      📍 address           📍 address       📍 ...        📍 ...   │
 *   │      📞 phone             📞 phone         📞 ...        📞 ...   │
 *   │      ✉ email              ✉ email          ✉ ...         ✉ ...    │
 *   ├──────────────────────────────────────────────────────────────────┤
 *   │  © 2026 Irfan Investment        Privacy · Terms · Cookies        │
 *   └──────────────────────────────────────────────────────────────────┘
 */

import { Box, Container, Typography, Stack, IconButton, Divider, Link as MuiLink } from '@mui/material'
import { LocalizedLink as RouterLink } from '../lib/localize.js'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import { BRANCHES } from '../data/branches'
import { useI18n } from '../i18n'

const OLIVE_BRIGHT = '#8c8d25'

// Page links shown in the footer sitemap column — these mirror the
// navbar items so the footer is a complete sitemap.
// `navKey` resolves to t.nav[...] and `legalKey` to t.footer.menu[...] at
// render time, so the footer follows the active language. `label` is the
// English fallback; brand wordmarks (Maison Shirdel) carry no key and stay.
const PAGE_LINKS = [
  { label: 'Buy', to: '/buy', navKey: 'buy' },
  { label: 'Sell', to: '/sell', navKey: 'sell' },
  { label: 'Project', to: '/', navKey: 'project' },
  { label: 'Maison Shirdel', to: '/maison-shirdel' },
  { label: 'About us', to: '/about', navKey: 'about' },
]

const LEGAL_LINKS = [
  { label: 'Privacy', to: '/', legalKey: 'privacy' },
  { label: 'Terms', to: '/', legalKey: 'userAgreement' },
  { label: 'Cookies', to: '/', legalKey: 'cookie' },
]

const SOCIALS = [
  { Icon: YouTubeIcon, href: 'https://www.youtube.com/@Irfan_Investment', label: 'YouTube' },
  { Icon: InstagramIcon, href: 'https://www.instagram.com/irfan_investment', label: 'Instagram' },
  { Icon: WhatsAppIcon, href: 'https://wa.me/message/L22KC3L6RYINE1', label: 'WhatsApp' },
]

// ── Single branch card ─────────────────────────────────────────────────
// Pulled into its own component so the grid can iterate cleanly and so
// the icon/label/value rows line up to a shared grid of `[icon column]
// [text column]` — no more drifting indentation between cities.
function BranchCard({ branch }) {
  const tel = branch.phone.replace(/\s+/g, '')
  return (
    <Box
      sx={{
        pt: 3,
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Flag + city header — flag locked at 32×22, baseline-aligned with
          city name via flex centre. */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Box
          component="img"
          src={branch.flag}
          alt={`${branch.country} flag`}
          loading="lazy"
          sx={{
            width: 32,
            height: 22,
            objectFit: 'cover',
            borderRadius: '3px',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 9.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: OLIVE_BRIGHT,
              lineHeight: 1,
              mb: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {branch.label}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.1,
              color: '#fff',
            }}
          >
            {branch.city}
          </Typography>
        </Box>
      </Stack>

      {/* Address / phone / email rows — uniform `[16px icon] [text]`
          grid so every line breaks against the same left edge. */}
      <Box sx={{ display: 'grid', rowGap: 1.25 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '18px 1fr', columnGap: 1, alignItems: 'start' }}>
          <PlaceRoundedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', mt: '3px' }} />
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.5,
              whiteSpace: 'pre-line',
            }}
          >
            {branch.address}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '18px 1fr', columnGap: 1, alignItems: 'center' }}>
          <LocalPhoneRoundedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }} />
          <MuiLink
            href={`tel:${tel}`}
            underline="none"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.72)',
              '&:hover': { color: '#fff' },
            }}
          >
            {branch.phone}
          </MuiLink>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '18px 1fr', columnGap: 1, alignItems: 'center' }}>
          <EmailRoundedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }} />
          <MuiLink
            href={`mailto:${branch.email}`}
            underline="none"
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.72)',
              wordBreak: 'break-all',
              '&:hover': { color: '#fff' },
            }}
          >
            {branch.email}
          </MuiLink>
        </Box>
      </Box>
    </Box>
  )
}

export default function SiteFooter() {
  const year = new Date().getFullYear()
  const { t } = useI18n()
  const pageLabel = (l) => (l.navKey && t?.nav?.[l.navKey]) || l.label
  const legalLabel = (l) => (l.legalKey && t?.footer?.menu?.[l.legalKey]) || l.label

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#000',
        color: '#fff',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 7, md: 10 }, pb: { xs: 4, md: 5 } }}>
        {/* ── Top row: logo / blurb / sitemap ──────────────────────── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'start',
            mb: { xs: 6, md: 8 },
          }}
        >
          <Box>
            {/* Same /logo.svg the navbar uses — keeps the brand mark
                identical on top and bottom of the page. */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                mb: 3,
                textDecoration: 'none',
                transition: 'opacity 200ms ease',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <Box
                component="img"
                src="/logo.svg"
                alt="Irfan Investment"
                sx={{ height: { xs: 44, md: 52 }, width: 'auto', display: 'block' }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Arsenal SC", "Inter", sans-serif',
                fontSize: { xs: 16, md: 18 },
                color: 'rgba(255,255,255,0.78)',
                maxWidth: 540,
                lineHeight: 1.55,
                mb: 3,
              }}
            >
              A premium real estate brokerage in Oman, operating under
              Maison Shirdel, connecting global capital with curated
              developments across Oman and emerging investment destinations.
            </Typography>

            {/* Social icons — YouTube · Instagram · WhatsApp. useFlexGap so the
                gap is a symmetric CSS `gap` (uniform in RTL too); plain Stack
                spacing uses one-sided margins that collapse under direction:rtl. */}
            <Stack direction="row" spacing={2} useFlexGap>
              {SOCIALS.map(({ Icon, href, label }) => (
                <IconButton
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  sx={{
                    border: '1px solid rgba(255,255,255,0.14)',
                    color: 'rgba(255,255,255,0.78)',
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    transition: 'all 180ms ease',
                    '&:hover': { color: '#fff', borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  <Icon sx={{ fontSize: 26 }} />
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Right column: sitemap — page links + global presence label */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr' },
              gap: 4,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 10.5,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: OLIVE_BRIGHT,
                  mb: 2,
                }}
              >
                Sitemap
              </Typography>
              <Stack spacing={1.25}>
                {PAGE_LINKS.map((l) => (
                  <MuiLink
                    key={l.label}
                    component={RouterLink}
                    to={l.to}
                    underline="none"
                    sx={{
                      fontFamily: '"Arsenal SC", "Inter", sans-serif',
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.78)',
                      transition: 'color 180ms ease, transform 180ms ease',
                      display: 'inline-block',
                      '&:hover': { color: '#fff', transform: 'translateX(3px)' },
                    }}
                  >
                    {pageLabel(l)}
                  </MuiLink>
                ))}
              </Stack>
            </Box>

            {/* Latin content (flags + English city names) — pin to LTR so it
                stays flag-left / left-aligned under RTL locales (ar/fa). */}
            <Box dir="ltr" sx={{ textAlign: 'left' }}>
              <Typography
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 10.5,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: OLIVE_BRIGHT,
                  mb: 2,
                }}
              >
                Global presence
              </Typography>
              <Stack spacing={1.25}>
                {BRANCHES.map((b) => (
                  <Stack key={b.code} direction="row" spacing={1.25} alignItems="center">
                    <Box
                      component="img"
                      src={b.flag}
                      alt=""
                      aria-hidden
                      sx={{
                        width: 22,
                        height: 15,
                        objectFit: 'cover',
                        borderRadius: '2px',
                        flexShrink: 0,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: '"Arsenal SC", "Inter", sans-serif',
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.78)',
                      }}
                    >
                      {b.city}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* ── Middle row: branch detail grid ───────────────────────── */}
        {/* All-Latin content (flags, English city/label/address/phone/email) —
            pin to LTR so cards order naturally and align flag-left under RTL. */}
        <Box
          dir="ltr"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 3, md: 4 },
            mb: { xs: 5, md: 7 },
          }}
        >
          {BRANCHES.map((b) => (
            <BranchCard key={b.code} branch={b} />
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        {/* ── Bottom row: copyright + legal ────────────────────────── */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 0 }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ pt: { xs: 3, md: 4 } }}
        >
          <Typography
            sx={{
              fontFamily: '"Arsenal SC", "Inter", sans-serif',
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            © {year} Irfan Investment Group · All rights reserved
          </Typography>

          <Stack direction="row" spacing={3} alignItems="center">
            {LEGAL_LINKS.map((l) => (
              <MuiLink
                key={l.label}
                component={RouterLink}
                to={l.to}
                underline="none"
                sx={{
                  fontFamily: '"Arsenal SC", "Inter", sans-serif',
                  fontSize: 12.5,
                  color: 'rgba(255,255,255,0.55)',
                  '&:hover': { color: '#fff' },
                }}
              >
                {legalLabel(l)}
              </MuiLink>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
