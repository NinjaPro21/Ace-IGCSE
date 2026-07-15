import { Link } from 'react-router-dom'

export function AceFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="ace-footer">
      <nav className="ace-footer__nav" aria-label="Footer">
        <Link to={{ pathname: '/', hash: 'about' }} className="ace-footer__link">
          About
        </Link>
        <Link to={{ pathname: '/', hash: 'privacy' }} className="ace-footer__link">
          Privacy
        </Link>
        <a href="mailto:hello@aceigcse.my" className="ace-footer__link">
          Help
        </a>
      </nav>
      <p className="ace-footer__copy">© {year} AceIGCSE</p>
    </footer>
  )
}
