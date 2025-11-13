import React from "react";

export function Badge({ estado, icon, className = "" }) {
  const colors = {
    Pendiente: "bg-yellow-100 text-yellow-800",
    Pagado: "bg-green-100 text-green-800",
    Vencido: "bg-red-100 text-red-800",
  };

  const style = colors[estado] || "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full ${style} ${className}`}
      aria-label={`Estado: ${estado}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {estado}
    </span>
  );
}
