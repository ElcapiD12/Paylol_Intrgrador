// src/components/idiomas/RegistroLibros.jsx
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/utils/formatters";
import { NIVELES_INGLES } from "@/utils/constants";

// 🔹 Lista de libros disponibles
const LIBROS = [
  { id: 1, titulo: "English Basics A1", nivel: "Básico", precio: 800 },
  { id: 2, titulo: "English Progress B1", nivel: "Intermedio", precio: 850 },
  { id: 3, titulo: "Advanced English C1", nivel: "Avanzado", precio: 900 },
  { id: 4, titulo: "Professional English C2", nivel: "Profesional", precio: 950 },
];

export default function RegistroLibros() {
  const [nivelExamen, setNivelExamen] = useState("");
  const [historial, setHistorial] = useState([]);

  // 🔹 Función para comprar libro
  const handleComprarLibro = (libro) => {
    setHistorial((prev) => [
      ...prev,
      { tipo: "Libro", nombre: libro.titulo, fecha: new Date().toLocaleDateString() },
    ]);
    alert(`✅ Has comprado el libro: ${libro.titulo}`);
  };

  // 🔹 Función para registrar examen Oxford
  const handleRegistrarExamen = () => {
    if (!nivelExamen) {
      alert("⚠️ Por favor selecciona un nivel antes de registrar el examen");
      return;
    }

    setHistorial((prev) => [
      ...prev,
      { tipo: "Examen Oxford", nombre: nivelExamen, fecha: new Date().toLocaleDateString() },
    ]);

    alert(`📝 Examen Oxford de nivel ${nivelExamen} registrado correctamente`);
    setNivelExamen(""); // Limpia el select después
  };

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Lista de libros */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Lista de Libros</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIBROS.map((libro) => (
            <Card key={libro.id} className="p-4">
              <h3 className="text-lg font-semibold">{libro.titulo}</h3>
              <p>Nivel: {libro.nivel}</p>
              <p>Precio: {formatCurrency(libro.precio)}</p>
              <Button
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => handleComprarLibro(libro)}
              >
                Comprar Libro
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* 🔹 Registro de examen Oxford */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Registrar Examen Oxford</h2>
        <div className="flex gap-4 items-center">
          <Select
            label="Selecciona el nivel"
            options={NIVELES_INGLES.map((nivel) => ({
              value: nivel.value,
              label: nivel.label,
            }))}
            value={nivelExamen}
            onChange={(e) => setNivelExamen(e.target.value)}
          />
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleRegistrarExamen}
          >
            Registrar Examen
          </Button>
        </div>
      </section>

      {/* 🔹 Historial de acciones */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Historial</h2>
        {historial.length === 0 ? (
          <p className="text-gray-500">Aún no hay registros.</p>
        ) : (
          <ul className="list-disc list-inside">
            {historial.map((item, index) => (
              <li key={index}>
                <span className="font-semibold">{item.tipo}:</span> {item.nombre} ({item.fecha})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
