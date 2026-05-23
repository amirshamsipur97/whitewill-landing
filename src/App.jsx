import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'

gsap.registerPlugin(ScrollTrigger)
import ScrollVideoHero from './components/ScrollVideoHero'
import AboutFounder from './components/AboutFounder'
import LogosMarquee from './components/LogosMarquee'
import DiscoverProperties from './components/DiscoverProperties'
import AthurayaCity from './components/AthurayaCity'
import GlobalPresence from './components/GlobalPresence'
import AkdtScrollVideo from './components/AkdtScrollVideo'
import LeadCards from './components/LeadCards'
import CatalogCarousel from './components/CatalogCarousel'
import AwardsRow from './components/AwardsRow'
import Testimonials from './components/Testimonials'
import FeedbackForm from './components/FeedbackForm'
import Projects from './components/Projects'
import OfficeGallery from './components/OfficeGallery'
import PartnerBanner from './components/PartnerBanner'
import Offices from './components/Offices'
import SiteFooter from './components/SiteFooter'
import CookieBanner from './components/CookieBanner'
import ChatWidget from './components/chat/ChatWidget'
import SellPage from './pages/SellPage'

function LandingPage() {
  // Smooth bg transition: after AthurayaCity ends, fade the page bg
  // from the dark theme color → #F7F7F7 over ~70vh of scroll. Reverses
  // naturally on scroll-up because `scrub` is tied to scroll progress.
  const bgTransitionRef = useRef(null)
  useEffect(() => {
    if (!bgTransitionRef.current) return
    const appRoot = document.getElementById('app-root')
    if (!appRoot) return

    const FROM_BG = '#0a0a0a'
    const TO_BG = '#F7F7F7'

    // Baseline so the inline style wins over the MUI theme bgcolor.
    appRoot.style.backgroundColor = FROM_BG

    const trigger = ScrollTrigger.create({
      trigger: bgTransitionRef.current,
      start: 'top 90%',   // marker just entered viewport bottom
      end: 'top 20%',     // marker near top of viewport (~70vh later)
      scrub: 1.2,         // soft lag for the buttery feel the user asked for
      onUpdate: (self) => {
        appRoot.style.backgroundColor = gsap.utils.interpolate(
          FROM_BG, TO_BG, self.progress,
        )
      },
    })

    return () => {
      trigger.kill()
      appRoot.style.backgroundColor = ''
    }
  }, [])

  return (
    <>
      <ScrollVideoHero />
      <div id="after-video-hero" />
      <AboutFounder />
      <LogosMarquee />
      <DiscoverProperties />
      <AthurayaCity />
      <GlobalPresence />
      <AkdtScrollVideo />
      {/* 0-height marker — acts as the scroll anchor for the bg fade.
          Lives right after the AKDT video so the transition starts the
          moment that section's pin releases. */}
      <Box
        ref={bgTransitionRef}
        aria-hidden
        sx={{ height: 0, width: '100%', pointerEvents: 'none' }}
      />
      <LeadCards />
      <CatalogCarousel />
      <AwardsRow />
      <Testimonials />
      <FeedbackForm />
      <Projects />
      <OfficeGallery />
      <PartnerBanner />
      <Offices />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Box
        id="app-root"
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
          // Smooth bg-color tween from JS — keeps the transition feeling
          // continuous even if scrub-lag overshoots slightly.
          transition: 'background-color 120ms linear',
        }}
      >
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/buy" element={<SellPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <SiteFooter />
        <CookieBanner />
        <ChatWidget />
      </Box>
    </BrowserRouter>
  )
}
