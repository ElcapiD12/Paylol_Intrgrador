import React, { useState } from "react";
import { Select, Button, Table } from "../shared";


export default function ExamenesOxford() {
  // Estado para el nivel seleccionado y el historial
  const [nivel, setNivel] = useState("");
  const [historial, setHistorial] = useState([]);

  // Lista de niveles disponibles
  const niveles = [
    { label: "Selecciona una opción", value: "" },
    { label: "A1 - Principiante", value: "A1" },
    { label: "A2 - Básico", value: "A2" },
    { label: "B1 - Intermedio", value: "B1" },
    { label: "B2 - Intermedio alto", value: "B2" },
    { label: "C1 - Avanzado", value: "C1" },
    { label: "C2 - Experto", value: "C2" },
  ];

    console.log("Opciones disponibles:", niveles);


  // Maneja el registro del examen
  const registrarExamen = () => {
    if (!nivel) {
      alert("Por favor selecciona un nivel antes de registrar el examen");

      return;
    }

    const nuevoRegistro = {
      id: historial.length + 1,
      nivel,
      fecha: new Date().toLocaleDateString(),
    };

    setHistorial([...historial, nuevoRegistro]);
    setNivel("");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registrar Examen Oxford</h2>

      {/* Selector de nivel */}
      <Select
        label="Nivel de examen"
        options={niveles}
        value={nivel}
        onChange={(e) => setNivel(e.target.value)}
        required
      />

      {/* Botón para registrar */}
      <Button variant="success" onClick={registrarExamen}>
        Registrar Examen
      </Button>

      {/* Tabla del historial */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Historial de Exámenes</h3>

        {historial.length > 0 ? (
          <Table
            columns={["ID", "Nivel", "Fecha"]}
            data={historial.map((h) => [h.id, h.nivel, h.fecha])}
          />
        ) : (
          <p className="text-gray-500">No hay exámenes registrados todavía.</p>
        )}
      </div>
    </div>
  );
}
