import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc 
} from 'firebase/firestore';

// Obtener pagos del usuario
export const obtenerPagos = async (userId) => {
  try {
    const q = query(
      collection(db, 'pagos'), 
      where('userId', '==', userId)
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

// Crear nuevo pago
export const crearPago = async (pagoData) => {
  try {
    const docRef = await addDoc(collection(db, 'pagos'), {
      ...pagoData,
      createdAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Actualizar estado de pago
export const actualizarPago = async (pagoId, nuevoEstado) => {
  try {
    await updateDoc(doc(db, 'pagos', pagoId), {
      estado: nuevoEstado,
      fechaPago: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};