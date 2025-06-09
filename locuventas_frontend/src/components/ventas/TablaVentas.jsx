import React from "react";
import Boton from "../common/Boton";
import BotonClaro from "../common/BotonClaro";

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
    <div
      className="overflow-x-auto rounded-xl shadow-lg p-4"
      style={{
        maxHeight: "60vh",
        minHeight: "180px",
        background: "#fff8fd",
        border: "2px solid #FF7F50",
        boxShadow: "0 8px 36px #9b51e022",
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            height: 8px;
          }
          div::-webkit-scrollbar-thumb {
            background: #ffb68e;
            border-radius: 8px;
          }
        `}
      </style>
      <table className="min-w-[950px] w-full rounded-xl text-base">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-3 py-4 sticky top-0 bg-blue-500 z-10">ID</th>
            <th className="px-3 py-4 sticky top-0 bg-blue-500 z-10">Fecha</th>
            <th className="px-3 py-4 sticky top-0 bg-blue-500 z-10">Vendedor</th>
            <th className="px-3 py-4 sticky top-0 bg-blue-500 z-10">Total</th>
            <th className="px-3 py-4 sticky top-0 bg-blue-500 z-10">Estado</th>
            <th className="px-3 py-4 sticky top-0 bg-blue-500 z-10">Pagado</th>
            <th className="px-3 py-4 sticky top-0 bg-blue-500 z-10">Cancelada</th>
            <th className="px-3 py-4 sticky top-0 bg-blue-500 z-10 min-w-[220px]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 && (
            <tr>
              <td colSpan={8} className="py-8 text-center text-zinc-400">
                No hay ventas
              </td>
            </tr>
          )}
          {ventas.map((venta, idx) => (
            <tr
              key={venta.id}
              className={`
                ${idx % 2 === 0 ? "bg-purple-50" : "bg-white"}
                border-b border-purple-100
                hover:bg-orange-100 transition
              `}
            >
              <td className="px-3 py-2 text-zinc-900">{venta.id}</td>
              <td className="px-3 py-2 whitespace-nowrap text-zinc-900">
                {venta.fecha
                  ? new Date(venta.fecha).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : ""}
              </td>
              <td className="px-3 py-2 text-zinc-900">{venta.vendedor || "-"}</td>
              <td className="px-3 py-2 text-zinc-900">{venta.total} €</td>
              <td className="px-3 py-2">
                {venta.estadoPago === "PAGADO" && (
                  <span className="bg-green-500 text-white rounded-lg px-3 py-1 text-xs font-bold">
                    PAGADO
                  </span>
                )}
                {venta.estadoPago === "PARCIAL" && (
                  <span className="bg-yellow-400 text-yellow-900 rounded-lg px-3 py-1 text-xs font-bold">
                    PARCIAL
                  </span>
                )}
                {venta.estadoPago === "PENDIENTE" && (
                  <span className="bg-red-500 text-white rounded-lg px-3 py-1 text-xs font-bold">
                    PENDIENTE
                  </span>
                )}
              </td>
              <td className="px-3 py-4 text-zinc-900">{venta.montoPagado ?? 0} €</td>
              <td className="px-3 py-4">
                {venta.cancelada ? (
                  <span className="text-red-500 font-bold">Sí</span>
                ) : (
                  <span className="text-green-700 font-bold">No</span>
                )}
              </td>
              <td className="px-3 py-4 min-w-[220px]">
                <div className="flex flex-row flex-wrap gap-2 justify-start">
                  <BotonClaro
                    className="text-base px-4 bg-purple-500 hover:bg-purple-600 text-white font-bold"
                    onClick={() => onVerDetalle(venta)}
                  >
                    Detalle
                  </BotonClaro>
                  <Boton
                    className="text-base px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold"
                    onClick={() => onCancelarVenta(venta.id)}
                  >
                    Cancelar
                  </Boton>
                  {venta.saldo > 0 && !venta.cancelada && (
                    <BotonClaro
                      className="bg-green-500 hover:bg-green-600 text-white text-base px-4"
                      onClick={() => onCobrarResto(venta)}
                    >
                      Cobrar resto
                    </BotonClaro>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* PAGINADOR SOLO SI TIENE SENTIDO */}
      {showPaginador && (
        <div className="flex justify-center items-center mt-3 gap-3">
          <button
            className="bg-orange-400 text-white rounded px-4 py-2 font-bold disabled:opacity-40"
            onClick={onPrevPage}
            disabled={paginaActual === 0}
          >
            &lt;
          </button>
          <span className="font-bold text-lg text-zinc-900">
            Página {paginaActual + 1} de {totalPaginas}
          </span>
          <button
            className="bg-orange-400 text-white rounded px-4 py-2 font-bold disabled:opacity-40"
            onClick={onNextPage}
            disabled={paginaActual + 1 >= totalPaginas}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
