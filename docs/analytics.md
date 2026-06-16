# Analytics — Portfolio Personal

## Objetivo

Incorporar analítica web al portfolio público manteniendo una arquitectura limpia, desacoplada y compatible con el stack existente.

Requisitos definidos:

* medir visitas reales del portfolio
* excluir completamente panel admin
* excluir login admin
* evitar doble inicialización
* evitar eventos falsos por React Strict Mode
* mantener compatibilidad con lazy loading
* mantener Vite SPA (sin SSR)
* preparar eventos futuros sin acoplar UI y tracking

---

# Stack

Frontend:

* React 19
* Vite
* React Router DOM v7

Servicios:

* Firebase
* Firestore
* EmailJS
* Cloudinary

Arquitectura existente preservada:

* lazy imports
* temas dinámicos
* internacionalización (`react-i18next`)
* panel admin desacoplado

---

# Decisión Arquitectónica

## Elegido

Google Analytics 4 usando Firebase Analytics.

## Descartado

Google Tag Manager.

Motivos:

* menor complejidad
* menor peso
* menos puntos de falla
* integración nativa con Firebase ya existente
* suficiente para portfolio personal

---

# Restricciones Arquitectónicas

Mantener:

```txt
HOME
↓
sin cargar Firebase
```

No mover Analytics a:

```txt
src/firebase.js
```

porque ese archivo ya cumple responsabilidad de lazy bootstrap.

---

# Estructura Incorporada

```txt
src/

lib/
└── analytics/
    └── analytics.js

components/
└── analytics/
    └── AnalyticsTracker.jsx
```

---

# Inicialización

Modelo adoptado:

```txt
App
↓
AnalyticsTracker
↓
ruta pública
↓
lazy import analytics
↓
inicialización única
```

Propiedades:

* singleton
* sin doble init
* sin SSR
* compatible con Strict Mode

---

# Exclusión de Admin

Rutas excluidas:

```txt
/admin
/admin/*
/adminlogin
```

Objetivo:

No contaminar métricas públicas.

Validado:

✔ admin excluido

✔ login excluido

---

# Navegación SPA

Implementación:

```txt
React Router
↓
useLocation()
↓
trackPageView()
```

Evento enviado:

```txt
page_view
```

Importante:

No se modificaron URLs.

---

# Métricas de Navegación Interna

Como el portfolio no navega por rutas sino por estado:

```txt
/
↓
activeSection
```

se decidió NO generar pageviews artificiales.

Implementación:

```txt
Header
↓
click usuario
↓
trackSectionView()
```

Evento:

```txt
section_view
```

Parámetro:

```txt
section_name
```

Secciones medidas:

```txt
sobre-mi
proyectos
servicios
contacto
```

Protecciones:

* sin duplicados
* sin medir scroll
* sin medir renders
* sin medir cambios de idioma

---

# Eventos Implementados

## page_view

Disparo:

```txt
cambio de ruta
```

---

## section_view

Disparo:

```txt
click navegación
```

Payload:

```txt
section_name
```

---

## project_open

Disparo:

```txt
click "Ver Página"
```

Payload:

```txt
project_name
```

---

## project_github_open

Disparo:

```txt
click GitHub
```

Payload:

```txt
project_name
```

---

## contact_submit

Disparo:

```txt
EmailJS success
```

---

## contact_submit_error

Disparo:

```txt
EmailJS fail
```

Payload:

```txt
reason
```

---

## theme_changed

Disparo:

```txt
SettingsPanel
↓
toggleTheme()
```

Payload:

```txt
theme
```

No medir:

```txt
localStorage hydration
```

---

## language_changed

Disparo:

```txt
SettingsPanel
↓
changeLanguage()
```

Payload:

```txt
language
```

No medir:

```txt
LanguageDetector
```

---

# Validación Realizada

Verificado mediante:

```txt
Network
↓
collect
↓
204
```

Confirmado:

✔ page_view

✔ section_view

✔ exclusión admin

✔ eventos personalizados

---

# Observaciones Descubiertas

Google Analytics:

* Tiempo real responde antes que reportes históricos
* localhost puede no reflejar inmediatamente métricas agregadas
* entornos corporativos pueden bloquear parcialmente Analytics

Conclusión:

```txt
collect 204
=
evento recibido
```

---

# Estado Actual

Implementado:

✔ Analytics base

✔ navegación SPA

✔ eventos personalizados

✔ exclusión admin

✔ integración desacoplada

Pendiente futuro:

* presets de tema
* scroll depth
* tiempo por sección
* embudo de contacto
* métricas por dispositivo
* exportación de reportes
* dashboards personalizados
