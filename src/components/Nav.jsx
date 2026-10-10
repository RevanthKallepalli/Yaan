import { useEffect, useState } from 'react'

const LINKS = [
  { id: 'top', gear: 'P', label: 'Why Yaan' },
  { id: 'bridge', gear: 'R', label: 'The Bridge' },
  { id: 'modules', gear: 'N', label: 'Modules' },
  { id: 'orbit', gear: 'D', label: 'Roadmap' },
]

// Navigation styled as an automatic gear selector: P R N D.
export default function Nav() {
  const [active, setActive] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let cur = null
      for (const l of LINKS) {
        const el = document.getElementById(l.id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) cur = l.id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav-solid' : ''}`}>
      <a href="#top" className="brand" aria-label="Yaan home">
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden><ellipse cx="16" cy="16" rx="14" ry="6" transform="rotate(-25 16 16)" /><circle cx="16" cy="16" r="5" /><circle cx="27" cy="10" r="2.2" /></svg>
        <span className="brand-word">YAAN</span>
      </a>
      <nav className="gears" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} className={`gear ${active === l.id ? 'gear-on' : ''}`}>
            <b>{l.gear}</b>
            <span>{l.label}</span>
          </a>
        ))}
      </nav>
      <a href="#launch" className="btn btn-small">Join launch</a>
    </header>
  )
}
