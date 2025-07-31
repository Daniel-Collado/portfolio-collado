import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import Header from './components/Header.jsx';
import PortfolioContent from './components/PortfolioContent.jsx';
import StarryBackground from './components/StarryBackground.jsx';
import './index.css';

function App() {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState(null);
    const [isHeaderEntering, setIsHeaderEntering] = useState(false);

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
                    setFormData({ from_name: '', from_email: '', message: '' });
                },
                (error) => {
                    console.error('Error de EmailJS:', error.text, error);
                    setStatus(t('form_error'));
                }
            )
            .catch((error) => {
                console.error('Excepción no manejada:', error);
                setStatus(t('form_error'));
            });
    };

    // Ya NO necesitamos la lógica para los cometas aquí (numberOfComets, cometsArray)

    return (
        <div className="app">
            {/* Renderiza el fondo de estrellas (que ahora es estático y sin cometas) */}
            <StarryBackground />
            {/* Ya NO renderizamos los cometas aquí */}

            {/* content-wrapper ahora gestiona el centrado vertical */}
            <div className="content-wrapper">
                {/* El Header siempre se renderiza */}
                <Header
                    setActiveSection={setActiveSection}
                    activeSection={activeSection}
                    className={`header ${isHeaderEntering ? 'header-entering' : ''}`}
                />
                {/* PortfolioContent solo se renderiza si hay una sección activa */}
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
            </div>
        </div>
    );
}

export default App;