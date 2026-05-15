import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
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
import ExpertPopup from './components/ExpertPopup'
import SellPage from './pages/SellPage'

function LandingPage() {
  return (
    <>
      <HeroSection />
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
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
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
        <ExpertPopup />
      </Box>
    </BrowserRouter>
  )
}
