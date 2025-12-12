import React, { useState } from 'react';
import { Card } from '../components/shared';
import SolicitudConstanciaDemo from '../components/servicios-escolares/SolicitudConstanciaDemo';  // ← SIN llaves
import AprobacionAdmin from '../components/servicios-escolares/AprobacionAdmin';  // ← SIN llaves
import { useAuth } from '../context/AuthContext';

export default function ServiciosPage() {
  const [vistaActual, setVistaActual] = useState('estudiante');
  const { user } = useAuth();

  // Determinar si el usuario es admin
  const isAdmin = true; // Para pruebas - siempre muestra Vista Admin
  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Servicios Escolares</h1>
      <p className="text-gray-600 mb-6">
        Gestión de constancias y documentos académicos
      </p>

      {/* Módulo de control */}
      <Card className="mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Módulo: Servicios Escolares
          </h2>

          {/* Botones de navegación */}
          <div className="flex gap-3">
            <button
              onClick={() => setVistaActual('estudiante')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                vistaActual === 'estudiante'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vista Estudiante
            </button>

            {isAdmin && (
              <button
                onClick={() => setVistaActual('admin')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  vistaActual === 'admin'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vista Admin
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Contenido según la vista seleccionada */}
      <div>
        {vistaActual === 'estudiante' ? (
          <SolicitudConstanciaDemo />
        ) : (
          <AprobacionAdmin />
        )}
      </div>
    </div>
  );
}
