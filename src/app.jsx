import React, { useEffect, useMemo, useRef, useState } from 'react'
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

const experience = [
  { title: 'Arrive', kicker: 'From 4 PM', copy: 'Come in early, find your way around and browse before the busiest hour.', image: IMAGES.stadium },
  { title: 'Makan', kicker: 'Before Maghrib', copy: 'Walk the food lanes, pick up dinner and choose your buka favourites.', image: IMAGES.food },
  { title: 'Iftar', kicker: 'At Maghrib', copy: 'Take your food onto the field and break fast together inside Stadium Merdeka.', image: IMAGES.hero },
  { title: 'After Dark', kicker: 'After iftar', copy: 'Pray, take a second food round and stay for the stadium atmosphere at night.', image: IMAGES.crowd },
]

const foods = [
  { id: 'hot', label: 'Hot Food', title: 'Ramadan favourites', copy: 'Grills, rice dishes, murtabak, roti and the familiar hot-food staples people queue for.', image: IMAGES.food },
  { id: 'sweet', label: 'Sweet', title: 'Something manis', copy: 'Kuih, chilled desserts and sweet bites for after iftar or the walk home.', image: IMAGES.hero },
  { id: 'drinks', label: 'Drinks', title: 'Keep it cold', copy: 'Air balang, juice, iced tea and coffee for the rush before and after Maghrib.', image: IMAGES.crowd },
  { id: 'trucks', label: 'Food Trucks', title: 'The truck lane', copy: 'Street-food formats, quick group orders and late-night second rounds.', image: IMAGES.stadium },
]

const programme = [
  ['4:00 PM', 'Bazaar opens', 'The food lanes open before the crowd builds.'],
  ['6:30 PM', 'Ramadan programme', 'Community activities and selected Ramadan programming lead into iftar.'],
  ['7:30 PM', 'Iftar', 'The field becomes the centre of the evening.'],
  ['8:30 PM', 'Evening activities', 'Food, family time and the night atmosphere continue.'],
]

function Img({ src, alt, className='' }) {
  const [bad, setBad] = useState(false)
  return bad
    ? <div className={`img-fallback ${className}`}><img src={LOGO} alt="Bazram Merdeka"/></div>
    : <img className={className} src={src} alt={alt} onError={() => setBad(true)} loading="lazy" />
}

function useMotion(root) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: reduced ? 0 : 1.02, smoothWheel: !reduced })
    lenis.on('scroll', ScrollTrigger.update)
    let raf
    const loop = t => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    const ctx = gsap.context(() => {
      gsap.set('.progress-line', { scaleX: 0, transformOrigin: 'left center' })
      gsap.to('.progress-line', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } })
      if (reduced) return
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.topbar', { y: -18, opacity: 0, duration: .55 })
        .from('.hero-kicker', { y: 12, opacity: 0, duration: .35 }, '-=.1')
        .from('.hero-title span', { yPercent: 110, stagger: .07, duration: .72 }, '-=.1')
        .from('.hero-copy p, .hero-actions, .scroll-note', { y: 14, opacity: 0, stagger: .07, duration: .42 }, '-=.35')
        .from('.hero-media-card', { x: 28, opacity: 0, scale: .97, duration: .72 }, '-=.52')
      gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
        gsap.from(el, { y: 24 + i % 2 * 4, opacity: 0, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } })
      })
      gsap.utils.toArray('.photo-bg').forEach(el => {
        gsap.to(el, { backgroundPosition: '50% 58%', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.1 } })
      })
      gsap.to('.hero-media-card img', { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 1 } })
    }, root)
    return () => { cancelAnimationFrame(raf); ctx.revert(); lenis.destroy() }
  }, [root])
}

function Topbar({ minimal=false }) {
  return <nav className="topbar">
    <a href="/" className="brand"><img src={LOGO} alt="Bazram Merdeka"/></a>
    {!minimal && <div className="toplinks"><a href="/#experience">Experience</a><a href="/food">Food</a><a href="/programme">Programme</a><a href="/visit">Visit</a></div>}
    <a className="nav-cta" href="/visit">Visitor guide <span>↗</span></a>
    <span className="progress-line"/>
  </nav>
}

function Footer() {
  return <footer className="footer"><div className="wrap footer-row">
    <div><img src={LOGO} alt="Bazram Merdeka"/><p>Ramadan at Stadium Merdeka.</p></div>
    <div className="footer-links"><a href="/food">Food</a><a href="/programme">Programme</a><a href="/visit">Visit</a><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
    <div className="footer-small"><span>An event by 2Cool Productions.</span><a href="/vendors">Interested in becoming a vendor? →</a></div>
  </div></footer>
}

