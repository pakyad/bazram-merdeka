import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const food = [
  ['SATAY','🔥','SMOKY'], ['AIR BALANG','🥤','SEJUK'], ['MURTABAK','🥙','RANGUP'],
  ['AYAM PERCIK','🍗','PEDAS'], ['KUIH','🍡','MANIS'], ['NASI','🍚','BERAT'],
  ['ROTI JOHN','🥖','PENUH'], ['ABC','🍧','SEJUK'], ['KERABU','🥗','SEGAR'],
]

const stalls = [
  {name:'Api Bara', tag:'GRILL • A17', icon:'🔥'},
  {name:'Pakcik Air', tag:'DRINKS • B04', icon:'🥤'},
  {name:'Kuih Lama', tag:'KUIH • C11', icon:'🌼'},
  {name:'Roti Malam', tag:'HOT FOOD • D02', icon:'🌙'},
  {name:'Mangkuk 118', tag:'RICE • D19', icon:'🍚'},
  {name:'Manis Hujung', tag:'DESSERT • E08', icon:'✨'},
]

const highlights = [
  {
    id:'DVm_IH5CSr_',
    kind:'post',
    kicker:'SATU MALAM',
    title:'BAZRAM AFTER DARK',
    note:'The crowd, the lights and Stadium Merdeka after sunset.',
    href:'https://www.instagram.com/p/DVm_IH5CSr_/'
  },
  {
    id:'DVSdxs5ko46',
    kind:'reel',
    kicker:'MAKAN',
    title:'FROM TRADITION TO NEW-SCHOOL',
    note:'A fast tour through the food that makes Bazram feel alive.',
    href:'https://www.instagram.com/reel/DVSdxs5ko46/'
  },
  {
    id:'DVnAs5Hjqgr',
    kind:'post',
    kicker:'BERBUKA',
    title:'THE STADIUM FILLS UP',
    note:'The communal iftar atmosphere at Stadium Merdeka.',
    href:'https://www.instagram.com/p/DVnAs5Hjqgr/'
  },
  {
    id:'DVkr2vMiQ_O',
    kind:'post',
    kicker:'PLAN YOUR NIGHT',
    title:'BAZRAM TIPS',
    note:'A practical post for making the visit easier.',
    href:'https://www.instagram.com/p/DVkr2vMiQ_O/'
  }
]

