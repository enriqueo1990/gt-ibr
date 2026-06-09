import { Link, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useReveal } from '../lib/useReveal'
import { useFetch } from '../lib/hooks'
import { getSeriesWithSermons } from '../lib/api'
import '../design/serie.css'

export default function Serie() {
  useReveal()
  const { slug } = useParams<{ slug: string }>()
  const { data, loading, error } = useFetch(() => getSeriesWithSermons(slug!), [slug])

  if (loading) {
    return (
      <Layout>
        <main>
          <section className="band-indigo">
            <div className="wrap" style={{ paddingTop: 'clamp(36px,5vw,56px)', paddingBottom: 'clamp(40px,5vw,64px)' }}>
              <p className="lead" style={{ color: 'rgba(255,255,255,.8)' }}>Cargando serie…</p>
            </div>
          </section>
        </main>
      </Layout>
    )
  }

  if (error || !data) {
    return (
      <Layout>
        <main>
          <section className="band-indigo">
            <div className="wrap" style={{ paddingTop: 'clamp(36px,5vw,56px)', paddingBottom: 'clamp(40px,5vw,64px)' }}>
              <h1 style={{ fontSize: 'clamp(2rem,4.4vw,3.3rem)' }}>Serie no encontrada</h1>
              <p className="lead" style={{ color: 'rgba(255,255,255,.8)', marginTop: '18px' }}>
                No pudimos encontrar la serie que buscas.
              </p>
              <div style={{ marginTop: '26px' }}>
                <Link className="btn btn-gold" to="/sermones">Volver a sermones</Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    )
  }

  const { series, sermons } = data
  const heroImage = series.series_data.hero_image_url || series.series_data.image_url
  const playlistUrl = sermons[0]?.sermon_data.media.video_youtube || ''

  return (
    <Layout>
      <main>
        {/* SERIE HERO */}
        <section className="band-indigo">
          <div className="wrap" style={{ paddingTop: 'clamp(36px,5vw,56px)', paddingBottom: 'clamp(40px,5vw,64px)' }}>
            <div className="breadcrumb reveal"><Link to="/">Inicio</Link><span>/</span><Link to="/sermones">Sermones</Link><span>/</span><span>{series.name}</span></div>
            <div className="serie-hero">
              <div className="reveal">
                <span className="passage-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 600, padding: '7px 14px', borderRadius: '999px', fontSize: '.9rem', marginBottom: '16px' }}><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h16M4 5v15l8-3 8 3V5" /></svg><span>{series.series_data.state === 'completada' ? 'Completada' : 'En curso'}</span></span>
                <h1 style={{ fontSize: 'clamp(2rem,4.4vw,3.3rem)' }}>{series.name}</h1>
                {series.description && (
                  <p className="lead" style={{ color: 'rgba(255,255,255,.8)', fontSize: 'clamp(1.05rem,1.4vw,1.22rem)', maxWidth: '50ch', marginTop: '18px' }}>{series.description}</p>
                )}
                <div className="serie-stats">
                  {series.series_data.dates && (
                    <span className="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg><b>{series.series_data.dates}</b></span>
                  )}
                  <span className="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z" /></svg><b>{series.count}</b> mensajes</span>
                </div>
                {playlistUrl && (
                  <div style={{ marginTop: '26px' }}>
                    <a className="btn btn-gold" href={playlistUrl} target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12s0-3-.4-4.4a2.6 2.6 0 0 0-1.8-1.8C18.4 5.4 12 5.4 12 5.4s-6.4 0-7.8.4A2.6 2.6 0 0 0 2.4 7.6C2 9 2 12 2 12s0 3 .4 4.4a2.6 2.6 0 0 0 1.8 1.8c1.4.4 7.8.4 7.8.4s6.4 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8C22 15 22 12 22 12Zm-12 2.8V9.2l5 2.8-5 2.8Z" /></svg>
                      Ver en YouTube
                    </a>
                  </div>
                )}
              </div>
              <div className="serie-art reveal" style={{ background: 'linear-gradient(150deg,#D7263D,#8e1828)' }}>
                {heroImage ? (
                  <img src={heroImage} alt={series.name} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="bk">{series.name}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SERMON LIST */}
        <section className="section">
          <div className="wrap">
            <div className="sec-head reveal" style={{ marginBottom: '22px' }}>
              <div>
                <span className="eyebrow">Mensajes de la serie</span>
                <h2 style={{ marginTop: '12px' }}>Todos los sermones</h2>
              </div>
            </div>
            {sermons.length === 0 ? (
              <p className="lead reveal">Aún no hay sermones publicados en esta serie.</p>
            ) : (
              <div className="sermon-list reveal">
                {sermons.map((sermon, i) => (
                  <Link key={sermon.id} className="sermon-row" to={`/sermones/${sermon.slug}`}>
                    <span className="sr-idx">{String(i + 1).padStart(2, '0')}</span>
                    <span className="sr-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
                    <span className="sr-main">
                      <span className="sr-title">{sermon.title}</span>
                      <span className="sr-meta">
                        {sermon.sermon_data.passage && <span className="pass">{sermon.sermon_data.passage}</span>}
                        {sermon.sermon_data.preachers[0]?.name && <span>{sermon.sermon_data.preachers[0].name}</span>}
                      </span>
                    </span>
                    {sermon.sermon_data.duration && (
                      <span className="sr-dur"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{sermon.sermon_data.duration}</span>
                    )}
                    <span className="sr-go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* BACK */}
        <section className="section band" style={{ paddingTop: 'clamp(34px,4vw,52px)' }}>
          <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px' }}>
            <div>
              <span className="eyebrow">Más predicación</span>
              <h2 style={{ marginTop: '10px', fontSize: 'clamp(1.5rem,2.6vw,2rem)' }}>Explora otras series</h2>
            </div>
            <Link className="btn btn-primary" to="/sermones">Ver todas las series
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
