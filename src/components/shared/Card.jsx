import React from "react";

export function Card({ title, children }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-3 text-gray-700">{title}</h3>
      {children}
    </div>
  );
}
