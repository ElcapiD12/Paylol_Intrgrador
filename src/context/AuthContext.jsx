// src/context/AuthContext.jsx
// Contexto de autenticación con USUARIO DEMO para desarrollo

import { createContext, useContext, useState, useEffect } from 'react';

// 1. CREAR EL CONTEXTO
const AuthContext = createContext();

// 2. USUARIO DEMO (para pruebas sin Firebase)
const USUARIO_DEMO = {
  id: 'demo123',
  uid: 'demo123',
  email: 'jefatura@paylol.com',
  nombre: 'Jefatura Demo',
  rol: 'jefe_carrera',
  displayName: 'Jefatura Demo',
};

// 3. PROVIDER
export function AuthProvider({ children }) {
  // Estado: usuario siempre está logueado con el usuario DEMO
  const [usuario, setUsuario] = useState(USUARIO_DEMO);
  const [cargando, setCargando] = useState(false); // No hay carga porque ya tenemos usuario

  // 4. FUNCIONES
  const login = (user) => {
    setUsuario(user || USUARIO_DEMO);
  };

  const logout = () => {
    // En modo DEMO, no cerramos sesión, solo recargamos el usuario demo
    setUsuario(USUARIO_DEMO);
  };

  // 5. VALORES compartidos
  const value = {
    usuario,        // Siempre el usuario DEMO
    user: usuario,  // Alias para compatibilidad
    login,
    logout,
    cargando,
  };

  // 6. No hay carga, directamente renderizamos
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 7. HOOK personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// Exportación por defecto para compatibilidad
export default AuthContext;