import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CertificateModal from "../education/CertificateModal";

let cachedEducation = null;

const EducationSection = ({ titleKey }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language.split("-")[0];
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openCategory, setOpenCategory] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    useEffect(() => {
        if (cachedEducation) {
            setGroups(cachedEducation);
            return;
        }

        const fetchEducation = async () => {
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
                        collection(db, "education"),
                        orderBy("order", "asc")
                    );
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
        };

        fetchEducation();
    }, []);

    const toggleCategory = (category) => {
        setOpenCategory((current) => (current === category ? null : category));
    };

    return (
        <section id="formacion" className="section-container education-section">
            <div className="education-content">
                <h2 key={titleKey} className="section-title animate-title">
                    {t("formation")}
                </h2>

                <p className="section-text">{t("formation_description")}</p>

                {loading && (
                    <p className="section-text">Cargando formación...</p>
                )}

                {error && <p className="section-text">{error}</p>}

                {!loading && !error && (
                    <div
                        style={{
                            width: "100%",
                            marginTop: "2rem",
                        }}
                    >
                        {groups.map((group) => (
                            <div
                                key={group.category}
                                style={{
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <button
                                    type="button"
                                    className="nav-button"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                    onClick={() =>
                                        toggleCategory(group.category)
                                    }
                                >
                                    <span>{group.category}</span>

                                    <span>({group.items.length})</span>
                                </button>

                                {openCategory === group.category && (
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
                                                        ] || "Sin título"}
                                                    </h3>

                                                    <span className="education-year">
                                                        {course.year}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="project-link"
                                                    onClick={() =>
                                                        setSelectedCertificate(
                                                            course
                                                        )
                                                    }
                                                >
                                                    {t("view_certificate")}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <CertificateModal
                    certificate={selectedCertificate}
                    onClose={() => setSelectedCertificate(null)}
                />
            </div>
        </section>
    );
};

export default EducationSection;
