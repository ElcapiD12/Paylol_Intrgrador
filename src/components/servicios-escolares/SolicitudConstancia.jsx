import { useState } from 'react';
import { Card, Input, Select, Button } from '../shared/index';
import { TIPOS_CONSTANCIA, MONTOS } from '../../utils/constants';
import { formatCurrency, generarFolio } from '../../utils/helpers';

const SolicitudConstancia = ({ onSolicitudCreada }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    motivo: '',
    dirigidoA: ''
  });

  const [mostrarCosto, setMostrarCosto] = useState(false);

  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    setFormData({ ...formData, tipo });
    setMostrarCosto(tipo !== '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.tipo || !formData.motivo) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const nuevaSolicitud = {
      id: Date.now(),
      folio: generarFolio(),
      ...formData,
      costo: MONTOS.constancia,
      estado: 'pendiente',
      fecha: new Date().toISOString(),
      estudiante: 'Usuario Demo'
    };

    onSolicitudCreada(nuevaSolicitud);
    
    // Limpiar formulario
    setFormData({
      tipo: '',
      motivo: '',
      dirigidoA: ''
    });
    setMostrarCosto(false);
    
    alert('Solicitud creada exitosamente');
  };

  const handleLimpiar = () => {
    setFormData({ tipo: '', motivo: '', dirigidoA: '' });
    setMostrarCosto(false);
  };

  return (
    <Card title="Solicitar Constancia Académica">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Tipo de Constancia"
          value={formData.tipo}
          onChange={handleTipoChange}
          options={TIPOS_CONSTANCIA}
          required
        />

        {mostrarCosto && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Costo:</span> {formatCurrency(MONTOS.constancia)}
            </p>
          </div>
        )}

        <Input
          label="Motivo de la solicitud"
          type="text"
          placeholder="Ej: Trámite de beca, solicitud de empleo..."
          value={formData.motivo}
          onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          required
        />

        <Input
          label="Dirigido a (opcional)"
          type="text"
          placeholder="Ej: A quien corresponda, Empresa XYZ..."
          value={formData.dirigidoA}
          onChange={(e) => setFormData({ ...formData, dirigidoA: e.target.value })}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleLimpiar}
          >
            Limpiar
          </Button>
          <Button type="submit" variant="primary">
            Solicitar Constancia
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SolicitudConstancia