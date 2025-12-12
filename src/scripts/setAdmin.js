import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

// Ejecuta esto UNA VEZ con el UID del primer admin
export const setAdmin = async (uid) => {
  try {
    await updateDoc(doc(db, "usuarios", uid), { rol: "admin" });
    console.log("✅ Usuario convertido en admin");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Uso: setAdmin("TU_UID_AQUI");