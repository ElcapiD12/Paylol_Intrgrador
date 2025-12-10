let extraordinariosDB = [
  {
    id: 1,
    materia: "Matemáticas Avanzadas",
    profesor: "Dr. Juan Pérez",
    fecha: "2025-01-15",
    hora: "10:00 AM",
    estado: "Disponible",
    userId: null,
    estudianteNombre: null,
  },
  {
    id: 2,
    materia: "Programación Web",
    profesor: "Ing. María González",
    fecha: "2025-01-18",
    hora: "2:00 PM",
    estado: "Disponible",
    userId: null,
    estudianteNombre: null,
  },
  {
    id: 3,
    materia: "Base de Datos",
    profesor: "Lic. Carlos Ramírez",
    fecha: "2025-01-20",
    hora: "11:00 AM",
    estado: "Disponible",
    userId: null,
    estudianteNombre: null,
  },
  {
    id: 4,
    materia: "Inglés Avanzado",
    profesor: "Prof. Ana Martínez",
    fecha: "2025-01-22",
    hora: "9:00 AM",
    estado: "Disponible",
    userId: null,
    estudianteNombre: null,
  },
  {
    id: 5,
    materia: "Física Aplicada",
    profesor: "Dr. Roberto Sánchez",
    fecha: "2025-01-25",
    hora: "3:00 PM",
    estado: "Solicitado",
    userId: "user123",
    estudianteNombre: "Pedro López",
  },
  {
    id: 6,
    materia: "Algoritmos",
    profesor: "Ing. Laura Torres",
    fecha: "2025-01-28",
    hora: "1:00 PM",
    estado: "Autorizado",
    userId: "user456",
    estudianteNombre: "María Rodríguez",
  },
  {
    id: 7,
    materia: "Redes de Computadoras",
    profesor: "Mtro. José Hernández",
    fecha: "2025-02-01",
    hora: "10:30 AM",
    estado: "Pagado",
    userId: "user789",
    estudianteNombre: "Luis Fernández",
  },
  {
    id: 8,
    materia: "Estructura de Datos",
    profesor: "Dra. Patricia Morales",
    fecha: "2025-02-05",
    hora: "4:00 PM",
    estado: "Disponible",
    userId: null,
    estudianteNombre: null,
  },
];

// Contador para generar IDs únicos
let nextId = 9;

// ============================================
// FUNCIONES DEL SERVICIO
// ============================================

/**
 * Simula un delay de red (opcional, para hacer más realista)
 */
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene la lista de extraordinarios.
 * @param {string} userId - ID del usuario (opcional, para filtrar)
 * @returns {Promise<Array>} Lista de extraordinarios
 */
export async function obtenerExtraordinarios(userId) {
  console.log("📡 Servicio: Obteniendo extraordinarios...");
  
  // Simular delay de red
  await delay(800);
  
  try {
    // En producción, aquí harías:
    // const response = await fetch('/api/extraordinarios');
    // const data = await response.json();
    // return data;
    
    // Por ahora, retornamos los datos demo
    console.log("✅ Extraordinarios obtenidos:", extraordinariosDB.length);
    return [...extraordinariosDB]; // Retorna una copia
    
  } catch (error) {
    console.error("❌ Error al obtener extraordinarios:", error);
    throw new Error("No se pudieron cargar los extraordinarios.");
  }
}

/**
 * Solicita un extraordinario (cambia el estado a "Solicitado").
 * @param {number} extraordinarioId - ID del extraordinario
 * @param {string} userId - ID del usuario que solicita
 * @returns {Promise<Object>} Extraordinario actualizado
 */
export async function solicitarExtraordinario(extraordinarioId, userId) {
  console.log(`📡 Servicio: Solicitando extraordinario ${extraordinarioId} para usuario ${userId}...`);
  
  // Simular delay de red
  await delay(600);
  
  try {
    // Buscar el extraordinario
    const index = extraordinariosDB.findIndex(e => e.id === extraordinarioId);
    
    if (index === -1) {
      throw new Error("Extraordinario no encontrado.");
    }
    
    const extraordinario = extraordinariosDB[index];
    
    // Validaciones
    if (extraordinario.estado !== "Disponible") {
      throw new Error("Este extraordinario ya no está disponible.");
    }
    
    // Actualizar el estado
    extraordinariosDB[index] = {
      ...extraordinario,
      estado: "Solicitado",
      userId: userId,
      estudianteNombre: "Usuario Demo", // En producción, obtendrías el nombre real
    };
    
    console.log("✅ Solicitud registrada:", extraordinariosDB[index]);
    
    // En producción, aquí harías:
    // await fetch(`/api/extraordinarios/${extraordinarioId}/solicitar`, {
    //   method: 'POST',
    //   body: JSON.stringify({ userId }),
    // });
    
    return extraordinariosDB[index];
    
  } catch (error) {
    console.error("❌ Error al solicitar extraordinario:", error);
    throw error;
  }
}

