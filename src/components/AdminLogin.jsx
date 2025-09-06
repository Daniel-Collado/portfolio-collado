// src/components/AdminLogin.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Importa la instancia de auth
import './Admin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            // Paso 2: Si llegamos aquí, el login fue exitoso.
            console.log('Login exitoso.');

        } catch (authError) {
            // Paso 3: Si hay un error, lo registramos.
            // Esto es crucial para ver si hay un error de conexión, de credenciales o de otro tipo.
            console.error('Error de autenticación:', authError);
            
            if (authError.code === 'auth/wrong-password' || authError.code === 'auth/user-not-found') {
                setError('Correo o contraseña incorrectos.');
            } else {
                setError('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
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