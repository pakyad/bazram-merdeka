import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const STARS = Array.from({ length: 56 }, (_, i) => ({
  left: (i * 61.8) % 100,
  top: (i * 37.3) % 62,
  s: i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
  o: 0.35 + ((i * 29) % 50) / 100,
}))

export function useLenis() {
  const lenisRef = useRef(null)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reduced ? 0 : 1.0, smoothWheel: !reduced })
    lenisRef.current = lenis
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
    return () => { cancelAnimationFrame(raf); lenis.destroy(); document.removeEventListener('click', onAnchorClick) }
  }, [])
  return lenisRef
}

export function useMotion(root, home = false) {
  const lenisRef = useLenis()
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = lenisRef.current
    const ctx = gsap.context(() => {
      gsap.set('.progress', { scaleX: 0, transformOrigin: 'left center' })
      gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } })
      if (home) {
        ScrollTrigger.create({ trigger: '.hero', start: 'bottom 88px', onEnter: () => document.body.classList.add('nav-light'), onLeaveBack: () => document.body.classList.remove('nav-light') })
      }
      if (reduced) return
      if (home) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.nav-inner>*', { y: -12, opacity: 0, stagger: 0.04, duration: 0.4 })
          .from('.hero h1 span', { yPercent: 110, stagger: 0.08, duration: 0.72 }, '-=0.08')
          .from('.hero-lead,.hero-meta,.hero-actions', { y: 15, opacity: 0, stagger: 0.07, duration: 0.42 }, '-=0.32')
          .from('.hero-photo', { x: 28, opacity: 0, scale: 0.98, duration: 0.7 }, '-=0.5')
      } else if (document.querySelector('.subhero')) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.nav-inner>*', { y: -12, opacity: 0, stagger: 0.04, duration: 0.4 })
          .from('.subhero h1, .subhero p, .subhero-photo', { y: 18, opacity: 0, stagger: 0.07, duration: 0.55 }, '-=0.1')
      } else {
        gsap.from('.nav-inner>*', { y: -12, opacity: 0, stagger: 0.04, duration: 0.4, ease: 'power3.out' })
      }
      gsap.utils.toArray('[data-reveal]').forEach(el => gsap.from(el, { y: 24, opacity: 0, duration: 0.65, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } }))
      gsap.utils.toArray('.cinematic').forEach(el => gsap.to(el, { backgroundPosition: '50% 58%', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } }))
      if (home) {
        gsap.to('.hero-photo img', { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } })
        gsap.to('.sky-orb', { y: '48vh', x: '-10vw', scale: 0.7, backgroundColor: '#f0b24b', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '65% bottom', scrub: 1.2 } })
        gsap.to('.night-wash', { opacity: 0.22, ease: 'none', scrollTrigger: { trigger: root.current, start: '25% top', end: '70% bottom', scrub: 1.2 } })
      }
    }, root)
    return () => ctx.revert()
  }, [root, home, lenisRef])
}

export function useMaghrib() {
  const [s, setS] = useState(null)
  useEffect(() => {
    let alive = true, iv = null
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 8000)
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Kuala%20Lumpur&country=Malaysia&method=17', { signal: ctrl.signal })
      .then(r => r.json())
      .then(j => {
        if (!alive) return
        clearTimeout(to)
        const m = j && j.data && j.data.timings && j.data.timings.Maghrib
        if (!m || !/^\d{1,2}:\d{2}/.test(m)) return
        const parts = m.split(':')
        const target = new Date()
        target.setHours(+parts[0], +parts[1], 0, 0)
        const pad = n => String(n).padStart(2, '0')
        const tick = () => {
          const d = target - Date.now()
          if (d <= 0) { setS({ label: parts.join(':'), sub: 'Maghrib today · Kuala Lumpur' }); clearInterval(iv); return }
          setS({ label: `${pad(Math.floor(d / 36e5))}:${pad(Math.floor(d % 36e5 / 6e4))}:${pad(Math.floor(d % 6e4 / 1e3))}`, sub: 'until Maghrib · Kuala Lumpur' })
        }
        tick()
        iv = setInterval(tick, 1000)
      })
      .catch(() => {})
    return () => { alive = false; clearTimeout(to); if (iv) clearInterval(iv) }
  }, [])
  return s
}

export function useWorldAutoplay({ speed = 0.05, startOn = true } = {}) {
  const [progress, setProgress] = useState(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    if (reduced || !startOn) return
    let raf
    const loop = () => {
      setProgress(p => {
        const next = p + speed * 0.016
        if (next >= 1) { cancelAnimationFrame(raf); return 1 }
        return next
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced, startOn, speed])
  return progress
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => setProgress(self.progress),
    })
    return () => st.kill()
  }, [])
  return progress
}