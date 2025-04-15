import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
    const { t } = useTranslation();

    const handleScroll = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="header">
        <LanguageSwitcher />
        <h1 className="header-title">Daniel Collado || Portfolio</h1>
        <p className="header-text">{t('welcome')}</p>
        <nav className="header-nav">
            <button onClick={() => handleScroll('sobre-mi')} className="nav-button">
            {t('about')}
            </button>
            <button onClick={() => handleScroll('proyectos')} className="nav-button">
            {t('projects')}
            </button>
            <button onClick={() => handleScroll('servicios')} className="nav-button">
            {t('services')}
            </button>
            <button onClick={() => handleScroll('contacto')} className="nav-button">
            {t('contact')}
            </button>
        </nav>
        </header>
    );
};

export default Header;