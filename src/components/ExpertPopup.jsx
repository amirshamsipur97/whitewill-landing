import { useEffect, useState } from 'react'
import { Box, IconButton, Tooltip, Fade, Slide } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import TelegramIcon from '@mui/icons-material/Telegram'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import { useI18n } from '../i18n.jsx'

const STORAGE_KEY = 'ww_expert_dismissed'
const BROKER_IMG = '/hero/broker.png'

export default function ExpertPopup() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const dismissed = sessionStorage.getItem(STORAGE_KEY) === '1'
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setOpen(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  const reopen = () => setOpen(true)

  if (!mounted) return null

  return (
    <>
      {/* Sticky popup card */}
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Box
          role="complementary"
          aria-label={t.expertPopup.desc}
          sx={{
            position: 'fixed',
            right: { xs: 12, md: 24 },
            bottom: { xs: 12, md: 24 },
            zIndex: 1250,
            width: 220,
            pt: '38px',
          }}
        >
          {/* Avatar circle (overlapping the card top) */}
          <Box
            sx={{
              position: 'absolute',
              top: -2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 76,
              height: 76,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 6px 14px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(2px)',
              backgroundImage:
                'radial-gradient(circle at 50% 100%, rgba(191,158,119,0.85) 0%, rgba(191,158,119,0) 60%), linear-gradient(180deg, rgba(6,18,23,0.5), rgba(6,18,23,0.5))',
            }}
          >
            <Box
              component="img"
              src={BROKER_IMG}
              alt={t.expertPopup.name}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* Card body */}
          <Box
            sx={{
              position: 'relative',
              bgcolor: '#0C1B20',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 1,
              px: 2,
              pt: 6,
              pb: 2.5,
              textAlign: 'center',
              boxShadow:
                '2px 2px 4px rgba(0,10,13,0.31), 5px 4px 6px rgba(0,10,13,0.23), 10px 8px 10px rgba(0,10,13,0.18), 17px 13px 16px rgba(0,10,13,0.16), 28px 22px 22px rgba(0,10,13,0.13), 42px 33px 32px rgba(0,10,13,0.08)',
            }}
          >
            <Tooltip title={t.expertPopup.close}>
              <IconButton
                onClick={dismiss}
                size="small"
                aria-label={t.expertPopup.close}
                sx={{
                  position: 'absolute',
                  top: -36,
                  right: 14,
                  width: 22,
                  height: 22,
                  bgcolor: '#fff',
                  color: '#0C1B20',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&:hover': { bgcolor: '#fff' },
                  '& svg': { fontSize: 14 },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 500,
                color: '#fff',
                fontSize: 20,
                lineHeight: 1.15,
                mb: 1,
              }}
            >
              {t.expertPopup.name}
            </Box>

            <Box
              sx={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.5)',
                fontSize: 11,
                lineHeight: 1.25,
                maxWidth: 150,
                mx: 'auto',
                mb: 1.5,
              }}
            >
              {t.expertPopup.desc}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mb: 1.5,
              }}
            >
              <Tooltip title={t.expertPopup.whatsapp}>
                <IconButton
                  href="https://wa.me/96876644000"
                  target="_blank"
                  rel="noreferrer"
                  size="small"
                  aria-label={t.expertPopup.whatsapp}
                  sx={{
                    color: '#BF9E77',
                    border: '1px solid rgba(191,158,119,0.4)',
                    width: 28,
                    height: 28,
                    '& svg': { fontSize: 16 },
                    '&:hover': { bgcolor: 'rgba(191,158,119,0.1)' },
                  }}
                >
                  <WhatsAppIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t.expertPopup.telegram}>
                <IconButton
                  href="https://t.me/whitewill"
                  target="_blank"
                  rel="noreferrer"
                  size="small"
                  aria-label={t.expertPopup.telegram}
                  sx={{
                    color: '#BF9E77',
                    border: '1px solid rgba(191,158,119,0.4)',
                    width: 28,
                    height: 28,
                    '& svg': { fontSize: 16 },
                    '&:hover': { bgcolor: 'rgba(191,158,119,0.1)' },
                  }}
                >
                  <TelegramIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box
              component="a"
              href={`tel:${t.expertPopup.phone.replace(/\s/g, '')}`}
              sx={{
                display: 'block',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 400,
                color: '#fff',
                fontSize: 12.5,
                textDecoration: 'none',
                '&:hover': { color: '#BF9E77' },
              }}
            >
              {t.expertPopup.phone}
            </Box>
          </Box>
        </Box>
      </Slide>

      {/* Floating reopen button when popup is dismissed */}
      <Fade in={!open}>
        <Tooltip title={t.expertPopup.open} placement="left">
          <IconButton
            onClick={reopen}
            aria-label={t.expertPopup.open}
            sx={{
              position: 'fixed',
              right: { xs: 12, md: 24 },
              bottom: { xs: 12, md: 24 },
              zIndex: 1250,
              width: 56,
              height: 56,
              bgcolor: '#BF9E77',
              color: '#0C1B20',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              '&:hover': { bgcolor: '#d4b187' },
            }}
          >
            <ChatBubbleOutlineRoundedIcon />
          </IconButton>
        </Tooltip>
      </Fade>
    </>
  )
}
