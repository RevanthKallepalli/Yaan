import { motion } from 'framer-motion'

export default function Reveal({ children, delay = 0, y = 40, className, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </M>
  )
}

export function SectionHead({ code, title, sub }) {
  return (
    <div className="section-head">
      <Reveal as="p" className="code mono">{code}</Reveal>
      <Reveal as="h2" delay={0.08}>{title}</Reveal>
      {sub && <Reveal as="p" delay={0.16} className="sub">{sub}</Reveal>}
    </div>
  )
}
