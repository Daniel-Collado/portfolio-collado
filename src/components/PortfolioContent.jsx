import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// PortfolioContent ahora recibe scrollToTop de App.jsx
// Eliminamos setFormData y setStatus de la desestructuración de props, ya que se usan en App.jsx
const PortfolioContent = ({ activeSection, setActiveSection, scrollToTop, formData, status, handleChange, handleSubmit }) => {
    const { t } = useTranslation();
    const [showScrollTop, setShowScrollTop] = useState(false);
    // titleKey se usa para forzar la re-renderización de la animación del título
    const [titleKey, setTitleKey] = useState(0);

    // Efecto para mostrar/ocultar el botón de "scroll to top"
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Efecto para desplazarse a la sección activa y animar su título
    useEffect(() => {
        if (activeSection) {
            const section = document.getElementById(activeSection);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
            // Cambia la clave para forzar la animación del título cada vez que la sección activa cambia
            setTitleKey((prev) => prev + 1);
        }
    }, [activeSection, setActiveSection]);

    // formData, status, handleChange, y handleSubmit son props y se usan directamente en el JSX del formulario.

    return (
        <main className="main-content">
            {/* Sección SOBRE MÍ - Solo se renderiza si activeSection es 'sobre-mi' */}
            {activeSection === 'sobre-mi' && (
                <section id="sobre-mi" className="section-container">
                    <h2 key={titleKey} className={`section-title ${activeSection === 'sobre-mi' ? 'animate-title' : ''}`}>
                        {t('about')}
                    </h2>
                    <div className="about-content">
                        <img
                            src="/images/portfolio.jpeg"
                            alt="Foto de perfil"
                            className="profile-image"
                        />
                        <div className="text-content">
                            <p className="section-text mb-4">{t('about_description')}</p>
                            <p className="section-text">
                                <strong>{t('education')}</strong> {t('education_details')}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Sección PROYECTOS - Solo se renderiza si activeSection es 'proyectos' */}
            {activeSection === 'proyectos' && (
                <section id="proyectos" className="section-container">
                    <h2 key={titleKey} className={`section-title ${activeSection === 'proyectos' ? 'animate-title' : ''}`}>
                        {t('projects')}
                    </h2>
                    <p className="section-text">{t('projects_description')}</p>
                    <div className="projects-grid">
                        <div className="project-card">
                            <img src="/images/portfolio-juan-vogt.jpg" alt="Proyecto 1" className="project-image" />
                            <h3 className="project-title">{t('project_1_title')}</h3>
                            <p className="section-text mb-4">{t('project_1_description')}</p>
                            <a
                                href="https://www.juanpablovogt.com.ar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                            >
                                {t('view_project')}
                            </a>
                        </div>
                        <div className="project-card">
                            <img src="/images/oestecursos.jpg" alt="Proyecto 2" className="project-image" />
                            <h3 className="project-title">{t('project_2_title')}</h3>
                            <p className="section-text mb-4">{t('project_2_description')}</p>
                            <a
                                href="https://oestecursos.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                            >
                                {t('view_project')}
                            </a>
                        </div>
                        <div className="project-card">
                            <img src="/images/Tienda-ecommerce.png" alt="Proyecto 3" className="project-image" />
                            <h3 className="project-title">{t('project_3_title')}</h3>
                            <p className="section-text mb-4">{t('project_3_description')}</p>
                            <a
                                href="https://tienda-jardin-olmos.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                            >
                                {t('view_project')}
                            </a>
                        </div>
                        <div className="project-card">
                            <img src="/images/Tienda-javascript.png" alt="Proyecto 4" className="project-image" />
                            <h3 className="project-title">{t('project_4_title')}</h3>
                            <p className="section-text mb-4">{t('project_4_description')}</p>
                            <a
                                href="https://daniel-collado.github.io/JavaScript-Coder-2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                            >
                                {t('view_project')}
                            </a>
                        </div>
                        <div className="project-card">
                            <img src="/images/Tienda-Html-y-CSS.png" alt="Proyecto 5" className="project-image" />
                            <h3 className="project-title">{t('project_5_title')}</h3>
                            <p className="section-text mb-4">{t('project_5_description')}</p>
                            <a
                                href="https://daniel-collado.github.io/CH-DW-Tercera-Entrega/index.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                            >
                                {t('view_project')}
                            </a>
                        </div>
                        <div className="project-card">
                            <img src="/images/disqueria.jpg" alt="Proyecto 6" className="project-image" />
                            <h3 className="project-title">{t('project_6_title')}</h3>
                            <p className="section-text mb-4">{t('project_6_description')}</p>
                            <a
                                href="https://disqueriaback.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                            >
                                {t('view_project')}
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* Sección SERVICIOS - Solo se renderiza si activeSection es 'servicios' */}
            {activeSection === 'servicios' && (
                <section id="servicios" className="section-container">
                    <h2 key={titleKey} className={`section-title ${activeSection === 'servicios' ? 'animate-title' : ''}`}>
                        {t('services')}
                    </h2>
                    <p className="section-text">{t('services_description')}</p>
                </section>
            )}

            {/* Sección CONTACTO - Solo se renderiza si activeSection es 'contacto' */}
            {activeSection === 'contacto' && (
                <section id="contacto" className="section-container">
                    <h2 key={titleKey} className={`section-title ${activeSection === 'contacto' ? 'animate-title' : ''}`}>
                        {t('contact')}
                    </h2>
                    <div className="contact-content">
                        <p className="section-text email-section"
                            style={{ marginTop: '5px', marginBottom: '5px' }}>
                            <strong>{t('email_label')}</strong>
                            <a href="mailto:danielcolladodev@gmail.com" className="email-link">
                                <i className="fas fa-envelope email-icon"></i>
                                danielcolladodev@gmail.com
                            </a>
                        </p>
                        <p className="section-text mb-4" style={{ marginTop: '0.3rem' }}>{t('address')}</p>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="from_name">{t('form_name')}</label>
                                <input
                                    type="text"
                                    id="from_name"
                                    name="from_name"
                                    value={formData.from_name}
                                    onChange={handleChange}
                                    placeholder={t('form_name_placeholder')}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="from_email">{t('form_email')}</label>
                                <input
                                    type="email"
                                    id="from_email"
                                    name="from_email"
                                    value={formData.from_email}
                                    onChange={handleChange}
                                    placeholder={t('form_email_placeholder')}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">{t('form_message')}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('form_message_placeholder')}
                                    required
                                />
                            </div>
                            <button type="submit" className="form-submit">
                                {t('form_submit')}
                            </button>
                            {status && <p className="form-status">{status}</p>}
                        </form>
                    </div>
                </section>
            )}

            {/* Botón de "Scroll to Top" */}
            {showScrollTop && (
                <button
                    className={`scroll-top-button ${showScrollTop ? 'visible' : ''}`}
                    onClick={scrollToTop} // Llama a la función scrollToTop de App.jsx
                    aria-label="Volver al inicio"
                >
                    <i className="fas fa-arrow-up"></i> {/* Usé "fas fa-arrow-up" para Font Awesome */}
                </button>
            )}
        </main>
    );
};

export default PortfolioContent;
