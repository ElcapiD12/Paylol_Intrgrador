// src/components/idiomas/ExamenesOxford.jsx
import { useState, useEffect } from 'react';
import { Select, Button, Card, Badge } from '../shared';
import { MONTOS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

export default function ExamenesOxford() {
  // Cargar historial desde localStorage
  const [nivel, setNivel] = useState("");
  const [historial, setHistorial] = useState(() => {
    try {
      const saved = localStorage.getItem('historialExamenesOxford');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {




      
      console.error('Error cargando historial:', error);
      return [];
    }
  });

  // Guardar en localStorage cuando cambie el historial
  useEffect(() => {
    try {
      localStorage.setItem('historialExamenesOxford', JSON.stringify(historial));
    } catch (error) {
      console.error('Error guardando historial:', error);
    }
  }, [historial]);

  // Lista de niveles disponibles
  const niveles = [
    { label: "Selecciona un nivel", value: "" },
    { label: "A1 - Principiante", value: "A1" },
    { label: "A2 - Básico", value: "A2" },
    { label: "B1 - Intermedio", value: "B1" },
    { label: "B2 - Intermedio Alto", value: "B2" },
    { label: "C1 - Avanzado", value: "C1" },
    { label: "C2 - Experto", value: "C2" },
  ];

  // Obtener precio del examen desde constants
  const precioExamen = MONTOS.examen_oxford || 500;

  // Maneja el registro del examen
  const registrarExamen = () => {
    if (!nivel) {
      alert("⚠️ Por favor selecciona un nivel antes de registrar el examen");
      return;
    }

    const nuevoRegistro = {
      id: Date.now(),
      nivel,
      fecha: new Date().toISOString(),
      precio: precioExamen,
      estado: 'Registrado'
    };

    setHistorial([...historial, nuevoRegistro]);
    setNivel("");
    
    alert(`✅ Examen registrado exitosamente\n\nNivel: ${nivel}\nPrecio: ${formatCurrency(precioExamen)}`);
  };

  const getNivelColor = (nivel) => {
    const colores = {
      'A1': 'green',
      'A2': 'blue',
      'B1': 'yellow',
      'B2': 'orange',
      'C1': 'purple',
      'C2': 'red'
    };
    return colores[nivel] || 'gray';
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Registrar Examen Oxford</h2>

      {/* Información del examen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Información importante
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 ml-7">
          <li>• Costo del examen: <strong>{formatCurrency(precioExamen)}</strong></li>
          <li>• Los resultados se publican 48 horas después del examen</li>
          <li>• Debes presentarte 30 minutos antes del horario programado</li>
          <li>• Trae identificación oficial vigente</li>
        </ul>
      </div>

      {/* Formulario de registro */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Selecciona el nivel</h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Nivel de examen"
              options={niveles}
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="success" 
              onClick={registrarExamen}
              disabled={!nivel}
            >
              Registrar Examen
            </Button>
          </div>
        </div>

        {nivel && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">
              📝 Estás por registrar el examen nivel <strong>{nivel}</strong> por <strong>{formatCurrency(precioExamen)}</strong>
            </p>
          </div>
        )}
      </Card>

      {/* Historial de exámenes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Historial de Exámenes</h3>

        {historial.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">No hay exámenes registrados todavía.</p>
            <p className="text-sm text-gray-400 mt-2">Tus registros aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historial.map((examen) => (
              <div 
                key={examen.id}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      Examen Oxford - Nivel {examen.nivel}
                    </span>
                    <Badge color={getNivelColor(examen.nivel)}>
                      {examen.nivel}
                    </Badge>
                    <Badge color="green">
                      {examen.estado}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Certificación de inglés nivel {examen.nivel}
                  </p>
                </div>
                
                <div className="text-right ml-4">
                  <div className="font-bold text-lg text-blue-600">
                    {formatCurrency(examen.precio)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(examen.fecha).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Total de exámenes */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  Total:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    historial.reduce((sum, examen) => sum + examen.precio, 0)
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-500 text-right mt-1">
                {historial.length} {historial.length === 1 ? 'examen' : 'exámenes'} registrado{historial.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">
          📅 Próximos pasos
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>1. Realiza el pago del examen en caja o en línea</li>
          <li>2. Espera la confirmación por correo electrónico</li>
          <li>3. Recibirás la fecha y hora de tu examen</li>
          <li>4. Consulta tus resultados en la pestaña "Resultados"</li>
        </ul>
      </div>
    </div>
  );
}