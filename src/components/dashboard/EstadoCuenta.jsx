import React from "react";

export default function EstadoCuenta() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500">Total Adeudos</h3>
        <p className="text-2xl font-bold text-red-600">$5,000.00</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500">Último Pago</h3>
        <p className="text-2xl font-bold text-green-600">$1,500.00</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500">Próximo Vencimiento</h3>
        <p className="text-2xl font-bold text-yellow-600">15 Nov 2025</p>
      </div>
    </div>
  );
}

