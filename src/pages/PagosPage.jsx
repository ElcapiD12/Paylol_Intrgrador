import React from "react";
import { FaCreditCard } from "react-icons/fa";

export default function PagosPage() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <FaCreditCard className="text-blue-600 text-3xl" />
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h1>
      </div>
      <p className="text-gray-600">
        Aquí puedes ver tus pagos realizados y pendientes. Próximamente podrás registrar nuevos pagos desde este módulo.
      </p>
    </div>
  );
}