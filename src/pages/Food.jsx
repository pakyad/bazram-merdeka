import { PageShell } from '../ui.jsx'
import { IMAGES, FOODS } from '../data.js'

export default function Food() {
  return <PageShell title="Come hungry." intro="Hot food, sweet treats, cold drinks and food trucks around Stadium Merdeka." image={IMAGES.food} imageAlt="Vendors preparing food at Bazram Merdeka">
    <section className="page-section">
      <div className="shell food-list">
        {FOODS.map((f, i) => <article className={`food-row ${i % 2 ? 'flip' : ''}`} key={f.id} data-reveal>
          <figure className="food-photo">
            <Img src={f.crop === 'field' ? IMAGES.arrive : IMAGES.food} alt={`${f.name} at the Bazram Merdeka bazaar`} className={`crop-${f.crop}`}/>
          </figure>
          <div className="food-copy">
            <span className="food-index">{String(i + 1).padStart(2, '0')}</span>
            <h2>{f.name}</h2>
            <p className="food-line">{f.line}</p>
            <p>{f.copy}</p>
          </div>
        </article>)}
      </div>
    </section>
  </PageShell>
}
