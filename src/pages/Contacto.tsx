import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useReveal } from '../lib/useReveal'

export default function Contacto() {
  useReveal()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('Quiero visitar la iglesia')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState<{ text: string; tone: 'default' | 'error' | 'success' }>({
    text: 'También puedes escribirnos directamente a iglebiblicareformada@gmail.com',
    tone: 'default',
  })

  const noteColor =
    note.tone === 'error' ? 'var(--accent)' : note.tone === 'success' ? 'var(--gold)' : undefined

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || !email || !message) {
      setNote({ text: 'Por favor completa todos los campos.', tone: 'error' })
      return
    }
    const mailSubject = encodeURIComponent('Contacto desde la web — ' + name)
    const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\n${message}`)
    window.location.href = `mailto:iglebiblicareformada@gmail.com?subject=${mailSubject}&body=${body}`
    setNote({ text: '¡Gracias! Abrimos tu correo para enviar el mensaje.', tone: 'success' })
  }

  return (
    <Layout>
      <main>
        {/* PAGE HERO */}
        <section className="band-indigo">
          <div className="wrap page-hero">
            <div className="breadcrumb reveal"><Link to="/">Inicio</Link><span>/</span>Contacto</div>
            <h1 className="reveal">Hablemos</h1>
            <p className="lead reveal">Para nosotros es un placer servirte en lo que necesites. Si has venido hasta aquí, no dudes en contactarnos: nuestro personal está siempre dispuesto a responder a cada inquietud que esté a nuestro alcance.</p>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section">
          <div className="wrap">
            <div className="contact-grid">
              <div className="contact-intro reveal">
                <span className="eyebrow">Comunícate</span>
                <h2 style={{ marginTop: 12, fontSize: 'clamp(1.8rem,3.2vw,2.5rem)' }}>Estamos para servirte</h2>
                <p>Escríbenos por correo o a través del formulario. También puedes encontrarnos en nuestras redes y, por supuesto, visitarnos cualquier domingo.</p>
                <div className="contact-channels">
                  <div className="channel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                    <div className="t"><b>iglebiblicareformada@gmail.com</b><small>Te respondemos lo antes posible</small></div>
                  </div>
                  <div className="channel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    <div className="t"><b>2000 Nottingham Dr</b><small>Denton, TX 76209 · Estados Unidos</small></div>
                  </div>
                  <div className="channel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                    <div className="t"><b>Domingos · 10:00 AM</b><small>Oración 10:00 AM · Reunión general 10:30 AM</small></div>
                  </div>
                </div>
                <div className="socials" style={{ marginTop: 26 }}>
                  <a href="https://www.facebook.com/IglesiaBReformada" target="_blank" rel="noopener" aria-label="Facebook" style={{ borderColor: 'var(--line-strong)', color: 'var(--ink)' }}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.5l.5-3H13v-2c0-.6.4-1 1-1Z" /></svg></a>
                  <a href="https://www.instagram.com/ibreformada/" target="_blank" rel="noopener" aria-label="Instagram" style={{ borderColor: 'var(--line-strong)', color: 'var(--ink)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg></a>
                  <a href="https://www.youtube.com/@iglesiabiblicareformada3751" target="_blank" rel="noopener" aria-label="YouTube" style={{ borderColor: 'var(--line-strong)', color: 'var(--ink)' }}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3-.4-4.4a2.6 2.6 0 0 0-1.8-1.8C18.4 5.4 12 5.4 12 5.4s-6.4 0-7.8.4A2.6 2.6 0 0 0 2.4 7.6C2 9 2 12 2 12s0 3 .4 4.4a2.6 2.6 0 0 0 1.8 1.8c1.4.4 7.8.4 7.8.4s6.4 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8C22 15 22 12 22 12Zm-12 2.8V9.2l5 2.8-5 2.8Z" /></svg></a>
                </div>
              </div>

              <form className="contact-form reveal" id="contactForm" noValidate onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="cf-name">Nombre</label>
                    <input id="cf-name" name="name" type="text" placeholder="Tu nombre" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="cf-email">Correo electrónico</label>
                    <input id="cf-email" name="email" type="email" placeholder="tucorreo@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="cf-subject">Asunto</label>
                  <select id="cf-subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option>Quiero visitar la iglesia</option>
                    <option>Tengo una pregunta sobre la fe</option>
                    <option>Quiero conocer al pastor</option>
                    <option>Información sobre ofrendar</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="cf-msg">Mensaje</label>
                  <textarea id="cf-msg" name="message" placeholder="¿En qué podemos servirte?" required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>
                <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center' }}>Enviar mensaje</button>
                <p className="form-note" id="formNote" style={{ color: noteColor }}>{note.text}</p>
              </form>
            </div>
          </div>
        </section>

        {/* MAP */}
        <section className="section band" style={{ paddingTop: 0, paddingBottom: 0, background: 'none' }}>
          <div className="map-embed" style={{ aspectRatio: 'auto', height: 'clamp(320px,40vw,460px)', borderTop: '1px solid var(--line)' }}>
            <iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=2000+Nottingham+Dr,+Denton,+TX+76209&z=15&output=embed" title="Mapa: 2000 Nottingham Dr, Denton, TX"></iframe>
          </div>
        </section>
      </main>
    </Layout>
  )
}
