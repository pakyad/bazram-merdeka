import React, { useState, useEffect } from 'react'
import { LOGO, NAV_LINKS, WHATSAPP, INSTAGRAM } from './data.js'
import Lenis from 'lenis'

let lenisInstance = null

export function Img({ src, alt, className = '' }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div className={`img-fallback ${className}`}><img src={LOGO} alt="Bazram Merdeka" /></div>
  return <img className={className} src={src} alt={alt} onError={() => setBad(true)} loading="lazy" />
}

export function SkipLink() {
  return <a href="#main" className="skip-link">Skip to main content</a>
}

export function Nav({ home = false }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (lenisInstance) { open ? lenisInstance.stop() : lenisInstance.start() }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav className={`nav ${home ? 'nav-home' : ''}`}>
      <div className="nav-inner">
        <a className="brand" href="/"><img src={LOGO} alt="Bazram Merdeka" /></a>
        <div className="nav-links">{NAV_LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</div>
        <div className="nav-right">
          <a className="nav-cta" href="/visit">Visitor guide ↗</a>
          <button className="nav-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(v => !v)}>
            <svg className="icon-open" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M3 5.5h14M3 10h14M3 14.5h14" />
            </svg>
            <svg className="icon-close" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {NAV_LINKS.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a href="/vendors" onClick={() => setOpen(false)}>Vendors ↗</a>
      </div>
      <span className="progress" />
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-main">
        <img src={LOGO} alt="Bazram Merdeka" />
        <div>
          <b>Stadium Merdeka, Kuala Lumpur</b>
          <span>21 Feb–18 Mar 2026 · 4 PM–11 PM · Free entry</span>
        </div>
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
  )
}

export function PageShell({ title, intro, image, children }) {
  return (
    <main>
      <Nav />
      <header className="subhero">
        <div className="shell subhero-grid">
          <div>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
          <div className="subhero-photo"><Img src={image} alt={title} /></div>
        </div>
      </header>
      {children}
      <Footer />
    </main>
  )
}

export function Button({ children, className = '', ...props }) {
  return <a className={`button ${className}`} {...props}>{children}</a>
}

export function TextLink({ children, className = '', ...props }) {
  return <a className={`text-link ${className}`} {...props}>{children}</a>
}