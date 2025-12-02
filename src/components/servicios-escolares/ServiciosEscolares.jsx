import { SolicitudConstanciaDemo } from '../components/servicios-escolares/SolicitudConstanciaDemo';

export default function ServiciosEscolares() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Servicios Escolares
          </h1>
          <p className="text-gray-600 mt-2">
            Solicita y consulta tus constancias escolares
          </p>
        </div>
        
        <SolicitudConstanciaDemo />
      </div>
    </div>
  );
}