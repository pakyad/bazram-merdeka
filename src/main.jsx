import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const highlights = [
  { id:'DVSdxs5ko46', kind:'reel', label:'MAKAN', title:'THE FOOD RUN' },
  { id:'DVm_IH5CSr_', kind:'p', label:'AFTER DARK', title:'SATU MALAM DI BAZRAM' },
  { id:'DVnAs5Hjqgr', kind:'p', label:'BERBUKA', title:'THE FIELD FILLS UP' },
  { id:'DVkr2vMiQ_O', kind:'p', label:'VISIT', title:'PLAN YOUR NIGHT' }
]

const foodWords = ['SATAY','MURTABAK','AYAM PERCIK','AIR BALANG','KUIH','NASI','ROTI JOHN']

function InstagramEmbed({ item, className='' }) {
  return <div className={`media-frame ${className}`}>
    <div className="media-meta"><span>{item.label}</span><span>@bazrammerdeka</span></div>
    <iframe title={item.title} src={`https://www.instagram.com/${item.kind}/${item.id}/embed/`} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" frameBorder="0"/>
  </div>
}

function App(){
  const root = useRef(null)

  useEffect(()=>{
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: 1.45, smoothWheel: true, wheelMultiplier: .78 })
    lenis.on('scroll', ScrollTrigger.update)
    let raf
    const loop = t => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    if(!reduce){
      const ctx = gsap.context(()=>{
        gsap.timeline({defaults:{ease:'power2.out'}})
          .from('.hero-kicker',{y:12,opacity:0,duration:.9})
          .from('.hero-line .reveal',{yPercent:105,duration:1.35,stagger:.14},'-=.45')
          .from('.hero-aside',{y:18,opacity:0,duration:1},'-=.55')

        gsap.to('.hero-skyline',{xPercent:-3,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:2.2}})
        gsap.from('.manifesto-line',{y:34,opacity:0,stagger:.16,duration:1.15,ease:'power2.out',scrollTrigger:{trigger:'.manifesto',start:'top 72%'}})
        gsap.from('.spotlight-media',{clipPath:'inset(6% 8% 6% 8%)',scale:.985,ease:'none',scrollTrigger:{trigger:'.spotlight',start:'top 78%',end:'top 28%',scrub:1.8}})

        const rail=document.querySelector('.food-rail-track')
        if(rail) gsap.to(rail,{x:()=>-(rail.scrollWidth-window.innerWidth+80),ease:'none',scrollTrigger:{trigger:'.food-rail',start:'top top',end:()=>`+=${rail.scrollWidth*.82}`,pin:true,scrub:2}})

        gsap.to('.night-sky',{backgroundPosition:'0% 100%',ease:'none',scrollTrigger:{trigger:'.nightfall',start:'top top',end:'bottom bottom',scrub:2.4}})
        gsap.fromTo('.bulb',{opacity:.06},{opacity:.82,stagger:.09,scrollTrigger:{trigger:'.nightfall',start:'42% center',end:'72% center',scrub:2}})
        gsap.utils.toArray('.film-card').forEach(el=>gsap.from(el,{y:38,opacity:0,duration:1.15,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%'}}))
        gsap.from('.map-line',{scaleX:0,transformOrigin:'left center',duration:1.4,ease:'power2.inOut',scrollTrigger:{trigger:'.visit',start:'top 70%'}})
      },root)
      return ()=>{cancelAnimationFrame(raf);ctx.revert();lenis.destroy()}
    }

    return ()=>{cancelAnimationFrame(raf);lenis.destroy()}
  },[])

  return <main ref={root}>
    <nav className="nav">
      <a href="#top" className="brand"><span>BAZRAM</span><small>MERDEKA</small></a>
      <div className="nav-center"><a href="#story">STORY</a><a href="#makan">MAKAN</a><a href="#live">LIVE</a><a href="#visit">VISIT</a></div>
      <a className="nav-cta" href="#visit">STADIUM MERDEKA ↗</a>
    </nav>

    <section className="hero" id="top">
      <div className="grain"/><div className="hero-grid"/>
      <div className="hero-skyline" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
      <div className="hero-wordmark">
        <p className="hero-kicker">RAMADAN / KUALA LUMPUR / STADIUM MERDEKA</p>
        <h1><span className="hero-line"><span className="reveal">BAZRAM</span></span><span className="hero-line accent"><span className="reveal">MERDEKA</span></span></h1>
      </div>
      <div className="hero-aside"><p>21 FEB — 18 MAC 2026</p><p>4 PETANG — 11 MALAM</p><p>FOOD · COMMUNITY · STADIUM MERDEKA</p></div>
      <div className="hero-footer"><span>SCROLL SLOWLY</span><span>KUALA LUMPUR</span></div>
    </section>

    <section className="manifesto" id="story">
      <p className="manifesto-index">01 — THE GATHERING</p>
      <div className="manifesto-copy"><span className="manifesto-line">A NIGHT MARKET.</span><span className="manifesto-line serif">A CITY RITUAL.</span><span className="manifesto-line">A PLACE TO STAY.</span></div>
      <p className="manifesto-note">An evening at Stadium Merdeka shaped by food, families, conversation and the quiet shift from afternoon into night.</p>
    </section>

    <section className="spotlight" id="live">
      <div className="spotlight-copy"><p className="section-index">02 — STORIES FROM MERDEKA</p><h2>THE EVENT,<br/><em>AS IT FELT.</em></h2><p className="section-note">Real Bazram footage stays at the centre. The interface steps back and lets the people, food and atmosphere carry the colour.</p></div>
      <div className="spotlight-media"><InstagramEmbed item={highlights[0]} className="hero-embed"/></div>
    </section>

    <section className="food-rail" id="makan"><div className="food-rail-track">
      <article className="rail-intro"><p>03 — FOOD & MAKERS</p><h2>FOLLOW<br/>THE<br/><span>SMOKE.</span></h2><small>A CURATED WALK THROUGH BAZRAM</small></article>
      {foodWords.map((name,i)=><article className={`food-poster p${i%4}`} key={name}><div className="poster-num">{String(i+1).padStart(2,'0')}</div><div className="poster-shape"><i/><i/><i/></div><h3>{name}</h3><p>{['BARA / PANAS / MALAM','SEJUK / MANIS / RAMAI','KLASIK / CEPAT / PADAT','LAMA / BARU / SAMA-SAMA'][i%4]}</p></article>)}
    </div></section>

    <section className="nightfall"><div className="night-sky"><div className="night-title"><p>04 — FROM SENJA</p><h2>THE CITY<br/><em>SLOWS</em><br/>DOWN.</h2></div><div className="sun-disc"/><div className="stadium-ring"><span>STADIUM MERDEKA</span></div><div className="bulbs">{Array.from({length:18}).map((_,i)=><i className="bulb" key={i}/>)}</div></div></section>

    <section className="film" id="feed"><header className="film-head"><p>05 — THE ARCHIVE</p><h2>STORIES FROM<br/><em>MERDEKA.</em></h2></header><div className="film-strip">{highlights.slice(1).map((item,i)=><article className="film-card" key={item.id}><div className="film-number">0{i+1}</div><InstagramEmbed item={item}/><div className="film-copy"><p>{item.label}</p><h3>{item.title}</h3><a target="_blank" rel="noreferrer" href={`https://www.instagram.com/${item.kind}/${item.id}/`}>OPEN ORIGINAL ↗</a></div></article>)}</div></section>

    <section className="visit" id="visit"><div className="visit-copy"><p>06 — PLAN YOUR EVENING</p><h2>STADIUM<br/>MERDEKA.</h2><div className="map-line"/><p className="visit-meta">KUALA LUMPUR · 4PM–11PM · RAMADAN 2026</p></div><div className="visit-map"><div className="ring r1"/><div className="ring r2"/><div className="field">IFTAR FIELD</div><div className="zone z1"><b>A</b><span>HOT FOOD</span></div><div className="zone z2"><b>B</b><span>DRINKS</span></div><div className="zone z3"><b>C</b><span>PICNIC</span></div><div className="zone z4"><b>D</b><span>FOOD TRUCKS</span></div></div></section>

    <footer><div><p>BAZRAM MERDEKA</p><h2>JUMPA<br/><em>MALAM.</em></h2></div><div className="footer-meta"><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><span>STADIUM MERDEKA · KL</span><span>2026</span></div></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App/>)
