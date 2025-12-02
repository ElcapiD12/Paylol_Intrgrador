// src/components/shared/Modal.jsx

import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Componente Modal.
 * @param {boolean} isOpen - Controla si el modal está abierto.
 * @param {string} title - Título del modal.
 * @param {function} onClose - Función a llamar al cerrar el modal.
 * @param {React.ReactNode} children - Contenido interno del modal.
 */
const Modal = ({ isOpen, title, onClose, children }) => {
    if (!isOpen) return null;

    // Asegúrate de que el modal se renderice fuera del componente principal (en el body)
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto"
                onClick={(e) => e.stopPropagation()} // Evita que el clic dentro cierre el modal
            >
                <div className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        &times;
                    </button>
                </div>
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>,
        document.body // Esto es crucial para usar ReactDOM.createPortal
    );
};

export default Modal;