import { useMemo, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

/*
  WHY "YAAN" — one scroll-driven scene.
  1. Chandrayaan leaves Earth, raises its orbit and reaches the Moon   → CHANDRA + YAAN
  2. Mangalyaan does the same, all the way to Mars                       → MANGAL + YAAN
  3. The destinations fade, the shared word lifts off both and merges    → YAAN
  4. It comes back down to Earth: a road appears and a car drives under it.
*/

const W = 1200
const H = 700
const EARTH = { x: 230, y: 455, r: 70 }
const MOON = { x: 560, y: 160, r: 26, orbit: 46 }
const MARS = { x: 1000, y: 270, r: 38, orbit: 62 }
const MERGE = { x: 760, y: 455 }
const ROAD_Y = 640

const clamp = (v) => Math.max(0, Math.min(1, v))
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const lerp = (a, b, t) => a + (b - a) * t

// Orbit-raising spiral around Earth, then a transfer arc to the target, then orbit the target.
function missionPoint(t, target, turns, ctrl) {
  const split = 0.45
  if (t <= split) {
    const k = t / split
    const a = Math.PI / 2 + k * turns * Math.PI * 2
    const r = lerp(EARTH.r + 18, EARTH.r + 62, k)
    return { x: EARTH.x + Math.cos(a) * r, y: EARTH.y + Math.sin(a) * r * 0.62 }
  }
  const aEnd = Math.PI / 2 + turns * Math.PI * 2
  const p0 = { x: EARTH.x + Math.cos(aEnd) * (EARTH.r + 62), y: EARTH.y + Math.sin(aEnd) * (EARTH.r + 62) * 0.62 }
  const p2 = { x: target.x - target.orbit, y: target.y }
  const k = ease((t - split) / (1 - split))
  return {
    x: (1 - k) ** 2 * p0.x + 2 * (1 - k) * k * ctrl.x + k * k * p2.x,
    y: (1 - k) ** 2 * p0.y + 2 * (1 - k) * k * ctrl.y + k * k * p2.y,
  }
}

function craftState(t, extra, target, turns, ctrl) {
  if (t < 1) {
    const a = missionPoint(t, target, turns, ctrl)
    const b = missionPoint(Math.min(1, t + 0.004), target, turns, ctrl)
    return { ...a, rot: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI }
  }
  // parked in orbit around the target
  const ang = Math.PI + extra * Math.PI * 2
  return {
    x: target.x + Math.cos(ang) * target.orbit,
    y: target.y + Math.sin(ang) * target.orbit * 0.5,
    rot: (ang * 180) / Math.PI + 90,
  }
}

function trail(t, target, turns, ctrl) {
  const n = Math.max(2, Math.round(t * 160))
  let d = ''
  for (let i = 0; i <= n; i++) {
    const p = missionPoint((i / n) * t, target, turns, ctrl)
    d += (i ? 'L' : 'M') + p.x.toFixed(1) + ',' + p.y.toFixed(1)
  }
  return d
}

function Spacecraft({ x, y, rot, color = '#ff7a1a', show }) {
  if (!show) return null
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <circle r="16" fill={color} opacity="0.18" />
      <rect x="-22" y="-5" width="14" height="10" rx="1" fill="#3a6fd8" stroke="#8fb3ff" strokeWidth="0.8" />
      <rect x="8" y="-5" width="14" height="10" rx="1" fill="#3a6fd8" stroke="#8fb3ff" strokeWidth="0.8" />
      <line x1="-8" y1="0" x2="8" y2="0" stroke="#8fb3ff" />
      <rect x="-7" y="-7" width="14" height="14" rx="2" fill="#d9a441" stroke="#fff3c4" strokeWidth="0.8" />
      <circle cx="0" cy="-10" r="3" fill="none" stroke="#f4efe6" strokeWidth="1" />
    </g>
  )
}

function Label({ x, y, prefix, meaning, show, dim, highlight }) {
  return (
    <g opacity={show} style={{ transition: 'opacity .2s' }}>
      <text x={x - 4} y={y} textAnchor="end" className="dv-word" opacity={1 - dim * 0.8}>{prefix}</text>
      <text x={x + 4} y={y} className={`dv-word ${highlight ? 'dv-hot' : ''}`} opacity={highlight ? 0.35 + (1 - dim) * 0.65 : 1}>YAAN</text>
      <text x={x} y={y + 26} textAnchor="middle" className="dv-sub" opacity={1 - dim * 0.8}>{meaning}</text>
      {dim > 0.3 && (
        <line x1={x - 4 - prefix.length * 23} y1={y - 12} x2={x - 6} y2={y - 12} className="dv-strike" opacity={dim} />
      )}
    </g>
  )
}

