// src/components/AdminPanel.jsx

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import './Admin.css';


const AdminPanel = () => {
    // Nuevo estado para la lista de proyectos, lo necesitamos para mostrar, editar y eliminar.
    const [projects, setProjects] = useState([]);
    const [projectData, setProjectData] = useState({
        title_es: '',
        title_en: '',
        description_es: '',
        description_en: '',
        project_url: '',
        github_url: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [status, setStatus] = useState('');
    const [editingProject, setEditingProject] = useState(null); // Nuevo estado para saber si estamos editando

    // Nuevo useEffect para obtener la lista de proyectos al cargar el componente
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'projects'));
                const projectsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProjects(projectsList);
            } catch (error) {
                console.error("Error al obtener proyectos: ", error);
            }
        };
        fetchProjects();
    }, []); // El array vacío asegura que se ejecute solo una vez al inicio

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const uploadImageToCloudinary = async () => {
        if (!imageFile) return null;

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'Portfolio-uploads');
        formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            setStatus('Error al subir la imagen.');
            return null;
        }
    };
    
    // Función para cerrar la sesión del usuario
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Sesión cerrada exitosamente.");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };
    
    // Función para eliminar un proyecto
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'projects', id));
            // Actualiza el estado para reflejar la eliminación
            setProjects(projects.filter(project => project.id !== id));
            setStatus('Proyecto eliminado exitosamente.');
        } catch (error) {
            console.error("Error al eliminar el documento: ", error);
            setStatus('Error al eliminar el proyecto.');
        }
    };

    // Función para preparar la edición de un proyecto
    const handleEdit = (project) => {
        // Establece el proyecto a editar y carga sus datos en el formulario
        setEditingProject(project);
        setProjectData({
            title_es: project.title_es,
            title_en: project.title_en,
            description_es: project.description_es,
            description_en: project.description_en,
            project_url: project.project_url,
            github_url: project.github_url || '',
        });
        setImageFile(null); // Limpiamos la imagen para que el usuario suba una nueva si lo desea
    };

    const handleCancelEdit = () => {
        setEditingProject(null);
        setProjectData({
            title_es: '',
            title_en: '',
            description_es: '',
            description_en: '',
            project_url: '',
            github_url: '',
        });
        setImageFile(null);
        setStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Subiendo proyecto...');

        // Tu lógica de subida de imagen a Cloudinary
        const imageUrl = imageFile ? await uploadImageToCloudinary() : editingProject?.image_url;
        if (!imageUrl && imageFile) {
            return; // No continuar si se intentó subir una imagen y falló
        }

        try {
            if (editingProject) {
                // Lógica para actualizar un proyecto existente
                const projectRef = doc(db, 'projects', editingProject.id);
                await updateDoc(projectRef, { ...projectData, image_url: imageUrl });
                setStatus('Proyecto actualizado con éxito!');
            } else {
                // Lógica para agregar un nuevo proyecto
                if (!imageUrl) {
                    setStatus('Error: Se requiere una imagen para un nuevo proyecto.');
                    return;
                }
                await addDoc(collection(db, 'projects'), {
                    ...projectData,
                    image_url: imageUrl,
                    created_at: new Date(),
                });
                setStatus('¡Proyecto agregado con éxito!');
            }
            

            // Vuelve a cargar los proyectos para refrescar la lista
            const querySnapshot = await getDocs(collection(db, 'projects'));
            const projectsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsList);

            setTimeout(() => {
                handleCancelEdit();
                setStatus(''); // Limpiamos el estado después de un breve tiempo
            }, 3000); // 3000 ms = 3 segundos


        } catch (error) {
            console.error('Error al guardar el proyecto en Firebase:', error);
            setStatus('Error al guardar el proyecto.');
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
            
            {/* Formulario de agregar/editar */}
            <form onSubmit={handleSubmit} className="admin-form">
                <h3 className="admin-subtitle">{editingProject ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}</h3>
                {/* ... Campos del formulario ... */}
                <div className="form-group">
                    <label>Título (Español):</label>
                    <input type="text" name="title_es" value={projectData.title_es} onChange={handleChange} required className="admin-input" />
                </div>
                <div className="form-group">
                    <label>Título (Inglés):</label>
                    <input type="text" name="title_en" value={projectData.title_en} onChange={handleChange} required className="admin-input" />
                </div>
                <div className="form-group">
                    <label>Descripción (Español):</label>
                    <textarea name="description_es" value={projectData.description_es} onChange={handleChange} required className="admin-textarea" />
                </div>
                <div className="form-group">
                    <label>Descripción (Inglés):</label>
                    <textarea name="description_en" value={projectData.description_en} onChange={handleChange} required className="admin-textarea" />
                </div>
                <div className="form-group">
                    <label>URL del Proyecto:</label>
                    <input type="url" name="project_url" value={projectData.project_url} onChange={handleChange} required className="admin-input" />
                </div>
                <div className="form-group">
                    <label>URL del Repositorio (GitHub):</label>
                    <input type="url" name="github_url" value={projectData.github_url || ''} onChange={handleChange} placeholder="https://github.com/usuario/repositorio" className="admin-input" />
                    </div>

                <div className="form-group">
                    <label htmlFor="file-upload" className="custom-file-upload admin-button">
                        {imageFile ? imageFile.name : (editingProject ? 'Seleccionar Nueva Imagen' : 'Seleccionar Imagen')}
                    </label>
                    <input id="file-upload" type="file" onChange={handleFileChange} className="hidden-file-input" required={!editingProject} />
                </div>
                <button type="submit" className="admin-button">
                    {editingProject ? 'Actualizar Proyecto' : 'Agregar Proyecto'}
                </button>
                {editingProject && (
                    <button type="button" onClick={handleCancelEdit} className="admin-button cancel-button">
                        Cancelar
                    </button>
                )}
            </form>
            {status && <p className="admin-status">{status}</p>}

            {/* Nuevo: Listado de Proyectos Existentes */}
            <div className="projects-list">
                <h3>Proyectos Existentes</h3>
                <ul className="admin-project-list">
                    {projects.map(project => (
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