import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, "usuarios", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsuario({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData,
              rol: userData.rol ? userData.rol.toLowerCase() : "alumno"
            });
          } else {
            console.warn("Usuario sin documento en Firestore:", firebaseUser.uid);
            setUsuario({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              rol: "alumno"
            });
          }
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
          setUsuario({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            rol: "alumno"
          });
        }
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (user) => {
    setUsuario({
      ...user,
      rol: user.rol ? user.rol.toLowerCase() : "alumno",
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const value = {
    usuario,
    user: usuario,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default AuthContext;