import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const LOGO = '/bazram-logo.webp'

const photos = {
  iftar: {
    src: 'https://www.instagram.com/p/DVnAs5Hjqgr/media/?size=l',
    href: 'https://www.instagram.com/p/DVnAs5Hjqgr/',
    alt: 'Bazram Merdeka communal iftar at Stadium Merdeka',
  },
  night: {
    src: 'https://www.instagram.com/p/DVm_IH5CSr_/media/?size=l',
    href: 'https://www.instagram.com/p/DVm_IH5CSr_/',
    alt: 'Bazram Merdeka after dark at Stadium Merdeka',
  },
  visit: {
    src: 'https://www.instagram.com/p/DVkr2vMiQ_O/media/?size=l',
    href: 'https://www.instagram.com/p/DVkr2vMiQ_O/',
    alt: 'Bazram Merdeka visitor information post',
  },
}

const foodTabs = [
  {
    id: 'hot',
    label: 'Hot food',
    title: 'Fresh off the grill',
    text: 'Satay, ayam percik, murtabak, roti, rice dishes, noodles and the familiar Ramadan favourites people queue for.',
    chips: ['Satay', 'Ayam percik', 'Murtabak', 'Roti John'],
  },
  {
    id: 'sweet',
    label: 'Sweet',
    title: 'Something manis',
    text: 'Kuih, cold desserts and easy sweet bites for after iftar or the walk back out of the stadium.',
    chips: ['Kuih', 'ABC', 'Desserts', 'Bakes'],
  },
  {
    id: 'drinks',
    label: 'Drinks',
    title: 'Keep it cold',
    text: 'Air balang, juices, iced tea and coffee are grouped as their own easy-to-find stop.',
    chips: ['Air balang', 'Juice', 'Iced tea', 'Coffee'],
  },
  {
    id: 'trucks',
    label: 'Food trucks',
    title: 'The truck lane',
    text: 'A separate lane for modern street-food formats, quick group orders and late-night second rounds.',
    chips: ['Burgers', 'Loaded fries', 'Wraps', 'Street food'],
  },
]

const zones = [
  { id: 'food', code: 'A', title: 'Food stalls', detail: 'Main cooked-food lane around the stadium perimeter.' },
  { id: 'trucks', code: 'B', title: 'Food trucks', detail: 'Quick pick-up and modern street food.' },
  { id: 'field', code: 'C', title: 'Iftar field', detail: 'Open picnic-style space for communal buka puasa.' },
  { id: 'prayer', code: 'D', title: 'Prayer', detail: 'Solat facilities and nearby prayer access for the evening flow.' },
]

const flow = [
  { time: '4:00 PM', title: 'Arrive early', copy: 'Walk the stalls while queues are lighter and decide what you want for iftar.' },
  { time: 'Before Maghrib', title: 'Find your spot', copy: 'Move onto the field or into the stands and settle in with family or friends.' },
  { time: 'Maghrib', title: 'Break fast together', copy: 'The field becomes the heart of Bazram as the crowd pauses for communal iftar.' },
  { time: 'After iftar', title: 'Pray + continue', copy: 'Use the prayer facilities, then return for a second food round or the evening programme.' },
  { time: 'Until 11 PM', title: 'Stay for the night', copy: 'Food, family activities and the city-night atmosphere continue around the stadium.' },
]

const programme = [
  {
    kicker: 'Ramadan programme',
    title: 'Khatam Al-Quran',
    copy: 'The Majlis Khatam Al-Quran on 12 March became one of the 2026 edition’s key community moments.',
  },
  {
    kicker: 'Everyday experience',
    title: 'Communal iftar',
    copy: 'Visitors could buy food around the perimeter and break fast picnic-style on the historic stadium field.',
  },
  {
    kicker: 'For families',
    title: 'Activities + nightly programming',
    copy: 'Bazram combined food with family-friendly activities and evening programmes throughout the Ramadan run.',
  },
]

