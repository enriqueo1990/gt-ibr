import { Link, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { AudioPlayer } from '../components/AudioPlayer'
import { useReveal } from '../lib/useReveal'
import { useFetch } from '../lib/hooks'
import { getSermonBySlug } from '../lib/api'
import { extractYouTubeId } from '../lib/youtube'
import '../design/sermon.css'

/* FASE 5 — datos reales del REST sobre el markup del diseño.
   Se conserva el markup/clases del diseño y sermon.css; lo estático se reemplaza
   por sermon_data. Audio → <AudioPlayer/>, video → embed de YouTube, notas → HTML,
   descargas → links de media. loading / error / not-found contemplados. */
export default function Sermon() {
  useReveal()
  const { slug } = useParams<{ slug: string }>()
  const { data, loading, error } = useFetch(() => getSermonBySlug(slug!), [slug])

  if (loading) {
    return (
      <Layout>
        <main>
          <section className="section">
            <div className="wrap" style={{ paddingTop: 'clamp(40px,5vw,64px)', color: 'var(--muted)' }}>
              Cargando sermón…
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
          <section className="section">
            <div className="wrap" style={{ paddingTop: 'clamp(40px,5vw,64px)' }}>
              <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>Sermón no encontrado</h1>
              <p style={{ color: 'var(--muted)', margin: '12px 0 20px' }}>
                No pudimos encontrar el sermón que buscas.
              </p>
              <Link className="btn btn-primary" to="/sermones">Ver todos los sermones
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>
          </section>
        </main>
      </Layout>
    )
  }

  const sd = data.sermon_data
  const media = sd.media
  const preacher = sd.preachers[0]
  const serie = sd.series[0]
  const youtubeId = media.video_youtube ? extractYouTubeId(media.video_youtube) : null
  const showAudio = sd.computed.has_audio && !!media.audio
  const showNotes = sd.computed.has_notes && !!sd.notes

  return (
    <Layout>
      <main>
        {/* PAGE HERO */}
        <section className="band-indigo">
          <div className="wrap" style={{ paddingTop: 'clamp(36px,5vw,56px)', paddingBottom: 'clamp(30px,4vw,44px)' }}>
            <div className="breadcrumb reveal">
              <Link to="/">Inicio</Link><span>/</span>
              <Link to="/sermones">Sermones</Link><span>/</span>
              {serie && (<><Link to={`/series/${serie.slug}`}><span>{serie.name}</span></Link><span>/</span></>)}
              <span>{data.title}</span>
            </div>
            {serie && (
              <span className="passage-pill reveal" style={{ marginBottom: 16 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h16M4 5v15l8-3 8 3V5" /></svg>
                <span>{serie.name}</span>
              </span>
            )}
            <h1 className="reveal" style={{ fontSize: 'clamp(2rem,4.2vw,3.2rem)', maxWidth: '20ch' }}>{data.title}</h1>
            <div className="detail-meta reveal" style={{ color: 'rgba(255,255,255,.66)' }}>
              {preacher && (
                <span className="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M5 21c0-4 3-6 7-6s7 2 7 6" /></svg><b style={{ color: '#fff' }}>{preacher.name}</b></span>
              )}
              {sd.passage && (
                <span className="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h16M4 5v15l8-3 8 3V5" /></svg><b style={{ color: '#fff' }}>{sd.passage}</b></span>
              )}
              {sd.date_label && (
                <span className="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></svg><b style={{ color: '#fff' }}>{sd.date_label}</b></span>
              )}
              {sd.duration && (
                <span className="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><b style={{ color: '#fff' }}>{sd.duration}</b></span>
              )}
            </div>
          </div>
        </section>

        {/* DETAIL */}
        <section className="section" style={{ paddingTop: 'clamp(40px,5vw,64px)' }}>
          <div className="wrap detail-grid">

            {/* MAIN */}
            <div>
              {youtubeId ? (
                <div className="yt-embed reveal">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={data.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="yt-embed reveal">
                  <div className="yt-fallback">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    <span>Video no disponible</span>
                  </div>
                </div>
              )}

              {showNotes && (
                <div className="notes reveal">
                  <span className="eyebrow">Notas del sermón</span>
                  <h2 style={{ marginTop: 10 }}>{data.title}</h2>
                  <div className="rich" dangerouslySetInnerHTML={{ __html: sd.notes }} />
                </div>
              )}

              {!showNotes && sd.summary && (
                <div className="notes reveal">
                  <span className="eyebrow">Resumen</span>
                  <h2 style={{ marginTop: 10 }}>{data.title}</h2>
                  <div className="rich"><p>{sd.summary}</p></div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="side">
              {showAudio && (
                <div className="side-card reveal">
                  <h4>Escuchar (audio)</h4>
                  <div className="audio-player">
                    <AudioPlayer src={media.audio} downloadName={`${slug}.mp3`} />
                  </div>
                </div>
              )}

              <div className="side-card reveal">
                <h4>Descargas</h4>
                <div className="dl-list">
                  {media.audio && (
                    <a className="dl-item" href={media.audio} target="_blank" rel="noopener" download={`${slug}.mp3`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>
                      Audio MP3 <span className="sz">↓</span>
                    </a>
                  )}
                  {media.pdf && (
                    <a className="dl-item" href={media.pdf} target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></svg>
                      Notas en PDF <span className="sz">↓</span>
                    </a>
                  )}
                  {media.ppt && (
                    <a className="dl-item" href={media.ppt} target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></svg>
                      Presentación <span className="sz">↓</span>
                    </a>
                  )}
                  {media.word && (
                    <a className="dl-item" href={media.word} target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></svg>
                      Documento Word <span className="sz">↓</span>
                    </a>
                  )}
                  {media.spotify && (
                    <a className="dl-item" href={media.spotify} target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
                      Escuchar en Spotify <span className="sz">↗</span>
                    </a>
                  )}
                  {data.link && (
                    <a className="dl-item" href={data.link} target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3-.4-4.4a2.6 2.6 0 0 0-1.8-1.8C18.4 5.4 12 5.4 12 5.4s-6.4 0-7.8.4A2.6 2.6 0 0 0 2.4 7.6C2 9 2 12 2 12s0 3 .4 4.4a2.6 2.6 0 0 0 1.8 1.8c1.4.4 7.8.4 7.8.4s6.4 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8C22 15 22 12 22 12Zm-12 2.8V9.2l5 2.8-5 2.8Z" /></svg>
                      Ver en YouTube <span className="sz">↗</span>
                    </a>
                  )}
                </div>
              </div>

              {sd.topics.length > 0 && (
                <div className="side-card reveal">
                  <h4>Temas</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {sd.topics.map((t) => (
                      <span key={t.id} className="passage-pill" style={{ fontSize: '.82rem', padding: '5px 12px' }}>{t.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="side-card reveal">
                <h4>Detalles</h4>
                <div className="detail-list">
                  {serie && (
                    <div className="dr"><span>Serie</span><b><Link to={`/series/${serie.slug}`}>{serie.name}</Link></b></div>
                  )}
                  {sd.passage && <div className="dr"><span>Pasaje</span><b>{sd.passage}</b></div>}
                  {preacher && <div className="dr"><span>Predicador</span><b>{preacher.name}</b></div>}
                  <div className="dr"><span>Fecha</span><b>{sd.date_label || 'Por confirmar'}</b></div>
                  {sd.duration && <div className="dr"><span>Duración</span><b>{sd.duration}</b></div>}
                </div>
              </div>

              <div className="side-card reveal">
                <h4>Compartir</h4>
                <div className="share">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.link)}`} target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.5l.5-3H13v-2c0-.6.4-1 1-1Z" /></svg></a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(data.link)}&text=${encodeURIComponent(data.title)}`} target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 4h2.6l-5.7 6.5L21 20h-5.2l-4-5.3L7 20H4.4l6.1-7L3.5 4h5.3l3.6 4.8L17.5 4Z" /></svg></a>
                  <a href={`mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.link)}`} aria-label="Correo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* BACK / MORE */}
        <section className="section band" style={{ paddingTop: 'clamp(34px,4vw,52px)' }}>
          <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 18 }}>
            <div>
              <span className="eyebrow">Sigue escuchando</span>
              <h2 style={{ marginTop: 10, fontSize: 'clamp(1.5rem,2.6vw,2rem)' }}>Explora más series de la Palabra</h2>
            </div>
            <Link className="btn btn-primary" to="/sermones">Ver todos los sermones
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
