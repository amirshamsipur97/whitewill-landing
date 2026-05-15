import { useRef } from 'react'
import { Box, Container, Typography, Button, IconButton, Stack } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useI18n } from '../i18n.jsx'

const MONGOOSE = '#BF9E77'
const PEARL_BUSH = '#F0EAE3'

const CATALOGS = [
  { key: 'aida', title: 'AIDA', img: '/catalogs/aida.png' },
  { key: 'jinan', title: 'Jinan Island', img: '/catalogs/jinan-island.png' },
  { key: 'st-regis', title: 'St. Regis Marsa Arabia', img: '/catalogs/st-regis-marsa-arabia.png' },
  { key: 'huzoom', title: 'Huzoom Villas', img: '/catalogs/huzoom-villas.png' },
  { key: 'aida-trump', title: 'AIDA Trump International Hotel', img: '/catalogs/aida-trump.png' },
  { key: 'wadi-zaha', title: 'Wadi Zaha', img: '/catalogs/wadi-zaha.png' },
  { key: 'yenaier', title: 'Yenaier', img: '/catalogs/yenaier.png' },
]

const MAGAZINE_IMG = '/catalogs/magazine-cover.png'

export default function CatalogCarousel() {
  const { t } = useI18n()
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * (271 + 24), behavior: 'smooth' })
  }

  const downloadAll = () => {
    // simple anchor download of the magazine cover (placeholder)
    const a = document.createElement('a')
    a.href = MAGAZINE_IMG
    a.download = 'oman-real-estate-catalog.png'
    a.click()
  }

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        py: { xs: 8, md: 14 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        {/* Title */}
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 500,
            fontSize: { xs: 32, sm: 40, md: 49 },
            lineHeight: 1.2,
            letterSpacing: '0.03em',
            color: PEARL_BUSH,
            textTransform: 'uppercase',
            maxWidth: 720,
            m: 0,
          }}
        >
          {t.catalog.title}
        </Typography>

        {/* Download button + subtitle row */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
          sx={{ mt: { xs: 3, md: 4 }, alignItems: { sm: 'center' } }}
        >
          <Button
            onClick={downloadAll}
            disableElevation
            sx={{
              bgcolor: MONGOOSE,
              color: '#fff',
              borderRadius: '4px',
              px: { xs: 5, md: 7 },
              py: 1.5,
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 500,
              fontSize: 12.3,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#a98963' },
            }}
          >
            {t.catalog.download}
          </Button>
          <Typography
            sx={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 500,
              color: '#fff',
              opacity: 0.8,
              fontSize: { xs: 16, md: 20 },
              lineHeight: 1.35,
              maxWidth: 400,
            }}
          >
            {t.catalog.sub}
          </Typography>
        </Stack>
      </Container>

      {/* Carousel + magazine overlay */}
      <Box
        sx={{
          position: 'relative',
          mt: { xs: 5, md: 8 },
          // leave room so the rotated magazine cover doesn't clip
          minHeight: { xs: 320, md: 560 },
        }}
      >
        {/* horizontal scrolling cards */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            pl: { xs: 2, md: 6 },
            pr: { xs: 2, md: '40%' }, // right space for the magazine
            pb: 2,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {CATALOGS.map((c) => (
            <Box
              key={c.key}
              sx={{
                position: 'relative',
                flex: '0 0 auto',
                width: { xs: 220, md: 271 },
                height: { xs: 220, md: 271 },
                borderRadius: '4px',
                padding: '26px',
                scrollSnapAlign: 'start',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
              }}
            >
              {/* inner image with blur "halo" behind + crisp on top */}
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '2px',
                    filter: 'blur(6px)',
                    backgroundImage: `url(${c.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '2px',
                    backgroundImage: `url(${c.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
                {/* hover label */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 1.5,
                    opacity: 0,
                    transition: 'opacity 0.25s',
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)',
                    borderRadius: '2px',
                    '.MuiBox-root:hover > &': { opacity: 1 },
                  }}
                  className="card-overlay"
                >
                  <Typography
                    sx={{
                      color: '#fff',
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {c.title}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* prev/next controls */}
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => scroll(-1)}
              aria-label="Previous catalogs"
              sx={{
                border: '1px solid rgba(255,255,255,0.18)',
                color: PEARL_BUSH,
                '&:hover': { borderColor: MONGOOSE, color: MONGOOSE },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => scroll(1)}
              aria-label="Next catalogs"
              sx={{
                border: '1px solid rgba(255,255,255,0.18)',
                color: PEARL_BUSH,
                '&:hover': { borderColor: MONGOOSE, color: MONGOOSE },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Container>

        {/* Floating magazine cover, rotated -15deg, on the right */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            display: { xs: 'none', md: 'block' },
            top: '50%',
            right: { md: '4%', lg: '7%' },
            width: { md: 360, lg: 460, xl: 510 },
            aspectRatio: '1 / 1',
            transform: 'translateY(-50%) rotate(-15deg)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {/* paper stack shadow behind the cover */}
          <Box
            sx={{
              position: 'absolute',
              top: '2.5%',
              left: 0,
              width: '60%',
              height: '95%',
              backgroundColor: 'rgba(255,255,255,0.01)',
              boxShadow:
                '-86px 58px 83px rgba(6,13,22,0.1), -56px 38px 49px rgba(6,13,22,0.17), -33px 22px 27px rgba(6,13,22,0.22), -17px 12px 14px rgba(6,13,22,0.26), -7px 5px 7px rgba(6,13,22,0.32), -2px 1px 3px rgba(6,13,22,0.43)',
            }}
          />
          {/* iridescent frame around the cover artwork */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              p: '14px',
              borderRadius: '2px',
              background:
                'linear-gradient(135deg, #d4cae0 0%, #f4e7c8 25%, #c8d8e8 50%, #f0d9d4 75%, #d4cae0 100%)',
              boxShadow:
                '0 30px 60px rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.4)',
            }}
          >
            <Box
              role="img"
              aria-label={`${t.catalog.magazineLabel} — ${t.catalog.magazineTitle}`}
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${MAGAZINE_IMG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
