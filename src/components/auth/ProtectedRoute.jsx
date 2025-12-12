import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { usuario, loading } = useAuth();

  // 🔍 LOGS DE DEBUG (puedes quitarlos después)
  console.log("🛡️ ProtectedRoute verificando:");
  console.log("  - Loading:", loading);
  console.log("  - Usuario:", usuario?.email);
  console.log("  - Rol del usuario:", usuario?.rol);
  console.log("  - Roles permitidos:", allowedRoles);

  // Si aún está cargando, mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center original-bg">
        <div className="text-xl text-white">Verificando acceso...</div>
      </div>
    );
  }

  // Si NO hay usuario → Redirige a login
  if (!usuario) {
    console.log("❌ No hay usuario, redirigiendo a login");
    return <Navigate to="/" replace />;
  }

  // Si se especificaron roles permitidos, verificar que el usuario tenga uno
  if (allowedRoles && allowedRoles.length > 0) {
    const tieneAcceso = allowedRoles.includes(usuario.rol);
    
    console.log("  - ¿Tiene acceso?:", tieneAcceso);
    
    if (!tieneAcceso) {
      console.log(`❌ Acceso denegado. Usuario con rol "${usuario.rol}" no puede acceder.`);
      console.log(`   Se requiere uno de estos roles: [${allowedRoles.join(", ")}]`);
      
      // Mostrar mensaje de error y redirigir
      return (
        <div className="min-h-screen flex items-center justify-center original-bg">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded max-w-md">
            <h3 className="font-bold text-lg mb-2">🚫 Acceso Denegado</h3>
            <p className="mb-2">No tienes permisos para acceder a esta sección.</p>
            <p className="text-sm">Tu rol actual: <strong>{usuario.rol}</strong></p>
            <p className="text-sm">Roles requeridos: <strong>{allowedRoles.join(", ")}</strong></p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              ← Volver
            </button>
          </div>
        </div>
      );
    }
  }

  console.log("✅ Acceso permitido");
  // Si llegó aquí, tiene acceso
  return children;
}

export default ProtectedRoute;