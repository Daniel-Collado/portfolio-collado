#  Daniel Collado — Portfolio Personal

Este es el repositorio de mi portfolio personal, desarrollado con foco en arquitectura moderna, diseño tokenizado, accesibilidad y temas personalizables. Construido con **React + Vite**, incorpora múltiples temas visuales, animaciones fluidas, y un panel de configuración interactivo.

---

## 🚀 Tecnologías principales

- ⚛️ React + Vite
- 🌐 React Router DOM
- 🔥 Firebase (Auth + Firestore)
- ☁️ Cloudinary (para uploads)
- 📧 EmailJS (contacto)
- 🌍 react-i18next (internacionalización ES / EN)
- 🎨 Framer Motion + CSS para animaciones
- 📄 Modular CSS (tokenizado)

---

## 📊 Analítica y SEO

Implementación actual:

* 🔥 Google Analytics 4 mediante Firebase Analytics
* 📈 Medición SPA (React Router)
* 🚫 Exclusión explícita de `/admin` y `/adminlogin`
* 🧭 Tracking de navegación interna por secciones
* 🌍 Eventos de idioma
* 🎨 Eventos de tema
* 📧 Eventos de contacto
* 🔗 Eventos de apertura de proyectos
* 🔎 Integración con Google Search Console
* 🗺 Sitemap enviado y validado
* 🤖 Robots configurado para evitar indexación del panel

Eventos implementados:

```txt
page_view

section_view

project_open

project_github_open

contact_submit

contact_submit_error

theme_changed

language_changed
```

Arquitectura:

```txt
App
↓

AnalyticsTracker

↓

analytics.js

↓

Firebase Analytics
```

---

## 🎨 Sistema visual

- **Totalmente tokenizado** con CSS Variables (por rol: fondo, sección, card, texto, etc.)
- **Diseño semántico desacoplado:** `section ≠ card ≠ fondo`
- **Compatibilidad con gradientes dinámicos**
- **Accesibilidad tipográfica** y diseño responsive completo

---

## 🌗 Temas disponibles

> El usuario puede alternar entre **4 modos visuales** desde el panel lateral de configuración:

| Tipo     | Modo       | Descripción |
|----------|------------|-------------|
| ☀️ Light | `light-a`  | Paleta clara con acentos suaves |
| ☀️ Light | `light-b`  | Paleta clara alternativa con más contraste |
| 🌙 Dark  | `dark-a`   | Estilo oscuro tradicional, alto contraste |
| 🌙 Dark  | `dark-b`   | Paleta refinada, en fase de pulido fino |

Los temas se aplican dinámicamente mediante:

```js
document.documentElement.dataset.theme = "dark-b"



📄 Licencia

Este proyecto es personal. Si querés reutilizar partes de la arquitectura, diseño o lógica, consultame antes :)
