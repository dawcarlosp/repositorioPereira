// src/components/ventas/CarritoVenta.jsx
import React from "react";
import { useAuth } from "@context/useAuth";
import { useCarrito } from "@hooks/useCarrito";
import Boton from "@components/common/Boton";
import BotonClaro from "@components/common/BotonClaro";

export default function CarritoVenta({ carga, quitarProducto, onGuardar, onCobrar }) {
  const { auth } = useAuth();
  const { base, iva, total, numProductos } = useCarrito(carga);
  const formato = (num) => num.toLocaleString('es-ES', { minimumFractionDigits: 2 });

  return (
    <div className="flex flex-col h-full">
      {/* Header, Lista y Footer que diseñamos antes van aquí */}
      {/* ... (Todo el contenido interno del aside anterior) ... */}
      <div className="p-4 border-b border-zinc-800">
         <h2 className="text-white font-bold text-lg">Carrito de Venta</h2>
         <p className="text-zinc-500 text-xs">Atiende: {auth?.nombre}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Render de los productos */}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/80">
        {/* Totales y Botones */}
      </div>
    </div>
  );
}