export default function Footer() {
  const odo = '0001024'
  return (
    <footer className="footer">
      <div className="footer-road" aria-hidden><span /></div>
      <div className="footer-inner">
        <div>
          <p className="brand-big">YAAN</p>
          <p className="mono small">The bridge between tomorrow's vehicle tech and today's cars.</p>
        </div>
        <div className="odo mono" aria-label="Odometer">
          <span className="small">ODO</span>
          {odo.split('').map((d, i) => <b key={i}>{d}</b>)}
          <span className="small">KM</span>
        </div>
        <p className="mono small">© {new Date().getFullYear()} Yaan · Made in India 🇮🇳</p>
      </div>
    </footer>
  )
}
