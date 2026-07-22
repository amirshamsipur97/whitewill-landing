import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'
import { useIsMobile } from './hooks/useIsMobile'
import SeoManager from './seo.jsx'
import { useI18n } from './i18n.jsx'
import { trackPageView } from './analytics.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * ScrollManager — resets scroll + recalculates ScrollTrigger on every
 * client-side navigation.
 *
 * Without this, two things go wrong when the user switches pages:
 *   1) The browser keeps the previous page's scrollTop. Land on a new
 *      route halfway down and ScrollTriggers think their entrance is
 *      already finished — sections render in "end state" and the page
 *      looks broken / unloaded.
 *   2) Triggers on the unmounted page leave stale measurements behind.
 *      A refresh() forces every remaining trigger to recompute against
 *      the new DOM.
 *
 * We do BOTH eagerly:
 *   - useLayoutEffect runs SYNCHRONOUSLY before paint, so the user never
 *     sees the new route at the wrong scroll position.
 *   - useEffect chains a refresh() after the new page has mounted and
 *     a second one ~300 ms later to catch lazy chunks (PropertyMap, etc.)
 *     that change the page height once they arrive.
 *
 * Hash links (#section) are left alone — the browser's native anchor
 * jump should win.
 */
/**
 * AnalyticsManager — sends a manual GA4 page_view on every route change AND
 * whenever the visitor switches language (so a re-view in another language is
 * counted with the right title). GA4 base config uses send_page_view:false, so
 * this is the ONLY place page_views originate. Title carries page name + lang;
 * content_group carries the page category.
 */
function AnalyticsManager() {
  const { pathname } = useLocation()
  const { lang } = useI18n()
  useEffect(() => {
    trackPageView({ path: pathname, lang })
  }, [pathname, lang])
  return null
}

function ScrollManager() {
  const { pathname, hash } = useLocation()

  // Listen for the synthetic 'app:beforenav' event we dispatch from the
  // patched history.pushState (see main.jsx). Firing in capture phase
  // means we kill ScrollTriggers + orphan pin-spacers BEFORE React Router
  // commits the new route, so the next page mounts onto a clean DOM.
  useEffect(() => {
    const cleanup = () => {
      // 1. Kill every active ScrollTrigger so they don't fight the new page.
      try {
        ScrollTrigger.getAll().forEach((t) => {
          try { t.kill() } catch {}
        })
      } catch {}

      // 2. Remove every orphan pin-spacer that GSAP may have left behind.
      //    GSAP's auto-generated wrappers carry the .pin-spacer class.
      try {
        document.querySelectorAll('.pin-spacer').forEach((el) => {
          // Move children out first so we don't lose anything important.
          while (el.firstChild) {
            try { el.parentNode?.insertBefore(el.firstChild, el) } catch { break }
          }
          try { el.remove() } catch {}
        })
      } catch {}
    }
    window.addEventListener('app:beforenav', cleanup)
    return () => window.removeEventListener('app:beforenav', cleanup)
  }, [])

  useLayoutEffect(() => {
    if (hash) return
    // Lenis owns the visible scroll position; jump it instantly so the
    // smoothing engine doesn't lerp across pages. Fall back to native
    // window.scrollTo if Lenis hasn't booted yet.
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true, force: true })
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  useEffect(() => {
    // Immediate refresh — picks up the new route's component tree.
    ScrollTrigger.refresh()
    // Follow-up refresh — covers lazy-loaded chunks (e.g. PropertyMap)
    // and image/video metadata that resolves a few hundred ms later.
    const id = setTimeout(() => ScrollTrigger.refresh(), 350)
    return () => clearTimeout(id)
  }, [pathname])

  return null
}
import ScrollVideoHero from './components/ScrollVideoHero'
import AboutFounder from './components/AboutFounder'
import LogosMarquee from './components/LogosMarquee'
import DiscoverProperties from './components/DiscoverProperties'
import AthurayaCity from './components/AthurayaCity'
import GlobalPresence from './components/GlobalPresence'
import AkdtScrollVideo from './components/AkdtScrollVideo'
import HearFromTheTeam from './components/HearFromTheTeam'
// Mapbox is ~800 KB gzipped — split it out so the initial bundle stays light.
// The map sits low on the page, so users almost always reach it after the
// hero is interactive.
const PropertyMap = lazy(() => import('./components/PropertyMap'))
import WaterfrontResidences from './components/WaterfrontResidences'
import HorizontalCarousel from './components/HorizontalCarousel'
import ContactCTA from './components/ContactCTA'
import SalalahPopup from './components/SalalahPopup.jsx'
import SiteFooter from './components/SiteFooter'
import BackToTop from './components/BackToTop'
import CookieBanner from './components/CookieBanner'
import ChatWidget from './components/chat/ChatWidget'
// Page routes are code-split — each lives in its own chunk so a visitor
// who only browses the landing never downloads the BuyProject or About
// bundles. PropertyMap (Mapbox, ~1MB) was already split above and stays
// split here too.
const BuyPage = lazy(() => import('./pages/BuyPage'))
const BuyProjectPage = lazy(() => import('./pages/BuyProjectPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const MaisonShirdelPage = lazy(() => import('./pages/MaisonShirdelPage'))
const InvestPage = lazy(() => import('./pages/InvestPage'))
const InvestmentPage = lazy(() => import('./pages/InvestmentPage'))
const InvestmentLegalPage = lazy(() => import('./pages/InvestmentLegalPage'))
const CarImportPage = lazy(() => import('./pages/CarImportPage'))
const SchoolsPage = lazy(() => import('./pages/SchoolsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const MetaLandingPage = lazy(() => import('./pages/MetaLandingPage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))
const InsightDetailPage = lazy(() => import('./pages/InsightDetailPage'))
const InsightsAdminPage = lazy(() => import('./pages/InsightsAdminPage'))

// Bare placeholder while a route chunk loads. Kept transparent + tall
// enough to prevent a layout collapse on slow networks.
function RouteFallback() {
  return <Box sx={{ minHeight: '70vh', bgcolor: '#000' }} />
}

// Mounts children only once the wrapper nears the viewport. Used for the
// Mapbox section: the lazy import used to fire on first render anyway,
// pulling ~500 KB of map JS into the critical load. Now the chunk download
// starts a bit over one viewport before the user reaches the map.
function DeferredMount({ children, minHeight }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || show) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShow(true)
        io.disconnect()
      }
    }, { rootMargin: '200% 0px' })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Box ref={ref} sx={show ? undefined : { minHeight }}>{show ? children : null}</Box>
}

