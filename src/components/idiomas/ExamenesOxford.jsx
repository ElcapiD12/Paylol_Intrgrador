// src/components/idiomas/ExamenesOxford.jsx
import React from "react";
import { Card, Button, Badge, Select } from "../shared";
import { formatCurrency, formatDate } from "../../utils/helpers";

function ExamenesOxford({
  niveles,
  nivel,
  setNivel,
  fecha,
  setFecha,
  errorNivel,
  errorFecha,
  registrarExamenLocal,
  historial,
  getColorNivel,
  totalPrecio,
  precioExamen
}) {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-8 py-20 text-gray-800">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">
          Registrar Examen Oxford
        </h2>

        <Card title="Formulario de registro" className="mb-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Nivel de examen"
                options={niveles}
                value={nivel}
                onChange={e => setNivel(e.target.value)}
                required
              />
              {errorNivel && <p className="text-red-600 text-sm mt-1">{errorNivel}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha y hora</label>
              <input
                type="datetime-local"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
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

        <h3 className="text-2xl font-semibold mb-6 text-blue-700 text-center">
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

export default ExamenesOxford;
