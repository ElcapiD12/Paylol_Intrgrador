// components/servicios-escolares/SolicitudConstanciaDemo.jsx
// SISTEMA COMPLETO: Solicitud + Pagos + Comprobantes

import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { Card, Select, Button, Alert, Badge, EmptyState } from '../shared';
import { TIPOS_CONSTANCIA, MONTOS, TIPOS_PAGO, ESTADOS_PAGO, DATOS_BANCARIOS } from '../../utils/constants';
import { formatCurrency, formatDate, getEstadoSolicitudColor } from '../../utils/helpers';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { FileText, Download, Clock, CheckCircle, XCircle, AlertCircle, Upload, ArrowDown, CreditCard, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';

export default function SolicitudConstanciaDemo() {
  // TEMPORAL: Usuario de prueba (reemplazar con useAuth())
  const user = {
    uid: 'test-user-123',
    email: 'estudiante@prueba.com',
    displayName: 'Estudiante de Prueba'
  };

  const [tipoConstancia, setTipoConstancia] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
  const [uploadingComprobante, setUploadingComprobante] = useState(null);
  const submitButtonRef = useRef(null);

  const precioConstancia = tipoConstancia ? MONTOS[TIPOS_PAGO.CONSTANCIA] : 0;

  // Función para generar referencia bancaria única
  const generarReferencia = () => {
    const fecha = new Date();
    const timestamp = fecha.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CONST-${timestamp}${random}`;
  };

  // Función de scroll al botón
  const scrollToSubmitButton = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      submitButtonRef.current.classList.add('animate-pulse');
      setTimeout(() => {
        submitButtonRef.current?.classList.remove('animate-pulse');
      }, 2000);
    }
  };

  useEffect(() => {
  if (!user) return;

  // QUERY SIN orderBy
  const q = query(
    collection(db, 'solicitudesConstancias'),
    where('userId', '==', user.uid)
    // ← SIN orderBy aquí
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fechaSolicitud: doc.data().fechaSolicitud?.toDate(),
      fechaActualizacion: doc.data().fechaActualizacion?.toDate(),
      fechaComprobante: doc.data().fechaComprobante?.toDate(),
    }));
    
    // ORDENAR MANUALMENTE en JavaScript
    data.sort((a, b) => {
      const fechaA = a.fechaSolicitud ? a.fechaSolicitud.getTime() : 0;
      const fechaB = b.fechaSolicitud ? b.fechaSolicitud.getTime() : 0;
      return fechaB - fechaA; // Descendente (más reciente primero)
    });
    
    setSolicitudes(data);
    setLoadingSolicitudes(false);
  }, (error) => {
    console.error('Error cargando solicitudes:', error);
    setSolicitudes([]);
    setLoadingSolicitudes(false);
  });

  
    return () => unsubscribe();
  }, [user]);

  // Crear solicitud de constancia CON DATOS DE PAGO
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tipoConstancia) {
      setAlert({ type: 'danger', message: 'Por favor selecciona un tipo de constancia' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const referenciaPago = generarReferencia();

      const solicitud = {
        // Datos del usuario
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        
        // Datos de la constancia
        tipoConstancia,
        tipoConstanciaLabel: TIPOS_CONSTANCIA.find(t => t.value === tipoConstancia)?.label,
        motivo: motivo.trim() || 'Sin motivo especificado',
        
        // Datos de pago
        monto: precioConstancia,
        referenciaPago,
        estadoPago: ESTADOS_PAGO.PENDIENTE_PAGO,
        
        // Datos bancarios para el pago
        datosBancarios: DATOS_BANCARIOS,
        
        // Estado general
        estado: 'pendiente',
        
        // Timestamps
        fechaSolicitud: serverTimestamp(),
        fechaActualizacion: serverTimestamp(),
        fechaLimitePago: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      };

      await addDoc(collection(db, 'solicitudesConstancias'), solicitud);

      setAlert({ 
        type: 'success', 
        message: '¡Solicitud creada! Ahora debes realizar el pago para continuar.' 
      });
      
      setTipoConstancia('');
      setMotivo('');

      setTimeout(() => setAlert(null), 5000);

    } catch (error) {
      console.error('Error al crear solicitud:', error);
      setAlert({ type: 'danger', message: 'Error al enviar la solicitud. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Subir comprobante de pago
  const handleSubirComprobante = async (solicitudId, file) => {
    if (!file) return;

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!tiposPermitidos.includes(file.type)) {
      setAlert({ type: 'danger', message: 'Solo se permiten imágenes (JPG, PNG) o PDF' });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAlert({ type: 'danger', message: 'El archivo no debe superar 5MB' });
      return;
    }

    setUploadingComprobante(solicitudId);

    try {
      // Subir archivo a Firebase Storage
      const fileName = `comprobantes/${solicitudId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizar solicitud en Firestore
      const solicitudRef = doc(db, 'solicitudesConstancias', solicitudId);
      await updateDoc(solicitudRef, {
        comprobanteURL: downloadURL,
        comprobanteNombre: file.name,
        estadoPago: ESTADOS_PAGO.COMPROBANTE_SUBIDO,
        fechaComprobante: serverTimestamp(),
        fechaActualizacion: serverTimestamp(),
      });

      setAlert({ 
        type: 'success', 
        message: '¡Comprobante subido! Será validado por el área de pagos.' 
      });

      setTimeout(() => setAlert(null), 3000);

    } catch (error) {
      console.error('Error al subir comprobante:', error);
      setAlert({ type: 'danger', message: 'Error al subir el comprobante. Intenta nuevamente.' });
    } finally {
      setUploadingComprobante(null);
    }
  };

  const getEstadoIcon = (estado) => {
    const icons = {
      pendiente: <Clock className="w-4 h-4" />,
      en_proceso: <AlertCircle className="w-4 h-4" />,
      completado: <CheckCircle className="w-4 h-4" />,
      rechazado: <XCircle className="w-4 h-4" />,
    };
    return icons[estado] || <FileText className="w-4 h-4" />;
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completado: 'Completado',
      rechazado: 'Rechazado',
    };
    return labels[estado] || estado;
  };

  const handleDescargar = (solicitud) => {
    const doc = new jsPDF();
    
    const colorPrimario = [59, 130, 246];
    const colorSecundario = [107, 114, 128];
    
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('CONSTANCIA OFICIAL', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(solicitud.tipoConstanciaLabel, 105, 32, { align: 'center' });
    
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(1);
    doc.line(20, 45, 190, 45);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('FOLIO:', 20, 55);
    doc.setFont(undefined, 'normal');
    doc.text(solicitud.id.substring(0, 8).toUpperCase(), 45, 55);
    
    doc.setFont(undefined, 'bold');
    doc.text('FECHA DE EMISIÓN:', 120, 55);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(new Date()), 170, 55);
    
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 65, 170, 8, 'F');
    doc.setTextColor(...colorPrimario);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL SOLICITANTE', 25, 70);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Nombre completo:', 25, 82);
    doc.setFont(undefined, 'normal');
    doc.text(solicitud.userName, 65, 82);
    
    doc.setFont(undefined, 'bold');
    doc.text('Correo electrónico:', 25, 92);
    doc.setFont(undefined, 'normal');
    doc.text(solicitud.userEmail, 65, 92);
    
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 102, 170, 8, 'F');
    doc.setTextColor(...colorPrimario);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DETALLES DE LA SOLICITUD', 25, 107);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Fecha de solicitud:', 25, 119);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(solicitud.fechaSolicitud), 65, 119);
    
    doc.setFont(undefined, 'bold');
    doc.text('Monto pagado:', 25, 129);
    doc.setFont(undefined, 'normal');
    doc.text(formatCurrency(solicitud.monto), 65, 129);
    
    doc.setFont(undefined, 'bold');
    doc.text('Estado:', 25, 139);
    doc.setFont(undefined, 'normal');
    doc.text(solicitud.estado.toUpperCase(), 65, 139);
    
    if (solicitud.motivo && solicitud.motivo !== 'Sin motivo especificado') {
      doc.setFont(undefined, 'bold');
      doc.text('Motivo de la solicitud:', 25, 149);
      doc.setFont(undefined, 'normal');
      const motivoLines = doc.splitTextToSize(solicitud.motivo, 160);
      doc.text(motivoLines, 25, 159);
    }
    
    const yPosition = solicitud.motivo && solicitud.motivo !== 'Sin motivo especificado' ? 190 : 170;
    
    doc.setFillColor(240, 253, 244);
    doc.rect(20, yPosition, 170, 30, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.rect(20, yPosition, 170, 30);
    
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('✓ DOCUMENTO VERIFICADO', 105, yPosition + 10, { align: 'center' });
    
    doc.setTextColor(...colorSecundario);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Este documento ha sido generado electrónicamente y es válido', 105, yPosition + 18, { align: 'center' });
    doc.text('únicamente con sello y firma oficial de la institución.', 105, yPosition + 24, { align: 'center' });
    
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
    
    doc.setTextColor(...colorSecundario);
    doc.setFontSize(8);
    doc.text('Sistema de Gestión Escolar PAYLOL', 105, 278, { align: 'center' });
    doc.text(`Generado el ${formatDate(new Date())} a las ${new Date().toLocaleTimeString()}`, 105, 283, { align: 'center' });
    
    doc.save(`constancia-${solicitud.id.substring(0, 8)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* FORMULARIO DE SOLICITUD */}
      <Card title="Solicitar Constancia" subtitle="Completa el formulario para solicitar tu constancia">
        {alert && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Select
            label="Tipo de Constancia"
            required
            options={[
              { value: '', label: 'Selecciona una constancia' },
              ...TIPOS_CONSTANCIA
            ]}
            value={tipoConstancia}
            onChange={(e) => setTipoConstancia(e.target.value)}
          />

          {tipoConstancia && (
            <div className="mb-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
              <p className="text-sm text-gray-600">Precio:</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(precioConstancia)}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Motivo (Opcional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Describe brevemente el motivo de tu solicitud..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          {/* BOTÓN DE SCROLL */}
          {tipoConstancia && (
            <button
              type="button"
              onClick={scrollToSubmitButton}
              className="w-full mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all"
            >
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <span className="text-sm font-medium">📸 Alternativa rápida</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs text-blue-600">Ver botón de envío</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            </button>
          )}

          {/* RESUMEN */}
          {tipoConstancia && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resumen de tu solicitud
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Tipo:</span>
                  <span className="text-gray-900 font-semibold">
                    {TIPOS_CONSTANCIA.find(t => t.value === tipoConstancia)?.label}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Precio:</span>
                  <span className="text-green-700 font-bold text-lg">
                    {formatCurrency(precioConstancia)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Solicitante:</span>
                  <span className="text-gray-900">{user.displayName || user.email}</span>
                </div>
                
                {motivo && (
                  <div className="pt-2 border-t border-green-200">
                    <p className="text-gray-600 font-medium mb-1">Motivo:</p>
                    <p className="text-gray-700 italic">"{motivo}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOTÓN DE ENVÍO */}
          <button 
            ref={submitButtonRef}
            type="submit" 
            className="w-full mt-4 text-lg font-bold px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={loading || !tipoConstancia}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Enviando solicitud...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                ✓ Crear Solicitud
              </>
            )}
          </button>
        </form>
      </Card>

      {/* LISTA DE SOLICITUDES */}
      <Card title="Mis Solicitudes" subtitle={`${solicitudes.length} solicitud(es)`}>
        {loadingSolicitudes ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
          </div>
        ) : solicitudes.length === 0 ? (
          <EmptyState 
            message="No tienes solicitudes de constancias"
            description="Crea una nueva solicitud usando el formulario de arriba"
          />
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud) => (
              <SolicitudCard
                key={solicitud.id}
                solicitud={solicitud}
                onSubirComprobante={handleSubirComprobante}
                uploadingComprobante={uploadingComprobante}
                onDescargar={handleDescargar}
                getEstadoIcon={getEstadoIcon}
                getEstadoLabel={getEstadoLabel}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================
// COMPONENTE: Tarjeta de Solicitud Individual
// ============================================

function SolicitudCard({ solicitud, onSubirComprobante, uploadingComprobante, onDescargar, getEstadoIcon, getEstadoLabel }) {
  const fileInputRef = useRef(null);
  const [mostrarDatosBancarios, setMostrarDatosBancarios] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSubirComprobante(solicitud.id, file);
    }
  };

  const getEstadoPagoColor = (estado) => {
    const colores = {
      pendiente_pago: 'warning',
      comprobante_subido: 'info',
      validando: 'info',
      pagado: 'success',
      rechazado: 'danger',
    };
    return colores[estado] || 'secondary';
  };

  const getEstadoPagoLabel = (estado) => {
    const labels = {
      pendiente_pago: 'Pendiente de Pago',
      comprobante_subido: 'Comprobante Enviado',
      validando: 'Validando Pago',
      pagado: 'Pago Confirmado',
      rechazado: 'Comprobante Rechazado',
    };
    return labels[estado] || estado;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-gray-400" />
            <h4 className="font-semibold text-gray-800">{solicitud.tipoConstanciaLabel}</h4>
          </div>
          <p className="text-sm text-gray-500">
            Folio: {solicitud.id.substring(0, 8).toUpperCase()}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
          {solicitud.estadoPago && (
            <Badge variant={getEstadoPagoColor(solicitud.estadoPago)}>
              {getEstadoPagoLabel(solicitud.estadoPago)}
            </Badge>
          )}
          <Badge variant={getEstadoSolicitudColor(solicitud.estado)} className="flex items-center gap-1">
            {getEstadoIcon(solicitud.estado)}
            {getEstadoLabel(solicitud.estado)}
          </Badge>
        </div>
      </div>

      {/* INFO GENERAL */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <p className="text-gray-500">Fecha:</p>
          <p className="font-medium text-gray-700">{formatDate(solicitud.fechaSolicitud)}</p>
        </div>
        <div>
          <p className="text-gray-500">Monto:</p>
          <p className="font-medium text-gray-700">{formatCurrency(solicitud.monto)}</p>
        </div>
      </div>

      {/* SECCIÓN DE PAGO - Solo si está pendiente */}
      {solicitud.estadoPago === ESTADOS_PAGO.PENDIENTE_PAGO && (
        <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-yellow-700" />
            <h4 className="font-bold text-yellow-800">Información de Pago</h4>
          </div>

          <button
            onClick={() => setMostrarDatosBancarios(!mostrarDatosBancarios)}
            className="w-full mb-3 flex items-center justify-between p-3 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">Ver datos bancarios</span>
            </div>
            <ArrowDown className={`w-4 h-4 transition-transform ${mostrarDatosBancarios ? 'rotate-180' : ''}`} />
          </button>

          {mostrarDatosBancarios && solicitud.datosBancarios && (
            <div className="mb-4 p-3 bg-white border border-yellow-200 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Banco:</span>
                <span className="font-semibold">{solicitud.datosBancarios.banco}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Titular:</span>
                <span className="font-semibold">{solicitud.datosBancarios.titular}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cuenta:</span>
                <span className="font-mono font-bold">{solicitud.datosBancarios.cuenta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CLABE:</span>
                <span className="font-mono font-bold">{solicitud.datosBancarios.clabe}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Referencia:</span>
                <span className="font-mono font-bold text-blue-600">{solicitud.referenciaPago}</span>
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-700">
                  <strong>Importante:</strong> Incluye la referencia <strong>{solicitud.referenciaPago}</strong> en tu pago
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-700 font-medium text-center">
              Monto a pagar: <span className="text-lg font-bold text-green-600">{formatCurrency(solicitud.monto)}</span>
            </p>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingComprobante === solicitud.id}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingComprobante === solicitud.id ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Subiendo comprobante...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Subir Comprobante de Pago
                </>
              )}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <p className="text-xs text-gray-500 text-center">
              📎 Formatos aceptados: JPG, PNG o PDF (máximo 5MB)
            </p>
          </div>
        </div>
      )}

      {/* COMPROBANTE SUBIDO */}
      {solicitud.comprobanteURL && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-2">✓ Comprobante subido</p>
          <a 
            href={solicitud.comprobanteURL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Ver comprobante
          </a>
        </div>
      )}

      {/* COMENTARIO DE RECHAZO */}
      {solicitud.estadoPago === ESTADOS_PAGO.RECHAZADO && solicitud.motivoRechazo && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">Motivo del rechazo:</p>
          <p className="text-sm text-red-600">{solicitud.motivoRechazo}</p>
          <p className="text-xs text-red-500 mt-2">
            Por favor, sube un nuevo comprobante corrigiendo el error indicado.
          </p>
        </div>
      )}

      {/* MOTIVO DE LA SOLICITUD */}
      {solicitud.motivo && solicitud.motivo !== 'Sin motivo especificado' && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
          <p className="text-gray-500">Motivo:</p>
          <p className="text-gray-700">{solicitud.motivo}</p>
        </div>
      )}

      {/* COMENTARIO DEL ADMIN */}
      {solicitud.comentarioAdmin && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
          <p className="text-blue-600 font-medium">Comentario del administrador:</p>
          <p className="text-gray-700">{solicitud.comentarioAdmin}</p>
        </div>
      )}

      {/* CONSTANCIA LISTA PARA DESCARGAR */}
      {solicitud.estadoPago === ESTADOS_PAGO.PAGADO && solicitud.estado === 'completado' && (
        <button 
          onClick={() => onDescargar(solicitud)}
          className="w-full mt-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar Constancia PDF
        </button>
      )}
    </div>
  );
}