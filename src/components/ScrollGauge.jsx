import { useState } from 'react'
import { useScroll, useSpring, useMotionValueEvent, motion, useTransform } from 'framer-motion'

// A fixed speedometer: page scroll progress = speed.
export default function ScrollGauge() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 20 })
  const rot = useTransform(smooth, [0, 1], [-120, 120])
  const [kmh, setKmh] = useState(0)
  useMotionValueEvent(smooth, 'change', (v) => setKmh(Math.round(v * 180)))

  return (
    <div className="gauge" aria-hidden>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" className="g-track" />
        {Array.from({ length: 13 }).map((_, i) => {
          const a = ((-210 + i * 20) * Math.PI) / 180
          return <line key={i} x1={50 + Math.cos(a) * 34} y1={50 + Math.sin(a) * 34} x2={50 + Math.cos(a) * 40} y2={50 + Math.sin(a) * 40} className={i > 9 ? 'g-tick red' : 'g-tick'} />
        })}
        <motion.g style={{ rotate: rot }}>
          {/* invisible disc keeps the group's box centred on the hub */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="none" />
          <line x1="50" y1="50" x2="50" y2="16" className="g-needle" />
        </motion.g>
        <circle cx="50" cy="50" r="4" className="g-hub" />
      </svg>
      <span className="mono">{kmh}<small>km/h</small></span>
    </div>
  )
}
