// src/services/usuariosService.js
import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc,
  getDoc,
  orderBy 
} from 'firebase/firestore';

/**
 * Obtener todos los alumnos
 */
export const obtenerAlumnos = async () => {
  try {
    console.log('Iniciando consulta de alumnos...');
    
    // VERSIÓN SIMPLIFICADA SIN orderBy (para evitar problema de índice)
    const q = query(
      collection(db, 'usuarios'),
      where('rol', '==', 'alumno')
    );
    
    console.log('Query creado, ejecutando...');
    const querySnapshot = await getDocs(q);
    console.log('Documentos obtenidos:', querySnapshot.size);
    
    const alumnos = [];
    
    querySnapshot.forEach((doc) => {
      console.log('Alumno encontrado:', doc.id, doc.data());
      alumnos.push({
        id: doc.id, // UID del usuario
        ...doc.data()
      });
    });
    
    // Ordenar localmente por nombre
    alumnos.sort((a, b) => {
      const nombreA = (a.nombre || '').toLowerCase();
      const nombreB = (b.nombre || '').toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
    
    console.log('Alumnos cargados:', alumnos.length);
    return { success: true, data: alumnos, total: alumnos.length };
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    console.error('Código de error:', error.code);
    console.error('Mensaje:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener un alumno por su ID (UID)
 */
export const obtenerAlumnoPorId = async (alumnoId) => {
  try {
    const docRef = doc(db, 'usuarios', alumnoId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        data: {
          id: docSnap.id,
          ...docSnap.data()
        }
      };
    } else {
      return { success: false, error: 'Alumno no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener alumno:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Buscar alumnos por nombre, matrícula o email
 * @param {string} busqueda - Término de búsqueda
 */
export const buscarAlumnos = async (busqueda) => {
  try {
    // Obtener todos los alumnos
    const result = await obtenerAlumnos();
    
    if (!result.success) {
      return result;
    }
    
    // Filtrar localmente (Firestore no soporta búsqueda parcial directamente)
    const busquedaLower = busqueda.toLowerCase().trim();
    
    const alumnosFiltrados = result.data.filter(alumno => {
      const nombre = (alumno.nombre || '').toLowerCase();
      const matricula = (alumno.matricula || '').toLowerCase();
      const email = (alumno.email || '').toLowerCase();
      
      return nombre.includes(busquedaLower) ||
             matricula.includes(busquedaLower) ||
             email.includes(busquedaLower);
    });
    
    return {
      success: true,
      data: alumnosFiltrados,
      total: alumnosFiltrados.length
    };
  } catch (error) {
    console.error('Error al buscar alumnos:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Filtrar alumnos por carrera
 * @param {string} carrera - Nombre de la carrera
 */
export const filtrarAlumnosPorCarrera = async (carrera) => {
  try {
    const q = query(
      collection(db, 'usuarios'),
      where('rol', '==', 'alumno'),
      where('carrera', '==', carrera),
      orderBy('nombre')
    );
    
    const querySnapshot = await getDocs(q);
    const alumnos = [];
    
    querySnapshot.forEach((doc) => {
      alumnos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: alumnos, total: alumnos.length };
  } catch (error) {
    console.error('Error al filtrar alumnos por carrera:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Filtrar alumnos por cuatrimestre
 * @param {number} cuatrimestre - Número de cuatrimestre (1-10)
 */
export const filtrarAlumnosPorCuatrimestre = async (cuatrimestre) => {
  try {
    const q = query(
      collection(db, 'usuarios'),
      where('rol', '==', 'alumno'),
      where('cuatrimestre', '==', cuatrimestre),
      orderBy('nombre')
    );
    
    const querySnapshot = await getDocs(q);
    const alumnos = [];
    
    querySnapshot.forEach((doc) => {
      alumnos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: alumnos, total: alumnos.length };
  } catch (error) {
    console.error('Error al filtrar alumnos por cuatrimestre:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener carreras únicas de todos los alumnos
 */
export const obtenerCarreras = async () => {
  try {
    const result = await obtenerAlumnos();
    
    if (!result.success) {
      return result;
    }
    
    // Obtener carreras únicas
    const carrerasSet = new Set();
    result.data.forEach(alumno => {
      if (alumno.carrera) {
        carrerasSet.add(alumno.carrera);
      }
    });
    
    const carreras = Array.from(carrerasSet).sort();
    
    return { success: true, data: carreras };
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Filtrar alumnos con múltiples criterios
 * @param {Object} filtros - { busqueda, carrera, cuatrimestre }
 */
export const filtrarAlumnos = async (filtros = {}) => {
  try {
    // Obtener todos los alumnos
    const result = await obtenerAlumnos();
    
    if (!result.success) {
      return result;
    }
    
    let alumnosFiltrados = result.data;
    
    // Aplicar filtro de búsqueda
    if (filtros.busqueda && filtros.busqueda.trim()) {
      const busquedaLower = filtros.busqueda.toLowerCase().trim();
      alumnosFiltrados = alumnosFiltrados.filter(alumno => {
        const nombre = (alumno.nombre || '').toLowerCase();
        const matricula = (alumno.matricula || '').toLowerCase();
        const email = (alumno.email || '').toLowerCase();
        
        return nombre.includes(busquedaLower) ||
               matricula.includes(busquedaLower) ||
               email.includes(busquedaLower);
      });
    }
    
    // Aplicar filtro de carrera
    if (filtros.carrera && filtros.carrera !== 'todas') {
      alumnosFiltrados = alumnosFiltrados.filter(
        alumno => alumno.carrera === filtros.carrera
      );
    }
    
    // Aplicar filtro de cuatrimestre
    if (filtros.cuatrimestre && filtros.cuatrimestre !== 'todos') {
      const cuatri = parseInt(filtros.cuatrimestre);
      alumnosFiltrados = alumnosFiltrados.filter(
        alumno => alumno.cuatrimestre === cuatri
      );
    }
    
    return {
      success: true,
      data: alumnosFiltrados,
      total: alumnosFiltrados.length
    };
  } catch (error) {
    console.error('Error al filtrar alumnos:', error);
    return { success: false, error: error.message };
  }
};