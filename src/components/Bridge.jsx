import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

const TODAY = ['No screen, no app', 'Warning lights nobody explains', 'Documents in the glovebox', 'Guesswork on repair bills']
const TOMORROW = ['Talks to your phone', 'Diagnoses itself', 'Every record, digital', 'Fair price, every time']

function Car({ glow }) {
  return (
    <g>
      {glow > 0 && <ellipse cx="0" cy="18" rx="46" ry="6" fill="#ff7a1a" opacity={0.35 * glow} />}
      <path d="M-40,8 L-36,-4 Q-30,-10 -20,-11 L-12,-22 Q-8,-26 0,-26 L16,-26 Q22,-26 26,-20 L32,-11 Q40,-10 42,-2 L42,10 Q42,13 38,13 L-38,13 Q-41,13 -40,8 Z"
        fill={glow > 0.5 ? '#f4efe6' : '#9aa3b5'} />
      <path d="M-10,-20 L-4,-10 L12,-10 L12,-22 L0,-22 Q-6,-22 -10,-20 Z M16,-22 L16,-10 L28,-10 L24,-18 Q22,-22 18,-22 Z" fill="#0b1020" />
      <circle cx="-24" cy="13" r="8" fill="#05070d" stroke="#3a4560" strokeWidth="3" />
      <circle cx="26" cy="13" r="8" fill="#05070d" stroke="#3a4560" strokeWidth="3" />
      <rect x="38" y="-4" width="5" height="4" rx="1" fill={glow > 0.5 ? '#5fd4ff' : '#c9c39a'} />
      {glow > 0.5 && <path d="M43,-2 L90,-14 L90,10 Z" fill="url(#beam)" />}
    </g>
  )
}

export default function Bridge() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const deck = useTransform(scrollYProgress, [0.05, 0.45], [0, 1])
  const carX = useTransform(scrollYProgress, [0.35, 0.92], [150, 850])
  const [p, setP] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', setP)
  const glow = Math.max(0, Math.min(1, (p - 0.55) / 0.25))
  const planks = 14

  return (
    <section id="bridge" className="bridge" ref={ref}>
      <div className="bridge-sticky">
        <div className="section-head bridge-head">
          <p className="code mono">01 // THE BRIDGE</p>
          <h2>Cars can't be upgraded. <b>So we built a bridge.</b></h2>
          <p className="sub">
            Vehicle technology is racing ahead — but most cars on Indian roads will never get a software update.
            Yaan connects the two: the innovation arriving tomorrow, delivered to the car you already own.
          </p>
        </div>

        <svg viewBox="0 0 1000 360" className="bridge-svg" aria-hidden>
          <defs>
            <linearGradient id="beam" x1="0" x2="1">
              <stop offset="0" stopColor="#5fd4ff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#5fd4ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cliffL" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#1a2235" /><stop offset="1" stopColor="#05070d" />
            </linearGradient>
            <linearGradient id="cliffR" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#3a2414" /><stop offset="1" stopColor="#05070d" />
            </linearGradient>
          </defs>

          {/* chasm grid */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={260 + i * 70} y1="250" x2={300 + i * 60} y2="360" className="chasm" />
          ))}

          <path d="M0,230 L250,230 L270,360 L0,360 Z" fill="url(#cliffL)" />
          <path d="M750,230 L1000,230 L1000,360 L730,360 Z" fill="url(#cliffR)" />
          <line x1="0" y1="230" x2="250" y2="230" className="road-edge" />
          <line x1="750" y1="230" x2="1000" y2="230" className="road-edge road-edge-hot" />

          {/* suspension arc */}
          <motion.path d="M250,230 Q500,60 750,230" className="cable" style={{ pathLength: deck }} />
          {Array.from({ length: planks }).map((_, i) => {
            const x = 250 + ((i + 0.5) * 500) / planks
            const t = (x - 250) / 500
            const yArc = (1 - t) * (1 - t) * 230 + 2 * (1 - t) * t * 60 + t * t * 230
            const on = p > 0.05 + (i / planks) * 0.4
            return (
              <g key={i} opacity={on ? 1 : 0.08} style={{ transition: 'opacity .3s' }}>
                <line x1={x} y1={yArc} x2={x} y2="230" className="hanger" />
                <rect x={x - 500 / planks / 2 + 1} y="228" width={500 / planks - 2} height="7" rx="1"
                  className={p * 1000 > x + 40 && p > 0.35 ? 'plank plank-lit' : 'plank'} />
              </g>
            )
          })}

          <motion.g style={{ x: carX, y: 202 }}>
            <Car glow={glow} />
          </motion.g>

          <text x="20" y="270" className="cliff-label mono">TODAY · YOUR CAR</text>
          <text x="980" y="270" className="cliff-label mono hot" textAnchor="end">TOMORROW · INNOVATION</text>
          <text x="500" y="205" className="yaan-label" textAnchor="middle" opacity={Math.min(1, deck.get() * 1.5)}>YAAN</text>
        </svg>

        <div className="bridge-lists">
          <ul className="list-today">
            {TODAY.map((t, i) => (
              <li key={t} style={{ opacity: 1 - glow * 0.6, transitionDelay: `${i * 40}ms` }}><span>✕</span>{t}</li>
            ))}
          </ul>
          <ul className="list-tomorrow">
            {TOMORROW.map((t, i) => (
              <li key={t} className={glow > (i + 1) / 5 ? 'lit' : ''}><span>✓</span>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
