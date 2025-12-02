// src/components/shared/EmptyState.jsx

import React from 'react';

/**
 * Componente para mostrar un estado vacío (sin datos).
 * @param {string} message - Mensaje a mostrar.
 */
const EmptyState = ({ message = "No se encontraron datos." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg text-center border border-dashed border-gray-300">
            <span className="text-4xl mb-4 text-gray-400">📄</span>
            <p className="text-lg font-medium text-gray-700">{message}</p>
        </div>
    );
};

export default EmptyState;