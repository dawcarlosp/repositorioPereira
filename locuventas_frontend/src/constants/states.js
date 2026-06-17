/**
 * Estados de pago y estilos asociados
 * Centraliza constantes reutilizadas en múltiples componentes
 */

export const PAYMENT_STATES = {
  PAGADO: "PAGADO",
  PARCIAL: "PARCIAL",
  PENDIENTE: "PENDIENTE",
};

/**
 * Estilos Tailwind para cada estado de pago
 * Usado en VentaCard.jsx, TablaVentas.jsx, etc.
 */
export const PAYMENT_STATE_STYLES = {
  [PAYMENT_STATES.PAGADO]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  [PAYMENT_STATES.PARCIAL]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  [PAYMENT_STATES.PENDIENTE]: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

/**
 * Obtiene el estilo para un estado de pago
 * @param {string} estado - Estado de pago
 * @returns {string} Clases Tailwind
 */
export const getPaymentStateStyle = (estado) => {
  return PAYMENT_STATE_STYLES[estado] || PAYMENT_STATE_STYLES[PAYMENT_STATES.PENDIENTE];
};

/**
 * Estados de productos en gestión
 */
export const PRODUCT_STATES = {
  ACTIVO: "ACTIVO",
  EN_VENTA: "EN_VENTA",
  INACTIVO: "INACTIVO",
};

/**
 * Estados de vendedores
 */
export const SELLER_STATES = {
  PENDIENTE: "PENDIENTE",
  APROBADO: "APROBADO",
  RECHAZADO: "RECHAZADO",
};
