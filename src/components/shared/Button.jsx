// src/components/shared/Button.jsx

import React from "react";

export default function Button({
  children,
  text,
  onClick,
  type = "primary",
  disabled = false,
  className = "",
}) {
  const types = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    info: "bg-cyan-500 hover:bg-cyan-600 text-white",
  };

  const style = types[type] || types.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${style}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children || text}
    </button>
  );
}