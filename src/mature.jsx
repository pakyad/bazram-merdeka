import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './mature.css'

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
  { title:'Arrive', time:'From 4 PM', headline:'Come before the rush.', copy:'Give yourself time to enter, look around and settle in before the busiest part of the evening.', image:IMAGES.stadium },
  { title:'Find your food', time:'Before Maghrib', headline:'Find your meal.', copy:'Browse the food lanes, drinks and food trucks, then choose what you want to bring onto the field.', image:IMAGES.food },
  { title:'Iftar', time:'At Maghrib', headline:'Break fast together.', copy:'Find a place on the field and share the moment with everyone gathered inside Stadium Merdeka.', image:IMAGES.hero },
  { title:'After dark', time:'After iftar', headline:'Stay for the night.', copy:'Prayer, dessert, another food round and the night atmosphere continue around the stadium.', image:IMAGES.crowd },
]

const programme = [
  ['4:00 PM','Bazaar opens','Food lanes open and visitors begin arriving.'],
  ['Before Maghrib','Browse & settle in','Find your meal and choose a place for iftar.'],
  ['Maghrib','Communal iftar','The stadium field becomes the centre of the evening.'],
  ['After iftar','Prayer & evening activities','Stay for prayer, food and the atmosphere after dark.'],
]

const foods = [
  ['Hot food','Grills, rice dishes and familiar Ramadan favourites.',IMAGES.food],
  ['Sweet','Kuih, chilled desserts and something sweet after Maghrib.',IMAGES.hero],
  ['Drinks','Cold drinks, juice, tea and coffee for the evening.',IMAGES.crowd],
  ['Food trucks','Street-food formats and easy second-round options.',IMAGES.stadium],
]

function Img({src,alt,className=''}){
  const [bad,setBad]=useState(false)
  if(bad) return <div className={`img-fallback ${className}`}><img src={LOGO} alt="Bazram Merdeka"/></div>
  return <img className={className} src={src} alt={alt} onError={()=>setBad(true)} loading="lazy"/>
}

let lenisInstance=null

function useMotion(root, home=false){
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis=new Lenis({duration:reduced?0:1.0,smoothWheel:!reduced})
    lenisInstance=lenis
    lenis.on('scroll',ScrollTrigger.update)
    let raf
    const loop=t=>{lenis.raf(t);raf=requestAnimationFrame(loop)}
    raf=requestAnimationFrame(loop)
    const onAnchorClick=e=>{
      const a=e.target.closest('a[href^="#"],a[href^="/#"]')
      if(!a) return
      const href=a.getAttribute('href')
      const hash=href.startsWith('/#')?href.slice(1):href
      if(href.startsWith('/#')&&window.location.pathname!=='/') return
      const el=document.querySelector(hash)
      if(!el) return
      e.preventDefault()
      lenis.scrollTo(el,{offset:-96})
    }
    document.addEventListener('click',onAnchorClick)
    const ctx=gsap.context(()=>{
      gsap.set('.progress',{scaleX:0,transformOrigin:'left center'})
      gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.2}})
      if(home){
        ScrollTrigger.create({trigger:'.hero',start:'bottom 88px',onEnter:()=>document.body.classList.add('nav-light'),onLeaveBack:()=>document.body.classList.remove('nav-light')})
      }
      if(reduced) return
      if(home){
        gsap.timeline({defaults:{ease:'power3.out'}})
          .from('.nav-inner>*',{y:-12,opacity:0,stagger:.04,duration:.4})
          .from('.hero h1 span',{yPercent:110,stagger:.08,duration:.72},'-=.08')
          .from('.hero-lead,.hero-meta,.hero-actions',{y:15,opacity:0,stagger:.07,duration:.42},'-=.32')
          .from('.hero-photo',{x:28,opacity:0,scale:.98,duration:.7},'-=.5')
      } else if(document.querySelector('.subhero')){
        gsap.timeline({defaults:{ease:'power3.out'}})
          .from('.nav-inner>*',{y:-12,opacity:0,stagger:.04,duration:.4})
          .from('.subhero h1, .subhero p, .subhero-photo',{y:18,opacity:0,stagger:.07,duration:.55},'-=.1')
      } else {
        gsap.from('.nav-inner>*',{y:-12,opacity:0,stagger:.04,duration:.4,ease:'power3.out'})
      }
      gsap.utils.toArray('[data-reveal]').forEach(el=>gsap.from(el,{y:24,opacity:0,duration:.65,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%'}}))
      gsap.utils.toArray('.cinematic').forEach(el=>gsap.to(el,{backgroundPosition:'50% 58%',ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}))
      if(home){
        gsap.to('.hero-photo img',{yPercent:4,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.8}})
        gsap.to('.sky-orb',{y:'48vh',x:'-10vw',scale:.7,backgroundColor:'#f0b24b',ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'65% bottom',scrub:1.2}})
        gsap.to('.night-wash',{opacity:.22,ease:'none',scrollTrigger:{trigger:root.current,start:'25% top',end:'70% bottom',scrub:1.2}})
      }
    },root)
    return()=>{cancelAnimationFrame(raf);ctx.revert();lenis.destroy();document.removeEventListener('click',onAnchorClick);lenisInstance=null;document.body.classList.remove('nav-light')}
  },[root,home])
}

