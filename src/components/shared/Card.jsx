export function Card({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'normal',
  ...props 
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${paddings[padding]} ${className}`}
      {...props}
    >
      {title && (
        <div className="mb-4 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}