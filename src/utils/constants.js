// Colores del sistema
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  success: '#10B981',
};

// Tipos de pago
export const TIPOS_PAGO = {
  COLEGIATURA: 'colegiatura',
  INSCRIPCION: 'inscripcion',
  CONSTANCIA: 'constancia',
  LIBRO_INGLES: 'libro_ingles',
  EXAMEN_OXFORD: 'examen_oxford',
  EXTRAORDINARIO: 'extraordinario',
  REMEDIAL: 'remedial',
};

// Montos de pagos
export const MONTOS = {
  [TIPOS_PAGO.COLEGIATURA]: 5000,
  [TIPOS_PAGO.INSCRIPCION]: 3000,
  [TIPOS_PAGO.CONSTANCIA]: 150,
  [TIPOS_PAGO.LIBRO_INGLES]: 800,
  [TIPOS_PAGO.EXAMEN_OXFORD]: 1200,
  [TIPOS_PAGO.EXTRAORDINARIO]: 600,
  [TIPOS_PAGO.REMEDIAL]: 400,
};

// Estados de solicitudes
export const ESTADOS_SOLICITUD = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
  EN_PROCESO: 'en_proceso',
  COMPLETADO: 'completado',
};

// Tipos de constancias
export const TIPOS_CONSTANCIA = [
  { value: 'estudios', label: 'Constancia de Estudios' },
  { value: 'calificaciones', label: 'Constancia de Calificaciones' },
  { value: 'no_adeudo', label: 'Constancia de No Adeudo' },
  { value: 'conducta', label: 'Constancia de Buena Conducta' },
];

// Niveles de idiomas
export const NIVELES_INGLES = [
  { value: 'basico', label: 'Básico' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
  { value: 'profesional', label: 'Profesional' },
];

// Roles de usuario
export const ROLES = {
  ESTUDIANTE: 'estudiante',
  ADMIN: 'admin',
  SERVICIOS_ESCOLARES: 'servicios_escolares',
  JEFE_CARRERA: 'jefe_carrera',
  IDIOMAS: 'idiomas',
};

// Mensajes de error comunes
export const MENSAJES_ERROR = {
  CAMPOS_REQUERIDOS: 'Por favor completa todos los campos requeridos',
  EMAIL_INVALIDO: 'Por favor ingresa un email válido',
  CONTRASENA_CORTA: 'La contraseña debe tener al menos 6 caracteres',
  PAGO_FALLIDO: 'Error al procesar el pago. Intenta nuevamente',
  SIN_CONEXION: 'No hay conexión a internet',
  ERROR_SERVIDOR: 'Error en el servidor. Intenta más tarde',
};

// Mensajes de éxito
export const MENSAJES_EXITO = {
  PAGO_EXITOSO: '¡Pago procesado exitosamente!',
  SOLICITUD_ENVIADA: 'Solicitud enviada correctamente',
  PERFIL_ACTUALIZADO: 'Perfil actualizado correctamente',
  REGISTRO_EXITOSO: 'Registro completado exitosamente',
};

// Estados de extraordinarios
export const ESTADOS_EXTRAORDINARIO = {
  DISPONIBLE: 'Disponible',
  SOLICITADO: 'Solicitado',
  AUTORIZADO: 'Autorizado',
  RECHAZADO: 'Rechazado',
  PAGADO: 'Pagado',
};

// Información bancaria de la institución
export const DATOS_BANCARIOS = {
  banco: 'BBVA Bancomer',
  titular: 'Instituto Educativo PAYLOL',
  cuenta: '0123456789',
  clabe: '012180001234567890',
  concepto: 'PAGO DE CONSTANCIA',
};

// Estados de pago
export const ESTADOS_PAGO = {
  PENDIENTE_PAGO: 'pendiente_pago',
  COMPROBANTE_SUBIDO: 'comprobante_subido',
  VALIDANDO: 'validando',
  PAGADO: 'pagado',
  RECHAZADO: 'rechazado',
  VENCIDO: 'vencido',
};

// 🔹 Rutas por defecto según rol
export const ROLE_DEFAULT_ROUTE = {
  alumno: "/dashboard",
  jefe_carrera: "/dashboard/jefatura",
  admin_pagos: "/dashboard/pagos",
  admin_idiomas: "/dashboard/admin-idiomas",
  admin_servicios: "/dashboard/servicios-escolares",
  admin: "/dashboard/admin-usuarios",
};