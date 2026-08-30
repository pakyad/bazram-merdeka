import React from 'react'
import { Nav, Footer, Img, Button } from '../ui.jsx'
import { LOGO } from '../data.js'

export default function NotFound() {
  return (
    <main>
      <Nav />
      <section className="notfound">
        <Img src={LOGO} alt="Bazram Merdeka" />
        <h1>Page not found.</h1>
        <Button href="/" primary>Back home</Button>
      </section>
      <Footer />
    </main>
  )
}