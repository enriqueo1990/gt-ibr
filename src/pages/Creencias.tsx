import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useReveal } from '../lib/useReveal'

/* Contenido estático del acordeón de doctrina (refleja el diseño Creencias.html).
   Se reemplaza por datos reales del REST en una fase posterior. */
const DOCTRINES: { ix: string; q: string; body: ReactNode; refs: string[] }[] = [
  {
    ix: '01',
    q: 'Acerca de las Escrituras',
    body: (
      <p>Creemos que la Biblia en su totalidad fue inspirada por Dios. El Espíritu Santo guió a los autores humanos a escribir cada palabra de la Biblia sin menospreciar la personalidad y circunstancias de cada autor. Cada palabra en los originales fue escrita sin error y es verdad en toda materia, ya sea de fe o de historia. La Biblia es la autoridad final para la fe y conducta de la iglesia y de cada creyente que la compone.</p>
    ),
    refs: ['2 Timoteo 3:16-17', '2 Pedro 1:21'],
  },
  {
    ix: '02',
    q: 'Acerca de Dios',
    body: (
      <p>Creemos que existe un solo Dios verdadero que existe eternamente en tres personas: el Padre, el Hijo y el Espíritu Santo. Cada miembro de la trinidad posee una personalidad propia y a la vez son de la misma sustancia, un solo Dios. Cada miembro posee los mismos atributos, la misma naturaleza y es digno de la misma adoración y obediencia.</p>
    ),
    refs: ['Génesis 1:1', 'Deuteronomio 6:4', 'Mateo 28:19', 'Juan 1:1-3, 14', 'Juan 10:30', '2 Corintios 13:14', 'Hebreos 1:1-3'],
  },
  {
    ix: '03',
    q: 'Acerca de Jesús',
    body: (
      <p>Creemos que el Hijo de Dios existió eternamente, se encarnó en el Señor Jesucristo siendo engendrado milagrosamente por el Espíritu Santo y nacido de la virgen María. Él es completamente Dios y completamente hombre, vivió una vida sin pecado, murió físicamente en la cruz y resucitó corporalmente tres días después.</p>
    ),
    refs: ['Juan 1:1,14,18', 'Juan 5:18', 'Hebreos 1:1-9', 'Hebreos 5:8', '1 Juan 5:20', '1 Timoteo 2:5', '1 Corintios 15:1-5'],
  },
  {
    ix: '04',
    q: 'Acerca del Espíritu Santo',
    body: (
      <p>Creemos que el Espíritu Santo es la tercera persona de la trinidad. Creemos que el Espíritu Santo produce el milagro de la conversión, viene a morar permanentemente en el creyente, y lo bautiza y sella en el momento en que la persona cree en el evangelio. Un aspecto importante de su ministerio involucra glorificar al Hijo de Dios. Creemos también que el Espíritu Santo distribuye dones a los creyentes para la edificación del cuerpo y da poder al creyente para la obra del ministerio.</p>
    ),
    refs: ['Mateo 28:19', 'Juan 3:3-7', 'Juan 15:26', 'Juan 16:14', 'Tito 3:5', '1 Corintios 6:19', 'Romanos 8:9'],
  },
  {
    ix: '05',
    q: 'Acerca del Ser humano',
    body: (
      <>
        <p>Creemos que el hombre fue creado a la imagen y semejanza de Dios. En Adán toda la humanidad participó del pecado original. Como consecuencia, todo hombre está espiritualmente muerto, separado de Dios y con una naturaleza que ha sido afectada en su totalidad por el pecado. Creemos que fuera de la intervención e iniciativa de la gracia divina, el hombre está imposibilitado para remediar su situación pecaminosa delante de un Dios Santo.</p>
        <p style={{ marginTop: 14 }}><span className="placeholder-note">◇ la cita de Jeremías aparece cortada en el contenido original — pendiente de completar</span></p>
      </>
    ),
    refs: ['Génesis 1:26', 'Génesis 2:17', 'Génesis 6:5', 'Salmos 14:1-3', 'Salmos 51:5', 'Jeremías…'],
  },
  {
    ix: '06',
    q: 'Acerca de la Salvación',
    body: (
      <p>Creemos que el propósito de la muerte de Cristo fue ser un sustituto para el pecador. El sacrificio de Cristo fue voluntario y suficiente para satisfacer el castigo que merece el pecado del hombre delante de un Dios Santo. No hay obra, acto religioso, mérito, experiencia o conocimiento que sea suficiente para obtener la salvación. La única manera en que el hombre puede ser salvo es depositando su fe en la muerte y la resurrección de Cristo como único medio de salvación. Es imposible que el creyente verdadero pierda su salvación.</p>
    ),
    refs: ['Juan 10:29', 'Romanos 8:29-30', 'Hechos 4:12', '1 Corintios 15:1-4', '2 Corintios 5:21', 'Efesios 2:8-9'],
  },
  {
    ix: '07',
    q: 'Acerca de la Santificación',
    body: (
      <p>Creemos que a cada creyente se le promete santificación (crecimiento en santidad). Dios da al creyente salvación de la pena del pecado y del poder del pecado en esta vida. Solamente en la vida venidera se le promete al creyente salvación de la presencia del pecado.</p>
    ),
    refs: ['Hebreos 10:10,14', 'Juan 17:15-17', 'Efesios 5:26-27', '1 Tesalonicenses 4:3,4', '1 Juan 1:8-10, 3:2', '1 Corintios 6:11'],
  },
  {
    ix: '08',
    q: 'Acerca de la Iglesia',
    body: (
      <p>Creemos que la verdadera iglesia está compuesta por toda persona que ha nacido de nuevo. La iglesia existe en dos aspectos: invisible y local. La iglesia invisible existe a través de todos los tiempos y contiene a todos los cristianos verdaderos de distintas culturas y denominaciones. La iglesia local es un grupo de personas que profesan ser cristianas y se organizan para hacer la voluntad de Dios en una localidad. Creemos que la iglesia, como cuerpo de Cristo, existe para que sus miembros adoren a Dios, crezcan como discípulos de Cristo, se sirvan mutuamente utilizando sus dones espirituales, tengan relaciones auténticas (comunión) y muestren a Dios al mundo.</p>
    ),
    refs: ['Mateo 16:16-18', 'Hechos 2:42-47', 'Romanos 12:5', '1 Corintios 12:12-27', 'Efesios 1:20-23, 4:3-10', 'Colosenses 3:14-15'],
  },
  {
    ix: '09',
    q: 'Acerca de las Ordenanzas',
    body: (
      <p>Creemos que la Biblia menciona dos ordenanzas que la iglesia debe practicar: la Cena del Señor y el bautismo. Jesús estableció que la cena se practique con regularidad recordando su muerte y esperando su regreso. El bautismo con agua es un testimonio público de la persona que ha creído en Cristo para su salvación. La inmersión completa es la manera ideal de practicarlo, como vemos en las Escrituras. Las ordenanzas se practican no como medios para obtener salvación, sino en obediencia a los mandatos de Cristo.</p>
    ),
    refs: ['Mateo 28:19-20', 'Hechos 8:12, 36-38', '1 Corintios 11:23-26'],
  },
  {
    ix: '10',
    q: 'Acerca de las Cosas Futuras',
    body: (
      <p>Creemos que Jesucristo regresará de la misma manera en que se fue. Su regreso puede ocurrir en cualquier momento. Su segunda venida será acompañada por una serie de eventos. Volverá a juzgar a los vivos y a los muertos y establecerá su reino eterno. Toda persona que no haya creído en Él como salvador en esta vida quedará eternamente separada de su presencia en el infierno. El pueblo de Dios —compuesto por la iglesia y por todos aquellos en otras eras que ejercieron una fe salvadora— entrará en el gozo de su reino, donde adoraremos, serviremos y experimentaremos deleites eternos de estar en Su presencia y en la presencia de todos los salvos.</p>
    ),
    refs: ['Tito 2:13', '1 Tesalonicenses 1:10', '1 Tesalonicenses 4:13-18', '1 Tesalonicenses 5:4-10', 'Juan 14:1-3', 'Mateo 24:21,29,30', 'Mateo 25:31-46', 'Apocalipsis 3:10'],
  },
]

