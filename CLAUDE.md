# CLAUDE.md — Hacienda El Paraíso

## Qué es este proyecto

Sitio web institucional y comercial de **Hacienda El Paraíso**, una finca agrícola hondureña dedicada a la producción de lechugas hidropónicas, hierbas aromáticas y hortalizas frescas. El sitio sirve para captar clientes (restaurantes, hoteles, familias), mostrar productos, recibir pedidos vía WhatsApp y promover turismo rural.

**URL en producción:** https://haciendaelparaiso.org  
**Hosting:** GitHub Pages (dominio personalizado vía GoDaddy)  
**Repositorio:** https://github.com/nicolasmolina-boop/haciendaelparaiso

## Estructura del proyecto

```
haciendaelparaiso/
├── index.html        ← Página principal (landing page completa)
├── estilos.css       ← Todos los estilos
├── script.js         ← JavaScript (animaciones, contadores, menú, lightbox)
├── privacidad.html   ← Política de privacidad
├── terminos.html     ← Términos y condiciones
├── sitemap.xml       ← Sitemap para SEO
├── img/              ← Todas las imágenes del sitio
├── CNAME             ← Dominio personalizado (NO TOCAR)
└── CLAUDE.md         ← Este archivo
```

Es un sitio **HTML puro** (HTML + CSS + JS), sin frameworks, sin bundlers, sin npm. Todo en un solo `index.html` tipo landing page con secciones ancla.

## Secciones del sitio (en orden)

1. **Hero** — Imagen de fondo con título, subtítulo y CTAs
2. **Estadísticas** — Contadores animados (5+ hectáreas, 12+ variedades, 50+ clientes, 365 días)
3. **Historia** — Quiénes somos, compromiso ambiental, pasión por la calidad
4. **Productos** — Lechugas, hierbas aromáticas, hortalizas (cards con overlay hover)
5. **Galería** — 8 fotos reales de la hacienda con lightbox
6. **Turismo** — Tours guiados, degustaciones, talleres educativos, retiros rurales
7. **Refugio Pastoral** — (pendiente crear) Programa de restauración para pastores, líderes y familias
8. **Pedidos** — 3 planes (Semanal L.350, Premium L.750, Empresarial cotización) con links a WhatsApp
9. **Contacto** — Formulario que redirige a WhatsApp + mapa + info de contacto
10. **Footer** — Navegación, legal, redes sociales, copyright

### Página dedicada: refugio-pastoral.html (pendiente crear)
Página separada para el programa de restauración pastoral. Ver `contenido-refugio-pastoral.md` para el contenido completo.

## Identidad de marca

- **Color principal (verde oscuro):** #1a3a28 / #2c5f3f
- **Color secundario (tierra/dorado):** #c9a96e
- **Fondo general:** #faf8f4 (crema)
- **Logo:** León dorado sobre fondo oscuro (`img/logo.png`)
- **Tipografía:** Cormorant Garamond (títulos) + Work Sans (cuerpo)
- **Tono:** Premium, orgánico, moderno pero cálido
- **Idioma:** Español (Honduras)
- **IMPORTANTE:** Todo texto DEBE llevar acentos y tildes correctos

## Datos del negocio

- **Empresa:** Hacienda El Paraíso
- **Dueño:** Nicolás Molina
- **Ubicación:** Valle de Ángeles, Francisco Morazán, Honduras
- **WhatsApp:** +504 9765-5779
- **Correo:** info@haciendaelparaiso.org (pendiente crear en GoDaddy)
- **Correo personal:** nicolas.molina@grupoeps.hn
- **Clientes objetivo:** Restaurantes, hoteles, cadenas de supermercados y familias en Tegucigalpa y Valle de Ángeles
- **Días de entrega:** Martes y viernes
- **Equipo:** ~10 personas (Jamie, Mariela, Alonso, Hanfrey, Dareli, Javier, Jeremías, Greybin, Anneli, Gravy)

## Precios reales (actualizado abril 2026)

### Hierbas aromáticas — L. 180/libra | L. 100/media libra
- Arúgula
- Romero
- Menta
- Hierba Buena
- Albahaca Genovesa
- Albahaca Limón
- Albahaca Thai
- Albahaca Anís

### Lechugas y ensaladas
| Producto | Precio |
|----------|--------|
| Lechuga de Hoja | L. 40/libra |
| Mix de Ensalada | L. 35/libra |
| Mix Ensalada Gourmet | L. 60/libra (escarola roja, verde, romana roja y verde) |
| Espinaca de Castilla | L. 50/libra |
| Hoja Nueva | L. 40/libra |
| Hoja Grande | L. 40/libra |

