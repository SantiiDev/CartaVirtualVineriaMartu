/**
 * Arma el mapa de fotos de productos leyendo public/img/productos/ y la lista
 * de fotos de la galería leyendo public/img/galeria/.
 *
 * La regla es una sola: **el archivo se llama igual que el `id` del producto**
 * (catena-malbec.jpg → producto "catena-malbec"). Sirve cualquier extensión.
 * Así, para cargar una foto nueva alcanza con guardarla con el nombre correcto:
 * no hay que tocar productos.json ni el código.
 *
 * Se ejecuta antes de `npm run dev` y de `npm run build`. Si agregás una foto
 * con el servidor de desarrollo andando, reinicialo para que la tome.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, extname, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CARPETA = 'public/img/productos'

// Orden de preferencia si hay varias fotos con el mismo nombre y distinta extensión.
const EXTENSIONES = ['.webp', '.avif', '.jpg', '.jpeg', '.png', '.svg']

const { productos } = JSON.parse(readFileSync(resolve(raiz, 'src/data/productos.json'), 'utf8'))
const ids = new Set(productos.map((producto) => producto.id))

const archivos = readdirSync(resolve(raiz, CARPETA))
  .filter((archivo) => EXTENSIONES.includes(extname(archivo).toLowerCase()))
  .filter((archivo) => basename(archivo, extname(archivo)) !== 'placeholder-botella')

const mapa = {}
const sinProducto = []

for (const archivo of archivos) {
  const id = basename(archivo, extname(archivo))
  if (!ids.has(id)) {
    sinProducto.push(archivo)
    continue
  }

  const actual = mapa[id]
  const mejor =
    !actual ||
    EXTENSIONES.indexOf(extname(archivo).toLowerCase()) < EXTENSIONES.indexOf(extname(actual).toLowerCase())

  if (mejor) mapa[id] = archivo
}

const rutas = Object.fromEntries(
  Object.entries(mapa)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, archivo]) => [id, `/img/productos/${archivo}`]),
)

writeFileSync(resolve(raiz, 'src/data/imagenes.generado.json'), `${JSON.stringify(rutas, null, 2)}\n`)

// Avisos para que sea obvio qué falta, sin frenar el build.
const sinFoto = productos.filter((producto) => !producto.imagen && !rutas[producto.id])

console.log(`imágenes: ${Object.keys(rutas).length} de ${productos.length} productos tienen foto`)

if (sinFoto.length > 0) {
  console.log(
    `  sin foto (se muestra la botella genérica):\n${sinFoto
      .map((producto) => `    • ${producto.id} — guardá la foto como ${CARPETA}/${producto.id}.jpg`)
      .join('\n')}`,
  )
}

if (sinProducto.length > 0) {
  console.log(
    `  archivos que no coinciden con ningún id de producto:\n${sinProducto
      .map((archivo) => `    • ${archivo}`)
      .join('\n')}`,
  )
}

/* --------------------------------------------------------------------------
   Galería del local: public/img/galeria/
   Acá no hay ids que respetar, entra todo lo que haya en la carpeta. El orden
   es el del nombre del archivo, y los números se ordenan como números (foto-2
   antes que foto-10), así alcanza con numerarlas para decidir el orden.

   Ojo: estas fotos no se guardan a mano. Las genera `npm run fotos` a partir
   de fotos-originales/galeria/, ya recortadas y livianas (ver el README).
   -------------------------------------------------------------------------- */
const CARPETA_GALERIA = 'public/img/galeria'

const porNombre = new Intl.Collator('es', { numeric: true, sensitivity: 'base' })

const fotos = (existsSync(resolve(raiz, CARPETA_GALERIA)) ? readdirSync(resolve(raiz, CARPETA_GALERIA)) : [])
  .filter((archivo) => EXTENSIONES.includes(extname(archivo).toLowerCase()))
  .sort(porNombre.compare)
  .map((archivo) => `/img/galeria/${archivo}`)

writeFileSync(resolve(raiz, 'src/data/galeria.generado.json'), `${JSON.stringify(fotos, null, 2)}\n`)

console.log(`galería: ${fotos.length} foto(s) en ${CARPETA_GALERIA}`)

if (fotos.length === 0) {
  console.log(`  la sección Galería no se va a mostrar: guardá las fotos en ${CARPETA_GALERIA}/`)
}
