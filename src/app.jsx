import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './app.css'

gsap.registerPlugin(ScrollTrigger)

const LOGO = '/bazram-logo.webp'
const IMAGES = {
  hero: 'https://yamchatime.com/wp-content/uploads/2026/03/A-unique-Ramadan-experience-at-Bazram-Merdeka-at-Stadium-Merdeka.jpg',
  crowd: 'https://yamchatime.com/wp-content/uploads/2026/03/PNB-Merdeka-hosts-its-first-ever-Bazaar-Ramadan-at-Stadium-Merdeka-1-1024x681.jpg',
  food: 'https://yamchatime.com/wp-content/uploads/2026/03/PNB-Merdeka-hosts-its-first-ever-Bazaar-Ramadan-at-Stadium-Merdeka--1024x607.jpg',
  stadium: 'https://www.warisankl.my/clients/asset_30783ACB-EA95-446E-8A11-9AC9134F0D37/contentMS/img/P5A%20%281%29.jpg',
}

const WHATSAPP = 'https://wa.me/60164597091?text=Hi%202Cool%20Productions%2C%20saya%20berminat%20untuk%20book%20tapak%20Bazram%20Merdeka.%20Boleh%20share%20details%20vendor%3F'

const journey = [
  { title: 'Arrive', time: 'From 4 PM', short: 'Come in before the rush.', copy: 'Take your time entering the stadium, get familiar with the grounds and enjoy the atmosphere before the busiest hour.', image: IMAGES.stadium },
  { title: 'Cari makan', time: 'Before Maghrib', short: 'Find your buka.', copy: 'Browse the food lanes, drinks and food trucks, then choose what you want to bring onto the field.', image: IMAGES.food },
  { title: 'Iftar', time: 'At Maghrib', short: 'Buka together.', copy: 'Find your place on the field and break fast together inside Stadium Merdeka.', image: IMAGES.hero },
  { title: 'After dark', time: 'After iftar', short: 'Stay a little longer.', copy: 'Prayer, dessert, another food round and the night atmosphere continue around the stadium.', image: IMAGES.crowd },
]

const afterBuka = [
  ['Prayer', 'Take a quiet moment after breaking fast.'],
  ['Dessert', 'Go back for something sweet or something cold.'],
  ['Programme', 'See what is happening around the stadium that evening.'],
  ['Explore', 'Walk the bazaar again when the lights take over.'],
]

const foods = [
  { id: 'hot', label: 'Hot food', title: 'Ramadan favourites', copy: 'Grills, rice dishes, murtabak, roti and familiar buka staples.', image: IMAGES.food },
  { id: 'sweet', label: 'Sweet', title: 'Something manis', copy: 'Kuih, chilled desserts and sweet bites for after Maghrib.', image: IMAGES.hero },
  { id: 'drinks', label: 'Drinks', title: 'Keep it cold', copy: 'Juices, iced tea, coffee and cold drinks for the evening.', image: IMAGES.crowd },
  { id: 'trucks', label: 'Food trucks', title: 'The truck lane', copy: 'Street-food formats and easy late-night second rounds.', image: IMAGES.stadium },
]

const programme = [
  ['4:00 PM', 'Bazaar opens', 'Food lanes open and the evening begins.'],
  ['Before Maghrib', 'Food, activities & arrival', 'Browse, find your meal and settle in.'],
  ['Maghrib', 'Communal iftar', 'The field becomes the centre of the evening.'],
  ['After iftar', 'Prayer & evening activities', 'Stay for prayer and the night atmosphere.'],
]

function Img({ src, alt, className = '' }) {
  const [bad, setBad] = useState(false)
  return bad
    ? <div className={`img-fallback ${className}`}><img src={LOGO} alt="Bazram Merdeka" /></div>
    : <img className={className} src={src} alt={alt} onError={() => setBad(true)} loading="lazy" />
}

