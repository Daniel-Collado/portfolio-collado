// src/App.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // Importa onAuthStateChanged
import { auth } from './firebase'; // Importa la instancia de auth

import AdminLogin from './components/AdminLogin.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Header from './components/Header.jsx';
import PortfolioContent from './components/PortfolioContent.jsx';
import StarryBackground from './components/StarryBackground.jsx';
import './index.css';

function App() {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState(null);
    const [isHeaderEntering, setIsHeaderEntering] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para la autenticación
    const navigate = useNavigate();

    // Escucha los cambios en el estado de autenticación de Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // El usuario está autenticado, actualiza el estado
                setIsAuthenticated(true);
                // ¡IMPORTANTE!: Redirige al panel de administración si se loguea
                navigate('/admin');
            } else {
                // No hay usuario, actualiza el estado y redirige al login si no está allí
                setIsAuthenticated(false);
                if (window.location.pathname.startsWith('/admin')) {
                    navigate('/adminlogin');
                }
            }
        });
        // La función de limpieza se ejecuta cuando el componente se desmonta
        return () => unsubscribe();
    }, [navigate]);

    // Estados y funciones del formulario de contacto
    const [formData, setFormData] = useState({
        from_name: '',
        from_email: '',
        message: '',
    });
    const [status, setStatus] = useState('');

    const scrollToTop = () => {
        setIsHeaderEntering(true);
        const scrollStep = -window.scrollY / (800 / 15);
        const scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
                setActiveSection(null);
                setIsHeaderEntering(false);
            }
        }, 15);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.from_name || !formData.from_email || !formData.message) {
            setStatus(t('form_error_missing_fields'));
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.from_email)) {
            setStatus(t('form_error_invalid_email'));
            return;
        }
        emailjs
            .send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formData,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
            .then(
                () => {
                    setStatus(t('form_success'));
                },
                () => {
                    setStatus(t('form_error'));
                }
            );
    };

    return (
        <div className="app">
            <StarryBackground />
            <div className="content-wrapper">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Header
                                    setActiveSection={setActiveSection}
                                    activeSection={activeSection}
                                    className={`header ${isHeaderEntering ? 'header-entering' : ''}`}
                                />
                                {activeSection !== null && (
                                    <PortfolioContent
                                        activeSection={activeSection}
                                        setActiveSection={setActiveSection}
                                        scrollToTop={scrollToTop}
                                        formData={formData}
                                        setFormData={setFormData}
                                        status={status}
                                        setStatus={setStatus}
                                        handleChange={handleChange}
                                        handleSubmit={handleSubmit}
                                    />
                                )}
                            </>
                        }
                    />
                    <Route path="/adminlogin" element={<AdminLogin />} />
                    <Route
                        path="/admin"
                        element={isAuthenticated ? <AdminPanel /> : <AdminLogin />}
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;