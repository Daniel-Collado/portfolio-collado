# Refactor Portfolio – Sección Formación

## Objetivo

Agregar una nueva sección "Formación" manteniendo la arquitectura existente del portfolio.

No se busca una implementación rápida, sino consistente con el resto del proyecto.

---

## Decisiones tomadas

- La sección "Ver Proyectos" pasa a llamarse "Trabajos".
- La colección de Firestore continúa llamándose `projects`.
- Se agrega una nueva colección `education`.
- Todo el contenido deberá administrarse desde el panel admin.
- No habrá certificados hardcodeados.
- La sección pública consumirá únicamente Firestore.
- Se mantiene i18n para español e inglés.
- Se mantiene Analytics.
- Se mantiene lazy loading de Firebase.

---

## Arquitectura objetivo

Portfolio

├── Trabajos (projects)

└── Formación (education)

Panel Admin

├── ProjectsManager

└── EducationManager

---

## Estado actual

✔ ProjectsSection extraído de PortfolioContent.

✔ Header actualizado con "Trabajos" y "Formación".

✔ AdminPanel separado del dominio.

✔ Logout pertenece a AdminPanel.

✔ ProjectsManager creado.

✔ EducationSection creado y preparado para Firestore.

⏳ Pendiente:

- terminar ProjectsManager tras el refactor
- implementar EducationManager
- crear CRUD de education
- subir certificados a Cloudinary
- mostrar certificado en pantalla pública
- agregar Analytics de certificados
- reutilizar estilos entre Projects y Education
