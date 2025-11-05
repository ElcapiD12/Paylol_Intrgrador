// src/data/mockData.js

// Importación CRÍTICA: Asegura que los nombres de estado sean consistentes
import { ESTADOS_SOLICITUD } from '../utils/constants';

// --- Datos de Perfil (Sin Cambios) ---
export const estudiante = {
    id: '1',
    nombre: 'Juan Pérez García',
    matricula: '2024001',
    email: 'juan.perez@universidad.edu.mx',
    carrera: 'Ingeniería en Sistemas',
    semestre: 5,
    foto: 'https://via.placeholder.com/150',
};

// --- Pagos (Sin Cambios) ---
export const pagosEjemplo = [
    // ... (Mantener tus datos de pagos)
    {
        id: '1',
        concepto: 'Colegiatura Octubre 2025',
        tipo: 'colegiatura',
        monto: 5000,
        estado: 'pendiente',
        fechaVencimiento: '2025-10-31',
        descripcion: 'Pago mensual de colegiatura',
    },
    {
        id: '2',
        concepto: 'Inscripción Semestre Ago-Dic 2025',
        tipo: 'inscripcion',
        monto: 3000,
        estado: 'pagado',
        fechaPago: '2025-08-15',
        folio: 'PAY-1692100000-123',
    },
    {
        id: '3',
        concepto: 'Constancia de Estudios',
        tipo: 'constancia',
        monto: 150,
        estado: 'pagado',
        fechaPago: '2025-09-10',
        folio: 'PAY-1694280000-456',
    },
];

// --- Solicitudes (Sin Cambios) ---
export const solicitudesEjemplo = [
    // ... (Mantener tus datos de solicitudes)
    {
        id: '1',
        tipo: 'Constancia de Estudios',
        estado: 'en_proceso',
        fechaSolicitud: '2025-10-20',
        monto: 150,
    },
    {
        id: '2',
        tipo: 'Constancia de Calificaciones',
        estado: 'completado',
        fechaSolicitud: '2025-09-15',
        fechaEntrega: '2025-09-20',
        monto: 150,
    },
];

// --- Libros (Sin Cambios) ---
export const librosEjemplo = [
    // ... (Mantener tus datos de libros)
    {
        id: '1',
        titulo: 'English File Intermediate',
        nivel: 'intermedio',
        precio: 800,
        isbn: '978-0194035507',
    },
    {
        id: '2',
        titulo: 'Oxford Advanced Learner',
        nivel: 'avanzado',
        precio: 1200,
        isbn: '978-0194798792',
    },
];

// --- Extraordinarios (CORREGIDO PARA COMPATIBILIDAD CON CONSTANTS.JS) ---
export const extraordinariosEjemplo = [
    {
        id: '1',
        materia: 'Cálculo Diferencial',
        profesor: 'Dr. Roberto Martínez',
        fecha: '2025-11-15',
        hora: '10:00',
        costo: 600,
        // CORREGIDO: Usa la constante 'Disponible'
        estado: ESTADOS_SOLICITUD.DISPONIBLE, 
    },
    {
        id: '2',
        materia: 'Programación Orientada a Objetos',
        profesor: 'Ing. Laura Sánchez',
        fecha: '2025-11-20',
        hora: '14:00',
        costo: 600,
        // CORREGIDO: Usa la constante 'Disponible'
        estado: ESTADOS_SOLICITUD.DISPONIBLE, 
    },
    {
        id: '3',
        materia: 'Ecuaciones Diferenciales',
        profesor: 'Mtro. Héctor Bravo',
        fecha: '2025-11-20',
        hora: '16:00',
        costo: 600,
        // Añadido para probar Autorizaciones.jsx (Jefe de Carrera)
        estado: ESTADOS_SOLICITUD.SOLICITADO, 
    },
    {
        id: '4',
        materia: 'Bases de Datos Avanzadas',
        profesor: 'Dr. Roberto Martínez',
        fecha: '2025-11-25',
        hora: '09:00',
        costo: 600,
        // Añadido para probar CalendarioExamenes.jsx
        estado: ESTADOS_SOLICITUD.AUTORIZADO, 
    },
    {
        id: '5',
        materia: 'Sistemas Operativos',
        profesor: 'Ing. Laura Sánchez',
        fecha: '2025-11-25',
        hora: '11:00',
        costo: 600,
        // Añadido para probar Pagado en CalendarioExamenes.jsx
        estado: ESTADOS_SOLICITUD.PAGADO, 
    },
];