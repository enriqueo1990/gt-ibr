import { Link } from 'react-router-dom'
import { useFetch } from '../lib/hooks'
import { getMedios } from '../lib/api'

export function Footer() {
  const { data: medios } = useFetch(getMedios, [])
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="brand">
              {medios?.site_logo_dark
                ? <img src={medios.site_logo_dark} alt="Iglesia Bíblica Reformada" className="brand-logo" />
                : <><span className="mark">IBR</span><span className="name">Iglesia Bíblica Reformada<small>Denton, Texas</small></span></>
              }
            </div>
            <p className="tagline">Somos una iglesia centrada en la Palabra de Dios y comprometida con comunicar su Gloria por medio del Evangelio.</p>
            <div className="socials">
              <a href="https://www.facebook.com/IglesiaBReformada" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.5l.5-3H13v-2c0-.6.4-1 1-1Z" /></svg></a>
              <a href="https://twitter.com/iglebreformada/" target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 4h2.6l-5.7 6.5L21 20h-5.2l-4-5.3L7 20H4.4l6.1-7L3.5 4h5.3l3.6 4.8L17.5 4Zm-.9 14.4h1.4L8.9 5.5H7.4l9.2 12.9Z" /></svg></a>
              <a href="https://www.youtube.com/@iglesiabiblicareformada3751" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3-.4-4.4a2.6 2.6 0 0 0-1.8-1.8C18.4 5.4 12 5.4 12 5.4s-6.4 0-7.8.4A2.6 2.6 0 0 0 2.4 7.6C2 9 2 12 2 12s0 3 .4 4.4a2.6 2.6 0 0 0 1.8 1.8c1.4.4 7.8.4 7.8.4s6.4 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8C22 15 22 12 22 12Zm-12 2.8V9.2l5 2.8-5 2.8Z" /></svg></a>
              <a href="https://www.instagram.com/ibreformada/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg></a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Navegación</h5>
            <Link to="/">Inicio</Link>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/sermones">Sermones</Link>
            <Link to="/eventos">Eventos</Link>
            <Link to="/creencias">Creencias</Link>
            <Link to="/contacto">Contacto</Link>
          </div>
          <div className="foot-col">
            <h5>Comunícate</h5>
            <a href="mailto:iglebiblicareformada@gmail.com">iglebiblicareformada@gmail.com</a>
            <p>2000 Nottingham Dr<br />Denton, TX 76209</p>
            <a href="https://ibr.churchcenter.com/giving" target="_blank" rel="noopener">Ofrendar →</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2024 Iglesia Bíblica Reformada · Denton, TX</span>
          <span>Centrados en la Palabra · Comprometidos con el Evangelio</span>
        </div>
      </div>
    </footer>
  )
}
