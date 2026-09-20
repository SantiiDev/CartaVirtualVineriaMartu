import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { NEGOCIO } from '../../data/negocio'
import { CANAL_INSTAGRAM, canalPrincipal } from '../../lib/contacto'
import { useScrollBloqueado, useTrampaDeFoco } from '../../hooks/useTrampaDeFoco'
import { estilosBoton } from '../ui/estilosBoton'
import { NAVEGACION } from './navegacion'

interface Props {
  abierto: boolean
  alCerrar: () => void
}

/** Menú de pantalla completa en mobile. Se cierra con Escape o tocando afuera. */
export function MenuMobile({ abierto, alCerrar }: Props) {
  const cerrar = useCallback(() => alCerrar(), [alCerrar])
  const ref = useTrampaDeFoco<HTMLDivElement>(abierto, cerrar)
  useScrollBloqueado(abierto)

  const canal = canalPrincipal()

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Cerrar menú"
        tabIndex={-1}
        onClick={cerrar}
        className="absolute inset-0 h-full w-full bg-carbon/60"
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-crema px-6 pt-6 pb-10 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <img src="/img/logo-martu.png" alt={NEGOCIO.nombre} className="h-12 w-auto" width={355} height={208} />
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar menú"
            className="flex h-11 w-11 items-center justify-center text-2xl text-carbon"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav aria-label="Navegación principal" className="mt-10 flex-1">
          <ul className="flex flex-col gap-1">
            {NAVEGACION.map((item) => (
              <li key={item.etiqueta}>
                <Link
                  to={item.a}
                  onClick={cerrar}
                  className="block border-b border-carbon/10 py-4 font-serif text-2xl tracking-wide text-carbon transition-colors hover:text-borgona"
                >
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <a href={canal.href} className={estilosBoton('primario', 'lg')} onClick={cerrar}>
            {canal.etiqueta}
          </a>
          <a
            href={CANAL_INSTAGRAM.href}
            target="_blank"
            rel="noreferrer"
            className={estilosBoton('sutil', 'lg')}
            onClick={cerrar}
          >
            Instagram {CANAL_INSTAGRAM.etiqueta}
          </a>
        </div>
      </div>
    </div>
  )
}
