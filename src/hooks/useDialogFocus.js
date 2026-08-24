import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "select:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

export function useDialogFocus({ active = true, onClose }) {
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!active) return undefined;

        const previouslyFocused = document.activeElement;
        const dialog = dialogRef.current;
        const firstFocusable = dialog?.querySelector(FOCUSABLE_SELECTOR);

        window.requestAnimationFrame(() => {
            (firstFocusable || dialog)?.focus({ preventScroll: true });
        });

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key !== "Tab" || !dialog) return;

            const focusable = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)];
            if (!focusable.length) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable.at(-1);

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.({ preventScroll: true });
        };
    }, [active]);

    return dialogRef;
}