const NAV_LINKS=[['/#experience','Experience'],['/iftar','Iftar Hour'],['/food','Food'],['/programme','Programme'],['/visit','Visit']]

function Nav({home=false}){
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    document.body.style.overflow=open?'hidden':''
    if(lenisInstance){open?lenisInstance.stop():lenisInstance.start()}
    return()=>{document.body.style.overflow=''}
  },[open])
  return <nav className={`nav ${home?'nav-home':''}`}>
    <div className="nav-inner">
      <a className="brand" href="/"><img src={LOGO} alt="Bazram Merdeka"/></a>
      <div className="nav-links">{NAV_LINKS.map(([href,label])=><a href={href} key={href}>{label}</a>)}</div>
      <div className="nav-right">
        <a className="nav-cta" href="/visit">Visitor guide ↗</a>
        <button className="nav-burger" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
          <svg className="icon-open" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3 5.5h14M3 10h14M3 14.5h14"/></svg>
          <svg className="icon-close" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>
        </button>
      </div>
    </div>
    <div className={`mobile-menu ${open?'open':''}`}>
      {NAV_LINKS.map(([href,label])=><a href={href} key={href} onClick={()=>setOpen(false)}>{label}</a>)}
      <a href="/vendors" onClick={()=>setOpen(false)}>Vendors ↗</a>
    </div>
    <span className="progress"/>
  </nav>
}

function Footer(){return <footer className="footer"><div className="shell footer-main"><img src={LOGO} alt="Bazram Merdeka"/><div><b>Stadium Merdeka, Kuala Lumpur</b><span>21 Feb–18 Mar 2026 · 4 PM–11 PM · Free entry</span></div><div className="footer-nav"><a href="/iftar">The Iftar Hour</a><a href="/food">Food</a><a href="/programme">Programme</a><a href="/visit">Visit</a><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a></div></div><div className="shell footer-bottom"><span>An event by 2Cool Productions</span><a href="/vendors">Vendor enquiries →</a></div></footer>}

const STARS=Array.from({length:56},(_,i)=>({left:(i*61.8)%100,top:(i*37.3)%62,s:i%4===0?3:i%2===0?2:1.5,o:.35+((i*29)%50)/100}))

