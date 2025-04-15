import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

const PortfolioContent = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        from_name: '',
        from_email: '',
        message: '',
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos enviados:', formData);
        
            if (!formData.from_name || !formData.from_email || !formData.message) {
            setStatus(t('form_error_missing_fields'));
            return;
            }
        
            emailjs
            .send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formData,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
            .then(
                (response) => {
                console.log('Respuesta de EmailJS:', response.status, response.text);
                setStatus(t('form_success'));
                setFormData({ from_name: '', from_email: '', message: '' });
                },
                (error) => {
                console.error('Error de EmailJS:', error.text, error);
                setStatus(t('form_error'));
                }
            )
            .catch((error) => {
                console.error('Excepción no manejada:', error);
                setStatus(t('form_error'));
            });
        };

    return (
        <main className="main-content">
        <section id="sobre-mi" className="section-container">
            <h2 className="section-title">{t('about')}</h2>
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
        <section id="proyectos" className="section-container">
            <h2 className="section-title">{t('projects')}</h2>
            <p className="section-text">{t('projects_description')}</p>
            <div className="projects-grid">
            <div className="project-card">
                <img src="/images/Tienda-ecommerce.png" alt="Proyecto 1" className="project-image" />
                <h3 className="project-title">{t('project_1_title')}</h3>
                <p className="section-text mb-4">{t('project_1_description')}</p>
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
                <img src="/images/Tienda-javascript.png" alt="Proyecto 2" className="project-image" />
                <h3 className="project-title">{t('project_2_title')}</h3>
                <p className="section-text mb-4">{t('project_1_description')}</p>
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
                <img src="/images/Tienda-Html-y-CSS.png" alt="Proyecto 3" className="project-image" />
                <h3 className="project-title">{t('project_3_title')}</h3>
                <p className="section-text mb-4">{t('project_3_description')}</p>
                <a
                href="https://daniel-collado.github.io/CH-DW-Tercera-Entrega/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                >
                {t('view_project')}
                </a>
            </div>
            </div>
        </section>
        <section id="servicios" className="section-container">
            <h2 className="section-title">{t('services')}</h2>
            <p className="section-text">{t('services_description')}</p>
        </section>
        <section id="contacto" className="section-container">
            <h2 className="section-title">{t('contact')}</h2>
            <div className="contact-content">
            <p className="section-text mb-4">{t('address_label')}</p>
            <p className="section-text email-section">
                <strong>{t('email_label')}</strong>
                <a href="mailto:danielcolladodev@gmail.com" className="email-link">
                <i className="fas fa-envelope email-icon"></i>
                danielcolladodev@gmail.com
                </a>
            </p>
            <p className="section-text mb-4">{t('address')}</p>
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
        </main>
    );
};

export default PortfolioContent;