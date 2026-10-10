import { motion } from 'framer-motion'
import Reveal, { SectionHead } from './Reveal.jsx'
import { QRVisual, SecretVisual, CostVisual, HealthVisual, PassbookVisual } from './ModuleVisuals.jsx'

const MODULES = [
  {
    no: '01',
    name: 'Yaan Tag',
    kicker: 'Smart QR for every vehicle',
    title: 'Blocking a gate? Lights left on? Let the street reach the owner.',
    body: 'A Yaan Tag sits on the windshield. Anyone can scan it and reach the owner on WhatsApp, SMS or a call — without ever seeing their phone number. Wrong parking, an emergency, a door left open: solved in seconds, not hours.',
    points: ['WhatsApp, SMS & masked call', 'Owner number never revealed', 'Emergency contact mode'],
    Visual: QRVisual,
  },
  {
    no: '02',
    name: 'Yaan Spark',
    kicker: 'Classified · Reveal at launch',
    title: 'Teach a ten-year-old car new tricks.',
    body: 'Most cars on our roads have no screen, no app and no voice. Yaan Spark gives them one — quietly, with no rewiring and no workshop visit. How it does that is the one thing we are keeping under wraps until launch day.',
    points: ['No rewiring', 'Works with cars that have no tech', 'Details declassified at launch'],
    Visual: SecretVisual,
    secret: true,
  },
  {
    no: '03',
    name: 'Yaan Price',
    kicker: 'Maintenance price intelligence',
    title: 'Know the fair price before the bill arrives.',
    body: 'Fuel prices in your city, service costs for your exact model, and what a spare part should really cost. Yaan compares every quote against a fair range — so a brake-pad change never becomes a negotiation.',
    points: ['Fuel prices by city', 'Service & labour benchmarks', 'Genuine spare-part pricing'],
    Visual: CostVisual,
  },
  {
    no: '04',
    name: 'Yaan Care',
    kicker: 'Primary health care for your car',
    title: 'A family doctor for the car.',
    body: 'Yaan Care reads your car’s vital signs, explains warning lights in plain language and tells you what is urgent, what can wait and what is fine. Small symptoms get caught before they become breakdowns.',
    points: ['Plain-language diagnosis', 'Health score & alerts', 'What to fix now vs. later'],
    Visual: HealthVisual,
  },
  {
    no: '05',
    name: 'Yaan Passbook',
    kicker: 'The car’s complete record',
    title: 'Every document, every rupee — one passbook.',
    body: 'RC, insurance, PUC, permits, FASTag tolls, fuel bills, service invoices: logged automatically, stored safely and ready to show. Renewal reminders arrive before the challan does — and resale comes with a full history.',
    points: ['Govt documents & renewals', 'Toll, fuel & service bills', 'Resale-ready history'],
    Visual: PassbookVisual,
  },
]

function Module({ m, i }) {
  const flip = i % 2 === 1
  return (
    <article className={`module ${flip ? 'module-flip' : ''} ${m.secret ? 'module-secret' : ''}`} id={`m-${m.no}`}>
      <div className="module-text">
        <Reveal className="module-tag mono">
          <span className="module-no">MODULE {m.no}</span>
          <span className="module-line" />
          <span>{m.kicker}</span>
        </Reveal>
        <Reveal as="h3" delay={0.05} className="module-name">
          {m.name}
        </Reveal>
        <Reveal as="p" delay={0.1} className="module-title">{m.title}</Reveal>
        <Reveal as="p" delay={0.15} className="module-body">{m.body}</Reveal>
        <ul className="module-points">
          {m.points.map((p, k) => (
            <motion.li key={p}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.25 + k * 0.1 }}>
              <i />{p}
            </motion.li>
          ))}
        </ul>
      </div>
      <motion.div className="module-visual"
        initial={{ opacity: 0, scale: 0.92, rotateX: 12 }}
        whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}>
        <m.Visual />
      </motion.div>
    </article>
  )
}

export default function Modules() {
  return (
    <section id="modules" className="section modules">
      <SectionHead
        code="02 // PAYLOAD"
        title={<>One app. <b>Five modules.</b> Every car.</>}
        sub="Like a spacecraft carries instruments, Yaan carries five modules — each built for a real, daily problem of owning a vehicle in India."
      />
      <div className="module-index mono">
        {MODULES.map((m) => (
          <a key={m.no} href={`#m-${m.no}`}><b>{m.no}</b>{m.name}</a>
        ))}
      </div>
      {MODULES.map((m, i) => <Module key={m.no} m={m} i={i} />)}
    </section>
  )
}
