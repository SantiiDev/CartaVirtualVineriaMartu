import { useState, type ReactNode } from 'react'
import { LEYENDA_LEGAL, NEGOCIO } from '../data/negocio'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useScrollBloqueado, useTrampaDeFoco } from '../hooks/useTrampaDeFoco'
import { Boton } from './ui/Boton'

const CLAVE = 'martu.mayor18'

type Respuesta = 'si' | 'no' | null

/**
 * Verificación de edad obligatoria antes de mostrar el catálogo.
 *
 * La respuesta queda en localStorage para no preguntar en cada visita. Si la
 * persona dice que no, el catálogo directamente no se renderiza.
 */
export function AgeGate({ children }: { children: ReactNode }) {
  const [guardada, setGuardada] = useLocalStorage<Respuesta>(CLAVE, null)
  const [respuesta, setRespuesta] = useState<Respuesta>(guardada)

  const abierto = respuesta === null
  const ref = useTrampaDeFoco<HTMLDivElement>(abierto)
  useScrollBloqueado(respuesta !== 'si')

  function responder(valor: Exclude<Respuesta, null>) {
    setRespuesta(valor)
    setGuardada(valor)
  }

  if (respuesta === 'si') return <>{children}</>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon px-4">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-titulo"
        className="w-full max-w-md rounded-sm bg-crema px-6 py-10 text-center shadow-2xl sm:px-10"
      >
        <img
          src="/img/logo-martu.png"
          alt={NEGOCIO.nombre}
          className="mx-auto h-24 w-auto"
          width={355}
          height={208}
        />

        {abierto ? (
          <>
            <h1 id="age-gate-titulo" className="mt-8 text-2xl tracking-[0.06em] uppercase sm:text-3xl">
              ¿Sos mayor de 18 años?
            </h1>
            <span aria-hidden="true" className="mx-auto mt-5 block h-px w-16 bg-dorado" />
            <p className="mt-5 text-sm leading-relaxed text-carbon-suave">
              Para ver nuestra carta de vinos y bebidas necesitamos que confirmes tu edad.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Boton variante="primario" tamano="lg" onClick={() => responder('si')}>
                Sí, soy mayor
              </Boton>
              <Boton variante="sutil" tamano="lg" onClick={() => responder('no')}>
                No
              </Boton>
            </div>
          </>
        ) : (
          <>
            <h1 id="age-gate-titulo" className="mt-8 text-2xl tracking-[0.06em] uppercase sm:text-3xl">
              Gracias por tu visita
            </h1>
            <span aria-hidden="true" className="mx-auto mt-5 block h-px w-16 bg-dorado" />
            <p className="mt-5 text-sm leading-relaxed text-carbon-suave">
              Nuestra carta está destinada únicamente a personas mayores de 18 años. Te esperamos cuando
              cumplas la edad permitida.
            </p>
            <button
              type="button"
              onClick={() => {
                setRespuesta(null)
                setGuardada(null)
              }}
              className="mt-8 text-xs tracking-[0.15em] text-borgona uppercase underline underline-offset-4"
            >
              Me equivoqué, volver a responder
            </button>
          </>
        )}

        <p className="mt-10 text-[0.65rem] tracking-[0.12em] text-carbon-suave uppercase">{LEYENDA_LEGAL}</p>
      </div>
    </div>
  )
}
