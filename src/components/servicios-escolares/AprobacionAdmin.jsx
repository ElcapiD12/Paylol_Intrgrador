import { useState, useEffect } from 'react';
import { Card, Badge, Button, EmptyState } from '../shared';
import { formatCurrency, formatDate, getEstadoSolicitudColor } from '../../utils/helpers';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CheckCircle, XCircle, Clock, FileText, AlertCircle, Eye, User, Calendar, DollarSign } from 'lucide-react';

export default function AprobacionAdmin() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    const q = query(
      collection(db, 'solicitudesConstancias'),
      orderBy('fechaSolicitud', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaSolicitud: doc.data().fechaSolicitud?.toDate(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate(),
      }));
      setSolicitudes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const actualizarEstado = async (solicitudId, nuevoEstado, comentario = '') => {
    setProcesando(solicitudId);
    try {
      const solicitudRef = doc(db, 'solicitudesConstancias', solicitudId);
      await updateDoc(solicitudRef, {
        estado: nuevoEstado,
        comentarioAdmin: comentario,
        fechaActualizacion: serverTimestamp(),
      });
      
      alert(`✅ Estado actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('❌ Error al actualizar el estado');
    } finally {
      setProcesando(null);
    }
  };

  const handleAprobar = (solicitudId) => {
    const comentario = prompt('💬 Comentario (opcional):');
    if (comentario !== null) {
      actualizarEstado(solicitudId, 'en_proceso', comentario || 'Solicitud aprobada y en proceso');
    }
  };

  const handleCompletar = (solicitudId) => {
    const comentario = prompt('💬 Comentario de finalización (opcional):');
    if (comentario !== null) {
      actualizarEstado(solicitudId, 'completado', comentario || 'Constancia lista para descarga');
    }
  };

  const handleRechazar = (solicitudId) => {
    const motivo = prompt('⚠️ Motivo del rechazo (REQUERIDO):');
    if (motivo && motivo.trim()) {
      actualizarEstado(solicitudId, 'rechazado', motivo);
    } else if (motivo !== null) {
      alert('❌ El motivo del rechazo es obligatorio');
    }
  };

  const solicitudesFiltradas = filtroEstado === 'todos' 
    ? solicitudes 
    : solicitudes.filter(s => s.estado === filtroEstado);

  const estadisticas = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
    enProceso: solicitudes.filter(s => s.estado === 'en_proceso').length,
    completadas: solicitudes.filter(s => s.estado === 'completado').length,
    rechazadas: solicitudes.filter(s => s.estado === 'rechazado').length,
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Compactas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => setFiltroEstado('todos')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filtroEstado === 'todos' 
              ? 'border-gray-500 bg-gray-50 shadow-md' 
              : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <p className="text-2xl font-bold text-gray-800">{estadisticas.total}</p>
          <p className="text-xs text-gray-600 mt-1 font-medium">Total</p>
        </button>
        
        <button
          onClick={() => setFiltroEstado('pendiente')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filtroEstado === 'pendiente' 
              ? 'border-yellow-500 bg-yellow-50 shadow-md' 
              : 'border-yellow-200 hover:border-yellow-400'
          }`}
        >
          <p className="text-2xl font-bold text-yellow-700">{estadisticas.pendientes}</p>
          <p className="text-xs text-yellow-800 mt-1 font-medium">Pendientes</p>
        </button>
        
        <button
          onClick={() => setFiltroEstado('en_proceso')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filtroEstado === 'en_proceso' 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-blue-200 hover:border-blue-400'
          }`}
        >
          <p className="text-2xl font-bold text-blue-700">{estadisticas.enProceso}</p>
          <p className="text-xs text-blue-800 mt-1 font-medium">En Proceso</p>
        </button>
        
        <button
          onClick={() => setFiltroEstado('completado')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filtroEstado === 'completado' 
              ? 'border-green-500 bg-green-50 shadow-md' 
              : 'border-green-200 hover:border-green-400'
          }`}
        >
          <p className="text-2xl font-bold text-green-700">{estadisticas.completadas}</p>
          <p className="text-xs text-green-800 mt-1 font-medium">Completadas</p>
        </button>
        
        <button
          onClick={() => setFiltroEstado('rechazado')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filtroEstado === 'rechazado' 
              ? 'border-red-500 bg-red-50 shadow-md' 
              : 'border-red-200 hover:border-red-400'
          }`}
        >
          <p className="text-2xl font-bold text-red-700">{estadisticas.rechazadas}</p>
          <p className="text-xs text-red-800 mt-1 font-medium">Rechazadas</p>
        </button>
      </div>

      {/* Tabla de Solicitudes */}
      <Card>
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Gestión de Solicitudes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Mostrando {solicitudesFiltradas.length} de {solicitudes.length} solicitudes
          </p>
        </div>

        {solicitudesFiltradas.length === 0 ? (
          <EmptyState 
            message="No hay solicitudes" 
            description={`No hay solicitudes con el filtro: ${filtroEstado}`} 
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Folio</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Estudiante</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Constancia</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Motivo</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Monto</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {solicitudesFiltradas.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                    {/* Folio */}
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {solicitud.id.substring(0, 8).toUpperCase()}
                      </span>
                    </td>

                    {/* Estudiante */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{solicitud.userName}</p>
                          <p className="text-xs text-gray-500">{solicitud.userEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Constancia */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">{solicitud.tipoConstanciaLabel}</span>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(solicitud.fechaSolicitud)}</span>
                      </div>
                    </td>

                    {/* Motivo */}
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-sm text-gray-700 truncate" title={solicitud.motivo}>
                        {solicitud.motivo || 'Sin motivo'}
                      </p>
                    </td>

                    {/* Monto */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                          {formatCurrency(solicitud.monto)}
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-4">
                      <Badge 
                        variant={getEstadoSolicitudColor(solicitud.estado)}
                        className="flex items-center gap-1 w-fit text-xs font-semibold"
                      >
                        {solicitud.estado === 'pendiente' && <Clock className="w-3 h-3" />}
                        {solicitud.estado === 'en_proceso' && <AlertCircle className="w-3 h-3" />}
                        {solicitud.estado === 'completado' && <CheckCircle className="w-3 h-3" />}
                        {solicitud.estado === 'rechazado' && <XCircle className="w-3 h-3" />}
                        {solicitud.estado.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {solicitud.estado === 'pendiente' && (
                          <>
                            <button
                              onClick={() => handleAprobar(solicitud.id)}
                              disabled={procesando === solicitud.id}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleRechazar(solicitud.id)}
                              disabled={procesando === solicitud.id}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                              title="Rechazar"
                            >
                              <XCircle className="w-3 h-3" />
                              Rechazar
                            </button>
                          </>
                        )}
                        
                        {solicitud.estado === 'en_proceso' && (
                          <button
                            onClick={() => handleCompletar(solicitud.id)}
                            disabled={procesando === solicitud.id}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                            title="Completar"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Completar
                          </button>
                        )}

                        {(solicitud.estado === 'completado' || solicitud.estado === 'rechazado') && (
                          <span className="text-xs text-gray-400 italic">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}