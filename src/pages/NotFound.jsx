import { LOGO } from '../data.js'
import { Nav } from '../ui.jsx'

export default function NotFound() {
  return <main id="main">
    <Nav/>
    <section className="notfound">
      <img src={LOGO} alt="Bazram Merdeka"/>
      <h1>Page not found.</h1>
      <a className="button primary" href="/">Back to the evening</a>
    </section>
  </main>
}
