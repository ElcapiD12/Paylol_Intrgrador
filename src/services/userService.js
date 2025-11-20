import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Crear usuario en Firestore
export const crearUsuario = async (email, userData) => {
  try {
    await setDoc(doc(db, 'usuarios', email), {
      ...userData,
      createdAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return { success: false, error: error.message };
  }
};

// Obtener datos del usuario
export const obtenerUsuario = async (email) => {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', email));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'Usuario no encontrado' };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return { success: false, error: error.message };
  }
};