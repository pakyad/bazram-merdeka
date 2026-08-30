import React from 'react'
import { PageShell, Img, Button, TextLink } from '../ui.jsx'
import { EVENT, VISIT_FACTS, VISIT_NOTES, IMAGES } from '../data.js'

export default function VisitPage() {
  return (
    <PageShell
      title="Plan your visit."
      intro="Everything practical for a smooth evening at Stadium Merdeka."
      image={IMAGES.arrive}
    >
      <section className="page-section">
        <div className="shell visit-page">
          <dl className="visit-list">
            {VISIT_FACTS.map(([dt, dd]) => (
              <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>
            ))}
          </dl>
          <div className="visit-copy">
            {VISIT_NOTES.map(note => (
              <article key={note.id} id={note.id}>
                <h2>{note.title}</h2>
                <p>{note.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}