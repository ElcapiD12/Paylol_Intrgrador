// src/components/idiomas/RegistroLibros.jsx
<<<<<<< HEAD

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
=======
import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../shared';
import { formatCurrency } from '../../utils/helpers';
import { MONTOS } from '../../utils/constants';
import { librosEjemplo } from '../../data/mockData';

export default function RegistroLibros() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Cargar historial desde localStorage al iniciar
  const [historialCompras, setHistorialCompras] = useState(() => {
    try {
      const saved = localStorage.getItem('historialComprasLibros');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error cargando historial:', error);
      return [];
    }
  });

  // Guardar en localStorage cuando cambie el historial
  useEffect(() => {
    try {
      localStorage.setItem('historialComprasLibros', JSON.stringify(historialCompras));
      console.log('Historial guardado:', historialCompras);
    } catch (error) {
      console.error('Error guardando historial:', error);
    }
  }, [historialCompras]);

  const handleBuy = (libro) => {
    console.log('Botón presionado, libro:', libro);
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64
    setSelectedBook(libro);
    setShowModal(true);
  };

<<<<<<< HEAD
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
=======
  const confirmarCompra = () => {
    console.log('Confirmando compra de:', selectedBook);
    if (selectedBook) {
      const compra = {
        ...selectedBook,
        fechaCompra: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      console.log('Agregando compra:', compra);
      setHistorialCompras((prev) => {
        const nuevo = [...prev, compra];
        console.log('Nuevo historial:', nuevo);
        return nuevo;
      });
      
      alert(`✅ ¡Compra exitosa!\n\nLibro: ${selectedBook.titulo}\nPrecio: ${formatCurrency(selectedBook.precio)}`);
      
      setShowModal(false);
      setSelectedBook(null);
    }
  };

  const cancelarCompra = () => {
    console.log('Compra cancelada');
    setShowModal(false);
    setSelectedBook(null);
  };

  console.log('Render - showModal:', showModal, 'selectedBook:', selectedBook);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Libros de Inglés</h2>

      {/* Debug info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
        <p>Debug: Modal abierto: {showModal ? 'SÍ' : 'NO'}</p>
        <p>Libro seleccionado: {selectedBook ? selectedBook.titulo : 'Ninguno'}</p>
        <p>Compras en historial: {historialCompras.length}</p>
      </div>

      {/* --- LISTA DE LIBROS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {librosEjemplo.map((libro) => (
          <Card key={libro.id}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{libro.titulo}</h3>
              <p className="text-sm text-gray-600 mb-3">{libro.descripcion}</p>
              
              <div className="flex items-center justify-between mb-4">
                <Badge color="blue">{libro.nivel}</Badge>
                <span className="text-2xl font-bold text-gray-800">
                  {formatCurrency(libro.precio)}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 mb-4">
                ISBN: {libro.isbn}
              </div>
            </div>
            
            <Button 
              variant="primary" 
              onClick={() => handleBuy(libro)}
              className="w-full"
            >
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64
              Comprar Libro
            </Button>
          </Card>
        ))}
      </div>

<<<<<<< HEAD
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
=======
      {/* --- HISTORIAL DE COMPRAS --- */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Historial de Compras</h3>

        {historialCompras.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">Aún no has comprado ningún libro.</p>
            <p className="text-sm text-gray-400 mt-2">Tus compras aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historialCompras.map((libro) => (
              <div 
                key={libro.timestamp} 
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{libro.titulo}</span>
                    <Badge color="blue" className="text-xs">{libro.nivel}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{libro.descripcion}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ISBN: {libro.isbn}
                  </p>
                </div>
                
                <div className="text-right ml-4">
                  <div className="font-bold text-lg text-blue-600">
                    {formatCurrency(libro.precio)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(libro.fechaCompra).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Total de compras */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  Total gastado:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    historialCompras.reduce((sum, libro) => sum + libro.precio, 0)
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-500 text-right mt-1">
                {historialCompras.length} {historialCompras.length === 1 ? 'libro' : 'libros'} comprado{historialCompras.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL SIMPLE SIN COMPONENTE MODAL --- */}
      {showModal && selectedBook && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={cancelarCompra}
        >
          <div 
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Confirmar Compra</h2>
              <button
                onClick={cancelarCompra}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  ¿Deseas confirmar la compra del siguiente libro?
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-lg text-blue-900 mb-2">
                    {selectedBook.titulo}
                  </h4>
                  
                  <p className="text-sm text-gray-700 mb-3">
                    {selectedBook.descripcion}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nivel:</span>
                      <Badge color="blue">{selectedBook.nivel}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ISBN:</span>
                      <span className="text-sm font-mono text-gray-700">
                        {selectedBook.isbn}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="font-semibold text-gray-700">Precio:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(selectedBook.precio)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    ℹ️ Esta compra se registrará en tu historial. Asegúrate de realizar el pago correspondiente.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="secondary" 
                    onClick={cancelarCompra}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={confirmarCompra}
                  >
                    Confirmar Compra
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64
