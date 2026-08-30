import React, { useState, useRef, useEffect } from 'react';
import { World } from '../world/World.tsx';
import { Nav, Footer } from '../ui';

export const TEST_EXPORT = 'world-demo-loaded';

export default WorldDemo;

export function WorldDemo() {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (playing) {
      let last = performance.now();
      const loop = (now) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        timeRef.current += dt;
        if (progress < 1) {
          setProgress(p => Math.min(1, p + dt * 0.15));
        } else {
          setPlaying(false);
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [playing, progress]);

  return (
    <>
      <Nav />
      <World progress={progress} time={timeRef.current} reducedMotion={reducedMotion.current} />
      <div className="world-ui" style={uiStyles.container}>
        <div style={uiStyles.panel}>
          <h1 style={uiStyles.title}>Bazram Merdeka — Stadium World</h1>
          <p style={uiStyles.desc}>Story Progress: {Math.round(progress * 100)}%</p>

          <div style={uiStyles.sliderWrap}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              onChange={e => { setProgress(Number(e.target.value)); setPlaying(false); }}
              style={uiStyles.slider}
              aria-label="Story progress"
            />
            <div style={uiStyles.markers}>
              {[
                { label: '4 PM', p: 0 },
                { label: 'Golden Hour', p: 0.25 },
                { label: 'Maghrib', p: 0.55 },
                { label: 'Twilight', p: 0.7 },
                { label: 'Night', p: 0.85 },
                { label: 'Eagle', p: 1 },
              ].map(m => (
                <span key={m.label} style={{ ...uiStyles.marker, left: `${m.p * 100}%` }}>
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          <div style={uiStyles.controls}>
            <button
              onClick={() => { setPlaying(!playing); }}
              style={{ ...uiStyles.btn, ...(playing ? uiStyles.btnActive : {}) }}
            >
              {playing ? 'Pause' : 'Play'}
            </button>
            <button onClick={() => { setProgress(0); timeRef.current = 0; setPlaying(false); }} style={uiStyles.btn}>
              Reset
            </button>
            <button onClick={() => { setProgress(0.55); setPlaying(false); }} style={uiStyles.btn}>
              Jump to Maghrib
            </button>
            <button onClick={() => { setProgress(1); setPlaying(false); }} style={uiStyles.btn}>
              Eagle View
            </button>
          </div>

          <div style={uiStyles.segments}>
            <strong>Camera Segments:</strong>
            <ul style={uiStyles.segmentList}>
              <li>0.00–0.20: Approach → Gerbang Utama</li>
              <li>0.20–0.35: Enter concourse</li>
              <li>0.35–0.50: Food lanes walkthrough</li>
              <li>0.50–0.65: Field level → iftar zone</li>
              <li>0.65–0.75: Maghrib pause (sun at horizon)</li>
              <li>0.75–0.90: Rise to eagle view</li>
              <li>0.90–1.00: Eagle orbit</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const uiStyles = {
  container: {
    position: 'relative',
    zIndex: 10,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '24px',
    pointerEvents: 'auto',
  },
  panel: {
    background: 'rgba(255,250,242,0.98)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(36,35,33,0.12)',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '520px',
    margin: '0 auto 24px',
    boxShadow: '0 20px 50px rgba(20,26,31,0.15)',
    width: '100%',
  },
  title: {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '22px',
    fontWeight: 800,
    color: '#242321',
    margin: '0 0 4px',
    letterSpacing: '-0.04em',
  },
  desc: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    color: '#68625d',
    margin: '0 0 20px',
  },
  sliderWrap: {
    position: 'relative',
    marginBottom: '20px',
  },
  slider: {
    width: '100%',
    accentColor: '#ee4429',
  },
  markers: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    fontSize: '11px',
    color: '#68625d',
    fontFamily: 'Manrope, sans-serif',
    fontWeight: 600,
  },
  marker: {
    position: 'absolute',
    top: '-20px',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '16px',
  },
  btn: {
    background: '#ee4429',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 18px',
    fontFamily: 'Manrope, sans-serif',
    fontWeight: 800,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  btnActive: {
    background: '#242321',
    boxShadow: '0 8px 20px rgba(238,68,41,0.4)',
  },
  segments: {
    borderTop: '1px solid rgba(36,35,33,0.1)',
    paddingTop: '16px',
    fontSize: '12px',
    color: '#68625d',
    fontFamily: 'DM Sans, sans-serif',
    lineHeight: 1.8,
  },
  segmentList: {
    margin: '8px 0 0',
    paddingLeft: '18px',
    listStyle: 'disc',
  },
};
