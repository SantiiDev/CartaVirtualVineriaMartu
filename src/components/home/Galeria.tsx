import FOTOS from '../../data/galeria.generado.json'
import { Imagen } from '../ui/Imagen'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

/**
 * Fotos del local.
 *
 * La lista sale de public/img/galeria/: entra todo lo que haya en la carpeta,
 * con cualquier extensión y en el orden del nombre del archivo (la arma
 * scripts/generar-imagenes.mjs antes de cada dev/build). Para sumar una foto
 * alcanza con guardarla ahí; no hay que tocar este archivo.
 *
 * Las fotos no vienen todas del mismo tamaño ni con la misma orientación, así
 * que cada una se recorta a un cuadrado con object-cover: la grilla queda
 * pareja aunque haya verticales, horizontales y capturas de celular mezcladas.
 */

/** Descripción para lectores de pantalla, por nombre de archivo sin extensión. */
const TEXTOS_ALT: Record<string, string> = {
  'galeria-1': 'Salón de la vinería',
  'galeria-2': 'Estantería con botellas de vino',
  'galeria-3': 'Mostrador de atención',
  'galeria-4': 'Selección de vinos tintos',
  'galeria-5': 'Vidriera del local',
  'galeria-6': 'Detalle de etiquetas',
  'galeria-7': 'Sector de guarda',
  'galeria-8': 'Fachada de Vinería Martu',
}

const textoAlt = (ruta: string, indice: number) => {
  const nombre = ruta.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
  return TEXTOS_ALT[nombre] ?? `Foto ${indice + 1} de Vinería Martu`
}

export function Galeria() {
  if (FOTOS.length === 0) return null

  return (
    <section aria-labelledby="galeria" className="bg-carbon py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle id="galeria" copete="Nuestro local" tono="claro">
            Galería
          </SectionTitle>
        </Reveal>

        <Reveal className="mt-14">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {FOTOS.map((ruta, indice) => (
              <li key={ruta} className="overflow-hidden rounded-sm bg-carbon-suave/40">
                <Imagen
                  src={ruta}
                  alt={textoAlt(ruta, indice)}
                  fallback="/img/hero.svg"
                  className="aspect-square w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
