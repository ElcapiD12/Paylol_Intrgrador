// src/components/jefaturas/CalendarioExamenes.jsx

import React, { useState, useMemo } from 'react';
import { Card, Badge } from '../shared';
import { formatDate } from '../../utils/helpers';
import { extraordinariosEjemplo } from '../../data/mockData';
import { MONTOS, ESTADOS_EXTRAORDINARIO, ESTADOS_SOLICITUD } from '../../utils/constants';

// Función auxiliar (misma para consistencia visual)
const getBadgeType = (estado) => {
    switch (estado) {
        case ESTADOS_SOLICITUD.SOLICITADO: return 'warning'; 
        case ESTADOS_SOLICITUD.PAGADO:
        case ESTADOS_SOLICITUD.AUTORIZADO: return 'info'; 
        default: return 'secondary';
    }
};


const CalendarioExamenes = () => {
    const [extraordinarios] = useState(extraordinariosEjemplo);

    // Filtra solo los exámenes que están confirmados y deben ir en el calendario oficial
    const examenesProgramados = useMemo(() => {
        return extraordinarios.filter(e => 
            e.estado === ESTADOS_SOLICITUD.PAGADO || 
            e.estado === ESTADOS_SOLICITUD.AUTORIZADO
        );
    }, [extraordinarios]);

    // Agrupa fechas únicas de los exámenes programados
    const fechasUnicas = useMemo(() => {
        return [
            ...new Set(examenesProgramados.map((e) => e.fecha)),
        ].sort(); // Las fechas en formato YYYY-MM-DD se ordenan correctamente alfabéticamente
    }, [examenesProgramados]);


    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">📅 Calendario de Exámenes Extraordinarios</h1>

            {fechasUnicas.length === 0 ? (
                <Card>
                    <p className="text-gray-500">No hay exámenes autorizados o pagados programados en el calendario.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fechasUnicas.map((fecha) => {
                        const delDia = examenesProgramados.filter((e) => e.fecha === fecha);
                        
                        return (
                            // La Card envuelve todos los exámenes de una fecha
                            <Card key={fecha} title={formatDate(fecha)}> 
                                <ul className="space-y-3">
                                    {delDia.map((examen) => (
                                        <li
                                            key={examen.id}
                                            className="flex justify-between items-start border-b border-gray-100 pb-2"
                                        >
                                            <div>
                                                <p className="font-medium">{examen.materia}</p>
                                                <small className="text-gray-600">Profesor: {examen.profesor}</small>
                                            </div>
                                            
                                            <Badge type={getBadgeType(examen.estado)}>
                                                {examen.estado}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CalendarioExamenes;