function useMaghrib(){
  const [s,setS]=useState(null)
  useEffect(()=>{
    let alive=true,iv=null
    const ctrl=new AbortController()
    const to=setTimeout(()=>ctrl.abort(),8000)
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Kuala%20Lumpur&country=Malaysia&method=17',{signal:ctrl.signal})
      .then(r=>r.json())
      .then(j=>{
        if(!alive)return
        clearTimeout(to)
        const m=j&&j.data&&j.data.timings&&j.data.timings.Maghrib
        if(!m||!/^\d{1,2}:\d{2}/.test(m))return
        const parts=m.split(':')
        const target=new Date()
        target.setHours(+parts[0],+parts[1],0,0)
        const pad=n=>String(n).padStart(2,'0')
        const tick=()=>{
          const d=target-Date.now()
          if(d<=0){setS({label:parts.join(':'),sub:'Maghrib today · Kuala Lumpur'});clearInterval(iv);return}
          setS({label:`${pad(Math.floor(d/36e5))}:${pad(Math.floor(d%36e5/6e4))}:${pad(Math.floor(d%6e4/1e3))}`,sub:'until Maghrib · Kuala Lumpur'})
        }
        tick()
        iv=setInterval(tick,1000)
      })
      .catch(()=>{})
    return()=>{alive=false;clearTimeout(to);if(iv)clearInterval(iv)}
  },[])
  return s
}

function useIftarMotion(root){
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stage=root.current.querySelector('.sky-stage')
    const orb=root.current.querySelector('.sky-body')
    const setX=gsap.quickSetter(orb,'x','px')
    const setY=gsap.quickSetter(orb,'y','px')
    const bez=(a,c1,c2,b,t)=>{const u=1-t;return u*u*u*a+3*u*u*t*c1+3*u*t*t*c2+t*t*t*b}
    const orbPos=p=>{
      if(p<.45){const t=p/.45;return[bez(5,18,52,72,t),bez(90,10,-6,80,t)]}
      if(p<.6){const t=(p-.45)/.15;return[bez(72,74,82,78,t),bez(80,92,102,104,t)]}
      const t=(p-.6)/.4;return[bez(78,62,30,46,t),bez(104,64,32,10,t)]
    }
    let st=null,ctx=null
    const apply=p=>{const[x,y]=orbPos(p);setX(x/100*stage.clientWidth);setY(y/100*stage.clientHeight)}
    apply(0)
    const onResize=()=>apply(st?st.progress:0)
    window.addEventListener('resize',onResize)
    if(!reduced){
      ctx=gsap.context(()=>{
        const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:root.current,start:'top top',end:'bottom bottom',scrub:1,onUpdate:self=>apply(self.progress)}})
        st=tl.scrollTrigger
        tl.to('.s-sunset',{opacity:1,duration:1},0)
          .to('.s-maghrib',{opacity:1,duration:1},1)
          .to('.s-dusk',{opacity:1,duration:1},2)
          .to('.s-night',{opacity:1,duration:1},3)
          .to('.sky-line',{opacity:1,duration:2.4},.7)
          .to('.sky-stars',{opacity:1,duration:1.5},2.4)
          .to('.sun-glow',{opacity:0,duration:.3},1.8)
          .to('.orb-sun',{opacity:0,duration:.3},1.8)
          .to('.moon-glow',{opacity:1,duration:.4},2.2)
          .to('.orb-moon',{opacity:1,duration:.4},2.2)
        ScrollTrigger.create({trigger:'.st-maghrib',start:'top top',end:'+=120%',pin:true,anticipatePin:1})
      },root)
    }
    return()=>{window.removeEventListener('resize',onResize);if(ctx)ctx.revert()}
  },[root])
}

