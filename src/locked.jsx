import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import Lenis from 'lenis'
import './locked.css'

gsap.registerPlugin(ScrollTrigger, Flip)

const LOGO = '/bazram-logo.webp'

const IMAGES = {
  hero: 'https://yamchatime.com/wp-content/uploads/2026/03/A-unique-Ramadan-experience-at-Bazram-Merdeka-at-Stadium-Merdeka.jpg',
  crowd: 'https://yamchatime.com/wp-content/uploads/2026/03/PNB-Merdeka-hosts-its-first-ever-Bazaar-Ramadan-at-Stadium-Merdeka-1-1024x681.jpg',
  food: 'https://yamchatime.com/wp-content/uploads/2026/03/PNB-Merdeka-hosts-its-first-ever-Bazaar-Ramadan-at-Stadium-Merdeka--1024x607.jpg',
  field: 'https://www.warisankl.my/clients/asset_30783ACB-EA95-446E-8A11-9AC9134F0D37/contentMS/img/P5A%20%281%29.jpg',
}

const FALLBACK = 'https://www.warisankl.my/clients/asset_30783ACB-EA95-446E-8A11-9AC9134F0D37/contentMS/img/P5A%20%281%29.jpg'

function SmartImage({ src, alt, className = '' }) {
  const [failedOnce, setFailedOnce] = useState(false)
  const [failedTwice, setFailedTwice] = useState(false)
  if (failedTwice) return <div className={`real-photo-fallback ${className}`}><img src={LOGO} alt="Bazram Merdeka" /></div>
  return <img className={className} src={failedOnce ? FALLBACK : src} alt={alt} loading="lazy" onError={() => failedOnce ? setFailedTwice(true) : setFailedOnce(true)} />
}

const quickCards = [
  { id: 'experience', icon: '✦', title: 'Experience', copy: 'Food, communal iftar and a Ramadan night inside Stadium Merdeka.', image: IMAGES.hero, tone: 'yellow' },
  { id: 'food', icon: '♨', title: 'Food zones', copy: 'Local favourites, bazaar staples, desserts, drinks and food trucks.', image: IMAGES.food, tone: 'red' },
  { id: 'programme', icon: '▦', title: 'Programme', copy: 'Plan the evening around iftar, community moments and night activities.', image: IMAGES.crowd, tone: 'blue' },
]

const experienceSteps = [
  { title: 'Arrive', time: 'From 4 PM', copy: 'Find your way in, get your bearings and walk the perimeter before the busiest hour.', image: IMAGES.crowd },
  { title: 'Makan', time: 'Before Maghrib', copy: 'Browse the food zones, pick up dinner and make a second stop for something sweet or cold.', image: IMAGES.food },
  { title: 'Iftar', time: 'At Maghrib', copy: 'Move onto the field or into the stands and break fast together inside Stadium Merdeka.', image: IMAGES.hero },
  { title: 'After Dark', time: 'After iftar', copy: 'Pray, take another food round and stay as the stadium shifts into night.', image: IMAGES.field },
]

const foodGroups = [
  { id: 'hot', label: 'Hot food', title: 'Local favourites', copy: 'Grills, rice dishes, murtabak, roti and the familiar Ramadan staples people queue for.', items: ['Satay', 'Ayam percik', 'Murtabak', 'Roti John'], image: IMAGES.food },
  { id: 'sweet', label: 'Sweet', title: 'Something manis', copy: 'Kuih, cold desserts and sweet bites for after iftar or a final walk through the bazaar.', items: ['Kuih', 'ABC', 'Dessert cups', 'Bakes'], image: IMAGES.hero },
  { id: 'drinks', label: 'Drinks', title: 'Keep it cold', copy: 'Air balang, juices, iced tea and coffee grouped into one easy-to-find stop.', items: ['Air balang', 'Juice', 'Iced tea', 'Coffee'], image: IMAGES.field },
  { id: 'trucks', label: 'Food trucks', title: 'The truck lane', copy: 'Street-food formats, quick group orders and late-night second rounds.', items: ['Burgers', 'Loaded fries', 'Wraps', 'Street food'], image: IMAGES.crowd },
]

