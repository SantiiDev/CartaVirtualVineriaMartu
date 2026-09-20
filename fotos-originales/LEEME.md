# Fotos originales

Acá van las fotos **como vinieron** (del celular, el logo original, etc.).
Esta carpeta **no se publica**: el sitio sirve lo que genera `npm run fotos` dentro de `public/img/`.

| Archivo | Se convierte en |
|---|---|
| `logo-vineriamartu.jpeg` | `public/img/logo-martu.png` (con el fondo blanco sacado) |
| `frente-vineria-martu.jpg` | `public/img/nosotros.webp` (sección "Sobre Vinería Martu") |
| `galeria/*` | `public/img/galeria/*.webp` (galería del inicio) |

Para cambiar la galería: agregá o sacá fotos de `galeria/` y corré `npm run fotos`.

Las fotos sueltas en esta carpeta que no figuran en la tabla quedan guardadas pero el sitio no las usa.