function useMotion(root, isHome = false) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reduced ? 0 : 1.03, smoothWheel: !reduced })
    lenis.on('scroll', ScrollTrigger.update)
    let raf
    const loop = t => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    const ctx = gsap.context(() => {
      gsap.set('.progress-line', { scaleX: 0, transformOrigin: 'left center' })
      gsap.to('.progress-line', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .25 } })

      if (isHome) {
        ScrollTrigger.create({
          trigger: '.home-hero', start: 'bottom 90px', end: 'bottom top',
          onEnter: () => document.body.classList.add('nav-scrolled'),
          onLeaveBack: () => document.body.classList.remove('nav-scrolled'),
        })
      }

      if (reduced) return

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.brand, .toplinks a, .nav-cta', { y: -12, opacity: 0, stagger: .035, duration: .42 })
        .from('.hero-title span', { yPercent: 112, stagger: .075, duration: .72 }, '-=.08')
        .from('.hero-sub, .hero-facts, .hero-actions', { y: 15, opacity: 0, stagger: .07, duration: .44 }, '-=.34')
        .from('.hero-media-card', { x: 30, scale: .975, opacity: 0, duration: .72 }, '-=.5')

      gsap.utils.toArray('[data-reveal]').forEach(el => {
        gsap.from(el, { y: 24, opacity: 0, duration: .68, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } })
      })

      gsap.utils.toArray('.photo-section').forEach(el => {
        gsap.to(el, { backgroundPosition: '50% 58%', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.05 } })
      })

      if (isHome) {
        const atmosphere = gsap.timeline({ scrollTrigger: { trigger: '.home-journey', start: 'top top', end: 'bottom bottom', scrub: 1.2 } })
        atmosphere
          .to('.day-night-orb', { y: '36vh', x: '-7vw', scale: .86, backgroundColor: '#f4ad3e', duration: 1 })
          .to('.day-night-orb', { y: '74vh', x: '-17vw', scale: .58, backgroundColor: '#f3eee2', boxShadow: '0 0 60px rgba(243,238,226,.28)', duration: 1 })
          .to('.ambient-night', { opacity: .34, duration: 1 }, '<')

        gsap.to('.hero-media-card img', { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: .8 } })
        gsap.fromTo('.iftar-word', { opacity: .35, y: 25 }, { opacity: 1, y: 0, scrollTrigger: { trigger: '.iftar-moment', start: 'top 70%', end: 'center center', scrub: .8 } })
        gsap.to('.iftar-moment .photo-dim', { opacity: .7, scrollTrigger: { trigger: '.iftar-moment', start: 'top bottom', end: 'center center', scrub: .8 } })

        const media = document.querySelector('.hero-media-card')
        if (media) {
          const move = e => {
            const r = media.getBoundingClientRect()
            const x = ((e.clientX - r.left) / r.width - .5) * 8
            const y = ((e.clientY - r.top) / r.height - .5) * 6
            gsap.to(media, { x, y, duration: .35, ease: 'power2.out' })
          }
          const reset = () => gsap.to(media, { x: 0, y: 0, duration: .5, ease: 'power3.out' })
          media.addEventListener('mousemove', move)
          media.addEventListener('mouseleave', reset)
        }
      }
    }, root)

    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
      lenis.destroy()
      document.body.classList.remove('nav-scrolled')
    }
  }, [root, isHome])
}

function Topbar({ home = false, minimal = false }) {
  return <nav className={`topbar ${home ? 'topbar-home' : ''}`}>
    <a href="/" className="brand"><img src={LOGO} alt="Bazram Merdeka" /></a>
    {!minimal && <div className="toplinks"><a href="/#journey">Experience</a><a href="/food">Food</a><a href="/programme">Programme</a><a href="/visit">Visit</a></div>}
    <a className="nav-cta" href="/visit">Visitor guide <span>↗</span></a>
    <span className="progress-line" />
  </nav>
}

function Footer() {
  return <footer className="footer"><div className="wrap footer-row">
    <div className="footer-brand"><img src={LOGO} alt="Bazram Merdeka" /><span>Stadium Merdeka · Kuala Lumpur</span></div>
    <div className="footer-links"><a href="/food">Food</a><a href="/programme">Programme</a><a href="/visit">Visit</a><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
    <div className="footer-small"><span>21 Feb–18 Mar 2026 · 4 PM–11 PM · Free entry</span><span>An event by 2Cool Productions · <a href="/vendors">Vendor info →</a></span></div>
  </div></footer>
}

