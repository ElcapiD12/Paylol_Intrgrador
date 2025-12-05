import { useState } from "react";
import { Card, Button } from "../shared";
import { formatCurrency } from "../../utils/helpers";

export default function RegistroLibros() {
  const [librosDisponibles] = useState([
    { id: 1, titulo: "Libro Nivel Básico", nivel: "Básico", precio: 580 },
    { id: 2, titulo: "Libro Nivel Intermedio", nivel: "Intermedio", precio: 580 },
    { id: 3, titulo: "Libro Nivel Avanzado", nivel: "Avanzado", precio: 580 },
  ]);

  const [historialCompras, setHistorialCompras] = useState([]);

  const comprarLibro = (libro) => {
    const compra = {
      ...libro,
      fechaCompra: new Date().toLocaleDateString(),
    };
    setHistorialCompras([...historialCompras, compra]);
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-8 py-20 text-gray-800">
      <div className="max-w-6xl mx-auto">

        {/* Lista de Libros Disponibles */}
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">📚 Libros Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {librosDisponibles.map((libro) => (
            <Card key={libro.id} className="p-6 shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{libro.titulo}</h3>
              <p className="text-sm text-gray-600 mb-1">Nivel: {libro.nivel}</p>
              <p className="text-blue-700 font-bold text-lg mb-4">{formatCurrency(libro.precio)}</p>
              <Button
                text="Comprar"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
                onClick={() => comprarLibro(libro)}
              />
            </Card>
          ))}
        </div>

        {/* Historial de Compras */}
        <h2 className="text-3xl font-bold mt-16 text-blue-700 text-center">🧾 Historial de Compras</h2>
        {historialCompras.length === 0 ? (
          <p className="text-gray-600 text-center mt-4">Aún no hay compras.</p>
        ) : (
          <div className="space-y-4 mt-6">
            {historialCompras.map((compra, index) => (
              <Card key={index} className="p-5 shadow-md">
                <p><span className="font-semibold">📘 Libro:</span> {compra.titulo}</p>
                <p><span className="font-semibold">Nivel:</span> {compra.nivel}</p>
                <p><span className="font-semibold">Precio:</span> {formatCurrency(compra.precio)}</p>
                <p><span className="font-semibold">Fecha:</span> {compra.fechaCompra}</p>
              </Card>
            ))}
            <div className="border-t pt-4 mt-4 text-right">
              <p className="text-lg font-semibold text-gray-700">
                Total libros: {historialCompras.length}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
