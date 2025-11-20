// Importar validarEmail desde helpers
import { validarEmail } from './helpers';

// Validar formulario de login
export const validarLogin = (email, password) => {
  const errores = {};
  
  if (!email) {
    errores.email = 'El email es requerido';
  } else if (!validarEmail(email)) {
    errores.email = 'Email inválido';
  }
  
  if (!password) {
    errores.password = 'La contraseña es requerida';
  } else if (password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  return errores;
};

// Validar formulario de pago
export const validarPago = (datos) => {
  const errores = {};
  
  if (!datos.monto || datos.monto <= 0) {
    errores.monto = 'El monto debe ser mayor a 0';
  }
  
  if (!datos.concepto) {
    errores.concepto = 'El concepto es requerido';
  }
  
  return errores;
};

// Validar formulario de registro
export const validarRegistro = (datos) => {
  const errores = {};
  
  // Nombre
  if (!datos.nombre?.trim()) {
    errores.nombre = 'El nombre es requerido';
  }

  // Email
  if (!datos.email) {
    errores.email = 'El email es requerido';
  } else if (!validarEmail(datos.email)) {
    errores.email = 'Email inválido';
  }

  // Matrícula
  if (!datos.matricula) {
    errores.matricula = 'La matrícula es requerida';
  }

  // Cuatrimestre (AQUÍ ESTABA TU ERROR)
  if (!datos.cuatrimestre) {
    errores.cuatrimestre = 'El cuatrimestre es requerido';
  }

  // Contraseña
  if (!datos.password) {
    errores.password = 'La contraseña es requerida';
  } else if (datos.password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  // Confirmación
  if (datos.password !== datos.confirmarPassword) {
    errores.confirmarPassword = 'Las contraseñas no coinciden';
  }

  return errores;
};