function Home() {
  const root = useRef(null)
  const [step, setStep] = useState(0)
  const [tonight, setTonight] = useState(2)
  useMotion(root, true)

  const chooseStep = i => {
    if (i === step) return
    setStep(i)
    gsap.fromTo('.journey-photo img', { opacity: .28, scale: 1.03 }, { opacity: 1, scale: 1, duration: .55, ease: 'power3.out' })
    gsap.fromTo('.journey-copy > *', { y: 9, opacity: 0 }, { y: 0, opacity: 1, stagger: .045, duration: .34, ease: 'power2.out' })
  }

  const chooseTonight = i => {
    if (i === tonight) return
    setTonight(i)
    gsap.fromTo('.tonight-detail > *', { y: 8, opacity: 0 }, { y: 0, opacity: 1, stagger: .04, duration: .32, ease: 'power2.out' })
    gsap.fromTo('.tonight-photo img', { opacity: .35, scale: 1.02 }, { opacity: 1, scale: 1, duration: .5, ease: 'power3.out' })
  }

  return <main ref={root} className="home-journey">
    <div className="day-night-orb" aria-hidden="true" />
    <div className="ambient-night" aria-hidden="true" />

    <div className="hero-shell">
      <Topbar home />
      <header className="home-hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title"><i><span>Where food, faith &amp;</span></i><i><span>heritage come together.</span></i></h1>
            <p className="hero-sub">Come hungry, bring your people, and buka together inside Stadium Merdeka.</p>
            <div className="hero-facts"><span>⌖ Stadium Merdeka</span><span>21 Feb–18 Mar</span><span>◷ 4 PM–11 PM</span><span>Free entry</span></div>
            <div className="hero-actions"><a className="btn yellow" href="/visit">Plan your evening ↗</a><a className="btn ghost" href="#iftar">See Bazram moments ↓</a></div>
          </div>
          <div className="hero-media-wrap"><div className="hero-media-card"><Img src={IMAGES.hero} alt="Iftar at Stadium Merdeka" /><div className="media-caption"><b>Iftar at Stadium Merdeka</b><span>Bazram Merdeka</span></div></div></div>
        </div>
      </header>
    </div>

    <section className="welcome-band photo-section" style={{ backgroundImage: `linear-gradient(90deg,rgba(12,17,20,.9),rgba(12,17,20,.56) 52%,rgba(12,17,20,.34)),url(${IMAGES.crowd})` }}>
      <div className="wrap welcome-grid" data-reveal>
        <div><h2>This is your<br />Ramadan evening.</h2><p>Arrive before Maghrib. Cari makan. Find a spot on the field. Buka together. Stay for the night.</p></div>
        <div className="welcome-points"><article><span>01</span><div><b>Come for the food</b><p>Browse first. Decide later.</p></div></article><article><span>02</span><div><b>Stay for iftar</b><p>Bring your meal onto the field.</p></div></article><article><span>03</span><div><b>Enjoy the night</b><p>Prayer, food and the atmosphere continue.</p></div></article></div>
      </div>
    </section>

    <section id="journey" className="journey-section">
      <div className="wrap journey-grid">
        <div className="journey-copy" data-reveal><h2>Before Maghrib.</h2><h3>{journey[step].short}</h3><p>{journey[step].copy}</p><small>{journey[step].time}</small></div>
        <div className="journey-photo" data-reveal><Img src={journey[step].image} alt={journey[step].title} /></div>
        <div className="journey-track" data-reveal>{journey.map((x, i) => <button key={x.title} className={i === step ? 'active' : ''} onClick={() => chooseStep(i)}><span>{String(i + 1).padStart(2, '0')}</span><b>{x.title}</b></button>)}</div>
      </div>
    </section>

    <section id="iftar" className="iftar-moment photo-section" style={{ backgroundImage: `url(${IMAGES.hero})` }}>
      <div className="photo-dim" />
      <div className="wrap iftar-copy"><span className="iftar-word">Maghrib.</span><h2>For a moment,<br />the whole stadium slows down.</h2><p>Food in hand. People on the field. Everyone waiting for the same moment.</p></div>
    </section>

    <section className="after-section">
      <div className="wrap after-grid">
        <div data-reveal><h2>The night doesn’t end at iftar.</h2><p>Stay a little longer and let the evening unfold at your own pace.</p></div>
        <div className="after-list" data-reveal>{afterBuka.map(([t, c], i) => <article key={t}><span>0{i + 1}</span><h3>{t}</h3><p>{c}</p></article>)}</div>
      </div>
    </section>

    <section className="tonight-section">
      <div className="wrap tonight-grid">
        <div className="tonight-list" data-reveal><h2>What’s next?</h2>{programme.map(([time, title], i) => <button key={time} className={i === tonight ? 'active' : ''} onClick={() => chooseTonight(i)}><time>{time}</time><b>{title}</b></button>)}<a href="/programme">Full programme ↗</a></div>
        <div className="tonight-photo" data-reveal><Img src={[IMAGES.food, IMAGES.crowd, IMAGES.hero, IMAGES.stadium][tonight]} alt={programme[tonight][1]} /></div>
        <div className="tonight-detail" data-reveal><span>{programme[tonight][0]}</span><h3>{programme[tonight][1]}</h3><p>{programme[tonight][2]}</p></div>
      </div>
    </section>

    <section className="visit-home">
      <div className="wrap visit-home-grid" data-reveal>
        <div><h2>Come when you’re ready.</h2><p>Everything you need for a smooth evening is one click away.</p><div className="visit-actions"><a className="btn red" href="/visit">Plan your visit ↗</a><a className="plain-link" href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Get directions ↗</a></div></div>
        <div className="visit-essentials"><div><span>Where</span><b>Stadium Merdeka</b></div><div><span>When</span><b>21 Feb–18 Mar</b></div><div><span>Hours</span><b>4 PM–11 PM</b></div><div><span>Entry</span><b>Free</b></div><div><span>Rail</span><b>Merdeka MRT / Maharajalela</b></div><div><span>Good to know</span><b>Prayer facilities · families welcome</b></div></div>
      </div>
    </section>

    <Footer />
  </main>
}

