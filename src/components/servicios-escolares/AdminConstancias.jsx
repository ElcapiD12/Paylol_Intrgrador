import AprobacionAdmin from '../components/servicios-escolares/AprobacionAdmin';

export default function AdminConstancias() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Administración de Constancias
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona las solicitudes de constancias escolares
          </p>
        </div>
        
        <AprobacionAdmin />
      </div>
    </div>
  );
}