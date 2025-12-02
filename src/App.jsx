import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './components/auth/ForgotPassword';
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PagosPage from "./pages/PagosPage";
import IdiomasPage from "./pages/IdiomasPage";
import ServiciosPage from "./pages/ServiciosPage";
import PerfilPage from "./pages/PerfilPage";
import LogoutPage from "./pages/LogoutPage";
import JefaturaPage from "./pages/JefaturaPage";
import NotFound from './pages/NotFound';

// NUEVAS IMPORTACIONES - Constancias
import ServiciosEscolares from './pages/ServiciosEscolares';
import AdminConstancias from './pages/AdminConstancias';

import './assets/styles/theme.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="idiomas" element={<IdiomasPage />} />
          <Route path="servicios" element={<ServiciosPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="jefatura" element={<JefaturaPage />} />
          <Route path="cerrar-sesion" element={<LogoutPage />} />
          
          {/* NUEVAS RUTAS - Sistema de Constancias */}
          <Route path="servicios-escolares" element={<ServiciosEscolares />} />
          <Route path="admin-constancias" element={<AdminConstancias />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;