function IftarStory(){
  const root=useRef(null)
  const maghrib=useMaghrib()
  useMotion(root,false)
  useIftarMotion(root)
  return <main ref={root} className="story">
    <Nav/>
    <div className="sky-stage" aria-hidden="true">
      <div className="sky-sheet s-golden"/>
      <div className="sky-sheet s-sunset"/>
      <div className="sky-sheet s-maghrib"/>
      <div className="sky-sheet s-dusk"/>
      <div className="sky-sheet s-night"/>
      <div className="sky-stars">{STARS.map((st,i)=><i key={i} style={{left:st.left+'%',top:st.top+'%',width:st.s,height:st.s,opacity:st.o}}/>)}</div>
      <div className="sky-body">
        <span className="sun-glow"/>
        <span className="orb-sun"/>
        <span className="moon-glow"/>
        <svg className="orb-moon" viewBox="0 0 48 48" aria-hidden="true">
          <defs><mask id="mooncut"><rect width="48" height="48" fill="#fff"/><circle cx="31" cy="19" r="15" fill="#000"/></mask></defs>
          <circle cx="24" cy="24" r="15" fill="#f2ead8" mask="url(#mooncut)"/>
          <path d="M36 28l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8z" fill="#f2ead8"/>
        </svg>
      </div>
      <svg className="sky-line" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <rect x="180" y="6" width="6" height="62" fill="#141a1f"/>
        <rect x="1254" y="6" width="6" height="62" fill="#141a1f"/>
        <path d="M0 160L0 98Q360 42 720 42Q1080 42 1440 98L1440 160Z" fill="#141a1f"/>
      </svg>
    </div>
    <div className="story-content">
      <header className="story-sec st-hero">
        <div className="story-narrow story-inner">
          <span className="story-kicker">A Bazram Merdeka story</span>
          <h1>The Iftar Hour.</h1>
          <p>How one evening at Stadium Merdeka slows down, glows, and stops together at Maghrib.</p>
          <div className="story-meta"><span>21 Feb–18 Mar</span><span>4 PM–11 PM</span><span>Free entry</span></div>
          <a className="scroll-cue" href="#st-wait">Scroll — the sky keeps time ↓</a>
        </div>
      </header>
      <section id="st-wait" className="story-sec st-wait">
        <div className="story-narrow"><div className="story-card" data-reveal>
          <span className="story-kicker">The wait</span>
          <h2>Come early. Take your time.</h2>
          <p>Walk the food lanes, pick your drinks, find a spot on the field. The bazaar is at its best before the rush, and the sky will tell you how long you have.</p>
          <div className="count-chip"><b>{maghrib?maghrib.label:'Maghrib'}</b><span>{maghrib?maghrib.sub:'this evening · Kuala Lumpur'}</span></div>
        </div></div>
      </section>
      <section className="story-sec st-maghrib">
        <div className="story-narrow story-inner" data-reveal>
          <span className="story-kicker">At Maghrib</span>
          <h2 className="peak-line">The whole stadium pauses together.</h2>
          <p>Thousands settle onto the field with their food, and for one moment everything in Kuala Lumpur goes quiet at the same time.</p>
        </div>
      </section>
      <section className="story-sec st-dusk">
        <div className="story-narrow"><div className="story-card" data-reveal>
          <span className="story-kicker">After iftar</span>
          <h2>The night opens up.</h2>
          <div className="story-schedule">{programme.map(([time,title,copy])=><div className="schedule-row" key={time}><time>{time}</time><div><b>{title}</b><p>{copy}</p></div></div>)}</div>
          <a className="text-link" href="/programme">Full programme ↗</a>
        </div></div>
      </section>
      <section className="story-sec st-night">
        <div className="story-narrow"><div className="story-card" data-reveal>
          <span className="story-kicker">Stay for the night</span>
          <h2>Under a risen moon.</h2>
          <p>Prayer, dessert, a second round through the bazaar. The evening carries on around the stadium until 11 PM.</p>
          <div className="story-actions"><a className="button primary" href="/visit">Plan your visit ↗</a><a className="button secondary" href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Directions ↗</a></div>
        </div></div>
      </section>
      <Footer/>
    </div>
  </main>
}

