import React from 'react';
import './StarryBackground.css';

const StarryBackground = () => {
    const starCount = 150; // Aumentado para un fondo más denso y dinámico
    const cometCount = 4; // Aumentado a 5 cometas

    // Definir las posibles animaciones de cometas
    const cometAnimations = [
        'comet-diag-lr-up',
        'comet-diag-rl-down',
        'comet-diag-tl-br',
        'comet-diag-bl-tr',
        'comet-horiz-lr',
        'comet-horiz-rl',
        'comet-horiz-lr-mid', // Nueva animación
        'comet-horiz-rl-top' // Nueva animación
    ];

    const stars = Array.from({ length: starCount }, (_, index) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.floor(Math.random() * 3) + 1;
        const delay = Math.random() * 5;
        const moveDuration = Math.random() * 20 + 10; // Duración de movimiento entre 10 y 30 segundos
        const translateX = (Math.random() - 0.5) * 10; // Movimiento horizontal sutil (-5vw a 5vw)
        const translateY = (Math.random() - 0.5) * 10; // Movimiento vertical sutil (-5vh a 5vh)

        return (
            <div
                key={`star-${index}`}
                className={`star ${size === 1 ? 'small' : size === 2 ? 'medium' : 'large'}`}
                style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    animationDelay: `${delay}s`,
                    // Pasar variables CSS para la duración y el desplazamiento del movimiento
                    '--star-move-duration': `${moveDuration}s`,
                    '--star-translate-x': `${translateX}vw`,
                    '--star-translate-y': `${translateY}vh`,
                }}
            />
        );
    });

    const comets = Array.from({ length: cometCount }, (_, index) => {
        const animationName = cometAnimations[Math.floor(Math.random() * cometAnimations.length)];
        const delay = Math.random() * 15; // Retraso de inicio de la animación
        const duration = 10 + Math.random() * 10; // Duración de la animación del cometa (10-20s, más lento)

        // Para cometas horizontales, definimos una posición Y de inicio y fin aleatoria
        const startY = Math.random() * 100;
        const endY = startY + (Math.random() - 0.5) * 20; // Ligera desviación vertical

        return (
            <div
                key={`comet-${index}`}
                className="comet"
                style={{
                    animation: `${animationName} ${duration}s linear ${delay}s infinite`,
                    // Pasar variables CSS para la posición Y de cometas horizontales
                    '--comet-start-y': `${startY}vh`,
                    '--comet-end-y': `${endY}vh`,
                }}
            />
        );
    });

    return <div className="stars-background">{[...stars, ...comets]}</div>;
};

// Envuelve el componente con React.memo para evitar re-renderizaciones innecesarias
export default React.memo(StarryBackground);
