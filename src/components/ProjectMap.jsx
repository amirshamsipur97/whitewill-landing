/**
 * ProjectMap — the small embedded Mapbox map on /buy/:slug.
 *
 * WHY ITS OWN FILE: this was defined inline in BuyProjectPage.jsx with a
 * STATIC `import mapboxgl from 'mapbox-gl'` at module top level, which welded
 * a 1.76 MB JS chunk (+40 KB CSS) onto all nine project money pages — parsed
 * and executed on every visit whether or not the visitor ever scrolled to the
 * map. Split out so BuyProjectPage can `lazy()` it, matching the pattern
 * SchoolsPage and App already use for their maps.
 */
import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAP_STYLE } from '../lib/mapStyle.js'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const INDIGO = '#391FAF'

if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN

export default function ProjectMap({ project }) {
  const ref = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!ref.current || !MAPBOX_TOKEN) return
    if (project.latitude == null || project.longitude == null) return

    const map = new mapboxgl.Map({
      container: ref.current,
      style: MAP_STYLE,
      center: [Number(project.longitude), Number(project.latitude)],
      zoom: 13.5,
      pitch: 30,
      attributionControl: false,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right')

    const wrap = document.createElement('div')
    wrap.style.cssText = `
      width: 22px; height: 22px;
      background: ${INDIGO};
      border: 2px solid rgba(255,255,255,0.95);
      border-radius: 50%;
      box-shadow: 0 6px 18px rgba(57,31,175,0.45), 0 0 0 6px rgba(57,31,175,0.25);
    `
    new mapboxgl.Marker({ element: wrap, anchor: 'center' })
      .setLngLat([Number(project.longitude), Number(project.latitude)])
      .addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [project.id, project.latitude, project.longitude])

  if (project.latitude == null || project.longitude == null) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: '"Arsenal SC", "Inter", sans-serif',
          fontSize: 13,
          bgcolor: 'rgba(255,255,255,0.04)',
        }}
      >
        Location coming soon
      </Box>
    )
  }
  return <Box ref={ref} sx={{ width: '100%', height: '100%' }} />
}
