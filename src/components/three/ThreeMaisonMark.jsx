import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import * as THREE from 'three'

/**
 * 3D Maison "M" mark — pure static, no idle motion.
 *
 * The mark itself never rotates, sways, or floats on its own. It's a fixed
 * piece of art that the *parent* timeline scales and fades in/out via the
 * imperative handle exposed below. The renderer only does work when the
 * exposed setters are called — no continuous animation loop.
 *
 * Parent (AboutFounder) uses this through a ref:
 *
 *   const mark = useRef(null)
 *   tl.to({}, {
 *     onUpdate() { mark.current.setScale(...); mark.current.setOpacity(...) }
 *   })
 *
 * Why imperative + a ref instead of GSAP inside this component:
 *   - The parent's master timeline owns the WHOLE choreography, so the
 *     mark, photo, and columns all scrub against the SAME scroll progress.
 *   - Reverse works for free, because GSAP scrub already supports it.
 */
const ThreeMaisonMark = forwardRef(function ThreeMaisonMark(_props, ref) {
  const containerRef = useRef(null)
  const apiRef = useRef({
    setScale: () => {},
    setOpacity: () => {},
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- Scene setup -------------------------------------------------------
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // --- Mark texture + mesh ----------------------------------------------
    const loader = new THREE.TextureLoader()
    const texture = loader.load('/maison-mark.png', () => render())
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8

    // Plane sized to natural aspect of the PNG (~799×521 → ~8.5:5.5).
    const markGeo = new THREE.PlaneGeometry(8.5, 5.5, 16, 16)
    const markMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const mark = new THREE.Mesh(markGeo, markMat)
    // Fixed pose — exactly the angle the static design called for.
    mark.rotation.set(0.5, -0.7, -0.15)
    mark.scale.setScalar(0.8) // starts a touch smaller; parent grows it
    scene.add(mark)

    // --- Static particle halo (no motion) ---------------------------------
    const particleCount = 50
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 2.5
      const theta = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(theta) * r
      positions[i * 3 + 1] = Math.sin(theta) * r * 0.6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xb5a674,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // --- Render only on demand --------------------------------------------
    // We render once initially, then whenever the parent calls setScale/Opacity.
    // No idle rAF loop → no wasted CPU/GPU when the user isn't scrolling.
    const render = () => {
      renderer.render(scene, camera)
    }

    // Expose imperative API to the parent so the master timeline can
    // drive the mark's scale + opacity exactly like any other tween target.
    apiRef.current.setScale = (s) => {
      mark.scale.setScalar(s)
      render()
    }
    apiRef.current.setOpacity = (o) => {
      markMat.opacity = o
      particleMat.opacity = o * 0.4
      render()
    }
    // Initial render
    render()

    // --- Resize handling ---------------------------------------------------
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      render()
    }
    window.addEventListener('resize', onResize)

    // --- Cleanup -----------------------------------------------------------
    return () => {
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      texture.dispose()
      markGeo.dispose()
      markMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Expose the imperative API to the parent via ref.
  useImperativeHandle(ref, () => ({
    setScale: (s) => apiRef.current.setScale(s),
    setOpacity: (o) => apiRef.current.setOpacity(o),
  }))

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      }}
    />
  )
})

export default ThreeMaisonMark
