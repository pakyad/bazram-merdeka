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

const foodWords = ['SATAY','MURTABAK','AYAM PERCIK','AIR BALANG','KUIH','NASI','ROTI JOHN','ABC','KERABU']

function InstagramEmbed({ item, className='' }) {
  return <div className={`media-frame ${className}`}>
    <div className="media-meta"><span>{item.label}</span><span>@bazrammerdeka</span></div>
    <iframe
      title={item.title}
      src={`https://www.instagram.com/${item.kind}/${item.id}/embed/`}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      frameBorder="0"
    />
  </div>
}

function App(){
  const root = useRef(null)

  useEffect(()=>{
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    let raf
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    const ctx = gsap.context(()=>{
      gsap.timeline({ defaults:{ ease:'power3.out' } })
        .from('.hero-kicker',{ y:18, opacity:0, duration:.6 })
        .from('.hero-line .reveal',{ yPercent:120, duration:1.1, stagger:.08 },'-=.3')
        .from('.hero-aside > *',{ y:20, opacity:0, duration:.7, stagger:.08 },'-=.5')
        .from('.hero-stamp',{ scale:.72, opacity:0, rotate:-18, duration:.9 },'-=.8')

      gsap.to('.hero-wordmark',{ yPercent:16, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1 }})
      gsap.to('.hero-stamp',{ rotate:28, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1 }})
      gsap.to('.hero-skyline',{ xPercent:-8, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1.2 }})

      gsap.from('.manifesto-line',{ y:70, opacity:0, stagger:.08, duration:.9, scrollTrigger:{ trigger:'.manifesto', start:'top 70%' }})

      gsap.to('.spotlight-copy',{ yPercent:-18, ease:'none', scrollTrigger:{ trigger:'.spotlight', start:'top bottom', end:'bottom top', scrub:1 }})
      gsap.from('.spotlight-media',{ clipPath:'inset(12% 18% 12% 18%)', scale:.93, ease:'power2.out', scrollTrigger:{ trigger:'.spotlight', start:'top 76%', end:'top 28%', scrub:1 }})

      const rail = document.querySelector('.food-rail-track')
      if(rail){
        gsap.to(rail,{ x:()=>-(rail.scrollWidth - window.innerWidth + 120), ease:'none', scrollTrigger:{ trigger:'.food-rail', start:'top top', end:()=>`+=${rail.scrollWidth*.72}`, pin:true, scrub:1 }})
      }

      gsap.to('.night-sky',{ backgroundPosition:'0% 100%', ease:'none', scrollTrigger:{ trigger:'.nightfall', start:'top top', end:'bottom bottom', scrub:1 }})
      gsap.fromTo('.bulb',{ opacity:.08, scale:.6 },{ opacity:1, scale:1, stagger:.05, scrollTrigger:{ trigger:'.nightfall', start:'36% center', end:'68% center', scrub:1 }})
      gsap.to('.night-title',{ yPercent:-22, ease:'none', scrollTrigger:{ trigger:'.nightfall', start:'top top', end:'bottom bottom', scrub:1 }})

      gsap.utils.toArray('.film-card').forEach((el,i)=>{
        gsap.from(el,{ y:80 + i*18, rotate:i%2?2:-2, opacity:0, duration:.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%' }})
      })

      gsap.from('.map-line',{ scaleX:0, transformOrigin:'left center', duration:1.2, ease:'power3.inOut', scrollTrigger:{ trigger:'.visit', start:'top 70%' }})
      gsap.from('.zone',{ y:30, opacity:0, stagger:.08, scrollTrigger:{ trigger:'.visit-map', start:'top 70%' }})
    },root)

    return ()=>{ cancelAnimationFrame(raf); ctx.revert(); lenis.destroy() }
  },[])

  return <main ref={root}>
    <nav className="nav">
      <a href="#top" className="brand"><span>BAZRAM</span><small>MERDEKA</small></a>
      <div className="nav-center"><a href="#story">STORY</a><a href="#makan">MAKAN</a><a href="#live">LIVE</a><a href="#visit">VISIT</a></div>
      <a className="nav-cta" href="#visit">STADIUM MERDEKA ↗</a>
    </nav>

    <section className="hero" id="top">
      <div className="grain" />
      <div className="hero-grid" />
      <div className="hero-skyline" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
      <div className="hero-wordmark">
        <p className="hero-kicker">RAMADAN / KUALA LUMPUR / STADIUM MERDEKA</p>
        <h1>
          <span className="hero-line"><span className="reveal">BAZRAM</span></span>
          <span className="hero-line accent"><span className="reveal">MERDEKA</span></span>
        </h1>
      </div>
      <div className="hero-aside">
        <p>21 FEB — 18 MAC 2026</p>
        <p>4 PETANG — 11 MALAM</p>
        <p>100+ VENDOR / PICNIC IFTAR / KL AFTER DARK</p>
      </div>
      <div className="hero-stamp"><span>BAZRAM</span><b>KL</b><span>2026</span></div>
      <div className="hero-footer"><span>SCROLL TO ENTER</span><span>03.1390° N / 101.7006° E</span></div>
    </section>

    <section className="manifesto" id="story">
      <p className="manifesto-index">01 — BUKAN SEKADAR BAZAAR</p>
      <div className="manifesto-copy">
        <span className="manifesto-line">A NIGHT MARKET.</span>
        <span className="manifesto-line serif">A CITY RITUAL.</span>
        <span className="manifesto-line">A FIELD FULL OF PEOPLE.</span>
      </div>
      <p className="manifesto-note">Old Stadium Merdeka. New KL energy. Food smoke, paper cups, families on the field, lights coming on one row at a time.</p>
    </section>

    <section className="spotlight" id="live">
      <div className="spotlight-copy">
        <p className="section-index">02 — FROM THE FEED</p>
        <h2>DON'T SHOW<br/>THE EVENT.<br/><em>DROP ME IN.</em></h2>
        <p className="section-note">Real Bazram footage becomes the artwork. No fake stock cards. No generic festival UI.</p>
      </div>
      <div className="spotlight-media"><InstagramEmbed item={highlights[0]} className="hero-embed"/></div>
      <div className="spotlight-caption">THE FOOD RUN / @BAZRAMMERDEKA / 2026</div>
    </section>

    <section className="food-rail" id="makan">
      <div className="food-rail-track">
        <article className="rail-intro"><p>03 — NAK MAKAN APA?</p><h2>FOLLOW<br/>THE<br/><span>SMOKE.</span></h2><small>DRAG YOUR EYES. KEEP SCROLLING.</small></article>
        {foodWords.map((name,i)=><article className={`food-poster p${i%4}`} key={name}>
          <div className="poster-num">{String(i+1).padStart(2,'0')}</div>
          <div className="poster-shape"><i/><i/><i/></div>
          <h3>{name}</h3>
          <p>{['BARA / PANAS / MALAM','SEJUK / MANIS / RAMAI','KLASIK / CEPAT / PADAT','LAMA / BARU / SAMA-SAMA'][i%4]}</p>
        </article>)}
      </div>
    </section>

    <section className="nightfall">
      <div className="night-sky">
        <div className="night-title"><p>04 — WAKTU BERUBAH</p><h2>SENJA<br/><em>JADI</em><br/>MALAM.</h2></div>
        <div className="sun-disc"/>
        <div className="stadium-ring"><span>STADIUM MERDEKA</span></div>
        <div className="bulbs">{Array.from({length:24}).map((_,i)=><i className="bulb" key={i}/>)}</div>
      </div>
    </section>

    <section className="film" id="feed">
      <header className="film-head"><p>05 — REAL MOMENTS</p><h2>THE FEED,<br/><em>RE-CUT.</em></h2></header>
      <div className="film-strip">
        {highlights.slice(1).map((item,i)=><article className="film-card" key={item.id}>
          <div className="film-number">0{i+1}</div>
          <InstagramEmbed item={item}/>
          <div className="film-copy"><p>{item.label}</p><h3>{item.title}</h3><a target="_blank" rel="noreferrer" href={`https://www.instagram.com/${item.kind}/${item.id}/`}>OPEN ORIGINAL ↗</a></div>
        </article>)}
      </div>
    </section>

    <section className="visit" id="visit">
      <div className="visit-copy"><p>06 — FIND YOUR WAY IN</p><h2>STADIUM<br/>MERDEKA.</h2><div className="map-line"/><p className="visit-meta">KUALA LUMPUR · 4PM–11PM · RAMADAN 2026</p></div>
      <div className="visit-map">
        <div className="ring r1"/><div className="ring r2"/><div className="field">IFtar field</div>
        <div className="zone z1"><b>A</b><span>HOT FOOD</span></div>
        <div className="zone z2"><b>B</b><span>DRINKS</span></div>
        <div className="zone z3"><b>C</b><span>PICNIC</span></div>
        <div className="zone z4"><b>D</b><span>FOOD TRUCKS</span></div>
      </div>
    </section>

    <footer>
      <div><p>BAZRAM MERDEKA</p><h2>JUMPA<br/><em>MALAM.</em></h2></div>
      <div className="footer-meta"><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><span>STADIUM MERDEKA · KL</span><span>2026</span></div>
    </footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
