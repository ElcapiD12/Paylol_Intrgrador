import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from './firebase';

// Login
export const loginUsuario = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

// Registro
export const registrarUsuario = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

// Logout
export const cerrarSesion = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener usuario actual
export const obtenerUsuarioActual = () => {
  return auth.currentUser;
};

// Mensajes de error en español
const getErrorMessage = (errorCode) => {
  const errores = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'El email ya está registrado',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/invalid-email': 'Email inválido',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
  };
  return errores[errorCode] || 'Error al iniciar sesión';
};