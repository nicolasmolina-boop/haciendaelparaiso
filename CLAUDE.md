# CLAUDE.md — Hacienda El Paraíso

## Qué es este proyecto

Sitio web institucional y comercial de **Hacienda El Paraíso**, una finca agrícola hondureña dedicada a la producción de lechugas hidropónicas, hierbas aromáticas y hortalizas frescas. El sitio sirve para captar clientes (restaurantes, hoteles, familias), mostrar productos, recibir pedidos vía WhatsApp y promover turismo rural.

**URL en producción:** https://haciendaelparaiso.org  
**Hosting:** GitHub Pages  
**Repositorio:** https://github.com/nicolasmolina-boop/haciendaelparaiso

## Estructura del proyecto

```
haciendaelparaiso/
├── index.html      ← Página única (landing page completa)
├── estilos.css     ← Todos los estilos
├── script.js       ← JavaScript (animaciones, contadores, menú, etc.)
├── img/            ← Todas las imágenes del sitio
├── CNAME           ← Dominio personalizado (NO TOCAR)
├── README.md       ← Descripción del repo
└── CLAUDE.md       ← Este archivo
```

Es un sitio **HTML puro** (HTML + CSS + JS), sin frameworks, sin bundlers, sin npm. Todo en un solo `index.html` tipo landing page con secciones ancla.

## Secciones del sitio (en orden)

1. **Hero** — Encabezado con estadísticas animadas (hectáreas, variedades, clientes, días)
2. **Historia** — Quiénes somos, compromiso ambiental
3. **Productos** — Lechugas, hierbas aromáticas, hortalizas
4. **Galería** — 8 fotos de la hacienda con lightbox
5. **Turismo** — Tours, degustaciones, talleres, retiros
6. **Testimonios** — Slider de opiniones de clientes
7. **Blog/Noticias** — 3 artículos destacados
8. **Pedidos** — 3 planes (Semanal, Premium, Empresarial) con links a WhatsApp
9. **Contacto** — Formulario que redirige a WhatsApp
10. **Footer** — Navegación, legal, copyright

## Identidad de marca

- **Color principal (verde):** #4C7452
- **Color secundario (dorado):** #C9A84C
- **Logo:** León dorado sobre fondo verde (`img/logo.png`)
- **Tono:** Premium, natural, profesional pero cálido
- **Idioma principal:** Español (Honduras)
- **IMPORTANTE:** Todo texto DEBE llevar acentos y tildes correctos

## Datos del negocio

- **Empresa:** Hacienda El Paraíso
- **Dueño:** Nicolás Molina
- **Ubicación:** Valle de Ángeles, Francisco Morazán, Honduras
- **WhatsApp:** +504 9765-5779
- **Correo:** nicolas.molina@grupoeps.hn
- **Productos:** 12+ variedades — lechugas (Romana, Iceberg, Butterhead, etc.), hierbas aromáticas (albahaca, cilantro, perejil, menta), hortalizas (tomates, pepinos, pimientos)
- **Clientes objetivo:** Restaurantes, hoteles, cadenas de supermercados y familias en Tegucigalpa y Valle de Ángeles

## Reglas para Claude Code

### SÍ hacer
- Usar acentos y tildes correctos en TODO el español
- Mantener la paleta de colores (#4C7452 verde, #C9A84C dorado)
- Hacer un commit por cada tarea completada con mensaje descriptivo
- Probar que los cambios se vean bien en móvil y escritorio
- Mantener el sitio rápido — optimizar imágenes, usar lazy loading
- Respetar la estructura actual (un solo index.html)

### NO hacer
- NO tocar el archivo CNAME
- NO agregar frameworks (React, Vue, Tailwind, etc.) — mantener HTML puro
- NO cambiar la estructura de carpetas sin consultarme
- NO eliminar secciones completas sin autorización
- NO usar contenido en inglés a menos que se pida explícitamente
- NO inventar datos de la empresa — preguntar si no estás seguro
- NO hacer commits directos a main sin explicar qué se cambió

### Convenciones de código
- CSS: Usar variables CSS para colores recurrentes
- JS: Vanilla JavaScript, sin jQuery ni librerías externas
- HTML: Semántico (header, main, section, footer, article, nav)
- Imágenes: Formato WebP preferido, máximo 200KB por imagen
- Commits: En español, formato `tipo: descripción` (ej: `fix: corregir tildes en sección productos`)

## Deploy

El sitio se publica automáticamente con **GitHub Pages** desde la rama `main`. Cada push a main actualiza el sitio en vivo en https://haciendaelparaiso.org en ~1 minuto.

## Tareas pendientes prioritarias

1. Corregir contadores del hero que muestran "0"
2. Agregar tildes/acentos a todo el sitio
3. Crear páginas legales (Privacidad, Términos)
4. Agregar precios reales a sección de pedidos
5. Agregar meta tags SEO y Open Graph
6. Agregar botón flotante de WhatsApp
7. Agregar links a redes sociales en footer
8. Verificar/reemplazar testimonios ficticios
9. Verificar que el switch ES/EN funcione o quitarlo
10. Agregar favicon

---

*Última actualización: 10 de abril 2026*