const faqs = [
  {
    q: 'What exactly was Bazram Merdeka 2026?',
    a: 'A free-entry Ramadan bazaar and communal iftar experience at Stadium Merdeka, with more than 100 stalls, food trucks, picnic-style buka puasa areas, prayer access and Ramadan programming.',
  },
  {
    q: 'When and where did it run?',
    a: '21 February to 18 March 2026, daily from 4 PM to 11 PM at Stadium Merdeka, Kuala Lumpur.',
  },
  {
    q: 'What is the easiest public transport?',
    a: 'Maharajalela Monorail connects directly to the Stadium Merdeka area. Merdeka MRT is also adjacent, with Plaza Rakyat LRT and Hang Tuah within walking distance.',
  },
  {
    q: 'What house rules should visitors know?',
    a: 'No smoking or vaping, no pets, no littering and no flammable materials. Children must be supervised. Running-track rules also prohibit heels, spike shoes and loitering on the track.',
  },
]

function Photo({ photo, className = '', label }) {
  const [failed, setFailed] = useState(false)
  return (
    <a className={`photo ${className}`} href={photo.href} target="_blank" rel="noreferrer">
      {!failed ? (
        <img src={photo.src} alt={photo.alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="photo-fallback">
          <span>Photo from @bazrammerdeka</span>
          <b>Open original on Instagram ↗</b>
        </div>
      )}
      {label && <span className="photo-label">{label}</span>}
    </a>
  )
}

function App() {
  const root = useRef(null)
  const [activeFood, setActiveFood] = useState('hot')
  const [activeZone, setActiveZone] = useState('field')
  const [openFaq, setOpenFaq] = useState(0)

  const food = useMemo(() => foodTabs.find((item) => item.id === activeFood) ?? foodTabs[0], [activeFood])
  const zone = useMemo(() => zones.find((item) => item.id === activeZone) ?? zones[0], [activeZone])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reduce ? 0 : 1.05, smoothWheel: !reduce })
    lenis.on('scroll', ScrollTrigger.update)

    let raf = 0
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const ctx = gsap.context(() => {
      if (reduce) return

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.site-nav', { y: -22, opacity: 0, duration: .65 })
        .from('.hero-logo', { y: 26, opacity: 0, scale: .96, duration: .85 }, '-=.25')
        .from('.hero-copy > *', { y: 18, opacity: 0, stagger: .07, duration: .55 }, '-=.4')
        .from('.hero-photo', { x: 36, opacity: 0, scale: .97, duration: .8 }, '-=.55')

      gsap.to('.hero-photo img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: .72,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%' },
        })
      })

      gsap.utils.toArray('.story-photo').forEach((el, index) => {
        gsap.from(el, {
          clipPath: index % 2 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)',
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        })
      })

      gsap.from('.map-pin', {
        scale: .6,
        opacity: 0,
        stagger: .06,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: '.event-map', start: 'top 78%' },
      })
    }, root)

    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
      lenis.destroy()
    }
  }, [])

  return (
    <main ref={root}>
      <nav className="site-nav">
        <a className="nav-brand" href="#top"><img src={LOGO} alt="Bazram Merdeka" /></a>
        <div className="nav-links">
          <a href="#experience">Experience</a>
          <a href="#food">Food</a>
          <a href="#programme">Programme</a>
          <a href="#visit">Visit</a>
        </div>
        <a className="nav-button" href="#visit">Visitor guide</a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-cloud cloud-one" />
        <div className="hero-cloud cloud-two" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Ramadan at Stadium Merdeka · 2026 edition</span>
            <img className="hero-logo" src={LOGO} alt="Bazram Merdeka" />
            <p className="hero-intro">Food around the stadium. Iftar on the field. A Ramadan night framed by one of Kuala Lumpur’s most historic places.</p>
            <div className="fact-row">
              <span><b>21 Feb — 18 Mar</b><small>2026 edition</small></span>
              <span><b>4 PM — 11 PM</b><small>daily</small></span>
              <span><b>Free entry</b><small>Stadium Merdeka</small></span>
              <span><b>118+ vendors</b><small>food + trucks</small></span>
            </div>
            <div className="hero-actions">
              <a className="primary-btn" href="#experience">See the experience</a>
              <a className="ghost-btn" href="#visit">Plan a visit</a>
            </div>
          </div>
          <Photo photo={photos.iftar} className="hero-photo" label="Iftar at Stadium Merdeka · @bazrammerdeka" />
        </div>
      </header>

      <section className="intro wrap" id="experience">
        <div className="section-copy" data-reveal>
          <span className="eyebrow">What is Bazram?</span>
          <h1>A bazaar built around the moment of buka puasa.</h1>
          <p>Bazram Merdeka brought a Ramadan bazaar into the Stadium Merdeka precinct for the first time: more than a food stop, it turned the historic field into a place to eat, pray, gather and spend the evening together.</p>
        </div>
        <div className="experience-cards">
          <article data-reveal><span>01</span><h3>Choose your food</h3><p>Walk the perimeter for local favourites, desserts, drinks and food trucks.</p></article>
          <article data-reveal><span>02</span><h3>Gather on the field</h3><p>Take your food inside and settle into the stadium for picnic-style iftar.</p></article>
          <article data-reveal><span>03</span><h3>Stay after Maghrib</h3><p>Prayer access, family activities and evening programming keep the night moving.</p></article>
        </div>
      </section>

      <section className="night-flow">
        <div className="wrap">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">How the night works</span>
            <h2>Come for food. Stay for the field.</h2>
          </div>
          <div className="flow-rail">
            {flow.map((item, index) => (
              <article className="flow-card" key={item.title} data-reveal>
                <span className="flow-index">0{index + 1}</span>
                <small>{item.time}</small>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="food-section wrap" id="food">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Makan</span>
          <h2>Start with what you feel like eating.</h2>
          <p>Instead of making visitors hunt through hundreds of stall cards, the guide starts with four clear food lanes.</p>
        </div>
        <div className="food-ui" data-reveal>
          <div className="food-tabs">
            {foodTabs.map((item) => (
              <button key={item.id} className={item.id === activeFood ? 'active' : ''} onClick={() => setActiveFood(item.id)}>{item.label}</button>
            ))}
          </div>
          <div className="food-panel">
            <div><span className="eyebrow">Browse by craving</span><h3>{food.title}</h3><p>{food.text}</p></div>
            <div className="food-chips">{food.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="story-grid wrap" aria-label="Bazram photo story">
        <Photo photo={photos.night} className="story-photo story-large" label="After dark · @bazrammerdeka" />
        <div className="story-copy" data-reveal>
          <span className="eyebrow">The setting</span>
          <h2>Old stadium. New city skyline.</h2>
          <p>Stadium Merdeka is where Malaya’s independence was proclaimed in 1957. Bazram re-used that national landmark as a living community space, with Merdeka 118 rising behind the field.</p>
          <p>The contrast is part of the experience: heritage terraces, families on the grass, food smoke around the perimeter and the new Kuala Lumpur skyline overhead.</p>
        </div>
      </section>

      <section className="layout-section" id="layout">
        <div className="wrap layout-grid">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Find your way</span>
            <h2>Four things you need to locate.</h2>
            <p>Keep the map useful. Tap a marker to understand the role of each zone.</p>
          </div>
          <div className="event-map" data-reveal>
            <div className="stadium-ring"><div className="stadium-field">IFTAR FIELD</div></div>
            <button className={`map-pin pin-a ${activeZone === 'food' ? 'active' : ''}`} onClick={() => setActiveZone('food')}>A</button>
            <button className={`map-pin pin-b ${activeZone === 'trucks' ? 'active' : ''}`} onClick={() => setActiveZone('trucks')}>B</button>
            <button className={`map-pin pin-c ${activeZone === 'field' ? 'active' : ''}`} onClick={() => setActiveZone('field')}>C</button>
            <button className={`map-pin pin-d ${activeZone === 'prayer' ? 'active' : ''}`} onClick={() => setActiveZone('prayer')}>D</button>
            <div className="zone-readout"><span>{zone.code}</span><div><b>{zone.title}</b><p>{zone.detail}</p></div></div>
          </div>
        </div>
      </section>

      <section className="programme wrap" id="programme">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Programme</span>
          <h2>The project is more than a row of food stalls.</h2>
          <p>The strongest story is the combination of Ramadan programming, communal iftar and a heritage venue brought back into everyday public life.</p>
        </div>
        <div className="programme-grid">
          {programme.map((item) => (
            <article key={item.title} data-reveal><small>{item.kicker}</small><h3>{item.title}</h3><p>{item.copy}</p></article>
          ))}
        </div>
      </section>

      <section className="photo-band wrap">
        <div className="photo-band-copy" data-reveal>
          <span className="eyebrow">From Bazram’s Instagram</span>
          <h2>Real event imagery, treated like editorial photography.</h2>
          <p>No stock festival photos. Each image links back to the original Bazram post.</p>
        </div>
        <div className="photo-pair">
          <Photo photo={photos.iftar} className="story-photo" label="Iftar · @bazrammerdeka" />
          <Photo photo={photos.visit} className="story-photo offset" label="Visitor post · @bazrammerdeka" />
        </div>
      </section>

      <section className="visit-section" id="visit">
        <div className="wrap">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Visitor guide · 2026 archive</span>
            <h2>Everything practical in one place.</h2>
          </div>
          <div className="visit-grid">
            <article className="visit-card yellow" data-reveal><span>WHEN</span><h3>21 Feb — 18 Mar 2026</h3><p>Open daily from 4 PM to 11 PM. Entry was free.</p></article>
            <article className="visit-card blue" data-reveal><span>WHERE</span><h3>Stadium Merdeka</h3><p>Jalan Stadium, Presint Merdeka 118, Kuala Lumpur.</p></article>
            <article className="visit-card cream" data-reveal><span>BY RAIL</span><h3>Maharajalela / Merdeka</h3><p>Maharajalela Monorail connects directly to the stadium area. Merdeka MRT is also adjacent.</p></article>
            <article className="visit-card red" data-reveal><span>GOOD TO KNOW</span><h3>Family-friendly</h3><p>Food stalls, picnic-style iftar, prayer access and nightly activities in one precinct.</p></article>
          </div>

          <div className="rules" data-reveal>
            <div><span className="eyebrow">House rules</span><h3>Respect the stadium.</h3></div>
            <ul>
              <li>No smoking or vaping</li>
              <li>No pets</li>
              <li>No littering</li>
              <li>Children must be supervised</li>
              <li>No heels or spike shoes on the running track</li>
              <li>No flammable materials or liquids</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="faq wrap">
        <div className="section-heading" data-reveal><span className="eyebrow">FAQ</span><h2>Before heading over.</h2></div>
        <div className="faq-list">
          {faqs.map((item, index) => {
            const open = openFaq === index
            return (
              <article className={`faq-item ${open ? 'open' : ''}`} key={item.q} data-reveal>
                <button onClick={() => setOpenFaq(open ? -1 : index)}><span>{item.q}</span><b>{open ? '−' : '+'}</b></button>
                <div className="faq-answer"><p>{item.a}</p></div>
              </article>
            )
          })}
        </div>
      </section>

      <footer>
        <div className="wrap footer-grid">
          <div><img src={LOGO} alt="Bazram Merdeka" /><p>Ramadan at Stadium Merdeka.</p></div>
          <div className="footer-links"><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a><span>2026 event archive</span><span>An event by 2Cool Productions.</span></div>
        </div>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