### Planes de pedido (sitio web)
| Plan | Precio referencia |
|------|------------------|
| Semanal | Desde L. 350/semana |
| Premium | Desde L. 750/semana |
| Empresarial | Cotización personalizada |

## Redes sociales

- **Instagram:** https://www.instagram.com/haciendaelparaisohn/
- **TikTok:** https://www.tiktok.com/@haciendaelparaisohn
- **Facebook:** (pendiente confirmar URL)
- **WhatsApp:** https://wa.me/50497655779

## Refugio Pastoral

Programa de restauración integral para pastores, líderes ministeriales y sus familias. Es una línea de servicio clave de la hacienda, separada del negocio agrícola.

### Público objetivo
- Pastores y líderes con desgaste emocional/espiritual (burnout)
- Matrimonios pastorales que necesitan reconexión
- Congregaciones para retiros y bautizos
- Familias de líderes ministeriales

### Servicios
- **Salud física:** Análisis clínicos, medicina tradicional, homeopatía, alimentación saludable con productos de la hacienda
- **Salud emocional:** Psicólogos profesionales, acompañamiento para burnout pastoral, manejo de estrés
- **Restauración matrimonial:** Terapia de pareja, consejería sexológica, espacios de reconexión
- **Experiencia espiritual:** Retiros a la medida, bautizos, oración en la montaña, caminatas, fogatas
- **Hospedaje:** Habitaciones en la hacienda (capacidad en crecimiento), coordinación con hospedajes en Valle de Ángeles

### Respaldo espiritual
- Cobertura del **Bridge Network** (bridgenetwork.cc), red apostólica del Apóstol Julio Sotero
- Nicolás Molina sirve activamente en el ministerio pastoral

### Tono de la comunicación
- Cálido, profesional, respetuoso — NO venta agresiva
- Cristiano general — NO denominacional
- Enfatizar confidencialidad siempre
- Mensaje WhatsApp: `wa.me/50497655779?text=Hola Nicolás, soy pastor/líder y me interesa conocer el Refugio Pastoral de Hacienda El Paraíso`

### Implementación pendiente
1. Crear sección breve en index.html (reemplaza/expande Turismo)
2. Crear página dedicada refugio-pastoral.html
3. Agregar "Refugio Pastoral" al menú de navegación
4. Usar fotos de montañas, naturaleza y espacios de la hacienda

## Reglas para Claude Code

### SÍ hacer
- Usar acentos y tildes correctos en TODO el español
- Mantener la paleta de colores (verdes + tierra/dorado)
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

## Integraciones

- **n8n Cloud:** Webhook configurado para enviar tareas a WhatsApp vía Twilio
  - Webhook: `https://nmolina.app.n8n.cloud/webhook/5bdddfb3-8e53-4a06-b7e0-8214f8c850eb`
  - Twilio sandbox WhatsApp: +14155238886

## Tareas completadas ✅

1. ~~Corregir contadores del hero que muestran "0"~~ ✅
2. ~~Agregar tildes/acentos a todo el sitio~~ ✅
3. ~~Crear páginas legales (Privacidad, Términos)~~ ✅
4. ~~Agregar precios referenciales a sección de pedidos~~ ✅
5. ~~Agregar meta tags SEO y Open Graph~~ ✅
6. ~~Agregar botón flotante de WhatsApp~~ ✅
7. ~~Agregar links a redes sociales en footer~~ ✅
8. ~~Testimonios ficticios removidos~~ ✅
9. ~~Quitar switch ES/EN~~ ✅
10. ~~Agregar favicon~~ ✅

## Tareas pendientes

### Prioridad alta
1. Crear sección Refugio Pastoral en index.html
2. Crear página refugio-pastoral.html
3. Actualizar sección de pedidos con precios detallados (hierbas L.180/lb, lechugas desde L.35/lb)
4. Crear correo info@haciendaelparaiso.org en GoDaddy
5. Confirmar URL de Facebook

### Prioridad media
6. Optimizar imágenes a WebP para velocidad
7. Registrar sitemap.xml en Google Search Console
8. Instalar Google Analytics / Tag Manager
9. Sección de equipo con fotos reales

### Futuro
10. Versión en inglés
11. Catálogo descargable en PDF
12. Sistema de pedidos online (Google Sheets/backend)

---

*Última actualización: 10 de abril 2026*
