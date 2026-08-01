import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGithub } from "react-icons/fa";

import {
    trackProjectOpen,
    trackGithubOpen,
    trackProjectVisible,
} from "../../lib/analytics/analytics";

let cachedProjects = null;

const ProjectsSection = ({ titleKey }) => {
    const { t, i18n } = useTranslation();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const projectRefs = useRef(new Map());

    useEffect(() => {
        if (cachedProjects) {
            setProjects(cachedProjects);
            return;
        }

        const fetchProjects = async () => {
            setLoading(true);
            setError(null);

            try {
                const { getDb } = await import("../../firebase.js");
                const db = await getDb();

                const { collection, getDocs, orderBy, query } =
                    await import("firebase/firestore");

                let q;

                try {
                    q = query(
                        collection(db, "projects"),
                        orderBy("order", "asc")
                    );
                } catch {
                    q = query(collection(db, "projects"));
                }

                const snapshot = await getDocs(q);

                const items = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                cachedProjects = items;

                setProjects(items);
            } catch (err) {
                console.error(
                    "Error al obtener proyectos:",
                    err?.code,
                    err?.message
                );

                setError("Error al cargar los proyectos.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!projects.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    trackProjectVisible(entry.target.dataset.project);

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.5,
            }
        );

        projectRefs.current.forEach((el) => {
            if (el) {
                observer.observe(el);
            }
        });

        return () => observer.disconnect();
    }, [projects]);

    const currentLang = i18n.language.split("-")[0];

    return (
        <section id="proyectos" className="section-container">
            <h2 key={titleKey} className="section-title animate-title">
                {t("projects")}
            </h2>

            <p className="section-text">{t("projects_description")}</p>

            {loading && <p className="section-text">Cargando proyectos...</p>}

            {error && <p className="section-text">{error}</p>}

            {!loading && !error && (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card"
                            data-project={project.title_es}
                            ref={(el) => {
                                if (el) {
                                    projectRefs.current.set(project.id, el);
                                }
                            }}
                        >
                            <img
                                src={project.image_url}
                                alt={project[`title_${currentLang}`] || ""}
                                className="project-image"
                                loading="lazy"
                            />

                            <h3 className="project-title">
                                {project[`title_${currentLang}`] ||
                                    "Sin título"}
                            </h3>

                            <p className="section-text mb-4">
                                {project[`description_${currentLang}`] || ""}
                            </p>

                            <div className="project-links">
                                <a
                                    href={project.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-link"
                                    onClick={() =>
                                        trackProjectOpen(project.title_es)
                                    }
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
                                        onClick={() =>
                                            trackGithubOpen(project.title_es)
                                        }
                                    >
                                        <FaGithub />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProjectsSection;
