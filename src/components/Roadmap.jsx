import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { SectionHead } from './Reveal.jsx'

const ORBITS = [
  { rx: 120, ry: 46, tag: 'ORBIT 1 · LAUNCH', title: 'Cars', body: 'Our primary mission. Hatchbacks to SUVs, new or ten years old.', icon: 'car' },
  { rx: 200, ry: 78, tag: 'ORBIT 2', title: 'Two-wheelers', body: 'Scooters and motorcycles — the largest fleet on Indian roads.', icon: 'bike' },
  { rx: 280, ry: 110, tag: 'ORBIT 3', title: 'Commercial & fleets', body: 'Autos, cabs, trucks and the businesses that run them.', icon: 'truck' },
  { rx: 360, ry: 142, tag: 'ESCAPE VELOCITY', title: 'Every vehicle', body: 'EVs, tractors, buses — one platform for anything that moves.', icon: 'all' },
]

function Icon({ k }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (k === 'car') return <svg viewBox="0 0 32 20" {...s}><path d="M2,14 L4,9 Q5,7 8,7 L11,3 H21 L25,7 Q29,7 30,10 V14 Z" /><circle cx="9" cy="15" r="2.5" /><circle cx="23" cy="15" r="2.5" /></svg>
  if (k === 'bike') return <svg viewBox="0 0 32 20" {...s}><circle cx="7" cy="14" r="4.5" /><circle cx="25" cy="14" r="4.5" /><path d="M7,14 L13,7 H20 L25,14 M13,7 L11,4 H8 M20,7 L22,4" /></svg>
  if (k === 'truck') return <svg viewBox="0 0 32 20" {...s}><path d="M2,4 H19 V14 H2 Z M19,8 H25 L29,11 V14 H19" /><circle cx="8" cy="15" r="2.5" /><circle cx="24" cy="15" r="2.5" /></svg>
  return <svg viewBox="0 0 32 20" {...s}><circle cx="16" cy="10" r="7" /><path d="M2,10 Q16,-2 30,10 Q16,22 2,10" /></svg>
}

export default function Roadmap() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1])
  const [p, setP] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', setP)
  const stage = Math.min(3, Math.floor(p * 4.2))

  // Orbit-raising spiral, like Mangalyaan's manoeuvres around Earth.
  const spiral = useRef(
    (() => {
      let d = ''
      const turns = 3.6
      for (let i = 0; i <= 360; i++) {
        const t = i / 360
        const a = t * turns * Math.PI * 2 - Math.PI / 2
        const rx = 70 + t * 300
        const ry = 26 + t * 120
        const x = 400 + Math.cos(a) * rx
        const y = 180 + Math.sin(a) * ry
        d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1)
      }
      return d
    })()
  ).current

  return (
    <section id="orbit" className="section roadmap" ref={ref}>
      <SectionHead
        code="03 // ORBIT RAISING"
        title={<>Cars first. <b>Then every vehicle.</b></>}
        sub="Mangalyaan didn't fly straight to Mars — it raised its orbit around Earth, step by step, until it had the speed to escape. Yaan follows the same flight plan."
      />
      <div className="orbit-wrap">
        <svg viewBox="0 0 800 360" className="orbit-map" aria-hidden>
          <defs>
            <radialGradient id="earth" cx="0.35" cy="0.35">
              <stop offset="0" stopColor="#ffb27a" />
              <stop offset="0.6" stopColor="#ff7a1a" />
              <stop offset="1" stopColor="#7a2e05" />
            </radialGradient>
          </defs>
          {ORBITS.map((o, i) => (
            <ellipse key={i} cx="400" cy="180" rx={o.rx} ry={o.ry}
              className={`orbit-ring ${i <= stage ? 'on' : ''}`} />
          ))}
          <motion.path d={spiral} className="spiral" style={{ pathLength: draw }} />
          <circle cx="400" cy="180" r="34" fill="url(#earth)" />
          <text x="400" y="184" textAnchor="middle" className="earth-label">YAAN</text>
        </svg>
        <div className="orbit-cards">
          {ORBITS.map((o, i) => (
            <motion.div key={o.title} className={`orbit-card ${i <= stage ? 'on' : ''}`}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
              <span className="oc-icon"><Icon k={o.icon} /></span>
              <p className="mono oc-tag">{o.tag}</p>
              <h4>{o.title}</h4>
              <p>{o.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
