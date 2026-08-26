import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export let lenisInstance = null

export function useMotion(root, home = false) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reduced ? 0 : 1.0, smoothWheel: !reduced })
    lenisInstance = lenis
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
    const ctx = gsap.context(() => {
      gsap.set('.progress', { scaleX: 0, transformOrigin: 'left center' })
      gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } })
      if (home) {
        ScrollTrigger.create({ trigger: '.scene-arrive', start: 'top 88px', onEnter: () => document.body.classList.add('nav-light'), onLeaveBack: () => document.body.classList.remove('nav-light') })
      }
      if (reduced) return
      if (home) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.nav-inner>*', { y: -12, opacity: 0, stagger: .04, duration: .4 })
          .from('.opening h1 span', { yPercent: 110, stagger: .09, duration: .8 }, '-=.08')
          .from('.opening .kicker, .opening .lead, .opening .banner-strip, .opening .scroll-cue', { y: 16, opacity: 0, stagger: .07, duration: .45 }, '-=.3')
      } else if (document.querySelector('.subhero')) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.nav-inner>*', { y: -12, opacity: 0, stagger: .04, duration: .4 })
          .from('.subhero h1, .subhero p, .subhero-photo', { y: 18, opacity: 0, stagger: .07, duration: .55 }, '-=.1')
      } else {
        gsap.from('.nav-inner>*', { y: -12, opacity: 0, stagger: .04, duration: .4, ease: 'power3.out' })
      }
      gsap.utils.toArray('[data-reveal]').forEach(el => gsap.from(el, { y: 24, opacity: 0, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } }))
      gsap.utils.toArray('.cinematic img').forEach(el => gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.closest('.cinematic'), start: 'top bottom', end: 'bottom top', scrub: .8 } }))
    }, root)
    return () => { cancelAnimationFrame(raf); ctx.revert(); lenis.destroy(); document.removeEventListener('click', onAnchorClick); lenisInstance = null; document.body.classList.remove('nav-light') }
  }, [root, home])
}

export const STARS = Array.from({ length: 56 }, (_, i) => ({ left: (i * 61.8) % 100, top: (i * 37.3) % 62, s: i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5, o: .35 + ((i * 29) % 50) / 100 }))

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

export function useIftarMotion(root) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stage = root.current.querySelector('.sky-stage')
    const orb = root.current.querySelector('.sky-body')
    const setX = gsap.quickSetter(orb, 'x', 'px')
    const setY = gsap.quickSetter(orb, 'y', 'px')
    const bez = (a, c1, c2, b, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * c1 + 3 * u * t * t * c2 + t * t * t * b }
    const orbPos = p => {
      if (p < .38) { const t = p / .38; return [bez(5, 18, 52, 72, t), bez(90, 10, -6, 80, t)] }
      if (p < .52) { const t = (p - .38) / .14; return [bez(72, 74, 82, 78, t), bez(80, 92, 102, 104, t)] }
      const t = (p - .52) / .48; return [bez(78, 62, 30, 46, t), bez(104, 64, 32, 10, t)]
    }
    let st = null, ctx = null
    const apply = p => { const [x, y] = orbPos(p); setX(x / 100 * stage.clientWidth); setY(y / 100 * stage.clientHeight) }
    apply(0)
    const onResize = () => apply(st ? st.progress : 0)
    window.addEventListener('resize', onResize)
    if (!reduced) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1, onUpdate: self => apply(self.progress) } })
        st = tl.scrollTrigger
        tl.to('.s-sunset', { opacity: 1, duration: .9 }, 0)
          .to('.s-maghrib', { opacity: 1, duration: .9 }, .9)
          .to('.s-dusk', { opacity: 1, duration: 1 }, 1.8)
          .to('.s-night', { opacity: 1, duration: 1 }, 2.8)
          .to('.sky-line', { opacity: 1, duration: 2.2 }, .6)
          .to('.sky-stars', { opacity: 1, duration: 1.4 }, 2.8)
          .to('.sun-glow', { opacity: 0, duration: .3 }, 2.2)
          .to('.orb-sun', { opacity: 0, duration: .3 }, 2.2)
          .to('.moon-glow', { opacity: 1, duration: .4 }, 2.7)
          .to('.orb-moon', { opacity: 1, duration: .4 }, 2.7)
        ScrollTrigger.create({
          trigger: '.st-maghrib', start: 'top top', end: '+=140%', pin: true, anticipatePin: 1,
          onToggle: self => document.body.classList.toggle('story-quiet', self.isActive),
        })
      }, root)
    }
    return () => { window.removeEventListener('resize', onResize); document.body.classList.remove('story-quiet'); if (ctx) ctx.revert() }
  }, [root])
}
