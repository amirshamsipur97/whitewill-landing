/**
 * SchoolsMap — a compact Mapbox map plotting the featured international
 * schools (same visual language as the property PropertyMap: dark style,
 * olive pins). Data comes from the Supabase `schools` table via the parent.
 * Each pin popup links out to the school's official website.
 */
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const OLIVE_BRIGHT = '#8c8d25'

export default function SchoolsMap({ schools = [], visitLabel = 'Visit website' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const pins = schools.filter((s) => s.latitude != null && s.longitude != null)
    if (!containerRef.current || !TOKEN || pins.length === 0) return

    mapboxgl.accessToken = TOKEN
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [58.35, 23.59],
      zoom: 9.4,
      cooperativeGestures: true,
      attributionControl: false,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    const bounds = new mapboxgl.LngLatBounds()
    pins.forEach((s) => {
      const el = document.createElement('div')
      el.style.cssText =
        'width:16px;height:16px;border-radius:50%;background:' + OLIVE_BRIGHT +
        ';border:2px solid #fff;box-shadow:0 0 0 4px rgba(140,141,37,0.25);cursor:pointer;transition:transform .15s'
      el.onmouseenter = () => { el.style.transform = 'scale(1.3)' }
      el.onmouseleave = () => { el.style.transform = 'scale(1)' }
      const site = s.website
        ? `<a href="${s.website}" target="_blank" rel="noopener noreferrer" style="color:${OLIVE_BRIGHT};text-decoration:none;font-weight:600">${visitLabel} &#8599;</a>`
        : ''
      const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
        `<div style="font-family:system-ui,sans-serif;min-width:150px">
           <div style="font-weight:700;color:#111;margin-bottom:2px">${s.name}</div>
           <div style="font-size:12px;color:#555;margin-bottom:6px">${s.area || ''}</div>
           ${site}
         </div>`,
      )
      new mapboxgl.Marker(el).setLngLat([s.longitude, s.latitude]).setPopup(popup).addTo(map)
      bounds.extend([s.longitude, s.latitude])
    })

    map.on('load', () => {
      try { map.fitBounds(bounds, { padding: 70, maxZoom: 12, duration: 0 }) } catch { /* single/no pin */ }
    })

    return () => { try { map.remove() } catch { /* already gone */ } }
  }, [schools, visitLabel])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
