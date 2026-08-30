import React from 'react'
import { PageShell, Img, TextLink } from '../ui.jsx'
import { PROGRAMME, IMAGES } from '../data.js'

export default function ProgrammePage() {
  return (
    <PageShell
      title="What's happening tonight?"
      intro="A simple, useful view of the Bazram Merdeka evening."
      image={IMAGES.stands}
    >
      <section className="page-section">
        <div className="shell schedule page-schedule">
          {PROGRAMME.map(([time, title, copy]) => (
            <div className="schedule-row" key={time}>
              <time>{time}</time>
              <div><b>{title}</b><p>{copy}</p></div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}