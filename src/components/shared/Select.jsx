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
  value,
  defaultValue = '',
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : null;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-white text-sm font-medium mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`
          w-full px-4 py-2 border rounded-lg
          bg-gray-700 text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-500'}
          ${disabled ? 'bg-gray-600 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Placeholder visible en gris claro */}
        <option value="" className="text-gray-400">
          {placeholder}
        </option>

        {options.map((option, index) => (
          <option key={index} value={option.value} className="text-white bg-gray-700">
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p
          id={errorId}
          className="text-red-400 text-sm mt-1 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
