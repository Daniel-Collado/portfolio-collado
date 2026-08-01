import { useState } from "react";

import ProjectsManager from "./admin/ProjectsManager";
import EducationManager from "./admin/EducationManager";
import { getAuth } from "../firebase";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("projects");

    const handleLogout = async () => {
        try {
            const auth = await getAuth();
            const { signOut } = await import("firebase/auth");
            await signOut(auth);
            console.log("Sesión cerrada exitosamente.");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2 className="admin-title">Panel de Administración</h2>

                <button onClick={handleLogout} className="admin-button">
                    Cerrar sesión
                </button>
            </div>
            <div className="admin-tabs">
                <button
                    className="admin-button"
                    onClick={() => setActiveTab("projects")}
                >
                    Trabajos
                </button>

                <button
                    className="admin-button"
                    onClick={() => setActiveTab("education")}
                >
                    Formación
                </button>
            </div>

            {activeTab === "projects" && <ProjectsManager />}

            {activeTab === "education" && <EducationManager />}
        </div>
    );
};

export default AdminPanel;
