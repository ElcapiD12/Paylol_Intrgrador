// src/components/shared/Alert.jsx

import React from 'react';

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
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
      icon: "✅",
    },
    danger: {
      bg: "bg-rose-50 border-rose-200",
      text: "text-rose-800",
      icon: "❌",
    },
    warning: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      icon: "⚠️",
    },
    info: {
      bg: "bg-sky-50 border-sky-200",
      text: "text-sky-800",
      icon: "ℹ️",
    },
  };

  const normalizedType = type === 'error' ? 'danger' : type;
  const style = types[normalizedType] || types['info'];

  return (
    <div
      className={`${style.bg} border-l-4 p-4 rounded-xl shadow-sm ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className={`text-2xl ${style.text}`} aria-hidden="true">
            {icon || style.icon}
          </span>
          <div>
            {title && <h4 className={`font-semibold ${style.text} mb-1`}>{title}</h4>}
            <p className={`${style.text} text-sm`}>{message}</p>
            {action && <div className="mt-3">{action}</div>}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 text-xl font-bold ml-4 transition-opacity`}
            aria-label="Cerrar alerta"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}