/**
 * Actualiza el estado de un extraordinario (Aprobar/Rechazar/Pagar).
 * @param {number} extraordinarioId - ID del extraordinario
 * @param {string} nuevoEstado - Nuevo estado ("Autorizado", "Rechazado", "Pagado")
 * @returns {Promise<Object>} Extraordinario actualizado
 */
export async function actualizarEstadoExtraordinario(extraordinarioId, nuevoEstado) {
  console.log(`📡 Servicio: Actualizando extraordinario ${extraordinarioId} a estado "${nuevoEstado}"...`);
  
  // Simular delay de red
  await delay(700);
  
  try {
    // Buscar el extraordinario
    const index = extraordinariosDB.findIndex(e => e.id === extraordinarioId);
    
    if (index === -1) {
      throw new Error("Extraordinario no encontrado.");
    }
    
    // Validaciones básicas de transición de estados
    const estadoActual = extraordinariosDB[index].estado;
    
    if (nuevoEstado === "Autorizado" && estadoActual !== "Solicitado") {
      throw new Error("Solo se pueden autorizar solicitudes en estado 'Solicitado'.");
    }
    
    if (nuevoEstado === "Pagado" && estadoActual !== "Autorizado") {
      throw new Error("Solo se pueden marcar como 'Pagado' los extraordinarios autorizados.");
    }
    
    // Actualizar el estado
    extraordinariosDB[index] = {
      ...extraordinariosDB[index],
      estado: nuevoEstado,
    };
    
    console.log("✅ Estado actualizado:", extraordinariosDB[index]);
    
    // En producción, aquí harías:
    // await fetch(`/api/extraordinarios/${extraordinarioId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ estado: nuevoEstado }),
    // });
    
    return extraordinariosDB[index];
    
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    throw error;
  }
}

/**
 * Crea un nuevo extraordinario (opcional, para administradores).
 * @param {Object} datos - Datos del extraordinario
 * @returns {Promise<Object>} Extraordinario creado
 */
export async function crearExtraordinario(datos) {
  console.log("📡 Servicio: Creando nuevo extraordinario...");
  
  await delay(600);
  
  try {
    const nuevoExtraordinario = {
      id: nextId++,
      materia: datos.materia,
      profesor: datos.profesor,
      fecha: datos.fecha,
      hora: datos.hora,
      estado: "Disponible",
      userId: null,
      estudianteNombre: null,
    };
    
    extraordinariosDB.push(nuevoExtraordinario);
    
    console.log("✅ Extraordinario creado:", nuevoExtraordinario);
    
    return nuevoExtraordinario;
    
  } catch (error) {
    console.error("❌ Error al crear extraordinario:", error);
    throw error;
  }
}

/**
 * Función auxiliar para resetear los datos demo (útil para pruebas).
 */
export function resetearDatosDemo() {
  console.log("🔄 Reseteando datos demo...");
  
  extraordinariosDB = [
    {
      id: 1,
      materia: "Matemáticas Avanzadas",
      profesor: "Dr. Juan Pérez",
      fecha: "2025-01-15",
      hora: "10:00 AM",
      estado: "Disponible",
      userId: null,
      estudianteNombre: null,
    },
    {
      id: 2,
      materia: "Programación Web",
      profesor: "Ing. María González",
      fecha: "2025-01-18",
      hora: "2:00 PM",
      estado: "Disponible",
      userId: null,
      estudianteNombre: null,
    },
    {
      id: 3,
      materia: "Base de Datos",
      profesor: "Lic. Carlos Ramírez",
      fecha: "2025-01-20",
      hora: "11:00 AM",
      estado: "Disponible",
      userId: null,
      estudianteNombre: null,
    },
  ];
  
  nextId = 4;
  
  console.log("✅ Datos demo reseteados");
}