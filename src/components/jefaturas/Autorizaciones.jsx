import React, { useState, useEffect, useMemo } from 'react'; 
// Importaciones de Shared y Helpers
import { Card, Button, Table, Badge, Modal, Loader, EmptyState } from '../shared';
import { formatDateShort } from '../../utils/helpers';
// Importaciones de Constantes
import { MONTOS, ESTADOS_SOLICITUD } from '../../utils/constants'; 
// NO MODIFICAR: Reemplazamos mockData por Servicios y Auth
// SOLUCIÓN: Agregamos explícitamente la extensión .js al final
import { obtenerExtraordinarios, actualizarEstadoExtraordinario } from "../../services/jefaturasService.js";import { useAuth } from '../../context/AuthContext'; 


// Función auxiliar para determinar el color del Badge
const getBadgeType = (estado) => {
    switch (estado) {
        case ESTADOS_SOLICITUD.SOLICITADO: return 'warning'; // Pendiente de revisión
        case ESTADOS_SOLICITUD.AUTORIZADO: return 'info';    // Aprobado, Pendiente de Pago
        case ESTADOS_SOLICITUD.PAGADO: return 'success';     // Pago Confirmado
        case ESTADOS_SOLICITUD.RECHAZADO: return 'danger';   // Denegado
        default: return 'secondary';
    }
};

