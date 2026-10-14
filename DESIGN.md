# Sistema visual existente

Este documento registra la implementación vigente. No define un rediseño ni reemplaza los tokens de `src/index.css`.

## Identidad

El portfolio combina un fondo degradado animado, superficies translúcidas, bordes sutiles y formas redondeadas. La personalidad es tecnológica, calma y cercana. La portada utiliza mucho espacio y centra la identidad; las secciones priorizan lectura y evidencia profesional.

## Tipografía

- Encabezados principales: `Geist Sans`, pesos 400 y 700, alojada localmente.
- Texto y controles: `Neue Haas Grotesk`, pesos 400, 500 y 700, alojada localmente.
- Las escalas fluidas usan `clamp()` y respetan `--font-size-scale`, configurable entre 80% y 140%.
- No sustituir estas familias por tendencias externas sin una decisión explícita de marca.

## Themes

Existen cuatro presets: `light-a`, `light-b`, `dark-a` y `dark-b`. Todos mantienen los mismos roles semánticos y cambian sus valores:

- `--bg-main`, `--surface-1`, `--surface-2`: fondo y superficies.
- `--text-primary`, `--text-secondary`, `--heading`: jerarquía de texto.
- `--border-subtle`: separación y contorno.
- `--action`, `--action-hover`, `--action-contrast`: acciones.
- `--link`, `--link-hover`: enlaces.
- `--section-*` y `--card-*`: superficies de contenido.
- `--focus-ring`, `--status-success`, `--status-error`: accesibilidad y feedback.
- `--bg-grad-1` a `--bg-grad-4`: fondo atmosférico.

Los aliases heredados (`--bg-color`, `--text-color`, `--heading-color`, `--accent-color`) se conservan por compatibilidad. Los componentes nuevos deben preferir los roles semánticos existentes.

## Forma, profundidad y spacing

- Secciones: radio de 1rem, borde de 1px y ancho máximo de 64rem.
- Cards: radio de 0.75rem, borde sutil y padding aproximado de 1.5rem.
- Controles compactos: forma pill; controles iconográficos: forma circular.
- Las sombras son contenidas y se usan principalmente para estados elevados o Dark B.
- El ritmo se basa en incrementos aproximados de 0.5rem, 1rem, 1.5rem y 2rem.

## Componentes y comportamiento

- El header ocupa el primer viewport y contiene navegación por botones.
- Trabajos usa grid responsive y cards con imagen, contenido y acciones alineadas.
- Formación conserva un acordeón por institución y filas de certificación. No convertirlo en cards sin una decisión explícita.
- Certificados se muestran en un diálogo protegido, con cierre por botón, backdrop o Escape.
- Configuración utiliza un drawer modal lateral y mantiene la estética utilitaria dentro del sistema cromático.
- Loading, error, vacío y reintento comparten `SectionState`.

## Accesibilidad

- Objetivo: WCAG AA para contraste y navegación.
- Todo control interactivo debe tener nombre accesible, foco visible y target mínimo de 44×44 px.
- Los diálogos contienen el foco, cierran con Escape y devuelven el foco al disparador.
- Los cambios asíncronos importantes se anuncian mediante `status` o `alert`.
- `prefers-reduced-motion` desactiva animaciones decorativas y desplazamientos suaves, manteniendo feedback y jerarquía.

## Responsive y contenido variable

- Breakpoints principales: 1440 px y 768 px; el drawer agrega un ajuste a 480 px.
- Grids usan columnas fluidas; textos y correos largos deben envolver sin depender de `overflow-x: hidden`.
- La interfaz debe funcionar con ES/EN, títulos variables y escala tipográfica hasta 140%.

## Motion

- El fondo usa un desplazamiento lento de 18 segundos y puede desactivarse en configuración.
- Los títulos tienen una entrada breve; hover usa desplazamientos discretos.
- Con reduced motion se eliminan movimientos decorativos, no la comunicación de estados.

## Límites de evolución

Refinamientos deben preservar los cuatro themes, tokens, tipografías, gradiente, arquitectura de secciones y personalidad general. Cambios de estructura en la portada o Formación, una nueva dirección tipográfica o una materialidad distinta requieren una decisión de rediseño separada.
