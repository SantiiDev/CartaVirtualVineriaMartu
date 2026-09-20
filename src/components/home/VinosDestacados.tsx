import { Link } from 'react-router-dom'
import { PRODUCTOS } from '../../data/catalogo'
import { destacados } from '../../lib/productos'
import { ProductCard } from '../producto/ProductCard'
import { estilosBoton } from '../ui/estilosBoton'
import { Carousel } from '../ui/Carousel'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

export function VinosDestacados() {
  const seleccion = destacados(PRODUCTOS)
  if (seleccion.length === 0) return null

  return (
    <section aria-labelledby="destacados" className="bg-crema py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle
            id="destacados"
            copete="Selección de la casa"
            bajada="Las botellas que más recomendamos esta temporada."
          >
            Nuestras bebidas destacadas
          </SectionTitle>
        </Reveal>

        <Reveal className="mt-14">
          <Carousel etiqueta="Vinos destacados">
            {seleccion.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </Carousel>
        </Reveal>

        <div className="mt-12 text-center">
          <Link to="/carta" className={estilosBoton('secundario', 'lg')}>
            Ver la carta completa
          </Link>
        </div>
      </div>
    </section>
  )
}