function PageShell({ title, intro, image, children }) {
  const root = useRef(null)
  useMotion(root, false)
  return <main ref={root}><Topbar /><header className="sub-hero"><div className="wrap sub-hero-grid"><div><h1>{title}</h1><p>{intro}</p></div><div className="sub-photo"><Img src={image} alt={title} /></div></div></header>{children}<Footer /></main>
}

function FoodPage() {
  const [id, setId] = useState('hot')
  const x = foods.find(y => y.id === id)
  return <PageShell title="Come hungry." intro="Hot food, sweet treats, cold drinks and food trucks around Stadium Merdeka." image={IMAGES.food}><section className="section clean"><div className="wrap detail-grid"><aside className="detail-tabs">{foods.map(f => <button className={f.id === id ? 'active' : ''} onClick={() => setId(f.id)} key={f.id}>{f.label}</button>)}</aside><div className="detail-feature"><Img src={x.image} alt={x.title} /><div><h2>{x.title}</h2><p>{x.copy}</p></div></div></div></section></PageShell>
}

function ProgrammePage() {
  return <PageShell title="What’s happening tonight?" intro="The main rhythm of a Bazram Merdeka evening." image={IMAGES.crowd}><section className="section clean"><div className="wrap full-programme">{programme.map(([t, n, c]) => <article key={t} data-reveal><time>{t}</time><div><h3>{n}</h3><p>{c}</p></div></article>)}</div></section></PageShell>
}

function VisitPage() {
  return <PageShell title="Plan your visit." intro="Everything practical for a smooth evening at Stadium Merdeka." image={IMAGES.stadium}><section className="section clean"><div className="wrap visit-detail"><div className="visit-facts">{[['Date', '21 Feb — 18 Mar 2026'], ['Hours', '4 PM — 11 PM'], ['Location', 'Stadium Merdeka'], ['Entry', 'Free']].map(([a, b]) => <div key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="visit-detail-grid"><article><h3>Getting here</h3><p>Maharajalela Monorail and Merdeka MRT are the most useful rail approaches to the precinct.</p></article><article><h3>Prayer</h3><p>Prayer access forms part of the evening flow. Arrive with enough time before Maghrib.</p></article><article><h3>Families</h3><p>The field and stands work well for groups and families. Children should remain supervised.</p></article><article><h3>House rules</h3><p>No smoking or vaping, no pets, no littering and no flammable materials. Respect stadium restrictions.</p></article></div><div className="visit-actions"><a className="btn yellow" href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Open in Maps ↗</a><a className="plain-link" href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a></div></div></section></PageShell>
}

function VendorsPage() {
  return <PageShell title="Book a tapak at Bazram Merdeka." intro="Seller information lives here, away from the visitor journey." image={IMAGES.food}><section className="section vendor-page"><div className="wrap vendor-grid"><div data-reveal><h2>From RM1,000 for the 26-day run.</h2><p>Seller categories included Makanan, Minuman, Food Truck, Bahan Kering and selected Non-F&amp;B concepts.</p><div className="vendor-chips"><span>Makanan</span><span>Minuman</span><span>Food Truck</span><span>Bahan Kering / Non-F&amp;B</span></div></div><aside className="vendor-card" data-reveal><small>BOOK A TAPAK</small><strong>RM1,000+</strong><span>21 Feb — 18 Mar · 4 PM — 11 PM</span><hr /><p>Final placement, approval, requirements and availability are handled by the organiser.</p><a className="btn red" href={WHATSAPP} target="_blank" rel="noreferrer">Enquire on WhatsApp ↗</a></aside></div></section></PageShell>
}

function NotFound() { return <main><Topbar minimal /><section className="not-found"><img src={LOGO} alt="Bazram Merdeka" /><h1>Page not found.</h1><a className="btn yellow" href="/">Back home</a></section></main> }

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = path === '/' ? Home : path === '/food' ? FoodPage : path === '/programme' ? ProgrammePage : path === '/visit' ? VisitPage : path === '/vendors' ? VendorsPage : NotFound
createRoot(document.getElementById('root')).render(<Page />)
