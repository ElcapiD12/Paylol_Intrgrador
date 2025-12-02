import React from "react";

// Se corrige la exportación para usar 'export default' en lugar de 'export function'
export default function Badge({ estado, icon, className = "" }) {
  const colors = {
    Pendiente: "bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
    Pagado: "bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20",
    Vencido: "bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20",
    Aprobado: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20", // Añadido un estado común adicional
    Rechazado: "bg-pink-100 text-pink-800 ring-1 ring-inset ring-pink-600/20", // Añadido otro estado común
  };

  // Añadimos un pequeño borde (ring) para mejor visualización de Tailwind
  const style = colors[estado] || "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/10";

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${style} ${className}`}
      aria-label={`Estado: ${estado}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {estado}
    </span>
  );
}