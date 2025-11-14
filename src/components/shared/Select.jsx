<<<<<<< HEAD
import React from "react";

export default function Select({
  label,
  error,
  options = [],
  value,
  onChange,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-2">
=======
export function Select({
  label,
  error,
  options = [],
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  id,
  placeholder = 'Seleccione una opción',
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : null;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={selectId} className="block text-gray-700 text-sm font-medium mb-2">
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
<<<<<<< HEAD
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-2 border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-200
          ${error ? "border-red-500" : "border-gray-300"}
=======
        id={selectId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`
          w-full px-4 py-2 border rounded-lg bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64
          ${className}
        `}
        {...props}
      >
<<<<<<< HEAD
=======
        <option value="" disabled hidden>{placeholder}</option>
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

<<<<<<< HEAD
      {error && <p className="text-red-500 text-sm mt-1">⚠️ {error}</p>}
=======
      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64
    </div>
  );
}
