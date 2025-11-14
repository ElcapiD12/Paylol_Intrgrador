export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Bienvenido al Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Sistema de Pagos Escolares
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Estudiante</p>
              <p className="font-semibold">Juan Pérez</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              JP
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-medium">Total Adeudos</p>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-red-600">$5,000.00</p>
          <p className="text-sm text-gray-500 mt-2">1 pago pendiente</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-medium">Último Pago</p>
            <span className="text-3xl">✅</span>
          </div>
          <p className="text-3xl font-bold text-green-600">$3,000.00</p>
          <p className="text-sm text-gray-500 mt-2">15 Oct 2024</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-medium">Próximo Vencimiento</p>
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">31 Oct</p>
          <p className="text-sm text-gray-500 mt-2">Colegiatura</p>
        </div>
      </div>

      {/* Resto del contenido... */}
    </div>
  );
}