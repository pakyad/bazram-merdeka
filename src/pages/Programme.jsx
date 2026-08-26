import { PageShell } from '../ui.jsx'
import { IMAGES, PROGRAMME } from '../data.js'

export default function Programme() {
  return <PageShell title="What’s happening tonight?" intro="The rhythm of a Bazram Merdeka evening, from first stall to last light." image={IMAGES.gather} imageAlt="The stadium field filling with picnic mats before Maghrib">
    <section className="page-section">
      <div className="shell">
        <ol className="timeline">
          {PROGRAMME.map(([time, title, copy], i) => <li className="timeline-row" key={time} data-reveal>
            <span className="timeline-index">{String(i + 1).padStart(2, '0')}</span>
            <time>{time}</time>
            <div><b>{title}</b><p>{copy}</p></div>
          </li>)}
        </ol>
        <p className="timeline-note" data-reveal>Stage activities and stall line-ups change nightly — follow <a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">@bazrammerdeka</a> for what’s on tonight.</p>
      </div>
    </section>
  </PageShell>
}
