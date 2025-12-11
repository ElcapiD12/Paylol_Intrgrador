// src/components/admin/PagosAdmin.jsx
import React, { useState, useEffect } from 'react';
import { crearPago } from '../../services/pagosService';

function PagosAdmin() {
  // Configuración de precios
  const [config, setConfig] = useState({
    mensualidad: 5000,
    inscripcion: 1200
  });
  
  // Lista de alumnos (simulada - en producción vendría de Firebase)
  const [alumnos] = useState([
    { id: "user123", nombre: "Juan Pérez", matricula: "A123", email: "juan@universidad.edu" },
    { id: "user124", nombre: "María García", matricula: "A124", email: "maria@universidad.edu" },
    { id: "user125", nombre: "Carlos López", matricula: "A125", email: "carlos@universidad.edu" },
    { id: "user126", nombre: "Ana Martínez", matricula: "A126", email: "ana@universidad.edu" }
  ]);
  
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const [pagosAsignados, setPagosAsignados] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pagoAConfirmar, setPagoAConfirmar] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // Asignar pago a alumnos seleccionados
  const asignarPago = (concepto) => {
    if (alumnosSeleccionados.length === 0) {
      alert("⚠️ Por favor, selecciona al menos un alumno.");
      return;
    }

    const nuevoPago = {
      concepto,
      monto: concepto === "Mensualidad" ? config.mensualidad : config.inscripcion,
      fecha: new Date().toLocaleDateString('es-MX')
    };

    setPagoAConfirmar(nuevoPago);
    setMostrarConfirmacion(true);
  };

  const confirmarAsignacion = async () => {
    setProcesando(true);
    
    try {
      // Calcular fecha de vencimiento (30 días después)
      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
      
      // Crear pagos en Firestore para cada alumno seleccionado
      const promesas = alumnosSeleccionados.map(async (alumnoId) => {
        const alumno = alumnos.find(a => a.id === alumnoId);
        
        const pagoData = {
          userId: alumnoId,
          alumnoNombre: alumno.nombre,
          alumnoMatricula: alumno.matricula,
          concepto: pagoAConfirmar.concepto,
          tipo: pagoAConfirmar.concepto === "Mensualidad" ? "colegiatura" : "inscripcion",
          monto: pagoAConfirmar.monto,
          fechaAsignacion: new Date().toISOString(),
          fechaVencimiento: fechaVencimiento.toISOString(),
          estado: "pendiente"
        };
        
        return await crearPago(pagoData);
      });
      
      // Esperar a que todos los pagos se creen
      const resultados = await Promise.all(promesas);
      
      // Verificar si todos fueron exitosos
      const exitosos = resultados.filter(r => r.success).length;
      
      if (exitosos === alumnosSeleccionados.length) {
        alert(`✅ ${pagoAConfirmar.concepto} asignada exitosamente a ${exitosos} alumno(s)\n\nTotal: $${pagoAConfirmar.monto * exitosos} MXN\n\nLos pagos ya están disponibles en la cuenta de cada alumno.`);
        
        // Agregar a la lista local para visualización
        const nuevosPagos = alumnosSeleccionados.map(alumnoId => {
          const alumno = alumnos.find(a => a.id === alumnoId);
          return {
            id: Date.now() + Math.random(),
            alumnoId,
            alumnoNombre: alumno.nombre,
            alumnoMatricula: alumno.matricula,
            concepto: pagoAConfirmar.concepto,
            monto: pagoAConfirmar.monto,
            fechaAsignacion: new Date().toLocaleDateString('es-MX'),
            fechaVencimiento: fechaVencimiento.toLocaleDateString('es-MX'),
            estado: "pendiente"
          };
        });
        
        setPagosAsignados([...pagosAsignados, ...nuevosPagos]);
        setAlumnosSeleccionados([]);
      } else {
        alert(`⚠️ Solo ${exitosos} de ${alumnosSeleccionados.length} pagos se asignaron correctamente. Por favor, intenta de nuevo.`);
      }
      
    } catch (error) {
      console.error('Error al asignar pagos:', error);
      alert('❌ Error al asignar pagos. Por favor, intenta de nuevo.');
    } finally {
      setProcesando(false);
      setMostrarConfirmacion(false);
      setPagoAConfirmar(null);
    }
  };

  // Marcar pago como pagado (solo actualización local para visualización)
  const marcarComoPagado = (pagoId) => {
    setPagosAsignados(pagosAsignados.map(pago => 
      pago.id === pagoId ? { ...pago, estado: "pagado", fechaPago: new Date().toLocaleDateString('es-MX') } : pago
    ));
  };

  // Eliminar pago asignado (solo de visualización local)
  const eliminarPago = (pagoId) => {
    if (window.confirm("¿Estás seguro de eliminar este pago asignado de la vista?")) {
      setPagosAsignados(pagosAsignados.filter(pago => pago.id !== pagoId));
    }
  };

  // Seleccionar/deseleccionar todos
  const toggleTodosAlumnos = () => {
    if (alumnosSeleccionados.length === alumnos.length) {
      setAlumnosSeleccionados([]);
    } else {
      setAlumnosSeleccionados(alumnos.map(alumno => alumno.id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🏢</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona precios y asigna pagos a alumnos</p>
        </div>
      </div>

      {/* Panel de Configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Configurar Precios */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">⚙️</span> Configurar Precios
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Mensualidad (colegiatura)</label>
              <div className="flex items-center">
                <span className="bg-gray-100 p-3 rounded-l-lg border border-r-0">$</span>
                <input
                  type="number"
                  value={config.mensualidad}
                  onChange={(e) => setConfig({...config, mensualidad: Number(e.target.value)})}
                  className="flex-1 p-3 border rounded-r-lg"
                  min="0"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Precio mensual de colegiatura</p>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Inscripción por semestre</label>
              <div className="flex items-center">
                <span className="bg-gray-100 p-3 rounded-l-lg border border-r-0">$</span>
                <input
                  type="number"
                  value={config.inscripcion}
                  onChange={(e) => setConfig({...config, inscripcion: Number(e.target.value)})}
                  className="flex-1 p-3 border rounded-r-lg"
                  min="0"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Precio de inscripción por semestre</p>
            </div>
            
            <button 
              onClick={() => alert(`💾 Precios guardados:\n\n• Mensualidad: $${config.mensualidad} MXN\n• Inscripción: $${config.inscripcion} MXN`)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            >
              <span>💾</span> Guardar Precios
            </button>
          </div>
        </div>

        {/* Asignar Pagos */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">👥</span> Asignar Pagos a Alumnos
          </h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-gray-700 font-medium">Seleccionar Alumnos:</label>
              <button
                onClick={toggleTodosAlumnos}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {alumnosSeleccionados.length === alumnos.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto border rounded-lg p-3">
              {alumnos.map(alumno => (
                <div key={alumno.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    id={`alumno-${alumno.id}`}
                    checked={alumnosSeleccionados.includes(alumno.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAlumnosSeleccionados([...alumnosSeleccionados, alumno.id]);
                      } else {
                        setAlumnosSeleccionados(alumnosSeleccionados.filter(id => id !== alumno.id));
                      }
                    }}
                    className="mr-3 h-5 w-5"
                  />
                  <label htmlFor={`alumno-${alumno.id}`} className="cursor-pointer flex-1">
                    <div className="font-medium">{alumno.nombre}</div>
                    <div className="text-sm text-gray-500">{alumno.matricula} • {alumno.email}</div>
                  </label>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              {alumnosSeleccionados.length} de {alumnos.length} alumnos seleccionados
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => asignarPago("Mensualidad")}
              disabled={alumnosSeleccionados.length === 0 || procesando}
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              <span>📅</span> Asignar Mensualidad
            </button>
            
            <button
              onClick={() => asignarPago("Inscripción")}
              disabled={alumnosSeleccionados.length === 0 || procesando}
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              <span>📝</span> Asignar Inscripción
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Pagos Asignados */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-2">📋</span> Pagos Asignados (Vista Local)
          </h2>
          <div className="text-sm text-gray-500">
            Total: {pagosAsignados.length} pagos en vista
          </div>
        </div>
        
        {pagosAsignados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay pagos en la vista</h3>
            <p className="text-gray-500">Los pagos asignados se mostrarán aquí y estarán disponibles en las cuentas de los alumnos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Alumno</th>
                  <th className="p-4 text-left">Concepto</th>
                  <th className="p-4 text-left">Monto</th>
                  <th className="p-4 text-left">Asignado</th>
                  <th className="p-4 text-left">Vence</th>
                  <th className="p-4 text-left">Estado</th>
                  <th className="p-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagosAsignados.map(pago => (
                  <tr key={pago.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{pago.alumnoNombre}</div>
                      <div className="text-sm text-gray-500">{pago.alumnoMatricula}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{pago.concepto}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-xl font-bold text-blue-700">${pago.monto}</div>
                    </td>
                    <td className="p-4 text-gray-600">{pago.fechaAsignacion}</td>
                    <td className="p-4">
                      <span className={pago.estado === "vencido" ? "text-red-600 font-medium" : "text-gray-600"}>
                        {pago.fechaVencimiento}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        pago.estado === "pagado" 
                          ? "bg-green-100 text-green-800" 
                          : pago.estado === "vencido"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {pago.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {pago.estado === "pendiente" && (
                          <button
                            onClick={() => marcarComoPagado(pago.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                          >
                            Marcar como pagado
                          </button>
                        )}
                        <button
                          onClick={() => eliminarPago(pago.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                        >
                          Quitar de vista
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      {mostrarConfirmacion && pagoAConfirmar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">✅ Confirmar Asignación</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-medium">Vas a asignar:</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {pagoAConfirmar.concepto} - ${pagoAConfirmar.monto}
                </p>
                <p className="text-gray-600 mt-2">
                  A {alumnosSeleccionados.length} alumno(s) seleccionado(s)
                </p>
                <p className="font-bold text-lg mt-2">
                  Total: ${pagoAConfirmar.monto * alumnosSeleccionados.length} MXN
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Los pagos estarán disponibles inmediatamente en las cuentas de los alumnos
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarConfirmacion(false)}
                  disabled={procesando}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAsignacion}
                  disabled={procesando}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {procesando ? '⏳ Procesando...' : 'Confirmar Asignación'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PagosAdmin;