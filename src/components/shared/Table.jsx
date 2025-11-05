// src/components/shared/Badge.jsx
import React from 'react';

const getBadgeClasses = (type) => {
    switch (type) {
        case 'success':
            return 'bg-green-100 text-green-800';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800';
        case 'info':
            return 'bg-blue-100 text-blue-800';
        case 'danger':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const Badge = ({ children, type = 'default' }) => {
    const classes = getBadgeClasses(type);
    return (
        <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}
        >
            {children}
        </span>
    );
};

export default Badge;