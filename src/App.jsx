import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Loader from './components/Loader.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Bridge from './components/Bridge.jsx'
import Modules from './components/Modules.jsx'
import Roadmap from './components/Roadmap.jsx'
import Launch from './components/Launch.jsx'
import Footer from './components/Footer.jsx'
import ScrollGauge from './components/ScrollGauge.jsx'

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    document.body.style.overflow = booting ? 'hidden' : ''
  }, [booting])

  return (
    <>
      <AnimatePresence>{booting && <Loader onDone={() => setBooting(false)} />}</AnimatePresence>
      <Nav />
      <main>
        <Hero ready={!booting} />
        <Bridge />
        <Modules />
        <Roadmap />
        <Launch />
      </main>
      <Footer />
      <ScrollGauge />
    </>
  )
}
