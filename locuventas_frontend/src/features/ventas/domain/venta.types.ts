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

export interface LineaVentaDetalle {
  productoId:      number;
  productoNombre:  string;
  cantidad:        number;
  subtotal:        number;
  iva:             number;
  subtotalConIva:  number;
}

export interface VentaDetalle extends Venta {
  lineas: LineaVentaDetalle[];
}