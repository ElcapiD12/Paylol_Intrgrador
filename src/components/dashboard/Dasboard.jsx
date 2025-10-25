function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard - Sistema de Pagos
        </h1>
        
        {/* TODO PROGRAMADOR 2:
            - Crear Sidebar con navegación
            - Crear Header con perfil de usuario
            - Agregar cards de resumen (adeudos, pagos recientes)
            - Mostrar estado de cuenta
        */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Total Adeudos</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Último Pago</p>
            <p className="text-2xl font-bold">-</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Próximo Vencimiento</p>
            <p className="text-2xl font-bold">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;