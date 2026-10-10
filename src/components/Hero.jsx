import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function Starfield() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    let w, h, stars, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const init = () => {
      w = c.offsetWidth
      h = c.offsetHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.round((w * h) / 5200) }, () => ({
        x: Math.random() * w - w / 2,
        y: Math.random() * h - h / 2,
        z: Math.random() * w,
      }))
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(5,7,13,0.35)'
      ctx.fillRect(0, 0, w, h)
      for (const s of stars) {
        s.z -= 1.6
        if (s.z <= 1) {
          s.z = w
          s.x = Math.random() * w - w / 2
          s.y = Math.random() * h - h / 2
        }
        const k = 260 / s.z
        const px = s.x * k + w / 2
        const py = s.y * k + h * 0.42
        if (px < 0 || px > w || py < 0 || py > h) continue
        const r = Math.max(0.3, (1 - s.z / w) * 1.8)
        const warm = s.z < w * 0.18
        ctx.fillStyle = warm ? 'rgba(255,170,110,0.9)' : 'rgba(220,230,255,0.75)'
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    init()
    draw()
    window.addEventListener('resize', init)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', init)
    }
  }, [])
  return <canvas ref={ref} className="starfield" aria-hidden />
}

function Telemetry({ ready }) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!ready) return
    const id = setInterval(() => setT((v) => v + 1), 100)
    return () => clearInterval(id)
  }, [ready])
  const secs = (t / 10).toFixed(1).padStart(5, '0')
  return (
    <div className="telemetry mono">
      <div><span>MISSION</span><b>YAAN-001</b></div>
      <div><span>T+</span><b>{secs}s</b></div>
      <div><span>PAYLOAD</span><b>5 MODULES</b></div>
      <div><span>TARGET</span><b>EVERY ROAD</b></div>
      <div className="tele-ok"><i /> ALL SYSTEMS NOMINAL</div>
    </div>
  )
}


const ORBITS = [
  { id: 'chandra', rx: 292, ry: 64, tilt: -10, dur: 14, begin: -2, label: 'CHANDRAYAAN', kind: 'sat', body: 'moon' },
  { id: 'mangal', rx: 250, ry: 118, tilt: 16, dur: 20, begin: -11, label: 'MANGALYAAN', kind: 'sat', body: 'mars', reverse: true },
  { id: 'yaan', rx: 318, ry: 96, tilt: -3, dur: 10, begin: -6, label: 'YAAN · YOUR CAR', kind: 'car' },
]

function Craft({ kind }) {
  if (kind === 'car')
    return (
      <g className="sat">
        <rect x="-11" y="-5" width="22" height="10" rx="4" fill="#f4efe6" />
        <rect x="-5" y="-9" width="11" height="6" rx="2" fill="#f4efe6" />
        <circle cx="-6" cy="5" r="2.6" fill="#ff7a1a" />
        <circle cx="6" cy="5" r="2.6" fill="#ff7a1a" />
      </g>
    )
  return (
    <g className="sat sat-blue">
      <rect x="-17" y="-4" width="10" height="8" rx="1" fill="#3a6fd8" stroke="#8fb3ff" strokeWidth="0.6" />
      <rect x="7" y="-4" width="10" height="8" rx="1" fill="#3a6fd8" stroke="#8fb3ff" strokeWidth="0.6" />
      <line x1="-7" y1="0" x2="7" y2="0" stroke="#8fb3ff" strokeWidth="0.8" />
      <rect x="-5" y="-5" width="10" height="10" rx="1.5" fill="#d9a441" stroke="#fff3c4" strokeWidth="0.6" />
      <circle cx="0" cy="-7.5" r="2" fill="none" stroke="#f4efe6" strokeWidth="0.8" />
    </g>
  )
}

function Orbit({ o, ready }) {
  const { rx, ry, tilt, id } = o
  const sweep = o.reverse ? 1 : 0
  const d = `M${300 - rx},150 a${rx},${ry} 0 1,${sweep} ${2 * rx},0 a${rx},${ry} 0 1,${sweep} ${-2 * rx},0`
  return (
    <g transform={`rotate(${tilt} 300 150)`}>
      <ellipse cx="300" cy="150" rx={rx} ry={ry} className={`orbit-line orbit-${id}`} />
      <path id={`op-${id}`} d={d} fill="none" />
      {o.body === 'moon' && (
        <g transform={`translate(${300 - rx},150) rotate(${-tilt})`}>
          <circle r="11" fill="url(#hMoon)" />
          <circle cx="-3" cy="2" r="1.8" fill="#9d998f" /><circle cx="4" cy="-3" r="1.3" fill="#9d998f" />
          <text y="24" textAnchor="middle" className="orbit-body">MOON</text>
        </g>
      )}
      {o.body === 'mars' && (
        <g transform={`translate(${300 + rx},150) rotate(${-tilt})`}>
          <circle r="13" fill="url(#hMars)" />
          <path d="M-10,-2 q5,2 10,-1 t9,1" stroke="#8e3418" strokeWidth="1.6" fill="none" />
          <text y="27" textAnchor="middle" className="orbit-body">MARS</text>
        </g>
      )}
      {ready && (
        <g>
          <Craft kind={o.kind} />
          <g transform={`rotate(${-tilt})`}>
            <text y="-15" textAnchor="middle" className={`orbit-tag ${o.kind === 'car' ? 'orbit-tag-hot' : ''}`}>{o.label}</text>
          </g>
          <animateMotion dur={`${o.dur}s`} begin={`${o.begin}s`} repeatCount="indefinite">
            <mpath href={`#op-${id}`} />
          </animateMotion>
        </g>
      )}
    </g>
  )
}

