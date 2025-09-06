import React, { useState } from 'react';
import { db } from '../firebase.js'; // <-- Importamos la base de datos
import { collection, addDoc } from 'firebase/firestore';
import axios from 'axios';
import './Admin.css';


const AdminPanel = () => {
    const [projectData, setProjectData] = useState({
        title_es: '',
        title_en: '',
        description_es: '',
        description_en: '',
        project_url: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [status, setStatus] = useState('');

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
        formData.append('upload_preset', 'Portfolio-uploads'); // Configura esto en tu Cloudinary
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Subiendo proyecto...');

        const imageUrl = await uploadImageToCloudinary();
        if (!imageUrl) {
            return; // No continuar si la imagen no se subió
        }

        try {
            await addDoc(collection(db, 'projects'), {
                ...projectData,
                image_url: imageUrl,
                created_at: new Date(),
            });
            setStatus('¡Proyecto agregado con éxito!');
            setProjectData({
                title_es: '',
                title_en: '',
                description_es: '',
                description_en: '',
                project_url: '',
            });
            setImageFile(null);
        } catch (error) {
            console.error('Error al guardar el proyecto en Firebase:', error);
            setStatus('Error al guardar el proyecto.');
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">Agregar Nuevo Proyecto</h2>
            <form onSubmit={handleSubmit} className="admin-form">
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
                    <label>Imagen del Proyecto:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="admin-file-input"
                    />
                </div>
                <button type="submit" className="admin-button">
                    Agregar Proyecto
                </button>
            </form>
            {status && <p className="admin-status">{status}</p>}
        </div>
    );
};

export default AdminPanel;