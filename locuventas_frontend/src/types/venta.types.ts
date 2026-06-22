// src/types/venta.types.ts
export type EstadoPago = "PAGADO" | "PARCIAL" | "PENDIENTE";

export interface Venta {
  id:          number;
  fecha:       string;
  vendedor:    string;
  total:       number;
  saldo:       number;
  montoPagado: number;
  estadoPago:  EstadoPago;
  cancelada:   boolean;
}

export interface LineaVenta {
  productoId: number;
  cantidad:   number;
  subtotal:   number;
}