export default function Creencias() {
  useReveal()

  /* Estado del acordeón: índices abiertos. El item 01 inicia abierto (clase `open`
     en el diseño). Replico el comportamiento de site.js: cada .doc-q togglea su item,
     y #expandAll alterna todos según si hay alguno cerrado. */
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const anyClosed = DOCTRINES.some((_, i) => !open.has(i))
  const toggleAll = () => {
    setOpen(anyClosed ? new Set(DOCTRINES.map((_, i) => i)) : new Set())
  }

  /* Mide la altura real del contenido para la transición de maxHeight (equivale a
     ans.scrollHeight + "px" en site.js). Fallback amplio si el ref aún no existe. */
  const heightFor = (i: number): string => {
    if (!open.has(i)) return '0px'
    const el = answerRefs.current[i]
    return el ? `${el.scrollHeight}px` : '600px'
  }

  return (
    <Layout>
      <main>
        {/* PAGE HERO */}
        <section className="band-indigo">
          <div className="wrap page-hero">
            <div className="breadcrumb reveal"><Link to="/">Inicio</Link><span>/</span>Creencias</div>
            <h1 className="reveal">En qué <span className="accent">creemos</span></h1>
            <p className="lead reveal">Creemos que la Biblia es la autoridad final para la fe y conducta de la iglesia. Estas son nuestras declaraciones doctrinales, cada una arraigada en las Escrituras.</p>
          </div>
        </section>

        {/* DOCTRINE ACCORDION */}
        <section className="section">
          <div className="wrap-narrow">
            <div className="doc-toolbar reveal">
              <button className="btn btn-ghost" id="expandAll" type="button" onClick={toggleAll}>
                {anyClosed ? 'Expandir todo' : 'Contraer todo'}
              </button>
            </div>
            <div className="doc-list reveal">
              {DOCTRINES.map((d, i) => {
                const isOpen = open.has(i)
                return (
                  <div key={d.ix} className={`doc-item${isOpen ? ' open' : ''}`}>
                    <button className="doc-q" type="button" onClick={() => toggle(i)}>
                      <span className="ix">{d.ix}</span>{d.q}
                      <span className="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></span>
                    </button>
                    <div
                      className="doc-a"
                      ref={(el) => { answerRefs.current[i] = el }}
                      style={{ maxHeight: heightFor(i) }}
                    >
                      <div className="inner">
                        {d.body}
                        <div className="refs">
                          <span className="lbl">Pasajes</span>
                          {d.refs.map((r) => (
                            <span key={r} className="ref">{r}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0, paddingBottom: 'clamp(64px,8vw,110px)' }}>
          <div className="wrap">
            <div className="give reveal">
              <div>
                <span className="eyebrow">¿Tienes preguntas?</span>
                <h2 style={{ marginTop: 12 }}>Conversemos sobre la fe</h2>
                <p>Si quieres profundizar en alguna de estas verdades o tienes inquietudes, estaremos encantados de responderte.</p>
              </div>
              <div className="give-cta">
                <Link className="btn btn-gold" to="/contacto">Escríbenos
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
