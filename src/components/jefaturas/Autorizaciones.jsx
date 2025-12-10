// src/components/jefaturas/Autorizaciones.jsx

import React, { useState, useEffect, useMemo } from 'react'; 
import { Card, Button, Table, Badge, Modal, Loader, EmptyState } from '../shared';
import { formatCurrency, formatDateShort } from '../../utils/helpers';
import { MONTOS } from '../../utils/constants'; 
import { obtenerExtraordinarios, actualizarEstadoExtraordinario } from "../../services/jefaturasService.js";
import { useAuth } from '../../context/AuthContext'; 
import CalendarioExamenes from './CalendarioExamenes'; 

const Autorizaciones = () => {
    const { user } = useAuth();
    const [extraordinarios, setExtraordinarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [seleccionado, setSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [accion, setAccion] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchExtraordinarios = async () => {
        setLoading(true);
        try {
            const data = await obtenerExtraordinarios(user?.id); 
            setExtraordinarios(data);
            setError(null);
        } catch (err) {
            console.error("Error al cargar las solicitudes:", err);
            setError("Error al cargar las solicitudes de extraordinarios.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (user) { 
            fetchExtraordinarios();
        } else {
            setLoading(false);
            setError("Acceso denegado. Se requiere autenticación de Jefatura.");
        }
    }, [user]);
    
    const pendientesAprobacion = useMemo(() => {
        return extraordinarios.filter(e => e.estado === 'Solicitado');
    }, [extraordinarios]);

    const autorizadasPendientesPago = useMemo(() => {
        return extraordinarios.filter(e => e.estado === 'Autorizado');
    }, [extraordinarios]);

    const abrirModal = (extra, tipo) => {
        setSeleccionado(extra);
        setAccion(tipo);
        setMostrarModal(true);
    };

    const confirmarAccion = async () => {
        if (!seleccionado) return;

        setIsProcessing(true);
        
        let nuevoEstado;
        if (accion === 'autorizar') {
            nuevoEstado = 'Autorizado';
        } else if (accion === 'rechazar') {
            nuevoEstado = 'Rechazado';
        } else if (accion === 'pagar') {
            nuevoEstado = 'Pagado';
        } else {
            return;
        }

        try {
            await actualizarEstadoExtraordinario(seleccionado.id, nuevoEstado);
            await fetchExtraordinarios(); 
            setMostrarModal(false);
        } catch (err) {
            console.error("Error al confirmar acción:", err);
            alert(`❌ Error al procesar la acción de ${accion}.`); 
        } finally {
            setIsProcessing(false);
            setSeleccionado(null); 
            setAccion('');
        }
    };

    const columnsAprobacion = [
        { header: 'Estudiante', accessor: 'estudianteNombre' }, 
        { header: 'Materia', accessor: 'materia' },
        { header: 'Profesor', accessor: 'profesor' },
        { header: 'Fecha Examen', accessor: 'fecha' },
        { header: 'Costo', accessor: 'costo' },
        { header: 'Estado', accessor: 'estado' },
        { header: 'Acciones', accessor: 'acciones' },
    ];
    
    const columnsPago = [
        { header: 'Estudiante', accessor: 'estudianteNombre' },
        { header: 'Materia', accessor: 'materia' },
        { header: 'Fecha Examen', accessor: 'fecha' },
        { header: 'Costo', accessor: 'costo' },
        { header: 'Estado', accessor: 'estado' },
        { header: 'Validar Pago', accessor: 'validarPago' },
    ];

    const dataAprobacion = pendientesAprobacion.map((extra) => ({
        id: extra.id,
        estudianteNombre: extra.estudianteNombre || 'ID: ' + extra.userId || 'Desconocido',
        materia: extra.materia,
        profesor: extra.profesor,
        fecha: formatDateShort(extra.fecha), 
        costo: formatCurrency(MONTOS.extraordinario),
        estado: <Badge estado={extra.estado} />,
        acciones: (
            <div className="flex gap-2">
                <Button type="success" onClick={() => abrirModal(extra, 'autorizar')}>
                    ✓ Autorizar
                </Button>
                <Button type="danger" onClick={() => abrirModal(extra, 'rechazar')}>
                    ✕ Rechazar
                </Button>
            </div>
        ),
    }));
    
    const dataPago = autorizadasPendientesPago.map((extra) => ({
        id: extra.id,
        estudianteNombre: extra.estudianteNombre || 'ID: ' + extra.userId || 'Desconocido', 
        materia: extra.materia,
        fecha: formatDateShort(extra.fecha),
        costo: formatCurrency(MONTOS.extraordinario),
        estado: <Badge estado={extra.estado} />,
        validarPago: (
            <Button type="info" onClick={() => abrirModal(extra, 'pagar')}>
                💳 Validar Pago
            </Button>
        ),
    }));
    
    if (loading) return <Loader />;
    if (error) return <EmptyState message={error} />;

    const modalTitle = 
        accion === 'autorizar' ? '✅ Confirmar Autorización' :
        accion === 'rechazar' ? '❌ Confirmar Rechazo' :
        '💰 Validar Pago Realizado';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        🛂 Gestión de Solicitudes y Pagos
                    </h1>
                    <p className="text-gray-600">Panel de control para Jefatura de Carrera</p>
                </div>

                {/* Sección 1: Autorización */}
                <Card title="⏳ Solicitudes Pendientes de Aprobación">
                    <Table 
                        columns={columnsAprobacion} 
                        data={dataAprobacion} 
                        keyAccessor="id"
                        emptyMessage="🎉 No hay solicitudes pendientes por autorizar."
                    />
                </Card>
                
                {/* Sección 2: Validación de Pago */}
                <Card title="💳 Exámenes Autorizados Pendientes de Validación de Pago">
                    <Table 
                        columns={columnsPago} 
                        data={dataPago} 
                        keyAccessor="id"
                        emptyMessage="✅ Todos los exámenes autorizados han sido pagados."
                    />
                </Card>
                
                {/* Sección 3: Calendario */}
                <CalendarioExamenes extraordinarios={extraordinarios} />
            </div>

            {/* Modal */}
            <Modal
                isOpen={mostrarModal}
                title={modalTitle}
                onClose={() => setMostrarModal(false)}
            >
                <div className="space-y-4">
                    <div className={`p-4 rounded-xl border-2 ${
                        accion === 'autorizar' || accion === 'pagar' 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-rose-50 border-rose-200'
                    }`}>
                        <p className="text-gray-700">
                            ¿Desea{' '}
                            <strong className={accion === 'autorizar' || accion === 'pagar' ? 'text-emerald-700' : 'text-rose-700'}>
                                {accion === 'autorizar' ? 'autorizar' : accion === 'rechazar' ? 'rechazar' : 'confirmar el pago de'}
                            </strong>{' '}
                            la solicitud de{' '}
                            <strong className="text-purple-700">{seleccionado?.materia}</strong> 
                            {' '}solicitada por <strong className="text-purple-700">{seleccionado?.estudianteNombre || 'el estudiante'}</strong>?
                        </p>
                    </div>
                    
                    {accion === 'pagar' && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-blue-800">
                                📌 Esta acción finaliza la solicitud y programa el examen en el calendario.
                            </p>
                        </div>
                    )}
                    
                    <div className="flex gap-3 justify-end mt-6">
                        <Button 
                            onClick={() => setMostrarModal(false)} 
                            type="secondary" 
                            disabled={isProcessing}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={confirmarAccion} 
                            type={accion === 'autorizar' || accion === 'pagar' ? 'success' : 'danger'}
                            disabled={isProcessing}
                        >
                            {isProcessing ? '⏳ Procesando...' : 
                             accion === 'autorizar' ? '✅ Confirmar Autorización' :
                             accion === 'rechazar' ? '❌ Confirmar Rechazo' :
                             '💰 Confirmar Pago'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Autorizaciones;