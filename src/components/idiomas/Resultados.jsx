// src/components/idiomas/Resultados.jsx
import { useState } from 'react';
import { Card, Badge, EmptyState } from '../shared';

export default function Resultados() {
  // Por ahora, datos mock. Después se conectará con Firebase
  const [resultados] = useState([
    {
      id: 1,
      examen: 'Oxford B1',
      fecha: '15/10/2024',
      calificacion: 85,
      estado: 'Aprobado',
      nivel: 'Intermedio',
    },
    {
      id: 2,
      examen: 'Oxford A2',
      fecha: '10/09/2024',
      calificacion: 92,
      estado: 'Aprobado',
      nivel: 'Básico',
    },
    {
      id: 3,
      examen: 'Oxford B2',
      fecha: '05/08/2024',
      calificacion: 78,
      estado: 'Aprobado',
      nivel: 'Intermedio Alto',
    },
  ]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'green';
      case 'Reprobado':
        return 'red';
      case 'Pendiente':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getCalificacionColor = (calificacion) => {
    if (calificacion >= 80) return 'text-green-600';
    if (calificacion >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          Resultados de Exámenes
        </h2>
        <p className="text-gray-600">
          Consulta tus calificaciones y certificaciones de inglés
        </p>
      </div>

      {resultados.length === 0 ? (
        <EmptyState
          title="No hay resultados disponibles"
          description="Tus resultados aparecerán aquí una vez que completes un examen"
        />
      ) : (
        <div className="space-y-4">
          {resultados.map((resultado) => (
            <Card key={resultado.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {resultado.examen}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Nivel:</span> {resultado.nivel}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Fecha:</span> {resultado.fecha}
                  </p>
                  <Badge color={getEstadoColor(resultado.estado)}>
                    {resultado.estado}
                  </Badge>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Calificación</p>
                  <p
                    className={`text-4xl font-bold ${getCalificacionColor(
                      resultado.calificacion
                    )}`}
                  >
                    {resultado.calificacion}
                  </p>
                  <p className="text-sm text-gray-500">/ 100</p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{resultado.calificacion}%</span>
                </div>
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

      {/* Estadísticas generales */}
      {resultados.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Exámenes realizados</p>
              <p className="text-3xl font-bold text-blue-600">{resultados.length}</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Promedio general</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(
                  resultados.reduce((sum, r) => sum + r.calificacion, 0) /
                    resultados.length
                )}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Aprobados</p>
              <p className="text-3xl font-bold text-green-600">
                {resultados.filter((r) => r.estado === 'Aprobado').length}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Nota informativa */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          Información importante
        </h4>
        <ul className="text-sm text-blue-700 space-y-1 ml-7">
          <li>• Los resultados oficiales se publican 48 horas después de completar el examen</li>
          <li>• Recibirás una notificación por correo electrónico cuando estén disponibles</li>
          <li>• Puedes descargar tu certificado una vez que el resultado sea oficial</li>
          <li>• Para cualquier aclaración, contacta al departamento de idiomas</li>
        </ul>
      </div>
    </div>
  );
}