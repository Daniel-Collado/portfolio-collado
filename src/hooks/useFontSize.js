import { useState, useEffect } from "react";

export function useFontSize() {
    const [scale, setScale] = useState(() => {
        return Number(localStorage.getItem("fontScale")) || 1;
    });

    useEffect(() => {
        document.documentElement.style.setProperty("--font-size-scale", scale);
        localStorage.setItem("fontScale", scale);
    }, [scale]);

    return {
        scale,
        increase: () => setScale((s) => Math.min(s + 0.1, 1.4)),
        decrease: () => setScale((s) => Math.max(s - 0.1, 0.8)),
        reset: () => setScale(1)
    };
}
