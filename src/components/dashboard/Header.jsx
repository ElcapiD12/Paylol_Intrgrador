import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useState } from 'react';

const Header = ({ nombreUsuario }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/dashboard/pagos', label: 'Pagos', icon: '💳' },
    { path: '/dashboard/idiomas', label: 'Idiomas', icon: '🌐' },
    { path: '/dashboard/servicios', label: 'Servicios Escolares', icon: '🎓' },
    { path: '/dashboard/jefatura', label: 'Jefatura', icon: '👔' },
    { path: '/dashboard/perfil', label: 'Mi Perfil', icon: '👤' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMenuMovilAbierto(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-gray-100">
      {/* Barra superior con título y perfil */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">PAYLOL</h1>
                <p className="text-xs text-blue-100 font-medium">Sistema de Pagos Escolares</p>
              </div>
            </div>

            {/* Perfil del usuario - Desktop */}
            <div className="hidden md:flex items-center space-x-3 group relative">
              <div className="text-right">
                <p className="text-sm font-bold text-white">{nombreUsuario}</p>
                <p className="text-xs text-blue-100">Estudiante</p>
              </div>
              
              {/* Avatar con iniciales */}
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg ring-2 ring-white/30 group-hover:ring-white/60 transition-all">
                  <span className="text-blue-600 font-black text-lg">
                    {nombreUsuario?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>

                {/* Tooltip con información completa al pasar el mouse */}
                <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="p-5">
                    {/* Header del tooltip */}
                    <div className="flex items-center space-x-4 mb-4 pb-4 border-b-2 border-gray-100">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-2xl">
                          {nombreUsuario?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg">{nombreUsuario}</p>
                        <p className="text-sm text-gray-500 font-medium">Estudiante Activo</p>
                      </div>
                    </div>
                    
                    {/* Información del usuario */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Rol</p>
                          <p className="text-sm text-gray-900 font-bold">Estudiante</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Estado</p>
                          <p className="text-sm text-gray-900 font-bold">Activo</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Último acceso</p>
                          <p className="text-sm text-gray-900 font-bold">Hoy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="md:hidden w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuMovilAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de navegación - Desktop */}
      <nav className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  relative flex items-center space-x-2 px-4 py-4 text-sm font-bold transition-all duration-200
                  ${isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full"></div>
                )}
              </button>
            ))}
            
            {/* Botón Cerrar Sesión - Desktop */}
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center space-x-2 px-4 py-4 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Menú Móvil */}
      {menuMovilAbierto && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* Botón Cerrar Sesión - Móvil */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;