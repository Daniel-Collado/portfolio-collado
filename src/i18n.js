import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    es: {
        translation: {
        welcome: 'Bienvenido a mi espacio digital',
        about: 'Sobre mí',
        projects: 'Ver Proyectos',
        services: 'Servicios',
        contact: 'Contacto',
        about_description:
            'Soy un programador interesado en la búsqueda de soluciones creativas para entornos digitales. Me especializo en React, JavaScript y diseño de interfaces modernas.',
        education: 'Formación:',
        education_details: '2022 - presente // Coderhouse, Potrero Digital, Argentina Programa.',
        projects_description: 'Aquí están algunos de mis trabajos más recientes:',
        project_1_title: 'Proyecto 1',
        project_1_description:
            'Tienda e-commerce realizada con React + Vite, con Mercado Pago integrado.',
        project_2_title: 'Proyecto 2',
        project_2_description:
            'Tienda e-commerce realizada en JavaScript, con carrito de compras.',
        project_3_title: 'Proyecto 3',
        project_3_description:
            'Tienda de muestra de productos con énfasis en lo visual, realizada con Html + CSS y Bootstrap.',
        view_project: 'Ver en GitHub',
        services_description:
            'Realizo páginas web dinámicas y responsivas, adaptadas a las necesidades del cliente. Las mismas pueden ser desde una tienda e-commerce a un portfolio personal. Hago mantenimiento mensual del código, corrección de errores, sumo nuevas funcionalidades. Readapto la página a tus necesidades actuales.',
        address_label: 'Dirección:',
        email_label: 'Correo:',
        address: 'La Plata, Buenos Aires, Argentina',
        form_name: 'Nombre',
        form_email: 'Correo electrónico',
        form_message: 'Mensaje',
        form_name_placeholder: 'Ingresa tu nombre',
        form_email_placeholder: 'Ingresa tu correo',
        form_message_placeholder: 'Escribe tu mensaje aquí',
        form_submit: 'Enviar mensaje',
        form_success: '¡Mensaje enviado con éxito! Te contactaré pronto.',
        form_error: 'Hubo un error al enviar el mensaje. Intenta de nuevo.',
        form_error_missing_fields: 'Por favor, completa todos los campos.',
        },
    },
    en: {
        translation: {
        welcome: 'Welcome to my digital space',
        about: 'About me',
        projects: 'View Projects',
        services: 'Services',
        contact: 'Contact',
        about_description:
            'I am a programmer passionate about finding creative solutions for digital environments. I specialize in React, JavaScript, and modern interface design.',
        education: 'Education:',
        education_details: '2022 - present // Coderhouse, Potrero Digital, Argentina Programa.',
        projects_description: 'Here are some of my most recent works:',
        project_1_title: 'Project 1',
        project_1_description:
            'E-commerce store built with React + Vite, integrated with Mercado Pago.',
        project_2_title: 'Project 2',
        project_2_description:
            'E-commerce store built in JavaScript, with a shopping cart.',
        project_3_title: 'Project 3',
        project_3_description:
            'Product showcase store with a focus on visuals, built with HTML + CSS and Bootstrap.',
        view_project: 'View on GitHub',
        services_description:
            'I create dynamic and responsive websites tailored to the client’s needs, ranging from e-commerce stores to personal portfolios. I offer monthly code maintenance, bug fixes, and new feature additions. I adapt the website to your current needs.',
        address_label: 'Address:',
        email_label: 'Email:',
        address: 'La Plata, Buenos Aires, Argentina',
        form_name: 'Name',
        form_email: 'Email',
        form_message: 'Message',
        form_name_placeholder: 'Enter your name',
        form_email_placeholder: 'Enter your email',
        form_message_placeholder: 'Write your message here',
        form_submit: 'Send message',
        form_success: 'Message sent successfully! I’ll get back to you soon.',
        form_error: 'There was an error sending the message. Please try again.',
        form_error_missing_fields: 'Please fill in all fields.',
        },
    },
    };

    i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        interpolation: {
        escapeValue: false,
        },
    });

export default i18n;