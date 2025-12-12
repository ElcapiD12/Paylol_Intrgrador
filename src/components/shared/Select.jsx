// src/components/shared/Select.jsx
function Select({ 
  label, 
  value, 
  options = [], 
  onChange, 
  error, 
  name,
  required = false,
  disabled = false,  // ✅ Cambiado de isDisabled a disabled
  className = "",
  ...props 
}) {
  
  // 🔍 DEBUG (puedes quitarlo después)
  console.log("🎯 Select render:", {
    name,
    value,
    valueType: typeof value,
    optionsCount: options.length
  });

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    console.log("📝 Select onChange:", {
      name,
      selectedValue,
      selectedValueType: typeof selectedValue
    });
    
    // Buscar el objeto completo de la opción seleccionada
    const selectedOption = options.find(opt => opt.value === selectedValue);
    
    console.log("🔍 Opción encontrada:", selectedOption);
    
    // Llamar al onChange con el objeto completo {value, label}
    if (onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        name={name}
        value={typeof value === 'object' ? value?.value : value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border rounded-lg bg-white
          focus:outline-none focus:ring-2 focus:ring-purple-300
          transition-all duration-200
          ${error ? 'border-red-300 focus:ring-red-300' : 'border-purple-200'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export default Select;