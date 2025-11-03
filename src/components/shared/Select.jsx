export function Select({ 
  label, 
  error, 
  options = [],
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        className={`
          w-full px-4 py-2 border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">⚠️ {error}</p>
      )}
    </div>
  );
}
