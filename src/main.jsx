import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import Lenis from 'lenis'
import './styles.css'

gsap.registerPlugin(ScrollTrigger, Flip)

const LOGO = '/bazram-logo.webp'

const photos = {
  iftar: {
    src: 'https://www.instagram.com/p/DVnAs5Hjqgr/media/?size=l',
    href: 'https://www.instagram.com/p/DVnAs5Hjqgr/',
    alt: 'Bazram Merdeka communal iftar at Stadium Merdeka',
  },
  night: {
    src: 'https://www.instagram.com/p/DVm_IH5CSr_/media/?size=l',
    href: 'https://www.instagram.com/p/DVm_IH5CSr_/',
    alt: 'Bazram Merdeka after dark at Stadium Merdeka',
  },
  visit: {
    src: 'https://www.instagram.com/p/DVkr2vMiQ_O/media/?size=l',
    href: 'https://www.instagram.com/p/DVkr2vMiQ_O/',
    alt: 'Bazram Merdeka visitor information post',
  },
}

const experienceSteps = [
  { title: 'Arrive', time: 'From 4 PM', copy: 'Come in early, get your bearings and walk the stadium perimeter before the busiest hour.', photo: photos.visit },
  { title: 'Makan', time: 'Before Maghrib', copy: 'Browse the food lanes, pick up dinner and make a second stop for drinks or something sweet.', photo: photos.iftar },
  { title: 'Iftar', time: 'At Maghrib', copy: 'Move onto the field or into the stands and break fast together inside Stadium Merdeka.', photo: photos.iftar },
  { title: 'After Dark', time: 'After iftar', copy: 'Pray, take another food round and stay for the programme as the stadium shifts into night.', photo: photos.night },
]

const foodTabs = [
  {
    id: 'hot',
    label: 'Hot food',
    title: 'Fresh off the grill',
    text: 'Satay, ayam percik, murtabak, roti, rice dishes, noodles and familiar Ramadan favourites.',
    chips: ['Satay', 'Ayam percik', 'Murtabak', 'Roti John'],
    order: [0, 1, 2, 3],
  },
  {
    id: 'sweet',
    label: 'Sweet',
    title: 'Something manis',
    text: 'Kuih, cold desserts and easy sweet bites for after iftar or the walk back out of the stadium.',
    chips: ['Kuih', 'ABC', 'Dessert cups', 'Bakes'],
    order: [2, 0, 3, 1],
  },
  {
    id: 'drinks',
    label: 'Drinks',
    title: 'Keep it cold',
    text: 'Air balang, juices, iced tea and coffee grouped into one easy-to-find stop.',
    chips: ['Air balang', 'Juice', 'Iced tea', 'Coffee'],
    order: [1, 3, 0, 2],
  },
  {
    id: 'trucks',
    label: 'Food trucks',
    title: 'The truck lane',
    text: 'Modern street-food formats, quick group orders and late-night second rounds.',
    chips: ['Burgers', 'Loaded fries', 'Wraps', 'Street food'],
    order: [3, 1, 2, 0],
  },
]

const zones = [
  { id: 'food', code: 'A', title: 'Food stalls', detail: 'Main cooked-food lane around the stadium perimeter.' },
  { id: 'trucks', code: 'B', title: 'Food trucks', detail: 'Quick pick-up and modern street food.' },
  { id: 'field', code: 'C', title: 'Iftar field', detail: 'Open picnic-style space for communal buka puasa.' },
  { id: 'prayer', code: 'D', title: 'Prayer', detail: 'Prayer access and facilities that fit naturally into the evening flow.' },
]

