const PaymentCards = ({ pagos }) => {
  // Calcular total de adeudos (pagos pendientes)
  const totalAdeudos = pagos
    .filter(pago => pago.estado === 'pendiente')
    .reduce((sum, pago) => sum + (pago.monto || 0), 0);

  // Obtener último pago (último pago con estado "pagado")
  const ultimoPago = pagos
    .filter(pago => pago.estado === 'pagado')
    .sort((a, b) => {
      const fechaA = a.fechaPago?.toDate?.() || new Date(a.fechaPago);
      const fechaB = b.fechaPago?.toDate?.() || new Date(b.fechaPago);
      return fechaB - fechaA;
    })[0];

  // Obtener próximo vencimiento (próximo pago pendiente)
  const proximoVencimiento = pagos
    .filter(pago => pago.estado === 'pendiente')
    .sort((a, b) => {
      const fechaA = a.fechaVencimiento?.toDate?.() || new Date(a.fechaVencimiento);
      const fechaB = b.fechaVencimiento?.toDate?.() || new Date(b.fechaVencimiento);
      return fechaA - fechaB;
    })[0];

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card: Total Adeudos - Mejorada */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border-l-4 border-red-500">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Total Adeudos</p>
              </div>
              <p className="text-4xl font-black text-gray-900 mt-3">
                {formatearMoneda(totalAdeudos)}
              </p>
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {pagos.filter(p => p.estado === 'pendiente').length} pagos pendientes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Último Pago - Mejorada */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border-l-4 border-green-500">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Último Pago</p>
              </div>
              <p className="text-4xl font-black text-gray-900 mt-3">
                {ultimoPago ? formatearMoneda(ultimoPago.monto) : '$0.00'}
              </p>
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {ultimoPago ? formatearFecha(ultimoPago.fechaPago) : 'Sin pagos realizados'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Próximo Vencimiento - Mejorada */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border-l-4 border-yellow-500">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Próximo Vencimiento</p>
              </div>
              <p className="text-4xl font-black text-gray-900 mt-3">
                {proximoVencimiento ? formatearMoneda(proximoVencimiento.monto) : '$0.00'}
              </p>
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {proximoVencimiento ? formatearFecha(proximoVencimiento.fechaVencimiento) : 'Sin pagos pendientes'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCards;