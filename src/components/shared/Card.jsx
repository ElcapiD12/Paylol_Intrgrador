// src/components/shared/Card.jsx

import React from 'react';

/**
 * Componente Tarjeta genérico.
 * @param {string} title - Título de la tarjeta.
 * @param {React.ReactNode} children - Contenido interno de la tarjeta.
 */
const Card = ({ title, children }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            {title && (
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
};

export default Card;