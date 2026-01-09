import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    const [preset, setPreset] = useState(() => {
        return localStorage.getItem("theme-preset") || "light-a";
    });

    useEffect(() => {
        const root = document.documentElement;

        let activePreset;

        if (theme === "dark") {
            root.classList.add("dark");
            activePreset = preset.startsWith("dark") ? preset : "dark-a";
        } else {
            root.classList.remove("dark");
            activePreset = preset.startsWith("light") ? preset : "light-a";
        }

        root.dataset.theme = activePreset;

        // Guardar en localStorage
        localStorage.setItem("theme", theme);
        localStorage.setItem("theme-preset", preset);

        // Actualizar theme-color para móviles
        const themeColorMeta = document.getElementById('theme-color-meta');
        const colorMap = {
            "light-a": "#C5D6E8",
            "light-b": "#6487B7",
            "dark-a": "#0A1C2B",
            "dark-b": "#001722",
        };

        if (themeColorMeta && colorMap[activePreset]) {
            themeColorMeta.setAttribute("content", colorMap[activePreset]);
        }
    }, [theme, preset]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return {
        theme,
        preset,
        setPreset,
        setTheme,
        toggleTheme,
    };
}
