import React from "react";

export function EmptyState({ message = "No hay datos para mostrar", icon, action }) {
  return (
    <div className="text-center text-gray-500 p-10 border-2 border-dashed rounded-lg" role="status">
      {icon && <div className="mb-4 text-4xl text-blue-400" aria-hidden="true">{icon}</div>}
      <p className="mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
