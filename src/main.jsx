import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const HERO_IMAGE = 'https://www.pnb.com.my/sites/default/files/2024-09/merdeka-118-img.png'

const highlights = [
  { id: 'DVSdxs5ko46', kind: 'reel', label: 'MAKAN', title: 'THE FOOD RUN' },
  { id: 'DVm_IH5CSr_', kind: 'p', label: 'AFTER DARK', title: 'SATU MALAM DI BAZRAM' },
  { id: 'DVnAs5Hjqgr', kind: 'p', label: 'BERBUKA', title: 'THE FIELD FILLS UP' },
  { id: 'DVkr2vMiQ_O', kind: 'p', label: 'VISIT', title: 'PLAN YOUR NIGHT' },
]

const experience = [
  { index: '01', title: 'EAT', note: 'Find your lane: hot food, sweets, drinks and food trucks.', target: '#vendors', crop: '52% 66%' },
  { index: '02', title: 'GATHER', note: 'The field is the centre of the night — picnic, iftar, people.', target: '#moment', crop: '45% 82%' },
  { index: '03', title: 'PROGRAMME', note: 'A clean event timeline instead of poster overload.', target: '#programme', crop: '69% 63%' },
  { index: '04', title: 'VISIT', note: 'Getting here, event rules, practical answers.', target: '#visit', crop: '58% 52%' },
]

const zones = [
  { id: 'hot', code: 'A', title: 'Hot Food', note: 'Cooked-to-order favourites and Ramadan staples.', meta: 'MAIN FOOD ZONE' },
  { id: 'truck', code: 'B', title: 'Food Trucks', note: 'A quicker lane for modern street-food formats.', meta: 'OUTER RING' },
  { id: 'field', code: 'C', title: 'Picnic Field', note: 'The open heart of Bazram: sit, gather and break fast together.', meta: 'STADIUM FIELD' },
  { id: 'prayer', code: 'D', title: 'Prayer Area', note: 'A quieter practical stop built into the visit flow.', meta: 'FACILITIES' },
]

const foodGroups = [
  { id: 'all', label: 'All', eyebrow: 'START HERE', title: 'Browse the bazaar', copy: 'Four simple lanes. No fake vendor names, no endless catalogue.', tags: ['Hot food', 'Dessert', 'Drinks', 'Food trucks'] },
  { id: 'hot', label: 'Hot food', eyebrow: 'SMOKE + FIRE', title: 'Made for buka', copy: 'Grills, rice, noodles, murtabak, roti and the things people queue for.', tags: ['Satay', 'Ayam percik', 'Murtabak', 'Roti John'] },
  { id: 'sweet', label: 'Sweet', eyebrow: 'AFTER IFTAR', title: 'Something cold, something manis', copy: 'Desserts and kuih get their own lane instead of disappearing inside a giant vendor grid.', tags: ['Kuih', 'ABC', 'Dessert cups', 'Bakes'] },
  { id: 'drinks', label: 'Drinks', eyebrow: 'COOL DOWN', title: 'Air dulu', copy: 'A fast visual category for cold drinks, coffee and Ramadan favourites.', tags: ['Air balang', 'Coffee', 'Tea', 'Cold drinks'] },
  { id: 'trucks', label: 'Food trucks', eyebrow: 'OUTER RING', title: 'Fast-moving favourites', copy: 'A distinct zone for truck-based vendors and grab-and-go food.', tags: ['Burgers', 'Loaded fries', 'Grill', 'Snacks'] },
]

const programme = [
  { time: '4:00 PM', title: 'Bazaar opens', note: 'Arrive early, walk the food zones and settle in.' },
  { time: 'SUNSET', title: 'Break fast together', note: 'The field shifts from movement to a shared iftar moment.' },
  { time: 'AFTER MAGHRIB', title: 'Evening programme', note: 'Community, family and Ramadan activities continue into the night.' },
  { time: '11:00 PM', title: 'Close', note: 'Last call, lights down, back tomorrow.' },
]

const faqs = [
  ['When was the 2026 edition?', '21 February — 18 March 2026, from 4 PM to 11 PM at Stadium Merdeka. This site treats that edition as an archive while keeping Bazram ready for future editions.'],
  ['Can I bring a picnic mat?', 'The 2026 experience centred on communal iftar and picnic-style gathering on the stadium field. Keep the setup compact and follow current event guidance for future editions.'],
  ['Is there a prayer area?', 'Yes — prayer facilities were part of the 2026 visitor experience. For a future edition, confirm the latest location through official Bazram updates before travelling.'],
  ['Is it family friendly?', 'The event format includes family and community programming. Children should remain supervised in the stadium and high-traffic food areas.'],
  ['Where should I check current updates?', 'Use the official @bazrammerdeka Instagram account for live announcements, vendor posts and future-edition information.'],
]

