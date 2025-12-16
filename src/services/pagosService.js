// src/services/pagosService.js
import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// ============ FUNCIONES EXISTENTES ============

/**
 * Obtener pagos del usuario
 */
export const obtenerPagos = async (userId) => {
  try {
    const q = query(
      collection(db, 'pagos'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const pagos = [];
    querySnapshot.forEach((doc) => {
      pagos.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: pagos };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Crear nuevo pago
 */
export const crearPago = async (pagoData) => {
  try {
    const docRef = await addDoc(collection(db, 'pagos'), {
      ...pagoData,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar estado de pago
 */
export const actualizarPago = async (pagoId, nuevoEstado, datosPago = {}) => {
  try {
    const updateData = {
      estado: nuevoEstado,
      fechaPago: Timestamp.now(),
      ...datosPago
    };
    
    await updateDoc(doc(db, 'pagos', pagoId), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ NUEVAS FUNCIONES ============

/**
 * Verificar si un alumno ya tiene un pago pendiente de un tipo específico
 * @param {string} userId - ID del alumno
 * @param {string} tipo - Tipo de pago ('colegiatura' o 'inscripcion')
 * @param {string} mes - Mes del pago (opcional, para colegiaturas)
 * @param {string} periodo - Período del pago (opcional, para inscripciones)
 */
export const verificarPagoDuplicado = async (userId, tipo, mes = null, periodo = null) => {
  try {
    let q;
    
    if (tipo === 'colegiatura' && mes) {
      // Verificar colegiatura específica del mes
      q = query(
        collection(db, 'pagos'),
        where('userId', '==', userId),
        where('tipo', '==', tipo),
        where('estado', '==', 'pendiente')
      );
      
      const querySnapshot = await getDocs(q);
      
      // Filtrar por mes específico
      const pagosDuplicados = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.concepto && data.concepto.includes(mes)) {
          pagosDuplicados.push({ id: doc.id, ...data });
        }
      });
      
      return {
        success: true,
        tieneDuplicado: pagosDuplicados.length > 0,
        pagoExistente: pagosDuplicados[0] || null
      };
    } else if (tipo === 'inscripcion' && periodo) {
      // Verificar inscripción del período
      q = query(
        collection(db, 'pagos'),
        where('userId', '==', userId),
        where('tipo', '==', tipo),
        where('estado', '==', 'pendiente')
      );
      
      const querySnapshot = await getDocs(q);
      
      // Filtrar por período específico
      const pagosDuplicados = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.concepto && data.concepto.includes(periodo)) {
          pagosDuplicados.push({ id: doc.id, ...data });
        }
      });
      
      return {
        success: true,
        tieneDuplicado: pagosDuplicados.length > 0,
        pagoExistente: pagosDuplicados[0] || null
      };
    } else {
      // Verificar cualquier pago pendiente del tipo
      q = query(
        collection(db, 'pagos'),
        where('userId', '==', userId),
        where('tipo', '==', tipo),
        where('estado', '==', 'pendiente')
      );
      
      const querySnapshot = await getDocs(q);
      const pagos = [];
      querySnapshot.forEach((doc) => {
        pagos.push({ id: doc.id, ...doc.data() });
      });
      
      return {
        success: true,
        tieneDuplicado: pagos.length > 0,
        pagoExistente: pagos[0] || null
      };
    }
  } catch (error) {
    console.error('Error al verificar duplicado:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener todos los pagos (para admin)
 * @param {Object} filtros - { estado, tipo, fechaInicio, fechaFin }
 */
export const obtenerTodosPagos = async (filtros = {}) => {
  try {
    let q = query(collection(db, 'pagos'), orderBy('createdAt', 'desc'));
    
    // Aplicar filtros
    const conditions = [];
    
    if (filtros.estado) {
      conditions.push(where('estado', '==', filtros.estado));
    }
    
    if (filtros.tipo) {
      conditions.push(where('tipo', '==', filtros.tipo));
    }
    
    // Si hay condiciones, crear query con ellas
    if (conditions.length > 0) {
      q = query(collection(db, 'pagos'), ...conditions, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const pagos = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Filtro por fecha (se hace en cliente porque Firestore tiene limitaciones)
      if (filtros.fechaInicio || filtros.fechaFin) {
        const fechaCreacion = data.createdAt?.toDate() || new Date(data.fechaAsignacion);
        
        if (filtros.fechaInicio) {
          const inicio = new Date(filtros.fechaInicio);
          if (fechaCreacion < inicio) return;
        }
        
        if (filtros.fechaFin) {
          const fin = new Date(filtros.fechaFin);
          fin.setHours(23, 59, 59);
          if (fechaCreacion > fin) return;
        }
      }
      
      pagos.push({ id: doc.id, ...data });
    });
    
    return { success: true, data: pagos, total: pagos.length };
  } catch (error) {
    console.error('Error al obtener todos los pagos:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener estadísticas de pagos
 */
export const obtenerEstadisticasPagos = async () => {
  try {
    const result = await obtenerTodosPagos();
    
    if (!result.success) {
      return result;
    }
    
    const pagos = result.data;
    
    // Calcular estadísticas
    const stats = {
      total: pagos.length,
      pendientes: pagos.filter(p => p.estado === 'pendiente').length,
      pagados: pagos.filter(p => p.estado === 'pagado').length,
      vencidos: pagos.filter(p => p.estado === 'vencido').length,
      montoPendiente: 0,
      montoPagado: 0,
      montoVencido: 0,
      montoTotal: 0
    };
    
    pagos.forEach(pago => {
      const monto = parseFloat(pago.monto) || 0;
      stats.montoTotal += monto;
      
      if (pago.estado === 'pendiente') {
        stats.montoPendiente += monto;
      } else if (pago.estado === 'pagado') {
        stats.montoPagado += monto;
      } else if (pago.estado === 'vencido') {
        stats.montoVencido += monto;
      }
    });
    
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener historial de pagos de un alumno específico
 * @param {string} userId - ID del alumno
 */
export const obtenerHistorialAlumno = async (userId) => {
  try {
    const q = query(
      collection(db, 'pagos'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const pagos = [];
    
    querySnapshot.forEach((doc) => {
      pagos.push({ id: doc.id, ...doc.data() });
    });
    
    // Calcular totales
    const totales = {
      pagados: pagos.filter(p => p.estado === 'pagado').length,
      pendientes: pagos.filter(p => p.estado === 'pendiente').length,
      vencidos: pagos.filter(p => p.estado === 'vencido').length,
      montoPagado: pagos
        .filter(p => p.estado === 'pagado')
        .reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0),
      montoPendiente: pagos
        .filter(p => p.estado === 'pendiente')
        .reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0)
    };
    
    return {
      success: true,
      data: pagos,
      totales
    };
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar pagos vencidos automáticamente
 * Cambia el estado de 'pendiente' a 'vencido' si ya pasó la fecha de vencimiento
 */
export const actualizarPagosVencidos = async () => {
  try {
    const q = query(
      collection(db, 'pagos'),
      where('estado', '==', 'pendiente')
    );
    
    const querySnapshot = await getDocs(q);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const actualizaciones = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const fechaVencimiento = new Date(data.fechaVencimiento);
      
      // Si ya pasó la fecha de vencimiento
      if (fechaVencimiento < hoy) {
        actualizaciones.push(
          updateDoc(doc(db, 'pagos', docSnapshot.id), {
            estado: 'vencido'
          })
        );
      }
    });
    
    await Promise.all(actualizaciones);
    
    return {
      success: true,
      actualizados: actualizaciones.length
    };
  } catch (error) {
    console.error('Error al actualizar pagos vencidos:', error);
    return { success: false, error: error.message };
  }
};