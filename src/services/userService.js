// src/services/userService.js
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Crear un nuevo usuario en Firestore
 * IMPORTANTE: El uid DEBE ser el UID de Firebase Auth
 * @param {string} uid - UID del usuario de Firebase Auth
 * @param {object} datos - Datos del usuario (nombre, email, rol, etc.)
 */
export const crearUsuario = async (uid, datos) => {
  try {
    console.log("userService.crearUsuario llamado");
    console.log("  - UID:", uid);
    console.log("  - Datos:", datos);
    
    // Validar que el UID no sea un email
    if (uid.includes("@")) {
      console.error("ERROR: Se está intentando usar un email como UID");
      throw new Error("El UID no puede ser un email. Debe ser el UID de Firebase Auth.");
    }
    
    // Validar que el UID tenga longitud adecuada (los UID de Firebase tienen ~28 caracteres)
    if (uid.length < 20) {
      console.error("ERROR: UID demasiado corto");
      throw new Error("El UID proporcionado no parece válido");
    }
    
    // Usar setDoc con el UID como ID del documento
    const docRef = doc(db, "usuarios", uid);
    
    await setDoc(docRef, {
      email: datos.email,
      nombre: datos.nombre,
      rol: datos.rol,
      ...(datos.matricula && { matricula: datos.matricula }),
      ...(datos.carrera && { carrera: datos.carrera }),
      ...(datos.cuatrimestre && { cuatrimestre: datos.cuatrimestre }),
      fechaCreacion: new Date().toISOString()
    });
    
    console.log("Usuario creado exitosamente en Firestore");
    console.log("  - Ruta: usuarios/" + uid);
    
    return { success: true };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener un usuario de Firestore
 * @param {string} uid - UID del usuario
 */
export const obtenerUsuario = async (uid) => {
  try {
    console.log("Buscando usuario:", uid);
    
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Usuario encontrado");
      return { 
        success: true, 
        data: { id: docSnap.id, ...docSnap.data() } 
      };
    } else {
      console.log("Usuario no encontrado");
      return { success: false, error: "Usuario no encontrado" };
    }
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar un usuario en Firestore
 * @param {string} uid - UID del usuario
 * @param {object} datos - Datos a actualizar
 */
export const actualizarUsuario = async (uid, datos) => {
  try {
    console.log("Actualizando usuario:", uid);
    
    const docRef = doc(db, "usuarios", uid);
    await updateDoc(docRef, datos);
    
    console.log("Usuario actualizado exitosamente");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Eliminar un usuario de Firestore
 * @param {string} uid - UID del usuario
 */
export const eliminarUsuario = async (uid) => {
  try {
    console.log("Eliminando usuario:", uid);
    
    const docRef = doc(db, "usuarios", uid);
    await deleteDoc(docRef);
    
    console.log("Usuario eliminado exitosamente");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { success: false, error: error.message };
  }
};