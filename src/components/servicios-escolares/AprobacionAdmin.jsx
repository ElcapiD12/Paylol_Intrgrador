import { useState, useEffect } from 'react';
import { Card, Badge, Button, EmptyState, Table } from '../shared';
import { formatCurrency, formatDate, getEstadoSolicitudColor } from '../../utils/helpers';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CheckCircle, XCircle, Clock, FileText, AlertCircle, Eye } from 'lucide-react';

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
    const comentario = prompt('Comentario (opcional):');
    if (comentario !== null) {
      actualizarEstado(solicitudId, 'en_proceso', comentario || 'Solicitud aprobada y en proceso');
    }
  };

  const handleCompletar = (solicitudId) => {
    const comentario = prompt('Comentario (opcional):');
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
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card 
          padding="sm" 
          className="cursor-pointer hover:bg-gray-50 transition-colors border-2" 
          onClick={() => setFiltroEstado('todos')}
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">{estadisticas.total}</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">Total</p>
          </div>
        </Card>
        
        <Card 
          padding="sm" 
          className="cursor-pointer hover:bg-yellow-50 transition-colors border-2 border-yellow-200" 
          onClick={() => setFiltroEstado('pendiente')}
        >
          <div className="text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-yellow-700">{estadisticas.pendientes}</p>
            <p className="text-sm text-yellow-800 mt-1 font-medium">Pendientes</p>
          </div>
        </Card>
        
        <Card 
          padding="sm" 
          className="cursor-pointer hover:bg-blue-50 transition-colors border-2 border-blue-200" 
          onClick={() => setFiltroEstado('en_proceso')}
        >
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-700">{estadisticas.enProceso}</p>
            <p className="text-sm text-blue-800 mt-1 font-medium">En Proceso</p>
          </div>
        </Card>
        
        <Card 
          padding="sm" 
          className="cursor-pointer hover:bg-green-50 transition-colors border-2 border-green-200" 
          onClick={() => setFiltroEstado('completado')}
        >
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-700">{estadisticas.completadas}</p>
            <p className="text-sm text-green-800 mt-1 font-medium">Completadas</p>
          </div>
        </Card>
        
        <Card 
          padding="sm" 
          className="cursor-pointer hover:bg-red-50 transition-colors border-2 border-red-200" 
          onClick={() => setFiltroEstado('rechazado')}
        >
          <div className="text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-red-700">{estadisticas.rechazadas}</p>
            <p className="text-sm text-red-800 mt-1 font-medium">Rechazadas</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card padding="sm">
        <div className="flex items-center gap-3 flex-wrap">
          <Eye className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Filtrar por estado:</span>
          {[
            { value: 'todos', label: 'Todas', color: 'gray' },
            { value: 'pendiente', label: 'Pendientes', color: 'yellow' },
            { value: 'en_proceso', label: 'En Proceso', color: 'blue' },
            { value: 'completado', label: 'Completadas', color: 'green' },
            { value: 'rechazado', label: 'Rechazadas', color: 'red' }
          ].map((filtro) => (
            <button
              key={filtro.value}
              onClick={() => setFiltroEstado(filtro.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroEstado === filtro.value
                  ? `bg-${filtro.color}-600 text-white shadow-md`
                  : `bg-${filtro.color}-100 text-${filtro.color}-700 hover:bg-${filtro.color}-200`
              }`}
              style={{
                backgroundColor: filtroEstado === filtro.value 
                  ? filtro.color === 'gray' ? '#4B5563' 
                    : filtro.color === 'yellow' ? '#D97706'
                    : filtro.color === 'blue' ? '#2563EB'
                    : filtro.color === 'green' ? '#059669'
                    : '#DC2626'
                  : filtro.color === 'gray' ? '#F3F4F6'
                    : filtro.color === 'yellow' ? '#FEF3C7'
                    : filtro.color === 'blue' ? '#DBEAFE'
                    : filtro.color === 'green' ? '#D1FAE5'
                    : '#FEE2E2',
                color: filtroEstado === filtro.value ? 'white' : undefined
              }}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Lista de Solicitudes */}
      <Card 
        title="Gestión de Solicitudes" 
        subtitle={`Mostrando ${solicitudesFiltradas.length} de ${solicitudes.length} solicitudes`}
      >
        {solicitudesFiltradas.length === 0 ? (
          <EmptyState 
            message="No hay solicitudes" 
            description={`No hay solicitudes con el filtro: ${filtroEstado}`} 
          />
        ) : (
          <div className="space-y-4">
            {solicitudesFiltradas.map((solicitud) => (
              <div 
                key={solicitud.id}
                className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="w-6 h-6 text-indigo-500 mt-1" />
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">
                          {solicitud.tipoConstanciaLabel}
                        </h4>
                        <p className="text-sm text-gray-500 font-mono">
                          Folio: {solicitud.id.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="text-gray-500 font-medium">👤 Estudiante:</p>
                        <p className="text-gray-800 font-semibold">{solicitud.userName}</p>
                        <p className="text-gray-600 text-xs">{solicitud.userEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">📅 Fecha:</p>
                        <p className="text-gray-800">{formatDate(solicitud.fechaSolicitud)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">💰 Monto:</p>
                        <p className="text-green-700 font-bold text-lg">{formatCurrency(solicitud.monto)}</p>
                      </div>
                      {solicitud.motivo && solicitud.motivo !== 'Sin motivo especificado' && (
                        <div className="md:col-span-2">
                          <p className="text-gray-500 font-medium">📝 Motivo:</p>
                          <p className="text-gray-700 italic">"{solicitud.motivo}"</p>
                        </div>
                      )}
                    </div>

                    {solicitud.comentarioAdmin && (
                      <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-blue-800 font-semibold text-sm">💬 Comentario Admin:</p>
                        <p className="text-gray-700 text-sm mt-1">{solicitud.comentarioAdmin}</p>
                      </div>
                    )}
                  </div>

                  {/* Estado y Acciones */}
                  <div className="flex flex-col items-end gap-3 md:min-w-[200px]">
                    <Badge 
                      variant={getEstadoSolicitudColor(solicitud.estado)} 
                      size="lg"
                      className="text-sm font-bold px-4 py-2"
                    >
                      {solicitud.estado === 'pendiente' && <Clock className="w-4 h-4 mr-1" />}
                      {solicitud.estado === 'en_proceso' && <AlertCircle className="w-4 h-4 mr-1" />}
                      {solicitud.estado === 'completado' && <CheckCircle className="w-4 h-4 mr-1" />}
                      {solicitud.estado === 'rechazado' && <XCircle className="w-4 h-4 mr-1" />}
                      {solicitud.estado.toUpperCase()}
                    </Badge>

                    <div className="flex flex-col gap-2 w-full">
                      {solicitud.estado === 'pendiente' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleAprobar(solicitud.id)}
                            disabled={procesando === solicitud.id}
                            className="w-full font-semibold"
                            style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRechazar(solicitud.id)}
                            disabled={procesando === solicitud.id}
                            className="w-full font-semibold"
                            style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      
                      {solicitud.estado === 'en_proceso' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleCompletar(solicitud.id)}
                          disabled={procesando === solicitud.id}
                          className="w-full font-semibold"
                          style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completar
                        </Button>
                      )}

                      {(solicitud.estado === 'completado' || solicitud.estado === 'rechazado') && (
                        <span className="text-xs text-gray-400 italic text-center">Sin acciones disponibles</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}