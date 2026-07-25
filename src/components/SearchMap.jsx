/**
 * SearchMap — the project-level map beside the /project results list.
 *
 * Structure follows the Airbnb search page (Figma VPf1TVnzXcQ4ESr0EPjiAN,
 * node 1:2575): results list on one side, a sticky map on the other, and one
 * white rounded PRICE PILL per location rather than a generic teardrop pin.
 *
 * A pin here is a PROJECT, not a unit. The portal holds ~400 units across a
 * handful of developments, so unit-level pins would stack into an unreadable
 * pile over Al Mouj. Each pill therefore shows the project's entry price
 * ("from"), and clicking it filters the list to that project's own inventory.
 *
 * Pins are DERIVED: every project that has at least one available, priced unit
 * and real coordinates. Nothing is hardcoded, so a project that sells out
 * drops off the map and a new release appears on its own.
 *
 * mapbox-gl is 1.76 MB, so this file is imported with lazy() and rendered
 * behind a visibility gate — same pattern as ProjectMap on /buy/:slug.
 */
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN

const INK = '#141416'
const ACCENT = '#8c8d25'

// Airbnb keeps its pills to a few characters. "OMR 133,634" would be a
// paragraph at this size, so entry prices are abbreviated; the card in the
// list carries the exact figure.
function shortOmr(n) {
  const v = Number(n)
  if (!(v > 0)) return '—'
  if (v >= 1_000_000) return `OMR ${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1)}M`
  if (v >= 1000) return `OMR ${Math.round(v / 1000)}K`
  return `OMR ${v}`
}

const CSS = `
.smap-pin{
  display:inline-flex;align-items:center;gap:6px;white-space:nowrap;cursor:pointer;
  background:#fff;color:${INK};border:1px solid rgba(0,0,0,.08);
  border-radius:999px;padding:7px 12px;font-weight:700;font-size:13px;
  font-family:"Peyda","Arsenal SC","Inter",system-ui,sans-serif;
  box-shadow:0 2px 8px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04);
  transition:transform .16s cubic-bezier(.4,0,.2,1),background .16s,color .16s;
  will-change:transform}
.smap-pin:hover{transform:scale(1.08)}
.smap-pin .smap-name{display:none;font-weight:600;opacity:.72}
/* Selected pill inverts and reveals the project name, the way Airbnb's
   viewed-listing pill does. */
.smap-pin.is-on{background:${INK};color:#fff;border-color:${INK};
  box-shadow:0 4px 16px rgba(0,0,0,.45)}
.smap-pin.is-on .smap-name{display:inline;opacity:.7}
.smap-pin.is-dim{opacity:.45}
.smap-pin.is-dim:hover{opacity:1}
.mapboxgl-ctrl-logo,.mapboxgl-ctrl-attrib{opacity:.5}
`

export default function SearchMap({ projects, selectedId, onSelect }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(new Map())
  // Keep the latest callback without re-creating markers on every render.
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect

  // ── build the map once, and rebuild markers only when the pin set changes ──
  const key = projects.map((p) => `${p.id}:${p.minPrice}`).join(',')

  useEffect(() => {
    if (!ref.current || !MAPBOX_TOKEN || !projects.length) return
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: ref.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [58.4, 23.6],
        zoom: 8,
        attributionControl: false,
      })
      mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')
    }
    const map = mapRef.current

    for (const m of markersRef.current.values()) m.remove()
    markersRef.current.clear()

    const bounds = new mapboxgl.LngLatBounds()
    for (const p of projects) {
      const el = document.createElement('button')
      el.type = 'button'
      el.className = 'smap-pin'
      el.setAttribute(
        'aria-label',
        `${p.name}${p.parent ? ` (${p.parent})` : ''}, ${p.count} units from ${shortOmr(p.minPrice)}`,
      )
      el.title = p.parent ? `${p.name} · ${p.parent}` : p.name
      el.innerHTML =
        `<span class="smap-name"></span><span class="smap-price"></span>`
      el.querySelector('.smap-name').textContent = p.name
      el.querySelector('.smap-price').textContent = shortOmr(p.minPrice)
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        selectRef.current?.(p.id)
      })
      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([p.lng, p.lat])
        .addTo(map)
      markersRef.current.set(p.id, marker)
      bounds.extend([p.lng, p.lat])
    }

    // fitBounds MUST wait for the style to load. Calling it immediately after
    // `new mapboxgl.Map()` is silently ignored, leaving the map on its initial
    // centre/zoom — with Salalah ~700 km from Muscat that projected the pins
    // thousands of pixels outside the container, which also stretched the
    // document and gave the page a horizontal scrollbar.
    const fit = () => {
      if (bounds.isEmpty()) return
      map.resize() // the column is laid out by CSS grid; size can settle late
      map.fitBounds(bounds, { padding: 64, maxZoom: 11, duration: 0 })
    }
    if (map.isStyleLoaded()) fit()
    else map.once('load', fit)
    // Backstop: a resize that lands after 'load' (grid settling, mobile
    // toggle) would leave the fit stale. setTimeout, not rAF — rAF does not
    // fire in a hidden tab.
    const t = setTimeout(fit, 400)
    return () => {
      clearTimeout(t)
      map.off('load', fit)
      for (const m of markersRef.current.values()) m.remove()
      markersRef.current.clear()
    }
  }, [key])

  // Destroy the map only when the component truly unmounts.
  useEffect(() => () => { mapRef.current?.remove(); mapRef.current = null }, [])

  // ── selection: invert the chosen pill, dim the rest, ease the map over ──
  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      const el = marker.getElement()
      el.classList.toggle('is-on', String(id) === String(selectedId))
      el.classList.toggle('is-dim', Boolean(selectedId) && String(id) !== String(selectedId))
      // Selected pill must sit above its neighbours in the Muscat cluster.
      el.parentElement && (el.parentElement.style.zIndex = String(id) === String(selectedId) ? 5 : 1)
    }
    const map = mapRef.current
    if (!map || !selectedId) return
    const p = projects.find((x) => String(x.id) === String(selectedId))
    if (p) map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 12), duration: 650 })
  }, [selectedId, key])

  if (!MAPBOX_TOKEN) return null
  return (
    <>
      <style>{CSS}</style>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
    </>
  )
}
