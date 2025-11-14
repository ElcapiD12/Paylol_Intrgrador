import { useState } from 'react';
import SolicitudConstancia from './SolicitudConstancia';
import ListaSolicitudes from './ListaSolicitudes';
import AprobacionAdmin from './AprobacionAdmin';
import { solicitudesEjemplo } from '../../data/mockData';

const ServiciosEscolaresDemo = () => {
  // Estado para almacenar solicitudes (inicia con datos de ejemplo)
  const [solicitudes, setSolicitudes] = useState(solicitudesEjemplo || []);
  
  // Estado para cambiar entre vista estudiante y admin
  const [vistaActual, setVistaActual] = useState('estudiante'); // 'estudiante' o 'admin'

  // Función para agregar nueva solicitud
  const handleNuevaSolicitud = (solicitud) => {
    setSolicitudes([solicitud, ...solicitudes]);
  };

  // Función para cambiar estado de solicitud (admin)
  const handleCambiarEstado = (id, nuevoEstado, motivo = null) => {
    setSolicitudes(solicitudes.map(s => 
      s.id === id 
        ? { ...s, estado: nuevoEstado, motivoRechazo: motivo }
        : s
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Selector de Vista (solo para demo) */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Módulo: Servicios Escolares</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setVistaActual('estudiante')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                vistaActual === 'estudiante'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vista Estudiante
            </button>
            <button
              onClick={() => setVistaActual('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                vistaActual === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vista Admin
            </button>
          </div>
        </div>
      </div>

      {/* Vista Estudiante */}
      {vistaActual === 'estudiante' && (
        <div className="space-y-6">
          <SolicitudConstancia onSolicitudCreada={handleNuevaSolicitud} />
          <ListaSolicitudes solicitudes={solicitudes} />
        </div>
      )}

      {/* Vista Admin */}
      {vistaActual === 'admin' && (
        <AprobacionAdmin 
          solicitudes={solicitudes}
          onCambiarEstado={handleCambiarEstado}
        />
      )}
    </div>
  );
};

export default ServiciosEscolaresDemo;