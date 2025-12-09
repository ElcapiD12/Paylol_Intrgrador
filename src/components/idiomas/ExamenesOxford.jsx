// src/components/idiomas/ExamenesOxford.jsx
import { useState } from "react";
import { Card, Button, Select, Badge } from "../shared";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function ExamenesOxford() {
  // Opciones correctas para tu componente Select
  const niveles = [
    { value: "Básico", label: "Básico" },
    { value: "Intermedio", label: "Intermedio" },
    { value: "Avanzado", label: "Avanzado" },
  ];

  const [nivel, setNivel] = useState("");
  const [fecha, setFecha] = useState("");
  const [errorNivel, setErrorNivel] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [historial, setHistorial] = useState([]);
  const precioExamen = 580;

  const registrarExamenLocal = () => {
    if (!nivel) {
      setErrorNivel("Selecciona un nivel");
    } else {
      setErrorNivel("");
    }

    if (!fecha) {
      setErrorFecha("Selecciona una fecha");
    } else {
      setErrorFecha("");
    }

    if (nivel && fecha) {
      const nuevoExamen = {
        id: Date.now(),
        nivel,
        fecha,
        estado: "Pendiente",
        precio: precioExamen,
      };
      setHistorial([...historial, nuevoExamen]);
      setNivel("");
      setFecha("");
    }
  };

  const getColorNivel = (nivel) => {
    if (nivel === "Básico") return "yellow";
    if (nivel === "Intermedio") return "blue";
    if (nivel === "Avanzado") return "purple";
    return "gray";
  };

  const totalPrecio = historial.reduce((acc, ex) => acc + ex.precio, 0);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-8 py-20 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">
          Registrar Examen Oxford
        </h2>

        {/* Formulario */}
        <Card title="Formulario de registro" className="mb-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Nivel de examen"
                options={niveles}
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                required
                error={errorNivel}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha y hora</label>
              <input
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  errorFecha ? "border-red-500" : ""
                }`}
              />
              {errorFecha && <p className="text-red-600 text-sm mt-1">{errorFecha}</p>}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              text="Registrar Examen"
              onClick={registrarExamenLocal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
            />
          </div>

          {nivel && fecha && !errorNivel && !errorFecha && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
              📝 Estás por registrar el examen nivel 
              <strong> {nivel} </strong>
              para <strong>{formatDate(fecha)}</strong> por{" "}
              <strong>{formatCurrency(precioExamen)}</strong>
            </div>
          )}
        </Card>

        {/* ✅ Sección de pago condicional */}
        {historial.length > 0 && (
          <Card className="mt-10 p-6 shadow-lg bg-white">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Información de Pago</h3>
            <p className="text-sm text-gray-700 mb-2">Banco: <strong>BBVA Bancomer</strong></p>
            <p className="text-sm text-gray-700 mb-2">Titular: <strong>Instituto Educativo PAYLOL</strong></p>
            <p className="text-sm text-gray-700 mb-2">Cuenta: <strong>0123456789</strong></p>
            <p className="text-sm text-gray-700 mb-2">CLABE: <strong>012180001234567890</strong></p>
            <p className="text-sm text-gray-700 mb-2">Referencia: <strong>OXFORD-{historial[0].id}</strong></p>
            <p className="text-sm text-gray-700 mb-4">Monto a pagar: <strong>${precioExamen}.00</strong></p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sube tu comprobante de pago</label>
              <input
                type="file"
                accept=".jpg,.png,.pdf"
                className="border rounded px-3 py-2 w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Formatos permitidos: JPG, PNG o PDF (máx. 5MB)</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del pago</label>
              <input
                type="text"
                placeholder={`Ej. Examen Oxford nivel ${historial[0].nivel}`}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </Card>
        )}

        {/* Historial */}
        <h3 className="text-2xl font-semibold mb-6 text-blue-700 text-center mt-16">
          Historial de Exámenes
        </h3>

        <Card className="shadow-lg">
          {!Array.isArray(historial) || historial.length === 0 ? (
            <p className="text-gray-600 italic text-center">
              No hay exámenes registrados todavía.
            </p>
          ) : (
            <div className="space-y-4">
              {historial.map((ex) => (
                <div
                  key={ex.id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      Examen Oxford - Nivel {ex.nivel}
                    </p>
                    <Badge color={getColorNivel(ex.nivel)}>{ex.nivel}</Badge>
                    <Badge color="green">{ex.estado}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 text-lg">
                      {formatCurrency(ex.precio)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(ex.fecha)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalPrecio)}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
