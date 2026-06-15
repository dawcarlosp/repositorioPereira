// src/components/ventas/VentaCard.jsx
import React from "react";
import BotonClaro from "@buttons/BotonClaro";

const ESTADO_STYLES = {
  PAGADO:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PARCIAL: "bg-amber-500/10  text-amber-400  border-amber-500/20",
  PENDIENTE: "bg-rose-500/10 text-rose-400   border-rose-500/20",
};

export default function VentaCard({ venta, onDetalle, onCancelar, onCobrarResto }) {
  const fecha = venta.fecha
    ? new Date(venta.fecha).toLocaleString("es-ES", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "-";

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col gap-3 p-4 w-full transition-all duration-200 hover:border-zinc-600">

      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <span className="font-black text-white text-base">#{venta.id}</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${
          ESTADO_STYLES[venta.estadoPago] ?? ESTADO_STYLES.PENDIENTE
        }`}>
          {venta.estadoPago}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 text-xs text-zinc-400">
        <div className="flex justify-between">
          <span>Fecha</span>
          <span className="text-zinc-200">{fecha}</span>
        </div>
        <div className="flex justify-between">
          <span>Vendedor</span>
          <span className="text-zinc-200">{venta.vendedor ?? "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <span className="text-white font-black text-sm">
            {venta.total?.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        {venta.saldo > 0 && (
          <div className="flex justify-between">
            <span>Saldo pendiente</span>
            <span className="text-amber-400 font-bold">
              {venta.saldo?.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
            </span>
          </div>
        )}
        {venta.cancelada && (
          <div className="flex justify-between">
            <span>Estado</span>
            <span className="text-rose-400 font-bold">Anulada</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
        <BotonClaro
          className="!h-8 !text-[11px] !justify-center"
          onClick={() => onDetalle(venta)}
        >
          Ver detalle
        </BotonClaro>

        {!venta.cancelada && venta.saldo > 0 && (
          <BotonClaro
            className="!h-8 !text-[11px] !justify-center !text-emerald-400 hover:!text-emerald-300"
            onClick={() => onCobrarResto(venta)}
          >
            Cobrar resto
          </BotonClaro>
        )}

        {!venta.cancelada && (
          <BotonClaro
            className="!h-8 !text-[11px] !justify-center !text-rose-400 hover:!text-rose-300"
            onClick={() => onCancelar(venta)}
          >
            Cancelar venta
          </BotonClaro>
        )}
      </div>
    </div>
  );
}