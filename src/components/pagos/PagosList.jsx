import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Alert } from '../shared';
import { formatCurrency, formatDate, estaVencido, diasRestantes, generarFolio } from '../../utils/helpers';
import { ESTADOS_PAGO, TIPOS_PAGO, MENSAJES_EXITO } from '../../utils/constants';
import { obtenerPagos, actualizarPago } from '../../services/pagosService';
import PagoForm from './PagoForm';
import Recibo from './Recibo';

function PagosList() {
  const [pagos, setPagos] = useState([]);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [showModalPago, setShowModalPago] = useState(false);
  const [showModalRecibo, setShowModalRecibo] = useState(false);
  const [reciboData, setReciboData] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [cargando, setCargando] = useState(true);

  // DATOS DEL USUARIO ACTUAL
  // TODO: Reemplazar con datos reales de autenticación (Programador 1)
  const usuarioActual = {
    id: "user123", // Este debería venir de Firebase Auth
    nombre: "Juan Pérez",
    matricula: "A12345678",
    email: "juan.perez@universidad.mx"
  };

  // Cargar pagos desde Firestore
  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    setCargando(true);
    try {
      const resultado = await obtenerPagos(usuarioActual.id);
      
      if (resultado.success) {
        setPagos(resultado.data);
      } else {
        setAlerta({
          tipo: 'error',
          mensaje: '❌ Error al cargar pagos: ' + resultado.error
        });
      }
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      setAlerta({
        tipo: 'error',
        mensaje: '❌ Error al conectar con el servidor'
      });
    } finally {
      setCargando(false);
    }
  };

  const handlePagarClick = (pago) => {
    console.log('🟢 Botón Pagar clickeado para:', pago.concepto);
    setPagoSeleccionado(pago);
    setShowModalPago(true);
  };

  const handlePagoExitoso = async (datosPago) => {
    try {
      // Actualizar estado del pago en Firestore con datos adicionales
      const datosActualizacion = {
        folio: datosPago.folio,
        metodoPago: datosPago.metodo,
        referencia: datosPago.referencia
      };
      
      const resultado = await actualizarPago(
        pagoSeleccionado.id, 
        ESTADOS_PAGO.PAGADO,
        datosActualizacion
      );
      
      if (resultado.success) {
        // Actualizar estado local
        const pagosActualizados = pagos.map(p => 
          p.id === pagoSeleccionado.id 
            ? { 
                ...p, 
                estado: ESTADOS_PAGO.PAGADO, 
                fechaPago: new Date().toISOString(),
                folio: datosPago.folio,
                metodoPago: datosPago.metodo
              }
            : p
        );
        setPagos(pagosActualizados);
        
        // Cerrar modal de pago
        setShowModalPago(false);
        
        // Mostrar alerta de éxito
        setAlerta({
          tipo: 'success',
          mensaje: MENSAJES_EXITO.PAGO_EXITOSO || '✅ Pago procesado exitosamente'
        });
        
        // Preparar datos para el recibo
        const datosRecibo = {
          ...datosPago,
          concepto: pagoSeleccionado.concepto,
          monto: pagoSeleccionado.monto,
          fecha: new Date().toLocaleDateString('es-MX'),
          estudiante: usuarioActual.nombre,
          matricula: usuarioActual.matricula
        };
        
        setReciboData(datosRecibo);
        setShowModalRecibo(true);
        
        // Generar PDF automáticamente
        setTimeout(() => {
          Recibo.generarPDF(datosRecibo);
        }, 1000);
        
        // Limpiar alerta después de 5 segundos
        setTimeout(() => setAlerta(null), 5000);
      } else {
        setAlerta({
          tipo: 'error',
          mensaje: '❌ Error al procesar el pago: ' + resultado.error
        });
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      setAlerta({
        tipo: 'error',
        mensaje: '❌ Error al guardar el pago'
      });
    }
  };

  const handleReimprimirRecibo = (pago) => {
    const datosRecibo = {
      concepto: pago.concepto,
      monto: pago.monto,
      folio: pago.folio || generarFolio(),
      fecha: pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString('es-MX') : new Date().toLocaleDateString('es-MX'),
      estudiante: usuarioActual.nombre,
      matricula: usuarioActual.matricula,
      metodo: pago.metodoPago || 'N/A'
    };
    
    Recibo.generarPDF(datosRecibo);
  };

  const getEstadoBadge = (estado) => {
    const estadosMap = {
      [ESTADOS_PAGO.PENDIENTE]: 'Pendiente',
      [ESTADOS_PAGO.PAGADO]: 'Pagado',
      [ESTADOS_PAGO.VENCIDO]: 'Vencido',
      'pendiente': 'Pendiente',
      'pagado': 'Pagado',
      'vencido': 'Vencido'
    };
    return estadosMap[estado] || 'Pendiente';
  };

  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case TIPOS_PAGO.COLEGIATURA: return '🏫';
      case TIPOS_PAGO.INSCRIPCION: return '📝';
      case TIPOS_PAGO.CONSTANCIA: return '📄';
      case TIPOS_PAGO.LIBRO_INGLES: return '📚';
      case TIPOS_PAGO.EXAMEN_OXFORD: return '🌍';
      case TIPOS_PAGO.EXTRAORDINARIO: return '⚡';
      default: return '💰';
    }
  };

  const pagosPendientes = pagos.filter(p => p.estado === ESTADOS_PAGO.PENDIENTE || p.estado === 'pendiente');
  const pagosVencidos = pagos.filter(p => p.estado === ESTADOS_PAGO.VENCIDO || p.estado === 'vencido');
  const pagosPagados = pagos.filter(p => p.estado === ESTADOS_PAGO.PAGADO || p.estado === 'pagado');

  if (cargando) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Cargando tus pagos...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Alertas */}
      {alerta && (
        <Alert 
          type={alerta.tipo} 
          message={alerta.mensaje}
          className="mb-6"
        />
      )}
      
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">{pagosPendientes.length}</div>
            <div className="text-blue-600">Pagos Pendientes</div>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">{pagosPagados.length}</div>
            <div className="text-green-600">Pagos Completados</div>
          </div>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-700">{pagosVencidos.length}</div>
            <div className="text-red-600">Pagos Vencidos</div>
          </div>
        </Card>
      </div>
      
      {/* Pagos Pendientes */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <span className="mr-2">⏳</span> Pagos Pendientes
        </h3>
        
        {pagosPendientes.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-gray-600">¡No tienes pagos pendientes!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagosPendientes.map((pago) => (
              <Card key={pago.id} className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    {getIconoTipo(pago.tipo)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{pago.concepto}</h4>
                    <p className="text-sm text-gray-500">{pago.tipo || 'Pago universitario'}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge estado={getEstadoBadge(pago.estado)} className="mb-2" />
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monto:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(pago.monto)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vencimiento:</span>
                    <span className={`font-medium ${estaVencido(pago.fechaVencimiento) ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatDate(pago.fechaVencimiento)}
                    </span>
                  </div>
                  
                  {!estaVencido(pago.fechaVencimiento) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Días restantes:</span>
                      <span className="font-medium text-green-600">
                        {diasRestantes(pago.fechaVencimiento)} días
                      </span>
                    </div>
                  )}
                  
                  {estaVencido(pago.fechaVencimiento) && (
                    <div className="bg-red-50 text-red-700 p-2 rounded text-sm mt-2">
                      ⚠️ Este pago está vencido
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handlePagarClick(pago)}
                  disabled={estaVencido(pago.fechaVencimiento)}
                  className={`w-full mt-4 font-bold py-3 rounded-lg transition ${
                    estaVencido(pago.fechaVencimiento)
                      ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {estaVencido(pago.fechaVencimiento) ? 'Contactar administración' : '💳 Pagar Ahora'}
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Pagos Vencidos (si existen) */}
      {pagosVencidos.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">⚠️</span> Pagos Vencidos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagosVencidos.map((pago) => (
              <Card key={pago.id} className="border-red-300 bg-red-50 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{pago.concepto}</h4>
                    <p className="text-red-600">Vencido el {formatDate(pago.fechaVencimiento)}</p>
                  </div>
                  <span className="text-2xl font-bold text-red-700">{formatCurrency(pago.monto)}</span>
                </div>
                <button
                  onClick={() => alert('Por favor, contacta a Servicios Escolares para regularizar tu situación')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
                >
                  📞 Contactar soporte
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Pagos Completados */}
      {pagosPagados.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">✅</span> Pagos Completados
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left">Concepto</th>
                  <th className="py-3 px-4 text-left">Fecha de Pago</th>
                  <th className="py-3 px-4 text-left">Monto</th>
                  <th className="py-3 px-4 text-left">Folio</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagosPagados.map((pago) => (
                  <tr key={pago.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{pago.concepto}</td>
                    <td className="py-3 px-4">{pago.fechaPago ? formatDate(pago.fechaPago) : '--/--/----'}</td>
                    <td className="py-3 px-4 font-semibold text-green-700">{formatCurrency(pago.monto)}</td>
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {pago.folio || 'N/A'}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleReimprimirRecibo(pago)}
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                      >
                        📄 Reimprimir recibo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Modal de Pago */}
      {pagoSeleccionado && (
        <Modal 
          isOpen={showModalPago} 
          onClose={() => setShowModalPago(false)} 
          title={`Pagar: ${pagoSeleccionado.concepto}`}
        >
          <PagoForm 
            pago={pagoSeleccionado} 
            onSuccess={handlePagoExitoso}
            onCancel={() => setShowModalPago(false)}
          />
        </Modal>
      )}
      
      {/* Modal de Recibo */}
      {showModalRecibo && reciboData && (
        <Modal 
          isOpen={showModalRecibo} 
          onClose={() => setShowModalRecibo(false)} 
          title="🎉 Pago Completado"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">¡Pago Exitoso!</h3>
            <p className="text-gray-600 mb-4">
              Tu recibo ha sido generado y descargado automáticamente.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
              <p><strong>Concepto:</strong> {reciboData.concepto}</p>
              <p><strong>Monto:</strong> {formatCurrency(reciboData.monto)}</p>
              <p><strong>Folio:</strong> <code>{reciboData.folio}</code></p>
              <p><strong>Fecha:</strong> {reciboData.fecha}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => Recibo.generarPDF(reciboData)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                📄 Descargar de nuevo
              </button>
              <button
                onClick={() => setShowModalRecibo(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PagosList;