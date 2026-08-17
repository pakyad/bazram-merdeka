import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './vendor.css'

gsap.registerPlugin(ScrollTrigger)

const categories = {
  food: {
    icon: 'F',
    title: 'Makanan',
    copy: 'For cooked food, Ramadan favourites, snacks and ready-to-eat dishes.',
  },
  drinks: {
    icon: 'D',
    title: 'Minuman',
    copy: 'For cold drinks, coffee, juices and beverage concepts built for evening crowds.',
  },
  trucks: {
    icon: 'T',
    title: 'Food Truck',
    copy: 'For mobile food concepts that need a dedicated truck-friendly selling space.',
  },
  retail: {
    icon: 'N',
    title: 'Bahan Kering & Non-F&B',
    copy: 'For packaged goods, dry products and selected non-food retail concepts.',
  },
}

const whatsappHref = 'https://wa.me/60164597091?text=Hi%202Cool%20Productions%2C%20saya%20berminat%20untuk%20book%20tapak%20Bazram%20Merdeka.%20Boleh%20share%20details%20vendor%3F'
const facebookHref = 'https://www.facebook.com/profile.php?id=61586742366490'

function buildVendorSection() {
  if (document.querySelector('#vendors')) return
  const programme = document.querySelector('#programme')
  if (!programme) return

  const section = document.createElement('section')
  section.id = 'vendors'
  section.className = 'vendor-section'
  section.innerHTML = `
    <div class="wrap vendor-shell">
      <div class="vendor-copy">
        <span class="eyebrow">Vendor call · 2026 edition</span>
        <h2>Bring your stall to Stadium Merdeka.</h2>
        <p>Bazram also works as a platform for sellers. The 2026 vendor call offered tapak for the full 26-day Ramadan run, with spaces for food, drinks, food trucks, dry goods and selected non-F&amp;B concepts.</p>
        <div class="vendor-category-label">What do you sell?</div>
        <div class="vendor-categories" role="tablist" aria-label="Vendor categories">
          <button class="vendor-category active" data-category="food" type="button">Makanan</button>
          <button class="vendor-category" data-category="drinks" type="button">Minuman</button>
          <button class="vendor-category" data-category="trucks" type="button">Food Truck</button>
          <button class="vendor-category" data-category="retail" type="button">Bahan Kering / Non-F&amp;B</button>
        </div>
        <div class="vendor-note"><i>i</i><span>The seller poster advertised tapak <b>from RM1,000</b> for the 26-day 2026 edition. Final placement, category approval and availability are handled by the organiser.</span></div>
      </div>

      <div class="vendor-ticket-wrap">
        <div class="vendor-ticket-shadow" aria-hidden="true"></div>
        <article class="vendor-ticket">
          <div class="vendor-ticket-top">
            <span class="vendor-ticket-kicker">Book a tapak</span>
            <span class="vendor-ticket-status">Vendor enquiry</span>
          </div>

          <div class="vendor-price">
            <small>Tapak from</small>
            <strong>RM1,000</strong>
            <span>for the 26-day 2026 run</span>
          </div>

          <div class="vendor-meta">
            <div><small>Date</small><b>21 Feb — 18 Mar</b></div>
            <div><small>Hours</small><b>4 PM — 11 PM</b></div>
            <div><small>Venue</small><b>Stadium Merdeka</b></div>
          </div>

          <div class="vendor-category-detail">
            <span data-vendor-icon>F</span>
            <div><b data-vendor-title>Makanan</b><p data-vendor-copy>For cooked food, Ramadan favourites, snacks and ready-to-eat dishes.</p></div>
          </div>

          <div class="vendor-actions">
            <a class="vendor-whatsapp" href="${whatsappHref}" target="_blank" rel="noreferrer">Enquire on WhatsApp <span>↗</span></a>
            <a class="vendor-facebook" href="${facebookHref}" target="_blank" rel="noreferrer">2Cool Productions Facebook ↗</a>
          </div>
        </article>
      </div>
    </div>

    <div class="wrap vendor-strip">
      <article><span>01 · Reach</span><b>26 days of Ramadan trade</b><p>A full event run rather than a one-night pop-up.</p></article>
      <article><span>02 · Location</span><b>Inside the Merdeka precinct</b><p>A recognised city landmark with strong public visibility.</p></article>
      <article><span>03 · Categories</span><b>Food + retail mix</b><p>Makanan, minuman, food trucks, dry goods and non-F&amp;B.</p></article>
      <article><span>04 · Next step</span><b>Talk to the vendor team</b><p>Use WhatsApp to confirm availability, placement and requirements.</p></article>
    </div>
  `

  programme.insertAdjacentElement('afterend', section)

  const ticket = section.querySelector('.vendor-ticket')
  const buttons = [...section.querySelectorAll('.vendor-category')]
  const icon = section.querySelector('[data-vendor-icon]')
  const title = section.querySelector('[data-vendor-title]')
  const copy = section.querySelector('[data-vendor-copy]')

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const data = categories[button.dataset.category]
      if (!data || button.classList.contains('active')) return
      buttons.forEach((item) => item.classList.toggle('active', item === button))
      gsap.to([icon, title, copy], {
        y: -7,
        opacity: 0,
        duration: .16,
        ease: 'power2.in',
        onComplete: () => {
          icon.textContent = data.icon
          title.textContent = data.title
          copy.textContent = data.copy
          gsap.fromTo([icon, title, copy], { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .28, stagger: .035, ease: 'power3.out' })
        },
      })
    })
  })

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches

  if (!reduced) {
    gsap.from(section.querySelectorAll('.vendor-copy > *, .vendor-ticket-wrap, .vendor-strip article'), {
      y: 28,
      opacity: 0,
      duration: .7,
      stagger: .055,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 78%' },
    })
  }

  if (!reduced && !coarse && ticket) {
    ticket.addEventListener('pointermove', (event) => {
      const rect = ticket.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - .5
      const y = (event.clientY - rect.top) / rect.height - .5
      gsap.to(ticket, { rotateY: x * .8, rotateX: -y * .55, x: x * 4, y: y * 3, transformPerspective: 1200, duration: .4, ease: 'power3.out' })
    })
    ticket.addEventListener('pointerleave', () => {
      gsap.to(ticket, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: .55, ease: 'power3.out' })
    })
  }

  ScrollTrigger.refresh()
}

const observer = new MutationObserver(() => {
  if (document.querySelector('#programme')) {
    buildVendorSection()
    observer.disconnect()
  }
})

observer.observe(document.documentElement, { childList: true, subtree: true })
buildVendorSection()
