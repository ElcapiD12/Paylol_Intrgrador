import React, { useState } from 'react';
import { Table, Badge, Button } from '../shared';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { pagosEjemplo } from '../../data/mockData';
import { ESTADOS_PAGO } from '../../utils/constants';
import Recibo from './Recibo';

const HistorialPagos = () => {
  const [filtro, setFiltro] = useState('todos');
  
  // Filtrar pagos según estado
  const getPagosFiltrados = () => {
    if (filtro === 'todos') return pagosEjemplo;
    return pagosEjemplo.filter(p => p.estado === filtro);
  };

  const pagosFiltrados = getPagosFiltrados();

  const columns = [
    { key: 'fecha', title: 'Fecha' },
    { key: 'concepto', title: 'Concepto' },
    { key: 'monto', title: 'Monto' },
    { key: 'estado', title: 'Estado' },
    { key: 'folio', title: 'Folio' },
    { key: 'acciones', title: 'Acciones' },
  ];

  const getBadgeColor = (estado) => {
    switch (estado) {
      case ESTADOS_PAGO.PAGADO: return 'success';
      case ESTADOS_PAGO.PENDIENTE: return 'warning';
      case ESTADOS_PAGO.VENCIDO: return 'danger';
      default: return 'secondary';
    }
  };

  const handleGenerarRecibo = (pago) => {
    const datosRecibo = {
      concepto: pago.concepto,
      monto: pago.monto,
      folio: pago.folio || 'FOL-' + Date.now(),
      fecha: pago.fechaPago ? formatDate(pago.fechaPago) : formatDate(new Date()),
      estudiante: "Juan Pérez",
      matricula: "A12345678"
    };
    
    Recibo.generarPDF(datosRecibo);
  };

  const rows = pagosFiltrados.map((pago) => ({
    fecha: pago.fechaPago ? formatDate(pago.fechaPago) : '--/--/----',
    concepto: pago.concepto,
    monto: formatCurrency(pago.monto),
    estado: <Badge type={getBadgeColor(pago.estado)}>{pago.estado}</Badge>,
    folio: pago.folio ? (
      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{pago.folio}</code>
    ) : 'N/A',
    acciones: pago.estado === ESTADOS_PAGO.PAGADO ? (
      <Button 
        onClick={() => handleGenerarRecibo(pago)}
        size="small"
      >
        📄 Recibo
      </Button>
    ) : (
      <span className="text-gray-400">--</span>
    ),
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Historial de Pagos</h2>
        
        {/* Filtros */}
        <div className="flex gap-2">
          <Button 
            onClick={() => setFiltro('todos')}
            className={filtro === 'todos' ? 'bg-blue-600' : 'bg-gray-300 text-gray-700'}
            size="small"
          >
            Todos
          </Button>
          <Button 
            onClick={() => setFiltro(ESTADOS_PAGO.PAGADO)}
            className={filtro === ESTADOS_PAGO.PAGADO ? 'bg-green-600' : 'bg-gray-300 text-gray-700'}
            size="small"
          >
            Pagados
          </Button>
          <Button 
            onClick={() => setFiltro(ESTADOS_PAGO.PENDIENTE)}
            className={filtro === ESTADOS_PAGO.PENDIENTE ? 'bg-yellow-600' : 'bg-gray-300 text-gray-700'}
            size="small"
          >
            Pendientes
          </Button>
        </div>
      </div>

      {pagosFiltrados.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay pagos</h3>
          <p className="text-gray-500">No se encontraron pagos con el filtro seleccionado.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Mostrando {pagosFiltrados.length} pagos
            {filtro !== 'todos' && ` (filtrado por: ${filtro})`}
          </p>
          
          <Table columns={columns} data={rows} />
          
          {/* Resumen */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Resumen:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Pagados</p>
                <p className="text-xl font-bold text-green-700">
                  {formatCurrency(
                    pagosFiltrados
                      .filter(p => p.estado === ESTADOS_PAGO.PAGADO)
                      .reduce((sum, p) => sum + p.monto, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-xl font-bold text-yellow-700">
                  {pagosFiltrados.filter(p => p.estado === ESTADOS_PAGO.PENDIENTE).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-xl font-bold text-red-700">
                  {pagosFiltrados.filter(p => p.estado === ESTADOS_PAGO.VENCIDO).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Registros</p>
                <p className="text-xl font-bold text-blue-700">{pagosFiltrados.length}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HistorialPagos;