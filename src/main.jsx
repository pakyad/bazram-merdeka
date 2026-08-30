import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Home from './pages/Home.jsx'
import Iftar from './pages/Iftar.jsx'
import FoodPage from './pages/Food.jsx'
import ProgrammePage from './pages/Programme.jsx'
import VisitPage from './pages/Visit.jsx'
import VendorsPage from './pages/Vendors.jsx'
import WorldDemo from './pages/WorldDemo.jsx'
import NotFound from './pages/NotFound.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = path === '/' ? Home
  : path === '/world' ? WorldDemo
  : path === '/iftar' ? Iftar
  : path === '/food' ? FoodPage
  : path === '/programme' ? ProgrammePage
  : path === '/visit' ? VisitPage
  : path === '/vendors' ? VendorsPage
  : NotFound

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Page />
  </ErrorBoundary>
)