
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importa las funciones necesarias
import './Admin.css';

const AdminLogin = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpia cualquier error previo

        try {
            // Inicializa la autenticación de Firebase
            const auth = getAuth();
            
            // Intenta iniciar sesión con el correo y la contraseña
            await signInWithEmailAndPassword(auth, email, password);
            
            // Si el inicio de sesión es exitoso, llama a handleLogin del componente padre
            handleLogin(true); 

        } catch (authError) {
            // Maneja los errores de autenticación de Firebase
            if (authError.code === 'auth/wrong-password' || authError.code === 'auth/user-not-found') {
                setError('Correo o contraseña incorrectos.');
            } else {
                setError('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
                console.error('Error de autenticación:', authError);
            }
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">Acceso de Administrador</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo"
                    className="admin-input"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="admin-input"
                    required
                />
                <button type="submit" className="admin-button">
                    Ingresar
                </button>
            </form>
            {error && <p className="admin-status">{error}</p>}
        </div>
    );
};

export default AdminLogin;