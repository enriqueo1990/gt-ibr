import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useReveal } from '../lib/useReveal'
import { useFetch } from '../lib/hooks'
import { getEvents } from '../lib/api'
import { getGoogleCalUrl, getICSContent } from '../lib/calendar'
import type { WPEvent } from '../lib/types'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

/** Mes abreviado y día a partir de un 'YYYY-MM-DD'. */
function dateParts(dateStr: string): { m: string; d: string } {
  if (!dateStr) return { m: '', d: '' }
  const [, m, d] = dateStr.split('-').map(Number)
  return { m: MESES[(m || 1) - 1] ?? '', d: String(d || '') }
}

/** Horario legible: 'Todo el día', 'HH:MM–HH:MM', 'HH:MM' o texto discreto si no hay datos. */
function whenLabel(ev: WPEvent): string {
  const ed = ev.gtc_evento_data
  if (ed.all_day) return 'Todo el día'
  if (ed.start_time && ed.end_time) return `${ed.start_time}–${ed.end_time}`
  if (ed.start_time) return ed.start_time
  return 'Horario por confirmar'
}

/** Texto de la ubicación para anexar al horario, si existe. */
function locationLabel(ev: WPEvent): string {
  const ed = ev.gtc_evento_data
  return ed.location_name || ed.address || ''
}

/** Strip de HTML para excerpt/content. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

function descLabel(ev: WPEvent): string {
  return stripHtml(ev.excerpt.rendered) || stripHtml(ev.content.rendered)
}

/** Mapea event_type a una de las clases del diseño: culto / estudio / especial. */
function tagClass(eventType: string): 'culto' | 'estudio' | 'especial' {
  switch (eventType) {
    case 'culto':
    case 'oracion':
      return 'culto'
    case 'escuela_biblica':
    case 'capacitacion':
      return 'estudio'
    default:
      return 'especial'
  }
}

const TAG_LABEL: Record<string, string> = {
  culto: 'Culto',
  oracion: 'Oración',
  escuela_biblica: 'Escuela bíblica',
  grupo_de_vida: 'Grupo de vida',
  jovenes: 'Jóvenes',
  mujeres: 'Mujeres',
  hombres: 'Hombres',
  capacitacion: 'Capacitación',
  conferencia: 'Conferencia',
  especial: 'Especial',
}

function tagLabel(eventType: string): string {
  return TAG_LABEL[eventType] ?? 'Evento'
}

