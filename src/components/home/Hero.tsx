import { Link } from 'react-router-dom'
import { NEGOCIO } from '../../data/negocio'
import { Imagen } from '../ui/Imagen'
import { estilosBoton } from '../ui/estilosBoton'

/**
 * Portada: el mensaje a la izquierda y la foto del frente a la derecha.
 *
 * El fondo sigue siendo oscuro a propósito. El header es transparente mientras
 * está sobre el hero y recién se vuelve sólido al scrollear (ver Header.tsx):
 * con la marca y el menú en crema, abajo necesita algo oscuro o no se leen.
 *
 * En celular las dos columnas se apilan y el texto va primero, que es lo que
 * tiene que leerse sí o sí; la foto queda como remate.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-carbon">
      {/* Resplandor borgoña detrás del texto: da profundidad sin competir con la foto. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(75%_65%_at_18%_38%,rgba(110,18,20,0.6),transparent_72%)]"
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-14 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="max-w-xl">
          <p className="font-sans text-xs tracking-[0.35em] text-dorado uppercase">
            {NEGOCIO.direccion.zona} · desde {NEGOCIO.desde}
          </p>

          <h1 className="mt-6 text-4xl leading-[1.15] text-crema sm:text-5xl lg:text-6xl">
            Cada botella
            <br />
            guarda una historia
          </h1>

          <span aria-hidden="true" className="mt-8 block h-px w-20 bg-dorado" />

          <p className="mt-8 max-w-lg text-base leading-relaxed text-crema/85">
            Vinos argentinos elegidos uno por uno, y las bebidas que no pueden faltar en tu mesa.
            Pasá, mirá la carta y consultanos lo que quieras.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/carta" className={estilosBoton('primario', 'lg')}>
              Ver la carta
            </Link>
            <a href="#nosotros" className={estilosBoton('claro', 'lg')}>
              Conocenos
            </a>
          </div>
        </div>

        {/* La foto, con un marco dorado corrido: el mismo recurso gráfico que
            las líneas finas doradas del resto del sitio.

            El ancho va topeado porque la foto es 3:4: sin tope, en una pantalla
            de 1280 se iba a 760 px de alto, se cortaba con el borde de abajo y
            se comía el marco. */}
        <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:mr-0 lg:ml-auto lg:max-w-[26rem]">
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm border border-dorado/45 sm:translate-x-4 sm:translate-y-4"
          />
          <Imagen
            src="/img/hero.webp"
            alt="Frente de Vinería Martu, sobre la vereda de Morelli 918"
            fallback="/img/placeholder-foto.svg"
            prioridad
            className="relative aspect-[3/4] w-full rounded-sm object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
