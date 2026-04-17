// src/components/ventas/ContenedorVentas.jsx
import React from "react";
import TablaVentas from "./TablaVentas";
import VentaCard from "@/components/ventas/VentaCard";
import Paginacion from "@components/common/Paginacion";

export default function ContenedorVentas({ 
  ventas,
  loading, 
  isMobile, 
  onVerDetalle, 
  onCancelar, 
  onCobrar, 
  page, 
  totalPages, 
  onPageChange,
  size,
  onSizeChange 
}) {
  if (ventas.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 bg-zinc-800/50 rounded-2xl border border-zinc-700">
        No se encontraron ventas registradas.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isMobile ? (
        <div className="flex flex-col gap-4 pb-10">
          {ventas.map((v) => (
            <VentaCard 
              key={v.id} 
              venta={v} 
              onDetalle={onVerDetalle} 
              onCancelar={onCancelar} 
              onCobrarResto={onCobrar} 
            />
          ))}
        </div>
      ) : (
        <TablaVentas
          ventas={ventas}
          loading={loading}
          onVerDetalle={onVerDetalle}
          onCancelarVenta={onCancelar}
          onCobrarResto={onCobrar}
          paginaActual={page}
          totalPaginas={totalPages}
          onPageChange={onPageChange}
          size={size}         
          onSizeChange={onSizeChange}
        />
      )}
    </div>
  );
}