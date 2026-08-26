import { useEffect, useRef, useState } from 'react'
import { LOGO, IMAGES, IMAGE_SIZE, NAV_LINKS, WHATSAPP, INSTAGRAM } from './data.js'
import { lenisInstance, useMotion } from './motion.js'

export function Img({ src, alt, className = '', width, height, eager = false }) {
  const [bad, setBad] = useState(false)
  const [w, h] = width && height ? [width, height] : (IMAGE_SIZE[src] || [1200, 800])
  if (bad) return <div className={`img-fallback ${className}`} role="img" aria-label={alt}><img src={LOGO} alt="" width={w} height={h}/></div>
  return <img className={className} src={src} alt={alt} width={w} height={h} loading={eager ? 'eager' : 'lazy'} decoding="async"/>
}

export function SkipLink() {
  return <a className="skip-link" href="#main">Skip to content</a>
}

export function Nav({ home = false }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (lenisInstance) { open ? lenisInstance.stop() : lenisInstance.start() }
    return () => { document.body.style.overflow = '' }
  }, [open])
  return <nav className={`nav ${home ? 'nav-home' : ''}`} aria-label="Main">
    <div className="nav-inner">
      <a className="brand" href="/" aria-label="Bazram Merdeka home"><img src={LOGO} alt="Bazram Merdeka"/></a>
      <div className="nav-links">{NAV_LINKS.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</div>
      <div className="nav-right">
        <a className="nav-cta" href="/visit">Plan your visit ↗</a>
        <button className="nav-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(v => !v)}>
          <svg className="icon-open" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3 5.5h14M3 10h14M3 14.5h14"/></svg>
          <svg className="icon-close" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>
        </button>
      </div>
    </div>
    <div className={`mobile-menu ${open ? 'open' : ''}`}>
      {NAV_LINKS.map(([href, label]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a href="/vendors" onClick={() => setOpen(false)}>Vendors ↗</a>
    </div>
    <span className="progress"/>
  </nav>
}

export function Footer() {
  return <footer className="footer">
    <div className="shell footer-main">
      <img src={LOGO} alt="Bazram Merdeka"/>
      <div><b>Stadium Merdeka, Kuala Lumpur</b><span>21 Feb–18 Mar 2026 · 4 PM–11 PM · Free entry</span></div>
      <div className="footer-nav">
        <a href="/iftar">The Iftar Hour</a>
        <a href="/food">Food</a>
        <a href="/programme">Programme</a>
        <a href="/visit">Visit</a>
        <a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram ↗</a>
      </div>
    </div>
    <div className="shell footer-bottom">
      <span>An event by 2Cool Productions</span>
      <a href="/vendors">Vendor enquiries →</a>
    </div>
  </footer>
}

export function BannerStrip({ children }) {
  return <p className="banner-strip">{children}</p>
}

export function PageShell({ title, intro, image, imageAlt, children }) {
  const root = useRef(null)
  useMotion(root, false)
  return <main ref={root} id="main">
    <Nav/>
    <header className="subhero">
      <div className="shell subhero-grid">
        <div><h1>{title}</h1><p>{intro}</p></div>
        <div className="subhero-photo"><Img src={image} alt={imageAlt || title}/></div>
      </div>
    </header>
    {children}
    <Footer/>
  </main>
}
