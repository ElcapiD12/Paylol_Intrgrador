import { Card, Table, Badge, EmptyState } from '../shared/index';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ESTADOS_SOLICITUD } from '../../utils/constants';

const ListaSolicitudes = ({ solicitudes }) => {
  const columns = [
    {
      key: 'folio',
      label: 'Folio',
      render: (solicitud) => (
        <span className="font-mono text-sm">{solicitud.folio}</span>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo de Constancia'
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (solicitud) => (
        <span className="text-sm text-gray-600 max-w-xs truncate block">
          {solicitud.motivo}
        </span>
      )
    },
    {
      key: 'fecha',
      label: 'Fecha de Solicitud',
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
    }
  ];

  if (!solicitudes || solicitudes.length === 0) {
    return (
      <Card title="Mis Solicitudes">
        <EmptyState 
          message="No tienes solicitudes de constancias"
          description="Crea tu primera solicitud usando el formulario de arriba"
        />
      </Card>
    );
  }

  return (
    <Card title="Mis Solicitudes">
      <Table 
        columns={columns}
        data={solicitudes}
        keyField="id"
      />
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Total de solicitudes:</span> {solicitudes.length}
        </p>
      </div>
    </Card>
  );
};

export default ListaSolicitudes;