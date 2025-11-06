import { useState } from 'react';
import { Card, Table, Badge, Button } from '../shared/index';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ESTADOS_SOLICITUD } from '../../utils/constants';

const AprobacionAdmin = ({ solicitudes, onCambiarEstado }) => {
  const [filtroEstado, setFiltroEstado] = useState('todas');

  const solicitudesFiltradas = filtroEstado === 'todas' 
    ? solicitudes 
    : solicitudes.filter(s => s.estado === filtroEstado);

  const handleAprobar = (solicitud) => {
    if (window.confirm(`¿Aprobar la solicitud ${solicitud.folio}?`)) {
      onCambiarEstado(solicitud.id, 'aprobado');
    }
  };

  const handleRechazar = (solicitud) => {
    const motivo = window.prompt('Motivo del rechazo:');
    if (motivo) {
      onCambiarEstado(solicitud.id, 'rechazado', motivo);
    }
  };

  const columns = [
    {
      key: 'folio',
      label: 'Folio',
      render: (solicitud) => (
        <span className="font-mono text-sm font-semibold">{solicitud.folio}</span>
      )
    },
    {
      key: 'estudiante',
      label: 'Estudiante'
    },
    {
      key: 'tipo',
      label: 'Tipo'
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (solicitud) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 truncate">{solicitud.motivo}</p>
          {solicitud.dirigidoA && (
            <p className="text-xs text-gray-500 mt-1">Para: {solicitud.dirigidoA}</p>
          )}
        </div>
      )
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (solicitud) => formatDate(solicitud.fecha)
    },
    {
      key: 'costo',
      label: 'Costo',
      render: (solicitud) => formatCurrency(solicitud.costo)
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (solicitud) => {
        const estadoConfig = ESTADOS_SOLICITUD[solicitud.estado];
        return (
          <Badge 
            variant={estadoConfig?.variant || 'default'} 
            text={estadoConfig?.label || solicitud.estado}
          />
        );
      }
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (solicitud) => (
        <div className="flex gap-2">
          {solicitud.estado === 'pendiente' && (
            <>
              <Button 
                size="sm" 
                variant="success"
                onClick={() => handleAprobar(solicitud)}
              >
                Aprobar
              </Button>
              <Button 
                size="sm" 
                variant="danger"
                onClick={() => handleRechazar(solicitud)}
              >
                Rechazar
              </Button>
            </>
          )}
          {solicitud.estado !== 'pendiente' && (
            <span className="text-sm text-gray-500">-</span>
          )}
        </div>
      )
    }
  ];

  const contadores = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
    aprobadas: solicitudes.filter(s => s.estado === 'aprobado').length,
    rechazadas: solicitudes.filter(s => s.estado === 'rechazado').length
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">{contadores.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{contadores.pendientes}</p>
            <p className="text-sm text-gray-600 mt-1">Pendientes</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{contadores.aprobadas}</p>
            <p className="text-sm text-gray-600 mt-1">Aprobadas</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{contadores.rechazadas}</p>
            <p className="text-sm text-gray-600 mt-1">Rechazadas</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex gap-3">
          <Button 
            variant={filtroEstado === 'todas' ? 'primary' : 'secondary'}
            onClick={() => setFiltroEstado('todas')}
          >
            Todas
          </Button>
          <Button 
            variant={filtroEstado === 'pendiente' ? 'primary' : 'secondary'}
            onClick={() => setFiltroEstado('pendiente')}
          >
            Pendientes
          </Button>
          <Button 
            variant={filtroEstado === 'aprobado' ? 'primary' : 'secondary'}
            onClick={() => setFiltroEstado('aprobado')}
          >
            Aprobadas
          </Button>
          <Button 
            variant={filtroEstado === 'rechazado' ? 'primary' : 'secondary'}
            onClick={() => setFiltroEstado('rechazado')}
          >
            Rechazadas
          </Button>
        </div>
      </Card>

      {/* Tabla de solicitudes */}
      <Card title="Gestión de Solicitudes">
        <Table 
          columns={columns}
          data={solicitudesFiltradas}
          keyField="id"
        />
      </Card>
    </div>
  );
};

export default AprobacionAdmin;