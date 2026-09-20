import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NEGOCIO } from '../../data/negocio'
import { MenuMobile } from './MenuMobile'
import { NAVEGACION } from './navegacion'

/**
 * Header fijo. Sobre el hero del inicio arranca transparente y pasa a sólido
 * al scrollear; en el resto de las páginas es sólido desde el principio.
 */
export function Header() {
  const { pathname } = useLocation()
  const sobreHero = pathname === '/'
  const [scrolleado, setScrolleado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    if (!sobreHero) return

    const alScrollear = () => setScrolleado(window.scrollY > 40)
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [sobreHero])

  const solido = !sobreHero || scrolleado

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solido ? 'bg-crema/95 shadow-sm backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label={`${NEGOCIO.nombre}, ir al inicio`}>
          <img
            src="/img/logo-martu.png"
            alt={NEGOCIO.nombre}
            className="h-13 w-auto"
            width={355}
            height={208}
          />
        </Link>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAVEGACION.map((item) => (
              <li key={item.etiqueta}>
                <Link
                  to={item.a}
                  className={`font-sans text-xs tracking-[0.18em] uppercase transition-colors ${
                    solido ? 'text-carbon hover:text-borgona' : 'text-crema hover:text-dorado'
                  }`}
                >
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden ${
            solido ? 'text-carbon' : 'text-crema'
          }`}
        >
          <span aria-hidden="true" className="block h-px w-6 bg-current" />
          <span aria-hidden="true" className="block h-px w-6 bg-current" />
          <span aria-hidden="true" className="block h-px w-6 bg-current" />
        </button>
      </div>

      <MenuMobile abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />
    </header>
  )
}
