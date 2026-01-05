import { FaCog } from "react-icons/fa";

export default function SettingsButton({ onClick }) {
    return (
        <button className="settings-button" aria-label="Abrir configuración" onClick={onClick}>
        <FaCog size={18} />
        </button>
    );
}
