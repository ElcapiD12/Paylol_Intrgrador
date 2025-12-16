// src/pages/PagosPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import PagosList from '../components/pagos/PagosList';  // Vista del alumno
import PagosAdmin from '../components/admin/PagosAdmin'; // Vista del admin

function PagosPage() {
  const { usuario } = useAuth();
  
  // Si no hay usuario (por seguridad extra)
  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // Determinar qué vista mostrar según el rol
  const esAdmin = usuario.rol === 'admin_pagos' || usuario.rol === 'admin';
  const esAlumno = usuario.rol === 'alumno';
  
  // ADMIN DE PAGOS - Mostrar panel de administración
  if (esAdmin) {
    return (
      <div>
        {/* Header opcional para identificar que estás en modo admin */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-3">👨‍💼</span>
            <div>
              <p className="font-semibold text-purple-800">Modo Administrador</p>
              <p className="text-sm text-purple-600">Panel de gestión de pagos</p>
            </div>
          </div>
        </div>
        
        <PagosAdmin />
      </div>
    );
  }
  
  // ALUMNO - Mostrar vista de pagos personales
  if (esAlumno) {
    return (
      <div>
        {/* Header para alumnos */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💳 Mis Pagos</h1>
          <p className="text-gray-600">Consulta y realiza tus pagos escolares</p>
        </div>
        
        <PagosList />
      </div>
    );
  }
  
  // Si el rol no es ni admin ni alumno (no debería pasar por el ProtectedRoute)
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="text-5xl mb-4">🚫</div>
        <p className="text-xl text-gray-600 mb-2">Acceso no autorizado</p>
        <p className="text-gray-500">Tu rol no tiene permisos para ver esta sección</p>
      </div>
    </div>
  );
}

export default PagosPage;