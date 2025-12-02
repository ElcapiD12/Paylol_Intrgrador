import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Card, Select, Button, Alert, Badge, EmptyState } from '../shared';
import { TIPOS_CONSTANCIA, MONTOS, TIPOS_PAGO } from '../../utils/constants';
import { formatCurrency, formatDate, getEstadoSolicitudColor } from '../../utils/helpers';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { FileText, Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function SolicitudConstanciaDemo() {
  //const { user } = useAuth();
  const user = {
    uid: 'test-user-123',
    email: 'estudiante@prueba.com',
    displayName: 'Estudiante de Prueba'
  };

  const [tipoConstancia, setTipoConstancia] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);

  // Obtener precio de la constancia seleccionada
  const precioConstancia = tipoConstancia ? MONTOS[TIPOS_PAGO.CONSTANCIA] : 0;

  // Cargar solicitudes en tiempo real
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'solicitudesConstancias'),
      where('userId', '==', user.uid),
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
      setLoadingSolicitudes(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tipoConstancia) {
      setAlert({ type: 'danger', message: 'Por favor selecciona un tipo de constancia' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const solicitud = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        tipoConstancia,
        tipoConstanciaLabel: TIPOS_CONSTANCIA.find(t => t.value === tipoConstancia)?.label,
        motivo: motivo.trim() || 'Sin motivo especificado',
        monto: precioConstancia,
        estado: 'pendiente',
        fechaSolicitud: serverTimestamp(),
        fechaActualizacion: serverTimestamp(),
      };

      await addDoc(collection(db, 'solicitudesConstancias'), solicitud);

      setAlert({ type: 'success', message: '¡Solicitud enviada exitosamente!' });
      setTipoConstancia('');
      setMotivo('');

      setTimeout(() => setAlert(null), 3000);

    } catch (error) {
      console.error('Error al crear solicitud:', error);
      setAlert({ type: 'danger', message: 'Error al enviar la solicitud. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const getEstadoIcon = (estado) => {
    const icons = {
      pendiente: <Clock className="w-4 h-4" />,
      en_proceso: <AlertCircle className="w-4 h-4" />,
      completado: <CheckCircle className="w-4 h-4" />,
      rechazado: <XCircle className="w-4 h-4" />,
    };
    return icons[estado] || <FileText className="w-4 h-4" />;
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completado: 'Completado',
      rechazado: 'Rechazado',
    };
    return labels[estado] || estado;
  };

  const handleDescargar = (solicitud) => {
    alert(`Descargando constancia: ${solicitud.tipoConstanciaLabel}\nFolio: ${solicitud.id.substring(0, 8).toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Formulario de Solicitud */}
      <Card title="Solicitar Constancia" subtitle="Completa el formulario para solicitar tu constancia">
        {alert && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Select
            label="Tipo de Constancia"
            required
            options={[
              { value: '', label: 'Selecciona una constancia' },
              ...TIPOS_CONSTANCIA
            ]}
            value={tipoConstancia}
            onChange={(e) => setTipoConstancia(e.target.value)}
          />

          {tipoConstancia && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">Precio:</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(precioConstancia)}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Motivo (Opcional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe brevemente el motivo de tu solicitud..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          {/* RESUMEN DE LA INFORMACIÓN */}
          {tipoConstancia && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resumen de tu solicitud
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Tipo:</span>
                  <span className="text-gray-900 font-semibold">
                    {TIPOS_CONSTANCIA.find(t => t.value === tipoConstancia)?.label}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Precio:</span>
                  <span className="text-green-700 font-bold text-lg">
                    {formatCurrency(precioConstancia)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Solicitante:</span>
                  <span className="text-gray-900">{user.displayName || user.email}</span>
                </div>
                
                {motivo && (
                  <div className="pt-2 border-t border-green-200">
                    <p className="text-gray-600 font-medium mb-1">Motivo:</p>
                    <p className="text-gray-700 italic">"{motivo}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            variant="success"
            className="w-full mt-4 text-lg font-bold"
            disabled={loading || !tipoConstancia}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Enviando solicitud...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Enviar Solicitud
              </span>
            )}
          </Button>
        </form>
      </Card>

      {/* Lista de Solicitudes */}
      <Card title="Mis Solicitudes" subtitle={`${solicitudes.length} solicitud(es)`}>
        {loadingSolicitudes ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
          </div>
        ) : solicitudes.length === 0 ? (
          <EmptyState 
            message="No tienes solicitudes de constancias"
            description="Crea una nueva solicitud usando el formulario de arriba"
          />
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud) => (
              <div 
                key={solicitud.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <h4 className="font-semibold text-gray-800">
                        {solicitud.tipoConstanciaLabel}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-500">
                      Folio: {solicitud.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  
                  <Badge 
                    variant={getEstadoSolicitudColor(solicitud.estado)}
                    className="flex items-center gap-1"
                  >
                    {getEstadoIcon(solicitud.estado)}
                    {getEstadoLabel(solicitud.estado)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Fecha de solicitud:</p>
                    <p className="font-medium text-gray-700">
                      {formatDate(solicitud.fechaSolicitud)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monto:</p>
                    <p className="font-medium text-gray-700">
                      {formatCurrency(solicitud.monto)}
                    </p>
                  </div>
                </div>

                {solicitud.motivo && solicitud.motivo !== 'Sin motivo especificado' && (
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                    <p className="text-gray-500">Motivo:</p>
                    <p className="text-gray-700">{solicitud.motivo}</p>
                  </div>
                )}

                {solicitud.comentarioAdmin && (
                  <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                    <p className="text-blue-600 font-medium">Comentario del administrador:</p>
                    <p className="text-gray-700">{solicitud.comentarioAdmin}</p>
                  </div>
                )}

                {solicitud.estado === 'completado' && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => handleDescargar(solicitud)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Constancia
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
