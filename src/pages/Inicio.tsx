import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ImageSlot } from '../components/ImageSlot'
import { useReveal } from '../lib/useReveal'
import { useFetch } from '../lib/hooks'
import { getAllSeries, getEvents, getMedios } from '../lib/api'
import { formatDate } from '../lib/calendar'
import type { WPEvent } from '../lib/types'
import '../design/inicio.css'

/* Gradiente de fallback para series sin imagen, estable por serie. */
const SERIES_GRADS = [
  'linear-gradient(150deg,#D7263D,#8e1828)',
  'linear-gradient(150deg,#2c4474,#16223c)',
  'linear-gradient(150deg,#F2A900,#b87f00)',
  'linear-gradient(150deg,#1B2A4A,#D7263D)',
]

/* Mes abreviado en español a partir de una fecha "YYYY-MM-DD" (local, sin TZ). */
function eventMonth(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
}

function eventDay(dateStr: string): string {
  if (!dateStr) return ''
  const [, , d] = dateStr.split('-').map(Number)
  return String(d)
}

function eventWhen(ed: WPEvent['gtc_evento_data']): string {
  if (ed.all_day) return 'Todo el día'
  if (ed.start_time) return ed.start_time
  return 'Por confirmar'
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

export default function Inicio() {
  useReveal()

  const seriesState = useFetch(() => getAllSeries(), [])
  const eventsState = useFetch(() => getEvents(), [])
  const mediosState = useFetch(() => getMedios(), [])
  const galeria: Record<string, string> = mediosState.data?.galeria ?? {}
  const heroVideo = mediosState.data?.hero_video

  const upcomingEvents = (eventsState.data ?? [])
    .filter((e) => !e.gtc_evento_data.computed.has_finished)
    .sort((a, b) => a.gtc_evento_data.start_date.localeCompare(b.gtc_evento_data.start_date))
    .slice(0, 3)

  return (
    <Layout>
      <main id="inicio">
        {/* ============ HERO (video) ============ */}
        <section className="hero-v">
          <div className="hero-fallback"></div>
          <div className="hero-sheen"></div>
          <video className="hero-vid" autoPlay muted loop playsInline preload="metadata">
            {heroVideo && <source src={heroVideo} type="video/mp4" />}
          </video>
          <div className="hero-overlay"></div>

          <div className="wrap">
            <div className="reveal">
              <h1 style={{ marginTop: 0 }}>Centrados en la <span className="accent">Palabra</span>, comprometidos con el Evangelio.</h1>
              <p className="lead">Somos una iglesia centrada en la Palabra de Dios y comprometida con comunicar su Gloria por medio del Evangelio en el norte de Texas.</p>
              <div className="schedule-chip">
                <span className="dot"></span>
                <span><b>Domingos</b> · 10:00 AM Oración &nbsp;·&nbsp; 10:30 AM Reunión General</span>
              </div>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#visitanos">
                  Visítanos un domingo
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
                <Link className="btn btn-ghost" to="/sermones">Escuchar un sermón</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============ MISSION BAND ============ */}
        <section className="band mission" id="por-que">
          <div className="wrap inner reveal">
            <span className="eyebrow">¿Por qué aquí?</span>
            <p className="q" style={{ marginTop: 16 }}>¿Por qué una iglesia bíblica <span className="accent">en español</span> en el norte de Texas?</p>
            <p className="body">El área del norte de Texas es una zona estratégica para expandir el evangelio entre los hispanos. Una iglesia fuerte y saludable de habla hispana también podría convertirse en un potencial campo de entrenamiento para futuros misioneros que podrían tener una experiencia de entrenamiento transcultural cercana.</p>
            <div style={{ marginTop: 28 }}><Link className="link-arrow" to="/nosotros">Conoce más sobre nosotros <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link></div>
          </div>
        </section>

        {/* ============ PURPOSE / VISION ============ */}
        <section className="section" id="nosotros">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Nuestra identidad</span>
                <h2 style={{ marginTop: 12 }}>Propósito y visión</h2>
              </div>
              <Link className="link-arrow" to="/nosotros" style={{ marginBottom: 8 }}>Saber más <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            </div>
            <div className="pv-grid">
              <article className="pv-card reveal">
                <span className="num">01</span>
                <div className="bar"></div>
                <h3>Nuestro propósito</h3>
                <p>La Iglesia Bíblica Reformada existe para enseñar y vivir el cristianismo bíblico despertando un genuino interés en el mensaje verdadero y transformador de Cristo en el condado de Denton, sus alrededores y el mundo.</p>
              </article>
              <article className="pv-card reveal">
                <span className="num">02</span>
                <div className="bar"></div>
                <h3>Nuestra visión</h3>
                <p>Queremos ser una iglesia en donde se enseña con claridad la Biblia produciendo un amor genuino entre los miembros y un amor compasivo hacia la comunidad. Nuestro anhelo es que esta enseñanza y este amor sea contagioso reproduciendo más iglesias saludables.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ============ SERMONS ============ */}
        <section className="section band-indigo" id="sermones">
          <div className="wrap">
            <div className="sec-head reveal" style={{ marginBottom: 30 }}>
              <div>
                <span className="eyebrow">Predicación expositiva</span>
                <h2 style={{ marginTop: 12 }}>Serie de sermones</h2>
                <p>Creemos que la iglesia necesita la pura Palabra de Dios para crecer en madurez a la imagen de Cristo. Busca por serie, libro o predicador.</p>
              </div>
              <Link className="link-arrow" to="/sermones" style={{ marginBottom: 8, color: 'var(--gold)' }}>Ver todos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            </div>

            <div className="reveal">
              <div className="search-bar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                <input type="text" placeholder="Buscar por serie, libro o predicador…" />
              </div>
              <div className="filters">
                <button className="chip active" type="button">Todos</button>
                <button className="chip" type="button">Colosenses</button>
                <button className="chip" type="button">1 de Juan</button>
                <button className="chip" type="button">Proverbios</button>
                <button className="chip" type="button">Otros</button>
              </div>
            </div>

            {seriesState.loading && (
              <p className="muted reveal" style={{ marginTop: 8 }}>Cargando series…</p>
            )}
            {seriesState.error && (
              <p className="muted reveal" style={{ marginTop: 8 }}>No se pudieron cargar las series.</p>
            )}

            <div className="sermon-grid">
              {(seriesState.data ?? []).map((s, i) => {
                const img = s.series_data.image_url
                const grad = SERIES_GRADS[i % SERIES_GRADS.length]
                return (
                  <Link key={s.id} className="sermon-card" to={`/series/${s.slug}`}>
                    <div className="sermon-thumb" style={{ background: grad }}>
                      {img && <img src={img} referrerPolicy="no-referrer" alt={s.name} />}
                      {s.series_data.state === 'en_curso' && <span className="label">Serie actual</span>}
                      <span className="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
                    </div>
                    <div className="sermon-meta">
                      <span className="serie">{s.name}</span>
                      <span className="sub">{s.count} mensajes</span>
                      <div className="row">
                        <span className="listen">Ver serie <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ COMMUNITY GALLERY (bento) ============ */}
        <section className="section" id="comunidad">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Vida en comunidad</span>
                <h2 style={{ marginTop: 12 }}>Nuestra familia en la fe</h2>
                <p className="muted" style={{ maxWidth: '48ch', marginTop: 12 }}>Momentos de adoración, comunión y servicio.</p>
              </div>
            </div>
            <div className="bento reveal">
              <ImageSlot className="b1" placeholder="Foto destacada · adoración o comunión" src={galeria.b1} />
              <ImageSlot className="b2" placeholder="Foto · reunión dominical" src={galeria.b2} />
              <ImageSlot className="b3" placeholder="Foto · compañerismo" src={galeria.b3} />
              <ImageSlot className="b4" placeholder="Foto · servicio o estudio" src={galeria.b4} />
              <ImageSlot className="b5" placeholder="Foto · alabanza" src={galeria.b5} />
              <ImageSlot className="b6" placeholder="Foto · bautismos" src={galeria.b6} />
              <ImageSlot className="b7" placeholder="Foto · convivencia" src={galeria.b7} />
            </div>
          </div>
        </section>

        {/* ============ VISIT / SCHEDULE ============ */}
        <section className="section band" id="visitanos">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Te esperamos</span>
                <h2 style={{ marginTop: 12 }}>Visítanos un domingo</h2>
              </div>
            </div>
            <div className="visit-grid">
              <div className="reveal">
                <p className="muted" style={{ fontSize: '1.05rem', maxWidth: '40ch', marginBottom: 14 }}>Nos reunimos cada domingo. Llega unos minutos antes y serás bienvenido — no necesitas nada especial para asistir.</p>
                <div className="schedule-list">
                  <div className="sched-row">
                    <div className="sched-time">10:00 <small style={{ fontSize: '.95rem', fontWeight: 600 }}>AM</small></div>
                    <div className="sched-info"><b>Reunión de oración</b><span>Domingos · Comenzamos juntos en oración</span></div>
                  </div>
                  <div className="sched-row">
                    <div className="sched-time">10:30 <small style={{ fontSize: '.95rem', fontWeight: 600 }}>AM</small></div>
                    <div className="sched-info"><b>Reunión general</b><span>Domingos · Adoración y predicación de la Palabra</span></div>
                  </div>

                </div>
              </div>
              <div className="addr-card reveal">
                <div className="map-embed">
                  <iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=2000+Nottingham+Dr,+Denton,+TX+76209&z=14&output=embed" title="Mapa: 2000 Nottingham Dr, Denton, TX"></iframe>
                </div>
                <div className="addr-body">
                  <div className="addr-line">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    <div className="t"><b>2000 Nottingham Dr</b><small>Denton, TX 76209 · Estados Unidos</small></div>
                  </div>
                  <a className="btn btn-dark" href="https://maps.google.com/maps?q=2000+Nottingham+Dr,+Denton,+TX+76209" target="_blank" rel="noopener" style={{ alignSelf: 'flex-start' }}>
                    Cómo llegar
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ EVENTS ============ */}
        <section className="section" id="eventos">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Vida de la iglesia</span>
                <h2 style={{ marginTop: 12 }}>Próximos eventos</h2>
              </div>
              <Link className="link-arrow" to="/eventos" style={{ marginBottom: 8 }}>Ver calendario <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            </div>
            {eventsState.loading && (
              <p className="muted reveal" style={{ marginTop: 8 }}>Cargando eventos…</p>
            )}
            {eventsState.error && (
              <p className="muted reveal" style={{ marginTop: 8 }}>No se pudieron cargar los eventos.</p>
            )}
            {!eventsState.loading && !eventsState.error && upcomingEvents.length === 0 && (
              <p className="muted reveal" style={{ marginTop: 8 }}>No hay próximos eventos por ahora.</p>
            )}

            <div className="events-grid">
              {upcomingEvents.map((ev) => {
                const ed = ev.gtc_evento_data
                const desc = stripHtml(ev.excerpt.rendered) || stripHtml(ev.content.rendered)
                return (
                  <article key={ev.id} className="event-card reveal" title={formatDate(ed.start_date)}>
                    <div className="date-block"><div className="m">{eventMonth(ed.start_date)}</div><div className="d">{eventDay(ed.start_date)}</div></div>
                    <div className="event-info">
                      <h4 dangerouslySetInnerHTML={{ __html: ev.title.rendered }} />
                      <div className="when"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{eventWhen(ed)}</div>
                      {desc && <p>{desc}</p>}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ GIVE ============ */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="give reveal">
              <div>
                <span className="eyebrow">Ofrendar</span>
                <h2 style={{ marginTop: 12 }}>Tu generosidad sostiene la obra del Evangelio</h2>
                <p>Damos con alegría para que la Palabra siga siendo predicada en Denton y más allá. Ofrenda de forma segura a través de Church Center.</p>
              </div>
              <div className="give-cta">
                <a className="btn btn-gold" href="https://ibr.churchcenter.com/giving" target="_blank" rel="noopener">
                  Ofrendar ahora
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
