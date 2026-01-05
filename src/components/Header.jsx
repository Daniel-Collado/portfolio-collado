// src/components/Header.jsx

import React from "react";
import { useTranslation } from "react-i18next";

const Header = ({ activeSection, setActiveSection, className }) => {
    const { t } = useTranslation();

    const handleNavLinkClick = (sectionId) => {
        setActiveSection(sectionId);
    };

    return (
        <header className={className}>
        {/* Título principal */}
        <h1 className="header-title">Daniel Collado || Portfolio</h1>

        {/* Texto de bienvenida */}
        <p className="header-text">{t("welcome")}</p>

        {/* Navegación */}
        <nav className="header-nav">
            <button
            onClick={() => handleNavLinkClick("sobre-mi")}
            className={`nav-button ${
                activeSection === "sobre-mi" ? "active" : ""
            }`}
            >
            {t("about")}
            </button>

            <button
            onClick={() => handleNavLinkClick("proyectos")}
            className={`nav-button ${
                activeSection === "proyectos" ? "active" : ""
            }`}
            >
            {t("projects")}
            </button>

            <button
            onClick={() => handleNavLinkClick("servicios")}
            className={`nav-button ${
                activeSection === "servicios" ? "active" : ""
            }`}
            >
            {t("services")}
            </button>

            <button
            onClick={() => handleNavLinkClick("contacto")}
            className={`nav-button ${
                activeSection === "contacto" ? "active" : ""
            }`}
            >
            {t("contact")}
            </button>
        </nav>
        </header>
    );
};

export default Header;
