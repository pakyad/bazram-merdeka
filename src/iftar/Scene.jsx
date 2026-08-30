import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useMaghrib, useScrollProgress } from '../motion.js'
import { SkyRig } from './SkyRig.jsx'
import { Stadium } from './Stadium.jsx'
import { CameraRig } from './CameraRig.jsx'
import { Overlays } from './Overlays.jsx'
import { Nav, Footer } from '../ui.jsx'

gsap.registerPlugin(ScrollTrigger)

function TimeAdvance({ timeRef, active }) {
  useFrame((state, delta) => {
    if (active) timeRef.current += delta
  })
  return null
}

export function IftarCanvas() {
  const progress = useScrollProgress()
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const maghrib = useMaghrib()
  const timeRef = useRef(0)
  const [floodlightIntensity, setFloodlightIntensity] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.to({}, {
        duration: 1,
        onUpdate: () => {
          const p = progress
          if (p > 0.45) {
            setFloodlightIntensity(Math.min(1, (p - 0.45) / 0.2))
          }
        }
      })
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: self => {
          const p = self.progress
          if (p > 0.45) {
            setFloodlightIntensity(Math.min(1, (p - 0.45) / 0.2))
          }
        }
      })
    })
    return () => ctx.revert()
  }, [progress, reducedMotion])

  return (
    <>
      <div className="iftar-canvas" aria-hidden="true">
        <Canvas
          gl={{ preserveDrawingBuffer: false, powerPreference: 'high-performance', antialias: true, alpha: false }}
          camera={{ position: [0, 6, 28], fov: 50, near: 0.1, far: 200 }}
          shadows={{ type: THREE.PCFSoftShadowMap, autoClear: true }}
          frameloop="demand"
        >
          <color attach="background" args={['#0b0f14']} />
          <fog attach="fog" args={['#0b0f14', 10, 80]} />
          <TimeAdvance timeRef={timeRef} active={!reducedMotion} />
          <directionalLight
            position={[30, 50, 20]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={1}
            shadow-camera-far={100}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-bias={-0.0005}
          />
          <ambientLight intensity={0.6} color="#fff8f0" />
          <hemisphereLight groundColor="#1a1f2a" skyColor="#fff8f0" intensity={0.5} />

          <CameraRig progress={progress} reducedMotion={reducedMotion} />
          <Stadium progress={progress} floodlightIntensity={floodlightIntensity} />
        </Canvas>
      </div>

      <SkyRig progress={progress} time={timeRef.current} />

      <div className="story-content">
        <Overlays progress={progress} maghrib={maghrib} />
        <Footer />
      </div>
    </>
  )
}

export function IftarScene() {
  const rootRef = useRef(null)
  const [lenisReady, setLenisReady] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reduced ? 0 : 1.0, smoothWheel: !reduced })
    lenis.on('scroll', ScrollTrigger.update)
    let raf
    const loop = t => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    const onAnchorClick = e => {
      const a = e.target.closest('a[href^="#"],a[href^="/#"]')
      if (!a) return
      const href = a.getAttribute('href')
      const hash = href.startsWith('/#') ? href.slice(1) : href
      if (href.startsWith('/#') && window.location.pathname !== '/') return
      const el = document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -96 })
    }
    document.addEventListener('click', onAnchorClick)
    setLenisReady(true)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); document.removeEventListener('click', onAnchorClick) }
  }, [])

  if (!lenisReady) return <div className="story" style={{ minHeight: '100vh' }}><Nav /><div className="story-content"><Footer /></div></div>

  return (
    <main ref={rootRef} className="story" id="main">
      <Nav />
      <IftarCanvas />
    </main>
  )
}