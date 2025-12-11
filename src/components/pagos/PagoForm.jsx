// src/components/pagos/PagoForm.jsx
import React, { useState } from 'react';
import { Button, Alert } from '../shared';
import { generarFolio } from '../../utils/helpers';

const PagoForm = ({ pago, onSuccess, onCancel }) => {
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [folio] = useState(generarFolio());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validación básica
    if (!metodoPago) {
      setError('Por favor selecciona un método de pago');
      setIsProcessing(false);
      return;
    }

    // Simulación de procesamiento (para que se vea realista)
    // En producción, aquí iría la integración con Stripe/PayPal
    setTimeout(() => {
      setIsProcessing(false);
      
      // Datos completos para el recibo
      const datosPago = {
        metodo: metodoPago,
        folio: folio,
        fecha: new Date().toISOString(),
        referencia: `REF-${Date.now()}`,
        concepto: pago.concepto,
        monto: pago.monto
      };
      
      // Llamar a la función de éxito del padre
      // El padre se encarga de actualizar Firestore
      onSuccess(datosPago);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error">{error}</Alert>
      )}

      {/* Resumen del Pago */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-bold text-lg mb-2">Resumen del Pago</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Concepto:</span>
            <span className="font-semibold">{pago.concepto}</span>
          </div>
          <div className="flex justify-between">
            <span>Monto:</span>
            <span className="text-xl font-bold text-green-700">${pago.monto.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Folio:</span>
            <code className="font-mono bg-white px-2 py-1 rounded">{folio}</code>
          </div>
        </div>
      </div>

      {/* Método de Pago */}
      <div>
        <label className="block font-medium mb-2">Método de Pago *</label>
        <div className="space-y-2">
          {['tarjeta', 'transferencia', 'efectivo'].map((metodo) => (
            <div key={metodo} className="flex items-center">
              <input
                type="radio"
                id={metodo}
                value={metodo}
                checked={metodoPago === metodo}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="mr-2"
                disabled={isProcessing}
              />
              <label htmlFor={metodo} className="cursor-pointer">
                {metodo === 'tarjeta' && '💳 Tarjeta de Crédito/Débito'}
                {metodo === 'transferencia' && '🏦 Transferencia Bancaria'}
                {metodo === 'efectivo' && '💰 Efectivo (Sucursal)'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Información Adicional */}
      {metodoPago === 'tarjeta' && (
        <div className="bg-yellow-50 p-3 rounded text-sm">
          <p className="font-semibold mb-1">💡 Nota:</p>
          <p>Para esta demo, no se requiere información real de tarjeta. En producción se integraría con Stripe/PayPal.</p>
        </div>
      )}

      {metodoPago === 'transferencia' && (
        <div className="bg-blue-50 p-3 rounded text-sm">
          <p className="font-semibold mb-1">🏦 Datos para transferencia:</p>
          <p className="text-xs">Banco: BBVA | CLABE: 012180001234567890</p>
          <p className="text-xs">Referencia: {folio}</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700"
            disabled={isProcessing}
          >
            Cancelar
          </Button>
        )}
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Procesando...
            </>
          ) : (
            'Confirmar Pago'
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center pt-4">
        Al confirmar, el pago se registrará en el sistema y se generará tu recibo PDF automáticamente.
      </p>
    </form>
  );
};

export default PagoForm;