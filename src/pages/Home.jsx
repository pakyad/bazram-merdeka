import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Nav, Footer, Img, BannerStrip, SkipLink } from '../ui.jsx'
import { useMotion, STARS } from '../motion.js'
import { IMAGES, SCENES, EVENT, INSTAGRAM } from '../data.js'

function TimeChip() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const triggers = SCENES.map((s, idx) => ScrollTrigger.create({
      trigger: `.scene-${s.id}`,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: self => { if (self.isActive) setI(idx) },
    }))
    return () => triggers.forEach(t => t.kill())
  }, [])
  return <div className="time-chip" aria-hidden="true"><span className="time-chip-dot"/><b>{SCENES[i].time}</b><span>{SCENES[i].word}</span></div>
}

export default function Home() {
  const root = useRef(null)
  useMotion(root, true)
  return <main ref={root} className="home" id="main">
    <SkipLink/>
    <div className="sky-stage home-sky" aria-hidden="true">
      <div className="sky-sheet s-golden"/>
      <div className="sky-sheet s-sunset"/>
      <div className="sky-sheet s-dusk"/>
      <div className="sky-sheet s-night"/>
      <div className="clouds">
        <span className="cloud c1"/><span className="cloud c2"/><span className="cloud c3"/>
      </div>
      <div className="sky-stars">{STARS.map((st, i) => <i key={i} style={{ left: st.left + '%', top: st.top + '%', width: st.s, height: st.s, opacity: st.o }}/>)}</div>
      <svg className="sky-line" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <rect x="180" y="6" width="6" height="62" fill="#141a1f"/>
        <rect x="1254" y="6" width="6" height="62" fill="#141a1f"/>
        <path d="M0 160L0 98Q360 42 720 42Q1080 42 1440 98L1440 160Z" fill="#141a1f"/>
      </svg>
    </div>
    <Nav home/>
    <TimeChip/>

    <header className="scene opening">
      <div className="shell opening-inner">
        <span className="kicker">A Ramadan bazaar &amp; communal iftar · Stadium Merdeka</span>
        <h1><span>Bazram</span><span>Merdeka.</span></h1>
        <p className="lead">One field, thousands of mats, and an evening the whole city shares. Come hungry, stay for the pause.</p>
        <BannerStrip>{EVENT.dates} · {EVENT.hours} · {EVENT.entry}</BannerStrip>
        <a className="scroll-cue" href="#arrive">Scroll — the evening starts at 4 PM ↓</a>
      </div>
    </header>

    <section id="arrive" className="scene scene-arrive">
      <div className="shell scene-grid">
        <figure className="scene-photo" data-reveal>
          <Img src={IMAGES.arrive} alt="Families settle on mats across the Stadium Merdeka field in the late afternoon" eager/>
          <figcaption>The field at 4 PM, before the rush</figcaption>
        </figure>
        <div className="scene-copy" data-reveal>
          <span className="time-mark">4:00 PM — Arrive</span>
          <h2>Come before the rush.</h2>
          <p>The gates open while the light is still kind. Walk the bowl, find the food lanes, pick your spot on the grass early — the regulars do.</p>
          <div className="scene-links"><a className="text-link" href="/visit">How to get here ↗</a></div>
        </div>
      </div>
    </section>

    <section className="scene scene-wander">
      <div className="shell scene-grid flip">
        <figure className="scene-photo" data-reveal>
          <Img src={IMAGES.food} alt="Vendors preparing drinks, kuih and hot dishes at their stalls" />
          <figcaption>The stalls, an hour before Maghrib</figcaption>
        </figure>
        <div className="scene-copy" data-reveal>
          <span className="time-mark">5:00 PM — Wander</span>
          <h2>Come hungry.</h2>
          <p>Charcoal smoke, iced drinks and trays of kuih laid out by hand. Wander the lanes, compare, then queue where the queue is longest — it knows something.</p>
          <div className="scene-links"><a className="text-link" href="/food">See what’s cooking ↗</a></div>
        </div>
      </div>
    </section>

    <section className="scene scene-gather">
      <div className="shell scene-grid">
        <figure className="scene-photo" data-reveal>
          <Img src={IMAGES.gather} alt="The stadium bowl fills with picnic mats as the sun lowers behind Merdeka 118"/>
          <figcaption>Merdeka 118 watches over the field</figcaption>
        </figure>
        <div className="scene-copy" data-reveal>
          <span className="time-mark">Before Maghrib — Gather</span>
          <h2>Everyone finds their place.</h2>
          <p>Mats come out. Groups grow. The sun drops behind the city and the whole field turns gold. Find your people and sit down — it’s almost time.</p>
        </div>
      </div>
    </section>

    <section className="scene scene-break">
      <div className="shell break-inner" data-reveal>
        <span className="time-mark light">Maghrib — Break</span>
        <p className="break-line">The whole stadium<br/>pauses together.</p>
        <p className="break-sub">Dates, water and the first bite — thousands of strangers sharing one quiet minute.</p>
        <a className="button primary" href="/iftar">Experience the Iftar Hour →</a>
      </div>
    </section>

    <section className="scene scene-stay">
      <div className="shell stay-inner" data-reveal>
        <span className="time-mark light">After Maghrib — Stay</span>
        <h2>The night does the rest.</h2>
        <p>Prayer, dessert, a second round through the bazaar. The lights stay on over the field until 11 PM — leaving early is the hard part.</p>
        <div className="stay-actions">
          <a className="button primary" href="/visit">Plan your visit ↗</a>
          <a className="text-link light" href="/programme">See the evening’s rhythm ↗</a>
        </div>
        <p className="stay-note">Follow <a href={INSTAGRAM} target="_blank" rel="noreferrer">@bazrammerdeka</a> for the nightly mood.</p>
      </div>
    </section>

    <Footer/>
  </main>
}
