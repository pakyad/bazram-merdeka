import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const LOGO = '/bazram-logo.webp'

const highlights = [
  { id: 'DVSdxs5ko46', kind: 'reel', label: 'Food run', title: 'Bazram food run' },
  { id: 'DVnAs5Hjqgr', kind: 'p', label: 'Iftar', title: 'Iftar on the field' },
]

const foodGroups = [
  {
    id: 'hot',
    label: 'Hot food',
    title: 'Hot food',
    copy: 'Grills, rice dishes, noodles, murtabak, roti and the Ramadan staples people come hungry for.',
    items: ['Satay', 'Ayam percik', 'Murtabak', 'Roti John'],
  },
  {
    id: 'sweet',
    label: 'Sweet',
    title: 'Sweet + cold',
    copy: 'Kuih, cold desserts and sweet bites for after iftar or a quick stop before heading home.',
    items: ['Kuih', 'ABC', 'Desserts', 'Bakes'],
  },
  {
    id: 'drinks',
    label: 'Drinks',
    title: 'Drinks',
    copy: 'Air balang, juices, tea and coffee — easy to spot when you just need something cold.',
    items: ['Air balang', 'Juice', 'Iced tea', 'Coffee'],
  },
  {
    id: 'trucks',
    label: 'Food trucks',
    title: 'Food trucks',
    copy: 'A dedicated lane for quick, modern street-food formats and easy group orders.',
    items: ['Burgers', 'Loaded fries', 'Wraps', 'Street food'],
  },
]

const zones = [
  { id: 'food', code: 'A', title: 'Hot food', note: 'Main cooked-food lane.' },
  { id: 'trucks', code: 'B', title: 'Food trucks', note: 'Quick pick-up and modern street food.' },
  { id: 'field', code: 'C', title: 'Picnic field', note: 'Sit, gather and break fast together.' },
  { id: 'prayer', code: 'D', title: 'Prayer area', note: 'A practical stop built into the visit flow.' },
]

const faqs = [
  {
    q: 'When was the 2026 edition?',
    a: '21 February — 18 March 2026, from 4 PM until 11 PM at Stadium Merdeka, Kuala Lumpur.',
  },
  {
    q: 'Is Bazram only about food?',
    a: 'Food is the main draw, but the experience also centres on communal iftar, gathering on the field, prayer facilities and Ramadan programming.',
  },
  {
    q: 'Can families come?',
    a: 'Yes. Families can arrive, browse food, settle on the field, break fast and continue exploring after Maghrib.',
  },
  {
    q: 'Where can I see the latest Bazram content?',
    a: 'The official Instagram feed is linked throughout this site and again in the footer.',
  },
]

