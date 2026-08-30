import React from 'react'
import { PageShell, Img, Button, TextLink } from '../ui.jsx'
import { WHATSAPP, EVENT, IMAGES } from '../data.js'

export default function VendorsPage() {
  return (
    <PageShell
      title="Book a stall at Bazram Merdeka."
      intro="Seller information, separate from the visitor experience."
      image={IMAGES.food}
    >
      <section className="page-section">
        <div className="shell vendor-layout">
          <div>
            <h2>From RM1,000 for the 26-day run.</h2>
            <p>Food, drinks, food trucks, dry goods and selected non-F&B concepts were included in the seller call.</p>
          </div>
          <aside>
            <b>{EVENT.dates}</b>
            <span>{EVENT.hours}</span>
            <Button href={WHATSAPP} target="_blank" rel="noreferrer" primary>Enquire on WhatsApp ↗</Button>
          </aside>
        </div>
      </section>
    </PageShell>
  )
}