function Home(){
  const root=useRef(null)
  const [active,setActive]=useState(0)
  useMotion(root,true)
  const select=i=>{
    if(i===active)return
    setActive(i)
    gsap.fromTo('.experience-image img',{opacity:.25,scale:1.025},{opacity:1,scale:1,duration:.5,ease:'power3.out'})
    gsap.fromTo('.experience-copy>*',{y:8,opacity:0},{y:0,opacity:1,stagger:.04,duration:.3,ease:'power2.out'})
  }
  return <main ref={root} className="home">
    <div className="sky-orb"/><div className="night-wash"/>
    <div className="hero-wrap"><Nav home/><header className="hero"><div className="shell hero-grid">
      <div className="hero-copy"><h1><span>Where food, faith &amp;</span><span>heritage come together.</span></h1><p className="hero-lead">Come hungry, bring your people, and break fast together inside Stadium Merdeka.</p><div className="hero-meta"><span>Stadium Merdeka</span><span>21 Feb–18 Mar</span><span>4 PM–11 PM</span><span>Free entry</span></div><div className="hero-actions"><a className="button primary" href="/visit">Plan your evening ↗</a><a className="button secondary" href="#iftar">See the atmosphere ↓</a></div></div>
      <figure className="hero-photo"><Img src={IMAGES.hero} alt="Iftar at Stadium Merdeka"/><figcaption>Iftar at Stadium Merdeka</figcaption></figure>
    </div></header></div>

    <section className="welcome cinematic" style={{backgroundImage:`linear-gradient(90deg,rgba(14,18,21,.88),rgba(14,18,21,.45)),url(${IMAGES.crowd})`}}><div className="shell welcome-inner" data-reveal><div><h2>This is your Ramadan evening.</h2><p>Arrive before Maghrib. Find your food. Claim your place. Break fast together. Stay a little longer.</p></div><div className="welcome-links"><a href="/food">Find something to eat ↗</a><a href="#experience">See how the evening unfolds ↓</a></div></div></section>

    <section id="experience" className="experience"><div className="shell" data-reveal><header className="section-title"><h2>Before Maghrib, take your time.</h2><p>Choose a moment below to see what the evening feels like.</p></header><div className="experience-tabs" role="tablist">{journey.map((item,i)=><button role="tab" aria-selected={i===active} className={i===active?'active':''} onClick={()=>select(i)} key={item.title}>{item.title}</button>)}</div><div className="experience-feature"><div className="experience-image"><Img src={journey[active].image} alt={journey[active].title}/></div><div className="experience-copy"><span>{journey[active].time}</span><h3>{journey[active].headline}</h3><p>{journey[active].copy}</p>{active===1&&<a href="/food">Explore food ↗</a>}{active===3&&<a href="/programme">See what’s on ↗</a>}</div></div></div></section>

    <section id="iftar" className="iftar cinematic" style={{backgroundImage:`url(${IMAGES.hero})`}}><div className="iftar-overlay"/><div className="shell iftar-text" data-reveal><span>At Maghrib</span><h2>The whole stadium pauses together.</h2><p>Visitors gather on the field, settle in with their food and wait for the same moment.</p><a className="text-link light" href="/iftar">Experience the iftar hour ↓</a></div></section>

    <section className="after"><div className="shell after-layout" data-reveal><div className="after-photo"><Img src={IMAGES.crowd} alt="Bazram Merdeka after dark"/></div><div className="after-copy"><h2>Stay after iftar.</h2><p>The evening carries on naturally. Pray, grab dessert, walk the bazaar again or see what is happening around the stadium.</p><div className="after-links"><a href="/visit#prayer">Prayer information ↗</a><a href="/food">Dessert & drinks ↗</a><a href="/programme">Evening programme ↗</a></div></div></div></section>

    <section className="programme-home"><div className="shell programme-layout"><div className="programme-heading" data-reveal><h2>What’s happening?</h2><p>The main rhythm of the evening, without turning the homepage into a timetable.</p><a href="/programme">View full programme ↗</a></div><div className="schedule" data-reveal>{programme.map(([time,title,copy])=><div className="schedule-row" key={time}><time>{time}</time><div><b>{title}</b><p>{copy}</p></div></div>)}</div></div></section>

    <section className="visit-home"><div className="shell visit-layout" data-reveal><div><h2>Plan your visit.</h2><p>Stadium Merdeka is easy to reach by rail. Come before the busiest hour if you want more time to browse and settle in.</p><div className="visit-actions"><a className="button primary" href="/visit">Full visitor guide ↗</a><a className="text-link" href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer">Get directions ↗</a></div></div><dl className="visit-list"><div><dt>Where</dt><dd>Stadium Merdeka, Kuala Lumpur</dd></div><div><dt>When</dt><dd>21 Feb–18 Mar 2026</dd></div><div><dt>Hours</dt><dd>4 PM–11 PM</dd></div><div><dt>Entry</dt><dd>Free</dd></div><div><dt>Rail</dt><dd>Merdeka MRT · Maharajalela Monorail</dd></div><div><dt>Good to know</dt><dd>Prayer facilities · families welcome</dd></div></dl></div></section>
    <Footer/>
  </main>
}

