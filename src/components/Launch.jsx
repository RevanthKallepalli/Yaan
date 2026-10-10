import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from './Reveal.jsx'

export default function Launch() {
  const [state, setState] = useState('idle') // idle | starting | done
  const [form, setForm] = useState({ name: '', contact: '', vehicle: 'Car' })

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.contact) return
    setState('starting')
    // No backend yet — wire this to your API / Supabase / Google Form.
    setTimeout(() => setState('done'), 1600)
  }

  return (
    <section id="launch" className="section launch">
      <div className="launch-inner">
        <div>
          <Reveal as="p" className="code mono">04 // LAUNCH WINDOW</Reveal>
          <Reveal as="h2" delay={0.05}>Your car's mission <b>starts here.</b></Reveal>
          <Reveal as="p" delay={0.1} className="sub">
            Join the first crew. Early members get a free Yaan Tag and first access to Yaan Spark when it's declassified.
          </Reveal>
          <Reveal delay={0.15} className="countdown mono">
            {[['∞', 'CARS WAITING'], ['05', 'MODULES'], ['01', 'APP']].map(([n, l]) => (
              <div key={l}><b>{n}</b><span>{l}</span></div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1} className="console">
          <AnimatePresence mode="wait">
            {state !== 'done' ? (
              <motion.form key="f" onSubmit={submit} exit={{ opacity: 0, y: -20 }} className="console-form">
                <label>
                  <span className="mono">CREW NAME</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                </label>
                <label>
                  <span className="mono">COMMS CHANNEL</span>
                  <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone or email" required />
                </label>
                <label>
                  <span className="mono">VEHICLE CLASS</span>
                  <div className="seg">
                    {['Car', 'Two-wheeler', 'Commercial'].map((v) => (
                      <button type="button" key={v} className={form.vehicle === v ? 'on' : ''} onClick={() => setForm({ ...form, vehicle: v })}>{v}</button>
                    ))}
                  </div>
                </label>
                <div className="ignite-row">
                  <button type="submit" className={`ignite ${state === 'starting' ? 'firing' : ''}`} aria-label="Engine start — join waitlist">
                    <span className="ignite-ring" />
                    <span className="ignite-txt mono">{state === 'starting' ? 'STARTING' : <>ENGINE<br />START</>}</span>
                  </button>
                  <p className="mono ignite-hint">Press to join the waitlist</p>
                </div>
              </motion.form>
            ) : (
              <motion.div key="d" className="console-done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <svg viewBox="0 0 120 120" aria-hidden>
                  <motion.circle cx="60" cy="60" r="50" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
                  <motion.path d="M38,62 L54,77 L84,45" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }} />
                </svg>
                <h3>Mission registered, {form.name.split(' ')[0]}.</h3>
                <p className="mono">CLASS: {form.vehicle.toUpperCase()} · STATUS: ON THE PAD</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
