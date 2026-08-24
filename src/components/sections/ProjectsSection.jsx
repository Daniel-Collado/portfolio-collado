import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGithub } from "react-icons/fa";

import {
    trackProjectOpen,
    trackGithubOpen,
    trackProjectVisible,
} from "../../lib/analytics/analytics";
import SectionState from "../SectionState";

let cachedProjects = null;

const ProjectsSection = ({ titleKey }) => {
    const { t, i18n } = useTranslation();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const projectRefs = useRef(new Map());

    const fetchProjects = useCallback(async ({ ignoreCache = false } = {}) => {
        if (cachedProjects && !ignoreCache) {
            setProjects(cachedProjects);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { getDb } = await import("../../firebase.js");
            const db = await getDb();

            const { collection, getDocs, orderBy, query } =
                await import("firebase/firestore");

            let q;

            try {
                q = query(collection(db, "projects"), orderBy("order", "asc"));
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
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

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
            <h2
                key={titleKey}
                className="section-title animate-title"
                tabIndex="-1"
            >
                {t("projects")}
            </h2>

            <p className="section-text">{t("projects_description")}</p>

            {loading && (
                <SectionState type="loading" message={t("projects_loading")} />
            )}

            {error && (
                <SectionState
                    type="error"
                    message={t("projects_error")}
                    retryLabel={t("retry")}
                    onRetry={() => fetchProjects({ ignoreCache: true })}
                />
            )}

            {!loading &&
                !error &&
                (projects.length ? (
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
                                        t("project_untitled")}
                                </h3>

                                <p className="section-text mb-4">
                                    {project[`description_${currentLang}`] ||
                                        ""}
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
                                                trackGithubOpen(
                                                    project.title_es
                                                )
                                            }
                                        >
                                            <FaGithub aria-hidden="true" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <SectionState type="empty" message={t("projects_empty")} />
                ))}
        </section>
    );
};

export default ProjectsSection;