function PageShell({title,intro,image,children}){const root=useRef(null);useMotion(root,false);return <main ref={root}><Nav/><header className="subhero"><div className="shell subhero-grid"><div><h1>{title}</h1><p>{intro}</p></div><div className="subhero-photo"><Img src={image} alt={title}/></div></div></header>{children}<Footer/></main>}

function FoodPage(){const [i,setI]=useState(0);return <PageShell title="Come hungry." intro="Hot food, sweet treats, cold drinks and food trucks around Stadium Merdeka." image={IMAGES.food}><section className="page-section"><div className="shell"><div className="food-tabs">{foods.map(([name],idx)=><button className={idx===i?'active':''} onClick={()=>setI(idx)} key={name}>{name}</button>)}</div><div className="food-feature"><Img src={foods[i][2]} alt={foods[i][0]}/><div><h2>{foods[i][0]}</h2><p>{foods[i][1]}</p></div></div></div></section></PageShell>}

function ProgrammePage(){return <PageShell title="What’s happening tonight?" intro="A simple, useful view of the Bazram Merdeka evening." image={IMAGES.crowd}><section className="page-section"><div className="shell schedule page-schedule">{programme.map(([time,title,copy])=><div className="schedule-row" key={time}><time>{time}</time><div><b>{title}</b><p>{copy}</p></div></div>)}</div></section></PageShell>}

function VisitPage(){return <PageShell title="Plan your visit." intro="Everything practical for a smooth evening at Stadium Merdeka." image={IMAGES.stadium}><section className="page-section"><div className="shell visit-page"><dl className="visit-list"><div><dt>Date</dt><dd>21 Feb–18 Mar 2026</dd></div><div><dt>Hours</dt><dd>4 PM–11 PM</dd></div><div><dt>Location</dt><dd>Stadium Merdeka</dd></div><div><dt>Entry</dt><dd>Free</dd></div></dl><div className="visit-copy"><article><h2>Getting here</h2><p>Merdeka MRT and Maharajalela Monorail are the most useful rail approaches to the stadium precinct.</p></article><article id="prayer"><h2>Prayer</h2><p>Prayer access is part of the evening flow. Give yourself enough time before Maghrib.</p></article><article><h2>Families</h2><p>The field and stands work well for groups and families. Children should remain supervised.</p></article><article><h2>House rules</h2><p>No smoking or vaping, no pets, no littering and no flammable materials. Respect stadium restrictions.</p></article></div></div></section></PageShell>}

function VendorsPage(){return <PageShell title="Book a stall at Bazram Merdeka." intro="Seller information, separate from the visitor experience." image={IMAGES.food}><section className="page-section"><div className="shell vendor-layout"><div><h2>From RM1,000 for the 26-day run.</h2><p>Food, drinks, food trucks, dry goods and selected non-F&amp;B concepts were included in the seller call.</p></div><aside><b>21 Feb–18 Mar</b><span>4 PM–11 PM</span><a className="button primary" href={WHATSAPP} target="_blank" rel="noreferrer">Enquire on WhatsApp ↗</a></aside></div></section></PageShell>}

function NotFound(){return <main><Nav/><section className="notfound"><img src={LOGO} alt="Bazram Merdeka"/><h1>Page not found.</h1><a className="button primary" href="/">Back home</a></section></main>}

const path=window.location.pathname.replace(/\/+$/,'')||'/'
const Page=path==='/'?Home:path==='/iftar'?IftarStory:path==='/food'?FoodPage:path==='/programme'?ProgrammePage:path==='/visit'?VisitPage:path==='/vendors'?VendorsPage:NotFound
createRoot(document.getElementById('root')).render(<Page/>)