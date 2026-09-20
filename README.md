# Vinería Martu — Carta virtual

Carta virtual de vinos y bebidas de **Vinería Martu** (Morelli 918, Pérez, Gran Rosario).

Es un **catálogo de exhibición**: no tiene carrito, checkout, cuentas ni pagos. La única acción
comercial es que el cliente consulte por teléfono o Instagram. Está pensada sobre todo para el
celular, porque la mayoría va a entrar escaneando un QR en el local.

---

## Cómo correr el proyecto

Hace falta [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # servidor local en http://localhost:5173
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el sitio en modo desarrollo, con recarga automática |
| `npm run build` | Genera el sitio final en `dist/` (y regenera el mapa de fotos y el `sitemap.xml`) |
| `npm run preview` | Sirve lo que generó `build`, para revisarlo antes de publicar |
| `npm run imagenes` | Vuelve a leer las fotos de `public/img/productos/` y avisa a qué productos les falta |
| `npm run fotos` | Optimiza las fotos del local y el logo desde `fotos-originales/` (ver "Cómo reemplazar las imágenes") |
| `npm run lint` | Revisa el código |
| `npm run typecheck` | Verifica los tipos de TypeScript |

---

## Cómo cargar productos

**Todo el catálogo vive en un solo archivo: `src/data/productos.json`.** Se edita a mano, sin tocar
nada de código. Después de guardarlo, el sitio se actualiza solo en desarrollo; para publicar los
cambios hay que hacer `npm run build` y subirlo (o, si está conectado a Netlify, simplemente hacer
commit y push: Netlify lo reconstruye solo).

El archivo tiene esta forma:

```json
{
  "_nota": "DATOS DE PRUEBA...",
  "productos": [
    { ... },
    { ... }
  ]
}
```

> ⚠️ El catálogo cargado (23 productos) se armó a partir de las fotos que hay en
> `public/img/productos/`. **Faltan los precios**: mientras el campo `precio` no esté, la carta
> muestra "Consultar". Conviene revisar también nombres, cosechas y descripciones.

### Un producto completo

```json
{
  "id": "catena-malbec",
  "nombre": "Catena Malbec",
  "categoria": "vino",
  "subcategoria": "Malbec",
  "bodega": "Catena Zapata",
  "region": "Mendoza",
  "cosecha": 2022,
  "presentacion": "750 ml",
  "precio": 21500,
  "descripcion": "El Malbec clásico de la casa, fruta madura y taninos redondos.",
  "notasCata": "Ciruela y cereza negra, con un dejo de violetas y vainilla del roble.",
  "maridaje": "Asado, bife de chorizo, quesos estacionados.",
  "destacado": true,
  "disponible": true
}
```

### Qué significa cada campo

| Campo | ¿Obligatorio? | Detalle |
|---|---|---|
| `id` | Sí | Identificador único, sin espacios ni acentos. Es lo que va en la URL (`/carta/catena-malbec`). **No conviene cambiarlo** una vez publicado: rompe los links compartidos. |
| `nombre` | Sí | Como se muestra en la carta |
| `categoria` | Sí | Una de: `vino`, `espumante`, `cerveza`, `aperitivo`, `destilado`, `sin-alcohol` |
| `subcategoria` | No | Varietal en vinos (`Malbec`, `Blend`) o tipo en el resto (`Gin`, `IPA`, `Fernet`). Aparece solo como filtro |
| `bodega` | No | También se usa como filtro y en el buscador |
| `region` | No | Ej. `Valle de Uco, Mendoza` |
| `cosecha` | No | Año, como número: `2022` (sin comillas) |
| `presentacion` | Sí | Ej. `750 ml`, `1,5 L` |
| `precio` | No | Número sin `$` ni puntos: `21500`. **Si se borra el campo, la carta muestra "Consultar"** |
| `descripcion` | Sí | Una o dos líneas |
| `notasCata` | No | Si no está, la sección no aparece |
| `maridaje` | No | Si no está, la sección no aparece |
| `imagen` | No | **Normalmente no se usa.** La foto se busca sola por el `id` (ver más abajo). Solo se completa si una foto está guardada con otro nombre |
| `destacado` | Sí | `true` lo pone en el carrusel del inicio y arriba en la carta |
| `disponible` | Sí | `false` lo muestra atenuado con el cartel "Sin stock" (no lo esconde) |

### Errores comunes

- **Las comas**: cada producto se separa del siguiente con `,`, pero el último no lleva coma.
- **Los `id` no se pueden repetir.**
- `precio`, `cosecha`, `destacado` y `disponible` van **sin comillas**. El resto, con comillas.
- Si algo queda mal cargado, al correr `npm run dev` aparece un aviso en la consola del navegador
  (F12 → Consola) diciendo exactamente qué producto y qué campo está mal. El sitio no se rompe.

### Las fotos se conectan solas

**No hay que cargar la ruta de la foto en ningún lado.** El sitio busca, en
`public/img/productos/`, el archivo que se llame igual que el `id` del producto:

| Producto (`id`) | Archivo de la foto |
|---|---|
| `rutini-malbec` | `public/img/productos/rutini-malbec.jpg` |
| `gran-enemigo` | `public/img/productos/gran-enemigo.jpg` |

Sirve cualquier formato: `.jpg`, `.png`, `.webp`, `.avif` o `.svg`. Si hubiera dos archivos con el
mismo nombre y distinta extensión, gana el más liviano (`.webp` antes que `.jpg`).

Al producto que no tenga foto se le muestra una botella genérica: **nunca queda una imagen rota**.

Para saber qué fotos faltan, alcanza con correr:

```bash
npm run imagenes
```

Lista producto por producto con qué nombre hay que guardar cada archivo, y avisa si hay fotos cuyo
nombre no coincide con ningún producto (típicamente, un error de tipeo). El mismo aviso aparece en la
consola del navegador al correr `npm run dev`.

> Si agregás una foto con `npm run dev` ya corriendo, hay que reiniciarlo para que la tome.
> El listado se regenera solo en cada `npm run dev` y `npm run build`.

**Consejo para las fotos de botellas**: que sean todas más o menos del mismo tamaño y con fondo
claro o transparente. La tarjeta las muestra centradas sobre un fondo neutro, así que quedan
prolijas aunque vengan de distintas fuentes. Un ancho de 600–900 px alcanza y sobra.

### Filtros que se arman solos

No hay que cargar la lista de bodegas ni de varietales en ningún lado: **los filtros de la carta se
arman leyendo los productos**. Si se agrega un vino de una bodega nueva, esa bodega aparece sola en
el panel de filtros.

En el inicio, "Explorá por categoría" muestra tres tarjetas —Vinos, Espumantes y Otras bebidas— y
cada una lleva a la carta ya filtrada. La tarjeta que se queda sin productos desaparece sola.

> El sitio también sabe clasificar los vinos por color (tinto / blanco / rosado) deduciéndolo del
> varietal: está en `src/lib/vinos.ts`, hoy sin usar. Es el archivo a tocar si alguna vez se quiere
> una tarjeta por color en el inicio, o sumar un varietal blanco que el sitio todavía no conoce.

---

## Cómo reemplazar las imágenes

Todas las imágenes están en `public/img/`. **Se reemplaza el archivo manteniendo el mismo nombre** y
listo, no hay que tocar código.

| Qué | Dónde va |
|---|---|
| **Logo** | `public/img/logo-martu.png` — lo genera `npm run fotos` (ver abajo) |
| **Fotos de productos** | `public/img/productos/`, con el `id` del producto como nombre (ver arriba) |
| **Fotos descartadas** | `public/img/productos/duplicadas/` — quedan guardadas ahí y el sitio las ignora |
| **Foto del hero** (portada) | `public/img/hero.webp` — la genera `npm run fotos` |
| **Foto de "Sobre Vinería Martu"** | `public/img/nosotros.webp` — lo genera `npm run fotos` |
| **Galería del local** | `public/img/galeria/` — los genera `npm run fotos` |
| **Tarjetas de categoría** | `public/img/categorias/` |
| **Imagen para compartir** (WhatsApp, redes) | `public/og-image.png` — conviene 1200×630 px |
| **Favicon** | `public/favicon.svg` |
| **Relleno de fotos** | `public/img/placeholder-foto.svg` — solo se ve si falta alguna foto grande |

> Las tarjetas de categoría son dibujos SVG hechos a medida (`vinos`, `espumantes` y
> `otras-bebidas`), no fotos: se editan como archivo de texto.

Las fotos de productos aceptan cualquier extensión sin tocar nada. Para el resto, si cambiás la
extensión de un archivo hay que actualizarla también en el componente que lo usa
(`src/components/home/`).

### Las fotos del local y el logo: `npm run fotos`

Una foto de celular pesa 3–5 MB y mide 3213×5712 px, pero en el sitio se ve a 300 px. Si se sube
tal cual, el navegador descarga varios megas por foto y las achica al vuelo: el inicio se traba y la
galería se ve sucia. Por eso hay dos carpetas:

| Carpeta | Qué tiene |
|---|---|
| `fotos-originales/` | Las fotos **como vinieron**. No se publica: es el archivo de originales |
| `public/img/` | Lo que realmente se sube, ya recortado y liviano (~100 KB por foto) |

```bash
npm run fotos
```

Lee `fotos-originales/`, genera las versiones optimizadas en `public/img/` y actualiza el listado de
la galería. Se corre **solo cuando cambian las fotos** (no en cada `npm run dev`).

Qué sale de dónde:

| Original | Se convierte en |
|---|---|
| `fotos-originales/logo-vineriamartu.jpeg` | `public/img/logo-martu.png`, con el fondo blanco sacado para que se vea bien sobre el header claro y sobre el footer oscuro |
| `fotos-originales/frente-vineria-martu.jpg` | `public/img/hero.webp`, recortada 3:4 para la portada del inicio |
| `fotos-originales/frente-vineria-martu.jpg` | `public/img/nosotros.webp`, la misma foto recortada 4:5 para "Sobre Vinería Martu" |
| `fotos-originales/galeria/*` | `public/img/galeria/*.webp`, cuadradas de 900 px |

**Para cambiar la galería**: agregá o sacá fotos de `fotos-originales/galeria/` y corré `npm run fotos`.
Entra todo lo que haya en esa carpeta, en orden alfabético. La descripción que leen los lectores de
pantalla se escribe en `TEXTOS_ALT`, dentro de `src/components/home/Galeria.tsx`.

> Las fotos sueltas en `fotos-originales/` que no figuran en la tabla quedan guardadas pero el
> sitio no las usa. Los recortes están definidos en `scripts/optimizar-fotos.mjs`: si cambiás la
> proporción de una sección en el componente, cambiala también ahí.

---

## Datos del local y contacto

Dirección, horarios, teléfono e Instagram están todos en **`src/data/negocio.ts`**. Se edita ahí y
cambia en todo el sitio a la vez (header, footer, contacto, mapa y datos de SEO).

### Cuando tengan WhatsApp

Hoy la vinería no tiene WhatsApp, así que el botón principal de consulta es **"Llamar"**, con
Instagram al lado. Para cambiarlo, en `src/data/negocio.ts`:

```ts
whatsapp: null,
```

se reemplaza por el número en formato internacional, sin `+`, sin espacios y sin guiones:

```ts
whatsapp: '5493416123456',
```

Con eso alcanza: **todos los botones del sitio pasan solos a WhatsApp**, con el mensaje ya escrito
("¡Hola! Quería consultar por el vino Catena Malbec"), incluido el botón flotante.

---

## Cómo publicarlo

El proyecto está configurado para **Netlify**:

1. En Netlify, "Add new site" → "Import an existing project" → elegir este repositorio.
2. Netlify lee `netlify.toml` y ya sabe qué hacer (`npm run build`, publicar `dist/`).
3. Cada vez que se haga push, el sitio se actualiza solo.

Después de conectar el dominio definitivo, conviene cambiar `sitioUrl` en `src/data/negocio.ts` y la
línea del sitemap en `public/robots.txt`, para que los links compartidos y el SEO apunten bien.

El archivo `public/_redirects` es necesario para que funcione entrar directo a una dirección como
`/carta/catena-malbec`: sin él, Netlify devolvería 404.

---

## Cómo está organizado el código

Arquitectura en capas, con las dependencias apuntando siempre hacia abajo: la lógica no sabe nada de
la presentación, y la presentación no sabe de dónde salen los datos.

```
fotos-originales/  Fotos del local y logo como vinieron, sin optimizar (no se publica)
public/img/        Las imágenes que sirve el sitio (parte las genera `npm run fotos`)
src/
  data/        Datos: productos.json, negocio.ts y el punto de entrada al catálogo
               (imagenes.generado.json lo escribe el script: no se edita a mano)
  types/       Qué forma tiene un producto, y el validador que avisa si el JSON está mal
  lib/         Lógica pura: filtrar, ordenar, buscar, formatear precios, SEO, contacto
  hooks/       Comportamiento reutilizable de React (filtros en la URL, foco, scroll, SEO)
  components/
    layout/    Header, menú mobile, footer, botón flotante
    ui/        Piezas genéricas: botones, títulos de sección, carrusel, imagen con fallback
    producto/  Tarjeta y grilla de productos
    carta/     Filtros, buscador, orden y estado vacío
    home/      Las secciones del inicio
  pages/       Home, Carta, ficha de producto y 404
  styles/      Colores, tipografías y animaciones
```

Los filtros de la carta viven en la URL (`/carta?cat=vino&var=Malbec`), así que una búsqueda se
puede compartir por WhatsApp y el botón "atrás" del celular deshace el último filtro.

**Para el futuro**: el código está preparado para sumar un carrito y más rubros (el negocio vende
también otros artículos). Los componentes de presentación no conocen la fuente de datos, así que
agregar un carrito es sumar una capa, no reescribir lo que hay.

---

## Qué falta completar

- [ ] Número de WhatsApp (`src/data/negocio.ts`)
- [ ] Que Martín y Karina revisen el texto de "Sobre Vinería Martu" (`src/components/home/SobreNosotros.tsx`): está escrito con los datos conocidos, pero la historia del local la saben ellos
- [ ] **Cargar los precios** en `src/data/productos.json` (hoy todos muestran "Consultar")
- [ ] Revisar nombres, cosechas y descripciones de los 23 productos
- [ ] Sumar el resto del catálogo (blancos, rosados, cervezas, aperitivos): cada categoría aparece sola en el sitio cuando tiene productos
- [ ] Fotos de las botellas nuevas que se vayan sumando (`npm run imagenes` dice cuáles faltan)
- [ ] Dominio definitivo (`sitioUrl` en `src/data/negocio.ts` y `public/robots.txt`)

---

## Stack

Vite · React · TypeScript · Tailwind CSS · React Router · Embla Carousel.
Sin backend ni base de datos: todo el contenido sale de archivos del repositorio.
