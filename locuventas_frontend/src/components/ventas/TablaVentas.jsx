import React from "react";
import TablaLayout from "@components/common/TablaLayout";

export default function TablaVentas({
  ventas,
  loading,
  onVerDetalle,
  onCancelarVenta,
  onCobrarResto,
  paginaActual = 0,
  totalPaginas = 1,
  onPageChange,
  size,
  onSizeChange
}) {
  // Definimos las columnas para el Layout
  const columnas = [
    { label: "ID" },
    { label: "Fecha" },
    { label: "Vendedor" },
    { label: "Total", className: "text-right" },
    { label: "Estado", className: "text-center" },
    { label: "Cancelada", className: "text-center" },
    { label: "Acciones", className: "text-right" }
  ];

  return (
    <TablaLayout
      columnas={columnas}
      loading={loading}
      paginaActual={paginaActual}
      totalPaginas={totalPaginas}
      onPageChange={onPageChange}
      size={size}         
      onSizeChange={onSizeChange}
    >
      {ventas.length === 0 ? (
        <tr>
          <td colSpan={7} className="py-20 text-center text-zinc-500 italic">
            No se encontraron ventas en este registro.
          </td>
        </tr>
      ) : (
        ventas.map((venta) => (
          <tr
            key={venta.id}
            className="hover:bg-zinc-700/30 transition-colors group text-zinc-300"
          >
            {/* ID */}
            <td className="px-4 py-4 font-medium">#{venta.id}</td>

            {/* Fecha */}
            <td className="px-4 py-4 text-sm whitespace-nowrap text-zinc-400">
              {venta.fecha ? new Date(venta.fecha).toLocaleString("es-ES", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              }) : "-"}
            </td>

            {/* Vendedor */}
            <td className="px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center text-[10px] text-orange-500 border border-orange-500/20">
                  {venta.vendedor?.charAt(0) || "U"}
                </div>
                {venta.vendedor || "N/A"}
              </div>
            </td>

            {/* Total */}
            <td className="px-4 py-4 text-right text-white font-bold">
              {venta.total?.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </td>

            {/* Estado */}
            <td className="px-4 py-4 text-center">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide
                ${venta.estadoPago === "PAGADO" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                  venta.estadoPago === "PARCIAL" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-500 border border-rose-500/20"}
              `}>
                {venta.estadoPago}
              </span>
            </td>

            {/* Cancelada */}
            <td className="px-4 py-4 text-center">
              {venta.cancelada ? (
                <span className="text-rose-500 text-xs font-semibold">Anulada</span>
              ) : (
                <span className="text-emerald-500 text-xs font-semibold italic opacity-50">Vigente</span>
              )}
            </td>

            {/* Acciones */}
            <td className="px-4 py-4">
              <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  title="Ver detalle"
                  onClick={() => onVerDetalle(venta)}
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-orange-500 hover:text-white transition-all border border-zinc-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                {!venta.cancelada && (
                  <>
                    {venta.saldo > 0 && (
                      <button
                        title="Cobrar saldo"
                        onClick={() => onCobrarResto(venta)}
                        className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                    <button
                      title="Cancelar venta"
                      onClick={() => onCancelarVenta(venta)}
                      className="p-2 rounded-lg bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))
      )}
    </TablaLayout>
  );
}