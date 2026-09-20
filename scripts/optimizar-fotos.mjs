/**
 * Prepara las fotos pesadas para la web.
 *
 * Las fotos que salen del celular pesan 3–5 MB y miden 3213×5712 px, pero en
 * el sitio se ven a ~300 px: el navegador tiene que descargar y achicar una
 * imagen gigante en cada carga. Eso es lo que traba el inicio, y el achique al
 * vuelo es lo que las hace ver sucias.
 *
 * Acá se recortan y se guardan ya en la medida en la que se muestran, en
 * formato WebP: pasan de ~3,5 MB a ~100 KB cada una y se ven nítidas incluso
 * en pantallas retina.
 *
 *   fotos-originales/   las fotos como vinieron (no se publican)
 *   public/img/         lo que genera este script (esto es lo que se sube)
 *
 * Se corre a mano cuando cambian las fotos:
 *
 *   npm run fotos
 *
 * No corre en cada `npm run dev` porque tarda unos segundos y el resultado
 * queda guardado en el repositorio.
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ruta = (...partes) => resolve(raiz, ...partes)

const ORIGINALES = 'fotos-originales'
const EXTENSIONES = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

/** Galería: cuadradas, porque la grilla del inicio las recorta a cuadrado. */
const GALERIA = { lado: 900, calidad: 78 }

/**
 * Fotos sueltas: cada una se recorta con la proporción que usa su sección.
 * Si se cambia la proporción en el componente, hay que cambiarla también acá.
 */
const SUELTAS = [
  {
    origen: 'frente-vineria-martu.jpg',
    destino: 'public/img/hero.webp',
    ancho: 1100,
    alto: 1467, // 3:4, la columna derecha del hero
    calidad: 82,
    seccion: 'hero',
  },
  {
    // Sí, es la misma foto que el hero: va recortada distinto (4:5 en vez de
    // 3:4), así que son dos archivos y no uno reutilizado.
    origen: 'frente-vineria-martu.jpg',
    destino: 'public/img/nosotros.webp',
    ancho: 1000,
    alto: 1250, // 4:5, el bloque "Sobre Vinería Martu"
    calidad: 80,
    seccion: 'nosotros',
  },
]

/** Cuánto pesa un archivo, listo para mostrar. */
const peso = (archivo) => `${(statSync(archivo).size / 1024).toFixed(0)} KB`

/**
 * Saca el fondo blanco del logo.
 *
 * El logo original es un JPEG con fondo blanco: sobre el header claro no se
 * nota, pero sobre el hero y sobre el footer oscuro quedaría un recuadro
 * blanco alrededor. Como todo el logo vive adentro del óvalo amarillo, con
 * volver transparente el blanco de afuera alcanza para los dos fondos.
 *
 * Se pinta desde los bordes hacia adentro (relleno por inundación) en vez de
 * volver transparente todo lo blanco: si no, desaparecería también el blanco
 * de la palabra "VINERIA", que está adentro del logo.
 */
async function logoTransparente(origen, destino) {
  const { data, info } = await sharp(origen).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: ancho, height: alto, channels: canales } = info

  const FONDO = 238 // de acá para arriba se considera blanco de fondo
  const OPACO = 205 // de acá para abajo el píxel es dibujo, no borde

  const esClaro = (i) =>
    data[i * canales] >= FONDO && data[i * canales + 1] >= FONDO && data[i * canales + 2] >= FONDO

  const fondo = new Uint8Array(ancho * alto)
  const cola = []

  const encolar = (x, y) => {
    const i = y * ancho + x
    if (fondo[i] || !esClaro(i)) return
    fondo[i] = 1
    cola.push(i)
  }

  for (let x = 0; x < ancho; x++) {
    encolar(x, 0)
    encolar(x, alto - 1)
  }
  for (let y = 0; y < alto; y++) {
    encolar(0, y)
    encolar(ancho - 1, y)
  }

  while (cola.length > 0) {
    const i = cola.pop()
    const x = i % ancho
    const y = (i / ancho) | 0
    if (x > 0) encolar(x - 1, y)
    if (x < ancho - 1) encolar(x + 1, y)
    if (y > 0) encolar(x, y - 1)
    if (y < alto - 1) encolar(x, y + 1)
  }

  // El fondo queda transparente. Los píxeles pegados al fondo quedan a media
  // transparencia según cuánto blanco tengan: sin eso, el contorno rojo del
  // óvalo queda dentado y con un halo gris del JPEG.
  for (let i = 0; i < ancho * alto; i++) {
    if (fondo[i]) {
      data[i * canales + 3] = 0
      continue
    }

    const x = i % ancho
    const y = (i / ancho) | 0
    const pegadoAlFondo =
      (x > 0 && fondo[i - 1]) ||
      (x < ancho - 1 && fondo[i + 1]) ||
      (y > 0 && fondo[i - ancho]) ||
      (y < alto - 1 && fondo[i + ancho])

    if (!pegadoAlFondo) continue

    const claridad = Math.max(data[i * canales], data[i * canales + 1], data[i * canales + 2])
    if (claridad <= OPACO) continue
    data[i * canales + 3] = Math.round(255 * (1 - (claridad - OPACO) / (255 - OPACO)))
  }

  await sharp(data, { raw: { width: ancho, height: alto, channels: canales } })
    .trim({ threshold: 1 }) // saca el margen transparente que quedó alrededor
    .png({ palette: true, quality: 90, effort: 10 }) // el logo son colores planos: con paleta pesa un tercio
    .toFile(destino)

  const { width, height } = await sharp(destino).metadata()
  console.log(`logo:     logo-martu.png — ${width}×${height} px, ${peso(destino)} (fondo transparente)`)
  return { width, height }
}

