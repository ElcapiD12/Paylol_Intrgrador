import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Obtener datos del usuario
export const obtenerUsuario = async (email) => {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', email));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'Usuario no encontrado' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Crear usuario (después de registro)
export const crearUsuario = async (email, userData) => {
  try {
    await setDoc(doc(db, 'usuarios', email), {
      ...userData,
      createdAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};