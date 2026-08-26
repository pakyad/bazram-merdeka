import { PageShell } from '../ui.jsx'
import { IMAGES, VISIT_FACTS, VISIT_NOTES } from '../data.js'

export default function Visit() {
  return <PageShell title="Plan your visit." intro="Everything practical for a smooth evening at Stadium Merdeka." image={IMAGES.stands} imageAlt="Crowds gathered in the Stadium Merdeka stands under Merdeka 118">
    <section className="page-section">
      <div className="shell visit-page">
        <dl className="visit-list">
          {VISIT_FACTS.map(([dt, dd]) => <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>)}
          <div><dt>Rail</dt><dd>Merdeka MRT · Maharajalela Monorail</dd></div>
          <div><dt>Good to know</dt><dd>Prayer room on site · families welcome</dd></div>
        </dl>
        <div className="visit-copy">
          {VISIT_NOTES.map(n => <article key={n.id} id={n.id}><h2>{n.title}</h2><p>{n.copy}</p></article>)}
        </div>
      </div>
    </section>
  </PageShell>
}