function LandingPage() {
  // Heavy scroll-pinned sections (DiscoverProperties +620vh,
  // AthurayaCity +900vh, AkdtScrollVideo +1100vh + 21-second video scrub,
  // HorizontalCarousel +650vh horizontal strip) were designed for desktop.
  // On a phone they pin a single tile to the viewport for thousands of
  // pixels of scroll, which feels broken — the page seems frozen and
  // mobile Safari throttles the video scrub anyway. We drop them entirely
  // below 900 px and let the user reach the meatier sections (map,
  // residences, contact form) much faster.
  const isMobile = useIsMobile()

  return (
    <>
      <ScrollVideoHero />
      <div id="after-video-hero" />
      {/* The hero pins for 500vh, so even AboutFounder sits five viewports
          below the first paint — deferring it keeps its DOM, GSAP work and
          the founder portrait out of the critical load. */}
      <DeferredMount minHeight="120vh"><AboutFounder /></DeferredMount>
      <DeferredMount minHeight="40vh"><LogosMarquee /></DeferredMount>
      {/* Every below-fold section is DeferredMount-ed: the hero pins for
          500vh, so none of these can be seen at load — mounting them there
          only burned main-thread time (GSAP timelines, char splits, pins)
          inside the Lighthouse TBT window. Placeholder heights approximate
          each section's pinned scroll length; the swap happens ~2 viewports
          before arrival, below the visible screen. */}
      {!isMobile && (
        <DeferredMount minHeight="720vh"><DiscoverProperties /></DeferredMount>
      )}
      {!isMobile && (
        <DeferredMount minHeight="1000vh"><AthurayaCity /></DeferredMount>
      )}
      <DeferredMount minHeight="120vh"><GlobalPresence /></DeferredMount>
      {!isMobile && (
        <DeferredMount minHeight="1200vh"><AkdtScrollVideo /></DeferredMount>
      )}
      {!isMobile && (
        <DeferredMount minHeight="110vh"><HearFromTheTeam /></DeferredMount>
      )}
      {/* PropertyMap is a lazy chunk. The fallback height MUST approximate
          the loaded section's actual height — otherwise the page jumps
          when the chunk swaps in. ~1080 px md, ~1600 px xs. */}
      <DeferredMount minHeight={{ xs: 1600, md: 1080 }}>
        <Suspense
          fallback={
            <Box
              sx={{
                minHeight: { xs: 1600, md: 1080 },
                py: { xs: 4, md: 6 },
              }}
            />
          }
        >
          <PropertyMap />
        </Suspense>
      </DeferredMount>
      <DeferredMount minHeight="130vh"><WaterfrontResidences /></DeferredMount>
      {!isMobile && (
        <DeferredMount minHeight="750vh"><HorizontalCarousel /></DeferredMount>
      )}
      <DeferredMount minHeight="120vh">
        <ContactCTA source="landing_contact" />
      </DeferredMount>
      {/* Floating "back to top" — hidden until the user scrolls past one
          viewport-height, then materialises centred at the bottom. */}
      <BackToTop />
    </>
  )
}

