import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Sesión cerrada con éxito");
    navigate("/");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Cerrar Sesión</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Confirmar Cierre de Sesión
      </button>
    </div>
  );
}
