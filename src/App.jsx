// src/App.jsx

import React, { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header.jsx";
import PortfolioContent from "./components/PortfolioContent.jsx";
import GradientBackground from "./components/GradientBackground.jsx";

import SettingsPanel from "./components/Settings/SettingsPanel.jsx";
import SettingsButton from "./components/Settings/SettingsButton.jsx";

import { AnimatePresence } from "framer-motion";
import { useTheme } from "./hooks/useTheme";
import { useFontSize } from "./hooks/useFontSize";
import { useBackgroundAnimation } from "./hooks/useBackgroundAnimation";

import "./index.css";

// Lazy-load admin modules
const AdminLogin = React.lazy(() => import("./components/AdminLogin.jsx"));
const AdminPanel = React.lazy(() => import("./components/AdminPanel.jsx"));

function RequireAuth({ children }) {
    const location = useLocation();
    const [authState, setAuthState] = useState({ status: "loading", user: null });

    useEffect(() => {
        let unsubscribe;

        (async () => {
        try {
            const { onAuthStateChanged } = await import("firebase/auth");
            const { getAuth } = await import("./firebase.js");
            const auth = await getAuth();

            unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthState({ status: "authed", user });
            } else {
                setAuthState({ status: "guest", user: null });
            }
            });
        } catch {
            setAuthState({ status: "guest", user: null });
        }
        })();

        return () => {
        if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    if (authState.status === "loading") {
        return <div className="loading-screen">Cargando...</div>;
    }

    if (authState.status === "guest") {
        return <Navigate to="/adminlogin" replace state={{ from: location }} />;
    }

    return children;
}

function App() {
    const { t } = useTranslation();

    // Estado de secciones del portfolio
    const [activeSection, setActiveSection] = useState(null);
    const [isHeaderEntering, setIsHeaderEntering] = useState(false);

    // Contact form
    const [formData, setFormData] = useState({
        from_name: "",
        from_email: "",
        message: "",
    });
    const [status, setStatus] = useState("");

    // Hooks de configuración
    const themeHook = useTheme();
    const fontHook = useFontSize();
    const bgHook = useBackgroundAnimation();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Scroll suave personalizado
    const scrollToTop = () => {
        setIsHeaderEntering(true);

        const totalDuration = 800;
        const intervalDelay = 15;
        const scrollStep = -window.scrollY / (totalDuration / intervalDelay);

        const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
        } else {
            clearInterval(scrollInterval);
            setActiveSection(null);
            setIsHeaderEntering(false);
        }
        }, intervalDelay);
    };

    // Manejo del formulario
    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.from_name || !formData.from_email || !formData.message) {
        setStatus(t("form_error_missing_fields"));
        return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.from_email)) {
        setStatus(t("form_error_invalid_email"));
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
            () => setStatus(t("form_success")),
            () => setStatus(t("form_error"))
        );
    };

    return (
        <div className="app">
        {/* Fondo global */}
        <GradientBackground />

        {/* Botón de configuración fijo arriba a la derecha (Opción A) */}
        {!isSettingsOpen && (
            <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        )}


        <div className="content-wrapper">
            <Suspense fallback={<div className="loading-screen">Cargando...</div>}>
            <Routes>
                <Route
                path="/"
                element={
                    <>
                    <Header
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        className={`header ${
                        isHeaderEntering ? "header-entering" : ""
                        }`}
                    />

                    {activeSection !== null && (
                        <PortfolioContent
                        activeSection={activeSection}
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
                element={
                    <RequireAuth>
                    <AdminPanel />
                    </RequireAuth>
                }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
        </div>

        {/* Panel lateral de configuración */}
        <AnimatePresence>
            {isSettingsOpen && (
            <SettingsPanel
                onClose={() => setIsSettingsOpen(false)}
                themeHook={themeHook}
                fontHook={fontHook}
                bgHook={bgHook}
            />
            )}
        </AnimatePresence>
        </div>
    );
}

export default App;
