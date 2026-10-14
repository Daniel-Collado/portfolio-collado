import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CertificateModal from "../education/CertificateModal";
import { trackCertificateOpen } from "../../lib/analytics/analytics";
import SectionState from "../SectionState";

let cachedEducation = null;

const EducationSection = ({ titleKey }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language.split("-")[0];
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openCategory, setOpenCategory] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    const fetchEducation = useCallback(async ({ ignoreCache = false } = {}) => {
        if (cachedEducation && !ignoreCache) {
            setGroups(cachedEducation);
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
                q = query(collection(db, "education"), orderBy("order", "asc"));
            } catch {
                q = query(collection(db, "education"));
            }

            const snapshot = await getDocs(q);

            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const grouped = Object.values(
                items.reduce((acc, item) => {
                    if (!acc[item.category]) {
                        acc[item.category] = {
                            category: item.category,
                            items: [],
                        };
                    }

                    acc[item.category].items.push(item);

                    return acc;
                }, {})
            );

            cachedEducation = grouped;
            setGroups(grouped);
        } catch (err) {
            console.error(err);
            setError("Error al cargar la formación.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEducation();
    }, [fetchEducation]);

    const toggleCategory = (category) => {
        setOpenCategory((current) => (current === category ? null : category));
    };

    return (
        <section id="formacion" className="section-container education-section">
            <div className="education-content">
                <h2
                    key={titleKey}
                    className="section-title animate-title"
                    tabIndex="-1"
                >
                    {t("formation")}
                </h2>

                <p className="section-text">{t("formation_description")}</p>

                {loading && (
                    <SectionState
                        type="loading"
                        message={t("education_loading")}
                    />
                )}

                {error && (
                    <SectionState
                        type="error"
                        message={t("education_error")}
                        retryLabel={t("retry")}
                        onRetry={() => fetchEducation({ ignoreCache: true })}
                    />
                )}

                {!loading &&
                    !error &&
                    (groups.length ? (
                        <div className="education-groups">
                            {groups.map((group, groupIndex) => (
                                <div
                                    key={group.category}
                                    className="education-group"
                                >
                                    <button
                                        type="button"
                                        className="nav-button"
                                        aria-expanded={
                                            openCategory === group.category
                                        }
                                        aria-controls={`education-panel-${groupIndex}`}
                                        onClick={() =>
                                            toggleCategory(group.category)
                                        }
                                    >
                                        <span>{group.category}</span>

                                        <span
                                            aria-label={t("certificate_count", {
                                                count: group.items.length,
                                            })}
                                        >
                                            ({group.items.length})
                                        </span>
                                    </button>

                                    <div
                                        id={`education-panel-${groupIndex}`}
                                        className={`education-panel ${
                                            openCategory === group.category
                                                ? "education-panel--open"
                                                : ""
                                        }`}
                                        role="region"
                                        aria-label={group.category}
                                        aria-hidden={
                                            openCategory !== group.category
                                        }
                                        inert={openCategory !== group.category}
                                    >
                                        <div className="education-list">
                                            {group.items.map((course) => (
                                                <div
                                                    key={course.id}
                                                    className="education-row"
                                                >
                                                    <div className="education-info">
                                                        <h3 className="education-title">
                                                            {course[
                                                                `title_${currentLang}`
                                                            ] ||
                                                                t(
                                                                    "certificate_untitled"
                                                                )}
                                                        </h3>

                                                        <span className="education-year">
                                                            {course.year}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="project-link"
                                                        onClick={() => {
                                                            trackCertificateOpen(
                                                                course.title_es,
                                                                course.category
                                                            );

                                                            setSelectedCertificate(
                                                                course
                                                            );
                                                        }}
                                                    >
                                                        {t("view_certificate")}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <SectionState
                            type="empty"
                            message={t("education_empty")}
                        />
                    ))}
                <CertificateModal
                    certificate={selectedCertificate}
                    onClose={() => setSelectedCertificate(null)}
                />
            </div>
        </section>
    );
};

export default EducationSection;
