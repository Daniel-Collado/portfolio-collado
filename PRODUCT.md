# Portfolio Daniel Collado

## Propósito

Portfolio profesional bilingüe de Daniel Collado. Presenta perfil, trabajos, formación, servicios y una vía de contacto, con una experiencia visual personalizable pero sobria.

## Audiencia y resultado esperado

- Reclutadores, equipos técnicos y potenciales clientes.
- El visitante debe poder comprender rápidamente el perfil profesional, revisar evidencia de trabajos y formación y contactar a Daniel.
- El portfolio es una experiencia de exhibición; la interfaz acompaña al contenido sin competir con él.

## Superficies

- Portada con identidad, bienvenida y navegación por secciones.
- Sobre mí, con presentación y enlaces sociales.
- Trabajos, consumidos desde la colección `projects` de Firestore.
- Formación, consumida desde `education`, agrupada mediante un acordeón por institución.
- Servicios.
- Contacto mediante EmailJS.
- Panel de configuración para idioma, theme, preset, escala tipográfica y animación de fondo.
- Login y panel administrativo desacoplados de la experiencia pública.

## Arquitectura y restricciones vigentes

- React 19, Vite y React Router.
- ES/EN con `react-i18next`.
- Firebase y Firestore mediante imports diferidos; la portada no debe cargar Firebase anticipadamente.
- Cloudinary aloja certificados; Firestore conserva sus datos y URLs.
- EmailJS gestiona el formulario de contacto.
- Analytics usa Firebase Analytics y excluye las rutas administrativas.
- El panel admin es el único punto de edición de proyectos y certificaciones.
- La navegación pública por secciones se mantiene basada en estado, sin inventar pageviews.

## Analytics

Se conservan los eventos existentes: `page_view`, `section_view`, `project_open`, `project_github_open`, `project_visible`, `certificate_open`, `credential_open`, `contact_submit`, `contact_submit_error`, `theme_changed`, `language_changed` y aperturas sociales. Los eventos se disparan por interacción real y no por renders o hidratación.

## Principios de producto

- Mantener contenido real, navegación directa y carga progresiva.
- Preservar los cuatro themes y las preferencias del visitante.
- Mantener el acordeón de Formación por institución.
- Proporcionar estados accesibles de carga, vacío, error, reintento y envío.
- No incorporar claims, tecnologías ni credenciales no suministradas.
