import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// Importamos la base de datos desde el nuevo archivo
import { db } from '../firebase.js'; 
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const PortfolioContent = ({ activeSection, scrollToTop, formData, status, handleChange, handleSubmit }) => {
    const { t, i18n } = useTranslation();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [titleKey, setTitleKey] = useState(0);

    // Efecto para obtener los proyectos de Firebase
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                // Ahora usamos 'db' que fue importado
                const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'));
                const querySnapshot = await getDocs(q);
                const projectsArray = [];
                querySnapshot.forEach((doc) => {
                    projectsArray.push({ id: doc.id, ...doc.data() });
                });
                setProjects(projectsArray);
                setError(null);
            } catch (err) {
                console.error("Error al obtener los proyectos: ", err);
                setError("Error al cargar los proyectos.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []); 

    // ... el resto del código del componente PortfolioContent
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (activeSection) {
            const section = document.getElementById(activeSection);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
            setTitleKey((prev) => prev + 1);
        }
    }, [activeSection]);

    const currentLang = i18n.language;

    return (
        <main className="main-content">
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

            {activeSection === 'proyectos' && (
                <section id="proyectos" className="section-container">
                    <h2 key={titleKey} className={`section-title ${activeSection === 'proyectos' ? 'animate-title' : ''}`}>
                        {t('projects')}
                    </h2>
                    <p className="section-text">{t('projects_description')}</p>
                    {loading && <p>Cargando proyectos...</p>}
                    {error && <p>{error}</p>}
                    {!loading && !error && (
                        <div className="projects-grid">
                            {projects.map((project) => (
                                <div className="project-card" key={project.id}>
                                    <img src={project.image_url} alt={project[`title_${currentLang}`]} className="project-image" />
                                    <h3 className="project-title">{project[`title_${currentLang}`]}</h3>
                                    <p className="section-text mb-4">{project[`description_${currentLang}`]}</p>
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-link"
                                    >
                                        {t('view_project')}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Sección SERVICIOS */}
            {activeSection === 'servicios' && (
                <section id="servicios" className="section-container">
                    <h2 key={titleKey} className={`section-title ${activeSection === 'servicios' ? 'animate-title' : ''}`}>
                        {t('services')}
                    </h2>
                    <p className="section-text">{t('services_description')}</p>
                </section>
            )}

            {/* Sección CONTACTO */}
            {activeSection === 'contacto' && (
                <section id="contacto" className="section-container">
                    <h2 key={titleKey} className={`section-title ${activeSection === 'contacto' ? 'animate-title' : ''}`}>
                        {t('contact')}
                    </h2>
                    <div className="contact-content">
                        <p className="section-text email-section" style={{ marginTop: '5px', marginBottom: '5px' }}>
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

            {showScrollTop && (
                <button
                    className={`scroll-top-button ${showScrollTop ? 'visible' : ''}`}
                    onClick={scrollToTop}
                    aria-label="Volver al inicio"
                >
                    <i className="fas fa-arrow-up"></i>
                </button>
            )}
        </main>
    );
};

export default PortfolioContent;