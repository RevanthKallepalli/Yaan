import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Ignition sequence: an RPM ring revs up, then the engine is "ON".
export default function Loader({ onDone }) {
  const [rpm, setRpm] = useState(0)
  const [phase, setPhase] = useState('IGNITION')

  useEffect(() => {
    let raf
    const start = performance.now()
    const dur = 1700
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      // rev up past redline, then settle at idle
      const curve = p < 0.7 ? (p / 0.7) * 7.2 : 7.2 - ((p - 0.7) / 0.3) * 6.3
      setRpm(curve)
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setPhase('ENGINE ON')
        setTimeout(onDone, 450)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  const R = 70
  const C = 2 * Math.PI * R
  const arc = 0.75 // 270° gauge
  const fill = Math.min(rpm / 8, 1) * arc

  return (
    <motion.div
      className="loader"
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
    >
      <svg viewBox="0 0 200 200" className="loader-gauge" aria-hidden>
        <circle cx="100" cy="100" r={R} className="lg-track"
          strokeDasharray={`${C * arc} ${C}`} transform="rotate(135 100 100)" />
        <circle cx="100" cy="100" r={R} className="lg-red"
          strokeDasharray={`${C * arc * 0.18} ${C}`} transform={`rotate(${135 + 270 * 0.82} 100 100)`} />
        <circle cx="100" cy="100" r={R} className="lg-fill"
          strokeDasharray={`${C * fill} ${C}`} transform="rotate(135 100 100)" />
        {Array.from({ length: 9 }).map((_, i) => {
          const a = ((135 + (270 / 8) * i) * Math.PI) / 180
          return (
            <text key={i} x={100 + Math.cos(a) * 52} y={100 + Math.sin(a) * 52 + 4}
              className="lg-num">{i}</text>
          )
        })}
        <text x="100" y="108" className="lg-yaan">YAAN</text>
      </svg>
      <div className="loader-meta mono">
        <span>RPM ×1000 · {rpm.toFixed(1)}</span>
        <span className={phase === 'ENGINE ON' ? 'on' : ''}>{phase}</span>
      </div>
    </motion.div>
  )
}
