import React from 'react';

// Se corrige la exportación para usar 'export default' en lugar de 'export function'
export default function Alert({
  type = "info",
  title,
  message,
  onClose,
  className = "",
  icon,
  action,
}) {
  const types = {
    success: {
      bg: "bg-green-50 border-green-500",
      text: "text-green-800",
      icon: "✓",
    },
    danger: { // Renombrado de 'error' a 'danger' para consistencia en Tailwind/Bootstrap
      bg: "bg-red-50 border-red-500",
      text: "text-red-800",
      icon: "✕",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-500",
      text: "text-yellow-800",
      icon: "⚠",
    },
    info: {
      bg: "bg-blue-50 border-blue-500",
      text: "text-blue-800",
      icon: "ℹ",
    },
  };

  // Usamos 'danger' en lugar de 'error' si el tipo es 'error'
  const normalizedType = type === 'error' ? 'danger' : type;
  const style = types[normalizedType] || types['info']; // Fallback a info si el tipo no existe

  return (
    <div
      className={`${style.bg} border-l-4 p-4 rounded shadow-sm ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className={`text-xl ${style.text}`} aria-hidden="true">
            {icon || style.icon}
          </span>
          <div>
            {title && <h4 className={`font-semibold ${style.text}`}>{title}</h4>}
            <p className={`${style.text} text-sm`}>{message}</p>
            {action && <div className="mt-2">{action}</div>}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 text-lg font-bold ml-4`}
            aria-label="Cerrar alerta"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}