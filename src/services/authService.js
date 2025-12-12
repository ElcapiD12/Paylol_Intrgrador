import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const loginUsuario = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Obtener datos del usuario desde Firestore
    const docRef = doc(db, "usuarios", userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // El documento existe
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          ...docSnap.data()
        }
      };
    } else {
      // El documento NO existe - crearlo automáticamente
      console.warn("Documento no encontrado, creando uno nuevo para:", userCredential.user.uid);
      
      // Crear documento básico
      const nuevoUsuario = {
        email: userCredential.user.email,
        nombre: userCredential.user.displayName || "Usuario",
        rol: "alumno",
        fechaCreacion: new Date().toISOString()
      };
      
      await setDoc(docRef, nuevoUsuario);
      
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          ...nuevoUsuario
        }
      };
    }
  } catch (error) {
    let mensaje = "Error al iniciar sesión";
    
    if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      mensaje = "Correo o contraseña incorrectos";
    } else if (error.code === "auth/invalid-credential") {
      mensaje = "Credenciales inválidas";
    } else if (error.code === "auth/too-many-requests") {
      mensaje = "Demasiados intentos. Intenta más tarde";
    } else if (error.code === "permission-denied") {
      mensaje = "No tienes permisos para acceder. Contacta al administrador";
    }
    
    console.error("Error en login:", error);
    return { success: false, error: mensaje };
  }
};

export const registrarUsuario = async (email, password) => {
  try {
    console.log("Registrando usuario en Firebase Auth:", email);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    console.log("Usuario registrado en Auth. UID:", userCredential.user.uid);
    
    return {
      success: true,
      user: {
        uid: userCredential.user.uid, // ESTO ES LO IMPORTANTE
        email: userCredential.user.email
      }
    };
  } catch (error) {
    let mensaje = "Error al registrar usuario";
    
    if (error.code === "auth/email-already-in-use") {
      mensaje = "Este correo ya está registrado";
    } else if (error.code === "auth/weak-password") {
      mensaje = "La contraseña debe tener al menos 6 caracteres";
    } else if (error.code === "auth/invalid-email") {
      mensaje = "Correo electrónico inválido";
    }
    
    console.error("Error en registro:", error);
    return { success: false, error: mensaje };
  }
};