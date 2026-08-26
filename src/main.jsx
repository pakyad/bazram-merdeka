import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/Home.jsx'
import Iftar from './pages/Iftar.jsx'
import Food from './pages/Food.jsx'
import Programme from './pages/Programme.jsx'
import Visit from './pages/Visit.jsx'
import Vendors from './pages/Vendors.jsx'
import NotFound from './pages/NotFound.jsx'
import './styles.css'

const META = {
  '/': ['Bazram Merdeka — Stadium Merdeka', 'A free Ramadan bazaar and communal iftar at Stadium Merdeka, Kuala Lumpur. 21 Feb–18 Mar 2026, 4 PM–11 PM.'],
  '/iftar': ['The Iftar Hour — Bazram Merdeka', 'How one evening at Stadium Merdeka slows down, glows, and stops together at Maghrib.'],
  '/food': ['Food — Bazram Merdeka', 'Hot food, sweet treats, cold drinks and food trucks at Bazram Merdeka, Stadium Merdeka.'],
  '/programme': ['Programme — Bazram Merdeka', 'The rhythm of a Bazram Merdeka evening, from first stall to last light.'],
  '/visit': ['Plan your visit — Bazram Merdeka', 'Dates, hours, rail access, prayer and family information for Bazram Merdeka at Stadium Merdeka.'],
  '/vendors': ['Vendors — Bazram Merdeka', 'Book a stall at Bazram Merdeka. From RM1,000 for the 26-day run at Stadium Merdeka.'],
}

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = path === '/' ? Home : path === '/iftar' ? Iftar : path === '/food' ? Food : path === '/programme' ? Programme : path === '/visit' ? Visit : path === '/vendors' ? Vendors : NotFound

const meta = META[path]
if (meta) {
  document.title = meta[0]
  const desc = document.querySelector('meta[name="description"]')
  if (desc) desc.setAttribute('content', meta[1])
}

function ScrollTop() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return null
}

createRoot(document.getElementById('root')).render(<><ScrollTop/><Page/></>)
