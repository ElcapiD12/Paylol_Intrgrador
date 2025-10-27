// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

// Formatear fecha
export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Formatear fecha corta
export const formatDateShort = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Obtener color según estado de pago
export const getEstadoPagoColor = (estado) => {
  const colores = {
    pendiente: 'warning',
    pagado: 'success',
    vencido: 'danger',
    procesando: 'info',
  };
  return colores[estado] || 'default';
};

// Obtener color según estado de solicitud
export const getEstadoSolicitudColor = (estado) => {
  const colores = {
    pendiente: 'warning',
    aprobado: 'success',
    rechazado: 'danger',
    en_proceso: 'info',
    completado: 'success',
  };
  return colores[estado] || 'default';
};

// Generar folio único
export const generarFolio = () => {
  const fecha = new Date();
  const timestamp = fecha.getTime();
  const random = Math.floor(Math.random() * 1000);
  return `PAY-${timestamp}-${random}`;
};

// Validar email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Calcular días restantes
export const diasRestantes = (fechaVencimiento) => {
  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);
  const diferencia = vencimiento - hoy;
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  return dias;
};

// Verificar si está vencido
export const estaVencido = (fechaVencimiento) => {
  return diasRestantes(fechaVencimiento) < 0;
};
