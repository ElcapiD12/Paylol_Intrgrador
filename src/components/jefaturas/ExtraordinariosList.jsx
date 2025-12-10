// src/components/jefaturas/ExtraordinariosList.jsx

import React, { useState, useEffect, useMemo } from 'react'; 
import { 
  Card, 
  Button, 
  Table, 
  Badge, 
  Modal, 
  Input,
  Loader,
  EmptyState
} from '../shared'; 

import {
  obtenerExtraordinarios,
  solicitarExtraordinario
} from "../../services/jefaturasService.js";
import { useAuth } from '../../context/AuthContext'; 

import { formatCurrency, formatDateShort } from '../../utils/helpers'; 
import { MONTOS } from '../../utils/constants'; 

const ExtraordinariosList = () => {
    const { user } = useAuth();
    const [busqueda, setBusqueda] = useState('');
    const [extraordinarios, setExtraordinarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [seleccionado, setSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const fetchExtraordinarios = async () => {
      setLoading(true);
      try {
          const data = await obtenerExtraordinarios(user?.id); 
          setExtraordinarios(data);
          setError(null);
      } catch (err) {
          console.error("Error al cargar extraordinarios:", err);
          setError("No se pudieron cargar los extraordinarios disponibles.");
      } finally {
          setLoading(false);
      }
    };

    useEffect(() => {
        if (user) {
            fetchExtraordinarios();
        } else {
            setLoading(false);
            setError("Debe iniciar sesión para ver los extraordinarios.");
        }
    }, [user]);

    const filtrados = useMemo(() => {
        const disponibles = extraordinarios.filter(e => 
          e.estado === 'Disponible' || 
          (e.userId === user?.id && e.estado !== 'Disponible')
        );

        if (!busqueda) return disponibles;

        return disponibles.filter((e) =>
            e.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.profesor.toLowerCase().includes(busqueda.toLowerCase())
        );
    }, [extraordinarios, busqueda, user?.id]);

    const handleSolicitarClick = (extra) => {
        setSeleccionado(extra);
        setMostrarModal(true);
    };

    const confirmarSolicitud = async () => {
        if (!seleccionado || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await solicitarExtraordinario(seleccionado.id, user.id); 
            alert(`✅ Solicitud de ${seleccionado.materia} enviada con éxito.`);
            await fetchExtraordinarios(); 
        } catch (error) {
            console.error("Error al solicitar extraordinario:", error);
            alert(`❌ Error: ${error.message || 'No se pudo enviar la solicitud.'}`);
        } finally {
            setIsSubmitting(false);
            setMostrarModal(false);
            setSeleccionado(null);
        }
    };

    const columns = [
        { header: 'Materia', accessor: 'materia' },
        { header: 'Profesor', accessor: 'profesor' },
        { header: 'Fecha', accessor: 'fecha' },
        { header: 'Hora', accessor: 'hora' }, 
        { header: 'Costo', accessor: 'costo' },
        { header: 'Estado', accessor: 'estado' },
        { header: 'Acción', accessor: 'accion' },
    ];

    const data = filtrados.map((extra) => ({
        id: extra.id,
        materia: extra.materia,
        profesor: extra.profesor,
        fecha: formatDateShort(extra.fecha), 
        hora: extra.hora, 
        costo: formatCurrency(MONTOS.extraordinario),
        estado: <Badge estado={extra.estado} />,
        accion: (
            <>
                {extra.estado === 'Disponible' && (
                    <Button type="primary" onClick={() => handleSolicitarClick(extra)}>
                        Solicitar
                    </Button>
                )}
                {extra.estado !== 'Disponible' && (
                    <Button 
                        type={extra.estado === 'Rechazado' ? 'danger' : 'secondary'} 
                        disabled
                    >
                        {extra.estado}
                    </Button>
                )}
            </>
        ),
    }));

    if (loading) return <Loader />;
    if (error) return <EmptyState message={error} />;
    if (filtrados.length === 0) return <EmptyState message="No hay extraordinarios disponibles." />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header con gradiente */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        📚 Extraordinarios Disponibles
                    </h1>
                    <p className="text-gray-600">Solicita tu examen extraordinario de manera fácil y rápida</p>
                </div>
                
                {/* Buscador */}
                <Card title="🔍 Buscar Materias">
                    <Input
                        placeholder="Buscar por materia o profesor..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="border-purple-200 focus:border-purple-400"
                    />
                </Card>

                {/* Tabla */}
                <Card title="📋 Lista de Exámenes">
                    <div className="overflow-hidden rounded-xl">
                        <Table 
                            columns={columns} 
                            data={data} 
                            keyAccessor="id" 
                            emptyMessage="No se encontraron materias."
                        />
                    </div>
                </Card>
            </div>

            {/* Modal */}
            <Modal
                isOpen={mostrarModal}
                title="✨ Confirmar Solicitud de Extraordinario"
                onClose={() => setMostrarModal(false)}
            >
                {seleccionado && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                            <p className="text-gray-700 mb-2">
                                Estás a punto de solicitar el examen extraordinario de{' '}
                                <strong className="text-purple-700">{seleccionado.materia}</strong> con el profesor{' '}
                                <strong className="text-purple-700">{seleccionado.profesor}</strong>.
                            </p>
                            <p className="font-semibold text-lg mt-3">
                                💰 Costo del examen:{' '}
                                <span className="text-emerald-600">
                                    {formatCurrency(MONTOS.extraordinario)}
                                </span>
                            </p>
                        </div>
                        
                        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                            📌 Al confirmar, tu solicitud será revisada por Jefatura de Carrera.
                        </p>
                        
                        <div className="flex gap-3 justify-end mt-6">
                            <Button 
                                type="secondary" 
                                onClick={() => setMostrarModal(false)} 
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={confirmarSolicitud} 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '⏳ Enviando...' : '✅ Confirmar Solicitud'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ExtraordinariosList;