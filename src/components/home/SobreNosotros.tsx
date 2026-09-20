import { Link } from 'react-router-dom'
import { NEGOCIO } from '../../data/negocio'
import { Imagen } from '../ui/Imagen'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

/** Bloque imagen + texto: quiénes atienden y qué se encuentra al entrar. */
export function SobreNosotros() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-titulo" className="bg-crema py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal>
          <Imagen
            src="/img/nosotros.webp"
            alt="Interior de la vinería: barriles con tablas de madera y estuches de regalo"
            fallback="/img/placeholder-foto.svg"
            className="aspect-[4/5] w-full rounded-sm object-cover"
          />
        </Reveal>

        <Reveal>
          <SectionTitle id="nosotros-titulo" copete={`Desde ${NEGOCIO.desde}`} alineacion="izquierda">
            Sobre Vinería Martu
          </SectionTitle>

          <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-carbon-suave">
            <p>
              Desde {NEGOCIO.desde} que estamos en {NEGOCIO.direccion.calle}, en el mismo lugar de
              siempre. Atendemos <strong className="font-medium text-carbon">Martín y Karina</strong>,
              los dueños: el que te atiende es el mismo que eligió cada botella de la estantería.
            </p>
            <p>
              Trabajamos con bodegas argentinas, del vino de todos los días al que se guarda para una
              fecha. Nos gusta saber qué estamos vendiendo, así que si venís con una idea —un asado,
              un regalo, algo para probar— lo charlamos y salís con la botella que buscabas, no con la
              que estaba más a mano.
            </p>
            <p>
              Además de vinos y espumantes hay cervezas, aperitivos y destilados, y todo lo que hace
              falta para acompañar: tablas, copas y estuches para regalar. Entrá, mirá y preguntá
              tranquilo, que para eso estamos.
            </p>
          </div>

          <Link
            to="/carta"
            className="mt-8 inline-block text-xs tracking-[0.2em] text-borgona uppercase underline underline-offset-8 transition-colors hover:text-borgona-oscuro"
          >
            Ver la carta &gt;
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
