import { Link } from 'react-router-dom'
import { DIRECCION_COMPLETA, LEYENDA_LEGAL, NEGOCIO } from '../../data/negocio'
import { CANAL_INSTAGRAM } from '../../lib/contacto'
import { NAVEGACION } from './navegacion'

export function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-carbon text-crema">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <img
              src="/img/logo-martu.png"
              alt={NEGOCIO.nombre}
              className="h-20 w-auto"
              width={355}
              height={208}
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-crema/70">
              Vinos y bebidas en {NEGOCIO.direccion.zona}. Atendida por sus dueños desde {NEGOCIO.desde}.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <h2 className="font-sans text-xs tracking-[0.25em] text-dorado uppercase">Navegación</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {NAVEGACION.map((item) => (
                <li key={item.etiqueta}>
                  <Link to={item.a} className="text-sm text-crema/80 transition-colors hover:text-dorado">
                    {item.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-xs tracking-[0.25em] text-dorado uppercase">Dónde estamos</h2>
            <address className="mt-5 flex flex-col gap-3 text-sm not-italic text-crema/80">
              <span>{DIRECCION_COMPLETA}</span>
              <a href={`tel:${NEGOCIO.telefono.tel}`} className="transition-colors hover:text-dorado">
                {NEGOCIO.telefono.display}
              </a>
              <a
                href={CANAL_INSTAGRAM.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-dorado"
              >
                Instagram {CANAL_INSTAGRAM.etiqueta}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-14 border-t border-crema/15 pt-8 text-center">
          <p className="text-xs tracking-[0.15em] text-dorado uppercase">{LEYENDA_LEGAL}</p>
          <p className="mt-4 text-xs text-crema/50">
            © {anio} {NEGOCIO.nombre}. Carta de exhibición: los precios pueden cambiar sin previo aviso.
          </p>
        </div>
      </div>
    </footer>
  )
}
