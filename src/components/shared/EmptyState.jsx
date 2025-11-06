import React from "react";

export function EmptyState({ message }) {
  return (
    <div className="text-center text-gray-500 p-10 border-2 border-dashed rounded-lg">
      <p>{message || "No hay datos para mostrar"}</p>
    </div>
  );
}
