import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

function Frame({ label, children, className = '' }) {
  return (
    <div className={`hud ${className}`}>
      <div className="hud-bar mono">
        <span><i className="dot" /> {label}</span>
        <span className="hud-dots"><i /><i /><i /></span>
      </div>
      <div className="hud-body">{children}</div>
      <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
    </div>
  )
}

/* ---------------- 01 · QR ---------------- */
function useQR(n = 21) {
  return useMemo(() => {
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    const cells = []
    const finder = (x, y) =>
      [[0, 0], [n - 7, 0], [0, n - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7)
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) if (!finder(x, y) && rnd() > 0.52) cells.push([x, y])
    return cells
  }, [n])
}

export function QRVisual() {
  const cells = useQR()
  const finders = [[0, 0], [14, 0], [0, 14]]
  return (
    <Frame label="YAAN TAG · SCAN EVENT">
      <div className="qr-scene">
        <div className="windshield">
          <div className="qr-sticker">
            <svg viewBox="-1 -1 23 23" className="qr">
              {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)}
              {finders.map(([x, y]) => (
                <g key={`${x}${y}`}>
                  <rect x={x + 0.5} y={y + 0.5} width="6" height="6" fill="none" strokeWidth="1" className="qr-f" />
                  <rect x={x + 2} y={y + 2} width="3" height="3" />
                </g>
              ))}
            </svg>
            <span className="qr-beam" />
            <span className="qr-cap mono">SCAN TO REACH OWNER</span>
          </div>
        </div>
        <div className="phone">
          <div className="phone-notch" />
          <p className="mono phone-head">MH 12 •• •• 42</p>
          <div className="bubble b1">Your car is blocking my gate 🙏</div>
          <div className="bubble b2 me">Coming in 2 min — thanks!</div>
          <div className="phone-actions">
            <span className="act wa">WhatsApp</span>
            <span className="act sms">SMS</span>
            <span className="act call">Call</span>
          </div>
          <p className="mono phone-foot">🔒 number masked</p>
        </div>
      </div>
    </Frame>
  )
}

/* ---------------- 02 · SECRET ---------------- */
export function SecretVisual() {
  const [hex, setHex] = useState('')
  useEffect(() => {
    const id = setInterval(() => {
      setHex(Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')).join(' '))
    }, 120)
    return () => clearInterval(id)
  }, [])
  return (
    <Frame label="YAAN SPARK · CLEARANCE REQUIRED" className="hud-secret">
      <div className="secret">
        <svg viewBox="0 0 320 130" className="secret-car" aria-hidden>
          <path d="M20,95 L30,70 Q40,58 70,55 L105,30 Q115,22 135,22 L200,22 Q215,22 228,32 L258,55 Q290,58 300,75 L302,95 Z" className="ghost-car" />
          <circle cx="80" cy="98" r="16" className="ghost-car" />
          <circle cx="245" cy="98" r="16" className="ghost-car" />
          <circle cx="160" cy="70" r="5" className="pulse-core" />
          <circle cx="160" cy="70" r="5" className="pulse-ring" />
          <circle cx="160" cy="70" r="5" className="pulse-ring r2" />
        </svg>
        <div className="secret-stream mono">{hex}</div>
        <div className="redacted">
          <p>Yaan Spark connects through <span className="bar w1" /> and reads <span className="bar w2" /></p>
          <p>without any <span className="bar w3" />. Fits in <span className="bar w4" /> seconds.</p>
        </div>
        <motion.div className="stamp"
          initial={{ scale: 2.4, opacity: 0, rotate: -24 }}
          whileInView={{ scale: 1, opacity: 1, rotate: -12 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 14 }}>
          CLASSIFIED
        </motion.div>
      </div>
    </Frame>
  )
}

/* ---------------- 03 · COST ---------------- */
function Flap({ value, go, delay }) {
  const [shown, setShown] = useState(value.replace(/[0-9]/g, '0'))
  useEffect(() => {
    if (!go) return
    let i = 0
    const t0 = setTimeout(() => {
      const id = setInterval(() => {
        i++
        if (i > 12) {
          setShown(value)
          clearInterval(id)
        } else {
          setShown(value.replace(/[0-9]/g, () => Math.floor(Math.random() * 10)))
        }
      }, 55)
    }, delay)
    return () => clearTimeout(t0)
  }, [go, value, delay])
  return (
    <span className="flaps">
      {shown.split('').map((c, k) => <span key={k} className={/[0-9]/.test(c) ? 'flap' : 'flap-sep'}>{c}</span>)}
    </span>
  )
}

const ROWS = [
  ['PETROL', '/L', '104.21'],
  ['DIESEL', '/L', '92.15'],
  ['CNG', '/KG', '76.50'],
  ['GENERAL SERVICE', '', '4,850'],
  ['BRAKE PADS · FRONT', '', '2,640'],
]

export function CostVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <Frame label="YAAN PRICE · PRICE BOARD">
      <div className="board" ref={ref}>
        {ROWS.map(([k, u, v], i) => (
          <div className="board-row" key={k}>
            <span className="mono board-k">{k}</span>
            <span className="board-v mono">₹ <Flap value={v} go={inView} delay={i * 180} /> <em>{u}</em></span>
          </div>
        ))}
        <div className="fair">
          <div className="mono fair-head"><span>CLUTCH PLATE · QUOTE CHECK</span><span className="warn">OVERPRICED</span></div>
          <div className="fair-track">
            <span className="fair-band" />
            <motion.span className="fair-pin" initial={{ left: '8%' }} animate={inView ? { left: '97.5%' } : {}} transition={{ delay: 1.2, duration: 1.4, ease: [0.3, 0.7, 0.2, 1] }}>
              <b className="mono">Quoted ₹7,900</b>
            </motion.span>
          </div>
          <div className="mono fair-scale"><span>₹4k</span><span>fair ₹5.2k–6.1k</span><span>₹8k</span></div>
        </div>
        <p className="mono note">Illustrative values · live data in app</p>
      </div>
    </Frame>
  )
}

