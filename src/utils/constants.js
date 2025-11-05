// 📦 src/utils/constants.js

// 💰 MONTOS de cada tipo de examen
export const MONTOS = {
  extraordinario: 250, // puedes cambiar el monto si tu sistema usa otro
  remedial: 180,
};

// 🏷️ Estados posibles de una solicitud de extraordinario
export const ESTADOS_SOLICITUD = {
  DISPONIBLE: 'Disponible',
  SOLICITADO: 'Solicitado',
  AUTORIZADO: 'Autorizado',
  RECHAZADO: 'Rechazado',
  PAGADO: 'Pagado',
};
