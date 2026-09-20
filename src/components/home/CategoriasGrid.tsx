import { Link } from 'react-router-dom'
import { PRODUCTOS } from '../../data/catalogo'
import { linkCarta } from '../../hooks/useFiltrosCarta'
import type { Categoria } from '../../types/producto'
import { OTRAS_BEBIDAS } from '../layout/navegacion'
import { Imagen } from '../ui/Imagen'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

interface Tarjeta {
  etiqueta: string
  descripcion: string
  imagen: string
  a: string
  cantidad: number
}

const contar = (predicado: (categoria: Categoria) => boolean) =>
  PRODUCTOS.filter((producto) => predicado(producto.categoria)).length

/**
 * Accesos rápidos a la carta ya filtrada.
 *
 * Los vinos van todos en una sola tarjeta: tinto, blanco y rosado no son
 * categorías del JSON, se derivan del varietal, y separarlos acá dejaba dos
 * tarjetas invisibles mientras la carta no tenga blancos ni rosados. Para
 * elegir por color está el panel de filtros de la carta.
 *
 * La clasificación por color sigue disponible en lib/vinos.ts (hoy sin uso):
 * es lo que habría que volver a enganchar si alguna vez se quiere una tarjeta
 * por tipo de vino.
 *
 * Las tarjetas sin productos no se muestran: si mañana no hubiera espumantes,
 * la tarjeta desaparece sola en vez de llevar a un resultado vacío.
 */
function tarjetas(): Tarjeta[] {
  const todas: Tarjeta[] = [
    {
      etiqueta: 'Vinos',
      descripcion: 'Tintos, blancos y rosados',
      imagen: '/img/categorias/vinos.svg',
      a: linkCarta({ categoria: 'vino' }),
      cantidad: contar((categoria) => categoria === 'vino'),
    },
    {
      etiqueta: 'Espumantes',
      descripcion: 'Para brindar en cualquier momento',
      imagen: '/img/categorias/espumantes.svg',
      a: linkCarta({ categoria: 'espumante' }),
      cantidad: contar((categoria) => categoria === 'espumante'),
    },
    {
      etiqueta: 'Otras bebidas',
      descripcion: 'Cervezas, aperitivos y destilados',
      imagen: '/img/categorias/otras-bebidas.svg',
      a: `/carta?${OTRAS_BEBIDAS.map((c) => `cat=${c}`).join('&')}`,
      cantidad: contar((categoria) => OTRAS_BEBIDAS.includes(categoria)),
    },
  ]

  return todas.filter((tarjeta) => tarjeta.cantidad > 0)
}

/**
 * Columnas según cuántas tarjetas quedaron.
 * Van como clases literales para que Tailwind las incluya en el CSS final.
 */
const COLUMNAS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
}

export function CategoriasGrid() {
  const visibles = tarjetas()
  if (visibles.length === 0) return null

  return (
    <section aria-labelledby="categorias" className="bg-crema-oscuro py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle id="categorias" copete="Encontrá lo tuyo">
            Explorá por categoría
          </SectionTitle>
        </Reveal>

        <Reveal className="mt-14">
          <ul
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 ${COLUMNAS[visibles.length] ?? 'lg:grid-cols-5'}`}
          >
            {visibles.map((tarjeta) => (
              <li key={tarjeta.etiqueta}>
                <Link
                  to={tarjeta.a}
                  className="group relative block h-full overflow-hidden rounded-sm bg-carbon"
                >
                  <Imagen
                    src={tarjeta.imagen}
                    alt=""
                    fallback="/img/categorias/vinos.svg"
                    className="aspect-[4/5] w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-carbon/90 to-transparent p-5">
                    <h3 className="font-serif text-xl tracking-wide text-crema">{tarjeta.etiqueta}</h3>
                    <p className="mt-1 text-xs leading-snug text-crema/75">{tarjeta.descripcion}</p>
                    <span className="mt-3 text-[0.65rem] tracking-[0.2em] text-dorado uppercase">
                      Ver más &gt;
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