function FlyingToken({ from, m, show }) {
  if (!show) return null
  const k = ease(m)
  const x = lerp(from.x, MERGE.x, k)
  const y = lerp(from.y, MERGE.y, k) - Math.sin(k * Math.PI) * 60
  const s = lerp(1, 2.4, k)
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <text x="0" y="0" textAnchor="middle" className="dv-word dv-hot dv-fly">YAAN</text>
    </g>
  )
}

const STEPS = [
  { tag: '01', title: 'Chandrayaan', line: 'Chandra (Moon) + Yaan (vehicle). The vehicle that took India to the Moon.' },
  { tag: '02', title: 'Mangalyaan', line: 'Mangal (Mars) + Yaan (vehicle). The vehicle that raised its orbit and reached Mars.' },
  { tag: '03', title: 'Yaan', line: 'Drop the destination, keep the vehicle. Yaan is for every road on Earth.' },
]

export default function Etymology() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [p, setP] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', setP)

  const stars = useMemo(() => {
    let s = 11
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    return Array.from({ length: 140 }, () => ({ x: r() * W, y: r() * (ROAD_Y - 30), r: r() * 1.3 + 0.2, o: r() * 0.6 + 0.2 }))
  }, [])

  const t1 = clamp((p - 0.03) / 0.25)
  const t2 = clamp((p - 0.28) / 0.28)
  const dim = clamp((p - 0.57) / 0.05)
  const m = clamp((p - 0.62) / 0.16)
  const road = clamp((p - 0.78) / 0.12)
  const car = ease(clamp((p - 0.84) / 0.12))
  const stage = p < 0.28 ? 0 : p < 0.57 ? 1 : 2

  const MOON_CTRL = { x: 330, y: 120 }
  const MARS_CTRL = { x: 720, y: 520 }
  const c1 = craftState(t1, (p - 0.28) * 3, MOON, 1.5, MOON_CTRL)
  const c2 = craftState(t2, (p - 0.56) * 3, MARS, 2.5, MARS_CTRL)

  const moonLabel = { x: MOON.x, y: MOON.y - 72 }
  const marsLabel = { x: MARS.x, y: MARS.y - 92 }
  const tokenFrom = (l) => ({ x: l.x + 4 + 46, y: l.y })

  return (
    <section id="name" className="derive" ref={ref}>
      <div className="derive-sticky">
        <div className="derive-head">
          <p className="code mono">01 // WHY "YAAN"</p>
          <h2>Two missions. <b>One word.</b></h2>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="derive-svg" role="img"
          aria-label="Chandrayaan travels to the Moon and Mangalyaan to Mars; the shared word Yaan lifts from both names and lands on a road on Earth.">
          <defs>
            <radialGradient id="dvEarth" cx="0.35" cy="0.3">
              <stop offset="0" stopColor="#7cc8ff" />
              <stop offset="0.55" stopColor="#1f5fae" />
              <stop offset="1" stopColor="#0a1c3a" />
            </radialGradient>
            <radialGradient id="dvMoon" cx="0.35" cy="0.3">
              <stop offset="0" stopColor="#f1ede4" /><stop offset="1" stopColor="#8d897f" />
            </radialGradient>
            <radialGradient id="dvMars" cx="0.35" cy="0.3">
              <stop offset="0" stopColor="#f08a5d" /><stop offset="0.6" stopColor="#c2502a" /><stop offset="1" stopColor="#5e1f0c" />
            </radialGradient>
            <linearGradient id="dvBeam" x1="0" x2="1">
              <stop offset="0" stopColor="#5fd4ff" stopOpacity="0.7" /><stop offset="1" stopColor="#5fd4ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#dfe6ff" opacity={s.o} />)}

          {/* bodies */}
          <ellipse cx={EARTH.x} cy={EARTH.y} rx={EARTH.r + 62} ry={(EARTH.r + 62) * 0.62} className="dv-orbit" />
          <ellipse cx={MOON.x} cy={MOON.y} rx={MOON.orbit} ry={MOON.orbit * 0.5} className="dv-orbit" opacity={t1 > 0.9 ? 1 : 0.3} />
          <ellipse cx={MARS.x} cy={MARS.y} rx={MARS.orbit} ry={MARS.orbit * 0.5} className="dv-orbit" opacity={t2 > 0.9 ? 1 : 0.3} />

          <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r + 10} fill="#5fd4ff" opacity={0.08 + road * 0.15} />
          <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="url(#dvEarth)" />
          <path d={`M${EARTH.x - 50},${EARTH.y - 30} q20,-14 40,-4 t30,10 M${EARTH.x - 40},${EARTH.y + 20} q24,10 50,-6`} stroke="#3fae6b" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7" />
          <text x={EARTH.x} y={EARTH.y + EARTH.r + 30} textAnchor="middle" className="dv-body">EARTH</text>

          <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill="url(#dvMoon)" />
          <circle cx={MOON.x - 8} cy={MOON.y + 5} r="4" fill="#9d998f" />
          <circle cx={MOON.x + 9} cy={MOON.y - 7} r="3" fill="#9d998f" />
          <text x={MOON.x} y={MOON.y + MOON.r + 46} textAnchor="middle" className="dv-body">MOON</text>

          <circle cx={MARS.x} cy={MARS.y} r={MARS.r} fill="url(#dvMars)" />
          <path d={`M${MARS.x - 30},${MARS.y - 6} q15,6 30,-2 t28,4`} stroke="#8e3418" strokeWidth="4" fill="none" />
          <text x={MARS.x} y={MARS.y + MARS.r + 52} textAnchor="middle" className="dv-body">MARS</text>

          {/* trajectories */}
          {t1 > 0 && <path d={trail(t1, MOON, 1.5, MOON_CTRL)} className="dv-trail" />}
          {t2 > 0 && <path d={trail(t2, MARS, 2.5, MARS_CTRL)} className="dv-trail dv-trail-2" />}

          <Spacecraft {...c1} show={t1 > 0} />
          <Spacecraft {...c2} show={t2 > 0} color="#5fd4ff" />

          {/* mission names */}
          <Label {...moonLabel} prefix="CHANDRA" meaning="MOON  +  VEHICLE" show={clamp((t1 - 0.85) / 0.15)} dim={dim} highlight={dim > 0} />
          <Label {...marsLabel} prefix="MANGAL" meaning="MARS  +  VEHICLE" show={clamp((t2 - 0.85) / 0.15)} dim={dim} highlight={dim > 0} />

          {/* the shared word lifts off both names and merges */}
          {m > 0 && m < 1 && <path d={`M${tokenFrom(moonLabel).x},${tokenFrom(moonLabel).y} Q${MERGE.x - 120},${MERGE.y - 160} ${MERGE.x},${MERGE.y}`} className="dv-link" />}
          {m > 0 && m < 1 && <path d={`M${tokenFrom(marsLabel).x},${tokenFrom(marsLabel).y} Q${MERGE.x + 120},${MERGE.y - 160} ${MERGE.x},${MERGE.y}`} className="dv-link" />}
          <FlyingToken from={tokenFrom(moonLabel)} m={m} show={m > 0} />
          <FlyingToken from={tokenFrom(marsLabel)} m={m} show={m > 0 && m < 1} />
          {m >= 1 && (
            <g>
              <text x={MERGE.x} y={MERGE.y + 44} textAnchor="middle" className="dv-sub dv-sub-hot">VEHICLE · FOR EVERY ROAD</text>
            </g>
          )}

          {/* back on Earth: a road and a car */}
          <line x1="0" y1={ROAD_Y} x2={W * road} y2={ROAD_Y} className="dv-road" />
          <line x1="0" y1={ROAD_Y + 14} x2={W * road} y2={ROAD_Y + 14} className="dv-lane" />
          {car > 0 && (
            <g transform={`translate(${lerp(-80, MERGE.x, car)},${ROAD_Y - 14})`}>
              <ellipse cx="0" cy="14" rx="40" ry="5" fill="#ff7a1a" opacity="0.35" />
              <path d="M-38,8 L-34,-3 Q-28,-9 -19,-10 L-11,-20 Q-7,-24 0,-24 L15,-24 Q21,-24 25,-18 L30,-10 Q38,-9 40,-2 L40,9 Q40,12 36,12 L-36,12 Q-39,12 -38,8 Z" fill="#f4efe6" />
              <path d="M-9,-18 L-4,-9 L11,-9 L11,-20 L0,-20 Q-5,-20 -9,-18 Z M15,-20 L15,-9 L26,-9 L22,-16 Q20,-20 16,-20 Z" fill="#0b1020" />
              <circle cx="-22" cy="12" r="7" fill="#05070d" stroke="#3a4560" strokeWidth="3" />
              <circle cx="24" cy="12" r="7" fill="#05070d" stroke="#3a4560" strokeWidth="3" />
              <path d="M40,-1 L110,-14 L110,12 Z" fill="url(#dvBeam)" />
              <line x1="0" y1="-30" x2="0" y2={MERGE.y + 60 - (ROAD_Y - 14)} className="dv-link" opacity={car} />
            </g>
          )}
        </svg>

        <ol className="derive-steps">
          {STEPS.map((s, i) => (
            <li key={s.tag} className={i === stage ? 'on' : i < stage ? 'done' : ''}>
              <span className="mono">{s.tag}</span>
              <div>
                <h4>{s.title}</h4>
                <p>{s.line}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
