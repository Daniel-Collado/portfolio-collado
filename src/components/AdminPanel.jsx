// src/components/AdminPanel.jsx

import React, { useState, useEffect } from "react";
import { getDb, getAuth } from "../firebase.js";
import axios from "axios";
import "./Admin.css";

const AdminPanel = () => {
    const [projects, setProjects] = useState([]);
    const [projectData, setProjectData] = useState({
        title_es: "",
        title_en: "",
        description_es: "",
        description_en: "",
        project_url: "",
        github_url: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [status, setStatus] = useState("");
    const [editingProject, setEditingProject] = useState(null);

    // Firestore helpers (lazy import)
    const loadProjects = async () => {
        const db = await getDb();
        const { collection, getDocs } = await import("firebase/firestore");
        const querySnapshot = await getDocs(collection(db, "projects"));
        return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    };

    useEffect(() => {
        (async () => {
        try {
            const list = await loadProjects();
            setProjects(list);
        } catch (error) {
            console.error("Error al obtener proyectos: ", error);
        }
        })();
    }, []);

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files?.[0] ?? null);
    };

    const uploadImageToCloudinary = async () => {
        if (!imageFile) return null;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "Portfolio-uploads");
        formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        return response.data.secure_url;
        } catch (error) {
        console.error("Error al subir la imagen a Cloudinary:", error);
        setStatus("Error al subir la imagen.");
        return null;
        }
    };

    const handleLogout = async () => {
        try {
        const auth = await getAuth();
        const { signOut } = await import("firebase/auth");
        await signOut(auth);
        console.log("Sesión cerrada exitosamente.");
        } catch (error) {
        console.error("Error al cerrar sesión:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
        const db = await getDb();
        const { deleteDoc, doc } = await import("firebase/firestore");
        await deleteDoc(doc(db, "projects", id));

        setProjects(projects.filter((p) => p.id !== id));
        setStatus("Proyecto eliminado exitosamente.");
        } catch (error) {
        console.error("Error al eliminar el documento: ", error);
        setStatus("Error al eliminar el proyecto.");
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setProjectData({
        title_es: project.title_es,
        title_en: project.title_en,
        description_es: project.description_es,
        description_en: project.description_en,
        project_url: project.project_url,
        github_url: project.github_url || "",
        });
        setImageFile(null);
    };

    const handleCancelEdit = () => {
        setEditingProject(null);
        setProjectData({
        title_es: "",
        title_en: "",
        description_es: "",
        description_en: "",
        project_url: "",
        github_url: "",
        });
        setImageFile(null);
        setStatus("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Subiendo proyecto...");

        const imageUrl = imageFile
        ? await uploadImageToCloudinary()
        : editingProject?.image_url;

        if (!imageUrl && imageFile) return;

        try {
        const db = await getDb();
        const { collection, addDoc, updateDoc, doc } = await import("firebase/firestore");

        if (editingProject) {
            const projectRef = doc(db, "projects", editingProject.id);
            await updateDoc(projectRef, { ...projectData, image_url: imageUrl });
            setStatus("Proyecto actualizado con éxito!");
        } else {
            if (!imageUrl) {
            setStatus("Error: Se requiere una imagen para un nuevo proyecto.");
            return;
            }
            await addDoc(collection(db, "projects"), {
            ...projectData,
            image_url: imageUrl,
            created_at: new Date(),
            });
            setStatus("¡Proyecto agregado con éxito!");
        }

        const list = await loadProjects();
        setProjects(list);

        setTimeout(() => {
            handleCancelEdit();
            setStatus("");
        }, 3000);
        } catch (error) {
        console.error("Error al guardar el proyecto en Firebase:", error);
        setStatus("Error al guardar el proyecto.");
        }
    };

    return (
        <div className="admin-container">
        <div className="admin-header">
            <h2 className="admin-title">Panel de Administración</h2>
            <button onClick={handleLogout} className="admin-button">
            Cerrar Sesión
            </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
            <h3 className="admin-subtitle">
            {editingProject ? "Editar Proyecto" : "Agregar Nuevo Proyecto"}
            </h3>

            <div className="form-group">
            <label>Título (Español):</label>
            <input
                type="text"
                name="title_es"
                value={projectData.title_es}
                onChange={handleChange}
                required
                className="admin-input"
            />
            </div>

            <div className="form-group">
            <label>Título (Inglés):</label>
            <input
                type="text"
                name="title_en"
                value={projectData.title_en}
                onChange={handleChange}
                required
                className="admin-input"
            />
            </div>

            <div className="form-group">
            <label>Descripción (Español):</label>
            <textarea
                name="description_es"
                value={projectData.description_es}
                onChange={handleChange}
                required
                className="admin-textarea"
            />
            </div>

            <div className="form-group">
            <label>Descripción (Inglés):</label>
            <textarea
                name="description_en"
                value={projectData.description_en}
                onChange={handleChange}
                required
                className="admin-textarea"
            />
            </div>

            <div className="form-group">
            <label>URL del Proyecto:</label>
            <input
                type="url"
                name="project_url"
                value={projectData.project_url}
                onChange={handleChange}
                required
                className="admin-input"
            />
            </div>

            <div className="form-group">
            <label>URL del Repositorio (GitHub):</label>
            <input
                type="url"
                name="github_url"
                value={projectData.github_url || ""}
                onChange={handleChange}
                placeholder="https://github.com/usuario/repositorio"
                className="admin-input"
            />
            </div>

            <div className="form-group">
            <label htmlFor="file-upload" className="custom-file-upload admin-button">
                {imageFile
                ? imageFile.name
                : editingProject
                ? "Seleccionar Nueva Imagen"
                : "Seleccionar Imagen"}
            </label>
            <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden-file-input"
                required={!editingProject}
            />
            </div>

            <button type="submit" className="admin-button">
            {editingProject ? "Actualizar Proyecto" : "Agregar Proyecto"}
            </button>

            {editingProject && (
            <button
                type="button"
                onClick={handleCancelEdit}
                className="admin-button cancel-button"
            >
                Cancelar
            </button>
            )}
        </form>

        {status && <p className="admin-status">{status}</p>}

        <div className="projects-list">
            <h3>Proyectos Existentes</h3>
            <ul className="admin-project-list">
            {projects.map((project) => (
                <li key={project.id} className="admin-project-item">
                <span>{project.title_es}</span>
                <div className="admin-project-actions">
                    <button onClick={() => handleEdit(project)} className="admin-button edit-button">
                    Editar
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="admin-button delete-button">
                    Eliminar
                    </button>
                </div>
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
};

export default AdminPanel;