// The page routes, defined ONCE as paths RELATIVE to a language prefix. This
// component is mounted under each `/:lang/*` prefix and under `/*` (English),
// so the same definitions serve `/buy` and `/ar/buy` without duplication.
function PageRoutes() {
  return (
    <Routes>
      <Route path="" element={<LandingPage />} />
      <Route path="buy" element={<BuyPage />} />
      <Route path="buy/:slug" element={<BuyProjectPage />} />
      <Route path="maison-shirdel" element={<MaisonShirdelPage />} />
      <Route path="invest" element={<InvestPage />} />
      <Route path="investment" element={<InvestmentPage />} />
      <Route path="investment/legal" element={<InvestmentLegalPage />} />
      <Route path="car-import" element={<CarImportPage />} />
      <Route path="schools" element={<SchoolsPage />} />
      <Route path="insights" element={<InsightsPage />} />
      <Route path="insights/:slug" element={<InsightDetailPage />} />
      <Route path="insights-admin" element={<InsightsAdminPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="privacy" element={<PrivacyPage />} />
      {/* Meta-ads landing (quiz funnel). Deliberately NOT in seo.jsx, so
          SeoManager emits noindex; App hides site chrome on /lp/*. */}
      <Route path="lp/oman" element={<MetaLandingPage />} />
      {/* Unknown URLs (legacy Webflow, random crawls) render a real 404 — NOT
          the homepage — so they aren't indexed as homepage duplicates.
          SeoManager emits noindex for these paths. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  // BrowserRouter now lives in main.jsx (so I18nProvider can read the URL).
  // The admin panel stays free of visitor-facing launchers (chat + lead popup).
  const { pathname } = useLocation()
  const isAdmin = pathname.includes('/insights-admin')
  // Ads landing pages (/lp/*) render without the site chrome — every extra
  // nav link is an exit path for paid traffic.
  const isLp = pathname.includes('/lp/')
  return (
    <Box
      id="app-root"
      sx={{
        // Pure #000000 everywhere — no more scroll-driven fade to white.
        bgcolor: '#000000',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <ScrollManager />
      <SeoManager />
      <AnalyticsManager />
      {!isLp && <Header />}
      <main>
        <Suspense fallback={<RouteFallback />}>
          {/* Localized URL prefixes (ar/ru/fa). English is prefix-less under /*. */}
          <Routes>
            <Route path="/ar/*" element={<PageRoutes />} />
            <Route path="/ru/*" element={<PageRoutes />} />
            <Route path="/fa/*" element={<PageRoutes />} />
            <Route path="/*" element={<PageRoutes />} />
          </Routes>
        </Suspense>
      </main>
      {/* The footer's 4-office grid is a big DOM subtree that no route shows
          above the fold — mounting it lazily trims initial style/layout work
          on every page. */}
      {!isLp && <DeferredMount minHeight="90vh"><SiteFooter /></DeferredMount>}
      <CookieBanner />
      {!isAdmin && !isLp && <ChatWidget />}
      {/* Site-wide purple lead launcher + popup (auto-opens on the landing
          page only; the pill mirrors the chat pill's size at bottom-left). */}
      {!isAdmin && !isLp && <SalalahPopup />}
    </Box>
  )
}