const programme = [
  { time: '4:00 PM', title: 'Bazaar opens', copy: 'Explore the food zones while the crowd is still building.', image: IMAGES.food },
  { time: '6:30 PM', title: 'Ramadan programme', copy: 'Community activities and selected Ramadan programming lead into iftar.', image: IMAGES.crowd },
  { time: '7:30 PM', title: 'Iftar', copy: 'Break fast together on one of Kuala Lumpur’s most historic fields.', image: IMAGES.hero },
  { time: '8:30 PM', title: 'Night activities', copy: 'The stadium returns to movement after Maghrib.', image: IMAGES.field },
  { time: '10:30 PM', title: 'Last food run', copy: 'One final loop through the stalls before the evening winds down.', image: IMAGES.food },
]

const zones = [
  { id: 'field', code: '●', title: 'Iftar Field', copy: 'The social heart of Bazram: picnic-style buka puasa inside Stadium Merdeka.', meta: 'Open through the evening' },
  { id: 'food', code: 'F', title: 'Food', copy: 'The main cooked-food lane around the stadium perimeter.', meta: 'Main food lane' },
  { id: 'truck', code: 'T', title: 'Food Trucks', copy: 'Quick pick-up and modern street-food formats.', meta: 'Outer lane' },
  { id: 'prayer', code: 'P', title: 'Prayer', copy: 'Prayer access and facilities that fit naturally into the night.', meta: 'Near stadium access' },
  { id: 'entry', code: '↑', title: 'Entrance', copy: 'Primary arrival and wayfinding point into the precinct.', meta: 'Stadium Merdeka' },
]

const gallery = [
  { id: 'g1', src: IMAGES.hero, label: 'Iftar on the field' },
  { id: 'g2', src: IMAGES.food, label: 'Food lane' },
  { id: 'g3', src: IMAGES.crowd, label: 'Before Maghrib' },
  { id: 'g4', src: IMAGES.field, label: 'Stadium Merdeka' },
  { id: 'g5', src: IMAGES.hero, label: 'Communal moment' },
  { id: 'g6', src: IMAGES.food, label: 'Bazaar favourites' },
]

const visitorFaq = [
  ['Getting here', 'Maharajalela Monorail and Merdeka MRT are the most useful rail approaches to the Stadium Merdeka precinct.'],
  ['Prayer', 'Prayer access is part of the evening flow. Masjid Al-Sultan Abdullah is also located across the stadium precinct.'],
  ['Families', 'The field and stands work well for families; children should remain supervised throughout the visit.'],
  ['What to bring', 'A compact picnic mat, reusable water bottle and light rain protection can make the evening easier.'],
  ['Rules', 'No smoking or vaping, no pets, no littering and no flammable materials. Respect running-track restrictions.'],
  ['Facilities', 'Food lanes, field seating, prayer access and visitor wayfinding are grouped within the stadium precinct.'],
]