function App(){
  const root = useRef(null)
  const [filter,setFilter] = useState('SEMUA')
  const [activeStall,setActiveStall] = useState(null)

  useEffect(()=>{
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = t => { lenis.raf(t*1000); requestAnimationFrame(tick) }
    requestAnimationFrame(tick)

    const ctx = gsap.context(()=>{
      const intro = gsap.timeline({defaults:{ease:'power3.out'}})
      intro.from('.moon',{scale:0,rotation:-35,duration:1.2})
        .from('.sky-star',{scale:0,opacity:0,stagger:.035,duration:.6},'-=.8')
        .from('.tower',{y:180,opacity:0,duration:1.15},'-=.65')
        .from('.stadium',{y:220,opacity:0,duration:1.15},'-=.9')
        .from('.hero-title .word',{yPercent:120,rotation:3,stagger:.1,duration:.9},'-=.6')
        .from('.hero-meta > *',{y:30,opacity:0,stagger:.08,duration:.55},'-=.45')
        .from('.lantern',{scale:0,opacity:0,stagger:.08,duration:.45},'-=.5')

      gsap.to('.hero-art',{yPercent:20,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}})
      gsap.to('.tower',{yPercent:-17,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}})
      gsap.to('.foreground',{yPercent:-13,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.8}})
      gsap.utils.toArray('.float-food').forEach((el,i)=>gsap.to(el,{y:i%2?35:-35,rotation:i%2?7:-7,ease:'sine.inOut',repeat:-1,yoyo:true,duration:2.4+i*.18}))

      const horizontal = document.querySelector('.stall-track')
      gsap.to(horizontal,{x:()=>-(horizontal.scrollWidth-window.innerWidth),ease:'none',scrollTrigger:{trigger:'.stall-pin',pin:true,scrub:1,end:()=>`+=${horizontal.scrollWidth}`}})

      gsap.to('.dusk-sky',{backgroundPosition:'0% 100%',ease:'none',scrollTrigger:{trigger:'.dusk',start:'top top',end:'bottom bottom',scrub:1}})
      gsap.fromTo('.night-light',{opacity:.05},{opacity:1,stagger:.08,scrollTrigger:{trigger:'.dusk',start:'35% center',end:'70% center',scrub:1}})
      gsap.from('.map-pin',{scale:0,rotation:-20,stagger:.08,scrollTrigger:{trigger:'.map-wrap',start:'top 65%'}})
      gsap.utils.toArray('.photo').forEach((el,i)=>gsap.from(el,{y:140,rotation:i%2?12:-12,opacity:0,scrollTrigger:{trigger:el,start:'top 92%',end:'top 60%',scrub:.7}}))
      gsap.from('.feed-title > *',{y:70,opacity:0,stagger:.08,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.feed-section',start:'top 72%'}})
      gsap.utils.toArray('.ig-card').forEach((el,i)=>{
        gsap.from(el,{y:90,opacity:0,rotation:i%2?1.5:-1.5,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}})
      })
    },root)

    return ()=>{ctx.revert();lenis.destroy()}
  },[])

  useEffect(()=>{
    gsap.fromTo('.food-chip',{scale:.82,opacity:.3},{scale:1,opacity:1,stagger:.045,duration:.4,ease:'back.out(1.8)'})
  },[filter])

  return <main ref={root}>
    <nav className="nav">
      <a className="brand" href="#top">BAZRAM°</a>
      <div className="nav-links"><a href="#makan">MAKAN</a><a href="#feed">LIVE</a><a href="#stall">STALLS</a><a href="#map">PETA</a></div>
      <a className="nav-ticket" href="#visit">DATANG ↗</a>
    </nav>

    <section className="hero" id="top">
      <div className="paper-noise" />
      <div className="hero-art">
        <div className="moon" />
        {Array.from({length:20}).map((_,i)=><i key={i} className="sky-star" style={{left:`${5+(i*17)%92}%`,top:`${8+(i*29)%52}%`}} />)}
        <div className="tower"><span>118</span></div>
        <div className="stadium"><div className="stadium-roof"/><div className="stadium-bowl">STADIUM MERDEKA</div></div>
        <div className="lantern l1">✦</div><div className="lantern l2">✦</div><div className="lantern l3">✦</div>
        <div className="foreground"><span>☘</span><span>✺</span><span>☘</span><span>✺</span><span>☘</span></div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">RAMADAN / KUALA LUMPUR / 2026</p>
        <h1 className="hero-title"><span><b className="word">BAZRAM</b></span><span><b className="word">MERDEKA</b></span></h1>
        <div className="hero-meta"><p>21 FEB — 18 MAC</p><p>4 PETANG — 11 MALAM</p><p>STADIUM MERDEKA</p></div>
        <div className="scroll-note">SCROLL MASUK ↓</div>
      </div>
    </section>

    <section className="makan" id="makan">
      <header className="section-head"><p>01 / PILIH IKUT HATI</p><h2>NAK MAKAN<br/><em>APA?</em></h2><div className="stamp">100+<small>VENDOR</small></div></header>
      <div className="filters">{['SEMUA','PEDAS','MANIS','SEJUK','BERAT'].map(x=><button key={x} onClick={()=>setFilter(x)} className={filter===x?'active':''}>{x}</button>)}</div>
      <div className="food-cloud">{food.filter(f=>filter==='SEMUA'||f[2]===filter).map((f,i)=><button className={`food-chip float-food c${i%4}`} key={f[0]}><span>{f[1]}</span><strong>{f[0]}</strong><small>{f[2]}</small></button>)}</div>
      <p className="scribble">pilih → jumpa → bungkus → cari tikar → tunggu azan</p>
    </section>

    <section className="feed-section" id="feed">
      <div className="feed-orbit orbit-one">✦</div>
      <div className="feed-orbit orbit-two">BAZRAM / LIVE / KL</div>
      <header className="feed-title">
        <p>02 / DARI FEED SEBENAR</p>
        <h2>SEE IT. <span>FEEL IT.</span><br/>THEN GO.</h2>
        <div className="feed-intro">Real posts from <b>@bazrammerdeka</b>, pulled into the experience as living editorial windows instead of a generic social grid.</div>
      </header>
      <div className="feed-grid">
        {highlights.map((item,i)=><article className={`ig-card ig-${i+1}`} key={item.id}>
          <div className="ig-frame">
            <div className="ig-top"><span>{String(i+1).padStart(2,'0')}</span><b>{item.kicker}</b><i>↗</i></div>
            <iframe
              title={item.title}
              src={`https://www.instagram.com/${item.kind}/${item.id}/embed/`}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              frameBorder="0"
            />
          </div>
          <div className="ig-copy"><p>{item.kicker}</p><h3>{item.title}</h3><span>{item.note}</span><a href={item.href} target="_blank" rel="noreferrer">VIEW ON INSTAGRAM ↗</a></div>
        </article>)}
      </div>
      <div className="feed-marquee"><span>STADIUM MERDEKA ✦ MAKAN ✦ BERBUKA ✦ KL AFTER DARK ✦ 118+ VENDORS ✦ </span><span>STADIUM MERDEKA ✦ MAKAN ✦ BERBUKA ✦ KL AFTER DARK ✦ 118+ VENDORS ✦ </span></div>
    </section>

    <section className="stall-pin" id="stall">
      <div className="stall-track">
        <article className="stall-intro"><p>03 / JALAN TERUS</p><h2>THE<br/>NEVER-ENDING<br/><i>STALL.</i></h2><div className="arrow">→</div></article>
        {stalls.map((s,i)=><button className={`stall stall-${i%3}`} onClick={()=>setActiveStall(s)} key={s.name}>
          <div className="awning">◢ ◣ ◢ ◣ ◢ ◣ ◢</div><div className="stall-sign">{s.name}</div>
          <div className="stall-window"><span className="stall-icon">{s.icon}</span><i className="steam">〰</i><i className="steam s2">〰</i></div>
          <div className="stall-bottom"><b>{s.tag}</b><span>MASUK ↗</span></div>
        </button>)}
      </div>
    </section>

    <section className="dusk">
      <div className="dusk-sky"><div className="dusk-copy"><p>04 / WAKTU BERUBAH</p><h2>DARI<br/><span>SENJA</span><br/>KE MALAM.</h2></div>
        <div className="sun">☼</div><div className="night-moon">☾</div>
        <div className="light-row">{Array.from({length:16}).map((_,i)=><i className="night-light" key={i}/>)}</div>
        <div className="dusk-stadium">STADIUM MERDEKA <small>MAGHRIB • KL</small></div>
      </div>
    </section>

    <section className="people">
      <div className="people-copy"><p>05 / BERBUKA BERSAMA</p><h2>SATU PADANG.<br/><i>SERIBU CERITA.</i></h2></div>
      <div className="crowd">{Array.from({length:180}).map((_,i)=><span key={i} style={{'--i':i}}>{i%7===0?'✦':'●'}</span>)}</div>
      <div className="big-number">250K+<small>LANGKAH, GELAK & CERITA</small></div>
    </section>

    <section className="map-wrap" id="map">
      <header className="section-head inverse"><p>06 / PETA BAZRAM</p><h2>CARI<br/><em>PORT.</em></h2></header>
      <div className="map-card">
        <svg className="map-svg" viewBox="0 0 1000 620" role="img" aria-label="Stylised bazaar map">
          <path className="track" d="M145 400 C210 110 790 95 860 390 C910 600 145 610 145 400Z" />
          <ellipse cx="505" cy="360" rx="245" ry="145" className="field"/>
          <path className="walk" d="M70 520 C260 475 370 540 515 500 S760 440 930 505"/>
        </svg>
        <button className="map-pin p1"><b>A</b><span>HOT FOOD</span></button>
        <button className="map-pin p2"><b>B</b><span>DRINKS</span></button>
        <button className="map-pin p3"><b>C</b><span>PICNIC</span></button>
        <button className="map-pin p4"><b>D</b><span>FOOD TRUCK</span></button>
        <div className="map-note">tap / hover your zone</div>
      </div>
    </section>

    <section className="gallery">
      <div className="gallery-title"><p>07 / MEMORI</p><h2>LEPAS<br/><i>MAGHRIB</i></h2></div>
      {[['SATAY SMOKE','🔥'],['TIKAR PENUH','✺'],['AIR SEJUK','🥤'],['KL MENYALA','✦']].map((x,i)=><article className={`photo ph${i+1}`} key={x[0]}><div className="photo-art">{x[1]}</div><b>{x[0]}</b><small>BAZRAM / 2026 / 0{i+1}</small></article>)}
    </section>

    <footer id="visit">
      <p>STADIUM MERDEKA, KUALA LUMPUR</p><h2>JUMPA<br/><i>DI BAZRAM.</i></h2>
      <div className="footer-row"><span>21 FEB — 18 MAC 2026</span><span>4PM — 11PM</span><span>FREE ENTRY</span></div>
      <small>Independent interactive concept — artwork and interface are original and intended as a portfolio interpretation.</small>
    </footer>

    {activeStall && <div className="modal" onClick={()=>setActiveStall(null)}><div className="modal-card" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setActiveStall(null)}>TUTUP ×</button><div className="modal-icon">{activeStall.icon}</div><p>{activeStall.tag}</p><h3>{activeStall.name}</h3><p className="modal-text">Panas, ramai, sedap. A stylised vendor-detail state ready for real photography, menu data and stall information.</p><button className="cta">TUNJUK DALAM PETA →</button></div></div>}
  </main>
}

createRoot(document.getElementById('root')).render(<App/>)
