import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PagosPage from "./pages/PagosPage";
import IdiomasPage from "./pages/IdiomasPage";
import ServiciosPage from "./pages/ServiciosPage";
import PerfilPage from "./pages/PerfilPage";
import LogoutPage from "./pages/LogoutPage";
import NotFound from './pages/NotFound';
import './index.css';
import JefaturaPage from "./pages/JefaturaPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta pública - Login */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas con Layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Rutas anidadas dentro del Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="idiomas" element={<IdiomasPage />} />
            <Route path="servicios" element={<ServiciosPage />} />
            <Route path="perfil" element={<PerfilPage />} />
            <Route path="jefatura" element={<JefaturaPage />} />
            <Route path="cerrar-sesion" element={<LogoutPage />} />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;