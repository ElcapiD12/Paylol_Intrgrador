import { useState } from 'react';

const Notifications = ({ pagos }) => {
  const [notificacionesCerradas, setNotificacionesCerradas] = useState([]);

  // Obtener pagos próximos a vencer (dentro de los próximos 7 días)
  const obtenerPagosProximos = () => {
    const hoy = new Date();
    const enSieteDias = new Date();
    enSieteDias.setDate(hoy.getDate() + 7);

    return pagos.filter(pago => {
      if (pago.estado !== 'pendiente') return false;
      if (notificacionesCerradas.includes(pago.id)) return false;
      
      const fechaVencimiento = pago.fechaVencimiento?.toDate?.() || new Date(pago.fechaVencimiento);
      return fechaVencimiento >= hoy && fechaVencimiento <= enSieteDias;
    }).sort((a, b) => {
      const fechaA = a.fechaVencimiento?.toDate?.() || new Date(a.fechaVencimiento);
      const fechaB = b.fechaVencimiento?.toDate?.() || new Date(b.fechaVencimiento);
      return fechaA - fechaB;
    });
  };

  const pagosProximos = obtenerPagosProximos();

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto || 0);
  };

  const calcularDiasRestantes = (fecha) => {
    const hoy = new Date();
    const fechaVencimiento = fecha.toDate ? fecha.toDate() : new Date(fecha);
    const diferencia = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diferencia;
  };

  const cerrarNotificacion = (pagoId) => {
    setNotificacionesCerradas([...notificacionesCerradas, pagoId]);
  };

  if (pagosProximos.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      {pagosProximos.map((pago, index) => {
        const diasRestantes = calcularDiasRestantes(pago.fechaVencimiento);
        const esUrgente = diasRestantes <= 3;
        const esCritico = diasRestantes <= 1;

        return (
          <div 
            key={pago.id}
            className={`
              relative overflow-hidden rounded-xl shadow-lg border-2 
              ${esCritico 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-300' 
                : esUrgente 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-300'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300'
              }
              transform hover:scale-[1.02] transition-all duration-300
            `}
            style={{ 
              animation: `slideInDown 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            {/* Contenido */}
            <div className="relative p-5">
              <div className="flex items-start justify-between">
                {/* Icono y contenido */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icono animado */}
                  <div className={`
                    flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center
                    ${esCritico ? 'animate-pulse' : ''}
                  `}>
                    {esCritico ? (
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : esUrgente ? (
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    )}
                  </div>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    {/* Título */}
                    <div className="flex items-center space-x-2 mb-2">
                      {esCritico && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-red-600 animate-pulse">
                          ¡URGENTE!
                        </span>
                      )}
                      <h3 className="text-white font-black text-lg">
                        {esCritico ? '¡Pago crítico!' : esUrgente ? '¡Pago urgente!' : 'Recordatorio de pago'}
                      </h3>
                    </div>

                    {/* Detalles del pago */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-bold text-base">
                            {pago.concepto || 'Pago sin concepto'}
                          </p>
                          {pago.descripcion && (
                            <p className="text-white/80 text-sm mt-1">
                              {pago.descripcion}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-white font-black text-2xl">
                            {formatearMoneda(pago.monto)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/20">
                        <div className="flex items-center space-x-2 text-white/90">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium">
                            Vence el {formatearFecha(pago.fechaVencimiento)}
                          </span>
                        </div>
                        <div className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-black
                          ${esCritico 
                            ? 'bg-red-900/50 text-white' 
                            : 'bg-white/30 text-white'
                          }
                        `}>
                          {diasRestantes === 0 ? '¡HOY!' : 
                           diasRestantes === 1 ? '¡MAÑANA!' : 
                           `${diasRestantes} días restantes`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón cerrar */}
                <button
                  onClick={() => cerrarNotificacion(pago.id)}
                  className="flex-shrink-0 ml-4 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200 group"
                  title="Cerrar notificación"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Barra de progreso inferior */}
            <div className="h-1 bg-white/20">
              <div 
                className="h-full bg-white transition-all duration-1000"
                style={{ 
                  width: `${Math.max(10, (diasRestantes / 7) * 100)}%`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* CSS para animaciones */}
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;