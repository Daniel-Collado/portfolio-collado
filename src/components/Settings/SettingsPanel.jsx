import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaMinus, FaPlus } from "react-icons/fa";
import "./SettingsPanel.css";

export default function SettingsPanel({
    onClose,
    themeHook,
    fontHook,
    bgHook
}) {
    const { i18n } = useTranslation();

    return (
        <>
            <motion.div
                className="settings-overlay"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            <motion.div
                className="settings-panel"
                initial={{ x: 350 }}
                animate={{ x: 0 }}
                exit={{ x: 350 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
            >
                <h2 className="settings-title">Configuración</h2>
                <button className="settings-close" onClick={onClose} aria-label="Cerrar configuración">x</button>

                {/* Idioma */}
                <div className="settings-section">
                    <h4>Idioma</h4>
                    <div className="settings-option">
                        <span>Idioma actual:</span>
                        <select
                            value={i18n.language}
                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                        >
                            <option value="es">ES</option>
                            <option value="en">EN</option>
                        </select>
                    </div>
                </div>

                {/* Tema claro / oscuro */}
                <div className="settings-section">
                    <h4>Tema</h4>
                    <div className="settings-option">
                        <span>{themeHook.theme === "dark" ? "Oscuro" : "Claro"}</span>
                        <button onClick={themeHook.toggleTheme}>
                            Cambiar
                        </button>
                    </div>
                </div>

                {/* Presets de tema */}
                {themeHook.theme === "light" && (
                    <div className="settings-section">
                        <h4>Tema claro</h4>
                        <div className="settings-option">
                            <span>Paleta:</span>
                            <select
                                value={themeHook.preset}
                                onChange={(e) => themeHook.setPreset(e.target.value)}
                            >
                                <option value="light-a">Light A</option>
                                <option value="light-b">Light B</option>
                            </select>
                        </div>
                    </div>
                )}

                {themeHook.theme === "dark" && (
                    <div className="settings-section">
                        <h4>Tema oscuro</h4>
                        <div className="settings-option">
                            <span>Paleta:</span>
                            <select
                                value={themeHook.preset}
                                onChange={(e) => themeHook.setPreset(e.target.value)}
                            >
                                <option value="dark-a">Dark A</option>
                                <option value="dark-b">Dark B</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Tamaño de fuente */}
                <div className="settings-section">
                    <h4>Tamaño de fuente</h4>
                    <div className="settings-option">
                        <button onClick={fontHook.decrease}>
                            <FaMinus />
                        </button>
                        <span>{(fontHook.scale * 100).toFixed(0)}%</span>
                        <button onClick={fontHook.increase}>
                            <FaPlus />
                        </button>
                    </div>
                </div>

                {/* Fondo animado */}
                <div className="settings-section">
                    <h4>Animación de fondo</h4>
                    <div className="settings-option">
                        <span>
                            {bgHook.enabled ? "Activada" : "Desactivada"}
                        </span>
                        <button
                            onClick={() => bgHook.setEnabled(!bgHook.enabled)}
                        >
                            Cambiar
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
