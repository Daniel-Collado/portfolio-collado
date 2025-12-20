import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaGithub, FaEnvelope, FaArrowUp } from "react-icons/fa";

const PortfolioContent = ({
    activeSection,
    scrollToTop,
    formData,
    status,
    handleChange,
    handleSubmit,
}) => {
    const { t, i18n } = useTranslation();
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false); // arranca false: no queremos “cargar” nada en otras secciones
    const [error, setError] = useState(null);

    const [titleKey, setTitleKey] = useState(0);

    // ✅ SOLO carga proyectos si el usuario abre esa sección
    useEffect(() => {
        if (activeSection !== "proyectos") return;

        const fetchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
            const { getDb } = await import("../firebase.js");
            const db = await getDb();

            const { collection, getDocs, orderBy, query } = await import("firebase/firestore");

            let q;
            try {
            q = query(collection(db, "projects"), orderBy("created_at", "desc"));
            } catch {
            q = query(collection(db, "projects"));
            }

            const querySnapshot = await getDocs(q);
            const projectsArray = [];
            querySnapshot.forEach((doc) => {
            projectsArray.push({ id: doc.id, ...doc.data() });
            });

            setProjects(projectsArray);
        } catch (err) {
            console.error("Error al obtener los proyectos:", err?.code, err?.message);
            setError("Error al cargar los proyectos.");
        } finally {
            setLoading(false);
        }
        };

        fetchProjects();
    }, [activeSection, i18n.language]);

    // Mostrar botón scroll-to-top
    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 100);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Animar títulos cuando cambia sección
    useEffect(() => {
        if (activeSection) {
        const section = document.getElementById(activeSection);
        if (section) section.scrollIntoView({ behavior: "smooth" });
        setTitleKey((prev) => prev + 1);
        }
    }, [activeSection]);

    const currentLang = i18n.language.split("-")[0];

    return (
        <main className="main-content">
        {/* SOBRE MÍ */}
        {activeSection === "sobre-mi" && (
            <section id="sobre-mi" className="section-container">
            <h2
                key={titleKey}
                className={`section-title ${activeSection === "sobre-mi" ? "animate-title" : ""}`}
            >
                {t("about")}
            </h2>

            <div className="about-content">
                <img src="/images/portfolio.jpeg" alt="Foto de perfil" className="profile-image" />
                <div className="text-content">
                <p className="section-text mb-4">{t("about_description")}</p>
                <p className="section-text">
                    <strong>{t("education")}</strong> {t("education_details")}
                </p>
                </div>
            </div>
            </section>
        )}

        {/* PROYECTOS */}
        {activeSection === "proyectos" && (
            <section id="proyectos" className="section-container">
            <h2
                key={titleKey}
                className={`section-title ${activeSection === "proyectos" ? "animate-title" : ""}`}
            >
                {t("projects")}
            </h2>

            <p className="section-text">{t("projects_description")}</p>

            {loading && <p className="section-text">Cargando proyectos...</p>}
            {error && <p className="section-text">{error}</p>}

            {!loading && !error && (
                <div className="projects-grid">
                {projects.map((project) => (
                    <div className="project-card" key={project.id}>
                    <img
                        src={project.image_url}
                        alt={project[`title_${currentLang}`] || ""}
                        className="project-image"
                        loading="lazy"
                    />

                    <h3 className="project-title">
                        {project[`title_${currentLang}`] || "Sin título"}
                    </h3>

                    <p className="section-text mb-4">
                        {project[`description_${currentLang}`] || ""}
                    </p>

                    <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                    >
                        {t("view_project")}
                    </a>

                    {project.github_url && (
                        <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link github"
                        aria-label={t("view_code")}
                        data-tooltip={t("view_code")}
                        >
                        <FaGithub aria-hidden="true" />
                        </a>
                    )}
                    </div>
                ))}
                </div>
            )}
            </section>
        )}

        {/* SERVICIOS */}
        {activeSection === "servicios" && (
            <section id="servicios" className="section-container">
            <h2
                key={titleKey}
                className={`section-title ${activeSection === "servicios" ? "animate-title" : ""}`}
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
                className={`section-title ${activeSection === "contacto" ? "animate-title" : ""}`}
            >
                {t("contact")}
            </h2>

            <div className="contact-content">
                <p className="section-text email-section" style={{ marginTop: "5px", marginBottom: "5px" }}>
                <strong>{t("email_label")}</strong>
                <a href="mailto:danielcolladodev@gmail.com" className="email-link">
                    <FaEnvelope className="email-icon" aria-hidden="true" />
                    danielcolladodev@gmail.com
                </a>
                </p>

                <p className="section-text mb-4" style={{ marginTop: "0.3rem" }}>
                {t("address")}
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="from_name">{t("form_name")}</label>
                    <input
                    type="text"
                    id="from_name"
                    name="from_name"
                    value={formData.from_name}
                    onChange={handleChange}
                    placeholder={t("form_name_placeholder")}
                    required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="from_email">{t("form_email")}</label>
                    <input
                    type="email"
                    id="from_email"
                    name="from_email"
                    value={formData.from_email}
                    onChange={handleChange}
                    placeholder={t("form_email_placeholder")}
                    required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">{t("form_message")}</label>
                    <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("form_message_placeholder")}
                    required
                    />
                </div>

                <button type="submit" className="form-submit">
                    {t("form_submit")}
                </button>

                {status && <p className="form-status">{status}</p>}
                </form>
            </div>
            </section>
        )}

        {/* Scroll top */}
        {showScrollTop && (
            <button
            className={`scroll-top-button ${showScrollTop ? "visible" : ""}`}
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