const programme = [
  {
    time: '4:00 PM',
    kicker: 'Opening',
    title: 'Bazaar opens',
    copy: 'Food lanes open for early browsing before the field begins to fill.',
    photo: photos.visit,
  },
  {
    time: '6:30 PM',
    kicker: 'Ramadan programme',
    title: 'Community programme',
    copy: 'Talks, reflection and selected Ramadan activities lead into the evening.',
    photo: photos.night,
  },
  {
    time: '7:30 PM',
    kicker: 'The main moment',
    title: 'Communal iftar',
    copy: 'Visitors gather on the historic field and break fast together as one crowd.',
    photo: photos.iftar,
  },
  {
    time: '8:30 PM',
    kicker: 'After Maghrib',
    title: 'Night activities',
    copy: 'The stadium returns to movement with food, family activity and the evening programme.',
    photo: photos.night,
  },
  {
    time: '10:30 PM',
    kicker: 'Final round',
    title: 'Last food run',
    copy: 'One last loop through the stalls before the event winds down for the night.',
    photo: photos.visit,
  },
]

const gallery = [
  { id: 'iftar', photo: photos.iftar, label: 'Iftar on the field', meta: 'Stadium Merdeka · communal iftar' },
  { id: 'night', photo: photos.night, label: 'After Maghrib', meta: 'Stadium Merdeka · after dark' },
  { id: 'visit', photo: photos.visit, label: 'Visitor guide', meta: 'Bazram Merdeka · event information' },
]

const faqs = [
  {
    q: 'What exactly was Bazram Merdeka 2026?',
    a: 'A free-entry Ramadan bazaar and communal iftar experience at Stadium Merdeka, with more than 100 stalls, food trucks, picnic-style buka puasa areas, prayer access and Ramadan programming.',
  },
  {
    q: 'When and where did it run?',
    a: '21 February to 18 March 2026, daily from 4 PM to 11 PM at Stadium Merdeka, Kuala Lumpur.',
  },
  {
    q: 'What is the easiest public transport?',
    a: 'Maharajalela Monorail connects directly to the Stadium Merdeka area. Merdeka MRT is also adjacent, with Plaza Rakyat LRT and Hang Tuah within walking distance.',
  },
  {
    q: 'What house rules should visitors know?',
    a: 'No smoking or vaping, no pets, no littering and no flammable materials. Children must be supervised. Running-track rules also prohibit heels, spike shoes and loitering on the track.',
  },
]

function ResilientImage({ photo, className = '', onClick, loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`image-fallback ${className}`} onClick={onClick}>
        <span>Photo from @bazrammerdeka</span>
        <b>Open original post ↗</b>
      </div>
    )
  }
  return <img className={className} src={photo.src} alt={photo.alt} loading={loading} onError={() => setFailed(true)} onClick={onClick} />
}

function AnimatedFaq({ item, open, onToggle }) {
  const bodyRef = useRef(null)

  useEffect(() => {
    if (!bodyRef.current) return
    gsap.to(bodyRef.current, {
      height: open ? 'auto' : 0,
      opacity: open ? 1 : 0,
      duration: 0.32,
      ease: 'power2.inOut',
      overwrite: true,
    })
  }, [open])

  return (
    <article className={`faq-item magnetic-card ${open ? 'open' : ''}`} data-reveal>
      <button onClick={onToggle} aria-expanded={open}>
        <span>{item.q}</span>
        <b>{open ? '−' : '+'}</b>
      </button>
      <div className="faq-answer-gsap" ref={bodyRef}>
        <p>{item.a}</p>
      </div>
    </article>
  )
}