function InstagramEmbed({ item }) {
  return (
    <div className="ig-frame">
      <div className="ig-topline"><span>{item.label}</span><span>@bazrammerdeka</span></div>
      <iframe
        title={item.title}
        src={`https://www.instagram.com/${item.kind}/${item.id}/embed/`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        frameBorder="0"
      />
    </div>
  )
}

function App() {
  const root = useRef(null)
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeZone, setActiveZone] = useState(zones[2])
  const [activeFood, setActiveFood] = useState(foodGroups[0])
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const lenis = new Lenis({ duration: 0.95, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    let raf = 0
    const tick = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.site-nav', { y: -24, opacity: 0, duration: 0.55 })
        .from('.hero-kicker', { y: 18, opacity: 0, duration: 0.5 }, '-=.2')
        .from('.hero-title span', { yPercent: 110, duration: 0.9, stagger: 0.08 }, '-=.2')
        .from('.hero-summary > *', { y: 18, opacity: 0, duration: 0.5, stagger: 0.07 }, '-=.45')
        .from('.hero-actions > *', { y: 12, opacity: 0, duration: 0.4, stagger: 0.06 }, '-=.3')

      gsap.to('.hero-image', {
        scale: 1.08,
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })

      gsap.to('.hero-dim', {
        opacity: 0.72,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })

      gsap.utils.toArray('.reveal-block').forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%', once: true },
        })
      })

      gsap.utils.toArray('.experience-card').forEach((el, i) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.65,
          delay: i * 0.04,
          scrollTrigger: { trigger: '.experience-grid', start: 'top 82%', once: true },
        })
      })

      const momentTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.moment-stage',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
      momentTl
        .to('.moment-warm', { opacity: 0.05 }, 0)
        .to('.moment-night', { opacity: 0.72 }, 0)
        .to('.moment-time--one', { opacity: 0, y: -18 }, 0.1)
        .to('.moment-time--two', { opacity: 1, y: 0 }, 0.35)
        .to('.moment-time--two', { opacity: 0, y: -18 }, 0.66)
        .to('.moment-time--three', { opacity: 1, y: 0 }, 0.72)
        .to('.moment-lights i', { opacity: 1, scale: 1, stagger: 0.012 }, 0.5)

      gsap.from('.programme-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.programme-list', start: 'top 76%', once: true },
      })

      gsap.utils.toArray('.gallery-card').forEach((el, i) => {
        gsap.from(el, {
          y: 36 + i * 4,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      ScrollTrigger.create({
        trigger: '.hero',
        start: 'bottom 70',
        onEnter: () => document.body.classList.add('nav-solid'),
        onLeaveBack: () => document.body.classList.remove('nav-solid'),
      })
    }, root)

    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
      lenis.destroy()
      document.body.classList.remove('nav-solid')
    }
  }, [])

  useEffect(() => {
    if (!menuRef.current) return
    const panel = menuRef.current
    gsap.killTweensOf(panel)
    if (menuOpen) {
      gsap.set(panel, { visibility: 'visible', pointerEvents: 'auto' })
      gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' })
      gsap.fromTo('.mobile-menu-link', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.42, ease: 'power3.out' })
    } else {
      gsap.to(panel, { autoAlpha: 0, duration: 0.2, onComplete: () => gsap.set(panel, { visibility: 'hidden', pointerEvents: 'none' }) })
    }
  }, [menuOpen])

  const changeZone = (zone) => {
    const box = document.querySelector('.zone-copy')
    if (!box) return setActiveZone(zone)
    gsap.to(box, {
      opacity: 0,
      y: 10,
      duration: 0.16,
      onComplete: () => {
        setActiveZone(zone)
        requestAnimationFrame(() => gsap.fromTo(box, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }))
      },
    })
  }

  const changeFood = (item) => {
    const content = document.querySelector('.food-content')
    if (!content) return setActiveFood(item)
    gsap.to(content, {
      opacity: 0,
      y: 12,
      duration: 0.16,
      onComplete: () => {
        setActiveFood(item)
        requestAnimationFrame(() => gsap.fromTo(content, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }))
      },
    })
  }

  const toggleFaq = (index) => {
    const next = openFaq === index ? -1 : index
    setOpenFaq(next)
    requestAnimationFrame(() => {
      document.querySelectorAll('.faq-answer').forEach((el, i) => {
        gsap.to(el, { height: i === next ? 'auto' : 0, opacity: i === next ? 1 : 0, duration: 0.32, ease: 'power2.inOut' })
      })
    })
  }

  return (
    <main ref={root}>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#top" className="brand" aria-label="Bazram Merdeka home">
          <strong>BAZRAM</strong><span>MERDEKA</span>
        </a>
        <div className="nav-links">
          <a href="#experience">Explore</a>
          <a href="#vendors">Eat</a>
          <a href="#programme">Programme</a>
          <a href="#visit">Visit</a>
        </div>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">Menu</button>
      </nav>

      <div className="mobile-menu" ref={menuRef} aria-hidden={!menuOpen}>
        <div className="mobile-menu-top"><span>BAZRAM MERDEKA</span><button onClick={() => setMenuOpen(false)}>Close</button></div>
        <div className="mobile-menu-links">
          {['Experience', 'Vendors', 'Programme', 'Gallery', 'Visit'].map((label) => (
            <a className="mobile-menu-link" href={`#${label.toLowerCase()}`} key={label} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </div>
      </div>

      <section className="hero" id="top">
        <img className="hero-image" src={HERO_IMAGE} alt="Merdeka 118 precinct and Stadium Merdeka at dusk" />
        <div className="hero-dim" />
        <div className="hero-grain" />
        <div className="hero-content">
          <div className="hero-kicker">STADIUM MERDEKA · KUALA LUMPUR</div>
          <h1 className="hero-title" aria-label="Bazram Merdeka">
            <span><i>BAZRAM</i></span>
            <span><i>MERDEKA</i></span>
          </h1>
          <div className="hero-bottom">
            <div className="hero-summary">
              <p>Ramadan at the heart of Merdeka.</p>
              <p className="muted">2026 edition archive · 21 Feb — 18 Mar · 4 PM — 11 PM</p>
            </div>
            <div className="hero-actions">
              <a className="button button-light" href="#experience">Explore the event <span>↘</span></a>
              <a className="text-link" href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a>
            </div>
          </div>
        </div>
        <div className="hero-source">MERDEKA 118 PRECINCT · IMAGE / PNB</div>
      </section>

      <section className="section experience" id="experience">
        <header className="section-head reveal-block">
          <div><span className="section-index">01</span><span className="section-label">EXPERIENCE BAZRAM</span></div>
          <h2>Choose what you came for.</h2>
          <p>Less campaign copy. More direction. The homepage works like an event guide from the first scroll.</p>
        </header>
        <div className="experience-grid">
          {experience.map((item) => (
            <a className="experience-card" href={item.target} key={item.title}>
              <img src={HERO_IMAGE} alt="" style={{ objectPosition: item.crop }} />
              <div className="experience-shade" />
              <span className="card-index">{item.index}</span>
              <div className="experience-copy"><h3>{item.title}</h3><p>{item.note}</p></div>
              <span className="card-arrow">↘</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section stadium" id="stadium">
        <header className="section-head compact reveal-block">
          <div><span className="section-index">02</span><span className="section-label">STADIUM EXPLORER</span></div>
          <h2>One place. Four useful zones.</h2>
          <p>A compact interactive plan instead of forcing another horizontal-scroll chapter.</p>
        </header>
        <div className="stadium-shell reveal-block">
          <div className="stadium-plan" aria-label="Simplified Stadium Merdeka event plan">
            <div className="stadium-oval stadium-oval--outer" />
            <div className="stadium-oval stadium-oval--inner" />
            <div className="stadium-field"><span>STADIUM</span><strong>MERDEKA</strong></div>
            {zones.map((zone, i) => (
              <button
                type="button"
                className={`zone-pin zone-pin--${i + 1} ${activeZone.id === zone.id ? 'is-active' : ''}`}
                key={zone.id}
                onClick={() => changeZone(zone)}
                aria-pressed={activeZone.id === zone.id}
              >
                <span>{zone.code}</span><small>{zone.title}</small>
              </button>
            ))}
            <div className="stadium-north">N ↑</div>
          </div>
          <aside className="zone-copy">
            <span className="eyebrow">{activeZone.meta}</span>
            <div className="zone-code">{activeZone.code}</div>
            <h3>{activeZone.title}</h3>
            <p>{activeZone.note}</p>
            <div className="zone-hint">Tap another marker to explore</div>
          </aside>
        </div>
      </section>

      <section className="section food" id="vendors">
        <header className="section-head reveal-block">
          <div><span className="section-index">03</span><span className="section-label">EAT</span></div>
          <h2>What are you craving?</h2>
          <p>A food directory should help people decide. This version groups the night by appetite instead of inventing a wall of vendor cards.</p>
        </header>
        <div className="food-browser reveal-block">
          <div className="food-tabs" role="tablist" aria-label="Food categories">
            {foodGroups.map((item) => (
              <button role="tab" aria-selected={activeFood.id === item.id} className={activeFood.id === item.id ? 'is-active' : ''} key={item.id} onClick={() => changeFood(item)}>{item.label}</button>
            ))}
          </div>
          <div className="food-content">
            <span className="eyebrow">{activeFood.eyebrow}</span>
            <h3>{activeFood.title}</h3>
            <p>{activeFood.copy}</p>
            <div className="food-tags">{activeFood.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <div className="food-media"><InstagramEmbed item={highlights[0]} /></div>
        </div>
      </section>

      <section className="moment-stage" id="moment">
        <div className="moment-sticky">
          <img src={HERO_IMAGE} alt="Merdeka 118 and Stadium Merdeka at dusk" />
          <div className="moment-warm" />
          <div className="moment-night" />
          <div className="moment-lights">{Array.from({ length: 18 }).map((_, i) => <i key={i} />)}</div>
          <div className="moment-caption"><span>04 · THE BAZRAM MOMENT</span><span>STADIUM MERDEKA</span></div>
          <div className="moment-times">
            <div className="moment-time moment-time--one"><span>6:47 PM</span><strong>The field fills up.</strong></div>
            <div className="moment-time moment-time--two"><span>SUNSET</span><strong>Everything slows down.</strong></div>
            <div className="moment-time moment-time--three"><span>MAGHRIB</span><strong>Break fast together.</strong></div>
          </div>
        </div>
      </section>

      <section className="section programme" id="programme">
        <header className="section-head compact reveal-block">
          <div><span className="section-index">05</span><span className="section-label">2026 PROGRAMME</span></div>
          <h2>A day at Bazram.</h2>
          <p>Archive the rhythm of the event cleanly. Future editions can replace this with live dates without redesigning the page.</p>
        </header>
        <div className="programme-list reveal-block">
          <div className="programme-line" />
          {programme.map((item, i) => (
            <article key={item.time}>
              <span className="programme-number">0{i + 1}</span>
              <time>{item.time}</time>
              <h3>{item.title}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section gallery" id="gallery">
        <header className="section-head reveal-block">
          <div><span className="section-index">06</span><span className="section-label">FROM BAZRAM</span></div>
          <h2>Real moments, not stock festival imagery.</h2>
          <p>The feed becomes an editorial contact sheet. Actual Bazram content carries the visual identity.</p>
        </header>
        <div className="gallery-grid">
          {highlights.slice(1).map((item, i) => (
            <article className={`gallery-card gallery-card--${i + 1}`} key={item.id}>
              <InstagramEmbed item={item} />
              <div className="gallery-meta"><span>0{i + 1}</span><h3>{item.title}</h3><a href={`https://www.instagram.com/${item.kind}/${item.id}/`} target="_blank" rel="noreferrer">Original ↗</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section visit" id="visit">
        <header className="section-head compact reveal-block">
          <div><span className="section-index">07</span><span className="section-label">VISIT</span></div>
          <h2>Stadium Merdeka, Kuala Lumpur.</h2>
          <p>Practical information stays compact and readable. No dramatic scroll effect needed here.</p>
        </header>
        <div className="visit-grid">
          <div className="visit-card reveal-block">
            <span className="eyebrow">2026 EDITION</span>
            <div className="visit-big">21 FEB — 18 MAR</div>
            <div className="visit-row"><span>Hours</span><strong>4 PM — 11 PM</strong></div>
            <div className="visit-row"><span>Venue</span><strong>Stadium Merdeka</strong></div>
            <div className="visit-row"><span>City</span><strong>Kuala Lumpur</strong></div>
            <a className="button button-dark" href="https://www.google.com/maps/search/?api=1&query=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Open map ↗</a>
          </div>
          <div className="faq reveal-block">
            <div className="faq-head"><span className="eyebrow">GOOD TO KNOW</span><span>{faqs.length} QUESTIONS</span></div>
            {faqs.map(([question, answer], i) => (
              <div className={`faq-item ${openFaq === i ? 'is-open' : ''}`} key={question}>
                <button type="button" onClick={() => toggleFaq(i)} aria-expanded={openFaq === i}><span>{question}</span><i>{openFaq === i ? '−' : '+'}</i></button>
                <div className="faq-answer" style={{ height: i === 0 ? 'auto' : 0, opacity: i === 0 ? 1 : 0 }}><p>{answer}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top"><a className="brand brand--footer" href="#top"><strong>BAZRAM</strong><span>MERDEKA</span></a><p>Ramadan at the heart of Merdeka.</p></div>
        <div className="footer-bottom">
          <div><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="#visit">Visit</a><a href="#programme">2026 archive</a></div>
          <p>Event by <strong>2Cool Productions</strong>.</p>
          <span>© 2026 BAZRAM MERDEKA</span>
        </div>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