export default function Eventos() {
  useReveal()

  const { data: events, loading, error } = useFetch(() => getEvents())

  // Separar y ordenar en cliente (no confiar en el orden del server).
  // Próximos: los que no han finalizado, por start_date ascendente.
  const proximos = (events ?? [])
    .filter((e) => !e.gtc_evento_data.computed.has_finished)
    .sort((a, b) =>
      a.gtc_evento_data.start_date.localeCompare(b.gtc_evento_data.start_date)
    )

  return (
    <Layout>
      <main>
        {/* ============ PAGE HERO ============ */}
        <section className="band-indigo">
          <div className="wrap page-hero">
            <div className="breadcrumb reveal"><Link to="/">Inicio</Link><span>/</span>Eventos</div>
            <h1 className="reveal">Horarios y <span className="accent">eventos</span></h1>
            <p className="lead reveal">Nos reunimos cada domingo para orar, adorar y escuchar la Palabra. Aquí encontrarás nuestro horario semanal y los próximos eventos de la vida de la iglesia.</p>
          </div>
        </section>

        {/* ============ HORARIO SEMANAL ============ */}
        <section className="section">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Cada semana</span>
                <h2 style={{ marginTop: 12 }}>Horario habitual</h2>
              </div>
            </div>
            <div className="visit-grid">
              <div className="reveal">
                <p className="muted" style={{ fontSize: '1.05rem', maxWidth: '40ch', marginBottom: 14 }}>Llega unos minutos antes y serás bienvenido — no necesitas nada especial para asistir.</p>
                <div className="schedule-list">
                  <div className="sched-row">
                    <div className="sched-time">10:00 <small style={{ fontSize: '.95rem', fontWeight: 600 }}>AM</small></div>
                    <div className="sched-info"><b>Reunión de oración</b><span>Domingos · Comenzamos juntos en oración</span></div>
                  </div>
                  <div className="sched-row">
                    <div className="sched-time">10:30 <small style={{ fontSize: '.95rem', fontWeight: 600 }}>AM</small></div>
                    <div className="sched-info"><b>Reunión general</b><span>Domingos · Adoración y predicación de la Palabra</span></div>
                  </div>
                  <div className="sched-row pending">
                    <div className="sched-time">Entre semana</div>
                    <div className="sched-info"><b>Estudios bíblicos y grupos</b><span className="placeholder-note">Horarios por confirmar con el pastor</span></div>
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
                  <a className="btn btn-dark" href="https://maps.google.com/maps?q=2000+Nottingham+Dr,+Denton,+TX+76209" target="_blank" rel="noopener" style={{ alignSelf: 'flex-start' }}>Cómo llegar
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PRÓXIMOS EVENTOS ============ */}
        <section className="section band">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Calendario</span>
                <h2 style={{ marginTop: 12 }}>Próximos eventos</h2>
              </div>
            </div>

            {loading && (
              <div className="events-grid">
                {Array.from({ length: 3 }).map((_, i) => (
                  <article key={i} className="event-card" aria-hidden="true">
                    <div className="date-block"><div className="m">··</div><div className="d">·</div></div>
                    <div className="event-info">
                      <h4 className="placeholder-note">Cargando eventos…</h4>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && error && (
              <p className="placeholder-note" role="alert">No se pudieron cargar los eventos en este momento.</p>
            )}

            {!loading && !error && proximos.length === 0 && (
              <p className="placeholder-note">No hay eventos próximos.</p>
            )}

            {!loading && !error && proximos.length > 0 && (
              <div className="events-grid">
                {proximos.map((ev) => {
                  const { m, d } = dateParts(ev.gtc_evento_data.start_date)
                  const loc = locationLabel(ev)
                  const when = whenLabel(ev)
                  const desc = descLabel(ev)
                  const cls = tagClass(ev.gtc_evento_data.event_type)
                  const isOnline = ev.gtc_evento_data.format === 'online'
                  return (
                    <article key={ev.id} className="event-card reveal in">
                      <div className="date-block"><div className="m">{m}</div><div className="d">{d}</div></div>
                      <div className="event-info">
                        <h4 dangerouslySetInnerHTML={{ __html: ev.title.rendered }} />
                        <div className="when">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                          {when}{loc ? ` · ${loc}` : ''}
                        </div>
                        {desc && <p>{desc}</p>}
                        <div className="event-tags">
                          <span className={`event-tag ${cls}`}>{tagLabel(ev.gtc_evento_data.event_type)}</span>
                          {isOnline && <span className="event-tag">Online</span>}
                        </div>
                        <div className="event-cal">
                          <a className="btn btn-dark" href={getGoogleCalUrl(ev)} target="_blank" rel="noopener">Google Calendar</a>
                          <a className="btn btn-dark" href={getICSContent(ev)} download={`${ev.slug}.ics`}>Descargar .ics</a>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="section" style={{ paddingBottom: 'clamp(64px,8vw,110px)' }}>
          <div className="wrap">
            <div className="give reveal">
              <div>
                <span className="eyebrow">¿Quieres venir?</span>
                <h2 style={{ marginTop: 12 }}>Te esperamos este domingo</h2>
                <p>Escríbenos si tienes preguntas antes de tu primera visita. Estaremos encantados de recibirte.</p>
              </div>
              <div className="give-cta">
                <Link className="btn btn-gold" to="/contacto">Contáctanos
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
