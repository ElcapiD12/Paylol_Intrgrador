// src/services/configuracionService.js
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Configuración por defecto
const CONFIGURACION_DEFAULT = {
  // Precios para cuatrimestres 1-5
  mensualidad_1_5: 5000,
  inscripcion_1_5: 1200,
  
  // Precios para cuatrimestre 6 (TSU)
  mensualidad_6: 6000,
  inscripcion_6: 1500,
  
  // Precios para cuatrimestres 7-10 (Ingeniería)
  mensualidad_7_10: 7000,
  inscripcion_7_10: 1800,
  
  // Configuración de fechas y recargos
  recargo: 50,
  diaCorte: 15,
  
  // Metadata
  ultimaActualizacion: new Date().toISOString(),
  actualizadoPor: 'sistema'
};

/**
 * Obtener configuración de precios
 * Si no existe, crea una con valores por defecto
 */
export const obtenerConfiguracion = async () => {
  try {
    const docRef = doc(db, 'configuracion', 'precios');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      // No existe, crear configuración por defecto
      await setDoc(docRef, CONFIGURACION_DEFAULT);
      return { success: true, data: CONFIGURACION_DEFAULT };
    }
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar configuración de precios
 * @param {Object} nuevaConfig - Nueva configuración parcial o completa
 * @param {string} adminId - ID del admin que hace el cambio
 */
export const actualizarConfiguracion = async (nuevaConfig, adminId = 'admin') => {
  try {
    const docRef = doc(db, 'configuracion', 'precios');
    
    const dataActualizada = {
      ...nuevaConfig,
      ultimaActualizacion: new Date().toISOString(),
      actualizadoPor: adminId
    };
    
    // Usar setDoc con merge para crear o actualizar
    await setDoc(docRef, dataActualizada, { merge: true });
    
    console.log('Configuración guardada exitosamente:', dataActualizada);
    
    return { success: true, data: dataActualizada };
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener precio según el cuatrimestre del alumno
 * @param {number} cuatrimestre - Cuatrimestre del alumno (1-10)
 * @param {string} tipo - 'mensualidad' o 'inscripcion'
 * @param {Object} config - Configuración de precios (opcional)
 */
export const obtenerPrecioPorCuatrimestre = async (cuatrimestre, tipo) => {
  try {
    // Obtener configuración
    const result = await obtenerConfiguracion();
    if (!result.success) {
      throw new Error('No se pudo obtener la configuración');
    }
    
    const config = result.data;
    let precio = 0;
    
    // Determinar el precio según el cuatrimestre
    if (cuatrimestre >= 1 && cuatrimestre <= 5) {
      precio = tipo === 'mensualidad' 
        ? config.mensualidad_1_5 
        : config.inscripcion_1_5;
    } else if (cuatrimestre === 6) {
      precio = tipo === 'mensualidad' 
        ? config.mensualidad_6 
        : config.inscripcion_6;
    } else if (cuatrimestre >= 7 && cuatrimestre <= 10) {
      precio = tipo === 'mensualidad' 
        ? config.mensualidad_7_10 
        : config.inscripcion_7_10;
    }
    
    return { success: true, precio, config };
  } catch (error) {
    console.error('Error al obtener precio:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Calcular recargo si el pago está vencido
 * @param {string} fechaVencimiento - Fecha de vencimiento en formato YYYY-MM-DD
 * @param {Object} config - Configuración (opcional)
 */
export const calcularRecargo = async (fechaVencimiento) => {
  try {
    const result = await obtenerConfiguracion();
    if (!result.success) {
      throw new Error('No se pudo obtener la configuración');
    }
    
    const config = result.data;
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    
    // Si ya pasó la fecha de vencimiento, aplicar recargo
    if (hoy > vencimiento) {
      return {
        success: true,
        tieneRecargo: true,
        montoRecargo: config.recargo,
        diasVencidos: Math.floor((hoy - vencimiento) / (1000 * 60 * 60 * 24))
      };
    }
    
    return {
      success: true,
      tieneRecargo: false,
      montoRecargo: 0,
      diasVencidos: 0
    };
  } catch (error) {
    console.error('Error al calcular recargo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generar fecha de vencimiento según el día de corte
 * @param {string} mes - Mes en formato 'YYYY-MM' o nombre del mes
 * @param {number} anio - Año (opcional, usa el actual si no se proporciona)
 */
export const generarFechaVencimiento = async (mes, anio) => {
  try {
    const result = await obtenerConfiguracion();
    if (!result.success) {
      throw new Error('No se pudo obtener la configuración');
    }
    
    const config = result.data;
    const diaCorte = config.diaCorte || 15;
    
    // Si mes es un número (1-12)
    let mesNumero;
    let anioFinal = anio || new Date().getFullYear();
    
    if (typeof mes === 'number') {
      mesNumero = mes;
    } else if (mes.includes('-')) {
      // Formato 'YYYY-MM'
      const partes = mes.split('-');
      anioFinal = parseInt(partes[0]);
      mesNumero = parseInt(partes[1]);
    } else {
      // Nombre del mes
      const meses = {
        'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
        'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
        'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
      };
      mesNumero = meses[mes.toLowerCase()];
    }
    
    // Crear fecha de vencimiento
    const fechaVencimiento = new Date(anioFinal, mesNumero - 1, diaCorte);
    
    return {
      success: true,
      fecha: fechaVencimiento.toISOString().split('T')[0], // Formato YYYY-MM-DD
      diaCorte
    };
  } catch (error) {
    console.error('Error al generar fecha de vencimiento:', error);
    return { success: false, error: error.message };
  }
};