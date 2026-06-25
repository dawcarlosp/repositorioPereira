import type { EstadoPago } from "@domain/venta.types";

export const PAYMENT_STATES: Record<string, EstadoPago> = {
  PAGADO:   "PAGADO",
  PARCIAL:  "PARCIAL",
  PENDIENTE: "PENDIENTE",
};

export const PAYMENT_STATE_STYLES: Record<EstadoPago, string> = {
  [PAYMENT_STATES.PAGADO]:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  [PAYMENT_STATES.PARCIAL]:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  [PAYMENT_STATES.PENDIENTE]: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export const getPaymentStateStyle = (estado: EstadoPago): string => {
  return PAYMENT_STATE_STYLES[estado] || PAYMENT_STATE_STYLES[PAYMENT_STATES.PENDIENTE];
};
