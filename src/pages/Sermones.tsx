import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ImageSlot } from '../components/ImageSlot'
import { useReveal } from '../lib/useReveal'
import { useFetch } from '../lib/hooks'
import { getAllSermons, getAllSeries, getAllPreachers, getAllTopics, getMedios } from '../lib/api'
import '../design/sermones.css'

const initials = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

const FALLBACK_GRADS = [
  'linear-gradient(150deg,#D7263D,#8e1828)',
  'linear-gradient(150deg,#2c4474,#16223c)',
  'linear-gradient(150deg,#F2A900,#b87f00)',
  'linear-gradient(150deg,#1B2A4A,#D7263D)',
]

export default function Sermones() {
  useReveal()

  const sermonsState = useFetch(() => getAllSermons(), [])
  const seriesState = useFetch(() => getAllSeries(), [])
  const preachersState = useFetch(() => getAllPreachers(), [])
  const topicsState = useFetch(() => getAllTopics(), [])
  const medios = useFetch(() => getMedios(), []).data

  const [filtroSerie, setFiltroSerie] = useState<string | null>(null)
  const [filtroPredicador, setFiltroPredicador] = useState<string | null>(null)
  const [filtroTema, setFiltroTema] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const sermones = sermonsState.data ?? []
  const series = seriesState.data ?? []
  const seriesImageMap = useMemo(
    () => Object.fromEntries(series.map((s) => [s.slug, s.series_data.image_url])),
    [series]
  )
  const predicadores = preachersState.data ?? []
  const temas = topicsState.data ?? []

  const loading =
    sermonsState.loading || seriesState.loading || preachersState.loading || topicsState.loading
  const error =
    sermonsState.error || seriesState.error || preachersState.error || topicsState.error

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sermones.filter((sermon) => {
      const sd = sermon.sermon_data
      if (filtroSerie && !sd.series.some((s) => s.slug === filtroSerie)) return false
      if (filtroPredicador && !sd.preachers.some((p) => p.slug === filtroPredicador)) return false
      if (filtroTema && !sd.topics.some((t) => t.slug === filtroTema)) return false
      if (q) {
        const haystack = [
          sermon.title.rendered,
          sd.passage,
          ...sd.preachers.map((p) => p.name),
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [sermones, filtroSerie, filtroPredicador, filtroTema, query])

  return (
    <Layout>
      <main>
        {/* PAGE HERO */}
        <section className="band-indigo">
          <div className="wrap page-hero">
            <div className="breadcrumb reveal"><Link to="/">Inicio</Link><span>/</span>Sermones</div>
            <h1 className="reveal">Serie de <span className="accent">sermones</span></h1>
            <p className="lead reveal">Escuchamos la predicación expositiva de las Escrituras. Creemos que la iglesia necesita la pura Palabra de Dios para crecer en madurez a la imagen de Cristo, exponiendo el mensaje central de cada pasaje y aplicándolo a nuestras vidas hoy.</p>
          </div>
        </section>

        {/* GALLERY */}
        <section className="section">
          <div className="wrap">
            <div className="sec-head reveal" style={{ marginBottom: 26 }}>
              <div>
                <span className="eyebrow">Explora la predicación</span>
                <h2 style={{ marginTop: 12 }}>Busca por serie, libro o predicador</h2>
              </div>
              <a className="link-arrow" href="https://www.youtube.com/@iglesiabiblicareformada3751" target="_blank" rel="noopener" style={{ marginBottom: 8 }}>Canal de YouTube <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M9 7h8v8" /></svg></a>
            </div>

            <div className="reveal">
              <div className="search-bar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                  type="text"
                  placeholder="Buscar por serie, libro o predicador…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* Filtros compactos (dropdowns) */}
              <div className="sermon-filters">
                <div className="sel">
                  <select
                    aria-label="Filtrar por serie"
                    value={filtroSerie ?? ''}
                    onChange={(e) => setFiltroSerie(e.target.value || null)}
                  >
                    <option value="">Todas las series</option>
                    {series.map((s) => (
                      <option key={s.id} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sel">
                  <select
                    aria-label="Filtrar por predicador"
                    value={filtroPredicador ?? ''}
                    onChange={(e) => setFiltroPredicador(e.target.value || null)}
                  >
                    <option value="">Todos los predicadores</option>
                    {predicadores.map((p) => (
                      <option key={p.id} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sel">
                  <select
                    aria-label="Filtrar por tema"
                    value={filtroTema ?? ''}
                    onChange={(e) => setFiltroTema(e.target.value || null)}
                  >
                    <option value="">Todos los temas</option>
                    {temas.map((t) => (
                      <option key={t.id} value={t.slug}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {loading && (
              <p className="placeholder-note" style={{ marginTop: 34 }}>Cargando sermones…</p>
            )}

            {error && !loading && (
              <p className="placeholder-note" style={{ marginTop: 34 }}>No se pudieron cargar los sermones: {error}</p>
            )}

            {!loading && !error && (
              <>
                <div className="sermon-grid">
                  {filtrados.map((sermon, i) => {
                    const sd = sermon.sermon_data
                    const title = sermon.title.rendered
                    const serie = sd.series[0]?.name
                    const serieSlug = sd.series[0]?.slug
                    const preacher = sd.preachers[0]?.name
                    const sub = [sd.passage, sd.date_label].filter(Boolean).join(' · ')
                    const thumbImg = sd.featured_image || (serieSlug ? seriesImageMap[serieSlug] : '') || ''
                    return (
                      <Link key={sermon.id} className="sermon-card" to={`/sermones/${sermon.slug}`}>
                        <div
                          className="sermon-thumb"
                          style={thumbImg ? undefined : { background: FALLBACK_GRADS[i % FALLBACK_GRADS.length] }}
                        >
                          {thumbImg && (
                            <img
                              src={thumbImg}
                              referrerPolicy="no-referrer"
                              alt={title}
                              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                            />
                          )}
                          {!thumbImg && <span className="label">{serie ?? sd.passage}</span>}
                          <span className="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
                        </div>
                        <div className="sermon-meta">
                          {serie && <span className="serie">{serie}</span>}
                          <span className="sub">{sub}</span>
                          <div className="row">
                            {preacher && (
                              <span className="preacher"><span className="av">{initials(preacher)}</span>{preacher}</span>
                            )}
                            <span className="listen">Ver sermón <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {filtrados.length === 0 && (
                  <p className="no-results" style={{ marginTop: 34 }}>No hay sermones que coincidan con los filtros seleccionados.</p>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section band" style={{ paddingTop: 'clamp(40px,5vw,64px)' }}>
          <div className="wrap">
            <div className="visit-grid" style={{ alignItems: 'center' }}>
              <div className="reveal">
                <span className="eyebrow">No te lo pierdas</span>
                <h2 style={{ marginTop: 12, fontSize: 'clamp(1.7rem,3vw,2.4rem)' }}>Acompáñanos cada domingo</h2>
                <p className="muted" style={{ marginTop: 16, maxWidth: '42ch', fontSize: '1.05rem' }}>La predicación de la Palabra es el centro de nuestra reunión. Reunión de oración 10:00 AM · reunión general 10:30 AM.</p>
                <div style={{ marginTop: 26, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link className="btn btn-primary" to="/eventos">Ver horarios <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                  <Link className="btn btn-ghost" to="/contacto">Cómo llegar</Link>
                </div>
              </div>
              <div className="reveal">
                <ImageSlot className="sermons-cta" placeholder="Foto stock sugerida: predicación / púlpito abierto, Biblia y notas · horizontal" src={medios?.sermones_cta} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
