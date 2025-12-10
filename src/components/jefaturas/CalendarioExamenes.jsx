// src/components/jefaturas/CalendarioExamenes.jsx

import React, { useMemo } from 'react';
import { Card, Badge, EmptyState } from '../shared';
import { formatDate } from '../../utils/helpers';

const CalendarioExamenes = ({ extraordinarios }) => { 
    
    const examenesProgramados = useMemo(() => {
        if (!extraordinarios) return [];

        return extraordinarios.filter(e => 
            e.estado === 'Pagado' || e.estado === 'Autorizado'
        ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }, [extraordinarios]);

    const fechasUnicas = useMemo(() => {
        return [
            ...new Set(examenesProgramados.map((e) => e.fecha)),
        ].sort();
    }, [examenesProgramados]);

    if (examenesProgramados.length === 0) {
         return (
             <Card title="📅 Calendario Visual de Exámenes">
                <EmptyState message="No hay exámenes programados en el calendario." />
             </Card>
         );
     }

    return (
        <Card title="📅 Calendario Visual de Exámenes">
            <p className="mb-6 text-sm text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-200">
                 ✨ Exámenes programados (Autorizados y Pagados)
            </p>
            
            <div className="space-y-6">
                {fechasUnicas.map((fecha, index) => {
                    const delDia = examenesProgramados.filter((e) => e.fecha === fecha);
                    
                    // Colores alternados para cada fecha
                    const colores = [
                        'from-blue-100 to-purple-100 border-blue-300',
                        'from-pink-100 to-rose-100 border-pink-300',
                        'from-emerald-100 to-teal-100 border-emerald-300',
                        'from-amber-100 to-yellow-100 border-amber-300',
                    ];
                    const colorIndex = index % colores.length;
                    
                    return (
                        <div 
                            key={fecha} 
                            className={`
                                bg-gradient-to-r ${colores[colorIndex]}
                                p-5 rounded-2xl shadow-md border-l-4
                                transition-all duration-300 hover:shadow-lg
                            `}
                        > 
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">📆</span>
                                {formatDate(fecha)}
                            </h3>
                            
                            <ul className="space-y-3">
                                {delDia.map((examen) => (
                                    <li
                                        key={examen.id}
                                        className="
                                            bg-white/80 backdrop-blur-sm
                                            p-4 rounded-xl 
                                            flex justify-between items-start
                                            border border-gray-200
                                            transition-all duration-300 hover:bg-white hover:shadow-md
                                        "
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                                                <span className="text-purple-600">📚</span>
                                                {examen.materia}
                                            </p>
                                            
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p className="flex items-center gap-2">
                                                    <span>🕐</span>
                                                    <strong>Hora:</strong> {examen.hora}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span>👨‍🏫</span>
                                                    <strong>Profesor:</strong> {examen.profesor}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span>🎓</span>
                                                    <strong>Alumno:</strong> {examen.estudianteNombre || 'Desconocido'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <Badge estado={examen.estado === 'Pagado' ? 'Pagado' : 'Autorizado'} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default CalendarioExamenes;