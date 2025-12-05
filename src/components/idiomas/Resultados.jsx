// src/components/idiomas/Resultados.jsx
import { useState } from 'react';
import { Card, Badge, EmptyState } from '../shared';

export default function Resultados() {
  const [resultados] = useState([
    {
      id: 1,
      examen: 'Oxford A2',
      fecha: '10/09/2024',
      calificacion: 92,
      estado: 'Aprobado',
      nivel: 'Básico',
    },
    {
      id: 2,
      examen: 'Oxford B2',
      fecha: '05/08/2024',
      calificacion: 78,
      estado: 'Aprobado',
      nivel: 'Intermedio Alto',
    },
  ]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Aprobado': return 'green';
      case 'Reprobado': return 'red';
      case 'Pendiente': return 'yellow';
      default: return 'gray';
    }
  };

  const getCalificacionColor = (calificacion) => {
    if (calificacion >= 80) return 'text-green-600';
    if (calificacion >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-8 py-20 text-gray-800">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">
          Resultados de Exámenes
        </h2>

        {resultados.length === 0 ? (
          <EmptyState
            title="No hay resultados disponibles"
            description="Tus resultados aparecerán aquí una vez que completes un examen"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resultados.map((resultado) => (
              <Card key={resultado.id} className="p-6 shadow-lg hover:shadow-xl transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">{resultado.examen}</h3>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Nivel:</span> {resultado.nivel}</p>
                    <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Fecha:</span> {resultado.fecha}</p>
                    <Badge color={getEstadoColor(resultado.estado)}>{resultado.estado}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Calificación</p>
                    <p className={`text-4xl font-bold ${getCalificacionColor(resultado.calificacion)}`}>
                      {resultado.calificacion}
                    </p>
                    <p className="text-sm text-gray-500">/ 100</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        resultado.calificacion >= 80
                          ? 'bg-green-500'
                          : resultado.calificacion >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${resultado.calificacion}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
