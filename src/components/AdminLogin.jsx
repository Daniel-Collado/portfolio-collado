// src/components/AdminLogin.jsx

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; 
import './Admin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    
    useEffect(() => {
        const metaRobots = document.createElement('meta');
        metaRobots.name = "robots";
        metaRobots.content = "noindex, nofollow";
        document.head.appendChild(metaRobots);

        return () => {
            document.head.removeChild(metaRobots);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            
        } catch (authError) {
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