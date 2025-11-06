import React, { useState } from 'react';
import { Card, Button, Table, Badge, Modal, Input } from '../shared';
import { formatCurrency, formatDateShort } from '../../utils/helpers';
import { MONTOS, ESTADOS_EXTRAORDINARIO, ESTADOS_SOLICITUD } from '../../utils/constants';
import { extraordinariosEjemplo } from '../../data/mockData';

const ExtraordinariosList = () => {
  const [busqueda, setBusqueda] = useState('');
  const [extraordinarios, setExtraordinarios] = useState(extraordinariosEjemplo);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Filtrar materias por texto
  const filtrados = extraordinarios.filter((e) =>
    e.materia.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Abrir modal de confirmación
  const solicitarExtraordinario = (extra) => {
    setSeleccionado(extra);
    setMostrarModal(true);
  };

  // Confirmar solicitud
  const confirmarSolicitud = () => {
    setExtraordinarios((prev) =>
      prev.map((e) =>
        e.id === seleccionado.id
          ? { ...e, estado: ESTADOS_SOLICITUD.SOLICITADO }
          : e
      )
    );
    setMostrarModal(false);
  };

  return (
    <div>
      <h2>📘 Lista de Materias para Extraordinarios</h2>

      <Input
        placeholder="Buscar materia..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />

      <Table>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Profesor</th>
            <th>Fecha</th>
            <th>Costo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map((extra) => (
            <tr key={extra.id}>
              <td>{extra.materia}</td>
              <td>{extra.profesor}</td>
              <td>{formatDateShort(extra.fecha)}</td>
              <td>{formatCurrency(MONTOS.extraordinario)}</td>
              <td>
                <Badge>{extra.estado}</Badge>
              </td>
              <td>
                {extra.estado === ESTADOS_SOLICITUD.DISPONIBLE && (
                  <Button onClick={() => solicitarExtraordinario(extra)}>
                    Solicitar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de confirmación */}
      {mostrarModal && (
        <Modal
          title="Confirmar Solicitud"
          onClose={() => setMostrarModal(false)}
          onConfirm={confirmarSolicitud}
        >
          <p>
            ¿Deseas solicitar el extraordinario de{' '}
            <strong>{seleccionado.materia}</strong>?
          </p>
          <p>
            Costo: <strong>{formatCurrency(MONTOS.extraordinario)}</strong>
          </p>
        </Modal>
      )}
    </div>
  );
};

export default ExtraordinariosList;
