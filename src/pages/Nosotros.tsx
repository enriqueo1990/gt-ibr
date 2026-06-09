import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ImageSlot } from '../components/ImageSlot'
import { useReveal } from '../lib/useReveal'
import { useFetch } from '../lib/hooks'
import { getMedios } from '../lib/api'

export default function Nosotros() {
  useReveal()
  const medios = useFetch(() => getMedios(), []).data

  return (
    <Layout>
      <main>
        {/* PAGE HERO */}
        <section className="band-indigo">
          <div className="wrap page-hero">
            <div className="breadcrumb reveal"><Link to="/">Inicio</Link><span>/</span>Nosotros</div>
            <h1 className="reveal">Acerca de <span className="accent">nosotros</span></h1>
            <p className="lead reveal">Una iglesia centrada en la Palabra de Dios, comprometida con comunicar su Gloria por medio del Evangelio en el condado de Denton, sus alrededores y el mundo.</p>
          </div>
        </section>

        {/* POR QUÉ */}
        <section className="section">
          <div className="wrap two-col">
            <div className="reveal">
              <span className="eyebrow">¿Por qué aquí?</span>
              <h2 style={{ marginTop: 12, fontSize: 'clamp(1.8rem,3.2vw,2.6rem)' }}>¿Por qué una iglesia bíblica en español en el norte de Texas?</h2>
              <div className="prose" style={{ marginTop: 22 }}>
                <p>El área del norte de Texas es una zona estratégica para expandir el evangelio entre los hispanos.</p>
                <p>Una iglesia fuerte y saludable de habla hispana también podría convertirse en un potencial campo de entrenamiento para futuros misioneros que podrían tener una experiencia de entrenamiento transcultural cercana.</p>
              </div>
            </div>
            <div className="reveal">
              <ImageSlot placeholder="Foto stock sugerida: comunidad hispana / familias reunidas, mapa de Texas o paisaje de Denton · horizontal" src={medios?.nosotros.intro} />
            </div>
          </div>
        </section>

        {/* DATOS DESTACADOS */}
        <section className="section band">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">El contexto</span>
                <h2 style={{ marginTop: 12 }}>Datos destacados</h2>
              </div>
              <span className="placeholder-note" style={{ marginBottom: 8 }}>◇ algunos datos hacen referencia a 2023 — confirmar cifras</span>
            </div>
            <div className="facts-grid">
              <div className="fact reveal"><div className="ix">1</div><p>Texas tendrá más hispanos que anglos en 2023.</p></div>
              <div className="fact reveal"><div className="ix">2</div><p>Estados Unidos tiene la segunda mayor población hispanohablante del mundo, después de México, seguido de cerca por Argentina y Colombia.</p></div>
              <div className="fact reveal"><div className="ix">3</div><p>El español es la segunda lengua más hablada del mundo por número de hablantes nativos.</p></div>
              <div className="fact reveal"><div className="ix">4</div><p>Los hispanos han representado más de la mitad del crecimiento total de la población de Estados Unidos desde 2010.</p></div>
            </div>
          </div>
        </section>

        {/* PROPÓSITO / VISIÓN */}
        <section className="section">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Nuestra identidad</span>
                <h2 style={{ marginTop: 12 }}>Propósito y visión</h2>
              </div>
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

        {/* EQUIPO */}
        <section className="section band">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Equipo misionero</span>
                <h2 style={{ marginTop: 12 }}>Quiénes lideran</h2>
              </div>
            </div>
            <div className="team-grid">
              <article className="team-card reveal">
                <ImageSlot placeholder="Foto del Pastor Greg Travis · retrato vertical" src={medios?.nosotros.greg} />
                <div className="team-body">
                  <span className="role"><span className="pill">Pastor</span></span>
                  <h3>Greg Travis</h3>
                  <p>Greg Travis es hijo de misioneros, criado en Argentina y México. Posee una Maestría de Dallas Theological Seminary. Forma parte de los consejos de Ante Su Palabra, Soldados de Jesucristo y Coalición por el Evangelio, y sirve como misionero de SERVE, una agencia misionera cuyo énfasis es la capacitación de líderes.</p>
                  <p>Tuvo el privilegio de plantar y pastorear la Iglesia Bíblica de City Bell en Argentina por diez años. Actualmente está plantando una iglesia hispana con el SBTC en Argyle, Texas. Tiene una pasión por liderar una iglesia sana mientras ayuda a otros pastores, plantadores e iglesias locales a ser más saludables.</p>
                  <p>Está felizmente casado con Caro y tienen tres hijos: Alaina, Wendy y Thiago.</p>
                  <div className="team-links">
                    <a href="https://antesupalabra.com/" target="_blank" rel="noopener">Ante Su Palabra ↗</a>
                    <a href="https://somossoldados.org/" target="_blank" rel="noopener">Soldados de Jesucristo ↗</a>
                    <a href="https://www.coalicionporelevangelio.org/" target="_blank" rel="noopener">Coalición por el Evangelio ↗</a>
                    <a href="https://ibcitybell.com/" target="_blank" rel="noopener">Iglesia Bíblica de City Bell ↗</a>
                  </div>
                </div>
              </article>
              <article className="team-card reveal">
                <ImageSlot placeholder="Foto del Pastor Pedro Viais (y Gaby) · retrato vertical" src={medios?.nosotros.pedro} />
                <div className="team-body">
                  <span className="role"><span className="pill">Anciano · Pastor</span></span>
                  <h3>Pedro Viais</h3>
                  <p>Pedro y Gaby son de México, graduados del Seminario Río Grande en mayo de 2021. Pedro obtuvo su licenciatura en misiones y pastoral, graduado de PDV Argentina, y Gaby su licenciatura en Educación Cristiana.</p>
                  <p>Oran para ser misioneros en Medio Oriente.</p>
                  <div className="team-links">
                    <span className="placeholder-note">◇ enlaces de redes y foto por confirmar</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* CTA VISITA */}
        <section className="section" style={{ paddingBottom: 'clamp(64px,8vw,110px)' }}>
          <div className="wrap">
            <div className="give reveal">
              <div>
                <span className="eyebrow">Te esperamos</span>
                <h2 style={{ marginTop: 12 }}>Conócenos un domingo</h2>
                <p>Nos reunimos cada domingo: oración a las 10:00 AM y reunión general a las 10:30 AM. Serás bienvenido.</p>
              </div>
              <div className="give-cta">
                <Link className="btn btn-gold" to="/eventos">Ver horarios y eventos
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
