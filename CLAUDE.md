# CLAUDE.md — Hacienda El Paraíso

Sitio de **Hacienda El Paraíso** (Aldea Los Dos Ríos, Valle de Ángeles, Honduras): hierbas y hojas frescas,
visitas, eventos, refugio pastoral y campamento base para el Cañón El Torno.

- **Producción:** https://haciendaelparaiso.org — GitHub Pages desde `main` (raíz). Publicar = `git push origin main`.
- **Repo:** https://github.com/nicolasmolina-boop/haciendaelparaiso
- **No tocar:** `CNAME` y `google4ad577691d7cdcc5.html` (verificación de Search Console).

## Estructura (HTML + CSS + JS puros, sin frameworks ni build)

| Archivo | Qué es |
|---|---|
| `index.html` | Portada, con el explorador 3D del terreno real (`scene.js`, `scene-loader.js`, `js/`, `img/terreno/`) |
| `cosecha.html` | Productos y canasta (cotización por WhatsApp) |
| `experiencias.html` | Visitas y descanso |
| `eventos.html` | Bodas y celebraciones |
| `el-torno.html` | Cañón El Torno: rapel, pozas, videos de visitantes |
| `campamento-base.html` | Campamento base para grupos y operadores de aventura |
| `refugio-pastoral.html` | Programa para pastores y líderes |
| `privacidad.html`, `terminos.html` | Legales (usan `estilos.css`, el diseño anterior) |
| `404.html` | Página no encontrada |
| `style.css` | Estilos del diseño actual · `app.js`: canasta, planificador, galería, menú |
| `sitemap.xml`, `robots.txt` | SEO |

El encabezado, el pie y los diálogos (canasta, planificador, galería, privacidad) están **repetidos en cada HTML**:
un cambio ahí se aplica en todas las páginas. Las opciones del planificador deben existir también en el objeto
`texts` de `app.js`.

## Diseño

- Verde `#193b32` / `#122c26`, crema `#f7f5ee`, arena `#eae5d8`, lima `#dce9a2`. Tipos: Playfair Display + DM Sans.
- Se escribe de «tú». Sin precios: todo se cotiza por WhatsApp (+504 9765-5779).
- Imágenes en WebP dentro de `img/`; procurar menos de 200 KB cada una.

## Reglas

- Nada inventado: cifras, servicios y fotos tienen que ser reales. Las fotos de terceros llevan crédito.
- Diseño nuevo: primero vista previa y visto bueno de Nicolás; después se publica.
- Probar en escritorio y en celular (390 px) antes de subir: sin errores de consola ni desborde horizontal.
- Al agregar una página: enlazarla, sumarla a `sitemap.xml` y darle `title`, `description`, `canonical` y Open Graph.
