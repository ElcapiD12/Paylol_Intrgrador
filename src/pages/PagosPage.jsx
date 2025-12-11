import React from "react";
import { FaCreditCard } from "react-icons/fa";
import PagosList from "../components/pagos/PagosList";

export default function PagosPage() {
  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <FaCreditCard className="text-blue-600 text-3xl" />
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h1>
      </div>
      <p className="text-gray-600 mb-8">
        Gestiona tus pagos universitarios de manera fácil y segura
      </p>
      
      {/* Componente de pagos */}
      <PagosList />
    </div>
  );
}