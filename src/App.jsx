// src/App.jsx

import React, { useEffect, useState, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header.jsx";
import PortfolioContent from "./components/PortfolioContent.jsx";
import StarryBackground from "./components/StarryBackground.jsx";
import "./index.css";

// Lazy-load: estos chunks no se descargan en la HOME
const AdminLogin = lazy(() => import("./components/AdminLogin.jsx"));
const AdminPanel = lazy(() => import("./components/AdminPanel.jsx"));

function RequireAuth({ children }) {
    const location = useLocation();
    const [state, setState] = useState({ status: "loading", user: null });

    useEffect(() => {
        let unsubscribe = null;

        (async () => {
        try {
            const { onAuthStateChanged } = await import("firebase/auth");
            const { getAuth } = await import("./firebase.js");
            const auth = await getAuth();

            unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setState({ status: "authed", user });
            else setState({ status: "guest", user: null });
            });
        } catch (e) {
            // Si algo falla, tratamos como guest para no “romper” el sitio
            setState({ status: "guest", user: null });
        }
        })();

        return () => {
        if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    if (state.status === "loading") {
        // Mantenerlo minimalista para no afectar LCP en /admin tampoco
        return <div style={{ color: "#fff", padding: "2rem" }}>Cargando…</div>;
    }

    if (state.status === "guest") {
        return <Navigate to="/adminlogin" replace state={{ from: location }} />;
    }

    return children;
}

function App() {
    const { t } = useTranslation();

    const [activeSection, setActiveSection] = useState(null);
    const [isHeaderEntering, setIsHeaderEntering] = useState(false);

    // Form contacto
    const [formData, setFormData] = useState({
        from_name: "",
        from_email: "",
        message: "",
    });
    const [status, setStatus] = useState("");

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
        <StarryBackground />
        <div className="content-wrapper">
            <Suspense fallback={<div style={{ color: "#fff", padding: "2rem" }}>Cargando…</div>}>
            <Routes>
                <Route
                path="/"
                element={
                    <>
                    <Header
                        setActiveSection={setActiveSection}
                        activeSection={activeSection}
                        className={`header ${isHeaderEntering ? "header-entering" : ""}`}
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
        </div>
    );
}

export default App;
