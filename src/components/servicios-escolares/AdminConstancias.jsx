// components/servicios-escolares/AdminConstancias.jsx
// Para que Servicios Escolares gestione las constancias con pago validado

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
import { db } from '../../services/firebase';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ESTADOS_PAGO } from '../../utils/constants';
import { 
  FaFileAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye, 
  FaClock,
  FaChartBar,
  FaDownload,
  FaExclamationTriangle,
  FaCheckDouble
} from 'react-icons/fa';

export default function AdminConstancias() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [accion, setAccion] = useState(null); // 'completar' o 'rechazar'
  const [comentario, setComentario] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('en_proceso');

  // Cargar solicitudes con pago validado
  useEffect(() => {
    const q = query(
      collection(db, 'solicitudesConstancias'),
      where('estadoPago', '==', ESTADOS_PAGO.PAGADO || 'pagado'),
      orderBy('fechaSolicitud', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaSolicitud: doc.data().fechaSolicitud?.toDate(),
        fechaValidacion: doc.data().fechaValidacion?.toDate(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate(),
      }));

      setSolicitudes(data);
      setLoading(false);
    }, (error) => {
      console.error('Error al cargar solicitudes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Completar constancia
  const completarConstancia = async () => {
    setProcesando(true);
    try {
      const solicitudRef = doc(db, 'solicitudesConstancias', solicitudSeleccionada.id);
      await updateDoc(solicitudRef, {
        estado: 'completado',
        comentarioAdmin: comentario.trim() || 'Constancia procesada correctamente',
        fechaCompletado: serverTimestamp(),
        fechaActualizacion: serverTimestamp(),
      });

      setAlert({ 
        type: 'success', 
        message: '✓ Constancia completada. El estudiante ya puede descargarla.' 
      });

      cerrarModal();
      setTimeout(() => setAlert(null), 3000);

    } catch (error) {
      console.error('Error al completar constancia:', error);
      setAlert({ type: 'error', message: 'Error al completar la constancia' });
    } finally {
      setProcesando(false);
    }
  };

  // Rechazar constancia
  const rechazarConstancia = async () => {
    if (!comentario.trim()) {
      setAlert({ type: 'error', message: 'Debes escribir un motivo de rechazo' });
      return;
    }

    setProcesando(true);
    try {
      const solicitudRef = doc(db, 'solicitudesConstancias', solicitudSeleccionada.id);
      await updateDoc(solicitudRef, {
        estado: 'rechazado',
        comentarioAdmin: comentario.trim(),
        fechaActualizacion: serverTimestamp(),
      });

      setAlert({ 
        type: 'warning', 
        message: 'Solicitud rechazada. El estudiante será notificado.' 
      });

      cerrarModal();
      setTimeout(() => setAlert(null), 3000);

    } catch (error) {
      console.error('Error al rechazar constancia:', error);
      setAlert({ type: 'error', message: 'Error al rechazar la constancia' });
    } finally {
      setProcesando(false);
    }
  };

  const abrirModal = (solicitud, tipoAccion) => {
    setSolicitudSeleccionada(solicitud);
    setAccion(tipoAccion);
    setShowModal(true);
    setComentario('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSolicitudSeleccionada(null);
    setAccion(null);
    setComentario('');
  };

  // Filtrar solicitudes
  const solicitudesFiltradas = solicitudes.filter(s => {
    if (filtroEstado === 'todas') return true;
    return s.estado === filtroEstado;
  });

  // Estadísticas
  const stats = {
    pendientes: solicitudes.filter(s => s.estado === 'en_proceso').length,
    completadas: solicitudes.filter(s => s.estado === 'completado').length,
    rechazadas: solicitudes.filter(s => s.estado === 'rechazado').length,
    total: solicitudes.length,
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando constancias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FaFileAlt className="text-blue-600 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Constancias</h1>
        </div>
        <p className="text-gray-600">
          Procesa las solicitudes de constancias con pago validado
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
          title="Completadas"
          value={stats.completadas}
          icon={<FaCheckDouble />}
          color="green"
        />
        <StatCard
          title="Rechazadas"
          value={stats.rechazadas}
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
            active={filtroEstado === 'todas'}
            onClick={() => setFiltroEstado('todas')}
          >
            Todas ({solicitudes.length})
          </FilterButton>
          <FilterButton
            active={filtroEstado === 'en_proceso'}
            onClick={() => setFiltroEstado('en_proceso')}
          >
            Pendientes ({stats.pendientes})
          </FilterButton>
          <FilterButton
            active={filtroEstado === 'completado'}
            onClick={() => setFiltroEstado('completado')}
          >
            Completadas ({stats.completadas})
          </FilterButton>
          <FilterButton
            active={filtroEstado === 'rechazado'}
            onClick={() => setFiltroEstado('rechazado')}
          >
            Rechazadas ({stats.rechazadas})
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
              <SolicitudAdminCard
                key={solicitud.id}
                solicitud={solicitud}
                onCompletar={(sol) => abrirModal(sol, 'completar')}
                onRechazar={(sol) => abrirModal(sol, 'rechazar')}
                procesando={procesando}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE ACCIÓN */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {accion === 'completar' ? 'Completar Constancia' : 'Rechazar Solicitud'}
            </h2>

            <div className={`p-3 ${accion === 'completar' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg mb-4`}>
              <p className="text-sm font-semibold mb-1">
                <strong>Solicitud:</strong> {solicitudSeleccionada?.tipoConstanciaLabel}
              </p>
              <p className="text-sm mb-1">
                <strong>Estudiante:</strong> {solicitudSeleccionada?.userName}
              </p>
              <p className="text-sm mb-1">
                <strong>Email:</strong> {solicitudSeleccionada?.userEmail}
              </p>
              <p className="text-sm">
                <strong>Folio:</strong> {solicitudSeleccionada?.id.substring(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                {accion === 'completar' ? 'Comentario (opcional)' : 'Motivo del rechazo *'}
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder={
                  accion === 'completar' 
                    ? 'Agregar comentarios adicionales...'
                    : 'Explica el motivo del rechazo (ej: documentación incompleta, datos incorrectos...)'
                }
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={cerrarModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                disabled={procesando}
              >
                Cancelar
              </button>
              <button
                onClick={accion === 'completar' ? completarConstancia : rechazarConstancia}
                className={`flex-1 px-4 py-2 ${
                  accion === 'completar' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white rounded-lg transition-colors font-medium disabled:opacity-50`}
                disabled={procesando || (accion === 'rechazar' && !comentario.trim())}
              >
                {procesando ? 'Procesando...' : accion === 'completar' ? 'Completar' : 'Rechazar'}
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

function SolicitudAdminCard({ solicitud, onCompletar, onRechazar, procesando }) {
  const [verDetalles, setVerDetalles] = useState(false);

  const getEstadoColor = (estado) => {
    if (estado === 'en_proceso') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (estado === 'completado') return 'bg-green-100 text-green-800 border-green-300';
    if (estado === 'rechazado') return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEstadoLabel = (estado) => {
    if (estado === 'en_proceso') return '⏳ Pendiente';
    if (estado === 'completado') return '✓ Completado';
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
        
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getEstadoColor(solicitud.estado)}`}>
          {getEstadoLabel(solicitud.estado)}
        </span>
      </div>

      {/* INFO DEL ESTUDIANTE */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div>
          <p className="text-xs text-blue-600 mb-1 font-semibold">Estudiante:</p>
          <p className="font-bold text-gray-800">{solicitud.userName}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 mb-1 font-semibold">Email:</p>
          <p className="font-semibold text-gray-800 text-sm">{solicitud.userEmail}</p>
        </div>
      </div>

      {/* INFO DE LA SOLICITUD */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Fecha solicitud:</p>
          <p className="font-semibold text-gray-700 text-sm">{formatDate(solicitud.fechaSolicitud)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Monto pagado:</p>
          <p className="font-bold text-green-600 text-lg">{formatCurrency(solicitud.monto)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Pago validado:</p>
          <p className="font-semibold text-green-700 text-sm">
            {solicitud.fechaValidacion ? formatDate(solicitud.fechaValidacion) : 'N/A'}
          </p>
        </div>
      </div>

      {/* MOTIVO */}
      {solicitud.motivo && solicitud.motivo !== 'Sin motivo especificado' && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1 font-semibold">Motivo de la solicitud:</p>
          <p className="text-sm text-gray-700">{solicitud.motivo}</p>
        </div>
      )}

      {/* COMPROBANTE DE PAGO */}
      {solicitud.comprobanteURL && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-800 mb-1">✓ Comprobante de pago validado</p>
              <p className="text-xs text-green-600">{solicitud.comprobanteNombre || 'comprobante.pdf'}</p>
            </div>
            <a
              href={solicitud.comprobanteURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
            >
              <FaEye />
              Ver
            </a>
          </div>
        </div>
      )}

      {/* REFERENCIA DE PAGO */}
      <button
        onClick={() => setVerDetalles(!verDetalles)}
        className="w-full mb-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {verDetalles ? '▼ Ocultar' : '▶ Ver'} detalles de pago
      </button>

      {verDetalles && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2 text-sm border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Referencia:</span>
            <span className="font-mono font-bold text-blue-600">{solicitud.referenciaPago}</span>
          </div>
          {solicitud.datosBancarios && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Banco:</span>
                <span className="font-semibold">{solicitud.datosBancarios.banco}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cuenta:</span>
                <span className="font-mono font-bold">{solicitud.datosBancarios.cuenta}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* COMENTARIO ADMIN (si existe) */}
      {solicitud.comentarioAdmin && (
        <div className={`mb-4 p-3 rounded-lg border ${
          solicitud.estado === 'rechazado' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-sm font-semibold mb-1 ${
            solicitud.estado === 'rechazado' ? 'text-red-700' : 'text-blue-700'
          }`}>
            {solicitud.estado === 'rechazado' ? '✗ Motivo del rechazo:' : '💬 Comentario:'}
          </p>
          <p className={`text-sm ${
            solicitud.estado === 'rechazado' ? 'text-red-600' : 'text-blue-600'
          }`}>
            {solicitud.comentarioAdmin}
          </p>
        </div>
      )}

      {/* ACCIONES - Solo para solicitudes en proceso */}
      {solicitud.estado === 'en_proceso' && (
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
            onClick={() => onCompletar(solicitud)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={procesando}
          >
            <FaCheckCircle />
            Completar
          </button>
        </div>
      )}

      {/* INDICADOR DE COMPLETADO */}
      {solicitud.estado === 'completado' && solicitud.fechaCompletado && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <FaCheckDouble className="text-green-600" />
          <p className="text-sm text-green-700">
            Completado el {formatDate(solicitud.fechaCompletado)}
          </p>
        </div>
      )}
    </div>
  );
}