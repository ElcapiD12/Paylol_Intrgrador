import { Link, useLocation } from "react-router-dom";
import { FaHome, FaCreditCard, FaGlobe, FaUser, FaSignOutAlt, FaUniversity, FaChalkboardTeacher } from "react-icons/fa";
export default function Sidebar() {
  const location = useLocation();

  const links = [
  { name: "Dashboard", path: ".", icon: <FaHome /> },
  { name: "Pagos", path: "pagos", icon: <FaCreditCard /> },
  { name: "Idiomas", path: "idiomas", icon: <FaGlobe /> },
  { name: "Servicios Escolares", path: "servicios", icon: <FaUniversity /> },
  { name: "Jefatura", path: "jefatura", icon: <FaChalkboardTeacher /> },
  { name: "Mi Perfil", path: "perfil", icon: <FaUser /> },
  { name: "Cerrar Sesión", path: "cerrar-sesion", icon: <FaSignOutAlt /> },
];


  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col h-screen shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 text-2xl font-bold border-b border-blue-800">
        🎓 PAYLOL
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === link.path
                ? "bg-blue-700 text-white shadow-md"
                : "hover:bg-blue-800 hover:text-white text-blue-100"
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="text-center text-xs text-blue-300 py-4 border-t border-blue-800">
        © 2025 Sistema de Pagos
      </div>
    </aside>
  );
}