/* ---------------- 04 · HEALTH ---------------- */
function Counter({ to, go }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!go) return
    const c = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [go, to])
  return v
}

const VITALS = [
  ['Engine', 'Healthy', 'ok'],
  ['Battery', '12.1V · check soon', 'warn'],
  ['Coolant', 'Normal', 'ok'],
  ['Brakes', 'Service in ~1,800 km', 'warn'],
]

export function HealthVisual() {
  const ref = useRef(null)
  const go = useInView(ref, { once: true, margin: '-60px' })
  const R = 46
  const C = 2 * Math.PI * R
  return (
    <Frame label="YAAN CARE · VITALS">
      <div className="health" ref={ref}>
        <div className="health-top">
          <svg viewBox="0 0 120 220" className="car-top" aria-hidden>
            <rect x="20" y="10" width="80" height="200" rx="34" className="ct-body" />
            <rect x="30" y="58" width="60" height="34" rx="8" className="ct-glass" />
            <rect x="30" y="140" width="60" height="26" rx="8" className="ct-glass" />
            {[[14, 46], [106, 46], [14, 170], [106, 170]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 6} y={y - 14} width="12" height="28" rx="4" className="ct-tyre" />)}
            <circle cx="60" cy="32" r="9" className="zone ok" />
            <circle cx="86" cy="30" r="6" className="zone warn" />
            <circle cx="22" cy="46" r="6" className="zone warn d2" />
          </svg>
          <div className="score">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={R} className="score-track" />
              <motion.circle cx="60" cy="60" r={R} className="score-fill"
                strokeDasharray={C} initial={{ strokeDashoffset: C }}
                animate={go ? { strokeDashoffset: C * (1 - 0.86) } : {}} transition={{ duration: 1.8, ease: 'easeOut' }}
                transform="rotate(-90 60 60)" />
            </svg>
            <div className="score-num"><b><Counter to={86} go={go} /></b><span className="mono">HEALTH</span></div>
          </div>
        </div>
        <svg viewBox="0 0 400 50" className="ecg" preserveAspectRatio="none" aria-hidden>
          <path d="M0,25 L90,25 L100,25 L108,8 L116,42 L124,25 L200,25 L210,25 L218,4 L226,46 L234,25 L310,25 L320,25 L328,10 L336,40 L344,25 L400,25" />
        </svg>
        <ul className="vitals">
          {VITALS.map(([k, v, s], i) => (
            <motion.li key={k} initial={{ opacity: 0, y: 8 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 + i * 0.15 }}>
              <i className={s} /><span>{k}</span><em className="mono">{v}</em>
            </motion.li>
          ))}
        </ul>
      </div>
    </Frame>
  )
}

/* ---------------- 05 · PASSBOOK ---------------- */
const ENTRIES = [
  ['02 OCT', 'FASTag · Khed Shivapur toll', '− 120', 'toll'],
  ['29 SEP', 'Fuel · 32.4 L petrol', '− 3,376', 'fuel'],
  ['18 SEP', 'Periodic service · 40,000 km', '− 4,850', 'svc'],
  ['04 SEP', 'Insurance renewed · valid to 2027', 'DOC', 'doc'],
  ['21 AUG', 'PUC certificate uploaded', 'DOC', 'doc'],
]

export function PassbookVisual() {
  const ref = useRef(null)
  const go = useInView(ref, { once: true, margin: '-60px' })
  return (
    <Frame label="YAAN PASSBOOK · MH 12 •• 42">
      <div className="passbook" ref={ref}>
        <div className="docs">
          {['RC', 'INSURANCE', 'PUC', 'PERMIT', 'LICENCE'].map((d, i) => (
            <motion.span key={d} className="doc-chip mono"
              initial={{ opacity: 0, y: -30, rotate: -10 + i * 5 }}
              animate={go ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 16 }}>
              {d}
            </motion.span>
          ))}
        </div>
        <div className="ledger">
          <div className="ledger-head mono"><span>DATE</span><span>ENTRY</span><span>₹</span></div>
          {ENTRIES.map(([d, e, a, t], i) => (
            <motion.div key={e} className={`ledger-row ${t}`}
              initial={{ opacity: 0, x: 30 }} animate={go ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.12 }}>
              <span className="mono">{d}</span><span>{e}</span><span className="mono">{a}</span>
            </motion.div>
          ))}
        </div>
        <motion.div className="alert mono" initial={{ opacity: 0, scale: 0.9 }} animate={go ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.4 }}>
          ⚠ PUC expires in 12 days — renew before a challan
        </motion.div>
        <motion.div className="verified mono" initial={{ opacity: 0, scale: 1.8, rotate: 10 }} animate={go ? { opacity: 1, scale: 1, rotate: -8 } : {}} transition={{ delay: 1.1, type: 'spring' }}>
          VERIFIED
        </motion.div>
      </div>
    </Frame>
  )
}
