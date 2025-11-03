//Saber si el usuario está logueado
//Guardar información del usuario
//Compartir el estado en toda la app

//Este archivo maneja el estado global de autenticación.

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// 1. CREAR EL CONTEXTO (El tablero de anuncios)
const AuthContext = createContext();

// 2. PROVIDER (El que maneja la información)
export function AuthProvider({ children }) {
  // Estado: guarda el usuario actual
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true); // Mientras verifica si hay usuario

  // 3. EFECTO: Escuchar cambios en Firebase
  useEffect(() => {
    // Firebase nos avisa automáticamente si alguien hace login/logout
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Hay usuario logueado
        setUsuario(user);
      } else {
        // No hay usuario
        setUsuario(null);
      }
      setCargando(false); // Ya terminó de verificar
    });

    // Limpiar al desmontar
    return unsubscribe;
  }, []);

  // 4. FUNCIONES que compartimos
  const login = (user) => {
    setUsuario(user);
  };

  const logout = async () => {
    await auth.signOut();
    setUsuario(null);
  };

  // 5. VALORES que compartimos con toda la app
  const value = {
    usuario,        // El usuario actual
    login,          // Función para hacer login
    logout,         // Función para hacer logout
    cargando,       // ¿Está verificando?
  };

  // 6. Mientras carga, mostramos "Cargando..."
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // 7. Envolver toda la app con este contexto
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 8. HOOK personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}