function Home() {
  const root = useRef(null)
  const [step, setStep] = useState(2)
  const [food, setFood] = useState('hot')
  const activeFood = useMemo(() => foods.find(x => x.id === food), [food])
  useMotion(root)
  const chooseStep = (i) => {
    if (i === step) return
    setStep(i)
    gsap.fromTo('.experience-media img', { opacity: .35, scale: 1.025 }, { opacity: 1, scale: 1, duration: .48, ease: 'power3.out' })
    gsap.fromTo('.experience-copy > *', { y: 7, opacity: 0 }, { y: 0, opacity: 1, stagger: .04, duration: .32, ease: 'power2.out' })
  }
  const chooseFood = id => {
    if (id === food) return
    setFood(id)
    gsap.fromTo('.food-preview-media img', { opacity: .4, scale: 1.02 }, { opacity: 1, scale: 1, duration: .44, ease: 'power3.out' })
    gsap.fromTo('.food-preview-copy > *', { y: 7, opacity: 0 }, { y: 0, opacity: 1, stagger: .04, duration: .3 })
  }
  return <main ref={root}>
    <Topbar/>
    <header className="home-hero">
      <span className="cloud cloud-a"/><span className="cloud cloud-b"/>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow hero-kicker">Ramadan at Stadium Merdeka · 2026 edition</span>
          <h1 className="hero-title"><i><span>Where food,</span></i><i><span>faith &amp; heritage</span></i><i className="accent"><span>come together.</span></i></h1>
          <p>Food around the stadium. Iftar on the field. A Ramadan night framed by one of Kuala Lumpur’s most historic places.</p>
          <div className="hero-actions"><a className="btn yellow" href="/visit">Plan your visit ↗</a><a className="text-link" href="#moment">Watch highlights →</a></div>
          <a className="scroll-note" href="#identity"><span/>SCROLL TO EXPLORE</a>
        </div>
        <div className="hero-media-wrap"><span className="sun"/><div className="hero-media-card"><Img src={IMAGES.hero} alt="Communal iftar at Stadium Merdeka"/><div className="media-caption"><div><b>Iftar at Stadium Merdeka</b><small>Bazram Merdeka</small></div><span>01 / 04</span></div></div></div>
      </div>
    </header>

    <section id="identity" className="photo-bg identity" style={{backgroundImage:`linear-gradient(rgba(15,18,21,.62),rgba(15,18,21,.62)),url(${IMAGES.crowd})`}}>
      <div className="wrap identity-inner" data-reveal><span className="eyebrow light">Bazram Merdeka</span><h2>A Ramadan bazaar inside one of Malaysia’s most historic stadiums.</h2><div className="identity-facts"><div><b>118+</b><span>vendors</span><p>Food, drinks and food trucks.</p></div><div><b>Iftar</b><span>on the field</span><p>Break fast together inside the stadium.</p></div><div><b>1957</b><span>heritage venue</span><p>Stadium Merdeka, in the heart of Kuala Lumpur.</p></div></div></div>
    </section>

    <section id="experience" className="section clean"><div className="wrap">
      <div className="section-head" data-reveal><span className="eyebrow">The experience</span><h2>How the evening unfolds.</h2><p>One simple rhythm. Four moments.</p></div>
      <div className="experience-layout">
        <div className="experience-tabs">{experience.map((x,i)=><button key={x.title} className={i===step?'active':''} onClick={()=>chooseStep(i)}><span>0{i+1}</span><b>{x.title}</b><small>{x.kicker}</small></button>)}</div>
        <div className="experience-media" data-reveal><Img src={experience[step].image} alt={experience[step].title}/><div className="experience-copy"><span>{experience[step].kicker}</span><h3>{experience[step].title}</h3><p>{experience[step].copy}</p></div></div>
      </div>
    </div></section>

    <section className="section sky"><div className="wrap food-preview-grid">
      <div className="food-preview-copy" data-reveal><span className="eyebrow">Food preview</span><h2>What’s for buka?</h2><p>{activeFood.copy}</p><div className="food-pills">{foods.map(x=><button key={x.id} className={food===x.id?'active':''} onClick={()=>chooseFood(x.id)}>{x.label}</button>)}</div><a className="text-link" href="/food">Explore food →</a></div>
      <div className="food-preview-media" data-reveal><Img src={activeFood.image} alt={activeFood.title}/><div><span>{activeFood.label}</span><h3>{activeFood.title}</h3></div></div>
    </div></section>

    <section id="moment" className="photo-bg moment" style={{backgroundImage:`linear-gradient(rgba(11,13,16,.54),rgba(11,13,16,.68)),url(${IMAGES.hero})`}}><div className="wrap moment-copy" data-reveal><span className="moment-time">7:30 PM</span><h2>The food stops moving for a moment.</h2><p>Visitors gather inside Stadium Merdeka to break fast together.</p><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">See the photo story ↗</a></div></section>

    <section className="section programme-preview"><div className="wrap programme-preview-grid"><div className="section-head" data-reveal><span className="eyebrow">Programme preview</span><h2>Tonight at Bazram.</h2><p>A simple view of the evening, without turning the homepage into a schedule board.</p><a className="text-link" href="/programme">View full programme →</a></div><div className="programme-list" data-reveal>{programme.map(([t,n])=><div key={t}><time>{t}</time><b>{n}</b></div>)}</div></div></section>

    <section className="section visit-preview"><div className="wrap"><div className="section-head" data-reveal><span className="eyebrow">Visit</span><h2>Everything essential.</h2></div><div className="visit-facts" data-reveal>{[['Where','Stadium Merdeka'],['When','21 Feb — 18 Mar 2026'],['Time','4 PM — 11 PM'],['Entry','Free']].map(([a,b])=><div key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="visit-actions"><a className="btn red" href="/visit">Open visitor guide ↗</a><a className="text-link" href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Get directions →</a></div><p className="rail-note">Maharajalela Monorail · Merdeka MRT</p></div></section>
    <Footer/>
  </main>
}

function PageShell({ eyebrow, title, intro, image, children }) {
  const root = useRef(null); useMotion(root)
  return <main ref={root}><Topbar/><header className="sub-hero"><div className="wrap sub-hero-grid"><div><span className="eyebrow hero-kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div><div className="sub-photo"><Img src={image} alt={title}/></div></div></header>{children}<Footer/></main>
}

function FoodPage(){const [id,setId]=useState('hot'); const x=foods.find(y=>y.id===id); return <PageShell eyebrow="Food at Bazram" title="Find your buka." intro="A simple guide to the food side of Bazram Merdeka." image={IMAGES.food}><section className="section clean"><div className="wrap detail-grid"><aside className="detail-tabs">{foods.map(f=><button className={f.id===id?'active':''} onClick={()=>setId(f.id)} key={f.id}>{f.label}</button>)}</aside><div className="detail-feature"><Img src={x.image} alt={x.title}/><div><span>{x.label}</span><h2>{x.title}</h2><p>{x.copy}</p></div></div></div></section></PageShell>}
function ProgrammePage(){return <PageShell eyebrow="Programme" title="Plan the night." intro="The core rhythm of the 2026 Bazram Merdeka evening." image={IMAGES.crowd}><section className="section clean"><div className="wrap full-programme">{programme.map(([t,n,c],i)=><article key={t} data-reveal><span>0{i+1}</span><time>{t}</time><div><h3>{n}</h3><p>{c}</p></div></article>)}</div></section></PageShell>}
function VisitPage(){return <PageShell eyebrow="Visitor guide" title="Plan your visit." intro="Everything practical in one place." image={IMAGES.stadium}><section className="section clean"><div className="wrap visit-detail"><div className="visit-facts">{[['Date','21 Feb — 18 Mar 2026'],['Hours','4 PM — 11 PM'],['Location','Stadium Merdeka'],['Entry','Free']].map(([a,b])=><div key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="visit-detail-grid"><article><h3>Getting here</h3><p>Maharajalela Monorail and Merdeka MRT are the most useful rail approaches to the precinct.</p></article><article><h3>Prayer</h3><p>Prayer access forms part of the evening flow. Arrive with enough time before Maghrib.</p></article><article><h3>Families</h3><p>The field and stands work well for groups and families. Children should remain supervised.</p></article><article><h3>House rules</h3><p>No smoking or vaping, no pets, no littering and no flammable materials. Respect stadium restrictions.</p></article></div><div className="visit-actions"><a className="btn yellow" href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Open in Maps ↗</a><a className="text-link" href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a></div></div></section></PageShell>}
function VendorsPage(){return <PageShell eyebrow="Vendor enquiry · 2026 edition" title="Book a tapak at Bazram Merdeka." intro="Seller information lives here, away from the visitor homepage." image={IMAGES.food}><section className="section vendor-page"><div className="wrap vendor-grid"><div data-reveal><span className="eyebrow">2026 seller call</span><h2>From RM1,000 for the 26-day run.</h2><p>Seller categories included Makanan, Minuman, Food Truck, Bahan Kering and selected Non-F&amp;B concepts.</p><div className="vendor-chips"><span>Makanan</span><span>Minuman</span><span>Food Truck</span><span>Bahan Kering / Non-F&amp;B</span></div></div><aside className="vendor-card" data-reveal><small>BOOK A TAPAK</small><strong>RM1,000+</strong><span>21 Feb — 18 Mar · 4 PM — 11 PM</span><hr/><p>Final placement, approval, requirements and availability are handled by the organiser.</p><a className="btn red" href={WHATSAPP} target="_blank" rel="noreferrer">Enquire on WhatsApp ↗</a></aside></div></section></PageShell>}
function NotFound(){return <main><Topbar minimal/><section className="not-found"><img src={LOGO} alt="Bazram Merdeka"/><h1>Page not found.</h1><a className="btn yellow" href="/">Back home</a></section></main>}

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = path==='/'?Home:path==='/food'?FoodPage:path==='/programme'?ProgrammePage:path==='/visit'?VisitPage:path==='/vendors'?VendorsPage:NotFound
createRoot(document.getElementById('root')).render(<Page/>)