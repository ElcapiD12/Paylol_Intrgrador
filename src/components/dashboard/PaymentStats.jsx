const PaymentStats = ({ pagos }) => {
  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    // Total pagado este mes
    const totalPagadoMes = pagos
      .filter(pago => {
        if (pago.estado !== 'pagado') return false;
        const fechaPago = pago.fechaPago?.toDate?.() || new Date(pago.fechaPago);
        return fechaPago >= inicioMes && fechaPago <= finMes;
      })
      .reduce((sum, pago) => sum + (pago.monto || 0), 0);

    // Promedio de pagos
    const pagosPagados = pagos.filter(p => p.estado === 'pagado');
    const promedioPagos = pagosPagados.length > 0
      ? pagosPagados.reduce((sum, pago) => sum + (pago.monto || 0), 0) / pagosPagados.length
      : 0;

    // Total de pagos realizados
    const totalPagosRealizados = pagosPagados.length;

    // Pagos pendientes
    const pagosPendientes = pagos.filter(p => p.estado === 'pendiente').length;

    // Último pago realizado
    const ultimoPago = pagosPagados.sort((a, b) => {
      const fechaA = a.fechaPago?.toDate?.() || new Date(a.fechaPago);
      const fechaB = b.fechaPago?.toDate?.() || new Date(b.fechaPago);
      return fechaB - fechaA;
    })[0];

    // Días desde el último pago
    const diasDesdeUltimoPago = ultimoPago
      ? Math.floor((hoy - (ultimoPago.fechaPago?.toDate?.() || new Date(ultimoPago.fechaPago))) / (1000 * 60 * 60 * 24))
      : null;

    return {
      totalPagadoMes,
      promedioPagos,
      totalPagosRealizados,
      pagosPendientes,
      diasDesdeUltimoPago
    };
  };

  const stats = calcularEstadisticas();

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(monto || 0);
  };

  const estadisticas = [
    {
      titulo: 'Pagado Este Mes',
      valor: formatearMoneda(stats.totalPagadoMes),
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      descripcion: 'Total del mes actual'
    },
    {
      titulo: 'Promedio de Pagos',
      valor: formatearMoneda(stats.promedioPagos),
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      descripcion: 'Promedio por pago'
    },
    {
      titulo: 'Pagos Completados',
      valor: stats.totalPagosRealizados,
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      descripcion: 'Total histórico'
    },
    {
      titulo: 'Pagos Pendientes',
      valor: stats.pagosPendientes,
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      descripcion: 'Por pagar'
    },
    {
      titulo: 'Último Pago',
      valor: stats.diasDesdeUltimoPago !== null 
        ? `Hace ${stats.diasDesdeUltimoPago} ${stats.diasDesdeUltimoPago === 1 ? 'día' : 'días'}`
        : 'Sin pagos',
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      descripcion: 'Actividad reciente'
    }
  ];

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <svg className="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Estadísticas Generales
        </h2>
        <p className="text-sm text-gray-600 mt-1 ml-10">Resumen de tu actividad de pagos</p>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {estadisticas.map((stat, index) => (
          <div
            key={index}
            className={`
              relative overflow-hidden rounded-xl shadow-md hover:shadow-xl 
              transform hover:scale-105 transition-all duration-300
              bg-gradient-to-br ${stat.bgColor} border-2 border-white
            `}
            style={{ 
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/30 rounded-full blur-2xl"></div>
            
            {/* Contenido */}
            <div className="relative p-5">
              {/* Icono */}
              <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                <div className={stat.iconColor}>
                  {stat.icono}
                </div>
              </div>

              {/* Título */}
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                {stat.titulo}
              </p>

              {/* Valor */}
              <p className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.valor}
              </p>

              {/* Descripción */}
              <p className="text-xs text-gray-500 font-medium">
                {stat.descripcion}
              </p>
            </div>

            {/* Borde inferior con gradiente */}
            <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default PaymentStats;