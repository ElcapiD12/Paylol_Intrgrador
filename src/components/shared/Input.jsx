import React from 'react';

export default function Input({
  label,
  labelClassName = "",
  error,
  helperText,
  icon,
  type = "text",
  required = false,
  disabled = false,
  readOnly = false,
  className = "",
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${inputId}-helper` : null;
  const errorId = error ? `${inputId}-error` : null;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-2 text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperId}
          className={`
            w-full px-4 py-2 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-purple-300
            transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-300 focus:ring-red-300" : "border-purple-200"}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="text-gray-500 text-sm mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}