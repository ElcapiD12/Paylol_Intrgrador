// src/components/shared/Button.jsx
import React from 'react';

const getButtonClasses = (type) => {
    switch (type) {
        case 'primary':
            return 'bg-blue-600 hover:bg-blue-700 text-white';
        case 'success':
            return 'bg-green-600 hover:bg-green-700 text-white';
        case 'danger':
            return 'bg-red-600 hover:bg-red-700 text-white';
        case 'secondary':
            return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
        default:
            return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
};

const Button = ({ children, onClick, disabled = false, type = 'primary', className = '' }) => {
    const classes = getButtonClasses(type);
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-md transition duration-150 ease-in-out font-medium 
                        ${classes} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;