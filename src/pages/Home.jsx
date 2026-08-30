import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useMotion, useLenis, useWorldAutoplay } from '../motion.js'
import { Nav, Footer, Img, SkipLink, Button, TextLink } from '../ui.jsx'
import { IMAGES, JOURNEY, PROGRAMME } from '../data.js'
import { World } from '../world/World.tsx'

function useWorldCapable() {
  const [ok, setOk] = useState(true)
  useEffect(() => {
    let supported = true
    try {
      const c = document.createElement('canvas')
      supported = !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
    } catch {
      supported = false
    }
    setOk(supported)
  }, [])
  return ok
}

export default function Home() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const lenisRef = useLenis()
  useMotion(root, true)
  const worldCapable = useWorldCapable()
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const progress = useWorldAutoplay({ speed: 0.028 })
  const heroTime = useRef(0)
  useEffect(() => {
    if (!worldCapable || reducedMotion) return
    let raf
    let last = performance.now()
    const tick = now => {
      heroTime.current += Math.min((now - last) / 1000, 0.05)
      last = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [worldCapable, reducedMotion])

  const select = i => {
    if (i === active) return
    setActive(i)
    gsap.fromTo('.experience-image img', { opacity: 0.25, scale: 1.025 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' })
    gsap.fromTo('.experience-copy>*', { y: 8, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.3, ease: 'power2.out' })
  }

  return (
    <main ref={root} className="home world-hero" id="main">
      <SkipLink />
      {worldCapable
        ? <World progress={progress} time={heroTime.current} reducedMotion={reducedMotion} />
        : <div className="world-hero-fallback" style={{ backgroundImage: `linear-gradient(180deg, rgba(20,26,31,.35), rgba(20,26,31,.55)), url(${IMAGES.stands})` }} />}

      <div className="hero-wrap">
        <Nav home />
        <header className="hero">
          <div className="shell world-hero-copy">
            <span className="hero-eyebrow">Live from Stadium Merdeka</span>
            <h1><span>Where food, faith &</span><span>heritage come together.</span></h1>
            <p className="hero-lead">Come hungry, bring your people, and break fast together inside Stadium Merdeka.</p>
            <div className="hero-meta">
              <span>Stadium Merdeka</span>
              <span>21 Feb–18 Mar</span>
              <span>4 PM–11 PM</span>
              <span>Free entry</span>
            </div>
            <div className="hero-actions">
              <Button href="/visit" primary>Plan your evening ↗</Button>
              <Button href="/world" secondary>Fly through the stadium ↓</Button>
            </div>
            <span className="world-scroll-cue">Scroll to explore</span>
          </div>
        </header>
      </div>

      <div className="home-body">
        <section className="welcome cinematic" style={{ backgroundImage: `linear-gradient(90deg,rgba(14,18,21,.88),rgba(14,18,21,.45)),url(${IMAGES.stands})` }}>
          <div className="shell welcome-inner" data-reveal>
            <div>
              <h2>This is your Ramadan evening.</h2>
              <p>Arrive before Maghrib. Find your food. Claim your place. Break fast together. Stay a little longer.</p>
            </div>
            <div className="welcome-links">
              <TextLink href="/food">Find something to eat ↗</TextLink>
              <TextLink href="#experience">See how the evening unfolds ↓</TextLink>
            </div>
          </div>
        </section>

        <section id="experience" className="experience">
          <div className="shell" data-reveal>
            <header className="section-title">
              <h2>Before Maghrib, take your time.</h2>
              <p>Choose a moment below to see what the evening feels like.</p>
            </header>
            <div className="experience-tabs" role="tablist">
              {JOURNEY.map((item, i) => (
                <button role="tab" aria-selected={i === active} className={i === active ? 'active' : ''} onClick={() => select(i)} key={item.title}>
                  {item.title}
                </button>
              ))}
            </div>
            <div className="experience-feature">
              <div className="experience-image"><Img src={JOURNEY[active].image} alt={JOURNEY[active].title} /></div>
              <div className="experience-copy">
                <span>{JOURNEY[active].time}</span>
                <h3>{JOURNEY[active].headline}</h3>
                <p>{JOURNEY[active].copy}</p>
                {active === 1 && <TextLink href="/food">Explore food ↗</TextLink>}
                {active === 3 && <TextLink href="/programme">See what's on ↗</TextLink>}
              </div>
            </div>
          </div>
        </section>

        <section id="iftar" className="iftar cinematic" style={{ backgroundImage: `url(${IMAGES.gather})` }}>
          <div className="iftar-overlay" />
          <div className="shell iftar-text" data-reveal>
            <span>At Maghrib</span>
            <h2>The whole stadium pauses together.</h2>
            <p>Visitors gather on the field, settle in with their food and wait for the same moment.</p>
            <TextLink className="light" href="/iftar">Experience the iftar hour ↓</TextLink>
          </div>
        </section>

        <section className="after">
          <div className="shell after-layout" data-reveal>
            <div className="after-photo"><Img src={IMAGES.stands} alt="Bazram Merdeka after dark" /></div>
            <div className="after-copy">
              <h2>Stay after iftar.</h2>
              <p>The evening carries on naturally. Pray, grab dessert, walk the bazaar again or see what is happening around the stadium.</p>
              <div className="after-links">
                <TextLink href="/visit#prayer">Prayer information ↗</TextLink>
                <TextLink href="/food">Dessert & drinks ↗</TextLink>
                <TextLink href="/programme">Evening programme ↗</TextLink>
              </div>
            </div>
          </div>
        </section>

        <section className="programme-home">
          <div className="shell programme-layout">
            <div className="programme-heading" data-reveal>
              <h2>What's happening?</h2>
              <p>The main rhythm of the evening, without turning the homepage into a timetable.</p>
              <TextLink href="/programme">View full programme ↗</TextLink>
            </div>
            <div className="schedule" data-reveal>
              {PROGRAMME.map(([time, title, copy]) => (
                <div className="schedule-row" key={time}>
                  <time>{time}</time>
                  <div><b>{title}</b><p>{copy}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="visit-home">
          <div className="shell visit-layout" data-reveal>
            <div>
              <h2>Plan your visit.</h2>
              <p>Stadium Merdeka is easy to reach by rail. Come before the busiest hour if you want more time to browse and settle in.</p>
              <div className="visit-actions">
                <Button href="/visit" primary>Full visitor guide ↗</Button>
                <TextLink href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Get directions ↗</TextLink>
              </div>
            </div>
            <dl className="visit-list">
              <div><dt>Where</dt><dd>Stadium Merdeka, Kuala Lumpur</dd></div>
              <div><dt>When</dt><dd>21 Feb–18 Mar 2026</dd></div>
              <div><dt>Hours</dt><dd>4 PM–11 PM</dd></div>
              <div><dt>Entry</dt><dd>Free</dd></div>
              <div><dt>Rail</dt><dd>Merdeka MRT · Maharajalela Monorail</dd></div>
              <div><dt>Good to know</dt><dd>Prayer facilities · families welcome</dd></div>
            </dl>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
