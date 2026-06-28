import type { VentaDetalle } from "../domain/venta.types";
import BaseModal from "@components/common/BaseModal";
import BotonClaro from "@buttons/BotonClaro";
import Boton from "@buttons/Boton";
import { VentaService } from "@services/venta.service";

interface Props {
  venta:   VentaDetalle;
  onClose: () => void;
  loading?: boolean;
}

export default function ModalDetalleVenta({ venta, onClose }: Props) {
  if (!venta) return null;

  return (
    <BaseModal
      title={`Detalle de Venta #${venta.id}`}
      onClose={onClose}
      className="max-h-[90vh]"
      contentClassName="overflow-y-auto p-5 sm:p-8 space-y-6"
      closeOnOverlayClick={false}
      footer={
        <>
          <Boton
            onClick={() => VentaService.descargarTicketPDF(venta.id)}
            className="w-full text-base py-3 rounded-xl bg-orange-500 hover:bg-orange-600"
          >
            Descargar ticket
          </Boton>
          <BotonClaro onClick={onClose} className="w-full text-base py-3 rounded-xl">
            Cerrar
          </BotonClaro>
        </>
      }
    >
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
    </BaseModal>
  );
}