function App() {
  const root = useRef(null)
  const heroMedia = useRef(null)
  const heroOrbit = useRef(null)
  const navLine = useRef(null)
  const navWrap = useRef(null)
  const galleryModalMedia = useRef(null)
  const gallerySource = useRef(null)
  const [activeNav, setActiveNav] = useState('experience')
  const [activeExperience, setActiveExperience] = useState(0)
  const [activeFood, setActiveFood] = useState('hot')
  const [activeZone, setActiveZone] = useState('field')
  const [activeProgramme, setActiveProgramme] = useState(2)
  const [openFaq, setOpenFaq] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(null)

  const food = useMemo(() => foodTabs.find((item) => item.id === activeFood) ?? foodTabs[0], [activeFood])
  const zone = useMemo(() => zones.find((item) => item.id === activeZone) ?? zones[0], [activeZone])
  const programmeItem = programme[activeProgramme]

  const moveNavLine = (id) => {
    if (!navWrap.current || !navLine.current) return
    const link = navWrap.current.querySelector(`[data-nav="${id}"]`)
    if (!link) return
    const parent = navWrap.current.getBoundingClientRect()
    const rect = link.getBoundingClientRect()
    gsap.to(navLine.current, {
      x: rect.left - parent.left,
      width: rect.width,
      duration: 0.34,
      ease: 'power3.out',
      overwrite: true,
    })
  }

  useEffect(() => {
    moveNavLine(activeNav)
  }, [activeNav])

  useEffect(() => {
    const onResize = () => moveNavLine(activeNav)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeNav])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const lenis = new Lenis({ duration: reduce ? 0 : 1.02, smoothWheel: !reduce })
    lenis.on('scroll', ScrollTrigger.update)

    let raf = 0
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const ctx = gsap.context(() => {
      gsap.set('.page-progress', { transformOrigin: 'left center', scaleX: 0 })
      gsap.to('.page-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.18 },
      })

      ;['experience', 'food', 'programme', 'visit'].forEach((id) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveNav(id),
          onEnterBack: () => setActiveNav(id),
        })
      })

      if (reduce) return

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.site-nav', { y: -22, opacity: 0, duration: 0.65 })
        .from('.hero-kicker', { y: 14, opacity: 0, duration: 0.42 }, '-=.12')
        .from('.hero-title .line > span', { yPercent: 115, duration: 0.82, stagger: 0.08 }, '-=.18')
        .from('.hero-intro, .hero-actions, .scroll-cue', { y: 18, opacity: 0, stagger: 0.08, duration: 0.52 }, '-=.42')
        .from('.hero-media-shell', { x: 36, opacity: 0, scale: 0.965, duration: 0.85 }, '-=.65')
        .from('.hero-media-caption', { y: 18, opacity: 0, duration: 0.45 }, '-=.28')

      gsap.to('.hero-media-image', {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })

      gsap.to('.hero-orbit', {
        yPercent: -12,
        xPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
      })

      gsap.utils.toArray('[data-reveal]').forEach((el, index) => {
        const kind = el.dataset.reveal || 'card'
        if (kind === 'line') {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.72,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 86%' },
          })
        } else if (kind === 'mask') {
          gsap.from(el, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.95,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 84%' },
          })
        } else {
          gsap.from(el, {
            y: 28 + (index % 3) * 3,
            opacity: 0,
            duration: 0.68,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%' },
          })
        }
      })

      experienceSteps.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: `.experience-card[data-index="${index}"]`,
          start: 'top 58%',
          end: 'bottom 42%',
          onEnter: () => setActiveExperience(index),
          onEnterBack: () => setActiveExperience(index),
        })
      })

      gsap.from('.map-pin', {
        scale: 0.72,
        opacity: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: 'back.out(1.45)',
        scrollTrigger: { trigger: '.event-map', start: 'top 80%' },
      })

      if (!coarse) {
        document.querySelectorAll('.magnetic-card').forEach((card) => {
          const qx = gsap.quickTo(card, 'x', { duration: 0.34, ease: 'power3.out' })
          const qy = gsap.quickTo(card, 'y', { duration: 0.34, ease: 'power3.out' })
          const move = (event) => {
            const rect = card.getBoundingClientRect()
            qx(((event.clientX - rect.left) / rect.width - 0.5) * 6)
            qy(((event.clientY - rect.top) / rect.height - 0.5) * 6)
          }
          const leave = () => { qx(0); qy(0) }
          card.addEventListener('pointermove', move)
          card.addEventListener('pointerleave', leave)
          card._bazramMove = move
          card._bazramLeave = leave
        })
      }
    }, root)

    return () => {
      cancelAnimationFrame(raf)
      document.querySelectorAll('.magnetic-card').forEach((card) => {
        if (card._bazramMove) card.removeEventListener('pointermove', card._bazramMove)
        if (card._bazramLeave) card.removeEventListener('pointerleave', card._bazramLeave)
      })
      ctx.revert()
      lenis.destroy()
    }
  }, [])

  const onHeroMove = (event) => {
    if (!heroMedia.current || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = heroMedia.current.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / rect.width - 0.5
    const ny = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(heroMedia.current, { x: nx * 7, y: ny * 5, rotateY: nx * 0.9, rotateX: -ny * 0.7, duration: 0.45, ease: 'power3.out', transformPerspective: 1000 })
    if (heroOrbit.current) gsap.to(heroOrbit.current, { x: -nx * 12, y: -ny * 10, duration: 0.55, ease: 'power3.out' })
  }

  const resetHero = () => {
    if (heroMedia.current) gsap.to(heroMedia.current, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.65, ease: 'power3.out' })
    if (heroOrbit.current) gsap.to(heroOrbit.current, { x: 0, y: 0, duration: 0.65, ease: 'power3.out' })
  }

  const changeExperience = (index) => {
    if (index === activeExperience) return
    const cards = root.current?.querySelectorAll('.experience-card')
    const state = cards ? Flip.getState(cards) : null
    flushSync(() => setActiveExperience(index))
    if (state && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Flip.from(state, { duration: 0.55, ease: 'power3.inOut', absolute: false })
    }
  }

  const changeFood = (id) => {
    if (id === activeFood) return
    const items = root.current?.querySelectorAll('.food-chip')
    const state = items ? Flip.getState(items) : null
    flushSync(() => setActiveFood(id))
    if (state && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Flip.from(state, { duration: 0.48, ease: 'power3.inOut', absolute: false, stagger: 0.025 })
    }
    gsap.fromTo('.food-panel-copy > *', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.36, stagger: 0.045, ease: 'power2.out' })
  }

  const changeZone = (id, event) => {
    setActiveZone(id)
    const target = event.currentTarget
    gsap.fromTo(target, { scale: 1 }, { scale: 1.18, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out' })
    gsap.fromTo('.zone-readout', { y: 10, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.32, ease: 'power2.out' })
  }

  const changeProgramme = (index) => {
    if (index === activeProgramme) return
    setActiveProgramme(index)
    gsap.fromTo('.programme-media-frame', { scale: 0.985, opacity: 0.55 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' })
    gsap.fromTo('.programme-caption > *', { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, stagger: 0.04, ease: 'power2.out' })
  }

  const openGallery = (item, event) => {
    const source = event.currentTarget.querySelector('.gallery-image')
    if (!source) return
    gallerySource.current = source
    const rect = source.getBoundingClientRect()
    flushSync(() => setGalleryOpen(item))
    requestAnimationFrame(() => {
      const media = galleryModalMedia.current
      if (!media) return
      const target = media.getBoundingClientRect()
      gsap.set(media, {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 90,
      })
      gsap.to('.gallery-modal-backdrop', { opacity: 1, duration: 0.28, ease: 'power2.out' })
      gsap.to(media, {
        top: target.top,
        left: target.left,
        width: target.width,
        height: target.height,
        duration: 0.62,
        ease: 'power3.inOut',
        clearProps: 'position,top,left,width,height,zIndex',
      })
      gsap.fromTo('.gallery-modal-caption', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.36, delay: 0.26, ease: 'power3.out' })
    })
  }

  const closeGallery = () => {
    const media = galleryModalMedia.current
    const source = gallerySource.current
    if (!media || !source || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGalleryOpen(null)
      return
    }
    const rect = source.getBoundingClientRect()
    const current = media.getBoundingClientRect()
    gsap.set(media, { position: 'fixed', top: current.top, left: current.left, width: current.width, height: current.height, zIndex: 90 })
    gsap.to('.gallery-modal-caption', { opacity: 0, y: 10, duration: 0.18 })
    gsap.to('.gallery-modal-backdrop', { opacity: 0, duration: 0.3 })
    gsap.to(media, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      duration: 0.52,
      ease: 'power3.inOut',
      onComplete: () => setGalleryOpen(null),
    })
  }

  return (
    <main ref={root}>
      <nav className="site-nav">
        <a className="nav-brand" href="#top"><img src={LOGO} alt="Bazram Merdeka" /></a>
        <div className="nav-links" ref={navWrap}>
          <span className="nav-active-line" ref={navLine} />
          <a href="#experience" data-nav="experience">Experience</a>
          <a href="#food" data-nav="food">Food</a>
          <a href="#programme" data-nav="programme">Programme</a>
          <a href="#visit" data-nav="visit">Visit</a>
        </div>
        <a className="nav-button arrow-button" href="#visit"><span>Visitor guide</span><i>↗</i></a>
        <span className="page-progress" aria-hidden="true" />
      </nav>

      <header className="hero" id="top">
        <div className="hero-cloud cloud-one" />
        <div className="hero-cloud cloud-two" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow hero-kicker">Ramadan at Stadium Merdeka · 2026 edition</span>
            <h1 className="hero-title" aria-label="Where food, faith and heritage come together.">
              <span className="line"><span>Where food,</span></span>
              <span className="line"><span>faith &amp; heritage</span></span>
              <span className="line accent"><span>come together.</span></span>
            </h1>
            <p className="hero-intro">Food around the stadium. Iftar on the field. A Ramadan night framed by one of Kuala Lumpur’s most historic places.</p>
            <div className="hero-actions">
              <a className="primary-btn arrow-button" href="#visit"><span>Plan your visit</span><i>↗</i></a>
              <a className="text-action arrow-button" href="#photo-story"><span>See the photo story</span><i>→</i></a>
            </div>
            <a className="scroll-cue" href="#experience"><span />SCROLL TO EXPLORE</a>
          </div>

          <div className="hero-media-stage">
            <div className="hero-orbit" ref={heroOrbit} />
            <a
              className="hero-media-shell"
              href={photos.iftar.href}
              target="_blank"
              rel="noreferrer"
              ref={heroMedia}
              onPointerMove={onHeroMove}
              onPointerLeave={resetHero}
            >
              <ResilientImage photo={photos.iftar} className="hero-media-image" loading="eager" />
              <div className="hero-media-caption">
                <span className="caption-thumb"><img src={LOGO} alt="" /></span>
                <div><b>Iftar at Stadium Merdeka</b><small>@bazrammerdeka</small></div>
                <span className="caption-count">01 / 03</span>
              </div>
            </a>
          </div>
        </div>
      </header>

      <section className="experience-section section-surface" id="experience">
        <div className="wrap">
          <div className="section-heading split-heading" data-reveal>
            <div><span className="eyebrow">Experience</span><h2>How a Bazram evening unfolds.</h2></div>
            <p>From the first walk through the gates to the last food round, the experience follows a simple rhythm.</p>
          </div>

          <div className="experience-progress" data-reveal="line">
            <span style={{ width: `${((activeExperience + 1) / experienceSteps.length) * 100}%` }} />
          </div>

          <div className="experience-step-row">
            {experienceSteps.map((step, index) => (
              <button className={index === activeExperience ? 'active' : ''} key={step.title} onClick={() => changeExperience(index)}>
                <span>0{index + 1}</span><b>{step.title}</b><small>{step.time}</small>
              </button>
            ))}
          </div>

          <div className="experience-cards">
            {experienceSteps.map((step, index) => (
              <article
                className={`experience-card magnetic-card ${index === activeExperience ? 'active' : ''}`}
                data-index={index}
                key={step.title}
                onClick={() => changeExperience(index)}
                data-reveal
              >
                <div className="experience-image-wrap">
                  <ResilientImage photo={step.photo} className="experience-image" />
                </div>
                <div className="experience-card-copy"><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.copy}</p><i>→</i></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="food-section section-surface" id="food">
        <div className="wrap food-layout">
          <div className="food-sidebar" data-reveal>
            <span className="eyebrow">Food zones</span>
            <h2>What are you craving?</h2>
            <p>Start with a category. The content reorganises without making you hunt through a giant vendor wall.</p>
            <div className="food-tabs">
              <span className="food-tab-marker" style={{ transform: `translateY(${foodTabs.findIndex((item) => item.id === activeFood) * 58}px)` }} />
              {foodTabs.map((item) => (
                <button key={item.id} className={item.id === activeFood ? 'active' : ''} onClick={() => changeFood(item.id)}><span>{item.label}</span><i>↗</i></button>
              ))}
            </div>
          </div>

          <div className="food-stage" data-reveal="mask">
            <div className="food-feature">
              <ResilientImage photo={photos.iftar} className="food-feature-image" />
              <div className="food-panel-copy">
                <span className="photo-label-static">Main food lane</span>
                <h3>{food.title}</h3>
                <p>{food.text}</p>
              </div>
            </div>
            <div className="food-chip-grid">
              {food.chips.map((chip, index) => (
                <article className="food-chip magnetic-card" data-flip-id={`food-chip-${index}`} key={index} style={{ order: food.order[index] }}>
                  <span>0{index + 1}</span><b>{chip}</b><small>{index % 2 ? 'Quick pick-up' : 'Main food lane'}</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="programme section-surface" id="programme">
        <div className="wrap">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Programme</span>
            <h2>Plan the evening around the moments that matter.</h2>
          </div>
          <div className="programme-layout">
            <div className="programme-list" data-reveal>
              <span className="programme-runner" style={{ top: `${activeProgramme * 88 + 20}px` }} />
              {programme.map((item, index) => (
                <button
                  key={item.time}
                  className={`programme-row magnetic-card ${index === activeProgramme ? 'active' : ''}`}
                  onMouseEnter={() => changeProgramme(index)}
                  onClick={() => changeProgramme(index)}
                >
                  <time>{item.time}</time>
                  <span><b>{item.title}</b><small>{item.kicker}</small></span>
                </button>
              ))}
            </div>
            <div className="programme-media" data-reveal="mask">
              <div className="programme-media-frame">
                <ResilientImage photo={programmeItem.photo} className="programme-image" />
              </div>
              <div className="programme-caption"><span>{programmeItem.time}</span><h3>{programmeItem.title}</h3><p>{programmeItem.copy}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-section section-surface" id="layout">
        <div className="wrap">
          <div className="section-heading" data-reveal><span className="eyebrow">Stadium guide</span><h2>Explore Stadium Merdeka.</h2><p>Tap a marker for the parts of the site you actually need during the evening.</p></div>
          <div className="layout-grid">
            <div className="event-map" data-reveal="mask">
              <div className="stadium-ring"><div className="stadium-field">IFTAR FIELD</div></div>
              {zones.map((item, index) => (
                <button className={`map-pin pin-${index + 1} ${activeZone === item.id ? 'active' : ''}`} key={item.id} onClick={(event) => changeZone(item.id, event)} aria-label={item.title}>{item.code}<span className="pin-pulse" /></button>
              ))}
              <div className="map-legend">
                {zones.map((item) => <button key={item.id} onClick={(event) => changeZone(item.id, event)}><span>{item.code}</span>{item.title}</button>)}
              </div>
            </div>
            <aside className="zone-readout magnetic-card" data-reveal>
              <span className="zone-code">{zone.code}</span>
              <span className="eyebrow">Selected zone</span>
              <h3>{zone.title}</h3>
              <p>{zone.detail}</p>
              <a className="text-action arrow-button" href="#visit"><span>Visitor information</span><i>→</i></a>
            </aside>
          </div>
        </div>
      </section>

      <section className="photo-story section-surface" id="photo-story">
        <div className="wrap">
          <div className="section-heading split-heading" data-reveal>
            <div><span className="eyebrow">Photo story</span><h2>A night to share, a stadium to remember.</h2></div>
            <p>Real Bazram stills become an editorial contact sheet. Click a frame to bring it forward.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <button className={`gallery-card gallery-${index + 1} magnetic-card`} key={item.id} onClick={(event) => openGallery(item, event)} data-reveal="mask">
                <ResilientImage photo={item.photo} className="gallery-image" />
                <span className="gallery-label"><b>{item.label}</b><small>{item.meta}</small></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="visit-section section-surface" id="visit">
        <div className="wrap">
          <div className="visit-hero" data-reveal>
            <div><span className="eyebrow">Visitor guide · 2026 archive</span><h2>Plan your visit. Enjoy the experience.</h2><p>Everything practical in one place, without turning the page into a wall of notices.</p></div>
            <div className="visit-facts">
              <span><b>21 Feb — 18 Mar</b><small>Date</small></span>
              <span><b>4 PM — 11 PM</b><small>Hours</small></span>
              <span><b>Stadium Merdeka</b><small>Location</small></span>
              <span><b>Free entry</b><small>Entry</small></span>
            </div>
          </div>

          <div className="visit-grid">
            <article className="visit-card yellow magnetic-card" data-reveal><span>GETTING HERE</span><h3>Rail first.</h3><p>Maharajalela Monorail connects directly to the stadium area. Merdeka MRT is also adjacent.</p></article>
            <article className="visit-card blue magnetic-card" data-reveal><span>PRAYER</span><h3>Built into the evening.</h3><p>Prayer access is part of the experience so visitors can continue the night naturally after iftar.</p></article>
            <article className="visit-card cream magnetic-card" data-reveal><span>FAMILIES</span><h3>Come together.</h3><p>Food, picnic-style iftar and family activity all sit inside one walkable precinct.</p></article>
            <article className="visit-card red magnetic-card" data-reveal><span>HOUSE RULES</span><h3>Respect the stadium.</h3><p>No smoking or vaping, pets, littering or flammable materials. Children must be supervised.</p></article>
          </div>
        </div>
      </section>

      <section className="faq wrap">
        <div className="section-heading" data-reveal><span className="eyebrow">FAQ</span><h2>Before heading over.</h2></div>
        <div className="faq-list">
          {faqs.map((item, index) => <AnimatedFaq key={item.q} item={item} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? -1 : index)} />)}
        </div>
      </section>

      <footer>
        <div className="wrap footer-grid">
          <div><img src={LOGO} alt="Bazram Merdeka" /><p>Ramadan at Stadium Merdeka.</p></div>
          <div className="footer-links"><a href="https://www.instagram.com/bazrammerdeka/" target="_blank" rel="noreferrer">Instagram ↗</a><span>2026 event archive</span><span>An event by 2Cool Productions.</span></div>
        </div>
      </footer>

      {galleryOpen && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={galleryOpen.label}>
          <button className="gallery-modal-backdrop" type="button" onClick={closeGallery} aria-label="Close gallery" />
          <div className="gallery-modal-panel">
            <button className="gallery-close" type="button" onClick={closeGallery} aria-label="Close">×</button>
            <div className="gallery-modal-media" ref={galleryModalMedia}><ResilientImage photo={galleryOpen.photo} className="gallery-modal-image" /></div>
            <div className="gallery-modal-caption"><div><b>{galleryOpen.label}</b><small>{galleryOpen.meta}</small></div><a href={galleryOpen.photo.href} target="_blank" rel="noreferrer">Original post ↗</a></div>
          </div>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