function InstagramEmbed({ item }) {
  return (
    <article className="ig-card">
      <div className="ig-meta">
        <span>{item.label}</span>
        <span>@bazrammerdeka</span>
      </div>
      <iframe
        title={item.title}
        src={`https://www.instagram.com/${item.kind}/${item.id}/embed/`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        frameBorder="0"
      />
    </article>
  )
}

function App() {
  const root = useRef(null)
  const foodPanel = useRef(null)
  const zonePanel = useRef(null)
  const faqBodies = useRef([])
  const [activeFood, setActiveFood] = useState('hot')
  const [activeZone, setActiveZone] = useState('field')
  const [openFaq, setOpenFaq] = useState(0)

  const currentFood = useMemo(() => foodGroups.find((group) => group.id === activeFood), [activeFood])
  const currentZone = useMemo(() => zones.find((zone) => zone.id === activeZone), [activeZone])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reduced ? 0 : 1, smoothWheel: !reduced })
    lenis.on('scroll', ScrollTrigger.update)

    let frame = 0
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    const ctx = gsap.context(() => {
      if (reduced) return

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.topbar', { y: -28, opacity: 0, duration: 0.65 })
        .from('.hero-copy > *', { y: 24, opacity: 0, stagger: 0.07, duration: 0.62 }, '-=0.15')
        .from('.hero-poster', { x: 38, opacity: 0, rotate: 2.5, duration: 0.85 }, '-=0.55')
        .from('.fact', { y: 18, opacity: 0, stagger: 0.05, duration: 0.48 }, '-=0.35')

      gsap.to('.hero-poster', {
        yPercent: 7,
        rotate: -1.5,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })

      gsap.to('.sky-disc.one', {
        x: -34,
        y: 26,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
      })

      gsap.to('.sky-disc.two', {
        x: 28,
        y: -18,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.4 },
      })

      gsap.utils.toArray('[data-reveal]').forEach((section) => {
        gsap.from(section.querySelectorAll('[data-item]'), {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 78%' },
        })
      })
    }, root)

    return () => {
      cancelAnimationFrame(frame)
      ctx.revert()
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (!foodPanel.current) return
    gsap.fromTo(
      foodPanel.current.children,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.34, stagger: 0.04, ease: 'power2.out' },
    )
  }, [activeFood])

  useEffect(() => {
    if (!zonePanel.current) return
    gsap.fromTo(zonePanel.current, { y: 10, opacity: 0.55 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
  }, [activeZone])

  useEffect(() => {
    faqBodies.current.forEach((body, index) => {
      if (!body) return
      gsap.to(body, {
        height: index === openFaq ? 'auto' : 0,
        opacity: index === openFaq ? 1 : 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    })
  }, [openFaq])

  return (
    <main ref={root}>
      <header className="topbar">
        <a className="mini-brand" href="#top" aria-label="Bazram Merdeka home">
          <span>BAZRAM</span>
          <small>MERDEKA</small>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#explore">Explore</a>
          <a href="#makan">Makan</a>
          <a href="#highlights">Highlights</a>
          <a href="#visit">Visit</a>
        </nav>
        <a className="pill-button" href="#visit">Plan your visit</a>
      </header>

      <section className="hero" id="top">
        <div className="sky-disc one" aria-hidden="true" />
        <div className="sky-disc two" aria-hidden="true" />
        <div className="hero-grid wrap">
          <div className="hero-copy">
            <span className="edition-chip">2026 edition</span>
            <p className="eyebrow">Stadium Merdeka · Kuala Lumpur</p>
            <h1>Ramadan, made for gathering.</h1>
            <p className="hero-lede">
              Food, communal iftar and the energy of Stadium Merdeka — in one easy evening plan.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#makan">What to eat</a>
              <a className="text-button" href="#highlights">See the atmosphere ↗</a>
            </div>
          </div>

          <figure className="hero-poster">
            <img src={LOGO} alt="Bazram Merdeka logo against a blue sky" />
          </figure>
        </div>

        <div className="facts wrap" aria-label="Event facts">
          <div className="fact"><span>Date</span><strong>21 Feb — 18 Mar</strong></div>
          <div className="fact"><span>Time</span><strong>4 PM — 11 PM</strong></div>
          <div className="fact"><span>Place</span><strong>Stadium Merdeka</strong></div>
          <div className="fact"><span>Food</span><strong>118+ vendors</strong></div>
        </div>
      </section>

      <section className="section wrap" id="explore" data-reveal>
        <div className="section-heading" data-item>
          <span className="section-kicker">Explore Bazram</span>
          <h2>One night. Four things to know.</h2>
        </div>
        <div className="explore-grid">
          <a className="explore-card yellow" href="#makan" data-item>
            <span>01</span><h3>Makan</h3><p>Start with hot food, sweets, drinks or food trucks.</p><b>Explore food →</b>
          </a>
          <a className="explore-card blue" href="#layout" data-item>
            <span>02</span><h3>Gather</h3><p>The field is the centre of the night: sit down, buka together, stay awhile.</p><b>See the layout →</b>
          </a>
          <a className="explore-card cream" href="#highlights" data-item>
            <span>03</span><h3>Feel it</h3><p>See the food, the field and the crowd through Bazram's own feed.</p><b>Watch highlights →</b>
          </a>
          <a className="explore-card red" href="#visit" data-item>
            <span>04</span><h3>Visit</h3><p>Know the dates, time, place and essentials before you head out.</p><b>Plan your visit →</b>
          </a>
        </div>
      </section>

      <section className="section food-section" id="makan" data-reveal>
        <div className="wrap">
          <div className="section-heading" data-item>
            <span className="section-kicker">Makan</span>
            <h2>What are you craving?</h2>
          </div>

          <div className="food-shell" data-item>
            <div className="food-tabs" role="tablist" aria-label="Food categories">
              {foodGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={activeFood === group.id ? 'active' : ''}
                  onClick={() => setActiveFood(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>

            <div className="food-content" ref={foodPanel}>
              <div>
                <p className="eyebrow">Food guide</p>
                <h3>{currentFood.title}</h3>
                <p>{currentFood.copy}</p>
              </div>
              <div className="food-tags">
                {currentFood.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" id="layout" data-reveal>
        <div className="section-heading" data-item>
          <span className="section-kicker">Stadium guide</span>
          <h2>Know where you are going.</h2>
        </div>

        <div className="layout-grid">
          <div className="stadium-map" data-item>
            <div className="track-ring">
              <span className="field-title">PICNIC FIELD</span>
              {zones.map((zone, index) => (
                <button
                  type="button"
                  key={zone.id}
                  className={`zone-pin pin-${index + 1} ${activeZone === zone.id ? 'active' : ''}`}
                  onClick={() => setActiveZone(zone.id)}
                  aria-label={zone.title}
                >
                  {zone.code}
                </button>
              ))}
            </div>
          </div>

          <aside className="zone-detail" data-item ref={zonePanel}>
            <span className="zone-code">{currentZone.code}</span>
            <p className="eyebrow">Stadium zone</p>
            <h3>{currentZone.title}</h3>
            <p>{currentZone.note}</p>
            <div className="zone-legend">
              {zones.map((zone) => <button key={zone.id} onClick={() => setActiveZone(zone.id)}>{zone.code} · {zone.title}</button>)}
            </div>
          </aside>
        </div>
      </section>

      <section className="section highlight-section" id="highlights" data-reveal>
        <div className="wrap">
          <div className="section-heading inverse" data-item>
            <span className="section-kicker">From the feed</span>
            <h2>See Bazram as it happened.</h2>
          </div>
          <div className="ig-grid">
            {highlights.map((item) => <InstagramEmbed key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      <section className="section wrap" id="visit" data-reveal>
        <div className="visit-grid">
          <div className="visit-copy" data-item>
            <span className="section-kicker">Visit</span>
            <h2>Before you come.</h2>
            <p>Stadium Merdeka, Kuala Lumpur. The 2026 edition ran from 21 February to 18 March, 4 PM to 11 PM.</p>
            <div className="visit-actions">
              <a className="primary-button" href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a>
              <a className="text-button" href="#faq">Quick answers ↓</a>
            </div>
          </div>
          <div className="visit-card yellow-card" data-item><span>Come early</span><strong>For easier browsing</strong><p>Arrive before the main iftar rush if you want time to walk the food lanes comfortably.</p></div>
          <div className="visit-card blue-card" data-item><span>Stay for buka</span><strong>For the full atmosphere</strong><p>The field, the crowd and the stadium setting are what make Bazram feel different from a normal bazaar.</p></div>
        </div>
      </section>

      <section className="section faq-section wrap" id="faq" data-reveal>
        <div className="section-heading" data-item>
          <span className="section-kicker">FAQ</span>
          <h2>Quick answers.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item, index) => (
            <article className="faq-item" key={item.q} data-item>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                <span>{item.q}</span>
                <span>{openFaq === index ? '−' : '+'}</span>
              </button>
              <div className="faq-answer" ref={(el) => { faqBodies.current[index] = el }}>
                <p>{item.a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <div className="footer-brand"><span>BAZRAM</span><small>MERDEKA</small></div>
            <p>Ramadan at Stadium Merdeka.</p>
          </div>
          <div className="footer-meta">
            <a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <span>Stadium Merdeka · Kuala Lumpur</span>
            <span>An event by 2Cool Productions.</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
