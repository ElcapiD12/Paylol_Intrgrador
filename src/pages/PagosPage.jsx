// pages/PagosPage.jsx - SISTEMA COMPLETO DE VALIDACIÓN DE PAGOS

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ESTADOS_PAGO } from '../utils/constants';
import { 
  FaCreditCard, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaFileAlt, 
  FaEye, 
  FaClock,
  FaExclamationTriangle,
  FaUniversity,
  FaChartBar
} from 'react-icons/fa';

export default function PagosPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('pendientes');

  // Cargar solicitudes con comprobante subido o en validación
  useEffect(() => {
    const q = query(
      collection(db, 'solicitudesConstancias'),
      where('estadoPago', 'in', [
        ESTADOS_PAGO.COMPROBANTE_SUBIDO || 'comprobante_subido',
        ESTADOS_PAGO.VALIDANDO || 'validando',
        ESTADOS_PAGO.PAGADO || 'pagado',
        ESTADOS_PAGO.RECHAZADO || 'rechazado'
      ]),
      orderBy('fechaSolicitud', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaSolicitud: doc.data().fechaSolicitud?.toDate(),
        fechaComprobante: doc.data().fechaComprobante?.toDate(),
        fechaValidacion: doc.data().fechaValidacion?.toDate(),
      }));
      
      // Ordenar: pendientes primero
      data.sort((a, b) => {
        const estadoPendiente = 'comprobante_subido';
        if (a.estadoPago === estadoPendiente && b.estadoPago !== estadoPendiente) return -1;
        if (a.estadoPago !== estadoPendiente && b.estadoPago === estadoPendiente) return 1;
        return (b.fechaComprobante || 0) - (a.fechaComprobante || 0);
      });

      setSolicitudes(data);
      setLoading(false);
    }, (error) => {
      console.error('Error al cargar solicitudes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Aprobar pago
  const aprobarPago = async (solicitudId) => {
    if (!confirm('¿Confirmar que el pago es válido?')) return;

    setProcesando(true);
    try {
      const solicitudRef = doc(db, 'solicitudesConstancias', solicitudId);
      await updateDoc(solicitudRef, {
        estadoPago: ESTADOS_PAGO.PAGADO || 'pagado',
        estado: 'en_proceso',
        fechaValidacion: serverTimestamp(),
        validadoPor: 'Sistema de Pagos',
        fechaActualizacion: serverTimestamp(),
      });

      setAlert({ 
        type: 'success', 
        message: '✓ Pago aprobado. La solicitud está lista para ser procesada.' 
      });

      setTimeout(() => setAlert(null), 3000);

    } catch (error) {
      console.error('Error al aprobar pago:', error);
      setAlert({ type: 'error', message: 'Error al aprobar el pago' });
    } finally {
      setProcesando(false);
    }
  };

  // Rechazar pago
  const rechazarPago = async () => {
    if (!motivoRechazo.trim()) {
      setAlert({ type: 'error', message: 'Debes escribir un motivo de rechazo' });
      return;
    }

    setProcesando(true);
    try {
      const solicitudRef = doc(db, 'solicitudesConstancias', solicitudSeleccionada.id);
      await updateDoc(solicitudRef, {
        estadoPago: ESTADOS_PAGO.RECHAZADO || 'rechazado',
        motivoRechazo: motivoRechazo.trim(),
        fechaValidacion: serverTimestamp(),
        validadoPor: 'Sistema de Pagos',
        fechaActualizacion: serverTimestamp(),
      });

      setAlert({ 
        type: 'warning', 
        message: 'Comprobante rechazado. El estudiante deberá subir uno nuevo.' 
      });

      setShowModal(false);
      setSolicitudSeleccionada(null);
      setMotivoRechazo('');

      setTimeout(() => setAlert(null), 3000);

    } catch (error) {
      console.error('Error al rechazar pago:', error);
      setAlert({ type: 'error', message: 'Error al rechazar el pago' });
    } finally {
      setProcesando(false);
    }
  };

  // Filtrar solicitudes
  const solicitudesFiltradas = solicitudes.filter(s => {
    if (filtroEstado === 'todos') return true;
    if (filtroEstado === 'pendientes') return s.estadoPago === 'comprobante_subido';
    if (filtroEstado === 'aprobados') return s.estadoPago === 'pagado';
    if (filtroEstado === 'rechazados') return s.estadoPago === 'rechazado';
    return true;
  });

  // Estadísticas
  const stats = {
    pendientes: solicitudes.filter(s => s.estadoPago === 'comprobante_subido').length,
    aprobados: solicitudes.filter(s => s.estadoPago === 'pagado').length,
    rechazados: solicitudes.filter(s => s.estadoPago === 'rechazado').length,
    total: solicitudes.length,
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FaCreditCard className="text-blue-600 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800">Validación de Pagos</h1>
        </div>
        <p className="text-gray-600">
          Revisa y valida los comprobantes de pago de constancias
        </p>
      </div>

      {/* ALERTAS */}
      {alert && (
        <div className={`p-4 rounded-lg ${
          alert.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          alert.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          'bg-yellow-50 border border-yellow-200 text-yellow-800'
        }`}>
          {alert.message}
        </div>
      )}

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Pendientes"
          value={stats.pendientes}
          icon={<FaClock />}
          color="yellow"
        />
        <StatCard
          title="Aprobados Hoy"
          value={stats.aprobados}
          icon={<FaCheckCircle />}
          color="green"
        />
        <StatCard
          title="Rechazados"
          value={stats.rechazados}
          icon={<FaTimesCircle />}
          color="red"
        />
        <StatCard
          title="Total"
          value={stats.total}
          icon={<FaChartBar />}
          color="blue"
        />
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex gap-2 flex-wrap">
          <FilterButton
            active={filtroEstado === 'todos'}
            onClick={() => setFiltroEstado('todos')}
          >
            Todos ({solicitudes.length})
          </FilterButton>
          <FilterButton
            active={filtroEstado === 'pendientes'}
            onClick={() => setFiltroEstado('pendientes')}
          >
            Pendientes ({stats.pendientes})
          </FilterButton>
          <FilterButton
            active={filtroEstado === 'aprobados'}
            onClick={() => setFiltroEstado('aprobados')}
          >
            Aprobados ({stats.aprobados})
          </FilterButton>
          <FilterButton
            active={filtroEstado === 'rechazados'}
            onClick={() => setFiltroEstado('rechazados')}
          >
            Rechazados ({stats.rechazados})
          </FilterButton>
        </div>
      </div>

      {/* LISTA DE SOLICITUDES */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {solicitudesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay solicitudes con este filtro</p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudesFiltradas.map((solicitud) => (
              <SolicitudCard
                key={solicitud.id}
                solicitud={solicitud}
                onAprobar={aprobarPago}
                onRechazar={(sol) => {
                  setSolicitudSeleccionada(sol);
                  setShowModal(true);
                }}
                procesando={procesando}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE RECHAZO */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Rechazar Comprobante de Pago
            </h2>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Solicitud:</strong> {solicitudSeleccionada?.tipoConstanciaLabel}
              </p>
              <p className="text-sm text-yellow-800">
                <strong>Estudiante:</strong> {solicitudSeleccionada?.userName}
              </p>
              <p className="text-sm text-yellow-800">
                <strong>Monto:</strong> {formatCurrency(solicitudSeleccionada?.monto)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Motivo del rechazo *
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="Explica por qué se rechaza el comprobante (ej: imagen borrosa, datos incorrectos, monto no coincide...)"
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSolicitudSeleccionada(null);
                  setMotivoRechazo('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                disabled={procesando}
              >
                Cancelar
              </button>
              <button
                onClick={rechazarPago}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                disabled={procesando || !motivoRechazo.trim()}
              >
                {procesando ? 'Rechazando...' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function StatCard({ title, value, icon, color }) {
  const colors = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className={`${colors[color]} rounded-xl p-6 border-2`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-60">{icon}</div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function SolicitudCard({ solicitud, onAprobar, onRechazar, procesando }) {
  const [verDetalles, setVerDetalles] = useState(false);

  const getEstadoColor = (estado) => {
    if (estado === 'comprobante_subido') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (estado === 'pagado') return 'bg-green-100 text-green-800 border-green-300';
    if (estado === 'rechazado') return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEstadoLabel = (estado) => {
    if (estado === 'comprobante_subido') return '⏳ Pendiente';
    if (estado === 'pagado') return '✓ Aprobado';
    if (estado === 'rechazado') return '✗ Rechazado';
    return estado;
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaFileAlt className="text-gray-400 text-xl" />
            <h3 className="font-bold text-gray-800 text-lg">{solicitud.tipoConstanciaLabel}</h3>
          </div>
          <p className="text-sm text-gray-500">
            Folio: <span className="font-mono font-semibold">{solicitud.id.substring(0, 8).toUpperCase()}</span>
          </p>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getEstadoColor(solicitud.estadoPago)}`}>
          {getEstadoLabel(solicitud.estadoPago)}
        </span>
      </div>

      {/* INFO DEL ESTUDIANTE */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 mb-1">Estudiante:</p>
          <p className="font-semibold text-gray-800">{solicitud.userName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Email:</p>
          <p className="font-semibold text-gray-800 text-sm">{solicitud.userEmail}</p>
        </div>
      </div>

      {/* INFO DE PAGO */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Monto:</p>
          <p className="font-bold text-green-600 text-lg">{formatCurrency(solicitud.monto)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Referencia:</p>
          <p className="font-mono text-sm font-bold text-blue-600">{solicitud.referenciaPago}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fecha comprobante:</p>
          <p className="font-semibold text-gray-700 text-sm">
            {solicitud.fechaComprobante ? formatDate(solicitud.fechaComprobante) : 'N/A'}
          </p>
        </div>
      </div>

      {/* COMPROBANTE */}
      {solicitud.comprobanteURL && (
        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-800 mb-1">📎 Comprobante de pago:</p>
              <p className="text-xs text-blue-600">{solicitud.comprobanteNombre || 'comprobante.pdf'}</p>
            </div>
            <a
              href={solicitud.comprobanteURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <FaEye />
              Ver
            </a>
          </div>
        </div>
      )}

      {/* DETALLES BANCARIOS */}
      <button
        onClick={() => setVerDetalles(!verDetalles)}
        className="w-full mb-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
      >
        <FaUniversity />
        {verDetalles ? 'Ocultar' : 'Ver'} datos bancarios
      </button>

      {verDetalles && solicitud.datosBancarios && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Banco:</span>
            <span className="font-semibold">{solicitud.datosBancarios.banco}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cuenta:</span>
            <span className="font-mono font-bold">{solicitud.datosBancarios.cuenta}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">CLABE:</span>
            <span className="font-mono font-bold">{solicitud.datosBancarios.clabe}</span>
          </div>
        </div>
      )}

      {/* MOTIVO DE RECHAZO */}
      {solicitud.estadoPago === 'rechazado' && solicitud.motivoRechazo && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-semibold mb-2 flex items-center gap-2">
            <FaExclamationTriangle />
            Motivo del rechazo:
          </p>
          <p className="text-sm text-red-600">{solicitud.motivoRechazo}</p>
          {solicitud.fechaValidacion && (
            <p className="text-xs text-red-500 mt-2">
              Rechazado el {formatDate(solicitud.fechaValidacion)}
            </p>
          )}
        </div>
      )}

      {/* FECHA DE VALIDACIÓN */}
      {solicitud.estadoPago === 'pagado' && solicitud.fechaValidacion && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <FaCheckCircle />
            Validado el {formatDate(solicitud.fechaValidacion)}
          </p>
        </div>
      )}

      {/* ACCIONES */}
      {solicitud.estadoPago === 'comprobante_subido' && (
        <div className="flex gap-3">
          <button
            onClick={() => onRechazar(solicitud)}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={procesando}
          >
            <FaTimesCircle />
            Rechazar
          </button>
          <button
            onClick={() => onAprobar(solicitud.id)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={procesando}
          >
            <FaCheckCircle />
            Aprobar
          </button>
        </div>
      )}
    </div>
  );
}