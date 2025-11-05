// src/components/shared/Card.jsx
import React from 'react';

const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-white p-6 shadow-md rounded-lg ${className}`}>
            {title && (
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;