// src/components/pagos/Recibo.jsx
import jsPDF from 'jspdf';

class Recibo {
  static generarPDF(data) {
    try {
      const { 
        concepto, 
        monto, 
        folio, 
        fecha, 
        estudiante = "Estudiante", 
        matricula = "N/A",
        metodo = "Tarjeta"
      } = data;
      
      const doc = new jsPDF();
      
      // Encabezado
      doc.setFontSize(20);
      doc.setTextColor(0, 51, 102);
      doc.text('Universidad XYZ', 20, 20);
      doc.setFontSize(14);
      doc.text('Sistema de Pagos Universitarios', 20, 30);
      
      // Línea separadora
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Título
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('RECIBO DE PAGO', 105, 45, { align: 'center' });
      
      // Información
      doc.setFontSize(12);
      doc.text(`Folio: ${folio}`, 20, 60);
      doc.text(`Fecha: ${fecha}`, 20, 68);
      doc.text(`Estudiante: ${estudiante}`, 20, 76);
      doc.text(`Matrícula: ${matricula}`, 20, 84);
      doc.text(`Método: ${metodo}`, 20, 92);
      
      // Tabla
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 100, 170, 10, 'F');
      doc.text('Concepto', 25, 107);
      doc.text('Monto', 150, 107);
      
      // Detalle
      doc.setFontSize(11);
      doc.text(concepto, 25, 120);
      doc.text(`$${parseFloat(monto).toFixed(2)}`, 150, 120);
      
      // Total
      doc.setFontSize(14);
      doc.text('Total:', 120, 140);
      doc.setFontSize(16);
      doc.text(`$${parseFloat(monto).toFixed(2)}`, 150, 140);
      
      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Este documento es su comprobante oficial de pago.', 20, 160);
      doc.text('Conserve este recibo para cualquier aclaración.', 20, 167);
      
      // Guardar PDF
      const nombreArchivo = `Recibo_${folio}.pdf`;
      doc.save(nombreArchivo);
      
      return true;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert(`Error al generar PDF. Datos:\n\nFolio: ${data.folio}\nConcepto: ${data.concepto}\nMonto: $${data.monto}`);
      return false;
    }
  }
}

export default Recibo;