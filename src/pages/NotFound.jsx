//Página 404 (no encontrada)

import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Página no encontrada</p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFound;