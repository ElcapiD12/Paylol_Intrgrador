import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PagosPage from "./pages/PagosPage";
import IdiomasPage from "./pages/IdiomasPage";
import ServiciosPage from "./pages/ServiciosPage";
import PerfilPage from "./pages/PerfilPage";
import LogoutPage from "./pages/LogoutPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Agrupamos las rutas dentro del layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="idiomas" element={<IdiomasPage />} />
          <Route path="servicios" element={<ServiciosPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="cerrar-sesion" element={<LogoutPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;