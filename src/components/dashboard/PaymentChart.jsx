import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const PaymentChart = ({ pagos }) => {
  // Agrupar pagos por mes
  const agruparPorMes = () => {
    const meses = {};
    
    pagos.forEach(pago => {
      const fecha = pago.createdAt?.toDate?.() || new Date(pago.createdAt);
      const mesYear = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      const nombreMes = fecha.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
      
      if (!meses[mesYear]) {
        meses[mesYear] = {
          mes: nombreMes,
          total: 0,
          pagados: 0,
          pendientes: 0,
          fecha: fecha
        };
      }
      
      meses[mesYear].total += pago.monto || 0;
      
      if (pago.estado === 'pagado') {
        meses[mesYear].pagados += pago.monto || 0;
      } else if (pago.estado === 'pendiente') {
        meses[mesYear].pendientes += pago.monto || 0;
      }
    });
    
    return Object.values(meses).sort((a, b) => a.fecha - b.fecha);
  };

  const datos = agruparPorMes();

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Tooltip personalizado y moderno
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-2xl p-4">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{entry.name}:</span>
                </div>
                <span className="text-sm font-black text-gray-900">
                  {formatearMoneda(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calcular totales para las estadísticas
  const totalPagado = datos.reduce((sum, d) => sum + d.pagados, 0);
  const totalPendiente = datos.reduce((sum, d) => sum + d.pendientes, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header con estadísticas */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pagos por Mes</h2>
            <p className="text-sm text-gray-600 mt-1">Distribución de pagos realizados y pendientes</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        {/* Mini estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Total Pagado</p>
                <p className="text-xl font-black text-green-600">{formatearMoneda(totalPagado)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Total Pendiente</p>
                <p className="text-xl font-black text-orange-600">{formatearMoneda(totalPendiente)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfica */}
      <div className="p-6">
        {datos.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-bold text-lg">No hay datos suficientes</p>
            <p className="text-sm text-gray-500 mt-2">Los datos de pagos aparecerán aquí una vez registrados</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={datos}>
              <defs>
                {/* Degradado para Pagados */}
                <linearGradient id="colorPagados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                {/* Degradado para Pendientes */}
                <linearGradient id="colorPendientes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              
              <XAxis 
                dataKey="mes" 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                stroke="#d1d5db"
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                stroke="#d1d5db"
                tickFormatter={formatearMoneda}
                tickLine={false}
                axisLine={false}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => (
                  <span className="font-bold text-gray-700">{value}</span>
                )}
              />
              
              {/* Área de Pagados */}
              <Area
                type="monotone"
                dataKey="pagados"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#colorPagados)"
                name="Pagados"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              
              {/* Área de Pendientes */}
              <Area
                type="monotone"
                dataKey="pendientes"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#colorPendientes)"
                name="Pendientes"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer con leyenda adicional */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <span className="text-gray-600 font-medium">Pagos completados</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600"></div>
            <span className="text-gray-600 font-medium">Pagos pendientes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentChart;