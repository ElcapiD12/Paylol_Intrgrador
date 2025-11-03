// src/components/idiomas/RegistroLibros.jsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Button, Badge, Select } from '../shared';
import { formatCurrency } from '../../utils/helpers';
import { NIVELES_INGLES, MONTOS } from '../../utils/constants';
import { librosEjemplo } from '../../data/mockData';

// --- Componente Modal usando Portal ---
function ModalPortal({ children, onClose }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        {children}
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function RegistroLibros() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [nivelExamen, setNivelExamen] = useState('');
  const [historialCompras, setHistorialCompras] = useState([]);
  const [historialExamenes, setHistorialExamenes] = useState([]);

  const handleBuy = (libro) => {
    setSelectedBook(libro);
    setShowModal(true);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Idiomas - Libros y Exámenes</h2>

      {/* --- LISTA DE LIBROS --- */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Libros de Inglés</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {librosEjemplo.map((libro) => (
          <Card key={libro.id} title={libro.titulo}>
            <div className="flex items-center justify-between mb-3">
              <Badge color="blue">{libro.nivel}</Badge>
              <span className="text-gray-600 font-medium">
                {formatCurrency(libro.precio || MONTOS.libro_ingles)}
              </span>
            </div>
            <Button variant="primary" onClick={() => handleBuy(libro)}>
              Comprar Libro
            </Button>
          </Card>
        ))}
      </div>

      {/* --- REGISTRO DE EXAMEN OXFORD --- */}
      <div className="bg-white rounded-lg shadow p-6 mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Registrar Examen Oxford</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <Select
            value={nivelExamen}
            onChange={(e) => setNivelExamen(e.target.value)}
            options={[
              { label: 'Selecciona un nivel', value: '' },
              ...NIVELES_INGLES.map((n) =>
                typeof n === 'string' ? { label: n, value: n } : { label: n.label ?? n.value, value: n.value ?? n }
              ),
            ]}
            required
          />
          <Button
            variant="secondary"
            onClick={() => {
              if (!nivelExamen) {
                alert('Por favor selecciona un nivel antes de registrar el examen.');
                return;
              }
              const nuevoExamen = { nivel: nivelExamen, fecha: new Date() };
              setHistorialExamenes((prev) => [...prev, nuevoExamen]);
              alert(
                `Examen Oxford registrado: Nivel ${nivelExamen} - Precio: ${formatCurrency(MONTOS.examen_oxford)}`
              );
              setNivelExamen('');
            }}
          >
            Registrar Examen
          </Button>
        </div>
      </div>

      {/* --- HISTORIAL DE COMPRAS Y EXÁMENES --- */}
      <div className="mt-10 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Historial</h3>

        <h4 className="font-semibold mb-2 text-gray-600">Compras de Libros:</h4>
        {historialCompras.length === 0 ? (
          <p className="text-gray-500">Aún no has comprado ningún libro.</p>
        ) : (
          <ul className="list-disc list-inside">
            {historialCompras.map((libro, i) => (
              <li key={i}>
                {libro.titulo} — {formatCurrency(libro.precio || MONTOS.libro_ingles)}
              </li>
            ))}
          </ul>
        )}

        <h4 className="font-semibold mt-6 mb-2 text-gray-600">Exámenes Registrados:</h4>
        {historialExamenes.length === 0 ? (
          <p className="text-gray-500">No hay exámenes registrados aún.</p>
        ) : (
          <ul className="list-disc list-inside">
            {historialExamenes.map((exam, i) => (
              <li key={i}>
                Nivel {exam.nivel} — Fecha: {exam.fecha.toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- MODAL FUNCIONAL CON PORTAL --- */}
      {showModal && selectedBook && (
        <ModalPortal onClose={() => setShowModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Confirmar Compra</h3>
          <p className="mb-4">
            ¿Deseas comprar el libro <strong>{selectedBook.titulo}</strong> por{' '}
            {formatCurrency(selectedBook.precio || MONTOS.libro_ingles)}?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button
              variant="success"
              onClick={() => {
                setHistorialCompras((prev) => [...prev, selectedBook]);
                alert(`Has comprado "${selectedBook.titulo}" con éxito.`);
                setShowModal(false);
              }}
            >
              Confirmar
            </Button>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
