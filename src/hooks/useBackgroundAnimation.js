import { useState, useEffect } from "react";

export function useBackgroundAnimation() {
    const [enabled, setEnabled] = useState(() => {
        const storedPreference = localStorage.getItem("bgAnimation");
        if (storedPreference !== null) return storedPreference !== "0";
        return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--bg-animation",
            enabled ? "1" : "0"
        );
        localStorage.setItem("bgAnimation", enabled ? "1" : "0");
    }, [enabled]);

    return { enabled, setEnabled };
}
