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

        if (theme === "dark") {
            root.classList.add("dark");

            // Si el preset guardado no es dark, forzamos dark-a
            const darkPreset = preset.startsWith("dark")
                ? preset
                : "dark-a";

            root.dataset.theme = darkPreset;
        } else {
            root.classList.remove("dark");

            // Si el preset guardado no es light, forzamos light-a
            const lightPreset = preset.startsWith("light")
                ? preset
                : "light-a";

            root.dataset.theme = lightPreset;
        }

        localStorage.setItem("theme", theme);
        localStorage.setItem("theme-preset", preset);
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
