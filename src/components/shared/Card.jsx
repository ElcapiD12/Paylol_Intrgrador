// src/components/shared/Card.jsx

import React from 'react';

export default function Card({ title, children, className = "" }) {
    return (
        <div className={`
            bg-white p-6 rounded-2xl 
            shadow-md hover:shadow-lg 
            border border-purple-100
            transition-all duration-300
            ${className}
        `}>
            {title && (
                <div className="mb-4 pb-3 border-b-2 border-purple-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-6 bg-gradient-to-b from-purple-300 to-pink-300 rounded-full"></span>
                        {title}
                    </h2>
                </div>
            )}
            {children}
        </div>
    );
}