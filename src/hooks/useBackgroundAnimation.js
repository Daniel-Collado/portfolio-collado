import { useState, useEffect } from "react";

export function useBackgroundAnimation() {
    const [enabled, setEnabled] = useState(() => {
        return localStorage.getItem("bgAnimation") !== "0";
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
