import React, { useState, useMemo } from 'react'; // Agregamos useMemo
// ¡Asegúrate de que estas rutas sean correctas!
import { Card, Button, Table, Badge, Modal } from '../shared';
import { formatDateShort } from '../../utils/helpers';
import { MONTOS, ESTADOS_EXTRAORDINARIO, ESTADOS_SOLICITUD } from '../../utils/constants';
import { extraordinariosEjemplo } from '../../data/mockData';

const Autorizaciones = () => {
  const [extraordinarios, setExtraordinarios] = useState(extraordinariosEjemplo);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accion, setAccion] = useState('');

  // Filtrar solo solicitudes pendientes (usamos useMemo para eficiencia)
  const pendientes = useMemo(() => {
    return extraordinarios.filter(
      (e) => e.estado === ESTADOS_SOLICITUD.SOLICITADO
    );
  }, [extraordinarios]);

  // Abrir modal para autorizar o rechazar
  const abrirModal = (extra, tipo) => {
    setSeleccionado(extra);
    setAccion(tipo);
    setMostrarModal(true);
  };

  // Confirmar acción (autorizar o rechazar)
  const confirmarAccion = () => {
    // Lógica para actualizar el estado local (En producción, aquí se haría la llamada a Firebase/API)
    setExtraordinarios((prev) =>
      prev.map((e) =>
        e.id === seleccionado.id
          ? {
              ...e,
              estado:
                accion === 'autorizar'
                  ? ESTADOS_SOLICITUD.AUTORIZADO
                  : ESTADOS_SOLICITUD.RECHAZADO,
            }
          : e
      )
    );
    setMostrarModal(false);
    setSeleccionado(null); // Limpiar selección
  };

  // 1. Definición de Columnas para el componente <Table>
  const columns = [
    { header: 'Materia', accessor: 'materia' },
    { header: 'Profesor', accessor: 'profesor' },
    { header: 'Fecha Solicitud', accessor: 'fechaSolicitud' },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Acciones', accessor: 'acciones' },
  ];

  // 2. Mapeo de Datos para el componente <Table>
  const data = pendientes.map((extra) => ({
    ...extra,
    // Asumiendo que 'fecha' en tu mockData es la fecha de solicitud
    fechaSolicitud: formatDateShort(extra.fecha), 
    estado: <Badge type="warning">{extra.estado}</Badge>,
    acciones: (
      <div className="flex gap-2">
        <Button
          type="success" // Usar 'type' si 'variant' no funciona
          onClick={() => abrirModal(extra, 'autorizar')}
        >
          Autorizar
        </Button>
        <Button
          type="danger" // Usar 'type' si 'variant' no funciona
          onClick={() => abrirModal(extra, 'rechazar')}
        >
          Rechazar
        </Button>
      </div>
    ),
  }));

  return (
    <div className="p-4">
      <Card title="🧾 Autorizaciones de Extraordinarios">
        {pendientes.length === 0 ? (
          <p className="text-gray-500">No hay solicitudes pendientes por autorizar.</p>
        ) : (
          /* Usar la Table con data y columns */
          <Table 
            columns={columns} 
            data={data} 
            keyAccessor="id" // Asegura que la clave sea 'id'
          />
        )}
      </Card>

      {/* Modal de confirmación */}
      <Modal
        isOpen={mostrarModal}
        title={
          accion === 'autorizar'
            ? 'Confirmar Autorización'
            : 'Confirmar Rechazo'
        }
        onClose={() => setMostrarModal(false)}
        footer={
            <>
                <Button onClick={() => setMostrarModal(false)} type="secondary">Cancelar</Button>
                <Button 
                    onClick={confirmarAccion} 
                    type={accion === 'autorizar' ? 'primary' : 'danger'}
                >
                    {accion === 'autorizar' ? 'Confirmar Autorización' : 'Confirmar Rechazo'}
                </Button>
            </>
        }
      >
        <p>
          ¿Seguro que deseas{' '}
          <strong className={accion === 'autorizar' ? 'text-green-600' : 'text-red-600'}>
            {accion === 'autorizar' ? 'autorizar' : 'rechazar'}
          </strong>{' '}
          el extraordinario de{' '}
          <strong>{seleccionado?.materia}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default Autorizaciones;