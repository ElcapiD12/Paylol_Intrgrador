import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { id: 'pagos', label: 'Pagos', icon: '💳', path: '/pagos' },
    { id: 'idiomas', label: 'Idiomas', icon: '🌐', path: '/idiomas' },
    { id: 'servicios', label: 'Servicios Escolares', icon: '📋', path: '/servicios-escolares' },
    { id: 'perfil', label: 'Mi Perfil', icon: '👤', path: '/perfil' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-blue-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header del Sidebar */}
        <div className="p-4 flex items-center justify-between border-b border-blue-800">
          {sidebarOpen && (
            <h2 className="text-xl font-bold">PAYLOL</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-blue-800 transition"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center px-6 py-3 hover:bg-blue-800 transition-colors text-left"
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && (
                <span className="ml-4 font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Botón de cerrar sesión */}
        <div className="absolute bottom-0 w-full border-t border-blue-800">
          <button
            onClick={() => {
              // Aquí iría tu lógica de logout
              navigate('/');
            }}
            className="w-full flex items-center px-6 py-4 hover:bg-red-700 transition-colors"
          >
            <span className="text-2xl">🚪</span>
            {sidebarOpen && (
              <span className="ml-4 font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8">
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
                <p className="font-semibold"></p>
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

        {/* Accesos Rápidos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/pagos')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
            >
              <div className="text-4xl mb-2">💳</div>
              <p className="font-semibold text-gray-700">Realizar Pago</p>
            </button>

            <button
              onClick={() => navigate('/idiomas')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
            >
              <div className="text-4xl mb-2">🌐</div>
              <p className="font-semibold text-gray-700">Centro de Idiomas</p>
            </button>

            <button
              onClick={() => navigate('/servicios-escolares')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
            >
              <div className="text-4xl mb-2">📋</div>
              <p className="font-semibold text-gray-700">Servicios Escolares</p>
            </button>

            <button
              onClick={() => navigate('/perfil')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
            >
              <div className="text-4xl mb-2">👤</div>
              <p className="font-semibold text-gray-700">Mi Perfil</p>
            </button>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Pago de Inscripción</p>
                  <p className="text-sm text-gray-500">15 de octubre, 2024</p>
                </div>
              </div>
              <p className="font-bold text-green-600">$3,000.00</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📚</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Registro de Libro - Inglés</p>
                  <p className="text-sm text-gray-500">12 de octubre, 2024</p>
                </div>
              </div>
              <p className="font-bold text-blue-600">$800.00</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Solicitud de Constancia</p>
                  <p className="text-sm text-gray-500">10 de octubre, 2024</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                Pendiente
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;