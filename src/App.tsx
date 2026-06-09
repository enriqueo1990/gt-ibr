import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Nosotros from './pages/Nosotros'
import Sermones from './pages/Sermones'
import Serie from './pages/Serie'
import Sermon from './pages/Sermon'
import Eventos from './pages/Eventos'
import Creencias from './pages/Creencias'
import Contacto from './pages/Contacto'
import DevDiagnostics from './pages/DevDiagnostics'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/sermones" element={<Sermones />} />
        <Route path="/sermones/:slug" element={<Sermon />} />
        <Route path="/series/:slug" element={<Serie />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/creencias" element={<Creencias />} />
        <Route path="/contacto" element={<Contacto />} />
        {/* Verificación de datos de Fase 3 (sin estilo) */}
        <Route path="/dev" element={<DevDiagnostics />} />
      </Routes>
    </BrowserRouter>
  )
}
