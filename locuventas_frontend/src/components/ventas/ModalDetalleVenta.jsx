import React from "react";
import ReactDOM from "react-dom";
import BotonClaro from "@components/common/BotonClaro";
import Boton from "@components/common/Boton";
import { descargarTicketPDF } from "@services/tickets";

export default function ModalDetalleVenta({ venta, onClose }) {
  if (!venta) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000000] bg-black/70 backdrop-blur-[2px] flex items-center justify-center px-2 sm:px-4">
      <div
        className="bg-zinc-900 text-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-zinc-700 flex flex-col max-h-[90vh]"
        style={{ minWidth: 0 }}
      >
        {/* Contenido scrollable */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          <h2 className="text-lg sm:text-2xl font-bold tracking-wide mb-2">
            Detalle de Venta #{venta.id}
          </h2>

          <div className="space-y-1 text-base">
            <div><b>Total:</b> {venta.total?.toFixed(2)} €</div>
            <div><b>Pagado:</b> {venta.montoPagado?.toFixed(2)} €</div>
            <div><b>Saldo pendiente:</b> {venta.saldo?.toFixed(2)} €</div>
            <div><b>Estado:</b> {venta.estadoPago}</div>
            <div><b>Vendedor:</b> {venta.vendedor}</div>
            <div><b>Fecha:</b> {new Date(venta.fecha).toLocaleString()}</div>
             {venta.cancelada && (
    <div className="text-red-400 font-bold"><b>Cancelada:</b> Sí</div>
  )}
          </div>

          <div>
            <b>Productos:</b>
            <ul className="ml-4 mt-2 space-y-3">
              {venta.lineas?.map((l) => (
                <li key={l.productoId} className="text-sm">
                  <div className="font-semibold">{l.productoNombre} × {l.cantidad}</div>
                  <div>Subtotal sin IVA: {l.subtotal?.toFixed(2)} €</div>
                  <div>IVA ({l.iva} %): {(l.subtotalConIva - l.subtotal).toFixed(2)} €</div>
                  <div>Total línea: {l.subtotalConIva?.toFixed(2)} €</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Botones fijos abajo */}
        <div className="p-5 border-t border-zinc-700 flex flex-col gap-2 items-center">
          <Boton
            onClick={() => descargarTicketPDF(venta.id)}
            className="w-full text-base py-3 rounded-xl bg-orange-500 hover:bg-orange-600"
          >
            Descargar ticket
          </Boton>
          <BotonClaro onClick={onClose} className="w-full text-base py-3 rounded-xl">
            Cerrar
          </BotonClaro>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}
