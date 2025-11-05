import React from "react";

export function Badge({ estado }) {
  const colors = {
    Pendiente: "bg-yellow-100 text-yellow-800",
    Pagado: "bg-green-100 text-green-800",
    Vencido: "bg-red-100 text-red-800",
  };

  return (
    <span className={`text-sm px-3 py-1 rounded-full ${colors[estado]}`}>
      {estado}
    </span>
  );
}
