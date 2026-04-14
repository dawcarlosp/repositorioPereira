import React from "react";
import Boton from "@components/common/Boton";
import BotonClaro from "@components/common/BotonClaro";

export default function TablaVentas({
  ventas,
  onVerDetalle,
  onCancelarVenta,
  onCobrarResto,
  paginaActual = 0,
  totalPaginas = 1,
  onPrevPage,
  onNextPage,
}) {
  const showPaginador =
    typeof onPrevPage === "function" &&
    typeof onNextPage === "function" &&
    totalPaginas > 1;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-zinc-800/50 border border-zinc-700/50 rounded-2xl shadow-2xl">
      {/* Estilos para el scrollbar personalizado */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #3f3f46;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #f59e0b;
          }
        `}
      </style>

      {/* Contenedor con scroll horizontal y vertical */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-700/50">
              <th className="px-4 py-4 sticky top-0 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider z-20">ID</th>
              <th className="px-4 py-4 sticky top-0 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider z-20">Fecha</th>
              <th className="px-4 py-4 sticky top-0 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider z-20">Vendedor</th>
              <th className="px-4 py-4 sticky top-0 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider z-20 text-right">Total</th>
              <th className="px-4 py-4 sticky top-0 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider z-20 text-center">Estado</th>
              <th className="px-4 py-4 sticky top-0 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider z-20 text-center">Cancelada</th>
              <th className="px-4 py-4 sticky top-0 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider z-20 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
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
                  className="hover:bg-zinc-700/30 transition-colors group"
                >
                  <td className="px-4 py-4 text-zinc-300 font-medium">#{venta.id}</td>
                  <td className="px-4 py-4 text-zinc-400 text-sm whitespace-nowrap">
                    {venta.fecha ? new Date(venta.fecha).toLocaleString("es-ES", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    }) : "-"}
                  </td>
                  <td className="px-4 py-4 text-zinc-300">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center text-[10px] text-orange-500 border border-orange-500/20">
                        {venta.vendedor?.charAt(0) || "U"}
                      </div>
                      {venta.vendedor || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-white font-bold">
                    {venta.total?.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                  </td>
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
                  <td className="px-4 py-4 text-center">
                    {venta.cancelada ? (
                      <span className="text-rose-500 text-xs font-semibold">Anulada</span>
                    ) : (
                      <span className="text-emerald-500 text-xs font-semibold italic opacity-50">Vigente</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Ver detalle"
                        onClick={() => onVerDetalle(venta)}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-orange-500 hover:text-white transition-all border border-zinc-700"
                      >
                        <svg className="cursor-pointer w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>

                      {!venta.cancelada && (
                        <>
                          {venta.saldo > 0 && (
                            <button
                              title="Cobrar saldo"
                              onClick={() => onCobrarResto(venta)}
                              className=" cursor-pointer p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/30"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </button>
                          )}
                          <button
                            title="Cancelar venta"
                            onClick={() => onCancelarVenta(venta)}
                            className="cursor-pointer p-2 rounded-lg bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador Inferior */}
      {showPaginador && (
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-800/80 border-t border-zinc-700/50 backdrop-blur-md">
          <span className="text-xs text-zinc-400 font-medium uppercase tracking-widest">
            Página <span className="text-white">{paginaActual + 1}</span> de <span className="text-white">{totalPaginas}</span>
          </span>
          <div className="flex gap-2">
            <button
              disabled={paginaActual === 0}
              onClick={onPrevPage}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none"
            >
              Anterior
            </button>
            <button
              disabled={paginaActual + 1 >= totalPaginas}
              onClick={onNextPage}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}