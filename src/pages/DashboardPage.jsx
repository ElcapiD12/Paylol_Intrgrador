//Página principal después de login

import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Bienvenido, {usuario?.email}
            </span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Adeudos</h3>
            <p className="text-3xl font-bold text-blue-600">$5,000.00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Último Pago</h3>
            <p className="text-3xl font-bold text-green-600">$3,000.00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Próximo Vencimiento</h3>
            <p className="text-3xl font-bold text-yellow-600">31 Oct</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            📝 Aquí el Programador 2 pondrá el Dashboard completo
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;