import { useState } from 'react';
import Autorizaciones from '../components/jefaturas/Autorizaciones';
import CalendarioExamenes from '../components/jefaturas/CalendarioExamenes';
import ExtraordinariosList from '../components/jefaturas/ExtraordinariosList';

export default function JefaturaPage() {
  const [vistaActiva, setVistaActiva] = useState('lista');

  const vistas = [
    { id: 'lista', label: 'Extraordinarios', componente: ExtraordinariosList },
    { id: 'autorizaciones', label: 'Autorizaciones', componente: Autorizaciones },
    { id: 'calendario', label: 'Calendario', componente: CalendarioExamenes },
  ];

  const ComponenteActivo = vistas.find(v => v.id === vistaActiva)?.componente;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Jefatura de Carrera
        </h1>
        <p className="text-gray-600">
          Gestión de exámenes extraordinarios
        </p>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          {vistas.map((vista) => (
            <button
              key={vista.id}
              onClick={() => setVistaActiva(vista.id)}
              className={`px-6 py-3 font-medium transition-colors ${
                vistaActiva === vista.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {vista.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {ComponenteActivo && <ComponenteActivo />}
      </div>
    </div>
  );
}