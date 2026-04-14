// src/components/ventas/ContenedorVentas.jsx
import React from "react";
import TablaVentas from "./TablaVentas";
import VentaCard from "./VentaCard";
import Paginacion from "@components/common/Paginacion";

export default function ContenedorVentas({ 
  ventas, 
  isMobile, 
  onVerDetalle, 
  onCancelar, 
  onCobrar, 
  page, 
  totalPages, 
  onPageChange 
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
          onVerDetalle={onVerDetalle}
          onCancelarVenta={onCancelar}
          onCobrarResto={onCobrar}
        />
      )}

      {totalPages > 1 && (
        <Paginacion page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}