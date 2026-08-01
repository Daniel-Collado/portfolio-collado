import React, { useEffect, useState } from "react";
import { getDb } from "../../firebase.js";
import axios from "axios";
import "../Admin.css";

const EMPTY_FORM = {
    category: "",

    title_es: "",
    title_en: "",

    year: "",

    certificate_url: "",
    credential_url: "",
};

const EducationManager = () => {
    const [education, setEducation] = useState([]);

    const [educationData, setEducationData] = useState(EMPTY_FORM);

    const [certificateFile, setCertificateFile] = useState(null);

    const [editingEducation, setEditingEducation] = useState(null);

    const [status, setStatus] = useState("");

    const loadEducation = async () => {
        const db = await getDb();

        const { collection, getDocs } = await import("firebase/firestore");

        const snapshot = await getDocs(collection(db, "education"));

        return snapshot.docs
            .map((doc, index) => ({
                id: doc.id,
                ...doc.data(),

                order:
                    doc.data().order ?? doc.data().created_at?.seconds ?? index,
            }))
            .sort((a, b) => {
                if (a.category !== b.category) {
                    return a.category.localeCompare(b.category);
                }

                return (a.order ?? 0) - (b.order ?? 0);
            });
    };

    useEffect(() => {
        (async () => {
            try {
                const list = await loadEducation();

                setEducation(list);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const handleChange = (e) => {
        setEducationData({
            ...educationData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setCertificateFile(e.target.files?.[0] ?? null);
    };

    const uploadCertificateToCloudinary = async () => {
        if (!certificateFile) return null;

        const formData = new FormData();

        formData.append("file", certificateFile);

        formData.append("upload_preset", "Portfolio-uploads");

        formData.append(
            "cloud_name",
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        );

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );

            return response.data.secure_url;
        } catch (error) {
            console.error(error);

            setStatus("Error al subir el certificado.");

            return null;
        }
    };

    const handleEdit = (item) => {
        setEditingEducation(item);

        setEducationData({
            category: item.category ?? "",

            title_es: item.title_es ?? "",
            title_en: item.title_en ?? "",

            year: item.year ?? "",

            certificate_url: item.certificate_url ?? "",
            credential_url: item.credential_url ?? "",
        });

        setCertificateFile(null);
    };

    const handleCancelEdit = () => {
        setEditingEducation(null);

        setEducationData(EMPTY_FORM);

        setCertificateFile(null);

        setStatus("");
    };

    const handleDelete = async (id) => {
        try {
            const db = await getDb();

            const { deleteDoc, doc, collection, getDocs, updateDoc } =
                await import("firebase/firestore");

            /**
             * Buscar el certificado antes de eliminarlo
             */
            const deletedItem = education.find((item) => item.id === id);

            if (!deletedItem) {
                return;
            }

            /**
             * Eliminar certificado
             */
            await deleteDoc(doc(db, "education", id));

            /**
             * Obtener todos los certificados nuevamente
             */
            const snapshot = await getDocs(collection(db, "education"));

            /**
             * Renumerar únicamente la categoría afectada
             */
            const categoryItems = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((item) => item.category === deletedItem.category)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

            await Promise.all(
                categoryItems.map((item, index) =>
                    updateDoc(doc(db, "education", item.id), {
                        order: index,
                    })
                )
            );

            /**
             * Recargar listado
             */
            const list = await loadEducation();

            setEducation(list);

            setStatus("Certificado eliminado.");
        } catch (error) {
            console.error(error);

            setStatus("Error al eliminar.");
        }
    };

    const handleMove = async (category, index, direction) => {
        const categoryItems = education
            .filter((item) => item.category === category)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const target = direction === "up" ? index - 1 : index + 1;

        if (target < 0 || target >= categoryItems.length) {
            return;
        }

        [categoryItems[index], categoryItems[target]] = [
            categoryItems[target],
            categoryItems[index],
        ];

        categoryItems.forEach((item, i) => {
            item.order = i;
        });

        const updatedEducation = education.map((item) => {
            const updated = categoryItems.find(
                (course) => course.id === item.id
            );

            return updated ?? item;
        });

        setEducation(updatedEducation);

        try {
            const db = await getDb();

            const { doc, updateDoc } = await import("firebase/firestore");

            await Promise.all(
                categoryItems.map((item) =>
                    updateDoc(doc(db, "education", item.id), {
                        order: item.order,
                    })
                )
            );
        } catch (error) {
            console.error(error);

            setEducation(await loadEducation());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStatus("Guardando certificación...");

        const certificateUrl = certificateFile
            ? await uploadCertificateToCloudinary()
            : editingEducation?.certificate_url;

        if (!certificateUrl && certificateFile) {
            return;
        }

        try {
            const db = await getDb();

            const { collection, addDoc, updateDoc, doc } =
                await import("firebase/firestore");

            if (editingEducation) {
                const educationRef = doc(db, "education", editingEducation.id);

                await updateDoc(educationRef, {
                    ...educationData,
                    certificate_url: certificateUrl,
                });

                setStatus("Certificación actualizada.");
            } else {
                if (!certificateUrl) {
                    setStatus("Debe seleccionar un certificado.");

                    return;
                }

                const categoryOrder = education.filter(
                    (item) => item.category === educationData.category
                ).length;

                await addDoc(collection(db, "education"), {
                    ...educationData,

                    certificate_url: certificateUrl,

                    created_at: new Date(),

                    order: categoryOrder,
                });
                setStatus("Certificación agregada.");
            }

            const list = await loadEducation();

            setEducation(list);

            setTimeout(() => {
                handleCancelEdit();

                setStatus("");
            }, 3000);
        } catch (error) {
            console.error(error);

            setStatus("Error al guardar la certificación.");
        }
    };

    const groupedEducation = education.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }

        acc[item.category].push(item);

        return acc;
    }, {});

    return (
        <div className="admin-container">
            <form onSubmit={handleSubmit} className="admin-form">
                <h3 className="admin-subtitle">
                    {editingEducation
                        ? "Editar Certificación"
                        : "Agregar Certificación"}
                </h3>

                <div className="form-group">
                    <label>Institución / Plataforma</label>

                    <input
                        type="text"
                        name="category"
                        value={educationData.category}
                        onChange={handleChange}
                        placeholder="Ej: Coderhouse"
                        required
                        disabled={Boolean(editingEducation)}
                        className="admin-input"
                    />
                </div>

                <div className="form-group">
                    <label>Título (Español)</label>

                    <input
                        type="text"
                        name="title_es"
                        value={educationData.title_es}
                        onChange={handleChange}
                        required
                        className="admin-input"
                    />
                </div>

                <div className="form-group">
                    <label>Título (Inglés)</label>

                    <input
                        type="text"
                        name="title_en"
                        value={educationData.title_en}
                        onChange={handleChange}
                        required
                        className="admin-input"
                    />
                </div>

                <div className="form-group">
                    <label>Año</label>

                    <input
                        type="text"
                        name="year"
                        value={educationData.year}
                        onChange={handleChange}
                        required
                        className="admin-input"
                    />
                </div>

                <div className="form-group">
                    <label>URL credencial (opcional)</label>

                    <input
                        type="url"
                        name="credential_url"
                        value={educationData.credential_url}
                        onChange={handleChange}
                        className="admin-input"
                    />
                </div>

                <div className="form-group">
                    <label
                        htmlFor="certificate-upload"
                        className="custom-file-upload"
                    >
                        {certificateFile
                            ? certificateFile.name
                            : editingEducation
                              ? "Seleccionar nuevo certificado"
                              : "Seleccionar certificado"}
                    </label>

                    <input
                        id="certificate-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden-file-input"
                        required={!editingEducation}
                    />
                </div>

                <button type="submit" className="admin-button">
                    {editingEducation
                        ? "Actualizar Certificación"
                        : "Agregar Certificación"}
                </button>

                {editingEducation && (
                    <button
                        type="button"
                        className="admin-button cancel-button"
                        onClick={handleCancelEdit}
                    >
                        Cancelar
                    </button>
                )}
            </form>

            {status && <p className="admin-status">{status}</p>}

            <div className="projects-list">
                <h3>Certificaciones</h3>

                {Object.entries(groupedEducation).map(([category, items]) => (
                    <div key={category} className="admin-category-group">
                        <h4 className="admin-category-title">
                            {category} ({items.length})
                        </h4>

                        <ul className="admin-project-list">
                            {items.map((item, index) => (
                                <li
                                    key={item.id}
                                    className="admin-project-item"
                                >
                                    <span>{item.title_es}</span>

                                    <div className="admin-project-actions">
                                        <button
                                            type="button"
                                            className="admin-button"
                                            disabled={index === 0}
                                            onClick={() =>
                                                handleMove(
                                                    category,
                                                    index,
                                                    "up"
                                                )
                                            }
                                        >
                                            ↑
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-button"
                                            disabled={
                                                index === items.length - 1
                                            }
                                            onClick={() =>
                                                handleMove(
                                                    category,
                                                    index,
                                                    "down"
                                                )
                                            }
                                        >
                                            ↓
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-button edit-button"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-button delete-button"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationManager;
