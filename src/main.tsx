import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './design/site.css'
import './design/slots.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
