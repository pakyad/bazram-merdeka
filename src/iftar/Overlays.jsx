import React from 'react'
import { PROGRAMME, EVENT } from '../data.js'
import { useMaghrib } from '../motion.js'
import { TextLink, Button } from '../ui.jsx'

export function Overlays({ progress, maghrib }) {
  const inAct1 = progress < 0.32
  const inAct2 = progress >= 0.32 && progress < 0.58
  const inMaghrib = progress >= 0.58 && progress < 0.72
  const inAct3 = progress >= 0.72 && progress < 0.9
  const inAct4 = progress >= 0.9

  return (
    <>
      {inAct1 && (
        <header className="story-sec st-hero" style={{ opacity: progress < 0.15 ? progress / 0.15 : 1 }}>
          <div className="story-narrow story-inner">
            <span className="story-kicker">A Bazram Merdeka story</span>
            <h1>The Iftar Hour.</h1>
            <p>How one evening at Stadium Merdeka slows down, glows, and stops together at Maghrib.</p>
            <div className="story-meta">
              <span>21 Feb–18 Mar</span>
              <span>4 PM–11 PM</span>
              <span>Free entry</span>
            </div>
            <a className="scroll-cue" href="#st-wait">Scroll — the sky keeps time ↓</a>
          </div>
        </header>
      )}

      {inAct2 && (
        <section id="st-wait" className="story-sec st-wait" style={{ opacity: (progress - 0.32) / 0.1 }}>
          <div className="story-narrow"><div className="story-card" data-reveal>
            <span className="story-kicker">The wait</span>
            <h2>Come early. Take your time.</h2>
            <p>Walk the food lanes, pick your drinks, find a spot on the field. The bazaar is at its best before the rush, and the sky will tell you how long you have.</p>
            <div className="count-chip" aria-live="polite">
              <b>{maghrib ? maghrib.label : 'Maghrib'}</b>
              <span>{maghrib ? maghrib.sub : 'this evening · Kuala Lumpur'}</span>
            </div>
          </div></div>
        </section>
      )}

      {inMaghrib && (
        <section className="story-sec st-maghrib" style={{ opacity: (progress - 0.58) / 0.14 }}>
          <div className="story-narrow story-inner" data-reveal>
            <span className="story-kicker">At Maghrib</span>
            <h2 className="peak-line">The whole stadium pauses together.</h2>
            <p>Thousands settle onto the field with their food, and for one moment everything in Kuala Lumpur goes quiet at the same time.</p>
          </div>
        </section>
      )}

      {inAct3 && (
        <section className="story-sec st-break eagle-view" style={{ opacity: (progress - 0.72) / 0.18 }}>
          <div className="story-narrow"><div className="story-card" data-reveal>
            <span className="story-kicker">Eagle view</span>
            <h2>From above, the evening takes shape.</h2>
            <p>Food lanes run along the track. The stage anchors the south end. Prayer space sits quiet in the north corner. Gates marked by light.</p>
            <div className="eagle-legend" style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              <span style={{ background: '#fff8e8', border: '1px solid #f7c531', color: '#242321', padding: '6px 12px', borderRadius: '999px', font: '700 12px Manrope' }}>Food lanes</span>
              <span style={{ background: '#fff0d8', border: '1px solid #ee4429', color: '#242321', padding: '6px 12px', borderRadius: '999px', font: '700 12px Manrope' }}>Stage</span>
              <span style={{ background: '#f8f4ec', border: '1px solid #68625d', color: '#242321', padding: '6px 12px', borderRadius: '999px', font: '700 12px Manrope' }}>Prayer</span>
              <span style={{ background: '#fff', border: '1px solid #f7c531', color: '#242321', padding: '6px 12px', borderRadius: '999px', font: '700 12px Manrope' }}>Gates</span>
            </div>
            <TextLink href="/programme" style={{ marginTop: 16 }}>Full programme ↗</TextLink>
          </div></div>
        </section>
      )}

      {inAct4 && (
        <section className="story-sec st-night" style={{ opacity: (progress - 0.9) / 0.1 }}>
          <div className="story-narrow"><div className="story-card" data-reveal>
            <span className="story-kicker">Stay for the night</span>
            <h2>Under a risen moon.</h2>
            <p>Prayer, dessert, a second round through the bazaar. The evening carries on around the stadium until 11 PM.</p>
            <div className="story-actions">
              <Button href="/visit" primary>Plan your visit ↗</Button>
              <Button href="https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur" target="_blank" rel="noreferrer" secondary>Directions ↗</Button>
            </div>
          </div></div>
        </section>
      )}
    </>
  )
}