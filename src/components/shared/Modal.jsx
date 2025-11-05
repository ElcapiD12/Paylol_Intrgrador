// src/components/shared/Modal.jsx
import React from 'react';
// Importamos Button para usarlo en el footer (Necesario si lo usas en el footer de App)
import Button from './Button.jsx'; 

const Modal = ({ isOpen, title, children, onClose, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                
                {/* Header */}
                <div className="flex justify-between items-start pb-3 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="mt-4 mb-4 text-gray-600">
                    {children}
                </div>

                {/* Footer (Acepta el prop 'footer' o usa un botón de confirmación básico) */}
                <div className="flex justify-end pt-3 border-t space-x-2">
                    {footer || (
                         <Button onClick={onClose} type="secondary">Cerrar</Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;