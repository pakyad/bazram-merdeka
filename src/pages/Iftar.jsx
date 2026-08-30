import React, { Suspense, lazy } from 'react'

const IftarScene = lazy(() => import('../iftar/Scene.jsx').then(m => ({ default: m.IftarScene })))

export default function Iftar() {
  return (
    <Suspense fallback={<div className="story" style={{ minHeight: '100vh' }}><header className="st-hero"><div className="story-narrow story-inner"><span className="story-kicker">A Bazram Merdeka story</span><h1>The Iftar Hour.</h1></div></header></div>}>
      <IftarScene />
    </Suspense>
  )
}