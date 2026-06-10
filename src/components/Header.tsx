import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useFetch } from '../lib/hooks'
import { getMedios } from '../lib/api'

const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/sermones', label: 'Sermones' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/creencias', label: 'Creencias' },
  { to: '/contacto', label: 'Contacto' },
]
const GIVING = 'https://ibr.churchcenter.com/giving'

export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { data: medios, loading: mediosLoading } = useFetch(getMedios, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // cerrar el menú al cambiar de ruta
  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <>
      <header>
        <div className="wrap nav">
          <Link className="brand" to="/" aria-label="Iglesia Bíblica Reformada">
            {medios?.site_logo_dark
              ? <img src={medios.site_logo_dark} alt="Iglesia Bíblica Reformada" className="brand-logo" />
              : !mediosLoading && <><span className="mark">IBR</span><span className="name">Iglesia Bíblica Reformada<small>Denton, Texas</small></span></>
            }
          </Link>
          <nav className="nav-links">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={isActive(n.to) ? 'active' : undefined}>{n.label}</Link>
            ))}
          </nav>
          <div className="nav-tools">
            <Link className="icon-btn" to="/sermones" aria-label="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            </Link>
            <a className="btn btn-primary" href={GIVING} target="_blank" rel="noopener">Ofrendar</a>
            <button className="icon-btn burger" aria-label="Menú" onClick={() => setOpen((v) => !v)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
      </header>
      <div className={'mobile-menu' + (open ? ' open' : '')}>
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} className={isActive(n.to) ? 'active' : undefined} onClick={() => setOpen(false)}>{n.label}</Link>
        ))}
        <a href={GIVING} target="_blank" rel="noopener" style={{ color: 'var(--accent)' }} onClick={() => setOpen(false)}>Ofrendar →</a>
      </div>
    </>
  )
}
