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
import AdminUsuarios from './pages/AdminUsuarios';

// NUEVAS IMPORTACIONES - Constancias
import ServiciosEscolares from './pages/ServiciosEscolares';
import AdminConstancias from './pages/AdminConstancias';

// NUEVA IMPORTACIÓN - Admin Idiomas
import AdminExamenesOxford from './components/idiomas/AdminExamenesOxford';
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
            <ProtectedRoute allowedRoles={["alumno","jefe_carrera","admin_pagos","admin_idiomas","admin_servicios","admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<DashboardPage />} />

          <Route
            path="pagos"
            element={
              <ProtectedRoute allowedRoles={["admin_pagos","alumno"]}>
                <PagosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="idiomas"
            element={
              <ProtectedRoute allowedRoles={["alumno","admin_idiomas"]}>
                <IdiomasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="servicios"
            element={
              <ProtectedRoute allowedRoles={["alumno","admin_servicios"]}>
                <ServiciosPage />
              </ProtectedRoute>
            }
          />

          <Route path="perfil" element={<PerfilPage />} />

          <Route
            path="jefatura"
            element={
              <ProtectedRoute allowedRoles={["jefe_carrera"]}>
                <JefaturaPage />
              </ProtectedRoute>
            }
          />

          <Route path="cerrar-sesion" element={<LogoutPage />} />

          {/* Constancias */}
          <Route
            path="servicios-escolares"
            element={
              <ProtectedRoute allowedRoles={["admin_servicios"]}>
                <ServiciosEscolares />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin-usuarios"
            element={
            <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsuarios />
           </ProtectedRoute>
           }
          />

          <Route
            path="admin-constancias"
            element={
              <ProtectedRoute allowedRoles={["admin_servicios"]}>
                <AdminConstancias />
              </ProtectedRoute>
            }
          />

          {/* Admin Idiomas */}
          <Route
            path="admin-idiomas"
            element={
              <ProtectedRoute allowedRoles={["admin_idiomas"]}>
                <AdminExamenesOxford />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}


export default App;
