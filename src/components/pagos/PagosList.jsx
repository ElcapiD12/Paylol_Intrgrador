function PagosList() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Pagos</h2>
      
      {/* TODO PROGRAMADOR 3:
          - Lista de pagos disponibles (colegiatura, inscripción, etc)
          - Botón "Pagar" para cada concepto
          - Mostrar monto y fecha de vencimiento
          - Crear componente PagoForm para procesar pago
          - Crear componente Recibo para generar PDF
      */}
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Colegiatura Octubre 2025</h3>
              <p className="text-sm text-gray-500">Vencimiento: 31/10/2025</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">$5,000.00</p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Pagar
              </button>
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-center">Módulo en construcción...</p>
      </div>
    </div>
  );
}

export default PagosList;