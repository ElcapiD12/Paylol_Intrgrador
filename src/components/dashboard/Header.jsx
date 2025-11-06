import React from "react";

export default function Header() {
  return (
    <header className="bg-white shadow-md flex justify-between items-center px-8 py-4">
      <h1 className="text-xl font-semibold text-gray-700">Panel de Control</h1>
      <div className="flex items-center gap-3">
        <img
          src="https://ui-avatars.com/api/?name=Andres&background=2563eb&color=fff"
          alt="Usuario"
          className="w-10 h-10 rounded-full border-2 border-blue-500"
        />
        <span className="text-gray-700 font-medium">Bienvenido, Andrés</span>
      </div>
    </header>
  );
}