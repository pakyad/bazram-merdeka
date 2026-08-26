import { useRef } from 'react'
import { Nav, Footer, Img, SkipLink } from '../ui.jsx'
import { useMotion, useIftarMotion, useMaghrib, STARS } from '../motion.js'
import { IMAGES, PROGRAMME } from '../data.js'

export default function Iftar() {
  const root = useRef(null)
  const maghrib = useMaghrib()
  useMotion(root, false)
  useIftarMotion(root)
  return <main ref={root} className="story" id="main">
    <SkipLink/>
    <Nav/>
    <div className="sky-stage" aria-hidden="true">
      <div className="sky-sheet s-golden"/>
      <div className="sky-sheet s-sunset"/>
      <div className="sky-sheet s-maghrib"/>
      <div className="sky-sheet s-dusk"/>
      <div className="sky-sheet s-night"/>
      <div className="sky-stars">{STARS.map((st, i) => <i key={i} style={{ left: st.left + '%', top: st.top + '%', width: st.s, height: st.s, opacity: st.o }}/>)}</div>
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
          <div className="count-chip" aria-live="polite"><b>{maghrib ? maghrib.label : 'Maghrib'}</b><span>{maghrib ? maghrib.sub : 'this evening · Kuala Lumpur'}</span></div>
        </div></div>
      </section>
      <section className="story-sec st-maghrib">
        <div className="story-narrow story-inner" data-reveal>
          <span className="story-kicker">At Maghrib</span>
          <h2 className="peak-line">The whole stadium pauses together.</h2>
          <p>Thousands settle onto the field with their food, and for one moment everything in Kuala Lumpur goes quiet at the same time.</p>
        </div>
      </section>
      <section className="story-sec st-break">
        <figure className="break-photo" data-reveal>
          <Img src={IMAGES.break} alt="People sharing food on mats on the field as the stadium lights come on at dusk"/>
        </figure>
        <div className="story-narrow"><div className="story-card" data-reveal>
          <span className="story-kicker">Break fast</span>
          <h2>Then the field becomes a table.</h2>
          <p>The first bite lands and the quiet turns into conversation. Strangers pass the dates, families unpack at home, and everyone eats facing the same sky.</p>
        </div></div>
      </section>
      <section className="story-sec st-dusk">
        <div className="story-narrow"><div className="story-card" data-reveal>
          <span className="story-kicker">After iftar</span>
          <h2>The night opens up.</h2>
          <div className="story-schedule">{PROGRAMME.slice(0, 4).map(([time, title, copy]) => <div className="schedule-row" key={time}><time>{time}</time><div><b>{title}</b><p>{copy}</p></div></div>)}</div>
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