function App() {
  const root = useRef(null)
  const navLine = useRef(null)
  const navWrap = useRef(null)
  const heroCard = useRef(null)
  const heroSun = useRef(null)
  const [activeNav, setActiveNav] = useState('experience')
  const [experience, setExperience] = useState(0)
  const [food, setFood] = useState('hot')
  const [programmeIndex, setProgrammeIndex] = useState(2)
  const [zone, setZone] = useState('field')
  const [galleryOpen, setGalleryOpen] = useState(null)
  const [openGuide, setOpenGuide] = useState(1)

  const foodData = useMemo(() => foodGroups.find((item) => item.id === food), [food])
  const zoneData = useMemo(() => zones.find((item) => item.id === zone), [zone])

  const moveNav = (id) => {
    if (!navWrap.current || !navLine.current) return
    const link = navWrap.current.querySelector(`[data-nav="${id}"]`)
    if (!link) return
    const parent = navWrap.current.getBoundingClientRect()
    const rect = link.getBoundingClientRect()
    gsap.to(navLine.current, { x: rect.left - parent.left, width: rect.width, duration: .32, ease: 'power3.out', overwrite: true })
  }

  useEffect(() => moveNav(activeNav), [activeNav])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reduced ? 0 : 1.02, smoothWheel: !reduced })
    lenis.on('scroll', ScrollTrigger.update)
    let raf
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    const ctx = gsap.context(() => {
      gsap.set('.page-progress', { scaleX: 0, transformOrigin: 'left center' })
      gsap.to('.page-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } })
      ;['experience','food','programme','visit'].forEach((id) => {
        ScrollTrigger.create({ trigger: `#${id}`, start: 'top 48%', end: 'bottom 48%', onEnter: () => setActiveNav(id), onEnterBack: () => setActiveNav(id) })
      })
      if (reduced) return
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.site-nav', { y: -18, opacity: 0, duration: .6 })
        .from('.hero-kicker', { y: 14, opacity: 0, duration: .45 }, '-=.15')
        .from('.hero-title-line > span', { yPercent: 112, stagger: .07, duration: .78 }, '-=.2')
        .from('.hero-summary, .hero-actions, .scroll-cue', { y: 16, opacity: 0, stagger: .07, duration: .5 }, '-=.4')
        .from('.hero-photo-frame', { x: 36, opacity: 0, scale: .97, rotate: 1.5, duration: .82 }, '-=.58')
        .from('.hero-caption', { y: 16, opacity: 0, duration: .4 }, '-=.25')
      gsap.to('.hero-photo-frame img', { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to('.hero-sun', { yPercent: -12, xPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.1 } })
      gsap.utils.toArray('[data-reveal]').forEach((el, i) => gsap.from(el, { y: 24 + (i % 2) * 4, opacity: 0, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } }))
      gsap.utils.toArray('[data-mask]').forEach((el) => gsap.from(el, { clipPath: 'inset(0 0 100% 0)', duration: .85, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 84%' } }))
    }, root)

    const resize = () => moveNav(activeNav)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); ctx.revert(); lenis.destroy() }
  }, [])

  const heroMove = (e) => {
    if (!heroCard.current || matchMedia('(pointer:coarse)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const r = heroCard.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - .5
    const y = (e.clientY - r.top) / r.height - .5
    gsap.to(heroCard.current, { rotateY: x * .8, rotateX: -y * .55, x: x * 5, y: y * 4, duration: .4, ease: 'power3.out', transformPerspective: 1200 })
    gsap.to(heroSun.current, { x: -x * 10, y: -y * 8, duration: .5, ease: 'power3.out' })
  }
  const heroReset = () => {
    gsap.to(heroCard.current, { rotateY:0, rotateX:0, x:0, y:0, duration:.55, ease:'power3.out' })
    gsap.to(heroSun.current, { x:0, y:0, duration:.55, ease:'power3.out' })
  }
  const changeExperience = (index) => {
    if (index === experience) return
    const cards = root.current.querySelectorAll('.experience-card')
    const state = Flip.getState(cards)
    flushSync(() => setExperience(index))
    Flip.from(state, { duration: .5, ease: 'power3.inOut', absolute: false })
  }
  const changeFood = (id) => {
    if (id === food) return
    const cards = root.current.querySelectorAll('.food-mini-card')
    const state = Flip.getState(cards)
    flushSync(() => setFood(id))
    Flip.from(state, { duration: .46, ease: 'power3.inOut', stagger: .025 })
    gsap.fromTo('.food-feature-copy > *', { y: 9, opacity: 0 }, { y: 0, opacity: 1, duration: .34, stagger: .04, ease: 'power2.out' })
  }
  const changeProgramme = (i) => {
    if (i === programmeIndex) return
    setProgrammeIndex(i)
    gsap.fromTo('.programme-photo', { opacity: .4, scale: .985 }, { opacity: 1, scale: 1, duration: .42, ease: 'power3.out' })
    gsap.fromTo('.programme-photo-caption > *', { y: 7, opacity: 0 }, { y: 0, opacity: 1, stagger: .04, duration: .3 })
  }
  const selectZone = (id, e) => {
    setZone(id)
    gsap.fromTo(e.currentTarget, { scale: 1 }, { scale: 1.15, yoyo: true, repeat: 1, duration: .16, ease: 'power2.out' })
    gsap.fromTo('.map-popover', { y: 10, opacity: .45 }, { y: 0, opacity: 1, duration: .3, ease: 'power3.out' })
  }

  return (
    <main ref={root}>
      <nav className="site-nav">
        <a className="nav-logo" href="#top"><img src={LOGO} alt="Bazram Merdeka" /></a>
        <div className="nav-links" ref={navWrap}>
          <span className="nav-line" ref={navLine} />
          <a href="#experience" data-nav="experience">Experience</a>
          <a href="#food" data-nav="food">Food</a>
          <a href="#programme" data-nav="programme">Programme</a>
          <a href="#visit" data-nav="visit">Visit</a>
        </div>
        <a className="visitor-btn" href="#visit">Visitor guide <span>↗</span></a>
        <span className="page-progress" />
      </nav>

      <header className="hero" id="top">
        <span className="cloud cloud-a"/><span className="cloud cloud-b"/><span className="cloud cloud-c"/>
        <div className="hero-inner wrap">
          <div className="hero-copy">
            <span className="eyebrow hero-kicker">Ramadan at Stadium Merdeka · 2026 edition</span>
            <h1 className="hero-title">
              <span className="hero-title-line"><span>Where food,</span></span>
              <span className="hero-title-line"><span>faith &amp; heritage</span></span>
              <span className="hero-title-line accent"><span>come together.</span></span>
            </h1>
            <p className="hero-summary">Food around the stadium. Iftar on the field.<br/>A Ramadan night framed by one of<br/>Kuala Lumpur’s most historic places.</p>
            <div className="hero-actions">
              <a className="yellow-btn" href="#visit">Plan your visit <span>↗</span></a>
              <a className="underlink" href="#photo-story">Watch the highlights <span>▷</span></a>
            </div>
            <a className="scroll-cue" href="#experience"><i/><span>SCROLL TO EXPLORE</span></a>
          </div>
          <div className="hero-media">
            <span className="hero-sun" ref={heroSun}/><div className="dot-field" aria-hidden="true"/>
            <div className="hero-photo-frame" ref={heroCard} onPointerMove={heroMove} onPointerLeave={heroReset}>
              <SmartImage src={IMAGES.hero} alt="Bazram Merdeka communal iftar at Stadium Merdeka" className="hero-photo"/>
              <div className="hero-caption">
                <span className="caption-avatar"><img src={LOGO} alt=""/></span>
                <div><b>Iftar at Stadium Merdeka</b><small>PNB Merdeka Ventures · Bazram Merdeka</small></div>
                <span className="caption-page">1 / 6</span><button aria-label="Previous photo">‹</button><button aria-label="Next photo">›</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="quick-section"><div className="quick-grid wrap">{quickCards.map(card => <a href={`#${card.id}`} className="quick-card" key={card.id} data-reveal><div className="quick-head"><span className={`quick-icon ${card.tone}`}>{card.icon}</span><div><h3>{card.title}</h3><p>{card.copy}</p></div></div><div className="quick-photo"><SmartImage src={card.image} alt={card.title}/></div></a>)}</div></section>

      <section className="section experience" id="experience"><div className="wrap">
        <div className="section-intro two-col" data-reveal><div><span className="eyebrow">Ramadan at Stadium Merdeka · 2026 edition</span><h2>How a Bazram<br/>evening unfolds<span className="red-dot">.</span></h2></div><p>From the first step through the gates to the final food run, here’s a simple guide to an evening at Stadium Merdeka.</p></div>
        <div className="experience-rail">{experienceSteps.map((step, i) => <button className={experience===i?'active':''} onClick={()=>changeExperience(i)} key={step.title}><span>{i+1}</span><b>{step.title}</b><small>{step.copy}</small></button>)}</div>
        <div className="experience-cards">{experienceSteps.map((step,i)=><article className={`experience-card ${experience===i?'active':''}`} key={step.title} onClick={()=>changeExperience(i)} data-reveal><div className="experience-photo"><SmartImage src={step.image} alt={step.title}/></div><div className="experience-card-copy"><small>0{i+1}</small><h3>{step.title}</h3><p>{step.copy}</p><span>→</span></div></article>)}</div>
      </div></section>

      <section className="section food" id="food"><span className="cloud cloud-d"/><span className="cloud cloud-e"/><div className="wrap food-grid">
        <div className="food-side" data-reveal><span className="eyebrow">Food zones</span><h2>What are<br/>you craving?</h2><p>From familiar Ramadan favourites to food-truck bites, start with a category instead of a wall of vendors.</p><div className="food-tabs">{foodGroups.map(g=><button key={g.id} className={food===g.id?'active':''} onClick={()=>changeFood(g.id)}><span>{g.label}</span><i>↗</i></button>)}</div></div>
        <div className="food-stage"><div className="food-feature" data-mask><SmartImage src={foodData.image} alt={foodData.title}/><span className="food-lane">⌖ Main food lane</span><div className="food-feature-copy"><h3>{foodData.title}</h3><p>{foodData.copy}</p></div></div><div className="food-mini-grid">{foodData.items.map((item,i)=><article className="food-mini-card" key={item} style={{order:(i+foodGroups.findIndex(g=>g.id===food))%4}}><div className="mini-photo"><SmartImage src={i%2?IMAGES.food:IMAGES.hero} alt={item}/></div><small>{i<2?'Main food lane':'Quick pick-up'}</small><b>{item}</b></article>)}</div></div>
      </div></section>

      <section className="section programme" id="programme"><div className="wrap"><div className="section-intro" data-reveal><span className="eyebrow">Ramadan at Stadium Merdeka · 2026 edition</span><h2>Programme</h2><p>A day of community, flavours and spirit. Here’s how the evening comes together.</p></div><div className="programme-grid"><div className="programme-list" data-reveal>{programme.map((item,i)=><button className={programmeIndex===i?'active':''} key={item.time} onClick={()=>changeProgramme(i)}><time>{item.time}</time><span><b>{item.title}</b><small>{item.copy}</small></span></button>)}</div><div className="programme-photo-wrap" data-mask><SmartImage src={programme[programmeIndex].image} alt={programme[programmeIndex].title} className="programme-photo"/><div className="programme-photo-caption"><b>{programme[programmeIndex].title}</b><small>Stadium Merdeka · Bazram Merdeka</small></div></div></div></div></section>

      <section className="section stadium" id="stadium"><span className="cloud cloud-f"/><span className="cloud cloud-g"/><div className="wrap"><div className="section-intro" data-reveal><span className="eyebrow">Stadium guide</span><h2>Explore Stadium Merdeka</h2><p>Tap a map marker for the zone that matters to you.</p></div><div className="stadium-layout"><div className="stadium-map" data-reveal><div className="map-ring"><div className="map-field">IFTAR FIELD</div></div>{zones.map((z,i)=><button key={z.id} className={`zone-pin zone-${i+1} ${zone===z.id?'active':''}`} onClick={(e)=>selectZone(z.id,e)}>{z.code}</button>)}<div className="map-popover"><span>{zoneData.code}</span><div><h3>{zoneData.title}</h3><p>{zoneData.copy}</p><small>{zoneData.meta}</small></div></div><div className="map-legend">{zones.map(z=><button onClick={(e)=>selectZone(z.id,e)} key={z.id}><span>{z.code}</span>{z.title}</button>)}</div></div><div className="info-cards"><article><span className="round-icon blue">⌖</span><h3>Getting here</h3><p>Maharajalela Monorail and Merdeka MRT are the most useful rail approaches.</p><a href="#visit">Get directions ↗</a></article><article><span className="round-icon yellow">▣</span><h3>Nearest rail</h3><p>Maharajalela connects directly into the Stadium Merdeka area.</p><a href="#visit">View visitor guide ↗</a></article><article><span className="round-icon blue">◷</span><h3>Opening hours</h3><p>2026 edition: 4 PM — 11 PM, 21 February — 18 March.</p></article><article><span className="round-icon blue">♿</span><h3>Accessibility</h3><p>Plan arrival, field access and facilities before peak iftar time.</p></article></div></div></div></section>

      <section className="section photo-story" id="photo-story"><div className="wrap"><div className="section-intro" data-reveal><span className="eyebrow">Photo story</span><h2>A night to share,<br/>a stadium to remember.</h2><p>Real event photography presented as an editorial story, not an Instagram embed wall.</p></div><div className="gallery-grid">{gallery.map((item,i)=><button className={`gallery-card gallery-${i+1}`} key={item.id} onClick={()=>setGalleryOpen(item)} data-reveal><SmartImage src={item.src} alt={item.label}/><span>{item.label} <i>•</i></span></button>)}</div></div></section>

      <section className="section visit" id="visit"><span className="cloud cloud-h"/><span className="cloud cloud-i"/><div className="wrap visit-top"><div className="visit-copy" data-reveal><span className="eyebrow">Ramadan at Stadium Merdeka · 2026 edition</span><h2>Plan your visit.<br/>Enjoy the experience.</h2><p>Everything useful in one place, without making visitors hunt through long text sections.</p><div className="hero-actions"><a className="yellow-btn" href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Open in Maps ↗</a><a className="underlink" href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">View on Instagram</a></div></div><div className="visit-facts" data-reveal><div><span>▦</span><b>Date</b><p>21 Feb — 18 Mar 2026</p></div><div><span>◷</span><b>Hours</b><p>4 PM — 11 PM</p></div><div><span>⌖</span><b>Location</b><p>Stadium Merdeka</p></div><div><span>◈</span><b>Entry</b><p>Free entry</p></div></div></div><div className="wrap guide-grid"><div className="guide-list">{visitorFaq.map(([q,a],i)=> <article className={openGuide===i?'open':''} key={q}><button onClick={()=>setOpenGuide(openGuide===i?-1:i)}><span>{q}</span><i>{openGuide===i?'⌃':'⌄'}</i></button><div className="guide-answer"><p>{a}</p></div></article>)}</div><aside className="find-card" data-reveal><h3>Find us</h3><div className="mini-map"><span>●</span><b>Stadium Merdeka</b></div><b>Stadium Merdeka</b><p>Jalan Stadium, Kuala Lumpur</p><a className="yellow-btn" href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Open in Google Maps ↗</a></aside></div></section>

      <footer><div className="wrap footer-row"><div><img src={LOGO} alt="Bazram Merdeka"/><p>Ramadan at Stadium Merdeka.</p></div><div><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a><span>2026 event archive</span><span>An event by 2Cool Productions.</span></div></div></footer>

      {galleryOpen && <div className="lightbox" onClick={()=>setGalleryOpen(null)}><button className="close-lightbox" onClick={()=>setGalleryOpen(null)}>×</button><div className="lightbox-inner" onClick={e=>e.stopPropagation()}><SmartImage src={galleryOpen.src} alt={galleryOpen.label}/><div><b>{galleryOpen.label}</b><small>Stadium Merdeka · Bazram Merdeka</small></div></div></div>}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)