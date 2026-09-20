import { DIRECCION_COMPLETA, NEGOCIO } from '../data/negocio'
import type { Producto } from '../types/producto'

/**
 * SEO: títulos, descripciones y datos estructurados.
 *
 * Para una vinería de barrio lo que más mueve la aguja es el JSON-LD de
 * LocalBusiness (dirección, teléfono y horarios reales) y que el link se vea
 * bien cuando alguien lo comparte por WhatsApp (Open Graph).
 */

export const TITULO_BASE = `${NEGOCIO.nombre} · Carta de vinos y bebidas`

export function titulo(pagina?: string): string {
  return pagina ? `${pagina} · ${NEGOCIO.nombre}` : TITULO_BASE
}

export function urlAbsoluta(ruta: string): string {
  return new URL(ruta, NEGOCIO.sitioUrl).toString()
}

/** Datos estructurados del local. Se inyectan en todas las páginas. */
export function schemaNegocio() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LiquorStore',
    name: NEGOCIO.nombre,
    image: urlAbsoluta('/img/logo-martu.png'),
    url: NEGOCIO.sitioUrl,
    telephone: NEGOCIO.telefono.tel,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: NEGOCIO.direccion.calle,
      addressLocality: NEGOCIO.direccion.localidad,
      addressRegion: NEGOCIO.direccion.provincia,
      postalCode: NEGOCIO.direccion.cp,
      addressCountry: 'AR',
    },
    openingHours: NEGOCIO.horariosSchema,
    sameAs: [NEGOCIO.instagramUrl],
  }
}

/** Datos estructurados de una ficha de producto. */
export function schemaProducto(producto: Producto) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion,
    image: urlAbsoluta(producto.imagen),
    ...(producto.bodega ? { brand: { '@type': 'Brand', name: producto.bodega } } : {}),
    ...(producto.precio !== undefined
      ? {
          offers: {
            '@type': 'Offer',
            price: producto.precio,
            priceCurrency: 'ARS',
            availability: producto.disponible
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            seller: { '@type': 'LiquorStore', name: NEGOCIO.nombre },
          },
        }
      : {}),
  }
}

/** Descripción de una ficha, con los datos que efectivamente existan. */
export function descripcionProducto(producto: Producto): string {
  const contexto = [producto.bodega, producto.region, producto.cosecha].filter(Boolean).join(' · ')
  const base = contexto ? `${contexto}. ${producto.descripcion}` : producto.descripcion
  return `${base} Consultá disponibilidad en ${NEGOCIO.nombre}, ${DIRECCION_COMPLETA}.`
}
