import { motion as Motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaMinus, FaPlus } from "react-icons/fa";
import "./SettingsPanel.css";
import {
    trackThemeChange,
    trackLanguageChange,
} from "../../lib/analytics/analytics";
import { useDialogFocus } from "../../hooks/useDialogFocus";

export default function SettingsPanel({
    onClose,
    themeHook,
    fontHook,
    bgHook,
}) {
    const { t, i18n } = useTranslation();
    const reduceMotion = useReducedMotion();
    const dialogRef = useDialogFocus({ onClose });

    return (
        <>
            <Motion.div
                className="settings-overlay"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />

            <Motion.div
                ref={dialogRef}
                className="settings-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
                tabIndex="-1"
                initial={{ x: reduceMotion ? 0 : 350 }}
                animate={{ x: 0 }}
                exit={{ x: reduceMotion ? 0 : 350 }}
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 140, damping: 18 }
                }
            >
                <h2 id="settings-title" className="settings-title">
                    {t("settings_title")}
                </h2>
                <button
                    className="settings-close"
                    onClick={onClose}
                    aria-label={t("settings_close")}
                >
                    ×
                </button>

                {/* Idioma */}
                <div className="settings-section">
                    <h3>{t("settings_language")}</h3>
                    <div className="settings-option">
                        <label htmlFor="settings-language">
                            {t("settings_current_language")}
                        </label>
                        <select
                            id="settings-language"
                            value={i18n.language.split("-")[0]}
                            onChange={(e) => {
                                const nextLanguage = e.target.value;

                                trackLanguageChange(nextLanguage);

                                i18n.changeLanguage(nextLanguage);
                            }}
                        >
                            <option value="es">ES</option>
                            <option value="en">EN</option>
                        </select>
                    </div>
                </div>

                {/* Tema claro / oscuro */}
                <div className="settings-section">
                    <h3>{t("settings_theme")}</h3>
                    <div className="settings-option">
                        <span>
                            {themeHook.theme === "dark"
                                ? t("theme_dark")
                                : t("theme_light")}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                const nextTheme =
                                    themeHook.theme === "dark"
                                        ? "light"
                                        : "dark";

                                trackThemeChange(nextTheme);
                                themeHook.toggleTheme();
                            }}
                        >
                            {t("settings_change_theme")}
                        </button>
                    </div>
                </div>

                {/* Presets de tema */}
                {themeHook.theme === "light" && (
                    <div className="settings-section">
                        <h3>{t("settings_light_theme")}</h3>
                        <div className="settings-option">
                            <label htmlFor="light-palette">
                                {t("settings_palette")}
                            </label>
                            <select
                                id="light-palette"
                                value={themeHook.preset}
                                onChange={(e) =>
                                    themeHook.setPreset(e.target.value)
                                }
                            >
                                <option value="light-a">
                                    {t("palette_light_a")}
                                </option>
                                <option value="light-b">
                                    {t("palette_light_b")}
                                </option>
                            </select>
                        </div>
                    </div>
                )}

                {themeHook.theme === "dark" && (
                    <div className="settings-section">
                        <h3>{t("settings_dark_theme")}</h3>
                        <div className="settings-option">
                            <label htmlFor="dark-palette">
                                {t("settings_palette")}
                            </label>
                            <select
                                id="dark-palette"
                                value={themeHook.preset}
                                onChange={(e) =>
                                    themeHook.setPreset(e.target.value)
                                }
                            >
                                <option value="dark-a">
                                    {t("palette_dark_a")}
                                </option>
                                <option value="dark-b">
                                    {t("palette_dark_b")}
                                </option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Tamaño de fuente */}
                <div className="settings-section">
                    <h3>{t("settings_font_size")}</h3>
                    <div className="settings-option">
                        <button
                            type="button"
                            onClick={fontHook.decrease}
                            aria-label={t("font_decrease")}
                            disabled={fontHook.scale <= 0.8}
                        >
                            <FaMinus aria-hidden="true" />
                        </button>
                        <output aria-live="polite">
                            {(fontHook.scale * 100).toFixed(0)}%
                        </output>
                        <button
                            type="button"
                            onClick={fontHook.increase}
                            aria-label={t("font_increase")}
                            disabled={fontHook.scale >= 1.4}
                        >
                            <FaPlus aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Fondo animado */}
                <div className="settings-section">
                    <h3>{t("settings_background_animation")}</h3>
                    <div className="settings-option">
                        <span>
                            {bgHook.enabled ? t("enabled") : t("disabled")}
                        </span>
                        <button
                            type="button"
                            aria-pressed={bgHook.enabled}
                            onClick={() => bgHook.setEnabled(!bgHook.enabled)}
                        >
                            {t("settings_toggle_animation")}
                        </button>
                    </div>
                </div>
            </Motion.div>
        </>
    );
}
