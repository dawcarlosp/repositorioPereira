// src/features/ventas/hooks/useCarrito.ts
import { useMemo } from "react";
import type { Producto } from "@features/productos/domain/producto.types";

export interface CarritoItem {
  cantidad: number;
  producto: Producto;
}

interface CarritoTotales {
  base: number;
  iva: number;
  total: number;
  numProductos: number;
}

export function useCarrito(carga: CarritoItem[] = []): CarritoTotales {
  const totales = useMemo(() => {
    const base = carga.reduce((acc, item) => acc + item.cantidad * item.producto.precio, 0);
    const iva = carga.reduce((acc, item) => 
      acc + ((item.producto.iva ?? 0) / 100) * item.cantidad * item.producto.precio, 0
    );
    const numProductos = carga.reduce((s, x) => s + x.cantidad, 0);

    return {
      base,
      iva,
      total: base + iva,
      numProductos
    };
  }, [carga]);

  return totales;
}