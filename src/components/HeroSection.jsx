import { Box, Container, Typography } from '@mui/material'
import { useI18n } from '../i18n.jsx'

const HERO_IMG = '/hero/team.png'
const AWARD_TEXT = '/hero/award-text.svg'
const AWARD_CUP = '/hero/award-cup.png'

export default function HeroSection() {
  const { t } = useI18n()

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        pb: { xs: 6, md: 10 },
        boxShadow: '0px 15px 20px 10px rgba(0,0,0,0.75)',
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 7 } }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: { xs: '16 / 9', md: '1307 / 320' },
            overflow: 'hidden',
            borderRadius: 1,
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Box
          sx={{
            mt: { xs: 4, md: 7 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
            columnGap: { md: 6 },
            rowGap: { xs: 4, md: 0 },
            alignItems: 'start',
          }}
        >
          {/* Left: Title with overlapping award badge */}
          <Box sx={{ position: 'relative' }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 500,
                color: '#F0EAE3',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontSize: { xs: 44, sm: 56, md: 65 },
                lineHeight: 1.1,
                m: 0,
              }}
            >
              {t.hero.title1}
            </Typography>

            <Typography
              component="span"
              sx={{
                display: 'block',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 500,
                color: '#F0EAE3',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontSize: { xs: 44, sm: 56, md: 65 },
                lineHeight: 1.1,
                pl: { xs: '20%', md: '30%' },
                mt: 0.5,
              }}
            >
              {t.hero.title2}
            </Typography>

            {/* Circular award badge */}
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                left: { xs: 0, md: 0 },
                top: { xs: 'calc(100% - 60px)', md: '78px' },
                width: { xs: 96, md: 128 },
                height: { xs: 96, md: 128 },
                pointerEvents: 'none',
              }}
            >
              <Box
                component="img"
                src={AWARD_TEXT}
                alt=""
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  animation: 'ww-spin 28s linear infinite',
                  '@keyframes ww-spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Box
                component="img"
                src={AWARD_CUP}
                alt=""
                sx={{
                  position: 'absolute',
                  inset: '20% 14% 10% 14%',
                  width: '72%',
                  height: '70%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Box>

          {/* Right: Photo caption + Subtitle */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: { xs: 3, md: 5 },
              pt: { md: 1 },
            }}
          >
            <Box
              sx={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 500,
                color: '#FFFFFF',
                fontSize: { xs: 11, md: 11.5 },
                lineHeight: 1.4,
                textAlign: { xs: 'left', md: 'right' },
              }}
            >
              <Box>{t.hero.teamLine1}</Box>
              <Box>{t.hero.teamLine2}</Box>
            </Box>

            <Box
              sx={{
                maxWidth: 600,
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 500,
                color: '#FFFFFF',
                fontSize: { xs: 16, md: 20 },
                lineHeight: 1.25,
                textAlign: { xs: 'left', md: 'right' },
              }}
            >
              {t.hero.sub}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