const ico = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
const STORY = [
  { id: 'c', name: 'CHANDRA + YAAN', line: 'carried India to the Moon', icon: <svg viewBox="0 0 24 24" {...ico}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg> },
  { id: 'm', name: 'MANGAL + YAAN', line: 'carried India to Mars', icon: <svg viewBox="0 0 24 24" {...ico}><circle cx="12" cy="12" r="8" /><path d="M5 10q4 2 7 0t7 1M6 15q4-1 7 1t5-1" /></svg> },
  { id: 'y', name: 'YAAN', line: 'carries every car into the future', hot: true, icon: <svg viewBox="0 0 32 20" {...ico}><path d="M2,14 L4,9 Q5,7 8,7 L11,3 H21 L25,7 Q29,7 30,10 V14 Z" /><circle cx="9" cy="15" r="2.5" /><circle cx="23" cy="15" r="2.5" /></svg> },
]

const word = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  show: (i) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: 0.9 + i * 0.12, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] } }),
}

export default function Hero({ ready }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const glyphY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const glyphScale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section id="top" className="hero" ref={ref}>
      <Starfield />
      <div className="hero-grid" aria-hidden />

      <motion.div className="hero-core" style={{ y: glyphY, scale: glyphScale, opacity: fade }}>
        <motion.p className="eyebrow mono" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
          ● LIVE · LAUNCH SEQUENCE INITIATED
        </motion.p>

        <div className="glyph-stage">
          <svg viewBox="0 0 600 300" className="glyph-svg" role="img" aria-label="Yaan">
            <text x="300" y="205" className={`glyph ${ready ? 'glyph-draw' : ''}`}>YAAN</text>
          </svg>
          <svg viewBox="0 0 600 300" className="orbit-svg" aria-hidden>
            <defs>
              <radialGradient id="hMoon" cx="0.35" cy="0.3"><stop offset="0" stopColor="#f1ede4" /><stop offset="1" stopColor="#8d897f" /></radialGradient>
              <radialGradient id="hMars" cx="0.35" cy="0.3"><stop offset="0" stopColor="#f08a5d" /><stop offset="0.6" stopColor="#c2502a" /><stop offset="1" stopColor="#5e1f0c" /></radialGradient>
            </defs>
            {ORBITS.map((o) => <Orbit key={o.id} o={o} ready={ready} />)}
          </svg>
        </div>

        <h1 className="hero-title">
          {['Every', 'vehicle', 'is', 'a', 'mission.'].map((w, i) => (
            <motion.span key={w + i} custom={i} variants={word} initial="hidden" animate={ready ? 'show' : 'hidden'}>
              {w}&nbsp;
            </motion.span>
          ))}
        </h1>

        <motion.div className="hero-story" initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.6, duration: 0.8 }}>
          <div className="story-eq">
            {STORY.map((st, i) => (
              <motion.div key={st.id} className={`story-chip ${st.hot ? 'hot' : ''}`}
                initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.8 + i * 0.18 }}>
                <span className="story-ico">{st.icon}</span>
                <span>
                  <b className="mono">{st.name}</b>
                  <em>{st.line}</em>
                </span>
                {i < STORY.length - 1 && <i className="story-arrow" aria-hidden>→</i>}
              </motion.div>
            ))}
          </div>
          <p className="hero-def">
            In Sanskrit, <em>Yaan</em> simply means <em>vehicle</em> — the thing that carries a mission.
            India wrote it on the craft it sent to the Moon and to Mars. We kept the vehicle, dropped the distance,
            and pointed it at the one that matters most every day: <b>the car already parked outside your home.</b>
          </p>
        </motion.div>

        <motion.div className="hero-cta" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 2 }}>
          <a href="#launch" className="btn">Reserve your launch slot</a>
          <a href="#modules" className="btn btn-ghost">See the 5 modules ↓</a>
        </motion.div>
      </motion.div>

      <Telemetry ready={ready} />
    </section>
  )
}
