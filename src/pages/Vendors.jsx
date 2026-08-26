import { PageShell, Img } from '../ui.jsx'
import { IMAGES, WHATSAPP, INSTAGRAM } from '../data.js'

export default function Vendors() {
  return <PageShell title="Your stall. Your crowd." intro="Seller information for Bazram Merdeka — separate from the visitor experience." image={IMAGES.poster} imageAlt="Bazram Merdeka official poster with dates and location">
    <section className="page-section">
      <div className="shell vendor-layout">
        <div className="vendor-copy" data-reveal>
          <h2>From RM1,000 for the 26-day run.</h2>
          <p>Food, drinks, food trucks, dry goods and selected non-F&amp;B concepts were part of the seller call. One booking covers the whole season in front of the city’s biggest evening crowd.</p>
          <div className="vendor-proof">
            <Img src={IMAGES.stands} alt="A full stand of visitors at Stadium Merdeka" width={576} height={576}/>
            <p>Thousands gather nightly — <a href={INSTAGRAM} target="_blank" rel="noreferrer">see the crowd ↗</a></p>
          </div>
        </div>
        <aside className="vendor-card" data-reveal>
          <b>21 Feb–18 Mar</b>
          <span>4 PM–11 PM · Stadium Merdeka</span>
          <a className="button primary" href={WHATSAPP} target="_blank" rel="noreferrer">Enquire on WhatsApp ↗</a>
          <span className="vendor-small">2Cool Productions · vendor enquiries</span>
        </aside>
      </div>
    </section>
  </PageShell>
}
