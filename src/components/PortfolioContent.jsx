import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaGithub, FaEnvelope, FaLinkedin, FaArrowUp } from "react-icons/fa";

import { trackSocialOpen } from "../lib/analytics/analytics";

import ProjectsSection from "./sections/ProjectsSection";
import EducationSection from "./sections/EducationSection";

const PortfolioContent = ({
    activeSection,
    scrollToTop,
    formData,
    status,
    handleChange,
    handleSubmit,
}) => {
    const { t } = useTranslation();

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [titleKey, setTitleKey] = useState(0);

    // Mostrar botón scroll-to-top
    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 100);

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Animar títulos cuando cambia sección
    useEffect(() => {
        if (!activeSection) {
            return;
        }

        const section = document.getElementById(activeSection);

        if (section) {
            section.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "auto"
                    : "smooth",
            });

            window.requestAnimationFrame(() => {
                section.querySelector("h2")?.focus({ preventScroll: true });
            });
        }

        setTitleKey((prev) => prev + 1);
    }, [activeSection]);

    return (
        <main className="main-content">
            {/* SOBRE MÍ */}
            {activeSection === "sobre-mi" && (
                <section id="sobre-mi" className="section-container">
                    <h2
                        key={titleKey}
                        className="section-title animate-title"
                        tabIndex="-1"
                    >
                        {t("about")}
                    </h2>

                    <div className="about-content">
                        <img
                            src="/images/portfolio.jpeg"
                            alt="Foto de perfil"
                            className="profile-image"
                        />

                        <div className="text-content">
                            <p className="section-text mb-4">
                                {t("about_description")}
                            </p>

                            <p className="section-text">
                                <strong>{t("education")}</strong>{" "}
                                {t("education_details")}
                            </p>

                            <div className="about-social">
                                <a
                                    href="https://www.linkedin.com/in/danielcolladodev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="about-social-link"
                                    aria-label="LinkedIn"
                                    title="LinkedIn"
                                    onClick={() => trackSocialOpen("linkedin")}
                                >
                                    <FaLinkedin aria-hidden="true" />
                                </a>

                                <a
                                    href="https://github.com/Daniel-Collado"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="about-social-link"
                                    aria-label="GitHub"
                                    title="GitHub"
                                    onClick={() => trackSocialOpen("github")}
                                >
                                    <FaGithub aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* PROYECTOS */}
            {activeSection === "proyectos" && (
                <ProjectsSection titleKey={titleKey} />
            )}

            {activeSection === "formacion" && (
                <EducationSection titleKey={titleKey} />
            )}

            {/* SERVICIOS */}
            {activeSection === "servicios" && (
                <section id="servicios" className="section-container">
                    <h2
                        key={titleKey}
                        className="section-title animate-title"
                        tabIndex="-1"
                    >
                        {t("services")}
                    </h2>

                    <p className="section-text">{t("services_description")}</p>
                </section>
            )}

            {/* CONTACTO */}
            {activeSection === "contacto" && (
                <section id="contacto" className="section-container">
                    <h2
                        key={titleKey}
                        className="section-title animate-title"
                        tabIndex="-1"
                    >
                        {t("contact")}
                    </h2>

                    <div className="contact-content">
                        <p
                            className="section-text email-section"
                            style={{
                                marginTop: "5px",
                                marginBottom: "5px",
                            }}
                        >
                            <strong>{t("email_label")}</strong>

                            <a
                                href="mailto:danielcolladodev@gmail.com"
                                className="email-link"
                            >
                                <FaEnvelope
                                    className="email-icon"
                                    aria-hidden="true"
                                />
                                danielcolladodev@gmail.com
                            </a>
                        </p>

                        <p
                            className="section-text mb-4"
                            style={{
                                marginTop: "0.3rem",
                            }}
                        >
                            {t("address")}
                        </p>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="from_name">
                                    {t("form_name")}
                                </label>

                                <input
                                    type="text"
                                    id="from_name"
                                    name="from_name"
                                    value={formData.from_name}
                                    onChange={handleChange}
                                    placeholder={t("form_name_placeholder")}
                                    required
                                    disabled={status === "submitting"}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="from_email">
                                    {t("form_email")}
                                </label>

                                <input
                                    type="email"
                                    id="from_email"
                                    name="from_email"
                                    value={formData.from_email}
                                    onChange={handleChange}
                                    placeholder={t("form_email_placeholder")}
                                    required
                                    disabled={status === "submitting"}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">
                                    {t("form_message")}
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t("form_message_placeholder")}
                                    required
                                    disabled={status === "submitting"}
                                />
                            </div>

                            <button
                                type="submit"
                                className="form-submit"
                                disabled={status === "submitting"}
                                aria-busy={status === "submitting"}
                            >
                                {status === "submitting"
                                    ? t("form_submitting")
                                    : t("form_submit")}
                            </button>

                            {status && status !== "submitting" && (
                                <p
                                    className={`form-status form-status--${status.type}`}
                                    role={
                                        status.type === "error"
                                            ? "alert"
                                            : "status"
                                    }
                                    aria-live="polite"
                                >
                                    {status.message}
                                </p>
                            )}
                        </form>
                    </div>
                </section>
            )}

            {/* Scroll top */}
            {showScrollTop && (
                <button
                    className={`scroll-top-button ${
                        showScrollTop ? "visible" : ""
                    }`}
                    onClick={scrollToTop}
                    aria-label="Volver al inicio"
                >
                    <FaArrowUp aria-hidden="true" />
                </button>
            )}
        </main>
    );
};

export default PortfolioContent;
