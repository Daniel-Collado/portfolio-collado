// src/components/Header.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import { trackSectionView } from "../lib/analytics/analytics";

const Header = ({ activeSection, setActiveSection, className }) => {
    const { t } = useTranslation();

    const handleNavLinkClick = (sectionId) => {
        if (activeSection === sectionId) {
            return;
        }
        setActiveSection(sectionId);
        trackSectionView(sectionId);
    };

    return (
        <header className={className}>
            {/* Título principal */}
            <h1 className="header-title" tabIndex="-1">
                Daniel Collado || Portfolio
            </h1>

            {/* Texto de bienvenida */}
            <p className="header-text">{t("welcome")}</p>

            {/* Navegación */}
            <nav className="header-nav">
                <button
                    onClick={() => handleNavLinkClick("sobre-mi")}
                    aria-pressed={activeSection === "sobre-mi"}
                    className={`nav-button ${
                        activeSection === "sobre-mi" ? "active" : ""
                    }`}
                >
                    {t("about")}
                </button>

                <button
                    onClick={() => handleNavLinkClick("proyectos")}
                    aria-pressed={activeSection === "proyectos"}
                    className={`nav-button ${
                        activeSection === "proyectos" ? "active" : ""
                    }`}
                >
                    {t("works")}
                </button>

                <button
                    onClick={() => handleNavLinkClick("formacion")}
                    aria-pressed={activeSection === "formacion"}
                    className={`nav-button ${
                        activeSection === "formacion" ? "active" : ""
                    }`}
                >
                    {t("formation")}
                </button>

                <button
                    onClick={() => handleNavLinkClick("servicios")}
                    aria-pressed={activeSection === "servicios"}
                    className={`nav-button ${
                        activeSection === "servicios" ? "active" : ""
                    }`}
                >
                    {t("services")}
                </button>

                <button
                    onClick={() => handleNavLinkClick("contacto")}
                    aria-pressed={activeSection === "contacto"}
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
