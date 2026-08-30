import React, { useState } from 'react'
import { PageShell, Img, Button, TextLink } from '../ui.jsx'
import { FOODS, IMAGES } from '../data.js'

export default function FoodPage() {
  const [i, setI] = useState(0)
  return (
    <PageShell
      title="Come hungry."
      intro="Hot food, sweet treats, cold drinks and food trucks around Stadium Merdeka."
      image={IMAGES.food}
    >
      <section className="page-section">
        <div className="shell">
          <div className="food-tabs">
            {FOODS.map((f, idx) => (
              <button key={f.id} className={idx === i ? 'active' : ''} onClick={() => setI(idx)}>{f.name}</button>
            ))}
          </div>
          <div className="food-feature">
            <Img src={FOODS[i].image} alt={FOODS[i].name} />
            <div>
              <h2>{FOODS[i].name}</h2>
              <p>{FOODS[i].copy}</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}