const Autorizaciones = () => {
    const { user } = useAuth(); // Usamos el contexto de autenticación
    const [extraordinarios, setExtraordinarios] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para Loader
    const [error, setError] = useState(null); // Estado para manejar errores

    const [seleccionado, setSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [accion, setAccion] = useState(''); // 'autorizar', 'rechazar' o 'pagar'
    const [isProcessing, setIsProcessing] = useState(false); // Para el botón de envío

    // 1. Carga inicial de datos desde el servicio
    const fetchExtraordinarios = async () => {
        setLoading(true);
        try {
            // Llama al servicio, asumiendo que trae las solicitudes relevantes para Jefatura
            const data = await obtenerExtraordinarios(user?.id); 
            setExtraordinarios(data);
            setError(null);
        } catch (err) {
            console.error("Error al cargar las solicitudes:", err);
            setError("Error al cargar las solicitudes de extraordinarios. Revise el servicio.");
        } finally {
            setLoading(false);
        }
    };
    
    // Ejecuta la carga de datos al montar y cuando el estado del usuario cambia
    useEffect(() => {
        if (user) { 
            fetchExtraordinarios();
        } else {
            setLoading(false);
            setError("Acceso denegado. Se requiere autenticación de Jefatura.");
        }
    }, [user]);
    
    // 2. Filtra solicitudes pendientes de APROBACIÓN ('Solicitado')
    const pendientesAprobacion = useMemo(() => {
        return extraordinarios.filter(
            (e) => e.estado === ESTADOS_SOLICITUD.SOLICITADO
        );
    }, [extraordinarios]);

    // 3. Filtra solicitudes AUTORIZADAS pendientes de PAGO (para validación)
    const autorizadasPendientesPago = useMemo(() => {
        return extraordinarios.filter(
            (e) => e.estado === ESTADOS_SOLICITUD.AUTORIZADO
        );
    }, [extraordinarios]);

    // Abrir modal para autorizar, rechazar o validar pago
    const abrirModal = (extra, tipo) => {
        setSeleccionado(extra);
        setAccion(tipo);
        setMostrarModal(true);
    };

    // Confirma la acción (llama al servicio)
    const confirmarAccion = async () => {
        if (!seleccionado) return;

        setIsProcessing(true);
        
        // Determina el nuevo estado a enviar al servicio
        let nuevoEstado;
        if (accion === 'autorizar') {
            nuevoEstado = ESTADOS_SOLICITUD.AUTORIZADO;
        } else if (accion === 'rechazar') {
            nuevoEstado = ESTADOS_SOLICITUD.RECHAZADO;
        } else if (accion === 'pagar') {
            nuevoEstado = ESTADOS_SOLICITUD.PAGADO;
        } else {
            nuevoEstado = seleccionado.estado; // No debe suceder
        }

        try {
            // Llama al servicio para actualizar el estado en la BD
            await actualizarEstadoExtraordinario(seleccionado.id, nuevoEstado);

            // Recarga los datos desde el servidor para reflejar el cambio en ambas tablas
            await fetchExtraordinarios(); 
            
            setMostrarModal(false);
        } catch (err) {
            console.error("Error al confirmar acción:", err);
            // Usar un modal o un mensaje de error compartido
            alert(`Error al procesar la acción de ${accion}.`); 
        } finally {
            setIsProcessing(false);
            setSeleccionado(null); 
            setAccion('');
        }
    };

    // --- Definición de Columnas y Datos ---

    // Columnas para la tabla de Aprobación (PENDIENTES)
    const columnsAprobacion = [
        { header: 'Materia', accessor: 'materia' },
        { header: 'Profesor', accessor: 'profesor' },
        { header: 'Fecha Examen', accessor: 'fecha' },
        { header: 'Estado', accessor: 'estado' },
        { header: 'Acciones', accessor: 'acciones' },
    ];
    
    // Columnas para la tabla de Validación de Pago (AUTORIZADOS)
    const columnsPago = [
        { header: 'Materia', accessor: 'materia' },
        { header: 'Estudiante', accessor: 'estudianteNombre' }, // Propiedad para identificar al estudiante
        { header: 'Fecha Examen', accessor: 'fecha' },
        { header: 'Estado', accessor: 'estado' },
        { header: 'Validar Pago', accessor: 'validarPago' },
    ];

    // Mapeo de datos para la tabla de Pendientes de Aprobación
    const dataAprobacion = pendientesAprobacion.map((extra) => ({
        ...extra,
        // Usamos 'fecha' de mockData como fecha del examen
        fecha: formatDateShort(extra.fecha), 
        estado: <Badge type={getBadgeType(extra.estado)}>{extra.estado}</Badge>,
        acciones: (
            <div className="flex gap-2">
                <Button type="success" onClick={() => abrirModal(extra, 'autorizar')}>Autorizar</Button>
                <Button type="danger" onClick={() => abrirModal(extra, 'rechazar')}>Rechazar</Button>
            </div>
        ),
    }));
    
    // Mapeo de datos para la tabla de Pendientes de Pago
    const dataPago = autorizadasPendientesPago.map((extra) => ({
        ...extra,
        fecha: formatDateShort(extra.fecha),
        // Muestra el nombre del estudiante si está disponible, sino usa el ID
        estudianteNombre: extra.estudianteNombre || 'ID: ' + extra.userId || 'Desconocido', 
        estado: <Badge type={getBadgeType(extra.estado)}>{extra.estado}</Badge>,
        validarPago: (
            <Button type="info" onClick={() => abrirModal(extra, 'pagar')}>
                Validar Pago
            </Button>
        ),
    }));
    
    // --- Renderizado de UI ---
    
    if (loading) return <Loader />;
    if (error) return <EmptyState message={error} />;


    const modalTitle = 
        accion === 'autorizar' ? 'Confirmar Autorización' :
        accion === 'rechazar' ? 'Confirmar Rechazo' :
        'Validar Pago Realizado';
        
    const modalButtonText = 
        accion === 'autorizar' ? 'Confirmar Autorización' :
        accion === 'rechazar' ? 'Confirmar Rechazo' :
        'Confirmar Pago';

    return (
        <div className="p-4 space-y-8">
            <h1 className="text-2xl font-bold">🛂 Gestión de Solicitudes y Pagos (Jefatura)</h1>

            {/* Sección 1: Autorización de Solicitudes (Estado: SOLICITADO) */}
            <Card title="Solicitudes Pendientes de Aprobación">
                <Table 
                    columns={columnsAprobacion} 
                    data={dataAprobacion} 
                    keyAccessor="id"
                    emptyMessage="🎉 No hay solicitudes pendientes por autorizar."
                />
            </Card>
            
            {/* Sección 2: Validación de Pago (Estado: AUTORIZADO) */}
            <Card title="Exámenes Autorizados Pendientes de Validación de Pago">
                <Table 
                    columns={columnsPago} 
                    data={dataPago} 
                    keyAccessor="id"
                    emptyMessage="Todos los exámenes autorizados han sido pagados."
                />
            </Card>

            <Modal
                isOpen={mostrarModal}
                title={modalTitle}
                onClose={() => setMostrarModal(false)}
                footer={
                    <>
                        <Button onClick={() => setMostrarModal(false)} type="secondary" disabled={isProcessing}>Cancelar</Button>
                        <Button 
                            onClick={confirmarAccion} 
                            type={accion === 'autorizar' || accion === 'pagar' ? 'primary' : 'danger'}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Procesando...' : modalButtonText}
                        </Button>
                    </>
                }
            >
                <p>
                    ¿Desea{' '}
                    <strong className={accion === 'autorizar' || accion === 'pagar' ? 'text-green-600' : 'text-red-600'}>
                        {accion === 'autorizar' ? 'autorizar' : accion === 'rechazar' ? 'rechazar' : 'confirmar el pago de'}
                    </strong>{' '}
                    la solicitud de{' '}
                    <strong>{seleccionado?.materia}</strong>?
                    {accion === 'pagar' && (
                        <p className="mt-2 text-sm font-semibold">
                            *Esta acción finaliza la solicitud y programa el examen en el calendario.
                        </p>
                    )}
                </p>
            </Modal>
        </div>
    );
};

export default Autorizaciones;