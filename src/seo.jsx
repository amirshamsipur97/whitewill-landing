import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * SeoManager — per-route <head> metadata for the SPA.
 *
 * The static index.html ships sensible homepage defaults (title, description,
 * canonical, Open Graph, Twitter, JSON-LD) that non-JS social scrapers read.
 * Once React mounts, this component rewrites the route-specific tags on every
 * navigation so JS-rendering crawlers (Googlebot) index each page with its
 * own title/description/canonical instead of the homepage defaults.
 *
 * It mutates the live document head directly (no extra dependency like
 * react-helmet) — small, dependency-free, and enough for basic SEO.
 */

const SITE = 'https://www.irfaninvest.com'

const DEFAULT_DESC =
  'A premium real estate brokerage in Oman, connecting global capital with curated developments across Oman and emerging investment destinations.'

const ROUTES = {
  '/': {
    title: 'Irfan Investment Group — Premium Real Estate in Oman',
    desc: DEFAULT_DESC,
  },
  '/buy': {
    title: 'Buy Property in Oman | Irfan Investment Group',
    desc: 'Browse curated properties and developments for sale across Oman — apartments, villas and luxury residences from leading developers.',
  },
  '/sell': {
    title: 'Sell Your Property in Oman | Irfan Investment Group',
    desc: 'Sell your property in Oman with Irfan Investment Group — expert valuation, global reach and a premium brokerage experience.',
  },
  '/maison-shirdel': {
    title: 'Maison Shirdel — Luxury Residences in Oman | Irfan Investment',
    desc: 'Discover Maison Shirdel, a collection of luxury residences curated by Irfan Investment Group in Oman.',
  },
  '/invest': {
    title: 'Company Registration & Investment in Oman | Irfan Investment Group',
    desc: 'Company formation & business setup in Oman with up to 100% foreign ownership — LLC, SPC & joint-stock registration, Commercial Registration (CR), licensing, corporate banking, investor visas and tax (15% corporate, 5% VAT). Updated 2026 legal & regulatory framework.',
  },
  '/investment': {
    title: 'سرمایه‌گذاری در عمان | Irfan Investment Group',
    desc: 'فرصت‌های سرمایه‌گذاری در عمان؛ املاک، توسعه و کسب‌وکار، همراه با مشاوره و بدرقهٔ کامل برای سرمایه‌گذاران.',
  },
  '/about': {
    title: 'About Irfan Investment Group',
    desc: 'Irfan Investment Group is a strategic investment division focused on business growth and international real estate opportunities.',
  },
}

function titleCase(s) {
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function resolve(pathname) {
  if (ROUTES[pathname]) return ROUTES[pathname]
  const m = pathname.match(/^\/buy\/([^/]+)/)
  if (m) {
    const name = titleCase(decodeURIComponent(m[1]))
    return {
      title: `${name} — Property for Sale in Oman | Irfan Investment Group`,
      desc: `Explore ${name}, a curated development in Oman offered by Irfan Investment Group — view available units, pricing and details.`,
    }
  }
  return ROUTES['/']
}

// Upsert a <meta> tag identified by an attribute/value pair.
function setMeta(attr, value, content) {
  let el = document.head.querySelector(`meta[${attr}="${value}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function SeoManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, desc } = resolve(pathname)
    const url = SITE + (pathname === '/' ? '/' : pathname)

    document.title = title
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', desc)
    setCanonical(url)
  }, [pathname])

  return null
}
