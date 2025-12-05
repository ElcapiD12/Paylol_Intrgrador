// src/services/idiomasService.js
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

/* ============================================================
   📘 OBTENER EXÁMENES DE UN USUARIO
   Lee desde: Usuarios/{userId}/examenes
============================================================ */
export async function obtenerExamenes(userId) {
  try {
    const examenesRef = collection(db, 'Usuarios', userId, 'examenes');
    const q = query(examenesRef, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);

    const resultados = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return resultados;
  } catch (error) {
    console.error('❌ Error obteniendo exámenes:', error);
    return [];
  }
}

/* ============================================================
   📝 REGISTRAR UN EXAMEN NUEVO
   Guarda en: Usuarios/{userId}/examenes
   Devuelve: id del documento creado (o null si falla)
============================================================ */
export async function registrarExamen(userId, examenData) {
  try {
    const examenesRef = collection(db, 'Usuarios', userId, 'examenes');

    const docRef = await addDoc(examenesRef, {
      ...examenData,
      createdAt: new Date()
    });

    // devolver id para que el frontend pueda usarlo (opcional)
    return docRef.id;

  } catch (error) {
    console.error('❌ Error registrando examen:', error);
    return null;
  }
}

/* ============================================================
   📚 OBTENER LISTA DE LIBROS
============================================================ */
export async function obtenerLibros() {
  try {
    const snapshot = await getDocs(collection(db, 'Libros'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('❌ Error obteniendo libros:', error);
    return [];
  }
}

/* ============================================================
   💳 REGISTRAR COMPRA DE LIBRO
   Guarda en: Usuarios/{userId}/historialLibros
============================================================ */
export async function registrarCompraLibro(userId, libroData) {
  try {
    const historialRef = collection(db, 'Usuarios', userId, 'historialLibros');

    const docRef = await addDoc(historialRef, {
      ...libroData,
      fecha: new Date()
    });

    return docRef.id;
  } catch (error) {
    console.error('❌ Error registrando compra de libro:', error);
    return null;
  }
}
