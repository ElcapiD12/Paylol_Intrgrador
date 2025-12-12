import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../services/firebase";
import { collection, onSnapshot, updateDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import Card from "../components/shared/Card";
import Select from "../components/shared/Select";
import Button from "../components/shared/Button";
import { useAuth } from "../context/AuthContext";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({ email: "", nombre: "", rol: "alumno" });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const registrosPorPagina = 100;

  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      setUsuarios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 🔑 Cambiar rol: siempre guardar string
  const cambiarRol = async (id, nuevoRol) => {
    try {
      console.log("🔄 Intentando cambiar rol:");
      console.log("  - Usuario ID:", id);
      console.log("  - Nuevo rol:", nuevoRol);
      console.log("  - Mi UID:", user?.uid);
      console.log("  - Mi rol:", user?.rol);
      
      await updateDoc(doc(db, "usuarios", id), { rol: nuevoRol });
      
      console.log("✅ Rol actualizado exitosamente");
      alert(`✅ Rol actualizado exitosamente a ${nuevoRol}`);
    } catch (err) {
      console.error("❌ Error al cambiar rol:", err);
      console.error("Código de error:", err.code);
      console.error("Mensaje:", err.message);
      
      if (err.code === "permission-denied") {
        alert(
          "❌ Permiso denegado\n\n" +
          "Posibles causas:\n" +
          "1. Tu documento de usuario no existe en Firestore con tu UID\n" +
          "2. Tu rol no es 'admin'\n" +
          "3. Las reglas de Firestore están bloqueando la actualización\n\n" +
          `Tu UID: ${user?.uid}\n` +
          `Tu rol: ${user?.rol}\n\n` +
          "Verifica en Firebase Console que existe el documento:\n" +
          `usuarios/${user?.uid}`
        );
      } else {
        alert("❌ No se pudo cambiar el rol. Error: " + err.message);
      }
    }
  };

  const eliminarUsuario = async (id) => {
    // Evitar que el admin se elimine a sí mismo
    if (user?.uid === id) {
      alert("No puedes eliminar tu propia cuenta");
      return;
    }

    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "usuarios", id));
      console.log(`Usuario ${id} eliminado`);
      alert("Usuario eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      
      if (err.code === "permission-denied") {
        alert("No tienes permisos para eliminar usuarios. Solo los administradores pueden hacerlo.");
      } else {
        alert("No se pudo eliminar el usuario. Verifica tu conexión o permisos.");
      }
    }
  };

  const crearUsuario = async () => {
    const email = nuevoUsuario.email.trim();
    const nombre = nuevoUsuario.nombre.trim();
    const rol = (nuevoUsuario.rol || "alumno").trim();

    // Validaciones
    if (!email || !nombre) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Correo electrónico inválido");
      return;
    }

    try {
      setGuardando(true);
      
      // 🔑 Crear usuario en Firebase Auth
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        "Temporal123!" // ⚠️ Contraseña temporal
      );
      
      // 🔑 Crear documento en Firestore con el mismo UID
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        email,
        nombre,
        rol,
        fechaCreacion: new Date().toISOString()
      });
      
      // Resetear formulario
      setNuevoUsuario({ email: "", nombre: "", rol: "alumno" });
      setMostrarForm(false);
      
      alert(
        `✅ Usuario creado exitosamente\n\n` +
        `📧 Email: ${email}\n` +
        `🔑 Contraseña temporal: Temporal123!\n\n` +
        `⚠️ El usuario debe cambiar su contraseña al iniciar sesión.`
      );
    } catch (err) {
      console.error("Error al crear usuario:", err);
      
      if (err.code === "auth/email-already-in-use") {
        alert("❌ Este correo ya está registrado en el sistema");
      } else if (err.code === "auth/weak-password") {
        alert("❌ La contraseña es demasiado débil");
      } else if (err.code === "permission-denied") {
        alert("❌ No tienes permisos para crear usuarios. Solo los administradores pueden hacerlo.");
      } else {
        alert(`❌ Error: ${err.message}`);
      }
    } finally {
      setGuardando(false);
    }
  };

  const opcionesRol = [
    { value: "alumno", label: "Estudiante" },
    { value: "admin", label: "Administrador" },
    { value: "admin_pagos", label: "Admin de Pagos" },
    { value: "admin_servicios", label: "Servicios Escolares" },
    { value: "jefe_carrera", label: "Jefe de Carrera" },
    { value: "admin_idiomas", label: "Idiomas" },
  ];

  const usuariosFiltrados = usuarios.filter(u =>
    (u.nombre && u.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(busqueda.toLowerCase())) ||
    (u.rol && u.rol.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(inicio, fin);

  // Verificar si el usuario actual es admin
  const esAdmin = user?.rol === "admin";

  return (
    <div className="min-h-screen original-bg p-6 pt-10">
      <Card className="shadow-md p-6 original-card w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
          Gestión de Usuarios
        </h1>

        {/* Mensaje de advertencia si no es admin */}
        {!esAdmin && (
          <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
            <p className="font-bold">⚠️ Acceso limitado</p>
            <p className="text-sm">Solo puedes ver usuarios. Para modificarlos necesitas rol de Administrador.</p>
          </div>
        )}

        {/* Contador de usuarios */}
        <div className="mb-4 text-sm text-blue-700">
          <span className="font-semibold">Total de usuarios:</span> {usuarios.length} | 
          <span className="font-semibold ml-2">Filtrados:</span> {usuariosFiltrados.length}
        </div>

        {/* Botón crear usuario + Buscador */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between gap-3">
          <Button
            onClick={() => setMostrarForm(!mostrarForm)}
            disabled={!esAdmin}
            className={`${
              esAdmin 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded`}
          >
            {mostrarForm ? "Cancelar" : "➕ Crear Usuario"}
          </Button>

          <input
            type="text"
            placeholder="Buscar por nombre, correo o rol..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // Resetear a página 1 al buscar
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Formulario nuevo usuario */}
        {mostrarForm && esAdmin && (
          <div className="mb-6 bg-blue-50 p-4 rounded border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Nuevo Usuario</h3>
            
            <input
              type="email"
              placeholder="Correo electrónico *"
              value={nuevoUsuario.email}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <input
              type="text"
              placeholder="Nombre completo *"
              value={nuevoUsuario.nombre}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <Select
              value={opcionesRol.find(opt => opt.value === nuevoUsuario.rol)}
              options={opcionesRol}
              onChange={(option) => setNuevoUsuario({ ...nuevoUsuario, rol: option.value })}
              className="text-sm text-blue-900 mb-3"
            />
            
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={crearUsuario}
                disabled={guardando}
                className={`${
                  guardando ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } text-white px-4 py-2 rounded flex-1`}
              >
                {guardando ? "⏳ Creando..." : "✅ Guardar Usuario"}
              </Button>
              
              <Button
                type="button"
                onClick={() => {
                  setMostrarForm(false);
                  setNuevoUsuario({ email: "", nombre: "", rol: "alumno" });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </Button>
            </div>
            
            <p className="text-xs text-gray-600 mt-2">
              ℹ️ La contraseña temporal será <strong>Temporal123!</strong>
            </p>
          </div>
        )}

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md shadow-md bg-white">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-2 border text-left">Email</th>
                <th className="px-4 py-2 border text-left">Nombre</th>
                <th className="px-4 py-2 border text-left">Rol</th>
                <th className="px-4 py-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map(u => (
                <tr key={u.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2 border text-sm text-blue-900">
                    {u.email || "—"}
                    {u.id === user?.uid && (
                      <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        Tú
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border text-sm text-blue-900">{u.nombre || "—"}</td>
                  <td className="px-4 py-2 border">
                    <Select
                      value={opcionesRol.find(opt => opt.value === u.rol) || opcionesRol[0]}
                      options={opcionesRol}
                      onChange={(option) => {
                        if (!esAdmin) {
                          alert("No tienes permisos para cambiar roles");
                          return;
                        }
                        
                        // 🔍 DEBUG: Ver qué llega
                        console.log("📋 Select onChange:");
                        console.log("  - option:", option);
                        console.log("  - option.value:", option?.value);
                        
                        // Validar que option y option.value existan
                        if (!option || !option.value) {
                          console.error("❌ Error: option o option.value es undefined");
                          alert("Error al seleccionar el rol");
                          return;
                        }
                        
                        const confirmar = window.confirm(
                          `¿Cambiar el rol de ${u.nombre || u.email} a ${option.label}?`
                        );
                        
                        if (confirmar) {
                          cambiarRol(u.id, option.value);
                        }
                      }}
                      className="text-sm text-blue-900"
                      disabled={!esAdmin}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <Button
                      onClick={() => eliminarUsuario(u.id)}
                      disabled={!esAdmin || user?.uid === u.id}
                      className={`${
                        !esAdmin || user?.uid === u.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      } text-white text-sm px-3 py-1 rounded transition-colors`}
                    >
                      🗑️ Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {usuariosPaginados.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-blue-700">
                    {busqueda ? "🔍 No se encontraron usuarios con ese criterio" : "No hay usuarios registrados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📑 Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-4 flex justify-center gap-4 items-center">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            <span className="text-blue-900 text-sm font-medium">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default AdminUsuarios;