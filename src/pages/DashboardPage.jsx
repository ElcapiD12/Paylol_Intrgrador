import React from "react";
import { FaMoneyBill, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Resumen general</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaMoneyBill className="text-green-500 text-3xl" />
            <div>
              <h2 className="text-gray-700 font-semibold">Total Adeudado</h2>
              <p className="text-2xl font-bold text-gray-800">$5,000.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaClock className="text-blue-500 text-3xl" />
            <div>
              <h2 className="text-gray-700 font-semibold">Último Pago</h2>
              <p className="text-2xl font-bold text-gray-800">$1,500.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-orange-500 text-3xl" />
            <div>
              <h2 className="text-gray-700 font-semibold">Próximo Vencimiento</h2>
              <p className="text-lg font-bold text-gray-800">15 Nov 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


