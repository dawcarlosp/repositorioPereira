import Boton from "../common/Boton";
import BotonClaro from "../common/BotonClaro";

export default function VentaCard({
  venta,
  onDetalle,
  onCancelar,
  onCobrarResto // <-- Añade esto como prop
}) {
  return (
    <div
      className="rounded-xl bg-white/95 shadow-lg border-2 border-orange-400 flex flex-col px-4 py-3 gap-2
        w-full min-h-[220px] max-w-[350px] transition-all duration-200 box-border"
      style={{ boxSizing: "border-box" }}
    >
      {/* Top: ID y acciones */}
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-purple-600 text-lg">Venta #{venta.id}</span>
        <div className="flex gap-2">
          <BotonClaro
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-3 py-1"
            onClick={() => onDetalle(venta)}
          >
            Detalle
          </BotonClaro>
          {!venta.cancelada && (
            <Boton
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1"
              onClick={() => onCancelar(venta.id)}
            >
              Cancelar
            </Boton>
          )}
        </div>
      </div>
      {/* Info de la venta */}
      <div className="flex flex-col gap-1 text-sm">
        <div>
          <span className="font-bold text-gray-800">Fecha: </span>
          <span className="text-gray-700">{venta.fecha ? new Date(venta.fecha).toLocaleString() : "-"}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Vendedor: </span>
          <span className="text-gray-700">{venta.vendedor}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Total: </span>
          <span className="text-gray-700">{venta.total}€</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Pagado: </span>
          <span className="text-gray-700">{venta.montoPagado}€</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Estado: </span>
          <span className={`
            font-bold px-2 py-1 rounded
            ${venta.estadoPago === "PAGADO" ? "bg-green-200 text-green-800" :
              venta.estadoPago === "PARCIAL" ? "bg-yellow-200 text-yellow-800" :
              "bg-red-100 text-red-700"}
          `}>
            {venta.estadoPago}
          </span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Cancelada: </span>
          <span className={venta.cancelada ? "text-red-600 font-bold" : "text-green-700 font-semibold"}>
            {venta.cancelada ? "Sí" : "No"}
          </span>
        </div>
        {/* Aquí va el botón Cobrar resto SOLO si corresponde */}
        {venta.saldo > 0 && !venta.cancelada && (
          <div className="mt-2">
            <BotonClaro
              className="bg-green-500 hover:bg-green-600 text-white font-bold w-full"
              onClick={() => onCobrarResto(venta)}
            >
              Cobrar resto
            </BotonClaro>
          </div>
        )}
      </div>
    </div>
  );
};
