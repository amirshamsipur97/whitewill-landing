/**
 * SchoolsMap — a compact Mapbox map plotting the featured international
 * schools (same visual language as the property PropertyMap: dark style,
 * olive pins). Data comes from the Supabase `schools` table via the parent.
 *
 * Hover a pin to reveal a card with the school's summary + a link to its
 * official website. IMPORTANT: Mapbox positions each marker element with a
 * CSS `transform: translate(...)`. Applying a hover `scale()` to that SAME
 * element wipes the translate and the pin jumps to the map's top-left corner.
 * So the hover scale is applied to an INNER dot element, never the marker.
 */
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAP_STYLE } from '../lib/mapStyle.js'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const OLIVE_BRIGHT = '#8c8d25'

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function popupHtml(s, visitLabel) {
  const site = s.website
    ? `<a href="${esc(s.website)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;color:${OLIVE_BRIGHT};text-decoration:none;font-weight:600;font-size:12.5px">${esc(visitLabel)} &#8599;</a>`
    : ''
  return (
    `<div style="font-family:system-ui,-apple-system,sans-serif;min-width:170px;max-width:230px">
       <div style="font-weight:700;color:#111;font-size:14px;line-height:1.3;margin-bottom:3px">${esc(s.name)}</div>
       ${s.area ? `<div style="font-size:12px;color:#555;margin-bottom:2px">${esc(s.area)}</div>` : ''}
       ${s.curriculum ? `<div style="font-size:12px;color:#8c8d25">${esc(s.curriculum)}</div>` : ''}
       ${site}
     </div>`
  )
}

export default function SchoolsMap({ schools = [], visitLabel = 'Visit website' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const pins = schools.filter((s) => s.latitude != null && s.longitude != null)
    if (!containerRef.current || !TOKEN || pins.length === 0) return

    mapboxgl.accessToken = TOKEN
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [58.35, 23.59],
      zoom: 9.4,
      cooperativeGestures: true,
      attributionControl: false,
    })
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    const bounds = new mapboxgl.LngLatBounds()

    pins.forEach((s) => {
      // Outer element: Mapbox owns its transform (positioning). Do NOT restyle it.
      const el = document.createElement('div')
      el.style.cssText = 'width:18px;height:18px;cursor:pointer'
      // Inner dot: safe to scale on hover.
      const dot = document.createElement('div')
      dot.style.cssText =
        'width:16px;height:16px;margin:1px;border-radius:50%;background:' + OLIVE_BRIGHT +
        ';border:2px solid #fff;box-shadow:0 0 0 4px rgba(140,141,37,0.25);transition:transform .15s ease;transform-origin:center'
      el.appendChild(dot)

      const popup = new mapboxgl.Popup({ offset: 16, closeButton: false, closeOnClick: false })
        .setLngLat([s.longitude, s.latitude])
        .setHTML(popupHtml(s, visitLabel))

      let hideTimer
      const show = () => { clearTimeout(hideTimer); dot.style.transform = 'scale(1.35)'; if (!popup.isOpen()) popup.addTo(map) }
      const scheduleHide = () => { hideTimer = setTimeout(() => { dot.style.transform = 'scale(1)'; popup.remove() }, 260) }

      el.addEventListener('mouseenter', show)
      el.addEventListener('mouseleave', scheduleHide)
      // Keep the popup open while the pointer is over it, so its link is clickable.
      popup.on('open', () => {
        const pe = popup.getElement()
        if (!pe) return
        pe.addEventListener('mouseenter', () => clearTimeout(hideTimer))
        pe.addEventListener('mouseleave', scheduleHide)
      })

      new mapboxgl.Marker(el).setLngLat([s.longitude, s.latitude]).addTo(map)
      bounds.extend([s.longitude, s.latitude])
    })

    map.on('load', () => {
      try { map.fitBounds(bounds, { padding: 70, maxZoom: 12, duration: 0 }) } catch { /* single/no pin */ }
    })

    return () => { try { map.remove() } catch { /* already gone */ } }
  }, [schools, visitLabel])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
