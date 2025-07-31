import React from 'react';
import './StarryBackground.css'; // Asegúrate de que esta ruta sea correcta

const StarryBackground = () => {
    const starCount = 120; // Cantidad de estrellas

    // Generación de estrellas
    const stars = Array.from({ length: starCount }, (_, index) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.floor(Math.random() * 2) + 1; // Pequeña, mediana, grande
        const delay = Math.random() * 5; // Retraso para el parpadeo
        const moveDuration = Math.random() * 20 + 10; // Duración para el movimiento suave
        const translateX = (Math.random() - 0.5) * 10; // Offset X para el movimiento
        const translateY = (Math.random() - 0.5) * 10; // Offset Y para el movimiento

        return (
            <div
                key={`star-${index}`}
                className={`star ${size === 1 ? 'small' : size === 2 ? 'medium' : 'large'}`}
                style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    animationDelay: `${delay}s`,
                    '--star-move-duration': `${moveDuration}s`,
                    '--star-translate-x': `${translateX}vw`,
                    '--star-translate-y': `${translateY}vh`,
                }}
            />
        );
    });

    return (
        <div className="stars-background">
            {stars}
        </div>
    );
};

// Usa React.memo para asegurar que este componente solo se re-renderice
// si sus propias props cambian. Como no tiene props, se renderizará solo una vez.
export default React.memo(StarryBackground);