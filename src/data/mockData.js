export const estudiante = {
  id: '1',
  nombre: 'Juan Pérez García',
  matricula: '2024001',
  email: 'juan.perez@universidad.edu.mx',
  carrera: 'Ingeniería en Sistemas',
  semestre: 5,
  foto: 'https://via.placeholder.com/150',
};

export const pagosEjemplo = [
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

// ACTUALIZADO: Solicitudes con todos los campos necesarios
export const solicitudesEjemplo = [
  {
    id: 1,
    folio: 'CONST-2024-001234',
    tipo: 'Constancia de Estudios',
    motivo: 'Trámite de beca universitaria',
    dirigidoA: 'CONACYT',
    costo: 150,
    estado: 'pendiente',
    fecha: '2025-10-20T10:00:00.000Z',
    estudiante: 'Juan Pérez García'
  },
  {
    id: 2,
    folio: 'CONST-2024-001235',
    tipo: 'Constancia con Calificaciones',
    motivo: 'Solicitud de empleo',
    dirigidoA: 'Empresa Tech Solutions',
    costo: 150,
    estado: 'aprobado',
    fecha: '2025-10-15T14:30:00.000Z',
    estudiante: 'María García López'
  },
  {
    id: 3,
    folio: 'CONST-2024-001236',
    tipo: 'Carta de Buena Conducta',
    motivo: 'Trámite de visa',
    dirigidoA: 'Embajada de Estados Unidos',
    costo: 150,
    estado: 'rechazado',
    fecha: '2025-10-10T09:15:00.000Z',
    estudiante: 'Pedro Ramírez'
  }
];

export const librosEjemplo = [
  {
    id: '1',
    titulo: 'English File Intermediate',
    nivel: 'Intermedio',
    precio: 800,
    isbn: '978-0194035507',
    descripcion: 'Libro completo para nivel intermedio con ejercicios prácticos',
  },
  {
    id: '2',
    titulo: 'Oxford Advanced Learner',
    nivel: 'Avanzado',
    precio: 1200,
    isbn: '978-0194798792',
    descripcion: 'Diccionario y libro de aprendizaje para nivel avanzado',
  },
  {
    id: '3',
    titulo: 'English File Elementary',
    nivel: 'Básico',
    precio: 750,
    isbn: '978-0194598552',
    descripcion: 'Perfecto para comenzar a aprender inglés desde cero',
  },
];

export const extraordinariosEjemplo = [
  {
    id: '1',
    materia: 'Cálculo Diferencial',
    profesor: 'Dr. Roberto Martínez',
    fecha: '2025-11-15',
    hora: '10:00',
    costo: 600,
    estado: 'disponible',
  },
  {
    id: '2',
    materia: 'Programación Orientada a Objetos',
    profesor: 'Ing. Laura Sánchez',
    fecha: '2025-11-20',
    hora: '14:00',
    costo: 600,
    estado: 'disponible',
  },
];