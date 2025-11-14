//erifica si el usuario está autenticado
//Si SÍ → muestra la página
//Si NO → redirige a login

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  // Preguntamos al contexto: ¿hay usuario?
  const { usuario, cargando } = useAuth();

  // Si aún está cargando, no hacemos nada
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Verificando acceso...</div>
      </div>
    );
  }

  // Si NO hay usuario → Redirige a login
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // Si SÍ hay usuario → Muestra la página
  return children;
}

export default ProtectedRoute;