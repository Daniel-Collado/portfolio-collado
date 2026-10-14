import { FaCog } from "react-icons/fa";

export default function SettingsButton({ onClick, label, buttonRef }) {
    return (
        <button
            ref={buttonRef}
            className="settings-button"
            aria-label={label}
            onClick={onClick}
        >
            <FaCog size={18} aria-hidden="true" />
        </button>
    );
}
