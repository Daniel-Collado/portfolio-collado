Refactor Portfolio – Sección Formación
Objetivo

Agregar una sección pública de Formación integrada con el panel de administración, reutilizando la arquitectura existente del portfolio y evitando duplicación de lógica o componentes.

Decisiones arquitectónicas
La sección pública Trabajos continúa consumiendo la colección projects.
La nueva sección pública Formación consume exclusivamente la colección education.
El panel de administración es el único punto de edición de certificaciones.
Los certificados se almacenan en Cloudinary.
Firestore contiene únicamente la información estructurada y las URLs de los certificados.
Se mantiene i18n para toda la sección.
Se mantiene Analytics como infraestructura compartida.
Se mantiene lazy loading de Firebase.
Arquitectura
Portfolio

├── Trabajos
│ └── projects
│
└── Formación
└── education

Panel Admin

├── ProjectsManager
└── EducationManager
Estado actual
Administración

✔ AdminPanel desacoplado.

✔ EducationManager implementado.

✔ CRUD completo de certificaciones.

✔ Integración con Firestore.

✔ Integración con Cloudinary.

✔ Reordenamiento dentro de cada institución.

✔ Orden automático por categoría.

✔ Eliminación con renumeración.

✔ Edición con categoría bloqueada.

Público

✔ EducationSection consume Firestore.

✔ Agrupación por institución (category).

✔ Acordeón con una institución abierta a la vez.

✔ Lista de certificaciones por institución.

✔ Modal de visualización del certificado.

✔ Scroll del fondo bloqueado mientras el modal permanece abierto.

✔ Soporte para certificados en imagen.

✔ Soporte para certificados PDF mediante transformación de Cloudinary (pg_1,f_jpg) para generar una vista previa como imagen.

✔ Integración con i18n.

✔ Reutilización parcial del estilo de ProjectsSection sin duplicar componentes.

Pendiente
Analytics específico para certificados:
apertura del modal;
apertura de la credencial oficial.
Revisar la experiencia mobile del modal (zoom si fuera necesario).
Evaluar página individual de certificado (/education/:slug) si en el futuro aporta valor para SEO o compartir enlaces.