/* -------------------------------------------------------------------------- */

if (!existsSync(ruta(ORIGINALES))) {
  console.log(`No existe ${ORIGINALES}/: no hay fotos originales para procesar.`)
  process.exit(0)
}

mkdirSync(ruta('public/img/galeria'), { recursive: true })

// Logo
const logoOriginal = readdirSync(ruta(ORIGINALES)).find((archivo) => archivo.startsWith('logo-'))

if (logoOriginal) {
  await logoTransparente(ruta(ORIGINALES, logoOriginal), ruta('public/img/logo-martu.png'))
} else {
  console.log(`logo:     falta el original en ${ORIGINALES}/ (un archivo que empiece con "logo-")`)
}

// Fotos sueltas (hero y "Sobre Vinería Martu")
for (const foto of SUELTAS) {
  if (!existsSync(ruta(ORIGINALES, foto.origen))) {
    console.log(`${foto.seccion}:${' '.repeat(Math.max(1, 9 - foto.seccion.length))}falta ${ORIGINALES}/${foto.origen}`)
    continue
  }

  const destino = ruta(foto.destino)

  await sharp(ruta(ORIGINALES, foto.origen))
    .rotate() // respeta la orientación con la que se sacó la foto
    .resize(foto.ancho, foto.alto, { fit: 'cover', position: 'centre' })
    .webp({ quality: foto.calidad, effort: 6 })
    .toFile(destino)

  const nombre = foto.destino.split('/').pop()
  console.log(
    `${foto.seccion}:${' '.repeat(Math.max(1, 9 - foto.seccion.length))}${nombre} — ` +
      `${foto.ancho}×${foto.alto} px, ${peso(destino)} (de ${foto.origen})`,
  )
}

// Galería: entra todo lo que haya en fotos-originales/galeria/
const carpetaGaleria = ruta(ORIGINALES, 'galeria')
const fotos = existsSync(carpetaGaleria)
  ? readdirSync(carpetaGaleria).filter((archivo) => EXTENSIONES.includes(extname(archivo).toLowerCase()))
  : []

for (const archivo of fotos) {
  const nombre = basename(archivo, extname(archivo))
  const destino = ruta('public/img/galeria', `${nombre}.webp`)

  await sharp(resolve(carpetaGaleria, archivo))
    .rotate()
    .resize(GALERIA.lado, GALERIA.lado, { fit: 'cover', position: 'centre' })
    .webp({ quality: GALERIA.calidad, effort: 6 })
    .toFile(destino)

  console.log(`galería:  ${nombre}.webp — ${GALERIA.lado}×${GALERIA.lado} px, ${peso(destino)}`)
}

console.log(`\nListo: ${fotos.length} foto(s) de galería.`)

// Deja anotado de dónde sale cada cosa, para no tener que adivinarlo después.
const leeme = [
  '# Fotos originales',
  '',
  'Acá van las fotos **como vinieron** (del celular, el logo original, etc.).',
  'Esta carpeta **no se publica**: el sitio sirve lo que genera `npm run fotos` dentro de `public/img/`.',
  '',
  '| Archivo | Se convierte en |',
  '|---|---|',
  '| `logo-vineriamartu.jpeg` | `public/img/logo-martu.png` (con el fondo blanco sacado) |',
  '| `frente-vineria-martu.jpg` | `public/img/hero.webp` (portada del inicio, 3:4) |',
  '| `frente-vineria-martu.jpg` | `public/img/nosotros.webp` ("Sobre Vinería Martu", 4:5) |',
  '| `galeria/*` | `public/img/galeria/*.webp` (galería del inicio) |',
  '',
  'Para cambiar la galería: agregá o sacá fotos de `galeria/` y corré `npm run fotos`.',
  '',
  'Las fotos sueltas en esta carpeta que no figuran en la tabla quedan guardadas pero el sitio no las usa.',
  '',
].join('\n')

writeFileSync(ruta(ORIGINALES, 'LEEME.md'), leeme)
