// src/components/shared/Loader.jsx

import React from 'react';

/**
 * Componente Loader simple.
 */
const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Cargando datos, por favor espere...</p>
        </div>
    );
};

export default Loader;