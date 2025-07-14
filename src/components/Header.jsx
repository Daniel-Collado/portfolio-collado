import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

// El componente Header ahora recibe activeSection, setActiveSection y className como props
const Header = ({ activeSection, setActiveSection, className }) => {
    const { t } = useTranslation();

    // Esta función ahora actualiza el estado activeSection en el componente padre (App.jsx)
    const handleNavLinkClick = (sectionId) => {
        setActiveSection(sectionId);
    };

    return (
        <header className={className}> {/* Aplica la clase recibida aquí */}
            <LanguageSwitcher />
            <h1 className="header-title">Daniel Collado || Portfolio</h1>
            <p className="header-text">{t('welcome')}</p>
            <nav className="header-nav">
                <button
                    onClick={() => handleNavLinkClick('sobre-mi')}
                    // Añade la clase 'active' si esta es la sección actual
                    className={`nav-button ${activeSection === 'sobre-mi' ? 'active' : ''}`}
                >
                    {t('about')}
                </button>
                <button
                    onClick={() => handleNavLinkClick('proyectos')}
                    className={`nav-button ${activeSection === 'proyectos' ? 'active' : ''}`}
                >
                    {t('projects')}
                </button>
                <button
                    onClick={() => handleNavLinkClick('servicios')}
                    className={`nav-button ${activeSection === 'servicios' ? 'active' : ''}`}
                >
                    {t('services')}
                </button>
                <button
                    onClick={() => handleNavLinkClick('contacto')}
                    className={`nav-button ${activeSection === 'contacto' ? 'active' : ''}`}
                >
                    {t('contact')}
                </button>
            </nav>
        </header>
    );
};

export default Header;
