// src/components/idiomas/AdminExamenesOxford.jsx
import { useState } from "react";
import { Card, Button, Badge } from "../shared";

export default function AdminExamenesOxford() {
  const [solicitudes, setSolicitudes] = useState([
    {
      id: "OXF001",
      nombre: "Ana López",
      email: "ana@example.com",
      nivel: "Básico",
      pago: true,
      fechaAsignada: "",
      confirmado: false,
    },
    {
      id: "OXF002",
      nombre: "Luis Martínez",
      email: "luis@example.com",
      nivel: "Intermedio",
      pago: false,
      fechaAsignada: "",
      confirmado: false,
    },
    {
      id: "OXF003",
      nombre: "María Torres",
      email: "maria@example.com",
      nivel: "Avanzado",
      pago: true,
      fechaAsignada: "",
      confirmado: false,
    },
  ]);

  const asignarFecha = (id, fecha) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, fechaAsignada: fecha } : s))
    );
  };

  const confirmarExamen = (id) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, confirmado: true } : s))
    );
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-8 py-20 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">
          Administración de Exámenes Oxford
        </h2>

        {/* Dashboard resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="p-4 text-center shadow-md">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-blue-700">{solicitudes.length}</p>
          </Card>
          <Card className="p-4 text-center shadow-md">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {solicitudes.filter((s) => !s.confirmado).length}
            </p>
          </Card>
          <Card className="p-4 text-center shadow-md">
            <p className="text-sm text-gray-600">Confirmados</p>
            <p className="text-2xl font-bold text-green-600">
              {solicitudes.filter((s) => s.confirmado).length}
            </p>
          </Card>
          <Card className="p-4 text-center shadow-md">
            <p className="text-sm text-gray-600">Pagos pendientes</p>
            <p className="text-2xl font-bold text-red-600">
              {solicitudes.filter((s) => !s.pago).length}
            </p>
          </Card>
        </div>

        {/* Lista de solicitudes */}
        <div className="space-y-6">
          {solicitudes.map((s) => (
            <Card key={s.id} className="p-6 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg text-gray-700">{s.nombre}</p>
                  <p className="text-sm text-gray-600">{s.email}</p>
                  <p className="text-sm text-gray-600">Nivel: {s.nivel}</p>
                  <Badge color={s.pago ? "green" : "red"}>
                    {s.pago ? "Pago confirmado" : "Pago pendiente"}
                  </Badge>
                </div>

                <div className="text-right">
                  <label className="block text-sm text-gray-600 mb-1">Fecha de examen</label>
                  <input
                    type="date"
                    value={s.fechaAsignada}
                    onChange={(e) => asignarFecha(s.id, e.target.value)}
                    className="border rounded px-3 py-1 mb-2"
                  />
                  <Button
                    text={s.confirmado ? "Confirmado" : "Confirmar"}
                    disabled={!s.pago || s.confirmado || !s.fechaAsignada}
                    onClick={() => confirmarExamen(s.id)}
                    className={`w-full ${
                      s.confirmado
                        ? "bg-gray-300 text-gray-600"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } font-semibold rounded-lg shadow-md transition`}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
