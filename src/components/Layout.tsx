import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

/** Cascarón compartido por todas las páginas: Header + contenido + Footer. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
