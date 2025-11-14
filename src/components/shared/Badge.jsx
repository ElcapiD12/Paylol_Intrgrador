<<<<<<< HEAD
export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '' 
}) {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
=======
import React from "react";

export function Badge({ estado, icon, className = "" }) {
  const colors = {
    Pendiente: "bg-yellow-100 text-yellow-800",
    Pagado: "bg-green-100 text-green-800",
    Vencido: "bg-red-100 text-red-800",
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64
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
